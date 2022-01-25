const {
    CC_FIELD_SELECTOR, CC_MATCHERS_LIST,
    PASSWORD_MATCHER, EMAIL_MATCHER, USERNAME_MATCHER,
    ID_MATCHERS_LIST, FORM_ELS_SELECTOR
} = require('./selectors')
const {ATTR_INPUT_TYPE, TEXT_LENGTH_CUTOFF} = require('../constants')

// TODO: move this to formatters.js after migrating the codebase to ES modules
/**
 * Remove whitespace of more than 2 in a row and trim the string
 * @param string
 * @return {string}
 */
const removeExcessWhitespace = (string = '') =>
    string.replace(/\s{2,}/, ' ').trim()

/**
 * Get text from all explicit labels
 * @param {HTMLInputElement} el
 * @return {String}
 */
const getExplicitLabelsText = (el) => {
    const text = [...(el.labels || [])].reduce((text, label) => `${text} ${label.textContent}`, '')
    const ariaLabel = el.getAttribute('aria-label') || ''
    const labelledByText = document.getElementById(el.getAttribute('aria-labelled'))?.textContent || ''
    return removeExcessWhitespace(`${text} ${ariaLabel} ${labelledByText}`)
}

/**
 * Get all text close to the input (useful when no labels are defined)
 * @param {HTMLInputElement} el
 * @param {HTMLFormElement} form
 * @return {string}
 */
const getRelatedText = (el, form) => {
    const container = getLargestMeaningfulContainer(el, form)

    // If there is no meaningful container return empty string
    if (container === el || container.nodeName === 'SELECT') return ''

    // If the container has a select element, remove its contents to avoid noise
    const noisyText = container.querySelector('select')?.textContent || ''
    const sanitizedText = removeExcessWhitespace(container.textContent?.replace(noisyText, ''))
    // If the text is longer than n chars it's too noisy and likely to yield false positives, so return ''
    if (sanitizedText.length < TEXT_LENGTH_CUTOFF) return sanitizedText
    return ''
}

/**
 * Find a container for the input field that won't contain other inputs (useful to get elements related to the field)
 * @param {HTMLElement} el
 * @param {HTMLFormElement} form
 * @return {HTMLElement}
 */
const getLargestMeaningfulContainer = (el, form) => {
    /* TODO: there could be more than one select el for the same label, in that case we should
        change how we compute the container */
    const parentElement = el.parentElement
    if (!parentElement || el === form) return el

    const inputsInParentsScope = parentElement.querySelectorAll(FORM_ELS_SELECTOR)
    // To avoid noise, ensure that our input is the only in scope
    if (inputsInParentsScope.length === 1) {
        return getLargestMeaningfulContainer(parentElement, form)
    }
    return el
}

/**
 * Tries to infer input subtype, with checks in decreasing order of reliability
 * @type (el: HTMLInputElement, form: HTMLFormElement, matchers: []Matcher) => string|undefined
 */
const getSubtypeFromMatchers = (el, form, matchers) => {
    let found
    // Selectors give high confidence and are least expensive
    found = matchers.find(({selector}) => el.matches(selector))
    if (found) return found.type

    // Labels are second-highest confidence and pretty cheap
    const labelText = getExplicitLabelsText(el)
    found = matchers.find(({matcherFn}) => matcherFn?.(labelText))
    if (found) return found.type

    // Next up, placeholder
    const placeholder = el.placeholder || ''
    found = matchers.find(({matcherFn}) => matcherFn?.(placeholder))
    if (found) return found.type

    // The related text is the most expensive and gives the least confidence
    // If the field had an explicit label, don't check related text to decrease false positives
    if (!labelText) {
        const relatedText = getRelatedText(el, form)
        found = matchers.find(({matcherFn}) => matcherFn?.(relatedText))
    }

    return found?.type
}

/**
 * Tries to infer if input is for password
 * @type (el: HTMLInputElement, form: HTMLFormElement) => Boolean
 */
const isPassword = (el, form) =>
    !!getSubtypeFromMatchers(el, form, [PASSWORD_MATCHER])

/**
 * Tries to infer if input is for email
 * @type (el: HTMLInputElement, form: HTMLFormElement) => Boolean
 */
const isEmail = (el, form) =>
    !!getSubtypeFromMatchers(el, form, [EMAIL_MATCHER])

/**
 * Tries to infer if input is for username
 * @type (el: HTMLInputElement, form: HTMLFormElement) => Boolean
 */
const isUserName = (el, form) =>
    !!getSubtypeFromMatchers(el, form, [USERNAME_MATCHER])

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
        const subtype = getSubtypeFromMatchers(input, formEl, CC_MATCHERS_LIST)
        if (subtype) return `creditCard.${subtype}`
    }

    if (isPassword(input, formEl)) return 'credentials.password'

    if (isEmail(input, formEl)) return form.isLogin ? 'credentials.username' : 'identities.emailAddress'

    if (isUserName(input, formEl)) return 'credentials.username'

    const idSubtype = getSubtypeFromMatchers(input, form, ID_MATCHERS_LIST)
    if (idSubtype) return `identities.${idSubtype}`

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
const matchInPlaceholderAndLabels = (input, regex, form) =>
    input.placeholder?.match(regex) ||
    getExplicitLabelsText(input).match(regex) ||
    getRelatedText(input, form).match(regex)

/**
 * Check if a given input matches a regex
 * @param {HTMLInputElement} input
 * @param {RegExp} regex
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
const checkPlaceholderAndLabels = (input, regex, form) =>
    !!matchInPlaceholderAndLabels(input, regex, form)

module.exports = {
    removeExcessWhitespace,
    isPassword,
    isEmail,
    isUserName,
    getSubtypeFromMatchers,
    inferInputType,
    setInputType,
    getInputMainType,
    getInputSubtype,
    matchInPlaceholderAndLabels,
    checkPlaceholderAndLabels
}
