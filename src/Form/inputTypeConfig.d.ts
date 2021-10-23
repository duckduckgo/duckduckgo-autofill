type SupportedTypes =
    'emailNew' |
    'emailLogin' |
    'username' |
    'password' |
    'creditCard' |
    'unknown'

interface InputTypeConfig {
    type: SupportedTypes,
    getIconFilled: () => string,
    getIconBase: () => string,
    shouldDecorate: (boolean, InterfacePrototype) => boolean,
    dataType: 'Addresses' | 'Credentials' | 'CreditCards' | 'Identities',
    displayTitlePropName: string,
    displaySubtitlePropName: string,
}
