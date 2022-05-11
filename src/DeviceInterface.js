import { createGlobalConfig } from './config'
import {AndroidInterface} from './DeviceInterface/AndroidInterface'
import {ExtensionInterface} from './DeviceInterface/ExtensionInterface'
import {AppleDeviceInterface} from './DeviceInterface/AppleDeviceInterface'
import {WebTooltip} from './UI/WebTooltip'
import {NativeTooltip} from './UI/NativeTooltip'
import {AppleOverlayDeviceInterface} from './DeviceInterface/AppleOverlayDeviceInterface'
import {OverlayController} from './UI/OverlayController'

function createDevice () {
    const globalConfig = createGlobalConfig()
    if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            return new AndroidInterface(globalConfig, new NativeTooltip())
        }
        if (globalConfig.isTopFrame) {
            return new AppleOverlayDeviceInterface(globalConfig, new WebTooltip({tooltipKind: 'modern'}))
        }
        if (globalConfig.supportsTopFrame) {
            return new AppleDeviceInterface(globalConfig, new OverlayController())
        }
        return new AppleDeviceInterface(globalConfig, new WebTooltip({tooltipKind: 'modern'}))
    }
    return new ExtensionInterface(globalConfig, new WebTooltip({tooltipKind: 'legacy'}))
}

export { createDevice }
