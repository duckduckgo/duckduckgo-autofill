import AndroidInterface from './DeviceInterface/AndroidInterface'
import ExtensionInterface from './DeviceInterface/ExtensionInterface'
import AppleDeviceInterface from './DeviceInterface/AppleDeviceInterface'
import InterfacePrototype from './DeviceInterface/InterfacePrototype'

/**
 * @param {GlobalConfig} globalConfig
 * @param {import("@duckduckgo/content-scope-scripts").RuntimeConfiguration} platformConfig
 * @param {import("./settings/settings").AutofillSettings} autofillSettings
 * @returns {AndroidInterface|AppleDeviceInterface|ExtensionInterface|WindowsInterface}
 */
export function createDevice (globalConfig, platformConfig, autofillSettings) {
    switch (platformConfig.platform) {
    case 'macos':
    case 'ios':
        return new AppleDeviceInterface(globalConfig, platformConfig, autofillSettings)
    case 'extension':
        return new ExtensionInterface(globalConfig, platformConfig, autofillSettings)
    case 'windows':
        return new WindowsInterface(globalConfig, platformConfig, autofillSettings)
    case 'android':
        return new AndroidInterface(globalConfig, platformConfig, autofillSettings)
    case 'unknown':
        throw new Error('unreachable. device platform was "unknown"')
    }
    throw new Error('undefined')
}

class WindowsInterface extends InterfacePrototype {

}
