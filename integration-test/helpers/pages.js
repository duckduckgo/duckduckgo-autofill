import { constants } from './mocks.js'
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
    const emailStyleAttr = () => page.locator(constants.fields.email.selectors.identity).getAttribute('style')
    const passwordStyleAttr = () => page.locator('#password' + constants.fields.password.selectors.credential).getAttribute('style')
    return {
        async navigate () {
            await page.goto(server.urlForPath(constants.pages['signup']))
        },
        async selectGeneratedPassword () {
            const input = page.locator('#password')
            await input.click()

            const passwordBtn = page.locator('button:has-text("Generated password")')
            await expect(passwordBtn).toContainText('Login information will be saved for this website')

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
        /**
         * @param {Omit<CredentialsObject, "id">} credentials
         * @returns {Promise<void>}
         */
        async enterCredentials (credentials) {
            const {identity} = constants.fields.email.selectors
            const {credential} = constants.fields.password.selectors
            await page.fill(identity, credentials.username)
            await page.fill('#password' + credential, credentials.password || '')
            await page.fill('#password-2' + credential, credentials.password || '')

            /** NOTE: The next two lines are here to dismiss the auto-generated password prompt */
            await page.waitForTimeout(200)
            await page.keyboard.press('Tab')

            await page.locator(`button:has-text("Sign up")`).click()
        },
        /**
         * @param {Omit<CredentialsObject, "id">} credentials
         * @returns {Promise<void>}
         */
        async assertWasPromptedToSave (credentials) {
            const calls = await page.evaluate('window.__playwright.mocks.calls')
            const mockCalls = calls.find(([name]) => name === 'pmHandlerStoreData')
            const [, sent] = mockCalls
            expect(sent.credentials).toEqual(credentials)
        },
        async assertSecondEmailValue (emailAddress) {
            const input = page.locator(decoratedSecondInputSelector)
            await expect(input).toHaveValue(emailAddress)
        },
        async assertFirstEmailEmpty () {
            const input = page.locator(decoratedFirstInputSelector)
            await expect(input).toHaveValue('')
        },
        async assertEmailHasNoDaxIcon () {
            expect(await emailStyleAttr()).toBeNull()
        },
        async assertPasswordHasNoIcon () {
            expect(await passwordStyleAttr()).toBeNull()
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
        },
        /** @param {{password: string}} data */
        async submitPasswordOnlyForm (data) {
            await page.type('#password-3', data.password)
            await page.click('#login-3 button[type="submit"]')
        },
        /** @param {string} username */
        async submitUsernameOnlyForm (username) {
            await page.type('#email-2', username)
            await page.click('#login-2 button[type="submit"]')
        },
        /** @param {{password: string, username: string}} data */
        async submitLoginForm (data) {
            await page.type('#password', data.password)
            await page.type('#email', data.username)
            await page.click('#login button[type="submit"]')
        },
        async assertWasNotPromptedToSave () {
            const calls = await page.evaluate('window.__playwright.mocks.calls')
            const mockCalls = calls.filter(([name]) => name === 'pmHandlerStoreData')
            expect(mockCalls.length).toBe(0)
        },
        /**
         * @param {Record<string, any>} data
         * @param {Platform} [platform]
         */
        async assertWasPromptedToSave (data, platform = 'ios') {
            const calls = await page.evaluate('window.__playwright.mocks.calls')
            const mockCalls = calls.filter(([name]) => name === 'pmHandlerStoreData')
            expect(mockCalls).toHaveLength(1)
            const [, sent] = mockCalls[0]
            const expected = {
                credentials: data
            }
            if (platform === 'ios' || platform === 'macos') {
                expected.messageHandling = {secret: 'PLACEHOLDER_SECRET'}
                return expect(sent).toEqual(expected)
            }
            if (platform === 'android') {
                expect(JSON.parse(sent)).toEqual(expected)
            }
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
