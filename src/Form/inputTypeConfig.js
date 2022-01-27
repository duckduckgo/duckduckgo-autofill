const {isDDGApp, isMobileApp} = require('../autofill-utils')
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
    if (subtype === 'emailAddress' && device.hasLocalAddresses) return getDaxImg

    return ''
}

/**
 * A map of config objects. These help by centralising here some complexity
 * TODO: We're removing emailNew everywhere. The new thing is identities.emailAddress. We still have to backport this properly to other platforms.
 * @type {Record<SupportedMainTypes & {'emailNew': InputTypeConfig}, InputTypeConfig>}
 */
const inputTypeConfig = {
    emailNew: {
        type: 'emailNew',
        getIconBase: () => getDaxImg,
        getIconFilled: () => getDaxImg,
        shouldDecorate: (_input, {device}) => {
            if (isMobileApp) return device.isDeviceSignedIn()

            return device.hasLocalAddresses
        },
        dataType: 'Addresses',
        displayTitlePropName: () => '',
        displaySubtitlePropName: '',
        autofillMethod: ''
    },
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
    identities: {
        type: 'identities',
        getIconBase: getIdentitiesIcon,
        getIconFilled: getIdentitiesIcon,
        shouldDecorate: (input, {device}) => {
            const subtype = getInputSubtype(input)
            return device.getLocalIdentities()?.some((identity) => !!identity[subtype])
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
 * @returns {InputTypeConfig}
 */
const getInputConfig = (input) => {
    const inputType = getInputMainType(input)
    return inputTypeConfig[inputType || 'unknown']
}

module.exports = getInputConfig
