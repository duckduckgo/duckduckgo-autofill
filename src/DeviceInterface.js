import { createGlobalConfig } from './config.js'
import {createTransport} from './deviceApiCalls/transports/transports.js'
import {DeviceApi} from '../packages/device-api/index.js'
import {Settings} from './Settings.js'
import InterfacePrototype from "./DeviceInterface/InterfacePrototype";

function createDevice () {
    const globalConfig = createGlobalConfig()
    /** @type {import('./DeviceInterface/InterfacePrototype').Ctx} */
    let ctx = "extension"
    if (globalConfig.isWindows) {
        if (globalConfig.isTopFrame) {
            ctx = "windows-overlay"
        } else {
            ctx = "windows"
        }
    } else if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            ctx = "android"
        } else if (globalConfig.isTopFrame) {
            ctx = "macos-overlay"
        } else if (!globalConfig.isTopFrame && globalConfig.supportsTopFrame) {
            ctx = "macos-modern"
        } else if (globalConfig.userPreferences?.platform?.name === "ios") {
            ctx = "ios"
        } else  {
            ctx = "macos-legacy"
        }
    }
    const transport = createTransport(ctx, globalConfig)
    /**
     * A wrapper around transports to assist in debugging/integrations
     * @type {import("../packages/device-api").DeviceApiTransport}
     */
    const loggingTransport = {
        async send (deviceApiCall) {
            console.log('[->outgoing]', 'id:', deviceApiCall.method, deviceApiCall.params || null)
            const result = await transport.send(deviceApiCall)
            console.log('[<-incoming]', 'id:', deviceApiCall.method, result || null)
            return result
        }
    }

    // Create the DeviceAPI + Setting
    let deviceApi = new DeviceApi(globalConfig.isDDGTestMode ? loggingTransport : transport)
    const settings = new Settings(globalConfig, deviceApi)
    const impl = new InterfacePrototype(ctx, globalConfig, deviceApi, settings)
    return impl;
}

export { createDevice }
