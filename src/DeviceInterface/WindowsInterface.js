import InterfacePrototype from './InterfacePrototype.js'
import {OverlayUIController} from '../UI/controllers/OverlayUIController.js'
import {CloseAutofillParentCall, GetAutofillDataCall, StoreUserDataCall, RemoveUserDataCall, GetUserDataCall, GetEmailProtectionCapabilitiesCall} from '../deviceApiCalls/__generated__/deviceApiCalls.js'

/**
 * @typedef {import('../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest} GetAutofillDataRequest
 */

const EMAIL_PROTECTION_LOGOUT_MESSAGE = 'EMAIL_PROTECTION_LOGOUT_MESSAGE'

export class WindowsInterface extends InterfacePrototype {
    ready = false;
    /** @type {AbortController|null} */
    _abortController = null;
    /**
     * @deprecated This runs too early, and will be removed eventually.
     * @returns {Promise<boolean>}
     */
    async isEnabled () {
        return true
    }


////////////////////////////
    loggedIn = false;

    // DONE!
    getEmailProtectionCapabilities() {
        return this.deviceApi.request(new GetEmailProtectionCapabilitiesCall({}))
    }

    // line 165 apple interface
    // line 29 android interface
    // deprecated?
    isDeviceSignedIn() {
        console.log('isDeviceSignedIn')
        return this.loggedIn
    }

        async setupAutofill () {
            // TODO we need some way to trigger an init on the windows side... so it can check the vault for auth and send out events
            const signedIn = await this._checkDeviceSignedIn()
        // if (signedIn) {
        //     if (this.globalConfig.isApp) {
        //         await this.getAddresses()
        //     }
        // }
    }

    async _checkDeviceSignedIn () {
        let result

        try {
            result = await this.getUserData()
        } catch (e)
        {
            console.warn('e', e)
        }

        this.isDeviceSignedIn = () => !!result?.userName
        return this.isDeviceSignedIn()
    }

    // DONE? need to test
    addLogoutListener (handler) {
        // Only deal with logging out if we're in the email web app
        if (!this.globalConfig.isDDGDomain) return

        windowsInteropAddEventListener('message', (e) => {
            if (this.globalConfig.isDDGDomain && e.data === EMAIL_PROTECTION_LOGOUT_MESSAGE) {
                handler()
            }
        })
    }

    // DONE!
    storeUserData ({addUserData}) {
        /* the extension does:
export const isValidUsername = (userName) => /^[a-z0-9_]+$/.test(userName)
export const isValidToken = (token) => /^[a-z0-9]+$/.test(token)
*/
        return this.deviceApi.request(new StoreUserDataCall(addUserData))
    }
    removeUserData () {
        return this.deviceApi.request(new RemoveUserDataCall({}))
    }
    getUserData() {
        return this.deviceApi.request(new GetUserDataCall({}))
    }
//////////////////////

    isEnabledViaSettings () {
        return Boolean(this.settings.enabled)
    }

    postInit () {
        const cleanup = this.scanner.init()
        this.addLogoutListener(cleanup)
        this.ready = true
    }

    createUIController () {
        /**
         * If we get here, we're just a controller for an overlay
         */
        return new OverlayUIController({
            remove: async () => this._closeAutofillParent(),
            show: async (details) => this._show(details)
        })
    }

    /**
     * @param {GetAutofillDataRequest} details
     */
    async _show (details) {
        const { mainType } = details
        // prevent overlapping listeners
        if (this._abortController && !this._abortController.signal.aborted) {
            this._abortController.abort()
        }
        this._abortController = new AbortController()
        this.deviceApi.request(new GetAutofillDataCall(details), { signal: this._abortController.signal })
            .then(resp => {
                if (!this.activeForm) {
                    throw new Error('this.currentAttached was absent')
                }
                switch (resp.action) {
                case 'fill': {
                    if (mainType in resp) {
                        this.activeForm?.autofillData(resp[mainType], mainType)
                    } else {
                        throw new Error(`action: "fill" cannot occur because "${mainType}" was missing`)
                    }
                    break
                }
                case 'focus': {
                    this.activeForm?.activeInput?.focus()
                    break
                }
                case 'none': {
                    // do nothing
                    break
                }
                default: {
                    if (this.globalConfig.isDDGTestMode) {
                        console.warn('unhandled response', resp)
                    }
                }
                }
                return this._closeAutofillParent()
            })
            .catch(e => {
                if (this.globalConfig.isDDGTestMode) {
                    if (e.name === 'AbortError') {
                        console.log('Promise Aborted')
                    } else {
                        console.error('Promise Rejected', e)
                    }
                }
            })
    }

    /**
     * @returns {Promise<any>}
     */
    async _closeAutofillParent () {
        return this.deviceApi.notify(new CloseAutofillParentCall(null))
    }
}
