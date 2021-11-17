interface Matcher {
    type: string,
    selector: string,
    regex: RegExp,
    negativeRegex?: RegExp
}

type SupportedMainTypes =
    | 'emailNew'
    | 'credentials'
    | 'creditCard'
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
    getIconFilled: () => string,
    getIconBase: () => string,
    shouldDecorate: (boolean, InterfacePrototype) => boolean,
    dataType: 'Addresses' | 'Credentials' | 'CreditCards' | 'Identities' | '',
    displayTitlePropName: string,
    displaySubtitlePropName: string,
}
