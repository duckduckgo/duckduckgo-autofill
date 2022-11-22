import {DeviceApiTransport} from '../../../packages/device-api/index.js'
import {GetRuntimeConfigurationCall} from '../__generated__/deviceApiCalls.js'
import {isAutofillEnabledFromProcessedConfig} from '../../autofill-utils.js'
import {Settings} from '../../Settings.js'

export class ExtensionTransport extends DeviceApiTransport {
    /** @param {GlobalConfig} globalConfig */
    constructor (globalConfig) {
        super()
        this.config = globalConfig
    }

    async send (deviceApiCall) {
        if (deviceApiCall instanceof GetRuntimeConfigurationCall) {
            return deviceApiCall.result(await extensionSpecificRuntimeConfiguration(this.config))
        }

        throw new Error('not implemented yet for ' + deviceApiCall.method)
    }
}

/**
 * @param {GlobalConfig} globalConfig
 * @returns {Promise<ReturnType<GetRuntimeConfigurationCall['result']>>}
 */
async function extensionSpecificRuntimeConfiguration (globalConfig) {
    const contentScope = await getContentScopeConfig()
    const emailProtectionEnabled = isAutofillEnabledFromProcessedConfig(contentScope)

    return {
        success: {
            // @ts-ignore
            contentScope: contentScope,
            // @ts-ignore
            userPreferences: {features: {autofill: {settings: {featureToggles: {
                ...Settings.defaults.featureToggles,
                emailProtection: emailProtectionEnabled
            }}}}},
            // @ts-ignore
            userUnprotectedDomains: globalConfig?.userUnprotectedDomains,
            // @ts-ignore
            availableInputTypes: {
                ...Settings.defaults.availableInputTypes,
                email: emailProtectionEnabled
            }
        }
    }
}

async function getContentScopeConfig () {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(
            {
                registeredTempAutofillContentScript: true,
                documentUrl: window.location.href
            },
            (response) => {
                if (response && 'site' in response) {
                    resolve(response)
                }
            }
        )
    })
}
