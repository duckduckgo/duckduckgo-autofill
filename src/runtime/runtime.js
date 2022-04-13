import { createTransport as createAppleTransport } from '../appleDeviceUtils/transport.apple'
import { createTransport as createAndroidTransport } from '../appleDeviceUtils/transport.android'
import { createTransport as createExtensionTransport } from '../appleDeviceUtils/transport.extension'
import { createTransport as createWindowsTransport } from '../appleDeviceUtils/transport.windows'

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
        return this.transport.send('getRuntimeConfiguration')
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
