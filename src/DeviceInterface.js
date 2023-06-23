import { createGlobalConfig } from './config.js'
import {AndroidInterface} from './DeviceInterface/AndroidInterface.js'
import {ExtensionInterface} from './DeviceInterface/ExtensionInterface.js'
import {AppleDeviceInterface} from './DeviceInterface/AppleDeviceInterface.js'
import {AppleOverlayDeviceInterface} from './DeviceInterface/AppleOverlayDeviceInterface.js'
import {createTransport} from './deviceApiCalls/transports/transports.js'
import {DeviceApi} from '../packages/device-api/index.js'
import {Settings} from './Settings.js'
import {WindowsInterface} from './DeviceInterface/WindowsInterface.js'
import {WindowsOverlayDeviceInterface} from './DeviceInterface/WindowsOverlayDeviceInterface.js'

function createDevice () {
    const globalConfig = createGlobalConfig()
    const transport = createTransport(globalConfig)

    // Create the DeviceAPI + Setting
    let deviceApi = new DeviceApi(transport)
    const settings = new Settings(globalConfig, deviceApi)

    if (globalConfig.isWindows) {
        if (globalConfig.isTopFrame) {
            return new WindowsOverlayDeviceInterface(globalConfig, deviceApi, settings)
        }
        return new WindowsInterface(globalConfig, deviceApi, settings)
    }
    if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            return new AndroidInterface(globalConfig, deviceApi, settings)
        }
        if (globalConfig.isTopFrame) {
            return new AppleOverlayDeviceInterface(globalConfig, deviceApi, settings)
        }
        return new AppleDeviceInterface(globalConfig, deviceApi, settings)
    }
    globalConfig.isExtension = true
    return new ExtensionInterface(globalConfig, deviceApi, settings)
}

export { createDevice }
