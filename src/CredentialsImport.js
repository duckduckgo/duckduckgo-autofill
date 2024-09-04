import { CloseAutofillParentCall, StartCredentialsImportFlowCall } from './deviceApiCalls/__generated__/deviceApiCalls.js'

/**
 * Use this as place to store any state or functionality related to password import promotion
 */
class CredentialsImport {
    /** @param {import("./DeviceInterface/InterfacePrototype").default} device */
    constructor (device) {
        this.device = device
    }

    /**
     * Check if password promotion prompt should be shown. Only returns valid value in the main webiew.
     */
    isAvailable () {
        // Ideally we should also be checking activeForm?.isLogin or activeForm?.isHybrid, however
        // in some instance activeForm is not yet initialise (when decorating the page).
        return this.device.settings.availableInputTypes.credentialsImport
    }

    init () {
        if (!this.device.globalConfig.hasModernWebkitAPI) return

        try {
            // Set up a function which can be called from the native layer after completed sign-up or sign-in.
            Object.defineProperty(window, 'credentialsImportFinished', {
                enumerable: false,
                configurable: false,
                writable: false,
                value: () => {
                    this.refresh()
                }
            })
        } catch (e) {
            // Ignore if function can't be set up, it's a UX enhancement not a critical flow
        }
    }

    async refresh () {
        // Refresh all settings (e.g availableInputTypes)
        await this.device.settings.refresh()

        // Re-decorate all inputs to show the input decorations
        this.device.activeForm?.redecorateAllInputs(false)

        // Make sure the tooltip is closed before we try to open it
        this.device.uiController?.removeTooltip('interface')

        const activeInput = this.device.activeForm?.activeInput
        activeInput?.focus()
    }

    async started () {
        this.device.deviceApi.notify(new CloseAutofillParentCall(null))
        this.device.deviceApi.notify(new StartCredentialsImportFlowCall({}))
    }
}

export { CredentialsImport }
