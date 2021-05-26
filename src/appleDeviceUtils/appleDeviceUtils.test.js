const {wkSendAndWait} = require('./AppleDeviceUtils')

const ddgGlobals = window.navigator.ddgGlobals

const webkitMock = jest.fn(async (data) => {
    const {messageHandling} = data

    if (messageHandling.secret !== 'PLACEHOLDER_SECRET') return

    const message = {data: 'test'}

    const iv = new ddgGlobals.Uint8Array(messageHandling.iv)
    const keyBuffer = new ddgGlobals.Uint8Array(messageHandling.key)
    const key = await ddgGlobals.importKey('raw', keyBuffer, 'AES-GCM', false, ['encrypt'])

    const encrypt = (message) => {
        let enc = new ddgGlobals.TextEncoder()
        return ddgGlobals.encrypt({name: 'AES-GCM', iv}, key, enc.encode(message))
    }

    encrypt(ddgGlobals.JSONstringify(message)).then((encryptedMsg) =>
        window[messageHandling.methodName](encryptedMsg))
})
window.webkit = {messageHandlers: {
    testMock: {postMessage: webkitMock}
}}

describe('wkSendAndWait', () => {
    it('returns the expected unencrypted data', async () => {
        const response = await wkSendAndWait('testMock')
        expect(response.data).toBe('test')
    })
})
