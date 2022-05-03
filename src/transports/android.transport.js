import getAutofillData from '../schema/response.getAutofillData.schema.json'
import getAvailableInputTypes from '../schema/response.getAvailableInputTypes.schema.json'
import getRuntimeConfiguration from '../schema/response.getRuntimeConfiguration.schema.json'
/**
 * @param {GlobalConfig} _globalConfig
 * @returns {RuntimeTransport}
 */
export function createTransport (_globalConfig) {
    return new AndroidTransport()
}

/**
 * @implements {RuntimeTransport}
 */
class AndroidTransport {
    /**
     * @param {keyof RuntimeMessages} name
     * @param data
     * @returns {Promise<void|*>}
     */
    async send (name, data) {
        switch (name) {
        case 'getRuntimeConfiguration': {
            window.BrowserAutofill.getRuntimeConfiguration()
            return waitForResponse(getRuntimeConfiguration.properties.type.const)
        }
        case 'getAvailableInputTypes': {
            window.BrowserAutofill.getAvailableInputTypes()
            return waitForResponse(getAvailableInputTypes.properties.type.const)
        }
        case 'getAutofillData': {
            window.BrowserAutofill.getAutofillData(JSON.stringify(data))
            return waitForResponse(getAutofillData.properties.type.const)
        }
        case 'storeFormData': {
            return window.BrowserAutofill.storeFormData(JSON.stringify(data))
        }
        default:
            throw new Error('android: not implemented: ' + name)
        }
    }
}

/**
 * Sends a message and returns a Promise that resolves with the response
 *
 * @param {string} expectedResponse - the name of the response
 * @returns {Promise<*>}
 */
function waitForResponse (expectedResponse) {
    return new Promise((resolve) => {
        const handler = e => {
            // todo(Shane): Allow blank string, try sandboxed iframe. allow-scripts
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
                console.log(`❌ event.data.type was '${data.type}', which didnt match '${expectedResponse}'`, JSON.stringify(data))
            } catch (e) {
                window.removeEventListener('message', handler)
                console.log('❌ Could not JSON.parse the response')
            }
        }
        window.addEventListener('message', handler)
    })
}
