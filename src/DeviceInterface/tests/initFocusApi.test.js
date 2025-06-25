import { initFocusApi, setAutocompleteOnIdentityField } from '../initFocusApi.js';
import * as utils from '../../autofill-utils.js';
import * as matching from '../../Form/matching.js';

// Mock dependencies
jest.mock('../../autofill-utils.js');
jest.mock('../../Form/matching.js');

// Type the mocked modules
const mockedUtils = /** @type {jest.Mocked<typeof utils>} */ (utils);
const mockedMatching = /** @type {jest.Mocked<typeof matching>} */ (matching);

describe('initFocusApi', () => {
    let forms;
    let settings;
    let attachKeyboardCallback;
    let focusApi;
    let mockInputElement;
    let mockForm;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Spy on DOM methods
        jest.spyOn(HTMLElement.prototype, 'addEventListener');
        jest.spyOn(HTMLElement.prototype, 'removeAttribute');
        jest.spyOn(HTMLElement.prototype, 'setAttribute');

        // Create mocks for our test
        mockInputElement = document.createElement('input');
        mockForm = {
            hasFocus: jest.fn(() => true),
            isAutofilling: false,
        };

        // Setup our forms collection
        forms = new Map();
        forms.set('testForm', mockForm);

        // Setup settings with feature flags
        settings = {
            featureToggles: {
                input_focus_api: true,
                autocomplete_attribute_support: true,
            },
        };

        // Setup keyboard callback
        attachKeyboardCallback = jest.fn();

        // Initialize the API with test values
        focusApi = initFocusApi(forms, settings, true, attachKeyboardCallback);
    });

    afterEach(() => {
        // Clean up any event listeners
        focusApi.cleanup();

        // Restore all mocks
        jest.restoreAllMocks();
    });

    it('should initialize and return the API methods', () => {
        expect(focusApi).toBeDefined();
        expect(typeof focusApi.setAutocompleteOnIdentityField).toBe('function');
        expect(typeof focusApi.cleanup).toBe('function');
    });

    it('should register focus event listener on initialization', () => {
        // We need to spy on window.addEventListener
        const addEventSpy = jest.spyOn(window, 'addEventListener');

        // Initialize the focus API
        initFocusApi(forms, settings, true, attachKeyboardCallback);

        // Check that addEventListener was called with expected args
        expect(addEventSpy).toHaveBeenCalledWith('focus', expect.any(Function), true);

        // Clean up spy
        addEventSpy.mockRestore();
    });

    it('should handle focus events and call attachKeyboard when input_focus_api is enabled', () => {
        // Mock pierce shadow tree to return our input element
        mockedUtils.pierceShadowTree.mockReturnValue(mockInputElement);

        // Create and dispatch a focus event
        const focusEvent = new FocusEvent('focus');
        window.dispatchEvent(focusEvent);

        // Check that attachKeyboardCallback was called with correct arguments
        expect(attachKeyboardCallback).toHaveBeenCalledWith({
            form: mockForm,
            element: mockInputElement,
        });
    });

    it('should not call attachKeyboard when input_focus_api is disabled', () => {
        // Disable the feature toggle
        settings.featureToggles.input_focus_api = false;

        // Reinitialize the API
        focusApi.cleanup();
        focusApi = initFocusApi(forms, settings, true, attachKeyboardCallback);

        // Mock pierce shadow tree to return our input element
        mockedUtils.pierceShadowTree.mockReturnValue(mockInputElement);

        // Create and dispatch a focus event
        const focusEvent = new FocusEvent('focus');
        window.dispatchEvent(focusEvent);

        // Check that attachKeyboardCallback was not called
        expect(attachKeyboardCallback).not.toHaveBeenCalled();
    });

    it('should set autocomplete attribute when autocomplete_attribute_support is enabled', () => {
        // Create an actual input element instead of mocking
        const inputElement = document.createElement('input');

        // Mock the behavior of all the dependencies
        mockedUtils.pierceShadowTree.mockReturnValue(inputElement);
        mockedMatching.getInputType.mockReturnValue('identities.emailAddress');
        mockedMatching.getMainTypeFromType.mockReturnValue('identities');
        mockedMatching.getSubtypeFromType.mockReturnValue('emailAddress');

        // Spy on the methods we want to verify
        const setAttributeSpy = jest.spyOn(inputElement, 'setAttribute');
        const addEventListenerSpy = jest.spyOn(inputElement, 'addEventListener');

        // Create and dispatch a focus event
        const focusEvent = new FocusEvent('focus');
        window.dispatchEvent(focusEvent);

        // Verify the behavior
        expect(setAttributeSpy).toHaveBeenCalledWith('autocomplete', 'email');
        expect(addEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function), { once: true });

        // Get the blur callback and verify it removes the attribute
        const blurCallback = addEventListenerSpy.mock.calls[0][1];
        if (typeof blurCallback !== 'function') {
            throw new Error('Expected blur callback to be a function');
        }
        const removeAttributeSpy = jest.spyOn(inputElement, 'removeAttribute');

        // Call the blur callback directly with a mock blur event
        blurCallback(new FocusEvent('blur'));

        // Verify removeAttribute was called
        expect(removeAttributeSpy).toHaveBeenCalledWith('autocomplete');

        // Cleanup
        setAttributeSpy.mockRestore();
        addEventListenerSpy.mockRestore();
        removeAttributeSpy.mockRestore();
    });

    it('should not process events when a form is autofilling', () => {
        // Set a form to be autofilling
        mockForm.isAutofilling = true;

        // Mock pierce shadow tree to return our input element
        mockedUtils.pierceShadowTree.mockReturnValue(mockInputElement);

        // Create spy for the autocomplete method
        const setAutocompleteSpy = jest.spyOn(focusApi, 'setAutocompleteOnIdentityField');

        // Create and dispatch a focus event
        const focusEvent = new FocusEvent('focus');
        window.dispatchEvent(focusEvent);

        // Check that neither method was called
        expect(setAutocompleteSpy).not.toHaveBeenCalled();
        expect(attachKeyboardCallback).not.toHaveBeenCalled();
    });

    it('should not process non-iOS devices', () => {
        // Reinitialize the API for non-iOS device
        focusApi.cleanup();
        focusApi = initFocusApi(forms, settings, false, attachKeyboardCallback);

        // Mock pierce shadow tree to return our input element
        mockedUtils.pierceShadowTree.mockReturnValue(mockInputElement);

        // Create spies
        const setAutocompleteSpy = jest.spyOn(focusApi, 'setAutocompleteOnIdentityField');

        // Create and dispatch a focus event
        const focusEvent = new FocusEvent('focus');
        window.dispatchEvent(focusEvent);

        // Check that neither method was called
        expect(setAutocompleteSpy).not.toHaveBeenCalled();
        expect(attachKeyboardCallback).not.toHaveBeenCalled();
    });

    it('should properly clean up event listeners', () => {
        // We need to spy on window.removeEventListener
        const removeEventSpy = jest.spyOn(window, 'removeEventListener');

        // Call cleanup
        focusApi.cleanup();

        // Check that removeEventListener was called with expected args
        expect(removeEventSpy).toHaveBeenCalledWith('focus', expect.any(Function), true);

        // Clean up spy
        removeEventSpy.mockRestore();
    });

    describe('setAutocompleteOnIdentityField', () => {
        it('should set autocomplete attribute for identity input fields', () => {
            // Set up mock implementations for this test
            mockedMatching.getInputType.mockReturnValue('identities.emailAddress');
            mockedMatching.getMainTypeFromType.mockReturnValue('identities');
            mockedMatching.getSubtypeFromType.mockReturnValue('emailAddress');

            // Create a test input
            const input = document.createElement('input');

            // Create a spy
            const setSpy = jest.spyOn(input, 'setAttribute');

            // Call the exported function directly
            setAutocompleteOnIdentityField(input);

            // Verify setAttribute was called with the correct autocomplete value
            expect(setSpy).toHaveBeenCalledWith('autocomplete', 'email');

            // Cleanup
            setSpy.mockRestore();
        });

        it('should remove autocomplete attribute on blur', () => {
            // Set up mock implementations for this test
            mockedMatching.getInputType.mockReturnValue('identities.emailAddress');
            mockedMatching.getMainTypeFromType.mockReturnValue('identities');
            mockedMatching.getSubtypeFromType.mockReturnValue('emailAddress');

            // Create a test input
            const input = document.createElement('input');

            // Create spies
            const addEventListenerSpy = jest.spyOn(input, 'addEventListener');
            const removeAttributeSpy = jest.spyOn(input, 'removeAttribute');

            // Call the exported function directly
            setAutocompleteOnIdentityField(input);

            // Verify addEventListener was called for blur event
            expect(addEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function), { once: true });

            // Get the callback directly from the spy and execute it
            const blurCallback = addEventListenerSpy.mock.calls[0][1];
            if (typeof blurCallback === 'function') {
                blurCallback(new FocusEvent('blur'));
            }

            // Verify removeAttribute was called
            expect(removeAttributeSpy).toHaveBeenCalledWith('autocomplete');

            // Cleanup
            addEventListenerSpy.mockRestore();
            removeAttributeSpy.mockRestore();
        });

        it('should not set autocomplete on non-input elements', () => {
            // Create a non-input element
            const div = document.createElement('div');

            // Create setAttribute spy
            const setSpy = jest.spyOn(div, 'setAttribute');

            // Call the exported function with a non-input element
            setAutocompleteOnIdentityField(div);

            // Verify setAttribute was not called
            expect(setSpy).not.toHaveBeenCalled();
        });

        it('should not set autocomplete on inputs that already have autocomplete attribute', () => {
            // Create a test input
            const input = document.createElement('input');

            // Create hasAttribute spy before we set the actual attribute
            const hasAttributeSpy = jest.spyOn(input, 'hasAttribute').mockReturnValue(true);

            // Set up mock implementations for this test
            mockedMatching.getInputType.mockReturnValue('identities.emailAddress');
            mockedMatching.getMainTypeFromType.mockReturnValue('identities');

            // Create setAttribute spy
            const setSpy = jest.spyOn(input, 'setAttribute');

            // Call the exported function
            setAutocompleteOnIdentityField(input);

            // Verify setAttribute was not called
            expect(setSpy).not.toHaveBeenCalled();
            expect(hasAttributeSpy).toHaveBeenCalledWith('autocomplete');

            // Cleanup
            setSpy.mockRestore();
            hasAttributeSpy.mockRestore();
        });
    });
});
