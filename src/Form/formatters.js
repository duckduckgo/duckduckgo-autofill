const {matchInPlaceholderAndLabels, checkPlaceholderAndLabels} = require('./matching')
const {COUNTRY_CODES_TO_NAMES, COUNTRY_NAMES_TO_CODES} = require('./countryNames')

// Matches strings like mm/yy, mm-yyyy, mm-aa
const DATE_SEPARATOR_REGEX = /\w\w\s?(?<separator>[/\s.\-_—–])\s?\w\w/i
// Matches 4 non-digit repeated characters (YYYY or AAAA) or 4 digits (2022)
const FOUR_DIGIT_YEAR_REGEX = /(\D)\1{3}|\d{4}/i

/**
 * Format the cc year to best adapt to the input requirements (YY vs YYYY)
 * @param {HTMLInputElement} input
 * @param {number} year
 * @param {import("./Form").Form} form
 * @returns {number}
 */
const formatCCYear = (input, year, form) => {
    const selector = form.matching.cssSelector('FORM_INPUTS_SELECTOR')
    if (
        input.maxLength === 4 ||
        checkPlaceholderAndLabels(input, FOUR_DIGIT_YEAR_REGEX, form.form, selector)
    ) return year

    return year - 2000
}

/**
 * Get a unified expiry date with separator
 * @param {HTMLInputElement} input
 * @param {number} month
 * @param {number} year
 * @param {import("./Form").Form} form
 * @returns {string}
 */
const getUnifiedExpiryDate = (input, month, year, form) => {
    const formattedYear = formatCCYear(input, year, form)
    const paddedMonth = `${month}`.padStart(2, '0')
    const cssSelector = form.matching.cssSelector('FORM_INPUTS_SELECTOR')
    const separator = matchInPlaceholderAndLabels(input, DATE_SEPARATOR_REGEX, form.form, cssSelector)?.groups?.separator || '/'

    return `${paddedMonth}${separator}${formattedYear}`
}

const formatFullName = ({firstName = '', middleName = '', lastName = ''}) =>
    `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim()

/**
 * Tries to look up a human-readable country name from the country code
 * @param {string} locale
 * @param {string} addressCountryCode
 * @return {string} - Returns the country code if we can't find a name
 */
const getCountryDisplayName = (locale, addressCountryCode) => {
    try {
        const regionNames = new Intl.DisplayNames([locale], { type: 'region' })
        return regionNames.of(addressCountryCode)
    } catch (e) {
        return COUNTRY_CODES_TO_NAMES[addressCountryCode] || addressCountryCode
    }
}

/**
 * Tries to infer the element locale or returns 'en'
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @return {string | 'en'}
 */
const inferElementLocale = (el) =>
    el.lang || el.form?.lang || document.body.lang || document.documentElement.lang || 'en'

/**
 * Tries to format the country code into a localised country name
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @param {{addressCountryCode?: string}} options
 */
const getCountryName = (el, options = {}) => {
    const {addressCountryCode} = options
    if (!addressCountryCode) return ''

    // Try to infer the field language or fallback to en
    const elLocale = inferElementLocale(el)
    const localisedCountryName = getCountryDisplayName(elLocale, addressCountryCode)

    // If it's a select el we try to find a suitable match to autofill
    if (el.nodeName === 'SELECT') {
        const englishCountryName = getCountryDisplayName('en', addressCountryCode)
        // This regex matches both the localised and English country names
        const countryNameRegex = new RegExp(String.raw`${
            localisedCountryName.replaceAll(' ', '.?')
        }|${
            englishCountryName.replaceAll(' ', '.?')
        }`, 'i')
        const countryCodeRegex = new RegExp(String.raw`\b${addressCountryCode}\b`, 'i')

        // We check the country code first because it's more accurate
        if (el instanceof HTMLSelectElement) {
            for (const option of el.options) {
                if (countryCodeRegex.test(option.value)) {
                    return option.value
                }
            }

            for (const option of el.options) {
                if (
                    countryNameRegex.test(option.value) ||
                    countryNameRegex.test(option.innerText)
                ) return option.value
            }
        }
    }

    return localisedCountryName
}

/**
 * Try to get a map of localised country names to code, or falls back to the English map
 * @param {HTMLInputElement | HTMLSelectElement} el
 */
const getLocalisedCountryNamesToCodes = (el) => {
    if (typeof Intl.DisplayNames !== 'function') return COUNTRY_NAMES_TO_CODES

    // Try to infer the field language or fallback to en
    const elLocale = inferElementLocale(el)

    return Object.fromEntries(
        Object.entries(COUNTRY_CODES_TO_NAMES)
            .map(([code]) => [getCountryDisplayName(elLocale, code), code])
    )
}

/**
 * Try to infer a country code from an element we identified as identities.addressCountryCode
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @return {string}
 */
const inferCountryCodeFromElement = (el) => {
    if (COUNTRY_CODES_TO_NAMES[el.value]) return el.value
    if (COUNTRY_NAMES_TO_CODES[el.value]) return COUNTRY_NAMES_TO_CODES[el.value]

    const localisedCountryNamesToCodes = getLocalisedCountryNamesToCodes(el)
    if (localisedCountryNamesToCodes[el.value]) return localisedCountryNamesToCodes[el.value]

    if (el instanceof HTMLSelectElement) {
        const selectedText = el.selectedOptions[0].text
        if (COUNTRY_CODES_TO_NAMES[selectedText]) return selectedText
        if (COUNTRY_NAMES_TO_CODES[selectedText]) return localisedCountryNamesToCodes[selectedText]
        if (localisedCountryNamesToCodes[selectedText]) return localisedCountryNamesToCodes[selectedText]
    }
    return ''
}

/** @param {InternalDataStorageObject} credentials */
const shouldStoreCredentials = ({credentials}) =>
    credentials.password

/** @param {InternalDataStorageObject} credentials */
const shouldStoreIdentities = ({identities}) =>
    (identities.firstName || identities.fullName) && identities.addressStreet && identities.addressCity

/** @param {InternalDataStorageObject} credentials */
const shouldStoreCreditCards = ({creditCards}) =>
    creditCards.cardNumber && creditCards.cardSecurityCode

/**
 * Formats form data into an object to send to the device for storage
 * @param {InternalDataStorageObject} formValues
 * @return {DataStorageObject}
 */
const prepareFormValuesForStorage = (formValues) => {
    let {credentials, identities, creditCards} = formValues

    /** Fixes for credentials **/
    // Don't store if there isn't enough data
    if (shouldStoreCredentials(formValues)) {
        // If we don't have a username to match a password, let's see if the email is available
        if (credentials.password && !credentials.username && identities.emailAddress) {
            credentials.username = identities.emailAddress
        }
    } else {
        // @ts-ignore
        credentials = null
    }

    /** Fixes for identities **/
    // Don't store if there isn't enough data
    if (shouldStoreIdentities(formValues)) {
        if (identities.fullName) {
            // If the fullname can be easily split into two, we'll store it as first and last
            const nameParts = identities.fullName.trim().split(/\s+/)
            if (nameParts.length === 2) {
                identities.firstName = nameParts[0]
                identities.lastName = nameParts[1]
            } else {
                // If we can't split it, just store it as first name
                identities.firstName = identities.fullName
            }
            delete identities.fullName
        }
    } else {
        // @ts-ignore
        identities = null
    }

    /** Fixes for credit cards **/
    // Don't store if there isn't enough data
    if (shouldStoreCreditCards(formValues)) {
        if (creditCards.expiration) {
            const [expirationMonth, expirationYear] = creditCards.expiration.split(/\D/)
            creditCards.expirationMonth = expirationMonth
            creditCards.expirationYear = expirationYear
            delete creditCards.expiration
        }
        if (Number(creditCards.expirationYear) <= 2020) {
            creditCards.expirationYear = `${Number(creditCards.expirationYear) + 2000}`
        }
        if (creditCards.cardNumber) {
            creditCards.cardNumber = creditCards.cardNumber.replaceAll(/\D/g, '')
        }
    } else {
        // @ts-ignore
        creditCards = null
    }

    return {credentials, identities, creditCards}
}

module.exports = {
    formatCCYear,
    getUnifiedExpiryDate,
    formatFullName,
    getCountryDisplayName,
    getCountryName,
    inferCountryCodeFromElement,
    prepareFormValuesForStorage
}
