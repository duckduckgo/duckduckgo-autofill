import {sendAndWaitForAnswer} from '../autofill-utils'

/**
 * @param {GlobalConfig} _globalConfig
 * @returns {RuntimeTransport}
 */
export function createTransport (_globalConfig) {
    /** @type {RuntimeTransport} */
    const transport = {
        async send (name, data) {
            console.log('📲 android:', name, data)
            switch (name) {
            case 'getRuntimeConfiguration': {
                const string = window.BrowserAutofill.getRuntimeConfiguration()
                console.log('\t📲', string)
                return JSON.parse(string)
            }
            case 'getAvailableInputTypes': {
                const string = window.BrowserAutofill.getAvailableInputTypes()
                console.log('\t📲', string)
                return JSON.parse(string)
            }
            case 'getAutofillData': {
                const response = sendAndWaitForAnswer(() => {
                    return window.BrowserAutofill.getAutofillData(JSON.stringify(data))
                }, 'getAutofillDataResponse')
                console.log('\t📲', JSON.stringify(response))
                return response
            }
            case 'storeFormData': {
                return window.BrowserAutofill.storeFormData(JSON.stringify(data))
            }
            default:
                throw new Error('android: not implemented: ' + name)
            }
        }
    }

    return transport
}
