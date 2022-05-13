import {AppleDeviceInterface} from './AppleDeviceInterface'
import {CSS_STYLES} from '../UI/styles/styles'
import {HTMLTooltipUIController} from '../UI/controllers/HTMLTooltipUIController'

/**
 * This is here to encapsulate
 */
class AppleOverlayDeviceInterface extends AppleDeviceInterface {
    /**
     * Mark top frame as not stripping credential data
     * @type {boolean}
     */
    stripCredentials = false;

    /**
     * @override
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createTooltipInterface () {
        /** @type {import('../UI/controllers/HTMLTooltipUIController').HTMLTooltipControllerOptions} */
        const controllerOptions = {
            tooltipKind: /** @type {const} */ ('modern'),
            device: this,
            listener: (tooltipInterface) => {
                const handler = (event) => {
                    const activeTooltip = tooltipInterface.getActiveTooltip?.()
                    activeTooltip?.focus(event.detail.x, event.detail.y)
                }
                window.addEventListener('mouseMove', handler)
                return () => {
                    window.removeEventListener('mouseMove', handler)
                }
            }
        }
        /** @type {import('../UI/HTMLTooltip').HTMLTooltipOptions} */
        const tooltipOptions = {
            wrapperClass: 'top-autofill',
            tooltipPositionClass: () => '.wrapper { transform: none; }',
            css: `<style>${CSS_STYLES}</style>`,
            setSize: (details) => this.setSize(details),
            testMode: this.isTestMode(),
            remove: () => this.closeAutofillParent()
        }
        return new HTMLTooltipUIController(controllerOptions, tooltipOptions)
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

        // this is the apple top-frame specific parts about faking the focus etc.
        const tooltip = this.uiController.createTooltip?.(getPosition, topContextData)
        if (tooltip) {
            this.uiController.setActiveTooltip?.(tooltip)
        }
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
}

export { AppleOverlayDeviceInterface }
