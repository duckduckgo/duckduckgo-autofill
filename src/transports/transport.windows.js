/**
 * @param {GlobalConfig} globalConfig
 * @returns {Transport}
 */
export function createTransport (globalConfig) {

    /** @type {Transport} */
    const transport = {
        async send (name, data) {
            console.log('windows:', name, data);
            if (interceptions[name]) {
                console.log('--> intercepted', name, data);
                return interceptions[name](globalConfig);
            }

            switch (name) {
            case "getAvailableInputTypes": {
                throw new Error('windows: not implemented' + name)
            }
            default: throw new Error('windows: not implemented' + name)
            }
        }
    }

    return transport
}

const interceptions = {
    /**
     * @param {GlobalConfig} globalConfig
     */
    'getRuntimeConfiguration': (globalConfig) => {
        return {
            contentScope: globalConfig.contentScope,
            userPreferences: {
                ...globalConfig.userPreferences,
                sessionKey: '',
                debug: false,
                globalPrivacyControlValue: false,
                platform: {name: 'windows'},
                ...{
                    features: {
                        autofill: {
                            settings: {
                                featureToggles: {
                                    'inputType_credentials': true,
                                    'inputType_identities': false,
                                    'inputType_creditCards': false,
                                    'emailProtection': false,
                                    'password_generation': false,
                                    'credentials_saving': true,
                                }
                            }
                        }
                    }
                }
            },
            userUnprotectedDomains: globalConfig.userUnprotectedDomains || [],
        }
    }
}
