import {constants} from '../mocks.js'
import {expect} from '@playwright/test'

/**
 * A wrapper around interactions for `integration-test/pages/select-input.html`
 *
 * @param {import("@playwright/test").Page} page
 */
export function unknownUsernameLoginPage (page) {
    class UnknownUsernameLoginPage {
        /**
         * @return {Promise<void>}
         */
        async navigate (to = 'unknownUsernameLogin') {
            await page.goto(constants.pages[to])
        }

        /**
         *
         * @param {string} name
         */
        async autofillWithUnknownField (name) {
            await page.locator('#unknown').click()
            const button = await page.waitForSelector(`button:has-text("${name}")`)
            await button.click({force: true})
            await page.locator('#unknown').click()
        }

        /**
         *
         * @param {string} name
         */
        async autofillWithPasswordField (name) {
            await page.locator('#password').click()
            const button = await page.waitForSelector(`button:has-text("${name}")`)
            await button.click({force: true})
            await page.locator('#password').click()
        }

        async assertUnknownFieldIsUsername () {
            const input = await page.locator('#unknown')
            const inputType = await input.getAttribute('data-ddg-inputtype')
            await expect(inputType).toBe('credentials.username')
        }

        /**
         * @param {string} value
         * @return {Promise<void>}
         */
        async assertUnknownFieldFilled (value) {
            const unknown = page.locator('#unknown')
            await expect(unknown).toHaveValue(value)
        }
        /**
         * @param {string} value
         * @return {Promise<void>}
         */
        async assertPasswordFilled (value) {
            const passwordField = page.locator('#password')
            await expect(passwordField).toHaveValue(value)
        }

        /**
         * @param {string} username
         * @param {string} password
         * @return {Promise<void>}
         */
        async assertCredentialsFilled (username, password) {
            await this.assertUnknownFieldFilled(username)
            await this.assertPasswordFilled((password))
        }
    }

    return new UnknownUsernameLoginPage()
}
