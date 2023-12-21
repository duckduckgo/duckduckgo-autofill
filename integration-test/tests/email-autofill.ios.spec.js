import {
    createAutofillScript,
    forwardConsoleMessages
} from '../helpers/harness.js'
import { test as base } from '@playwright/test'
import {constants} from '../helpers/mocks.js'
import {createWebkitMocks, iosContentScopeReplacements} from '../helpers/mocks.webkit.js'
import {testContext} from '../helpers/test-context.js'
import {emailAutofillPage} from '../helpers/pages/emailAutofillPage.js'

/**
 *  Tests for email autofill on ios tooltipHandler
 */
const test = testContext(base)

test.describe('ios', () => {
    test('should autofill the selected email when email protection is enabled', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        await createWebkitMocks('ios')
            .withAvailableInputTypes({email: true})
            .withPersonalEmail('0')
            .withPrivateEmail('0')
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replaceAll(iosContentScopeReplacements({
                featureToggles: {emailProtection: true}
            }))
            .platform('ios')
            .applyTo(page)

        const {privateAddress0} = constants.fields.email

        // page abstraction
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate()

        // Click in the input, a native window will appear
        // and the mocks above will ensure the message is responded to -
        // - this simulates the user tapping an option in the native window
        await emailPage.clickIntoInput()

        // Because of the mock above, assume an email was selected and ensure it's auto-filled
        await emailPage.assertEmailValue(privateAddress0)
    })

    test('should not autofill email when email protection is disabled', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)

        await createWebkitMocks('ios')
            .applyTo(page)

        // Load the autofill.js script with replacements
        await createAutofillScript()
            .replaceAll(iosContentScopeReplacements({
                featureToggles: {emailProtection: false, inputType_identities: false},
                availableInputTypes: {email: false, identities: {emailAddress: false}}
            }))
            .platform('ios')
            .applyTo(page)

        // page abstraction
        const emailPage = emailAutofillPage(page)
        await emailPage.navigate()

        await emailPage.clickIntoInput()

        // Since email autofill is disabled we expect an empty field
        await emailPage.assertEmailValue('')
    })
})
