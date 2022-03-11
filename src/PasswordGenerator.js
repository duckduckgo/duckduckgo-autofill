const {generate} = require('../packages/password')
const rules = require('../packages/password/rules.json')

/**
 * Create a password once and reuse it.
 */
class PasswordGenerator {
    /** @type {string|null} */
    #previous = null;

    /** @returns {boolean} */
    get generated () {
        return this.#previous !== null
    }

    /** @param {import('../packages/password').GenerateOptions} [params] */
    generate (params = {}) {
        if (this.#previous) {
            return this.#previous
        }

        this.#previous = generate({ ...params, rules })

        return this.#previous
    }
}

module.exports.PasswordGenerator = PasswordGenerator
