const {isDDGApp} = require('../autofill-utils')
const {daxBase64} = require('./logo-svg')
const ddgPasswordIcons = require('../UI/img/ddgPasswordIcon')
const {getInputMainType} = require('./input-classifiers')

// In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here
const isFirefox = navigator.userAgent.includes('Firefox')
const getDaxImg = isDDGApp || isFirefox ? daxBase64 : chrome.runtime.getURL('img/logo-small.svg')

/** @typedef {
 *    'emailNew' |
 *    'emailLogin' |
 *    'username' |
 *    'password' |
 *    'creditCard' |
 *    'unknown'
 *  } SupportedTypes */

/** @typedef {{
 *    type: SupportedTypes,
 *    getIconFilled: () => string,
 *    getIconBase: () => string,
 *    shouldDecorate: (function(boolean, InterfacePrototype): boolean),
 *    dataType: 'Addresses' | 'Credentials' | 'CreditCards' | 'Identities',
 *    displayTitlePropName: string,
 *    displaySubtitlePropName: string,
 *  }} InputTypeConfig
 */

/**
 * A map of config objects. These help by centralising here some of the complexity
 * @type {Object.<SupportedTypes, InputTypeConfig>}
 */
const inputTypeConfig = {
    emailNew: {
        type: 'emailNew',
        getIconBase: () => getDaxImg,
        getIconFilled: () => getDaxImg,
        shouldDecorate: (isLogin, device) => device.hasLocalAddresses,
        dataType: 'Addresses'
    },
    credentials: {
        type: 'credentials',
        getIconBase: () => ddgPasswordIcons.ddgPasswordIconBase,
        getIconFilled: () => ddgPasswordIcons.ddgPasswordIconFilled,
        shouldDecorate: (isLogin, device) => isLogin && device.hasLocalCredentials,
        dataType: 'Credentials',
        displayTitlePropName: 'username',
        displaySubtitlePropName: '•••••••••••••••',
        autofillMethod: 'getAutofillCredentials'
    },
    creditCard: {
        type: 'creditCard',
        getIconBase: () => ddgPasswordIcons.ddgCcIconBase,
        getIconFilled: () => ddgPasswordIcons.ddgCcIconFilled,
        shouldDecorate: (isLogin, device) => device.hasLocalCreditCards,
        dataType: 'CreditCards',
        displayTitlePropName: 'title',
        displaySubtitlePropName: 'displayNumber',
        autofillMethod: 'getAutofillCreditCard'
    },
    unknown: {
        type: 'unknown',
        getIconBase: () => '',
        getIconFilled: () => '',
        shouldDecorate: () => false,
        dataType: ''
    }
}

/**
 * Retrieves configs from an input el
 * @param {HTMLInputElement} input
 * @returns {InputTypeConfig}
 */
const getInputConfig = (input) => {
    const inputType = getInputMainType(input)
    return inputTypeConfig[inputType || 'unknown']
}

module.exports = getInputConfig
