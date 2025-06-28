import { initFocusApi, setAutocompleteOnIdentityField } from '../initFocusApi.js';
import { attachAndReturnGenericForm } from '../../test-utils.js';

describe('initFocusApi', () => {
    let forms;
    let settings;
    let attachKeyboardCallback;
    let focusApi;
    let mockForm;

    beforeEach(() => {
        jest.clearAllMocks();

        mockForm = {
            hasFocus: jest.fn(() => true),
            isAutofilling: false,
        };

        forms = new Map();
        forms.set('testForm', mockForm);

        settings = {
            featureToggles: {
                input_focus_api: true,
                autocomplete_attribute_support: true,
            },
        };

        attachKeyboardCallback = jest.fn();

        // Initialize the API with test values
        focusApi = initFocusApi(forms, settings, attachKeyboardCallback);
    });

    afterEach(() => {
        focusApi.cleanup();
    });

    it('should initialize and return the API methods', () => {
        expect(focusApi).toBeDefined();
        expect(typeof focusApi.setAutocompleteOnIdentityField).toBe('function');
        expect(typeof focusApi.cleanup).toBe('function');
    });

    it('should register focus event listener on initialization', () => {
        const addEventSpy = jest.spyOn(window, 'addEventListener');

        const newFocusApi = initFocusApi(forms, settings, attachKeyboardCallback);

        expect(addEventSpy).toHaveBeenCalledWith('focus', expect.any(Function), true);

        newFocusApi.cleanup();
        addEventSpy.mockRestore();
    });

    it('should handle focus events and call attachKeyboard when input_focus_api is enabled', () => {
        // Create a form with an email input that will be detected as an identity field
        attachAndReturnGenericForm(`
            <form>
                <input type="email" name="email" id="email-input" />
            </form>
        `);

        const emailInput = document.getElementById('email-input');

        const focusEvent = new FocusEvent('focus', { bubbles: true });
        Object.defineProperty(focusEvent, 'target', { value: emailInput, enumerable: true });
        window.dispatchEvent(focusEvent);

        expect(attachKeyboardCallback).toHaveBeenCalledWith({
            form: mockForm,
            element: emailInput,
        });
    });

    it('should not call attachKeyboard when input_focus_api is disabled', () => {
        settings.featureToggles.input_focus_api = false;

        // Reinitialize the API because the feature toggle has changed
        focusApi.cleanup();
        focusApi = initFocusApi(forms, settings, attachKeyboardCallback);

        attachAndReturnGenericForm(`
            <form>
                <input type="email" name="email" id="email-input" />
            </form>
        `);

        const emailInput = document.getElementById('email-input');

        const focusEvent = new FocusEvent('focus', { bubbles: true });
        Object.defineProperty(focusEvent, 'target', { value: emailInput, enumerable: true });
        window.dispatchEvent(focusEvent);

        expect(attachKeyboardCallback).not.toHaveBeenCalled();
    });

    it('should set autocomplete attribute on email input when autocomplete_attribute_support is enabled', () => {
        attachAndReturnGenericForm(`
            <form>
                <input type="email" name="email" id="email-input" />
            </form>
        `);

        const emailInput = /** @type {HTMLInputElement} */ (document.getElementById('email-input'));

        emailInput.setAttribute('data-ddg-inputType', 'identities.emailAddress');

        const focusEvent = new FocusEvent('focus', { bubbles: true });
        Object.defineProperty(focusEvent, 'target', { value: emailInput, enumerable: true });
        window.dispatchEvent(focusEvent);

        expect(emailInput.getAttribute('autocomplete')).toBe('email');
    });

    it('should set autocomplete attribute on name input fields', () => {
        attachAndReturnGenericForm(`
            <form>
                <input type="text" name="firstName" id="first-name" placeholder="First Name" />
                <input type="text" name="lastName" id="last-name" placeholder="Last Name" />
                <input type="text" name="fullName" id="full-name" placeholder="Full Name" />
            </form>
        `);

        const firstNameInput = /** @type {HTMLInputElement} */ (document.getElementById('first-name'));
        const lastNameInput = /** @type {HTMLInputElement} */ (document.getElementById('last-name'));
        const fullNameInput = /** @type {HTMLInputElement} */ (document.getElementById('full-name'));

        firstNameInput.setAttribute('data-ddg-inputType', 'identities.firstName');
        lastNameInput.setAttribute('data-ddg-inputType', 'identities.lastName');
        fullNameInput.setAttribute('data-ddg-inputType', 'identities.fullName');

        firstNameInput.focus();
        expect(firstNameInput.getAttribute('autocomplete')).toBe('given-name');

        lastNameInput.focus();
        expect(lastNameInput.getAttribute('autocomplete')).toBe('family-name');

        fullNameInput.focus();
        expect(fullNameInput.getAttribute('autocomplete')).toBe('name');
    });

    it('should set autocomplete attribute on phone input', () => {
        attachAndReturnGenericForm(`
            <form>
                <input type="tel" name="phone" id="phone-input" placeholder="Phone Number" />
            </form>
        `);

        const phoneInput = /** @type {HTMLInputElement} */ (document.getElementById('phone-input'));

        phoneInput.setAttribute('data-ddg-inputType', 'identities.phone');

        phoneInput.focus();

        expect(phoneInput.getAttribute('autocomplete')).toBe('tel');
    });

    it('should remove autocomplete attribute on blur', async () => {
        attachAndReturnGenericForm(`
            <form>
                <input type="email" name="email" id="email-input" />
            </form>
        `);

        const emailInput = /** @type {HTMLInputElement} */ (document.getElementById('email-input'));
        emailInput.setAttribute('data-ddg-inputType', 'identities.emailAddress');

        emailInput.focus();
        expect(emailInput.getAttribute('autocomplete')).toBe('email');

        emailInput.dispatchEvent(new Event('blur', { bubbles: true }));

        expect(emailInput.hasAttribute('autocomplete')).toBe(false);
    });

    it('should not set autocomplete when autocomplete_attribute_support is disabled', () => {
        settings.featureToggles.autocomplete_attribute_support = false;

        // Reinitialize the API because the feature toggle has changed
        focusApi.cleanup();
        focusApi = initFocusApi(forms, settings, attachKeyboardCallback);

        attachAndReturnGenericForm(`
            <form>
                <input type="email" name="email" id="email-input" />
            </form>
        `);

        const emailInput = /** @type {HTMLInputElement} */ (document.getElementById('email-input'));

        emailInput.setAttribute('data-ddg-inputType', 'identities.emailAddress');

        const focusEvent = new FocusEvent('focus', { bubbles: true });
        Object.defineProperty(focusEvent, 'target', { value: emailInput, enumerable: true });
        window.dispatchEvent(focusEvent);

        expect(emailInput.hasAttribute('autocomplete')).toBe(false);
    });

    it('should not process events when a form is autofilling', () => {
        mockForm.isAutofilling = true;

        attachAndReturnGenericForm(`
            <form>
                <input type="email" name="email" id="email-input" />
            </form>
        `);

        const emailInput = /** @type {HTMLInputElement} */ (document.getElementById('email-input'));

        emailInput.setAttribute('data-ddg-inputType', 'identities.emailAddress');

        const focusEvent = new FocusEvent('focus', { bubbles: true });
        Object.defineProperty(focusEvent, 'target', { value: emailInput, enumerable: true });
        window.dispatchEvent(focusEvent);

        // Check that neither autocomplete was set nor attachKeyboard was called
        expect(emailInput.hasAttribute('autocomplete')).toBe(false);
        expect(attachKeyboardCallback).not.toHaveBeenCalled();
    });

    it('should properly clean up event listeners', () => {
        const removeEventSpy = jest.spyOn(window, 'removeEventListener');

        focusApi.cleanup();

        expect(removeEventSpy).toHaveBeenCalledWith('focus', expect.any(Function), true);

        removeEventSpy.mockRestore();
    });

    describe('setAutocompleteOnIdentityField', () => {
        it('should set autocomplete attribute for email input fields', () => {
            // Create a form with an email input
            attachAndReturnGenericForm(`
                <form>
                    <input type="email" name="email" id="email-input" />
                </form>
            `);

            const emailInput = /** @type {HTMLInputElement} */ (document.getElementById('email-input'));
            emailInput.setAttribute('data-ddg-inputType', 'identities.emailAddress');

            setAutocompleteOnIdentityField(emailInput);

            expect(emailInput.getAttribute('autocomplete')).toBe('email');
        });

        it('should remove autocomplete attribute on blur', () => {
            attachAndReturnGenericForm(`
                <form>
                    <input type="email" name="email" id="email-input" />
                </form>
            `);

            const emailInput = /** @type {HTMLInputElement} */ (document.getElementById('email-input'));

            emailInput.setAttribute('data-ddg-inputType', 'identities.emailAddress');

            setAutocompleteOnIdentityField(emailInput);

            expect(emailInput.getAttribute('autocomplete')).toBe('email');

            emailInput.dispatchEvent(new Event('blur', { bubbles: true }));

            expect(emailInput.hasAttribute('autocomplete')).toBe(false);
        });

        it('should not set autocomplete on non-input elements', () => {
            attachAndReturnGenericForm(`
                <form>
                    <div id="not-input">Not an input</div>
                </form>
            `);

            const divElement = /** @type {HTMLElement} */ (document.getElementById('not-input'));

            setAutocompleteOnIdentityField(divElement);

            expect(divElement.hasAttribute('autocomplete')).toBe(false);
        });

        it('should not set autocomplete on inputs that already have autocomplete attribute', () => {
            // Purposely adding autocomplete="username"
            attachAndReturnGenericForm(`
                <form>
                    <input type="email" name="email" id="email-input" autocomplete="username" />
                </form>
            `);

            const emailInput = /** @type {HTMLInputElement} */ (document.getElementById('email-input'));

            emailInput.setAttribute('data-ddg-inputType', 'identities.emailAddress');

            setAutocompleteOnIdentityField(emailInput);

            expect(emailInput.getAttribute('autocomplete')).toBe('username');
        });

        it('should not set autocomplete on non-identity fields', () => {
            // Create a form with a password input (not an identity field)
            attachAndReturnGenericForm(`
                <form>
                    <input type="password" name="password" id="password-input" />
                </form>
            `);

            const passwordInput = /** @type {HTMLInputElement} */ (document.getElementById('password-input'));

            passwordInput.setAttribute('data-ddg-inputType', 'credentials.password');

            setAutocompleteOnIdentityField(passwordInput);

            expect(passwordInput.hasAttribute('autocomplete')).toBe(false);
        });
    });
});
