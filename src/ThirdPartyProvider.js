import { AskToUnlockProviderCall, CheckCredentialsProviderStatusCall } from './deviceApiCalls/__generated__/deviceApiCalls.js'
import { providerStatusUpdatedSchema } from './deviceApiCalls/__generated__/validators.zod.js'
import { getSubtypeFromType } from './Form/matching.js'
import { validate } from '../packages/device-api/index.js'

export class ThirdPartyProvider {
    /**
     * @param {import("./DeviceInterface/InterfacePrototype").default} device
     */
    constructor(device) {
        this.device = device
    }
    init() {
        if (this.device.settings.featureToggles.third_party_credentials_provider) {
            if (this.device.globalConfig.hasModernWebkitAPI) {
                Object.defineProperty(window, 'providerStatusUpdated', {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: (data) => {
                        this.providerStatusUpdated(data)
                    },
                })
            } else {
                // On Catalina we poll the native layer
                setTimeout(() => this._pollForUpdatesToCredentialsProvider(), 2000)
            }
        }
    }

    async askToUnlockProvider() {
        const response = await this.device.deviceApi.request(new AskToUnlockProviderCall(null))
        this.providerStatusUpdated(response)
    }

    /**
     * Called by the native layer on all tabs when the provider status is updated
     * @param {import("./deviceApiCalls/__generated__/validators-ts").ProviderStatusUpdated} data
     */
    providerStatusUpdated(data) {
        try {
            const { credentials, availableInputTypes } = validate(data, providerStatusUpdatedSchema)

            // Update local settings and data
            this.device.settings.setAvailableInputTypes(availableInputTypes)
            this.device.storeLocalCredentials(credentials)

            // rerender the tooltip
            this.device.uiController?.updateItems(credentials)

            if (!this.device.globalConfig.isTopFrame) {
                // If the tooltip is open on an autofill type that's not available, close it
                const currentInputSubtype = getSubtypeFromType(this.device.getCurrentInputType())
                if (!availableInputTypes.credentials?.[currentInputSubtype]) {
                    this.device.removeTooltip()
                }
                // Redecorate fields according to the new types
                this.device.scanner.forms.forEach((form) => form.recategorizeAllInputs())
            }
        } catch (e) {
            if (this.device.globalConfig.isDDGTestMode) {
                console.log('isDDGTestMode: providerStatusUpdated error: ❌', e)
            }
        }
    }

    // Only used on Catalina
    async _pollForUpdatesToCredentialsProvider() {
        try {
            const response = await this.device.deviceApi.request(new CheckCredentialsProviderStatusCall(null))
            if (
                response.availableInputTypes.credentialsProviderStatus !==
                this.device.settings.availableInputTypes.credentialsProviderStatus
            ) {
                this.providerStatusUpdated(response)
            }
            setTimeout(() => this._pollForUpdatesToCredentialsProvider(), 2000)
        } catch (e) {
            if (this.device.globalConfig.isDDGTestMode) {
                console.log('isDDGTestMode: _pollForUpdatesToCredentialsProvider: ❌', e)
            }
        }
    }
}
