const InterfacePrototype = require('./InterfacePrototype.js')
const {wkSend, wkSendAndWait} = require('../appleDeviceUtils/appleDeviceUtils')
const {
    isApp,
    notifyWebApp,
    isTopFrame,
    supportsTopFrame,
    isDDGDomain,
    formatDuckAddress
} = require('../autofill-utils')
const {scanForInputs, forms} = require('../scanForInputs.js')

class AppleDeviceInterface extends InterfacePrototype {
    /* @type {Timeout | undefined} */
    pollingTimeout

    constructor () {
        super()
        if (isTopFrame) {
            this.stripCredentials = false
            window.addEventListener('mouseMove', this)
        } else {
            // This is always added as a child frame needs to be informed of a parent frame scroll
            window.addEventListener('scroll', this)
        }
    }

    postInit () {
        if (!isTopFrame) return
        this.setupTopFrame()
    }

    async setupTopFrame () {
        const inputType = await this.getCurrentInputType()
        // Provide dummy values, they're not used
        const getPosition = () => {
            return {
                x: 0,
                y: 0,
                height: 50,
                width: 50
            }
        }
        const tooltip = this.createTooltip(inputType, getPosition)
        this.setActiveTooltip(tooltip)
    }

    /**
     * Poll the native listener until the user has selected a credential.
     * Message return types are:
     * - 'stop' is returned whenever the message sent doesn't match the native last opened tooltip.
     *     - This also is triggered when the close event is called and prevents any edge case continued polling.
     * - 'ok' is when the user has selected a credential and the value can be injected into the page.
     * - 'none' is when the tooltip is open in the native window however hasn't been entered.
     * @returns {Promise<void>}
     */
    async listenForSelectedCredential () {
        // Prevent two timeouts from happening
        clearTimeout(this.pollingTimeout)

        const response = await wkSendAndWait('getSelectedCredentials')
        switch (response.type) {
        case 'none':
            // Parent hasn't got a selected credential yet
            this.pollingTimeout = setTimeout(() => {
                this.listenForSelectedCredential()
            }, 100)
            return
        case 'ok':
            return this.inboundCredential({
                detail: {
                    data: response.data,
                    configType: response.configType
                }
            })
        case 'stop':
            // Parent wants us to stop polling

            break
        }
    }

    handleEvent (event) {
        switch (event.type) {
        case 'mouseMove':
            this.processMouseMove(event)
            break
        case 'scroll':
            this.removeTooltip()
            break
        default:
            super.handleEvent(event)
        }
    }

    processMouseMove (event) {
        this.currentTooltip?.focus(event.detail.x, event.detail.y)
    }

    inboundCredential (e) {
        const activeForm = this.currentAttached
        if (activeForm === null) return
        activeForm.autofillData(e.detail.data, e.detail.configType)
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

    attachTooltipInner (form, input, inputType, getPosition, click) {
        if (!isTopFrame && supportsTopFrame) {
            // TODO currently only mouse initiated events are supported
            if (!click) {
                return
            }
            this.showTopTooltip(inputType, click, getPosition())
            return
        }

        super.attachTooltipInner(form, input, inputType, getPosition, click)
    }

    async showTopTooltip (inputType, click, inputDimensions) {
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

        // Start listening for the user intiated credential
        this.listenForSelectedCredential()
    }

    async removeTooltip () {
        if (!supportsTopFrame) return super.removeTooltip()
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

    async getCurrentInputType () {
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
