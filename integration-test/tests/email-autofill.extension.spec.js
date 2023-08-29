import {forwardConsoleMessages, withEmailProtectionExtensionSignedInAs} from '../helpers/harness.js'
import { test as base, expect } from '@playwright/test'
import {constants} from '../helpers/mocks.js'
import {emailAutofillPage} from '../helpers/pages.js'
import { stripDuckExtension } from '../helpers/utils.js'
import {testContext} from '../helpers/test-context.js'

/**
 *  Tests for email autofill in chrome extension.
 *
 *  Special setup is needed to load the extension, see testContext();
 */
const test = testContext(base)

test.describe('chrome extension', () => {
    test('should autofill the selected email', async ({page}) => {
        const {personalAddress, privateAddress0, privateAddress1} = constants.fields.email

        forwardConsoleMessages(page)
        await withEmailProtectionExtensionSignedInAs(page, stripDuckExtension(personalAddress))

        // page abstraction
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate()
        await emailPage.clickIntoInput()

        // buttons, unique to the extension
        const personalAddressBtn = await page.locator(`text=Use ${personalAddress} Block email trackers`)
        const privateAddressBtn = await page.locator(`text=Generate a Private Duck Address Block email trackers & hide address`)

        // click first option
        await personalAddressBtn.click({timeout: 500})

        // ensure autofill populates the field
        await emailPage.assertEmailValue(personalAddress)

        // ensure background page received pixel
        await emailPage.assertExtensionPixelsCaptured(['autofill_show', 'autofill_personal_address'])

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

        // autofill a private address again
        await emailPage.clickDirectlyOnDax()
        await privateAddressBtn.click()

        // now check that the field has the new private address
        await emailPage.assertEmailValue(privateAddress1)

        // assert that the background page received  pixel
        await emailPage.assertExtensionPixelsCaptured([
            'autofill_show', 'autofill_personal_address', // personal autofill
            'autofill_show', 'autofill_private_address', // first private autofill
            'autofill_show', 'autofill_private_address' // second private autofill
        ])
    })
})
