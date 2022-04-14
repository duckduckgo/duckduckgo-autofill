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
            }
        },
        /** @type {AvailableInputTypes} */
        getAvailableInputTypes: {
            credentials: true,
        }
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
            mocks.getAvailableInputTypes = inputTypes
            return this
        },
        /**
          * @param {FeatureTogglesSettings} featureToggles
         */
        withFeatureToggles (featureToggles) {
            Object.assign(mocks.getRuntimeConfiguration.userPreferences.features.autofill.settings.featureToggles, featureToggles)
            return this;
        },
        tap () {
            return this
        },
        async applyTo (page) {
            return page.evaluate(mocks => {
                const listeners = []
                const emit = (data) => {
                    setTimeout(() => {
                        for (let listener of listeners) {
                            listener({
                                origin: window.origin,
                                data: data
                            })
                        }
                    }, 0)
                }
                // @ts-ignore
                window.chrome = {
                    webview: {
                        postMessage (input) {
                            switch (input.commandName) {
                            case 'GetRuntimeConfiguration': {
                                return emit({
                                    type: 'GetRuntimeConfigurationResponse',
                                    data: mocks.getRuntimeConfiguration
                                })
                            }
                            case 'GetAvailableInputTypes': {
                                return emit({
                                    type: 'GetAvailableInputTypesResponse',
                                    data: mocks.getAvailableInputTypes
                                })
                            }
                            }
                        },
                        removeEventListener (_name, _listener) {

                        },
                        addEventListener (_name, listener) {
                            listeners.push(listener)
                        }
                    },
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
