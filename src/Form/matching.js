const {createCacheableVendorRegexes} = require('./vendor-regex')
const {TEXT_LENGTH_CUTOFF, ATTR_INPUT_TYPE} = require('../constants')
const {extractLabelStrings} = require('./label-util')

/**
 * An abstraction around the concept of classifying input fields.
 *
 * The only state this class keeps is derived from the passed-in MatchingConfiguration.
 */
class Matching {
    /** @type {MatchingConfiguration} */
    #config;

    /** @type {CssSelectorConfiguration['selectors']} */
    #cssSelectors;

    /** @type {Record<string, DDGMatcher>} */
    #ddgMatchers;

    /**
     * This acts as an internal cache for the larger vendorRegexes
     * @type {{RULES: Record<keyof VendorRegexRules, RegExp|undefined>}}
     */
    #vendorRegExpCache;

    /** @type {MatcherLists} */
    #matcherLists;

    /** @type {Array<StrategyNames>} */
    #defaultStrategyOrder = ['cssSelector', 'ddgMatcher', 'vendorRegex']

    /**
     * @param {MatchingConfiguration} config
     */
    constructor (config) {
        this.#config = config

        const { rules, ruleSets } = this.#config.strategies.vendorRegex
        this.#vendorRegExpCache = createCacheableVendorRegexes(rules, ruleSets)
        this.#cssSelectors = this.#config.strategies.cssSelector.selectors
        this.#ddgMatchers = this.#config.strategies.ddgMatcher.matchers

        this.#matcherLists = {
            cc: [],
            id: [],
            password: [],
            username: [],
            email: []
        }

        /**
         * Convert the raw config data into actual references.
         *
         * For example this takes `email: ["email"]` and creates
         *
         * `email: [{type: "email", strategies: {cssSelector: "email", ... etc}]`
         */
        for (let [listName, matcherNames] of Object.entries(this.#config.matchers.lists)) {
            for (let fieldName of matcherNames) {
                if (!this.#matcherLists[listName]) {
                    this.#matcherLists[listName] = []
                }
                this.#matcherLists[listName].push(this.#config.matchers.fields[fieldName])
            }
        }
    }

    /**
     * Try to access a 'vendor regex' by name
     * @param {string} regexName
     * @returns {RegExp | undefined}
     */
    vendorRegex (regexName) {
        const match = this.#vendorRegExpCache.RULES[regexName]
        if (!match) {
            console.warn('Vendor Regex not found for', regexName)
            return undefined
        }
        return match
    }

    /**
     * Try to access a 'css selector' by name from configuration
     * @param {keyof RequiredCssSelectors | string} selectorName
     * @returns {string};
     */
    cssSelector (selectorName) {
        const match = this.#cssSelectors[selectorName]
        if (!match) {
            console.warn('CSS selector not found for %s, using a default value', selectorName)
            return ''
        }
        return match
    }

    /**
     * Try to access a 'ddg matcher' by name from configuration
     * @param {keyof RequiredCssSelectors | string} matcherName
     * @returns {DDGMatcher | undefined}
     */
    ddgMatcher (matcherName) {
        const match = this.#ddgMatchers[matcherName]
        if (!match) {
            console.warn('DDG matcher not found for', matcherName)
            return undefined
        }
        return match
    }

    /**
     * Try to access a list of matchers by name - these are the ones collected in the constructor
     * @param {keyof MatcherLists} listName
     * @return {Matcher[]}
     */
    matcherList (listName) {
        const matcherList = this.#matcherLists[listName]
        if (!matcherList) {
            console.warn('MatcherList not found for ', listName)
            return []
        }
        return matcherList
    }

    /**
     * Convert a list of matchers into a single CSS selector.
     *
     * This will consider all matchers in the list and if it
     * contains a CSS Selector it will be added to the final output
     *
     * @param {keyof MatcherLists} listName
     * @returns {string | undefined}
     */
    joinCssSelectors (listName) {
        const matcherList = this.matcherList(listName)
        if (!matcherList) {
            console.warn('Matcher list not found for', listName)
            return undefined
        }

        /**
         * @type {string[]}
         */
        const selectors = []

        for (let matcher of matcherList) {
            if (matcher.strategies.cssSelector) {
                const css = this.cssSelector(matcher.strategies.cssSelector)
                if (css) {
                    selectors.push(css)
                }
            }
        }

        return selectors.join(', ')
    }

    /**
     * Tries to infer the input type for an input
     *
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {HTMLFormElement} formEl
     * @param {{isLogin?: boolean}} [opts]
     * @returns {SupportedTypes}
     */
    inferInputType (input, formEl, opts = {}) {
        const presetType = getInputType(input)
        if (presetType !== 'unknown') return presetType

        // For CC forms we run aggressive matches, so we want to make sure we only
        // run them on actual CC forms to avoid false positives and expensive loops
        if (this.isCCForm(formEl)) {
            const ccMatchers = this.matcherList('cc')
            const subtype = this.subtypeFromMatchers(ccMatchers, input, formEl)
            if (subtype && isValidCreditCardSubtype(subtype)) {
                return `creditCard.${subtype}`
            }
        }

        if (input instanceof HTMLInputElement) {
            if (this.isPassword(input, formEl)) {
                return 'credentials.password'
            }

            if (this.isEmail(input, formEl)) {
                return opts.isLogin ? 'credentials.username' : 'identities.emailAddress'
            }

            if (this.isUserName(input, formEl)) {
                return 'credentials.username'
            }
        }

        const idMatchers = this.matcherList('id')
        const idSubtype = this.subtypeFromMatchers(idMatchers, input, formEl)
        if (idSubtype && isValidIdentitiesSubtype(idSubtype)) {
            return `identities.${idSubtype}`
        }

        return 'unknown'
    }

    /**
     * Sets the input type as a data attribute to the element and returns it
     * @param {HTMLInputElement} input
     * @param {HTMLFormElement} formEl
     * @param {{isLogin?: boolean}} [opts]
     * @returns {SupportedSubTypes | string}
     */
    setInputType (input, formEl, opts = {}) {
        const type = this.inferInputType(input, formEl, opts)
        input.setAttribute(ATTR_INPUT_TYPE, type)
        return type
    }

    /**
     * Tries to infer input subtype, with checks in decreasing order of reliability
     * @param {Matcher[]} matchers
     * @param {HTMLInputElement|HTMLSelectElement} el
     * @param {HTMLFormElement} form
     * @return {MatcherTypeNames|undefined}
     */
    subtypeFromMatchers (matchers, el, form) {
        for (let strategyName of this.#defaultStrategyOrder) {
            for (let matcher of matchers) {
                const lookup = matcher.strategies[strategyName]
                if (!lookup) {
                    continue
                }
                const result = this.executeMatchingStrategy(strategyName, lookup, el, form)
                if (result.matched) {
                    return matcher.type
                }
                if (!result.matched && result.proceed === false) {
                    // If we get here, do not allow subsequent strategies to continue
                    break
                }
            }
        }
        return undefined
    }
    /**
     * Takes a given strategy name, like 'cssSelector' along with a lookup key
     * and tries to execute that strategy safely on the input provided
     *
     * @param {StrategyNames} strategy
     * @param {string} lookup
     * @param {HTMLInputElement|HTMLSelectElement} el
     * @param {HTMLFormElement} form
     * @returns {MatchingResult}
     */
    executeMatchingStrategy (strategy, lookup, el, form) {
        switch (strategy) {
        case 'cssSelector': {
            const selector = this.cssSelector(lookup)
            return this.execCssSelector(selector, el)
        }
        case 'ddgMatcher': {
            const ddgMatcher = this.ddgMatcher(lookup)
            if (!ddgMatcher || !ddgMatcher.match) {
                return { matched: false }
            }
            return this.execDDGMatcher(ddgMatcher, el, form)
        }
        case 'vendorRegex': {
            const rule = this.vendorRegex(lookup)
            if (!rule) {
                return { matched: false }
            }
            return this.execVendorRegex(rule, el, form)
        }
        default: return { matched: false }
        }
    }

    /**
     * CSS selector matching just levearages the `.matches` method on elements
     *
     * @param {string} cssSelector
     * @param {HTMLInputElement|HTMLSelectElement} el
     * @returns {MatchingResult}
     */
    execCssSelector (cssSelector, el) {
        return { matched: el.matches(cssSelector) }
    }

    /**
     * A DDG Matcher can have a `match` regex along with a `not` regex. This is done
     * to allow it to be driven by configuration as it avoids needing to invoke custom functions.
     *
     * todo: maxDigits was added as an edge-case when converting this over to be declarative, but I'm
     * unsure if it's actually needed. It's not urgent, but we should consider removing it if that's the case
     *
     * @param {DDGMatcher} ddgMatcher
     * @param {HTMLInputElement|HTMLSelectElement} el
     * @param {HTMLFormElement} form
     * @returns {MatchingResult}
     */
    execDDGMatcher (ddgMatcher, el, form) {
        let matchRexExp = safeRegex(ddgMatcher.match || '')
        if (!matchRexExp) {
            return {matched: false}
        }

        let requiredScore = ['match', 'not', 'maxDigits'].filter(ddgMatcherProp => ddgMatcherProp in ddgMatcher).length

        /** @type {MatchableStrings[]} */
        const matchableStrings = ddgMatcher.matchableStrings || ['labelText', 'placeholderAttr', 'relatedText']

        for (let elementString of this.getElementStrings(el, form, {matchableStrings})) {
            if (!elementString) continue
            elementString = elementString.toLowerCase()

            // Scoring to ensure all DDG tests are valid
            let score = 0

            // if the `match` regex fails, moves onto the next string
            if (!matchRexExp.test(elementString)) {
                continue
            }

            // Otherwise, increment the score
            score++

            // If a negated regex was provided, ensure it does not match
            // If it DOES match - then we need to prevent any future strategies from continuing
            if (ddgMatcher.not) {
                let notRegex = safeRegex(ddgMatcher.not)
                if (!notRegex) {
                    return { matched: false }
                }
                if (notRegex.test(elementString)) {
                    return { matched: false }
                } else {
                    // All good here, increment the score
                    score++
                }
            }

            // If a 'maxDigits' rule was provided, validate it
            if (ddgMatcher.maxDigits) {
                const digitLength = elementString.replace(/[^0-9]/g, '').length
                if (digitLength > ddgMatcher.maxDigits) {
                    return { matched: false }
                } else {
                    score++
                }
            }

            if (score === requiredScore) {
                return { matched: true }
            }
        }
        return { matched: false }
    }

    /**
     * If we get here, a firefox/vendor regex was given and we can execute it on the element
     * strings
     * @param {RegExp} regex
     * @param {HTMLInputElement|HTMLSelectElement} el
     * @param {HTMLFormElement} form
     * @return {MatchingResult}
     */
    execVendorRegex (regex, el, form) {
        for (let elementString of this.getElementStrings(el, form)) {
            if (!elementString) continue
            elementString = elementString.toLowerCase()
            if (regex.test(elementString)) {
                return { matched: true }
            }
        }
        return { matched: false }
    }

    /**
     * Yield strings in the order in which they should be checked against.
     *
     * Note: some strategies may not want to accept all strings, which is
     * where `matchableStrings` helps. It defaults to when you see below but can
     * be overridden.
     *
     * For example, `nameAttr` is first, since this has the highest chance of matching
     * and then the rest are in decreasing order of value vs cost
     *
     * A generator function is used here to prevent any potentially expensive
     * lookups occurring if they are rare. For example if 90% of all matching never needs
     * to look at the output from `relatedText`, then the cost of computing it will be avoided.
     *
     * @param {HTMLInputElement|HTMLSelectElement} el
     * @param {HTMLFormElement} form
     * @param {{matchableStrings?: MatchableStrings[]}} [opts]
     * @returns {Generator<string, void, *>}
     */
    * getElementStrings (el, form, opts = {}) {
        let {
            matchableStrings = ['nameAttr', 'labelText', 'placeholderAttr', 'id', 'relatedText']
        } = opts
        for (let matchableString of matchableStrings) {
            switch (matchableString) {
            case 'nameAttr': {
                yield el.name
                break
            }
            case 'labelText': {
                yield getExplicitLabelsText(el)
                break
            }
            case 'placeholderAttr': {
                if (el instanceof HTMLInputElement) {
                    yield el.placeholder || ''
                }
                break
            }
            case 'id': {
                yield el.id
                break
            }
            case 'relatedText': {
                yield getRelatedText(el, form, this.cssSelector('FORM_INPUTS_SELECTOR'))
                break
            }
            default: {
                // a matchable string that wasn't handled
            }
            }
        }
    }

    /**
     * Tries to infer if input is for password
     * @param {HTMLInputElement} el
     * @param {HTMLFormElement} form
     */
    isPassword (el, form) {
        const pwMatchers = this.matcherList('password')
        return !!this.subtypeFromMatchers(pwMatchers, el, form)
    }

    /**
     * Tries to infer if input is for email
     * @param {HTMLInputElement} el
     * @param {HTMLFormElement} form
     * @return {boolean}
     */
    isEmail (el, form) {
        const emailMatchers = this.matcherList('email')
        return !!this.subtypeFromMatchers(emailMatchers, el, form)
    }

    /**
     * Tries to infer if input is for username
     * @param {HTMLInputElement} el
     * @param {HTMLFormElement} form
     * @return {boolean}
     */
    isUserName (el, form) {
        const usernameMatchers = this.matcherList('username')
        return !!this.subtypeFromMatchers(usernameMatchers, el, form)
    }

    /**
     * Tries to infer if it's a credit card form
     * @param {HTMLFormElement} formEl
     * @returns {boolean}
     */
    isCCForm (formEl) {
        const ccFieldSelector = this.joinCssSelectors('cc')
        if (!ccFieldSelector) {
            return false
        }
        const hasCCSelectorChild = formEl.querySelector(ccFieldSelector)
        // If the form contains one of the specific selectors, we have high confidence
        if (hasCCSelectorChild) return true

        // Read form attributes to find a signal
        const hasCCAttribute = [...formEl.attributes].some(({name, value}) =>
            /(credit|payment).?card/i.test(`${name}=${value}`)
        )
        if (hasCCAttribute) return true

        // Match form textContent against common cc fields (includes hidden labels)
        const textMatches = formEl.textContent?.match(/(credit)?card(.?number)?|ccv|security.?code|cvv|cvc|csc/ig)

        // We check for more than one to minimise false positives
        return Boolean(textMatches && textMatches.length > 1)
    }

    /**
     * @type {MatchingConfiguration}
     */
    static emptyConfig = {
        matchers: {
            lists: {},
            fields: {}
        },
        strategies: {
            'vendorRegex': {
                rules: {},
                ruleSets: []
            },
            'ddgMatcher': {
                matchers: {}
            },
            'cssSelector': {
                selectors: {}
            }
        }
    }
}

/**
 *  @returns {SupportedTypes}
 */
function getInputType (input) {
    const attr = input.getAttribute(ATTR_INPUT_TYPE)
    if (isValidSupportedType(attr)) {
        return attr
    }
    return 'unknown'
}

/**
 * Retrieves the main type
 * @param {SupportedTypes | string} type
 * @returns {SupportedMainTypes}
 */
function getMainTypeFromType (type) {
    const mainType = type.split('.')[0]
    switch (mainType) {
    case 'credentials':
    case 'creditCard':
    case 'identities':
        return mainType
    }
    return 'unknown'
}

/**
 * Retrieves the input main type
 * @param {HTMLInputElement} input
 * @returns {SupportedMainTypes}
 */
const getInputMainType = (input) =>
    getMainTypeFromType(getInputType(input))

/** @typedef {supportedIdentitiesSubtypes[number]} SupportedIdentitiesSubTypes */
const supportedIdentitiesSubtypes = /** @type {const} */ ([
    'emailAddress',
    'firstName',
    'middleName',
    'lastName',
    'fullName',
    'phone',
    'addressStreet',
    'addressStreet2',
    'addressCity',
    'addressProvince',
    'addressPostalCode',
    'addressCountryCode',
    'birthdayDay',
    'birthdayMonth',
    'birthdayYear'
])

/**
 * @param {SupportedTypes | any} supportedType
 * @returns {supportedType is SupportedIdentitiesSubTypes}
 */
function isValidIdentitiesSubtype (supportedType) {
    return supportedIdentitiesSubtypes.includes(supportedType)
}

/** @typedef {supportedCreditCardSubtypes[number]} SupportedCreditCardSubTypes */
const supportedCreditCardSubtypes = /** @type {const} */ ([
    'cardName',
    'cardNumber',
    'cardSecurityCode',
    'expirationMonth',
    'expirationYear',
    'expiration'
])

/**
 * @param {SupportedTypes | any} supportedType
 * @returns {supportedType is SupportedCreditCardSubTypes}
 */
function isValidCreditCardSubtype (supportedType) {
    return supportedCreditCardSubtypes.includes(supportedType)
}

/** @typedef {supportedCredentialsSubtypes[number]} SupportedCredentialsSubTypes */
const supportedCredentialsSubtypes = /** @type {const} */ ([
    'password',
    'username'
])

/**
 * @param {SupportedTypes | any} supportedType
 * @returns {supportedType is SupportedCredentialsSubTypes}
 */
function isValidCredentialsSubtype (supportedType) {
    return supportedCredentialsSubtypes.includes(supportedType)
}

/** @typedef {SupportedIdentitiesSubTypes | SupportedCreditCardSubTypes | SupportedCredentialsSubTypes} SupportedSubTypes */

/** @typedef {`identities.${SupportedIdentitiesSubTypes}` | `creditCard.${SupportedCreditCardSubTypes}` | `credentials.${SupportedCredentialsSubTypes}` | 'unknown'} SupportedTypes */
const supportedTypes = [
    ...supportedIdentitiesSubtypes.map((type) => `identities.${type}`),
    ...supportedCreditCardSubtypes.map((type) => `creditCard.${type}`),
    ...supportedCredentialsSubtypes.map((type) => `credentials.${type}`)
]

/**
 * Retrieves the subtype
 * @param {SupportedTypes | string} type
 * @returns {SupportedSubTypes | 'unknown'}
 */
function getSubtypeFromType (type) {
    const subType = type?.split('.')[1]
    const validType = isValidSubtype(subType)
    return validType ? subType : 'unknown'
}

/**
 * @param {SupportedSubTypes | any} supportedSubType
 * @returns {supportedSubType is SupportedSubTypes}
 */
function isValidSubtype (supportedSubType) {
    return isValidIdentitiesSubtype(supportedSubType) ||
           isValidCreditCardSubtype(supportedSubType) ||
           isValidCredentialsSubtype(supportedSubType)
}

/**
 * @param {SupportedTypes | any} supportedType
 * @returns {supportedType is SupportedTypes}
 */
function isValidSupportedType (supportedType) {
    return supportedTypes.includes(supportedType)
}

/**
 * Retrieves the input subtype
 * @param {HTMLInputElement|Element} input
 * @returns {SupportedSubTypes | 'unknown'}
 */
function getInputSubtype (input) {
    const type = getInputType(input)
    return getSubtypeFromType(type)
}

/**
 * Remove whitespace of more than 2 in a row and trim the string
 * @param string
 * @return {string}
 */
const removeExcessWhitespace = (string = '') => {
    return string
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/, ' ').trim()
}

/**
 * Get text from all explicit labels
 * @param {HTMLInputElement|HTMLSelectElement} el
 * @return {string}
 */
const getExplicitLabelsText = (el) => {
    const labelTextCandidates = []
    for (let label of el.labels || []) {
        labelTextCandidates.push(...extractLabelStrings(label))
    }
    if (el.hasAttribute('aria-label')) {
        labelTextCandidates.push(el.getAttribute('aria-label'))
    }

    // Try to access another element if it was marked as the label for this input/select
    const ariaLabelAttr = el.getAttribute('aria-labelled') || el.getAttribute('aria-labelledby') || ''
    const labelledByElement = document.getElementById(ariaLabelAttr)

    if (labelledByElement) {
        labelTextCandidates.push(...extractLabelStrings(labelledByElement))
    }

    if (labelTextCandidates.length > 0) {
        return removeExcessWhitespace(labelTextCandidates.join(' '))
    }

    return ''
}

/**
 * Get all text close to the input (useful when no labels are defined)
 * @param {HTMLInputElement|HTMLSelectElement} el
 * @param {HTMLFormElement} form
 * @param {string} cssSelector
 * @return {string}
 */
const getRelatedText = (el, form, cssSelector) => {
    const container = getLargestMeaningfulContainer(el, form, cssSelector)

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
 * @param {string} cssSelector
 * @return {HTMLElement}
 */
const getLargestMeaningfulContainer = (el, form, cssSelector) => {
    /* TODO: there could be more than one select el for the same label, in that case we should
        change how we compute the container */
    const parentElement = el.parentElement
    if (!parentElement || el === form) return el

    const inputsInParentsScope = parentElement.querySelectorAll(cssSelector)
    // To avoid noise, ensure that our input is the only in scope
    if (inputsInParentsScope.length === 1) {
        return getLargestMeaningfulContainer(parentElement, form, cssSelector)
    }
    return el
}

/**
 * Find a regex match for a given input
 * @param {HTMLInputElement} input
 * @param {RegExp} regex
 * @param {HTMLFormElement} form
 * @param {string} cssSelector
 * @returns {RegExpMatchArray|null}
 */
const matchInPlaceholderAndLabels = (input, regex, form, cssSelector) => {
    return input.placeholder?.match(regex) ||
        getExplicitLabelsText(input).match(regex) ||
        getRelatedText(input, form, cssSelector).match(regex)
}

/**
 * Check if a given input matches a regex
 * @param {HTMLInputElement} input
 * @param {RegExp} regex
 * @param {HTMLFormElement} form
 * @param {string} cssSelector
 * @returns {boolean}
 */
const checkPlaceholderAndLabels = (input, regex, form, cssSelector) => {
    return !!matchInPlaceholderAndLabels(input, regex, form, cssSelector)
}

/**
 * Creating Regex instances can throw, so we add this to be
 * @param {string} string
 * @returns {RegExp | undefined} string
 */
const safeRegex = (string) => {
    try {
        // This is lower-cased here because giving a `i` on a regex flag is a performance problem in some cases
        const input = String(string).toLowerCase().normalize('NFKC')
        return new RegExp(input, 'u')
    } catch (e) {
        console.warn('Could not generate regex from string input', string)
        return undefined
    }
}

module.exports = {
    getInputType,
    getInputSubtype,
    getSubtypeFromType,
    removeExcessWhitespace,
    getInputMainType,
    getMainTypeFromType,
    getExplicitLabelsText,
    getRelatedText,
    matchInPlaceholderAndLabels,
    checkPlaceholderAndLabels,
    safeRegex,
    Matching
}
