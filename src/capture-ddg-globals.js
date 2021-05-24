(() => {
    // Capture globals before the page overrides them
    const secretGlobals = {
        window,
        encrypt: window.crypto.subtle.encrypt,
        TextEncoder,
        Uint8Array,
        decrypt: window.crypto.subtle.decrypt,
        getRandomValues: window.crypto.getRandomValues
    }

    Object.defineProperty(window.navigator, 'ddgGlobals', {
        enumerable: false,
        configurable: false,
        writable: false,
        // Use proxy to ensure stringification isn't possible
        value: Object.freeze(secretGlobals)
    })
})()
