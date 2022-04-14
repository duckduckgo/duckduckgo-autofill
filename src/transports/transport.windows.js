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
                const r = await sendAndWait(() => {
                    return window.chrome.webview.postMessage({ commandName: 'GetRuntimeConfiguration' })
                }, 'GetRuntimeConfigurationResponse')
                return r;
            }
            case "getAvailableInputTypes": {
                return await sendAndWait(() => {
                    return window.chrome.webview.postMessage({ commandName: 'GetAvailableInputTypes' })
                }, 'GetAvailableInputTypesResponse')
            }
            default: throw new Error('windows: not implemented' + name)
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
                console.warn('data absent from message');
                return
            }
            if (event.data.type !== expectedResponse) {
                console.warn(`data.type mis-match. Expected: ${expectedResponse}, received: ${event.data.type}`);
                return;
            }
            // at this point we're confident we have the correct message type
            resolve(event.data)
            window.chrome.webview.removeEventListener('message', handler);
        }
        window.chrome.webview.addEventListener('message', handler, {once: true});
    })
}
