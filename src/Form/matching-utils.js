import {shouldLog} from '../autofill-utils.js'
import {getExplicitLabelsText} from './matching.js'

/**
 * Logs out matching details when debug flag is active
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @param {MatchingResult} matchingResult
 */
function logMatching (el, matchingResult) {
    if (!shouldLog()) return

    const fieldIdentifier = getInputIdentifier(el)

    console.group(fieldIdentifier)
    console.log(el)

    const {strategyName, matchedString, matchedFrom, matcherType} = matchingResult

    const verb = getVerb(matchingResult)

    let stringToLog = `${verb} for "${matcherType}" with "${strategyName}"`

    if (matchedString && matchedFrom) {
        stringToLog += `\nString: "${matchedString}"\nSource: "${matchedFrom}"`
    }

    console.log(stringToLog)
    console.groupEnd()
}

/**
 * Helper to form the correct string based on matching result type
 * @param {MatchingResult} matchingResult
 * @return {string}
 */
function getVerb (matchingResult) {
    if (matchingResult.matched) return 'Matched'

    if (matchingResult.proceed === false) return 'Matched forceUnknown'

    if (matchingResult.skip) return 'Skipped'

    return ''
}

/**
 * Returns a human-friendly name to identify a single input field
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @returns {string}
 */
function getInputIdentifier (el) {
    const label = getExplicitLabelsText(el)
    const placeholder = el instanceof HTMLInputElement && el.placeholder ? `${el.placeholder}` : ''
    const name = el.name ? `${el.name}` : ''
    const id = el.id ? `#${el.id}` : ''

    return 'Field: ' + (label || placeholder || name || id)
}

/**
 * Logs info when a field was not matched by the algo
 * @param el
 * @param allStrings
 */
function logUnmatched (el, allStrings) {
    if (!shouldLog()) return

    const fieldIdentifier = getInputIdentifier(el)

    console.group(fieldIdentifier)
    console.log(el)

    const stringToLog = 'Field not matched.'

    console.log(stringToLog, allStrings)
    console.groupEnd()
}

export {logMatching, logUnmatched}
