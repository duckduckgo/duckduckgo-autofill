const {isDDGApp} = require('../autofill-utils')
const {daxBase64} = require('./logo-svg')
const ddgPasswordIcons = require('../UI/img/ddgPasswordIcon')

// In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here
const isFirefox = navigator.userAgent.includes('Firefox')
const getDaxImg = isDDGApp || isFirefox ? daxBase64 : chrome.runtime.getURL('img/logo-small.svg')

/** @typedef {'email' | 'password' | 'cc'} SupportedTypes */

/** @typedef {{
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
    email: {
        getIconBase: (isLogin) => isLogin ? ddgPasswordIcons.ddgPasswordIconBase : getDaxImg,
        getIconFilled: (isLogin) => isLogin ? ddgPasswordIcons.ddgPasswordIconFilled : getDaxImg,
        shouldDecorate: (isLogin, device) => isLogin ? device.hasLocalCredentials : device.hasLocalAddresses
    },
    password: {
        getIconBase: () => ddgPasswordIcons.ddgPasswordIconBase,
        getIconFilled: () => ddgPasswordIcons.ddgPasswordIconFilled,
        shouldDecorate: (isLogin, device) => isLogin && device.hasLocalCredentials
    },
    cc: {
        getIconBase: () => ddgPasswordIcons.ddgCcIconBase,
        getIconFilled: () => ddgPasswordIcons.ddgCcIconFilled,
        shouldDecorate: (isLogin, device) => device.hasCreditCards
    }
}

module.exports = inputTypeConfig
