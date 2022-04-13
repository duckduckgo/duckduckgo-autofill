import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer,
    withAndroidContext
} from '../helpers/harness.js'
import { test as base } from '@playwright/test'
import {constants, createAndroidMocks} from '../helpers/mocks.js'
import {emailAutofillPage} from '../helpers/pages.js'

/**
 *  Tests for email autofill on android device
 */
const test = withAndroidContext(base)

test.describe('android', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test('should autofill the selected email', async ({page}) => {
        // enable in-terminal exceptions
        forwardConsoleMessages(page)

        const {personalAddress} = constants.fields.email
        await page.goto(server.urlForPath(constants.pages['email-autofill']))

        // page abstraction
        const emailPage = emailAutofillPage(page, server)
        await emailPage.navigate()

        // android specific mocks
        await createAndroidMocks()
            .withPersonalEmail(personalAddress)
            .withPrivateEmail(personalAddress)
            .applyTo(page)

        // create + inject the script
        await createAutofillScript()
            .platform('android')
            .applyTo(page)

        // if this works, the interface must have loaded and added the field decorations
        await emailPage.clickIntoInput()

        // Because of the mock above, assume an email was selected and ensure it's autofilled
        await emailPage.assertEmailValue(personalAddress)
    })
})
