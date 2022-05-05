import { tryCreateRuntimeConfiguration } from '@duckduckgo/content-scope-scripts'

import {getMainTypeFromType, getSubtypeFromType} from '../Form/matching'
import validators from '../schema/validators.cjs'

/**
 * The Runtime is the centralised place for dealing with messages.
 *
 * It should validate incoming arguments, as well as outputs.
 *
 * Note: This runtime should not encode information about how to transmit
 * data, that's a job for the provided RuntimeTransport
 */
class Runtime {
    /** @type {RuntimeTransport} */
    transport;

    /**
     * @param {GlobalConfig} globalConfig
     * @param {RuntimeTransport} transport
     */
    constructor (globalConfig, transport) {
        this.globalConfig = globalConfig
        this.transport = transport
    }

    /**
     * @public
     * @returns {import("@duckduckgo/content-scope-scripts").RuntimeConfiguration}
     */
    async getRuntimeConfiguration () {
        const response = await this.transport.send('getRuntimeConfiguration')
        const validator = validators['#/definitions/GetRuntimeConfigurationResponse']

        const data = runtimeResponse(
            response,
            'getRuntimeConfiguration',
            // @ts-ignore
            validator
        )
        const {config, errors} = tryCreateRuntimeConfiguration(data)

        if (errors.length) {
            for (let error of errors) {
                console.log(error.message, error)
            }
            throw new Error(`${errors.length} errors prevented global configuration from being created.`)
        }

        return config
    }

    /**
     * @public
     * @returns {Promise<AvailableInputTypes>}
     */
    async getAvailableInputTypes () {
        const response = await this.transport.send('getAvailableInputTypes')
        const validator = validators['#/definitions/GetAvailableInputTypesResponse']
        return runtimeResponse(
            response,
            'getAvailableInputTypes',
            // @ts-ignore
            validator
        )
    }

    /**
     * @public
     * @param {GetAutofillDataArgs} input
     * @return {Promise<IdentityObject|CredentialsObject|CreditCardObject>}
     */
    async getAutofillData (input) {
        const mainType = getMainTypeFromType(input.inputType)
        const subType = getSubtypeFromType(input.inputType)

        if (mainType === 'unknown') {
            throw new Error('unreachable, should not be here if (mainType === "unknown")')
        }

        /** @type {Schema.GetAutofillDataRequest} */
        const payload = {
            inputType: input.inputType,
            mainType,
            subType
        }

        const validator = validators['#/definitions/GetAutofillDataRequest']
        if (!validator?.(payload)) {
            throwError(validator?.['errors'], 'getAutofillDataRequest')
        }
        const response = await this.transport.send('getAutofillData', payload)
        const data = runtimeResponse(response, 'getAutofillData',
            // @ts-ignore
            validators['#/definitions/GetAutofillDataResponse']
        )
        return data
    }

    /**
     * @returns {Promise<InboundPMData>}
     */
    async getAutofillInitData () {
        const response = await this.transport.send('getAutofillInitData')
        return runtimeResponse(response, 'getAutofillInitData',
            // @ts-ignore
            validators['#/definitions/GetAutofillInitDataResponse']
        )
    }

    /**
     * @public
     * @param {DataStorageObject} data
     */
    async storeFormData (data) {
        const validator = validators['#/definitions/StoreFormDataRequest']
        if (!validator?.(data)) {
            throwError(validator?.['errors'], 'storeFormData')
        }
        return this.transport.send('storeFormData', data)
    }

    /**
     * @param {Schema.ShowAutofillParentRequest} parentArgs
     * @returns {Promise<void>}
     */
    async showAutofillParent (parentArgs) {
        const validator = validators['#/definitions/ShowAutofillParentRequest']
        if (!validator?.(parentArgs)) {
            throwError(validator?.['errors'], 'showAutofillParent')
        }
        await this.transport.send('showAutofillParent', parentArgs)
    }

    /**
     * todo(Shane): Schema for this?
     * @deprecated This was a port from the macOS implementation so the API may not be suitable for all
     * @returns {Promise<any>}
     */
    async getSelectedCredentials () {
        return this.transport.send('getSelectedCredentials')
    }

    /**
     * @param {string|number} id
     */
    getAutofillCredentials (id) {
        return this.transport.send('getAutofillCredentials', { id: String(id) })
    }

    /**
     * @returns {Promise<any>}
     */
    async closeAutofillParent () {
        return this.transport.send('closeAutofillParent')
    }
}

/**
 * @param {GlobalConfig} config
 * @param {RuntimeTransport} transport
 * @returns {Runtime}
 */
function createRuntime (config, transport) {
    return new Runtime(config, transport)
}

/**
 * @param {GenericRuntimeResponse<any>} object
 * @param {string} [name]
 * @param {import("ajv").ValidateFunction} [validator]
 */
function runtimeResponse (object, name, validator) {
    if (!validator?.(object)) {
        return throwError(validator?.errors, name || 'unknown')
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
 * @param {string} name
 */
function throwError (errors, name) {
    if (errors) {
        for (let error of errors) {
            console.error(error.message)
            console.error(error)
        }
    }
    throw new Error('Schema validation errors for ' + name)
}

export { Runtime, createRuntime, runtimeResponse }
