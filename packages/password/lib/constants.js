const DEFAULT_MIN_LENGTH = 20;
const DEFAULT_MAX_LENGTH = 30;
const DEFAULT_REQUIRED_CHARS = '-!?$&#%';
const DEFAULT_UNAMBIGUOUS_CHARS = 'abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
const DEFAULT_PASSWORD_RULES = [
    `minlength: ${DEFAULT_MIN_LENGTH}`,
    `maxlength: ${DEFAULT_MAX_LENGTH}`,
    `required: [${DEFAULT_REQUIRED_CHARS}]`,
    `required: digit`,
    `allowed: [${DEFAULT_UNAMBIGUOUS_CHARS}]`,
].join('; ');

const constants = {
    DEFAULT_MIN_LENGTH,
    DEFAULT_MAX_LENGTH,
    DEFAULT_PASSWORD_RULES,
    DEFAULT_REQUIRED_CHARS,
    DEFAULT_UNAMBIGUOUS_CHARS,
};

export { constants };
