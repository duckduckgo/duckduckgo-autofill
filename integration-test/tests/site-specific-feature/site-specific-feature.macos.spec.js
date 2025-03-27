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

test.describe('site-specific-fixes', () => {
    test.only('login form can be forced to be a signup form', async ({ page }) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page);

        const config = JSON.parse(readFileSync('integration-test/tests/site-specific-feature/config-features.json', 'utf8'));
        console.log('config', config);

        await createWebkitMocks('macos')
            .withAvailableInputTypes({ email: true })
            .withPersonalEmail('0')
            .withPrivateEmail('0')
            .withContentScopeFeatures(config.features)
            .applyTo(page);

        // Load the autofill.js script
        await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);
        await page.pause();
        const login = loginPage(page);
        await login.navigate();
    });
});
