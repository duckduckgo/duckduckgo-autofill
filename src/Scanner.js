const {Form} = require('./Form/Form')
const {notifyWebApp} = require('./autofill-utils')
const {SUBMIT_BUTTON_SELECTOR, FORM_INPUTS_SELECTOR} = require('./Form/selectors-css')

/**
 * @typedef {{
 *     forms: Map<HTMLElement, import("./Form/Form").Form>;
 *     init(): ()=> void;
 *     enqueue(elements: (HTMLElement|Document)[]): void;
 *     findEligibleInputs(context): Scanner;
 * }} Scanner
 *
 * @typedef {{
 *     initialDelay: number,
 *     bufferSize: number,
 *     debounceTimePeriod: number,
 * }} ScannerOptions
 */

/** @type {ScannerOptions} */
const defaultScannerOptions = {
    // This buffer size is very large because it's an unexpected edge-case that
    // a DOM will be continually modified over and over without ever stopping. If we do see 1000 unique
    // new elements in the buffer however then this will prevent the algorithm from never ending.
    bufferSize: 1000,
    // wait for a 500ms window of event silence before performing the scan
    debounceTimePeriod: 500,
    // how long to wait when performing the initial scan
    initialDelay: 0
}

/**
 * This allows:
 *   1) synchronous DOM scanning + mutations - via `createScanner(device).findEligibleInputs(document)`
 *   2) or, as above + a debounced mutation observer to re-run the scan after the given time
 */
class DefaultScanner {
    /** @type Map<HTMLElement, Form> */
    forms = new Map();
    /** @type {any|undefined} the timer to reset */
    debounceTimer;
    /** @type {Set<HTMLElement|Document>} stored changed elements until they can be processed */
    changedElements = new Set()
    /** @type {ScannerOptions} */
    options;

    /**
     * @param {import("./DeviceInterface/InterfacePrototype")} device
     * @param {ScannerOptions} options
     */
    constructor (device, options) {
        this.device = device
        this.options = options
    }
    /**
     * Call this to scan once and then watch for changes.
     *
     * Call the returned function to remove listeners.
     * @returns {() => void}
     */
    init () {
        const delay = this.options.initialDelay

        // if the delay is zero, (chrome/firefox etc) then use `requestIdleCallback`
        if (delay === 0) {
            window.requestIdleCallback(() => this.scanAndObserve())
        } else {
            // otherwise, use the delay time to defer the initial scan
            setTimeout(() => this.scanAndObserve(), delay)
        }
        return () => {
            // remove Dax, listeners, timers, and observers
            clearTimeout(this.debounceTimer)
            this.mutObs.disconnect()
            this.forms.forEach(form => {
                form.resetAllInputs()
                form.removeAllDecorations()
            })
            this.forms.clear()
            if (this.device.globalConfig.isDDGDomain) {
                notifyWebApp({ deviceSignedIn: {value: false} })
            }
        }
    }

    /**
     * Scan the page and begin observing changes
     */
    scanAndObserve () {
        window.performance?.mark?.('findEligibleInputs:start')
        this.findEligibleInputs(document)
        window.performance?.mark?.('findEligibleInputs:end')
        // this.mutObs.observe(document.body, {childList: true, subtree: true})
    }

    /**
     * @param context
     */
    findEligibleInputs (context) {
        if ('matches' in context && context.matches?.(FORM_INPUTS_SELECTOR)) {
            this.addInput(context)
        } else {
            context.querySelectorAll(FORM_INPUTS_SELECTOR).forEach((input) => this.addInput(input))
        }
        return this
    }

    /**
     * @param {HTMLElement|HTMLInputElement|HTMLSelectElement} input
     * @returns {HTMLFormElement|HTMLElement}
     */
    getParentForm (input) {
        if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
            if (input.form) return input.form
        }

        let element = input
        // traverse the DOM to search for related inputs
        while (element.parentElement && element.parentElement !== document.body) {
            element = element.parentElement
            // todo: These selectors should be configurable
            const inputs = element.querySelectorAll(FORM_INPUTS_SELECTOR)
            const buttons = element.querySelectorAll(SUBMIT_BUTTON_SELECTOR)
            // If we find a button or another input, we assume that's our form
            if (inputs.length > 1 || buttons.length) {
                // found related input, return common ancestor
                return element
            }
        }

        return input
    }

    /**
     * @param {HTMLInputElement|HTMLSelectElement} input
     */
    addInput (input) {
        const parentForm = this.getParentForm(input)

        // Note that el.contains returns true for el itself
        const previouslyFoundParent = [...this.forms.keys()].find((form) => form.contains(parentForm))

        if (previouslyFoundParent) {
            // If we've already met the form or a descendant, add the input
            // console.log('🍎 previouslyFoundParent', input)
            // this.forms.get(previouslyFoundParent)?.addInput(input)
        } else {
            // if this form is an ancestor of an existing form, remove that before adding this
            const childForm = [...this.forms.keys()].find((form) => parentForm.contains(form))
            if (childForm) {
                this.forms.get(childForm)?.destroy()
                this.forms.delete(childForm)
            }

            this.forms.set(parentForm, new Form(parentForm, input, this.device))
        }
    }

    /**
     * enqueue elements to be re-scanned after the given
     * amount of time has elapsed.
     *
     * @param {(HTMLElement|Document)[]} htmlElements
     */
    enqueue (htmlElements) {
        if (this.changedElements.size >= this.options.bufferSize) {
            console.log('❌ Buffer full')
            return
        }
        for (let element of htmlElements) {
            this.changedElements.add(element)
        }
        clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
            this.processChangedElements()
        }, this.options.debounceTimePeriod)
    }

    /**
     * re-scan the changed elements, but only if they
     * are still present in the DOM
     */
    processChangedElements () {
        for (let element of this.changedElements) {
            if (element.isConnected) {
                this.findEligibleInputs(element)
            }
        }
        this.changedElements.clear()
    }

    /**
     * Watch for changes in the DOM, and enqueue elements to be scanned
     * @type {MutationObserver}
     */
    mutObs = new MutationObserver((mutationList) => {
        /** @type {HTMLElement[]} */
        const outgoing = []
        for (const mutationRecord of mutationList) {
            if (mutationRecord.type === 'childList') {
                // We query only within the context of added/removed nodes
                mutationRecord.addedNodes.forEach(el => {
                    if (el.nodeName === 'DDG-AUTOFILL') return

                    if (el instanceof HTMLElement) {
                        outgoing.push(el)
                    }
                })
            }
        }
        if (outgoing.length) {
            this.enqueue(outgoing)
        }
    })
}

/**
 * @param {import("./DeviceInterface/InterfacePrototype")} device
 * @param {Partial<ScannerOptions>} [scannerOptions]
 * @returns {Scanner}
 */
function createScanner (device, scannerOptions) {
    return new DefaultScanner(device, {
        ...defaultScannerOptions,
        ...scannerOptions
    })
}

module.exports = {
    createScanner
}
