import {attachAndReturnGenericForm} from '../../test-utils'
import {Form} from '../../Form/Form'
import InterfacePrototype from '../InterfacePrototype'

describe('InterfacePrototype', function () {
    beforeEach(() => {
        require('../../requestIdleCallback')
    })
    it('will not fire attach if the document is hidden', () => {
        const mockedDoc = jest.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')

        const device = InterfacePrototype.default()
        device.init()
        const formEl = attachAndReturnGenericForm()
        const input = /** @type {HTMLInputElement} */ (formEl.querySelector('input'))
        const formInstance = new Form(formEl, input, device)
        const spy = jest.spyOn(device.uiController, 'attach')
        device.attachTooltip(formInstance, input, null)
        expect(spy).not.toHaveBeenCalled()

        mockedDoc.mockRestore()
    })
})
