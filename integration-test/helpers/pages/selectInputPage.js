import {constants} from '../mocks.js'
import {mockedCalls, payloadsOnly} from '../harness.js'
import {expect} from '@playwright/test'
import {clickOnIcon} from '../utils.js'

/**
 * A wrapper around interactions for `integration-test/pages/select-input.html`
 *
 * @param {import("@playwright/test").Page} page
 */
export function selectInputPage (page) {
    class SelectInputPage {
        /**
         * @param {keyof typeof constants.pages} [to]
         * @return {Promise<void>}
         */
        async navigate (to = 'selectInput', withLabel = false) {
            await page.goto(withLabel ? `${constants.pages[to]}?form-type=in-label` : constants.pages[to])
        }

        async selectOption (option, inLabel) {
            await page.selectOption(inLabel ? `form#in-label select#address-city` : `form#no-label select#address-city`, {value: option})
        }

        async clickIntoEmailField (selector) {
            const email = page.locator('#email')
            await email.click()
            const button = page.locator(`button:has-text("${selector}")`)
            await button.click({force: true})
        }

        /**
         * @param {string} address
         */
        async selectPrivateAddress (address) {
            await page.getByRole('button', {name: `Generate Private Duck Address ${address} Block email trackers & hide address`})
                .click({force: true})
        }

        /**
         * @param {string} option
         * @return {Promise<void>}
         */
        async assertSelectedValue (option, inLabel = false) {
            const selectValue = await page.locator(inLabel ? `form#in-label select#address-city` : 'form#no-label select#address-city').inputValue()
            expect(selectValue).toBe(option)
        }

        /**
         * @param {number} times
         * @return {Promise<void>}
         */
        async assertPasswordWasSuggestedTimes (times = 1) {
            const calls = await mockedCalls(page, {names: ['getAutofillData']})
            const payloads = payloadsOnly(calls)
            const suggested = payloads.filter(json => {
                return Boolean(json.generatedPassword)
            })
            expect(suggested.length).toBe(times)
        }

        async assertPasswordWasAutofilled () {
            await page.waitForFunction(() => {
                const pw = /** @type {HTMLInputElement} */ (document.querySelector('#password'))
                return pw?.value.length > 0
            })
            const input = await page.locator('#password').inputValue()
            const input2 = await page.locator('#password-2').inputValue()
            expect(input.length).toBeGreaterThan(9)
            expect(input).toEqual(input2)
        }

        async assertPasswordWasNotAutofilled () {
            // ensure there was time to autofill, otherwise it can give a false negative
            await page.waitForTimeout(100)
            const input = await page.locator('#password').inputValue()
            const input2 = await page.locator('#password-2').inputValue()
            expect(input).toEqual('')
            expect(input2).toEqual('')
        }

        /**
         * @param {string} address
         */
        async assertUsernameFieldSent (address) {
            const calls = payloadsOnly(await mockedCalls(page, {names: ['getAutofillData']}))

            expect(/** @type {any} */(calls[0]).generatedPassword.username).toEqual(address)
            expect(calls.length).toEqual(1)
        }

        async clickDirectlyOnPasswordIcon () {
            const input = page.locator('#password')
            await clickOnIcon(input)
        }

        /**
         * @param {string} name
         * @return {Promise<void>}
         */
        async selectFirstName (name, inLabel = false) {
            const input = page.locator(inLabel ? `form#in-label input#firstname` : 'form#no-label input#firstname')
            await input.click()
            const button = await page.waitForSelector(`button:has-text("${name}")`)
            await button.click({force: true})
        }

        async selectLastName (name) {
            const input = page.locator('#lastname')
            await input.click()
            const button = await page.waitForSelector(`button:has-text("${name}")`)
            await button.click({force: true})
        }
    }

    return new SelectInputPage()
}
