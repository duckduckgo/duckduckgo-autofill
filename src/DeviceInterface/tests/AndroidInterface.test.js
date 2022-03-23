const AndroidInterface = require('../AndroidInterface')
const {createGlobalConfig} = require('../../config')

describe('AndroidInterface', function () {
    beforeEach(() => {
        require('../../requestIdleCallback')
    })
    it('can be instantiated without throwing', () => {
        const config = createGlobalConfig()
        const device = new AndroidInterface(config)
        device.init()
    })
})
