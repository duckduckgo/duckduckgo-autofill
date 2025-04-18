import { createAutofillScript, forwardConsoleMessages } from '../helpers/harness.js';
import { test as base, expect } from '@playwright/test';
import { createWindowsMocks } from '../helpers/mocks.windows.js';
import { testContext } from '../helpers/test-context.js';
import { signupPage } from '../helpers/pages/signupPage.js';

/**
 *  Tests for autofill scenarios on Windows
 */
const test = testContext(base);

test.describe('Windows secure messaging', () => {
    test.describe('When autofill script runs', () => {
        test('the window.chrome.webview variables have been removed', async ({ page }) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page);

            const signup = signupPage(page);
            await signup.navigate();

            // this will add `window.chome.webview` to mimic what the Windows platform would do
            await createWindowsMocks().applyTo(page);

            // this part ensures that we actually have a `window.chrome.webview.postMessage` initially on page load.
            // We need to prevent the possible false positive in the next assertion - because if
            // we assert that the method is absent then it could pass if it was never present.
            const res = await page.evaluate(() => typeof window.chrome.webview.postMessage);
            expect(res).toBe('function');

            // now we add the script like Windows will, wrapped with access to a couple of vars
            await createAutofillScript().platform('windows').applyTo(page);

            const prev = await page.evaluate(() => typeof window.chrome.webview.postMessage);
            const current = await page.evaluate(() => typeof windowsInteropPostMessage);

            // both should be absent now
            expect(prev).toBe('undefined');
            expect(current).toBe('undefined');
        });
    });
});
