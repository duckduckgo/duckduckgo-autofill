import { isEventWithinDax } from '../../autofill-utils.js'
import {getInputConfigFromType} from '../../Form/inputTypeConfig.js'
import {getSubtypeFromType} from '../../Form/matching.js'
import DataHTMLTooltip from '../DataHTMLTooltip.js'
import EmailHTMLTooltip from '../EmailHTMLTooltip.js'
import EmailSignupHTMLTooltip from '../EmailSignupHTMLTooltip.js'
import {defaultOptions} from '../HTMLTooltip.js'
import {UIController} from './UIController.js'

/**
 * @typedef HTMLTooltipControllerOptions
 * @property {"modern" | "legacy" | "emailsignup"} tooltipKind - A choice between the newer Autofill UI vs the older ones used in the extension
 * @property {import("../../DeviceInterface/InterfacePrototype").default} device - The device interface that's currently running
 * regardless of whether this Controller has an open tooltip, or not
 */

/**
 * This encapsulates all the logic relating to showing/hiding the HTML Tooltip
 *
 * Note: This could be displayed in the current webpage (for example, in the extension)
 * or within a webview overlay (like on macOS & upcoming in windows)
 */
export class HTMLTooltipUIController extends UIController {
    /** @type {import("../HTMLTooltip.js").HTMLTooltip | null} */
    _activeTooltip = null

    /** @type {HTMLTooltipControllerOptions} */
    _options

    /** @type {import('../HTMLTooltip.js').HTMLTooltipOptions} */
    _htmlTooltipOptions

    /**
     * Overwritten when calling createTooltip
     * @type {import('../../Form/matching').SupportedTypes}
     */
    _activeInputType = 'unknown'

    /**
     * @param {HTMLTooltipControllerOptions} options
     * @param {Partial<import('../HTMLTooltip.js').HTMLTooltipOptions>} htmlTooltipOptions
     */
    constructor (options, htmlTooltipOptions = defaultOptions) {
        super()
        this._options = options
        this._htmlTooltipOptions = Object.assign({}, defaultOptions, htmlTooltipOptions)
        // Use pointerup to mimic native click behaviour when we're in the top-frame webview
        if (options.device.globalConfig.isTopFrame) {
            window.addEventListener('pointerup', this, true)
        } else {
            // Pointerdown is needed here to avoid self-closing modals disappearing because this even happens in the page
            window.addEventListener('pointerdown', this, true)
        }
    }

    _activeInput
    _activeInputOriginalAutocomplete

    /**
     * Cleans up after this UI controller by removing the tooltip and all
     * listeners.
     */
    destroy () {
        this.removeTooltip()
        window.removeEventListener('pointerdown', this, true)
        window.removeEventListener('pointerup', this, true)
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
     * @param {import('../interfaces.js').PosFn} getPosition
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
            remove: () => this.removeTooltip(),
            isIncontextSignupAvailable: () => {
                const subtype = getSubtypeFromType(topContextData.inputType)
                return !!this._options.device.inContextSignup?.isAvailable(subtype)
            }

        }

        if (this._options.tooltipKind === 'legacy') {
            this._options.device.firePixel({pixelName: 'autofill_show'})
            return new EmailHTMLTooltip(config, topContextData.inputType, getPosition, tooltipOptions)
                .render(this._options.device)
        }

        if (this._options.tooltipKind === 'emailsignup') {
            this._options.device.firePixel({pixelName: 'incontext_show'})
            return new EmailSignupHTMLTooltip(config, topContextData.inputType, getPosition, tooltipOptions)
                .render(this._options.device)
        }

        // collect the data for each item to display
        const data = this._dataForAutofill(config, topContextData.inputType, topContextData)

        // convert the data into tool tip item renderers
        const asRenderers = data.map(d => config.tooltipItem(d))

        // construct the autofill
        return new DataHTMLTooltip(config, topContextData.inputType, getPosition, tooltipOptions)
            .render(config, asRenderers, {
                onSelect: (id) => {
                    this._onSelect(topContextData.inputType, data, id)
                },
                onManage: (type) => {
                    this._onManage(type)
                },
                onIncontextSignupDismissed: (flags) => {
                    this._onIncontextSignupDismissed(flags)
                },
                onIncontextSignup: () => {
                    this._onIncontextSignup()
                }
            })
    }

    updateItems (data) {
        if (this._activeInputType === 'unknown') return

        const config = getInputConfigFromType(this._activeInputType)

        // convert the data into tool tip item renderers
        const asRenderers = data.map(d => config.tooltipItem(d))

        const activeTooltip = this.getActiveTooltip()
        if (activeTooltip instanceof DataHTMLTooltip) {
            activeTooltip?.render(config, asRenderers, {
                onSelect: (id) => {
                    this._onSelect(this._activeInputType, data, id)
                },
                onManage: (type) => {
                    this._onManage(type)
                },
                onIncontextSignupDismissed: (flags) => {
                    this._onIncontextSignupDismissed(flags)
                },
                onIncontextSignup: () => {
                    this._onIncontextSignup()
                }
            })
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
        case 'pointerup': {
            this._pointerUpListener(event)
            break
        }
        }
    }

    // Global listener for event delegation
    _pointerDownListener (e) {
        if (!e.isTrusted) return
        // Ignore events on the Dax icon, we handle those elsewhere
        if (isEventWithinDax(e, e.target)) return

        // @ts-ignore
        if (e.target.nodeName === 'DDG-AUTOFILL') {
            this._handleClickInTooltip(e)
        } else {
            this.removeTooltip().catch(e => {
                console.error('error removing tooltip', e)
            })
        }
    }

    // Global listener for event delegation
    _pointerUpListener (e) {
        if (!e.isTrusted) return
        // Ignore events on the Dax icon, we handle those elsewhere
        if (isEventWithinDax(e, e.target)) return

        // @ts-ignore
        if (e.target.nodeName === 'DDG-AUTOFILL') {
            this._handleClickInTooltip(e)
        }
    }

    _handleClickInTooltip (e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        const isMainMouseButton = e.button === 0
        if (!isMainMouseButton) return

        const activeTooltip = this.getActiveTooltip()
        activeTooltip?.dispatchClick()
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

    /**
     * Collect the data that's needed to populate the Autofill UI.
     *
     * Note: ideally we'd pass this data instead, so that we didn't have a circular dependency
     *
     * @param {InputTypeConfigs} config - This is the selected `InputTypeConfig` based on the type of field
     * @param {import('../../Form/matching').SupportedTypes} inputType - The input type for the current field
     * @param {TopContextData} topContextData
     */
    _dataForAutofill (config, inputType, topContextData) {
        return this._options.device.dataForAutofill(config, inputType, topContextData)
    }

    /**
     * When a field is selected, call the `onSelect` method from the device.
     *
     * Note: ideally we'd pass this data instead, so that we didn't have a circular dependency
     *
     * @param {import('../../Form/matching').SupportedTypes} inputType
     * @param {(CreditCardObject | IdentityObject | CredentialsObject)[]} data
     * @param {CreditCardObject['id']|IdentityObject['id']|CredentialsObject['id']} id
     */
    _onSelect (inputType, data, id) {
        return this._options.device.onSelect(inputType, data, id)
    }

    /**
     * Called when clicking on the Manage… button in the html tooltip
     *
     * @param {SupportedMainTypes} type
     * @returns {*}
     * @private
     */
    _onManage (type) {
        this.removeTooltip()
        switch (type) {
        case 'credentials':
            return this._options.device.openManagePasswords()
        case 'creditCards':
            return this._options.device.openManageCreditCards()
        case 'identities':
            return this._options.device.openManageIdentities()
        default:
            // noop
        }
    }

    _onIncontextSignupDismissed ({ hasOtherOptions }) {
        this._options.device.inContextSignup?.onIncontextSignupDismissed({ shouldHideTooltip: !hasOtherOptions })

        // If there are other options available, just force a re-render
        if (hasOtherOptions) {
            const topContextData = this._options.device.getTopContextData()
            if (!topContextData) return
            const config = getInputConfigFromType(topContextData.inputType)
            const data = this._dataForAutofill(config, topContextData.inputType, topContextData)
            this.updateItems(data)
        }
    }

    _onIncontextSignup () {
        this._options.device.inContextSignup?.onIncontextSignup()
    }

    isActive () {
        return Boolean(this.getActiveTooltip())
    }
}
