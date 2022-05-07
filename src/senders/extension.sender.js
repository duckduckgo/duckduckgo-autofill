import {Sender} from './sender'

export class ExtensionSender extends Sender {
    /** @type {GlobalConfig} */
    config
    /** @param {GlobalConfig} globalConfig */
    constructor (globalConfig) {
        super()
        this.config = globalConfig
    }
    async handle (msg) {
        const { name, data } = msg
        try {
            const result = await sendToExtension(name)
            return result
        } catch (e) {
            if (e instanceof MissingExtensionHandler) {
                if (name in interceptions) {
                    console.log('--> falling back to: ', name, data)
                    return interceptions[name]?.(this.config)
                } else {
                    throw new Error('unimplemented handler: ' + name)
                }
            } else {
                throw e
            }
        }
    }
}

/**
 * @param {GlobalConfig} globalConfig
 * @returns {Sender}
 */
export function createTransport (globalConfig) {
    return new ExtensionSender(globalConfig)
}

class MissingExtensionHandler extends Error {
    handlerName

    constructor (handlerName) {
        super()
        this.handlerName = handlerName
    }
}

/**
 * Try to send a message to the Extension.
 *
 * This will try to detect if you've called a handler that's not available in the extension,
 * if so, it will throw a known message so that you can decide to fallback/recover if possible.
 *
 * For example, this can help when implementing new messaging
 *
 * @param {string} name
 * @returns {Promise<any>}
 */
function sendToExtension (name) {
    return new Promise((resolve, reject) => chrome.runtime.sendMessage(
        {[name]: true},
        (data) => {
            if (typeof data === 'undefined') {
                if (chrome.runtime.lastError?.message?.includes('The message port closed before a response was received')) {
                    console.warn(`Missing extension handler: '${name}'`)
                    reject(new MissingExtensionHandler(`Missing extension handler: '${name}'`))
                } else {
                    reject(new Error('Unknown extension error for message: ' + name))
                }
            } else {
                return resolve({
                    success: data
                })
            }
        }
    ))
}

/**
 * @type {Interceptions}
 */
const interceptions = {
    /**
     * @param {GlobalConfig} globalConfig
     */
    'getRuntimeConfiguration': async (globalConfig) => {
        /**
         * @type {FeatureToggles}
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
