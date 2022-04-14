import {AndroidInterface} from './DeviceInterface/AndroidInterface'
import {ExtensionInterface} from './DeviceInterface/ExtensionInterface'
import {AppleDeviceInterface} from './DeviceInterface/AppleDeviceInterface'
import {WindowsInterface} from './DeviceInterface/WindowsInterface'

/**
 * @param {import("./runtime/runtime").Runtime} runtime
 * @param {GlobalConfig} globalConfig
 * @param {import("@duckduckgo/content-scope-scripts").RuntimeConfiguration} platformConfig
 * @param {import("./settings/settings").AutofillSettings} autofillSettings
 * @returns {AndroidInterface|AppleDeviceInterface|ExtensionInterface|WindowsInterface}
 */
export function createDevice (runtime, globalConfig, platformConfig, autofillSettings) {
    switch (platformConfig.platform) {
    case 'macos':
    case 'ios':
        return new AppleDeviceInterface(runtime, globalConfig, platformConfig, autofillSettings)
    case 'extension':
        return new ExtensionInterface(runtime, globalConfig, platformConfig, autofillSettings)
    case 'windows':
        return new WindowsInterface(runtime, globalConfig, platformConfig, autofillSettings)
    case 'android':
        return new AndroidInterface(runtime, globalConfig, platformConfig, autofillSettings)
    case 'unknown':
        throw new Error('unreachable. device platform was "unknown"')
    }
    throw new Error('undefined')
}

