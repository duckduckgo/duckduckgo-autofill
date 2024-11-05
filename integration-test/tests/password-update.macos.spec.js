import { createAutofillScript, forwardConsoleMessages } from '../helpers/harness.js';
import { createWebkitMocks, macosContentScopeReplacements } from '../helpers/mocks.webkit.js';
import { test as base } from '@playwright/test';
import { createAvailableInputTypes } from '../helpers/utils.js';
import { constants } from '../helpers/mocks.js';
import { passwordUpdatePage } from '../helpers/pages/passwordUpdatePage.js';

/**
 *  Tests for various auto-fill scenarios on macos
 */
const test = base.extend({});

const { personalAddress } = constants.fields.email;
const password = '123456';

test.describe('Update password page', () => {
    async function applyScript(page) {
        await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);
    }

    test('works as expected when there are saved credentials', async ({ page }) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page);
        await createWebkitMocks()
            .withAvailableInputTypes(createAvailableInputTypes())
            .withCredentials({
                id: '01',
                username: personalAddress,
                password,
                credentialsProvider: 'duckduckgo',
            })
            .applyTo(page);

        // Load the autofill.js script with replacements
        await await applyScript(page);

        const passwordUpdate = passwordUpdatePage(page);
        await passwordUpdate.navigate();

        // Check icons
        await passwordUpdate.currentPasswordHasFillKey();
        await passwordUpdate.newPasswordHasGenKey();
        await passwordUpdate.confirmPasswordHasGenKey();

        await passwordUpdate.fillCurrent();
        await passwordUpdate.checkGeneratedFill();
        // This happens afterwards because we want to make sure we didn't overwrite the current-password field
        await passwordUpdate.checkCurrentFieldHasValue(password);
    });

    test('works as expected when there are no credentials', async ({ page }) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page);
        await createWebkitMocks()
            .withAvailableInputTypes(
                createAvailableInputTypes({
                    credentials: {
                        username: false,
                        password: false,
                    },
                }),
            )
            .applyTo(page);

        // Load the autofill.js script with replacements
        await await applyScript(page);

        const passwordUpdate = passwordUpdatePage(page);
        await passwordUpdate.navigate();

        // Check icons
        await passwordUpdate.currentFieldHasNoIcon();
        await passwordUpdate.newPasswordHasGenKey();
        await passwordUpdate.confirmPasswordHasGenKey();

        await passwordUpdate.checkGeneratedFill();
        // This happens afterwards because we want to make sure we didn't overwrite the current-password field
        await passwordUpdate.checkCurrentFieldHasValue('');
    });
});
