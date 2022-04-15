import {sendAndWaitForAnswer} from '../autofill-utils'

/**
 * @param {GlobalConfig} _globalConfig
 * @returns {Transport}
 */
export function createTransport (_globalConfig) {
    /** @type {Transport} */
    const transport = {
        async send (name, data) {
            console.log('📲 android:', name, data)
            switch (name) {
            case 'getRuntimeConfiguration': {
                return sendAndWaitForAnswer(() => {
                    return window.BrowserAutofill.getRuntimeConfiguration()
                }, 'getRuntimeConfigurationResponse')
            }
            case 'getAvailableInputTypes': {
                return sendAndWaitForAnswer(() => {
                    return window.BrowserAutofill.getAvailableInputTypes()
                }, 'getAvailableInputTypesResponse')
            }
            case 'getAutofillData': {
                return sendAndWaitForAnswer(() => {
                    return window.BrowserAutofill.getAutofillData(data)
                }, 'getAutofillDataResponse')
            }
            default: throw new Error('android: not implemented: ' + name)
            }
        }
    }

    return transport
}
