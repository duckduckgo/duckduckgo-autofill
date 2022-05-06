import InterfacePrototype from './InterfacePrototype.js'
import {formatDuckAddress} from '../autofill-utils'
// import {fromPlatformConfig} from '../settings/settings'
import {CSS_STYLES} from '../UI/styles/styles'
import {createLegacyTransport} from '../transports/apple.transport'

/**
 * todo(Shane): Decide which data is/isn't needed when apple is inside overlay
 */
class AppleOverlayDeviceInterface extends InterfacePrototype {
    /**
     * @deprecated use the runtime only.
     * @type {LegacyTransport}
     */
    legacyTransport = createLegacyTransport(this.globalConfig)

    stripCredentials = false;

    async setupAutofill () {
        const response = await this.runtime.getAutofillInitData()
        this.storeLocalData(response)

        const signedIn = this.availableInputTypes.email

        if (signedIn) {
            if (this.globalConfig.isApp) {
                await this.getAddresses()
            }
        }

        await this._setupTopFrame()
    }

    isDeviceSignedIn () {
        return Boolean(this.availableInputTypes.email)
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
        // todo(Shane): The fact this 'addListener' could be undefined is a design problem
        this.tooltip.addListener?.(() => {
            const handler = (event) => {
                const tooltip = this.tooltip.getActiveTooltip?.()
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

    async setSize (cb) {
        const details = cb()
        // todo(Shane): Upgrade to new runtime
        await this.legacyTransport.send('setSize', details)
    }

    async removeTooltip () {
        console.log('AppleOverlayDeviceInterface', 'closeAutofillParent')
        await this.runtime.closeAutofillParent()
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
     * Opens the native UI for managing passwords
     */
    openManagePasswords () {
        return this.legacyTransport.send('pmHandlerOpenManagePasswords')
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
        let detailsEntries = Object.entries(detailIn).map(([key, value]) => {
            return [key, String(value)]
        })
        const data = Object.fromEntries(detailsEntries)
        // todo(Shane): Migrate
        await this.legacyTransport.send('selectedDetail', {data, configType})
    }

    async getCurrentInputType () {
        const {inputType} = this.getTopContextData() || {}
        return inputType || 'unknown'
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

export { AppleOverlayDeviceInterface }
