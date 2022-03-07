const MIN_LENGTH = 20
const MAX_LENGTH = 30
const REQUIRED_CHARS = '-!?$&#%'
const DEFAULT_UNAMBIGUOUS_CHARS = 'abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789'
const DEFAULT_PASSWORD_RULES = [
    `minlength: ${MIN_LENGTH}`,
    `maxlength: ${MAX_LENGTH}`,
    `required: [${REQUIRED_CHARS}]`,
    `allowed: [${DEFAULT_UNAMBIGUOUS_CHARS}]`
].join(';')

const constants = {
    MIN_LENGTH,
    MAX_LENGTH,
    DEFAULT_PASSWORD_RULES,
    REQUIRED_CHARS,
    DEFAULT_UNAMBIGUOUS_CHARS
}

module.exports.constants = constants
