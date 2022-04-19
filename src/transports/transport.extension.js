/**
 * @param {GlobalConfig} globalConfig
 * @returns {RuntimeTransport}
 */
export function createTransport (globalConfig) {
    /** @type {RuntimeTransport} */
    const transport = {
        /**
         * @param {Names} name
         * @param data
         */
        async send (name, data) {
            console.log('extension:', name, data)
            if (interceptions[name]) {
                console.log('--> intercepted', name, data)
                return interceptions[name]?.(globalConfig)
            }
            throw new Error('not implemented for extension: ' + name)
        }
    }

    return transport
}

/**
 * @type {Interceptions}
 */
const interceptions = {
    // todo(Shane): Get available extension types
    'getAvailableInputTypes': () => {
        return {
            success: {
                credentials: false,
                identities: false,
                creditCards: false,
                email: true
            }
        }
    },
    /**
     * @param {GlobalConfig} globalConfig
     */
    'getRuntimeConfiguration': (globalConfig) => {
        /**
         * @type {FeatureTogglesSettings}
         */
        const featureToggles = {
            'inputType_credentials': false,
            'inputType_identities': false,
            'inputType_creditCards': false,
            'emailProtection': true,
            'password_generation': false,
            'credentials_saving': false
        }
        return {
            success: {
                contentScope: {
                    features: {
                        autofill: {
                            state: 'enabled',
                            exceptions: []
                        }
                    },
                    unprotectedTemporary: [],
                    ...globalConfig.contentScope
                },
                userPreferences: {
                    sessionKey: '',
                    debug: false,
                    globalPrivacyControlValue: false,
                    platform: {name: 'extension'},
                    features: {
                        autofill: {
                            settings: {
                                featureToggles: featureToggles
                            }
                        }
                    },
                    ...globalConfig.userPreferences
                },
                userUnprotectedDomains: globalConfig.userUnprotectedDomains || []
            }
        }
    }
}
