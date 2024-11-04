import { constants } from '../mocks.js'
import { expect } from '@playwright/test'

/**
 * A wrapper around interactions for `integration-test/pages/select-input.html`
 *
 * @param {import("@playwright/test").Page} page
 */
export function selectInputPage(page) {
    class SelectInputPage {
        /**
         * @param {keyof typeof constants.pages} [to]
         * @return {Promise<void>}
         */
        async navigate(to = 'selectInput', withLabel = false) {
            await page.goto(withLabel ? `${constants.pages[to]}?form-type=with-label` : constants.pages[to])
        }

        async selectOption(option, withLabel) {
            await page.selectOption(withLabel ? `form#with-label select#address-city` : `form#no-label select#address-city`, {
                value: option,
            })
        }

        /**
         * @param {string} option
         * @return {Promise<void>}
         */
        async assertSelectedValue(option, withLabel = false) {
            const selectValue = await page
                .locator(withLabel ? `form#with-label select#address-city` : 'form#no-label select#address-city')
                .inputValue()
            expect(selectValue).toBe(option)
        }

        /**
         * @param {string} name
         * @return {Promise<void>}
         */
        async selectFirstName(name, withLabel = false) {
            const input = page.locator(withLabel ? `form#with-label input#firstname` : 'form#no-label input#firstname')
            await input.click()
            const button = await page.waitForSelector(`button:has-text("${name}")`)
            await button.click({ force: true })
        }

        async selectLastName(name) {
            const input = page.locator('#lastname')
            await input.click()
            const button = await page.waitForSelector(`button:has-text("${name}")`)
            await button.click({ force: true })
        }
    }

    return new SelectInputPage()
}
