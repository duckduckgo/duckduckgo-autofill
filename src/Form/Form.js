const FormAnalyzer = require('./FormAnalyzer')
const {addInlineStyles, removeInlineStyles, setValue, isEventWithinDax, isMobileApp, isApp, getDaxBoundingBox} = require('../autofill-utils')
const {getInputSubtype, getInputMainType} = require('./matching')
const {getIconStylesAutofilled, getIconStylesBase} = require('./inputStyles')
const {ATTR_AUTOFILL} = require('../constants')
const {getInputConfig} = require('./inputTypeConfig.js')
const {getUnifiedExpiryDate, formatCCYear, getCountryName,
    prepareFormValuesForStorage, inferCountryCodeFromElement} = require('./formatters')
const {Matching} = require('./matching')
const {matchingConfiguration} = require('./matching-configuration')

class Form {
    /** @type {import("./matching").Matching} */
    matching;
    /** @type {HTMLFormElement} */
    form;
    /** @type {HTMLInputElement | null} */
    activeInput;
    /** @type {boolean | null} */
    isSignup;
    /**
     * @param {HTMLFormElement} form
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {import("../DeviceInterface/InterfacePrototype")} deviceInterface
     * @param {Matching} [matching]
     */
    constructor (form, input, deviceInterface, matching) {
        this.form = form
        this.matching = matching || new Matching(matchingConfiguration)
        this.formAnalyzer = new FormAnalyzer(form, input, matching)
        this.isLogin = this.formAnalyzer.isLogin
        this.isSignup = this.formAnalyzer.isSignup
        this.device = deviceInterface

        /** @type Record<'all' | SupportedMainTypes, Set> */
        this.inputs = {
            all: new Set(),
            credentials: new Set(),
            creditCards: new Set(),
            identities: new Set(),
            unknown: new Set()
        }

        this.touched = new Set()
        this.listeners = new Set()
        this.activeInput = null
        // We set this to true to skip event listeners while we're autofilling
        this.isAutofilling = false
        this.handlerExecuted = false
        this.shouldPromptToStoreCredentials = true

        /**
         * @type {IntersectionObserver | null}
         */
        this.intObs = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) this.removeTooltip()
            }
        })
        this.categorizeInputs()
    }

    submitHandler () {
        if (this.handlerExecuted) return

        const credentials = this.getValues()

        // do nothing if password was absent
        if (!credentials.password) return

        // checks to determine if we should offer to store credentials and/or fireproof
        const checks = [
            this.shouldPromptToStoreCredentials,
            this.device.shouldPromptToStoreCredentials({
                formElement: this.form
            })
        ]

        // if *any* of the checks are truthy, proceed to offer
        if (checks.some(Boolean)) {
            this.device.storeCredentials(credentials)
        }

        // mark this form as being handled
        // TODO(Shane): is this correct, what happens if a failed submission is retried?
        this.handlerExecuted = true
    }

    /** @return {DataStorageObject} */
    getValues () {
        const formValues = [...this.inputs.credentials, ...this.inputs.identities, ...this.inputs.creditCards]
            .reduce((output, inputEl) => {
                const mainType = getInputMainType(inputEl)
                const subtype = getInputSubtype(inputEl)
                let value = inputEl.value || output[mainType]?.[subtype]
                if (subtype === 'addressCountryCode') {
                    value = inferCountryCodeFromElement(inputEl)
                }
                if (value) {
                    output[mainType][subtype] = value
                }
                return output
            }, {credentials: {}, creditCards: {}, identities: {}})

        console.log('values', prepareFormValuesForStorage(formValues))
        return prepareFormValuesForStorage(formValues)
    }

    hasValues () {
        const {credentials, creditCards, identities} = this.getValues()

        return Boolean(credentials || creditCards || identities)
    }

    removeTooltip () {
        const tooltip = this.device.getActiveTooltip()
        if (
            this.isAutofilling ||
            !tooltip
        ) {
            return
        }
        this.device.removeTooltip()
        this.intObs?.disconnect()
    }

    showingTooltip (input) {
        this.intObs?.observe(input)
    }

    removeInputHighlight (input) {
        removeInlineStyles(input, getIconStylesAutofilled(input, this))
        input.classList.remove('ddg-autofilled')
        this.addAutofillStyles(input)
    }

    removeAllHighlights (e, dataType) {
        // This ensures we are not removing the highlight ourselves when autofilling more than once
        if (e && !e.isTrusted) return

        // If the user has changed the value, we prompt to update the stored creds
        this.shouldPromptToStoreCredentials = true

        this.execOnInputs((input) => this.removeInputHighlight(input), dataType)
    }

    removeInputDecoration (input) {
        removeInlineStyles(input, getIconStylesBase(input, this))
        input.removeAttribute(ATTR_AUTOFILL)
    }
    removeAllDecorations () {
        this.execOnInputs((input) => this.removeInputDecoration(input))
        this.listeners.forEach(({el, type, fn}) => el.removeEventListener(type, fn))
    }
    redecorateAllInputs () {
        this.removeAllDecorations()
        this.execOnInputs((input) => this.decorateInput(input))
    }
    resetAllInputs () {
        this.execOnInputs((input) => {
            setValue(input, '')
            this.removeInputHighlight(input)
        })
        if (this.activeInput) this.activeInput.focus()
    }
    dismissTooltip () {
        this.removeTooltip()
    }
    // This removes all listeners to avoid memory leaks and weird behaviours
    destroy () {
        this.removeAllDecorations()
        this.removeTooltip()
        this.intObs = null
    }

    categorizeInputs () {
        const selector = this.matching.cssSelector('FORM_INPUTS_SELECTOR')
        this.form.querySelectorAll(selector).forEach(input => this.addInput(input))
    }

    get submitButtons () {
        const selector = this.matching.cssSelector('SUBMIT_BUTTON_SELECTOR')
        return [...this.form.querySelectorAll(selector)]
            .filter((button) => {
                const content = button.textContent || ''
                const ariaLabel = button.getAttribute('aria-label') || ''
                // @ts-ignore
                const title = button.title || ''
                // trying to exclude the little buttons to show and hide passwords
                return !/password|show|toggle|reveal|hide/i.test(content + ariaLabel + title)
            })
    }

    execOnInputs (fn, inputType = 'all') {
        const inputs = this.inputs[inputType]
        for (const input of inputs) {
            const {shouldDecorate} = getInputConfig(input)
            if (shouldDecorate(input, this)) fn(input)
        }
    }

    addInput (input) {
        if (this.inputs.all.has(input)) return this

        this.inputs.all.add(input)

        this.matching.setInputType(input, this.form, { isLogin: this.isLogin })

        const mainInputType = getInputMainType(input)
        this.inputs[mainInputType].add(input)

        this.decorateInput(input)

        return this
    }

    areAllInputsEmpty (inputType) {
        let allEmpty = true
        this.execOnInputs((input) => {
            if (input.value) allEmpty = false
        }, inputType)
        return allEmpty
    }

    addListener (el, type, fn) {
        el.addEventListener(type, fn)
        this.listeners.add({el, type, fn})
    }

    addAutofillStyles (input) {
        const styles = getIconStylesBase(input, this)
        addInlineStyles(input, styles)
    }

    decorateInput (input) {
        const config = getInputConfig(input)

        if (!config.shouldDecorate(input, this)) return this

        input.setAttribute(ATTR_AUTOFILL, 'true')

        const hasIcon = !!config.getIconBase(input, this)
        if (hasIcon) {
            this.addAutofillStyles(input)
            this.addListener(input, 'mousemove', (e) => {
                if (isEventWithinDax(e, e.target)) {
                    e.target.style.setProperty('cursor', 'pointer', 'important')
                } else {
                    e.target.style.removeProperty('cursor')
                }
            })
        }

        function getMainClickCoords (e) {
            if (!e.isTrusted) return
            const isMainMouseButton = e.button === 0
            if (!isMainMouseButton) return
            return {
                x: e.clientX,
                y: e.clientY
            }
        }

        // Store the click to a label so we can use the click when the field is focused
        let storedClick = new WeakMap()
        let timeout = null
        const handlerLabel = (e) => {
            // Look for e.target OR it's closest parent to be a HTMLLabelElement
            const control = e.target.closest('label').control
            if (!control) return
            storedClick.set(control, getMainClickCoords(e))
            clearTimeout(timeout)
            // Remove the stored click if the timer expires
            timeout = setTimeout(() => {
                storedClick = new WeakMap()
            }, 1000)
        }

        const handler = (e) => {
            if (this.device.getActiveTooltip() || this.isAutofilling) return

            const input = e.target
            let click = null
            const getPosition = () => {
                // In extensions, the tooltip is centered on the Dax icon
                return isApp ? input.getBoundingClientRect() : getDaxBoundingBox(input)
            }

            // Checks for mousedown event
            if (e.type === 'pointerdown') {
                click = getMainClickCoords(e)
                if (!click) return
            } else if (storedClick) {
                // Reuse a previous click if one exists for this element
                click = storedClick.get(input)
                storedClick.delete(input)
            }

            if (this.shouldOpenTooltip(e, input)) {
                if (isEventWithinDax(e, input) || isMobileApp) {
                    e.preventDefault()
                    e.stopImmediatePropagation()
                }

                this.touched.add(input)
                this.device.attachTooltip(this, input, getPosition, click)
            }
        }

        if (input.nodeName !== 'SELECT') {
            const events = ['pointerdown']
            if (!isMobileApp) events.push('focus')
            input.labels.forEach((label) => {
                this.addListener(label, 'pointerdown', handlerLabel)
            })
            events.forEach((ev) => this.addListener(input, ev, handler))
        }
        return this
    }

    shouldOpenTooltip (e, input) {
        if (isApp) return true

        const inputType = getInputMainType(input)
        return (!this.touched.has(input) && this.areAllInputsEmpty(inputType)) || isEventWithinDax(e, input)
    }

    autofillInput (input, string, dataType) {
        // @ts-ignore
        const activeInputSubtype = getInputSubtype(this.activeInput)
        const inputSubtype = getInputSubtype(input)
        const isEmailAutofill = activeInputSubtype === 'emailAddress' && inputSubtype === 'emailAddress'

        // Don't override values for identities, unless it's the current input or we're autofilling email
        if (
            dataType === 'identities' && // only for identities
            input.nodeName !== 'SELECT' && input.value !== '' && // if the input is not empty
            this.activeInput !== input && // and this is not the active input
            !isEmailAutofill // and we're not auto-filling email
        ) return // do not overwrite the value

        const successful = setValue(input, string)

        if (!successful) return

        input.classList.add('ddg-autofilled')
        addInlineStyles(input, getIconStylesAutofilled(input, this))

        // If the user changes the value, remove the decoration
        input.addEventListener('input', (e) => this.removeAllHighlights(e, dataType), {once: true})
    }

    autofillEmail (alias, dataType = 'identities') {
        this.isAutofilling = true
        this.execOnInputs(
            (input) => this.autofillInput(input, alias, dataType),
            dataType
        )
        this.isAutofilling = false
        this.removeTooltip()
    }

    autofillData (data, dataType) {
        this.shouldPromptToStoreCredentials = false
        this.isAutofilling = true

        this.execOnInputs((input) => {
            const inputSubtype = getInputSubtype(input)
            let autofillData = data[inputSubtype]

            if (inputSubtype === 'expiration') {
                autofillData = getUnifiedExpiryDate(input, data.expirationMonth, data.expirationYear, this)
            }

            if (inputSubtype === 'expirationYear' && input.nodeName === 'INPUT') {
                autofillData = formatCCYear(input, autofillData, this)
            }

            if (inputSubtype === 'addressCountryCode') {
                autofillData = getCountryName(input, data)
            }

            if (autofillData) this.autofillInput(input, autofillData, dataType)
        }, dataType)

        this.isAutofilling = false

        this.removeTooltip()
    }
}

module.exports.Form = Form
