import {tryCreateRuntimeConfiguration} from '@duckduckgo/content-scope-scripts'

/**
 * @param {GlobalConfig} globalConfig
 * @returns {Transport}
 */
export function createTransport (globalConfig) {

    /** @type {Transport} */
    const transport = {
        async send (name, data) {

            console.log('android:', name, data);

            if (interceptions[name]) {
                console.log('--> intercepted', name, data);
                return interceptions[name](globalConfig);
            }

            switch (name) {
            case "getAvailableInputTypes": {
                throw new Error('android: not implemented' + name)
            }
            default: throw new Error('android: not implemented' + name)
            }
        }
    }

    return transport
}

/**
 * These are provided to bridge the gap until the platform supports each message
 */
const interceptions = {
    /**
     * @param {GlobalConfig} globalConfig
     * @returns {import('@duckduckgo/content-scope-scripts').RuntimeConfiguration}
     */
    'getRuntimeConfiguration': (globalConfig) => {
        /**
         * @type {FeatureTogglesSettings}
         */
        const featureToggles = {
            'inputType_credentials': true,
            'inputType_identities': false,
            'inputType_creditCards': false,
            'emailProtection': true,
            'password_generation': false,
            'credentials_saving': true,
        }
        const {config, errors} = tryCreateRuntimeConfiguration({
            contentScope: {
                ...globalConfig.contentScope,
                features: {
                    autofill: {
                        state: "enabled",
                        exceptions: [],
                    },
                },
                unprotectedTemporary: []
            },
            userPreferences: {
                ...globalConfig.userPreferences,
                sessionKey: '',
                debug: false,
                globalPrivacyControlValue: false,
                platform: {name: 'android'},
                ...{
                    features: {
                        autofill: {
                            settings: {
                                featureToggles: featureToggles
                            }
                        }
                    }
                }
            },
            userUnprotectedDomains: globalConfig.userUnprotectedDomains || [],
        })

        if (errors.length) {
            for (let error of errors) {
                console.log(error.message, error)
            }
            throw new Error(`${errors.length} errors prevented global configuration from being created.`)
        }

        return config
    }
}
