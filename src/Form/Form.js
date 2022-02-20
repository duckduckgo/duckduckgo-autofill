const FormAnalyzer = require('./FormAnalyzer')
const {addInlineStyles, removeInlineStyles, setValue, isEventWithinDax, isMobileApp, isApp, getDaxBoundingBox} = require('../autofill-utils')
const {getInputSubtype, getInputMainType} = require('./matching')
const {getIconStylesAutofilled, getIconStylesBase} = require('./inputStyles')
const {ATTR_AUTOFILL, ATTR_INPUT_TYPE} = require('../constants')
const {getInputConfig} = require('./inputTypeConfig.js')
const {getUnifiedExpiryDate, formatCCYear, getCountryName} = require('./formatters')
const {Matching} = require('./matching')
const {matchingConfiguration} = require('./matching-configuration')

class Form {
    /** @type {import("./matching").Matching} */
    matching;
    /** @type {HTMLFormElement} */
    form;

    /**
     * @param {HTMLFormElement} form
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {InterfacePrototypeBase} deviceInterface
     * @param {Matching} [matching]
     */
    constructor (form, input, deviceInterface, matching) {
        this.form = form
        this.matching = matching || new Matching(matchingConfiguration)
        this.formAnalyzer = new FormAnalyzer(form, input, matching)
        this.isLogin = this.formAnalyzer.isLogin
        this.isSignup = this.formAnalyzer.isSignup
        this.device = deviceInterface

        this.touched = new WeakSet()
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
        if (credentials.password) {
            // ask to store credentials and/or fireproof
            if (this.shouldPromptToStoreCredentials) {
                // @ts-ignore
                this.device.storeCredentials(credentials)
            }
            this.handlerExecuted = true
        }
    }

    getValues () {
        const fields = [
            ...this.findInputByType('credentials'),
            ...this.findInputByType('identities')
        ]
        const credentials = {}
        fields.forEach((input) => {
            const subtype = getInputSubtype(input)
            if (['username', 'password', 'emailAddress'].includes(subtype) && input.value) {
                credentials[subtype] = input.value
            }
        })
        // If we don't have a username, let's try and save the email if available.
        if (credentials.emailAddress && !credentials.username) {
            credentials.username = credentials.emailAddress
        }
        return {
            username: credentials.username || '',
            password: credentials.password || ''
        }
    }

    hasValues () {
        const {password} = this.getValues()
        return !!password
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

        this.execOnInputs(this.removeInputHighlight, dataType)
    }

    removeInputDecoration (input) {
        removeInlineStyles(input, getIconStylesBase(input, this))
        input.removeAttribute(ATTR_AUTOFILL)
    }
    removeAllDecorations () {
        this.execOnInputs(this.removeInputDecoration)
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

    /**
     * @param {SupportedMainTypes | undefined} inputMainType
     * @returns {HTMLInputElement[]}
     */
    findInputByType (inputMainType) {
        const selector = inputMainType ? `[${ATTR_INPUT_TYPE}^="${inputMainType}."]` : `[${ATTR_INPUT_TYPE}]`
        /** @type {NodeListOf<HTMLInputElement>} */
        const inputs = this.form.querySelectorAll(selector)
        return [...inputs]
    }

    /**
     * @param {HTMLInputElement} input
     * @returns {boolean}
     */
    isInputDecorated (input) {
        return input.hasAttribute(ATTR_INPUT_TYPE)
    }

    /**
     * @param {(HTMLInputElement) => void} fn
     * @param {SupportedMainTypes | undefined} [inputType] Matches SupportedMainTypes or all if not passed.
     */
    execOnInputs (fn, inputType) {
        const inputs = this.findInputByType(inputType)
        for (const input of inputs) {
            const {shouldDecorate} = getInputConfig(input)
            if (shouldDecorate(input, this)) fn(input)
        }
    }

    addInput (input) {
        if (this.isInputDecorated(input)) return this

        this.matching.setInputType(input, this.form, { isLogin: this.isLogin })

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
            const control = e.target.control
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
                // @ts-ignore
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

    /**
     * @param {string} alias
     * @param {SupportedMainTypes} dataType
     */
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
