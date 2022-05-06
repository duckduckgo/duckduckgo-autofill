// Polyfills/shims
import './requestIdleCallback'
import './transports/captureDdgGlobals'
import {createDevice} from './DeviceInterface'
import {createGlobalConfig} from './config'
import {createRuntime} from './runtime/runtime'
import {featureToggleAwareInputTypes} from './InputTypes/input-types'
import {createTooltip} from './UI/tooltips'
import {fromRuntimeConfig} from './settings/settings'
import {createLoggingTransport} from './transports/transport'
import {GetAvailableInputTypes, GetRuntimeConfiguration} from './runtime/messages'
import {tryCreateRuntimeConfiguration} from '@duckduckgo/content-scope-scripts'

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
        const transport = createLoggingTransport(globalConfig)

        // Create the runtime, this does a best-guesses job of determining where we're running.
        const runtime = createRuntime(globalConfig, transport)

        // Get runtime configuration - this may include messaging
        const runtimeConfiguration = await getRuntimeConfiguration();

        // Autofill settings need to be derived from runtime config
        const autofillSettings = fromRuntimeConfig(runtimeConfiguration)

        // log feature toggles for clarity when testing
        if (globalConfig.isDDGTestMode) {
            console.log(JSON.stringify(autofillSettings.featureToggles, null, 2))
        }

        // If it was enabled, try to ask for available input types
        if (runtimeConfiguration.isFeatureRemoteEnabled('autofill')) {
            // Determine the tooltipHandler type
            const tooltip = createTooltip(runtime, globalConfig, runtimeConfiguration, autofillSettings)

            const runtimeAvailableInputTypes = await new GetAvailableInputTypes(null, transport).send()
            const inputTypes = featureToggleAwareInputTypes(runtimeAvailableInputTypes, autofillSettings.featureToggles)

            const device = createDevice(inputTypes, runtime, tooltip, globalConfig, runtimeConfiguration, autofillSettings)

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
 * @returns {import("@duckduckgo/content-scope-scripts").RuntimeConfiguration}
 */
async function getRuntimeConfiguration() {
    const data = await new GetRuntimeConfiguration(null, this.transport).send()
    const {config, errors} = tryCreateRuntimeConfiguration(data)

    if (errors.length) {
        for (let error of errors) {
            console.log(error.message, error)
        }
        throw new Error(`${errors.length} errors prevented global configuration from being created.`)
    }

    return config
}
