const {
    isDDGApp,
    isAndroid
} = require('./autofill-utils')
const AndroidInterface = require('./DeviceInterface/AndroidInterface')
const ExtensionInterface = require('./DeviceInterface/ExtensionInterface')
const AppleDeviceInterface = require('./DeviceInterface/AppleDeviceInterface')

// Exports a device interface instance
const deviceInterface = (() => {
    if (isDDGApp) {
        return isAndroid ? new AndroidInterface() : new AppleDeviceInterface()
    }
    return new ExtensionInterface()
})()

module.exports = deviceInterface
