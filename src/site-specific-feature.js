import ConfigFeature from '@duckduckgo/content-scope-scripts/injected/src/config-feature';
import { findElementsInShadowTree } from './autofill-utils.js';

const FEATURE_NAME = 'autofill-site-specific-fixes';

/** @typedef {Object} FormTypeSettings
 * @property {string} selector
 * @property {string} type
 */

/** @typedef {Object} FormBoundarySettings
 * @property {string} selector
 */

export default class SiteSpecificFeature extends ConfigFeature {
    constructor(args) {
        super(FEATURE_NAME, args);
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

    /**
     * @param {HTMLElement} context
     * @param {string} formInputsSelectorWithoutSelect
     * @param {(input: HTMLInputElement|HTMLSelectElement, form?: HTMLFormElement) => void} callback
     * @returns {boolean}
     */
    attemptForceFormBoundary(context, formInputsSelectorWithoutSelect, callback) {
        let formCount = 0;
        if (this.formBoundarySettings.length) {
            // Only if all forms are found, proceed with the ad hoc fixes. Otherwise
            for (const setting of this.formBoundarySettings) {
                const form = context.querySelector(setting.selector) || findElementsInShadowTree(context, setting.selector)[0];
                if (form) {
                    const inputs = /** @type NodeListOf<HTMLSelectElement|HTMLInputElement> */ (
                        form.querySelectorAll(formInputsSelectorWithoutSelect)
                    );
                    for (const input of inputs) {
                        // @ts-ignore input can be an arbitrary element type
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
