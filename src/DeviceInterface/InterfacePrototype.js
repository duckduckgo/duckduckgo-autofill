import {
    ADDRESS_DOMAIN,
    SIGN_IN_MSG,
    sendAndWaitForAnswer,
    formatDuckAddress,
    notifyWebApp,
    getDaxBoundingBox,
} from '../autofill-utils.js';

import { getInputType, getMainTypeFromType, getSubtypeFromType } from '../Form/matching.js';
import { formatFullName } from '../Form/formatters.js';
import { fromPassword, AUTOGENERATED_KEY, PROVIDER_LOCKED, appendGeneratedKey } from '../InputTypes/Credentials.js';
import { PasswordGenerator } from '../PasswordGenerator.js';
import { createScanner } from '../Scanner.js';
import { createGlobalConfig } from '../config.js';
import { NativeUIController } from '../UI/controllers/NativeUIController.js';
import { createTransport } from '../deviceApiCalls/transports/transports.js';
import { Settings } from '../Settings.js';
import { DeviceApi } from '../../packages/device-api/index.js';
import { GetAutofillCredentialsCall, StoreFormDataCall, SendJSPixelCall } from '../deviceApiCalls/__generated__/deviceApiCalls.js';
import { initFormSubmissionsApi } from './initFormSubmissionsApi.js';
import { EmailProtection } from '../EmailProtection.js';
import { getTranslator } from '../locales/strings.js';
import { CredentialsImport } from '../CredentialsImport.js';

/**
 * @typedef {import('../deviceApiCalls/__generated__/validators-ts').StoreFormData} StoreFormData
 */

/**
 * @implements {GlobalConfigImpl}
 * @implements {FormExtensionPoints}
 * @implements {DeviceExtensionPoints}
 */
class InterfacePrototype {
    attempts = 0;
    /** @type {import("../Form/Form").Form | null} */
    activeForm = null;
    /** @type {import("../UI/HTMLTooltip.js").default | null} */
    currentTooltip = null;
    /** @type {number} */
    initialSetupDelayMs = 0;
    autopromptFired = false;

    /** @type {PasswordGenerator} */
    passwordGenerator = new PasswordGenerator();
    emailProtection = new EmailProtection(this);
    credentialsImport = new CredentialsImport(this);

    /** @type {import("../InContextSignup.js").InContextSignup | null} */
    inContextSignup = null;
    /** @type {import("../ThirdPartyProvider.js").ThirdPartyProvider | null} */
    thirdPartyProvider = null;

    /** @type {{privateAddress: string, personalAddress: string}} */
    #addresses = {
        privateAddress: '',
        personalAddress: '',
    };

    /** @type {GlobalConfig} */
    globalConfig;

    /** @type {import('../Scanner').Scanner} */
    scanner;

    /** @type {import("../UI/controllers/UIController.js").UIController | null} */
    uiController;

    /** @type {import("../../packages/device-api").DeviceApi} */
    deviceApi;

    /**
     * Translates a string to the current language, replacing each placeholder
     * with a key present in `opts` with the corresponding value.
     * @type {import('../locales/strings').TranslateFn}
     */
    t;

    /** @type {boolean} */
    isInitializationStarted;

    /** @type {((reason, ...rest) => void) | null} */
    _scannerCleanup = null;

    /**
     * @param {GlobalConfig} config
     * @param {import("../../packages/device-api").DeviceApi} deviceApi
     * @param {Settings} settings
     */
    constructor(config, deviceApi, settings) {
        this.globalConfig = config;
        this.deviceApi = deviceApi;
        this.settings = settings;
        this.t = getTranslator(settings);
        this.uiController = null;
        this.scanner = createScanner(this, {
            initialDelay: this.initialSetupDelayMs,
        });
        this.isInitializationStarted = false;
    }

    /**
     * Implementors should override this with a UI controller that suits
     * their platform.
     *
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createUIController() {
        return new NativeUIController();
    }

    /**
     * @param {string} reason
     */
    removeAutofillUIFromPage(reason) {
        this.uiController?.destroy();
        this._scannerCleanup?.(reason);
    }

    get hasLocalAddresses() {
        return !!(this.#addresses?.privateAddress && this.#addresses?.personalAddress);
    }
    getLocalAddresses() {
        return this.#addresses;
    }
    storeLocalAddresses(addresses) {
        this.#addresses = addresses;
        // When we get new duck addresses, add them to the identities list
        const identities = this.getLocalIdentities();
        const privateAddressIdentity = identities.find(({ id }) => id === 'privateAddress');
        // If we had previously stored them, just update the private address
        if (privateAddressIdentity) {
            privateAddressIdentity.emailAddress = formatDuckAddress(addresses.privateAddress);
        } else {
            // Otherwise, add both addresses
            this.#data.identities = this.addDuckAddressesToIdentities(identities);
        }
    }

    /** @type { PMData } */
    #data = {
        credentials: [],
        creditCards: [],
        identities: [],
        topContextData: undefined,
    };

    /**
     * @returns {import('../Form/matching').SupportedTypes}
     */
    getCurrentInputType() {
        throw new Error('Not implemented');
    }

    addDuckAddressesToIdentities(identities) {
        if (!this.hasLocalAddresses) return identities;

        const newIdentities = [];
        let { privateAddress, personalAddress } = this.getLocalAddresses();
        privateAddress = formatDuckAddress(privateAddress);
        personalAddress = formatDuckAddress(personalAddress);

        // Get the duck addresses in identities
        const duckEmailsInIdentities = identities.reduce(
            (duckEmails, { emailAddress: email }) => (email?.includes(ADDRESS_DOMAIN) ? duckEmails.concat(email) : duckEmails),
            [],
        );

        // Only add the personal duck address to identities if the user hasn't
        // already manually added it
        if (!duckEmailsInIdentities.includes(personalAddress)) {
            newIdentities.push({
                id: 'personalAddress',
                emailAddress: personalAddress,
                title: this.t('autofill:blockEmailTrackers'),
            });
        }

        newIdentities.push({
            id: 'privateAddress',
            emailAddress: privateAddress,
            title: this.t('autofill:blockEmailTrackersAndHideAddress'),
        });

        return [...identities, ...newIdentities];
    }

    /**
     * Stores init data coming from the tooltipHandler
     * @param { InboundPMData } data
     */
    storeLocalData(data) {
        this.storeLocalCredentials(data.credentials);

        data.creditCards.forEach((cc) => delete cc.cardNumber && delete cc.cardSecurityCode);
        // Store the full name as a separate field to simplify autocomplete
        const updatedIdentities = data.identities.map((identity) => ({
            ...identity,
            fullName: formatFullName(identity),
        }));
        // Add addresses
        this.#data.identities = this.addDuckAddressesToIdentities(updatedIdentities);
        this.#data.creditCards = data.creditCards;

        // Top autofill only
        if (data.serializedInputContext) {
            try {
                this.#data.topContextData = JSON.parse(data.serializedInputContext);
            } catch (e) {
                console.error(e);
                this.removeTooltip();
            }
        }
    }

    /**
     * Stores credentials locally
     * @param {CredentialsObject[]} credentials
     */
    storeLocalCredentials(credentials) {
        credentials.forEach((cred) => delete cred.password);
        this.#data.credentials = credentials;
    }
    getTopContextData() {
        return this.#data.topContextData;
    }

    /**
     * @deprecated use `availableInputTypes.credentials` directly instead
     * @returns {boolean}
     */
    get hasLocalCredentials() {
        return this.#data.credentials.length > 0;
    }
    getLocalCredentials() {
        return this.#data.credentials.map((cred) => {
            const { password, ...rest } = cred;
            return rest;
        });
    }
    /**
     * @deprecated use `availableInputTypes.identities` directly instead
     * @returns {boolean}
     */
    get hasLocalIdentities() {
        return this.#data.identities.length > 0;
    }
    getLocalIdentities() {
        return this.#data.identities;
    }

    /**
     * @deprecated use `availableInputTypes.creditCards` directly instead
     * @returns {boolean}
     */
    get hasLocalCreditCards() {
        return this.#data.creditCards.length > 0;
    }
    /** @return {CreditCardObject[]} */
    getLocalCreditCards() {
        return this.#data.creditCards;
    }

    async startInit() {
        if (this.isInitializationStarted) return;

        this.isInitializationStarted = true;

        this.addDeviceListeners();

        await this.setupAutofill();

        this.uiController = this.createUIController();

        // this is the temporary measure to support windows whilst we still have 'setupAutofill'
        // eventually all interfaces will use this
        if (!this.settings.enabled) {
            return;
        }

        await this.setupSettingsPage();
        await this.postInit();

        if (this.settings.featureToggles.credentials_saving) {
            initFormSubmissionsApi(this.scanner.forms, this.scanner.matching);
        }
    }

    async init() {
        // bail very early if we can
        const settings = await this.settings.refresh();
        if (!settings.enabled) return;

        const handler = async () => {
            if (document.readyState === 'complete') {
                window.removeEventListener('load', handler);
                document.removeEventListener('readystatechange', handler);
                await this.startInit();
            }
        };
        if (document.readyState === 'complete') {
            await this.startInit();
        } else {
            window.addEventListener('load', handler);
            document.addEventListener('readystatechange', handler);
        }
    }

    postInit() {
        const cleanup = this.scanner.init();
        this.addLogoutListener(() => {
            cleanup('Logged out');
            if (this.globalConfig.isDDGDomain) {
                notifyWebApp({ deviceSignedIn: { value: false } });
            }
        });
    }

    /**
     * @deprecated This was a port from the macOS implementation so the API may not be suitable for all
     * @returns {Promise<any>}
     */
    async getSelectedCredentials() {
        throw new Error('`getSelectedCredentials` not implemented');
    }

    isTestMode() {
        return this.globalConfig.isDDGTestMode;
    }

    /**
     * This indicates an item was selected on Desktop, and we should try to autofill
     *
     * Note: When we're in a top-frame scenario, like on like macOS & Windows in the webview,
     * this method gets overridden {@see WindowsOverlayDeviceInterface} {@see AppleOverlayDeviceInterface}
     *
     * @param {IdentityObject|CreditCardObject|CredentialsObject|{email:string, id: string}} data
     * @param {string} type
     */
    async selectedDetail(data, type) {
        const form = this.activeForm;
        if (!form) {
            return;
        }

        // are we autofilling email?
        if (type === 'email' && 'email' in data) {
            form.autofillEmail(data.email);
        } else {
            form.autofillData(data, type);
        }

        const isPrivateAddress = data.id === 'privateAddress';

        /**
         * This is desktop only: was  it a private address? if so, save it with
         * the trigger 'emailProtection' so that native sides can use it
         */
        if (isPrivateAddress) {
            this.refreshAlias();
            if ('emailAddress' in data && data.emailAddress) {
                this.emailProtection.storeReceived(data.emailAddress);

                /** @type {DataStorageObject} */
                const formValues = {
                    credentials: {
                        username: data.emailAddress,
                        autogenerated: true,
                    },
                };
                this.storeFormData(formValues, 'emailProtection');
            }
        }

        await this.removeTooltip();
    }

    /**
     * Before the DataWebTooltip opens, we collect the data based on the config.type
     * @param {InputTypeConfigs} config
     * @param {import('../Form/matching').SupportedTypes} inputType
     * @param {TopContextData} [data]
     * @returns {(CredentialsObject|CreditCardObject|IdentityObject)[]}
     */
    dataForAutofill(config, inputType, data) {
        const subtype = getSubtypeFromType(inputType);
        if (config.type === 'identities') {
            return this.getLocalIdentities().filter((identity) => !!identity[subtype]);
        }
        if (config.type === 'creditCards') {
            return this.getLocalCreditCards();
        }
        if (config.type === 'credentials') {
            if (data) {
                if (Array.isArray(data.credentials) && data.credentials.length > 0) {
                    return data.credentials;
                } else {
                    return this.getLocalCredentials().filter(
                        (cred) => !!cred[subtype] || subtype === 'password' || cred.id === PROVIDER_LOCKED,
                    );
                }
            }
        }
        return [];
    }

    /**
     * @param {object} params
     * @param {import("../Form/Form").Form} params.form
     * @param {HTMLInputElement} params.input
     * @param {{ x: number; y: number; } | null} params.click
     * @param {import('../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest['trigger']} params.trigger
     * @param {import('../UI/controllers/UIController.js').AttachArgs["triggerMetaData"]} params.triggerMetaData
     */
    attachTooltip(params) {
        const { form, input, click, trigger } = params;
        // Avoid flashing tooltip from background tabs on macOS
        if (document.visibilityState !== 'visible' && trigger !== 'postSignup') return;
        // Only autoprompt on mobile devices
        if (trigger === 'autoprompt' && !this.globalConfig.isMobileApp) return;
        // Only fire autoprompt once
        if (trigger === 'autoprompt' && this.autopromptFired) return;

        form.activeInput = input;
        this.activeForm = form;
        const inputType = getInputType(input);

        /** @type {import('../UI/interfaces.js').PosFn} */
        const getPosition = () => {
            // In extensions, the tooltip is centered on the Dax icon
            const alignLeft = this.globalConfig.isApp || this.globalConfig.isWindows;
            return alignLeft ? input.getBoundingClientRect() : getDaxBoundingBox(input);
        };

        // todo: this will be migrated to use NativeUIController soon
        if (this.globalConfig.isMobileApp && inputType === 'identities.emailAddress') {
            this.getAlias().then((alias) => {
                if (alias) {
                    form.autofillEmail(alias);
                    /**
                     * We're on mobile here, so we just record the email received.
                     * Then later in the form submission we can compare the values
                     */
                    this.emailProtection.storeReceived(alias);
                } else {
                    form.activeInput?.focus();
                }

                // Update data from native-side in case the `getAlias` call
                // has included a successful in-context signup
                this.updateForStateChange();
                this.onFinishedAutofill();
            });
            return;
        }

        /** @type {TopContextData} */
        const topContextData = {
            inputType,
            credentialsImport: this.credentialsImport.isAvailable() && (this.activeForm.isLogin || this.activeForm.isHybrid),
        };

        // Allow features to append/change top context data
        // for example, generated passwords may get appended here
        const processedTopContext = this.preAttachTooltip(topContextData, input, form);

        this.uiController?.attach({
            input,
            form,
            click,
            getPosition,
            topContextData: processedTopContext,
            device: this,
            trigger,
            triggerMetaData: params.triggerMetaData,
        });

        if (trigger === 'autoprompt') {
            this.autopromptFired = true;
        }
    }

    /**
     * When an item was selected, we then call back to the device
     * to fetch the full suite of data needed to complete the autofill
     *
     * @param {import('../Form/matching').SupportedTypes} inputType
     * @param {(CreditCardObject|IdentityObject|CredentialsObject)[]} items
     * @param {CreditCardObject['id']|IdentityObject['id']|CredentialsObject['id']} id
     */
    onSelect(inputType, items, id) {
        id = String(id);
        const mainType = getMainTypeFromType(inputType);
        const subtype = getSubtypeFromType(inputType);

        if (id === PROVIDER_LOCKED) {
            return this.thirdPartyProvider?.askToUnlockProvider();
        }

        const matchingData = items.find((item) => String(item.id) === id);
        if (!matchingData) throw new Error('unreachable (fatal)');

        const dataPromise = (() => {
            switch (mainType) {
                case 'creditCards':
                    return this.getAutofillCreditCard(id);
                case 'identities':
                    return this.getAutofillIdentity(id);
                case 'credentials': {
                    if (AUTOGENERATED_KEY in matchingData) {
                        const autogeneratedPayload = { ...matchingData, username: '' };
                        return Promise.resolve({ success: autogeneratedPayload });
                    }
                    return this.getAutofillCredentials(id);
                }
                default:
                    throw new Error('unreachable!');
            }
        })();

        // wait for the data back from the device
        dataPromise
            .then((response) => {
                if (response) {
                    const data = response.success || response;
                    if (mainType === 'identities') {
                        this.firePixel({ pixelName: 'autofill_identity', params: { fieldType: subtype } });
                        switch (id) {
                            case 'personalAddress':
                                this.firePixel({ pixelName: 'autofill_personal_address' });
                                break;
                            case 'privateAddress':
                                this.firePixel({ pixelName: 'autofill_private_address' });
                                break;
                            default: {
                                // Also fire pixel when filling an identity with the personal duck address from an email field
                                const checks = [
                                    subtype === 'emailAddress',
                                    this.hasLocalAddresses,
                                    data?.emailAddress === formatDuckAddress(this.#addresses.personalAddress),
                                ];
                                if (checks.every(Boolean)) {
                                    this.firePixel({ pixelName: 'autofill_personal_address' });
                                }
                                break;
                            }
                        }
                    }
                    // some platforms do not include a `success` object, why?
                    return this.selectedDetail(data, mainType);
                } else {
                    return Promise.reject(new Error('none-success response'));
                }
            })
            .catch((e) => {
                console.error(e);
                return this.removeTooltip();
            });
    }

    isTooltipActive() {
        return this.uiController?.isActive?.() ?? false;
    }

    removeTooltip() {
        return this.uiController?.removeTooltip?.('interface');
    }

    onFinishedAutofill() {
        // Let input handlers know we've stopped autofilling
        this.activeForm?.activeInput?.dispatchEvent(new Event('mouseleave'));
    }

    async updateForStateChange() {
        // Remove decorations before refreshing data to make sure we
        // remove the currently set icons
        this.activeForm?.removeAllDecorations();

        // Update for any state that may have changed
        await this.refreshData();

        // Add correct icons and behaviour
        this.activeForm?.recategorizeAllInputs();
    }

    async refreshData() {
        await this.inContextSignup?.refreshData();
        await this.settings.populateData();
    }

    async setupSettingsPage({ shouldLog } = { shouldLog: false }) {
        if (!this.globalConfig.isDDGDomain) {
            return;
        }

        notifyWebApp({ isApp: this.globalConfig.isApp });

        if (this.isDeviceSignedIn()) {
            let userData;
            try {
                userData = await this.getUserData();
            } catch (e) {}

            let capabilities;
            try {
                capabilities = await this.getEmailProtectionCapabilities();
            } catch (e) {}

            // Set up listener for web app actions
            if (this.globalConfig.isDDGDomain) {
                window.addEventListener('message', (e) => {
                    if (e.data.removeUserData) {
                        this.removeUserData();
                    }

                    if (e.data.closeEmailProtection) {
                        this.closeEmailProtection();
                    }
                });
            }

            const hasUserData = userData && !userData.error && Object.entries(userData).length > 0;
            notifyWebApp({
                deviceSignedIn: {
                    value: true,
                    shouldLog,
                    userData: hasUserData ? userData : undefined,
                    capabilities,
                },
            });
        } else {
            this.trySigningIn();
        }
    }

    async setupAutofill() {}

    /** @returns {Promise<EmailAddresses>} */
    async getAddresses() {
        throw new Error('unimplemented');
    }

    /** @returns {Promise<null|Record<any,any>>} */
    getUserData() {
        return Promise.resolve(null);
    }

    /** @returns {void} */
    removeUserData() {}

    /** @returns {void} */
    closeEmailProtection() {}

    /** @returns {Promise<null|Record<string,boolean>>} */
    getEmailProtectionCapabilities() {
        throw new Error('unimplemented');
    }

    refreshAlias() {}
    async trySigningIn() {
        if (this.globalConfig.isDDGDomain) {
            if (this.attempts < 10) {
                this.attempts++;
                const data = await sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData');
                // This call doesn't send a response, so we can't know if it succeeded
                this.storeUserData(data);

                await this.setupAutofill();
                await this.settings.refresh();
                await this.setupSettingsPage({ shouldLog: true });
                await this.postInit();
            } else {
                console.warn('max attempts reached, bailing');
            }
        }
    }
    storeUserData(_data) {}

    addDeviceListeners() {}

    /** @param {() => void} _fn */
    addLogoutListener(_fn) {}
    isDeviceSignedIn() {
        return false;
    }
    /**
     * @returns {Promise<string|undefined>}
     */
    async getAlias() {
        return undefined;
    }
    // PM endpoints
    getAccounts() {}
    /**
     * Gets credentials ready for autofill
     * @param {CredentialsObject['id']} id - the credential id
     * @returns {Promise<CredentialsObject|{success:CredentialsObject}>}
     */
    async getAutofillCredentials(id) {
        return this.deviceApi.request(new GetAutofillCredentialsCall({ id: String(id) }));
    }

    /** @returns {APIResponse<CreditCardObject>} */
    async getAutofillCreditCard(_id) {
        throw new Error('getAutofillCreditCard unimplemented');
    }
    /** @returns {Promise<{success: IdentityObject|undefined}>} */
    async getAutofillIdentity(_id) {
        throw new Error('getAutofillIdentity unimplemented');
    }

    openManagePasswords() {}
    openManageCreditCards() {}
    openManageIdentities() {}

    /**
     * @param {StoreFormData} values
     * @param {StoreFormData['trigger']} trigger
     */
    storeFormData(values, trigger) {
        this.deviceApi.notify(new StoreFormDataCall({ ...values, trigger }));
    }

    /**
     * `preAttachTooltip` happens just before a tooltip is show - features may want to append some data
     * at this point.
     *
     * For example, if password generation is enabled, this will generate
     * a password and send it to the tooltip as though it were a stored credential.
     *
     * @param {TopContextData} topContextData
     * @param {HTMLInputElement} input
     * @param {import("../Form/Form").Form} form
     */
    preAttachTooltip(topContextData, input, form) {
        // A list of checks to determine if we need to generate a password
        const checks = [topContextData.inputType === 'credentials.password.new', this.settings.featureToggles.password_generation];

        // if all checks pass, generate and save a password
        if (checks.every(Boolean)) {
            const password = this.passwordGenerator.generate({
                input: input.getAttribute('passwordrules'),
                domain: window.location.hostname,
            });

            const rawValues = form.getRawValues();
            const username = rawValues.credentials?.username || rawValues.identities?.emailAddress || '';

            // append the new credential to the topContextData so that the top autofill can display it
            topContextData.credentials = [fromPassword(password, username)];
        }

        return topContextData;
    }

    /**
     * `postAutofill` gives features an opportunity to perform an action directly
     * following an autofill.
     *
     * For example, if a generated password was used, we want to fire a save event.
     *
     * @param {IdentityObject|CreditCardObject|CredentialsObject} data
     * @param {SupportedMainTypes} dataType
     * @param {import("../Form/Form").Form} formObj
     */
    postAutofill(data, dataType, formObj) {
        // If there's an autogenerated password, prompt to save
        if (
            AUTOGENERATED_KEY in data &&
            'password' in data &&
            // Don't send message on Android to avoid potential abuse. Data is saved on native confirmation instead.
            !this.globalConfig.isAndroid
        ) {
            const formValues = formObj.getValuesReadyForStorage();
            if (formValues.credentials?.password === data.password) {
                /** @type {StoreFormData} */
                const formData = appendGeneratedKey(formValues, { password: data.password });
                this.storeFormData(formData, 'passwordGeneration');
            }
        }

        if (dataType === 'credentials' && formObj.shouldAutoSubmit) {
            formObj.attemptSubmissionIfNeeded();
        }
    }

    /**
     * `postSubmit` gives features a one-time-only opportunity to perform an
     * action directly after a form submission was observed.
     *
     * Mostly this is about storing data from the form submission, but it can
     * also be used like in the case of Password generation, to append additional
     * data before it's sent to be saved.
     *
     * @param {DataStorageObject} values
     * @param {import("../Form/Form").Form} form
     */
    postSubmit(values, form) {
        if (!form.form) return;
        if (!form.hasValues(values)) return;

        const isUsernameOnly = Object.keys(values?.credentials || {}).length === 1 && values?.credentials?.username;
        const checks = [form.shouldPromptToStoreData && !form.submitHandlerExecuted, this.passwordGenerator.generated, isUsernameOnly];
        if (checks.some(Boolean)) {
            const formData = appendGeneratedKey(values, {
                password: this.passwordGenerator.password,
                username: this.emailProtection.lastGenerated,
            });

            // If credentials has only username field, and no password field, then trigger is a partialSave
            const trigger = isUsernameOnly ? 'partialSave' : 'formSubmission';
            this.storeFormData(formData, trigger);
        }
    }

    /**
     * Sends a pixel to be fired on the client side
     * @param {import('../deviceApiCalls/__generated__/validators-ts').SendJSPixelParams} pixelParams
     */
    firePixel(pixelParams) {
        this.deviceApi.notify(new SendJSPixelCall(pixelParams));
    }

    /**
     * This serves as a single place to create a default instance
     * of InterfacePrototype that can be useful in testing scenarios
     * @param {Partial<GlobalConfig>} [globalConfigOverrides]
     * @returns {InterfacePrototype}
     */
    static default(globalConfigOverrides) {
        const globalConfig = createGlobalConfig(globalConfigOverrides);
        const transport = createTransport(globalConfig);
        const deviceApi = new DeviceApi(transport);
        const settings = Settings.default(globalConfig, deviceApi);
        return new InterfacePrototype(globalConfig, deviceApi, settings);
    }
}

export default InterfacePrototype;
