import {
    forwardConsoleMessages, performanceEntries,
    setupServer,
    withChromeExtensionContext,
    withEmailProtectionExtensionSignedInAs
} from '../helpers/harness.js'
import { test as base, expect } from '@playwright/test'
import {constants} from '../helpers/mocks.js'
import {emailAutofillPage, scannerPerf} from '../helpers/pages.js'
import { stripDuckExtension } from '../helpers/utils.js'

/**
 *  Tests for email autofill in chrome extension.
 *
 *  Special setup is needed to load the extension, see withChromeExtensionContext();
 */
const test = withChromeExtensionContext(base)

test.describe('chrome extension', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test('should autofill the selected email', async ({page}) => {
        const {personalAddress, privateAddress0} = constants.fields.email

        forwardConsoleMessages(page)
        await withEmailProtectionExtensionSignedInAs(page, stripDuckExtension(personalAddress))

        // page abstraction
        const emailPage = emailAutofillPage(page, server)
        await emailPage.navigate()
        await emailPage.clickIntoInput()

        // buttons, unique to the extension
        const personalAddressBtn = await page.locator(`text=Use ${personalAddress} Blocks email trackers`)
        const privateAddressBtn = await page.locator(`text=Generate a Private Duck Address Blocks email trackers and hides your address`)

        // click first option
        await personalAddressBtn.click({timeout: 500})

        // ensure autofill populates the field
        await emailPage.assertEmailValue(personalAddress)

        // ensure background page received pixel
        await emailPage.assertExtensionPixelsCaptured(['autofill_personal_address'])

        // now ensure a second click into the input doesn't show the dropdown
        await emailPage.clickIntoInput()

        // ensure the popup does not show
        await expect(personalAddressBtn).not.toBeVisible()

        // now directly on Dax
        await emailPage.clickDirectlyOnDax()

        // and then click the second button this time
        await privateAddressBtn.click()

        // now ensure the second value is the private address
        await emailPage.assertEmailValue(privateAddress0)

        // assert that the background page received  pixel
        await emailPage.assertExtensionPixelsCaptured(['autofill_personal_address', 'autofill_private_address'])
    })
    test('scanner performance', async ({page}) => {
        await forwardConsoleMessages(page)

        // scanner perf page
        const scanner = scannerPerf(page, server)
        await scanner.navigate()

        // grab the performance entries that are wrapped around the scanner
        const entries = await performanceEntries(page, 'scanner:init')
        expect(entries).toHaveLength(1)

        // we only care about the first one (for now)
        const entry = entries[0]

        // note: 500 is too high here, but it ensures it passes on all machines.
        // The important part is that before this test it took multiple seconds, so this is still valid
        expect(entry.duration).toBeLessThan(500)
    })
})
