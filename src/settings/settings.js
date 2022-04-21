import validators from '../schema/validators.cjs'

/**
 * A wrapper for Autofill settings
 */
class AutofillSettings {
    validate = validators['#/definitions/AutofillSettings']

    /** @type {Settings | null} */
    settings = null

    /**
     * @throws
     * @returns {AutofillSettings}
     */
    from (input) {
        if (this.validate(input)) {
            this.settings = input
        } else {
            // @ts-ignore
            for (const error of this.validate.errors) {
                console.error(error.message)
                console.error(error)
            }
            throw new Error('Could not create settings from global configuration')
        }

        return this
    }

    /**
     * @returns {FeatureTogglesSettings}
     */
    get featureToggles () {
        if (!this.settings) throw new Error('unreachable')
        return this.settings.featureToggles
    }

    /** @returns {AutofillSettings} */
    static default () {
        return new AutofillSettings().from({
            /** @type {FeatureTogglesSettings} */
            featureToggles: {
                inputType_credentials: true,
                inputType_identities: true,
                inputType_creditCards: true,
                emailProtection: true,
                password_generation: true,
                credentials_saving: true
            }
        })
    }
}

/**
 * @param {import("@duckduckgo/content-scope-scripts").RuntimeConfiguration} config
 * @returns {AutofillSettings}
 */
export function fromPlatformConfig (config) {
    const autofillSettings = config.getSettings('autofill')
    const settings = (new AutofillSettings()).from(autofillSettings)
    return settings
}

export { AutofillSettings }