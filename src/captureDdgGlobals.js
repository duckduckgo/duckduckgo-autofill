(() => {
    // Capture globals before the page overrides them
    const secretGlobals = {
        window,
        // Methods must be bound to their interface, otherwise they throw Illegal invocation
        encrypt: window.crypto.subtle.encrypt.bind(window.crypto.subtle),
        decrypt: window.crypto.subtle.decrypt.bind(window.crypto.subtle),
        generateKey: window.crypto.subtle.generateKey.bind(window.crypto.subtle),
        exportKey: window.crypto.subtle.exportKey.bind(window.crypto.subtle),
        importKey: window.crypto.subtle.importKey.bind(window.crypto.subtle),
        getRandomValues: window.crypto.getRandomValues.bind(window.crypto),
        TextEncoder,
        TextDecoder,
        Uint8Array,
        Uint16Array,
        Uint32Array,
        JSONstringify: window.JSON.stringify,
        JSONparse: window.JSON.parse,
        Arrayfrom: window.Array.from,
        Promise: window.Promise,
        ddgEncrypt: async (message, messageHandling) => {
            const ddgGlobals = window.navigator.ddgGlobals
            const iv = new ddgGlobals.Uint8Array(messageHandling.iv)
            const keyBuffer = new ddgGlobals.Uint8Array(messageHandling.key)
            const key = await ddgGlobals.importKey('raw', keyBuffer, 'AES-GCM', false, ['encrypt'])

            const encrypt = (message) => {
                let enc = new ddgGlobals.TextEncoder()
                return ddgGlobals.encrypt({name: 'AES-GCM', iv}, key, enc.encode(message))
            }

            encrypt(ddgGlobals.JSONstringify(message)).then((encryptedMsg) =>
                window[messageHandling.methodName](encryptedMsg))
        }
    }

    Object.defineProperty(window.navigator, 'ddgGlobals', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: Object.freeze(secretGlobals)
    })
})()
