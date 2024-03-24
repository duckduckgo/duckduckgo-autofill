/**
 * @module Android Messaging
 *
 * @description A wrapper for messaging on Android. See example usage in android.transport.js
 */
import { MissingHandler } from './messaging.js'

/**
 * @typedef {import("./messaging").MessagingTransport} MessagingTransport
 */

/**
 * On Android, handlers are added to the window object and are prefixed with `ddg`. The object looks like this:
 *
 * ```typescript
 * {
 *     onMessage: undefined,
 *     postMessage: (message) => void,
 *     addEventListener: (eventType: string, Function) => void,
 *     removeEventListener: (eventType: string, Function) => void
 * }
 * ```
 *
 * You send messages to `postMessage` and listen with `addEventListener`. Once the event is received,
 * we also remove the listener with `removeEventListener`.
 *
 * @link https://developer.android.com/reference/androidx/webkit/WebViewCompat#addWebMessageListener(android.webkit.WebView,java.lang.String,java.util.Set%3Cjava.lang.String%3E,androidx.webkit.WebViewCompat.WebMessageListener)
 * @implements {MessagingTransport}
 */
export class AndroidMessagingTransport {
    /** @type {AndroidMessagingConfig} */
    config
    globals = {capturedHandlers: {}}
    /**
     * @param {AndroidMessagingConfig} config
     */
    constructor (config) {
        this.config = config
    }

    /**
     * Given the method name, returns the related Android handler
     * @param {string} methodName
     * @returns {AndroidHandler}
     * @private
     */
    _getHandler (methodName) {
        const androidSpecificName = this._getHandlerName(methodName)
        if (!(androidSpecificName in window)) {
            throw new MissingHandler(`Missing android handler: '${methodName}'`, methodName)
        }
        return window[androidSpecificName]
    }

    /**
     * Given the autofill method name, it returns the Android-specific handler name
     * @param {string} internalName
     * @returns {string}
     * @private
     */
    _getHandlerName (internalName) {
        return 'ddg' + internalName[0].toUpperCase() + internalName.slice(1)
    }

    /**
     * @param {string} name
     * @param {Record<string, any>} [data]
     */
    notify (name, data = {}) {
        const handler = this._getHandler(name)
        const message = data ? JSON.stringify(data) : ''
        handler.postMessage(message)
    }

    /**
     * @param {string} name
     * @param {Record<string, any>} [data]
     */
    async request (name, data = {}) {
        // Set up the listener first
        const handler = this._getHandler(name)

        const responseOnce = new Promise((resolve) => {
            const responseHandler = (e) => {
                handler.removeEventListener('message', responseHandler)
                resolve(e.data)
            }
            handler.addEventListener('message', responseHandler)
        })

        // Then send the message
        this.notify(name, data)

        // And return once the promise resolves
        const responseJSON = await responseOnce
        return JSON.parse(responseJSON)
    }
}

/**
 * Use this configuration to create an instance of {@link Messaging} for Android
 */
export class AndroidMessagingConfig {
    /**
     * All the expected Android handler names
     * @param {{messageHandlerNames: string[]}} config
     */
    constructor (config) {
        this.messageHandlerNames = config.messageHandlerNames
    }
}
