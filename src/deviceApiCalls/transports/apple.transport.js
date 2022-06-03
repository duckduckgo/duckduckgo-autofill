import {MissingWebkitHandler, wkSendAndWait} from '../../appleDeviceUtils/appleDeviceUtils'
import {DeviceApiTransport} from '../../../packages/device-api'
import {GetRuntimeConfigurationCall} from '../__generated__/deviceApiCalls'

export class AppleTransport extends DeviceApiTransport {
    /** @type {GlobalConfig} */
    config

    /** @param {GlobalConfig} globalConfig */
    constructor (globalConfig) {
        super()
        this.config = globalConfig
    }

    async send (rpc) {
        try {
            return await wkSendAndWait(rpc.method, rpc.params || undefined, {
                secret: this.config.secret,
                hasModernWebkitAPI: this.config.hasModernWebkitAPI
            })
        } catch (e) {
            if (e instanceof MissingWebkitHandler) {
                if (this.config.isDDGTestMode) {
                    console.log('MissingWebkitHandler error for:', rpc.method)
                }
                if (rpc instanceof GetRuntimeConfigurationCall) {
                    return rpc.result(appleSpecificRuntimeConfiguration(this.config))
                }
                throw new Error('unimplemented handler: ' + rpc.method)
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
