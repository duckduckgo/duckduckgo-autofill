import {
    AskToUnlockProviderCall,
    CheckCredentialsProviderStatusCall
} from "../deviceApiCalls/__generated__/deviceApiCalls";
import {getSubtypeFromType} from "../Form/matching";
import {validate} from "../../packages/device-api";
import {providerStatusUpdatedSchema} from "../deviceApiCalls/__generated__/validators.zod";

export class BitwardenIntegration {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    constructor(device) {
        this.device = device;
    }
    init() {
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
            setTimeout(() => this._pollForUpdatesToCredentialsProvider(), 2000)
        }
    }
    async askToUnlockProvider() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay": {
                const response = await this.device.deviceApi.request(new AskToUnlockProviderCall(null))
                this.providerStatusUpdated(response)
                return;
            }
            case "ios":
            case "android":
            case "windows":
            case "windows-overlay":
            case "extension":
                break;
            default:
                assertUnreachable(this.device.ctx)
        }
    }
    /**
     * Called by the native layer on all tabs when the provider status is updated
     * @param {import("../deviceApiCalls/__generated__/validators-ts").ProviderStatusUpdated} data
     */
    providerStatusUpdated(data) {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern": {
                try {
                    const {credentials, availableInputTypes} = validate(data, providerStatusUpdatedSchema)

                    // Update local settings and data
                    this.device.settings.setAvailableInputTypes(availableInputTypes)
                    this.device.localData.storeLocalCredentials(credentials)
                    const inputType = this.device.getCurrentInputType()

                    // rerender the tooltip
                    this.device.uiController?.updateItems({credentials, inputType: inputType })
                    // If the tooltip is open on an autofill type that's not available, close it
                    const currentInputSubtype = getSubtypeFromType(this.device.getCurrentInputType())
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
                const {credentials, availableInputTypes} = validate(data, providerStatusUpdatedSchema)

                // Update local settings and data
                this.device.settings.setAvailableInputTypes(availableInputTypes)
                this.device.localData.storeLocalCredentials(credentials)
                const inputType = this.device.getCurrentInputType()

                // rerender the tooltip
                this.device.uiController?.updateItems({ credentials, inputType })
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
}

/**
 * @param {never} x
 * @returns {never}
 */
function assertUnreachable(x) {
    console.log(x)
    throw new Error("Didn't expect to get here");
}
