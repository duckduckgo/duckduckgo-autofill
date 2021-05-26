const {wkSendAndWait} = require('./AppleDeviceUtils')

const ddgGlobals = window.navigator.ddgGlobals

const webkitMock = jest.fn((data) => {
    const {messageHandling} = data

    if (messageHandling.secret !== 'PLACEHOLDER_SECRET') return

    const message = {data: 'test'}

    return ddgGlobals.ddgEncrypt(message, messageHandling)
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
