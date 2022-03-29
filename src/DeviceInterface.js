const {createGlobalConfig} = require('./config')
const AndroidInterface = require('./DeviceInterface/AndroidInterface')
const ExtensionInterface = require('./DeviceInterface/ExtensionInterface')
const AppleDeviceInterface = require('./DeviceInterface/AppleDeviceInterface')
const { BrowserInterface } = require('./DeviceInterface/BrowserInterface')

// Exports a device interface instance
const deviceInterface = (() => {
    const globalConfig = createGlobalConfig()
    if (globalConfig.isDDGApp) {
        return globalConfig.isAndroid ? new AndroidInterface(globalConfig) : new AppleDeviceInterface(globalConfig)
    }
    if (globalConfig.hasExtensionApi) {
        return new ExtensionInterface(globalConfig)
    }
    return new BrowserInterface(globalConfig)
})()

module.exports = deviceInterface
