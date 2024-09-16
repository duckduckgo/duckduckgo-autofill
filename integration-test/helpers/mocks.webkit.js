import {createAvailableInputTypes, withDataType} from './utils.js'
import {constants} from './mocks.js'

/**
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').GetAutofillDataResponse} GetAutofillDataResponse
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles} AutofillFeatureToggles
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').AvailableInputTypes} AvailableInputTypes
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').AskToUnlockProviderResult} AskToUnlockProviderTypes
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').CheckCredentialsProviderStatusResult} CheckCredentialsProviderStatusTypes
 */

const {personalAddress} = constants.fields.email
const password = '123456'

/**
 * @param {object} [overrides]
 * @param {Partial<AutofillFeatureToggles>} [overrides.featureToggles]
 * @param {Partial<AvailableInputTypes>} [overrides.availableInputTypes]
 */
export const iosContentScopeReplacements = (overrides = {}) => {
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
            platform: { name: 'ios' },
            features: {
                autofill: {
                    settings: {
                        featureToggles: {
                            inlineIcon_credentials: true,
                            ...overrides.featureToggles
                        }
                    }
                }
            }
        },
        availableInputTypes: {
            ...createAvailableInputTypes(overrides.availableInputTypes)
        }
    }
}

/**
 * @param {{
 *      overlay?: boolean,
 *      featureToggles?: AutofillFeatureToggles,
 *      availableInputTypes?: AvailableInputTypes
 *  }} opts
 * @returns {Partial<Replacements>}
 */
export const macosContentScopeReplacements = (opts = {}) => {
    const { overlay = false, featureToggles, availableInputTypes } = opts
    return {
        isApp: true,
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
            platform: { name: 'macos' },
            features: {
                autofill: {
                    settings: {
                        /** @type {AutofillFeatureToggles} */
                        featureToggles: {
                            inputType_credentials: true,
                            inputType_identities: true,
                            inputType_creditCards: true,
                            emailProtection: true,
                            emailProtection_incontext_signup: true,
                            password_generation: true,
                            credentials_saving: true,
                            inlineIcon_credentials: true,
                            ...featureToggles
                        }
                    }
                }
            }
        },
        availableInputTypes: {
            ...createAvailableInputTypes(availableInputTypes)
        },
        ...overlay ? macosWithOverlay() : macosWithoutOverlay()
    }
}

/**
 * @returns {Partial<Replacements>}
 */
export const macosWithOverlay = () => {
    return {
        hasModernWebkitAPI: true,
        isTopFrame: false,
        supportsTopFrame: true
    }
}

/**
 * @returns {Partial<Replacements>}
 */
export const macosWithoutOverlay = () => {
    return {
        hasModernWebkitAPI: false,
        isTopFrame: false,
        supportsTopFrame: false,
        webkitMessageHandlerNames: [
            'emailHandlerStoreToken',
            'emailHandlerRemoveToken',
            'emailHandlerGetAlias',
            'emailHandlerGetUserData',
            'emailHandlerGetCapabilities',
            'emailHandlerRefreshAlias',
            'emailHandlerGetAddresses',
            'emailHandlerCheckAppSignedInStatus',
            'pmHandlerGetAutofillInitData',
            'pmHandlerGetAccounts',
            'pmHandlerGetAutofillCredentials',
            'pmHandlerGetIdentity',
            'pmHandlerGetCreditCard',
            'pmHandlerOpenManageCreditCards',
            'pmHandlerOpenManageIdentities',
            'pmHandlerOpenManagePasswords',
            'getAvailableInputTypes',
            'getRuntimeConfiguration',
            'getAutofillData',
            'storeFormData',
            'setSize',
            'selectedDetail',
            'closeAutofillParent',
            'showAutofillParent',
            'getSelectedCredentials',
            'askToUnlockProvider',
            'checkCredentialsProviderStatus',
            'sendJSPixel',
            'getIncontextSignupDismissedAt',
            'setIncontextSignupPermanentlyDismissedAt',
            'startEmailProtectionSignup',
            'closeEmailProtectionTab',
            'startCredentialsImportFlow'
        ]
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
        pmHandlerGetAutofillCredentials: {
            /** @type {CredentialsObject|null} */
            success: null
        },
        showAutofillParent: {},
        setSize: {},
        // newer ones
        /** @type {null | GetAutofillDataResponse} */
        getAutofillData: null,
        /** @type {null | Record<string, any>} */
        getAvailableInputTypes: null,
        getRuntimeConfiguration: {
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
                        'name': 'macos'
                    },
                    'features': {
                        'autofill': {
                            'settings': {
                                'featureToggles': {
                                    inputType_credentials: true,
                                    inputType_identities: true,
                                    inputType_creditCards: true,
                                    emailProtection: true,
                                    emailProtection_incontext_signup: true,
                                    password_generation: true,
                                    credentials_saving: true,
                                    inlineIcon_credentials: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            }
        },
        storeFormData: null,
        selectedDetail: null,
        /** @type {AskToUnlockProviderTypes | null} */
        askToUnlockProvider: null,
        /** @type {CheckCredentialsProviderStatusTypes[]} */
        checkCredentialsProviderStatus: [],
        sendJSPixel: null,
        pmHandlerOpenManagePasswords: null,
        pmHandlerOpenManageCreditCards: null,
        pmHandlerOpenManageIdentities: null,
        getIncontextSignupDismissedAt: { success: {} },
        setIncontextSignupPermanentlyDismissedAt: null,
        startEmailProtectionSignup: null,
        closeEmailProtectionTab: null,
        startCredentialsImportFlow: {}
    }

    /** @type {MockBuilder<any, webkitBase>} */
    const builder = {
        withRuntimeConfigOverrides: function () {
            throw new Error('Function not implemented.')
        },
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
        withEmailProtection (emails) {
            return this
                .withPrivateEmail(emails.privateAddress)
                .withPersonalEmail(emails.personalAddress)
        },
        withIncontextSignipDismissed () {
            webkitBase.getIncontextSignupDismissedAt.success.permanentlyDismissedAt = 946684800000
            return this
        },
        withIdentity (identity, inputType = 'identities.firstName') {
            webkitBase.pmHandlerGetAutofillInitData.success.identities.push(identity)
            const topContextData = {inputType}
            webkitBase.pmHandlerGetAutofillInitData.success.serializedInputContext = JSON.stringify(topContextData)
            return this
        },
        withCreditCard (creditCard, inputType = 'creditCards.cardNumber') {
            webkitBase.pmHandlerGetAutofillInitData.success.creditCards.push(creditCard)
            const topContextData = {inputType}
            webkitBase.pmHandlerGetAutofillInitData.success.serializedInputContext = JSON.stringify(topContextData)
            return this
        },
        withCredentialsImport (inputType) {
            const topContextData = {
                inputType,
                credentialsImport: true
            }
            webkitBase.pmHandlerGetAutofillInitData.success.serializedInputContext = JSON.stringify(topContextData)
            return this
        },
        withCredentials: function (credentials, inputType = 'credentials.username') {
            webkitBase.pmHandlerGetAutofillInitData.success.credentials.push(credentials)
            /** @type {TopContextData} */
            const topContextData = {inputType}
            webkitBase.pmHandlerGetAutofillInitData.success.serializedInputContext = JSON.stringify(topContextData)
            webkitBase.pmHandlerGetAutofillCredentials.success = credentials
            webkitBase.getAutofillData = { success: { credentials, action: 'fill' } }
            webkitBase.getSelectedCredentials = [
                // Simulates macOS overlay polling. This means the user hasn't
                // selected anything for 5 polls, then selects.
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
        withDataType: function (data) {
            return withDataType(this, data)
        },
        withAvailableInputTypes: function (inputTypes) {
            webkitBase.getAvailableInputTypes = {success: inputTypes}
            return this
        },
        withFeatureToggles: function (featureToggles) {
            Object.assign(webkitBase.getRuntimeConfiguration.success.userPreferences.features.autofill.settings.featureToggles, featureToggles)
            return this
        },
        withAskToUnlockProvider: function () {
            webkitBase.askToUnlockProvider = {
                success: {
                    status: 'unlocked',
                    credentials: [{
                        id: '2',
                        password: '',
                        username: constants.fields.email.personalAddress,
                        credentialsProvider: 'bitwarden'
                    }],
                    availableInputTypes: createAvailableInputTypes()
                }
            }
            return this
        },
        withCheckCredentialsProviderStatus: function () {
            webkitBase.checkCredentialsProviderStatus = [
                {
                    // unlocked with no credentials available
                    success: {
                        status: 'unlocked',
                        credentials: [],
                        availableInputTypes: {credentials: {password: false, username: false}}
                    }
                },
                {
                    // unlocked with credentials available
                    success: {
                        status: 'unlocked',
                        credentials: [
                            {id: '3', password: password, username: personalAddress, credentialsProvider: 'bitwarden'}
                        ],
                        availableInputTypes: {credentials: {password: true, username: true}}
                    }
                },
                {
                    // unlocked with only a password field
                    success: {
                        status: 'unlocked',
                        credentials: [
                            {id: '3', password: password, username: '', credentialsProvider: 'bitwarden'}
                        ],
                        availableInputTypes: {credentials: {password: true, username: false}}
                    }
                },
                {
                    // back to being locked
                    success: {
                        status: 'locked',
                        credentials: [
                            {id: 'provider_locked', password: '', username: ''}
                        ],
                        availableInputTypes: {credentials: {password: true, username: true}}
                    }
                }
            ]
            return this
        },
        tap (fn) {
            fn(webkitBase)
            return this
        },
        async applyTo (page) {
            if (webkitBase.getAvailableInputTypes === null) {
                webkitBase.getAvailableInputTypes = {success: {}}
            }
            return withMockedWebkit(page, { ...webkitBase })
        },
        /**
         * @param {(keyof webkitBase)[]} handlers
         * @returns {builder}
         */
        removeHandlers: function (handlers) {
            const keys = Object.keys(webkitBase)
            for (let handler of handlers) {
                if (!keys.includes(handler)) {
                    throw new Error('webkit mock did not exist for ' + handler)
                }
                delete webkitBase[handler]
            }
            return this
        }
    }

    return builder
}

/**
 * This will mock webkit handlers based on the key-values you provide
 *
 * @private
 * @param {import("@playwright/test").Page} page
 * @param {Record<string, any>} mocks
 */
async function withMockedWebkit (page, mocks) {
    await page.addInitScript((mocks) => {
        window.__playwright_autofill = { mocks: { calls: [] } }
        window.webkit = {
            messageHandlers: {}
        }
        for (let [msgName, response] of Object.entries(mocks)) {
            window.webkit.messageHandlers[msgName] = {
                /**
                 * @param {any} data
                 * @return {Promise<string|undefined>}
                 */
                postMessage: async (data) => {
                    /** @type {MockCall} */
                    const call = [msgName, data, response]
                    let thisResponse = response
                    window.__playwright_autofill.mocks.calls.push(JSON.parse(JSON.stringify(call)))

                    // This allows mocks to have multiple return values.
                    // It has to be inline here since it's serialized into the page.
                    const isMulti = Array.isArray(response)
                    if (isMulti) {
                        const prevCount = window.__playwright_autofill.mocks.calls.filter(([name]) => name === msgName).length
                        const next = response[prevCount - 1]
                        if (next) {
                            thisResponse = next
                        }
                    }

                    // If `data.messageHandling.methodName` exists, this means we're trying to use encryption
                    // therefor we mimic what happens on the native side by calling the relevant window method
                    // with the encrypted data
                    const fn = window[data.messageHandling.methodName]
                    if (typeof fn === 'function') {
                        // @ts-ignore
                        fn(encryptResponse(data, thisResponse))
                        return
                    }

                    return JSON.stringify(thisResponse)
                }
            }
        }

        /**
         * @param {{
         *     "messageHandling": {
         *         "methodName": string,
         *         "secret": string,
         *         "key": number[],
         *         "iv": number[],
         *     },
         *     [index: string]: any,
         * }} message - the incoming message. The encryption parts are within `messageHandling`
         * @param {Record<string, any>} response - the data that will be encrypted and returned back to the page
         * @returns {Promise<{ciphertext: *[], tag: *[]}>}
         */
        async function encryptResponse (message, response) {
            /**
             * Create a `CryptoKey` based on the incoming message's 'key' field
             * @type {CryptoKey}
             */
            const keyEncoded = await crypto.subtle.importKey(
                'raw',
                new Uint8Array(message.messageHandling.key),
                'AES-GCM',
                false,
                ['encrypt', 'decrypt']
            )

            /**
             * Encode the response JSON
             */
            const enc = new TextEncoder()
            const encodedJson = enc.encode(JSON.stringify(response))

            /**
             * Encrypt the JSON string
             */
            const encryptedContent = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: new Uint8Array(message.messageHandling.iv)
                },
                keyEncoded,
                encodedJson
            )

            /**
             * Now return the encrypted data in the same shape that the native side would
             */
            return {
                ciphertext: [...new Uint8Array(encryptedContent)],
                tag: []
            }
        }
    }, mocks)
}
