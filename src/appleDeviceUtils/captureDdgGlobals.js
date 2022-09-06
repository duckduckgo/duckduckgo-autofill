// Capture the globals we need on page start
const ddgGlobals = {
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
    ObjectDefineProperty: window.Object.defineProperty,
    capturedWebkitHandlers: {}
}

export { ddgGlobals }

/**
 * When required (such as on macos 10.x), capture the `postMessage` method on
 * each webkit messageHandler
 *
 * @param {string[]} handlerNames
 */
export function captureWebkitHandlers (handlerNames) {
    for (let webkitMessageHandlerName of handlerNames) {
        if (typeof window.webkit.messageHandlers?.[webkitMessageHandlerName]?.postMessage === 'function') {
            ddgGlobals.capturedWebkitHandlers[webkitMessageHandlerName] = window.webkit.messageHandlers[webkitMessageHandlerName].postMessage.bind(window.webkit.messageHandlers[webkitMessageHandlerName])
            Object.defineProperty(window.webkit.messageHandlers[webkitMessageHandlerName], 'postMessage', {
                writable: false,
                configurable: false,
                enumerable: false,
                value () {
                    /** no-op */
                }
            })
        }
    }
}
