import { tryCreateRuntimeConfiguration } from '@duckduckgo/content-scope-scripts'
import { getMainTypeFromType, getSubtypeFromType } from '../Form/matching'

import {
    CloseAutofillParent,
    GetAutofillCredentials, GetAutofillData, GetAutofillInitData,
    GetAvailableInputTypes, GetRuntimeConfiguration,
    GetSelectedCredentials,
    ShowAutofillParent, StoreFormData
} from './messages'

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
        const data = await new GetRuntimeConfiguration(null, this.transport).send()
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
        return new GetAvailableInputTypes(null, this.transport).send()
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

        return new GetAutofillData(payload, this.transport).send()
    }

    /**
     * @returns {Promise<InboundPMData>}
     */
    async getAutofillInitData () {
        return new GetAutofillInitData(null, this.transport).send()
    }

    /**
     * @public
     * @param {DataStorageObject} data
     */
    async storeFormData (data) {
        return new StoreFormData(data, this.transport).send()
    }

    /**
     * @param {Schema.ShowAutofillParentRequest} parentArgs
     * @returns {Promise<void>}
     */
    async showAutofillParent (parentArgs) {
        await new ShowAutofillParent(parentArgs, this.transport).send()
    }

    /**
     * todo(Shane): Schema for this?
     * @deprecated This was a port from the macOS implementation so the API may not be suitable for all
     * @returns {Promise<any>}
     */
    async getSelectedCredentials () {
        return new GetSelectedCredentials(null, this.transport).send()
    }

    /**
     * @param {string|number} id
     * @returns {APIResponseSingle<CredentialsObject>}
     */
    async getAutofillCredentials (id) {
        const response = await new GetAutofillCredentials(id, this.transport).send()
        // re-wrapping for now.
        return { success: response }
    }

    /**
     * @returns {Promise<any>}
     */
    async closeAutofillParent () {
        await new CloseAutofillParent(null, this.transport).send()
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
