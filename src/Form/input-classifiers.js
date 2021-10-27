const {
    PASSWORD_SELECTOR,
    EMAIL_SELECTOR,
    USERNAME_SELECTOR,
    CC_FIELD_SELECTOR,
    CC_SELECTORS_MAP
} = require('./selectors')
const {ATTR_INPUT_TYPE} = require('../constants')

/**
 * Tries to get labels even when they're not explicitly set with for="id"
 * @param el
 * @returns {[]|NodeList}
 */
const findLabels = (el) => {
    const parentNode = el.parentNode
    const inputsInScope = parentNode?.querySelectorAll('input')
    // To avoid noise, ensure that our input is the only in scope
    if (inputsInScope?.length === 1) {
        const labels = parentNode.querySelectorAll('label')
        // If no label, recurse
        return labels.length ? labels : findLabels(parentNode)
    }
    return []
}

/**
 * Tries to infer input type, with checks in decreasing order of reliability
 * @param {HTMLInputElement} el
 * @param {String} selector - a css selector
 * @param {RegExp} [regex] - defaults to a regex that never matches https://stackoverflow.com/a/1723207/1948947
 * @returns {boolean}
 */
const checkMatch = (el, selector, regex = new RegExp('(?!)')) => {
    if (
        (selector && el.matches(selector)) ||
        [...el.labels].filter(label => regex.test(label.textContent)).length > 0 ||
        regex.test(el.getAttribute('aria-label')) ||
        el.id?.match(regex)
    ) return true

    return [...findLabels(el)].filter(label => regex.test(label.textContent)).length > 0
}

/**
 * Tries to infer if input is for password
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
const isPassword = (input) =>
    checkMatch(input, PASSWORD_SELECTOR, /password/i)

/**
 * Tries to infer if input is for email
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
const isEmail = (input) =>
    checkMatch(input, EMAIL_SELECTOR, /.mail/i)

/**
 * Tries to infer if input is for username
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
const isUserName = (input) =>
    checkMatch(input, USERNAME_SELECTOR, /user((.)?name)?/i)

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
    const hasCCAttribute = Array.from(form.attributes).some(({name, value}) => {
        /(credit)?card|cc/i.test(`${name}=${value}`)
    })
    if (hasCCAttribute) return true

    // Match form innerText against common cc fields
    const textMatches = form.textContent.match(/(credit)?card(.?number)?|ccv|security.?code|cvv|cvc|csc/ig)

    // We check for more than one to minimise false positives
    return textMatches?.length > 1
}

/**
 * Tries to infer if input is for credit card
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
const isCCField = (input) =>
    checkMatch(input, CC_FIELD_SELECTOR)

/**
 * Get a CC subtype based on selectors and regexes
 * @param {HTMLInputElement} input
 * @return {string}
 */
const getCCFieldSubtype = (input) => {
    const matchingSelector = Object.keys(CC_SELECTORS_MAP).find(selector => input.matches(selector))
    if (matchingSelector) return CC_SELECTORS_MAP[matchingSelector].ccType

    // Loop through types until something matches
    for (const {ccType, regex} of Object.values(CC_SELECTORS_MAP)) {
        if (checkMatch(input, '', regex)) return ccType
    }

    return ''
}

/**
 * Tries to infer the input type
 * @param {HTMLInputElement} input
 * @param {Form} form
 * @returns {SupportedTypes}
 */
const inferInputType = (input, form) => {
    const presetType = input.getAttribute(ATTR_INPUT_TYPE)
    if (presetType) return presetType

    // For CC forms we run aggressive matches, so we want to make sure we only
    // run them on actual CC forms to avoid false positives and expensive loops
    if (isCCForm(form.form)) {
        const subtype = getCCFieldSubtype(input)
        if (subtype) return `creditCard.${subtype}`
    }

    if (isPassword(input)) return 'credentials.password'

    if (isEmail(input)) return form.isLogin ? 'credentials.username' : 'emailNew'

    if (isUserName(input)) return 'credentials.username'

    return 'unknown'
}

/**
 * Sets the input type as a data attribute to the element and returns it
 * @param {HTMLInputElement} input
 * @param {Form} form
 * @returns {SupportedTypes}
 */
const setInputType = (input, form) => {
    const type = inferInputType(input, form)
    input.setAttribute(ATTR_INPUT_TYPE, type)
    return type
}

/**
 * Retrieves the input main type
 * @param {HTMLInputElement} input
 * @returns {SupportedTypes}
 */
const getInputMainType = (input) =>
    input.getAttribute(ATTR_INPUT_TYPE).split('.')[0]

/**
 * Retrieves the input subtype
 * @param {HTMLInputElement} input
 * @returns {String}
 */
const getInputSubtype = (input) =>
    input.getAttribute(ATTR_INPUT_TYPE).split('.')[1] ||
    input.getAttribute(ATTR_INPUT_TYPE).split('.')[0]

const fourDigitYearRegex = /(\D)\1{3}|\d{4}/i
/**
 * Format the cc year to best adapt to the input requirements (YY vs YYYY)
 * @param {HTMLInputElement} input
 * @param {number} year
 * @returns {number}
 */
const formatCCYear = (input, year) => {
    if (
        input.maxLength === 4 ||
        fourDigitYearRegex.test(input.placeholder) ||
        [...input.labels].some((label) => fourDigitYearRegex.test(label))
    ) return 2000 + year

    return year
}

module.exports = {
    isPassword,
    isEmail,
    isUserName,
    isCCField,
    inferInputType,
    setInputType,
    getInputMainType,
    getInputSubtype,
    formatCCYear,
}
