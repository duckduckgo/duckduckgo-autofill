import { DeviceApi } from '../../../packages/device-api/index.js'
import {createGlobalConfig} from '../../config.js'
import {AppleTransport} from '../../deviceApiCalls/transports/apple.transport.js'
import {AppleDeviceInterface} from '../AppleDeviceInterface.js'
import {Settings} from '../../Settings.js'
import {Form} from '../../Form/Form.js'
import {attachAndReturnGenericForm, attachAndReturnGenericLoginForm} from '../../test-utils.js'
import {createScanner} from '../../Scanner.js'

function storeFormDataSpy () {
    const spy = jest.fn().mockReturnValueOnce(Promise.resolve(null))
    window.webkit = {
        messageHandlers: {
            storeFormData: {
                postMessage: spy
            }
        }
    }
    return spy
}

/** @type {GlobalConfig} */
const APPLE_GLOBAL_CONFIG = {
    ...createGlobalConfig(),
    hasModernWebkitAPI: true,
    isApp: true
}

function createDeviceApi () {
    const transport = new AppleTransport(APPLE_GLOBAL_CONFIG)
    return new DeviceApi(transport)
}

function createDevice () {
    const deviceApi = createDeviceApi()
    const settings = Settings.default(APPLE_GLOBAL_CONFIG, deviceApi)
    settings.setFeatureToggles({
        password_generation: true
    })
    return new AppleDeviceInterface(APPLE_GLOBAL_CONFIG, deviceApi, settings)
}

describe('AppleDeviceInterface: preAttachTooltip', () => {
    it('adds generated password + autogenerated flag to topcontextdata', () => {
        const device = createDevice()
        device.passwordGenerator.generate()
        const formEl = attachAndReturnGenericForm()
        const input = /** @type {HTMLInputElement} */(formEl.querySelector('input'))
        const form = new Form(formEl, input, device)
        /** @type {TopContextData} */
        const inputTopContext = { inputType: 'credentials.password' }
        const expected = {
            inputType: 'credentials.password',
            credentials: [{
                autogenerated: true,
                password: device.passwordGenerator.password,
                username: input.value
            }]
        }
        const actual = device.preAttachTooltip(inputTopContext, input, form)
        expect(actual).toStrictEqual(expected)
    })
    it('does NOT add a password when inputType is not credentials.password', () => {
        const device = createDevice()
        device.passwordGenerator.generate() // this is done just to make the test deterministic
        const formEl = attachAndReturnGenericForm()
        const input = /** @type {HTMLInputElement} */(formEl.querySelector('input'))
        const form = new Form(formEl, input, device)
        /** @type {TopContextData} */
        const inputTopContext = { inputType: 'credentials.username' }
        const expected = { inputType: 'credentials.username' }
        const actual = device.preAttachTooltip(inputTopContext, input, form)
        expect(actual).toStrictEqual(expected)
    })
    it('does NOT add a password when Device does **not** support password generation', () => {
        const deviceApi = createDeviceApi()
        const settings = Settings.default(APPLE_GLOBAL_CONFIG, deviceApi)
        const device = new AppleDeviceInterface(APPLE_GLOBAL_CONFIG, deviceApi, settings)
        const formEl = attachAndReturnGenericForm()
        const input = /** @type {HTMLInputElement} */(formEl.querySelector('input[type=password]'))
        const form = new Form(formEl, input, device)
        /** @type {TopContextData} */
        const inputTopContext = { inputType: 'credentials.password' }
        const expected = { inputType: 'credentials.password' }
        const actual = device.preAttachTooltip(inputTopContext, input, form)
        expect(actual).toStrictEqual(expected)
    })
    it('does NOT add a password when the form is NOT a signup', () => {
        const device = createDevice()
        const formEl = attachAndReturnGenericLoginForm()
        const input = /** @type {HTMLInputElement} */(formEl.querySelector('input[type=password]'))
        const form = new Form(formEl, input, device)
        /** @type {TopContextData} */
        const inputTopContext = {
            inputType: 'credentials.password'
        }
        const expected = {
            inputType: 'credentials.password'
        }
        const actual = device.preAttachTooltip(inputTopContext, input, form)
        expect(actual).toStrictEqual(expected)
    })
})

describe('AppleDeviceInterface: postAutofill', () => {
    let spy
    beforeEach(() => {
        spy = storeFormDataSpy()
    })
    it('performs a save if a generated password was used', async () => {
        const formEl = attachAndReturnGenericForm()
        const device = createDevice()
        const scanner = createScanner(device).findEligibleInputs(document)
        const formClass = /** @type import('../../Form/Form.js').Form */(scanner.forms.get(formEl))
        device.passwordGenerator.generate()
        /** @type {CredentialsObject} */
        const autofillData = {
            autogenerated: true,
            password: 'testPassword',
            username: 'testUsername'
        }
        device.postAutofill(autofillData, 'credentials', formClass)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith({
            credentials: {
                /**
                 * This is the important part of this test.
                 * It ensures that the `autogenerated` is added to the outgoing
                 * message, even though it would have been absent in the form values
                 */
                autogenerated: true,
                password: 'testPassword',
                username: 'testUsername'
            },
            'creditCards': undefined,
            'identities': undefined,
            trigger: 'passwordGeneration',
            'locale': 'unknown',
            messageHandling: {
                'secret': 'PLACEHOLDER_SECRET'
            }
        })
    })
    it('does NOT perform a save when autofill wasn\'t for a generated password', () => {
        const formEl = attachAndReturnGenericForm()
        const device = createDevice()
        const scanner = createScanner(device).findEligibleInputs(document)
        const formClass = /** @type import('../../Form/Form.js').Form */(scanner.forms.get(formEl))
        device.passwordGenerator.generate()
        /** @type {CredentialsObject} */
        const autofillData = {
            password: 'testPassword',
            username: 'testUsername'
        }
        device.postAutofill(autofillData, 'credentials', formClass)
        expect(spy).not.toHaveBeenCalled()
    })
})

describe('AppleDeviceInterface: postSubmit', () => {
    let spy
    beforeEach(() => {
        spy = storeFormDataSpy()
        document.body.innerHTML = '<form><input name="password"/></form>'
    })
    it('DOES NOT perform a save when hasValues() === false', () => {
        const device = createDevice()
        const formElem = document.querySelector('form')
        const input = document.querySelector('input')
        if (!formElem || !input) throw new Error('unreachable')
        const form = new Form(formElem, input, device)
        jest.spyOn(form, 'hasValues').mockReturnValueOnce(false)
        /** @type {DataStorageObject} */
        const formValues = {
            credentials: {
                password: '123456',
                username: '',
                id: ''
            },
            locale: 'en'
        }
        device.postSubmit(formValues, form)
        expect(spy).not.toHaveBeenCalled()
    })
    it('DOES NOT perform a save when `shouldPromptToStoreData` === false', () => {
        const device = createDevice()
        const formElem = document.querySelector('form')
        const input = document.querySelector('input')
        if (!formElem || !input) throw new Error('unreachable')
        const form = new Form(formElem, input, device)
        form.shouldPromptToStoreData = false
        jest.spyOn(form, 'hasValues').mockReturnValueOnce(true)
        /** @type {DataStorageObject} */
        const formValues = {
            credentials: {
                password: '123456',
                username: 'duck@example.com',
                id: ''
            },
            locale: 'en'
        }
        device.postSubmit(formValues, form)
        expect(spy).not.toHaveBeenCalled()
    })
    it('DOES perform a save when a password has been generated, even if `shouldPromptToStoreData` === false ', () => {
        const device = createDevice()
        device.passwordGenerator.generate()

        const formElem = document.querySelector('form')
        const input = document.querySelector('input')

        if (!formElem || !input) throw new Error('unreachable')
        if (!device.passwordGenerator.password) throw new Error('unreachable')

        const form = new Form(formElem, input, device)
        form.shouldPromptToStoreData = false
        jest.spyOn(form, 'hasValues').mockReturnValueOnce(true)

        /** @type {DataStorageObject} */
        const formValues = {
            credentials: {
                password: device.passwordGenerator.password,
                username: 'duck@example.com',
                id: ''
            },
            locale: 'en'
        }
        const expected = {
            credentials: {
                autogenerated: true,
                password: device.passwordGenerator.password,
                username: 'duck@example.com',
                id: ''
            },
            trigger: 'formSubmission',
            messageHandling: {
                'secret': 'PLACEHOLDER_SECRET'
            },
            locale: 'en'
        }
        device.postSubmit(formValues, form)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(expected)
    })
})
