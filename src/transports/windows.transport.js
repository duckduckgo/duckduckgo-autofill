// import getAutofillData from '../schema/response.getAutofillData.schema.json'
import getAutofillInitDataResponse from '../schema/response.getAutofillInitData.schema.json'
import getAvailableInputTypes from '../schema/response.getAvailableInputTypes.schema.json'
import getRuntimeConfiguration from '../schema/response.getRuntimeConfiguration.schema.json'

/**
 * @implements {RuntimeTransport}
 */
class WindowsTransport {
    async send (name, data) {
        switch (name) {
        case 'getRuntimeConfiguration': {
            return windowsTransport(name)
                .withResponse(getRuntimeConfiguration.properties.type.const)
        }
        case 'getAvailableInputTypes': {
            return windowsTransport(name)
                .withResponse(getAvailableInputTypes.properties.type.const)
        }
        case 'getAutofillInitData': {
            return windowsTransport(name)
                .withResponse(getAutofillInitDataResponse.properties.type.const)
        }
        case 'storeFormData': {
            return windowsTransport('storeFormData', data)
        }
        default: throw new Error('windows: not implemented: ' + name)
        }
    }
}

/**
 * @param {GlobalConfig} _globalConfig
 * @returns {RuntimeTransport}
 */
export function createTransport (_globalConfig) {
    return new WindowsTransport()
}

/**
 * @param {Names} name
 * @param {any} [data]
 */
function windowsTransport (name, data) {
    if (data) {
        window.chrome.webview.postMessage({ type: name, data: data })
    } else {
        window.chrome.webview.postMessage({ type: name })
    }
    return {
        /**
         * Sends a message and returns a Promise that resolves with the response
         * @param responseName
         * @returns {Promise<*>}
         */
        withResponse (responseName) {
            return new Promise((resolve) => {
                const handler = event => {
                    /* if (event.origin !== window.origin) {
                        console.warn(`origin mis-match. window.origin: ${window.origin}, event.origin: ${event.origin}`)
                        return
                    } */
                    if (!event.data) {
                        console.warn('data absent from message')
                        return
                    }
                    if (event.data.type !== responseName) {
                        console.warn(`data.type mis-match. Expected: ${responseName}, received: ${event.data.type}`)
                        return
                    }
                    // at this point we're confident we have the correct message type
                    console.log('💻 windows:', responseName, event.data)
                    resolve(event.data)
                    window.chrome.webview.removeEventListener('message', handler)
                }
                window.chrome.webview.addEventListener('message', handler, {once: true})
            })
        }
    }
}