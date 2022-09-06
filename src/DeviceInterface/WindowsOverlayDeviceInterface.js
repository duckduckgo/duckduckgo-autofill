import InterfacePrototype from './InterfacePrototype.js'
import {HTMLTooltipUIController} from '../UI/controllers/HTMLTooltipUIController.js'
import {GetAutofillInitDataCall, SetSizeCall} from '../deviceApiCalls/__generated__/deviceApiCalls.js'
import {overlayApi} from './overlayApi.js'

/**
 * This subclass is designed to separate code that *only* runs inside the
 * Windows Overlay into a single place.
 *
 * It has some subtle differences to the macOS version, which is why
 * this is another DeviceInterface
 */
export class WindowsOverlayDeviceInterface extends InterfacePrototype {
    /**
     * Mark top frame as not stripping credential data
     * @type {boolean}
     */
    stripCredentials = false;

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
            setSize: (details) => this.deviceApi.notify(new SetSizeCall(details)),
            testMode: this.isTestMode(),
            /**
             * Note: This is needed because Mutation observer didn't support visibility checks on Windows
             */
            checkVisibility: false
        })
    }

    /**
     * Since we're running inside the Overlay we can limit what happens here to
     * be only things that are needed to power the HTML Tooltip
     *
     * @override
     * @returns {Promise<void>}
     */
    async setupAutofill () {
        const response = await this.deviceApi.request(new GetAutofillInitDataCall(null))
        // @ts-ignore
        this.storeLocalData(response)

        // setup overlay API pieces
        const overlay = overlayApi(this)
        overlay.showImmediately()
    }
}
