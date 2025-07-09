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
        const inputTypes = availableInputTypes || (await this.device.settings.getAvailableInputTypes());
        this.device.settings.setAvailableInputTypes(inputTypes);

        // Re-decorate all inputs to show the input decorations
        // Include other forms too, as credentials might now be available in other forms.
        this.device.scanner.forms.forEach((form) => form.redecorateAllInputs());

        // Make sure the tooltip is closed before we try to open it
        this.device.uiController?.removeTooltip('interface');

        const activeForm = this.device.activeForm;
        // If no active form, we can't show the prompt
        if (!activeForm) return;

        const { activeInput } = activeForm;

        const { username, password } = this.device.settings.availableInputTypes.credentials || {};
        if (activeInput && (username || password)) {
            // Attach tooltip again to force prompt the credentials prompt,
            // if username or password become available.
            this.device.attachTooltip({
                form: activeForm,
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
