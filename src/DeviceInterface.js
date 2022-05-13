import { createGlobalConfig } from './config'
import {AndroidInterface} from './DeviceInterface/AndroidInterface'
import {ExtensionInterface} from './DeviceInterface/ExtensionInterface'
import {AppleDeviceInterface} from './DeviceInterface/AppleDeviceInterface'
import {AppleOverlayDeviceInterface} from './DeviceInterface/AppleOverlayDeviceInterface'

function createDevice () {
    const globalConfig = createGlobalConfig()
    if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            return new AndroidInterface(globalConfig)
        }
        if (globalConfig.isTopFrame) {
            return new AppleOverlayDeviceInterface(globalConfig)
        }
        return new AppleDeviceInterface(globalConfig)
    }
    return new ExtensionInterface(globalConfig)
}

export { createDevice }
