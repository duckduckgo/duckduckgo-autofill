import { Messaging, MissingHandler, WebkitMessagingConfig } from '../../../packages/messaging/messaging.js';
import { DeviceApiTransport } from '../../../packages/device-api/index.js';

export class AppleTransport extends DeviceApiTransport {
    /** @param {GlobalConfig} globalConfig */
    constructor(globalConfig) {
        super();
        this.config = globalConfig;
        const webkitConfig = new WebkitMessagingConfig();
        this.messaging = new Messaging(webkitConfig);
    }

    async send(deviceApiCall) {
        try {
            // if the call has an `id`, it means that it expects a response
            if (deviceApiCall.id) {
                return await this.messaging.request(deviceApiCall.method, deviceApiCall.params || undefined);
            } else {
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
