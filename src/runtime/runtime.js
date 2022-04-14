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
    async getRuntimeConfiguration() {
        // todo(Shane): Schema validation here
        const { data } = await this.transport.send('getRuntimeConfiguration')
        if (!data) throw new Error(`getRuntimeConfiguration didn't return 'data'`);

        const {config, errors} = tryCreateRuntimeConfiguration(data);

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
    async getAvailableInputTypes() {
        const { data } = await this.transport.send('getAvailableInputTypes')
        if (!data) throw new Error(`getAvailableInputTypes didn't return 'data'`);
        return data;
    }

    /**
     * @returns {Promise<import("../settings/settings").AutofillSettings>}
     */
    async getAutofillSettings(platformConfig) {
        return fromPlatformConfig(platformConfig)
    }
}

function createRuntime(config) {
    const transport = selectTransport(config)
    return new Runtime(config, transport);
}

/**
 * The runtime has to decide on a transport, *before* we have a 'device'.
 *
 * This is because an initial message to retrieve the platform configuration might be needed
 *
 * @param {GlobalConfig} globalConfig
 * @returns {Transport}
 */
function selectTransport(globalConfig) {
    if (typeof globalConfig.userPreferences?.platform?.name === "string") {
        switch (globalConfig.userPreferences?.platform?.name) {
        case "ios": return createAppleTransport(globalConfig);
        case "macos": return createAppleTransport(globalConfig);
        default: throw new Error('selectTransport unimplemented!')
        }
    }

    if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            return createAndroidTransport(globalConfig);
        }
        console.warn('should never get here...');
        return createAppleTransport(globalConfig);
    }

    if (globalConfig.isWindows) {
        return createWindowsTransport(globalConfig);
    }

    // falls back to extension... is this still the best way to determine this?
    return createExtensionTransport(globalConfig);
}

export { Runtime, createRuntime }
