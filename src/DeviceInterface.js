const {createGlobalConfig} = require('./config')
const AndroidInterface = require('./DeviceInterface/AndroidInterface')
const ExtensionInterface = require('./DeviceInterface/ExtensionInterface')
const AppleDeviceInterface = require('./DeviceInterface/AppleDeviceInterface')

// Exports a device interface instance
const deviceInterface = (() => {
    const globalConfig = createGlobalConfig()
    if (globalConfig.isDDGApp) {
        return globalConfig.isAndroid ? new AndroidInterface(globalConfig) : new AppleDeviceInterface(globalConfig)
    }
    return new ExtensionInterface(globalConfig)
})()

module.exports = deviceInterface
