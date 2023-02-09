import { validate } from "../../../packages/device-api";
import {
    AskToUnlockProviderCall,
    CheckCredentialsProviderStatusCall
} from "../../deviceApiCalls/__generated__/deviceApiCalls";
import {providerStatusUpdatedSchema} from "../../deviceApiCalls/__generated__/validators.zod";
import {getInputType, getSubtypeFromType} from "../../Form/matching";

export class ThirdPartyCredentials {
    /**
     * @param {import('../../DeviceInterface/InterfacePrototype.js').default} device
     */
    constructor(device) {
        this.device = device;
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
                    }
                })
            } else {
                // On Catalina we poll the native layer
                console.log('REGISTER POLL');
                setTimeout(() => this._pollForUpdatesToCredentialsProvider(), 2000)
            }
        }
    }
    async _pollForUpdatesToCredentialsProvider() {
        try {
            const response = await this.device.deviceApi.request(new CheckCredentialsProviderStatusCall(null))
            if (response.availableInputTypes.credentialsProviderStatus !== this.device.settings.availableInputTypes.credentialsProviderStatus) {
                this.providerStatusUpdated(response)
            }
            setTimeout(() => this._pollForUpdatesToCredentialsProvider(), 2000)
        } catch (e) {
            if (this.device.globalConfig.isDDGTestMode) {
                console.log('isDDGTestMode: _pollForUpdatesToCredentialsProvider: ❌', e)
            }
        }
    }
    /**
     * Called by the native layer on all tabs when the provider status is updated
     * @param {import("../../deviceApiCalls/__generated__/validators-ts").ProviderStatusUpdated} data
     */
    providerStatusUpdated(data) {
        console.log("providerStatusUpdated", this.device.ctx);
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern": {
                try {
                    const {credentials, availableInputTypes} = validate(data, providerStatusUpdatedSchema)

                    // Update local settings and data
                    this.device.settings.setAvailableInputTypes(availableInputTypes)
                    this.device.storeLocalCredentials(credentials)

                    // rerender the tooltip
                    this.device.uiController?.updateItems(credentials)

                    // If the tooltip is open on an autofill type that's not available, close it
                    const topContextData = this.device.getTopContextData()
                    const currentInoutType = topContextData?.inputType
                        ? topContextData.inputType
                        : getInputType(this.device.activeForm?.activeInput)

                    const currentInputSubtype = getSubtypeFromType(currentInoutType)
                    if (!availableInputTypes.credentials?.[currentInputSubtype]) {
                        this.device.removeTooltip('providerStatusUpdated')
                    }
                    // Redecorate fields according to the new types
                    this.device.scanner.forms.forEach(form => form.recategorizeAllInputs())
                } catch (e) {
                    if (this.device.globalConfig.isDDGTestMode) {
                        console.log('isDDGTestMode: providerStatusUpdated error: ❌', e)
                    }
                }
                break;
            }
            case "macos-overlay": {
                break;
            }
            case "ios":
            case "android":
            case "windows":
            case "windows-overlay":
            case "extension":
            default: {
                throw new Error('unreachable')
            }
        }
    }
    async askToUnlockProvider() {
        switch (this.device.ctx) {
            case "macos-overlay": {
                const data = await this.device.deviceApi.request(new AskToUnlockProviderCall(null))
                const {credentials, availableInputTypes} = validate(data, providerStatusUpdatedSchema)

                // Update local settings and data
                this.device.settings.setAvailableInputTypes(availableInputTypes)
                this.device.storeLocalCredentials(credentials)

                // rerender the tooltip
                this.device.uiController?.updateItems(credentials)
                break;
            }
        }
    }
}
