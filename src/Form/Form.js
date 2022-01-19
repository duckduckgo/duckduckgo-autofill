const FormAnalyzer = require('./FormAnalyzer')
const {SUBMIT_BUTTON_SELECTOR, FORM_ELS_SELECTOR} = require('./selectors')
const {addInlineStyles, removeInlineStyles, setValue, isEventWithinDax, isMobileApp} = require('../autofill-utils')
const {getInputSubtype, setInputType, getInputMainType} = require('./input-classifiers')
const {getIconStylesAutofilled, getIconStylesBase} = require('./inputStyles')
const {ATTR_AUTOFILL} = require('../constants')
const getInputConfig = require('./inputTypeConfig.js')
const {getUnifiedExpiryDate, formatCCYear, getCountryName} = require('./formatters')

class Form {
    constructor (form, input, DeviceInterface) {
        this.form = form
        this.formAnalyzer = new FormAnalyzer(form, input)
        this.isLogin = this.formAnalyzer.isLogin
        this.isSignup = this.formAnalyzer.isSignup
        this.device = DeviceInterface
        this.attachTooltip = DeviceInterface.attachTooltip

        /** @type Object<'all' | SupportedMainTypes, Set> */
        this.inputs = {
            all: new Set(),
            credentials: new Set(),
            creditCard: new Set(),
            identities: new Set(),
            unknown: new Set()
        }

        this.touched = new Set()
        this.listeners = new Set()
        this.tooltip = null
        this.activeInput = null
        // We set this to true to skip event listeners while we're autofilling
        this.isAutofilling = false
        this.handlerExecuted = false
        this.shouldPromptToStoreCredentials = true

        this.submitHandler = () => {
            if (this.handlerExecuted) return

            const credentials = this.getValues()
            if (credentials.password) {
                // ask to store credentials and/or fireproof
                if (this.shouldPromptToStoreCredentials) {
                    this.device.storeCredentials(credentials)
                }
                this.handlerExecuted = true
            }
        }

        this.getValues = () => {
            const credentials = [...this.inputs.credentials, ...this.inputs.identities].reduce((output, input) => {
                const subtype = getInputSubtype(input)
                if (['username', 'password', 'emailAddress'].includes(subtype)) {
                    output[subtype] = input.value || output[subtype]
                }
                return output
            }, {username: '', password: ''})
            // If we don't have a username, let's try and save the email if available.
            if (credentials.emailAddress && !credentials.username) {
                credentials.username = credentials.emailAddress
            }
            delete credentials.emailAddress
            return credentials
        }

        this.hasValues = () => {
            const {password} = this.getValues()
            return !!password
        }

        this.intObs = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) this.removeTooltip()
            }
        })

        this.removeTooltip = (e) => {
            if (
                this.isAutofilling ||
                !this.tooltip ||
                (e && e.target === this.tooltip.host)
            ) {
                return
            }
            this.tooltip.remove()
            this.tooltip = null
            this.intObs.disconnect()
            window.removeEventListener('pointerdown', this.removeTooltip, {capture: true})
        }
        this.removeInputHighlight = (input) => {
            removeInlineStyles(input, getIconStylesAutofilled(input, this))
            input.classList.remove('ddg-autofilled')
            this.addAutofillStyles(input)
        }
        this.removeAllHighlights = (e, dataType) => {
            // This ensures we are not removing the highlight ourselves when autofilling more than once
            if (e && !e.isTrusted) return

            // If the user has changed the value, we prompt to update the stored creds
            this.shouldPromptToStoreCredentials = true

            this.execOnInputs(this.removeInputHighlight, dataType)
        }
        this.removeInputDecoration = (input) => {
            removeInlineStyles(input, getIconStylesBase(input, this))
            input.removeAttribute(ATTR_AUTOFILL)
        }
        this.removeAllDecorations = () => {
            this.execOnInputs(this.removeInputDecoration)
            this.listeners.forEach(({el, type, fn}) => el.removeEventListener(type, fn))
        }
        this.redecorateAllInputs = () => {
            this.removeAllDecorations()
            this.execOnInputs((input) => this.decorateInput(input))
        }
        this.resetAllInputs = () => {
            this.execOnInputs((input) => {
                setValue(input, '')
                this.removeInputHighlight(input)
            })
            if (this.activeInput) this.activeInput.focus()
        }
        this.dismissTooltip = () => {
            this.removeTooltip()
        }
        // This removes all listeners to avoid memory leaks and weird behaviours
        this.destroy = () => {
            this.removeAllDecorations()
            this.removeTooltip()
            this.intObs = null
        }
        this.categorizeInputs()

        return this
    }

    categorizeInputs () {
        this.form.querySelectorAll(FORM_ELS_SELECTOR).forEach(input => this.addInput(input))
    }

    get submitButtons () {
        return [...this.form.querySelectorAll(SUBMIT_BUTTON_SELECTOR)]
            .filter((button) => {
                const content = button.textContent
                const ariaLabel = button.getAttribute('aria-label')
                const title = button.title
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

        setInputType(input, this)

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
            this.addAutofillStyles(input, config)
            this.addListener(input, 'mousemove', (e) => {
                if (isEventWithinDax(e, e.target)) {
                    e.target.style.setProperty('cursor', 'pointer', 'important')
                } else {
                    e.target.style.removeProperty('cursor')
                }
            })
        }

        const handler = (e) => {
            if (this.tooltip || this.isAutofilling) return

            // Checks for mousedown event
            if (e.type === 'pointerdown') {
                if (!e.isTrusted) return
                const isMainMouseButton = e.button === 0
                if (!isMainMouseButton) return
            }

            if (this.shouldOpenTooltip(e, e.target)) {
                if (isEventWithinDax(e, e.target) || isMobileApp) {
                    e.preventDefault()
                    e.stopImmediatePropagation()
                }

                this.touched.add(e.target)
                this.attachTooltip(this, e.target)
            }
        }

        if (input.nodeName !== 'SELECT') {
            const events = ['pointerdown']
            if (!isMobileApp) events.push('focus')
            events.forEach((ev) => this.addListener(input, ev, handler, true))
        }
        return this
    }

    shouldOpenTooltip (e, input) {
        const inputType = getInputMainType(input)
        if (inputType !== 'emailNew') return true

        return (!this.touched.has(input) && this.areAllInputsEmpty(inputType)) || isEventWithinDax(e, input)
    }

    autofillInput = (input, string, dataType) => {
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

    autofillEmail (alias, dataType = 'emailAddress') {
        this.isAutofilling = true
        this.execOnInputs(
            (input) => this.autofillInput(input, alias, dataType),
            dataType
        )
        this.isAutofilling = false
        if (this.tooltip) {
            this.removeTooltip()
        }
    }

    autofillData (data, dataType) {
        this.shouldPromptToStoreCredentials = false
        this.isAutofilling = true

        this.execOnInputs((input) => {
            const inputSubtype = getInputSubtype(input)
            let autofillData = data[inputSubtype]

            if (inputSubtype === 'expiration') {
                autofillData = getUnifiedExpiryDate(input, data.expirationMonth, data.expirationYear, this.form)
            }

            if (inputSubtype === 'expirationYear' && input.nodeName === 'INPUT') {
                autofillData = formatCCYear(input, autofillData, this.form)
            }

            if (inputSubtype === 'addressCountryCode') {
                autofillData = getCountryName(input, data)
            }

            if (autofillData) this.autofillInput(input, autofillData, dataType)
        }, dataType)

        this.isAutofilling = false

        if (this.tooltip) {
            this.removeTooltip()
        }
    }
}

module.exports = Form
