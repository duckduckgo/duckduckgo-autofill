import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer,
    withWindowsContext
} from '../helpers/harness.js'
import { test as base } from '@playwright/test'
import { signupPage} from '../helpers/pages.js'
import { createWindowsMocks } from '../helpers/windows.mocks.js'

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
    test.only('should use feature toggles', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        // page abstraction
        const signup = signupPage(page, server)
        await signup.navigate()

        // windows specific mocks
        await createWindowsMocks().applyTo(page)

        // create + inject the script
        await createAutofillScript()
            .platform('windows')
            .applyTo(page)

        await page.pause();

        // if this works, the interface must have loaded and added the field decorations
        // await signup.clickIntoInput()
    })
})
