import InterfacePrototype from './InterfacePrototype'
import {CSS_STYLES} from '../UI/styles/styles'

class WindowsInterface extends InterfacePrototype {
    async setupAutofill () {
        // todo(Shane): is this is the correct place to determine this?
        const initData = await this.runtime.getAutofillInitData()
        this.storeLocalData(initData)
        const cleanup = this.scanner.init()
        this.addLogoutListener(cleanup)
    }
    async getAutofillCredentials (id) {
        return this.runtime.getAutofillCredentials(id)
    }
    tooltipStyles () {
        return `<style>${CSS_STYLES}</style>`
    }
}

export { WindowsInterface }
