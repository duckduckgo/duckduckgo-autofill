const {
    CC_FIELD_SELECTOR, DATE_SEPARATOR_REGEX, CC_MATCHERS_LIST,
    PASSWORD_MATCHER, EMAIL_MATCHER, USERNAME_MATCHER, FOUR_DIGIT_YEAR_REGEX
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
 * @param {HTMLFormElement} form
 * @return {string}
 */
const getRelatedText = (el, form) => {
    const container = getLargestMeaningfulContainer(el, form)
    return container.innerText
}

/**
 * Find a container for the input field that won't contain other inputs (useful to get elements related to the field)
 * @param {HTMLElement} el
 * @param {HTMLFormElement} form
 * @return {HTMLElement}
 */
const getLargestMeaningfulContainer = (el, form) => {
    const parentElement = el.parentElement
    if (!parentElement || el === form) return el

    const inputsInScope = parentElement.querySelectorAll('input, select, textarea')
    // To avoid noise, ensure that our input is the only in scope
    if (inputsInScope.length === 1) {
        return getLargestMeaningfulContainer(parentElement, form)
    }
    return el
}

/**
 * Tries to infer input type, with checks in decreasing order of reliability
 * @type ({el: HTMLInputElement, form: HTMLFormElement, ...Matcher}) => Boolean
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
 * @type (el: HTMLInputElement, form: HTMLFormElement) => Boolean
 */
const isPassword = (el, form) =>
    checkMatch({el, form, ...PASSWORD_MATCHER})

/**
 * Tries to infer if input is for email
 * @type (el: HTMLInputElement, form: HTMLFormElement) => Boolean
 */
const isEmail = (el, form) =>
    checkMatch({el, form, ...EMAIL_MATCHER})

/**
 * Tries to infer if input is for username
 * @type (el: HTMLInputElement, form: HTMLFormElement) => Boolean
 */
const isUserName = (el, form) =>
    checkMatch({el, form, ...USERNAME_MATCHER})

/**
 * Tries to infer if it's a credit card form
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
const isCCForm = (form) => {
    const hasCCSelectorChild = form.querySelector(CC_FIELD_SELECTOR)
    // If the form contains one of the specific selectors, we have high confidence
    if (hasCCSelectorChild) return true

    // Read form attributes to find a signal
    const hasCCAttribute = [...form.attributes].some(({name, value}) =>
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
 * @param {HTMLFormElement} form
 * @return {string}
 */
const getCCFieldSubtype = (el, form) =>
    CC_MATCHERS_LIST.find((sel) => checkMatch({el, form, ...sel}))?.type

/**
 * Tries to infer the input type
 * @param {HTMLInputElement} input
 * @param {Form} form
 * @returns {SupportedSubTypes}
 */
const inferInputType = (input, form) => {
    const presetType = input.getAttribute(ATTR_INPUT_TYPE)
    if (presetType) return presetType

    const formEl = form.form

    // For CC forms we run aggressive matches, so we want to make sure we only
    // run them on actual CC forms to avoid false positives and expensive loops
    if (isCCForm(formEl)) {
        const subtype = getCCFieldSubtype(input, formEl)
        if (subtype) return `creditCard.${subtype}`
    }

    if (isPassword(input, formEl)) return 'credentials.password'

    if (isEmail(input, formEl)) return form.isLogin ? 'credentials.username' : 'emailNew'

    if (isUserName(input, formEl)) return 'credentials.username'

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
 * Find a regex match for a given input
 * @param {HTMLInputElement} input
 * @param {RegExp} regex
 * @param {HTMLFormElement} form
 * @returns {RegExpMatchArray|null}
 */
const matchInPlaceholderAndLabels = (input, regex, form) => {
    let match = input.placeholder.match(regex)
    if (match) return match

    const labelsText = getExplicitLabelsText(input)
    match = labelsText.match(regex)
    if (match) return match

    const relatedText = getRelatedText(input, form)
    match = relatedText.match(regex)

    return match
}

/**
 * Check if a given input matches a regex
 * @param {HTMLInputElement} input
 * @param {RegExp} regex
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
const checkPlaceholderAndLabels = (input, regex, form) =>
    !!matchInPlaceholderAndLabels(input, regex, form)

/**
 * Format the cc year to best adapt to the input requirements (YY vs YYYY)
 * @param {HTMLInputElement} input
 * @param {number} year
 * @param {HTMLFormElement} form
 * @returns {number}
 */
const formatCCYear = (input, year, form) => {
    if (
        input.maxLength === 4 ||
        checkPlaceholderAndLabels(input, FOUR_DIGIT_YEAR_REGEX, form)
    ) return year

    return year - 2000
}

/**
 * Get a unified expiry date with separator
 * @param {HTMLInputElement} input
 * @param {number} month
 * @param {number} year
 * @param {HTMLFormElement} form
 * @returns {string}
 */
const getUnifiedExpiryDate = (input, month, year, form) => {
    const formattedYear = formatCCYear(input, year, form)
    const paddedMonth = `${month}`.padStart(2, '0')
    const separator = matchInPlaceholderAndLabels(input, DATE_SEPARATOR_REGEX, form)?.groups?.separator || '/'

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
