/**
 * @typedef AttachTooltipArgs The argument required to 'attachTooltip'
 * @property {import("../../Form/Form").Form} form the Form that triggered this 'attach' call
 * @property {HTMLInputElement} input the input field that triggered this 'attach' call
 * @property {() => { x: number; y: number; height: number; width: number; }} getPosition A function that provides positioning information
 * @property {{x: number, y: number}|null} click The click positioning
 * @property {TopContextData} topContextData
 * @property {import("../../DeviceInterface/InterfacePrototype").default} device
 * @property {import('../../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest['trigger']} trigger
 * @property {{type: 'explicit-opt-in' | 'implicit-opt-in' | 'transactional'}} triggerMetaData - metadata about the trigger, used to make client-side decisions
 */

/**
 * @typedef AttachKeyboardArgs The argument required to 'attachKeyboard'
 * @property {import("../../DeviceInterface/InterfacePrototype").default} device
 * @property {import("../../Form/Form").Form} form the Form that triggered this call
 */

/**
 * This is the base interface that `UIControllers` should extend/implement
 */
export class UIController {
    /**
     * Implement this method to control what happen when Autofill
     * has enough information to 'attach' a tooltip.
     *
     * @param {AttachTooltipArgs} _args
     * @returns {void}
     */
    attachTooltip(_args) {
        throw new Error('must implement attachTooltip');
    }

    /**
     * Implement this method to control what happen when Autofill
     * has enough information to show the keyboard extension.
     *
     * @param {AttachKeyboardArgs} _args
     * @returns {void}
     */
    attachKeyboard(_args) {
        throw new Error('must implement attachKeyboard');
    }

    /**
     * Implement this if your tooltip can be created from positioning
     * + topContextData.
     *
     * For example, in an 'overlay' on macOS/Windows this is needed since
     * there's no page information to call 'attach' above.
     *
     * @param {import("../interfaces").PosFn} _pos
     * @param {TopContextData} _topContextData
     * @returns {any | null}
     */
    createTooltip(_pos, _topContextData) {}
    /**
     * @param {string} _via
     */
    removeTooltip(_via) {}

    /**
     * Set the currently open HTMLTooltip instance
     *
     * @param {import("../HTMLTooltip.js").HTMLTooltip} _tooltip
     */
    setActiveTooltip(_tooltip) {}

    /**
     * Get the currently open HTMLTooltip instance, if one exists
     *
     * @returns {import("../HTMLTooltip.js").HTMLTooltip | null}
     */
    getActiveTooltip() {
        return null;
    }

    /**
     * Indicate whether the controller deems itself 'active'
     *
     * @returns {boolean}
     */
    isActive() {
        return false;
    }

    /**
     * Updates the items in the tooltip based on new data. Currently only supporting credentials.
     * @param {CredentialsObject[]} _data
     */
    updateItems(_data) {}
    destroy() {}
}
