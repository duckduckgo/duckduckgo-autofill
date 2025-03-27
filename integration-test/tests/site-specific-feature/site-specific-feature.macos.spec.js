import { createAutofillScript, forwardConsoleMessages } from '../../helpers/harness.js';
import { test as base } from '@playwright/test';
import { createWebkitMocks, macosContentScopeReplacements } from '../../helpers/mocks.webkit.js';
import { testContext } from '../../helpers/test-context.js';
import { loginPage } from '../../helpers/pages/loginPage.js';
import { readFileSync } from 'fs';
import { genericPage } from '../../helpers/pages/genericPage.js';
import { signupPage } from '../../helpers/pages/signupPage.js';
import { singleStepFormPage } from '../../helpers/pages/singleStepFormPage.js';

/**
 *  Tests for email autofill on ios tooltipHandler
 */
const test = testContext(base);
const BASE_CONFIG_PATH = 'integration-test/tests/site-specific-feature/config-feature';

function loginToSignupConfig() {
    return JSON.parse(readFileSync(`${BASE_CONFIG_PATH}/login-to-signup.json`, 'utf8'));
}

function signupToLoginConfig() {
    return JSON.parse(readFileSync(`${BASE_CONFIG_PATH}/signup-to-login.json`, 'utf8'));
}

function formBoundaryConfig() {
    return JSON.parse(readFileSync(`${BASE_CONFIG_PATH}/form-boundary.json`, 'utf8'));
}

test.describe('site-specific-fixes', () => {
    test.describe('formTypeSettings', () => {
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
            const login = loginPage(page);
            await login.navigate();
            await genericPage(page).passwordFieldShowsGenKey();
            await genericPage(page).usernameFieldShowsDaxIcon('#email');
        });

        test('signup form can be forced to be a login form', async ({ page }) => {
            await forwardConsoleMessages(page);

            await createWebkitMocks('macos')
                .withCredentials({
                    id: 'test',
                    username: 'test@example.com',
                    password: 'password',
                })
                .withAvailableInputTypes({
                    credentials: {
                        username: true,
                        password: true,
                    },
                })
                .withContentScopeFeatures(signupToLoginConfig().features)
                .applyTo(page);

            // Load the autofill.js script
            await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);
            const signup = signupPage(page);
            await signup.navigate();
            await genericPage(page).passwordFieldShowsFillKey('#password');
            await genericPage(page).usernameFieldShowsFillKey('#email');
        });
    });

    test.describe('formBoundarySettings', () => {
        test('forcing form boundary for a single step form scores the field as a username field', async ({ page }) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page);

            await createWebkitMocks('macos')
                .withPersonalEmail('0')
                .withAvailableInputTypes({ email: true, credentials: { username: true, password: true } })
                .withContentScopeFeatures(formBoundaryConfig().features)
                .applyTo(page);

            // Load the autofill.js script
            await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);
            const singleStepForm = singleStepFormPage(page);
            await singleStepForm.navigate();
            await singleStepForm.assertUsernameFieldHasFillKey('#email');
        });

        test('single step form scores the field as an email field', async ({ page }) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page);

            await createWebkitMocks('macos')
                .withPersonalEmail('0')
                .withAvailableInputTypes({ email: true, credentials: { username: true, password: true } })
                .applyTo(page);

            // Load the autofill.js script
            await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);
            const singleStepForm = singleStepFormPage(page);
            await singleStepForm.navigate();
            await singleStepForm.assertUsernameFieldHasDaxIcon('#email');
        });
    });
});
