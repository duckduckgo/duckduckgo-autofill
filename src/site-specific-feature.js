import ConfigFeature from '@duckduckgo/content-scope-scripts/injected/src/config-feature';
import { findElementsInShadowTree } from './autofill-utils.js';

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
     * @returns {import('@duckduckgo/privacy-configuration/schema/features/autofill.js').SiteSpecificFixes['formBoundarySettings']}
     */
    get formBoundarySettings() {
        return this.getFeatureSetting('formBoundarySettings') ?? [];
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
     * @param {Element} form
     * @param {import('@duckduckgo/privacy-configuration/schema/features/autofill.js').SiteSpecificFixes['formBoundarySettings'][number]} settings
     * @returns {Array<HTMLSelectElement|HTMLInputElement> | null}
     */
    getFormInputsFromSettings(form, settings) {
        return settings.inputsSelectors?.map(
            (selector) => /** @type {HTMLSelectElement|HTMLInputElement} */ (form.querySelector(selector)),
        );
    }

    /**
     * @returns {HTMLFormElement|null}
     */
    getForcedForm() {
        return this.formBoundarySettings.length ? document.querySelector(this.formBoundarySettings[0]?.formSelector) : null;
    }

    /**
     * @param {HTMLElement} context
     * @param {string} formInputsSelectorWithoutSelect
     * @param {(input: HTMLInputElement|HTMLSelectElement, form?: any) => void} callback
     * @returns {boolean}
     */
    attemptForceFormBoundary(context, formInputsSelectorWithoutSelect, callback) {
        let formCount = 0;
        for (const setting of this.formBoundarySettings) {
            const form = context.querySelector(setting.formSelector) || findElementsInShadowTree(context, setting.formSelector)[0];
            if (form) {
                formCount++;
                const inputs =
                    this.getFormInputsFromSettings(form, setting) ?? Array.from(form.querySelectorAll(formInputsSelectorWithoutSelect));
                for (const input of inputs) {
                    callback(input, form);
                }
            }
        }
        return formCount === this.formBoundarySettings.length;
    }
}
