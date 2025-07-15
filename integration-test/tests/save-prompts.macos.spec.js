import { createAutofillScript, defaultMacosScript, forwardConsoleMessages } from '../helpers/harness.js';
import { constants } from '../helpers/mocks.js';
import { createWebkitMocks, macosContentScopeReplacements } from '../helpers/mocks.webkit.js';
import { test as base } from '@playwright/test';
import { signupPage } from '../helpers/pages/signupPage.js';
import { loginPage } from '../helpers/pages/loginPage.js';
import { addressPage } from '../helpers/pages/addressPage.js';
/**
 *  Tests for various auto-fill scenarios on macos
 */
const test = base.extend({});

test.describe('macos', () => {
    test.describe('prompting to save data', () => {
        test('Prompting to save from a signup form', async ({ page }) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page);

            const { personalAddress } = constants.fields.email;

            const credentials = {
                username: personalAddress,
                password: '123456',
            };

            await createWebkitMocks().applyTo(page);

            // Load the autofill.js script with replacements
            await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);

            const signup = signupPage(page);
            await signup.navigate();
            await signup.enterCredentials(credentials);
            await signup.assertWasPromptedToSave(credentials);
        });
        test.describe('Prompting to save from a login form', () => {
            test('username+password (should prompt)', async ({ page }) => {
                // enable in-terminal exceptions
                await forwardConsoleMessages(page);

                const credentials = {
                    username: 'dax@wearejh.com',
                    password: '123456',
                };

                await createWebkitMocks().applyTo(page);
                await defaultMacosScript(page);

                const login = loginPage(page);
                await login.navigate();
                await login.submitLoginForm(credentials);
                await login.assertWasPromptedToSave(credentials);
            });
            test('password only (should prompt)', async ({ page }) => {
                // enable in-terminal exceptions
                await forwardConsoleMessages(page);
                await createWebkitMocks().applyTo(page);
                await defaultMacosScript(page);

                const login = loginPage(page);

                const credentials = { password: '123456' };
                await login.navigate();
                await login.submitPasswordOnlyForm(credentials);
                await login.assertWasPromptedToSave(credentials);
            });
            test('username only (should prompt)', async ({ page }) => {
                // enable in-terminal exceptions
                await forwardConsoleMessages(page);

                const credentials = { username: '123456' };

                await createWebkitMocks().applyTo(page);
                await defaultMacosScript(page);

                const login = loginPage(page);
                await login.navigate();
                await login.submitUsernameOnlyForm(credentials.username);
                await login.shouldPromptToSave();
            });
        });
        test.describe('prompting to save an address form with additional inputs', () => {
            const data = {
                username: 'dax@wearejh.com',
                password: '123456',
                name: 'John Doe',
                notes: 'Leave at door',
            };
            test('submitting address form with non-ddg inputs should not prompt', async ({ page }) => {
                // enable in-terminal exceptions
                await forwardConsoleMessages(page);

                await createWebkitMocks().applyTo(page);
                await defaultMacosScript(page);

                const address = addressPage(page);
                await address.navigate();
                await address.fillForm(data);
                await address.submitFormViaTextbox();
                await address.shouldNotPromptToSave();
            });
        });
    });
});
