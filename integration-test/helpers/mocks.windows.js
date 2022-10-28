import {createAvailableInputTypes} from "./utils.js";

/**
 * @typedef {import("../../src/deviceApiCalls/__generated__/validators-ts").AutofillFeatureToggles} AutofillFeatureToggles
 * @typedef {import("../../src/deviceApiCalls/__generated__/validators-ts").AvailableInputTypes} AvailableInputTypes
 * @typedef {import("../../src/deviceApiCalls/__generated__/validators-ts").GetAutofillDataResponse} GetAutofillDataResponse
 *
 * Use this to mock windows message handlers
 *
 * For example, the following would mock interactions with window.postMessage
 * to ensure that it returns { alias: "x" }
 *
 * ```js
 * await createWindowsMocks()
 *     .withPrivateEmail("x")
 *     .withPersonalEmail("y")
 *     .applyTo(page)
 * ```
 * @public
 * @returns {MockBuilder}
 */
export function createWindowsMocks () {
    const mocks = {
        getRuntimeConfiguration: {
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
                    'name': 'windows'
                },
                'features': {
                    'autofill': {
                        'settings': {
                            'featureToggles': {
                                'inputType_credentials': true,
                                'inputType_identities': false,
                                'inputType_creditCards': false,
                                'emailProtection': false,
                                'password_generation': false,
                                'credentials_saving': true
                            }
                        }
                    }
                }
            },
            availableInputTypes: {
                ...createAvailableInputTypes()
            }
        },
        /** @type {null | {success: AvailableInputTypes}} */
        getAvailableInputTypes: null,
        /** @type {InboundPMData} */
        getAutofillInitData: {
            credentials: [],
            creditCards: [],
            identities: [],
            serializedInputContext: '{}'
        },
        /** @type {CredentialsObject | null} */
        getAutofillCredentials: null,
        /** @type {null | GetAutofillDataResponse['success']} */
        getAutofillData: null

    }
    /** @type {MockBuilder} */
    const builder = {
        withPrivateEmail (_email) {
            return this
        },
        withPersonalEmail (_email) {
            return this
        },
        withAvailableInputTypes (inputTypes) {
            mocks.getAvailableInputTypes = {success: inputTypes}
            return this
        },
        /**
          * @param {AutofillFeatureToggles} featureToggles
         */
        withFeatureToggles (featureToggles) {
            Object.assign(mocks.getRuntimeConfiguration.userPreferences.features.autofill.settings.featureToggles, featureToggles)
            return this
        },
        /**
         * @param {'enabled' | 'disabled'} state
         * @returns {builder}
         */
        withRemoteAutofillState (state) {
            mocks.getRuntimeConfiguration.contentScope.features.autofill.state = state
            return this
        },
        withIdentity: function () {
            throw new Error('Function not implemented.')
        },
        withCredentials: function (credentials) {
            mocks.getAutofillInitData.credentials.push(credentials)
            mocks.getAutofillCredentials = credentials
            /** @type {TopContextData} */
            const topContextData = {inputType: 'credentials.username'}
            mocks.getAutofillInitData.serializedInputContext = JSON.stringify(topContextData)
            mocks.getAutofillData = { credentials, action: 'fill' }
            return this
        },
        tap () {
            return this
        },
        async applyTo (page) {
            return page.evaluate(mocks => {
                window.__playwright = { mocks: { calls: [] } }
                const listeners = []

                function recordCall (name, request, response) {
                    const call = [name, request, response]
                    window.__playwright.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                }
                /**
                 * @param {any} request
                 * @param {any} response
                 */
                function respond (name, request, response) {
                    const call = [name, request, response]
                    window.__playwright.mocks.calls.push(JSON.parse(JSON.stringify(call)))
                    setTimeout(() => {
                        for (let listener of listeners) {
                            listener({
                                origin: window.origin,
                                data: {
                                    type: name + 'Response',
                                    success: response
                                }
                            })
                        }
                    }, 0)
                }

                /**
                 * @type {Record<string, (msg: WindowsMessageFormat) => void>}
                 */
                const mocksObject = {
                    getRuntimeConfiguration (input) {
                        recordCall(input.Name, null, mocks.getRuntimeConfiguration)
                        return respond(input.Name, null, mocks.getRuntimeConfiguration)
                    },
                    getAvailableInputTypes (input) {
                        recordCall(input.Name, null, mocks.getAvailableInputTypes)
                        return respond(input.Name, null, mocks.getAvailableInputTypes)
                    },
                    closeAutofillParent (input) {
                        recordCall(input.Name, null, null)
                    },
                    getAutofillData (input) {
                        recordCall(input.Name, input.Data, mocks.getAutofillData)
                        return respond(input.Name, input.Data, mocks.getAutofillData)
                    },
                    storeFormData (request) {
                        recordCall(request.Name, request, null)
                    },
                    getAutofillInitData (request) {
                        recordCall(request.Name, null, mocks.getAutofillInitData)
                        return respond(request.Name, null, mocks.getAutofillInitData)
                    },
                    setSize (request) {
                        recordCall(request.Name, request, null)
                    },
                    getAutofillCredentials (request) {
                        recordCall(request.Name, null, mocks.getAutofillCredentials)
                        return respond(request.Name, null, mocks.getAutofillCredentials)
                    },
                    selectedDetail (request) {
                        recordCall(request.Name, request.Data, null)
                    }
                }

                /**
                 * @param {WindowsMessageFormat|WindowsResponseFormat} x
                 * @returns {x is WindowsMessageFormat}
                 */
                function isOutgoing (x) {
                    if (typeof x.Name === 'string') {
                        return true
                    }
                    return false
                }

                // @ts-ignore
                window.chrome = {
                    webview: {
                        postMessage (input) {
                            if (isOutgoing(input)) {
                                if (mocksObject[input.Name]) {
                                    return mocksObject[input.Name](input)
                                } else {
                                    throw new Error('windows mock missing for ' + input.Name)
                                }
                            } else if (typeof input.type === 'string') {
                                setTimeout(() => {
                                    for (let listener of listeners) {
                                        listener({
                                            origin: window.origin,
                                            data: input
                                        })
                                    }
                                }, 0)
                            } else {
                                console.warn('cannot handle input', input)
                            }
                        },
                        removeEventListener (_name, _listener) {
                            const index = listeners.indexOf(_listener)
                            if (index > -1) {
                                listeners.splice(index, 1)
                            }
                        },
                        addEventListener (_name, listener) {
                            listeners.push(listener)
                        }
                    }
                }
            }, mocks)
        }
    }
    return builder
}
