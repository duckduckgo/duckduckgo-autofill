/**
 * Take the available input types and augment to suit the enabled
 * features.
 *
 * @param {AvailableInputTypes} inputTypes
 * @param {FeatureTogglesSettings} featureToggles
 * @return {AvailableInputTypes}
 */
export function featureToggleAwareInputTypes (inputTypes, featureToggles) {
    const local = {...inputTypes}

    if (!featureToggles.inputType_credentials) {
        local.credentials = false
    }

    if (!featureToggles.inputType_creditCards) {
        local.creditCards = false
    }

    if (!featureToggles.inputType_identities) {
        local.identities = false
    }

    return local
}