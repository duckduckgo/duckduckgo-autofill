import {SelectedDetailCall, SetSizeCall} from '../deviceApiCalls/__generated__/deviceApiCalls'

/**
 * These are the re-usable parts from the overlay code
 * @param {import("./InterfacePrototype").default} device
 */
export function overlayApi (device) {
    return {
        _setupTopFrame () {
            const topContextData = device.getTopContextData()
            if (!topContextData) throw new Error('unreachable, topContextData should be available')

            // Provide dummy values, they're not used
            const getPosition = () => {
                return {
                    x: 0,
                    y: 0,
                    height: 50,
                    width: 50
                }
            }

            // Create the tooltip, and set it as active
            const tooltip = device.uiController.createTooltip?.(getPosition, topContextData)
            if (tooltip) {
                device.uiController.setActiveTooltip?.(tooltip)
            }
        },
        /**
         * This is overridden in the Overlay, so that instead of trying to fill a form
         * with the selected credentials, we instead send a message to the native
         * side. Once received, the native side will store that selection so that a
         * subsequence call from main webpage can retrieve it via polling.
         *
         * @override
         * @param detailIn
         * @param configType
         * @returns {Promise<void>}
         */
        async selectedDetail (detailIn, configType) {
            let detailsEntries = Object.entries(detailIn).map(([key, value]) => {
                return [key, String(value)]
            })
            const data = Object.fromEntries(detailsEntries)
            await device.deviceApi.notify(new SelectedDetailCall({data, configType}))
        },
        /**
         * When the HTMLTooltip calls 'setSize', we forward that message to the native layer
         * so that the window that contains the Autofill UI can be set correctly.
         *
         * This is an overlay-only scenario - normally 'setSize' isn't needed (like in the extension)
         * because the HTML element will grow as needed.
         *
         * @param {{height: number, width: number}} details
         */
        async setSize (details) {
            await device.deviceApi.notify(new SetSizeCall(details))
        }
    }
}
