import { DeviceApiTransport } from '../../../packages/device-api/index.js';
import {
    CloseEmailProtectionTabCall,
    GetAutofillDataCall,
    GetAvailableInputTypesCall,
    GetIncontextSignupDismissedAtCall,
    GetRuntimeConfigurationCall,
    SetIncontextSignupPermanentlyDismissedAtCall,
    ShowInContextEmailProtectionSignupPromptCall,
    StartEmailProtectionSignupCall,
    StoreFormDataCall,
} from '../__generated__/deviceApiCalls.js';

export class AndroidTransport extends DeviceApiTransport {
    /** @type {GlobalConfig} */
    config;

    /** @param {GlobalConfig} globalConfig */
    constructor(globalConfig) {
        super();
        this.config = globalConfig;

        if (this.config.isDDGTestMode) {
            if (typeof window.BrowserAutofill?.getAutofillData !== 'function') {
                console.warn('window.BrowserAutofill.getAutofillData missing');
            }
            if (typeof window.BrowserAutofill?.storeFormData !== 'function') {
                console.warn('window.BrowserAutofill.storeFormData missing');
            }
        }
    }
    /**
     * @param {import("../../../packages/device-api").DeviceApiCall} deviceApiCall
     * @returns {Promise<any>}
     */
    async send(deviceApiCall) {
        if (deviceApiCall instanceof GetRuntimeConfigurationCall) {
            return androidSpecificRuntimeConfiguration(this.config);
        }

        if (deviceApiCall instanceof GetAvailableInputTypesCall) {
            return androidSpecificAvailableInputTypes(this.config);
        }

        if (deviceApiCall instanceof GetIncontextSignupDismissedAtCall) {
            window.BrowserAutofill.getIncontextSignupDismissedAt(JSON.stringify(deviceApiCall.params));
            return waitForResponse(deviceApiCall.id, this.config);
        }

        if (deviceApiCall instanceof SetIncontextSignupPermanentlyDismissedAtCall) {
            return window.BrowserAutofill.setIncontextSignupPermanentlyDismissedAt(JSON.stringify(deviceApiCall.params));
        }

        if (deviceApiCall instanceof StartEmailProtectionSignupCall) {
            return window.BrowserAutofill.startEmailProtectionSignup(JSON.stringify(deviceApiCall.params));
        }

        if (deviceApiCall instanceof CloseEmailProtectionTabCall) {
            return window.BrowserAutofill.closeEmailProtectionTab(JSON.stringify(deviceApiCall.params));
        }

        if (deviceApiCall instanceof ShowInContextEmailProtectionSignupPromptCall) {
            window.BrowserAutofill.showInContextEmailProtectionSignupPrompt(JSON.stringify(deviceApiCall.params));
            return waitForResponse(deviceApiCall.id, this.config);
        }

        if (deviceApiCall instanceof GetAutofillDataCall) {
            window.BrowserAutofill.getAutofillData(JSON.stringify(deviceApiCall.params));
            return waitForResponse(deviceApiCall.id, this.config);
        }

        if (deviceApiCall instanceof StoreFormDataCall) {
            return window.BrowserAutofill.storeFormData(JSON.stringify(deviceApiCall.params));
        }

        throw new Error('android: not implemented: ' + deviceApiCall.method);
    }
}

/**
 * @param {string} expectedResponse - the name/id of the response
 * @param {GlobalConfig} config
 * @returns {Promise<*>}
 */
function waitForResponse(expectedResponse, config) {
    return new Promise((resolve) => {
        const handler = (e) => {
            if (!config.isDDGTestMode) {
                if (e.origin !== '') {
                    return;
                }
            }
            if (!e.data) {
                return;
            }
            if (typeof e.data !== 'string') {
                if (config.isDDGTestMode) {
                    console.log('❌ event.data was not a string. Expected a string so that it can be JSON parsed');
                }
                return;
            }
            try {
                const data = JSON.parse(e.data);
                if (data.type === expectedResponse) {
                    window.removeEventListener('message', handler);
                    return resolve(data);
                }
                if (config.isDDGTestMode) {
                    console.log(`❌ event.data.type was '${data.type}', which didnt match '${expectedResponse}'`, JSON.stringify(data));
                }
            } catch (e) {
                window.removeEventListener('message', handler);
                if (config.isDDGTestMode) {
                    console.log('❌ Could not JSON.parse the response');
                }
            }
        };
        window.addEventListener('message', handler);
    });
}

/**
 * @param {GlobalConfig} globalConfig
 * @returns {{success: import('../__generated__/validators-ts').RuntimeConfiguration}}
 */
function androidSpecificRuntimeConfiguration(globalConfig) {
    if (!globalConfig.userPreferences) {
        throw new Error('globalConfig.userPreferences not supported yet on Android');
    }
    return {
        success: {
            // @ts-ignore
            contentScope: globalConfig.contentScope,
            // @ts-ignore
            userPreferences: globalConfig.userPreferences,
            // @ts-ignore
            userUnprotectedDomains: globalConfig.userUnprotectedDomains,
            // @ts-ignore
            availableInputTypes: globalConfig.availableInputTypes,
        },
    };
}

/**
 * @param {GlobalConfig} globalConfig
 * @returns {{success: import('../__generated__/validators-ts').AvailableInputTypes}}
 */
function androidSpecificAvailableInputTypes(globalConfig) {
    if (!globalConfig.availableInputTypes) {
        throw new Error('globalConfig.availableInputTypes not supported yet on Android');
    }
    return {
        success: globalConfig.availableInputTypes,
    };
}
