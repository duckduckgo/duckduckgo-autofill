import {
    createAutofillScript,
    forwardConsoleMessages,
    withAndroidContext
} from '../helpers/harness.js'
import {test as base} from '@playwright/test'
import {constants} from '../helpers/mocks.js'
import {emailAutofillPage, signupPage} from '../helpers/pages.js'
import {androidStringReplacements, createAndroidMocks} from '../helpers/mocks.android.js'

/**
 *  Tests for email autofill on android tooltipHandler
 */
const test = withAndroidContext(base)

test.describe('android', () => {
    test.describe('when signed in', () => {
        test('should autofill the selected email', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)
            const emailPage = emailAutofillPage(page)
            await emailPage.navigate()

            // android specific mocks, withPersonalEmail will ensure the signed-in check works
            const {personalAddress} = constants.fields.email
            await createAndroidMocks()
                .withPersonalEmail(personalAddress)
                .withPrivateEmail(personalAddress)
                .applyTo(page)

            // create + inject the script
            await createAutofillScript()
                .replaceAll(androidStringReplacements())
                .platform('android')
                .applyTo(page)

            // if this works, the tooltipHandler must have loaded and added the field decorations
            await emailPage.clickIntoInput()

            // Because of the mock above, assume an email was selected and ensure it's autofilled
            await emailPage.assertEmailValue(personalAddress)
        })
    })
    test.describe('when availableInputTypes are available', () => {
        test('should use availableInputTypes.email', async ({page}) => {
            await forwardConsoleMessages(page)
            const emailPage = emailAutofillPage(page)
            await emailPage.navigate()
            const {personalAddress} = constants.fields.email
            await createAndroidMocks()
                .withPersonalEmail(personalAddress)
                .withPrivateEmail(personalAddress)
                .applyTo(page)

            // create + inject the script
            await createAutofillScript()
                .replaceAll(androidStringReplacements({
                    availableInputTypes: {
                        email: true
                    }
                }))
                .platform('android')
                .applyTo(page)

            await emailPage.clickIntoInput()
            await emailPage.assertEmailValue(personalAddress)
        })
    })
    test.describe('when not signed in', () => {
        test('should not decorate with Dax icon', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)

            // page abstraction
            const signup = signupPage(page)
            await signup.navigate()

            // android specific mocks
            await createAndroidMocks()
                .applyTo(page)

            // create + inject the script
            await createAutofillScript()
                .replaceAll(androidStringReplacements({
                    availableInputTypes: {
                        email: false
                    }
                }))
                .platform('android')
                .applyTo(page)

            await signup.assertEmailHasNoDaxIcon()
        })
    })
    test.describe('password generation', () => {
        const script = createAutofillScript()
            .replaceAll(androidStringReplacements({
                availableInputTypes: {},
                featureToggles: {
                    password_generation: true,
                    inputType_credentials: true,
                    inlineIcon_credentials: true,
                    credentials_saving: true
                }
            }))
            .platform('android')

        test('should autofill with generated password', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)
            const signup = signupPage(page)
            await signup.navigate()

            // android specific mocks
            await createAndroidMocks()
                .withPasswordDecision?.('accept')
                .applyTo(page)

            // create + inject the script
            await script.applyTo(page)

            await signup.clickIntoPasswordField()
            await signup.assertPasswordWasAutofilled()
        })

        test('should not autofill when password rejected', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)
            const signup = signupPage(page)
            await signup.navigate()

            // android specific mocks
            await createAndroidMocks()
                .withPasswordDecision?.('reject')
                .applyTo(page)

            // create + inject the script
            await script.applyTo(page)

            await signup.clickIntoPasswordField()
            await signup.assertPasswordWasNotAutofilled()

            // should not prompt again on second password field (which will be untouched)
            await signup.clickIntoPasswordConfirmationField()
            await signup.assertPasswordWasSuggestedTimes(1, 'android')

            // SHOULD prompt again if icon clicked though, since that's explicit opt-in
            await signup.clickDirectlyOnPasswordIcon()
            await signup.assertPasswordWasSuggestedTimes(2, 'android')
        })
    })
})
