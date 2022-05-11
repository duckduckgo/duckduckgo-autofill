import {AppleDeviceInterface} from './AppleDeviceInterface'

/**
 * This is here to encapsulate
 */
class AppleOverlayDeviceInterface extends AppleDeviceInterface {
    /**
     * Mark top frame as not stripping credential data
     * @type {boolean}
     */
    stripCredentials = false;

    constructor (config, tooltip) {
        super(config, tooltip)
        tooltip._setDevice(this)
    }

    /**
     * @override
     * @returns {Promise<void>}
     */
    async setupAutofill () {
        await this.getAutofillInitData()
        const signedIn = await this._checkDeviceSignedIn()

        if (signedIn) {
            await this.getAddresses()
        }

        await this._setupTopFrame()
    }

    async _setupTopFrame () {
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

        // this is the apple specific part about faking the focus etc.
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

    /**
     * Used to encode data to send back to the child autofill
     * @override
     * @param detailIn
     * @param configType
     * @returns {Promise<void>}
     */
    async selectedDetail (detailIn, configType) {
        let detailsEntries = Object.entries(detailIn).map(([key, value]) => {
            return [key, String(value)]
        })
        const data = Object.fromEntries(detailsEntries)
        await this.transport.send('selectedDetail', { data, configType })
    }

    /** @param {{height: number, width: number}} details */
    async setSize (details) {
        // /** noop **/
        await this.transport.send('setSize', details)
    }

    tooltipWrapperClass () {
        return 'top-autofill'
    }

    tooltipPositionClass (_top, _left) {
        return '.wrapper {transform: none; }'
    }
}

export { AppleOverlayDeviceInterface }
