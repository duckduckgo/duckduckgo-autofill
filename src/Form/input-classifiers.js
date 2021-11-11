const {
    PASSWORD_SELECTOR,
    EMAIL_SELECTOR,
    USERNAME_SELECTOR,
    CC_FIELD_SELECTOR,
    DATE_SEPARATOR_REGEX,
    CC_SELECTORS_LIST
} = require('./selectors')
const {ATTR_INPUT_TYPE} = require('../constants')

/**
 * Tests that a string matches a regex while not matching another
 * @param {String} string
 * @param {RegExp} regex
 * @param {RegExp} negativeRegex
 * @return {boolean}
 */
const testAgainstRegexes = (string = '', regex, negativeRegex) =>
    regex.test(string) && !negativeRegex?.test(string)

/**
 * Get text from all explicit labels
 * @param {HTMLInputElement} el
 * @return {String}
 */
const getExplicitLabelsText = (el) => {
    const text = [...(el.labels || [])].reduce((text, label) => `${text} ${label.textContent}`, '')
    const ariaLabel = el.getAttribute('aria-label') || ''
    const labelledByText = document.getElementById(el.getAttribute('aria-labelled'))?.textContent || ''
    return `${text} ${ariaLabel} ${labelledByText}`
}

/**
 * Get all text close to the input (useful when no labels are defined)
 * @param {HTMLInputElement} el
 * @param {Form} form
 * @return {string}
 */
const getRelatedText = (el, form) => {
    const container = getLargestMeaningfulContainer(el, form)
    return container.innerText
}

/**
 * Find a container for the input field that won't contain other inputs (useful to get elements related to the field)
 * @param {HTMLElement} el
 * @param {Form} form
 * @return {HTMLElement}
 */
const getLargestMeaningfulContainer = (el, form) => {
    const parentElement = el.parentElement
    if (!form) form = el.parentElement
    if (!parentElement || el === form.form) return el

    const inputsInScope = parentElement.querySelectorAll('input, select, textarea')
    // To avoid noise, ensure that our input is the only in scope
    if (inputsInScope.length === 1) {
        return getLargestMeaningfulContainer(parentElement, form)
    }
    return el
}

/**
 * Tries to infer input type, with checks in decreasing order of reliability
 * @param {{
 *     el: HTMLInputElement,
 *     form: Form,
 *     selector: String,
 *     regex: RegExp,
 *     negativeRegex?: RegExp
 * }}
 * @returns {boolean}
 */
const checkMatch = ({el, form, selector, regex, negativeRegex}) => {
    if (selector && el.matches(selector)) return true

    if (!regex) return false

    return testAgainstRegexes(getExplicitLabelsText(el), regex, negativeRegex) ||
        testAgainstRegexes(el.id, regex, negativeRegex) ||
        testAgainstRegexes(el.placeholder, regex, negativeRegex) ||
        testAgainstRegexes(getRelatedText(el, form), regex, negativeRegex)
}

/**
 * Tries to infer if input is for password
 * @param {HTMLInputElement} el
 * @param {Form} form
 * @returns {boolean}
 */
const isPassword = (el, form) =>
    checkMatch({
        el,
        form,
        selector: PASSWORD_SELECTOR,
        regex: /password/i,
        negativeRegex: /captcha/i
    })

/**
 * Tries to infer if input is for email
 * @param {HTMLInputElement} el
 * @param {Form} form
 * @returns {boolean}
 */
const isEmail = (el, form) =>
    checkMatch({
        el,
        form,
        selector: EMAIL_SELECTOR,
        regex: /.mail/i,
        negativeRegex: /search/i
    })

/**
 * Tries to infer if input is for username
 * @param {HTMLInputElement} el
 * @param {Form} form
 * @returns {boolean}
 */
const isUserName = (el, form) =>
    checkMatch({
        el,
        form,
        selector: USERNAME_SELECTOR,
        regex: /user((.)?name)?$/i,
        negativeRegex: /search/i
    })

/**
 * Tries to infer if it's a credit card form
 * @param {HTMLElement} form
 * @returns {boolean}
 */
const isCCForm = (form) => {
    const hasCCSelectorChild = form.querySelector(CC_FIELD_SELECTOR)
    // If the form contains one of the specific selectors, we have high confidence
    if (hasCCSelectorChild) return true

    // Read form attributes to find a signal
    const hasCCAttribute = Array.from(form.attributes).some(({name, value}) =>
        /(credit|payment).?card/i.test(`${name}=${value}`)
    )
    if (hasCCAttribute) return true

    // Match form textContent against common cc fields (includes hidden labels)
    const textMatches = form.textContent.match(/(credit)?card(.?number)?|ccv|security.?code|cvv|cvc|csc/ig)

    // We check for more than one to minimise false positives
    return textMatches?.length > 1
}

/**
 * Get a CC subtype based on selectors and regexes
 * @param {HTMLInputElement} el
 * @param {Form} form
 * @return {string}
 */
const getCCFieldSubtype = (el, form) =>
    CC_SELECTORS_LIST.find((sel) => checkMatch({el, form, ...sel}))?.ccType

/**
 * Tries to infer the input type
 * @param {HTMLInputElement} input
 * @param {Form} form
 * @returns {SupportedSubTypes}
 */
const inferInputType = (input, form) => {
    const presetType = input.getAttribute(ATTR_INPUT_TYPE)
    if (presetType) return presetType

    // For CC forms we run aggressive matches, so we want to make sure we only
    // run them on actual CC forms to avoid false positives and expensive loops
    if (isCCForm(form.form)) {
        const subtype = getCCFieldSubtype(input, form)
        if (subtype) return `creditCard.${subtype}`
    }

    if (isPassword(input, form)) return 'credentials.password'

    if (isEmail(input, form)) return form.isLogin ? 'credentials.username' : 'emailNew'

    if (isUserName(input, form)) return 'credentials.username'

    return 'unknown'
}

/**
 * Sets the input type as a data attribute to the element and returns it
 * @param {HTMLInputElement} input
 * @param {Form} form
 * @returns {SupportedSubTypes}
 */
const setInputType = (input, form) => {
    const type = inferInputType(input, form)
    input.setAttribute(ATTR_INPUT_TYPE, type)
    return type
}

/**
 * Retrieves the input main type
 * @param {HTMLInputElement} input
 * @returns {SupportedSubTypes}
 */
const getInputMainType = (input) =>
    input.getAttribute(ATTR_INPUT_TYPE)?.split('.')[0] ||
    'unknown'

/**
 * Retrieves the input subtype
 * @param {HTMLInputElement} input
 * @returns {SupportedSubTypes}
 */
const getInputSubtype = (input) =>
    input.getAttribute(ATTR_INPUT_TYPE)?.split('.')[1] ||
    input.getAttribute(ATTR_INPUT_TYPE)?.split('.')[0] ||
    'unknown'

/**
 * Matches 4 non-digit repeated characters (YYYY or AAAA) or 4 digits (2022)
 * @type {RegExp}
 */
const fourDigitYearRegex = /(\D)\1{3}|\d{4}/i

/**
 * Find a regex match for a given input
 * @param {HTMLInputElement} input
 * @param {RegExp} regex
 * @returns {RegExpMatchArray|null}
 */
const matchInPlaceholderAndLabels = (input, regex) => {
    let match = input.placeholder.match(regex)
    if (match) return match

    const labelsText = getExplicitLabelsText(input)
    match = labelsText.match(regex)
    if (match) return match

    const relatedText = getRelatedText(input)
    match = relatedText.match(regex)

    return match
}

/**
 * Check if a given input matches a regex
 * @param {HTMLInputElement} input
 * @param {RegExp} regex
 * @returns {boolean}
 */
const checkPlaceholderAndLabels = (input, regex) =>
    !!matchInPlaceholderAndLabels(input, regex)

/**
 * Format the cc year to best adapt to the input requirements (YY vs YYYY)
 * @param {HTMLInputElement} input
 * @param {number} year
 * @returns {number}
 */
const formatCCYear = (input, year) => {
    if (
        input.maxLength === 4 ||
        checkPlaceholderAndLabels(input, fourDigitYearRegex)
    ) return year

    return year - 2000
}

/**
 * Get a unified expiry date with separator
 * @param {HTMLInputElement} input
 * @param {number} month
 * @param {number} year
 * @returns {string}
 */
const getUnifiedExpiryDate = (input, month, year) => {
    const formattedYear = formatCCYear(input, year)
    const paddedMonth = `${month}`.padStart(2, '0')
    const separator = matchInPlaceholderAndLabels(input, DATE_SEPARATOR_REGEX)?.groups?.separator || '/'

    return `${paddedMonth}${separator}${formattedYear}`
}

module.exports = {
    isPassword,
    isEmail,
    isUserName,
    getCCFieldSubtype,
    inferInputType,
    setInputType,
    getInputMainType,
    getInputSubtype,
    formatCCYear,
    getUnifiedExpiryDate
}
