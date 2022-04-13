import {sendAndWaitForAnswer} from '../autofill-utils'

/**
 * @param {GlobalConfig} _globalConfig
 * @returns {Transport}
 */
export function createTransport (_globalConfig) {

    /** @type {Transport} */
    const transport = {
        async send (name, data) {
            console.log('📲 android:', name, data);
            switch (name) {
            case "getRuntimeConfiguration": {
                const response = await sendAndWaitForAnswer(() => {
                    return window.BrowserAutofill.getRuntimeConfiguration()
                }, 'getRuntimeConfigurationResponse')
                return response.runtimeConfiguration;
            }
            case "getAvailableInputTypes": {
                const response = await sendAndWaitForAnswer(() => {
                    return window.BrowserAutofill.getAvailableInputTypes()
                }, 'getAvailableInputTypesResponse')
                return response.availableInputTypes;
            }
            default: throw new Error('android: not implemented' + name)
            }
        }
    }

    return transport
}
