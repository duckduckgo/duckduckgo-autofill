const {
    PASSWORD_SELECTOR,
    EMAIL_SELECTOR,
    USERNAME_SELECTOR,
    CC_FIELD_SELECTOR,
    CC_SELECTORS_MAP
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
 * Tries to get labels even when they're not explicitly set with for="id"
 * @param el
 * @param {Form} form
 * @returns {[]|NodeList}
 */
const findLabels = (el, form) => {
    const parentNode = el.parentNode
    if (!parentNode || parentNode === form.form || el === form.form) return []

    const inputsInScope = parentNode.querySelectorAll('input')
    // To avoid noise, ensure that our input is the only in scope
    if (inputsInScope.length === 1) {
        const labels = parentNode.querySelectorAll('label')
        // If no label, recurse
        return labels.length ? labels : findLabels(parentNode, form)
    }
    return []
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

    if (
        [...(el.labels || [])].filter(label =>
            testAgainstRegexes(label.textContent, regex, negativeRegex)
        ).length > 0 ||
        testAgainstRegexes(el.getAttribute('aria-label'), regex, negativeRegex) ||
        testAgainstRegexes(el.id, regex, negativeRegex)
    ) return true

    return [...findLabels(el, form)]
        .filter(label => regex.test(label.textContent)).length > 0
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
const getCCFieldSubtype = (el, form) => {
    const matchingSelector = Object.keys(CC_SELECTORS_MAP).find(selector => el.matches(selector))
    if (matchingSelector) return CC_SELECTORS_MAP[matchingSelector].ccType

    // Loop through types until something matches
    for (const {ccType, regex} of Object.values(CC_SELECTORS_MAP)) {
        if (checkMatch({el, form, selector: '', regex})) return ccType
    }

    return undefined
}

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
const findInPlaceholderAndLabels = (input, regex) => {
    let match = input.placeholder.match(regex)
    if (match) return match

    for (const label of input.labels || []) {
        match = label.textContent.match(regex)
        if (match) return match
    }

    return null
}

/**
 * Check if a given input matches a regex
 * @param {HTMLInputElement} input
 * @param {RegExp} regex
 * @returns {boolean}
 */
const checkPlaceholderAndLabels = (input, regex) =>
    !!findInPlaceholderAndLabels(input, regex)

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
    const separatorRegex = /\w\w\s?(?<separator>[/\s.\-_—–])\s?\w\w/i
    const separator = findInPlaceholderAndLabels(input, separatorRegex)?.groups?.separator || '/'

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
