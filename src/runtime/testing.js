/**
 * @template T,U
 */
export class Message {
    /**
     * @type {{
     *   request: import("ajv").ValidateFunction | null;
     *   response: import("ajv").ValidateFunction | null;
     * }}
     */
    validators = {request: null, response: null};

    /**
     * String representation of this message's name
     * @type {string}
     */
    name = "unknown"

    /**
     * @param payload
     * @returns {T}
     */
    request(payload) {
        if (!this.validators.request?.(payload)) {
            this.throwError(this.validators.request?.['errors'])
        }
        return payload;
    }

    /**
     * @param payload
     * @returns {U}
     */
    response(payload) {
        if (!this.validators.response?.(payload)) {
            this.throwError(this.validators.response?.['errors'])
        }
        return payload;
    }

    /**
     * @param {GenericRuntimeResponse<any>} object
     * @param {import("ajv").ValidateFunction} [validator]
     */
    runtimeResponse (object, validator) {
        if (!validator?.(object)) {
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
     * @param {import("ajv").ValidateFunction['errors']} errors
     */
    throwError (errors) {
        if (errors) {
            for (let error of errors) {
                console.error(error.message)
                console.error(error)
            }
        }
        throw new Error('Schema validation errors for ' + this.constructor.name)
    }

    static from() {

    }
}
