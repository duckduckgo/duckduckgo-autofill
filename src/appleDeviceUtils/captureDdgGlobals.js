// Capture the globals we need on page start
const ddgGlobals = {
    window,
    // Methods must be bound to their interface, otherwise they throw Illegal invocation
    encrypt: window.crypto.subtle?.encrypt.bind(window.crypto.subtle),
    decrypt: window.crypto.subtle?.decrypt.bind(window.crypto.subtle),
    generateKey: window.crypto.subtle?.generateKey.bind(window.crypto.subtle),
    exportKey: window.crypto.subtle?.exportKey.bind(window.crypto.subtle),
    importKey: window.crypto.subtle?.importKey.bind(window.crypto.subtle),
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
    ObjectDefineProperty: window.Object.defineProperty,
    capturedWebkitHandlers: {}
}

/**
 * When required (such as on macos 10.x), capture the `postMessage` method on
 * each webkit messageHandler
 *
 * @param {string[]} handlerNames
 */
function captureWebkitHandlers (handlerNames) {
    for (let webkitMessageHandlerName of handlerNames) {
        if (typeof window.webkit.messageHandlers?.[webkitMessageHandlerName]?.postMessage === 'function') {
            /**
             * `bind` is used here to ensure future calls to the captured
             * `postMessage` have the correct `this` context
             */
            ddgGlobals.capturedWebkitHandlers[webkitMessageHandlerName] = window.webkit.messageHandlers[webkitMessageHandlerName].postMessage?.bind(window.webkit.messageHandlers[webkitMessageHandlerName])
            delete window.webkit.messageHandlers[webkitMessageHandlerName].postMessage
        }
    }
}

export { ddgGlobals, captureWebkitHandlers }
