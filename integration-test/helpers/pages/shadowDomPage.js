import {constants} from '../mocks.js'

import {genericPage} from './genericPage.js'

/**
 * @param {import("@playwright/test").Page} page
 */
export function shadowDomPage (page) {
    class ShadowDomPage {
        async navigate () {
            await page.goto(constants.pages.shadowDom)
        }

        async showTheForm () {
            const toggleBtn = page.locator(`button:has-text("Click here to sign up")`)
            await toggleBtn.click()
        }

        async clickThePasswordField () {
            return genericPage(page).clickThePasswordField()
        }

        passwordHasNoIcon () {
            return genericPage(page).passwordHasNoIcon()
        }

        passwordFieldShowsGenKey () {
            return genericPage(page).passwordFieldShowsGenKey()
        }

        selectGeneratedPassword () {
            return genericPage(page).selectGeneratedPassword()
        }
    }

    return new ShadowDomPage()
}
