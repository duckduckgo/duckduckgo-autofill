// Polyfills/shims
import './requestIdleCallback.js'
import { createDevice } from './DeviceInterface.js'
import { shouldLog } from './autofill-utils.js'
;(() => {
    if (shouldLog()) {
        console.log('DuckDuckGo Autofill Active')
    }

    if (!window.isSecureContext) return false

    try {
        const startupAutofill = () => {
            if (document.visibilityState === 'visible') {
                const deviceInterface = createDevice()
                deviceInterface.init()
            } else {
                document.addEventListener('visibilitychange', startupAutofill, { once: true })
            }
        }
        startupAutofill()
    } catch (e) {
        console.error(e)
        // Noop, we errored
    }
})()
