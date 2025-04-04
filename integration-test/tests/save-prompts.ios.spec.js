import { forwardConsoleMessages, createIOSAutofillScript } from '../helpers/harness.js';
import { test as base } from '@playwright/test';
import { createWebkitMocks } from '../helpers/mocks.webkit.js';
import { constants } from '../helpers/mocks.js';
import { testContext } from '../helpers/test-context.js';
import { signupPage } from '../helpers/pages/signupPage.js';
import { loginPage } from '../helpers/pages/loginPage.js';

/**
 *  Tests for email autofill on ios tooltipHandler
 */
const test = testContext(base);

test.describe('iOS Save prompts', () => {
    test.describe('and saving credentials disabled ❌', () => {
        test('should not prompt to save', async ({ page }) => {
            await forwardConsoleMessages(page);

            /** @type {Partial<import('../../src/deviceApiCalls/__generated__/validators-ts.js').AutofillFeatureToggles>} */
            const toggles = {
                credentials_saving: false,
            };
            await createWebkitMocks().withFeatureToggles(toggles).applyTo(page);

            await createIOSAutofillScript(page);

            const login = loginPage(page);
            await login.navigate();

            const credentials = {
                username: 'dax@wearejh.com',
                password: '123456',
            };
            await login.submitLoginForm(credentials);
            await login.shouldNotPromptToSave();

            /**
             * NOTE: This is here as a sanity check because this test is a negative check
             * and there are lots of ways this test could pass, but be broken.
             *
             * For example if our script fails to load, then this test would normally pass,
             * but by having this mock check here, it confirms that scripts ran, messages
             * were sent etc.
             */
            await login.assertAnyMockCallOccurred();
        });
    });
    test.describe('When saving credentials is enabled ✅', () => {
        test('Prompting to save from a signup form', async ({ page }) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page);

            const { personalAddress } = constants.fields.email;

            const credentials = {
                username: personalAddress,
                password: '123456',
            };

            const featureToggles = {
                emailProtection: true,
                inputType_credentials: true,
                credentials_saving: true,
                inputType_identities: false,
                inputType_creditCards: false,
                password_generation: false,
            };
            await createWebkitMocks().withFeatureToggles(featureToggles).applyTo(page);

            await createIOSAutofillScript(page);

            const signup = signupPage(page);
            await signup.navigate();
            await signup.enterCredentials(credentials);
            await signup.assertWasPromptedToSave(credentials);
        });
        test.describe('Prompting to save from a login form', () => {
            /**
             * @param {import("@playwright/test").Page} page
             */
            async function setup(page) {
                await forwardConsoleMessages(page);
                await createWebkitMocks().applyTo(page);
                await createIOSAutofillScript(page);
                const login = loginPage(page);
                await login.navigate();
                return login;
            }

            test('username+password (should prompt)', async ({ page }) => {
                const login = await setup(page);

                const credentials = {
                    username: 'dax@wearejh.com',
                    password: '123456',
                };
                await login.submitLoginForm(credentials);
                await login.assertWasPromptedToSave(credentials);
            });
            test('password only (should prompt)', async ({ page }) => {
                const login = await setup(page);

                const credentials = { password: '123456' };
                await login.submitPasswordOnlyForm(credentials);
                await login.assertWasPromptedToSave(credentials);
            });

            test('username only (should prompt)', async ({ page }) => {
                const login = await setup(page);

                const credentials = { username: '123456' };
                await login.submitUsernameOnlyForm(credentials.username);
                await login.shouldPromptToSave();
            });
        });

        test.describe('Prompting to save from a poor login form (using Enter and click on a button outside the form)', () => {
            const credentials = {
                username: 'dax@wearejh.com',
                password: '123456',
            };
            /**
             * @param {import("@playwright/test").Page} page
             */
            async function setup(page) {
                await forwardConsoleMessages(page);
                await createWebkitMocks().applyTo(page);
                await createIOSAutofillScript(page);
                const login = loginPage(page);
                await login.navigate('loginWithPoorForm');

                await page.type('#password', credentials.password);
                await page.type('#email', credentials.username);

                // Check that we haven't detected any submission at this point
                await login.shouldNotPromptToSave();

                return login;
            }

            test('submit by clicking on the out-of-form button', async ({ page }) => {
                const login = await setup(page);

                await page.click('"Log in"');
                await login.assertWasPromptedToSave(credentials);
            });
            test('should not prompt if the out-of-form button does not match the form type', async ({ page }) => {
                const login = await setup(page);

                await page.click('"Sign up"');
                await login.shouldNotPromptToSave();
            });
            test('should prompt when hitting enter while an input is focused', async ({ page }) => {
                const login = await setup(page);

                await page.press('#email', 'Tab');
                await login.shouldNotPromptToSave();

                await page.press('#password', 'Enter');
                await login.assertWasPromptedToSave(credentials);
            });
        });
    });
});
