import AndroidInterface from './DeviceInterface/AndroidInterface'
import ExtensionInterface from './DeviceInterface/ExtensionInterface'
import AppleDeviceInterface from './DeviceInterface/AppleDeviceInterface'

/**
 * @param {GlobalConfig} globalConfig
 * @param {import("@duckduckgo/content-scope-scripts").Config} platformConfig
 * @param {import("./settings/settings").AutofillSettings} autofillSettings
 * @returns {AndroidInterface|AppleDeviceInterface|ExtensionInterface}
 */
export function createDevice (globalConfig, platformConfig, autofillSettings) {
    switch (platformConfig.platform) {
    case 'macos':
    case 'ios':
        return new AppleDeviceInterface(globalConfig, platformConfig, autofillSettings)
    case 'extension':
        return new ExtensionInterface(globalConfig, platformConfig, autofillSettings)
    case 'windows':
        throw new Error('todo: implement windows')
    case 'android':
        return new AndroidInterface(globalConfig, platformConfig, autofillSettings)
    case 'unknown':
        throw new Error('unreachable. device platform was "unknown"')
    }
    throw new Error('undefined')
}
