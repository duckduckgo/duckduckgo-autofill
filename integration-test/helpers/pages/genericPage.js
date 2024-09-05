import {expect} from '@playwright/test'
import {constants} from '../mocks.js'
import { mockedCalls } from '../harness.js'

/**
 * Use this to contain generic functions that can be re-used across pages
 *
 * @param {import("@playwright/test").Page} page
 * @returns {GenericPage}
 */
export function genericPage (page) {
    class GenericPage {
        async passwordFieldShowsFillKey (selector = '#password') {
            // don't make assertions until the element has been scanned
            const field = page.locator(selector)
            await expect(field).toHaveAttribute('data-ddg-inputtype')

            const passwordStyle = await page.locator(selector).getAttribute('style')
            await expect(passwordStyle).toContain(constants.iconMatchers.keyFill)
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

        async passwordFieldShowsGenKey (selector = '#password') {
            // don't make assertions until the element has been scanned
            const field = page.locator(selector)
            await expect(field).toHaveAttribute('data-ddg-inputtype')

            const passwordStyle = await page.locator(selector).getAttribute('style')
            await expect(passwordStyle).toContain(constants.iconMatchers.keyGen)
        }

        async passwordHasNoIcon (selector = '#password') {
            const passwordStyle = await page.locator(selector).getAttribute('style')
            await expect(passwordStyle || '').not.toContain('data:image/svg+xml;base64,')
        }

        async locateAndClick (selector) {
            const input = page.locator(selector)
            await input.click({force: true})
        }

        async clickThePasswordField (selector = '#password') {
            await this.locateAndClick(selector)
        }

        async clickTheUsernameField (selector = '#username') {
            await this.locateAndClick(selector)
        }

        async selectGeneratedPassword (selector = '#password') {
            const input = page.locator(selector)
            await input.click({force: true})

            const passwordBtn = page.locator('button:has-text("Generated password")')
            await expect(passwordBtn).toContainText('Password will be saved for this website')

            const passwordButtonText = await passwordBtn.innerText()
            const [, generatedPassword] = passwordButtonText.split('\n')

            if (!generatedPassword.trim()) {
                throw new Error('unreachable - password must not be empty')
            }

            await passwordBtn.click({force: true})
            await expect(input).toHaveValue(generatedPassword)
            return generatedPassword
        }

        /**
         * @param {string} text
         * @return {Promise<void>}
         */
        async assertTooltipNotOpen (text) {
            await expect(page.locator(`button:has-text("${text}")`)).not.toBeVisible()
        }

        /**
         * @param {string} text
         * @return {Promise<void>}
         */
        async assertTooltipOpen (text) {
            await expect(page.locator(`button:has-text("${text}")`)).toBeVisible()
        }
    }

    return new GenericPage()
}
