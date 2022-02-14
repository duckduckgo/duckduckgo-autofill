const InterfacePrototype = require('./InterfacePrototype.js')
const {wkSend, wkSendAndWait} = require('../appleDeviceUtils/appleDeviceUtils')
const {
    isApp,
    notifyWebApp,
    isTopFrame,
    isDDGDomain,
    formatDuckAddress
} = require('../autofill-utils')
const {scanForInputs, forms} = require('../scanForInputs.js')

class AppleDeviceInterface extends InterfacePrototype {
    constructor () {
        super()
        if (isTopFrame) {
            this.stripCredentials = false
        } else {
            document.addEventListener('InboundCredential', this)
        }
    }

    handleEvent (event) {
        switch (event.type) {
        case 'InboundCredential':
            this.inboundCredential(event)
            break
        case 'scroll':
            this.removeTooltip()
            break
        }
    }

    inboundCredential (e) {
        const activeForm = this.currentAttached
        if ('email' in e.detail.data) {
            activeForm.autofillEmail(e.detail.data.email)
        } else {
            activeForm.autofillData(e.detail.data, e.detail.configType)
        }
    }

    async setupAutofill ({shouldLog} = {shouldLog: false}) {
        if (isDDGDomain()) {
            // Tell the web app whether we're in the app
            notifyWebApp({isApp})
        }

        if (isApp) {
            await this.getAutofillInitData()
        }

        const signedIn = await this._checkDeviceSignedIn()
        if (signedIn) {
            if (isApp) {
                await this.getAddresses()
            }
            notifyWebApp({ deviceSignedIn: {value: true, shouldLog} })
            forms.forEach(form => form.redecorateAllInputs())
        } else {
            this.trySigningIn()
        }

        const cleanup = scanForInputs(this).init()
        this.addLogoutListener(cleanup)
    }

    async getAddresses () {
        if (!isApp) return this.getAlias()

        const {addresses} = await wkSendAndWait('emailHandlerGetAddresses')
        this.storeLocalAddresses(addresses)
        return addresses
    }

    async refreshAlias () {
        await wkSendAndWait('emailHandlerRefreshAlias')
        // On macOS we also update the addresses stored locally
        if (isApp) this.getAddresses()
    }

    async _checkDeviceSignedIn () {
        const {isAppSignedIn} = await wkSendAndWait('emailHandlerCheckAppSignedInStatus')
        this.isDeviceSignedIn = () => !!isAppSignedIn
        return !!isAppSignedIn
    }

    async setSize (details) {
        await wkSend('setSize', details)
    }

    async showTopTooltip (inputType, click, inputDimensions) {
        window.addEventListener('scroll', this, {once: true})

        let diffX = Math.floor(click.x - inputDimensions.x)
        let diffY = Math.floor(click.y - inputDimensions.y)

        const details = {
            inputTop: diffY,
            inputLeft: diffX,
            inputHeight: Math.floor(inputDimensions.height),
            inputWidth: Math.floor(inputDimensions.width),
            inputType
        }

        await wkSend('showAutofillParent', details)
    }

    async removeTooltip () {
        await wkSend('closeAutofillParent', {})
    }

    storeUserData ({addUserData: {token, userName, cohort}}) {
        return wkSend('emailHandlerStoreToken', { token, username: userName, cohort })
    }

    /**
     * PM endpoints
     */

    /**
     * Sends credentials to the native layer
     * @param {{username: string, password: string}} credentials
     */
    storeCredentials (credentials) {
        return wkSend('pmHandlerStoreCredentials', credentials)
    }

    /**
     * Gets the init data from the device
     * @returns {APIResponse<PMData>}
     */
    async getAutofillInitData () {
        const response = await wkSendAndWait('pmHandlerGetAutofillInitData')
        this.storeLocalData(response.success)
        return response
    }

    /**
     * Gets credentials ready for autofill
     * @param {Number} id - the credential id
     * @returns {APIResponse<CredentialsObject>}
     */
    getAutofillCredentials (id) {
        return wkSendAndWait('pmHandlerGetAutofillCredentials', { id })
    }

    /**
     * Opens the native UI for managing passwords
     */
    openManagePasswords () {
        return wkSend('pmHandlerOpenManagePasswords')
    }

    /**
     * Opens the native UI for managing identities
     */
    openManageIdentities () {
        return wkSend('pmHandlerOpenManageIdentities')
    }

    /**
     * Opens the native UI for managing credit cards
     */
    openManageCreditCards () {
        return wkSend('pmHandlerOpenManageCreditCards')
    }

    /**
     * Gets a single identity obj once the user requests it
     * @param {Number} id
     * @returns {Promise<{success: IdentityObject | undefined}>}
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
        return wkSendAndWait('pmHandlerGetCreditCard', { id })
    }

    // Used to encode data to send back to the child autofill
    async selectedDetail (detailIn, configType) {
        if (isTopFrame) {
            let detailsEntries = Object.entries(detailIn).map(([key, value]) => {
                return [key, String(value)]
            })
            const data = Object.fromEntries(detailsEntries)
            wkSend('selectedDetail', { data, configType })
        } else {
            this.activeFormSelectedDetail(detailIn, configType)
        }
    }

    async getInputType () {
        const {inputType} = await wkSendAndWait('emailHandlerCheckAppSignedInStatus')
        return inputType
    }

    async getAlias () {
        const {alias} = await wkSendAndWait(
            'emailHandlerGetAlias',
            {
                requiresUserPermission: !isApp,
                shouldConsumeAliasIfProvided: !isApp
            }
        )
        return formatDuckAddress(alias)
    }
}

module.exports = AppleDeviceInterface
