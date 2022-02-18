(() => {
    try {
        if (!window.isSecureContext) return

        const listenForGlobalFormSubmission = require('./Form/listenForFormSubmission')
        const {processConfig} = require('@duckduckgo/content-scope-scripts/src/apple-utils')
        const {autofillEnabled} = require('./autofill-utils')

        const inject = require('./inject')

        // chrome is only present in desktop browsers
        if (typeof chrome === 'undefined') {
            if (autofillEnabled(processConfig)) {
                listenForGlobalFormSubmission()
                inject()
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
                        inject()
                    }
                }
            )
        }
    } catch (e) {
        console.error(e)
        // Noop, we errored
    }
})()
