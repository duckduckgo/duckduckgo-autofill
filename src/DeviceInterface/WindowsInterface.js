import InterfacePrototype from './InterfacePrototype'

class WindowsInterface extends InterfacePrototype {
    async setupAutofill () {
        this.scanner.init()
    }
}

export { WindowsInterface }
