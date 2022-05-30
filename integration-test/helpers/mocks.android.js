/**
 * @param {object} [overrides]
 * @param {Partial<FeatureToggles>} [overrides.featureToggles]
 * @param {Partial<AvailableInputTypes>} [overrides.availableInputTypes]
 */
export function androidStringReplacements (overrides = {}) {
    return {
        /** @type {AvailableInputTypes} */
        availableInputTypes: {
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
                        /** @type {FeatureToggles} */
                        featureToggles: {
                            inputType_credentials: true,
                            inputType_identities: false,
                            inputType_creditCards: false,
                            emailProtection: true,
                            password_generation: false,
                            credentials_saving: true,
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
        /** @type {AutofillData|null} */
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
        withAvailableInputTypes (_inputTypes) {
            throw new Error('cannot set mock withAvailableInputTypes on Android, use string replacements instead')
        },
        withIdentity: function () {
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
        tap () {
            return this
        },
        async applyTo (page) {
            return page.evaluate(mocks => {
                window.__playwright = {mocks: {calls: []}}
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
                /**
                 * @param {Names} name
                 * @param {any} request
                 * @param {any} response
                 */
                function respond (name, request, response) {
                    const call = [name, request, response]
                    window.__playwright.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                    window.postMessage(JSON.stringify({
                        type: name + 'Response',
                        success: response
                    }), window.origin)
                }
                // todo(Shane): This is the proposed android API.
                /** @type {MocksObjectAndroid} */
                const mocksObject = {
                    getRuntimeConfiguration () {
                        return respond('getRuntimeConfiguration', null, mocks.getRuntimeConfigurationResponse)
                    },
                    getAvailableInputTypes () {
                        return respond('getAvailableInputTypes', null, mocks.getAvailableInputTypesResponse)
                    },
                    getAutofillData (request) {
                        return respond('getAutofillData', request, mocks.getAutofillData)
                    },
                    storeFormData (request) {
                        /** @type {MockCall} */
                        const call = ['storeFormData', request, mocks.getAutofillData]
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
