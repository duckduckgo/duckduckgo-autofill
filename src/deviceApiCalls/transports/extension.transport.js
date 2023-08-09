import {DeviceApiTransport} from '../../../packages/device-api/index.js'
import {
    GetAvailableInputTypesCall,
    GetRuntimeConfigurationCall,
    SendJSPixelCall,
    SetIncontextSignupPermanentlyDismissedAtCall,
    GetIncontextSignupDismissedAtCall,
    CloseAutofillParentCall,
    StartEmailProtectionSignupCall,
    AddDebugFlagCall
} from '../__generated__/deviceApiCalls.js'
import {isAutofillEnabledFromProcessedConfig, isIncontextSignupEnabledFromProcessedConfig} from '../../autofill-utils.js'
import {Settings} from '../../Settings.js'

export class ExtensionTransport extends DeviceApiTransport {
    /** @param {GlobalConfig} globalConfig */
    constructor (globalConfig) {
        super()
        this.config = globalConfig
    }

    async send (deviceApiCall) {
        if (deviceApiCall instanceof GetRuntimeConfigurationCall) {
            return deviceApiCall.result(await extensionSpecificRuntimeConfiguration(this))
        }

        if (deviceApiCall instanceof GetAvailableInputTypesCall) {
            return deviceApiCall.result(await extensionSpecificGetAvailableInputTypes())
        }

        if (deviceApiCall instanceof SetIncontextSignupPermanentlyDismissedAtCall) {
            return deviceApiCall.result(await extensionSpecificSetIncontextSignupPermanentlyDismissedAtCall(deviceApiCall.params))
        }

        if (deviceApiCall instanceof GetIncontextSignupDismissedAtCall) {
            return deviceApiCall.result(await extensionSpecificGetIncontextSignupDismissedAt())
        }

        // TODO: unify all calls to use deviceApiCall.method instead of all these if blocks
        if (deviceApiCall instanceof SendJSPixelCall) {
            return deviceApiCall.result(await extensionSpecificSendPixel(deviceApiCall.params))
        }

        if (deviceApiCall instanceof AddDebugFlagCall) {
            return deviceApiCall.result(await extensionSpecificAddDebugFlag(deviceApiCall.params))
        }

        if (deviceApiCall instanceof CloseAutofillParentCall ||
            deviceApiCall instanceof StartEmailProtectionSignupCall) {
            return // noop
        }

        console.error('Send not implemented for ' + deviceApiCall.method)
    }
}

/**
 * @param {ExtensionTransport} deviceApi
 * @returns {Promise<ReturnType<GetRuntimeConfigurationCall['result']>>}
 */
async function extensionSpecificRuntimeConfiguration (deviceApi) {
    const contentScope = await getContentScopeConfig()
    const emailProtectionEnabled = isAutofillEnabledFromProcessedConfig(contentScope)
    const incontextSignupEnabled = isIncontextSignupEnabledFromProcessedConfig(contentScope)

    return {
        success: {
            // @ts-ignore
            contentScope: contentScope,
            // @ts-ignore
            userPreferences: {
                features: {
                    autofill: {
                        settings: {
                            featureToggles: {
                                ...Settings.defaults.featureToggles,
                                emailProtection: emailProtectionEnabled,
                                emailProtection_incontext_signup: incontextSignupEnabled
                            }
                        }
                    }
                }
            },
            // @ts-ignore
            userUnprotectedDomains: deviceApi.config?.userUnprotectedDomains
        }
    }
}

async function extensionSpecificGetAvailableInputTypes () {
    const contentScope = await getContentScopeConfig()
    const emailProtectionEnabled = isAutofillEnabledFromProcessedConfig(contentScope)

    return {
        success: {
            ...Settings.defaults.availableInputTypes,
            email: emailProtectionEnabled
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

/**
 * @param {import('../__generated__/validators-ts').SendJSPixelParams} params
 */
async function extensionSpecificSendPixel (params) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(
            {
                messageType: 'sendJSPixel',
                options: params
            },
            () => {
                resolve(true)
            }
        )
    })
}

/**
 * @param {import('../__generated__/validators-ts').AddDebugFlagParams} params
 */
async function extensionSpecificAddDebugFlag (params) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(
            {
                messageType: 'addDebugFlag',
                options: params
            },
            () => {
                resolve(true)
            }
        )
    })
}

async function extensionSpecificGetIncontextSignupDismissedAt () {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(
            {
                messageType: 'getIncontextSignupDismissedAt'
            },
            (response) => {
                resolve(response)
            }
        )
    })
}

/**
 * @param {import('../__generated__/validators-ts').SetIncontextSignupPermanentlyDismissedAt} params
 */
async function extensionSpecificSetIncontextSignupPermanentlyDismissedAtCall (params) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(
            {
                messageType: 'setIncontextSignupPermanentlyDismissedAt',
                options: params
            },
            () => {
                resolve(true)
            }
        )
    })
}
