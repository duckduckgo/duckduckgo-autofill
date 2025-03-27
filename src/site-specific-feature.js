import ConfigFeature from '@duckduckgo/content-scope-scripts/injected/src/config-feature';
import { findElementsInShadowTree } from './autofill-utils.js';

const FEATURE_NAME = 'site-specific-fixes';

/** @typedef {Object} FormTypeSettings
 * @property {string} selector
 * @property {string} type
 * @property {Array<{selector: string, type: import('./Form/matching').SupportedTypes}>} inputs
 */

/** @typedef {Object} FormBoundarySettings
 * @property {string} formSelector
 * @property {string[]} inputsSelectors
 */

export default class SiteSpecificFeature extends ConfigFeature {
    constructor(args) {
        super(FEATURE_NAME, args);
    }

    isEnabled() {
        return this.bundledConfig?.features?.siteSpecificFixes?.state === 'enabled';
    }

    /**
     * @returns {Array<FormTypeSettings>}
     */
    get formTypeSettings() {
        return this.getFeatureSetting('formTypeSettings') ?? [];
    }

    /**
     * @returns {Array<FormBoundarySettings>}
     */
    get formBoundarySettings() {
        return this.getFeatureSetting('formBoundarySettings') ?? [];
    }

    /**
     * Checks if there's a forced form type configuration for this form
     * @param {HTMLElement} form
     * @returns {string|null}
     */
    getForcedFormType(form) {
        return this.formTypeSettings?.find((config) => form.matches(config.selector))?.type ?? null;
    }

    getForcedInputs(form) {
        const forcedFormType = this.getForcedFormType(form);
        if (!forcedFormType) return null;
        return this.formTypeSettings?.find((config) => config.type === forcedFormType)?.inputs ?? null;
    }

    /**
     * @param {HTMLElement} form
     * @param {import('./Form/matching').Matching} matching
     * @returns {boolean}
     */
    attemptForceFormInputTypes(form, matching) {
        const forcedFormType = this.getForcedFormType(form);
        if (!forcedFormType) return false;
        const inputs = this.getForcedInputs(form) ?? [];
        // For each input in the forced form type, set the input type
        for (const input of inputs) {
            const inputEl = /** @type {HTMLInputElement} */ (form.querySelector(input.selector) ?? document.querySelector(input.selector));
            if (!inputEl) console.error(`Input element not found for forced input type: ${input.selector}`);
            matching.setInputType(inputEl, form, { forcedInputType: input.type });
        }
        return true;
    }

    /**
     * @param {Element} form
     * @param {FormBoundarySettings} settings
     * @param {string} formInputsSelectorWithoutSelect
     * @returns {Array<HTMLSelectElement|HTMLInputElement>}
     */
    getFormInputsFromSettings(form, settings, formInputsSelectorWithoutSelect) {
        // We only expect one input per selector, so we can just return the first one
        const inputs = settings.inputsSelectors.map(
            (selector) => /** @type {HTMLSelectElement|HTMLInputElement} */ (form.querySelectorAll(selector)[0]),
        );
        return inputs.length ? inputs : Array.from(form.querySelectorAll(formInputsSelectorWithoutSelect));
    }

    /**
     * @param {HTMLElement} context
     * @param {string} formInputsSelectorWithoutSelect
     * @param {(input: HTMLInputElement|HTMLSelectElement, form?: any) => void} callback
     * @returns {boolean}
     */
    attemptForceFormBoundary(context, formInputsSelectorWithoutSelect, callback) {
        let formCount = 0;
        if (this.formBoundarySettings.length) {
            // Only if all forms are found, proceed with the ad hoc fixes. Otherwise
            for (const setting of this.formBoundarySettings) {
                const form = context.querySelector(setting.formSelector) || findElementsInShadowTree(context, setting.formSelector)[0];
                if (form) {
                    const inputs = this.getFormInputsFromSettings(form, setting, formInputsSelectorWithoutSelect);
                    for (const input of inputs) {
                        callback(input, form);
                        formCount++;
                    }
                }
            }
            return formCount === this.formBoundarySettings.length;
        }
        return false;
    }
}
