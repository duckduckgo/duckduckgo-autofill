import InterfacePrototype from './InterfacePrototype'

class WindowsInterface extends InterfacePrototype {
    async setupAutofill () {

        // which data types can this platform actually support?
        const availableTypes = await this.runtime.getAvailableInputTypes();

        // todo(Shane): Rework this bit
        if (!this.autofillSettings.featureToggles.inputType_credentials) {
            availableTypes.credentials = false;
        }

        if (!this.autofillSettings.featureToggles.inputType_creditCards) {
            availableTypes.creditCards = false;
        }

        if (!this.autofillSettings.featureToggles.inputType_identities) {
            availableTypes.identities = false;
        }

        this.scanner
            .setAvailableInputTypes(availableTypes)
            .init();
    }
}

export { WindowsInterface }
