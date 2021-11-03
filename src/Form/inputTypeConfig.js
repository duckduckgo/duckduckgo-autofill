const {isDDGApp} = require('../autofill-utils')
const {daxBase64} = require('./logo-svg')
const ddgPasswordIcons = require('../UI/img/ddgPasswordIcon')
const {getInputMainType} = require('./input-classifiers')

// In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here
const isFirefox = navigator.userAgent.includes('Firefox')
const getDaxImg = isDDGApp || isFirefox ? daxBase64 : chrome.runtime.getURL('img/logo-small.svg')

/**
 * A map of config objects. These help by centralising here some of the complexity
 * @type {Object<SupportedMainTypes, InputTypeConfig>}
 */
const inputTypeConfig = {
    emailNew: {
        type: 'emailNew',
        getIconBase: () => getDaxImg,
        getIconFilled: () => getDaxImg,
        shouldDecorate: (isLogin, device) => device.hasLocalAddresses,
        dataType: 'Addresses',
        displayTitlePropName: '',
        displaySubtitlePropName: '',
        autofillMethod: ''
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
        getIconBase: () => '',
        getIconFilled: () => '',
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
        dataType: '',
        displayTitlePropName: '',
        displaySubtitlePropName: '',
        autofillMethod: ''
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
