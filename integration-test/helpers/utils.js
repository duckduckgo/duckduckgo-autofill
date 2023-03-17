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

/**
 * Clicks directly on the icon within the input field
 * @param {import('playwright').Locator} input
 * @returns {Promise<void>}
 */
const clickOnIcon = async (input) => {
    const box = await input.boundingBox()
    if (!box) throw new Error('unreachable')
    await input.click({position: {x: box.width - (box.height / 2), y: box.height / 2}})
}

export {createAvailableInputTypes, stripDuckExtension, clickOnIcon}
