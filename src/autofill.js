// Polyfills/shims
require('./requestIdleCallback');

(() => {
    try {
        if (!window.isSecureContext) return
        const deviceInterface = require('./DeviceInterface')

        const {processConfig} = require('@duckduckgo/content-scope-scripts/src/apple-utils')
        const {autofillEnabled} = require('./autofill-utils')

        // chrome is only present in desktop browsers
        if (typeof chrome === 'undefined') {
            if (autofillEnabled(processConfig)) {
                deviceInterface.init()
            }
        } else {
            // Check if the site is marked to skip autofill
            chrome.runtime.sendMessage(
                {
                    registeredTempAutofillContentScript: true,
                    documentUrl: window.location.href
                },
                (response) => {
                    if (!response?.site?.brokenFeatures?.includes('autofill')) {
                        deviceInterface.init()
                    }
                }
            )
        }
    } catch (e) {
        console.error(e)
        // Noop, we errored
    }
})()
