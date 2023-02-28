import {forwardConsoleMessages, withChromeExtensionContext, setupMockedDomain} from '../helpers/harness.js'
import { test as base, expect } from '@playwright/test'
import {emailAutofillPage, incontextSignupPage} from '../helpers/pages.js'

/**
 *  Tests for email autofill in chrome extension.
 *
 *  Special setup is needed to load the extension, see withChromeExtensionContext();
 */
const test = withChromeExtensionContext(base)

test.describe('chrome extension', () => {
    test('should allow user to sign up for Email Protection', async ({page, context}) => {
        forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        const incontextSignup = incontextSignupPage(page)
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate('https://example.com')
        const newPageOpening = new Promise(resolve => context.once('page', resolve))

        // Confirm tooltip hidden after clicking the input
        await emailPage.clickIntoInput()
        await incontextSignup.assertIsHidden()

        // Confirm tooltip shows after clicking the Dax icon
        await emailPage.clickDirectlyOnDax()
        await incontextSignup.assertIsShowing()
        await incontextSignup.getEmailProtection()

        // Ensure a the sign-up page opens
        const emailProtectionPage = await newPageOpening
        expect(emailProtectionPage.url()).toEqual('https://duckduckgo.com/email/start-incontext')
        await emailProtectionPage.close()

        // Confirm pixels triggered
        await emailPage.assertExtensionPixelsCaptured(['incontext_show', 'incontext_get_email_protection'])
    })

    test('should allow tooptip to be dismissed', async ({page}) => {
        forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        const incontextSignup = incontextSignupPage(page)
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate('https://example.com')

        // Permanently dismiss tooltip
        await emailPage.clickDirectlyOnDax()
        await incontextSignup.assertIsShowing()
        await incontextSignup.dismissTooltipWith("Don't Ask Again")

        // Confirm in-context signup has been completely dismissed
        await incontextSignup.assertIsHidden()
        await emailPage.assertDaxIconIsHidden()

        // Confirm pixels triggered
        await emailPage.assertExtensionPixelsCaptured(['incontext_show', 'incontext_dismiss_persisted'])
    })
})
