(() => {
    try {
        if (!window.isSecureContext) return

        const listenForGlobalFormSubmission = require('./Form/listenForFormSubmission')
        const inject = require('./inject')

        // chrome is only present in desktop browsers
        if (typeof chrome === 'undefined') {
            const deviceInterface = require('./DeviceInterface')
            const observePageChanges = () => {
                // TODO debounce these
                // TODO we might want to duplicate this in the tabview to reduce the lag.
                document.addEventListener('scroll', () => {
                    deviceInterface.closeTooltip()
                })
                // TODO add mutation observer to hide on sizing changes of the page
            }
            listenForGlobalFormSubmission()
            inject()
            observePageChanges()
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
        // Noop, we errored
    }
})()
