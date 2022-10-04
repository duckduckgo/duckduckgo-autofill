import {MissingWebkitHandler, wkSendAndWait} from '../../appleDeviceUtils/appleDeviceUtils.js'
import {DeviceApiTransport} from '../../../packages/device-api/index.js'
import {GetRuntimeConfigurationCall} from '../__generated__/deviceApiCalls.js'

export class AppleTransport extends DeviceApiTransport {
    /** @type {{hasModernWebkitAPI?: boolean, secret?: string}} */
    sendOptions;

    /** @param {GlobalConfig} globalConfig */
    constructor (globalConfig) {
        super()
        this.config = globalConfig
        this.sendOptions = {
            secret: this.config.secret,
            hasModernWebkitAPI: this.config.hasModernWebkitAPI
        }
    }

    async send (deviceApiCall) {
        try {
            // if the call has an `id`, it means that it expects a response
            return await wkSendAndWait(deviceApiCall.method, deviceApiCall.params || undefined, this.sendOptions)
        } catch (e) {
            if (e instanceof MissingWebkitHandler) {
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
            userUnprotectedDomains: globalConfig.userUnprotectedDomains
        }
    }
}
