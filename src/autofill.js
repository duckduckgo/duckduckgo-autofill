// Polyfills/shims
import './requestIdleCallback'
import './transports/captureDdgGlobals'
import {createDevice} from './DeviceInterface'
import {createGlobalConfig} from './config'
import {createRuntime} from './runtime/runtime'

(async () => {
    if (!window.isSecureContext) return false
    try {

        // // this is config already present in the script, or derived from the page etc.
        const globalConfig = createGlobalConfig();

        // Create the runtime, this does a best-guesses job of determining where we're running.
        const runtime = createRuntime(globalConfig);

        // Get runtime configuration - this may include messaging
        const runtimeConfiguration = await runtime.getRuntimeConfiguration();

        // Autofill settings need to be derived from runtime config
        const autofillSettings = await runtime.getAutofillSettings(runtimeConfiguration);

        if (globalConfig.isDDGTestMode) {
            console.log(JSON.stringify(autofillSettings.featureToggles, null, 2))
        }

        // Determine the device type
        const device = createDevice(globalConfig, runtimeConfiguration, autofillSettings)

        // If it was enabled, try to ask for available input types
        if (runtimeConfiguration.isFeatureRemoteEnabled("autofill")) {
            const availableInputTypes = await runtime.getAvailableInputTypes();
            console.log("availableInputTypes", availableInputTypes);
        }

        // Init services
        await device.init()
    } catch (e) {
        console.error(e)
        // Noop, we errored
    }
})()
