import {constants} from '../helpers/mocks.js'
import {
    forwardConsoleMessages,
    withIOSFeatureToggles
} from '../helpers/harness.js'
import {
    loginPage
} from '../helpers/pages.js'
import {test as base} from '@playwright/test'
import {createWebkitMocks} from '../helpers/mocks.webkit.js'
import {createAvailableInputTypes} from '../helpers/utils.js'
import {testContext} from '../helpers/test-context.js'

/**
 *  Tests for email autofill on android tooltipHandler
 */
const test = testContext(base)

/**
 * @param {import("@playwright/test").Page} page
 * @param {object} opts
 * @param {Partial<import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles>} opts.featureToggles
 * @param {Partial<import('../../src/deviceApiCalls/__generated__/validators-ts').AvailableInputTypes>} [opts.availableInputTypes]
 * @param {CredentialsMock} [opts.credentials]
 * @param {keyof typeof constants.pages} [opts.pageType]
 */
async function testLoginPage (page, opts) {
    // enable in-terminal exceptions
    await forwardConsoleMessages(page)

    // android specific mocks
    const mocks = createWebkitMocks()
        .withAvailableInputTypes(opts.availableInputTypes || createAvailableInputTypes())

    if (opts.credentials) {
        mocks.withCredentials(opts.credentials)
    }

    await mocks.applyTo(page)

    await withIOSFeatureToggles(page, opts.featureToggles)

    const login = loginPage(page)
    await login.navigate(opts.pageType)

    return {login}
}

test.describe('Auto-fill a login form on iOS', () => {
    const {personalAddress} = constants.fields.email
    const password = '123456'
    const credentials = {
        id: '01',
        username: personalAddress,
        password
    }
    test.describe('when `inputType_credentials` is true', () => {
        test.describe('and I have saved credentials', () => {
            test('I should be prompted to use my saved credentials with autoprompt', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    credentials
                })
                await login.promptWasShown('ios')
                await login.assertFirstCredential(personalAddress, password)
                await login.fieldsContainIcons()
            })
            test('I should not be prompted automatically to use my saved credentials if the form is below the fold', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    credentials,
                    pageType: 'loginWithText'
                })
                await login.promptWasNotShown()
                await login.fieldsContainIcons()

                await login.clickIntoUsernameInput()
                await login.assertFirstCredential(personalAddress, password)
            })
            test('I should not be prompted automatically to use my saved credentials if the form is covered by something else', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    credentials,
                    pageType: 'loginCovered'
                })
                await login.fieldsContainIcons()
                await login.promptWasNotShown()
                await login.closeCookieDialog()

                await login.clickIntoUsernameInput()
                await login.assertFormSubmitted()
            })
            test('should work fine with multistep forms', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    credentials,
                    pageType: 'loginMultistep'
                })
                await login.promptWasShown('ios')
                await login.assertUsernameFilled(personalAddress)
                await login.assertPasswordEmpty()
                await login.clickIntoPasswordInput()
                await login.assertPasswordFilled(password)
                await login.assertFormSubmitted()
            })
            test('the form should be submitted after autofill', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    credentials,
                    pageType: 'loginWithFormInModal'
                })
                await login.promptWasNotShown()
                await login.assertDialogClose()
                await login.openDialog()
                await login.fieldsContainIcons()

                await login.clickIntoUsernameInput()
                await login.assertFormSubmitted()
            })
            test('should prompt to store and not autosubmit when the form completes a partial credential stored', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true,
                        inlineIcon_credentials: true,
                        credentials_saving: true
                    },
                    availableInputTypes: {credentials: {password: true, username: false}},
                    credentials: {
                        ...credentials,
                        username: ''
                    },
                    pageType: 'loginWithText'
                })

                const {username, password} = credentials

                await login.onlyPasswordFieldHasIcon()

                await login.typeIntoUsernameInput(username)

                await login.clickIntoPasswordInput()
                await login.assertPasswordFilled(password)
                await login.assertFormNotSubmittedAutomatically()
                await login.assertWasPromptedToSave({username, password}, 'ios')
            })
        })
        test.describe('but I dont have saved credentials', () => {
            test('I should not be prompted', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    availableInputTypes: {}
                })
                await login.promptWasNotShown()
            })
        })

        test.describe('check tooltip opening logic', () => {
            test('tapping into an autofilled field does not prompt', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    credentials
                })
                await login.promptWasShown('ios')

                await login.clickIntoPasswordInput()
                await login.assertMockCallOccurredTimes('getAutofillData', 1)
            })
        })
    })
    test.describe('when `inputType_credentials` is false', () => {
        test('I should not be prompted at all', async ({page}) => {
            const {login} = await testLoginPage(page, {
                featureToggles: {
                    inputType_credentials: false
                },
                availableInputTypes: {
                    credentials: {username: true, password: true}
                },
                credentials
            })
            await login.promptWasNotShown()
        })
    })
})
