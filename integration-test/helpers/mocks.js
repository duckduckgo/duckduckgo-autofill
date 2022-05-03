/**
 * Try to use this a place to store re-used values across the integration tests.
 */
export const constants = {
    pages: {
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
        pmHandlerStoreData: {},
        pmHandlerGetAutofillCredentials: {
            /** @type {CredentialsObject|null} */
            success: null
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
