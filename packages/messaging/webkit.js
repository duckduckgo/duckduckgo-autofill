/**
 * @module Webkit Messaging
 *
 * @description
 *
 * A wrapper for messaging on WebKit platforms.
 *
 * ```js
 * import { Messaging, WebkitMessagingConfig } from "@duckduckgo/content-scope-scripts/lib/messaging.js"
 *
 * const config = new WebkitMessagingConfig({});
 *
 * // finally, get an instance of Messaging and start sending messages in a unified way 🚀
 * const messaging = new Messaging(config);
 * messaging.notify("hello world!", {foo: "bar"})
 *
 * ```
 */
import { MissingHandler } from './messaging.js';

/**
 * @typedef {import("./messaging").MessagingTransport} MessagingTransport
 */

/**
 * @example
 * On macOS 11+, this will just call through to `window.webkit.messageHandlers.x.postMessage`
 *
 * Eg: for a `foo` message defined in Swift that accepted the payload `{"bar": "baz"}`, the following
 * would occur:
 *
 * ```js
 * const json = await window.webkit.messageHandlers.foo.postMessage({ bar: "baz" });
 * const response = JSON.parse(json)
 * ```
 * ```
 * @implements {MessagingTransport}
 */
export class WebkitMessagingTransport {
    /** @type {WebkitMessagingConfig} */
    config;
    /** @type {{window: Window}} */
    globals;
    /**
     * @param {WebkitMessagingConfig} config
     */
    constructor(config) {
        this.config = config;
        this.globals = captureGlobals();
    }
    /**
     * Sends message to the webkit layer (fire and forget)
     * @param {String} handler
     * @param {*} data
     * @internal
     */
    wkSend(handler, data = {}) {
        if (!(handler in this.globals.window.webkit.messageHandlers)) {
            throw new MissingHandler(`Missing webkit handler: '${handler}'`, handler);
        }
        return this.globals.window.webkit.messageHandlers[handler].postMessage?.(data);
    }
    /**
     * @param {string} name
     * @param {Record<string, any>} [data]
     */
    notify(name, data = {}) {
        this.wkSend(name, data);
    }
    /**
     * @param {string} name
     * @param {Record<string, any>} [data]
     */
    async request(name, data = {}) {
        const response = await this.wkSend(name, data);
        return JSON.parse(response || '{}');
    }
}

/**
 * Use this configuration to create an instance of {@link Messaging} for WebKit
 *
 * ```js
 * import { fromConfig, WebkitMessagingConfig } from "@duckduckgo/content-scope-scripts/lib/messaging.js"
 *
 * const config = new WebkitMessagingConfig({});
 *
 * const messaging = new Messaging(config)
 * const resp = await messaging.request("debugConfig")
 * ```
 */
export class WebkitMessagingConfig {}

/**
 * Capture some globals used for messaging handling to prevent page
 * scripts from tampering with this
 */
function captureGlobals() {
    // Creat base with null prototype
    return {
        window,
    };
}
