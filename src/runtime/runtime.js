import { createTransport as createAppleTransport } from '../transports/transport.apple'
import { createTransport as createAndroidTransport } from '../transports/transport.android'
import { createTransport as createExtensionTransport } from '../transports/transport.extension'
import { createTransport as createWindowsTransport } from '../transports/transport.windows'
import { tryCreateRuntimeConfiguration } from '@duckduckgo/content-scope-scripts'

import {fromPlatformConfig} from '../settings/settings'

class Runtime {
    /** @type {Transport} */
    transport;

    /**
     * @param {GlobalConfig} globalConfig
     * @param {Transport} transport
     */
    constructor (globalConfig, transport) {
        this.globalConfig = globalConfig
        this.transport = transport
    }

    /**
     * @returns {import("@duckduckgo/content-scope-scripts").RuntimeConfiguration}
     */
    async getRuntimeConfiguration () {
        // todo(Shane): Schema validation here
        const response = await this.transport.send('getRuntimeConfiguration')
        const data = runtimeResponse(response);

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
     * @returns {Promise<AvailableInputTypes>}
     */
    async getAvailableInputTypes () {
        const response = await this.transport.send('getAvailableInputTypes')
        return runtimeResponse(response);
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
 * @returns {Transport}
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
function runtimeResponse(object) {
    if ('data' in object) {
        console.warn('response had `data` property. Please migrate to `success`')
        return object.data;
    }
    if ('success' in object) {
        return object.success;
    }
    throw new Error('unreachable. Response did not contain `success` or `data`')
}

export { Runtime, createRuntime, runtimeResponse }
