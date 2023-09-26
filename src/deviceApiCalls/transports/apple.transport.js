import { Messaging, MissingHandler, WebkitMessagingConfig } from '../../../packages/messaging/messaging.js'
import { DeviceApiTransport } from '../../../packages/device-api/index.js'
import { GetRuntimeConfigurationCall } from '../__generated__/deviceApiCalls.js'

export class AppleTransport extends DeviceApiTransport {
    /** @param {GlobalConfig} globalConfig */
    constructor (globalConfig) {
        super()
        this.config = globalConfig
        const webkitConfig = new WebkitMessagingConfig({
            hasModernWebkitAPI: this.config.hasModernWebkitAPI,
            webkitMessageHandlerNames: this.config.webkitMessageHandlerNames,
            secret: this.config.secret
        })
        this.messaging = new Messaging(webkitConfig)
    }

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
                    console.log('MissingWebkitHandler error for:', deviceApiCall.method)
                }
                if (deviceApiCall instanceof GetRuntimeConfigurationCall) {
                    return deviceApiCall.result(appleSpecificRuntimeConfiguration(this.config))
                }
                throw new Error('unimplemented handler: ' + deviceApiCall.method)
            } else {
                throw e
            }
        }
    }
}

/**
 * @param {GlobalConfig} globalConfig
 * @returns {ReturnType<GetRuntimeConfigurationCall['result']>}
 */
function appleSpecificRuntimeConfiguration (globalConfig) {
    return {
        success: {
            // @ts-ignore
            contentScope: globalConfig.contentScope,
            // @ts-ignore
            userPreferences: globalConfig.userPreferences,
            // @ts-ignore
            userUnprotectedDomains: globalConfig.userUnprotectedDomains,
            // @ts-ignore
            availableInputTypes: globalConfig.availableInputTypes
        }
    }
}
