import InterfacePrototype from './InterfacePrototype.js';
import { HTMLTooltipUIController } from '../UI/controllers/HTMLTooltipUIController.js';
import {
    EmailProtectionGetAddressesCall,
    GetAutofillInitDataCall,
    EmailProtectionGetIsLoggedInCall,
    SetSizeCall,
    OpenManagePasswordsCall,
    OpenManageCreditCardsCall,
    OpenManageIdentitiesCall,
    CloseAutofillParentCall,
    GetCreditCardCall,
} from '../deviceApiCalls/__generated__/deviceApiCalls.js';
import { overlayApi } from './overlayApi.js';
import { defaultOptions } from '../UI/HTMLTooltip.js';

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

    previousScreenX = 0;
    previousScreenY = 0;

    /**
     * Because we're running inside the Overlay, we always create the HTML
     * Tooltip controller.
     *
     * @override
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createUIController() {
        return new HTMLTooltipUIController(
            {
                tooltipKind: /** @type {const} */ ('modern'),
                device: this,
            },
            {
                ...defaultOptions,
                platform: 'windows',
                wrapperClass: 'top-autofill',
                isTopAutofill: true,
                themeVariant: this.settings.themeVariant,
                tooltipPositionClass: () => '.wrapper { transform: none; }',
                setSize: (details) => this.deviceApi.notify(new SetSizeCall(details)),
                remove: async () => this._closeAutofillParent(),
                testMode: this.isTestMode(),
                /**
                 * Note: This is needed because Mutation observer didn't support visibility checks on Windows
                 */
                checkVisibility: false,
            },
        );
    }

    addDeviceListeners() {
        /**
         * On Windows (vs. MacOS) we can use the built-in `mousemove`
         * event and screen-relative positioning.
         *
         * Note: There's no cleanup required here since the Overlay has a fresh
         * page load every time it's opened.
         */
        window.addEventListener('mousemove', (event) => {
            // Don't set focus if the mouse hasn't moved ever
            // This is to avoid clickjacking where an attacker puts the pulldown under the cursor
            // and tricks the user into clicking
            if (
                (!this.previousScreenX && !this.previousScreenY) || // if no previous coords
                (this.previousScreenX === event.screenX && this.previousScreenY === event.screenY) // or the mouse hasn't moved
            ) {
                this.previousScreenX = event.screenX;
                this.previousScreenY = event.screenY;
                return;
            }

            const activeTooltip = this.uiController?.getActiveTooltip?.();
            activeTooltip?.focus(event.x, event.y);
            this.previousScreenX = event.screenX;
            this.previousScreenY = event.screenY;
        });

        return super.addDeviceListeners();
    }

    /**
     * @returns {Promise<any>}
     */
    async _closeAutofillParent() {
        return this.deviceApi.notify(new CloseAutofillParentCall(null));
    }

    /**
     * @returns {Promise<any>}
     */
    openManagePasswords() {
        return this.deviceApi.notify(new OpenManagePasswordsCall({}));
    }
    /**
     * @returns {Promise<any>}
     */
    openManageCreditCards() {
        return this.deviceApi.notify(new OpenManageCreditCardsCall({}));
    }
    /**
     * @returns {Promise<any>}
     */
    openManageIdentities() {
        return this.deviceApi.notify(new OpenManageIdentitiesCall({}));
    }

    /**
     * Since we're running inside the Overlay we can limit what happens here to
     * be only things that are needed to power the HTML Tooltip
     *
     * @override
     * @returns {Promise<void>}
     */
    async setupAutofill() {
        const loggedIn = await this._getIsLoggedIn();
        if (loggedIn) {
            await this.getAddresses();
        }

        const response = await this.deviceApi.request(new GetAutofillInitDataCall(null));
        // @ts-ignore
        this.storeLocalData(response);
    }

    async postInit() {
        // setup overlay API pieces
        this.overlay.showImmediately();
        super.postInit();
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
    async selectedDetail(data, type) {
        return this.overlay.selectedDetail(data, type);
    }

    /**
     * Email Protection calls
     */

    async _getIsLoggedIn() {
        const isLoggedIn = await this.deviceApi.request(new EmailProtectionGetIsLoggedInCall({}));

        this.isDeviceSignedIn = () => isLoggedIn;
        return isLoggedIn;
    }

    async getAddresses() {
        const addresses = await this.deviceApi.request(new EmailProtectionGetAddressesCall({}));

        this.storeLocalAddresses(addresses);
        return addresses;
    }

    /**
     * Gets a single complete credit card obj once the user requests it
     * @param {CreditCardObject['id']} id
     * @returns {APIResponseSingle<CreditCardObject>}
     */
    async getAutofillCreditCard(id) {
        const result = await this.deviceApi.request(new GetCreditCardCall({ id }));
        return { success: result };
    }
}
