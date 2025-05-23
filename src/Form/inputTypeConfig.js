import { daxBase64, daxGrayscaleBase64 } from './logo-svg.js';
import * as ddgPasswordIcons from '../UI/img/ddgPasswordIcon.js';
import { getInputType, getMainTypeFromType, getInputSubtype, getInputMainType, getInputVariant } from './matching.js';
import { createCredentialsTooltipItem } from '../InputTypes/Credentials.js';
import { CreditCardTooltipItem } from '../InputTypes/CreditCard.js';
import { IdentityTooltipItem } from '../InputTypes/Identity.js';
import { constants } from '../constants.js';

/**
 * Get the icon for the identities (currently only Dax for emails)
 * @param {HTMLInputElement} input
 * @param {import("./Form").Form} form
 * @return {string}
 */
const getIdentitiesIcon = (input, { device }) => {
    if (!canBeInteractedWith(input)) return '';

    // In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here
    const { isDDGApp, isFirefox, isExtension } = device.globalConfig;
    const subtype = getInputSubtype(input);

    if (device.inContextSignup?.isAvailable(subtype)) {
        if (isDDGApp || isFirefox) {
            return daxGrayscaleBase64;
        } else if (isExtension) {
            return chrome.runtime.getURL('img/logo-small-grayscale.svg');
        }
    }

    if (subtype === 'emailAddress' && device.isDeviceSignedIn()) {
        if (isDDGApp || isFirefox) {
            return daxBase64;
        } else if (isExtension) {
            return chrome.runtime.getURL('img/logo-small.svg');
        }
    }

    return '';
};

/**
 * Get the alternate icon for the identities (currently only Dax for emails)
 * @param {HTMLInputElement} input
 * @param {import("./Form").Form} form
 * @return {string}
 */
const getIdentitiesAlternateIcon = (input, { device }) => {
    if (!canBeInteractedWith(input)) return '';

    // In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here
    const { isDDGApp, isFirefox, isExtension } = device.globalConfig;
    const subtype = getInputSubtype(input);

    const isIncontext = device.inContextSignup?.isAvailable(subtype);
    const isEmailProtection = subtype === 'emailAddress' && device.isDeviceSignedIn();
    if (isIncontext || isEmailProtection) {
        if (isDDGApp || isFirefox) {
            return daxBase64;
        } else if (isExtension) {
            return chrome.runtime.getURL('img/logo-small.svg');
        }
    }

    return '';
};

/**
 * Checks whether a field is readonly or disabled
 * @param {HTMLInputElement} input
 * @return {boolean}
 */
const canBeInteractedWith = (input) => !input.readOnly && !input.disabled;

/**
 * Checks if the input can be decorated and we have the needed data
 * @param {HTMLInputElement} input
 * @param {import("../DeviceInterface/InterfacePrototype").default} device
 * @returns {Promise<boolean>}
 */
const canBeAutofilled = async (input, device) => {
    const mainType = getInputMainType(input);
    if (mainType === 'unknown') return false;

    const subtype = getInputSubtype(input);
    const variant = getInputVariant(input);
    await device.settings.populateDataIfNeeded({ mainType, subtype });
    const canAutofill = device.settings.canAutofillType({ mainType, subtype, variant }, device.inContextSignup);
    return Boolean(canAutofill);
};

/**
 * A map of config objects. These help by centralising here some complexity
 * @type {InputTypeConfig}
 */
const inputTypeConfig = {
    /** @type {CredentialsInputTypeConfig} */
    credentials: {
        type: 'credentials',
        displayName: 'passwords',
        getIconBase: (input, form) => {
            const { device } = form;
            if (!canBeInteractedWith(input)) return '';

            if (device.credentialsImport?.isAvailable() && (form?.isLogin || form?.isHybrid)) return '';

            if (device.settings.featureToggles.inlineIcon_credentials) {
                const subtype = getInputSubtype(input);
                const variant = getInputVariant(input);

                if (subtype === 'password' && variant === 'new') {
                    return ddgPasswordIcons.ddgPasswordGenIconBase;
                }

                return ddgPasswordIcons.ddgPasswordIconBase;
            }
            return '';
        },
        getIconFilled: (input, { device }) => {
            if (device.settings.featureToggles.inlineIcon_credentials) {
                const subtype = getInputSubtype(input);
                const variant = getInputVariant(input);

                if (subtype === 'password' && variant === 'new') {
                    return ddgPasswordIcons.ddgPasswordGenIconFilled;
                }

                return ddgPasswordIcons.ddgPasswordIconFilled;
            }
            return '';
        },
        getIconAlternate: () => '',
        shouldDecorate: async (input, { isLogin, isHybrid, device, isCredentialsImportAvailable }) => {
            const subtype = getInputSubtype(input);
            const variant = getInputVariant(input);

            if (
                (subtype === 'password' && variant === 'new') || // New passord field
                isLogin ||
                isHybrid ||
                variant === 'current' // Current password field
            ) {
                // Check feature flags and available input types
                return isCredentialsImportAvailable || canBeAutofilled(input, device);
            }

            return false;
        },
        dataType: 'Credentials',
        tooltipItem: (data) => createCredentialsTooltipItem(data),
    },
    /** @type {CreditCardsInputTypeConfig} */
    creditCards: {
        type: 'creditCards',
        displayName: 'credit cards',
        getIconBase: () => '',
        getIconFilled: () => '',
        getIconAlternate: () => '',
        shouldDecorate: async (input, { device }) => {
            return canBeAutofilled(input, device);
        },
        dataType: 'CreditCards',
        tooltipItem: (data) => new CreditCardTooltipItem(data),
    },
    /** @type {IdentitiesInputTypeConfig} */
    identities: {
        type: 'identities',
        displayName: 'identities',
        getIconBase: getIdentitiesIcon,
        getIconFilled: getIdentitiesIcon,
        getIconAlternate: getIdentitiesAlternateIcon,
        shouldDecorate: async (input, { device }) => {
            return canBeAutofilled(input, device);
        },
        dataType: 'Identities',
        tooltipItem: (data) => new IdentityTooltipItem(data),
    },
    /** @type {UnknownInputTypeConfig} */
    unknown: {
        type: 'unknown',
        displayName: '',
        getIconBase: () => '',
        getIconFilled: () => '',
        getIconAlternate: () => '',
        shouldDecorate: async () => false,
        dataType: '',
        tooltipItem: (_data) => {
            throw new Error('unreachable - setting tooltip to unknown field type');
        },
    },
};

/**
 * Retrieves configs from an input el
 * @param {HTMLInputElement} input
 * @returns {InputTypeConfigs}
 */
const getInputConfig = (input) => {
    const inputType = getInputType(input);
    return getInputConfigFromType(inputType);
};

/**
 * Retrieves configs from an input type
 * @param {import('./matching').SupportedTypes} inputType
 * @returns {InputTypeConfigs}
 */
const getInputConfigFromType = (inputType) => {
    const inputMainType = getMainTypeFromType(inputType);
    return inputTypeConfig[inputMainType];
};

/**
 * Given an input field checks wheter it was previously decorated
 * @param {HTMLInputElement} input
 * @returns {Boolean}
 */
const isFieldDecorated = (input) => {
    return input.hasAttribute(constants.ATTR_INPUT_TYPE);
};

export { getInputConfig, getInputConfigFromType, canBeInteractedWith, isFieldDecorated };
