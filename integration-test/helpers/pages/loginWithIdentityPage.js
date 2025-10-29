import { constants } from '../mocks.js';
import { expect } from '@playwright/test';

/**
 * A wrapper around interactions for the login-with-identity.html page
 * This page contains first name, last name, email, and password fields
 *
 * @param {import("@playwright/test").Page} page
 */
export function loginWithIdentityPage(page) {
    class LoginWithIdentityPage {
        /**
         * Navigate to the loginWithIdentity page
         * @return {Promise<void>}
         */
        async navigate(to = 'loginWithIdentity') {
            await page.goto(constants.pages[to]);
        }

        async clickIntoFirstNameInput() {
            const firstNameField = page.locator('#first-name').first();
            await firstNameField.click();
        }

        async clickIntoUsernameInput() {
            const emailField = page.locator('#login-email').first();
            await emailField.click();
        }

        async credentialsImportPromptIsNotShown() {
            await page
                .locator(`button:has-text("Import passwords to DuckDuckGo")`)
                .isVisible()
                .then((isVisible) => {
                    expect(isVisible).toBe(false);
                });
        }

        async credentialsImportPromptIsShown() {
            await page
                .locator(`button:has-text("Import passwords to DuckDuckGo")`)
                .isVisible()
                .then((isVisible) => {
                    expect(isVisible).toBe(true);
                });
        }
    }

    return new LoginWithIdentityPage();
}
