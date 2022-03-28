import { constants, setupServer, withChromeExtensionContext} from '../helpers/harness.js'
import { test as base, expect } from '@playwright/test'

/**
 *  Tests for email autofill in chrome extension.
 *
 *  Special setup is needed to load the extension, see withChromeExtensionContext();
 */
const test = withChromeExtensionContext(base)

test.describe('Ensure email autofill works in chrome extension', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test('should select and populate email autofill', async ({page}) => {
        const {personalAddress, privateAddress0, selectors} = constants.fields.email;

        await page.goto(server.urlForPath(constants.pages['email-autofill']))

        const input = page.locator(selectors.identity)

        // click the input field (not within Dax icon)
        await input.click()

        const first = await page.locator(`text=Use ${personalAddress} Blocks email trackers`)
        const second = await page.locator(`text=Use a Private Address Blocks email trackers and hides your address`)

        await first.click()

        // ensure autofill populates the field
        await expect(input).toHaveValue(personalAddress)

        // now ensure a second click into the input doesn't show the dropdown
        await input.click()

        // ensure the popup does not show
        await expect(first).not.toBeVisible()

        // now click on Dax
        await input.click({position: {x: 280, y: 10}})

        // and then click the second button this time
        await second.click()

        await page.waitForTimeout(500)

        // now ensure the second value is the private address
        await expect(input).toHaveValue(privateAddress0);
    })
})
