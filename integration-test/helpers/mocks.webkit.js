export const iosContentScopeReplacements = () => {
    return {
        contentScope: {
            features: {
                'autofill': {
                    exceptions: [],
                    state: 'enabled'
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
}

/**
 * @param {{overlay?: boolean}} opts
 * @returns {Partial<Replacements>}
 */
export const macosContentScopeReplacements = (opts = {}) => {
    const { overlay = false } = opts
    return {
        isApp: true,
        hasModernWebkitAPI: true,
        contentScope: {
            features: {
                'autofill': {
                    exceptions: [],
                    state: 'enabled'
                }
            },
            unprotectedTemporary: []
        },
        userUnprotectedDomains: [],
        userPreferences: {
            debug: true,
            platform: {name: 'macos'}
        },
        ...overlay ? macosWithOverlay() : undefined
    }
}

/**
 * @returns {Partial<Replacements>}
 */
export const macosWithOverlay = () => {
    return {
        isTopFrame: false,
        supportsTopFrame: true
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
            /** @type {InboundPMData} */
            success: {
                identities: [],
                credentials: [],
                creditCards: [],
                serializedInputContext: '{}'
            }
        },
        emailHandlerCheckAppSignedInStatus: {
            isAppSignedIn: false
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
        getSelectedCredentials: [{type: 'stop'}],
        pmHandlerStoreData: {},
        pmHandlerGetAutofillCredentials: {
            /** @type {CredentialsObject|null} */
            success: null
        },
        showAutofillParent: {},
        setSize: {}
    }

    /** @type {MockBuilder} */
    const builder = {
        withPrivateEmail (email) {
            webkitBase.emailHandlerCheckAppSignedInStatus.isAppSignedIn = true
            if (platform === 'ios') {
                webkitBase.emailHandlerGetAlias.alias = email
            } else {
                webkitBase.emailHandlerGetAddresses.addresses.privateAddress = email
            }
            return this
        },
        withPersonalEmail (email) {
            webkitBase.emailHandlerCheckAppSignedInStatus.isAppSignedIn = true
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
            /** @type {TopContextData} */
            const topContextData = {inputType: 'credentials.username'}
            webkitBase.pmHandlerGetAutofillInitData.success.serializedInputContext = JSON.stringify(topContextData)
            webkitBase.pmHandlerGetAutofillCredentials.success = credentials
            webkitBase.getSelectedCredentials = [
                {type: 'none'},
                {type: 'none'},
                {type: 'none'},
                {type: 'none'},
                {type: 'none'},
                {type: 'ok', data: credentials, configType: 'credentials'},
                {type: 'stop'}
            ]
            return this
        },
        tap (fn) {
            fn(webkitBase)
            return this
        },
        async applyTo (page) {
            return withMockedWebkit(page, { ...webkitBase })
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
        window.__playwright = { mocks: { calls: [] } }
        window.webkit = {
            messageHandlers: {}
        }

        for (let [msgName, response] of Object.entries(mocks)) {
            window.webkit.messageHandlers[msgName] = {
                postMessage: async (data) => {
                    /** @type {MockCall} */
                    const call = [msgName, data, response]
                    window.__playwright.mocks.calls.push(JSON.parse(JSON.stringify(call)))

                    // This allows mocks to have multiple return values.
                    // It has to be inline here since it's serialized into the page.
                    const isMulti = Array.isArray(response)
                    if (isMulti) {
                        const prevCount = window.__playwright.mocks.calls.filter(([name]) => name === msgName).length
                        const next = response[prevCount]
                        if (next) {
                            return JSON.stringify(next)
                        }
                    }

                    return JSON.stringify(response)
                }
            }
        }
    }, mocks)
}
