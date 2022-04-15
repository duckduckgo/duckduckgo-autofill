import { createTransport as createAppleTransport } from '../transports/transport.apple'
import { createTransport as createAndroidTransport } from '../transports/transport.android'
import { createTransport as createExtensionTransport } from '../transports/transport.extension'
import { createTransport as createWindowsTransport } from '../transports/transport.windows'
import { tryCreateRuntimeConfiguration } from '@duckduckgo/content-scope-scripts'

import {fromPlatformConfig} from '../settings/settings'
import {getMainTypeFromType, getSubtypeFromType} from '../Form/matching'

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
        // todo(Shane): Schema validation here
        const response = await this.transport.send('getRuntimeConfiguration')
        const data = runtimeResponse(response)

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
     * @returns {Promise<RuntimeMessages['getAvailableInputTypes']['response']['success']>}
     */
    async getAvailableInputTypes () {
        const response = await this.transport.send('getAvailableInputTypes')
        return runtimeResponse(response)
    }

    // /**
    //  * @template {Names} T
    //  * @param {T} name
    //  * @param {RuntimeMessages[T]['request']} data
    //  */
    // sender(name, data) {
    //     switch (name) {
    //     case 'getAvailableInputTypes': {
    //         const is = (data === null)
    //     }
    //     }
    // }

    /**
     * @param {GetAutofillDataArgs} input
     * @return {Promise<IdentityObject|CredentialsObject|CreditCardObject>}
     */
    async getAutofillData (input) {
        const mainType = getMainTypeFromType(input.inputType)
        const subType = getSubtypeFromType(input.inputType)
        const payload = {
            inputType: input.inputType,
            mainType,
            subType
        }
        const response = await this.transport.send('getAutofillData', payload)
        const data = runtimeResponse(response)
        return data
    }

    /**
     * @param {DataStorageObject} data
     */
    async storeFormData (data) {
        return this.transport.send('storeFormData', data)
    }

    /**
     * @returns {Promise<import("../settings/settings").AutofillSettings>}
     */
    async getAutofillSettings (platformConfig) {
        return fromPlatformConfig(platformConfig)
    }
}

function createRuntime (config) {
    const transport = selectTransport(config)
    return new Runtime(config, transport)
}

/**
 * The runtime has to decide on a transport, *before* we have a 'device'.
 *
 * This is because an initial message to retrieve the platform configuration might be needed
 *
 * @param {GlobalConfig} globalConfig
 * @returns {RuntimeTransport}
 */
function selectTransport (globalConfig) {
    if (typeof globalConfig.userPreferences?.platform?.name === 'string') {
        switch (globalConfig.userPreferences?.platform?.name) {
        case 'ios': return createAppleTransport(globalConfig)
        case 'macos': return createAppleTransport(globalConfig)
        default: throw new Error('selectTransport unimplemented!')
        }
    }

    if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            return createAndroidTransport(globalConfig)
        }
        console.warn('should never get here...')
        return createAppleTransport(globalConfig)
    }

    if (globalConfig.isWindows) {
        return createWindowsTransport(globalConfig)
    }

    // falls back to extension... is this still the best way to determine this?
    return createExtensionTransport(globalConfig)
}

/**
 * @param {APIResponseSingle<any>} object
 */
function runtimeResponse (object) {
    if ('data' in object) {
        console.warn('response had `data` property. Please migrate to `success`')
        return object.data
    }
    if ('success' in object) {
        return object.success
    }
    throw new Error('unreachable. Response did not contain `success` or `data`')
}

export { Runtime, createRuntime, runtimeResponse }
