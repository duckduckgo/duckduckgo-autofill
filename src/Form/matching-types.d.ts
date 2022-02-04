interface MatchingConfiguration {
    matchers: MatcherConfiguration
    strategies: {
        cssSelector: CssSelectorConfiguration
        ddgMatcher: DDGMatcherConfiguration
        vendorRegex: VendorRegexConfiguration
    }
}

type StrategyNames = keyof MatchingConfiguration['strategies'];

interface Matcher {
    type: MatcherTypeNames
    strategies: {
        cssSelector?: string
        ddgMatcher?: string
        vendorRegex?: string
    }
}

interface MatcherLists {
    email: Matcher[]
    password: Matcher[]
    username: Matcher[]
    cc: Matcher[]
    id: Matcher[]
}

interface MatcherConfiguration {
    fields: Record<MatcherTypeNames | string, Matcher>,
    lists: Record<string, string[]>
}

type MatcherTypeNames =
  | 'email'
  | 'password'
  | 'username'
  | 'cardName'
  | 'cardNumber'
  | 'cardSecurityCode'
  | 'expirationMonth'
  | 'expirationYear'
  | 'expiration'
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'fullName'
  | 'phone'
  | 'addressStreet'
  | 'addressStreet2'
  | 'addressCity'
  | 'addressProvince'
  | 'addressPostalCode'
  | 'addressCountryCode'
  | 'birthdayDay'
  | 'birthdayMonth'
  | 'birthdayYear'

type Strategy =
  | CSSSelectorStrategy
  | VendorRegexStrategy
  | DDGMatcherStrategy

interface CSSSelectorStrategy {
    kind: 'cssSelector'
    selectorName: keyof RequiredCssSelectors | string
}

interface VendorRegexStrategy {
    kind: 'vendorRegex'
    regexName: keyof VendorRegexRules | string;
}

interface DDGMatcherStrategy {
    kind: 'ddgMatcher'
    matcherName: MatcherTypeNames | string
}

type MatchableStrings =
    | "nameAttr"
    | "labelText"
    | "placeholderAttr"
    | "relatedText"

type MatchingResult = {
    matched: boolean
    proceed?: boolean
}

type SupportedMainTypes =
    | 'credentials'
    | 'creditCard'
    | 'identities'
    | 'unknown'

type SupportedSubTypes =
    | SupportedMainTypes
    | 'credentials.username'
    | 'credentials.password'
    | 'creditCards.cardName'
    | 'creditCards.cardNumber'
    | 'creditCards.cardSecurityCode'
    | 'creditCards.expirationMonth'
    | 'creditCards.expirationYear'
    | 'creditCards.expiration'

interface InputTypeConfig {
    type: SupportedMainTypes,
    getIconFilled: (input: HTMLInputElement, form: Form) => string,
    getIconBase: (input: HTMLInputElement, form: Form) => string,
    shouldDecorate: (input: HTMLInputElement, form: Form) => boolean,
    dataType: 'Addresses' | 'Credentials' | 'CreditCards' | 'Identities' | '',
    displayTitlePropName: (
        input: HTMLInputElement,
        data: CredentialsObject | IdentityObject | CreditCardObject
    ) => string,
    displaySubtitlePropName: string,
    autofillMethod: string // more specific here?
}

interface CssSelectorConfiguration {
    selectors: RequiredCssSelectors | Record<MatcherTypeNames | string, string>
}

interface VendorRegexConfiguration {
    rules: Record<string, null>
    ruleSets: Record<string, string>[]
}

interface DDGMatcherConfiguration {
    matchers: Record<MatcherTypeNames | string, DDGMatcher>
}

interface DDGMatcher {
    match?: string;
    not?: string
    matchableStrings?: MatchableStrings[]
    skipStrings?: MatchableStrings[]
    maxDigits?: number
}

type RequiredCssSelectors = {
    FORM_INPUTS_SELECTOR: string
    SUBMIT_BUTTON_SELECTOR: string
    GENERIC_TEXT_FIELD: string
}

/**
 * This is just here to describe the current vendor regexes
 */
interface VendorRegexRules {
    email: RegExp,
    tel: RegExp,
    organization: RegExp,
    'street-address': RegExp,
    'address-line1': RegExp,
    'address-line2': RegExp,
    'address-line3': RegExp,
    'address-level2': RegExp,
    'address-level1': RegExp,
    'postal-code': RegExp,
    country: RegExp,
    // Note: RegExp place the `cc-name` field for Credit Card first, because
    // it is more specific than the `name` field below and we want to check
    // for it before we catch the more generic one.
    'cc-name': RegExp,
    name: RegExp,
    'given-name': RegExp,
    'additional-name': RegExp,
    'family-name': RegExp,
    'cc-number': RegExp,
    'cc-exp-month': RegExp,
    'cc-exp-year': RegExp,
    'cc-exp': RegExp,
    'cc-type': RegExp
}
