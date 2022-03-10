const InterfacePrototype = require('./InterfacePrototype.js')
const {wkSend, wkSendAndWait} = require('../appleDeviceUtils/appleDeviceUtils')
const {
    isApp,
    isTopFrame,
    supportsTopFrame,
    formatDuckAddress,
    autofillEnabled
} = require('../autofill-utils')
const {scanForInputs, forms} = require('../scanForInputs.js')
const {processConfig} = require('@duckduckgo/content-scope-scripts/src/apple-utils')

/**
 * @implements {FeatureToggles}
 */
class AppleDeviceInterface extends InterfacePrototype {
    /** @type {FeatureToggleNames[]} */
    #supportedFeatures = ['password.generation'];

    /* @type {Timeout | undefined} */
    pollingTimeout

    async isEnabled () {
        return autofillEnabled(processConfig)
    }

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
        const topContextData = this.getTopContextData()
        if (!topContextData) throw new Error('unreachable, topContextData should be available')
        // Provide dummy values, they're not used
        const getPosition = () => {
            return {
                x: 0,
                y: 0,
                height: 50,
                width: 50
            }
        }
        const tooltip = this.createTooltip(getPosition, topContextData)

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
            return this.activeFormSelectedDetail(response.data, response.configType)
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

    async setupAutofill () {
        if (isApp) {
            await this.getAutofillInitData()
        }

        const signedIn = await this._checkDeviceSignedIn()
        if (signedIn) {
            if (isApp) {
                await this.getAddresses()
            }
            forms.forEach(form => form.redecorateAllInputs())
        }

        const cleanup = scanForInputs(this).init()
        this.addLogoutListener(cleanup)
    }

    getUserData () {
        return wkSendAndWait('emailHandlerGetUserData')
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

    /**
     * @param {import("../Form/Form").Form} form
     * @param {HTMLInputElement} input
     * @param {() => { x: number; y: number; height: number; width: number; }} getPosition
     * @param {{ x: number; y: number; }} click
     * @param {TopContextData} topContextData
     */
    attachTooltipInner (form, input, getPosition, click, topContextData) {
        if (!isTopFrame && supportsTopFrame) {
            // TODO currently only mouse initiated events are supported
            if (!click) {
                return
            }
            this.showTopTooltip(click, getPosition(), topContextData)
            return
        }
        super.attachTooltipInner(form, input, getPosition, click, topContextData)
    }

    /**
     * @param {{ x: number; y: number; }} click
     * @param {{ x: number; y: number; height: number; width: number; }} inputDimensions
     * @param {TopContextData} [data]
     */
    async showTopTooltip (click, inputDimensions, data) {
        let diffX = Math.floor(click.x - inputDimensions.x)
        let diffY = Math.floor(click.y - inputDimensions.y)

        const details = {
            inputTop: diffY,
            inputLeft: diffX,
            inputHeight: Math.floor(inputDimensions.height),
            inputWidth: Math.floor(inputDimensions.width),
            serializedInputContext: JSON.stringify(data)
        }

        await wkSend('showAutofillParent', details)

        // Start listening for the user initiated credential
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
     * @deprecated
     */
    storeCredentials (credentials) {
        return wkSend('pmHandlerStoreCredentials', credentials)
    }

    /**
     * Sends form data to the native layer
     * @param {DataStorageObject} data
     */
    storeFormData (data) {
        return wkSend('pmHandlerStoreData', data)
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
        const {inputType} = this.getTopContextData() || {}
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

    /** @param {FeatureToggleNames} name */
    supportsFeature (name) {
        return this.#supportedFeatures.includes(name)
    }
}

module.exports = AppleDeviceInterface
