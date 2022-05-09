import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer,
    withAndroidContext
} from '../helpers/harness.js'
import {test as base} from '@playwright/test'
import {constants} from '../helpers/mocks.js'
import {emailAutofillPage} from '../helpers/pages.js'
import {createAndroidMocks} from '../helpers/mocks.android.js'

/**
 *  Tests for email autofill on android tooltipHandler
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
        await forwardConsoleMessages(page)

        const {personalAddress} = constants.fields.email

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

        // if this works, the tooltipHandler must have loaded and added the field decorations
        await emailPage.clickIntoInput()

        // Because of the mock above, assume an email was selected and ensure it's autofilled
        await emailPage.assertEmailValue(personalAddress)
    })
})
