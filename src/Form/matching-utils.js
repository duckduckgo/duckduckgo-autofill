import {shouldLog} from '../autofill-utils.js'
import {getExplicitLabelsText} from "./matching";

/**
 * Logs out matching details when debug flag is active
 * @param {HTMLElement} el
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

function getInputIdentifier (el) {
    const label = getExplicitLabelsText(el)
    const placeholder = el.placeholder ? `: ${el.placeholder}` : ''
    const name = el.name ? `${el.name}` : ''
    const id = el.id ? `#${el.id}` : ''


    return 'Field: ' + (label || placeholder || name || id)
}

export {logMatching}
