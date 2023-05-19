import { removeExcessWhitespace, Matching } from './matching.js'
import { constants } from '../constants.js'
import { matchingConfiguration } from './matching-configuration.js'
import { getText, isLikelyASubmitButton } from '../autofill-utils.js'

const loginRegex = new RegExp(/sign(ing)?.?in(?!g)|log.?(i|o)n|unsubscri|(forgot(ten)?|reset) (your )?password|password (forgotten|lost)/i)
const signupRegex = new RegExp(
    /sign(ing)?.?up|join|\bregist(er|ration)|newsletter|\bsubscri(be|ption)|contact|create|start|enroll|settings|preferences|profile|update|checkout|guest|purchase|buy|order|schedule|estimate|request|new.?customer|(confirm|retype|repeat) password|password confirm?/i
)
const conservativeSignupRegex = new RegExp(/sign.?up|join|register|enroll|newsletter|subscri(be|ption)|settings|preferences|profile|update/i)
const strictSignupRegex = new RegExp(/sign.?up|join|register|(create|new).+account|enroll|settings|preferences|profile|update/i)

class FormAnalyzer {
    /** @type HTMLElement */
    form;
    /** @type Matching */
    matching;
    /**
     * @param {HTMLElement} form
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {Matching} [matching]
     */
    constructor (form, input, matching) {
        this.form = form
        this.matching = matching || new Matching(matchingConfiguration)

        /**
         * The signal is a continuum where negative values imply login and positive imply signup
         * @type {number}
         */
        this.autofillSignal = 0
        /**
         * A hybrid form can be either a login or a signup, the site uses a single form for both
         * @type {number}
         */
        this.hybridSignal = 0

        /**
         * Collects the signals for debugging purposes
         * @type {string[]}
         */
        this.signals = []

        this.evaluateElAttributes(input, 3, true)
        form ? this.evaluateForm() : this.evaluatePage()
        return this
    }

    /**
     * Hybrid forms can be used for both login and signup
     * @returns {boolean}
     */
    get isHybrid () {
        // When marking for hybrid we also want to ensure other signals are weak
        const areOtherSignalsWeak = Math.abs(this.autofillSignal) < 10

        return this.hybridSignal > 0 && areOtherSignalsWeak
    }

    get isLogin () {
        if (this.isHybrid) return false

        return this.autofillSignal < 0
    }

    get isSignup () {
        if (this.isHybrid) return false

        return this.autofillSignal >= 0
    }

    /**
     * Tilts the scoring towards Signup
     * @param {number} strength
     * @param {string} signal
     * @returns {FormAnalyzer}
     */
    increaseSignalBy (strength, signal) {
        this.autofillSignal += strength
        this.signals.push(`${signal}: +${strength}`)
        return this
    }

    /**
     * Tilts the scoring towards Login
     * @param {number} strength
     * @param {string} signal
     * @returns {FormAnalyzer}
     */
    decreaseSignalBy (strength, signal) {
        this.autofillSignal -= strength
        this.signals.push(`${signal}: -${strength}`)
        return this
    }

    /**
     * Increases the probability that this is a hybrid form (can be either login or signup)
     * @param {number} strength
     * @param {string} signal
     * @returns {FormAnalyzer}
     */
    increaseHybridSignal (strength, signal) {
        this.hybridSignal += strength
        this.signals.push(`${signal} (hybrid): +${strength}`)
        return this
    }

    /**
     * Updates the Login<->Signup signal according to the provided parameters
     * @param {object} p
     * @param {string} p.string - The string to check
     * @param {number} p.strength - Strength of the signal
     * @param {string} [p.signalType] - For debugging purposes, we give a name to the signal
     * @param {boolean} [p.shouldFlip] - Flips the signals, i.e. when a link points outside. See below
     * @param {boolean} [p.shouldCheckUnifiedForm] - Should check for login/signup forms
     * @param {boolean} [p.shouldBeConservative] - Should use the conservative signup regex
     * @returns {FormAnalyzer}
     */
    updateSignal ({
        string,
        strength,
        signalType = 'generic',
        shouldFlip = false,
        shouldCheckUnifiedForm = false,
        shouldBeConservative = false
    }) {
        const matchesLogin = string === 'current-password' || loginRegex.test(string)

        // Check explicitly for unified login/signup forms
        if (shouldCheckUnifiedForm && matchesLogin && strictSignupRegex.test(string)) {
            this.increaseHybridSignal(strength, signalType)
            return this
        }

        const signupRegexToUse = shouldBeConservative ? conservativeSignupRegex : signupRegex
        const matchesSignup = string === 'new-password' || signupRegexToUse.test(string)

        // In some cases a login match means the login is somewhere else, i.e. when a link points outside
        if (shouldFlip) {
            if (matchesLogin) this.increaseSignalBy(strength, signalType)
            if (matchesSignup) this.decreaseSignalBy(strength, signalType)
        } else {
            if (matchesLogin) this.decreaseSignalBy(strength, signalType)
            if (matchesSignup) this.increaseSignalBy(strength, signalType)
        }
        return this
    }

    evaluateElAttributes (el, signalStrength = 3, isInput = false) {
        Array.from(el.attributes).forEach(attr => {
            if (attr.name === 'style') return

            const attributeString = `${attr.name}=${attr.value}`
            this.updateSignal({
                string: attributeString,
                strength: signalStrength,
                signalType: `${el.name} attr: ${attributeString}`,
                shouldCheckUnifiedForm: isInput
            })
        })
    }

    evaluatePageTitle () {
        const pageTitle = document.title
        this.updateSignal({string: pageTitle, strength: 2, signalType: `page title: ${pageTitle}`, shouldCheckUnifiedForm: true})
    }

    evaluatePageHeadings () {
        const headings = document.querySelectorAll('h1, h2, h3, [class*="title"], [id*="title"]')
        headings.forEach(({textContent}) => {
            textContent = removeExcessWhitespace(textContent || '')
            this.updateSignal({
                string: textContent,
                strength: 0.5,
                signalType: `heading: ${textContent}`,
                shouldCheckUnifiedForm: true,
                shouldBeConservative: true
            })
        })
    }

    evaluatePage () {
        this.evaluatePageTitle()
        this.evaluatePageHeadings()
        // Check for submit buttons
        const buttons = document.querySelectorAll(`
                button[type=submit],
                button:not([type]),
                [role=button]
            `)
        buttons.forEach(button => {
            // if the button has a form, it's not related to our input, because our input has no form here
            if (button instanceof HTMLButtonElement) {
                if (!button.form && !button.closest('form')) {
                    this.evaluateElement(button)
                    this.evaluateElAttributes(button, 0.5)
                }
            }
        })
    }

    evaluateElement (el) {
        const string = getText(el)

        if (el.matches(this.matching.cssSelector('password'))) {
            // These are explicit signals by the web author, so we weigh them heavily
            this.updateSignal({
                string: el.getAttribute('autocomplete') || '',
                strength: 10,
                signalType: `explicit: ${el.getAttribute('autocomplete')}`
            })
        }

        // check button contents
        if (el.matches(this.matching.cssSelector('SUBMIT_BUTTON_SELECTOR'))) {
            // If we're confident this is the submit button, it's a stronger signal
            let likelyASubmit = isLikelyASubmitButton(el)
            if (likelyASubmit) {
                this.form.querySelectorAll('input[type=submit], button[type=submit]').forEach(
                    (submit) => {
                        // If there is another element marked as submit and this is not, flip back to false
                        if (el.type !== 'submit' && el !== submit) {
                            likelyASubmit = false
                        }
                    }
                )
            }
            const strength = likelyASubmit ? 20 : 2
            this.updateSignal({string, strength, signalType: `submit: ${string}`})
        }
        // if an external link matches one of the regexes, we assume the match is not pertinent to the current form
        if (
            (el instanceof HTMLAnchorElement && el.href && el.getAttribute('href') !== '#') ||
            (el.getAttribute('role') || '').toUpperCase() === 'LINK' ||
            el.matches('button[class*=secondary]')
        ) {
            // Unless it's a forgotten password link, we don't flip those links
            let shouldFlip = true
            if (/(forgot(ten)?|reset) (your )?password|password forgotten/i.test(string)) {
                shouldFlip = false
            }
            this.updateSignal({string, strength: 1, signalType: `external link: ${string}`, shouldFlip})
        } else {
            // any other case
            // only consider the el if it's a small text to avoid noisy disclaimers
            if (removeExcessWhitespace(el.textContent)?.length < constants.TEXT_LENGTH_CUTOFF) {
                this.updateSignal({string, strength: 1, signalType: `generic: ${string}`, shouldCheckUnifiedForm: true})
            }
        }
    }

    evaluateForm () {
        // Check page title
        this.evaluatePageTitle()

        // Check form attributes
        this.evaluateElAttributes(this.form)

        // Check form contents (skip select and option because they contain too much noise)
        this.form.querySelectorAll('*:not(select):not(option):not(script)').forEach(el => {
            // Check if element is not hidden. Note that we can't use offsetHeight
            // nor intersectionObserver, because the element could be outside the
            // viewport or its parent hidden
            const displayValue = window.getComputedStyle(el, null).getPropertyValue('display')
            if (displayValue !== 'none') this.evaluateElement(el)
        })

        // A form with many fields is unlikely to be a login form
        const relevantFields = this.form.querySelectorAll(this.matching.cssSelector('GENERIC_TEXT_FIELD'))
        if (relevantFields.length > 4) {
            this.increaseSignalBy(relevantFields.length * 1.5, 'many fields: it is probably not a login')
        }

        // If we can't decide at this point, try reading page headings
        if (this.autofillSignal === 0) {
            this.evaluatePageHeadings()
        }
        return this
    }
}

export default FormAnalyzer
