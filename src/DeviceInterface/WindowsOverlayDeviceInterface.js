import InterfacePrototype from './InterfacePrototype.js'
import { HTMLTooltipUIController } from '../UI/controllers/HTMLTooltipUIController.js'
import {
    EmailProtectionGetAddressesCall,
    GetAutofillInitDataCall,
    EmailProtectionGetIsLoggedInCall,
    SetSizeCall
} from '../deviceApiCalls/__generated__/deviceApiCalls.js'
import { overlayApi } from './overlayApi.js'

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
     * overlay API helpers
     */
    overlay = overlayApi(this);

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
        const loggedIn = await this._getIsLoggedIn()
        if (loggedIn) {
            await this.getAddresses()
        }

        const response = await this.deviceApi.request(new GetAutofillInitDataCall(null))
        // @ts-ignore
        this.storeLocalData(response)

        // setup overlay API pieces
        this.overlay.showImmediately()
    }

    /**
     * In the top-frame scenario, we send a message to the native
     * side to indicate a selection. Once received, the native side will store that selection so that a
     * subsequence call from main webpage can retrieve it
     *
     * @override
     * @param {IdentityObject|CreditCardObject|CredentialsObject|{email:string, id: string}} data
     * @param {string} type
     */
    async selectedDetail (data, type) {
        return this.overlay.selectedDetail(data, type)
    }

    /**
     * Email Protection calls
     */

    async _getIsLoggedIn () {
        const isLoggedIn = await this.deviceApi.request(new EmailProtectionGetIsLoggedInCall({}))

        this.isDeviceSignedIn = () => isLoggedIn
        return isLoggedIn
    }

    async getAddresses () {
        const addresses = await this.deviceApi.request(new EmailProtectionGetAddressesCall({}))

        this.storeLocalAddresses(addresses)
        return addresses
    }

    /**
     * Gets a single identity obj once the user requests it
     * @param {Number} id
     * @returns {Promise<{success: IdentityObject|undefined}>}
     */
    getAutofillIdentity (id) {
        const identity = this.getLocalIdentities().find(({ id: identityId }) => `${identityId}` === `${id}`)
        return Promise.resolve({ success: identity })
    }
}
