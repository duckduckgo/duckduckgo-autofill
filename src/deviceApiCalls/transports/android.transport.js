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

    /** @type {typeof window.BrowserAutofill} */
    autofillBridge;

    /** @param {GlobalConfig} globalConfig */
    constructor(globalConfig) {
        super();
        this.config = globalConfig;
        this.autofillBridge = window.BrowserAutofill;

        if (this.config.isDDGTestMode) {
            if (typeof this.autofillBridge?.getAutofillData !== 'function') {
                console.warn('window.BrowserAutofill.getAutofillData missing');
            }
            if (typeof this.autofillBridge?.storeFormData !== 'function') {
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

        if (!this.autofillBridge) {
            return;
        }

        if (deviceApiCall instanceof GetIncontextSignupDismissedAtCall) {
            this.autofillBridge.getIncontextSignupDismissedAt(JSON.stringify(deviceApiCall.params));
            return waitForResponse(deviceApiCall.id, this.config);
        }

        if (deviceApiCall instanceof SetIncontextSignupPermanentlyDismissedAtCall) {
            return this.autofillBridge.setIncontextSignupPermanentlyDismissedAt(JSON.stringify(deviceApiCall.params));
        }

        if (deviceApiCall instanceof StartEmailProtectionSignupCall) {
            return this.autofillBridge.startEmailProtectionSignup(JSON.stringify(deviceApiCall.params));
        }

        if (deviceApiCall instanceof CloseEmailProtectionTabCall) {
            return this.autofillBridge.closeEmailProtectionTab(JSON.stringify(deviceApiCall.params));
        }

        if (deviceApiCall instanceof ShowInContextEmailProtectionSignupPromptCall) {
            this.autofillBridge.showInContextEmailProtectionSignupPrompt(JSON.stringify(deviceApiCall.params));
            return waitForResponse(deviceApiCall.id, this.config);
        }

        if (deviceApiCall instanceof GetAutofillDataCall) {
            this.autofillBridge.getAutofillData(JSON.stringify(deviceApiCall.params));
            return waitForResponse(deviceApiCall.id, this.config);
        }

        if (deviceApiCall instanceof StoreFormDataCall) {
            return this.autofillBridge.storeFormData(JSON.stringify(deviceApiCall.params));
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
