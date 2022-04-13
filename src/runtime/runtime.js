import { createTransport as createAppleTransport } from '../appleDeviceUtils/appleDeviceUtils'
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
     * @returns {import("@duckduckgo/content-scope-scripts").Config}
     */
    async getPlatformConfiguration() {
        return this.transport.send('getPlatformConfiguration')
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
 * @param {GlobalConfig} config
 * @returns {Transport}
 */
function selectTransport(config) {
    if (typeof config.userPreferences?.platform?.name === "string") {
        switch (config.userPreferences?.platform?.name) {
        case "ios": return createAppleTransport(config);
        default: throw new Error('selectTransport unimplemented!')
        }
    }
    throw new Error('todo: other decisions here where config.userPreferences is not present immediately!')
}

export { Runtime, createRuntime }
