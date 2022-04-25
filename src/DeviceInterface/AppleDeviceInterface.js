import InterfacePrototype from './InterfacePrototype.js'
import {createTransport} from '../transports/transport.apple'
import {formatDuckAddress, autofillEnabled} from '../autofill-utils'
import {processConfig} from '@duckduckgo/content-scope-scripts/src/apple-utils'
import {fromPlatformConfig} from '../settings/settings'
import {CSS_STYLES} from '../UI/styles/styles'

class AppleDeviceInterface extends InterfacePrototype {
    /* @type {Timeout | undefined} */
    pollingTimeout

    /** @type {Transport} */
    transport = createTransport(this.globalConfig)

    /** @override */
    initialSetupDelayMs = 300

    async isEnabled () {
        return autofillEnabled(this.globalConfig, processConfig)
    }

    async setupAutofill () {
        if (this.globalConfig.isApp) {
            await this.getAutofillInitData()
        }

        const signedIn = await this._checkDeviceSignedIn()

        if (signedIn) {
            if (this.globalConfig.isApp) {
                await this.getAddresses()
            }
            this.scanner.forms.forEach(form => form.redecorateAllInputs())
        }

        const cleanup = this.scanner.init()
        this.addLogoutListener(cleanup)
    }

    getUserData () {
        return this.transport.send('emailHandlerGetUserData')
    }

    async getAddresses () {
        if (!this.globalConfig.isApp) return this.getAlias()

        const {addresses} = await this.transport.send('emailHandlerGetAddresses')
        this.storeLocalAddresses(addresses)
        return addresses
    }

    async refreshAlias () {
        await this.transport.send('emailHandlerRefreshAlias')
        // On macOS we also update the addresses stored locally
        if (this.globalConfig.isApp) this.getAddresses()
    }

    async _checkDeviceSignedIn () {
        const {isAppSignedIn} = await this.transport.send('emailHandlerCheckAppSignedInStatus')
        this.isDeviceSignedIn = () => !!isAppSignedIn
        return !!isAppSignedIn
    }

    storeUserData ({addUserData: {token, userName, cohort}}) {
        return this.transport.send('emailHandlerStoreToken', {token, username: userName, cohort})
    }

    /**
     * PM endpoints
     */

    /**
     * Sends credentials to the native layer
     * @param {{username: string, password: string}} credentials
     * @deprecated
     */
    storeCredentials (credentials) {
        return this.transport.send('pmHandlerStoreCredentials', credentials)
    }

    /**
     * Gets the init data from the tooltipHandler
     * @returns {APIResponse<PMData>}
     */
    async getAutofillInitData () {
        const response = await this.transport.send('pmHandlerGetAutofillInitData')
        this.storeLocalData(response.success)
        return response
    }

    /**
     * Gets credentials ready for autofill
     * @param {Number} id - the credential id
     * @returns {APIResponse<CredentialsObject>}
     */
    getAutofillCredentials (id) {
        return this.transport.send('pmHandlerGetAutofillCredentials', {id})
    }

    /**
     * Opens the native UI for managing passwords
     */
    openManagePasswords () {
        return this.transport.send('pmHandlerOpenManagePasswords')
    }

    /**
     * Opens the native UI for managing identities
     */
    openManageIdentities () {
        return this.transport.send('pmHandlerOpenManageIdentities')
    }

    /**
     * Opens the native UI for managing credit cards
     */
    openManageCreditCards () {
        return this.transport.send('pmHandlerOpenManageCreditCards')
    }

    /**
     * Gets a single identity obj once the user requests it
     * @param {Number} id
     * @returns {Promise<{success: IdentityObject|undefined}>}
     */
    getAutofillIdentity (id) {
        const identity = this.getLocalIdentities().find(({id: identityId}) => `${identityId}` === `${id}`)
        return Promise.resolve({success: identity})
    }

    /**
     * Gets a single complete credit card obj once the user requests it
     * @param {Number} id
     * @returns {APIResponse<CreditCardObject>}
     */
    getAutofillCreditCard (id) {
        return this.transport.send('pmHandlerGetCreditCard', {id})
    }

    // Used to encode data to send back to the child autofill
    async selectedDetail (detailIn, configType) {
        this.activeFormSelectedDetail(detailIn, configType)
    }

    async getCurrentInputType () {
        const {inputType} = this.getTopContextData() || {}
        return inputType
    }

    async getAlias () {
        const {alias} = await this.transport.send(
            'emailHandlerGetAlias',
            {
                requiresUserPermission: !this.globalConfig.isApp,
                shouldConsumeAliasIfProvided: !this.globalConfig.isApp
            }
        )
        return formatDuckAddress(alias)
    }

    tooltipStyles () {
        return `<style>${CSS_STYLES}</style>`
    }
}

export { AppleDeviceInterface }
