/**
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').GetAutofillDataResponse} GetAutofillDataResponse
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles} AutofillFeatureToggles
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').AvailableInputTypes} AvailableInputTypes
 */
import {createAvailableInputTypes, withDataType} from './utils.js'

/**
 * @param {object} [overrides]
 * @param {Partial<AutofillFeatureToggles>} [overrides.featureToggles]
 * @param {Partial<AvailableInputTypes>} [overrides.availableInputTypes]
 */
export function androidStringReplacements (overrides = {}) {
    return {
        /** @type {AvailableInputTypes} */
        availableInputTypes: {
            ...createAvailableInputTypes({
                credentials: {username: true, password: true},
                email: true
            }),
            ...overrides.availableInputTypes
        },
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
            debug: false,
            platform: {
                name: 'android'
            },
            features: {
                autofill: {
                    settings: {
                        /** @type {AutofillFeatureToggles} */
                        featureToggles: {
                            inputType_credentials: true,
                            inputType_identities: false,
                            inputType_creditCards: false,
                            emailProtection: true,
                            emailProtection_incontext_signup: true,
                            password_generation: false,
                            credentials_saving: true,
                            inlineIcon_credentials: true,
                            ...overrides.featureToggles
                        }
                    }
                }
            }
        }
    }
}

/**
 * Use this to mock android message handlers.
 *
 * For example, the following would mock interactions with window.postMessage
 * to ensure that it returns { alias: "x" }
 *
 * ```js
 * await createWebkitMocks()
 *     .withPrivateEmail("x")
 *     .withPersonalEmail("y")
 *     .applyTo(page)
 * ```
 * @public
 * @returns {MockBuilder}
 */
export function createAndroidMocks () {
    const mocks = {
        /** @type {GetAutofillDataResponse['success']|null} */
        getAutofillData: null,
        showInContextEmailProtectionSignupPrompt: { isSignedIn: true },
        incontextSignupDismissedAt: {},
        /** @type {string|null} */
        address: null,
        isSignedIn: ''
    }
    /** @type {MockBuilder} */
    const builder = {
        withPrivateEmail (email) {
            mocks.address = email
            mocks.isSignedIn = 'true'
            return this
        },
        withPersonalEmail (email) {
            mocks.address = email
            mocks.isSignedIn = 'true'
            return this
        },
        withEmailProtection (emails) {
            return this
                .withPrivateEmail(emails.privateAddress)
                .withPersonalEmail(emails.personalAddress)
        },
        withIncontextSignipDismissed () {
            throw new Error('Function not implemented.')
        },
        withAvailableInputTypes (_inputTypes) {
            throw new Error('cannot set mock withAvailableInputTypes on Android, use string replacements instead')
        },
        withIdentity: function () {
            throw new Error('Function not implemented.')
        },
        withCreditCard: function () {
            throw new Error('Function not implemented.')
        },
        withFeatureToggles (_featureToggles) {
            throw new Error('cannot set mock withFeatureToggles on Android, use string replacements instead')
        },
        /**
         * @param credentials
         * @returns {MockBuilder}
         */
        withCredentials: function (credentials) {
            mocks.getAutofillData = {
                action: 'fill',
                credentials
            }
            return this
        },
        /**
         * @returns {MockBuilder}
         */
        withPasswordDecision: function (choice) {
            if (choice === 'accept') {
                mocks.getAutofillData = {
                    action: 'acceptGeneratedPassword'
                }
            } else if (choice === 'reject') {
                mocks.getAutofillData = {
                    action: 'rejectGeneratedPassword'
                }
            } else {
                mocks.getAutofillData = { action: 'none' }
            }
            return this
        },
        withDataType: function (data) {
            return withDataType(this, data)
        },
        withCheckCredentialsProviderStatus: function () {
            return this
        },
        tap () {
            return this
        },
        async applyTo (page) {
            return page.evaluate(mocks => {
                window.__playwright_autofill = {mocks: {calls: []}}
                window.EmailInterface = {
                    showTooltip () {
                        window.postMessage({
                            type: 'getAliasResponse',
                            alias: mocks.address
                        }, window.origin)
                    },
                    getUserData () {
                        return ''
                    },
                    storeCredentials () {
                        return ''
                    },
                    isSignedIn () {
                        return mocks.isSignedIn
                    },
                    getDeviceCapabilities () {
                        return ''
                    },
                    removeCredentials () {
                        window.postMessage({
                            emailProtectionSignedOut: true
                        }, window.origin)
                    }
                }

                /**
                 * @param {string} name
                 * @param {any} request
                 * @param {any} response
                 */
                function respond (name, request, response) {
                    const call = [name, request, response]
                    window.__playwright_autofill.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                    window.postMessage(JSON.stringify({
                        type: name + 'Response',
                        success: response
                    }), window.origin)
                }

                window.BrowserAutofill = {
                    getAutofillData (request) {
                        return respond('getAutofillData', request, mocks.getAutofillData)
                    },
                    storeFormData (request) {
                        /** @type {MockCall} */
                        const call = ['storeFormData', request, mocks.getAutofillData]
                        window.__playwright_autofill.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                    },
                    showInContextEmailProtectionSignupPrompt (request) {
                        return respond('ShowInContextEmailProtectionSignupPrompt', request, mocks.showInContextEmailProtectionSignupPrompt)
                    },
                    getIncontextSignupDismissedAt (request) {
                        const call = ['getIncontextSignupDismissedAt', request, mocks.incontextSignupDismissedAt]
                        window.__playwright_autofill.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                        window.postMessage(JSON.stringify({
                            type: 'getIncontextSignupDismissedAt',
                            success: mocks.incontextSignupDismissedAt
                        }), window.origin)
                    },
                    setIncontextSignupPermanentlyDismissedAt (request) {
                        const call = ['setIncontextSignupPermanentlyDismissedAt', request]
                        window.__playwright_autofill.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                    },
                    startEmailProtectionSignup (request) {
                        const call = ['startEmailProtectionSignup', request]
                        window.__playwright_autofill.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                    },
                    closeEmailProtectionTab (request) {
                        const call = ['closeEmailProtectionTab', request]
                        window.__playwright_autofill.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                    }
                }
            }, mocks)
        },
        removeHandlers: function (handlers) {
            const keys = Object.keys(mocks)
            for (let handler of handlers) {
                // @ts-ignore
                if (!keys.includes(handler)) {
                    // @ts-ignore
                    throw new Error('android mock did not exist for ' + handler)
                }
                delete mocks[handler]
            }
            return this
        }
    }
    return builder
}
