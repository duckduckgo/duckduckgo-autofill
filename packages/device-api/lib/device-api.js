/**
 * Platforms should only need to implement this `send` method
 */
export class DeviceApiTransport {
    /**
     * @param {import("./device-api-call.js").DeviceApiCall} _deviceApiCall
     * @param {CallOptions} [_options]
     * @returns {Promise<any>}
     */
    async send (_deviceApiCall, _options) {
        return undefined
    }
}

/**
 * This is the base Sender class that platforms can will implement.
 *
 * Note: The 'handle' method must be implemented, unless you also implement 'send'
 *
 * @typedef CallOptions
 * @property {AbortSignal} [signal]
 */
export class DeviceApi {
    /** @type {DeviceApiTransport} */
    transport;
    /** @param {DeviceApiTransport} transport */
    constructor (transport) {
        this.transport = transport
    }
    /**
     * @template {import("./device-api-call").DeviceApiCall} D
     * @param {D} deviceApiCall
     * @param {CallOptions} [options]
     * @returns {Promise<ReturnType<D['validateResult']>['success']>}
     */
    async request (deviceApiCall, options) {
        deviceApiCall.validateParams()
        let result = await this.transport.send(deviceApiCall, options)
        let processed = deviceApiCall.preResultValidation(result)
        return deviceApiCall.validateResult(processed)
    }
    /**
     * @template {import("./device-api-call").DeviceApiCall} P
     * @param {P} deviceApiCall
     * @param {CallOptions} [options]
     * @returns {Promise<void>}
     */
    async notify (deviceApiCall, options) {
        deviceApiCall.validateParams()
        return this.transport.send(deviceApiCall, options)
    }
}
