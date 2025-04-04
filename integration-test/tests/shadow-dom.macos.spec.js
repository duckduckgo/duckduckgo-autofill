import { createAutofillScript, forwardConsoleMessages } from '../helpers/harness.js';
import { createWebkitMocks, macosContentScopeReplacements } from '../helpers/mocks.webkit.js';
import { test as base } from '@playwright/test';
import { createAvailableInputTypes } from '../helpers/utils.js';
import { constants } from '../helpers/mocks.js';
import { shadowDomPage } from '../helpers/pages/shadowDomPage.js';

/**
 *  Tests for various auto-fill scenarios on macos
 */
const test = base.extend({});

const { personalAddress } = constants.fields.email;
const password = '123456';

test.describe('Page with form in shadow DOM', () => {
    async function applyScript(page) {
        await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);
    }

    test('form is scanned on click', async ({ page }) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page);
        await createWebkitMocks()
            .withAvailableInputTypes(createAvailableInputTypes())
            .withCredentials({
                id: '01',
                username: personalAddress,
                password,
                credentialsProvider: 'duckduckgo',
            })
            .applyTo(page);

        // Load the autofill.js script with replacements
        await await applyScript(page);

        const shadowDom = shadowDomPage(page);
        await shadowDom.navigate();

        await shadowDom.showTheForm();

        await shadowDom.passwordHasNoIcon();

        await shadowDom.clickThePasswordField();

        await shadowDom.passwordFieldShowsGenKey();

        await shadowDom.selectGeneratedPassword();
    });
});
