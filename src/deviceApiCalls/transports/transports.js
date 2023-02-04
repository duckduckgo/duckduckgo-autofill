import {AppleTransport} from './apple.transport.js'
import {AndroidTransport} from './android.transport.js'
import {ExtensionTransport} from './extension.transport.js'
import {WindowsTransport} from './windows.transport.js'

/**
 * @param {import('../../DeviceInterface/InterfacePrototype.js').Ctx} ctx
 * @param {GlobalConfig} globalConfig
 * @returns {import("../../../packages/device-api").DeviceApiTransport}
 */

export function createTransport (ctx, globalConfig) {
    switch (ctx) {
        case "macos-legacy":
        case "macos-modern":
        case "macos-overlay":
        case "ios": {
            return new AppleTransport(globalConfig)
        }
        case "android": {
            return new AndroidTransport(globalConfig)
        }
        case "windows":
        case "windows-overlay": {
            return new WindowsTransport()
        }
        case "extension": {
            return new ExtensionTransport(globalConfig)
        }
        default: return new ExtensionTransport(globalConfig)
    }
}
