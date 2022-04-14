import InterfacePrototype from './InterfacePrototype'

class WindowsInterface extends InterfacePrototype {
    async setupAutofill () {
        // super.setupAutofill();
        const availableTypes = await this.runtime.getAvailableInputTypes();
        this.scanner.init();
        // console.log({availableTypes: JSON.stringify(availableTypes, null, 2)});
    }
}

export { WindowsInterface }
