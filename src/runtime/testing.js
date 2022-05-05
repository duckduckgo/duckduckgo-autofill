/**
 * @template Req,Res
 */
export class Message {
    /**
     * @type {import("ajv").ValidateFunction | null}
     */
    reqValidator = null;
    /**
     * @type {import("ajv").ValidateFunction | null}
     */
    resValidator = null;

    /**
     * String representation of this message's name
     * @type {string}
     */
    name = 'unknown'

    /** @type {GenericRuntime} */
    transport

    /**
     * @type {Req}
     */
    data

    /**
     * @param {Req} data
     * @param transport
     */
    constructor (data, transport) {
        this.data = this._validate(data, this.reqValidator)
        this.transport = transport
    }

    /**
     * @param {any} payload
     * @param {import("ajv").ValidateFunction | null} validator
     */
    _validate (payload, validator) {
        if (validator && !validator?.(payload)) {
            this.throwError(validator?.['errors'])
        }
        return payload
    }

    /**
     * @param {import("ajv").ValidateFunction['errors']} errors
     */
    throwError (errors) {
        if (errors) {
            for (let error of errors) {
                console.error(error.message)
                console.error(error)
            }
        }
        throw new Error('SSSchema validation errors for ' + this.constructor.name)
    }

    /**
     * @param {any} object
     * @param {import("ajv").ValidateFunction | null} [validator]
     */
    _runtimeResponse (object, validator) {
        if (validator && !validator?.(object)) {
            return this.throwError(validator?.errors)
        }
        if ('data' in object) {
            console.warn('response had `data` property. Please migrate to `success`')
            return object.data
        }
        if ('success' in object) {
            return object.success
        }
        throw new Error('unreachable. Response did not contain `success` or `data`')
    }

    /**
     * @returns {Promise<Res>}
     */
    async send () {
        let response
        if (this.data) {
            response = await this.transport.send(this.name, this.data)
        } else {
            response = await this.transport.send(this.name)
        }
        return this._runtimeResponse(response, this.resValidator)
    }
}
