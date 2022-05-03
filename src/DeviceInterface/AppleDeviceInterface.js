import InterfacePrototype from './InterfacePrototype.js'
import {formatDuckAddress} from '../autofill-utils'
// import {fromPlatformConfig} from '../settings/settings'
import {CSS_STYLES} from '../UI/styles/styles'
import {createLegacyTransport} from '../transports/apple.transport'

class AppleDeviceInterface extends InterfacePrototype {
    /**
     * @deprecated use the runtime only.
     * @type {LegacyTransport}
     */
    legacyTransport = createLegacyTransport(this.globalConfig)

    /** @override */
    initialSetupDelayMs = 300

    async setupAutofill () {
        if (this.globalConfig.isApp) {
            const response = await this.runtime.getAutofillInitData()
            this.storeLocalData(response)
        }

        const signedIn = this.availableInputTypes.email

        if (signedIn) {
            if (this.globalConfig.isApp) {
                await this.getAddresses()
            }
            this.scanner.forms.forEach(form => form.redecorateAllInputs())
        }

        const cleanup = this.scanner.init()
        this.addLogoutListener(cleanup)
    }

    isDeviceSignedIn () {
        return Boolean(this.availableInputTypes.email)
    }

    getUserData () {
        return this.legacyTransport.send('emailHandlerGetUserData')
    }

    async getAddresses () {
        if (!this.globalConfig.isApp) return this.getAlias()

        const {addresses} = await this.legacyTransport.send('emailHandlerGetAddresses')
        this.storeLocalAddresses(addresses)
        return addresses
    }

    async refreshAlias () {
        await this.legacyTransport.send('emailHandlerRefreshAlias')
        // On macOS we also update the addresses stored locally
        if (this.globalConfig.isApp) this.getAddresses()
    }

    storeUserData ({addUserData: {token, userName, cohort}}) {
        return this.legacyTransport.send('emailHandlerStoreToken', {token, username: userName, cohort})
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
        return this.legacyTransport.send('pmHandlerStoreCredentials', credentials)
    }

    /**
     * Gets credentials ready for autofill
     * @param {Number} id - the credential id
     * @returns {APIResponse<CredentialsObject>}
     */
    getAutofillCredentials (id) {
        return this.legacyTransport.send('pmHandlerGetAutofillCredentials', {id})
    }

    /**
     * Opens the native UI for managing passwords
     */
    openManagePasswords () {
        return this.legacyTransport.send('pmHandlerOpenManagePasswords')
    }

    /**
     * Opens the native UI for managing identities
     */
    openManageIdentities () {
        return this.legacyTransport.send('pmHandlerOpenManageIdentities')
    }

    /**
     * Opens the native UI for managing credit cards
     */
    openManageCreditCards () {
        return this.legacyTransport.send('pmHandlerOpenManageCreditCards')
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
        return this.legacyTransport.send('pmHandlerGetCreditCard', {id})
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
        const {alias} = await this.legacyTransport.send(
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
