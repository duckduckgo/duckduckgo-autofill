import { expect } from '@playwright/test';
import { mockedCalls } from '../harness.js';

/**
 * A wrapper around interactions for `integration-test/pages/address-form.html`
 *
 * @param {import("@playwright/test").Page} page
 */
export function addressPage(page) {
    class AddressPage {
        /**
         * @return {Promise<void>}
         */
        async navigate() {
            await page.goto('integration-test/pages/address-form.html');
        }

        /**
         * Fill in all address form fields
         */
        async fillAddressForm(data) {
            await page.fill('#firstName', data.firstName);
            await page.fill('#lastName', data.lastName);
            await page.fill('#address1', data.addressStreet);
            await page.fill('#address2', data.addressStreet2);
            await page.fill('#city', data.addressCity);
            await page.fill('#state', data.addressProvince);
            await page.fill('#postalCode', data.addressPostalCode);
            await page.fill('#country', data.addressCountryCode);
            await page.fill('#phone', data.phone);
            await page.fill('#notes', data.notes);
        }

        async submitFormViaTextbox() {
            const textbox = await page.$('#notes');
            await textbox?.focus();
            await page.keyboard.down('Enter');
        }

        async shouldNotPromptToSave() {
            const mockCalls = await mockedCalls(page, { names: ['storeFormData'], minCount: 0 });
            expect(mockCalls.length).toBe(0);
        }
    }

    return new AddressPage();
}
