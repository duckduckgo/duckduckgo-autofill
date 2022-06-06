import {DeviceApiTransport} from '../../../packages/device-api'

export class WindowsTransport extends DeviceApiTransport {
    async send (deviceApiCall) {
        if (deviceApiCall.id) {
            return windowsTransport(deviceApiCall)
                .withResponse(deviceApiCall.id)
        }
        return windowsTransport(deviceApiCall)
    }
}

/**
 * @param {import("../../../packages/device-api").DeviceApiCall} deviceApiCall
 */
function windowsTransport (deviceApiCall) {
    if (deviceApiCall.params) {
        window.chrome.webview.postMessage({
            Feature: 'Autofill',
            Name: deviceApiCall.method,
            Data: deviceApiCall.params
        })
    } else {
        window.chrome.webview.postMessage({
            Feature: 'Autofill',
            Name: deviceApiCall.method,
            Data: deviceApiCall.params
        })
    }
    return {
        /**
         * Sends a message and returns a Promise that resolves with the response
         * @param responseId
         * @returns {Promise<*>}
         */
        withResponse (responseId) {
            return waitForWindowsResponse(responseId)
        }
    }
}
/**
 * @param {string} responseId
 * @param {AbortSignal} [signal] - optional abort signal for cancelling the current request
 * @returns {Promise<any>}
 */
export function waitForWindowsResponse (responseId, signal) {
    return new Promise((resolve, reject) => {
        // if already aborted, reject immediately
        if (signal?.aborted) {
            return reject(new DOMException('Aborted', 'AbortError'));
        }
        let teardown;

        // The event handler
        const handler = event => {
            console.log('📩 windows, event.origin', [event.origin, JSON.stringify(event.data)])
            if (!event.data) {
                console.warn('data absent from message')
                return
            }
            if (event.data.type === responseId) {
                teardown()
                resolve(event.data)
            }
        }

        // what to do if this promise is aborted
        const abortHandler = () => {
            teardown();
            reject(new DOMException('Aborted', 'AbortError'));
        };

        // setup
        window.chrome.webview.addEventListener('message', handler)
        signal?.addEventListener('abort', abortHandler)

        teardown = () => {
            window.chrome.webview.removeEventListener('message', handler)
            signal?.removeEventListener('abort', abortHandler)
        }
    })
}
