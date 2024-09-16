import {DeviceApiTransport} from '../../../packages/device-api/index.js'
import {Messaging, MissingHandler} from '../../../packages/messaging/messaging.js'
import {AndroidMessagingConfig} from '../../../packages/messaging/android.js'

export class AndroidTransport extends DeviceApiTransport {
    /** @type {GlobalConfig} */
    config

    /** @param {GlobalConfig} globalConfig */
    constructor (globalConfig) {
        super()
        this.config = globalConfig
        const messageHandlerNames = [
            'EmailProtectionStoreUserData',
            'EmailProtectionRemoveUserData',
            'EmailProtectionGetUserData',
            'EmailProtectionGetCapabilities',
            'EmailProtectionGetAlias',
            'SetIncontextSignupPermanentlyDismissedAt',
            'StartEmailProtectionSignup',
            'CloseEmailProtectionTab',
            'ShowInContextEmailProtectionSignupPrompt',
            'StoreFormData',
            'GetIncontextSignupDismissedAt',
            'GetRuntimeConfiguration',
            'GetAutofillData'
        ]
        const androidMessagingConfig = new AndroidMessagingConfig({messageHandlerNames})
        this.messaging = new Messaging(androidMessagingConfig)
    }
    /**
     * @param {import("../../../packages/device-api").DeviceApiCall} deviceApiCall
     * @returns {Promise<any>}
     */
    async send (deviceApiCall) {
        try {
            // if the call has an `id`, it means that it expects a response
            if (deviceApiCall.id) {
                return await this.messaging.request(deviceApiCall.method, deviceApiCall.params || undefined)
            } else {
                return this.messaging.notify(deviceApiCall.method, deviceApiCall.params || undefined)
            }
        } catch (e) {
            if (e instanceof MissingHandler) {
                if (this.config.isDDGTestMode) {
                    console.log('MissingAndroidHandler error for:', deviceApiCall.method)
                }
                throw new Error('unimplemented handler: ' + deviceApiCall.method)
            } else {
                throw e
            }
        }
    }
}
