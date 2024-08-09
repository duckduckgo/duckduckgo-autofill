import { DeviceApi } from '../packages/device-api/index.js'
import { createGlobalConfig } from './config.js'
import { Settings } from './Settings.js'
import {GetAvailableInputTypesCall, GetRuntimeConfigurationCall} from './deviceApiCalls/__generated__/deviceApiCalls.js'
import InterfacePrototype from './DeviceInterface/InterfacePrototype.js'
import { InContextSignup } from './InContextSignup.js'

const createAvailableInputTypes = (overrides) => {
    const base = Settings.defaults.availableInputTypes
    return {
        ...base,
        ...overrides
    }
}

const createGlobalConfigWithDefaults = (defaults) => {
    return {
        ...createGlobalConfig(),
        ...defaults
    }
}

jest.mock('./InContextSignup.js')

describe('Settings', () => {
    it('feature toggles + input types combinations ', async () => {
        const inContextSignupMock = new InContextSignup(InterfacePrototype.default())

        /** @type {[import("./Settings").AutofillFeatureToggles, import("./Settings").AvailableInputTypes, (settings: Settings) => void][]} */
        const cases = [
            [
                { inputType_credentials: true },
                {
                    ...createAvailableInputTypes({
                        credentials: {username: true, password: true}
                    })
                },
                (settings) => {
                    expect(settings.canAutofillType({ mainType: 'credentials', subtype: 'password', variant: 'current' }, null)).toBe(true)
                }
            ],
            [
                { inputType_credentials: false },
                {
                    ...createAvailableInputTypes({
                        credentials: {username: true, password: true}
                    })
                },
                (settings) => {
                    expect(settings.canAutofillType({ mainType: 'credentials', subtype: 'password', variant: 'current' }, null)).toBe(false)
                }
            ],
            [
                { password_generation: false },
                {
                    ...createAvailableInputTypes({
                        credentials: {username: true, password: true}
                    })
                },
                (settings) => {
                    expect(settings.canAutofillType({ mainType: 'credentials', subtype: 'password', variant: 'new' }, null)).toBe(false)
                }
            ],
            [
                {},
                {
                    ...createAvailableInputTypes({
                        credentials: {username: true, password: true}
                    })
                },
                (settings) => {
                    expect(settings.canAutofillType({ mainType: 'credentials', subtype: 'password', variant: 'current' }, null)).toBe(false)
                }
            ],
            [
                { inputType_identities: true },
                {
                    ...createAvailableInputTypes({
                        identities: {firstName: true, lastName: true}
                    })
                },
                (settings) => {
                    expect(settings.canAutofillType({ mainType: 'identities', subtype: 'fullName', variant: '' }, null)).toBe(true)
                }
            ],
            [
                { inputType_identities: true },
                {
                    ...createAvailableInputTypes({
                        identities: {firstName: false, lastName: false}
                    })
                },
                (settings) => {
                    expect(settings.canAutofillType({ mainType: 'identities', subtype: 'fullName', variant: '' }, null)).toBe(false)
                }
            ],
            [
                { emailProtection: true },
                {
                    ...createAvailableInputTypes({
                        identities: {emailAddress: true}
                    })
                },
                (settings) => {
                    expect(settings.canAutofillType({ mainType: 'identities', subtype: 'emailAddress', variant: '' }, null)).toBe(true)
                }
            ],
            [
                {},
                {
                    ...createAvailableInputTypes()
                },
                (settings) => {
                    // @ts-ignore
                    inContextSignupMock.isAvailable.mockReturnValue(true)
                    expect(settings.canAutofillType({ mainType: 'identities', subtype: 'emailAddress', variant: '' }, inContextSignupMock)).toBe(true)
                }
            ]
        ]
        for (let [toggles, types, fn] of cases) {
            const settings = await settingsFromMockedCalls(toggles, types)
            fn(settings)
        }
    })
    it('handles errors in transport (falling back to defaults)', async () => {
        const deviceApi = new DeviceApi({
            async send (_call) {
                throw new Error('oops!')
            }
        })
        const settings = new Settings(createGlobalConfig(), deviceApi)
        await settings.refresh()
        expect(settings.availableInputTypes).toMatchObject(Settings.defaults.availableInputTypes)
        expect(settings.featureToggles).toMatchInlineSnapshot(`
      {
        "credentials_saving": false,
        "emailProtection": false,
        "emailProtection_incontext_signup": false,
        "inlineIcon_credentials": false,
        "inputType_credentials": false,
        "inputType_creditCards": false,
        "inputType_identities": false,
        "password_generation": false,
        "unknown_username_categorization": false,
      }
    `)
    })
})

/**
 * @param {import("./Settings").AutofillFeatureToggles} featureToggles
 * @param {import("./Settings").AvailableInputTypes} availableInputTypes
 */
async function settingsFromMockedCalls (featureToggles, availableInputTypes) {
    const resp1 = new GetRuntimeConfigurationCall(null).result({
        success: {
            contentScope: {
                features: {
                    autofill: {
                        state: 'enabled',
                        exceptions: []
                    }
                },
                unprotectedTemporary: []
            },
            userUnprotectedDomains: [],
            userPreferences: {
                platform: { name: 'ios' },
                debug: true,
                features: {
                    autofill: { settings: { featureToggles: featureToggles } }
                }
            }
        }
    })
    const deviceApi = new DeviceApi({
        async send (call) {
            if (call instanceof GetRuntimeConfigurationCall) {
                return resp1
            }
            if (call instanceof GetAvailableInputTypesCall) {
                return {
                    success: availableInputTypes
                }
            }
        }
    })
    const globalConfig = createGlobalConfigWithDefaults({
        availableInputTypes: createAvailableInputTypes(availableInputTypes)
    })
    const settings = new Settings(globalConfig, deviceApi)
    await settings.refresh()
    return settings
}
