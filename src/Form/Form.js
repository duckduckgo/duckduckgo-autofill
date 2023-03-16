import FormAnalyzer from './FormAnalyzer.js'

import {
    addInlineStyles,
    removeInlineStyles,
    setValue,
    isEventWithinDax,
    isLikelyASubmitButton,
    isVisible, buttonMatchesFormType,
    safeExecute, getText
} from '../autofill-utils.js'

import {getInputSubtype, getInputMainType, createMatching, safeRegex} from './matching.js'
import { getIconStylesAutofilled, getIconStylesBase } from './inputStyles.js'
import {canBeInteractedWith, getInputConfig, isFieldDecorated} from './inputTypeConfig.js'

import {
    getUnifiedExpiryDate,
    formatCCYear,
    getCountryName,
    prepareFormValuesForStorage,
    inferCountryCodeFromElement
} from './formatters.js'

import {constants} from '../constants.js'
const {ATTR_AUTOFILL, ATTR_INPUT_TYPE} = constants

class Form {
    /** @type {import("../Form/matching").Matching} */
    matching;
    /** @type {HTMLElement} */
    form;
    /** @type {HTMLInputElement | null} */
    activeInput;
    /** @type {boolean | null} */
    isSignup;
    /**
     * @param {HTMLElement} form
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {import("../DeviceInterface/InterfacePrototype").default} deviceInterface
     * @param {import("../Form/matching").Matching} [matching]
     * @param {Boolean} [shouldAutoprompt]
     */
    constructor (form, input, deviceInterface, matching, shouldAutoprompt = false) {
        this.form = form
        this.matching = matching || createMatching()
        this.formAnalyzer = new FormAnalyzer(form, input, matching)
        this.isLogin = this.formAnalyzer.isLogin
        this.isSignup = this.formAnalyzer.isSignup
        this.isHybrid = this.formAnalyzer.isHybrid
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
        this.shouldPromptToStoreData = true
        this.shouldAutoSubmit = this.device.globalConfig.isMobileApp

        /**
         * @type {IntersectionObserver | null}
         */
        this.intObs = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) this.removeTooltip()
            }
        })

        // This ensures we fire the handler again if the form is changed
        this.addListener(form, 'input', () => {
            if (!this.isAutofilling) {
                this.handlerExecuted = false
                this.shouldPromptToStoreData = true
            }
        })

        this.categorizeInputs()

        if (shouldAutoprompt) {
            this.promptLoginIfNeeded()
        }
    }

    /**
     * Checks if the form element contains the activeElement or the event target
     * @return {boolean}
     * @param {KeyboardEvent | null} [e]
     */
    hasFocus (e) {
        return this.form.contains(document.activeElement) || this.form.contains(/** @type HTMLElement */(e?.target))
    }

    submitHandler (via = 'unknown') {
        if (this.device.globalConfig.isDDGTestMode) {
            console.log('Form.submitHandler via:', via, this)
        }

        if (this.handlerExecuted) return

        const values = this.getValues()

        this.device.postSubmit?.(values, this)

        // mark this form as being handled
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
                // Discard passwords that are shorter than 4 characters
                if (subtype === 'password' && value?.length <= 3) {
                    value = undefined
                }
                if (value) {
                    output[mainType][subtype] = value
                }
                return output
            }, {credentials: {}, creditCards: {}, identities: {}})

        if (
            formValues.credentials.password &&
            !formValues.credentials.username &&
            !formValues.identities.emailAddress
        ) {
            // If we have a password but no username, let's search further
            const hiddenFields = /** @type [HTMLInputElement] */([...this.form.querySelectorAll('input[type=hidden]')])
            const probableField = hiddenFields.find((field) => {
                const regex = safeRegex('email|' + this.matching.ddgMatcher('username')?.match)
                const attributeText = field.id + ' ' + field.name
                return regex?.test(attributeText)
            })
            if (probableField?.value) {
                formValues.credentials.username = probableField.value
            } else {
                // If we still don't have a username, try scanning the form's text for an email address
                this.form.querySelectorAll('*:not(select):not(option)').forEach((el) => {
                    const elText = getText(el)
                    // Ignore long texts to avoid false positives
                    if (elText.length > 70) return

                    const emailOrUsername = elText.match(
                        // https://www.emailregex.com/
                        /[a-zA-Z\d.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)*/
                    )?.[0]
                    if (emailOrUsername) {
                        formValues.credentials.username = emailOrUsername
                    }
                })
            }
        }

        return prepareFormValuesForStorage(formValues)
    }

    /**
     * Determine if the form has values we want to store in the device
     * @param {DataStorageObject} [values]
     * @return {boolean}
     */
    hasValues (values) {
        const {credentials, creditCards, identities} = values || this.getValues()

        return Boolean(credentials || creditCards || identities)
    }

    removeTooltip () {
        const tooltip = this.device.isTooltipActive()
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

        // If the user has changed the value, we prompt to update the stored data
        this.shouldPromptToStoreData = true

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
        this.execOnInputs((input) => {
            if (input instanceof HTMLInputElement) {
                this.decorateInput(input)
            }
        })
    }

    /**
     * Removes all scoring attributes from the inputs and deletes them from memory
     */
    forgetAllInputs () {
        this.execOnInputs((input) => {
            input.removeAttribute(ATTR_INPUT_TYPE)
        })
        Object.values(this.inputs).forEach((inputSet) => inputSet.clear())
    }

    /**
     * Resets our input scoring and starts from scratch
     */
    recategorizeAllInputs () {
        this.removeAllDecorations()
        this.forgetAllInputs()
        this.categorizeInputs()
    }
    resetAllInputs () {
        this.execOnInputs((input) => {
            setValue(input, '', this.device.globalConfig)
            this.removeInputHighlight(input)
        })
        if (this.activeInput) this.activeInput.focus()
        this.matching.clear()
    }
    dismissTooltip () {
        this.removeTooltip()
    }
    // This removes all listeners to avoid memory leaks and weird behaviours
    destroy () {
        this.removeAllDecorations()
        this.removeTooltip()
        this.matching.clear()
        this.intObs = null
    }

    categorizeInputs () {
        const selector = this.matching.cssSelector('FORM_INPUTS_SELECTOR')
        if (this.form.matches(selector)) {
            this.addInput(this.form)
        } else {
            this.form.querySelectorAll(selector).forEach(input => this.addInput(input))
        }
    }

    get submitButtons () {
        const selector = this.matching.cssSelector('SUBMIT_BUTTON_SELECTOR')
        const allButtons = /** @type {HTMLElement[]} */([...this.form.querySelectorAll(selector)])

        return allButtons
            .filter((btn) =>
                isVisible(btn) && isLikelyASubmitButton(btn) && buttonMatchesFormType(btn, this)
            )
    }

    attemptSubmissionIfNeeded () {
        if (
            !this.isLogin || // Only submit login forms
            this.submitButtons.length > 1 // Do not submit if we're unsure about the submit button
        ) return

        // check for visible empty fields before attemtping submission
        // this is to avoid loops where a captcha keeps failing for the user
        let isThereAnEmptyVisibleField = false
        this.execOnInputs((input) => {
            if (input.value === '' && isVisible(input)) isThereAnEmptyVisibleField = true
        }, 'all', false)
        if (isThereAnEmptyVisibleField) return

        // We're not using .submit() to minimise breakage with client-side forms
        this.submitButtons.forEach((button) => {
            if (isVisible(button)) {
                button.click()
            }
        })
    }

    /**
     * Executes a function on input elements. Can be limited to certain element types
     * @param {(input: HTMLInputElement|HTMLSelectElement) => void} fn
     * @param {'all' | SupportedMainTypes} inputType
     * @param {boolean} shouldCheckForDecorate
     */
    execOnInputs (fn, inputType = 'all', shouldCheckForDecorate = true) {
        const inputs = this.inputs[inputType]
        for (const input of inputs) {
            let canExecute = true
            // sometimes we want to execute even if we didn't decorate
            if (shouldCheckForDecorate) {
                canExecute = isFieldDecorated(input)
            }
            if (canExecute) fn(input)
        }
    }

    addInput (input) {
        // Nothing to do with 1-character fields
        if (input.maxLength === 1) return this

        if (this.inputs.all.has(input)) return this

        this.inputs.all.add(input)

        const opts = {
            isLogin: this.isLogin,
            isHybrid: this.isHybrid,
            hasCredentials: Boolean(this.device.settings.availableInputTypes.credentials?.username),
            supportsIdentitiesAutofill: this.device.settings.featureToggles.inputType_identities
        }
        this.matching.setInputType(input, this.form, opts)

        const mainInputType = getInputMainType(input)
        this.inputs[mainInputType].add(input)

        this.decorateInput(input)

        return this
    }

    addListener (el, type, fn) {
        el.addEventListener(type, fn)
        this.listeners.add({el, type, fn})
    }

    addAutofillStyles (input) {
        const styles = getIconStylesBase(input, this)
        addInlineStyles(input, styles)
    }

    /**
     * Decorate here means adding listeners and an optional icon
     * @param {HTMLInputElement} input
     * @returns {Promise<Form>}
     */
    async decorateInput (input) {
        const config = getInputConfig(input)

        const shouldDecorate = await config.shouldDecorate(input, this)
        if (!shouldDecorate) return this

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
            if (this.isAutofilling) {
                return
            }

            const input = e.target
            let click = null

            if (!canBeInteractedWith(input)) return

            // Checks for pointerdown event
            if (e.type === 'pointerdown') {
                click = getMainClickCoords(e)
                if (!click) return
            } else if (storedClick) {
                // Reuse a previous click if one exists for this element
                click = storedClick.get(input)
                storedClick.delete(input)
            }

            if (this.shouldOpenTooltip(e, input)) {
                if (
                    this.device.globalConfig.isMobileApp &&
                    // Avoid the icon capturing clicks on small fields making it impossible to focus
                    input.offsetWidth > 50 &&
                    isEventWithinDax(e, input)
                ) {
                    e.preventDefault()
                    e.stopImmediatePropagation()
                }

                this.touched.add(input)
                this.device.attachTooltip(this, input, click)
            }
        }

        if (!(input instanceof HTMLSelectElement)) {
            const events = ['pointerdown']
            if (!this.device.globalConfig.isMobileApp) events.push('focus')
            input.labels?.forEach((label) => {
                this.addListener(label, 'pointerdown', handlerLabel)
            })
            events.forEach((ev) => this.addListener(input, ev, handler))
        }
        return this
    }

    shouldOpenTooltip (e, input) {
        if (this.device.globalConfig.isApp) return true
        if (this.device.globalConfig.isWindows) return true

        return (!this.touched.has(input) && !input.classList.contains('ddg-autofilled')) || isEventWithinDax(e, input)
    }

    autofillInput (input, string, dataType) {
        // Do not autofill if it's invisible (select elements can be hidden because of custom implementations)
        if (input instanceof HTMLInputElement && !isVisible(input)) return
        // Do not autofill if it's disabled or readonly to avoid potential breakage
        if (!canBeInteractedWith(input)) return

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

        // If the value is already there, just return
        if (input.value === string) return

        const successful = setValue(input, string, this.device.globalConfig)

        if (!successful) return

        input.classList.add('ddg-autofilled')
        addInlineStyles(input, getIconStylesAutofilled(input, this))

        // If the user changes the value, remove the decoration
        input.addEventListener('input', (e) => this.removeAllHighlights(e, dataType), {once: true})
    }

    /**
     * Autofill method for email protection only
     * @param {string} alias
     * @param {'all' | SupportedMainTypes} dataType
     */
    autofillEmail (alias, dataType = 'identities') {
        this.isAutofilling = true
        this.execOnInputs(
            (input) => {
                const inputSubtype = getInputSubtype(input)
                if (inputSubtype === 'emailAddress') {
                    this.autofillInput(input, alias, dataType)
                }
            },
            dataType
        )
        this.isAutofilling = false
        this.removeTooltip()
    }

    autofillData (data, dataType) {
        this.isAutofilling = true

        this.execOnInputs((input) => {
            const inputSubtype = getInputSubtype(input)
            let autofillData = data[inputSubtype]

            if (inputSubtype === 'expiration' && input instanceof HTMLInputElement) {
                autofillData = getUnifiedExpiryDate(input, data.expirationMonth, data.expirationYear, this)
            }

            if (inputSubtype === 'expirationYear' && input instanceof HTMLInputElement) {
                autofillData = formatCCYear(input, autofillData, this)
            }

            if (inputSubtype === 'addressCountryCode') {
                autofillData = getCountryName(input, data)
            }

            if (autofillData) this.autofillInput(input, autofillData, dataType)
        }, dataType)

        this.isAutofilling = false

        // After autofill we check if form values match the data provided…
        const formValues = this.getValues()
        const areAllFormValuesKnown = Object.keys(formValues[dataType] || {}).every((subtype) => {
            return formValues[dataType]?.[subtype] === data[subtype]
        })
        if (areAllFormValuesKnown) {
            // …if we know all the values do not prompt to store data
            this.shouldPromptToStoreData = false
        } else {
            // …otherwise we will prompt and do not want to autosubmit because the experience is jarring
            this.shouldAutoSubmit = false
        }

        this.device.postAutofill?.(data, dataType, this)

        this.removeTooltip()
    }

    getFirstViableCredentialsInput () {
        return [...this.inputs.credentials].find((input) => canBeInteractedWith(input) && isVisible(input))
    }

    async promptLoginIfNeeded () {
        if (document.visibilityState !== 'visible' || !this.isLogin) return

        const firstCredentialInput = this.getFirstViableCredentialsInput()
        const input = this.activeInput || firstCredentialInput
        if (!input) return

        const mainType = getInputMainType(input)
        const subtype = getInputSubtype(input)
        if (await this.device.settings.canAutofillType(mainType, subtype)) {
            // The timeout is needed in case the page shows a cookie prompt with a slight delay
            setTimeout(() => {
                // safeExecute checks that the element is on screen according to IntersectionObserver
                safeExecute(this.form, () => {
                    const {x, y, width, height} = this.form.getBoundingClientRect()
                    const elHCenter = x + (width / 2)
                    const elVCenter = y + (height / 2)
                    // This checks that the form is not covered by anything else
                    const topMostElementFromPoint = document.elementFromPoint(elHCenter, elVCenter)
                    if (this.form.contains(topMostElementFromPoint)) {
                        this.execOnInputs((input) => {
                            if (isVisible(input)) {
                                this.touched.add(input)
                            }
                        }, 'credentials')
                        this.device.attachTooltip(this, input, null, 'autoprompt')
                    }
                })
            }, 200)
        }
    }
}

export { Form }
