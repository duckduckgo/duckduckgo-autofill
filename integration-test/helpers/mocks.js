/**
 * Try to use this a place to store re-used values across the integration tests.
 */
export const constants = {
    pages: {
        'login+setup': 'login+signup.html',
        'email-autofill': 'email-autofill.html',
        'signup': 'signup.html',
        'login': 'login.html'
    },
    fields: {
        email: {
            personalAddress: `shane-123@duck.com`,
            privateAddress0: '0@duck.com',
            selectors: {
                identity: '[data-ddg-inputtype="identities.emailAddress"]'
            }
        }
    },
}

export const defaultIOSReplacements = {
    contentScope: {
        features: {
            'autofill': {
                exceptions: [],
                state: 'enabled',
            }
        },
        unprotectedTemporary: []
    },
    userUnprotectedDomains: [],
    userPreferences: {
        debug: true,
        platform: {name: 'ios'}
    }
}
export const defaultMacosReplacements = {
    contentScope: {
        features: {
            'autofill': {
                exceptions: [],
                state: 'enabled',
            }
        },
        unprotectedTemporary: []
    },
    userUnprotectedDomains: [],
    userPreferences: {
        debug: true,
        platform: {name: 'macos'}
    }
}

/**
 * Use this to mock webkit message handlers.
 *
 * For example, the following would mock the message 'emailHandlerGetAddresses'
 * and ensure that it returns  { addresses: { privateAddress: "x", personalAddress: "y" } }
 *
 * ```js
 * await createWebkitMocks()
 *     .withPrivateEmail("x")
 *     .withPersonalEmail("y")
 *     .applyTo(page)
 * ```
 * @public
 * @param {"macos" | "ios"} platform
 * @returns {MockBuilder}
 */
export function createWebkitMocks (platform = 'macos') {
    /**
     * Note: this will be mutated
     */
    const webkitBase = {
        pmHandlerGetAutofillInitData: {
            /** @type {PMData} */
            success: {
                identities: [],
                credentials: [],
                creditCards: []
            }
        },
        emailHandlerCheckAppSignedInStatus: {
            isAppSignedIn: true
        },
        emailHandlerGetAddresses: {
            /** @type {EmailAddresses} */
            addresses: {
                personalAddress: '',
                privateAddress: ''
            }
        },
        emailHandlerRefreshAlias: null,
        emailHandlerGetAlias: {
            /** @type {string|null} */
            alias: null
        },
        closeAutofillParent: {},
        getSelectedCredentials: {type: 'none'},

        pmHandlerGetAutofillCredentials: {
            /** @type {CredentialsObject|null} */
            success: null
        },
        getAvailableInputTypes: {
            /** @type {AvailableInputTypes|null} */
            success: {}
        }
    }

    /** @type {MockBuilder} */
    const builder = {
        withPrivateEmail (email) {
            if (platform === 'ios') {
                webkitBase.emailHandlerGetAlias.alias = email
            } else {
                webkitBase.emailHandlerGetAddresses.addresses.privateAddress = email
            }
            return this
        },
        withPersonalEmail (email) {
            if (platform === 'ios') {
                webkitBase.emailHandlerGetAlias.alias = email
            } else {
                webkitBase.emailHandlerGetAddresses.addresses.personalAddress = email
            }
            return this
        },
        withIdentity (identity) {
            webkitBase.pmHandlerGetAutofillInitData.success.identities.push(identity)
            return this
        },
        withCredentials: function (credentials) {
            webkitBase.pmHandlerGetAutofillInitData.success.credentials.push(credentials)
            webkitBase.pmHandlerGetAutofillCredentials.success = credentials
            return this
        },
        withAvailableInputTypes: function (inputTypes) {
            webkitBase.getAvailableInputTypes.success = inputTypes
            return this
        },
        tap (fn) {
            fn(webkitBase)
            return this
        },
        async applyTo (page) {
            return withMockedWebkit(page, webkitBase)
        }
    }

    return builder
}

/**
 * This will mock webkit handlers based on the key-values you provide
 *
 * @private
 * @param {import('playwright').Page} page
 * @param {Record<string, any>} mocks
 */
async function withMockedWebkit (page, mocks) {
    await page.addInitScript((mocks) => {
        window.webkit = {
            messageHandlers: {}
        }

        for (let [msgName, response] of Object.entries(mocks)) {
            window.webkit.messageHandlers[msgName] = {
                postMessage: async () => {
                    return JSON.stringify(response)
                }
            }
        }
    }, mocks)
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
    /** @type {string|null} */
    let address = null
    /** @type {AvailableInputTypes|null} */
        // @ts-ignore
    let inputTypes = null
    /** @type {MockBuilder} */
    const builder = {
        withPrivateEmail (email) {
            address = email
            return this
        },
        withPersonalEmail (email) {
            address = email
            return this
        },
        withAvailableInputTypes (_inputTypes) {
            inputTypes = _inputTypes
            return this
        },
        tap () {
            return this
        },
        async applyTo (page) {
            return page.evaluate(personalAddress => {
                window.EmailInterface = {
                    showTooltip () {
                        window.postMessage({
                            type: 'getAliasResponse',
                            alias: personalAddress
                        }, window.origin)
                    },
                    getUserData () {
                        return {}
                    },
                    storeCredentials () {
                        return {}
                    }
                }
                window.BrowserAutofill = {
                    getRuntimeConfiguration () {
                        window.postMessage({
                            type: 'getRuntimeConfigurationResponse',
                            success: {
                                'contentScope': {
                                    'features': {
                                        'autofill': {
                                            'state': 'enabled',
                                            'exceptions': []
                                        }
                                    },
                                    'unprotectedTemporary': []
                                },
                                'userUnprotectedDomains': [],
                                'userPreferences': {
                                    'debug': false,
                                    'platform': {
                                        'name': 'android'
                                    },
                                    'features': {
                                        'autofill': {
                                            'settings': {
                                                'featureToggles': {
                                                    'inputType_credentials': true,
                                                    'inputType_identities': false,
                                                    'inputType_creditCards': false,
                                                    'emailProtection': true,
                                                    'password_generation': false,
                                                    'credentials_saving': true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }, window.origin)
                    },
                    getAvailableInputTypes() {
                        window.postMessage({
                            type: 'getAvailableInputTypesResponse',
                            success: {
                                credentials: true,
                                email: true,
                            }
                        }, window.origin)

                    }
                }
            }, address)
        },
        withIdentity: function () {
            throw new Error('Function not implemented.')
        },
        withCredentials: function () {
            throw new Error('Function not implemented.')
        }
    }
    return builder
}
