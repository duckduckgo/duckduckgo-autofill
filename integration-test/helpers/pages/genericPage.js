import {expect} from '@playwright/test'
import {constants} from '../mocks.js'

/**
 * Use this to contain generic functions that can be re-used across pages
 *
 * @param {import("@playwright/test").Page} page
 * @returns {GenericPage}
 */
export function genericPage (page) {
    class GenericPage {
        async passwordFieldShowsFillKey (selector = '#password') {
            // don't make assertions until the element is both found + has a none-empty 'style' attribute
            await page.waitForFunction(selector => Boolean(document.querySelector(selector)?.getAttribute('style')), selector)
            const passwordStyle = await page.locator(selector).getAttribute('style')
            expect(passwordStyle).toContain(constants.iconMatchers.keyFill)
        }

        async passwordFieldShowsGenKey (selector = '#password') {
            // don't make assertions until the element is both found + has a none-empty 'style' attribute
            await page.waitForFunction(selector => Boolean(document.querySelector(selector)?.getAttribute('style')), selector)
            const passwordStyle = await page.locator(selector).getAttribute('style')
            expect(passwordStyle).toContain(constants.iconMatchers.keyGen)
        }

        async passwordHasNoIcon (selector = '#password') {
            const passwordStyle = await page.locator(selector).getAttribute('style')
            expect(passwordStyle || '').not.toContain('data:image/svg+xml;base64,')
        }

        async selectGeneratedPassword (selector = '#password') {
            const input = page.locator(selector)
            await input.click()

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
    }

    return new GenericPage()
}