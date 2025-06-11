import { constants } from '../helpers/mocks.js';
import { forwardConsoleMessages, createIOSAutofillScript } from '../helpers/harness.js';
import { test as base, expect } from '@playwright/test';
import { createWebkitMocks } from '../helpers/mocks.webkit.js';
import { createAvailableInputTypes } from '../helpers/utils.js';
import { testContext } from '../helpers/test-context.js';

/**
 * Tests for credit card autofill on iOS
 */
const test = testContext(base);

/**
 * @param {import("@playwright/test").Page} page
 * @param {object} opts
 * @param {Partial<import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles>} opts.featureToggles
 * @param {Partial<import('../../src/deviceApiCalls/__generated__/validators-ts').AvailableInputTypes>} [opts.availableInputTypes]
 * @param {import('../../src/deviceApiCalls/__generated__/validators-ts').CreditCardObject} [opts.creditCard]
 */
async function testCreditCardPage(page, opts) {
    // enable in-terminal exceptions
    await forwardConsoleMessages(page);

    // iOS specific mocks
    const mocks = createWebkitMocks('ios')
        .withAvailableInputTypes(opts.availableInputTypes || createAvailableInputTypes())
        .withFeatureToggles(opts.featureToggles);

    if (opts.creditCard) {
        mocks.withCreditCard(opts.creditCard, 'creditCards.cardNumber', true);
    }

    await mocks.applyTo(page);

    await createIOSAutofillScript(page);

    const creditCardPage = createCreditCardPage(page);
    await creditCardPage.navigate();

    return { creditCardPage };
}

/**
 * Create a credit card page helper
 * @param {import("@playwright/test").Page} page
 */
function createCreditCardPage(page) {
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

        async assertMockCallOccurredTimes(methodName, expectedCount) {
            const calls = await page.evaluate('window.__playwright_autofill.mocks.calls');
            const mockCalls = calls.filter(([name]) => name === methodName);
            expect(mockCalls).toHaveLength(expectedCount);
        },
    };
}

test.describe('Credit Card Autofill on iOS', () => {
    const creditCard = {
        ...constants.fields.creditCard,
        displayNumber: '•••• •••• •••• 4242',
    };

    test('clicking on card number field fires getAutofillData when credit cards are available', async ({ page }) => {
        const { creditCardPage } = await testCreditCardPage(page, {
            featureToggles: {
                inputType_creditCards: true,
                input_focus_api: true,
            },
            availableInputTypes: {
                creditCards: {
                    cardName: true,
                    cardSecurityCode: true,
                    expirationMonth: true,
                    expirationYear: true,
                    cardNumber: true,
                },
            },
            creditCard,
        });

        await creditCardPage.clickCardNumberField();
        await creditCardPage.assertMockCallOccurredTimes('getAutofillData', 1);
    });

    test('clicking on card number field does not fire getAutofillData when no credit cards are available', async ({ page }) => {
        const { creditCardPage } = await testCreditCardPage(page, {
            featureToggles: {
                inputType_creditCards: true,
                input_focus_api: true,
            },
            availableInputTypes: {
                creditCards: {
                    cardNumber: false,
                },
            },
        });

        await creditCardPage.clickCardNumberField();
        await creditCardPage.assertMockCallOccurredTimes('getAutofillData', 0);
    });

    test('when input_focus_api is false, clicking on card number field does not fire getAutofillDataFocus', async ({ page }) => {
        const { creditCardPage } = await testCreditCardPage(page, {
            featureToggles: {
                inputType_creditCards: true,
                input_focus_api: false,
            },
            availableInputTypes: {
                creditCards: {
                    cardNumber: true,
                },
            },
        });

        await creditCardPage.clickCardNumberField();
        await creditCardPage.assertMockCallOccurredTimes('getAutofillData', 1);
        await creditCardPage.assertMockCallOccurredTimes('getAutofillDataFocus', 0);
    });
});
