import {constants} from './mocks.js'

/** @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').AvailableInputTypes} AvailableInputTypes */

/**
 * Merges the provided overrides with the base AvailableInputTypes
 * @param {AvailableInputTypes} [overrides]
 * @returns {AvailableInputTypes}
 */
const createAvailableInputTypes = (overrides) => {
    const base = constants.availableInputTypes
    return {
        ...base,
        ...overrides
    }
}

/**
 * Given a Duck address returns the username without the domain
 * @param {string} emailAddress
 * @returns {string}
 */
const stripDuckExtension = (emailAddress) => {
    return emailAddress.replace('@duck.com', '')
}

export {createAvailableInputTypes, stripDuckExtension}
