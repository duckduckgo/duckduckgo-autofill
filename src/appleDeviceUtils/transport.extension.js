import {tryCreateRuntimeConfiguration} from '@duckduckgo/content-scope-scripts'

/**
 * @param {GlobalConfig} globalConfig
 * @returns {Transport}
 */
export function createTransport (globalConfig) {

    /** @type {Transport} */
    const transport = {
        async send (name, data) {
            console.log('extension:', name, data);
            if (interceptions[name]) {
                console.log('--> intercepted', name, data);
                return interceptions[name](globalConfig);
            }

            switch (name) {
            case "getAvailableInputTypes": {
                throw new Error('extension: not implemented' + name)
            }
            default: throw new Error('extension: not implemented' + name)
            }
        }
    }

    return transport
}

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
            'inputType_credentials': false,
            'inputType_identities': false,
            'inputType_creditCards': false,
            'emailProtection': true,
            'password_generation': false,
            'credentials_saving': false,
        }
        const {config, errors} = tryCreateRuntimeConfiguration({
            contentScope: globalConfig.contentScope,
            userPreferences: {
                ...globalConfig.userPreferences,
                sessionKey: '',
                debug: false,
                globalPrivacyControlValue: false,
                platform: {name: 'extension'},
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
