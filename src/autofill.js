const listenForGlobalFormSubmission = require('./Form/listenForFormSubmission');

(() => {
    const inject = () => {
        // Polyfills/shims
        require('./requestIdleCallback')
        const DeviceInterface = require('./DeviceInterface')

        DeviceInterface.init()
    }

    // chrome is only present in desktop browsers
    if (typeof chrome === 'undefined') {
        listenForGlobalFormSubmission()
        inject()
    } else {
        // Check if the site is marked to skip autofill
        chrome.runtime.sendMessage({registeredTempAutofillContentScript: true}, (response) => {
            if (response?.site?.brokenFeatures?.includes('autofill')) return

            inject()
        })
    }
})()
