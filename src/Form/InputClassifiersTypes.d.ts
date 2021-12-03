interface Matcher {
    type: string,
    selector: string,
    matcherFn: (string) => boolean
}

type SupportedMainTypes =
    | 'emailNew'
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
}
