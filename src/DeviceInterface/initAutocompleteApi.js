import { getInputType, getMainTypeFromType, getSubtypeFromType } from '../Form/matching.js';

/**
 * Maps input subtypes to autocomplete attribute values according to the HTML spec
 * @param {string} inputType - The input type to map
 * @returns {string|undefined} The autocomplete attribute value or undefined if not mapped
 */
export function getAutocompleteValueFromInputType(inputType) {
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
export function setAutocompleteOnIdentityField(element) {
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
