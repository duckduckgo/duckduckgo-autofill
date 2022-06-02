import InterfacePrototype from './InterfacePrototype'
import {HTMLTooltipUIController} from '../UI/controllers/HTMLTooltipUIController'
import {GetAutofillInitDataCall, SetSizeCall} from '../deviceApiCalls/__generated__/deviceApiCalls'
import {overlayApi} from './overlayApi'

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
        overlay._setupTopFrame()
        this.selectedDetail = overlay.selectedDetail.bind(this)
    }
}
