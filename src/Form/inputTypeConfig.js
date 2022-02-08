const {isDDGApp, isApp} = require('../autofill-utils')
const {daxBase64} = require('./logo-svg')
const ddgPasswordIcons = require('../UI/img/ddgPasswordIcon')
const {getInputMainType, getInputSubtype} = require('./matching')
const {getCountryDisplayName} = require('./formatters')

// In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here
const isFirefox = navigator.userAgent.includes('Firefox')
const getDaxImg = isDDGApp || isFirefox ? daxBase64 : chrome.runtime.getURL('img/logo-small.svg')

/**
 * Get the icon for the identities (currently only Dax for emails)
 * @param {HTMLInputElement} input
 * @param device
 * @return {string}
 */
const getIdentitiesIcon = (input, {device}) => {
    const subtype = getInputSubtype(input)
    if (subtype === 'emailAddress' && device.isDeviceSignedIn()) return getDaxImg

    return ''
}

/**
 * A map of config objects. These help by centralising here some complexity
 * @type {InputTypeConfig}
 */
const inputTypeConfig = {
    /** @type {CredentialsInputTypeConfig} */
    credentials: {
        type: 'credentials',
        getIconBase: () => ddgPasswordIcons.ddgPasswordIconBase,
        getIconFilled: () => ddgPasswordIcons.ddgPasswordIconFilled,
        shouldDecorate: (_input, {isLogin, device}) => isLogin && device.hasLocalCredentials,
        dataType: 'Credentials',
        displayTitlePropName: (_input, data) => data.username,
        displaySubtitlePropName: '•••••••••••••••',
        autofillMethod: 'getAutofillCredentials'
    },
    /** @type {CreditCardInputTypeConfig} */
    creditCard: {
        type: 'creditCard',
        getIconBase: () => '',
        getIconFilled: () => '',
        shouldDecorate: (_input, {device}) => device.hasLocalCreditCards,
        dataType: 'CreditCards',
        displayTitlePropName: (_input, data) => data.title,
        displaySubtitlePropName: 'displayNumber',
        autofillMethod: 'getAutofillCreditCard'
    },
    /** @type {IdentitiesInputTypeConfig} */
    identities: {
        type: 'identities',
        getIconBase: getIdentitiesIcon,
        getIconFilled: getIdentitiesIcon,
        shouldDecorate: (input, {device}) => {
            const subtype = getInputSubtype(input)

            if (isApp) {
                return device.getLocalIdentities()?.some((identity) => !!identity[subtype])
            }

            if (subtype === 'emailAddress') {
                return device.isDeviceSignedIn()
            }

            return false
        },
        dataType: 'Identities',
        displayTitlePropName: (input, data) => {
            const subtype = getInputSubtype(input)
            if (subtype === 'addressCountryCode') {
                return getCountryDisplayName('en', data.addressCountryCode)
            }
            return data[subtype]
        },
        displaySubtitlePropName: 'title',
        autofillMethod: 'getAutofillIdentity'
    },
    /** @type {UnknownInputTypeConfig} */
    unknown: {
        type: 'unknown',
        getIconBase: () => '',
        getIconFilled: () => '',
        shouldDecorate: () => false,
        dataType: '',
        displayTitlePropName: () => 'unknown',
        displaySubtitlePropName: '',
        autofillMethod: ''
    }
}

/**
 * Retrieves configs from an input el
 * @param {HTMLInputElement} input
 * @returns {InputTypeConfigs}
 */
const getInputConfig = (input) => {
    const inputType = getInputMainType(input)
    return inputTypeConfig[inputType || 'unknown']
}

module.exports = getInputConfig
