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
        this._eventHandlers = new Map()
        this._uintArray = new Uint32Array(10)

        if (!('ddgAndroidAutofillHandler' in window)) {
            throw new MissingHandler(`Missing android handler`, 'ddgAndroidAutofillHandler')
        }
        window.ddgAndroidAutofillHandler.onMessage = (e) => this._onAppResponse(e)
    }

    /**
     * Given the method name, returns the related Android handler
     * @param {string} [methodName]
     * @returns {AndroidHandler}
     * @private
     */
    _getHandler (methodName) {
        if (!('ddgAndroidAutofillHandler' in window)) {
            throw new MissingHandler(`Missing android handler`, 'ddgAndroidAutofillHandler')
        }
        return window.ddgAndroidAutofillHandler
    }

    _getHandlerUniqueId (internalName) {
        return internalName + '_' + window.crypto.getRandomValues(this._uintArray)[0]
    }

    _constructMessage (name, handlerUniqueId, data) {
        return {
            type: name,
            handlerUniqueId: handlerUniqueId || this._getHandlerUniqueId(name),
            ...data
        }
    }

    _onAppResponse (e) {
        if (!e.data) return

        const responseObj = JSON.parse(e.data)
        if (!responseObj?.handlerUniqueId) return

        const handler = this._eventHandlers.get(responseObj.handlerUniqueId)

        handler?.(responseObj)
    }

    _addEventListener (eventName, fn) {
        this._eventHandlers.set(eventName, fn)
    }
    _removeEventListener (eventName) {
        this._eventHandlers.delete(eventName)
    }

    /**
     * @param name
     * @param {Record<string, any>} [data]
     */
    notify (name, data = {}) {
        const handler = this._getHandler()
        const message = JSON.stringify(this._constructMessage(name, null, data))
        handler.postMessage(message)
    }

    /**
     * @param {string} name
     * @param {Record<string, any>} [data]
     */
    async request (name, data = {}) {
        const handlerUniqueId = this._getHandlerUniqueId(name)

        const responseOnce = new Promise((resolve) => {
            const responseHandler = (response) => {
                this._removeEventListener(handlerUniqueId)
                resolve(response)
            }
            this._addEventListener(handlerUniqueId, responseHandler)
        })

        const preparedData = this._constructMessage(name, handlerUniqueId, data)

        // Then send the message
        this.notify(name, preparedData)

        // And return the promise
        return responseOnce
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
