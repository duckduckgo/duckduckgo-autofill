import {createCacheableVendorRegexes} from './vendor-regex.js'
import {constants} from '../constants.js'
import {EXCLUDED_TAGS, extractElementStrings} from './label-util.js'
import {matchingConfiguration} from './matching-configuration.js'
import {logMatching, logUnmatched} from './matching-utils.js'
import {getTextShallow} from '../autofill-utils.js'

const { TEXT_LENGTH_CUTOFF, ATTR_INPUT_TYPE } = constants

/** @type {{[K in keyof MatcherLists]?: { minWidth: number }} } */
const dimensionBounds = {
    emailAddress: { minWidth: 35 }
}

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

    /** @type {Record<MatchableStrings, string>} */
    activeElementStrings = {
        nameAttr: '',
        labelText: '',
        placeholderAttr: '',
        relatedText: '',
        id: ''
    }

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
            unknown: [],
            cc: [],
            id: [],
            password: [],
            username: [],
            emailAddress: []
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
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {HTMLElement} formEl
     */
    setActiveElementStrings (input, formEl) {
        this.activeElementStrings = this.getElementStrings(input, formEl)
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
     * Strategies can have different lookup names. This returns the correct one
     * @param {MatcherTypeNames} matcherName
     * @param {StrategyNames} vendorRegex
     * @returns {MatcherTypeNames}
     */
    getStrategyLookupByType (matcherName, vendorRegex) {
        return this.#config.matchers.fields[matcherName]?.strategies[vendorRegex]
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
        if (Array.isArray(match)) {
            return match.join(',')
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
     * Returns the RegExp for the given matcherName, with proper flags
     * @param {AllDDGMatcherNames} matcherName
     * @returns {RegExp|undefined}
     */
    getDDGMatcherRegex (matcherName) {
        const matcher = this.ddgMatcher(matcherName)
        if (!matcher || !matcher.match) {
            console.warn('DDG matcher has unexpected format')
            return undefined
        }
        return safeRegex(matcher.match)
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
     * Returns true if the field is visible and large enough
     * @param {keyof MatcherLists} matchedType
     * @param {HTMLInputElement} input
     * @returns {boolean}
     */
    isInputLargeEnough (matchedType, input) {
        const expectedDimensionBounds = dimensionBounds[matchedType]
        if (!expectedDimensionBounds) return true

        const width = input.offsetWidth
        const height = input.offsetHeight

        // Ignore hidden elements as we can't determine their dimensions
        const isHidden = height === 0 && width === 0
        if (isHidden) return true

        return width >= expectedDimensionBounds.minWidth
    }

    /**
     * Tries to infer the input type for an input
     *
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {HTMLElement} formEl
     * @param {SetInputTypeOpts} [opts]
     * @returns {SupportedTypes}
     */
    inferInputType (input, formEl, opts = {}) {
        const presetType = getInputType(input)
        if (presetType !== 'unknown') {
            return presetType
        }

        this.setActiveElementStrings(input, formEl)

        if (this.subtypeFromMatchers('unknown', input)) return 'unknown'

        // // For CC forms we run aggressive matches, so we want to make sure we only
        // // run them on actual CC forms to avoid false positives and expensive loops
        if (opts.isCCForm) {
            const subtype = this.subtypeFromMatchers('cc', input)
            if (subtype && isValidCreditCardSubtype(subtype)) {
                return `creditCards.${subtype}`
            }
        }

        if (input instanceof HTMLInputElement) {
            if (this.subtypeFromMatchers('password', input)) {
                // Any other input type is likely a false match
                // Arguably "text" should be as well, but it can be used for password reveal fields
                if (
                    ['password', 'text'].includes(input.type) &&
                    input.name !== 'email' &&
                    input.placeholder !== 'Username'
                ) {
                    return 'credentials.password'
                }
            }

            if (this.subtypeFromMatchers('emailAddress', input) && this.isInputLargeEnough('emailAddress', input)) {
                if (opts.isLogin || opts.isHybrid) {
                    // TODO: Being this support back in the future
                    // https://app.asana.com/0/1198964220583541/1204686960531034/f
                    // Show identities when supported and there are no credentials
                    // if (opts.supportsIdentitiesAutofill && !opts.hasCredentials) {
                    //     return 'identities.emailAddress'
                    // }

                    return 'credentials.username'
                }

                // TODO: Temporary hack to support Google signin in different languages
                // https://app.asana.com/0/1198964220583541/1201650539303898/f
                if (
                    window.location.href.includes('https://accounts.google.com/v3/signin/identifier') &&
                    input.matches('[type=email][autocomplete=username]')
                ) {
                    return 'credentials.username'
                }

                return 'identities.emailAddress'
            }

            if (this.subtypeFromMatchers('username', input)) {
                return 'credentials.username'
            }
        }

        const idSubtype = this.subtypeFromMatchers('id', input)

        if (idSubtype && isValidIdentitiesSubtype(idSubtype)) {
            return `identities.${idSubtype}`
        }

        logUnmatched(input, this.activeElementStrings)
        return 'unknown'
    }

    /**
     * @typedef {{
     *   isLogin?: boolean,
     *   isHybrid?: boolean,
     *   isCCForm?: boolean,
     *   hasCredentials?: boolean,
     *   supportsIdentitiesAutofill?: boolean
     * }} SetInputTypeOpts
     */

    /**
     * Sets the input type as a data attribute to the element and returns it
     * @param {HTMLInputElement} input
     * @param {HTMLElement} formEl
     * @param {SetInputTypeOpts} [opts]
     * @returns {SupportedSubTypes | string}
     */
    setInputType (input, formEl, opts = {}) {
        const type = this.inferInputType(input, formEl, opts)
        input.setAttribute(ATTR_INPUT_TYPE, type)
        return type
    }

    /**
     * Tries to infer input subtype, with checks in decreasing order of reliability
     * @param {keyof MatcherLists} listName
     * @param {HTMLInputElement|HTMLSelectElement} el
     * @return {MatcherTypeNames|undefined}
     */
    subtypeFromMatchers (listName, el) {
        const matchers = this.matcherList(listName)

        /**
         * Loop through each strategy in order
         */
        for (let strategyName of this.#defaultStrategyOrder) {
            let result
            /**
             * Now loop through each matcher in the list.
             */
            for (let matcher of matchers) {
                /**
                 * for each `strategyName` (such as cssSelector), check
                 * if the current matcher implements it.
                 */
                const lookup = matcher.strategies[strategyName]
                /**
                 * Sometimes a matcher may not implement the current strategy,
                 * so we skip it
                 */
                if (!lookup) continue

                /**
                 * Now perform the matching
                 */
                if (strategyName === 'cssSelector') {
                    result = this.execCssSelector(lookup, el)
                }
                if (strategyName === 'ddgMatcher') {
                    result = this.execDDGMatcher(lookup)
                }
                if (strategyName === 'vendorRegex') {
                    result = this.execVendorRegex(lookup)
                }

                /**
                 * If there's a match, return the matcher type.
                 *
                 * So, for example if 'username' had a `cssSelector` implemented, and
                 * it matched the current element, then we'd return 'username'
                 */
                if (result?.matched) {
                    logMatching(el, result)
                    return matcher.type
                }

                /**
                 * If a matcher wants to prevent all future matching on this element,
                 * it would return { matched: false, proceed: false }
                 */
                if (!result?.matched && result?.proceed === false) {
                    logMatching(el, result)
                    // If we get here, do not allow subsequent strategies to continue
                    return undefined
                }
            }

            if (result?.skip) {
                logMatching(el, result)
                break
            }
        }
        return undefined
    }

    /**
     * CSS selector matching just leverages the `.matches` method on elements
     *
     * @param {MatcherTypeNames} lookup
     * @param {HTMLInputElement|HTMLSelectElement} el
     * @returns {MatchingResult}
     */
    execCssSelector (lookup, el) {
        const selector = this.cssSelector(lookup)
        return {
            matched: el.matches(selector),
            strategyName: 'cssSelector',
            matcherType: lookup
        }
    }

    /**
     * A DDG Matcher can have a `match` regex along with a `not` regex. This is done
     * to allow it to be driven by configuration as it avoids needing to invoke custom functions.
     *
     * todo: maxDigits was added as an edge-case when converting this over to be declarative, but I'm
     * unsure if it's actually needed. It's not urgent, but we should consider removing it if that's the case
     *
     * @param {MatcherTypeNames} lookup
     * @returns {MatchingResult}
     */
    execDDGMatcher (lookup) {
        /** @type {MatchingResult} */
        const defaultResult = { matched: false, strategyName: 'ddgMatcher', matcherType: lookup }

        const ddgMatcher = this.ddgMatcher(lookup)
        if (!ddgMatcher || !ddgMatcher.match) {
            return defaultResult
        }
        let matchRexExp = safeRegex(ddgMatcher.match || '')
        if (!matchRexExp) {
            return defaultResult
        }

        let requiredScore = ['match', 'forceUnknown', 'maxDigits'].filter(ddgMatcherProp => ddgMatcherProp in ddgMatcher).length

        /** @type {MatchableStrings[]} */
        const matchableStrings = ddgMatcher.matchableStrings || ['labelText', 'placeholderAttr', 'relatedText']

        for (let stringName of matchableStrings) {
            let elementString = this.activeElementStrings[stringName]
            if (!elementString) continue

            // Scoring to ensure all DDG tests are valid
            let score = 0

            /** @type {MatchingResult} */
            const result = {
                ...defaultResult,
                matchedString: elementString,
                matchedFrom: stringName
            }

            // If a negated regex was provided, ensure it does not match
            // If it DOES match - then we need to prevent any future strategies from continuing
            if (ddgMatcher.forceUnknown) {
                let notRegex = safeRegex(ddgMatcher.forceUnknown)
                if (!notRegex) {
                    return { ...result, matched: false }
                }
                if (notRegex.test(elementString)) {
                    return { ...result, matched: false, proceed: false }
                } else {
                    // All good here, increment the score
                    score++
                }
            }

            if (ddgMatcher.skip) {
                let skipRegex = safeRegex(ddgMatcher.skip)
                if (!skipRegex) {
                    return { ...result, matched: false }
                }
                if (skipRegex.test(elementString)) {
                    return { ...result, matched: false, skip: true }
                }
            }

            // if the `match` regex fails, moves onto the next string
            if (!matchRexExp.test(elementString)) {
                continue
            }

            // Otherwise, increment the score
            score++

            // If a 'maxDigits' rule was provided, validate it
            if (ddgMatcher.maxDigits) {
                const digitLength = elementString.replace(/[^0-9]/g, '').length
                if (digitLength > ddgMatcher.maxDigits) {
                    return { ...result, matched: false }
                } else {
                    score++
                }
            }

            if (score === requiredScore) {
                return { ...result, matched: true }
            }
        }
        return defaultResult
    }

    /**
     * If we get here, a firefox/vendor regex was given and we can execute it on the element
     * strings
     * @param {MatcherTypeNames} lookup
     * @return {MatchingResult}
     */
    execVendorRegex (lookup) {
        /** @type {MatchingResult} */
        const defaultResult = { matched: false, strategyName: 'vendorRegex', matcherType: lookup }

        const regex = this.vendorRegex(lookup)
        if (!regex) {
            return defaultResult
        }
        /** @type {MatchableStrings[]} */
        const stringsToMatch = ['placeholderAttr', 'nameAttr', 'labelText', 'id', 'relatedText']
        for (let stringName of stringsToMatch) {
            let elementString = this.activeElementStrings[stringName]
            if (!elementString) continue
            elementString = elementString.toLowerCase()
            if (regex.test(elementString)) {
                return {
                    ...defaultResult,
                    matched: true,
                    matchedString: elementString,
                    matchedFrom: stringName
                }
            }
        }
        return defaultResult
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
     * @param {HTMLElement} form
     * @returns {Record<MatchableStrings, string>}
     */
    _elementStringCache = new WeakMap();
    getElementStrings (el, form) {
        if (this._elementStringCache.has(el)) {
            return this._elementStringCache.get(el)
        }

        const explicitLabelsText = getExplicitLabelsText(el)

        /** @type {Record<MatchableStrings, string>} */
        const next = {
            nameAttr: el.name,
            labelText: explicitLabelsText,
            placeholderAttr: el.placeholder || '',
            id: el.id,
            relatedText: explicitLabelsText ? '' : getRelatedText(el, form, this.cssSelector('formInputsSelector'))
        }
        this._elementStringCache.set(el, next)
        return next
    }
    clear () {
        this._elementStringCache = new WeakMap()
    }

    /**
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {HTMLElement} form
     * @returns {Matching}
     */
    forInput (input, form) {
        this.setActiveElementStrings(input, form)
        return this
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
    const attr = input?.getAttribute(ATTR_INPUT_TYPE)
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
    case 'creditCards':
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

/** @typedef {`identities.${SupportedIdentitiesSubTypes}` | `creditCards.${SupportedCreditCardSubTypes}` | `credentials.${SupportedCredentialsSubTypes}` | 'unknown'} SupportedTypes */
const supportedTypes = [
    ...supportedIdentitiesSubtypes.map((type) => `identities.${type}`),
    ...supportedCreditCardSubtypes.map((type) => `creditCards.${type}`),
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
 * @param {string | null} string
 * @return {string}
 */
const removeExcessWhitespace = (string = '') => {
    return (string || '')
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ').trim()
}

/**
 * Get text from all explicit labels
 * @param {HTMLInputElement|HTMLSelectElement} el
 * @return {string}
 */
const getExplicitLabelsText = (el) => {
    const labelTextCandidates = []
    for (let label of el.labels || []) {
        labelTextCandidates.push(...extractElementStrings(label))
    }
    if (el.hasAttribute('aria-label')) {
        labelTextCandidates.push(removeExcessWhitespace(el.getAttribute('aria-label')))
    }

    // Try to access another element if it was marked as the label for this input/select
    const ariaLabelAttr = removeExcessWhitespace(el.getAttribute('aria-labelled') || el.getAttribute('aria-labelledby'))

    if (ariaLabelAttr) {
        const labelledByElement = document.getElementById(ariaLabelAttr)
        if (labelledByElement) {
            labelTextCandidates.push(...extractElementStrings(labelledByElement))
        }
    }

    // Labels with long text are likely to be noisy and lead to false positives
    const filteredLabels = labelTextCandidates.filter((string) => string.length < 65)

    if (filteredLabels.length > 0) {
        return filteredLabels.join(' ')
    }

    return ''
}

/**
 * Tries to get a relevant previous Element sibling, excluding certain tags
 * @param {Element} el
 * @returns {Element|null}
 */
const recursiveGetPreviousElSibling = (el) => {
    const previousEl = el.previousElementSibling
    if (!previousEl) return null

    // Skip elements with no childNodes
    if (EXCLUDED_TAGS.includes(previousEl.tagName)) {
        return recursiveGetPreviousElSibling(previousEl)
    }
    return previousEl
}

/**
 * Get all text close to the input (useful when no labels are defined)
 * @param {HTMLInputElement|HTMLSelectElement} el
 * @param {HTMLElement} form
 * @param {string} cssSelector
 * @return {string}
 */
const getRelatedText = (el, form, cssSelector) => {
    let scope = getLargestMeaningfulContainer(el, form, cssSelector)

    // If we didn't find a container, try looking for an adjacent label
    if (scope === el) {
        let previousEl = recursiveGetPreviousElSibling(el)
        if (previousEl instanceof HTMLElement) {
            scope = previousEl
        }
        // If there is still no meaningful container return empty string
        if (scope === el || scope instanceof HTMLSelectElement) {
            if (el.previousSibling instanceof Text) {
                return removeExcessWhitespace(el.previousSibling.textContent)
            }
            return ''
        }
    }

    // If there is still no meaningful container return empty string
    if (scope === el || scope instanceof HTMLSelectElement) {
        if (el.previousSibling instanceof Text) {
            return removeExcessWhitespace(el.previousSibling.textContent)
        }
        return ''
    }

    let trimmedText = ''
    const label = scope.querySelector('label')
    if (label) {
        // Try searching for a label first
        trimmedText = getTextShallow(label)
    } else {
        // If the container has a select element, remove its contents to avoid noise
        trimmedText = extractElementStrings(scope).join(' ')
    }

    // If the text is longer than n chars it's too noisy and likely to yield false positives, so return ''
    if (trimmedText.length < TEXT_LENGTH_CUTOFF) return trimmedText

    return ''
}

/**
 * Find a container for the input field that won't contain other inputs (useful to get elements related to the field)
 * @param {HTMLElement} el
 * @param {HTMLElement} form
 * @param {string} cssSelector
 * @return {HTMLElement}
 */
const getLargestMeaningfulContainer = (el, form, cssSelector) => {
    /* TODO: there could be more than one select el for the same label, in that case we should
        change how we compute the container */
    const parentElement = el.parentElement
    if (!parentElement || el === form || !cssSelector) return el

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
 * @param {HTMLElement} form
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
 * @param {HTMLElement} form
 * @param {string} cssSelector
 * @returns {boolean}
 */
const checkPlaceholderAndLabels = (input, regex, form, cssSelector) => {
    return !!matchInPlaceholderAndLabels(input, regex, form, cssSelector)
}

/**
 * Returns a RegExp from a string
 * @param {string} string
 * @returns {RegExp | undefined} string
 */
const safeRegex = (string) => {
    try {
        const input = String(string).normalize('NFKC')
        return new RegExp(input, 'ui')
    } catch (e) {
        console.warn('Could not generate regex from string input', string)
        return undefined
    }
}

/**
 * Factory for instances of Matching
 *
 * @return {Matching}
 */
function createMatching () {
    return new Matching(matchingConfiguration)
}

export {
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
    Matching,
    createMatching
}
