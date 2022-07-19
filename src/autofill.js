// Polyfills/shims
import './requestIdleCallback.js'
import {createDevice} from './DeviceInterface.js'

(() => {
    if (!window.isSecureContext) return false
    try {
        const startupAutofill = () => {
            if (document.visibilityState === 'visible') {
                const deviceInterface = createDevice()
                deviceInterface.init()
            } else {
                document.addEventListener('visibilitychange', startupAutofill, {once: true})
            }
        }
        startupAutofill()
    } catch (e) {
        console.error(e)
        // Noop, we errored
    }
})()
