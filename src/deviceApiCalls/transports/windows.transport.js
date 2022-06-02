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
 * @returns {Promise<any>}
 */
export function waitForWindowsResponse (responseId) {
    console.log('Windows.waitForWindowsResponse', responseId)
    return new Promise((resolve) => {
        const handler = event => {
            console.log('📩 windows, event.origin', [event.origin, JSON.stringify(event.data)])
            if (!event.data) {
                console.warn('data absent from message')
                return
            }
            if (event.data.type === responseId) {
                resolve(event.data)
                window.chrome.webview.removeEventListener('message', handler)
            }
        }
        window.chrome.webview.addEventListener('message', handler)
    })
}
