/**
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').RuntimeConfiguration} RuntimeConfiguration
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').GetAutofillDataResponse} GetAutofillDataResponse
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles} AutofillFeatureToggles
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').AvailableInputTypes} AvailableInputTypes
 */
import {createAvailableInputTypes, withDataType} from './utils.js'

/**
 * @param {object} [overrides]
 * @param {Partial<AutofillFeatureToggles>} [overrides.featureToggles]
 * @param {Partial<AvailableInputTypes>} [overrides.availableInputTypes]
 * @return {RuntimeConfiguration}
 */
export function createRuntimeConfiguration (overrides = {}) {
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
 * For example, the following would mock interactions with Android handlers
 * to ensure that it returns { alias: "x" }
 *
 * ```js
 * await createWebkitMocks()
 *     .withPrivateEmail("x")
 *     .applyTo(page)
 * ```
 * @public
 * @returns {MockBuilder}
 */
export function createAndroidMocks () {
    const mocks = {
        getRuntimeConfiguration: createRuntimeConfiguration(),
        /** @type {GetAutofillDataResponse['success']|null} */
        getAutofillData: null,
        showInContextEmailProtectionSignupPrompt: { isSignedIn: true },
        incontextSignupDismissedAt: {},
        /** @type {{alias: string}|null} */
        address: null,
        isSignedIn: ''
    }
    /** @type {MockBuilder} */
    const builder = {
        withRuntimeConfigOverrides (overrides) {
            mocks.getRuntimeConfiguration = createRuntimeConfiguration(overrides)
            return this
        },
        withPrivateEmail (email) {
            email = email.replace('@duck.com', '')
            mocks.address = {alias: email}
            mocks.isSignedIn = 'true'
            return this
        },
        withPersonalEmail (email) {
            email = email.replace('@duck.com', '')
            mocks.address = {alias: email}
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

                class AndroidHandlerMock {
                    constructor (name, response) {
                        this.name = name
                        this.request = null
                        this.response = response
                        this._calls = {
                            getRuntimeConfiguration: mocks.getRuntimeConfiguration,
                            emailProtectionStoreUserData: null,
                            emailProtectionGetUserData: null,
                            emailProtectionGetCapabilities: null,
                            emailProtectionGetAlias: mocks.address,
                            getAutofillData: mocks.getAutofillData,
                            storeFormData: null,
                            getIncontextSignupDismissedAt: mocks.incontextSignupDismissedAt,
                            setIncontextSignupPermanentlyDismissedAt: null,
                            ShowInContextEmailProtectionSignupPrompt: null,
                            closeEmailProtectionTab: null
                        }
                    }
                    postMessage (passedRequest) {
                        const request = JSON.parse(passedRequest)

                        const call = [request.type, request, this._calls[request.type]]

                        if (this._calls[request.type] !== null) {
                            const preparedResponse = {
                                type: request.type,
                                handlerUniqueId: request.handlerUniqueId,
                                success: this._calls[request.type]
                            }

                            this.onMessage({data: JSON.stringify(preparedResponse)})
                            window.__playwright_autofill.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                        } else {
                            // TODO: this conditional is no longer needed.
                            // If we're not waiting for a response, add the call here, otherwise it's added in onMessage
                            window.__playwright_autofill.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                        }
                    }
                }

                window.ddgAndroidAutofillHandler = new AndroidHandlerMock()
            }, mocks)
        }
    }
    return builder
}
