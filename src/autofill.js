// TODO: this must be injected at page start from capture-ddg-globals.js
// It's only here for convenience. Remove it once ready.
(() => {
    // Capture globals before the page overrides them
    const secretGlobals = {
        window,
        encrypt: window.crypto.subtle.encrypt,
        TextEncoder,
        Uint8Array,
        decrypt: window.crypto.subtle.decrypt,
    }

    Object.defineProperty(window.navigator, 'ddgGlobals', {
        enumerable: false,
        configurable: false,
        writable: false,
        // Use proxy to ensure stringification isn't possible
        value: Object.freeze(secretGlobals)
    })
})();

(() => {
    const inject = () => {
        // Polyfills/shims
        require('./requestIdleCallback')
        const DeviceInterface = require('./DeviceInterface')

        DeviceInterface.init()
    }

    // chrome is only present in desktop browsers
    if (typeof chrome === 'undefined') {
        inject()
    } else {
        // Check if the site is marked to skip autofill
        chrome.runtime.sendMessage({registeredTempAutofillContentScript: true}, (response) => {
            if (response?.site?.brokenFeatures?.includes('autofill')) return

            inject()
        })
    }
})()
