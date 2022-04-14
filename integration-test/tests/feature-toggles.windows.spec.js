import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer,
    withWindowsContext
} from '../helpers/harness.js'
import { test as base, expect } from '@playwright/test'
import {emailAutofillPage, loginAndSignup} from '../helpers/pages.js'
import { createWindowsMocks } from '../helpers/windows.mocks.js'
import { constants } from '../helpers/mocks.js'

/**
 *  Tests for email autofill on windows device
 */
const test = withWindowsContext(base)

test.describe.only('windows', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test('should not decorate email', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        // page abstraction
        const email = emailAutofillPage(page, server)
        await email.navigate()

        // windows specific mocks
        await createWindowsMocks().applyTo(page)

        // create + inject the script
        await createAutofillScript()
            .platform('windows')
            .applyTo(page)

        // This should receive the attr, but not the dax icon because windows does not support email
        // if it matches, it means the email input was decorated, which is incorrect
        const style = await page.locator(constants.fields.email.selectors.identity).getAttribute('style');
        expect(style).toBeNull()
    })
    test('should decorate a login, but not identities', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        // page abstraction
        const pageWrapper = loginAndSignup(page, server)
        await pageWrapper.navigate()

        // windows specific mocks
        await createWindowsMocks()
            .withAvailableInputTypes({
                credentials: true,
            })
            .applyTo(page)

        // create + inject the script
        await createAutofillScript()
            .platform('windows')
            .applyTo(page)

        // Ensure that DAX was not added to the email field in the signup form
        // because that's not supported on this platform
        await pageWrapper.assertIdentitiesWereNotDecorated();

        // Ensure that the login form has the key icon since we mocked (above)
        // that this page has available credentials (and it's enabled in the feature flags)
        await pageWrapper.assertUsernameAndPasswordWereDecoratedWithIcon();
    })
})
