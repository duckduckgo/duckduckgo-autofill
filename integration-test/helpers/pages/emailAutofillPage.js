import {constants} from '../mocks.js'
import {clickOnIcon} from '../utils.js'
import {expect} from '@playwright/test'
import {mockedCalls} from '../harness.js'

const ATTR_AUTOFILL = 'data-ddg-autofill'

/**
 * A wrapper around interactions for `integration-test/pages/email-autofill.html`
 *
 * @param {import("@playwright/test").Page} page
 */
export function emailAutofillPage (page) {
    const {selectors} = constants.fields.email

    class EmailAutofillPage {
        async navigate (domain) {
            const emailAutofillPageName = constants.pages['email-autofill']
            if (domain) {
                const pagePath = `/${emailAutofillPageName}`
                await page.goto(new URL(pagePath, domain).href)
            } else {
                await page.goto(emailAutofillPageName)
            }
        }

        async clickOnPage () {
            const heading = page.locator('h2')
            await heading.click()
        }

        async clickIntoInput () {
            const input = page.locator(selectors.identity)
            // click the input field (not within Dax icon)
            await input.click()
        }

        async clickDirectlyOnDax () {
            const input = page.locator(selectors.identity)
            await clickOnIcon(input)
        }

        async assertInputHasFocus () {
            const input = page.locator(selectors.identity)
            await expect(input).toBeFocused()
        }

        async assertInputNotFocused () {
            const input = page.locator(selectors.identity)
            await expect(input).not.toBeFocused()
        }

        async assertEmailValue (emailAddress) {
            const email = page.locator(selectors.identity)
            await expect(email).toHaveValue(emailAddress)
        }

        /**
         * @param {import('../../../src/deviceApiCalls/__generated__/validators-ts').SendJSPixelParams[]} pixels
         */
        async assertPixelsFired (pixels) {
            const calls = await mockedCalls(page, {names: ['sendJSPixel']})
            expect(calls.length).toBeGreaterThanOrEqual(1)
            const firedPixels = calls.map(([_, {pixelName, params}]) => params ? ({pixelName, params}) : ({pixelName}))
            expect(firedPixels).toEqual(pixels)
        }

        async assertNoPixelsFired () {
            const calls = await mockedCalls(page, {names: ['sendJSPixel'], minCount: 0})
            expect(calls.length).toBe(0)
        }

        async assertExtensionPixelsCaptured (expectedPixels) {
            let [backgroundPage] = page.context().backgroundPages()
            const backgroundPagePixels = await backgroundPage.evaluateHandle(() => {
                // eslint-disable-next-line no-undef
                return globalThis.pixels
            })

            const pixels = await backgroundPagePixels.jsonValue()
            expect(pixels).toEqual(expectedPixels)
        }

        async assertDaxIconIsShowing () {
            const input = page.locator(selectors.identity)
            expect(input).toHaveAttribute(ATTR_AUTOFILL, 'true')
        }

        async assertDaxIconIsHidden ({checking = 'autofill'} = {}) {
            const input = await page.getByLabel('Email')
            if (checking === 'style') {
                const style = await input.getAttribute('style')
                expect(style).toBeFalsy()
            } else {
                expect(input).not.toHaveAttribute(ATTR_AUTOFILL, 'true')
            }
        }
    }

    return new EmailAutofillPage()
}
