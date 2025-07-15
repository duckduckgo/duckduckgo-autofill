import { expect } from '@playwright/test';
import { mockedCalls } from '../harness.js';

/**
 * A wrapper around interactions for `integration-test/pages/login-with-textarea.html`
 *
 * @param {import("@playwright/test").Page} page
 */
export function loginWithTextareaPage(page) {
    class LoginWithTextareaPage {
        /**
         * @return {Promise<void>}
         */
        async navigate() {
            await page.goto('integration-test/pages/login-with-textarea.html');
        }

        /**
         * Fill in all address form fields
         */
        async fillForm(data) {
            await page.fill('#username', data.username);
            await page.fill('#password', data.password);
            await page.fill('#name', data.name);
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

    return new LoginWithTextareaPage();
}
