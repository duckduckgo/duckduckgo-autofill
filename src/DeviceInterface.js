import {AndroidInterface} from './DeviceInterface/AndroidInterface'
import {ExtensionInterface} from './DeviceInterface/ExtensionInterface'
import {AppleDeviceInterface} from './DeviceInterface/AppleDeviceInterface'
import {WindowsInterface} from './DeviceInterface/WindowsInterface'

/**
 * @param {AvailableInputTypes} availableInputTypes
 * @param {import("./runtime/runtime").Runtime} runtime
 * @param {GlobalConfig} globalConfig
 * @param {import("@duckduckgo/content-scope-scripts").RuntimeConfiguration} platformConfig
 * @param {import("./settings/settings").AutofillSettings} autofillSettings
 * @returns {AndroidInterface|AppleDeviceInterface|ExtensionInterface|WindowsInterface}
 */
export function createDevice (availableInputTypes, runtime, globalConfig, platformConfig, autofillSettings) {
    switch (platformConfig.platform) {
    case 'macos':
    case 'ios':
        return new AppleDeviceInterface(availableInputTypes, runtime, globalConfig, platformConfig, autofillSettings)
    case 'extension':
        return new ExtensionInterface(availableInputTypes, runtime, globalConfig, platformConfig, autofillSettings)
    case 'windows':
        return new WindowsInterface(availableInputTypes, runtime, globalConfig, platformConfig, autofillSettings)
    case 'android':
        return new AndroidInterface(availableInputTypes, runtime, globalConfig, platformConfig, autofillSettings)
    case 'unknown':
        throw new Error('unreachable. device platform was "unknown"')
    }
    throw new Error('undefined')
}
