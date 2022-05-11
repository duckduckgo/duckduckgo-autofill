/**
 * @typedef {object} TopFrameControllerTooltipOptions
 */

/**
 * @implements {TooltipInterface}
 */
export class OverlayController {
    /** @type {import('../UI/Tooltip.js').Tooltip | null} */
    _activeTooltip = null

    /** @type {"idle" | "setupShowParent" | "parentShown" | "removingParent"} */
    #state = 'idle';

    /**
     * @type {import('../DeviceInterface/InterfacePrototype').default | null}
     */
    _device = null

    _listenerFactories = []
    _listenerCleanups = []

    attach (args) {
        this.setDevice(args.device)
        if (this.#state !== 'idle') {
            return this.removeTooltip()
                .catch((e) => {
                    console.error('could not remove tooltip', e)
                })
                .finally(() => this._attach(args))
        }
        this._attach(args)
    }

    /**
     * @param {AttachArgs} args
     * @private
     */
    _attach (args) {
        const {getPosition, topContextData, click, input} = args
        let delay = 0
        this.#state = 'setupShowParent'
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
     * @param {TopContextData} [data]
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

        /** @type {ShowAutofillParentRequest} */
        const details = {
            wasFromClick: Boolean(click),
            inputTop: Math.floor(diffY),
            inputLeft: Math.floor(diffX),
            inputHeight: Math.floor(inputDimensions.height),
            inputWidth: Math.floor(inputDimensions.width),
            serializedInputContext: JSON.stringify(data)
        }

        if (!this._device) throw new Error('unreachable')

        try {
            await this._device.showAutofillParent(details)
            this.#state = 'parentShown'
            this.#attachListeners()
        } catch (e) {
            console.error('could not show parent', e)
            this.#state = 'idle'
        }
    }

    #attachListeners () {
        window.addEventListener('scroll', this)
        window.addEventListener('keydown', this)
        window.addEventListener('input', this)
        window.addEventListener('pointerdown', this)
        this._device?.listenForSelectedCredential()
            .then((response) => {
                if (!response) {
                    return
                }
                this._device?.activeFormSelectedDetail(response.data, response.configType)
            })
            .catch(e => {
                console.error('unknown error', e)
            })
    }

    #removeListeners () {
        window.removeEventListener('scroll', this)
        window.removeEventListener('keydown', this)
        window.removeEventListener('input', this)
        window.removeEventListener('pointerdown', this)
    }

    handleEvent (event) {
        switch (event.type) {
        case 'scroll': {
            this.removeTooltip()
            break
        }
        case 'keydown': {
            if (['Escape', 'Tab', 'Enter'].includes(event.code)) {
                this.removeTooltip()
            }
            break
        }
        case 'input': {
            this.removeTooltip()
            break
        }
        case 'pointerdown': {
            this.removeTooltip()
            break
        }
        }
    }

    /** @type {number|null} */
    pollingTimeout = null

    async removeTooltip () {
        if (this.#state === 'removingParent') return
        if (this.#state === 'idle') return

        if (!this._device) throw new Error('unreachable')

        this.#state = 'removingParent'
        await this._device?.closeAutofillParent()
            .catch(e => console.error('Could not close parent', e))

        this.#state = 'idle'
        this.#removeListeners()
    }

    /**
     * TODO: Don't allow this to be called from outside since it's deprecated.
     * @param {PosFn} _getPosition
     * @param {TopContextData} _topContextData
     * @return {import('./Tooltip').Tooltip}
     */
    createTooltip (_getPosition, _topContextData) {
        throw new Error('unimplemented')
    }

    setDevice (device) {
        this._device = device
    }

    isActive () {
        return this.#state !== 'idle'
    }

    // addListener(cb) {
    //     console.log('noop for addListener', cb);
    // }
}
