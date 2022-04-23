/**
 * @typedef {object} TopFrameControllerTooltipOptions
 */

/**
 * @implements {TooltipInterface}
 * @implements {TooltipHandler}
 */
export class TopFrameControllerTooltip {
    /** @type {import('../runtime/runtime').Runtime} */
    runtime

    /** @type {import("../UI/Tooltip.js").Tooltip | null} */
    _activeTooltip = null

    /** @type {TopFrameControllerTooltipOptions} */
    _options;

    /**
     * @deprecated do not access the tooltipHandler directly here
     * @type {import("../DeviceInterface/InterfacePrototype").default | null}
     */
    _device = null;

    /**
     * @param {import('../runtime/runtime').Runtime} runtime
     * @param {TopFrameControllerTooltipOptions} options
     */
    constructor (runtime, options) {
        this.runtime = runtime;
        this._options = options;
        // window.addEventListener('pointerdown', this, true)
    }

    attach (args) {
        if (this._activeTooltip) return
        const { getPosition, topContextData, click, input } = args;
        let delay = 0;
        if (!click && !this.elementIsInViewport(getPosition())) {
            input.scrollIntoView(true)
            delay = 500;
        }
        setTimeout(() => {
            this.showTopTooltip(click, getPosition(), topContextData)
                .catch(e => {
                    console.error("error from showTopTooltip", e);
                })
        }, delay);
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

        /** @type {Schema.ShowAutofillParentRequest} */
        const details = {
            wasFromClick: Boolean(click),
            inputTop: Math.floor(diffY),
            inputLeft: Math.floor(diffX),
            inputHeight: Math.floor(inputDimensions.height),
            inputWidth: Math.floor(inputDimensions.width),
            serializedInputContext: JSON.stringify(data)
        }

        await this.runtime.showAutofillParent(details)
        // // Start listening for the user initiated credential
        // // this.listenForSelectedCredential()
    }

    async removeTooltip () {
        console.log('REMOVE');
        // await this.transport.send('closeAutofillParent', {})
    }
    /**
     * TODO: Don't allow this to be called from outside since it's deprecated.
     * @param {PosFn} _getPosition
     * @param {TopContextData} _topContextData
     * @return {import('./Tooltip').Tooltip}
     */
    createTooltip (_getPosition, _topContextData) {
        throw new Error('unimplemented');
    }

    getActiveTooltip () {
        return null
    }

    setActiveTooltip (_tooltip) {
    }

    setSize (_cb) {
    }

    setupSizeListener (_cb) {
    }

    tooltipPositionClass (_top, _left) {
        return ''
    }

    tooltipStyles () {
        return ''
    }

    tooltipWrapperClass () {
        return ''
    }
}
