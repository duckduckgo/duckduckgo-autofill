import {sendAndWaitForAnswer} from '../autofill-utils'

/**
 * @param {GlobalConfig} _globalConfig
 * @returns {Transport}
 */
export function createTransport (_globalConfig) {

    /** @type {Transport} */
    const transport = {
        async send (name, data) {
            console.log('📲 windows:', name, data);
            switch (name) {
            case "getRuntimeConfiguration": {
                return sendAndWaitForAnswer(() => {
                    return window.chrome.webview.postMessage({ commandName: 'GetRuntimeConfiguration' })
                }, 'GetRuntimeConfigurationResponse')
            }
            case "getAvailableInputTypes": {
                return await sendAndWaitForAnswer(() => {
                    return window.chrome.webview.postMessage({ commandName: 'GetAvailableInputTypes' })
                }, 'GetAvailableInputTypesResponse')
            }
            default: throw new Error('windows: not implemented' + name)
            }
        }
    }
    return transport
}
