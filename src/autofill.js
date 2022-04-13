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

        const platformConfiguration = await runtime.getPlatformConfiguration();
        const autofillSettings = await runtime.getAutofillSettings(platformConfiguration);

        console.log("->", JSON.stringify(platformConfiguration.getSettings("autofill"), null, 2));
        console.log("->", JSON.stringify(autofillSettings.featureToggles, null, 2));

        // // Determine the device type
        const device = createDevice(globalConfig, platformConfiguration, autofillSettings)
        console.log('devices', device);
        console.log('platform', platformConfiguration.platform);
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
