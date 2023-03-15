import {forwardConsoleMessages, setupServer, withChromeExtensionContext} from '../helpers/harness.js'
import { test as base, expect } from '@playwright/test'
import {emailAutofillPage, incontextSignupPage} from '../helpers/pages.js'

/**
 *  Tests for email autofill in chrome extension.
 *
 *  Special setup is needed to load the extension, see withChromeExtensionContext();
 */
const test = withChromeExtensionContext(base)

test.describe.skip('chrome extension', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test('should allow user to sign up for Email Protection', async ({page, context}) => {
        forwardConsoleMessages(page)

        const incontextSignup = incontextSignupPage(page)
        const emailPage = emailAutofillPage(page, server)
        await emailPage.navigate()
        const newPageOpening = new Promise(resolve => context.once('page', resolve))

        await emailPage.clickIntoInput()
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

        const incontextSignup = incontextSignupPage(page)
        const emailPage = emailAutofillPage(page, server)
        await emailPage.navigate()

        // Hide tooltip
        await emailPage.clickIntoInput()
        await incontextSignup.assertIsShowing()
        await incontextSignup.dismissTooltipWith('Maybe Later')

        // Confirm only tooltip hidden
        await incontextSignup.assertIsHidden()
        await emailPage.assertDaxIconIsShowing()

        // Permanently dismiss tooltip
        await emailPage.clickDirectlyOnDax()
        await incontextSignup.assertIsShowing()
        await incontextSignup.dismissTooltipWith("Don't Ask Again")

        // Confirm in-context signup has been completely dismissed
        await incontextSignup.assertIsHidden()
        await emailPage.assertDaxIconIsHidden()

        // Confirm pixels triggered
        await emailPage.assertExtensionPixelsCaptured(['incontext_show', 'incontext_dismiss_initial', 'incontext_show', 'incontext_dismiss_persisted'])
    })
})
