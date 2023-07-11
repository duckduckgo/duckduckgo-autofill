import InterfacePrototype from './InterfacePrototype.js'
import { formatDuckAddress, autofillEnabled } from '../autofill-utils.js'
import { processConfig } from '@duckduckgo/content-scope-scripts/src/apple-utils'
import { defaultOptions } from '../UI/HTMLTooltip.js'
import { HTMLTooltipUIController } from '../UI/controllers/HTMLTooltipUIController.js'
import { OverlayUIController } from '../UI/controllers/OverlayUIController.js'
import { createNotification, createRequest } from '../../packages/device-api/index.js'
import { GetAlias } from '../deviceApiCalls/additionalDeviceApiCalls.js'
import { NativeUIController } from '../UI/controllers/NativeUIController.js'
import { CheckCredentialsProviderStatusCall, CloseEmailProtectionTabCall } from '../deviceApiCalls/__generated__/deviceApiCalls.js'
import { getInputType } from '../Form/matching.js'
import { InContextSignup } from '../InContextSignup.js'

/**
 * @typedef {import('../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest} GetAutofillDataRequest
 */

class AppleDeviceInterface extends InterfacePrototype {
    inContextSignup = new InContextSignup(this)

    /** @override */
    initialSetupDelayMs = 300

    async isEnabled () {
        return autofillEnabled(this.globalConfig, processConfig)
    }

    /**
     * The default functionality of this class is to operate as an 'overlay controller' -
     * which means it's purpose is to message the native layer about when to open/close the overlay.
     *
     * There is an additional use-case though, when running on older macOS versions, we just display the
     * HTMLTooltip in-page (like the extension does). This is why the `!this.globalConfig.supportsTopFrame`
     * check exists below - if we know we don't support the overlay, we fall back to in-page.
     *
     * @override
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createUIController () {
        if (this.globalConfig.userPreferences?.platform?.name === 'ios') {
            return new NativeUIController()
        }

        if (!this.globalConfig.supportsTopFrame) {
            const options = {
                ...defaultOptions,
                testMode: this.isTestMode()
            }
            return new HTMLTooltipUIController({
                device: this,
                tooltipKind: 'modern'
            }, options)
        }

        /**
         * If we get here, we're just a controller for an overlay
         */
        return new OverlayUIController({
            remove: async () => this._closeAutofillParent(),
            show: async (details) => this._show(details)
        })
    }

    /**
     * For now, this could be running
     *  1) on iOS
     *  2) on macOS + Overlay
     *  3) on macOS + in-page HTMLTooltip
     *
     * @override
     * @returns {Promise<void>}
     */
    async setupAutofill () {
        if (!this.globalConfig.supportsTopFrame) {
            await this._getAutofillInitData()
        }

        await this.inContextSignup.init()

        const signedIn = await this._checkDeviceSignedIn()
        if (signedIn) {
            if (this.globalConfig.isApp) {
                await this.getAddresses()
            }
        }
    }

    /**
     * Used by the email web app
     * Settings page displays data of the logged in user data
     */
    getUserData () {
        return this.deviceApi.request(createRequest('emailHandlerGetUserData'))
    }

    /**
     * Used by the email web app
     * Device capabilities determine which functionality is available to the user
     */
    getEmailProtectionCapabilities () {
        return this.deviceApi.request(createRequest('emailHandlerGetCapabilities'))
    }

    /**
     */
    async getSelectedCredentials () {
        return this.deviceApi.request(createRequest('getSelectedCredentials'))
    }

    /**
     * The data format provided here for `parentArgs` matches Window now.
     * @param {GetAutofillDataRequest} parentArgs
     */
    async _showAutofillParent (parentArgs) {
        const applePayload = {
            ...parentArgs.triggerContext,
            serializedInputContext: parentArgs.serializedInputContext
        }
        return this.deviceApi.notify(createNotification('showAutofillParent', applePayload))
    }

    /**
     * @returns {Promise<any>}
     */
    async _closeAutofillParent () {
        return this.deviceApi.notify(createNotification('closeAutofillParent', {}))
    }

    /**
     * @param {GetAutofillDataRequest} details
     */
    async _show (details) {
        await this._showAutofillParent(details)
        this._listenForSelectedCredential(async (response) => {
            if (!response) return

            if ('configType' in response) {
                this.selectedDetail(response.data, response.configType)
            } else if ('stop' in response) {
                // Let input handlers know we've stopped autofilling
                this.activeForm?.activeInput?.dispatchEvent(new Event('mouseleave'))
            } else if ('stateChange' in response) {
                await this.updateForStateChange()
            }
        })
    }

    async refreshData () {
        await super.refreshData()
        await this._checkDeviceSignedIn()
    }

    async getAddresses () {
        if (!this.globalConfig.isApp) return this.getAlias()

        const {addresses} = await this.deviceApi.request(createRequest('emailHandlerGetAddresses'))
        this.storeLocalAddresses(addresses)
        return addresses
    }

    async refreshAlias () {
        await this.deviceApi.notify(createNotification('emailHandlerRefreshAlias'))
        // On macOS we also update the addresses stored locally
        if (this.globalConfig.isApp) this.getAddresses()
    }

    async _checkDeviceSignedIn () {
        const {isAppSignedIn} = await this.deviceApi.request(createRequest('emailHandlerCheckAppSignedInStatus'))
        this.isDeviceSignedIn = () => !!isAppSignedIn
        return !!isAppSignedIn
    }

    storeUserData ({addUserData: {token, userName, cohort}}) {
        return this.deviceApi.notify(createNotification('emailHandlerStoreToken', { token, username: userName, cohort }))
    }

    /**
     * Used by the email web app
     * Provides functionality to log the user out
     */
    removeUserData () {
        this.deviceApi.notify(createNotification('emailHandlerRemoveToken'))
    }

    /**
     * Used by the email web app
     * Provides functionality to close the window after in-context sign-up or sign-in
     */
    closeEmailProtection () {
        this.deviceApi.request(new CloseEmailProtectionTabCall(null))
    }

    /**
     * PM endpoints
     */

    /**
     * Gets the init data from the device
     * @returns {APIResponse<PMData>}
     */
    async _getAutofillInitData () {
        const response = await this.deviceApi.request(createRequest('pmHandlerGetAutofillInitData'))
        this.storeLocalData(response.success)
        return response
    }

    /**
     * Gets credentials ready for autofill
     * @param {CredentialsObject['id']} id - the credential id
     * @returns {APIResponseSingle<CredentialsObject>}
     */
    getAutofillCredentials (id) {
        return this.deviceApi.request(createRequest('pmHandlerGetAutofillCredentials', { id }))
    }

    /**
     * Opens the native UI for managing passwords
     */
    openManagePasswords () {
        return this.deviceApi.notify(createNotification('pmHandlerOpenManagePasswords'))
    }

    /**
     * Opens the native UI for managing identities
     */
    openManageIdentities () {
        return this.deviceApi.notify(createNotification('pmHandlerOpenManageIdentities'))
    }

    /**
     * Opens the native UI for managing credit cards
     */
    openManageCreditCards () {
        return this.deviceApi.notify(createNotification('pmHandlerOpenManageCreditCards'))
    }

    /**
     * Gets a single identity obj once the user requests it
     * @param {IdentityObject['id']} id
     * @returns {Promise<{success: IdentityObject|undefined}>}
     */
    getAutofillIdentity (id) {
        const identity = this.getLocalIdentities().find(({id: identityId}) => `${identityId}` === `${id}`)
        return Promise.resolve({success: identity})
    }

    /**
     * Gets a single complete credit card obj once the user requests it
     * @param {CreditCardObject['id']} id
     * @returns {APIResponse<CreditCardObject>}
     */
    getAutofillCreditCard (id) {
        return this.deviceApi.request(createRequest('pmHandlerGetCreditCard', { id }))
    }

    getCurrentInputType () {
        const topContextData = this.getTopContextData()
        return topContextData?.inputType
            ? topContextData.inputType
            : getInputType(this.activeForm?.activeInput)
    }

    /**
     * @returns {Promise<string>}
     */
    async getAlias () {
        const {alias} = await this.deviceApi.request(new GetAlias({
            requiresUserPermission: !this.globalConfig.isApp,
            shouldConsumeAliasIfProvided: !this.globalConfig.isApp,
            isIncontextSignupAvailable: this.inContextSignup.isAvailable()
        }))
        return formatDuckAddress(alias)
    }

    addLogoutListener (handler) {
        // Only deal with logging out if we're in the email web app
        if (!this.globalConfig.isDDGDomain) return

        window.addEventListener('message', (e) => {
            if (this.globalConfig.isDDGDomain && e.data.emailProtectionSignedOut) {
                handler()
            }
        })
    }

    async addDeviceListeners () {
        if (this.settings.featureToggles.third_party_credentials_provider) {
            if (this.globalConfig.hasModernWebkitAPI) {
                Object.defineProperty(window, 'providerStatusUpdated', {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: (data) => {
                        this.providerStatusUpdated(data)
                    }
                })
            } else {
                // On Catalina we poll the native layer
                setTimeout(() => this._pollForUpdatesToCredentialsProvider(), 2000)
            }
        }
    }

    // Only used on Catalina
    async _pollForUpdatesToCredentialsProvider () {
        try {
            const response = await this.deviceApi.request(new CheckCredentialsProviderStatusCall(null))
            if (response.availableInputTypes.credentialsProviderStatus !== this.settings.availableInputTypes.credentialsProviderStatus) {
                this.providerStatusUpdated(response)
            }
            setTimeout(() => this._pollForUpdatesToCredentialsProvider(), 2000)
        } catch (e) {
            if (this.globalConfig.isDDGTestMode) {
                console.log('isDDGTestMode: _pollForUpdatesToCredentialsProvider: ❌', e)
            }
        }
    }

    /** @type {any} */
    pollingTimeout = null;
    /**
     * Poll the native listener until the user has selected a credential.
     * Message return types are:
     * - 'stop' is returned whenever the message sent doesn't match the native last opened tooltip.
     *     - This also is triggered when the close event is called and prevents any edge case continued polling.
     * - 'ok' is when the user has selected a credential and the value can be injected into the page.
     * - 'none' is when the tooltip is open in the native window however hasn't been entered.
     * @param {(response: {data:IdentityObject|CreditCardObject|CredentialsObject, configType: string} | {stateChange: boolean} | {stop: boolean} | null) => void} callback
     */
    async _listenForSelectedCredential (callback) {
        // Prevent two timeouts from happening
        const poll = async () => {
            clearTimeout(this.pollingTimeout)
            const response = await this.getSelectedCredentials()
            switch (response.type) {
            case 'none':
                // Parent hasn't got a selected credential yet
                this.pollingTimeout = setTimeout(() => poll(), 100)
                return
            case 'ok': {
                await callback({data: response.data, configType: response.configType})
                return
            }
            case 'state': {
                // Inform that state has changed, but continue polling
                // e.g. in-context signup has been dismissed
                await callback({stateChange: true})
                this.pollingTimeout = setTimeout(() => poll(), 100)
                return
            }
            case 'stop':
                // Parent wants us to stop polling
                await callback({stop: true})
            }
        }
        poll()
    }
}

export {AppleDeviceInterface}
