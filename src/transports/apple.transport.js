import ddgGlobals from './captureDdgGlobals'

/**
 * @implements {RuntimeTransport}
 */
class AppleTransport {
    /** @type {GlobalConfig} */
    config

    /** @param {GlobalConfig} globalConfig */
    constructor (globalConfig) {
        this.config = globalConfig
    }

    async send (name, data) {
        try {
            const response = await wkSendAndWait(name, data, {
                secret: this.config.secret,
                hasModernWebkitAPI: this.config.hasModernWebkitAPI
            })
            // todo(Shane): make this applicable in more places, not tied to the apple implementation.
            if (middlewares[name]) {
                return middlewares[name](response, data)
            }
            return response
        } catch (e) {
            if (e instanceof MissingWebkitHandler) {
                if (name in interceptions) {
                    console.log('--> faling back to: ', name, data)
                    return interceptions[name]?.(this.config)
                } else {
                    throw new Error('unimplemented handler: ' + name)
                }
            } else {
                throw e
            }
        }
    }
}
/**
 * Create a wrapper around the webkit messaging that conforms
 * to the Transport tooltipHandler
 *
 * @param {GlobalConfig} config
 */
export function createTransport (config) {
    return new AppleTransport(config)
}
/**
 * @returns {LegacyTransport}
 */
export function createLegacyTransport (config) {
    const transport = createTransport(config)
    /** @type {LegacyTransport} */
    const loggingTransport = {
        async send (name, data) {
            console.log(`🙈 LegacyTransport: ${JSON.stringify(name)}`, data)
            const res = await transport.send(name, data)
            console.log(`\t 🙈 LegacyTransport::Response ${JSON.stringify(name)}`, res)
            return res
        }
    }
    return loggingTransport
}

/**
 *
 * @type {Middlewares}
 */
const middlewares = {
    getAutofillData: async (data) => {
        const cloned = JSON.parse(JSON.stringify(data.success))
        if ('id' in cloned) {
            if (typeof cloned.id === 'number') {
                console.warn("updated the credentials' id field as it was a number, but should be a string")
                cloned.id = String(cloned.id)
            }
        }
        return {
            success: cloned
        }
    }
}

/**
 * @type {Interceptions}
 */
const interceptions = {
    'getAutofillInitData': async (globalConfig) => {
        const legacyTransport = createLegacyTransport(globalConfig)
        const data = await legacyTransport.send('pmHandlerGetAutofillInitData')

        // todo(Shane): Fix this problem with ids with native team
        data.success?.credentials.forEach(cred => {
            cred.id = String(cred.id)
        })

        return {
            success: {
                // default, allowing it to be overriden
                serializedInputContext: '{}',
                ...data.success
            }
        }
    },
    /**
     * If this handler is not available, we default to the old check for email, which is
     * to call 'emailHandlerCheckAppSignedInStatus'
     * @param globalConfig
     */
    'getAvailableInputTypes': async (globalConfig) => {
        const legacyTransport = createLegacyTransport(globalConfig)
        const { isAppSignedIn } = await legacyTransport.send('emailHandlerCheckAppSignedInStatus')

        /** @type {AvailableInputTypes} */
        const legacyMacOsTypes = {
            credentials: true,
            identities: true,
            creditCards: true,
            email: isAppSignedIn
        }

        /** @type {AvailableInputTypes} */
        const legacyIOsTypes = {
            credentials: false,
            identities: false,
            creditCards: false,
            email: isAppSignedIn
        }

        return {
            /** @type {AvailableInputTypes} */
            success: globalConfig.isApp ? legacyMacOsTypes : legacyIOsTypes
        }
    },
    /**
     * @param {GlobalConfig} globalConfig
     */
    'getRuntimeConfiguration': async (globalConfig) => {
        const legacyMacOSToggles = {
            inputType_credentials: true,
            inputType_identities: true,
            inputType_creditCards: true,
            emailProtection: true,
            password_generation: true,
            credentials_saving: true
        }

        const legacyIOSToggles = {
            inputType_credentials: false,
            inputType_identities: false,
            inputType_creditCards: false,
            emailProtection: true,
            password_generation: false,
            credentials_saving: false
        }

        return {
            success: {
                contentScope: globalConfig.contentScope,
                userPreferences: {
                    // this is for old ios/macos
                    features: {
                        autofill: {
                            settings: {
                                /** @type {Schema.FeatureToggles} */
                                featureToggles: globalConfig.isApp
                                    ? legacyMacOSToggles
                                    : legacyIOSToggles
                            }
                        }
                    },
                    ...globalConfig.userPreferences
                },
                userUnprotectedDomains: globalConfig.userUnprotectedDomains
            }
        }
    }
}

class MissingWebkitHandler extends Error {
    handlerName

    constructor (handlerName) {
        super()
        this.handlerName = handlerName
    }
}

/**
 * Sends message to the webkit layer (fire and forget)
 * @param {String} handler
 * @param {*} data
 * @param {{hasModernWebkitAPI?: boolean, secret?: string}} opts
 */
const wkSend = (handler, data = {}, opts) => {
    if (!(handler in window.webkit.messageHandlers)) {
        throw new MissingWebkitHandler(`Missing webkit handler: '${handler}'`)
    }
    return window.webkit.messageHandlers[handler].postMessage({
        ...data,
        messageHandling: {...data.messageHandling, secret: opts.secret}
    })
}

/**
 * Generate a random method name and adds it to the global scope
 * The native layer will use this method to send the response
 * @param {String} randomMethodName
 * @param {Function} callback
 */
const generateRandomMethod = (randomMethodName, callback) => {
    ddgGlobals.ObjectDefineProperty(ddgGlobals.window, randomMethodName, {
        enumerable: false,
        // configurable, To allow for deletion later
        configurable: true,
        writable: false,
        value: (...args) => {
            callback(...args)
            delete ddgGlobals.window[randomMethodName]
        }
    })
}

/**
 * Sends message to the webkit layer and waits for the specified response
 * @param {String} handler
 * @param {*} data
 * @param {{hasModernWebkitAPI?: boolean, secret?: string}} opts
 * @returns {Promise<*>}
 */
export const wkSendAndWait = async (handler, data = {}, opts = {}) => {
    if (opts.hasModernWebkitAPI) {
        const response = await wkSend(handler, data, opts)
        return ddgGlobals.JSONparse(response || '{}')
    }

    try {
        const randMethodName = createRandMethodName()
        const key = await createRandKey()
        const iv = createRandIv()

        const {ciphertext, tag} = await new ddgGlobals.Promise((resolve) => {
            generateRandomMethod(randMethodName, resolve)
            data.messageHandling = {
                methodName: randMethodName,
                secret: opts.secret,
                key: ddgGlobals.Arrayfrom(key),
                iv: ddgGlobals.Arrayfrom(iv)
            }
            wkSend(handler, data, opts)
        })

        const cipher = new ddgGlobals.Uint8Array([...ciphertext, ...tag])
        const decrypted = await decrypt(cipher, key, iv)
        return ddgGlobals.JSONparse(decrypted || '{}')
    } catch (e) {
        console.error('decryption failed', e)
        return {error: e}
    }
}

const randomString = () =>
    '' + ddgGlobals.getRandomValues(new ddgGlobals.Uint32Array(1))[0]

const createRandMethodName = () => '_' + randomString()

const algoObj = {name: 'AES-GCM', length: 256}
const createRandKey = async () => {
    const key = await ddgGlobals.generateKey(algoObj, true, ['encrypt', 'decrypt'])
    const exportedKey = await ddgGlobals.exportKey('raw', key)
    return new ddgGlobals.Uint8Array(exportedKey)
}

const createRandIv = () => ddgGlobals.getRandomValues(new ddgGlobals.Uint8Array(12))

const decrypt = async (ciphertext, key, iv) => {
    const cryptoKey = await ddgGlobals.importKey('raw', key, 'AES-GCM', false, ['decrypt'])
    const algo = {name: 'AES-GCM', iv}

    let decrypted = await ddgGlobals.decrypt(algo, cryptoKey, ciphertext)

    let dec = new ddgGlobals.TextDecoder()
    return dec.decode(decrypted)
}
