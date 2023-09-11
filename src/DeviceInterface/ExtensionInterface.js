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
import {InContextSignup} from '../InContextSignup.js'
import { getInputSubtype } from '../Form/matching.js'

const TOOLTIP_TYPES = {
    EmailProtection: 'EmailProtection',
    EmailSignup: 'EmailSignup'
}

class ExtensionInterface extends InterfacePrototype {
    /**
     * Adding this here since only the extension currently supports this
     */
    inContextSignup = new InContextSignup(this)

    /**
     * @override
     */
    createUIController () {
        /** @type {import('../UI/HTMLTooltip.js').HTMLTooltipOptions} */
        const htmlTooltipOptions = {
            ...defaultOptions,
            css: `<link rel="stylesheet" href="${chrome.runtime.getURL('public/css/autofill.css')}" crossOrigin="anonymous">`,
            testMode: this.isTestMode(),
            hasCaret: true
        }
        const tooltipKinds = {
            [TOOLTIP_TYPES.EmailProtection]: 'legacy',
            [TOOLTIP_TYPES.EmailSignup]: 'emailsignup'
        }
        const tooltipKind = tooltipKinds[this.getActiveTooltipType()] || tooltipKinds[TOOLTIP_TYPES.EmailProtection]

        return new HTMLTooltipUIController({ tooltipKind, device: this }, htmlTooltipOptions)
    }

    getActiveTooltipType () {
        if (this.hasLocalAddresses) {
            return TOOLTIP_TYPES.EmailProtection
        }

        const inputType = this.activeForm?.activeInput ? getInputSubtype(this.activeForm.activeInput) : undefined
        if (this.inContextSignup?.isAvailable(inputType)) {
            return TOOLTIP_TYPES.EmailSignup
        }

        return null
    }

    async resetAutofillUI (callback) {
        this.removeAutofillUIFromPage('Resetting autofill.')

        await this.setupAutofill()

        if (callback) await callback()

        this.uiController = this.createUIController()
        await this.postInit()
    }

    async isEnabled () {
        return new Promise(resolve => {
            chrome?.runtime?.sendMessage(
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

    async setupAutofill () {
        /**
         * In the extension, we must resolve `inContextSignup` data as part of setup
         */
        await this.inContextSignup.init()

        return this.getAddresses()
    }

    postInit () {
        switch (this.getActiveTooltipType()) {
        case TOOLTIP_TYPES.EmailProtection: {
            this._scannerCleanup = this.scanner.init()
            this.addLogoutListener(() => {
                this.resetAutofillUI()
                if (this.globalConfig.isDDGDomain) {
                    notifyWebApp({ deviceSignedIn: {value: false} })
                }
            })

            if (this.activeForm?.activeInput) {
                this.attachTooltip({
                    form: this.activeForm,
                    input: this.activeForm?.activeInput,
                    click: null,
                    trigger: 'postSignup',
                    triggerMetaData: {
                        type: 'transactional'
                    }
                })
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
        // Make sure there's only one log out listener attached by removing the
        // previous logout listener first, if it exists.
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
