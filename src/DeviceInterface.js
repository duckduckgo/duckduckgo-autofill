import { createGlobalConfig } from './config'
import {AndroidInterface} from './DeviceInterface/AndroidInterface'
import {ExtensionInterface} from './DeviceInterface/ExtensionInterface'
import {AppleDeviceInterface} from './DeviceInterface/AppleDeviceInterface'
import {AppleOverlayDeviceInterface} from './DeviceInterface/AppleOverlayDeviceInterface'
import {createTransport} from './appleDeviceUtils/appleDeviceUtils'
import {IOHandler} from '../packages/zod-rpc'

function createDevice () {
    const globalConfig = createGlobalConfig()
    if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            return new AndroidInterface(globalConfig)
        }
        const handler = new IOHandler(createTransport(globalConfig))
        if (globalConfig.isTopFrame) {
            return new AppleOverlayDeviceInterface(globalConfig, handler)
        }
        return new AppleDeviceInterface(globalConfig, handler)
    }
    return new ExtensionInterface(globalConfig)
}

export { createDevice }
