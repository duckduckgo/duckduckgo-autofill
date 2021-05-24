Object.assign(global, require('jest-chrome'))

const crypto = require('crypto')

Object.defineProperty(global.self, 'crypto', {
    value: {
        ...global.self.crypto,
        subtle: crypto.webcrypto.subtle,
        getRandomValues: arr => crypto.randomFillSync(arr)
    }
})

// Capture globals before the page overrides them
const secretGlobals = {
    window,
    encrypt: window.crypto.subtle.encrypt,
    decrypt: window.crypto.subtle.decrypt,
    generateKey: window.crypto.subtle.generateKey,
    exportKey: window.crypto.subtle.exportKey,
    importKey: window.crypto.subtle.importKey,
    getRandomValues: window.crypto.getRandomValues,
    TextEncoder,
    Uint8Array,
    Uint32Array,
}

Object.defineProperty(window.navigator, 'ddgGlobals', {
    'enumerable': false,
    'configurable': false,
    'writable': false,
    // Use proxy to ensure stringification isn't possible
    'value': Object.freeze(secretGlobals)
})
