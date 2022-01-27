const InterfacePrototype = require('./InterfacePrototype.js')
const {wkSend, wkSendAndWait} = require('../appleDeviceUtils/appleDeviceUtils')
const {
    isApp, notifyWebApp,
    isTopFrame,
    isDDGDomain,
    formatDuckAddress
} = require('../autofill-utils')
const EmailAutofill = require('../UI/EmailAutofill')
const DataAutofill = require('../UI/DataAutofill')
const {scanForInputs, forms} = require('../scanForInputs.js')
const getInputConfig = require('../Form/inputTypeConfig')
let currentAttached = {}

document.addEventListener('InboundCredential', function (e) {
    if ('email' in e.detail.data) {
        currentAttached.form.autofillEmail(e.detail.data.email)
    } else {
        currentAttached.form.autofillData(e.detail.data, e.detail.configType)
    }
})

class AppleDeviceInterface extends InterfacePrototype {
    constructor () {
        super()
        if (isTopFrame) {
            this.stripCredentials = false
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
            if (isApp && !isTopFrame) {
                await this.getAddresses()
            }
            notifyWebApp({ deviceSignedIn: {value: true, shouldLog} })
            forms.forEach(form => form.redecorateAllInputs())
        } else {
            this.trySigningIn()
        }

        scanForInputs(this)
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

    getActiveForm () {
        if (currentAttached.form) return currentAttached.form
        return [...forms.values()].find((form) => form.tooltip)
    }

    setActiveForm (input, form) {
        currentAttached.form = form
        currentAttached.input = input
        form.activeInput = input
        const inputType = getInputConfig(input).type
        form.tooltip = inputType === 'emailNew'
            ? new EmailAutofill(input, form, this)
            : new DataAutofill(input, form, this)
        form.intObs.observe(input)
        window.addEventListener('pointerdown', form.removeTooltip, {capture: true})
        window.addEventListener('input', form.removeTooltip, {once: true})
    }

    async setSize (details) {
        await wkSend('setSize', details)
    }

    async showTooltip (form, input, inputType, e) {
        if (e.type !== 'pointerdown') {
            return
        }
        const inputClientDimensions = input.getBoundingClientRect()
        console.log(e, input, inputClientDimensions)
        // TODO check screenX/Y is correct over clientX, layerX, etc
        let diffX = Math.floor(e.clientX - inputClientDimensions.x)
        let diffY = Math.floor(e.clientY - inputClientDimensions.y)
        // const inputLeft = Math.floor(inputClientDimensions.x)
        // const inputTop = Math.floor(inputClientDimensions.y)

        // TODO top and left need to be the offset from the current click to the top/left of the input field
        const details = {
            inputTop: diffY,
            inputLeft: diffX,
            height: inputClientDimensions.height,
            width: inputClientDimensions.width,
            inputHeight: Math.floor(inputClientDimensions.height),
            inputWidth: Math.floor(inputClientDimensions.width),
            // inputTop: inputTop,
            // inputLeft: inputLeft,
            inputType: inputType
        }
        currentAttached = {form, input}

        console.log('show autofill parent', details)
        await wkSend('showAutofillParent', details)
    }

    async closeTooltip () {
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
        let detailsEntries = Object.entries(detailIn).map(([key, value]) => {
            return [key, String(value)]
        })
        const data = Object.fromEntries(detailsEntries)
        wkSend('selectedDetail', { data, configType })
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
