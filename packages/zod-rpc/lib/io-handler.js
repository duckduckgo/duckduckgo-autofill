/**
 * Platforms should only need to implement this `send` method
 */
export class RPCTransport {
    /**
     * @param {import("./zod-rpc").ZodRPC} _rpc
     * @returns {Promise<any>}
     */
    async send (_rpc) {
        return undefined
    }
}

/**
 * This is the base Sender class that platforms can will implement.
 *
 * Note: The 'handle' method must be implemented, unless you also implement 'send'
 */
export class IOHandler {
    /** @type {RPCTransport} */
    transport;
    /** @param {RPCTransport} transport */
    constructor (transport) {
        this.transport = transport
    }
    /**
     * @template {import("./zod-rpc").ZodRPC} P
     * @param {P} rpc
     * @returns {Promise<ReturnType<P['validateResult']>['success']>}
     */
    async request (rpc) {
        rpc.validateParams()
        let result = await this.transport.send(rpc)
        let processed = rpc.preResultValidation(result)
        return rpc.validateResult(processed)
    }
    /**
     * @template {import("./zod-rpc").ZodRPC} P
     * @param {P} rpc
     * @returns {Promise<void>}
     */
    async notify (rpc) {
        rpc.validateParams()
        await this.transport.send(rpc)
    }
}
