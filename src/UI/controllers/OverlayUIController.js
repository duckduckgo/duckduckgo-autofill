import {UIController} from './UIController.js'
import {getMainTypeFromType, getSubtypeFromType} from '../../Form/matching.js'
import { createNotification, createRequest } from '../../../packages/device-api/index.js';
import {
    CloseAutofillParentCall,
    GetAutofillDataCall,
} from "../../deviceApiCalls/__generated__/deviceApiCalls";

/**
 * @typedef {import('../../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest} GetAutofillDataRequest
 * @typedef {import('../../deviceApiCalls/__generated__/validators-ts').TriggerContext} TriggerContext
 *
 * @typedef OverlayControllerOptions
 * @property {() => Promise<void>} remove - A callback that will be fired when the tooltip should be removed
 * @property {(details: GetAutofillDataRequest) => Promise<void>} show - A callback that will be fired when the tooltip should be shown
 */

/**
 * Use this `OverlayController` when you want to control an overlay, but don't have
 * your own UI to display.
 *
 * For example, on macOS this `OverlayController` would run in the main webpage
 * and would then signal to its native side when the overlay should show/close
 *
 * @example `show` and `remove` can be implemented to match your native side's messaging needs
 *
 * ```javascript
 * const controller = new OverlayController()
 *
 * controller.attach(...)
 * ```
 */
export class OverlayUIController extends UIController {
    /** @type {"idle" | "parentShown"} */
    #state = 'idle';

    /**
     * @param {Extract<import('../../DeviceInterface/InterfacePrototype.js').Ctx, "macos-modern" | "windows">} ctx
     * @param {import('../../DeviceInterface/InterfacePrototype.js').default} device
     */
    constructor (ctx, device) {
        super()
        this.ctx = ctx
        this.device = device

        // We always register this 'pointerdown' event, regardless of
        // whether we have a tooltip currently open or not. This is to ensure
        // we can clear out any existing state before opening a new one.
        window.addEventListener('pointerdown', (event) => {
            this.handleEvent(event)
        }, true)
    }

    /**
     * @param {import('./UIController').AttachArgs} args
     */
    attach (args) {
        console.log('OverlayUIController:attach...')
        const {getPosition, topContextData, click, input} = args

        // Do not attach the tooltip if the input is not in the DOM
        if (!input.parentNode) {
            console.log('RETURN', '!input.parentNode');
            return
        }

        // If the input is removed from the DOM while the tooltip is attached, remove it
        this._mutObs = new MutationObserver((mutationList) => {
            for (const mutationRecord of mutationList) {
                mutationRecord.removedNodes.forEach(el => {
                    if (el.contains(input)) {
                        this.removeTooltip('mutation observer')
                    }
                })
            }
        })
        this._mutObs.observe(document.body, {childList: true, subtree: true})

        let delay = 0
        if (!click && !this.elementIsInViewport(getPosition())) {
            input.scrollIntoView(true)
            delay = 500
        }
        setTimeout(() => {
            this.showTopTooltip(click, getPosition(), topContextData)
                .catch(e => {
                    console.error('error from showTopTooltip', e)
                })
        }, delay)
    }

    /**
     * @param {{ x: number; y: number; height: number; width: number; }} inputDimensions
     * @returns {boolean}
     */
    elementIsInViewport (inputDimensions) {
        if (inputDimensions.x < 0 ||
            inputDimensions.y < 0 ||
            inputDimensions.x + inputDimensions.width > document.documentElement.clientWidth ||
            inputDimensions.y + inputDimensions.height > document.documentElement.clientHeight) {
            return false
        }
        const viewport = document.documentElement
        if (inputDimensions.x + inputDimensions.width > viewport.clientWidth ||
            inputDimensions.y + inputDimensions.height > viewport.clientHeight) {
            return false
        }
        return true
    }

    /**
     * @param {{ x: number; y: number; } | null} click
     * @param {{ x: number; y: number; height: number; width: number; }} inputDimensions
     * @param {TopContextData} data
     */
    async showTopTooltip (click, inputDimensions, data) {
        let diffX = inputDimensions.x
        let diffY = inputDimensions.y
        if (click) {
            diffX -= click.x
            diffY -= click.y
        } else if (!this.elementIsInViewport(inputDimensions)) {
            // If the focus event is outside the viewport ignore, we've already tried to scroll to it
            return
        }

        if (!data.inputType) {
            throw new Error('No input type found')
        }

        const mainType = getMainTypeFromType(data.inputType)
        const subType = getSubtypeFromType(data.inputType)

        if (mainType === 'unknown') {
            throw new Error('unreachable, should not be here if (mainType === "unknown")')
        }

        /** @type {GetAutofillDataRequest} */
        const details = {
            inputType: data.inputType,
            mainType,
            subType,
            serializedInputContext: JSON.stringify(data),
            triggerContext: {
                wasFromClick: Boolean(click),
                inputTop: Math.floor(diffY),
                inputLeft: Math.floor(diffX),
                inputHeight: Math.floor(inputDimensions.height),
                inputWidth: Math.floor(inputDimensions.width)
            }
        }

        try {
            switch (this.ctx) {
                case "macos-modern": {
                    const applePayload = {
                        ...details.triggerContext,
                        serializedInputContext: details.serializedInputContext
                    }
                    this.device.deviceApi.notify(createNotification('showAutofillParent', applePayload))
                    // start listening for a result
                    const listener = new Promise((resolve) => {
                        // Prevent two timeouts from happening
                        // @ts-ignore
                        const poll = async () => {
                            clearTimeout(this.pollingTimeout)
                            const response = await this.device.deviceApi.request(createRequest('getSelectedCredentials'))
                            switch (response.type) {
                                case 'none':
                                    // Parent hasn't got a selected credential yet
                                    // @ts-ignore
                                    this.pollingTimeout = setTimeout(() => {
                                        poll()
                                    }, 100)
                                    return
                                case 'ok': {
                                    return resolve({data: response.data, configType: response.configType})
                                }
                                case 'stop':
                                    // Parent wants us to stop polling
                                    resolve(null)
                                    break
                            }
                        }
                        poll()
                    });
                    listener.then((response) => {
                        if (!response) {
                            return
                        }
                        this.device.selectedDetail(response.data, response.configType)
                    }).catch(e => {
                        console.error('unknown error', e)
                    })
                    break;
                }
                case "windows": {
                    const {mainType} = details
                    // prevent overlapping listeners
                    if (this._abortController && !this._abortController.signal.aborted) {
                        this._abortController.abort()
                    }
                    this._abortController = new AbortController()
                    this.device.deviceApi.request(new GetAutofillDataCall(details), { signal: this._abortController.signal })
                        .then(resp => {
                            // console.log('got resp', resp.action);
                            if (!this.device.activeForm) {
                                throw new Error('this.currentAttached was absent')
                            }
                            switch (resp.action) {
                                case 'fill': {
                                    if (mainType in resp) {
                                        this.device.selectedDetail(resp[mainType], mainType);
                                    } else {
                                        throw new Error(`action: "fill" cannot occur because "${mainType}" was missing`)
                                    }
                                    break
                                }
                                case 'focus': {
                                    this.device.activeForm?.activeInput?.focus()
                                    break
                                }
                                case 'none': {
                                    // do nothing
                                    break
                                }
                                default: {
                                    if (this.device.globalConfig.isDDGTestMode) {
                                        console.warn('unhandled response', resp)
                                    }
                                }
                            }
                        })
                        .catch(e => {
                            if (this.device.globalConfig.isDDGTestMode) {
                                if (e.name === 'AbortError') {
                                    console.log('Promise Aborted')
                                } else {
                                    console.error('Promise Rejected', e)
                                }
                            }
                        })
                    break;
                }
            }
            this.#state = 'parentShown'
            this._attachListeners()
        } catch (e) {
            console.error('could not show parent', e)
        }
    }

    _attachListeners () {
        window.addEventListener('scroll', this)
        window.addEventListener('keydown', this, true)
        window.addEventListener('input', this)
    }

    _removeListeners () {
        window.removeEventListener('scroll', this)
        window.removeEventListener('keydown', this, true)
        window.removeEventListener('input', this)
    }


    /** @type {AbortController|null} */
    _abortController = null;

    handleEvent (event) {
        switch (event.type) {
        case 'scroll': {
            this.removeTooltip(event.type)
            break
        }
        case 'keydown': {
            if (['Escape', 'Tab', 'Enter'].includes(event.code)) {
                if (event.code === 'Escape') {
                    event.preventDefault()
                    event.stopImmediatePropagation()
                }
                this.removeTooltip(event.type)
            }
            break
        }
        case 'input': {
            this.removeTooltip(event.type)
            break
        }
        case 'pointerdown': {
            this.removeTooltip(event.type)
            break
        }
        }
    }

    /**
     * @param {string} trigger
     * @returns {Promise<void>}
     */
    async removeTooltip (trigger) {
        console.log('removeTooltip:trigger:', trigger)
        // for none pointer events, check to see if the tooltip is open before trying to close it
        if (trigger !== 'pointerdown') {
            if (this.#state !== 'parentShown') {
                console.log('not removing');
                return
            }
        }
        switch (this.ctx) {
            case "macos-modern": {
                this.device.deviceApi.notify(createNotification('closeAutofillParent', {}));
                break;
            }
            case "windows": {
                if (this._abortController && !this._abortController.signal.aborted) {
                    this._abortController.abort()
                }
                this.device.deviceApi.notify(new CloseAutofillParentCall(null))
                break;
            }
        }
        this.#state = 'idle'
        this._removeListeners()
        this._mutObs?.disconnect()
    }
}
