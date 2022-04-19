import {
    createAutofillScript,
    defaultIOSScript,
    forwardConsoleMessages,
    setupServer,
    withIOSContext
} from '../helpers/harness.js'
import { test as base } from '@playwright/test'
import {constants} from '../helpers/mocks.js'
import {emailAutofillPage, loginPage, signupPage} from '../helpers/pages.js'
import {createWebkitMocks, iosContentScopeReplacements} from '../helpers/mocks.webkit.js'

/**
 *  Tests for email autofill on ios device
 */
const test = withIOSContext(base)

test.describe('ios', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test('should autofill the selected email', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        await createWebkitMocks('ios')
            .withPersonalEmail('0')
            .withPrivateEmail('0')
            .withAvailableInputTypes({
                email: true
            })
            .applyTo(page)

        // Load the autofill.js script with replacements
        // on iOS it's the user-agent that's used as the platform check
        await createAutofillScript()
            .replaceAll(iosContentScopeReplacements)
            .platform('ios')
            .applyTo(page)

        const {privateAddress0} = constants.fields.email

        // page abstraction
        const emailPage = emailAutofillPage(page, server)
        await emailPage.navigate()

        // Click in the input, a native window will appear
        // and the mocks above will ensure the message is responded to -
        // - this simulates the user tapping an option in the native window
        await emailPage.clickIntoInput()

        // Because of the mock above, assume an email was selected and ensure it's auto-filled
        await emailPage.assertEmailValue(privateAddress0)
    })
    test.describe('Prompting to save from a login form', () => {
        test('username+password (should prompt)', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)

            const credentials = {
                username: 'dax@wearejh.com',
                password: '123456'
            }

            await createWebkitMocks().applyTo(page)
            await defaultIOSScript(page)

            const login = loginPage(page, server)
            await login.navigate()
            await login.submitLoginForm(credentials)
            await login.assertWasPromptedToSave(credentials)
        })
        test('password only (should prompt)', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)
            await createWebkitMocks().applyTo(page)
            await defaultIOSScript(page)

            const login = loginPage(page, server)

            const credentials = { password: '123456' }
            await login.navigate()
            await login.submitPasswordOnlyForm(credentials)
            await login.assertWasPromptedToSave(credentials)
        })
        test('username only (should NOT prompt)', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)

            const credentials = { username: '123456' }

            await createWebkitMocks().applyTo(page)
            await defaultIOSScript(page)

            const login = loginPage(page, server)
            await login.navigate()
            await login.submitUsernameOnlyForm(credentials.username)
            await login.assertWasNotPromptedToSave()
        })
    })
    test('autofill a login form', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        const {personalAddress} = constants.fields.email
        const password = '123456'

        await createWebkitMocks()
            .withCredentials({
                id: '01',
                username: personalAddress,
                password
            })
            .withAvailableInputTypes({
                credentials: true
            })
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replaceAll(iosContentScopeReplacements)
            .platform('ios')
            .applyTo(page)

        const login = loginPage(page, server)
        await login.navigate()
        await login.clickIntoUsernameInput()
        await login.assertFirstCredential(personalAddress, password)
    })
    test('Prompting to save from a signup form', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        const {personalAddress} = constants.fields.email

        const credentials = {
            username: personalAddress,
            password: '123456'
        }

        await createWebkitMocks().applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replaceAll(iosContentScopeReplacements)
            .platform('ios')
            .applyTo(page)

        const signup = signupPage(page, server)
        await signup.navigate()
        await signup.enterCredentials(credentials)
        await signup.assertWasPromptedToSave(credentials)
    })
})
