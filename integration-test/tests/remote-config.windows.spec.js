import {
    createAutofillScript,
    forwardConsoleMessages
} from '../helpers/harness.js'
import {test as base} from '@playwright/test'
import {createWindowsMocks} from '../helpers/mocks.windows.js'
import {testContext} from '../helpers/test-context.js'
import {loginPage} from '../helpers/pages/loginPage.js'

const test = testContext(base)

test.describe('Remote config on windows', () => {
    test.describe('when autofill is disabled remotely', () => {
        test('page scanning does not occur at all', async ({page}) => {
            await forwardConsoleMessages(page)
            const login = loginPage(page)
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
