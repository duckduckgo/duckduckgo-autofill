const ddgGlobals = window.navigator.ddgGlobals
const secret = 'PLACEHOLDER_SECRET'

/**
 * Sends message to the webkit layer
 * @param {String} handler
 * @param {*} data
 * @returns {*}
 */
const wkSend = (handler, data = {}) =>
    window.webkit.messageHandlers[handler].postMessage(data)

/**
 *
 * @param {String} randomMethodName
 * @param {Function} callback
 */
const generateRandomMethod = (randomMethodName, callback) => {
    Object.defineProperty(ddgGlobals.window, randomMethodName, {
        enumerable: false,
        // configurable, To allow for deletion later
        configurable: true,
        writable: false,
        // Use proxy to ensure stringification isn't possible
        value: new Proxy(function () {}, {
            apply (target, thisArg, args) {
                callback(args)
                delete ddgGlobals.window[randomMethodName]
            }
        })
    })
}

/**
 * Sends message to the webkit layer and waits for the specified response
 * @param {String} handler
 * @param {*} data
 * @returns {Promise<*>}
 */
const wkSendAndWait = async (handler, data = {}) => {
    // if newer versions
    // return wkSend(handler, data).then(data => data)

    // Older versions
    const randMethodName = createRandMethodName()
    const key = createRandKey()
    const iv = createRandIv()

    const encryptedResponse = await new Promise((resolve) => {
        generateRandomMethod(randMethodName, resolve)
        data.messageHandling = {
            methodName: randMethodName,
            secret,
            key,
            iv: Array.from(iv)
        }
        wkSend(handler, data)
    })

    // console.log('encryptedResponse', key, encryptedResponse)

    return decrypt(encryptedResponse, key, iv)
}

const randomString = () => {
    const num = ddgGlobals.getRandomValues(new ddgGlobals.Uint32Array(1))[0] / 2 ** 32
    return num.toString().replace('0.', '')
}

const createRandMethodName = () => '_' + randomString()

const algoObj = {name: 'AES-GCM', length: 256}

// const createRandKey = () => ddgGlobals.generateKey(algoObj, true, ['encrypt', 'decrypt'])
//     .then(key => ddgGlobals.exportKey('raw', key))
//     .then(exportedKeyBuffer => new ddgGlobals.Uint8Array(exportedKeyBuffer).toString())

const createRandKey = () => randomString()

const createRandIv = () => ddgGlobals.getRandomValues(new ddgGlobals.Uint8Array(12))

const decrypt = async (ciphertext, key, iv) => {
    const cryptoKey = await ddgGlobals.importKey('raw', key, 'AES-GCM', false, ['decrypt'])
    const U8iv = new ddgGlobals.Uint8Array(iv)
    console.log('cryptoKey', cryptoKey)
    let decrypted = await ddgGlobals.decrypt(
        {
            name: 'AES-GCM',
            iv: U8iv
        },
        cryptoKey,
        ciphertext
    )

    let dec = new ddgGlobals.TextDecoder()
    return dec.decode(decrypted)
}

module.exports = {
    wkSend,
    wkSendAndWait
}
