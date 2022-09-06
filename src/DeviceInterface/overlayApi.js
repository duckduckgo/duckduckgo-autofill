/**
 * These are some re-usable parts for handling 'overlays' (like on macOS + Windows)
 *
 * @param {import("./InterfacePrototype").default} device
 */
export function overlayApi (device) {
    /**
     * The native side will send a custom event 'mouseMove' to indicate
     * that the HTMLTooltip should fake an element being focussed.
     *
     * Note: There's no cleanup required here since the Overlay has a fresh
     * page load every time it's opened.
     */
    window.addEventListener('mouseMove', (event) => {
        const activeTooltip = device.uiController.getActiveTooltip?.()
        activeTooltip?.focus(event.detail.x, event.detail.y)
    })

    return {
        /**
         * When we are inside an 'overlay' - the HTML tooltip will be opened immediately
         */
        showImmediately () {
            const topContextData = device.getTopContextData()
            if (!topContextData) throw new Error('unreachable, topContextData should be available')

            // Provide dummy values
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
        }

    }
}
