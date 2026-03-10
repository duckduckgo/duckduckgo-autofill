import { constants } from '../mocks.js';
import { expect } from '@playwright/test';

/**
 * A wrapper around interactions for `integration-test/pages/state-dropdown.html`
 *
 * @param {import("@playwright/test").Page} page
 */
export function stateDropdownPage(page) {
    class StateDropdownPage {
        /**
         * @param {'combobox' | 'plain-text'} [formType]
         * @return {Promise<void>}
         */
        async navigate(formType = 'combobox') {
            const url =
                formType === 'plain-text'
                    ? `${constants.pages.stateDropdown}?form-type=plain-text`
                    : constants.pages.stateDropdown;
            await page.goto(url);
        }

        /**
         * Clicks on the first name field and selects the identity from the tooltip
         * @param {string} name
         * @param {'combobox' | 'plain-text'} [formType]
         * @return {Promise<void>}
         */
        async selectFirstName(name, formType = 'combobox') {
            const selector = formType === 'plain-text' ? '#pt-firstname' : '#cb-firstname';
            const input = page.locator(selector);
            await input.click();
            const button = await page.waitForSelector(`button:has-text("${name}")`);
            await button.click({ force: true });
        }

        /**
         * Asserts that the state input does NOT have the autofill decoration attribute
         * @return {Promise<void>}
         */
        async assertComboboxStateNotDecorated() {
            const stateInput = page.locator('#cb-state');
            await expect(stateInput).not.toHaveAttribute('data-ddg-autofill');
        }

        /**
         * Asserts that the state input DOES have the autofill decoration attribute
         * @return {Promise<void>}
         */
        async assertPlainTextStateDecorated() {
            const stateInput = page.locator('#pt-state');
            await expect(stateInput).toHaveAttribute('data-ddg-autofill');
        }

        /**
         * Asserts the value of the state input
         * @param {string} value
         * @param {'combobox' | 'plain-text'} [formType]
         * @return {Promise<void>}
         */
        async assertStateValue(value, formType = 'combobox') {
            const selector = formType === 'plain-text' ? '#pt-state' : '#cb-state';
            const stateInput = page.locator(selector);
            await expect(stateInput).toHaveValue(value);
        }

        /**
         * Asserts the state input still has the input type attribute (classified but not decorated)
         * @return {Promise<void>}
         */
        async assertComboboxStateClassified() {
            const stateInput = page.locator('#cb-state');
            await expect(stateInput).toHaveAttribute('data-ddg-inputType', 'identities.addressProvince');
        }
    }

    return new StateDropdownPage();
}
