import {getInputConfigFromType} from '../../Form/inputTypeConfig.js'
import {defaultOptions, HTMLTooltip} from '../HTMLTooltip.js'
import {UIController} from './UIController.js'

/**
 * This encapsulates all the logic relating to showing/hiding the HTML Tooltip
 *
 * Note: This could be displayed in the current webpage (for example, in the extension)
 * or within a webview overlay (like on macOS & upcoming in windows)
 * @implements UIController
 */
export class HTMLTooltipUIController {
    /** @type {import("../HTMLTooltip.js").HTMLTooltip | null} */
    _activeTooltip = null

    /** @type {import("../../DeviceInterface/InterfacePrototype").default} */
    device;

    /** @type {import('../HTMLTooltip.js').HTMLTooltipOptions} */
    _htmlTooltipOptions;

    /**
     * Overwritten when calling createTooltip
     * @type {import('../../Form/matching').SupportedTypes}
     */
    _activeInputType = 'unknown';

    /**
     * @param {import("../../DeviceInterface/InterfacePrototype").default} device
     * @param {"modern" | "legacy" | "emailsignup"} kind
     * @param {Partial<import('../HTMLTooltip.js').HTMLTooltipOptions>} htmlTooltipOptions
     */
    constructor (device, kind, htmlTooltipOptions = defaultOptions) {
        this.device = device
        this.kind = kind
        this._htmlTooltipOptions = Object.assign({}, defaultOptions, htmlTooltipOptions)
        window.addEventListener('pointerdown', this, true)
    }

    _activeInput;
    _activeInputOriginalAutocomplete;

    /**
     * Cleans up after this UI controller by removing the tooltip and all
     * listeners.
     */
    destroy () {
        this.removeTooltip()
        window.removeEventListener('pointerdown', this, true)
    }

    /**
     * @param {import('./UIController').AttachArgs} args
     */
    attach (args) {
        if (this.getActiveTooltip()) {
            return
        }
        const { topContextData, getPosition, input, form } = args
        const tooltip = this.createTooltip(getPosition, topContextData)
        this.setActiveTooltip(tooltip)
        form.showingTooltip(input)

        this._activeInput = input
        this._activeInputOriginalAutocomplete = input.getAttribute('autocomplete')
        input.setAttribute('autocomplete', 'off')
    }

    /**
     * Actually create the HTML Tooltip
     * @param {PosFn} getPosition
     * @param {TopContextData} topContextData
     * @return {import("../HTMLTooltip").HTMLTooltip}
     */
    createTooltip (getPosition, topContextData) {
        this._attachListeners()
        const config = getInputConfigFromType(topContextData.inputType)
        this._activeInputType = topContextData.inputType

        /**
         * @type {import('../HTMLTooltip').HTMLTooltipOptions}
         */
        const tooltipOptions = {
            ...this._htmlTooltipOptions,
            remove: () => this.removeTooltip()
        }

        const tt = new HTMLTooltip(config, topContextData.inputType, getPosition, tooltipOptions);
        tt.kind = this.kind;

        return tt.render(this.device, topContextData);
    }

    /**
     * @param {TopContextData} data
     */
    updateItems (data) {
        if (this._activeInputType === 'unknown') return

        const config = getInputConfigFromType(this._activeInputType)

        const activeTooltip = this.getActiveTooltip()
        if (activeTooltip && activeTooltip.kind === 'modern') {
            activeTooltip.config = config;
            activeTooltip.render(this.device, data)
        }
        // TODO: can we remove this timeout once implemented with real APIs?
        // The timeout is needed because clientHeight and clientWidth were returning 0
        setTimeout(() => {
            this.getActiveTooltip()?.setSize()
        }, 10)
    }

    _attachListeners () {
        window.addEventListener('input', this)
        window.addEventListener('keydown', this, true)
    }

    _removeListeners () {
        window.removeEventListener('input', this)
        window.removeEventListener('keydown', this, true)
    }

    handleEvent (event) {
        switch (event.type) {
        case 'keydown':
            if (['Escape', 'Tab', 'Enter'].includes(event.code)) {
                if (event.code === 'Escape') {
                    event.preventDefault()
                    event.stopImmediatePropagation()
                }
                this.removeTooltip()
            }
            break
        case 'input':
            this.removeTooltip()
            break
        case 'pointerdown': {
            this._pointerDownListener(event)
            break
        }
        }
    }

    // Global listener for event delegation
    _pointerDownListener (e) {
        if (!e.isTrusted) return

        // @ts-ignore
        if (e.target.nodeName === 'DDG-AUTOFILL') {
            e.preventDefault()
            e.stopImmediatePropagation()

            const activeTooltip = this.getActiveTooltip()
            if (!activeTooltip) {
                console.warn('Could not get activeTooltip')
            } else {
                activeTooltip.dispatchClick()
            }
        } else {
            this.removeTooltip().catch(e => {
                console.error('error removing tooltip', e)
            })
        }
    }

    async removeTooltip (_via) {
        this._htmlTooltipOptions.remove()
        if (this._activeTooltip) {
            this._removeListeners()
            this._activeTooltip.remove()
            this._activeTooltip = null
        }

        if (this._activeInput) {
            if (this._activeInputOriginalAutocomplete) {
                this._activeInput.setAttribute('autocomplete', this._activeInputOriginalAutocomplete)
            } else {
                this._activeInput.removeAttribute('autocomplete')
            }
            this._activeInput = null
            this._activeInputOriginalAutocomplete = null
        }
    }

    /**
     * @returns {import("../HTMLTooltip.js").HTMLTooltip|null}
     */
    getActiveTooltip () {
        return this._activeTooltip
    }

    /**
     * @param {import("../HTMLTooltip.js").HTMLTooltip} value
     */
    setActiveTooltip (value) {
        this._activeTooltip = value
    }

    isActive () {
        return Boolean(this.getActiveTooltip())
    }
}
