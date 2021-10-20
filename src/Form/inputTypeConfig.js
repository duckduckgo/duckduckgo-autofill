const {isDDGApp} = require('../autofill-utils')
const {daxBase64} = require('./logo-svg')
const ddgPasswordIcons = require('../UI/img/ddgPasswordIcon')
const {ATTR_INPUT_TYPE} = require('../constants')

// In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here
const isFirefox = navigator.userAgent.includes('Firefox')
const getDaxImg = isDDGApp || isFirefox ? daxBase64 : chrome.runtime.getURL('img/logo-small.svg')

/** @typedef {
 *    'emailNew' |
 *    'emailLogin' |
 *    'username' |
 *    'password' |
 *    'cc' |
 *    'unknown'
 *  } SupportedTypes */

/** @typedef {{
 *    type: SupportedTypes,
 *    getIconFilled: () => string,
 *    getIconBase: () => string,
 *    shouldDecorate: (function(boolean, InterfacePrototype): boolean)
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
        shouldDecorate: (isLogin, device) => device.hasLocalAddresses
    },
    emailLogin: {
        type: 'emailLogin',
        getIconBase: () => ddgPasswordIcons.ddgPasswordIconBase,
        getIconFilled: () => ddgPasswordIcons.ddgPasswordIconFilled,
        shouldDecorate: (isLogin, device) => device.hasLocalCredentials
    },
    username: {
        type: 'username',
        getIconBase: () => ddgPasswordIcons.ddgPasswordIconBase,
        getIconFilled: () => ddgPasswordIcons.ddgPasswordIconFilled,
        shouldDecorate: (isLogin, device) => isLogin && device.hasLocalCredentials
    },
    password: {
        type: 'password',
        getIconBase: () => ddgPasswordIcons.ddgPasswordIconBase,
        getIconFilled: () => ddgPasswordIcons.ddgPasswordIconFilled,
        shouldDecorate: (isLogin, device) => isLogin && device.hasLocalCredentials
    },
    cc: {
        type: 'cc',
        getIconBase: () => ddgPasswordIcons.ddgCcIconBase,
        getIconFilled: () => ddgPasswordIcons.ddgCcIconFilled,
        shouldDecorate: (isLogin, device) => device.hasCreditCards
    },
    unknown: {
        type: 'unknown',
        getIconBase: () => '',
        getIconFilled: () => '',
        shouldDecorate: () => false
    }
}

/**
 * Retrieves configs from an input el
 * @param {HTMLInputElement} input
 * @param {SupportedTypes} [initialType='unknown'] - pass if input hasn't been decorated yet
 * @returns {InputTypeConfig}
 */
const getInputConfig = (input, initialType = 'unknown') => {
    const inputType = input.getAttribute(ATTR_INPUT_TYPE)
    return inputTypeConfig[inputType || initialType]
}

module.exports = getInputConfig
