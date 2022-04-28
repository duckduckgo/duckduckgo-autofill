import { createGlobalConfig } from './config'
import AndroidInterface from './DeviceInterface/AndroidInterface'
import ExtensionInterface from './DeviceInterface/ExtensionInterface'
import AppleDeviceInterface from './DeviceInterface/AppleDeviceInterface'

export function createDevice () {
    const globalConfig = createGlobalConfig()
    if (globalConfig.isDDGApp) {
        return globalConfig.isAndroid ? new AndroidInterface(globalConfig) : new AppleDeviceInterface(globalConfig)
    }
    return new ExtensionInterface(globalConfig)
}
