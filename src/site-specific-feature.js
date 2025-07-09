import ConfigFeature from '@duckduckgo/content-scope-scripts/injected/src/config-feature';
import { isValidSupportedType } from './Form/matching.js';

const FEATURE_NAME = 'siteSpecificFixes';

/**
 * @typedef {import('@duckduckgo/privacy-configuration/schema/features/autofill.js').InputTypeSetting} InputTypeSetting
 * @typedef {import('@duckduckgo/privacy-configuration/schema/features/autofill.js').FormTypeSetting} FormTypeSetting
 * @typedef {import('@duckduckgo/privacy-configuration/schema/features/autofill.js').FormBoundarySelector} FormBoundarySelector
 */

export default class SiteSpecificFeature extends ConfigFeature {
    constructor(args) {
        super(FEATURE_NAME, args);
    }

    /**
     * @returns {InputTypeSetting[]}
     */
    get inputTypeSettings() {
        return this.getFeatureSetting('inputTypeSettings') || [];
    }

    /**
     * @param {HTMLInputElement} input
     * @returns {import('./Form/matching').SupportedTypes | null}
     */
    getForcedInputType(input) {
        const setting = this.inputTypeSettings.find((config) => input.matches(config.selector));
        if (!isValidSupportedType(setting?.type)) return null;
        return setting?.type;
    }

    /**
     * @returns {FormTypeSetting[]}
     */
    get formTypeSettings() {
        return this.getFeatureSetting('formTypeSettings') || [];
    }

    /**
     * @returns {FormBoundarySelector|null}
     */
    get formBoundarySelector() {
        return this.getFeatureSetting('formBoundarySelector');
    }

    /**
     * @returns {any}
     */
    get failSafeSettings() {
        return this.getFeatureSetting('failSafeSettings');
    }

    /**
     * @returns {number}
     */
    get maxInputsPerPage() {
        return this.failSafeSettings?.maxInputsPerPage;
    }

    /**
     * @returns {number}
     */
    get maxFormsPerPage() {
        return this.failSafeSettings?.maxFormsPerPage;
    }

    /**
     * @returns {number}
     */
    get maxInputsPerForm() {
        return this.failSafeSettings?.maxInputsPerForm;
    }

    /**
     * Checks if there's a forced form type configuration for the given form element
     * @param {HTMLElement} form
     * @returns {string|null|undefined}
     */
    getForcedFormType(form) {
        return this.formTypeSettings.find((config) => form.matches(config.selector))?.type;
    }

    /**
     * @returns {HTMLElement|null}
     */
    getForcedForm() {
        return this.formBoundarySelector ? document.querySelector(this.formBoundarySelector) : null;
    }
}
