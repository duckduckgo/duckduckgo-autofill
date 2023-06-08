import {createNotification, createRequest} from "../../packages/device-api";
import {
    GetAutofillCredentialsCall,
    GetAutofillInitDataCall,
    StoreFormDataCall
} from "../deviceApiCalls/__generated__/deviceApiCalls";

/**
 * @typedef {import('../deviceApiCalls/__generated__/validators-ts').StoreFormData} StoreFormData
 * @typedef {import('../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest} GetAutofillDataRequest
 */

export class RemoteData {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    constructor(device) {
        this.device = device;
    }
    init() {}
    async refresh() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios": {
                const response = await this.device.deviceApi.request(createRequest('pmHandlerGetAutofillInitData'))
                this.device.localData.storeLocalData(response.success)
                break;
            }
            case "android":
            case "windows":
                break;
            case "windows-overlay": {
                const response = await this.device.deviceApi.request(new GetAutofillInitDataCall(null))
                // @ts-expect-error - the full response is not typed yet
                this.device.localData.storeLocalData(response)
                break;
            }
            case "extension":
                return this.device.emailProtection.getAddresses()
            default:
                assertUnreachable(this.device.ctx)
        }
    }
    /**
     * Gets credentials ready for autofill
     * @param {CredentialsObject['id']} id - the credential id
     * @returns {Promise<CredentialsObject|{success:CredentialsObject}>}
     */
    async getAutofillCredentials(id) {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios": {
                return this.device.deviceApi.request(createRequest('pmHandlerGetAutofillCredentials', {id}))
            }
            case "android":
            case "windows":
            case "windows-overlay":
            case "extension":
                break;
        }
        return this.device.deviceApi.request(new GetAutofillCredentialsCall({id: String(id)}))
    }

    /**
     * Gets a single complete credit card obj once the user requests it
     * @param {CreditCardObject['id']} id
     * @returns {APIResponse<CreditCardObject>}
     */
    async getAutofillCreditCard(id) {
        return this.device.deviceApi.request(createRequest('pmHandlerGetCreditCard', {id}))
    }

    /**
     * @param {IdentityObject['id']} id
     * @returns {Promise<{success: IdentityObject|undefined}>}
     */
    async getAutofillIdentity(id) {
        const identity = this.device.localData.getLocalIdentities().find(({id: identityId}) => `${identityId}` === `${id}`)
        return Promise.resolve({success: identity})
    }

    /** @param {import("../DeviceInterface/InterfacePrototype").StoreFormData} values */
    storeFormData(values) {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios": {
                return this.device.deviceApi.notify(createNotification('pmHandlerStoreData', values))
            }
            case "android":
            case "windows":
            case "windows-overlay": {
                return this.device.deviceApi.notify(new StoreFormDataCall(values))
            }
            case "extension":
                break;
            default:
                assertUnreachable(this.device.ctx)
        }
    }
}

/**
 * @param {never} x
 * @returns {never}
 */
function assertUnreachable(x) {
    console.log(x)
    throw new Error("Didn't expect to get here");
}
