import { constants } from '../mocks.js';
import { expect } from '@playwright/test';

/**
 * A wrapper around interactions for credit card pages
 *
 * @param {import("@playwright/test").Page} page
 */
export function creditCardPage(page) {
    return {
        async navigate() {
            await page.goto(constants.pages.creditCardVariousInputs);
        },

        async clickCardNumberField() {
            const locator = page.getByLabel('Card Number');
            await locator.click();
        },

        async clickCardHolderField() {
            const locator = page.getByLabel('Card Holder Name');
            await locator.click();
        },

        async clickOnKnownShadowInputField() {
            const locator = page.getByPlaceholder('Secure note (Shadow DOM)');
            await locator.click();
        },

        async clickOnUnknownShadowInputField() {
            const locator = page.getByPlaceholder('First Name (Shadow DOM)');
            await locator.click();
        },

        async clickOnContentEditableField() {
            const locator = page.getByText('Edit me! (contenteditable)');
            await locator.click();
        },

        async assertMockCallOccurredTimes(methodName, expectedCount) {
            const calls = await page.evaluate('window.__playwright_autofill.mocks.calls');
            const mockCalls = calls.filter(([name]) => name === methodName);
            expect(mockCalls).toHaveLength(expectedCount);
        },
    };
}
