import { DeviceApi } from '../packages/device-api/index.js'
import { createGlobalConfig } from './config.js'
import { Settings } from './Settings.js'
import {
    GetAvailableInputTypesCall,
    GetRuntimeConfigurationCall
} from './deviceApiCalls/__generated__/deviceApiCalls.js'

describe('Settings', () => {
    it('feature toggles + input types combinations ', async () => {
    /** @type {[import("./Settings").AutofillFeatureToggles, import("./Settings").AvailableInputTypes, (settings: Settings) => void][]} */
        const cases = [
            [
                { inputType_credentials: true },
                { credentials: true },
                (settings) => {
                    expect(settings.availableInputTypes.credentials).toBe(true)
                }
            ],
            [
                { inputType_credentials: false },
                { credentials: true },
                (settings) => {
                    expect(settings.availableInputTypes.credentials).toBe(false)
                }
            ],
            [
                {},
                { credentials: true },
                (settings) => {
                    expect(settings.availableInputTypes.credentials).toBe(false)
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
        expect(settings.availableInputTypes).toMatchInlineSnapshot(`
      {
        "credentials": false,
        "creditCards": false,
        "email": false,
        "identities": false,
      }
    `)
        expect(settings.featureToggles).toMatchInlineSnapshot(`
      {
        "credentials_saving": false,
        "emailProtection": false,
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
    const resp2 = new GetAvailableInputTypesCall(null).result({
        success: availableInputTypes
    })
    const deviceApi = new DeviceApi({
        async send (call) {
            if (call instanceof GetRuntimeConfigurationCall) {
                return resp1
            }
            if (call instanceof GetAvailableInputTypesCall) {
                return resp2
            }
        }
    })
    const settings = new Settings(createGlobalConfig(), deviceApi)
    await settings.refresh()
    return settings
}
