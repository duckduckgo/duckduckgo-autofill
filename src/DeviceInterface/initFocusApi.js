import { pierceShadowTree } from '../autofill-utils.js';
import { getInputType, getMainTypeFromType, getSubtypeFromType } from '../Form/matching.js';

/**
 * Maps input subtypes to autocomplete attribute values according to the HTML spec
 * @param {string} inputType - The input type to map
 * @returns {string|undefined} The autocomplete attribute value or undefined if not mapped
 * @private
 */
function getAutocompleteValueFromInputType(inputType) {
    const subtype = getSubtypeFromType(inputType);

    // Map input subtypes to autocomplete attribute values
    const autocompleteMap = {
        // Identities
        emailAddress: 'email',
        fullName: 'name',
        firstName: 'given-name',
        middleName: 'additional-name',
        lastName: 'family-name',
        phone: 'tel',
        addressStreet: 'street-address',
        addressStreet2: 'address-line2',
        addressCity: 'address-level2',
        addressProvince: 'address-level1',
        addressPostalCode: 'postal-code',
        addressCountryCode: 'country',
    };

    // no default fallback
    return autocompleteMap[subtype];
}

/**
 * Sets the appropriate autocomplete attribute on identity input fields
 * @param {EventTarget|HTMLElement} element - The element to check and potentially set autocomplete on
 * @returns {void}
 */
function setAutocompleteOnIdentityField(element) {
    if (!(element instanceof HTMLInputElement) || element.hasAttribute('autocomplete')) {
        return;
    }

    const inputType = getInputType(element);
    const mainType = getMainTypeFromType(inputType);

    if (mainType !== 'identities') {
        return;
    }

    const autocompleteValue = getAutocompleteValueFromInputType(inputType);
    if (autocompleteValue) {
        element.setAttribute('autocomplete', autocompleteValue);

        element.addEventListener(
            'blur',
            () => {
                element.removeAttribute('autocomplete');
            },
            { once: true },
        );
    }
}

/**
 * Handles focus events for form elements
 * @param {Map} forms - Collection of form objects
 * @param {object} settings - Settings object containing feature toggles
 * @param {boolean} isIOS - Whether the device is iOS
 * @param {Function} attachKeyboardCallback - Callback function to attach keyboard
 * @param {FocusEvent} e - The focus event
 * @private
 */
function handleFocusEvent(forms, settings, isIOS, attachKeyboardCallback, e) {
    // Check if any form is currently autofilling
    const isAnyFormAutofilling = [...forms.values()].some((form) => form.isAutofilling);
    if (isAnyFormAutofilling) return;

    const targetElement = pierceShadowTree(e);

    if (!isIOS || !targetElement || targetElement instanceof Window) return;
    const form = [...forms.values()].find((form) => form.hasFocus());

    if (settings.featureToggles.input_focus_api) {
        attachKeyboardCallback({ form, element: targetElement });
    }

    if (settings.featureToggles.autocomplete_attribute_support) {
        setAutocompleteOnIdentityField(targetElement);
    }
}

/**
 * Initializes the focus API
 * @param {Map} forms - Collection of form objects
 * @param {object} settings - Settings object containing feature toggles
 * @param {boolean} isIOS - Whether the device is iOS
 * @param {Function} attachKeyboardCallback - Callback function to attach keyboard
 * @returns {Object} - The focus API methods
 */
export function initFocusApi(forms, settings, isIOS, attachKeyboardCallback) {
    // Set up the global focus event listener
    const boundHandleFocusEvent = handleFocusEvent.bind(null, forms, settings, isIOS, attachKeyboardCallback);

    window.addEventListener('focus', boundHandleFocusEvent, true);

    return {
        setAutocompleteOnIdentityField,
        cleanup: () => {
            window.removeEventListener('focus', boundHandleFocusEvent, true);
        },
    };
}
