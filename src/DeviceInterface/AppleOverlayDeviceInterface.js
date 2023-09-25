import {AppleDeviceInterface} from './AppleDeviceInterface.js'
import {HTMLTooltipUIController} from '../UI/controllers/HTMLTooltipUIController.js'
import {overlayApi} from './overlayApi.js'
import {createNotification, validate} from '../../packages/device-api/index.js'
import {AskToUnlockProviderCall} from '../deviceApiCalls/__generated__/deviceApiCalls.js'
import {providerStatusUpdatedSchema} from '../deviceApiCalls/__generated__/validators.zod.js'

/**
 * This subclass is designed to separate code that *only* runs inside the
 * Overlay into a single place.
 *
 * It will only run inside the macOS overlay, therefor all code here
 * can be viewed as *not* executing within a regular page context.
 */
class AppleOverlayDeviceInterface extends AppleDeviceInterface {
    /**
     * Mark top frame as not stripping credential data
     * @type {boolean}
     */
    stripCredentials = false

    /**
     * overlay API helpers
     */
    overlay = overlayApi(this)

    previousX = 0
    previousY = 0

    /**
     * Because we're running inside the Overlay, we always create the HTML
     * Tooltip controller.
     *
     * @override
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createUIController () {
        return new HTMLTooltipUIController({
            tooltipKind: /** @type {const} */ ('modern'),
            device: this
        }, {
            wrapperClass: 'top-autofill',
            tooltipPositionClass: () => '.wrapper { transform: none; }',
            setSize: (details) => this.deviceApi.notify(createNotification('setSize', details)),
            remove: async () => this._closeAutofillParent(),
            testMode: this.isTestMode()
        })
    }

    addDeviceListeners () {
        /**
         * The native side will send a custom event 'mouseMove' to indicate
         * that the HTMLTooltip should fake an element being focused.
         *
         * Note: There's no cleanup required here since the Overlay has a fresh
         * page load every time it's opened.
         */
        window.addEventListener('mouseMove', (event) => {
            // Don't set focus if the mouse hasn't moved ever
            // This is to avoid clickjacking where an attacker puts the pulldown under the cursor
            // and tricks the user into clicking
            if (
                (!this.previousX && !this.previousY) || // if no previous coords
                (this.previousX === event.detail.x && this.previousY === event.detail.y) // or the mouse hasn't moved
            ) {
                this.previousX = event.detail.x
                this.previousY = event.detail.y
                return
            }

            const activeTooltip = this.uiController?.getActiveTooltip?.()
            activeTooltip?.focus(event.detail.x, event.detail.y)
            this.previousX = event.detail.x
            this.previousY = event.detail.y
        })

        return super.addDeviceListeners()
    }

    /**
     * Since we're running inside the Overlay we can limit what happens here to
     * be only things that are needed to power the HTML Tooltip
     *
     * @override
     * @returns {Promise<void>}
     */
    async setupAutofill () {
        await this._getAutofillInitData()
        await this.inContextSignup.init()
        const signedIn = await this._checkDeviceSignedIn()

        if (signedIn) {
            await this.getAddresses()
        }
    }

    async postInit () {
        // setup overlay API pieces
        this.overlay.showImmediately()
        super.postInit()
    }

    /**
     * In the top-frame scenario we override the base 'selectedDetail'.
     *
     * This
     *
     * @override
     * @param {IdentityObject|CreditCardObject|CredentialsObject|{email:string, id: string}} data
     * @param {string} type
     */
    async selectedDetail (data, type) {
        return this.overlay.selectedDetail(data, type)
    }

    async askToUnlockProvider () {
        const response = await this.deviceApi.request(new AskToUnlockProviderCall(null))
        this.providerStatusUpdated(response)
    }

    providerStatusUpdated (data) {
        const {credentials, availableInputTypes} = validate(data, providerStatusUpdatedSchema)

        // Update local settings and data
        this.settings.setAvailableInputTypes(availableInputTypes)
        this.storeLocalCredentials(credentials)

        // rerender the tooltip
        this.uiController?.updateItems(credentials)
    }
}

export { AppleOverlayDeviceInterface }
