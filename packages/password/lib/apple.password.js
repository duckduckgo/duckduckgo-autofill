/*
 *
 * NOTE:
 *
 * This file was created with inspiration from https://developer.apple.com/password-rules
 *
 * * The changes made by DuckDuckGo employees are:
 *
 * 1) removed all logic relating to 'more typeable passwords'
 * 2) reduced the number of password styles from 4 to only the 1 which suits our needs
 * 2) added JSDoc comments (for Typescript checking)
 *
 */
const {
    parsePasswordRules,
    RuleName,
    CustomCharacterClass,
    NamedCharacterClass,
    Identifier,
    SHOULD_NOT_BE_REACHED
} = require('./rules-parser')
// eslint-disable-next-line no-unused-vars
const {Rule} = require('./rules-parser')
const {constants} = require('./constants')

const defaultUnambiguousCharacters = 'abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789'
const defaultNumberOfCharactersForClassicPassword = constants.MIN_LENGTH
const defaultClassicPasswordLength = constants.MIN_LENGTH
const SCAN_SET_ORDER = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-~!@#$%^&*_+=`|(){}[:;\\\"'<>,.?/ ]"

/**
 * @typedef {{
 *     PasswordAllowedCharacters?: string,
 *     PasswordRequiredCharacters?: string[],
 *     PasswordRepeatedCharacterLimit?: number,
 *     PasswordConsecutiveCharacterLimit?: number,
 *     PasswordMinLength?: number,
 *     PasswordMaxLength?: number,
 * }} Requirements
 */

/**
 * @typedef {{
 *     NumberOfRequiredRandomCharacters: number,
 *     PasswordAllowedCharacters: string,
 *     RequiredCharacterSets: string[]
 * }} PasswordParameters
 */

/**
 * @param {string} inputString
 * @throws {ParserError|Error}
 * @returns {string}
 */
function generatePasswordFromInput (inputString) {
    const passwordRules = parsePasswordRules(inputString)
    const quirks = _requirementsFromRules(passwordRules)
    const password = _generatedPasswordMatchingRequirements(quirks)
    /**
     * The following is unreachable because if user input was incorrect then
     * the parsing phase would throw. The following lines is to satisfy Typescript
     */
    if (password === '') throw new Error('unreachable')
    return password
}

/**
 * @param {Rule[]} passwordRules
 * @returns {Requirements | null}
 */
function _requirementsFromRules (passwordRules) {
    /** @type {Requirements} */
    const requirements = {}
    for (let rule of passwordRules) {
        if (rule.name === RuleName.ALLOWED) {
            console.assert(!('PasswordAllowedCharacters' in requirements))
            let scanSet = _canonicalizedScanSetFromCharacters(_charactersFromCharactersClasses(rule.value))
            if (scanSet) {
                requirements.PasswordAllowedCharacters = scanSet
            }
        } else if (rule.name === RuleName.MAX_CONSECUTIVE) {
            console.assert(!('PasswordRepeatedCharacterLimit' in requirements))
            requirements.PasswordRepeatedCharacterLimit = rule.value
        } else if (rule.name === RuleName.REQUIRED) {
            let requiredCharacters = requirements.PasswordRequiredCharacters
            if (!requiredCharacters) {
                requiredCharacters = requirements.PasswordRequiredCharacters = []
            }
            requiredCharacters.push(_canonicalizedScanSetFromCharacters(_charactersFromCharactersClasses(rule.value)))
        } else if (rule.name === RuleName.MIN_LENGTH) {
            requirements.PasswordMinLength = rule.value
        } else if (rule.name === RuleName.MAX_LENGTH) {
            requirements.PasswordMaxLength = rule.value
        }
    }

    // Only include an allowed rule matching SCAN_SET_ORDER (all characters) when a required rule is also present.
    if (requirements.PasswordAllowedCharacters === SCAN_SET_ORDER && !requirements.PasswordRequiredCharacters) {
        delete requirements.PasswordAllowedCharacters
    }

    // Fix up PasswordRequiredCharacters, if needed.
    if (requirements.PasswordRequiredCharacters && requirements.PasswordRequiredCharacters.length === 1 && requirements.PasswordRequiredCharacters[0] === SCAN_SET_ORDER) {
        delete requirements.PasswordRequiredCharacters
    }

    return Object.keys(requirements).length ? requirements : null
}

/**
 * @param {number} range
 * @returns {number}
 */
function _randomNumberWithUniformDistribution (range) {
    // Based on the algorithm described in https://pthree.org/2018/06/13/why-the-multiply-and-floor-rng-method-is-biased/
    const max = Math.floor(2 ** 32 / range) * range
    do {
        var x = window.crypto.getRandomValues(new Uint8Array(1))[0]
    } while (x >= max)

    return (x % range)
}

/**
 * @param {number} numberOfRequiredRandomCharacters
 * @param {string} allowedCharacters
 */
function _classicPassword (numberOfRequiredRandomCharacters, allowedCharacters) {
    const length = allowedCharacters.length
    const randomCharArray = Array(numberOfRequiredRandomCharacters)
    for (var i = 0; i < numberOfRequiredRandomCharacters; i++) {
        const index = _randomNumberWithUniformDistribution(length)
        randomCharArray[i] = allowedCharacters[index]
    }
    return randomCharArray.join('')
}

/**
 * @param {string} password
 * @param {number} consecutiveCharLimit
 * @returns {boolean}
 * @private
 */
function _passwordHasNotExceededConsecutiveCharLimit (password, consecutiveCharLimit) {
    var longestConsecutiveCharLength = 1
    var firstConsecutiveCharIndex = 0
    // Both "123" or "abc" and "321" or "cba" are considered consecutive.
    var isSequenceAscending
    for (var i = 1; i < password.length; i++) {
        var currCharCode = password.charCodeAt(i)
        var prevCharCode = password.charCodeAt(i - 1)
        if (isSequenceAscending) {
            // If `isSequenceAscending` is defined, then we know that we are in the middle of an existing
            // pattern. Check if the pattern continues based on whether the previous pattern was
            // ascending or descending.
            if ((isSequenceAscending.valueOf() && currCharCode === prevCharCode + 1) || (!isSequenceAscending.valueOf() && currCharCode === prevCharCode - 1)) {
                continue
            }

            // Take into account the case when the sequence transitions from descending
            // to ascending.
            if (currCharCode === prevCharCode + 1) {
                firstConsecutiveCharIndex = i - 1
                isSequenceAscending = Boolean(true)
                continue
            }

            // Take into account the case when the sequence transitions from ascending
            // to descending.
            if (currCharCode === prevCharCode - 1) {
                firstConsecutiveCharIndex = i - 1
                isSequenceAscending = Boolean(false)
                continue
            }

            isSequenceAscending = null
        } else if (currCharCode === prevCharCode + 1) {
            isSequenceAscending = Boolean(true)
            continue
        } else if (currCharCode === prevCharCode - 1) {
            isSequenceAscending = Boolean(false)
            continue
        }

        var currConsecutiveCharLength = i - firstConsecutiveCharIndex
        if (currConsecutiveCharLength > longestConsecutiveCharLength) {
            longestConsecutiveCharLength = currConsecutiveCharLength
        }

        firstConsecutiveCharIndex = i
    }

    if (isSequenceAscending) {
        const currConsecutiveCharLength = password.length - firstConsecutiveCharIndex
        if (currConsecutiveCharLength > longestConsecutiveCharLength) {
            longestConsecutiveCharLength = currConsecutiveCharLength
        }
    }

    return longestConsecutiveCharLength <= consecutiveCharLimit
}

/**
 * @param {string} password
 * @param {number} repeatedCharLimit
 * @returns {boolean}
 */
function _passwordHasNotExceededRepeatedCharLimit (password, repeatedCharLimit) {
    var longestRepeatedCharLength = 1
    var lastRepeatedChar = password.charAt(0)
    var lastRepeatedCharIndex = 0
    for (var i = 1; i < password.length; i++) {
        var currChar = password.charAt(i)
        if (currChar === lastRepeatedChar) {
            continue
        }

        var currRepeatedCharLength = i - lastRepeatedCharIndex
        if (currRepeatedCharLength > longestRepeatedCharLength) {
            longestRepeatedCharLength = currRepeatedCharLength
        }

        lastRepeatedChar = currChar
        lastRepeatedCharIndex = i
    }
    return longestRepeatedCharLength <= repeatedCharLimit
}

/**
 * @param {string} password
 * @param {string[]} requiredCharacterSets
 * @returns {boolean}
 */
function _passwordContainsRequiredCharacters (password, requiredCharacterSets) {
    var requiredCharacterSetsLength = requiredCharacterSets.length
    var passwordLength = password.length
    for (var i = 0; i < requiredCharacterSetsLength; i++) {
        var requiredCharacterSet = requiredCharacterSets[i]
        var hasRequiredChar = false
        for (var j = 0; j < passwordLength; j++) {
            var char = password.charAt(j)
            if (requiredCharacterSet.indexOf(char) !== -1) {
                hasRequiredChar = true
                break
            }
        }
        if (!hasRequiredChar) {
            return false
        }
    }
    return true
}

/**
 * @returns {string[]}
 * @private
 */
function _defaultRequiredCharacterSets () {
    return ['abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0123456789']
}

/**
 * @param {string} string1
 * @param {string} string2
 * @returns {boolean}
 */
function _stringsHaveAtLeastOneCommonCharacter (string1, string2) {
    var string2Length = string2.length
    for (var i = 0; i < string2Length; i++) {
        var char = string2.charAt(i)
        if (string1.indexOf(char) !== -1) {
            return true
        }
    }

    return false
}

/**
 * @param {Requirements} requirements
 * @returns {PasswordParameters}
 * @private
 */
function _passwordGenerationParametersDictionary (requirements) {
    let minPasswordLength = requirements.PasswordMinLength
    const maxPasswordLength = requirements.PasswordMaxLength

    // @ts-ignore
    if (minPasswordLength > maxPasswordLength) {
        // Resetting invalid value of min length to zero means "ignore min length parameter in password generation".
        minPasswordLength = 0
    }

    var allowedCharacters = requirements.PasswordAllowedCharacters

    var requiredCharacterArray = requirements.PasswordRequiredCharacters
    var requiredCharacterSets = _defaultRequiredCharacterSets()
    if (requiredCharacterArray) {
        const mutatedRequiredCharacterSets = []
        const requiredCharacterArrayLength = requiredCharacterArray.length

        for (var i = 0; i < requiredCharacterArrayLength; i++) {
            var requiredCharacters = requiredCharacterArray[i]
            // @ts-ignore
            if (_stringsHaveAtLeastOneCommonCharacter(requiredCharacters, allowedCharacters)) {
                mutatedRequiredCharacterSets.push(requiredCharacters)
            }
        }
        requiredCharacterSets = mutatedRequiredCharacterSets
    }

    // If requirements allow, we will generate the password in default format: "xxx-xxx-xxx-xxx".
    var numberOfRequiredRandomCharacters = defaultNumberOfCharactersForClassicPassword
    if (minPasswordLength && minPasswordLength > defaultClassicPasswordLength) {
        numberOfRequiredRandomCharacters = minPasswordLength
    }

    if (maxPasswordLength && maxPasswordLength < defaultClassicPasswordLength) {
        numberOfRequiredRandomCharacters = maxPasswordLength
    }

    if (allowedCharacters) {
    } else {
        allowedCharacters = defaultUnambiguousCharacters
    }

    // In default password format, we use dashes only as separators, not as symbols you can encounter at a random position.

    if (!requiredCharacterSets) {
        requiredCharacterSets = _defaultRequiredCharacterSets()
    }

    // If we have more requirements of the type "need a character from set" than the length of the password we want to generate, then
    // we will never be able to meet these requirements, and we'll end up in an infinite loop generating passwords. To avoid this,
    // reset required character sets if the requirements are impossible to meet.
    if (requiredCharacterSets.length > numberOfRequiredRandomCharacters) {
        requiredCharacterSets = []
    }

    // Do not require any character sets that do not contain allowed characters.
    var requiredCharacterSetsLength = requiredCharacterSets.length
    var mutatedRequiredCharacterSets = []
    var allowedCharactersLength = allowedCharacters.length
    for (let i = 0; i < requiredCharacterSetsLength; i++) {
        var requiredCharacterSet = requiredCharacterSets[i]
        var requiredCharacterSetContainsAllowedCharacters = false
        for (var j = 0; j < allowedCharactersLength; j++) {
            var character = allowedCharacters.charAt(j)
            if (requiredCharacterSet.indexOf(character) !== -1) {
                requiredCharacterSetContainsAllowedCharacters = true
                break
            }
        }
        if (requiredCharacterSetContainsAllowedCharacters) {
            mutatedRequiredCharacterSets.push(requiredCharacterSet)
        }
    }
    requiredCharacterSets = mutatedRequiredCharacterSets

    return {
        'NumberOfRequiredRandomCharacters': numberOfRequiredRandomCharacters,
        'PasswordAllowedCharacters': allowedCharacters,
        'RequiredCharacterSets': requiredCharacterSets
    }
}

/**
 * @param {Requirements | null} requirements
 * @returns {string}
 */
function _generatedPasswordMatchingRequirements (requirements) {
    requirements = requirements || {}

    const parameters = _passwordGenerationParametersDictionary(requirements)
    const numberOfRequiredRandomCharacters = parameters.NumberOfRequiredRandomCharacters
    const repeatedCharLimit = requirements.PasswordRepeatedCharacterLimit
    const allowedCharacters = parameters.PasswordAllowedCharacters
    const shouldCheckRepeatedCharRequirement = !!repeatedCharLimit

    while (true) {
        const password = _classicPassword(numberOfRequiredRandomCharacters, allowedCharacters)

        if (!_passwordContainsRequiredCharacters(password, parameters.RequiredCharacterSets)) {
            continue
        }

        if (shouldCheckRepeatedCharRequirement) {
            if (repeatedCharLimit !== undefined && repeatedCharLimit >= 1 && !_passwordHasNotExceededRepeatedCharLimit(password, repeatedCharLimit)) {
                continue
            }
        }

        var consecutiveCharLimit = requirements.PasswordConsecutiveCharacterLimit
        if (consecutiveCharLimit) {
            if (consecutiveCharLimit >= 1 && !_passwordHasNotExceededConsecutiveCharLimit(password, consecutiveCharLimit)) {
                continue
            }
        }

        return password || ''
    }
}

/**
 * @param {CustomCharacterClass | NamedCharacterClass} characterClass
 * @returns {string[]}
 */
function _scanSetFromCharacterClass (characterClass) {
    if (characterClass instanceof CustomCharacterClass) {
        return characterClass.characters
    }
    console.assert(characterClass instanceof NamedCharacterClass)
    switch (characterClass.name) {
    case Identifier.ASCII_PRINTABLE:
    case Identifier.UNICODE:
        return SCAN_SET_ORDER.split('')
    case Identifier.DIGIT:
        return SCAN_SET_ORDER.substring(SCAN_SET_ORDER.indexOf('0'), SCAN_SET_ORDER.indexOf('9') + 1).split('')
    case Identifier.LOWER:
        return SCAN_SET_ORDER.substring(SCAN_SET_ORDER.indexOf('a'), SCAN_SET_ORDER.indexOf('z') + 1).split('')
    case Identifier.SPECIAL:
        return SCAN_SET_ORDER.substring(SCAN_SET_ORDER.indexOf('-'), SCAN_SET_ORDER.indexOf(']') + 1).split('')
    case Identifier.UPPER:
        return SCAN_SET_ORDER.substring(SCAN_SET_ORDER.indexOf('A'), SCAN_SET_ORDER.indexOf('Z') + 1).split('')
    }
    console.assert(false, SHOULD_NOT_BE_REACHED)
    return []
}

/**
 * @param {(CustomCharacterClass | NamedCharacterClass)[]} characterClasses
 */
function _charactersFromCharactersClasses (characterClasses) {
    const output = []
    for (let characterClass of characterClasses) {
        output.push(..._scanSetFromCharacterClass(characterClass))
    }
    return output
}

/**
 * @param {string[]} characters
 * @returns {string}
 */
function _canonicalizedScanSetFromCharacters (characters) {
    if (!characters.length) {
        return ''
    }
    let shadowCharacters = Array.prototype.slice.call(characters)
    shadowCharacters.sort((a, b) => SCAN_SET_ORDER.indexOf(a) - SCAN_SET_ORDER.indexOf(b))
    let uniqueCharacters = [shadowCharacters[0]]
    for (let i = 1, length = shadowCharacters.length; i < length; ++i) {
        if (shadowCharacters[i] === shadowCharacters[i - 1]) {
            continue
        }
        uniqueCharacters.push(shadowCharacters[i])
    }
    return uniqueCharacters.join('')
}

module.exports.generatePasswordFromInput = generatePasswordFromInput
module.exports.internal = {
    _randomNumberWithUniformDistribution,
    _passwordHasNotExceededConsecutiveCharLimit,
    _canonicalizedScanSetFromCharacters,
    _classicPassword,
    _passwordHasNotExceededRepeatedCharLimit,
    _passwordContainsRequiredCharacters
}
