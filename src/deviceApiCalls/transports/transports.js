import {AppleTransport} from './apple.transport.js'
import {AndroidTransport} from './android.transport.js'
import {ExtensionTransport} from './extension.transport.js'

/**
 * @param {GlobalConfig} globalConfig
 * @returns {import("../../../packages/device-api").DeviceApiTransport}
 */

export function createTransport (globalConfig) {
    if (typeof globalConfig.userPreferences?.platform?.name === 'string') {
        switch (globalConfig.userPreferences?.platform?.name) {
        case 'ios':
        case 'macos':
            return new AppleTransport(globalConfig)
        case 'android':
            return new AndroidTransport(globalConfig)
        default:
            throw new Error('selectSender unimplemented!')
        }
    }

    // fallback for when `globalConfig.userPreferences.platform.name` is absent
    if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            return new AndroidTransport(globalConfig)
        }
        throw new Error('unreachable, createTransport')
    }

    return new ExtensionTransport()
}
