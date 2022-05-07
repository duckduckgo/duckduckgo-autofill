import {Sender} from './sender'
import {EmailSignedIn, LegacyMessage} from '../messages/messages'
import {MissingWebkitHandler, wkSendAndWait} from './appleDeviceUtils'

export class AppleSender extends Sender {
    /** @type {GlobalConfig} */
    config

    /** @param {GlobalConfig} globalConfig */
    constructor (globalConfig) {
        super()
        this.config = globalConfig
    }

    async handle (msg) {
        let { name, data } = msg
        try {
            if (name === 'getAutofillCredentials') {
                name = 'pmHandlerGetAutofillCredentials'
            }
            // todo(Shane): better way to handle this?
            if (data === null) data = undefined
            let response = await wkSendAndWait(name, data, {
                secret: this.config.secret,
                hasModernWebkitAPI: this.config.hasModernWebkitAPI
            })
            // todo(Shane): Better way to handle this - per message?
            if (response && !('success' in response) && !('error' in response)) {
                return { success: response }
            }
            return response
        } catch (e) {
            if (e instanceof MissingWebkitHandler) {
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
 * Create a wrapper around the webkit messaging that conforms
 * to the Transport tooltipHandler
 *
 * @param {GlobalConfig} config
 */
export function createSender (config) {
    return new AppleSender(config)
}

/**
 * @type {Interceptions}
 */
const interceptions = {
    'getAutofillInitData': async (globalConfig) => {
        const sender = createSender(globalConfig)

        // mimic the old message
        const msg = new LegacyMessage()
        msg.name = 'pmHandlerGetAutofillInitData'

        // get the response
        const response = await sender.send(msg)

        // update items to fix `id` field
        response.credentials.forEach(cred => {
            cred.id = String(cred.id)
        })

        return {
            success: {
                // default, allowing it to be overriden
                serializedInputContext: '{}',
                ...response
            }
        }
    },
    /**
     * If this handler is not available, we default to the old check for email, which is
     * to call 'emailHandlerCheckAppSignedInStatus'
     * @param globalConfig
     */
    'getAvailableInputTypes': async (globalConfig) => {
        const legacySender = createSender(globalConfig)
        const message = new EmailSignedIn()
        const { isAppSignedIn } = await legacySender.send(message)

        /** @type {AvailableInputTypes} */
        const legacyMacOsTypes = {
            credentials: true,
            identities: true,
            creditCards: true,
            email: isAppSignedIn
        }

        /** @type {AvailableInputTypes} */
        const legacyIOsTypes = {
            credentials: false,
            identities: false,
            creditCards: false,
            email: isAppSignedIn
        }

        return {
            /** @type {AvailableInputTypes} */
            success: globalConfig.isApp ? legacyMacOsTypes : legacyIOsTypes
        }
    },
    /**
     * @param {GlobalConfig} globalConfig
     */
    'getRuntimeConfiguration': async (globalConfig) => {
        const legacyMacOSToggles = {
            inputType_credentials: true,
            inputType_identities: true,
            inputType_creditCards: true,
            emailProtection: true,
            password_generation: true,
            credentials_saving: true
        }

        const legacyIOSToggles = {
            inputType_credentials: false,
            inputType_identities: false,
            inputType_creditCards: false,
            emailProtection: true,
            password_generation: false,
            credentials_saving: false
        }

        return {
            success: {
                contentScope: globalConfig.contentScope,
                userPreferences: {
                    // this is for old ios/macos
                    features: {
                        autofill: {
                            settings: {
                                /** @type {FeatureToggles} */
                                featureToggles: globalConfig.isApp
                                    ? legacyMacOSToggles
                                    : legacyIOSToggles
                            }
                        }
                    },
                    ...globalConfig.userPreferences
                },
                userUnprotectedDomains: globalConfig.userUnprotectedDomains
            }
        }
    }
}
