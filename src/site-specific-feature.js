import ConfigFeature from '@duckduckgo/content-scope-scripts/injected/src/config-feature';

const FEATURE_NAME = 'site-specific-fixes';

export default class SiteSpecificFeature extends ConfigFeature {
    constructor(args) {
        super(FEATURE_NAME, args);
    }

    /**
     * @returns {import('@duckduckgo/privacy-configuration/schema/features/autofill.js').SiteSpecificFixes['formTypeSettings']}
     */
    get formTypeSettings() {
        return this.getFeatureSetting('formTypeSettings') ?? [];
    }

    /**
     * @returns {import('@duckduckgo/privacy-configuration/schema/features/autofill.js').SiteSpecificFixes['formBoundarySelector'] | null}
     */
    get formBoundarySelector() {
        return this.getFeatureSetting('formBoundarySelector');
    }

    /**
     * @returns {import('@duckduckgo/privacy-configuration/schema/features/autofill.js').SiteSpecificFixes['formTypeSettings']}
     */
    get formInputTypeSettings() {
        return this.getFeatureSetting('formInputTypeSettings') ?? [];
    }

    /**
     * Checks if there's a forced form type configuration for this form
     * @param {HTMLElement} form
     * @returns {string|null}
     */
    getForcedFormType(form) {
        return this.formTypeSettings?.find((config) => form.matches(config.selector))?.type ?? null;
    }

    /**
     * @returns {HTMLFormElement|null}
     */
    getForcedForm() {
        return this.formBoundarySelector ? document.querySelector(this.formBoundarySelector) : null;
    }
}
