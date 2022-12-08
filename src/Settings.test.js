import { DeviceApi } from '../packages/device-api/index.js'
import { createGlobalConfig } from './config.js'
import { Settings } from './Settings.js'
import {GetAvailableInputTypesCall, GetRuntimeConfigurationCall} from './deviceApiCalls/__generated__/deviceApiCalls.js'

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

describe('Settings', () => {
    it('feature toggles + input types combinations ', async () => {
    /** @type {[import("./Settings").AutofillFeatureToggles, import("./Settings").AvailableInputTypes, (settings: Settings) => void][]} */
        const cases = [
            [
                { inputType_credentials: true },
                {
                    ...createAvailableInputTypes({
                        credentials: {username: true, password: true}
                    })
                },
                async (settings) => {
                    expect(await settings.canAutofillType('credentials', 'password')).toBe(true)
                }
            ],
            [
                { inputType_credentials: false },
                {
                    ...createAvailableInputTypes({
                        credentials: {username: true, password: true}
                    })
                },
                async (settings) => {
                    expect(await settings.canAutofillType('credentials', 'password')).toBe(false)
                }
            ],
            [
                {},
                {
                    ...createAvailableInputTypes({
                        credentials: {username: true, password: true}
                    })
                },
                async (settings) => {
                    expect(await settings.canAutofillType('credentials', 'password')).toBe(false)
                }
            ],
            [
                { inputType_identities: true },
                {
                    ...createAvailableInputTypes({
                        identities: {firstName: true, lastName: true}
                    })
                },
                async (settings) => {
                    expect(await settings.canAutofillType('identities', 'fullName')).toBe(true)
                }
            ],
            [
                { inputType_identities: true },
                {
                    ...createAvailableInputTypes({
                        identities: {firstName: false, lastName: false}
                    })
                },
                async (settings) => {
                    expect(await settings.canAutofillType('identities', 'fullName')).toBe(false)
                }
            ],
            [
                { emailProtection: true },
                {
                    ...createAvailableInputTypes({
                        identities: {emailAddress: true}
                    })
                },
                async (settings) => {
                    expect(await settings.canAutofillType('identities', 'emailAddress')).toBe(true)
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
