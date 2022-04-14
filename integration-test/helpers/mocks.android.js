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
        tap () {
            return this
        },
        async applyTo (page) {
            return page.evaluate(mocks => {
                window.EmailInterface = {
                    showTooltip () {
                        window.postMessage({
                            type: 'getAliasResponse',
                            alias: mocks.address
                        }, window.origin)
                    },
                    getUserData () {
                        return {}
                    },
                    storeCredentials () {
                        return {}
                    }
                }
                // todo(Shane): This is the proposed android API.
                window.BrowserAutofill = {
                    getRuntimeConfiguration () {
                        window.postMessage({
                            type: 'getRuntimeConfigurationResponse',
                            data: mocks.getRuntimeConfigurationResponse
                        }, window.origin)
                    },
                    getAvailableInputTypes () {
                        window.postMessage({
                            type: 'getAvailableInputTypesResponse',
                            data: mocks.getAvailableInputTypesResponse
                        }, window.origin)
                    }
                }
            }, mocks)
        },
        withIdentity: function () {
            throw new Error('Function not implemented.')
        },
        withFeatureToggles (_featureToggles) {
            throw new Error('withFeatureToggles not implemented for android yet')
        },
        withCredentials: function () {
            throw new Error('Function not implemented.')
        }
    }
    return builder
}
