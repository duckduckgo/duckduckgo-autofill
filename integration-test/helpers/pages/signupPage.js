import { constants } from '../mocks.js';
import { mockedCalls, payloadsOnly } from '../harness.js';
import { expect } from '@playwright/test';
import { clickOnIcon } from '../utils.js';
import { genericPage } from './genericPage.js';

/**
 * A wrapper around interactions for `integration-test/pages/signup.html`
 *
 * @param {import("@playwright/test").Page} page
 */
export function signupPage(page) {
    const decoratedFirstInputSelector = '#email' + constants.fields.email.selectors.identity;
    const decoratedSecondInputSelector = '#email-2' + constants.fields.email.selectors.identity;
    const emailStyleAttr = () => page.locator('#email').first().getAttribute('style');

    class SignupPage {
        /**
         * @param {keyof typeof constants.pages} [to]
         * @return {Promise<void>}
         */
        async navigate(to = 'signup') {
            await page.goto(constants.pages[to]);
        }

        async clickIntoEmailField() {
            await page.getByLabel('Email').click();
        }

        async clickIntoPasswordField() {
            const input = page.locator('#password');
            await input.click();
        }

        async clickIntoPasswordConfirmationField() {
            const input = page.locator('#password-2');
            await input.click();
        }

        /**
         * @param {string} address
         */
        async selectPrivateAddress(address) {
            await page
                .getByRole('button', { name: `Generate Private Duck Address ${address} Block email trackers & hide address` })
                .click({ force: true });
        }

        /**
         * @param {number} times
         * @return {Promise<void>}
         */
        async assertPasswordWasSuggestedTimes(times = 1) {
            const calls = await mockedCalls(page, { names: ['getAutofillData'] });
            const payloads = payloadsOnly(calls);
            const suggested = payloads.filter((json) => {
                return Boolean(json.generatedPassword);
            });
            expect(suggested.length).toBe(times);
        }

        async assertPasswordWasAutofilled() {
            await page.waitForFunction(() => {
                const pw = /** @type {HTMLInputElement} */ (document.querySelector('#password'));
                return pw?.value.length > 0;
            });
            const input = await page.locator('#password').inputValue();
            const input2 = await page.locator('#password-2').inputValue();
            expect(input.length).toBeGreaterThan(9);
            expect(input).toEqual(input2);
        }

        async assertPasswordWasNotAutofilled() {
            // ensure there was time to autofill, otherwise it can give a false negative
            await page.waitForTimeout(100);
            const input = await page.locator('#password').inputValue();
            const input2 = await page.locator('#password-2').inputValue();
            expect(input).toEqual('');
            expect(input2).toEqual('');
        }

        /**
         * @param {string} address
         */
        async assertUsernameFieldSent(address) {
            const calls = payloadsOnly(await mockedCalls(page, { names: ['getAutofillData'] }));

            expect(/** @type {any} */ (calls[0]).generatedPassword.username).toEqual(address);
            expect(calls.length).toEqual(1);
        }

        async clickDirectlyOnPasswordIcon() {
            const input = page.locator('#password');
            await clickOnIcon(input);
        }

        async selectGeneratedPassword() {
            const input = page.locator('#password');
            await input.click();

            const passwordBtn = page.locator('button:has-text("Generated password")');
            await expect(passwordBtn).toContainText('Password will be saved for this website');

            const passwordButtonText = await passwordBtn.innerText();
            const [, generatedPassword] = passwordButtonText.split('\n');

            if (!generatedPassword.trim()) {
                throw new Error('unreachable - password must not be empty');
            }

            await passwordBtn.click({ force: true });
            return expect(input).toHaveValue(generatedPassword);
        }

        /**
         * @param {string} name
         * @return {Promise<void>}
         */
        async selectFirstName(name) {
            const input = page.locator('#firstname');
            await input.click();
            const button = await page.waitForSelector(`button:has-text("${name}")`);
            await button.click({ force: true });
        }

        async selectLastName(name) {
            const input = page.locator('#lastname');
            await input.click();
            const button = await page.waitForSelector(`button:has-text("${name}")`);
            await button.click({ force: true });
        }

        async assertEmailValue(emailAddress) {
            const { selectors } = constants.fields.email;
            const email = page.locator(selectors.identity);
            await expect(email).toHaveValue(emailAddress);
        }

        async selectFirstEmailField(selector) {
            const input = page.locator(decoratedFirstInputSelector);
            await input.click();
            const button = page.locator(`button:has-text("${selector}")`);
            await button.click({ force: true });
        }

        /**
         * @param {import('../../../src/deviceApiCalls/__generated__/validators-ts').SendJSPixelParams[]} pixels
         */
        async assertPixelsFired(pixels) {
            await genericPage(page).assertPixelsFired(pixels);
        }

        async addNewForm() {
            const btn = page.locator('text=Add new form');
            await btn.click();
        }

        async selectSecondEmailField(selector) {
            const input = page.locator(decoratedSecondInputSelector);
            await input.click();
            const button = page.locator(`button:has-text("${selector}")`);
            await button.click({ force: true });
        }

        /**
         * @param {Omit<CredentialsObject, "id">} credentials
         * @returns {Promise<void>}
         */
        async enterCredentials(credentials) {
            const { identity } = constants.fields.email.selectors;
            const { credential } = constants.fields.password.selectors;
            await page.fill(identity, credentials.username);
            await page.fill('#password' + credential, credentials.password || '');
            await page.fill('#password-2' + credential, credentials.password || '');

            /** NOTE: The next two lines are here to dismiss the auto-generated password prompt */
            await page.waitForTimeout(200);
            await page.keyboard.press('Tab');

            await page.getByRole('button', { name: 'Sign up' }).click();
        }

        /**
         * @param {string} password
         * @return {Promise<void>}
         */
        async enterPassword(password) {
            await page.getByLabel('Password', { exact: true }).fill(password);
            await page.getByLabel('Password Confirmation').fill(password);
        }

        /**
         * @param {string} email
         */
        async changeEmailFieldTo(email) {
            await page.getByLabel('Email').fill(email);
        }

        async submit() {
            await page.getByRole('button', { name: 'Sign up' }).click();
        }

        /**
         * @param {Omit<CredentialsObject, "id">} credentials
         * @returns {Promise<void>}
         */
        async assertWasPromptedToSave(credentials) {
            const calls = await mockedCalls(page, { names: ['storeFormData'] });
            const payloads = payloadsOnly(calls);
            expect(payloads[0].credentials).toEqual(credentials);
        }

        /**
         * Capture a second instance of `storeFormData`
         * @param {Omit<CredentialsObject, "id">} credentials
         * @returns {Promise<void>}
         */
        async assertWasPromptedToSaveAgain(credentials) {
            const calls = await mockedCalls(page, { names: ['storeFormData'], minCount: 2 });
            const payloads = payloadsOnly(calls);
            expect(payloads[1].credentials).toEqual(credentials);
        }

        /**
         * @param {Omit<CredentialsObject, "id">} credentials
         * @returns {Promise<void>}
         */
        async assertWasPromptedToSaveWindows(credentials) {
            const calls = await mockedCalls(page, { names: ['storeFormData'] });
            expect(calls.length).toBeGreaterThanOrEqual(1);
            const [, sent] = calls[0];
            expect(sent.Data.credentials).toEqual(credentials);
        }

        /**
         * @returns {Promise<void>}
         */
        async assertWasNotPromptedToSaveWindows() {
            const calls = await mockedCalls(page, { names: ['storeFormData'], minCount: 0 });

            expect(calls.length).toBe(0);
        }

        async assertSecondEmailValue(emailAddress) {
            const input = page.locator(decoratedSecondInputSelector);
            await expect(input).toHaveValue(emailAddress);
        }

        async assertFirstEmailEmpty() {
            const input = page.locator(decoratedFirstInputSelector);
            await expect(input).toHaveValue('');
        }

        async assertEmailHasNoDaxIcon() {
            expect(await emailStyleAttr()).toBeFalsy();
        }

        async assertTooltipNotOpen(text) {
            return genericPage(page).assertTooltipNotOpen(text);
        }
    }

    return new SignupPage();
}
