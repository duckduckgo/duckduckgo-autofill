import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer, withWindowsContext
} from '../helpers/harness.js'
import {test as base} from '@playwright/test'
import {loginPage} from '../helpers/pages.js'
import {createWindowsMocks} from '../helpers/mocks.windows.js'

/**
 *  Tests for email autofill on ios tooltipHandler
 */
const test = withWindowsContext(base)

test.describe('Remote config on windows', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test.describe('when autofill is disabled remotely', () => {
        test('page scanning does not occur', async ({page}) => {
            await forwardConsoleMessages(page)
            const login = loginPage(page, server)
            await login.navigate()

            await createWindowsMocks()
                .withRemoteAutofillState?.('disabled')
                .applyTo(page)

            await createAutofillScript()
                .platform('windows')
                .applyTo(page)

            await login.clickIntoUsernameInput()
            await login.assertNoAttributesWereAdded()
        })
    })
})
