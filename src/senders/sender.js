import { Message } from '../messages/message'
import {WindowsSender} from './windows.sender'
import {AppleSender} from './apple.sender'
import {ExtensionSender} from './extension.sender'
import {AndroidSender} from './android.sender'

export class Sender {
    /**
     * @template Req,Res
     * @param {Message<Req, Res>} message
     * @returns {Promise<ReturnType<Message<Req,Res>['runtimeResponse']>>}
     */
    async send(message) {
        let response = await this.handle(message)
        return message.runtimeResponse(response)
    }
    /**
     * @template Req,Res
     * @param {Message<Req,Res>} message
     * @returns {Promise<Res | undefined>}
     */
    async handle(message) {
        throw new Error('must implement message handler for ' + message);
    }
}


/**
 * The runtime has to decide on a transport, *before* we have a 'tooltipHandler'.
 *
 * This is because an initial message to retrieve the platform configuration might be needed
 *
 * @param {GlobalConfig} globalConfig
 * @returns {Sender}
 */
export function createRuntimeSender (globalConfig) {
    // On some platforms, things like `platform.name` are embedded into the script
    // and therefor may be immediately available.
    if (typeof globalConfig.userPreferences?.platform?.name === 'string') {
        switch (globalConfig.userPreferences?.platform?.name) {
        case 'ios':
        case 'macos': return new AppleSender(globalConfig)
        default: throw new Error('selectSender unimplemented!')
        }
    }

    if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            return new AndroidSender()
        }
        console.warn('should never get here...')
        return new AppleSender(globalConfig)
    }

    if (globalConfig.isWindows) {
        return new WindowsSender()
    }

    // falls back to extension... is this still the best way to determine this?
    return new ExtensionSender(globalConfig)
}

/**
 * @param {GlobalConfig} config
 * @returns {Sender}
 */
export function createLoggingSender (config) {
    const transport = createRuntimeSender(config)
    // /** @type {RuntimeSender} */
    // const loggingSender = {
    //     async send (name, data) {
    //         console.log(`RuntimeSender: ${name}`, data)
    //         const res = await transport.send(name, data)
    //         console.log(`\tRuntimeSender::Response ${name}`, res)
    //         return res
    //     }
    // }
    return transport;
}
