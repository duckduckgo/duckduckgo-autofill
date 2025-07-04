import {
    CloseAutofillParentCall,
    CredentialsImportFlowPermanentlyDismissedCall,
    StartCredentialsImportFlowCall,
} from './deviceApiCalls/__generated__/deviceApiCalls.js';

/**
 * Use this as place to store any state or functionality related to password import promotion
 */
class CredentialsImport {
    /** @param {import("./DeviceInterface/InterfacePrototype").default} device */
    constructor(device) {
        this.device = device;
    }

    /**
     * Check if password promotion prompt should be shown. Only returns valid value in the main webiew.
     */
    isAvailable() {
        // Ideally we should also be checking activeForm?.isLogin or activeForm?.isHybrid, however
        // in some instance activeForm is not yet initialized (when decorating the page).
        return Boolean(this.device.settings.availableInputTypes.credentialsImport);
    }

    init() {
        if (!this.device.globalConfig.hasModernWebkitAPI) return;

        try {
            // Set up a function which can be called from the native layer after completed sign-up or sign-in.
            Object.defineProperty(window, 'credentialsImportFinished', {
                enumerable: false,
                configurable: false,
                writable: false,
                value: () => {
                    this.refresh();
                },
            });
        } catch (e) {
            // Ignore if function can't be set up, it's a UX enhancement not a critical flow
        }
    }

    /**
     * @param {import("./deviceApiCalls/__generated__/validators-ts").AvailableInputTypes} [availableInputTypes]
     */
    async refresh(availableInputTypes) {
        this.device.settings.setAvailableInputTypes(availableInputTypes || (await this.device.settings.getAvailableInputTypes()));

        // Re-decorate all inputs to show the input decorations
        this.device.activeForm?.redecorateAllInputs();

        // Make sure the tooltip is closed before we try to open it
        this.device.uiController?.removeTooltip('interface');

        const activeInput = this.device.activeForm?.activeInput;

        const availableCredentials = this.device.settings.availableInputTypes.credentials;
        if (this.device.activeForm && activeInput && (availableCredentials?.username || availableCredentials?.password)) {
            // On mobile we explicitly attach the tooltip, as focus or click events are not enough to trigger the tooltip
            this.device.attachTooltip({
                form: this.device.activeForm,
                input: activeInput,
                click: null,
                trigger: 'credentialsImport',
                triggerMetaData: {
                    type: 'transactional',
                },
            });
        }
    }

    async started() {
        this.device.deviceApi.notify(new StartCredentialsImportFlowCall({}));
        this.device.deviceApi.notify(new CloseAutofillParentCall(null));
    }

    async dismissed() {
        this.device.deviceApi.notify(new CredentialsImportFlowPermanentlyDismissedCall(null));
        this.device.deviceApi.notify(new CloseAutofillParentCall(null));
    }
}

export { CredentialsImport };
