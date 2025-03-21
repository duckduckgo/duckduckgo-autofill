/** @typedef {import("../UI/interfaces").TooltipItemRenderer} TooltipItemRenderer */

import { truncateFromMiddle } from '../autofill-utils.js';

const AUTOGENERATED_KEY = 'autogenerated';
const PROVIDER_LOCKED = 'provider_locked';

/**
 * @implements {TooltipItemRenderer}
 */
class CredentialsTooltipItem {
    /** @type {CredentialsObject} */
    #data;
    /** @param {CredentialsObject} data */
    constructor(data) {
        this.#data = data;
    }
    id = () => String(this.#data.id);
    /** @param {import('../locales/strings.js').TranslateFn} t */
    labelMedium = (t) => {
        if (this.#data.username) {
            return this.#data.username;
        }

        if (this.#data.origin?.url) {
            return t('autofill:passwordForUrl', { url: truncateFromMiddle(this.#data.origin.url) });
        }

        return '';
    };
    labelSmall = () => {
        if (this.#data.origin?.url) {
            return truncateFromMiddle(this.#data.origin.url);
        }

        return '•••••••••••••••';
    };
    credentialsProvider = () => this.#data.credentialsProvider;
}

/**
 * @implements {TooltipItemRenderer}
 */
class AutoGeneratedCredential {
    /** @type {CredentialsObject} */
    #data;
    /** @param {CredentialsObject} data */
    constructor(data) {
        this.#data = data;
    }
    id = () => String(this.#data.id);
    label = (_subtype) => this.#data.password;
    /** @param {import('../locales/strings.js').TranslateFn} t */
    labelMedium = (t) => t('autofill:generatedPassword');
    /** @param {import('../locales/strings.js').TranslateFn} t */
    labelSmall = (t) => t('autofill:passwordWillBeSaved');
}

/**
 * Generate a stand-in 'CredentialsObject' from a
 * given (generated) password.
 *
 * @param {string} password
 * @param {string} username
 * @returns {CredentialsObject}
 */
function fromPassword(password, username) {
    return {
        [AUTOGENERATED_KEY]: true,
        password,
        username,
    };
}

/**
 * @implements TooltipItemRenderer
 */
class ProviderLockedItem {
    /** @type {CredentialsObject} */
    #data;
    /** @param {CredentialsObject} data */
    constructor(data) {
        this.#data = data;
    }
    id = () => String(this.#data.id);
    /** @param {import('../locales/strings.js').TranslateFn} t */
    labelMedium = (t) => t('autofill:bitwardenIsLocked');
    /** @param {import('../locales/strings.js').TranslateFn} t */
    labelSmall = (t) => t('autofill:unlockYourVault');
    credentialsProvider = () => this.#data.credentialsProvider;
}

/**
 * If the locally generated/stored password or username ends up being the same
 * as submitted in a subsequent form submission - then we mark the
 * credentials as 'autogenerated' so that the native layer can decide
 * how to process it
 *
 * @param {DataStorageObject} data
 * @param {object} [autofilledFields]
 * @param {string|null|undefined} [autofilledFields.username] - if present, it's the last username generated by something like email Protection
 * @param {string|null|undefined} [autofilledFields.password] - if present, it's the last generated password
 *
 */
function appendGeneratedKey(data, autofilledFields = {}) {
    let autogenerated = false;

    // does the current password match the most recently generated one?
    if (autofilledFields.password && data.credentials?.password === autofilledFields.password) {
        autogenerated = true;
    }

    // does the current username match a recently generated one? (eg: email protection)
    if (autofilledFields.username && data.credentials?.username === autofilledFields.username) {
        autogenerated = true;
    }

    // if neither username nor password were generated, don't alter the outgoing data
    if (!autogenerated) return data;

    // if we get here, we're confident that something was generated + filled
    // so we mark the credential as 'autogenerated' for the benefit of native implementations
    return {
        ...data,
        credentials: {
            ...data.credentials,
            [AUTOGENERATED_KEY]: true,
        },
    };
}

/**
 * Factory for creating a TooltipItemRenderer
 *
 * @param {CredentialsObject} data
 * @returns {TooltipItemRenderer}
 */
function createCredentialsTooltipItem(data) {
    if (data.id === PROVIDER_LOCKED) {
        return new ProviderLockedItem(data);
    }
    if (AUTOGENERATED_KEY in data && data.password) {
        return new AutoGeneratedCredential(data);
    }
    return new CredentialsTooltipItem(data);
}

export { createCredentialsTooltipItem, fromPassword, appendGeneratedKey, AUTOGENERATED_KEY, PROVIDER_LOCKED };
