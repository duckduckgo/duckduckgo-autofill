import {createTransport as createAppleTransport} from './apple.transport'
import {createTransport as createAndroidTransport} from './android.transport'
import {createTransport as createWindowsTransport} from './windows.transport'
import {createTransport as createExtensionTransport} from './extension.transport'

/**
 * The runtime has to decide on a transport, *before* we have a 'tooltipHandler'.
 *
 * This is because an initial message to retrieve the platform configuration might be needed
 *
 * @param {GlobalConfig} globalConfig
 * @returns {RuntimeTransport}
 */
export function createRuntimeTransport (globalConfig) {
    // On some platforms, things like `platform.name` are embedded into the script
    // and therefor may be immediately available.
    if (typeof globalConfig.userPreferences?.platform?.name === 'string') {
        switch (globalConfig.userPreferences?.platform?.name) {
        case 'ios': return createAppleTransport(globalConfig)
        case 'macos': return createAppleTransport(globalConfig)
        default: throw new Error('selectTransport unimplemented!')
        }
    }

    if (globalConfig.isDDGApp) {
        if (globalConfig.isAndroid) {
            return createAndroidTransport(globalConfig)
        }
        console.warn('should never get here...')
        return createAppleTransport(globalConfig)
    }

    if (globalConfig.isWindows) {
        return createWindowsTransport(globalConfig)
    }

    // falls back to extension... is this still the best way to determine this?
    return createExtensionTransport(globalConfig)
}

/**
 * @param {GlobalConfig} config
 * @returns {BaseTransport<any>}
 */
export function createLoggingTransport (config) {
    const transport = createRuntimeTransport(config)
    /** @type {RuntimeTransport} */
    const loggingTransport = {
        async send (name, data) {
            console.log(`RuntimeTransport: ${name}`, data)
            const res = await transport.send(name, data)
            console.log(`\tRuntimeTransport::Response ${name}`, res)
            return res
        }
    }
    return loggingTransport
}
