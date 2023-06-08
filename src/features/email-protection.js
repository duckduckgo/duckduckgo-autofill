import {GetAlias} from "../deviceApiCalls/additionalDeviceApiCalls";
import {formatDuckAddress, notifyWebApp, sendAndWaitForAnswer, setValue, SIGN_IN_MSG} from "../autofill-utils";
import {createNotification, createRequest} from "../../packages/device-api";

export class EmailProtection {
    attempts = 0
    /**
     * Boolean
     * @returns {Promise<boolean>}
     */
    _isDeviceSignedIn = false;

    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    constructor(device) {
        this.device = device;
    }

    async init() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios": {
                const {isAppSignedIn} = await this.device.deviceApi.request(createRequest('emailHandlerCheckAppSignedInStatus'))
                this._isDeviceSignedIn = Boolean(isAppSignedIn);
                if (this._isDeviceSignedIn) {
                    await this.getAddresses()
                }
                break;
            }
            case "extension": {
                // Add contextual menu listeners
                let activeEl = null
                document.addEventListener('contextmenu', e => {
                    activeEl = e.target
                })

                chrome.runtime.onMessage.addListener((message, sender) => {
                    if (sender.id !== chrome.runtime.id) return

                    switch (message.type) {
                        case 'ddgUserReady':
                            this.device.resetAutofillUI(() => this.setupSettingsPage({shouldLog: true}))
                            break
                        case 'contextualAutofill':
                            setValue(activeEl, formatDuckAddress(message.alias), this.device.globalConfig)
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
        }
    }

    isDeviceSignedIn() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios": {
                return this._isDeviceSignedIn;
            }
            case "android": {
                // on DDG domains, always check via `window.EmailInterface.isSignedIn()`
                if (this.device.globalConfig.isDDGDomain) {
                    return window.EmailInterface.isSignedIn() === 'true'
                }

                // on non-DDG domains, where `availableInputTypes.email` is present, use it
                if (typeof this.device.globalConfig.availableInputTypes?.email === 'boolean') {
                    return this.device.globalConfig.availableInputTypes.email
                }

                // ...on other domains we assume true because the script wouldn't exist otherwise
                return true
            }
            case "windows":
            case "windows-overlay":
                break;
            case "extension": {
                return this.device.localData.hasLocalAddresses
            }
            default:
                assertUnreachable(this.device.ctx)
        }
    }
    /**
     * @returns {Promise<*>}
     */
    async getAlias() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios": {
                const {alias} = await this.device.deviceApi.request(new GetAlias({
                    requiresUserPermission: !this.device.globalConfig.isApp,
                    shouldConsumeAliasIfProvided: !this.device.globalConfig.isApp
                }))
                return formatDuckAddress(alias)
            }
            case "android": {
                const {alias} = await sendAndWaitForAnswer(() => {
                    return window.EmailInterface.showTooltip()
                }, 'getAliasResponse')
                return alias
            }
            case "windows":
            case "windows-overlay":
                break;
            case "extension":
                break;
            default:
                assertUnreachable(this.device.ctx)
        }
    }
    /** @param {() => void} handler */
    addLogoutListener(handler) {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios": {
                // Only deal with logging out if we're in the email web app
                if (!this.device.globalConfig.isDDGDomain) return

                window.addEventListener('message', (e) => {
                    if (this.device.globalConfig.isDDGDomain && e.data.emailProtectionSignedOut) {
                        handler()
                    }
                })
                return;
            }
            case "android": {
                // Only deal with logging out if we're in the email web app
                if (!this.device.globalConfig.isDDGDomain) return

                window.addEventListener('message', (e) => {
                    if (this.device.globalConfig.isDDGDomain && e.data.emailProtectionSignedOut) {
                        handler()
                    }
                })
                return;
            }
            case "windows":
            case "windows-overlay":
                break;
            case "extension": {
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
    }
    /** @returns {Promise<EmailAddresses | null>} */
    async getAddresses() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay": {
                const {addresses} = await this.device.deviceApi.request(createRequest('emailHandlerGetAddresses'))
                this.device.localData.storeLocalAddresses(addresses)
                return addresses
            }
            case "ios": {
                return this.getAlias();
            }
            case "android":
            case "windows":
            case "windows-overlay":
                break;
            case "extension": {
                return new Promise(resolve => chrome.runtime.sendMessage(
                    {getAddresses: true},
                    (data) => {
                        this.device.localData.storeLocalAddresses(data)
                        return resolve(data)
                    }
                ))
            }
            default:
                assertUnreachable(this.device.ctx)
        }
        return null
    }
    async setupSettingsPage({shouldLog} = {shouldLog: false}) {
        if (!this.device.globalConfig.isDDGDomain) {
            return
        }

        notifyWebApp({isApp: this.device.globalConfig.isApp})

        if (this.isDeviceSignedIn()) {
            let userData
            try {
                userData = await this.device.getUserData()
            } catch (e) {
            }

            let capabilities
            try {
                capabilities = await this.getEmailProtectionCapabilities()
            } catch (e) {
            }

            // Set up listener for web app actions
            window.addEventListener('message', (e) => {
                if (this.device.globalConfig.isDDGDomain && e.data.removeUserData) {
                    this.device.removeUserData()
                }
            })

            const hasUserData = userData && !userData.error && Object.entries(userData).length > 0
            notifyWebApp({
                deviceSignedIn: {
                    value: true,
                    shouldLog,
                    userData: hasUserData ? userData : undefined,
                    capabilities
                }
            })
        } else {
            this.trySigningIn()
        }
    }
    /** @returns {Promise<null|Record<string,boolean>>} */
    async getEmailProtectionCapabilities() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios": {
                return this.device.deviceApi.request(createRequest('emailHandlerGetCapabilities'))
            }
            case "android": {
                let deviceCapabilities = null

                try {
                    deviceCapabilities = JSON.parse(window.EmailInterface.getDeviceCapabilities())
                } catch (e) {
                    if (this.device.globalConfig.isDDGTestMode) {
                        console.error(e)
                    }
                }

                return Promise.resolve(deviceCapabilities)
            }
            case "windows":
            case "windows-overlay":
                break;
            case "extension": {
                return new Promise(resolve => chrome.runtime.sendMessage(
                    {getEmailProtectionCapabilities: true},
                    (data) => resolve(data)
                ))
            }
            default:
                assertUnreachable(this.device.ctx)
        }
        return null
    }

    async refreshAlias() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios": {
                await this.device.deviceApi.notify(createNotification('emailHandlerRefreshAlias'))
                switch (this.device.ctx) {
                    case "macos-legacy":
                    case "macos-modern":
                    case "macos-overlay": {
                        this.getAddresses().catch(console.error)
                        break;
                    }
                    case "ios":
                        break;
                }
                break;
            }
            case "android":
            case "windows":
            case "windows-overlay":
                break;
            case "extension": {
                return chrome.runtime.sendMessage(
                    {refreshAlias: true},
                    (addresses) => this.device.localData.storeLocalAddresses(addresses)
                )
            }
            default:
                assertUnreachable(this.device.ctx)
        }
    }

    async trySigningIn() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios":
            case "android":
            case "windows":
            case "windows-overlay":
                break;
            case "extension": {
                if (this.device.globalConfig.isDDGDomain) {
                    const data = await sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData')
                    this.device.storeUserData(data)
                }
                return
            }
            default:
                assertUnreachable(this.device.ctx)
        }

        if (this.device.globalConfig.isDDGDomain) {
            if (this.attempts < 10) {
                this.attempts++
                const data = await sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData')
                // This call doesn't send a response, so we can't know if it succeeded
                this.device.storeUserData(data)

                await this.device.refreshData()
                await this.device.settings.refresh()
                await this.setupSettingsPage({shouldLog: true})
                await this.device.postInit()
            } else {
                console.warn('max attempts reached, bailing')
            }
        }
    }
}

/**
 * @param {never} x
 * @returns {never}
 */
function assertUnreachable(x) {
    console.log(x)
    throw new Error("Didn't expect to get here");
}
