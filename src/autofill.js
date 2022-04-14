// Polyfills/shims
import './requestIdleCallback'
import './transports/captureDdgGlobals'
import {createDevice} from './DeviceInterface'
import {createGlobalConfig} from './config'
import {createRuntime} from './runtime/runtime'
import {featureToggleAwareInputTypes} from './input-types/input-types'

(async () => {
    if (!window.isSecureContext) return false
    try {
        // this is config already present in the script, or derived from the page etc.
        const globalConfig = createGlobalConfig()

        // Create the runtime, this does a best-guesses job of determining where we're running.
        const runtime = createRuntime(globalConfig)

        // Get runtime configuration - this may include messaging
        const runtimeConfiguration = await runtime.getRuntimeConfiguration()

        // Autofill settings need to be derived from runtime config
        const autofillSettings = await runtime.getAutofillSettings(runtimeConfiguration)

        // log feature toggles for clarity when testing
        if (globalConfig.isDDGTestMode) {
            console.log(JSON.stringify(autofillSettings.featureToggles, null, 2))
        }

        // If it was enabled, try to ask for available input types
        if (runtimeConfiguration.isFeatureRemoteEnabled('autofill')) {
            const runtimeAvailableInputTypes = await runtime.getAvailableInputTypes()
            console.log({runtimeAvailableInputTypes})
            const inputTypes = featureToggleAwareInputTypes(runtimeAvailableInputTypes, autofillSettings.featureToggles)

            // Determine the device type
            const device = createDevice(inputTypes, runtime, globalConfig, runtimeConfiguration, autofillSettings)

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
