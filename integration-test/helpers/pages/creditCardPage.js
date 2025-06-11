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
            await page.click('#cardNumber');
        },

        async clickCardHolderField() {
            await page.click('#cardHolder');
        },

        async clickOnKnownShadowInputField() {
            await page.click("[name='shadowInput']");
        },

        async clickOnUnknownShadowInputField() {
            await page.click("[name='shadowFirstName']");
        },

        async clickOnContentEditableField() {
            await page.click('#contentEditableDiv');
        },

        async assertMockCallOccurredTimes(methodName, expectedCount) {
            const calls = await page.evaluate('window.__playwright_autofill.mocks.calls');
            const mockCalls = calls.filter(([name]) => name === methodName);
            expect(mockCalls).toHaveLength(expectedCount);
        },
    };
}
