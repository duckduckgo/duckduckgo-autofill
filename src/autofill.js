// Polyfills/shims
require('./requestIdleCallback');

(() => {
    try {
        const deviceInterface = require('./DeviceInterface')
        deviceInterface.init()
    } catch (e) {
        console.error(e)
        // Noop, we errored
    }
})()
