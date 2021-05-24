const {wkSendAndWait} = require('./AppleDeviceUtils')

const ddgGlobals = window.navigator.ddgGlobals

const webkitMock = jest.fn(async (data) => {
    const {messageHandling} = data
    // delete data.messageHandling

    if (messageHandling.secret !== 'PLACEHOLDER_SECRET') return

    const message = {test: 'test'}

    const iv = new ddgGlobals.Uint8Array(messageHandling.iv)
    // const keyBuffer = new ddgGlobals.Uint8Array(messageHandling.key)
    const key = await ddgGlobals.importKey('raw', messageHandling.key, 'AES-GCM', false, ['encrypt'])

    function encrypt (message) {
        let enc = new ddgGlobals.TextEncoder()
        return ddgGlobals.encrypt(
            {
                name: 'AES-GCM',
                iv
            },
            key,
            enc.encode(message)
        )
    }

    encrypt(message).then((encryptedMsg) => {
        console.log('encryptedMsg', encryptedMsg)
        return window[messageHandling.methodName](encryptedMsg)
    })
})
window.webkit = {messageHandlers: {
    testMock: {postMessage: webkitMock}
}}

test('test', async () => {
    await wkSendAndWait('testMock')
    expect('working')
})
