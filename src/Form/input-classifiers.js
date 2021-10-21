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
        el.matches(selector) ||
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
 * Tries to infer if input is for credit card
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
const isCCField = (input) =>
    checkMatch(input, CC_FIELD_SELECTOR)

/**
 * Get a subtype based on the matching selector
 * @param {HTMLInputElement} input
 */
const getCCFieldSubtype = (input) => {
    const matchingSelector = Object.keys(CC_SELECTORS_MAP).find(selector => input.matches(selector))
    return CC_SELECTORS_MAP[matchingSelector]
}

/**
 * Tries to infer the input type
 * @param {HTMLInputElement} input
 * @param {boolean} isLogin
 * @returns {SupportedTypes}
 */
const inferInputType = (input, isLogin) => {
    const presetType = input.getAttribute(ATTR_INPUT_TYPE)
    if (presetType) return presetType

    if (isPassword(input)) return 'credentials.password'

    if (isEmail(input)) return isLogin ? 'credentials.username' : 'emailNew'

    if (isUserName(input)) return 'credentials.username'

    if (isCCField(input)) {
        const subtype = getCCFieldSubtype(input)
        return `creditCard.${subtype}`
    }

    return 'unknown'
}

/**
 * Sets the input type as a data attribute to the element and returns it
 * @param {HTMLInputElement} input
 * @param {boolean} isLogin
 * @returns {SupportedTypes}
 */
const setInputType = (input, isLogin) => {
    const type = inferInputType(input, isLogin)
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

module.exports = {
    isPassword,
    isEmail,
    isUserName,
    isCCField,
    inferInputType,
    setInputType,
    getInputMainType,
    getInputSubtype
}
