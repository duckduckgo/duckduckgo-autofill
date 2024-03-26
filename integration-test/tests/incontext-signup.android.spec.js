import {
    defaultAndroidScript,
    forwardConsoleMessages,
    mockedCalls,
    setupMockedDomain
} from '../helpers/harness.js'
import {expect, test as base} from '@playwright/test'
import {createAndroidMocks} from '../helpers/mocks.android.js'
import {testContext} from '../helpers/test-context.js'
import {emailAutofillPage} from '../helpers/pages/emailAutofillPage.js'

/**
 * Tests for email in-context signup events in Android.
 */
const test = testContext(base)

test.describe('android', () => {
    test('should allow user to sign up for Email Protection', async ({page}) => {
        await forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        const emailPage = emailAutofillPage(page)
        await emailPage.navigate('https://example.com')

        await createAndroidMocks()
            .withRuntimeConfigOverrides({
                availableInputTypes: {
                    email: false
                }
            })
            .applyTo(page)

        // create + inject the script
        await defaultAndroidScript(page)

        // Checks if in-context signup has already been dismissed
        const checkCall = await mockedCalls(page, {names: ['getIncontextSignupDismissedAt']})
        expect(checkCall.length).toBe(1)

        await emailPage.assertDaxIconIsShowing()
        await emailPage.clickDirectlyOnDax()

        // Informs native app that it should show the signup prompt
        const startCall = await mockedCalls(page, {names: ['ShowInContextEmailProtectionSignupPrompt']})
        expect(startCall.length).toBe(1)
    })
})
