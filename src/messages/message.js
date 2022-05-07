/**
 * @template Req,Res
 */
export class Message {
    /**
     * @type {any}
     */
    reqValidator = null;
    /**
     * @type {any}
     */
    resValidator = null;

    /**
     * String representation of this message's name
     * @type {string}
     */
    name = 'unknown'


    /**
     * @type {Req}
     */
    data

    /**
     * @param {Req} data
     */
    constructor (data) {
        this.data = this._validate(data, this.reqValidator)
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
     * @returns {Res}
     */
    runtimeResponse (object) {
        if (this.resValidator && !this.reqValidator?.(object)) {
            this.throwError(this.resValidator?.errors)
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
}
