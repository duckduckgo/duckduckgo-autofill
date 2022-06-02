import InterfacePrototype from './InterfacePrototype'
import {OverlayUIController} from '../UI/controllers/OverlayUIController'
import {waitForWindowsResponse} from '../deviceApiCalls/transports/windows.transport'
import {CloseAutofillParentCall, ShowAutofillParentCall} from '../deviceApiCalls/__generated__/deviceApiCalls'

/**
 * @typedef {import('../UI/controllers/OverlayUIController').ShowAutofillParentRequest} ShowAutofillParentRequest
 */

export class WindowsInterface extends InterfacePrototype {
    ready = false;
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
     * @param {ShowAutofillParentRequest} details
     */
    async _show (details) {
        await this.deviceApi.notify(new ShowAutofillParentCall(details))
        const { success } = await waitForWindowsResponse('selectedDetailResponse')
        this.activeFormSelectedDetail(success.data, success.configType)
        this._closeAutofillParent()
            .then(e => {
                if (this.globalConfig.isDDGTestMode) {
                    console.error('Could not close', e)
                }
            })
    }

    /**
     * @returns {Promise<any>}
     */
    async _closeAutofillParent () {
        return this.deviceApi.notify(new CloseAutofillParentCall(null))
    }
    /**
     * on macOS we try to detect if a click occurred within a form
     * @param {PointerEvent} event
     */
    _onPointerDown (event) {
        if (this.ready) {
            if (this.settings.featureToggles.credentials_saving) {
                this._detectFormSubmission(event)
            }
        } else {
            console.log('prevented featureToggles access')
        }
    }
    /**
     * @param {PointerEvent} event
     */
    _detectFormSubmission (event) {
        // note: This conditional will be replaced with feature flagging soon
        const matchingForm = [...this.scanner.forms.values()].find(
            (form) => {
                const btns = [...form.submitButtons]
                // @ts-ignore
                if (btns.includes(event.target)) return true

                // @ts-ignore
                if (btns.find((btn) => btn.contains(event.target))) return true
            }
        )

        matchingForm?.submitHandler()
    }
}
