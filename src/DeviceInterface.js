import {AndroidInterface} from './DeviceInterface/AndroidInterface'
import {ExtensionInterface} from './DeviceInterface/ExtensionInterface'
import {AppleDeviceInterface} from './DeviceInterface/AppleDeviceInterface'
import {WindowsInterface} from './DeviceInterface/WindowsInterface'
import {AppleOverlayDeviceInterface} from './DeviceInterface/AppleOverlayDeviceInterface'

/**
 * @param {AvailableInputTypes} availableInputTypes
 * @param {import("./runtime/runtime").Runtime} runtime
 * @param {TooltipInterface} tooltip
 * @param {GlobalConfig} globalConfig
 * @param {import("@duckduckgo/content-scope-scripts").RuntimeConfiguration} platformConfig
 * @param {import("./settings/settings").Settings} autofillSettings
 * @returns {AndroidInterface|AppleDeviceInterface|AppleOverlayDeviceInterface|ExtensionInterface|WindowsInterface}
 */
export function createDevice (availableInputTypes, runtime,  tooltip, globalConfig, platformConfig, autofillSettings) {
    switch (platformConfig.platform) {
    case 'macos':
    case 'ios': {
        if (globalConfig.isTopFrame) {
            return new AppleOverlayDeviceInterface(availableInputTypes, runtime, tooltip, globalConfig, platformConfig, autofillSettings)
        }
        return new AppleDeviceInterface(availableInputTypes, runtime, tooltip, globalConfig, platformConfig, autofillSettings)
    }
    case 'extension':
        return new ExtensionInterface(availableInputTypes, runtime, tooltip, globalConfig, platformConfig, autofillSettings)
    case 'windows':
        return new WindowsInterface(availableInputTypes, runtime, tooltip, globalConfig, platformConfig, autofillSettings)
    case 'android':
        return new AndroidInterface(availableInputTypes, runtime, tooltip, globalConfig, platformConfig, autofillSettings)
    case 'unknown':
        throw new Error('unreachable. tooltipHandler platform was "unknown"')
    }
    throw new Error('undefined')
}
