Object.assign(global, require('jest-chrome'))

const crypto = require('crypto')

Object.defineProperty(global.self, 'crypto', {
    value: {
        ...global.self.crypto,
        subtle: crypto.webcrypto.subtle,
        getRandomValues: arr => crypto.randomFillSync(arr)
    }
})

require('./src/captureDdgGlobals')
