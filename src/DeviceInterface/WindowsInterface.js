import InterfacePrototype from './InterfacePrototype'
import {CSS_STYLES} from '../UI/styles/styles'

class WindowsInterface extends InterfacePrototype {
    async setupAutofill () {
        const initData = await this.runtime.getAutofillInitData();
        console.log(JSON.stringify({initData}));
        this.storeLocalData(initData);
        const cleanup = this.scanner.init()
        this.addLogoutListener(cleanup)
    }
    tooltipStyles () {
        return `<style>${CSS_STYLES}</style>`
    }
}

export { WindowsInterface }
