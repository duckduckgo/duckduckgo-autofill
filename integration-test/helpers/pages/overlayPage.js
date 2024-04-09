import {constants} from '../mocks.js'
import {addTopAutofillMouseFocus} from '../utils.js'
import {mockedCalls} from '../harness.js'
import {expect} from '@playwright/test'

/**
 * @param {import("@playwright/test").Page} page
 */
export function overlayPage (page) {
    class OverlayPage {
        async navigate () {
            await page.goto(constants.pages['overlay'])
        }

        /**
         * @param {string} text
         * @returns {Promise<void>}
         */
        async clickButtonWithText (text) {
            const button = await page.locator(`button:has-text("${text}")`)
            await addTopAutofillMouseFocus(page, button)
            await button.click({force: true})
        }

        /**
         * When we're in an overlay, 'closeAutofillParent' should not be called.
         * @params {string} callName
         */
        async doesNotCloseParentAfterCall (callName) {
            const callNameCalls = await mockedCalls(page, {names: [callName]})
            expect(callNameCalls.length).toBeGreaterThanOrEqual(1)
            const closeAutofillParentCalls = await mockedCalls(page, {names: ['closeAutofillParent'], minCount: 0})
            expect(closeAutofillParentCalls.length).toBe(0)
        }

        async assertCloseAutofillParent () {
            const closeAutofillParentCalls = await mockedCalls(page, {names: ['closeAutofillParent']})
            expect(closeAutofillParentCalls.length).toBe(1)
        }

        /**
         * When we're in an overlay, 'closeAutofillParent' should not be called.
         */
        async assertSelectedDetail () {
            return page.waitForFunction(() => {
                const calls = window.__playwright_autofill.mocks.calls
                return calls.some(call => call[0] === 'selectedDetail')
            })
        }

        async assertTextNotPresent (text) {
            const button = await page.locator(`button:has-text("${text}")`)
            await expect(button).toHaveCount(0)
        }

        async assertCallHappenedTimes (callName, times) {
            const calls = await mockedCalls(page, {names: [callName]})
            expect(calls.length).toBe(times)
        }
    }

    return new OverlayPage()
}
