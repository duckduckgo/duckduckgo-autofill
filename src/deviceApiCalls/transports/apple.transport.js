import { Messaging, MissingHandler, WebkitMessagingConfig } from '../../../packages/messaging/messaging.js';
import { DeviceApiTransport } from '../../../packages/device-api/index.js';

const AbortError = (signal) => {
    return new DOMException('Aborted', signal.reason || 'AbortError');
};

export class AppleTransport extends DeviceApiTransport {
    /** @param {GlobalConfig} globalConfig */
    constructor(globalConfig) {
        super();
        this.config = globalConfig;
        const webkitConfig = new WebkitMessagingConfig({
            hasModernWebkitAPI: this.config.hasModernWebkitAPI,
            webkitMessageHandlerNames: this.config.webkitMessageHandlerNames,
            secret: this.config.secret,
        });
        this.messaging = new Messaging(webkitConfig);
    }

    async send(deviceApiCall, options) {
        try {
            // Check if already aborted
            if (options?.signal?.aborted) {
                throw AbortError(options.signal);
            }

            // if the call has an `id`, it means that it expects a response
            if (deviceApiCall.id) {
                // Create a promise that can be aborted
                const abortPromise = new Promise((_resolve, reject) => {
                    options?.signal?.addEventListener('abort', () => {
                        reject(AbortError(options.signal));
                    });
                });

                // Race between the actual request and the abort
                return await Promise.race([this.messaging.request(deviceApiCall.method, deviceApiCall.params || undefined), abortPromise]);
            } else {
                // For non-response calls, just check if aborted before sending
                if (options?.signal?.aborted) {
                    throw AbortError(options.signal);
                }
                return this.messaging.notify(deviceApiCall.method, deviceApiCall.params || undefined);
            }
        } catch (e) {
            if (e instanceof MissingHandler) {
                if (this.config.isDDGTestMode) {
                    console.log('MissingWebkitHandler error for:', deviceApiCall.method);
                }
                throw new Error('unimplemented handler: ' + deviceApiCall.method);
            } else {
                throw e;
            }
        }
    }
}
