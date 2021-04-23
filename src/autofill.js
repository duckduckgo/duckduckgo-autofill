(() => {
    // Polyfills/shims
    require('intersection-observer')
    require('./requestIdleCallback')
    const DeviceInterface = require('./DeviceInterface')

    DeviceInterface.init()
})()
