import { constants } from '../mocks.js'
import { expect } from '@playwright/test'

/**
 * @param {import("@playwright/test").Page} page
 */
export function shadowInputsLoginPage(page) {
    class ShadowInputsLoginPage {
        async navigate() {
            await page.goto(constants.pages.shadowInputsLogin)
        }

        async clickTheUsernameField(text) {
            const input = page.locator('#username')
            await input.click()
            const button = await page.waitForSelector(`button:has-text("${text}")`)
            await button.click({ force: true })
        }

        /**
         * @param {string} value
         * @return {Promise<void>}
         */
        async assertUsernameFilled(value) {
            const username = page.locator('#username')
            await expect(username).toHaveValue(value)
        }
        /**
         * @param {string} value
         * @return {Promise<void>}
         */
        async assertPasswordFilled(value) {
            const passwordField = page.locator('#password')
            await expect(passwordField).toHaveValue(value)
        }

        /**
         * @param {string} username
         * @param {string} password
         * @return {Promise<void>}
         */
        async assertCredentialsFilled(username, password) {
            await this.assertUsernameFilled(username)
            await this.assertPasswordFilled(password)
        }
    }

    return new ShadowInputsLoginPage()
}
