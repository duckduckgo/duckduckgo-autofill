import {forwardConsoleMessages, withChromeExtensionContext, setupMockedDomain} from '../helpers/harness.js'
import { test as base, expect } from '@playwright/test'
import {emailAutofillPage, incontextSignupPage, incontextSignupPageWithinIframe, incontextSignupPageEmailBottomPage, incontextSignupPageEmailTopLeftPage} from '../helpers/pages.js'

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
        await emailPage.assertInputHasFocus()

        // Confirm tooltip shows after clicking the Dax icon
        await emailPage.clickDirectlyOnDax()
        await emailPage.assertInputNotFocused()
        await incontextSignup.assertIsShowing()
        await incontextSignup.getEmailProtection()

        // Ensure a the sign-up page opens
        const emailProtectionPage = await newPageOpening
        expect(emailProtectionPage.url()).toEqual('https://duckduckgo.com/email/start-incontext')
        await emailProtectionPage.close()

        // Confirm pixels triggered
        await emailPage.assertExtensionPixelsCaptured(['incontext_show', 'incontext_primary_cta'])
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
        await incontextSignup.dismissTooltipWith("Don't Show Again")

        // Confirm in-context signup has been completely dismissed
        await incontextSignup.assertIsHidden()
        await emailPage.assertDaxIconIsHidden()

        // Confirm pixels triggered
        await emailPage.assertExtensionPixelsCaptured(['incontext_show', 'incontext_dismiss_persisted'])
    })

    test('should allow tooptip to be closed', async ({page}) => {
        forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        const incontextSignup = incontextSignupPage(page)
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate('https://example.com')

        // Permanently dismiss tooltip
        await emailPage.clickDirectlyOnDax()
        await incontextSignup.assertIsShowing()
        await incontextSignup.closeTooltip()

        // Confirm in-context signup is only hidden
        await incontextSignup.assertIsHidden()
        await emailPage.assertDaxIconIsShowing()

        // Confirm pixels triggered
        await emailPage.assertExtensionPixelsCaptured(['incontext_show', 'incontext_close_x'])
    })

    test('should display properly in iframes with small width', async ({page}) => {
        forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        const pageWithIframe = incontextSignupPageWithinIframe(page)
        await pageWithIframe.navigate('https://example.com')

        await pageWithIframe.clickDirectlyOnDax()
        await pageWithIframe.assertTooltipWithinFrame()
    })

    test('should display properly above when email at bottom of page', async ({page}) => {
        forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        const incontextSignup = incontextSignupPage(page)
        const pageWidthEmailBottomPage = incontextSignupPageEmailBottomPage(page)
        await pageWidthEmailBottomPage.navigate('https://example.com')

        await incontextSignup.clickDirectlyOnDax()
        await incontextSignup.assertIsShowing()
        await incontextSignup.closeTooltip()
    })

    test('should display properly above when email at top left of page', async ({page}) => {
        forwardConsoleMessages(page)
        await setupMockedDomain(page, 'https://example.com')

        const incontextSignup = incontextSignupPage(page)
        const pageWidthEmailTopLeftPage = incontextSignupPageEmailTopLeftPage(page)
        await pageWidthEmailTopLeftPage.navigate('https://example.com')

        await incontextSignup.clickDirectlyOnDax()
        await incontextSignup.assertIsShowing()
        await incontextSignup.closeTooltip()
    })
})
