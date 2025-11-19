import { UIController } from './UIController.js';
import { getMainTypeFromType, getSubtypeFromType } from '../../Form/matching.js';

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
 * const controller = new OverlayController({
 *     remove: async () => this.closeAutofillParent(),
 *     show: async (details) => this.show(details),
 *     onPointerDown: (e) => this.onPointerDown(e)
 * })
 *
 * controller.attachTooltip(...)
 * ```
 */
export class OverlayUIController extends UIController {
    /** @type {"idle" | "parentShown"} */
    #state = 'idle';

    /** @type {import('../HTMLTooltip.js').HTMLTooltip | null} */
    _activeTooltip = null;

    /**
     * @type {OverlayControllerOptions}
     */
    _options;

    /**
     * @param {OverlayControllerOptions} options
     */
    constructor(options) {
        super();
        this._options = options;

        // We always register this 'pointerdown' event, regardless of
        // whether we have a tooltip currently open or not. This is to ensure
        // we can clear out any existing state before opening a new one.
        window.addEventListener('pointerdown', this, true);
    }

    /**
     * @param {import('./UIController').AttachTooltipArgs} args
     */
    attachTooltip(args) {
        const { getPosition, topContextData, click, input } = args;

        // Do not attach the tooltip if the input is not in the DOM
        if (!input.parentNode) return;

        // If the input is removed from the DOM while the tooltip is attached, remove it
        this._mutObs = new MutationObserver((mutationList) => {
            for (const mutationRecord of mutationList) {
                mutationRecord.removedNodes.forEach((el) => {
                    if (el.contains(input)) {
                        this.removeTooltip('mutation observer');
                    }
                });
            }
        });
        this._mutObs.observe(document.body, { childList: true, subtree: true });

        const position = getPosition();
        this.#state = 'parentShown';
        this.showTopTooltip(click, position, topContextData).catch((e) => {
            console.error('error from showTopTooltip', e);
            this.#state = 'idle';
        });
    }

    /**
     * @param {{ x: number; y: number; height: number; width: number; }} inputDimensions
     * @returns {boolean}
     */
    elementIsInViewport(inputDimensions) {
        if (
            inputDimensions.x < 0 ||
            inputDimensions.y < 0 ||
            inputDimensions.x + inputDimensions.width > document.documentElement.clientWidth ||
            inputDimensions.y + inputDimensions.height > document.documentElement.clientHeight
        ) {
            return false;
        }
        const viewport = document.documentElement;
        if (
            inputDimensions.x + inputDimensions.width > viewport.clientWidth ||
            inputDimensions.y + inputDimensions.height > viewport.clientHeight
        ) {
            return false;
        }
        return true;
    }

    /**
     * @param {{ x: number; y: number; } | null} click
     * @param {{ x: number; y: number; height: number; width: number; }} inputDimensions
     * @param {TopContextData} data
     */
    async showTopTooltip(click, inputDimensions, data) {
        let diffX = inputDimensions.x;
        let diffY = inputDimensions.y;
        if (click) {
            diffX -= click.x;
            diffY -= click.y;
        } else if (!this.elementIsInViewport(inputDimensions)) {
            // If the focus event is outside the viewport ignore, we've already tried to scroll to it
            return;
        }

        if (!data.inputType) {
            throw new Error('No input type found');
        }

        const mainType = getMainTypeFromType(data.inputType);
        const subType = getSubtypeFromType(data.inputType);

        if (mainType === 'unknown') {
            throw new Error('unreachable, should not be here if (mainType === "unknown")');
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
                inputWidth: Math.floor(inputDimensions.width),
            },
        };

        try {
            this.#state = 'parentShown';
            this._attachListeners();
            await this._options.show(details);
        } catch (e) {
            console.error('could not show parent', e);
            this.#state = 'idle';
        }
    }

    _attachListeners() {
        window.addEventListener('scroll', this);
        window.addEventListener('keydown', this, true);
        window.addEventListener('input', this);
    }

    _removeListeners() {
        window.removeEventListener('scroll', this);
        window.removeEventListener('keydown', this, true);
        window.removeEventListener('input', this);
    }

    handleEvent(event) {
        switch (event.type) {
            case 'scroll': {
                this.removeTooltip(event.type);
                break;
            }
            case 'keydown': {
                if (['Escape', 'Tab', 'Enter'].includes(event.code)) {
                    if (event.code === 'Escape') {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    }
                    this.removeTooltip(event.type);
                }
                break;
            }
            case 'input': {
                this.removeTooltip(event.type);
                break;
            }
            case 'pointerdown': {
                this.removeTooltip(event.type);
                break;
            }
        }
    }

    /**
     * @param {string} trigger
     * @returns {Promise<void>}
     */
    async removeTooltip(trigger) {
        // for none pointer events, check to see if the tooltip is open before trying to close it
        if (trigger !== 'pointerdown') {
            if (this.#state !== 'parentShown') {
                return;
            }
        }
        try {
            await this._options.remove();
        } catch (e) {
            console.error('Could not close parent', e);
        }
        this.#state = 'idle';
        this._removeListeners();
        this._mutObs?.disconnect();
    }

    isActive() {
        return this.#state === 'parentShown';
    }
}
