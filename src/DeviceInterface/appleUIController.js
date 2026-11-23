import { defaultOptions } from '../UI/HTMLTooltip.js';
import { HTMLTooltipUIController } from '../UI/controllers/HTMLTooltipUIController.js';
import { OverlayUIController } from '../UI/controllers/OverlayUIController.js';
import { NativeUIController } from '../UI/controllers/NativeUIController.js';

/**
 * @param {import('./AppleDeviceInterface.js').AppleDeviceInterface} device
 * @returns {import('../UI/controllers/UIController.js').UIController}
 */
export function createAppleUIController(device) {
    if (device.globalConfig.userPreferences?.platform?.name === 'ios') {
        return new NativeUIController();
    }

    if (!device.globalConfig.supportsTopFrame) {
        /** @type {import('../UI/HTMLTooltip.js').HTMLTooltipOptions} */
        const options = {
            ...defaultOptions,
            platform: 'macos',
            testMode: device.isTestMode(),
        };
        return new HTMLTooltipUIController(
            {
                device,
                tooltipKind: 'modern',
            },
            options,
        );
    }

    /**
     * If we get here, we're just a controller for an overlay
     */
    return new OverlayUIController({
        remove: async () => device._closeAutofillParent(),
        show: async (details) => device._show(details),
    });
}
