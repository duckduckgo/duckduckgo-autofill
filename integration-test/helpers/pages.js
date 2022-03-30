import {constants} from './mocks.js'
import { expect } from '@playwright/test'

/**
 * A wrapper around interactions for `integration-test/pages/signup.html`
 *
 * @param {import("playwright").Page} page
 * @param {ServerWrapper} server
 */
export function signupPage (page, server) {
    return {
        async navigate () {
            await page.goto(server.urlForPath(constants.pages['signup']))
        },
        async selectGeneratedPassword () {
            const input = page.locator('#password')
            await input.click()

            const passwordBtn = page.locator('button:has-text("Generated Password")')

            const passwordButtonText = await passwordBtn.innerText()
            const [, generatedPassword] = passwordButtonText.split('\n')

            await passwordBtn.click()
            return expect(input).toHaveValue(generatedPassword)
        },
        /**
         * @param {string} name
         * @return {Promise<void>}
         */
        async selectFirstName (name) {
            const input = page.locator('#firstname')
            await input.click()
            const button = await page.waitForSelector(`button:has-text("${name}")`)
            await button.click()
        },
        async assertEmailValue (emailAddress) {
            const {selectors} = constants.fields.email
            const email = page.locator(selectors.identity)
            await expect(email).toHaveValue(emailAddress)
        },
        async addNewForm () {
            const btn = page.locator('text=Add new form')
            await btn.click()
        },
        async selectSecondEmailField (selector) {
            const input = page.locator('#email2')
            await input.click()
            const button = page.locator(`button:has-text("${selector}")`)
            await button.click()
        },
        async assertSecondEmailValue (emailAddress) {
            const input = page.locator('#email2')
            await expect(input).toHaveValue(emailAddress)
        },
        async assertFirstEmailEmpty () {
            const input = page.locator('#email')
            await expect(input).toHaveValue('')
        }
    }
}

/**
 * A wrapper around interactions for `integration-test/pages/login.html`
 *
 * @param {import("playwright").Page} page
 * @param {ServerWrapper} server
 */
export function loginPage (page, server) {
    return {
        async navigate () {
            await page.goto(server.urlForPath(constants.pages['login']))
        },
        /**
         * @param {string} username
         * @return {Promise<void>}
         */
        async selectFirstCredential (username) {
            const email = page.locator('#email')
            await email.click()
            const button = await page.waitForSelector(`button:has-text("${username}")`)
            await button.click()
        },
        /**
         * @param {string} username
         * @param {string} password
         * @return {Promise<void>}
         */
        async assertFirstCredential (username, password) {
            const emailField = page.locator('#email')
            const passwordField = page.locator('#password')
            await expect(emailField).toHaveValue(username)
            await expect(passwordField).toHaveValue(password)
        }
    }
}

/**
 * A wrapper around interactions for `integration-test/pages/email-autofill.html`
 *
 * @param {import("playwright").Page} page
 * @param {ServerWrapper} server
 */
export function emailAutofillPage (page, server) {
    const {selectors} = constants.fields.email
    return {
        async navigate () {
            await page.goto(server.urlForPath(constants.pages['email-autofill']))
        },
        async clickIntoInput () {
            const input = page.locator(selectors.identity)
            // click the input field (not within Dax icon)
            await input.click()
        },
        async clickDirectlyOnDax () {
            const input = page.locator(selectors.identity)
            const box = await input.boundingBox()
            if (!box) throw new Error('unreachable')
            await input.click({position: {x: box.width - (box.height / 2), y: box.height / 2}})
        },
        async assertEmailValue (emailAddress) {
            const email = page.locator(selectors.identity)
            await expect(email).toHaveValue(emailAddress)
        }

    }
}
