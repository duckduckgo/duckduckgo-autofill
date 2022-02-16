const {matchInPlaceholderAndLabels, checkPlaceholderAndLabels} = require('./matching')
const COUNTRY_NAMES = require('./countryNames')

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
        return COUNTRY_NAMES[addressCountryCode] || addressCountryCode
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

module.exports = {
    formatCCYear,
    getUnifiedExpiryDate,
    formatFullName,
    getCountryDisplayName,
    getCountryName
}
