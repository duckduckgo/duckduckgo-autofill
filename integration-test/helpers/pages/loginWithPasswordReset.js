import {constants} from '../mocks.js'

import {genericPage} from './genericPage.js'
import {loginPage} from './loginPage.js'

/**
 * @param {import("@playwright/test").Page} page
 */
export function loginWithPasswordResetPage (page) {
    class LoginWithPasswordResetPage {
        async navigate () {
            await page.goto(constants.pages['loginWithPasswordReset'])
        }

        async credentialsFilled (username, password) {
            await loginPage(page).assertUsernameFilled(username, '#username')
            await loginPage(page).assertPasswordFilled(password)
        }

        async selectUsernameField (name) {
            await genericPage(page).clickTheUsernameField()
            const button = await page.waitForSelector(`button:has-text("${name}")`)
            await button.click({force: true})
        }

        async selectPasswordField (name) {
            await genericPage(page).clickThePasswordField()
            const button = await page.waitForSelector(`button:has-text("${name}")`)
            await button.click({force: true})
        }

        async passwordHasNoIcon () {
            await genericPage(page).passwordHasNoIcon()
        }

        async passwordFieldShowsFillIcon () {
            await genericPage(page).passwordFieldShowsFillKey()
        }
    }

    return new LoginWithPasswordResetPage()
}
