import InterfacePrototype from './InterfacePrototype.js'
import { createTransport } from '../appleDeviceUtils/appleDeviceUtils'
import { formatDuckAddress, autofillEnabled } from '../autofill-utils'
import { processConfig } from '@duckduckgo/content-scope-scripts/src/apple-utils'
import {defaultOptions} from '../UI/HTMLTooltip'
import {HTMLTooltipUIController} from '../UI/controllers/HTMLTooltipUIController'
import {OverlayUIController} from '../UI/controllers/OverlayUIController'

class AppleDeviceInterface extends InterfacePrototype {
    /** @type {FeatureToggleNames[]} */
    supportedFeatures = [];

    /** @type {Transport} */
    transport = createTransport(this.globalConfig)

    /** @override */
    initialSetupDelayMs = 300

    async isEnabled () {
        return autofillEnabled(this.globalConfig, processConfig)
    }

    constructor (config) {
        super(config)

        // Only enable 'password.generation' if we're on the macOS app (for now);
        if (this.globalConfig.isApp) {
            this.supportedFeatures.push('password.generation')
        }
    }

    /**
     * @override
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createTooltipInterface () {
        if (!this.globalConfig.supportsTopFrame) {
            const options = {
                ...defaultOptions,
                testMode: this.isTestMode()
            }
            return new HTMLTooltipUIController({
                device: this,
                tooltipKind: 'modern',
                onPointerDown: (e) => this.onPointerDown(e)
            }, options)
        }

        /**
         * If we get here, we're just a controller for an overlay
         */
        return new OverlayUIController({
            remove: async () => this.closeAutofillParent(),
            show: async (details) => this.show(details),
            onPointerDown: (e) => this.onPointerDown(e)
        })
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

    async getSelectedCredentials () {
        return this.transport.send('getSelectedCredentials')
    }

    /**
     * @param {import('../UI/controllers/OverlayUIController.js').ShowAutofillParentRequest} parentArgs
     * @returns {Promise<void>}
     */
    async showAutofillParent (parentArgs) {
        return this.transport.send('showAutofillParent', parentArgs)
    }

    /**
     * @returns {Promise<any>}
     */
    async closeAutofillParent () {
        return this.transport.send('closeAutofillParent', {})
    }

    /**
     * @param {import('../UI/controllers/OverlayUIController.js').ShowAutofillParentRequest} details
     */
    async show (details) {
        await this.showAutofillParent(details)
        this._listenForSelectedCredential()
            .then((response) => {
                if (!response) {
                    return
                }
                this.activeFormSelectedDetail(response.data, response.configType)
            })
            .catch(e => {
                console.error('unknown error', e)
            })
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
        return this.transport.send('emailHandlerStoreToken', { token, username: userName, cohort })
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
     * Sends form data to the native layer
     * @param {DataStorageObject} data
     */
    storeFormData (data) {
        return this.transport.send('pmHandlerStoreData', data)
    }

    /**
     * Gets the init data from the device
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
     * @returns {APIResponseSingle<CredentialsObject>}
     */
    getAutofillCredentials (id) {
        return this.transport.send('pmHandlerGetAutofillCredentials', { id })
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
        return this.transport.send('pmHandlerGetCreditCard', { id })
    }

    // Used to encode data to send back to the child autofill
    async selectedDetail (detailIn, configType) {
        this.activeFormSelectedDetail(detailIn, configType)
    }

    async getCurrentInputType () {
        const {inputType} = this.getTopContextData() || {}
        return inputType || 'unknown'
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

    /** @type {any} */
    pollingTimeout = null;
    /**
     * Poll the native listener until the user has selected a credential.
     * Message return types are:
     * - 'stop' is returned whenever the message sent doesn't match the native last opened tooltip.
     *     - This also is triggered when the close event is called and prevents any edge case continued polling.
     * - 'ok' is when the user has selected a credential and the value can be injected into the page.
     * - 'none' is when the tooltip is open in the native window however hasn't been entered.
     * @returns {Promise<{data:IdentityObject|CreditCardObject|CredentialsObject, configType: string} | null>}
     */
    async _listenForSelectedCredential () {
        return new Promise((resolve) => {
            // Prevent two timeouts from happening
            // @ts-ignore
            const poll = async () => {
                clearTimeout(this.pollingTimeout)
                const response = await this.getSelectedCredentials()
                switch (response.type) {
                case 'none':
                    // Parent hasn't got a selected credential yet
                    // @ts-ignore
                    this.pollingTimeout = setTimeout(() => {
                        poll()
                    }, 100)
                    return
                case 'ok': {
                    return resolve({data: response.data, configType: response.configType})
                }
                case 'stop':
                    // Parent wants us to stop polling
                    resolve(null)
                    break
                }
            }
            poll()
        })
    }
    /**
     * on macOS we try to detect if a click occurred withing a form
     */
    onPointerDown (e) {
        // note: This conditional will be replaced with feature flagging
        if (!this.globalConfig.isApp) return
        const matchingForm = [...this.scanner.forms.values()].find(
            (form) => {
                const btns = [...form.submitButtons]
                // @ts-ignore
                if (btns.includes(e.target)) return true

                // @ts-ignore
                if (btns.find((btn) => btn.contains(e.target))) return true
            }
        )

        matchingForm?.submitHandler()
    }
}

export {AppleDeviceInterface}
