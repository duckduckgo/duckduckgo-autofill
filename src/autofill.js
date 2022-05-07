// Polyfills/shims
import './requestIdleCallback'
import './senders/captureDdgGlobals'
import {createDevice} from './DeviceInterface'
import {createGlobalConfig} from './config'
import {featureToggleAwareInputTypes} from './InputTypes/input-types'
import {createTooltip} from './UI/tooltips'
import {fromRuntimeConfig} from './settings/settings'
import {tryCreateRuntimeConfiguration} from '@duckduckgo/content-scope-scripts'
import {GetAvailableInputTypes, GetRuntimeConfiguration} from './messages/messages'
import {createSender} from './senders/apple.sender'
import { Sender } from './senders/sender'

(async () => {
    if (!window.isSecureContext) return false
    try {
        // this is config already present in the script, or derived from the page etc.
        const globalConfig = createGlobalConfig()

        if (globalConfig.isDDGTestMode) {
            console.log('globalConfig', globalConfig)
        }

        // Transport is needed very early because we may need to fetch initial configuration, before any
        // autofill logic can run...
        const sender = createSender(globalConfig)

        // Get runtime configuration - this may include messaging
        const runtimeConfiguration = await getRuntimeConfiguration(sender);

        // Autofill settings need to be derived from runtime config
        const autofillSettings = fromRuntimeConfig(runtimeConfiguration)

        // log feature toggles for clarity when testing
        if (globalConfig.isDDGTestMode) {
            console.log(JSON.stringify(autofillSettings.featureToggles, null, 2))
        }

        // If it was enabled, try to ask for available input types
        if (runtimeConfiguration.isFeatureRemoteEnabled('autofill')) {
            // Determine the tooltipHandler type
            const tooltip = createTooltip(globalConfig, runtimeConfiguration, autofillSettings)
            const runtimeAvailableInputTypes = await sender.send(new GetAvailableInputTypes(null))
            const inputTypes = featureToggleAwareInputTypes(runtimeAvailableInputTypes, autofillSettings.featureToggles)

            const device = createDevice(inputTypes, sender, tooltip, globalConfig, runtimeConfiguration, autofillSettings)

            // This is a workaround for the previous design, we should refactor if possible
            tooltip.setDevice?.(device)

            // Init services
            await device.init()
        } else {
            console.log('feature was remotely disabled')
        }
    } catch (e) {
        console.error(e)
        // Noop, we errored
    }
})()

/**
 * @public
 * @param {Sender} sender
 * @returns {import("@duckduckgo/content-scope-scripts").RuntimeConfiguration}
 */
async function getRuntimeConfiguration(sender) {
    const data = await sender.send(new GetRuntimeConfiguration(null));
    const {config, errors} = tryCreateRuntimeConfiguration(data)

    if (errors.length) {
        for (let error of errors) {
            console.log(error.message, error)
        }
        throw new Error(`${errors.length} errors prevented global configuration from being created.`)
    }

    return config
}
