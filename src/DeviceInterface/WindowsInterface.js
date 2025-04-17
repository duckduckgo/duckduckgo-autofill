import InterfacePrototype from './InterfacePrototype.js';
import { OverlayUIController } from '../UI/controllers/OverlayUIController.js';
import {
    CloseAutofillParentCall,
    GetAutofillDataCall,
    EmailProtectionStoreUserDataCall,
    EmailProtectionRemoveUserDataCall,
    EmailProtectionGetUserDataCall,
    EmailProtectionGetCapabilitiesCall,
    EmailProtectionRefreshPrivateAddressCall,
    EmailProtectionGetAddressesCall,
    EmailProtectionGetIsLoggedInCall,
    GetCreditCardCall,
} from '../deviceApiCalls/__generated__/deviceApiCalls.js';

/**
 * @typedef {import('../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest} GetAutofillDataRequest
 */

const EMAIL_PROTECTION_LOGOUT_MESSAGE = 'EMAIL_PROTECTION_LOGOUT';

export class WindowsInterface extends InterfacePrototype {
    ready = false;
    /** @type {AbortController|null} */
    _abortController = null;

    async setupAutofill() {
        const loggedIn = await this._getIsLoggedIn();
        if (loggedIn) {
            await this.getAddresses();
        }
    }

    postInit() {
        super.postInit();
        this.ready = true;
    }

    createUIController() {
        /**
         * If we get here, we're just a controller for an overlay
         */
        return new OverlayUIController({
            remove: async () => this._closeAutofillParent(),
            show: async (details) => this._show(details),
        });
    }

    /**
     * @param {GetAutofillDataRequest} details
     */
    async _show(details) {
        const { mainType } = details;
        // prevent overlapping listeners
        if (this._abortController && !this._abortController.signal.aborted) {
            this._abortController.abort();
        }
        this._abortController = new AbortController();
        try {
            const resp = await this.deviceApi.request(new GetAutofillDataCall(details), { signal: this._abortController.signal });

            if (!this.activeForm) {
                throw new Error('this.currentAttached was absent');
            }
            switch (resp.action) {
                case 'fill': {
                    if (mainType in resp) {
                        this.activeForm?.autofillData(resp[mainType], mainType);
                    } else {
                        throw new Error(`action: "fill" cannot occur because "${mainType}" was missing`);
                    }
                    break;
                }
                case 'focus': {
                    this.activeForm?.activeInput?.focus();
                    break;
                }
                case 'none': {
                    // do nothing
                    break;
                }

                case 'refreshAvailableInputTypes': {
                    await this.removeTooltip();
                    return await this.credentialsImport.refresh();
                }

                default:
                    if (this.globalConfig.isDDGTestMode) {
                        console.warn('unhandled response', resp);
                    }
                    return this._closeAutofillParent();
            }
        } catch (e) {
            if (this.globalConfig.isDDGTestMode) {
                if (e instanceof DOMException && e.name === 'AbortError') {
                    console.log('Promise Aborted');
                } else {
                    console.error('Promise Rejected', e);
                }
            }
        }
    }

    /**
     * @returns {Promise<any>}
     */
    async _closeAutofillParent() {
        return this.deviceApi.notify(new CloseAutofillParentCall(null));
    }

    /**
     * Email Protection calls
     */

    /**
     * @returns {Promise<any>}
     */
    getEmailProtectionCapabilities() {
        return this.deviceApi.request(new EmailProtectionGetCapabilitiesCall({}));
    }

    async _getIsLoggedIn() {
        const isLoggedIn = await this.deviceApi.request(new EmailProtectionGetIsLoggedInCall({}));

        this.isDeviceSignedIn = () => isLoggedIn;
        return isLoggedIn;
    }

    addLogoutListener(handler) {
        // Only deal with logging out if we're in the email web app
        if (!this.globalConfig.isDDGDomain) return;

        windowsInteropAddEventListener('message', (e) => {
            if (this.globalConfig.isDDGDomain && e.data === EMAIL_PROTECTION_LOGOUT_MESSAGE) {
                handler();
            }
        });
    }

    /**
     * @returns {Promise<any>}
     */
    storeUserData({ addUserData }) {
        return this.deviceApi.request(new EmailProtectionStoreUserDataCall(addUserData));
    }
    /**
     * @returns {Promise<any>}
     */
    removeUserData() {
        return this.deviceApi.request(new EmailProtectionRemoveUserDataCall({}));
    }
    /**
     * @returns {Promise<any>}
     */
    getUserData() {
        return this.deviceApi.request(new EmailProtectionGetUserDataCall({}));
    }

    async refreshAlias() {
        const addresses = await this.deviceApi.request(new EmailProtectionRefreshPrivateAddressCall({}));

        this.storeLocalAddresses(addresses);
    }
    async getAddresses() {
        const addresses = await this.deviceApi.request(new EmailProtectionGetAddressesCall({}));

        this.storeLocalAddresses(addresses);
        return addresses;
    }
    /**
     * Gets a single complete credit card obj once the user requests it
     * @param {CreditCardObject['id']} id
     * @returns {APIResponse<CreditCardObject>}
     */
    getAutofillCreditCard(id) {
        return this.deviceApi.request(new GetCreditCardCall({ id }));
    }
}
