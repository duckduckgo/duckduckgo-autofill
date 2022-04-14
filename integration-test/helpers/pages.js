import {constants} from './mocks.js'
import { expect } from '@playwright/test'

/**
 * A wrapper around interactions for `integration-test/pages/signup.html`
 *
 * @param {import("playwright").Page} page
 * @param {ServerWrapper} server
 */
export function signupPage (page, server) {
    const decoratedFirstInputSelector = '#email' + constants.fields.email.selectors.identity
    const decoratedSecondInputSelector = '#email-2' + constants.fields.email.selectors.identity
    return {
        async navigate () {
            await page.goto(server.urlForPath(constants.pages['signup']))
        },
        async selectGeneratedPassword () {
            const input = page.locator('#password')
            await input.click()

            const passwordBtn = page.locator('button:has-text("Generated password")')

            const passwordButtonText = await passwordBtn.innerText()
            const [, generatedPassword] = passwordButtonText.split('\n')

            if (!generatedPassword.trim()) {
                throw new Error('unreachable - password must not be empty')
            }

            await passwordBtn.click({ force: true })
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
            await button.click({ force: true })
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
            const input = page.locator(decoratedSecondInputSelector)
            await input.click()
            const button = page.locator(`button:has-text("${selector}")`)
            await button.click({ force: true })
        },
        async assertSecondEmailValue (emailAddress) {
            const input = page.locator(decoratedSecondInputSelector)
            await expect(input).toHaveValue(emailAddress)
        },
        async assertFirstEmailEmpty () {
            const input = page.locator(decoratedFirstInputSelector)
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
            await button.click({ force: true })
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

/**
 * A wrapper around interactions for `integration-test/pages/signup.html`
 *
 * @param {import("playwright").Page} page
 * @param {ServerWrapper} server
 */
export function loginAndSignup (page, server) {
    // style lookup helpers
    const usernameStyleAttr = () => page.locator(constants.fields.username.selectors.credential).getAttribute('style')
    const emailStyleAttr = () => page.locator(constants.fields.email.selectors.identity).getAttribute('style')
    const firstPasswordStyleAttr = () => page.locator('#login-password' + constants.fields.password.selectors.credential).getAttribute('style')

    return {
        async navigate () {
            await page.goto(server.urlForPath(constants.pages['login+setup']))
        },
        async assertIdentitiesWereNotDecorated () {
            const style = await emailStyleAttr()
            expect(style).toBeNull()
        },
        async assertUsernameAndPasswordWereDecoratedWithIcon () {
            expect(await usernameStyleAttr()).toContain('data:image/svg+xml;base64,')
            expect(await firstPasswordStyleAttr()).toContain('data:image/svg+xml;base64,')
        },
        async assertNoDecorations () {
            const usernameAttr = await usernameStyleAttr()
            expect(usernameAttr).toBeNull()

            expect(await firstPasswordStyleAttr()).toBeNull()
        }
    }
}
