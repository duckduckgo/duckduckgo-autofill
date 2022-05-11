import {AndroidInterface} from '../AndroidInterface'
import { createGlobalConfig } from '../../config'
import {NativeTooltip} from '../../UI/NativeTooltip'

describe('AndroidInterface', function () {
    beforeEach(() => {
        require('../../requestIdleCallback')
    })
    it('can be instantiated without throwing', () => {
        const config = createGlobalConfig()
        const tooltip = new NativeTooltip()
        const device = new AndroidInterface(config, tooltip)
        device.init()
    })
})
