/**
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
        },
        /** @type {AvailableInputTypes} */
        getAvailableInputTypes: {
            credentials: true,
        }
    }
    /** @type {MockBuilder} */
    const builder = {
        withPrivateEmail (email) {
            return this
        },
        withPersonalEmail (email) {
            return this
        },
        withAvailableInputTypes (inputTypes) {
            mocks.getAvailableInputTypes = inputTypes
            return this
        },
        tap () {
            return this
        },
        async applyTo (page) {
            return page.evaluate(mocks => {
                // @ts-ignore
                window.chrome = {
                    webview: {
                        postMessage (input) {
                            switch (input.commandName) {
                            case 'GetRuntimeConfiguration': {
                                return window.postMessage({
                                    type: 'GetRuntimeConfigurationResponse',
                                    success: mocks.getRuntimeConfiguration
                                }, window.origin)
                            }
                            case 'GetAvailableInputTypes': {
                                return window.postMessage({
                                    type: 'GetAvailableInputTypesResponse',
                                    success: mocks.getAvailableInputTypes
                                }, window.origin)
                            }
                            }
                        }
                    }
                }
            }, mocks)
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
