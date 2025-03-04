import { createAutofillScript, forwardConsoleMessages } from '../helpers/harness.js';
import { test as base } from '@playwright/test';
import { androidStringReplacements, createAndroidMocks } from '../helpers/mocks.android.js';
import { constants } from '../helpers/mocks.js';
import { testContext } from '../helpers/test-context.js';
import { signupPage } from '../helpers/pages/signupPage.js';
import { loginPage } from '../helpers/pages/loginPage.js';

/**
 *  Tests for email autofill on ios tooltipHandler
 */
const test = testContext(base);

test.describe('Android Save prompts', () => {
    test.describe('When saving credentials is enabled ✅ (default)', () => {
        test('Prompting to save from a signup form', async ({ page }) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page);

            const { personalAddress } = constants.fields.email;

            const credentials = {
                username: personalAddress,
                password: '123456',
            };

            const signup = signupPage(page);
            await signup.navigate();

            await createAndroidMocks().applyTo(page);

            await createAutofillScript()
                .replaceAll(
                    androidStringReplacements({
                        featureToggles: {
                            credentials_saving: true,
                        },
                    }),
                )
                .platform('android')
                .applyTo(page);

            await signup.enterCredentials(credentials);
            await signup.assertWasPromptedToSave(credentials);
        });
        test.describe('Prompting to save from a login form', () => {
            /** @param {import("@playwright/test").Page} page */
            async function setup(page) {
                await forwardConsoleMessages(page);
                const login = loginPage(page);
                await login.navigate();

                await createAndroidMocks().applyTo(page);
                await createAutofillScript()
                    .replaceAll(
                        androidStringReplacements({
                            featureToggles: {
                                credentials_saving: true,
                            },
                            availableInputTypes: {
                                credentials: { username: false, password: false },
                            },
                        }),
                    )
                    .platform('android')
                    .applyTo(page);
                return { login };
            }
            test('with username+password (should prompt)', async ({ page }) => {
                const { login } = await setup(page);
                const credentials = {
                    username: 'dax@wearejh.com',
                    password: '123456',
                };
                await login.submitLoginForm(credentials);
                await login.assertWasPromptedToSave(credentials);
            });
            test('with password only (should prompt)', async ({ page }) => {
                const { login } = await setup(page);
                const credentials = { password: '123456' };
                await login.submitPasswordOnlyForm(credentials);
                await login.assertWasPromptedToSave(credentials);
            });
            test('with username only (should prompt)', async ({ page }) => {
                const { login } = await setup(page);
                const credentials = { username: '123456' };
                await login.submitUsernameOnlyForm(credentials.username);
                await login.shouldPromptToSave();
            });
        });
    });
    test.describe('When saving credentials is disabled ❌', () => {
        test('should not prompt to save', async ({ page }) => {
            await forwardConsoleMessages(page);

            const login = loginPage(page);
            await login.navigate();

            /** @type {Partial<import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles>} */
            const toggles = {
                credentials_saving: false,
            };

            await createAndroidMocks().applyTo(page);

            // create + inject the script
            await createAutofillScript()
                .replaceAll(
                    androidStringReplacements({
                        featureToggles: toggles,
                        availableInputTypes: {
                            credentials: { username: false, password: false },
                        },
                    }),
                )
                .platform('android')
                .applyTo(page);

            const credentials = {
                username: 'dax@wearejh.com',
                password: '123456',
            };

            await login.submitLoginForm(credentials);
            await login.shouldNotPromptToSave();
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
            const login = loginPage(page);
            await login.navigate('loginWithPoorForm');

            await createAndroidMocks().applyTo(page);
            await createAutofillScript()
                .replaceAll(
                    androidStringReplacements({
                        featureToggles: {
                            credentials_saving: true,
                        },
                        availableInputTypes: {
                            credentials: { username: false, password: false },
                        },
                    }),
                )
                .platform('android')
                .applyTo(page);

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
