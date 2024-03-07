import {constants} from '../mocks.js'
import {expect} from '@playwright/test'
import {mockedCalls, payloadsOnly} from '../harness.js'

import {genericPage} from './genericPage.js'

/**
 * A wrapper around interactions for `integration-test/pages/login.html`
 *
 * @param {import("@playwright/test").Page} page
 * @param {{overlay?: boolean, clickLabel?: boolean}} [opts]
 */
export function loginPage (page, opts = {}) {
    const {overlay = false, clickLabel = false} = opts

    class LoginPage {
        /**
         * @param {keyof typeof constants.pages} [to] - any key matching in `constants.pages`
         * @return {Promise<void>}
         */
        async navigate (to = 'login') {
            await page.goto(constants.pages[to])
        }

        async clickIntoUsernameInput () {
            const usernameField = page.locator('#email').first()
            // click the input field (not within Dax icon)
            await usernameField.click()
        }

        async typeIntoUsernameInput (username) {
            const emailField = await page.locator('#email')
            await emailField.fill(username)
        }

        async clickIntoPasswordInput () {
            const passwordField = page.locator('#password').first()
            // click the input field (not within Dax icon)
            await passwordField.click()
        }

        async fieldsDoNotContainIcons (emailSelector = '#email', passwordSelector = '#password') {
            const emailStyles = await page.locator(emailSelector).getAttribute('style')
            const passwordStyles = await page.locator(passwordSelector).getAttribute('style')
            expect(emailStyles || '').not.toContain('data:image/svg+xml;base64,')
            expect(passwordStyles || '').not.toContain('data:image/svg+xml;base64,')
        }

        async fieldsContainIcons (emailSelector = '#email', passwordSelector = '#password') {
            // don't make assertions until the element is both found + has a none-empty 'style' attribute
            await page.waitForFunction((emailSelector) => Boolean(document.querySelector(emailSelector)?.getAttribute('style')), emailSelector)
            const emailStyles = await page.locator(emailSelector).getAttribute('style')
            const passwordStyles = await page.locator(passwordSelector).getAttribute('style')
            expect(emailStyles).toContain('data:image/svg+xml;base64,')
            expect(passwordStyles).toContain('data:image/svg+xml;base64,')
        }

        async passwordFieldShowsFillKey () {
            return genericPage(page).passwordFieldShowsFillKey()
        }

        async onlyPasswordFieldHasIcon () {
            const styles1 = await page.locator('#email').getAttribute('style')
            expect(styles1 || '').not.toContain('data:image/svg+xml;base64,')
            await this.passwordFieldShowsFillKey()
        }

        /**
         * @param {string} username
         * @return {Promise<void>}
         */
        async assertTooltipNotOpen (username) {
            await expect(page.locator(`button:has-text("${username}")`)).not.toBeVisible()
        }

        /**
         * @param {string} username
         * @return {Promise<void>}
         */
        async selectFirstCredential (username) {
            if (clickLabel) {
                const label = page.locator('label[for="email"]')
                await label.click({force: true})
            } else {
                const email = page.locator('#email')
                await email.click({force: true})
            }

            if (!overlay) {
                const button = await page.waitForSelector(`button:has-text("${username}")`)
                await button.click({force: true})
            }
        }

        /**
         * @param {string} username
         * @param {string} password
         * @return {Promise<void>}
         */
        async assertBitwardenTooltipWorking (username, password) {
            await this.clickIntoUsernameInput()
            const button = await page.waitForSelector('.tooltip__button--data--bitwarden')
            expect(button).toBeDefined()
            await button.click()
            await this.assertFirstCredential(username, password)
        }

        async assertBitwardenLockedWorking () {
            await this.clickIntoUsernameInput()
            const button = await page.waitForSelector('button:has-text("Bitwarden is locked")')
            expect(button).toBeDefined()
            await button.click()
            const updatedButton = await page.waitForSelector(`button:has-text("${constants.fields.email.personalAddress}")`)
            expect(updatedButton).toBeDefined()
            await updatedButton.click()
            const autofillCalls = await mockedCalls(page, {names: ['pmHandlerGetAutofillCredentials']})
            expect(autofillCalls).toHaveLength(1)
        }

        /**
         * @param {string} username
         * @return {Promise<void>}
         */
        async assertUsernameFilled (username) {
            const emailField = page.locator('#email')
            await expect(emailField).toHaveValue(username)
        }

        /**
         * @param {string} password
         * @return {Promise<void>}
         */
        async assertPasswordFilled (password) {
            const passwordField = page.locator('#password')
            await expect(passwordField).toHaveValue(password)
        }

        /**
         * @param {string} username
         * @param {string} password
         * @return {Promise<void>}
         */
        async assertFirstCredential (username, password) {
            await this.assertUsernameFilled(username)
            await this.assertPasswordFilled((password))
        }

        async assertPasswordEmpty () {
            const passwordField = page.locator('#password')
            await expect(passwordField).toHaveValue('')
        }

        async promptWasShown () {
            const calls = await mockedCalls(page, {names: ['getAutofillData']})
            expect(calls.length).toBeGreaterThan(0)
            const payloads = payloadsOnly(calls)
            expect(payloads[0].inputType).toBe('credentials.username')
        }

        async promptWasNotShown () {
            const calls = await page.evaluate('window.__playwright_autofill.mocks.calls')
            const mockCalls = calls.filter(([name]) => name === 'getAutofillData')
            expect(mockCalls.length).toBe(0)
        }

        /**
         * Note: Checks like this are not ideal, but they exist here to prevent
         * false positives.
         * @returns {Promise<void>}
         */
        async assertParentOpened () {
            const credsCalls = await mockedCalls(page, {names: ['getSelectedCredentials']})
            const hasSucceeded = credsCalls.some((call) => call[2]?.some(({type}) => type === 'ok'))
            expect(hasSucceeded).toBe(true)
        }

        /** @param {{password: string}} data */
        async submitPasswordOnlyForm (data) {
            const passwordField = page.locator('#password-3')
            await passwordField.fill(data.password)
            await page.click('#login-3 button[type="submit"]')
        }

        /** @param {string} username */
        async submitUsernameOnlyForm (username) {
            const emailField = page.locator('#email-2')
            await emailField.fill(username)
            await page.click('#login-2 button[type="submit"]')
        }

        /** @param {{password: string, username: string}} data */
        async submitLoginForm (data) {
            const passwordField = page.locator('#password')
            await passwordField.fill(data.password)
            const emailField = page.locator('#email')
            await emailField.fill(data.username)
            await page.click('#login button[type="submit"]')
        }

        async shouldNotPromptToSave () {
            let mockCalls = []
            mockCalls = await mockedCalls(page, {names: ['storeFormData'], minCount: 0})
            expect(mockCalls.length).toBe(0)
        }

        /**
         * This is used mostly to avoid false negatives when we check for something _not_ happening.
         * Basically, you check that a specific call hasn't happened but the rest of the script ran just fine.
         * @returns {Promise<void>}
         */
        async assertAnyMockCallOccurred () {
            const calls = await page.evaluate('window.__playwright_autofill.mocks.calls')
            expect(calls.length).toBeGreaterThan(0)
        }

        /** @param {string} mockCallName */
        async assertMockCallOccurred (mockCallName) {
            const calls = await page.evaluate('window.__playwright_autofill.mocks.calls')
            const mockCall = calls.find(([name]) => name === mockCallName)
            expect(mockCall).toBeDefined()
        }

        /**
         * @param {string} mockCallName
         * @param {number} times
         */
        async assertMockCallOccurredTimes (mockCallName, times) {
            const calls = await page.evaluate('window.__playwright_autofill.mocks.calls')
            const mockCalls = calls.filter(([name]) => name === mockCallName)
            expect(mockCalls).toHaveLength(times)
        }

        /**
         * @param {Record<string, any>} data
         */
        async assertWasPromptedToSave (data) {
            const calls = await mockedCalls(page, {names: ['storeFormData']})
            const payloads = payloadsOnly(calls)

            expect(payloads[0].credentials).toEqual(data)
            expect(payloads[0].trigger).toEqual('formSubmission')
        }

        /**
         * @returns {Promise<void>}
         */
        async assertClickMessage () {
            const calls = await mockedCalls(page, {names: ['showAutofillParent']})
            expect(calls.length).toBe(1)

            // each call is captured as a tuple like this: [name, params, response], which is why
            // we use `call1[1]` and `call1[2]` - we're accessing the params sent in the request
            const [call1] = calls
            expect(call1[1].wasFromClick).toBe(true)
        }

        async assertFocusMessage () {
            const calls = await mockedCalls(page, {names: ['showAutofillParent']})
            expect(calls.length).toBe(1)

            // each call is captured as a tuple like this: [name, params, response], which is why
            // we use `call1[1]` and `call1[2]` - we're accessing the params sent in the request
            const [call1] = calls
            expect(call1[1].wasFromClick).toBe(false)
        }

        async assertFormSubmitted () {
            const submittedMsg = await page.locator('h1:has-text("Submitted!")')
            await expect(submittedMsg).toBeVisible()
        }

        async assertFormNotSubmittedAutomatically () {
            const submitButton = await page.locator('button:has-text("Log in")')
            await expect(submitButton).toBeVisible()
            await submitButton.click()
            await this.assertFormSubmitted()
        }

        async assertNoAttributesWereAdded () {
            const attrCount = page.locator('[data-ddg-inputtype]')
            const count = await attrCount.count()
            expect(count).toBe(0)
        }

        async assertNoPixelFired () {
            const mockCalls = await mockedCalls(page, {names: ['sendJSPixel'], minCount: 0})
            expect(mockCalls).toHaveLength(0)
        }

        async openDialog () {
            const button = await page.waitForSelector(`button:has-text("Click here to open dialog")`)
            await button.click({force: true})
            await this.assertDialogOpen()
        }

        async assertDialogClose () {
            const form = await page.locator('.dialog')
            await expect(form).toBeHidden()
        }

        async assertDialogOpen () {
            const form = await page.locator('.dialog')
            await expect(form).toBeVisible()
        }

        async hitEscapeKey () {
            await page.press('#login', 'Escape')
        }

        async clickOutsideTheDialog () {
            await page.click('#random-text')
        }

        async closeCookieDialog () {
            await page.click('button:has-text("Accept all cookies")')
        }
    }

    return new LoginPage()
}
