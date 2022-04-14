/**
 * @param {GlobalConfig} globalConfig
 * @returns {Transport}
 */
export function createTransport (globalConfig) {
    /** @type {Transport} */
    const transport = {
        async send (name, data) {
            console.log('extension:', name, data)
            if (interceptions[name]) {
                console.log('--> intercepted', name, data)
                return { data: interceptions[name](globalConfig) }
            }
            throw new Error('not implemented for extension: ' + name)
        }
    }

    return transport
}

const interceptions = {
    // todo(Shane): Get available extension types
    'getAvailableInputTypes': () => {
        return {
            credentials: false,
            identities: false,
            creditCards: false,
            email: true
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
