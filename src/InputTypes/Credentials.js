const GENERATED_ID = '__generated__'

/**
 * @implements {TooltipItemRenderer}
 */
class CredentialsTooltipItem {
    /** @type {CredentialsObject} */
    #data;
    /** @param {CredentialsObject} data */
    constructor (data) {
        this.#data = data
    }
    id = () => String(this.#data.id)
    labelMedium (_subtype) {
        if (this.#data.id === GENERATED_ID) {
            return 'Generated password'
        }
        return this.#data.username
    }
    labelSmall (_subtype) {
        if (this.#data.id === GENERATED_ID && this.#data.password) {
            return this.#data.password
        }
        return '•••••••••••••••'
    }
}

/**
 * Generate a stand-in 'CredentialsObject' from a
 * given (generated) password.
 *
 * @param {string} password
 * @returns {CredentialsObject}
 */
function fromPassword (password) {
    return {
        id: GENERATED_ID,
        password: password,
        username: ''
    }
}

module.exports.CredentialsTooltipItem = CredentialsTooltipItem
module.exports.fromPassword = fromPassword
module.exports.GENERATED_ID = GENERATED_ID
