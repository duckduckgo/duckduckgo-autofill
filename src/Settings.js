import {validate} from '../packages/device-api/index.js'
import {GetAvailableInputTypesCall, GetRuntimeConfigurationCall} from './deviceApiCalls/__generated__/deviceApiCalls.js'
import {autofillSettingsSchema} from './deviceApiCalls/__generated__/validators.zod.js'
import {autofillEnabled} from './autofill-utils.js'

/**
 * Some Type helpers to prevent duplication
 * @typedef {import("./deviceApiCalls/__generated__/validators-ts").AutofillFeatureToggles} AutofillFeatureToggles
 * @typedef {import("./deviceApiCalls/__generated__/validators-ts").AvailableInputTypes} AvailableInputTypes
 * @typedef {import("./deviceApiCalls/__generated__/validators-ts").RuntimeConfiguration} RuntimeConfiguration
 * @typedef {import("../packages/device-api").DeviceApi} DeviceApi
 */

/**
 * The Settings class encapsulates the concept of 1) feature toggles + 2) available input types.
 *
 * 1) Feature toggles are boolean flags that can represent a device's capabilities. That may be user-toggled
 * or not, we don't make that distinction.
 *
 * 2) Available Input Types are indicators to whether the given platform can provide data for a given type.
 * For example, a user might have credentials saved for https://example.com, so when the page loads, but **before**
 * we can decorate any fields, we determine this first.
 */
export class Settings {
    /** @type {GlobalConfig} */
    globalConfig
    /** @type {DeviceApi} */
    deviceApi
    /** @type {AutofillFeatureToggles | null} */
    _featureToggles = null
    /** @type {AvailableInputTypes | null} */
    _availableInputTypes = null
    /** @type {RuntimeConfiguration | null | undefined} */
    _runtimeConfiguration = null
    /** @type {boolean | null} */
    _enabled = null
    /** @type {string} */
    _language = 'en'

    /**
     * @param {GlobalConfig} config
     * @param {DeviceApi} deviceApi
     */
    constructor (config, deviceApi) {
        this.deviceApi = deviceApi
        this.globalConfig = config
    }

    /**
     * Feature toggles are delivered as part of the Runtime Configuration - a flexible design that
     * allows data per user + remote config to be accessed together.
     *
     * Once we access the Runtime Configuration, we then extract the autofill-specific settings via
     * `runtimeConfig.userPreferences.features.autofill.settings` and validate that separately.
     *
     * The 2-step validation occurs because RuntimeConfiguration will be coming from a shared library
     * and does not know about the shape of Autofill specific settings.
     *
     * @returns {Promise<AutofillFeatureToggles>}
     */
    async getFeatureToggles () {
        try {
            const runtimeConfig = await this._getRuntimeConfiguration()
            const autofillSettings = validate(runtimeConfig.userPreferences?.features?.autofill?.settings, autofillSettingsSchema)
            return autofillSettings.featureToggles
        } catch (e) {
            // these are the fallbacks for when a platform hasn't implemented the calls above.
            if (this.globalConfig.isDDGTestMode) {
                console.log('isDDGTestMode: getFeatureToggles: ❌', e)
            }
            return Settings.defaults.featureToggles
        }
    }

    /**
     * If the platform in question is happy to derive it's 'enabled' state from the RuntimeConfiguration,
     * then they should use this. Currently only Windows supports this, but we aim to move all platforms to
     * support this going forward.
     * @returns {Promise<boolean|null>}
     */
    async getEnabled () {
        try {
            const runtimeConfig = await this._getRuntimeConfiguration()
            const enabled = autofillEnabled(runtimeConfig)
            return enabled
        } catch (e) {
            // these are the fallbacks for when a platform hasn't implemented the calls above. (like on android)
            if (this.globalConfig.isDDGTestMode) {
                console.log('isDDGTestMode: getEnabled: ❌', e)
            }
            return null
        }
    }

    /**
     * Retrieves the user's language from the current platform's `RuntimeConfiguration`. If the
     * platform doesn't include a two-character `.userPreferences.language` property in its runtime
     * configuration, or if an error occurs, 'en' is used as a fallback.
     *
     * NOTE: This function returns the two-character 'language' code of a typical POSIX locale
     * (e.g. 'en', 'de', 'fr') listed in ISO 639-1[1].
     *
     * [1] https://en.wikipedia.org/wiki/ISO_639-1
     *
     * @returns {Promise<string>} the device's current language code, or 'en' if something goes wrong
     */
    async getLanguage () {
        try {
            const conf = await this._getRuntimeConfiguration()
            const language = conf.userPreferences.language ?? 'en'
            if (language.length !== 2) {
                console.warn(`config.userPreferences.language must be two characters, but received '${language}'`)
                return 'en'
            }
            return language
        } catch (e) {
            if (this.globalConfig.isDDGTestMode) {
                console.log('isDDGTestMode: getLanguage: ❌', e)
            }
            return 'en'
        }
    }

    /**
     * Get runtime configuration, but only once.
     *
     * Some platforms may be reading this directly from inlined variables, whilst others
     * may make a DeviceApiCall.
     *
     * Currently, it's only read once - but we should be open to the idea that we may need
     * this to be called multiple times in the future.
     *
     * @returns {Promise<RuntimeConfiguration>}
     * @throws
     * @private
     */
    async _getRuntimeConfiguration () {
        if (this._runtimeConfiguration) return this._runtimeConfiguration
        const runtimeConfig = await this.deviceApi.request(new GetRuntimeConfigurationCall(null))
        this._runtimeConfiguration = runtimeConfig
        return this._runtimeConfiguration
    }

    /**
     * Available Input Types are boolean indicators to represent which input types the
     * current **user** has data available for.
     *
     * @returns {Promise<AvailableInputTypes>}
     */
    async getAvailableInputTypes () {
        try {
            // This info is not needed in the topFrame, so we avoid calling the native app
            if (this.globalConfig.isTopFrame) {
                return Settings.defaults.availableInputTypes
            }
            return await this.deviceApi.request(new GetAvailableInputTypesCall(null))
        } catch (e) {
            if (this.globalConfig.isDDGTestMode) {
                console.log('isDDGTestMode: getAvailableInputTypes: ❌', e)
            }
            return Settings.defaults.availableInputTypes
        }
    }

    /**
     * To 'refresh' settings means to re-call APIs to determine new state. This may
     * only occur once per page, but it must be done before any page scanning/decorating
     * or translation can happen.
     *
     * @returns {Promise<{
     *      availableInputTypes: AvailableInputTypes,
     *      featureToggles: AutofillFeatureToggles,
     *      enabled: boolean | null
     * }>}
     */
    async refresh () {
        this.setEnabled(await this.getEnabled())
        this.setFeatureToggles(await this.getFeatureToggles())
        this.setAvailableInputTypes(await this.getAvailableInputTypes())
        this.setLanguage(await this.getLanguage())

        // If 'this.enabled' is a boolean it means we were able to set it correctly and therefor respect its value
        if (typeof this.enabled === 'boolean') {
            if (!this.enabled) {
                return Settings.defaults
            }
        }

        return {
            featureToggles: this.featureToggles,
            availableInputTypes: this.availableInputTypes,
            enabled: this.enabled
        }
    }

    /**
     * Checks if input type is one which we can't autofill
     * @param {{
     *   mainType: SupportedMainTypes
     *   subtype: import('./Form/matching.js').SupportedSubTypes | "unknown"
     *   variant?: import('./Form/matching.js').SupportedVariants | ""
     * }} types
     * @returns {boolean}
     */
    isTypeUnavailable ({mainType, subtype, variant}) {
        if (mainType === 'unknown') return true

        // Ensure password generation feature flag is respected
        if (subtype === 'password' && variant === 'new') {
            return !this.featureToggles.password_generation
        }

        if (!this.featureToggles[`inputType_${mainType}`] && subtype !== 'emailAddress') {
            return true
        }
        return false
    }

    /**
     * Requests data from remote
     * @returns {Promise<>}
     */
    async populateData () {
        const availableInputTypesFromRemote = await this.getAvailableInputTypes()
        this.setAvailableInputTypes(availableInputTypesFromRemote)
    }

    /**
     * Requests data from remote if not available
     * @param {{
     *   mainType: SupportedMainTypes
     *   subtype: import('./Form/matching.js').SupportedSubTypes | "unknown"
     *   variant?: import('./Form/matching.js').SupportedVariants | ""
     * }} types
     * @returns {Promise<boolean>}
     */
    async populateDataIfNeeded ({mainType, subtype, variant}) {
        if (this.isTypeUnavailable({mainType, subtype, variant})) return false
        if (this.availableInputTypes?.[mainType] === undefined) {
            await this.populateData()
            return true
        }
        return false
    }

    /**
     * Checks if items will show in the autofill menu, including in-context signup.
     * Triggers side-effect if input types is not already available.
     * @param {{
     *   mainType: SupportedMainTypes
     *   subtype: import('./Form/matching.js').SupportedSubTypes | "unknown"
     *   variant: import('./Form/matching.js').SupportedVariants | ""
     * }} types
     * @param {import("./InContextSignup.js").InContextSignup?} inContextSignup
     * @returns {boolean}
     */
    canAutofillType ({mainType, subtype, variant}, inContextSignup) {
        if (this.isTypeUnavailable({ mainType, subtype, variant })) return false

        // If it's an email field and Email Protection is enabled, return true regardless of other options
        const isEmailProtectionEnabled = this.featureToggles.emailProtection && this.availableInputTypes.email
        if (subtype === 'emailAddress' && isEmailProtectionEnabled) {
            return true
        }

        if (inContextSignup?.isAvailable(subtype)) {
            return true
        }

        // Check for password generation and the password.new scoring
        if (subtype === 'password' && variant === 'new' && this.featureToggles.password_generation) {
            return true
        }

        if (subtype === 'fullName') {
            return Boolean(this.availableInputTypes.identities?.firstName || this.availableInputTypes.identities?.lastName)
        }

        if (subtype === 'expiration') {
            return Boolean(this.availableInputTypes.creditCards?.expirationMonth || this.availableInputTypes.creditCards?.expirationYear)
        }

        return Boolean(this.availableInputTypes[mainType]?.[subtype])
    }

    /** @returns {AutofillFeatureToggles} */
    get featureToggles () {
        if (this._featureToggles === null) throw new Error('feature toggles accessed before being set')
        return this._featureToggles
    }

    /** @param {AutofillFeatureToggles} input */
    setFeatureToggles (input) {
        this._featureToggles = input
    }

    /** @returns {AvailableInputTypes} */
    get availableInputTypes () {
        if (this._availableInputTypes === null) throw new Error('available input types accessed before being set')
        return this._availableInputTypes
    }

    /** @param {AvailableInputTypes} value */
    setAvailableInputTypes (value) {
        this._availableInputTypes = {...this._availableInputTypes, ...value}
    }

    /** @returns {string} the user's current two-character language code, as provided by the platform */
    get language () {
        return this._language
    }

    /**
     * Sets the current two-character language code.
     * @param {string} language - the language
     */
    setLanguage (language) {
        this._language = language
    }

    static defaults = {
        /** @type {AutofillFeatureToggles} */
        featureToggles: {
            credentials_saving: false,
            password_generation: false,
            emailProtection: false,
            emailProtection_incontext_signup: false,
            inputType_identities: false,
            inputType_credentials: false,
            inputType_creditCards: false,
            inlineIcon_credentials: false
        },
        /** @type {AvailableInputTypes} */
        availableInputTypes: {
            credentials: {
                username: false,
                password: false
            },
            identities: {
                firstName: false,
                middleName: false,
                lastName: false,
                birthdayDay: false,
                birthdayMonth: false,
                birthdayYear: false,
                addressStreet: false,
                addressStreet2: false,
                addressCity: false,
                addressProvince: false,
                addressPostalCode: false,
                addressCountryCode: false,
                phone: false,
                emailAddress: false
            },
            creditCards: {
                cardName: false,
                cardSecurityCode: false,
                expirationMonth: false,
                expirationYear: false,
                cardNumber: false
            },
            email: false
        },
        /** @type {boolean | null} */
        enabled: null
    }

    static default (globalConfig, deviceApi) {
        const settings = new Settings(globalConfig, deviceApi)
        settings.setFeatureToggles(Settings.defaults.featureToggles)
        settings.setAvailableInputTypes(Settings.defaults.availableInputTypes)
        return settings
    }

    /** @returns {boolean|null} */
    get enabled () {
        return this._enabled
    }

    /**
     * @param {boolean|null} enabled
     */
    setEnabled (enabled) {
        this._enabled = enabled
    }
}
