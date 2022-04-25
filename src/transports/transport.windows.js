// import getAutofillData from '../schema/response.getAutofillData.schema.json'
import getAutofillInitData from '../schema/response.getAutofillInitData.schema.json'
import getAvailableInputTypes from '../schema/response.getAvailableInputTypes.schema.json'
import getRuntimeConfiguration from '../schema/response.getRuntimeConfiguration.schema.json'

/**
 * @param {GlobalConfig} _globalConfig
 * @returns {RuntimeTransport}
 */
export function createTransport (_globalConfig) {
    /** @type {RuntimeTransport} */
    const transport = {
        async send (name, data) {
            console.log('💻 windows:', name, data)
            switch (name) {
            case 'getRuntimeConfiguration': {
                return sendAndWait(() => {
                    // todo(Shane): How to prevent these strings...
                    return window.chrome.webview.postMessage({ type: 'getRuntimeConfiguration' })
                }, getRuntimeConfiguration.properties.type.const)
            }
            case 'getAvailableInputTypes': {
                return sendAndWait(() => {
                    // todo(Shane): How to prevent these strings...
                    return window.chrome.webview.postMessage({ type: 'getAvailableInputTypes' })
                }, getAvailableInputTypes.properties.type.const)
            }
            case 'getAutofillInitData': {
                return sendAndWait(() => {
                    // todo(Shane): How to prevent these strings...
                    return window.chrome.webview.postMessage({ type: 'getAutofillInitData' })
                }, getAutofillInitData.properties.type.const)
            }
            default: throw new Error('windows: not implemented: ' + name)
            }
        }
    }
    return transport
}

/**
 * Sends a message and returns a Promise that resolves with the response
 * @param {()=>void} msgOrFn - a fn to call or an object to send via postMessage
 * @param {String} expectedResponse - the name of the response
 * @returns {Promise<*>}
 */
function sendAndWait (msgOrFn, expectedResponse) {
    msgOrFn()
    return new Promise((resolve) => {
        const handler = event => {
            if (event.origin !== window.origin) {
                console.warn(`origin mis-match. window.origin: ${window.origin}, event.origin: ${event.origin}`)
                return
            }
            if (!event.data) {
                console.warn('data absent from message')
                return
            }
            if (event.data.type !== expectedResponse) {
                console.warn(`data.type mis-match. Expected: ${expectedResponse}, received: ${event.data.type}`)
                return
            }
            // at this point we're confident we have the correct message type
            console.log('💻 windows:', expectedResponse, event.data);
            resolve(event.data)
            window.chrome.webview.removeEventListener('message', handler)
        }
        window.chrome.webview.addEventListener('message', handler, {once: true})
    })
}
