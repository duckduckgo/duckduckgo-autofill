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
        getRuntimeConfigurationResponse: {
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
                            featureToggles: {
                                inputType_credentials: true,
                                inputType_identities: false,
                                inputType_creditCards: false,
                                emailProtection: true,
                                password_generation: false,
                                credentials_saving: true
                            }
                        }
                    }
                }
            }
        },
        getAvailableInputTypesResponse: {
            credentials: true,
            email: true
        },
        /** @type {IdentityObject|CredentialsObject|CreditCardObject|null} */
        getAutofillData: null,
        /** @type {string|null} */
        address: null
    }
    /** @type {MockBuilder} */
    const builder = {
        withPrivateEmail (email) {
            mocks.address = email
            return this
        },
        withPersonalEmail (email) {
            mocks.address = email
            return this
        },
        withAvailableInputTypes (inputTypes) {
            mocks.inputTypes = inputTypes
            return this
        },
        withIdentity: function () {
            throw new Error('Function not implemented.')
        },
        withFeatureToggles (_featureToggles) {
            throw new Error('withFeatureToggles not implemented for android yet')
        },
        /**
         * @param credentials
         * @returns {MockBuilder}
         */
        withCredentials: function (credentials) {
            mocks.getAutofillData = credentials
            return this
        },
        tap () {
            return this
        },
        async applyTo (page) {
            return page.evaluate(mocks => {
                window.__playwright = { mocks: { calls: [] } }
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
                        return ''
                    }
                }
                // todo(Shane): This is the proposed android API.
                /** @type {MocksObjectAndroid} */
                const mocksObject = {
                    getRuntimeConfiguration () {
                        return JSON.stringify({
                            success: mocks.getRuntimeConfigurationResponse
                        })
                    },
                    getAvailableInputTypes () {
                        return JSON.stringify({
                            success: mocks.getAvailableInputTypesResponse
                        })
                    },
                    getAutofillData (data) {
                        const call = ['getAutofillData', data, mocks.getAutofillData]
                        window.__playwright.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                        window.postMessage({
                            type: 'getAutofillDataResponse',
                            success: mocks.getAutofillData
                        }, window.origin)
                    },
                    storeFormData (data) {
                        /** @type {MockCall} */
                        const call = ['storeFormData', data, mocks.getAutofillData]
                        window.__playwright.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                    }
                }
                // @ts-ignore
                window.BrowserAutofill = mocksObject
            }, mocks)
        }
    }
    return builder
}
