import ConfigFeature from '@duckduckgo/content-scope-scripts/injected/src/config-feature';

const FEATURE_NAME = 'siteSpecificFixes';

// TMP: will come from privacy-configuration
/** @typedef {Array<{selector: string, type: import('./Form/matching').SupportedTypes}>} InputTypeSettings */

export default class SiteSpecificFeature extends ConfigFeature {
    constructor(args) {
        super(FEATURE_NAME, args);
    }

    /**
     * @returns {InputTypeSettings}
     */
    get inputTypeSettings() {
        return this.getFeatureSetting('inputTypeSettings') || [];
    }

    /**
     * @param {HTMLInputElement} input
     * @returns {import('./Form/matching').SupportedTypes | null}
     */
    getForcedInputType(input) {
        return this.inputTypeSettings.find((config) => input.matches(config.selector))?.type || null;
    }

    /**
     * @returns {import('@duckduckgo/privacy-configuration/schema/features/autofill.js').SiteSpecificFixes['formTypeSettings']}
     */
    get formTypeSettings() {
        return this.getFeatureSetting('formTypeSettings') || [];
    }

    /**
     * @returns {import('@duckduckgo/privacy-configuration/schema/features/autofill.js').SiteSpecificFixes['formBoundarySelector'] | null}
     */
    get formBoundarySelector() {
        return this.getFeatureSetting('formBoundarySelector');
    }

    /**
     * Checks if there's a forced form type configuration for the given form element
     * @param {HTMLElement} form
     * @returns {string|null|undefined}
     */
    getForcedFormType(form) {
        return this.formTypeSettings?.find((config) => form.matches(config.selector))?.type;
    }

    /**
     * @returns {HTMLElement|null}
     */
    getForcedForm() {
        return this.formBoundarySelector ? document.querySelector(this.formBoundarySelector) : null;
    }
}
