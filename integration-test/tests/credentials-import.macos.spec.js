import { createAutofillScript, forwardConsoleMessages, mockedCalls } from '../helpers/harness.js';
import { createWebkitMocks, macosContentScopeReplacements } from '../helpers/mocks.webkit.js';
import { createAvailableInputTypes } from '../helpers/utils.js';
import { expect, test as base } from '@playwright/test';
import { loginPage } from '../helpers/pages/loginPage.js';
import { overlayPage } from '../helpers/pages/overlayPage.js';
import { signupPage } from '../helpers/pages/signupPage.js';
import { loginWithIdentityPage } from '../helpers/pages/loginWithIdentityPage.js';

/**
 *  Tests for credentials import promotion prompt on macos
 */
const test = base.extend({});

test.describe('Import credentials prompt', () => {
    test('when credentialsImport is true, input is identities.firstName, credentials import prompt is not shown', async ({ page }) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page);

        await createWebkitMocks()
            .withAvailableInputTypes(
                createAvailableInputTypes({
                    credentialsImport: true,
                }),
            )
            .applyTo(page);

        // Load the autofill.js script with replacements
        await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);

        const login = loginWithIdentityPage(page);
        await login.navigate();
        await login.clickIntoFirstNameInput();
        await login.credentialsImportPromptIsNotShown();
        await login.clickIntoUsernameInput();
        await login.credentialsImportPromptIsShown();
    });

    test('when availableInputTypes is set for credentials import, credentials import prompt is shown', async ({ page }) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page);

        await createWebkitMocks()
            .withAvailableInputTypes(
                createAvailableInputTypes({
                    credentials: {
                        username: false,
                        password: false,
                    },
                    credentialsImport: true,
                }),
            )
            .applyTo(page);

        // Load the autofill.js script with replacements
        await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);

        const login = loginPage(page);
        await login.navigate();
        await login.clickIntoPasswordInput();
        await login.assertTooltipOpen('Import passwords to DuckDuckGo');
        await login.assertPixelsFired([{ pixelName: 'autofill_import_credentials_prompt_shown' }]);
    });

    test('when credentialsImport in availableInputTypes is false, credentials import prompt is not shown', async ({ page }) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page);

        await createWebkitMocks()
            .withAvailableInputTypes(
                createAvailableInputTypes({
                    credentialsImport: false,
                }),
            )
            .applyTo(page);

        // Load the autofill.js script with replacements
        await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);

        const login = loginPage(page);
        await login.navigate();
        await login.clickIntoPasswordInput();
        await login.assertTooltipNotOpen('Import passwords to DuckDuckGo');
    });

    test('when credentialsImport in availableInputTypes is true, and the form is of type signup credentials import prompt is not shown', async ({
        page,
    }) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page);

        await createWebkitMocks()
            .withAvailableInputTypes(
                createAvailableInputTypes({
                    credentialsImport: false,
                    email: true,
                }),
            )
            .applyTo(page);

        // Load the autofill.js script with replacements
        await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);

        const signup = signupPage(page);
        await signup.navigate();
        await signup.clickIntoEmailField();
        await signup.assertTooltipNotOpen('Import passwords to DuckDuckGo');
    });

    test.describe('in overlay', async () => {
        test('when credentials import prompt is clicked, native API call is made', async ({ page }) => {
            await forwardConsoleMessages(page);
            await createWebkitMocks()
                .withAvailableInputTypes(
                    createAvailableInputTypes({
                        credentials: {
                            username: false,
                            password: false,
                        },
                        credentialsImport: true,
                    }),
                )
                .withCredentialsImport?.('credentials.username')
                .applyTo(page);

            // Pretend we're running in a top-frame scenario
            await createAutofillScript()
                .replaceAll(macosContentScopeReplacements())
                .replace('isTopFrame', true)
                .replace('supportsTopFrame', true)
                .platform('macos')
                .applyTo(page);

            const overlay = overlayPage(page);
            await overlay.navigate();
            await overlay.clickButtonWithText('Import passwords to DuckDuckGo');

            const webkitCalls = await mockedCalls(page, { names: ['startCredentialsImportFlow'], minCount: 1 });
            await expect(webkitCalls.length).toBeGreaterThanOrEqual(1);
            await overlay.assertCloseAutofillParent();
        });

        test('when dismiss prompt is clicked, native API call is made', async ({ page }) => {
            await forwardConsoleMessages(page);
            await createWebkitMocks()
                .withAvailableInputTypes(
                    createAvailableInputTypes({
                        credentials: {
                            username: false,
                            password: false,
                        },
                        credentialsImport: true,
                    }),
                )
                .withCredentialsImport?.('credentials.username')
                .applyTo(page);

            // Pretend we're running in a top-frame scenario
            await createAutofillScript()
                .replaceAll(macosContentScopeReplacements())
                .replace('isTopFrame', true)
                .replace('supportsTopFrame', true)
                .platform('macos')
                .applyTo(page);

            const overlay = overlayPage(page);
            await overlay.navigate();
            await overlay.clickButtonWithText("Don't Show Again");

            const webkitCalls = await mockedCalls(page, { names: ['credentialsImportFlowPermanentlyDismissed'], minCount: 1 });
            await expect(webkitCalls.length).toBeGreaterThanOrEqual(1);
            await overlay.assertCloseAutofillParent();
        });
    });
});
