import {
    createAutofillScript,
    forwardConsoleMessages, performanceEntries,
} from '../helpers/harness.js'
import {test as base, expect} from '@playwright/test'
import {constants} from '../helpers/mocks.js'
import {emailAutofillPage, signupPage} from '../helpers/pages.js'
import {createWebkitMocks, macosContentScopeReplacements} from '../helpers/mocks.webkit.js'
import {createAvailableInputTypes, stripDuckExtension} from '../helpers/utils.js'

/**
 *  Tests for various auto-fill scenarios on macos
 */
const test = base.extend({})

test.describe('macos', () => {
    test('should autofill the selected email', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        await createWebkitMocks()
            .withAvailableInputTypes({email: true})
            .withPrivateEmail('0')
            .withPersonalEmail('shane-123')
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replaceAll(macosContentScopeReplacements())
            .platform('macos')
            .applyTo(page)

        const {personalAddress, privateAddress0} = constants.fields.email

        // page abstraction
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate()

        // first click into the field
        await emailPage.clickIntoInput()

        // these are mac specific - different to the extension because they use different tooltips (currently)
        const personalAddressBtn = await page.locator(`button:has-text("${personalAddress} Blocks email trackers")`)
        const privateAddressBtn = await page.locator(`button:has-text("Generate Private Duck Address 0@duck.com")`)

        // select the first option
        await expect(personalAddressBtn).toBeVisible()
        await personalAddressBtn.click({force: true})

        // ensure autofill populates the field
        await emailPage.assertEmailValue(personalAddress)

        // ensure pixel was fired
        await emailPage.assertPixelsFired([
            {pixelName: 'autofill_identity', params: {fieldType: 'emailAddress'}},
            {pixelName: 'autofill_personal_address'}
        ])

        // ensure the popup DOES show a second time, even though Dax was not clicked (this is mac specific)
        await emailPage.clickIntoInput()
        await expect(personalAddressBtn).toBeVisible()

        // now select the second address this time...
        await privateAddressBtn.click({force: true})

        // ...and ensure the second value is the private address
        await emailPage.assertEmailValue(privateAddress0)

        // ensure pixel was fired
        await emailPage.assertPixelsFired([
            {pixelName: 'autofill_identity', params: {fieldType: 'emailAddress'}},
            {pixelName: 'autofill_personal_address'},
            {pixelName: 'autofill_identity', params: {fieldType: 'emailAddress'}},
            {pixelName: 'autofill_private_address'}
        ])
    })
    test.describe('auto filling a signup form', () => {
        async function applyScript (page) {
            await createAutofillScript()
                .replaceAll(macosContentScopeReplacements())
                .platform('macos')
                .applyTo(page)
        }

        const {personalAddress, privateAddress0} = constants.fields.email
        const identity = constants.fields.identities
        const identityWithDuckAddress = {
            ...identity,
            emailAddress: personalAddress
        }
        test('with an identity only - filling firstName', async ({page}) => {
            await forwardConsoleMessages(page)
            const signup = signupPage(page)

            await createWebkitMocks()
                .withAvailableInputTypes(createAvailableInputTypes())
                .withIdentity(identity)
                .applyTo(page)

            await applyScript(page)

            await signup.navigate()
            await signup.assertEmailHasNoDaxIcon()
            await signup.selectGeneratedPassword()
            await signup.selectFirstName(identity.firstName + ' Main identity')
            await signup.assertEmailValue(identity.emailAddress)
            await signup.assertPixelsFired([
                {pixelName: 'autofill_identity', params: {fieldType: 'firstName'}}
            ])
        })
        test('with an identity only - filling lastName', async ({page}) => {
            await forwardConsoleMessages(page)
            const signup = signupPage(page)

            await createWebkitMocks()
                .withAvailableInputTypes(createAvailableInputTypes())
                .withIdentity(identity)
                .applyTo(page)

            await applyScript(page)

            await signup.navigate()
            await signup.assertEmailHasNoDaxIcon()
            await signup.selectGeneratedPassword()
            await signup.selectLastName(identity.lastName + ' Main identity')
            await signup.assertEmailValue(identity.emailAddress)
            await signup.assertPixelsFired([
                {pixelName: 'autofill_identity', params: {fieldType: 'lastName'}}
            ])
        })
        test('with an identity + Email Protection, autofill using duck address in identity', async ({page}) => {
            await forwardConsoleMessages(page)
            const signup = signupPage(page)

            await createWebkitMocks()
                .withAvailableInputTypes(createAvailableInputTypes())
                .withPersonalEmail(stripDuckExtension(personalAddress))
                .withPrivateEmail(stripDuckExtension(privateAddress0))
                .withIdentity(identityWithDuckAddress)
                .applyTo(page)

            await applyScript(page)

            await signup.navigate()
            await signup.selectGeneratedPassword()
            await signup.selectFirstEmailField(identityWithDuckAddress.emailAddress)
            await signup.assertEmailValue(identityWithDuckAddress.emailAddress)
            await signup.assertPixelsFired([
                {pixelName: 'autofill_identity', params: {fieldType: 'emailAddress'}},
                {pixelName: 'autofill_personal_address'}
            ])
        })
        test('with an identity + Email Protection, autofill using duck address in identity triggered from name field', async ({page}) => {
            await forwardConsoleMessages(page)
            const signup = signupPage(page)

            await createWebkitMocks()
                .withAvailableInputTypes(createAvailableInputTypes())
                .withPersonalEmail(stripDuckExtension(personalAddress))
                .withPrivateEmail(stripDuckExtension(privateAddress0))
                .withIdentity(identityWithDuckAddress)
                .applyTo(page)

            await applyScript(page)

            await signup.navigate()
            await signup.selectGeneratedPassword()
            await signup.selectFirstName(identityWithDuckAddress.firstName)
            await signup.assertEmailValue(identityWithDuckAddress.emailAddress)
            await signup.assertPixelsFired([
                {pixelName: 'autofill_identity', params: {fieldType: 'firstName'}}
            ])
        })
        test('with no input types', async ({page}) => {
            await forwardConsoleMessages(page)
            const signup = signupPage(page)
            await createWebkitMocks().applyTo(page)
            await applyScript(page)
            await signup.navigate()

            // should still allow password generation
            await signup.selectGeneratedPassword()
        })
    })
    test('autofill a newly added email form (mutation observer test)', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        const {personalAddress, privateAddress0} = constants.fields.email

        await createWebkitMocks()
            .withAvailableInputTypes({email: true})
            .withPersonalEmail(stripDuckExtension(personalAddress))
            .withPrivateEmail(stripDuckExtension(privateAddress0))
            .withIdentity(constants.fields.identities)
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replaceAll(macosContentScopeReplacements())
            .platform('macos')
            .applyTo(page)

        const signup = signupPage(page)
        await signup.navigate()
        await signup.addNewForm()
        await signup.selectSecondEmailField(personalAddress)
        await signup.assertSecondEmailValue(personalAddress)
        await signup.assertFirstEmailEmpty()
        await signup.assertPixelsFired([
            {pixelName: 'autofill_identity', params: {fieldType: 'emailAddress'}},
            {pixelName: 'autofill_personal_address'}
        ])
    })
    test.describe('matching performance', () => {
        test.skip('matching performance v1', async ({page}) => {
            await forwardConsoleMessages(page)
            await createWebkitMocks().applyTo(page)
            await createAutofillScript()
                .replaceAll(macosContentScopeReplacements())
                .platform('macos')
                .applyTo(page)

            await page.goto('src/Form/test-cases/usps_signup.html')
            const r = await performanceEntries(page, 'scanner:init')
            for (let performanceEntry of r) {
                console.log(performanceEntry.duration)
            }
        })
    })
})
