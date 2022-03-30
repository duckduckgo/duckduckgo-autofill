import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer
} from '../helpers/harness.js'
import { test as base, expect } from '@playwright/test'
import {constants, createWebkitMocks} from '../helpers/mocks.js'
import {emailAutofillPage, loginPage, signupPage} from '../helpers/pages.js'

/**
 *  Tests for various auto-fill scenarios on macos
 */
const test = base.extend({})

test.describe('macos', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test('should autofill the selected email', async ({page}) => {
        // enable in-terminal exceptions
        forwardConsoleMessages(page)

        await createWebkitMocks()
            .withPrivateEmail('0')
            .withPersonalEmail('shane-123')
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replace('isApp', true)
            .replace('hasModernWebkitAPI', true)
            .platform('macos')
            .applyTo(page)

        const {personalAddress, privateAddress0} = constants.fields.email

        // page abstraction
        const emailPage = emailAutofillPage(page, server)
        await emailPage.navigate()

        // first click into the field
        await emailPage.clickIntoInput()

        // these are mac specific - different to the extension because they use different tooltips
        const personalAddressBtn = await page.locator(`button:has-text("${personalAddress} Blocks email trackers")`)
        const privateAddressBtn = await page.locator(`button:has-text("Generated Private Duck Address 0@duck.com")`)

        // select the first option
        await personalAddressBtn.click()

        // ensure autofill populates the field
        await emailPage.assertEmailValue(personalAddress)

        // ensure the popup DOES show a second time, even though Dax was not clicked (this is mac specific)
        await emailPage.clickIntoInput()
        await expect(personalAddressBtn).toBeVisible()

        // now select the second address this time...
        await privateAddressBtn.click()

        // ...and ensure the second value is the private address
        await emailPage.assertEmailValue(privateAddress0)
    })
    test('auto filling a signup form', async ({page}) => {
        // enable in-terminal exceptions
        forwardConsoleMessages(page)

        const {personalAddress} = constants.fields.email

        await createWebkitMocks()
            .withPrivateEmail('0')
            .withPersonalEmail('shane-123')
            .withIdentity({
                id: '01',
                title: 'Main identity',
                firstName: 'shane',
                emailAddress: personalAddress
            })
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replace('isApp', true)
            .platform('macos')
            .applyTo(page)

        const signup = signupPage(page, server)
        await signup.navigate()
        await signup.selectGeneratedPassword()
        await signup.selectFirstName('shane Main identity')
        await signup.assertEmailValue(personalAddress)
    })
    test('autofill a newly added email form (mutation observer test)', async ({page}) => {
        // enable in-terminal exceptions
        forwardConsoleMessages(page)

        const {personalAddress} = constants.fields.email

        await createWebkitMocks()
            .withPrivateEmail('0')
            .withPersonalEmail('shane-123')
            .withIdentity({
                id: '01',
                title: 'Main identity',
                firstName: 'shane',
                emailAddress: personalAddress
            })
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replace('isApp', true)
            .platform('macos')
            .applyTo(page)

        const signup = signupPage(page, server)
        await signup.navigate()
        await signup.addNewForm()
        await signup.selectSecondEmailField(`${personalAddress} Main identity`)
        await signup.assertSecondEmailValue(personalAddress)
        await signup.assertFirstEmailEmpty()
    })
    test('autofill a login form', async ({page}) => {
        // enable in-terminal exceptions
        forwardConsoleMessages(page)

        const {personalAddress} = constants.fields.email
        const password = '123456'

        await createWebkitMocks()
            .withCredentials({
                id: '01',
                username: personalAddress,
                password
            })
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replace('isApp', true)
            .platform('macos')
            .applyTo(page)

        const login = loginPage(page, server)
        await login.navigate()
        await login.selectFirstCredential(personalAddress)
        await login.assertFirstCredential(personalAddress, password)
    })
})
