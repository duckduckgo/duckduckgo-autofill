import InterfacePrototype from '../DeviceInterface/InterfacePrototype.js';
import { createScanner } from '../Scanner.js';
import { attachAndReturnGenericForm, setMockSiteSpecificFixes } from '../test-utils.js';
import { constants } from '../constants.js';

afterEach(() => {
    document.body.innerHTML = '';
});

describe('Test the form class reading values correctly', () => {
    const testCases = [
        {
            testCase: 'form with username',
            form: `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: { credentials: { username: 'testUsername', password: 'testPassword' } },
        },
        {
            testCase: 'form with email',
            form: `
<form>
    <input type="email" value="name@email.com" autocomplete="email" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: { credentials: { username: 'name@email.com', password: 'testPassword' } },
        },
        {
            testCase: 'form with both email and username fields',
            form: `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="email" value="name@email.com" autocomplete="email" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: { credentials: { username: 'testUsername', password: 'testPassword' } },
        },
        {
            testCase: 'form with readonly email fields and password',
            form: `
<form>
    <input type="email" value="name@email.com" autocomplete="email" readonly />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: { credentials: { username: 'name@email.com', password: 'testPassword' } },
        },
        {
            testCase: 'form with empty fields',
            form: `
<form>
    <input type="text" value="" autocomplete="username" />
    <input type="password" value="" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: false,
            expValues: { credentials: undefined },
        },
        {
            testCase: 'form with only the password filled',
            form: `
<form>
    <input type="text" value="" autocomplete="username" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: { credentials: { password: 'testPassword' } },
        },
        {
            testCase: 'form with only the username filled',
            form: `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="password" value="" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: false,
            expValues: { credentials: undefined },
        },
        {
            testCase: 'form where the password is <=3 characters long',
            form: `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="password" value="abc" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: false,
            expValues: { credentials: undefined },
        },
        {
            testCase: 'form with hidden email field',
            form: `
<form>
    <input type="hidden" value="name@email.com" name="email" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: { credentials: { username: 'name@email.com', password: 'testPassword' } },
        },
        {
            testCase: 'form with hidden username field',
            form: `
<form>
    <input type="hidden" value="testUsername" name="username" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: { credentials: { username: 'testUsername', password: 'testPassword' } },
        },
        {
            testCase: 'form with email in plain text',
            form: `
<form>
    <span>Email: name@email.com</span>
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: { credentials: { username: 'name@email.com', password: 'testPassword' } },
        },
        {
            testCase: 'complete checkout form',
            form: `
<form method="post" id="usrForm">
    <fieldset>
        <legend>Contact Info</legend>
        <label for="frmNameA">Name</label>
        <input name="name" id="frmNameA" placeholder="Full name" autocomplete="name" value="Peppa Pig">
        <label for="frmEmailA">Email</label>
        <input type="email" name="email" id="frmEmailA" placeholder="name@example.com" autocomplete="email" value="peppapig@email.com">
        <label for="frmEmailC">Confirm Email</label>
        <input type="email" name="emailC" id="frmEmailC" placeholder="name@example.com" autocomplete="email" value="peppapig@email.com">
        <label for="frmPhoneNumA">Phone</label>
        <input type="tel" name="phone" id="frmPhoneNumA" placeholder="+1-650-450-1212" autocomplete="tel" value="6100000000">
    </fieldset>
    
    <fieldset>
        <legend>Billing</legend>
        <label for="frmAddressB">Address</label>
        <input name="bill-address" id="frmAddressB" placeholder="123 Any Street" autocomplete="billing street-address" value="604 Redford St">
        <label for="frmCityB">City</label>
        <input name="bill-city" id="frmCityB" placeholder="New York" autocomplete="billing address-level2" value="Farmville">
        <label for="frmStateB">State</label>
        <input name="bill-state" id="frmStateB" placeholder="NY" autocomplete="billing address-level1" value="Virginia">
        <label for="frmZipB">Zip</label>
        <input name="bill-zip" id="frmZipB" placeholder="10011" autocomplete="billing postal-code" value="23901">
        <label for="frmCountryB">Country</label>
        <input name="bill-country" id="frmCountryB" placeholder="USA" autocomplete="billing country" value="United States">
    </fieldset>

    <fieldset>
        <legend>Payment</legend>
        <label for="frmNameCC">Name on card</label>
        <input name="ccname" id="frmNameCC" placeholder="Full Name" autocomplete="cc-name" value="Peppa Pig">
        <label for="frmCCNum">Card Number</label>
        <input name="cardnumber" id="frmCCNum" autocomplete="cc-number" value="4111111111111111">
        <label for="frmCCCVC">CVC</label>
        <input name="cvc" id="frmCCCVC" autocomplete="cc-csc" value="123">
        <label for="frmCCExp">Expiry</label>
        <input name="cc-exp" id="frmCCExp" placeholder="MM-YYYY" autocomplete="cc-exp" value="12-2028">
  
        <button class="btn" id="butCheckout">Check Out</button>
    </fieldset>
</form>`,
            expHasValues: true,
            expValues: {
                identities: {
                    firstName: 'Peppa',
                    lastName: 'Pig',
                    addressStreet: '604 Redford St',
                    addressCity: 'Farmville',
                    addressProvince: 'Virginia',
                    addressPostalCode: '23901',
                    addressCountryCode: 'US',
                    phone: '6100000000',
                    emailAddress: 'peppapig@email.com',
                },
                creditCards: {
                    cardName: 'Peppa Pig',
                    cardSecurityCode: '123',
                    expirationMonth: '12',
                    expirationYear: '2028',
                    cardNumber: '4111111111111111',
                },
            },
        },
        {
            testCase: 'test localised country code with text input',
            form: `
<form lang="it">
    <input value="Peppa Pig" autocomplete="name" />
    <input value="via Gioberti 41" autocomplete="street-address" />
    <input value="Macerata" autocomplete="address-level2" />
    <input value="Italia" autocomplete="country" />
</form>`,
            expHasValues: true,
            expValues: { identities: { addressCountryCode: 'IT' } },
        },
        {
            testCase: 'incomplete identities form',
            form: `
<form>
    <input value="Macerata" autocomplete="address-level2" />
    <input value="Italia" autocomplete="country" />
</form>`,
            expHasValues: false,
            expValues: { identities: undefined },
        },
        {
            testCase: 'incomplete creditCard form',
            form: `
<form>
    <input autocomplete="cc-name" value="Peppa Pig">
    <input autocomplete="cc-number" value="4111111111111111">
</form>`,
            expHasValues: false,
            expValues: { creditCards: undefined },
        },
        {
            testCase: 'creditCard form with all values except cvv',
            form: `
<form>
    <label for="frmNameCC">Name on card</label>
    <input name="ccname" id="frmNameCC" placeholder="Full Name" autocomplete="cc-name" value="Peppa Pig">
    <label for="frmCCNum">Card Number</label>
    <input name="cardnumber" id="frmCCNum" autocomplete="cc-number" value="4111111111111111">
    <label for="frmCCExp">Expiry</label>
    <input name="cc-exp" id="frmCCExp" placeholder="YYYY-MM" autocomplete="cc-exp" value="2028-12">
</form>`,
            expHasValues: true,
            expValues: {
                creditCards: {
                    cardName: 'Peppa Pig',
                    expirationMonth: '12',
                    expirationYear: '2028',
                    cardNumber: '4111111111111111',
                },
            },
        },
        {
            testCase: 'creditCard form with all values but name and identities name in adjacent field',
            form: `
<form method="post" id="usrForm">
    <fieldset>
        <legend>Contact Info</legend>
        <label for="frmNameA">Name</label>
        <input name="name" id="frmNameA" placeholder="Full name" autocomplete="name" value="Peppa Pig">
        <label for="frmEmailA">Email</label>
        <input type="email" name="email" id="frmEmailA" placeholder="name@example.com" autocomplete="email" value="peppapig@email.com">
    </fieldset>

    <fieldset>
        <legend>Payment</legend>
        <label for="frmCCNum">Card Number</label>
        <input name="cardnumber" id="frmCCNum" autocomplete="cc-number" value="4111111111111111">
        <label for="frmCCCVC">CVC</label>
        <input name="cvc" id="frmCCCVC" autocomplete="cc-csc" value="123">
        <label for="frmCCExp">Expiry</label>
        <input name="cc-exp" id="frmCCExp" placeholder="MM-YYYY" autocomplete="cc-exp" value="12-2028">
        
        <button class="btn" id="butCheckout">Check Out</button>
    </fieldset>
</form>`,
            expHasValues: true,
            expValues: {
                identities: undefined,
                creditCards: {
                    cardName: 'Peppa Pig',
                    cardSecurityCode: '123',
                    expirationMonth: '12',
                    expirationYear: '2028',
                    cardNumber: '4111111111111111',
                },
            },
        },
        {
            testCase: 'signup form with email address and password, with first name and last name in adjacent fields    ',
            form: `
<form method="post" id="signupForm">
    <input type="text" value="Dax" id="firstName" placeholder="First name" />
    <input type="text" value="McDax" id="lastName" placeholder="Last name" />
    <input type="email" value="dax@mcdax.com" autocomplete="email" />
    <input type="password" value="123456" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: {
                credentials: { username: 'dax@mcdax.com', password: '123456' },
            },
        },
    ];

    test.each(testCases)('Test $testCase', ({ form, expHasValues, expValues }) => {
        const formEl = attachAndReturnGenericForm(form);
        const scanner = createScanner(InterfacePrototype.default()).findEligibleInputs(document);
        const formClass = scanner.forms.get(formEl);
        const hasValues = formClass?.hasValues();
        const formValues = formClass?.getValuesReadyForStorage();

        expect(hasValues).toBe(expHasValues);
        expect(formValues).toMatchObject(expValues);
    });
});

describe('Check form has focus', () => {
    test('focus detected correctly', () => {
        const formEl = attachAndReturnGenericForm();

        // When we require autofill, the script scores the fields in the DOM
        const scanner = createScanner(InterfacePrototype.default()).findEligibleInputs(document);

        const formClass = scanner.forms.get(formEl);

        expect(formClass?.hasFocus()).toBe(false);

        const input = formEl.querySelector('input');
        input?.focus();

        expect(formClass?.hasFocus()).toBe(true);

        input?.blur();

        expect(formClass?.hasFocus()).toBe(false);
    });
});

describe('Attempt form submission when needed', () => {
    const submitHandler = jest.fn((e) => e.preventDefault());

    afterEach(() => submitHandler.mockClear());

    describe('Do not submit', () => {
        test('when the form is not a login', () => {
            const formEl = attachAndReturnGenericForm();
            formEl.addEventListener('submit', submitHandler);
            const scanner = createScanner(InterfacePrototype.default()).findEligibleInputs(document);

            const formClass = scanner.forms.get(formEl);
            formClass?.attemptSubmissionIfNeeded();
            expect(submitHandler).not.toHaveBeenCalled();
        });
        test('when the form has more than one submit button', () => {
            const formEl = attachAndReturnGenericForm(`
                <form>
                    <input type="text" value="testUsername" autocomplete="username" />
                    <input type="password" value="testPassword" autocomplete="current-password" />
                    <button type="submit">Log in</button>
                    <button type="submit">Other weird login buton that takes you somewhere else</button>
                </form>`);
            formEl.addEventListener('submit', submitHandler);
            const scanner = createScanner(InterfacePrototype.default()).findEligibleInputs(document);

            const formClass = scanner.forms.get(formEl);
            formClass?.attemptSubmissionIfNeeded();
            expect(submitHandler).not.toHaveBeenCalled();
        });
    });
    describe('Submit the form', () => {
        test('a valid login form with a clear submit button', () => {
            const formEl = attachAndReturnGenericForm(`
                <form>
                    <input type="text" value="testUsername" autocomplete="username" />
                    <input type="password" value="testPassword" autocomplete="current-password" />
                    <button type="submit">Log in</button>
                </form>`);
            formEl.addEventListener('submit', submitHandler);
            const scanner = createScanner(InterfacePrototype.default()).findEligibleInputs(document);

            const formClass = scanner.forms.get(formEl);
            formClass?.attemptSubmissionIfNeeded();
            expect(submitHandler).toHaveBeenCalled();
        });
    });
});

describe('Form bails', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });
    test('when it has too many fields on load', async () => {
        const formEl = attachAndReturnGenericForm();
        for (let i = 0; i <= constants.MAX_INPUTS_PER_FORM + 10; i++) {
            const input = document.createElement('input');
            input.type = 'email';
            input.placeholder = 'Email address';
            formEl.appendChild(input);
        }

        createScanner(InterfacePrototype.default()).findEligibleInputs(document);
        const decoratedInputs = document.querySelectorAll(`[${constants.ATTR_INPUT_TYPE}]`);
        expect(decoratedInputs).toHaveLength(0);
    });
    test('when too many fields are added after the initial scan', async () => {
        const formEl = attachAndReturnGenericForm();

        const scanner = createScanner(InterfacePrototype.default()).findEligibleInputs(document);
        let decoratedInputs = document.querySelectorAll(`[${constants.ATTR_INPUT_TYPE}]`);
        expect(decoratedInputs).toHaveLength(2);

        const newInputs = [];
        for (let i = 0; i <= constants.MAX_INPUTS_PER_FORM + 10; i++) {
            const input = document.createElement('input');
            input.type = 'email';
            input.placeholder = 'Email address';
            newInputs.push(input);
        }
        formEl.append(...newInputs);
        // Scan right away without waiting for the queue
        scanner.findEligibleInputs(formEl);

        decoratedInputs = document.querySelectorAll(`[${constants.ATTR_INPUT_TYPE}]`);
        expect(decoratedInputs).toHaveLength(0);
    });
});

describe('Form re-categorizes inputs', () => {
    const deviceInterface = InterfacePrototype.default();
    deviceInterface.settings.setFeatureToggles({
        unknown_username_categorization: true,
        password_variant_categorization: true,
    });
    describe('Should recategorize', () => {
        test('when form has unknown input and has username data available', () => {
            const formEl = attachAndReturnGenericForm(`
                <form>
                <input type="text" value="unknown" autocomplete="unknown" />
                <input type="password" value="testPassword" autocomplete="current-password" />
                <button type="submit">Login</button>
            </form>`);
            deviceInterface.settings.setAvailableInputTypes({
                credentials: {
                    username: true,
                },
                identities: {
                    phone: true,
                },
            });
            const scanner = createScanner(deviceInterface).findEligibleInputs(document);
            const form = scanner.forms.get(formEl);
            const decoratedInputs = document.querySelectorAll(`[${constants.ATTR_INPUT_TYPE}]`);
            expect(decoratedInputs[0].getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.username');
            expect(form?.inputs.credentials.size).toBe(2);
        });
        test('when form has unknown input and has phone data available', () => {
            const formEl = attachAndReturnGenericForm(`
            <form>
                <input type="tel" placeholder="Phone" />
                <input type="password" value="testPassword" autocomplete="new-password" />
                <button type="submit">Sign in</button>
            </form>`);
            deviceInterface.settings.setAvailableInputTypes({
                credentials: {
                    username: false,
                },
                identities: {
                    phone: true,
                },
            });
            const scanner = createScanner(deviceInterface).findEligibleInputs(document);
            const form = scanner.forms.get(formEl);
            const decoratedInputs = document.querySelectorAll(`[${constants.ATTR_INPUT_TYPE}]`);
            expect(decoratedInputs[0].getAttribute(constants.ATTR_INPUT_TYPE)).toBe('identities.phone');
            expect(form?.inputs.identities.size).toBe(1);
        });

        test('when form has card number input and has credit card data available', () => {
            const formEl = attachAndReturnGenericForm(`
            <form>
                <input type="text" name="cardNumber" placeholder="Card Number" />
                <input type="password" value="testPassword" autocomplete="current-password" />
                <button type="submit">Sign in</button>
            </form>`);
            deviceInterface.settings.setAvailableInputTypes({
                credentials: {
                    username: false,
                },
                creditCards: {
                    cardNumber: true,
                },
            });
            const scanner = createScanner(deviceInterface).findEligibleInputs(document);
            const form = scanner.forms.get(formEl);
            const decoratedInputs = document.querySelectorAll(`[${constants.ATTR_INPUT_TYPE}]`);
            expect(decoratedInputs[0].getAttribute(constants.ATTR_INPUT_TYPE)).toBe('creditCards.cardNumber');
            expect(form?.inputs.creditCards.size).toBe(1);
        });
    });

    describe('Should not recategorize', () => {
        test('when form has card name input, and has username and cardName data available', () => {
            const formEl = attachAndReturnGenericForm(`
            <form>
                <input type="text" value="testCardName" autocomplete="cc-name" />
                <input type="password" value="testPassword" autocomplete="current-password" />
                <button type="submit">Login</button>
            </form>`);
            const scanner = createScanner(deviceInterface).findEligibleInputs(formEl);
            const form = scanner.forms.get(formEl);
            const decoratedInputs = document.querySelectorAll(`[${constants.ATTR_INPUT_TYPE}]`);
            deviceInterface.settings.setAvailableInputTypes({
                credentials: {
                    username: true,
                },
                creditCards: {
                    cardName: true,
                },
            });
            expect(decoratedInputs[0].getAttribute(constants.ATTR_INPUT_TYPE)).toBe('creditCards.cardName');
            expect(form?.inputs.creditCards.size).toBe(1);
            expect(form?.inputs.unknown.size).toBe(0);
        });

        test('when form has username input and unknown input together, and username data available', () => {
            const formEl = attachAndReturnGenericForm(`
                <form>
                    <input type="text" value="testUsername" autocomplete="username" />
                    <input type="text" value="unknown" autocomplete="unknown" />
                    <input type="password" value="testPassword" autocomplete="current-password" />
                    <button type="submit">Sign in</button>
                </form>`);
            deviceInterface.settings.setAvailableInputTypes({
                credentials: {
                    username: true,
                },
            });
            const scanner = createScanner(deviceInterface).findEligibleInputs(formEl);
            const form = scanner.forms.get(formEl);
            const decoratedInputs = document.querySelectorAll(`[${constants.ATTR_INPUT_TYPE}]`);
            expect(decoratedInputs[1].getAttribute(constants.ATTR_INPUT_TYPE)).toBe('unknown');
            expect(form?.inputs.unknown.size).toBe(1);
            expect(form?.inputs.credentials.size).toBe(2);
        });

        test('when it is a signup form with unknown input and has username data available', () => {
            const formEl = attachAndReturnGenericForm(`
                <form>
                    <input type="text" value="unknown" autocomplete="unknown" />
                    <input type="password" value="testPassword" autocomplete="new-password" />
                    <button type="submit">Sign up</button>
                </form>`);
            deviceInterface.settings.setAvailableInputTypes({
                credentials: {
                    username: true,
                },
            });
            const scanner = createScanner(deviceInterface).findEligibleInputs(formEl);
            const form = scanner.forms.get(formEl);
            const decoratedInputs = document.querySelectorAll(`[${constants.ATTR_INPUT_TYPE}]`);
            expect(decoratedInputs[0].getAttribute(constants.ATTR_INPUT_TYPE)).toBe('unknown');
            expect(form?.inputs.unknown.size).toBe(1);
            expect(form?.inputs.credentials.size).toBe(1);
        });
    });
});

describe('site specific fixes', () => {
    describe('Form force boundary', () => {
        beforeEach(() => {
            document.body.innerHTML = '';
        });
        test('when a forced form is present in the config', () => {
            const formEl = attachAndReturnGenericForm(`
            <div id="form-boundary">
                <form id="original-form">
                    <input type="text" value="testUsername" autocomplete="username" />  
                </form>
            </div>`);

            // Given a runtime config with forced form boundary
            const deviceInterface = InterfacePrototype.default();
            setMockSiteSpecificFixes(deviceInterface, 'form-boundary');
            const scanner = createScanner(deviceInterface).findEligibleInputs(document);
            const forcedForm = /** @type {HTMLElement} */ (document.querySelector('#form-boundary'));
            if (!forcedForm) {
                throw new Error('Form boundary not found');
            }
            expect(scanner.forms.get(forcedForm)).toBeDefined();
            expect(scanner.forms.get(formEl)).toBeUndefined();
        });
        test("when form doesn't have a forced boundary", () => {
            const formEl = attachAndReturnGenericForm(`
            <div id="form-boundary">
                <form id="original-form">
                    <input type="text" value="testUsername" autocomplete="username" />  
                </form>
            </div>`);

            // given a runtime config without a forced form boundary (using a config that doesn't have a forced form boundary)
            const deviceInterface = InterfacePrototype.default();
            setMockSiteSpecificFixes(deviceInterface, 'login-to-signup');
            const scanner = createScanner(deviceInterface).findEligibleInputs(document);
            const forcedForm = /** @type {HTMLElement} */ (document.querySelector('#form-boundary'));
            if (!forcedForm) {
                throw new Error('Form boundary not found');
            }
            const form = scanner.forms.get(formEl);
            expect(form?.form.getAttribute('id')).toBe('original-form');
        });

        test('when form element is a page container, the actual form is within a div and there are no site-specific-fixes, the child form gets destroyed', () => {
            const formEl = attachAndReturnGenericForm(`
            <form id="container-form">
                <div id="form-boundary">
                    <input type="text" value="testUsername" autocomplete="username" />
                    <input type="password" value="testPassword" autocomplete="current-password" />
                    <button type="submit">Login</button>
                </div>
                <input type="text" value="testUsername2" autocomplete="username" />
            </form>`);

            // Given a runtime config without forced form boundary
            const deviceInterface = InterfacePrototype.default();
            const scanner = createScanner(deviceInterface).findEligibleInputs(document);

            // Check that scanner actually contains the real form boundary
            const formBoundaryElement = /** @type {HTMLElement} */ (document.querySelector('#form-boundary'));
            expect(scanner.forms.has(formBoundaryElement)).toBeFalsy();

            // Username input belongs to the parent form instead of the form boundary
            const usernameInput = /** @type {HTMLInputElement} */ (
                document.querySelector('#container-form input[type="text"]:first-child')
            );
            const form = scanner.forms.get(formEl);
            expect(form?.inputs.all.has(usernameInput)).toBeTruthy();

            // Input doesn't belong to the form boundary
            const formBoundaryForm = scanner.forms.get(formBoundaryElement);
            expect(formBoundaryForm?.inputs.all.has(usernameInput)).toBeFalsy();
        });

        test("when form element is a page container, the actual form is within a div and site-specific-fixes are present, the child form doesn't get destroyed", () => {
            attachAndReturnGenericForm(`
            <form id="container-form">
                <div id="form-boundary">
                    <input type="text" value="testUsername" autocomplete="username" />
                    <input type="password" value="testPassword" autocomplete="current-password" />
                    <button type="submit">Login</button>
                </div>
                <input type="text" value="testUsername2" autocomplete="username" />
            </form>`);

            const deviceInterface = InterfacePrototype.default();

            // Given a runtime config with forced form boundary
            setMockSiteSpecificFixes(deviceInterface, 'form-boundary');
            const scanner = createScanner(deviceInterface).findEligibleInputs(document);

            // Check that scanner actually contains the real form boundary
            const formBoundaryElement = /** @type {HTMLElement} */ (document.querySelector('#form-boundary'));
            expect(scanner.forms.has(formBoundaryElement)).toBeTruthy();

            const usernameInput = /** @type {HTMLInputElement} */ (document.querySelector('#form-boundary input[type="text"]:first-child'));

            // Username input belongs to the form boundary
            const formBoundaryForm = scanner.forms.get(formBoundaryElement);
            expect(formBoundaryForm?.inputs.all.has(usernameInput)).toBeTruthy();
        });
    });

    describe('Force form type', () => {
        test('when a forced form (login) type is present in the config', () => {
            // Given a signup form
            const formEl = attachAndReturnGenericForm(`
            <form id="signup">
                <input type="text" value="testUsername" autocomplete="username" />
                <input type="password" value="testPassword" autocomplete="new-password" />
                <button type="submit">Sign up</button>
            </form>`);

            const deviceInterface = InterfacePrototype.default();
            // And a signup to login config, that forces the form to be a login form
            setMockSiteSpecificFixes(deviceInterface, 'signup-to-login');
            const scanner = createScanner(deviceInterface).findEligibleInputs(document);
            const form = scanner.forms.get(formEl);
            // Then the form is a login form, instead of signup
            expect(form?.isLogin).toBeTruthy();
            expect(form?.isSignup).toBeFalsy();
        });
        test('when a forced form (signup) type is present in the config', () => {
            // Given a login form
            const formEl = attachAndReturnGenericForm(`
            <form id="login">
                <input type="text" value="testUsername" autocomplete="username" />
                <input type="password" value="testPassword" autocomplete="current-password" />
                <button type="submit">Login</button>
            </form>`);

            const deviceInterface = InterfacePrototype.default();
            // And a login to signup config, that forces the form to be a signup form
            setMockSiteSpecificFixes(deviceInterface, 'login-to-signup');
            const scanner = createScanner(deviceInterface).findEligibleInputs(document);
            const form = scanner.forms.get(formEl);
            // Then the form is a signup form, instead of login
            expect(form?.isLogin).toBeFalsy();
            expect(form?.isSignup).toBeTruthy();
        });
    });

    describe('Force input type', () => {
        beforeEach(() => {
            document.body.innerHTML = '';
            attachAndReturnGenericForm(`
                <form id="login">
                    <input id="username-input" type="text" value="username" autocomplete="username" />
                </form>`);
        });

        test('when a forced input type is not present in the config', () => {
            const deviceInterface = InterfacePrototype.default();
            // Setting a forced form type, but no forced input type
            setMockSiteSpecificFixes(deviceInterface, 'form-boundary');
            createScanner(deviceInterface).findEligibleInputs(document);
            const input = /** @type {HTMLInputElement} */ (document.getElementById('username-input'));
            expect(input.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.username');
        });

        test('when a forced input type is present in the config', () => {
            const deviceInterface = InterfacePrototype.default();
            setMockSiteSpecificFixes(deviceInterface, 'input-type');
            createScanner(deviceInterface).findEligibleInputs(document);
            const input = /** @type {HTMLInputElement} */ (document.getElementById('username-input'));
            expect(input.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('identities.emailAddress');
        });
    });
});

describe('Password variant recategorization', () => {
    test('recategorizes first password field to current-password when there are 3 new-password fields', () => {
        attachAndReturnGenericForm(`
            <form>
                <input id="old-password" type="password" value="oldPassword" />
                <input id="new-password" type="password" value="newPassword" autocomplete="new-password" />
                <input id="confirm-password" type="password" value="confirmPassword" autocomplete="new-password" />
                <button type="submit">Change Password</button>
            </form>`);

        // Create a device interface with password_variant_categorization enabled
        const deviceInterface = InterfacePrototype.default();
        deviceInterface.settings.setFeatureToggles({
            password_variant_categorization: true,
        });

        createScanner(deviceInterface).findEligibleInputs(document);

        // Query password inputs by their IDs
        const oldPasswordInput = /** @type {HTMLInputElement} */ (document.getElementById('old-password'));
        const newPasswordInput = /** @type {HTMLInputElement} */ (document.getElementById('new-password'));
        const confirmPasswordInput = /** @type {HTMLInputElement} */ (document.getElementById('confirm-password'));

        // The first password field should be recategorized to current-password
        expect(oldPasswordInput.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.current');
        // The other password fields should remain as new-password
        expect(newPasswordInput.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.new');
        expect(confirmPasswordInput.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.new');
    });

    test('does not recategorize when there are less than 3 new-password fields', () => {
        attachAndReturnGenericForm(`
            <form>
                <input id="new-password" type="password" value="newPassword" autocomplete="new-password" />
                <input id="confirm-password" type="password" value="confirmPassword" autocomplete="new-password" />
                <button type="submit">Create Account</button>
            </form>`);

        const deviceInterface = InterfacePrototype.default();
        deviceInterface.settings.setFeatureToggles({
            password_variant_categorization: true,
        });

        createScanner(deviceInterface).findEligibleInputs(document);

        // Query password inputs by their IDs
        const newPasswordInput = /** @type {HTMLInputElement} */ (document.getElementById('new-password'));
        const confirmPasswordInput = /** @type {HTMLInputElement} */ (document.getElementById('confirm-password'));

        // Both password fields should remain as new-password
        expect(newPasswordInput.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.new');
        expect(confirmPasswordInput.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.new');
    });

    test('does not recategorize when there is already a current-password field', () => {
        attachAndReturnGenericForm(`
            <form>
                <input id="current-password" type="password" value="oldPassword" autocomplete="current-password" />
                <input id="new-password" type="password" value="newPassword" autocomplete="new-password" />
                <input id="confirm-password" type="password" value="confirmPassword" autocomplete="new-password" />
                <button type="submit">Change Password</button>
            </form>`);

        const deviceInterface = InterfacePrototype.default();
        deviceInterface.settings.setFeatureToggles({
            password_variant_categorization: true,
        });

        createScanner(deviceInterface).findEligibleInputs(document);

        // Query password inputs by their IDs
        const currentPasswordInput = /** @type {HTMLInputElement} */ (document.getElementById('current-password'));
        const newPasswordInput = /** @type {HTMLInputElement} */ (document.getElementById('new-password'));
        const confirmPasswordInput = /** @type {HTMLInputElement} */ (document.getElementById('confirm-password'));

        // The first password should remain as current-password
        expect(currentPasswordInput.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.current');
        // The other password fields should remain as new-password
        expect(newPasswordInput.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.new');
        expect(confirmPasswordInput.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.new');
    });

    test('does not recategorize when feature toggle is disabled', () => {
        attachAndReturnGenericForm(`
            <form>
                <input id="password1" type="password" value="oldPassword" autocomplete="new-password" />
                <input id="password2" type="password" value="newPassword" autocomplete="new-password" />
                <input id="password3" type="password" value="confirmPassword" autocomplete="new-password" />
                <button type="submit">Change Password</button>
            </form>`);

        // Create a device interface with password_variant_categorization disabled
        const deviceInterface = InterfacePrototype.default();
        deviceInterface.settings.setFeatureToggles({
            password_variant_categorization: false,
        });

        createScanner(deviceInterface).findEligibleInputs(document);

        // Query password inputs by their IDs
        const password1 = /** @type {HTMLInputElement} */ (document.getElementById('password1'));
        const password2 = /** @type {HTMLInputElement} */ (document.getElementById('password2'));
        const password3 = /** @type {HTMLInputElement} */ (document.getElementById('password3'));

        // All password fields should remain as new-password
        expect(password1.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.new');
        expect(password2.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.new');
        expect(password3.getAttribute(constants.ATTR_INPUT_TYPE)).toBe('credentials.password.new');
    });
});
