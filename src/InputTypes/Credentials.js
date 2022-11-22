const AUTOGENERATED_KEY = 'autogenerated'
const PROVIDER_LOCKED = 'provider_locked'

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
    labelMedium = (_subtype) => this.#data.username
    labelSmall = (_subtype) => '•••••••••••••••'
    credentialsProvider = () => this.#data.credentialsProvider
}

/**
 * @implements {TooltipItemRenderer}
 */
class AutoGeneratedCredential {
    /** @type {CredentialsObject} */
    #data;
    /** @param {CredentialsObject} data */
    constructor (data) {
        this.#data = data
    }
    id = () => String(this.#data.id)
    label = (_subtype) => this.#data.password
    labelMedium = (_subtype) => 'Generated password'
    labelSmall = (_subtype) => 'Login information will be saved for this website'
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
        [AUTOGENERATED_KEY]: true,
        password: password,
        username: ''
    }
}

/**
 * @implements TooltipItemRenderer
 */
class ProviderLockedItem {
    /** @type {CredentialsObject} */
    #data;
    /** @param {CredentialsObject} data */
    constructor (data) {
        this.#data = data
    }
    id = () => String(this.#data.id)
    labelMedium = (_subtype) => 'Bitwarden is locked'
    labelSmall = (_subtype) => 'Unlock your vault to access credentials or generate passwords'
    credentialsProvider = () => this.#data.credentialsProvider
}

/**
 * If the locally generated/stored password ends up being the same
 * as submitted in a subsequent form submission - then we mark the
 * credentials as 'autogenerated' so that the native layer can decide
 * how to process it
 *
 * @type {PreRequest<DataStorageObject, string|null>}
 */
function appendGeneratedId (data, generatedPassword) {
    if (generatedPassword && data.credentials?.password === generatedPassword) {
        return {
            ...data,
            credentials: {
                ...data.credentials,
                [AUTOGENERATED_KEY]: true
            }
        }
    }
    return data
}

/**
 * Factory for creating a TooltipItemRenderer
 *
 * @param {CredentialsObject} data
 * @returns {TooltipItemRenderer}
 */
function createCredentialsTooltipItem (data) {
    if (data.id === PROVIDER_LOCKED) {
        return new ProviderLockedItem(data)
    }
    if (AUTOGENERATED_KEY in data && data.password) {
        return new AutoGeneratedCredential(data)
    }
    return new CredentialsTooltipItem(data)
}

export {
    createCredentialsTooltipItem,
    fromPassword,
    appendGeneratedId,
    AUTOGENERATED_KEY,
    PROVIDER_LOCKED
}
