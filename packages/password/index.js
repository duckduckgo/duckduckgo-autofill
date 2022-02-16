const {generatePasswordFromInput} = require('./lib/apple.password')
const {ParserError} = require('./lib/rules-parser')
const {constants} = require('./lib/constants')

/**
 * @typedef {{
 *   domain?: string | null | undefined;
 *   input?: string | null | undefined;
 *   rules?: RulesFormat | null | undefined
 * }} GenerateOptions
 */

/**
 * Generate a random password based on DuckDuckGo's default ruleset;
 *
 * @example
 *
 * ```js
 * const password = require("@duckduckgo/autofill/packages/password");
 * const pw = password.generate()
 * ```
 *
 *
 * @example Generate a random password based on a given input string
 * that matches [the format here](https://developer.apple.com/password-rules/).
 *
 * <br />
 * **Note**: this API is designed to NEVER throw an exception. It will *always* provide a
 * valid password.
 * <br />
 * <br />
 *
 * ```js
 * const password = require(""@duckduckgo/autofill/packages/password");
 * const pw = password.generate({
 *    input: "minlength: 20; maxlength: 30; required: upper, lower; required: [$%^&*]"
 * })
 * ```
 *
 * @example Generate a random password for a given domain, if it doesn't exist, it will
 * use the default rules instead
 *
 * ```js
 * const password = require("@duckduckgo/autofill/packages/password");
 * const pw = password.generate({
 *    domain: "example.com"
 * })
 * ```
 *
 * @param {GenerateOptions} [inputs]
 */
function generate (inputs = {}) {
    try {
        if (inputs.input) {
            return generatePasswordFromInput(inputs.input)
        }
        if (inputs.domain) {
            const rules = _selectPasswordRules(inputs.domain, inputs.rules)
            if (rules) {
                return generatePasswordFromInput(inputs.domain)
            }
        }
    } catch (e) {
        if (!(e instanceof ParserError) && !(e instanceof HostnameInputError)) {
            console.error(e)
        }
    }

    // At this point, we have to trust the generation will not throw
    // as it is NOT using any user/page-provided data
    return generatePasswordFromInput(constants.DEFAULT_PASSWORD_RULES)
}

// An extension type to differentiate between known errors
class HostnameInputError extends Error {}

/**
 * @typedef {Record<string, {"password-rules": string}>} RulesFormat
 */

/**
 * @private
 * @param {string} inputHostname
 * @param {RulesFormat | null | undefined} [rules]
 * @returns {string | undefined}
 * @throws {HostnameInputError}
 */
function _selectPasswordRules (inputHostname, rules) {
    rules = rules || require('./rules.json')
    const hostname = _safeHostname(inputHostname)
    // direct match
    if (rules[hostname]) {
        return rules[hostname]['password-rules']
    }

    // otherwise, start chopping off subdomains and re-joining to compare
    const pieces = hostname.split('.')
    while (pieces.length > 1) {
        pieces.shift()
        const joined = pieces.join('.')
        if (rules[joined]) {
            return rules[joined]['password-rules']
        }
    }
    return undefined
}

/**
 * @private
 * @param {string} inputHostname;
 * @throws {HostnameInputError}
 * @returns {string}
 */
function _safeHostname (inputHostname) {
    if (inputHostname.startsWith('http:') || inputHostname.startsWith('https:')) {
        throw new HostnameInputError('invalid input, you can only provide a hostname but you gave a scheme')
    }
    if (inputHostname.includes(':')) {
        throw new HostnameInputError('invalid input, you can only provide a hostname but you gave a :port')
    }
    try {
        const asUrl = new URL('https://' + inputHostname)
        return asUrl.hostname
    } catch (e) {
        throw new HostnameInputError(`could not instantiate a URL from that hostname ${inputHostname}`)
    }
}

module.exports.generate = generate
module.exports._selectPasswordRules = _selectPasswordRules
module.exports.HostnameInputError = HostnameInputError
module.exports.constants = constants
