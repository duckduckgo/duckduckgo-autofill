import {constants} from '../mocks.js'
import {genericPage} from './genericPage.js'
import {expect} from '@playwright/test'

/**
 * @param {import("@playwright/test").Page} page
 */
export function passwordUpdatePage (page) {
    class PasswordUpdatePage {
        async navigate () {
            await page.goto(constants.pages.passwordUpdate)
        }

        async currentPasswordHasFillKey () {
            return genericPage(page).passwordFieldShowsFillKey('#password-current')
        }

        async newPasswordHasGenKey () {
            return genericPage(page).passwordFieldShowsGenKey('#password-new')
        }

        async confirmPasswordHasGenKey () {
            return genericPage(page).passwordFieldShowsGenKey('#password-new-confirm')
        }

        async fillCurrent () {
            const currentField = page.locator('#password-current')
            await currentField.click()
            const autofillButton = await page.getByRole('button', {name: constants.fields.email.personalAddress})
            await autofillButton.click({force: true})
        }

        async checkCurrentFieldHasValue (value) {
            const currentField = page.locator('#password-current')
            await expect(currentField).toHaveValue(value)
        }

        async checkGeneratedFill () {
            const generatedPassword = await genericPage(page).selectGeneratedPassword('#password-new')
            const confirmField = await page.locator('#password-new-confirm')
            await expect(confirmField).toHaveValue(generatedPassword)
        }

        // When there are no credentials
        async currentFieldHasNoIcon () {
            return genericPage(page).passwordHasNoIcon('#password-current')
        }
    }

    return new PasswordUpdatePage()
}
