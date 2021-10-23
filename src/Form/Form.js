const FormAnalyzer = require('./FormAnalyzer')
const {PASSWORD_SELECTOR, SUBMIT_BUTTON_SELECTOR, FIELD_SELECTOR} = require('./selectors')
const {addInlineStyles, removeInlineStyles, isDDGApp, isApp, setValue, isEventWithinDax} = require('../autofill-utils')
const {getInputSubtype, setInputType, getInputMainType} = require('./input-classifiers')
const {getIconStylesAutofilled, getIconStylesBase} = require('./inputStyles')
const {ATTR_AUTOFILL} = require('../constants')
const getInputConfig = require('./inputTypeConfig')

class Form {
    constructor (form, input, DeviceInterface) {
        this.form = form
        this.formAnalyzer = new FormAnalyzer(form, input)
        this.isLogin = this.formAnalyzer.isLogin
        this.isSignup = this.formAnalyzer.isSignup
        this.Device = DeviceInterface
        this.attachTooltip = DeviceInterface.attachTooltip
        this.allInputs = new Set()
        this.emailNewInputs = new Set()
        this.credentialsInputs = new Set()
        this.creditCardInputs = new Set()
        this.unknownInputs = new Set()

        this.touched = new Set()
        this.listeners = new Set()
        this.tooltip = null
        this.activeInput = null
        this.handlerExecuted = false
        this.shouldPromptToStoreCredentials = true

        this.submitHandler = () => {
            if (this.handlerExecuted) return

            const credentials = this.getValues()
            if (credentials.password) {
                // ask to store credentials and/or fireproof
                if (this.shouldPromptToStoreCredentials) {
                    this.Device.storeCredentials(credentials)
                }
                this.handlerExecuted = true
            }
        }

        this.getValues = () => {
            return [...this.credentialsInputs].reduce((output, input) => {
                const subtype = getInputSubtype(input)
                output[subtype] = input.value || output[subtype]
                return output
            }, {username: '', password: ''})
        }

        this.hasValues = () => {
            const {username, password} = this.getValues()
            return !!(username && password)
        }

        this.intObs = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) this.removeTooltip()
            }
        })

        this.removeTooltip = (e) => {
            if (
                !this.tooltip ||
                (e && e.target === this.tooltip.host)
            ) {
                return
            }
            this.tooltip.remove()
            this.tooltip = null
            this.intObs.disconnect()
            window.removeEventListener('mousedown', this.removeTooltip, {capture: true})
        }
        this.removeInputHighlight = (input) => {
            removeInlineStyles(input, getIconStylesAutofilled(input, this.isLogin))
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
            removeInlineStyles(input, getIconStylesBase(input, this.isLogin))
            input.removeAttribute(ATTR_AUTOFILL)
        }
        this.removeAllDecorations = () => {
            this.execOnInputs(this.removeInputDecoration)
            this.listeners.forEach(({el, type, fn}) => el.removeEventListener(type, fn))
        }
        this.redecorateAllInputs = () => {
            this.removeAllDecorations()
            this.execOnInputs(this.decorateInput)
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
        this.categorizeInputs()

        return this
    }

    categorizeInputs () {
        this.form.querySelectorAll(FIELD_SELECTOR).forEach(input => this.addInput(input))
    }

    // TODO: try to filter down to only submit buttons
    get submitButtons () {
        return this.form.querySelectorAll(SUBMIT_BUTTON_SELECTOR)
    }

    execOnInputs (fn, inputType = 'all') {
        const inputs = this[`${inputType}Inputs`]
        for (const input of inputs) {
            const {shouldDecorate} = getInputConfig(input)
            if (shouldDecorate(this.isLogin, this.Device)) fn(input)
        }
    }

    addInput (input) {
        if (this.allInputs.has(input)) return this

        this.allInputs.add(input)

        setInputType(input, this.isLogin)

        const mainInputType = getInputMainType(input)
        this[`${mainInputType}Inputs`].add(input)

        this.decorateInput(input)

        return this
    }

    areAllInputsEmpty () {
        let allEmpty = true
        this.execOnInputs((input) => {
            if (input.value) allEmpty = false
        })
        return allEmpty
    }

    addListener (el, type, fn) {
        el.addEventListener(type, fn)
        this.listeners.add({el, type, fn})
    }

    addAutofillStyles (input) {
        const styles = getIconStylesBase(input, this.isLogin)
        addInlineStyles(input, styles)
    }

    decorateInput (input) {
        const config = getInputConfig(input)

        if (!config.shouldDecorate(this.isLogin, this.Device)) return this

        input.setAttribute(ATTR_AUTOFILL, 'true')

        const hasIcon = !!config.getIconBase()
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
            if (this.tooltip) return

            // Checks for mousedown event
            if (e.type === 'mousedown') {
                if (!e.isTrusted) return
                const isMainMouseButton = e.button === 0
                if (!isMainMouseButton) return
            }

            if (this.shouldOpenTooltip(e, e.target)) {
                if (isEventWithinDax(e, e.target) || (isDDGApp && !isApp)) {
                    e.preventDefault()
                    e.stopImmediatePropagation()
                }

                this.touched.add(e.target)
                this.attachTooltip(this, e.target)
            }
        }

        // TODO: on mobile, focus could open keyboard before tooltip
        ['mousedown', 'focus']
            .forEach((ev) => this.addListener(input, ev, handler, true))
        return this
    }

    shouldOpenTooltip (e, input) {
        const inputType = getInputMainType(input)
        if (inputType !== 'emailNew') return true

        return (!this.touched.has(input) && this.areAllInputsEmpty()) || isEventWithinDax(e, input)
    }

    autofillInput = (input, string, dataType) => {
        setValue(input, string)
        input.classList.add('ddg-autofilled')
        addInlineStyles(input, getIconStylesAutofilled(input, this.isLogin))

        // If the user changes the alias, remove the decoration
        input.addEventListener('input', (e) => this.removeAllHighlights(e, dataType), {once: true})
    }

    autofillEmail (alias, dataType = 'emailNew') {
        this.execOnInputs(
            (input) => !input.matches(PASSWORD_SELECTOR) && this.autofillInput(input, alias, dataType),
            dataType
        )
        if (this.tooltip) {
            this.removeTooltip()
        }
    }

    autofillData (data, dataType) {
        this.shouldPromptToStoreCredentials = false

        this.execOnInputs((input) => {
            const inputSubtype = getInputSubtype(input)
            if (data[inputSubtype]) this.autofillInput(input, data[inputSubtype], dataType)
        }, dataType)

        if (this.tooltip) {
            this.removeTooltip()
        }
    }
}

module.exports = Form
