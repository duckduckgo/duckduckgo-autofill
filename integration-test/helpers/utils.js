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
 * @param {import('@playwright/test').Locator} input
 * @returns {Promise<void>}
 */
const clickOnIcon = async (input) => {
    const box = await input.boundingBox()
    if (!box) throw new Error('unreachable')
    await input.click({position: {x: box.width - (box.height / 2), y: box.height / 2}})
}

/**
 * @param {MockBuilder} builder
 * @param {{
 *     credentials?: CredentialsMock,
 *     identity?: IdentityObject,
 *     creditCard?: CreditCardObject,
 *     emailProtection?: {personalAddress: string, privateAddress: string}
 * }} data
 * @returns {MockBuilder}
 */
function withDataType (builder, {credentials, identity, creditCard, emailProtection}) {
    if (credentials) builder.withCredentials(credentials)

    if (identity) builder.withIdentity(identity)

    if (creditCard) builder.withCreditCard(creditCard)

    if (emailProtection) builder.withEmailProtection(emailProtection)

    return builder
}

export {createAvailableInputTypes, stripDuckExtension, clickOnIcon, withDataType}
