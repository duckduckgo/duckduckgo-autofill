import { constants } from '../mocks.js'

import { genericPage } from './genericPage.js'

/**
 * @param {import("@playwright/test").Page} page
 */
export function mutatingFormPage(page) {
    class MutatingFormPage {
        async navigate() {
            await page.goto(constants.pages.mutatingForm)
        }

        async toggleLoginOrSignup() {
            const toggleBtn = page.locator('#toggle-login-signup')
            await toggleBtn.click()
        }

        passwordFieldShowsFillKey() {
            return genericPage(page).passwordFieldShowsFillKey()
        }

        passwordFieldShowsGenKey() {
            return genericPage(page).passwordFieldShowsGenKey()
        }
    }

    return new MutatingFormPage()
}
