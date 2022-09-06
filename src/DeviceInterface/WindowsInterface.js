import InterfacePrototype from './InterfacePrototype.js'
import {OverlayUIController} from '../UI/controllers/OverlayUIController.js'
import {CloseAutofillParentCall, GetAutofillDataCall} from '../deviceApiCalls/__generated__/deviceApiCalls.js'

/**
 * @typedef {import('../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest} GetAutofillDataRequest
 */

export class WindowsInterface extends InterfacePrototype {
    ready = false;
    /** @type {AbortController|null} */
    _abortController = null;
    /**
     * @deprecated This is too early, and will be removed eventually.
     * @returns {Promise<boolean>}
     */
    async isEnabled () {
        return true
    }

    isEnabledViaSettings () {
        return Boolean(this.settings.enabled)
    }

    postInit () {
        const cleanup = this.scanner.init()
        this.addLogoutListener(cleanup)
        this.ready = true
    }

    createUIController () {
        /**
         * If we get here, we're just a controller for an overlay
         */
        return new OverlayUIController({
            remove: async () => this._closeAutofillParent(),
            show: async (details) => this._show(details),
            onPointerDown: (event) => this._onPointerDown(event)
        })
    }

    /**
     * @param {GetAutofillDataRequest} details
     */
    async _show (details) {
        const { mainType } = details
        // prevent overlapping listeners
        if (this._abortController && !this._abortController.signal.aborted) {
            this._abortController.abort()
        }
        this._abortController = new AbortController()
        this.deviceApi.request(new GetAutofillDataCall(details), { signal: this._abortController.signal })
            .then(resp => {
                if (!this.currentAttached) {
                    throw new Error('this.currentAttached was absent')
                }
                switch (resp.action) {
                case 'fill': {
                    if (mainType in resp) {
                        this.currentAttached?.autofillData(resp[mainType], mainType)
                    } else {
                        throw new Error(`action: "fill" cannot occur because "${mainType}" was missing`)
                    }
                    break
                }
                case 'focus': {
                    this.currentAttached?.activeInput?.focus()
                    break
                }
                case 'none': {
                    // do nothing
                    break
                }
                default: {
                    if (this.globalConfig.isDDGTestMode) {
                        console.warn('unhandled response', resp)
                    }
                }
                }
                return this._closeAutofillParent()
            })
            .catch(e => {
                if (this.globalConfig.isDDGTestMode) {
                    if (e.name === 'AbortError') {
                        console.log('Promise Aborted')
                    } else {
                        console.error('Promise Rejected', e)
                    }
                }
            })
    }

    /**
     * @returns {Promise<any>}
     */
    async _closeAutofillParent () {
        return this.deviceApi.notify(new CloseAutofillParentCall(null))
    }
}
