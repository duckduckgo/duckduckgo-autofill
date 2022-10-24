import {DeviceApiTransport} from '../../../packages/device-api/index.js'

/**
 * @typedef {import('../../../packages/device-api/lib/device-api').CallOptions} CallOptions
 * @typedef {import("../../../packages/device-api").DeviceApiCall} DeviceApiCall
 */
export class WindowsTransport extends DeviceApiTransport {
    async send (deviceApiCall, options) {
        if (deviceApiCall.id) {
            return windowsTransport(deviceApiCall, options)
                .withResponse(deviceApiCall.id)
        }
        return windowsTransport(deviceApiCall, options)
    }
}

/**
 * @param {DeviceApiCall} deviceApiCall
 * @param {CallOptions} [options]
 */
function windowsTransport (deviceApiCall, options) {
    windowsInteropPostMessage({
        Feature: 'Autofill',
        Name: deviceApiCall.method,
        Data: deviceApiCall.params
    })
    return {
        /**
         * Sends a message and returns a Promise that resolves with the response
         * @param responseId
         * @returns {Promise<*>}
         */
        withResponse (responseId) {
            return waitForWindowsResponse(responseId, options)
        }
    }
}
/**
 * @param {string} responseId
 * @param {CallOptions} [options]
 * @returns {Promise<any>}
 */
function waitForWindowsResponse (responseId, options) {
    return new Promise((resolve, reject) => {
        // if already aborted, reject immediately
        if (options?.signal?.aborted) {
            return reject(new DOMException('Aborted', 'AbortError'))
        }
        let teardown

        // The event handler
        const handler = event => {
            console.log(`📩 windows, ${window.location.href}`, [event.origin, JSON.stringify(event.data)])
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
            teardown()
            reject(new DOMException('Aborted', 'AbortError'))
        }

        // setup
        windowsInteropAddEventListener('message', handler)
        options?.signal?.addEventListener('abort', abortHandler)

        teardown = () => {
            windowsInteropRemoveEventListener('message', handler)
            options?.signal?.removeEventListener('abort', abortHandler)
        }
    })
}
