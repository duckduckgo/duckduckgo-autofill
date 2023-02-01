import InterfacePrototype from './InterfacePrototype.js'

import {
    SIGN_IN_MSG,
    sendAndWaitForAnswer,
    setValue,
    formatDuckAddress,
    isAutofillEnabledFromProcessedConfig,
    notifyWebApp
} from '../autofill-utils.js'
import {HTMLTooltipUIController} from '../UI/controllers/HTMLTooltipUIController.js'
import {defaultOptions} from '../UI/HTMLTooltip.js'
import { SetIncontextSignupDismissedAtCall } from '../deviceApiCalls/__generated__/deviceApiCalls.js'

const TOOLTIP_TYPES = {
    EmailProtection: 'EmailProtection',
    EmailSignup: 'EmailSignup'
}

class ExtensionInterface extends InterfacePrototype {
    /**
     * @override
     */
    createUIController () {
        /** @type {import('../UI/HTMLTooltip.js').HTMLTooltipOptions} */
        const htmlTooltipOptions = {
            ...defaultOptions,
            css: `<link rel="stylesheet" href="${chrome.runtime.getURL('public/css/autofill.css')}" crossOrigin="anonymous">`,
            testMode: this.isTestMode()
        }
        const tooltipKinds = {
            [TOOLTIP_TYPES.EmailProtection]: 'legacy',
            [TOOLTIP_TYPES.EmailSignup]: 'emailsignup'
        }
        const tooltipKind = tooltipKinds[this.getShowingTooltip()] || tooltipKinds[TOOLTIP_TYPES.EmailProtection]

        return new HTMLTooltipUIController({ tooltipKind, device: this }, htmlTooltipOptions)
    }

    getShowingTooltip () {
        if (this.hasLocalAddresses) {
            return TOOLTIP_TYPES.EmailProtection
        }

        if (this.settings.featureToggles.emailProtection_incontext_signup && this.settings.incontextSignupDismissed === false) {
            return TOOLTIP_TYPES.EmailSignup
        }

        return null
    }

    onIncontextSignupDismissed () {
        // Check if the email signup tooltip has previously been dismissed.
        // If it has, make the dismissal persist and remove it from the page.
        // If it hasn't, set a flag for next time and just hide the tooltip.
        if (this.emailSignupInitialDismissal) {
            this.settings.setIncontextSignupDismissed(true)
            this.deviceApi.notify(new SetIncontextSignupDismissedAtCall({ value: new Date().getTime() }))
            this.removeAutofillUIFromPage()
        } else {
            this.emailSignupInitialDismissal = true
            this.removeTooltip()
        }
    }

    async resetAutofillUI (callback) {
        this.removeAutofillUIFromPage()

        // Start the setup process again
        await this.refreshSettings()
        await this.setupAutofill()

        if (callback) await callback()

        this.uiController = this.createUIController()
        await this.postInit()
    }

    removeAutofillUIFromPage () {
        this.uiController?.destroy()
        this._scannerCleanup?.()
    }

    async isEnabled () {
        return new Promise(resolve => {
            chrome.runtime.sendMessage(
                {
                    registeredTempAutofillContentScript: true,
                    documentUrl: window.location.href
                },
                (response) => {
                    if (response && 'site' in response) {
                        resolve(isAutofillEnabledFromProcessedConfig(response))
                    }
                }
            )
        })
    }

    isDeviceSignedIn () {
        return this.hasLocalAddresses
    }

    setupAutofill () {
        return this.getAddresses()
    }

    postInit () {
        switch (this.getShowingTooltip()) {
        case TOOLTIP_TYPES.EmailProtection: {
            this._scannerCleanup = this.scanner.init()
            this.addLogoutListener(() => {
                this.resetAutofillUI()
                if (this.globalConfig.isDDGDomain) {
                    notifyWebApp({ deviceSignedIn: {value: false} })
                }
            })

            if (this.activeForm?.activeInput) {
                this.attachTooltip(this.activeForm, this.activeForm?.activeInput, null, 'postSignup')
            }

            break
        }
        case TOOLTIP_TYPES.EmailSignup: {
            this._scannerCleanup = this.scanner.init()
            break
        }
        default: {
            // Don't do anyhing if we don't have a tooltip to show
            break
        }
        }
    }

    getAddresses () {
        return new Promise(resolve => chrome.runtime.sendMessage(
            {getAddresses: true},
            (data) => {
                this.storeLocalAddresses(data)
                return resolve(data)
            }
        ))
    }

    /**
     * Used by the email web app
     * Settings page displays data of the logged in user data
     */
    getUserData () {
        return new Promise(resolve => chrome.runtime.sendMessage(
            {getUserData: true},
            (data) => resolve(data)
        ))
    }

    /**
     * Used by the email web app
     * Device capabilities determine which functionality is available to the user
     */
    getEmailProtectionCapabilities () {
        return new Promise(resolve => chrome.runtime.sendMessage(
            {getEmailProtectionCapabilities: true},
            (data) => resolve(data)
        ))
    }

    refreshAlias () {
        return chrome.runtime.sendMessage(
            {refreshAlias: true},
            (addresses) => this.storeLocalAddresses(addresses)
        )
    }

    async trySigningIn () {
        if (this.globalConfig.isDDGDomain) {
            const data = await sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData')
            this.storeUserData(data)
        }
    }

    /**
     * @param {object} message
     * @param {object} message.addUserData
     * @param {string} message.addUserData.token
     * @param {string} message.addUserData.userName
     * @param {string} message.addUserData.cohort
     */
    storeUserData (message) {
        return chrome.runtime.sendMessage(message)
    }

    /**
     * Used by the email web app
     * Provides functionality to log the user out
     */
    removeUserData () {
        return chrome.runtime.sendMessage({removeUserData: true})
    }

    addDeviceListeners () {
        // Add contextual menu listeners
        let activeEl = null
        document.addEventListener('contextmenu', e => {
            activeEl = e.target
        })

        chrome.runtime.onMessage.addListener((message, sender) => {
            if (sender.id !== chrome.runtime.id) return

            switch (message.type) {
            case 'ddgUserReady':
                this.resetAutofillUI(() => this.setupSettingsPage({shouldLog: true}))
                break
            case 'contextualAutofill':
                setValue(activeEl, formatDuckAddress(message.alias), this.globalConfig)
                activeEl.classList.add('ddg-autofilled')
                this.refreshAlias()

                // If the user changes the alias, remove the decoration
                activeEl.addEventListener(
                    'input',
                    (e) => e.target.classList.remove('ddg-autofilled'),
                    {once: true}
                )
                break
            default:
                break
            }
        })
    }

    addLogoutListener (handler) {
        if (this._logoutListenerHandler) {
            chrome.runtime.onMessage.removeListener(this._logoutListenerHandler)
        }

        // Cleanup on logout events
        this._logoutListenerHandler = (message, sender) => {
            if (sender.id === chrome.runtime.id && message.type === 'logout') {
                handler()
            }
        }
        chrome.runtime.onMessage.addListener(this._logoutListenerHandler)
    }
}

export { ExtensionInterface }
