import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer,
    withWindowsContext
} from '../helpers/harness.js'
import { test as base, expect } from '@playwright/test'
import {emailAutofillPage, loginAndSignup, loginPage, signupPage} from '../helpers/pages.js'
import { createWindowsMocks } from '../helpers/windows.mocks.js'
import { constants } from '../helpers/mocks.js'

/**
 *  Tests for email autofill on windows device
 */
const test = withWindowsContext(base)

test.describe('windows', () => {
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

        // This should not match any elements because windows does not support email
        const matches = await page.$$(constants.fields.email.selectors.identity);
        expect(matches.length).toBe(0);
    })
    test.only('should decorate a login, but not identities', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        // page abstraction
        const pageWrapper = loginAndSignup(page, server)
        await pageWrapper.navigate()

        // windows specific mocks
        await createWindowsMocks().applyTo(page)

        // create + inject the script
        await createAutofillScript()
            .platform('windows')
            .applyTo(page)

        await pageWrapper.assertNoIdentities();
        // This should not match any elements because windows does not support email
        // const matches = await page.$$(constants.fields.email.selectors.identity);
        // expect(matches.length).toBe(0);
    })
})
