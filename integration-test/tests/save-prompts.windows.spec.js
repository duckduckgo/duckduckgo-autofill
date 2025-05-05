import { createAutofillScript, forwardConsoleMessages } from '../helpers/harness.js';
import { test as base } from '@playwright/test';
import { constants } from '../helpers/mocks.js';
import { createWindowsMocks } from '../helpers/mocks.windows.js';
import { testContext } from '../helpers/test-context.js';
import { signupPage } from '../helpers/pages/signupPage.js';

const test = testContext(base);

test.describe('Save prompts on windows', () => {
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

            await createWindowsMocks().applyTo(page);

            await createAutofillScript().platform('windows').applyTo(page);

            await signup.enterCredentials(credentials);
            await signup.assertWasPromptedToSaveWindows(credentials);
        });
    });
    test.describe('When saving credentials is disabled', () => {
        test('I should not be prompted to save', async ({ page }) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page);

            const { personalAddress } = constants.fields.email;

            const credentials = {
                username: personalAddress,
                password: '123456',
            };

            const signup = signupPage(page);
            await signup.navigate();

            await createWindowsMocks()
                .withFeatureToggles({
                    credentials_saving: false,
                })
                .applyTo(page);

            await createAutofillScript().platform('windows').applyTo(page);

            await signup.enterCredentials(credentials);
            await signup.assertWasNotPromptedToSaveWindows();
        });
    });

    test.describe('When partial form saves are disabled', () => {
        test('I should not be prompted to save for username only', async ({ page }) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page);

            const { personalAddress } = constants.fields.email;

            const credentials = {
                username: personalAddress,
            };

            const signup = signupPage(page);
            await signup.navigate();

            await createWindowsMocks()
                .withFeatureToggles({
                    partial_form_saves: false,
                })
                .applyTo(page);

            await createAutofillScript().platform('windows').applyTo(page);

            await signup.enterCredentials(credentials);
            await signup.assertWasNotPromptedToSaveWindows();
        });
    });
});
