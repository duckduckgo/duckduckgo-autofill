import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer, withWindowsContext
} from '../helpers/harness.js'
import {test as base} from '@playwright/test'
import {signupPage} from '../helpers/pages.js'
import {constants} from '../helpers/mocks.js'
import {createWindowsMocks} from '../helpers/mocks.windows.js'

/**
 *  Tests for email autofill on ios tooltipHandler
 */
const test = withWindowsContext(base)

test.describe('Save prompts on windows', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test.describe('When saving credentials is enabled ✅ (default)', () => {
        test('Prompting to save from a signup form', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)

            const {personalAddress} = constants.fields.email

            const credentials = {
                username: personalAddress,
                password: '123456'
            }

            const signup = signupPage(page, server)
            await signup.navigate()

            await createWindowsMocks().applyTo(page)

            await createAutofillScript()
                .platform('windows')
                .applyTo(page)

            await signup.enterCredentialsAndSubmit(credentials)
            await signup.assertWasPromptedToSaveWindows(credentials)
        })
    })
    test.describe('When saving credentials is disabled', () => {
        test('I should not be prompted to save', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)

            const {personalAddress} = constants.fields.email

            const credentials = {
                username: personalAddress,
                password: '123456'
            }

            const signup = signupPage(page, server)
            await signup.navigate()

            await createWindowsMocks()
                .withFeatureToggles({
                    credentials_saving: false
                })
                .applyTo(page)

            await createAutofillScript()
                .platform('windows')
                .applyTo(page)

            await signup.enterCredentialsAndSubmit(credentials)
            await signup.assertWasNotPromptedToSaveWindows()
        })
    })
})
