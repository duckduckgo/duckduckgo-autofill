import { createScanner } from './Scanner.js';
import InterfacePrototype from './DeviceInterface/InterfacePrototype.js';

describe('performance', () => {
    beforeEach(() => {
        require('./requestIdleCallback.js');
        document.body.innerHTML = `
            <form action="">
                <label for="input-01"><input type="text" id="input-01"></label>
                <label for="input-02"><input type="text" id="input-02"></label>
                <label for="input-03"><input type="text" id="input-03"></label>
                <label for="input-04"><input type="text" id="input-04"></label>
                <label for="input-05"><input type="text" id="input-05"></label>
            </form>`;
        jest.useFakeTimers();
    });
    afterAll(() => {
        jest.useRealTimers();
    });
    it('should debounce dom lookups', () => {
        const scanner = createScanner(InterfacePrototype.default());
        const spy = jest.spyOn(scanner, 'findEligibleInputs');
        scanner.enqueue([document]);
        scanner.enqueue([document]);
        scanner.enqueue([document]);
        scanner.enqueue([document]);
        scanner.enqueue([document]);
        jest.advanceTimersByTime(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(document.body).toMatchSnapshot();
    });
    it('should constrain the buffer size', () => {
        const scanner = createScanner(InterfacePrototype.default(), {
            bufferSize: 2,
        });

        const spy = jest.spyOn(scanner, 'findEligibleInputs');

        // this will add 5 *different* elements to the queue
        const inputs = document.querySelectorAll('input');
        for (const input of inputs) {
            scanner.enqueue([input]);
        }

        jest.advanceTimersByTime(1000);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(document.body).toMatchSnapshot();
    });
    it('should not scan if above maximum inputs', () => {
        const scanner = createScanner(InterfacePrototype.default(), {
            maxInputsPerPage: 3,
        });

        scanner.findEligibleInputs(document);
        jest.advanceTimersByTime(1000);

        // Confirm that no elements on the page are scanned
        expect(document.body).toMatchSnapshot();
    });
    it('should stop scanning if page grows above maximum inputs', () => {
        const scanner = createScanner(InterfacePrototype.default(), {
            maxInputsPerPage: 5,
            bufferSize: 2,
        });

        scanner.findEligibleInputs(document);
        jest.advanceTimersByTime(1000);

        // Add more new inputs than the buffer size allows
        const form = document.querySelector('form');
        const inputs = Array.from(Array(3)).map(() => {
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            return input;
        });
        inputs.forEach((input) => form?.appendChild(input));
        inputs.forEach((input) => scanner.enqueue([input]));
        jest.advanceTimersByTime(1000);

        // Confirm that newly added inputs are not scanned
        expect(document.body).toMatchSnapshot();
    });
    it('should stop scanning if page grows above maximum forms', () => {
        const scanner = createScanner(InterfacePrototype.default(), {
            maxFormsPerPage: 1,
        });
        const form = document.querySelector('form');
        const formClone = form?.cloneNode(true);
        if (!formClone) throw new Error('unreachable');
        document.body.appendChild(formClone);

        scanner.findEligibleInputs(document);
        jest.advanceTimersByTime(1000);

        // Confirm that newly added inputs are not scanned
        expect(document.body).toMatchSnapshot();
    });
});

describe('form container detection', () => {
    beforeEach(() => {
        require('./requestIdleCallback.js');
    });

    /**
     * Formless email + password fields sharing a container with another form, then scanned
     * @param {string} siblingFormContent
     */
    const scanFormlessFields = (siblingFormContent) => {
        document.body.innerHTML = `
            <main>
                <div id="container">
                    <form id="sibling-form" action="/redirect" method="post">${siblingFormContent}</form>
                    <div><div><label for="email">Add your email</label><div><input type="text" id="email" name="email"></div></div></div>
                    <div><div><label for="password">Choose a password</label><div><input type="password" id="password" name="password" autocomplete="new-password"></div></div></div>
                    <button type="button">Continue with Email</button>
                </div>
            </main>`;
        const scanner = createScanner(InterfacePrototype.default()).findEligibleInputs(document);
        const email = /** @type {HTMLInputElement} */ (document.getElementById('email'));
        const password = /** @type {HTMLInputElement} */ (document.getElementById('password'));
        const formOf = (/** @type {HTMLInputElement} */ input) => [...scanner.forms.keys()].find((formEl) => formEl.contains(input));
        return { emailForm: formOf(email), passwordForm: formOf(password) };
    };

    it('groups fields into one form when the sibling form only has hidden inputs', () => {
        const { emailForm, passwordForm } = scanFormlessFields(`<input type="hidden" name="referer" value="/">`);
        expect(emailForm).toBe(document.getElementById('container'));
        expect(passwordForm).toBe(emailForm);
    });

    it('groups fields into one form when the sibling form is empty', () => {
        const { emailForm, passwordForm } = scanFormlessFields('');
        expect(emailForm).toBe(document.getElementById('container'));
        expect(passwordForm).toBe(emailForm);
    });

    it('does not enclose a sibling form with visible inputs', () => {
        const { emailForm, passwordForm } = scanFormlessFields(`<input type="text" name="search">`);
        expect(emailForm).toBeDefined();
        expect(emailForm).not.toBe(document.getElementById('container'));
        expect(passwordForm).not.toBe(emailForm);
    });

    it('does not enclose a sibling form with buttons', () => {
        const { emailForm, passwordForm } = scanFormlessFields(`<button type="submit">Continue with Google</button>`);
        expect(emailForm).toBeDefined();
        expect(emailForm).not.toBe(document.getElementById('container'));
        expect(passwordForm).not.toBe(emailForm);
    });
});
