const FormAnalyzer = require('./FormAnalyzer')
const {EMAIL_SELECTOR, PASSWORD_SELECTOR, USERNAME_SELECTOR, SUBMIT_BUTTON_SELECTOR} = require('./selectors')
const {addInlineStyles, removeInlineStyles, isDDGApp, isApp, setValue, isEventWithinDax} = require('../autofill-utils')
const {daxBase64} = require('./logo-svg')
const ddgPasswordIcons = require('../UI/img/ddgPasswordIcon')
const listenForGlobalFormSubmission = require('./listenForFormSubmission')

// In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here
const isFirefox = navigator.userAgent.includes('Firefox')
const getDaxImg = isDDGApp || isFirefox ? daxBase64 : chrome.runtime.getURL('img/logo-small.svg')
const getPasswordIcon = (variant = 'ddgPasswordIconBase') => ddgPasswordIcons[variant]

const getDaxStyles = (input) => ({
    // Height must be > 0 to account for fields initially hidden
    'background-size': `auto ${input.offsetHeight <= 30 && input.offsetHeight > 0 ? '100%' : '26px'}`,
    'background-position': 'center right',
    'background-repeat': 'no-repeat',
    'background-origin': 'content-box',
    'background-image': `url(${getDaxImg})`
})

const getPasswordStyles = (input) => ({
    ...getDaxStyles(input),
    'background-image': `url(${getPasswordIcon()})`
})

const getPasswordAutofilledStyles = (input) => ({
    ...getDaxStyles(input),
    'background-image': `url(${getPasswordIcon('ddgPasswordIconFilled')})`,
    'background-color': '#F8F498',
    'color': '#333333'
})

const getInlineAutofilledStyles = (input, isLogin) => isLogin
    ? getPasswordAutofilledStyles(input)
    : {
        'background-color': '#F8F498',
        'color': '#333333'
    }

class Form {
    constructor (form, input, DeviceInterface) {
        this.form = form
        this.formAnalyzer = new FormAnalyzer(form, input)
        this.isLogin = this.formAnalyzer.isLogin
        this.isSignup = this.formAnalyzer.isSignup
        this.Device = DeviceInterface
        this.attachTooltip = DeviceInterface.attachTooltip
        this.emailInputs = new Set()
        this.passwordInputs = new Set()
        this.allInputs = new Set()
        this.touched = new Set()
        this.listeners = new Set()
        this.addInput(input)
        this.tooltip = null
        this.activeInput = null
        // TODO: try to filter down to only submit buttons?
        this.submitButtons = form.querySelectorAll(SUBMIT_BUTTON_SELECTOR)
        this.formSubmissionListenerSet = false
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
            }
            this.handlerExecuted = true
        }

        this.getValues = () => {
            const username = [...this.emailInputs][0]?.value
            const password = [...this.passwordInputs][0]?.value
            return {username, password}
        }

        this.hasValues = () => {
            const {username, password} = this.getValues()
            return username && password
        }

        this.intObs = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) this.removeTooltip()
            }
        })

        this.removeTooltip = (e) => {
            if (e && e.target === this.tooltip.host) {
                return
            }
            this.tooltip.remove()
            this.tooltip = null
            this.intObs.disconnect()
            window.removeEventListener('mousedown', this.removeTooltip, {capture: true})
        }
        this.removeInputHighlight = (input) => {
            removeInlineStyles(input, getInlineAutofilledStyles(input, this.isLogin))
            input.classList.remove('ddg-autofilled')
            this.addAutofillStyles(input)
        }
        this.removeAllHighlights = (e) => {
            // This ensures we are not removing the highlight ourselves when autofilling more than once
            if (e && !e.isTrusted) return

            // If the user has changed the value, we prompt to update the stored creds
            this.shouldPromptToStoreCredentials = true

            this.execOnInputs(this.removeInputHighlight)
        }
        this.removeInputDecoration = (input) => {
            removeInlineStyles(input, getDaxStyles(input))
            input.removeAttribute('data-ddg-autofill')
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

        return this
    }

    execOnInputs (fn) {
        this.emailInputs.forEach(fn)
        if (this.isLogin) {
            this.passwordInputs.forEach(fn)
        }
    }

    listenForSubmission () {
        if (!isApp || this.formSubmissionListenerSet) return

        this.form.addEventListener('submit', this.submitHandler)
        this.submitButtons.forEach((btn) => btn.addEventListener('click', this.submitHandler))

        listenForGlobalFormSubmission()
        this.formSubmissionListenerSet = true
    }

    addInput (input) {
        if (this.allInputs.has(input)) return this

        this.allInputs.add(input)
        if (input.matches(PASSWORD_SELECTOR)) {
            this.passwordInputs.add(input)
            // Try finding a matching username field
            if (!this.emailInputs.size) {
                let possibleUsernameFields = this.form.querySelectorAll(EMAIL_SELECTOR)
                // if our stringent email selector fails, try with the broader username selector
                if (!possibleUsernameFields) {
                    possibleUsernameFields = this.form.querySelectorAll(USERNAME_SELECTOR)
                    // TODO: Try to filter down to username fields?
                }
                possibleUsernameFields.forEach((input) => this.addInput(input))
            }
            this.listenForSubmission()
        } else {
            this.emailInputs.add(input)
        }

        if (this.isLogin) {
            if (this.Device.hasLocalCredentials) this.decorateInput(input)
        } else {
            if (this.Device.hasLocalAddresses && !input.matches(PASSWORD_SELECTOR)) {
                this.decorateInput(input)
            }
        }

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
        const styles = this.isLogin ? getPasswordStyles(input) : getDaxStyles(input)
        addInlineStyles(input, styles)
    }

    decorateInput (input) {
        input.setAttribute('data-ddg-autofill', 'true')
        this.addAutofillStyles(input)
        this.addListener(input, 'mousemove', (e) => {
            if (isEventWithinDax(e, e.target)) {
                e.target.style.setProperty('cursor', 'pointer', 'important')
            } else {
                e.target.style.removeProperty('cursor')
            }
        })
        this.addListener(input, 'mousedown', (e) => {
            if (!e.isTrusted) return
            if (e.button !== 0) return

            if (this.shouldOpenTooltip(e, e.target)) {
                if (isEventWithinDax(e, e.target) || (isDDGApp && !isApp)) {
                    e.preventDefault()
                    e.stopImmediatePropagation()
                }

                this.touched.add(e.target)
                this.attachTooltip(this, e.target)
            }
        })
        return this
    }

    shouldOpenTooltip (e, input) {
        return (!this.touched.has(input) && this.areAllInputsEmpty()) || isEventWithinDax(e, input)
    }

    autofillInput = (input, string) => {
        setValue(input, string)
        input.classList.add('ddg-autofilled')
        addInlineStyles(input, getInlineAutofilledStyles(input, this.isLogin))

        // If the user changes the alias, remove the decoration
        input.addEventListener('input', this.removeAllHighlights, {once: true})
    }

    autofillEmail (alias) {
        this.execOnInputs((input) => !input.matches(PASSWORD_SELECTOR) && this.autofillInput(input, alias))
        if (this.tooltip) {
            this.removeTooltip()
        }
    }

    autofillCredentials (credentials) {
        this.shouldPromptToStoreCredentials = false
        this.execOnInputs((input) => {
            if (input.matches(PASSWORD_SELECTOR)) {
                this.autofillInput(input, credentials.password)
            } else {
                this.autofillInput(input, credentials.username)
            }
        })
        if (this.tooltip) {
            this.removeTooltip()
        }
    }
}

module.exports = Form
