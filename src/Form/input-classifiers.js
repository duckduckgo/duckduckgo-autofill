const {PASSWORD_SELECTOR, EMAIL_SELECTOR, USERNAME_SELECTOR} = require('./selectors')

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

module.exports = {
    isPassword,
    isEmail,
    isUserName
}
