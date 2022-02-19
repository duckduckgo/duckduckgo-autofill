// Do not remove -- Apple devices change this when they support modern webkit messaging
let hasModernWebkitAPI = false
// INJECT hasModernWebkitAPI HERE

// The native layer will inject a randomised secret here and use it to verify the origin
let secret = 'PLACEHOLDER_SECRET'

const ddgGlobals = require('./captureDdgGlobals')

/**
 * Sends message to the webkit layer (fire and forget)
 * @param {String} handler
 * @param {*} data
 * @returns {*}
 */
const wkSend = (handler, data = {}) => {
    if (!(handler in window.webkit.messageHandlers)) {
        throw new Error(`Missing webkit handler: '${handler}'`)
    }
    return window.webkit.messageHandlers[handler].postMessage({...data, messageHandling: {...data.messageHandling, secret}})
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
 * @returns {Promise<*>}
 */
const wkSendAndWait = async (handler, data = {}) => {
    if (hasModernWebkitAPI) {
        const response = await wkSend(handler, data)
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
                secret,
                key: ddgGlobals.Arrayfrom(key),
                iv: ddgGlobals.Arrayfrom(iv)
            }
            wkSend(handler, data)
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
    const algo = { name: 'AES-GCM', iv }

    let decrypted = await ddgGlobals.decrypt(algo, cryptoKey, ciphertext)

    let dec = new ddgGlobals.TextDecoder()
    return dec.decode(decrypted)
}

module.exports = {
    wkSend,
    wkSendAndWait
}
