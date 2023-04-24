import {createAutofillScript, forwardConsoleMessages, setupMockedDomain, mockedCalls} from '../helpers/harness.js'
import {createWebkitMocks, macosContentScopeReplacements} from '../helpers/mocks.webkit.js'
import { test as base, expect } from '@playwright/test'
import {emailAutofillPage, incontextSignupPage} from '../helpers/pages.js'

/**
 *  Tests for various auto-fill scenarios on macos
 */
const test = base.extend({})

test.describe('macos', () => {
    test('should allow user to sign up for Email Protection', async ({page}) => {
        forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        await createWebkitMocks()
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replaceAll(macosContentScopeReplacements())
            .platform('macos')
            .applyTo(page)

        const incontextSignup = incontextSignupPage(page)
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate('https://example.com')

        // Confirm tooltip hidden after clicking the input
        await emailPage.clickIntoInput()
        await incontextSignup.assertIsHidden()
        await emailPage.assertInputHasFocus()

        // Confirm tooltip shows after clicking the Dax icon
        await emailPage.clickDirectlyOnDax()
        await emailPage.assertInputHasFocus()
        await incontextSignup.assertIsShowing()
        await incontextSignup.getEmailProtection()

        // Confirm message passed to native
        const startCall = await mockedCalls(page, ['startEmailProtectionSignup'])
        expect(startCall.length).toBe(1)

        // Confirm pixels triggered
        await emailPage.assertPixelsFired([
            {pixelName: 'incontext_primary_cta'}
        ])
    })

    test('should allow tooltip to be dismissed', async ({page}) => {
        forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        await createWebkitMocks()
            .withAvailableInputTypes({email: true})
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replaceAll(macosContentScopeReplacements())
            .platform('macos')
            .applyTo(page)

        const incontextSignup = incontextSignupPage(page)
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate('https://example.com')

        // Permanently dismiss tooltip
        await emailPage.clickDirectlyOnDax()
        await incontextSignup.assertIsShowing()
        await incontextSignup.dismissTooltipWith("Don't Show Again")

        // Confirm message passed to native
        const dismissedCall = await mockedCalls(page, ['setIncontextSignupPermanentlyDismissedAt'])
        expect(dismissedCall.length).toBe(1)

        // Confirm pixels triggered
        await emailPage.assertPixelsFired([
            {pixelName: 'incontext_dismiss_persisted'}
        ])
    })

    test('should not show tooltip when already dismissed', async ({page}) => {
        forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        await createWebkitMocks()
            .withAvailableInputTypes({email: true})
            .withIncontextSignipDismissed()
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replaceAll(macosContentScopeReplacements())
            .platform('macos')
            .applyTo(page)

        const incontextSignup = incontextSignupPage(page)
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate('https://example.com')

        // Confirm in-context signup has been completely dismissed
        await incontextSignup.assertIsHidden()
        await emailPage.assertDaxIconIsHidden({checking: 'style'})
    })

    test('should allow tooltip to be closed', async ({page}) => {
        forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        await createWebkitMocks()
            .withAvailableInputTypes({email: true})
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replaceAll(macosContentScopeReplacements())
            .platform('macos')
            .applyTo(page)

        const incontextSignup = incontextSignupPage(page)
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate('https://example.com')

        // Dismiss tooltip
        await emailPage.clickDirectlyOnDax()
        await incontextSignup.assertIsShowing()
        await emailPage.clickOnPage()

        // Confirm in-context signup is only hidden
        await incontextSignup.assertIsHidden()
        await emailPage.assertDaxIconIsShowing()

        // Confirm no pixels triggered
        await emailPage.assertNoPixelsFired()
    })
})
