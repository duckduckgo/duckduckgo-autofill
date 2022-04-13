// Polyfills/shims
import './requestIdleCallback'
import {createDevice} from './DeviceInterface'
import {createGlobalConfig} from './config'
import {createRuntime} from './runtime/runtime'

(async () => {
    if (!window.isSecureContext) return false
    try {

        // // this is config already present in the script, or derived from the page etc.
        const globalConfig = createGlobalConfig();

        const runtime = createRuntime(globalConfig);

        // Get runtime configuration - this may include messaging
        const runtimeConfiguration = await runtime.getRuntimeConfiguration();

        // Autofill settings need to be derived from runtime config
        const autofillSettings = await runtime.getAutofillSettings(runtimeConfiguration);

        // // Determine the device type
        const device = createDevice(globalConfig, runtimeConfiguration, autofillSettings)

        console.log('devices', device);
        console.log('platform', runtimeConfiguration.platform);
        //
        // // access the platform configuration
        // const platformConfig = await device.getPlatformConfiguration(globalConfig);
        //
        // // now create autofill settings
        // const settings = await device.getAutofillSettings(platformConfig);
        //
        // // now the device has platform config + settings ready, true?
        // await device.init()
    } catch (e) {
        console.error(e)
        // Noop, we errored
    }
})()
