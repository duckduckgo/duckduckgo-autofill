// Polyfills/shims
require('./requestIdleCallback');

(() => {
    if (!window.isSecureContext) return false
    try {
        const deviceInterface = require('./DeviceInterface')
        deviceInterface.init()
    } catch (e) {
        console.error(e)
        // Noop, we errored
    }
})()
