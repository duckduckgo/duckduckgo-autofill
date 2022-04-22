import schema from '../schema/response.getAutofillData.schema.json'
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
                const response = sendAndWaitForAndroidAnswer(() => {
                    return window.BrowserAutofill.getAutofillData(JSON.stringify(data))
                }, schema.properties.type.const)
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

/**
 * Sends a message and returns a Promise that resolves with the response
 *
 * NOTE: This is deliberately different to the one from autofill-utils.,ks for android
 * as we're not 100% sure on the post message implementation yet.
 *
 * @param {Function} fn - a fn to call or an object to send via postMessage
 * @param {string} expectedResponse - the name of the response
 * @returns {Promise<*>}
 */
function sendAndWaitForAndroidAnswer (fn, expectedResponse) {
    fn()
    return new Promise((resolve) => {
        const handler = e => {
            // if (e.origin !== window.origin) {
            //     console.log(`❌ origin-mismatch e.origin(${e.origin}) !== window.origin(${window.origin})`);
            //     return
            // }
            console.warn('event.origin check was disabled on Android.')
            if (!e.data) {
                console.log('❌ event.data missing')
                return
            }
            if (typeof e.data !== 'string') {
                console.log('❌ event.data was not a string. Expected a string so that it can be JSON parsed')
                return
            }
            try {
                let data = JSON.parse(e.data)
                if (data.type === expectedResponse) {
                    window.removeEventListener('message', handler)
                    return resolve(data)
                }
                console.log(`❌ event.data.type didnt match '${expectedResponse}'`, JSON.stringify(data))
            } catch (e) {
                window.removeEventListener('message', handler)
                console.log('❌ Could not JSON.parse the response')
            }
        }
        window.addEventListener('message', handler)
    })
}
