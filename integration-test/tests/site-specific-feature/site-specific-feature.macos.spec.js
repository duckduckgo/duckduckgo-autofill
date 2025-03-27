import { createAutofillScript, forwardConsoleMessages } from '../../helpers/harness.js';
import { test as base } from '@playwright/test';
import { createWebkitMocks, macosContentScopeReplacements } from '../../helpers/mocks.webkit.js';
import { testContext } from '../../helpers/test-context.js';
import { loginPage } from '../../helpers/pages/loginPage.js';
import { readFileSync } from 'fs';

/**
 *  Tests for email autofill on ios tooltipHandler
 */
const test = testContext(base);

function loginToSignupConfig() {
    return JSON.parse(readFileSync('integration-test/tests/site-specific-feature/config-features-login-to-signup.json', 'utf8'));
}

test.describe('site-specific-fixes on login form', () => {
    test('login form can be forced to be a signup form', async ({ page }) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page);

        await createWebkitMocks('macos')
            .withAvailableInputTypes({ email: true })
            .withPersonalEmail('0')
            .withPrivateEmail('0')
            .withContentScopeFeatures(loginToSignupConfig().features)
            .applyTo(page);

        // Load the autofill.js script
        await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);
        await page.pause();
        const login = loginPage(page);
        await login.navigate();
    });
});
