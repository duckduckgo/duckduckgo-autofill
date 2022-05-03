import InterfacePrototype from './InterfacePrototype.js'
import {createTransport} from '../transports/transport.apple'
import {formatDuckAddress, autofillEnabled} from '../autofill-utils'
import {processConfig} from '@duckduckgo/content-scope-scripts/src/apple-utils'
// import {fromPlatformConfig} from '../settings/settings'
import {CSS_STYLES} from '../UI/styles/styles'

class AppleTopFrameDeviceInterface extends InterfacePrototype {
    /* @type {Timeout | undefined} */
    pollingTimeout

    /** @type {Transport} */
    transport = createTransport(this.globalConfig)

    /** @override */
    initialSetupDelayMs = 300

    stripCredentials = false;

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
        }

        await this._setupTopFrame()
    }

    async _setupTopFrame () {
        const topContextData = this.getTopContextData()
        if (!topContextData) throw new Error('unreachable, topContextData should be available')

        // Provide dummy values, they're not used
        // todo(Shane): Is this truly not used?
        const getPosition = () => {
            return {
                x: 0,
                y: 0,
                height: 50,
                width: 50
            }
        }

        // this is the apple specific part about faking the focus etc.
        this.tooltip.addListener(() => {
            const handler = (event) => {
                const tooltip = this.tooltip.getActiveTooltip()
                tooltip?.focus(event.detail.x, event.detail.y)
            }
            window.addEventListener('mouseMove', handler)
            return () => {
                window.removeEventListener('mouseMove', handler)
            }
        })
        const tooltip = this.tooltip.createTooltip?.(getPosition, topContextData)
        this.setActiveTooltip(tooltip)
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

    async setSize (cb) {
        const details = cb()
        await this.transport.send('setSize', details)
    }

    async removeTooltip () {
        await this.transport.send('closeAutofillParent', {})
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
        let detailsEntries = Object.entries(detailIn).map(([key, value]) => {
            return [key, String(value)]
        })
        const data = Object.fromEntries(detailsEntries)
        this.transport.send('selectedDetail', {data, configType})
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

    tooltipWrapperClass () {
        return 'top-autofill'
    }

    tooltipPositionClass (_top, _left) {
        return '.wrapper {transform: none; }'
    }

    setupSizeListener (cb) {
        cb()
    }
}

export { AppleTopFrameDeviceInterface }
