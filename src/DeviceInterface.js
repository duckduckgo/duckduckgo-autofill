import { createGlobalConfig } from './config.js'
import {AndroidInterface} from './DeviceInterface/AndroidInterface.js'
import {ExtensionInterface} from './DeviceInterface/ExtensionInterface.js'
import {AppleDeviceInterface} from './DeviceInterface/AppleDeviceInterface.js'
import {AppleOverlayDeviceInterface} from './DeviceInterface/AppleOverlayDeviceInterface.js'
import {createTransport} from './deviceApiCalls/transports/transports.js'
import {DeviceApi} from '../packages/device-api/index.js'
import {Settings} from './Settings.js'

function createDevice () {
    const globalConfig = createGlobalConfig()
    const transport = createTransport(globalConfig)

    /**
     * A wrapper around transports to assist in debugging/integrations
     * @type {import("../packages/device-api").DeviceApiTransport}
     */
    const loggingTransport = {
        async send (deviceApiCall) {
            console.log('[outgoing]', deviceApiCall.method, 'id:', deviceApiCall.id, JSON.stringify(deviceApiCall.params || null))
            const result = await transport.send(deviceApiCall)
            console.log('[incoming]', deviceApiCall.method, 'id:', deviceApiCall.id, JSON.stringify(result || null))
            return result
        }
    }

    // Create the DeviceAPI + Setting
    let deviceApi = new DeviceApi(globalConfig.isDDGTestMode ? loggingTransport : transport)
    const settings = new Settings(globalConfig, deviceApi)

    if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            return new AndroidInterface(globalConfig, deviceApi, settings)
        }
        if (globalConfig.isTopFrame) {
            return new AppleOverlayDeviceInterface(globalConfig, deviceApi, settings)
        }
        return new AppleDeviceInterface(globalConfig, deviceApi, settings)
    }
    return new ExtensionInterface(globalConfig, deviceApi, settings)
}

export { createDevice }
