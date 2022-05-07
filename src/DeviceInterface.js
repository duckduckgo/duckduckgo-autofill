import {AndroidInterface} from './DeviceInterface/AndroidInterface'
import {ExtensionInterface} from './DeviceInterface/ExtensionInterface'
import {AppleDeviceInterface} from './DeviceInterface/AppleDeviceInterface'
import {WindowsInterface} from './DeviceInterface/WindowsInterface'
import {AppleOverlayDeviceInterface} from './DeviceInterface/AppleOverlayDeviceInterface'
import { Sender } from './senders/sender'

/**
 * @param {AvailableInputTypes} availableInputTypes
 * @param {Sender} sender
 * @param {TooltipInterface} tooltip
 * @param {GlobalConfig} globalConfig
 * @param {import("@duckduckgo/content-scope-scripts").RuntimeConfiguration} platformConfig
 * @param {import("./settings/settings").Settings} autofillSettings
 * @returns {AndroidInterface|AppleDeviceInterface|AppleOverlayDeviceInterface|ExtensionInterface|WindowsInterface}
 */
export function createDevice (availableInputTypes, sender, tooltip, globalConfig, platformConfig, autofillSettings) {
    switch (platformConfig.platform) {
    case 'macos':
    case 'ios': {
        if (globalConfig.isTopFrame) {
            return new AppleOverlayDeviceInterface(availableInputTypes, sender, tooltip, globalConfig, platformConfig, autofillSettings)
        }
        return new AppleDeviceInterface(availableInputTypes, sender, tooltip, globalConfig, platformConfig, autofillSettings)
    }
    case 'extension':
        return new ExtensionInterface(availableInputTypes, sender, tooltip, globalConfig, platformConfig, autofillSettings)
    case 'windows':
        return new WindowsInterface(availableInputTypes, sender, tooltip, globalConfig, platformConfig, autofillSettings)
    case 'android':
        return new AndroidInterface(availableInputTypes, sender, tooltip, globalConfig, platformConfig, autofillSettings)
    case 'unknown':
        throw new Error('unreachable. tooltipHandler platform was "unknown"')
    }
    throw new Error('undefined')
}
