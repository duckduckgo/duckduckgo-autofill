import { SelectedDetailCall } from '../deviceApiCalls/__generated__/deviceApiCalls.js';

/**
 * These are some re-usable parts for handling 'overlays' (like on macOS + Windows)
 *
 * @param {import("./InterfacePrototype").default} device
 */
export function overlayApi(device) {
    return {
        /**
         * When we are inside an 'overlay' - the HTML tooltip will be opened immediately
         */
        showImmediately() {
            const topContextData = device.getTopContextData();
            if (!topContextData) throw new Error('unreachable, topContextData should be available');

            // Provide dummy values
            const getPosition = () => {
                return {
                    x: 0,
                    y: 0,
                    height: 50,
                    width: 50,
                };
            };

            // Create the tooltip, and set it as active
            const tooltip = device.uiController?.createTooltip?.(getPosition, topContextData);
            if (tooltip) {
                device.uiController?.setActiveTooltip?.(tooltip);
            }
        },
        /**
         * @param {IdentityObject|CreditCardObject|CredentialsObject|{email:string, id: string}} data
         * @param {string} type
         * @returns {Promise<void>}
         */
        async selectedDetail(data, type) {
            const detailsEntries = Object.entries(data).map(([key, value]) => {
                return [key, String(value)];
            });
            const entries = Object.fromEntries(detailsEntries);
            /** @link {import("../deviceApiCalls/schemas/getAutofillData.result.json")} */
            await device.deviceApi.notify(new SelectedDetailCall({ data: entries, configType: type }));
        },
    };
}
