const FormAnalyzer = require('./FormAnalyzer')
const {PASSWORD_SELECTOR} = require("./selectors");
const {addInlineStyles, removeInlineStyles, isDDGApp, isApp, setValue, isEventWithinDax} = require('../autofill-utils')
const {daxBase64} = require('./logo-svg')

// In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here
const isFirefox = navigator.userAgent.includes('Firefox')
const getDaxImg = isDDGApp || isFirefox ? daxBase64 : chrome.runtime.getURL('img/logo-small.svg')

const getDaxStyles = input => ({
    // Height must be > 0 to account for fields initially hidden
    'background-size': `auto ${input.offsetHeight <= 30 && input.offsetHeight > 0 ? '100%' : '26px'}`,
    'background-position': 'center right',
    'background-repeat': 'no-repeat',
    'background-origin': 'content-box',
    'background-image': `url(${getDaxImg})`
})

const INLINE_AUTOFILLED_STYLES = {
    'background-color': '#F8F498',
    'color': '#333333'
}

class Form {
    constructor (form, input, DeviceInterface) {
        this.form = form
        this.formAnalyzer = new FormAnalyzer(form, input)
        this.Device = DeviceInterface
        this.attachTooltip = DeviceInterface.attachTooltip
        this.emailInputs = new Set()
        this.passwordInputs = new Set()
        this.touched = new Set()
        this.listeners = new Set()
        this.addInput(input)
        this.tooltip = null
        this.activeInput = null

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
            removeInlineStyles(input, INLINE_AUTOFILLED_STYLES)
            input.classList.remove('ddg-autofilled')
        }
        this.removeAllHighlights = (e) => {
            // This ensures we are not removing the highlight ourselves when autofilling more than once
            if (e && !e.isTrusted) return

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
        this.passwordInputs.forEach(fn)
    }

    addInput (input) {
        if (input.type === 'password') {
            this.passwordInputs.add(input)
            if (this.formAnalyzer.isLogin && this.Device.hasLocalCredentials) this.decorateInput(input)
        } else {
            this.emailInputs.add(input)
            if (this.formAnalyzer.isSignup) this.decorateInput(input)
            if (this.formAnalyzer.isSignup && this.Device.hasLocalAddresses) this.decorateInput(input)
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

    decorateInput (input) {
        input.setAttribute('data-ddg-autofill', 'true')
        addInlineStyles(input, getDaxStyles(input))
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
        addInlineStyles(input, INLINE_AUTOFILLED_STYLES)

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
