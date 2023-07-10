import {constants} from '../helpers/mocks.js'
import {createAutofillScript, forwardConsoleMessages} from '../helpers/harness.js'
import {loginPage, loginPageWithFormInModal, loginPageWithText} from '../helpers/pages.js'
import {androidStringReplacements, createAndroidMocks} from '../helpers/mocks.android.js'
import {test as base} from '@playwright/test'
import {testContext} from '../helpers/test-context.js'

/**
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').GetAutofillDataResponse} GetAutofillDataResponse
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles} AutofillFeatureToggles
 * @typedef {import('../../src/deviceApiCalls/__generated__/validators-ts').AvailableInputTypes} AvailableInputTypes
 */

/**
 *  Tests for email autofill on android tooltipHandler
 */
const test = testContext(base)

/**
 * @param {import("@playwright/test").Page} page
 * @param {object} opts
 * @param {Partial<AutofillFeatureToggles>} opts.featureToggles
 * @param {Partial<AvailableInputTypes>} [opts.availableInputTypes]
 * @param {CredentialsMock} [opts.credentials]
 * @param {'standard' | 'withExtraText' | 'withModal'} [opts.pageType]
 */
async function testLoginPage (page, opts) {
    // enable in-terminal exceptions
    await forwardConsoleMessages(page)

    let login
    switch (opts.pageType) {
    case 'withExtraText':
        login = loginPageWithText(page)
        break
    case 'withModal':
        login = loginPageWithFormInModal(page)
        break
    default:
        login = loginPage(page)
        break
    }
    await login.navigate()

    // android specific mocks
    const mocks = createAndroidMocks()

    if (opts.credentials) {
        mocks.withCredentials(opts.credentials)
    }

    await mocks.applyTo(page)

    // create + inject the script
    await createAutofillScript()
        .replaceAll(androidStringReplacements({
            featureToggles: opts.featureToggles,
            availableInputTypes: opts.availableInputTypes
        }))
        .platform('android')
        .applyTo(page)

    return {login}
}

test.describe('Feature: auto-filling a login form on Android', () => {
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
                await login.promptWasShown()
                await login.fieldsContainIcons()
                await login.assertFirstCredential(personalAddress, password)
            })
            test('I should be prompted to use my saved credentials when clicking the field even if the form was below the fold', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    credentials,
                    pageType: 'withExtraText'
                })
                await login.fieldsContainIcons()
                await login.clickIntoUsernameInput()
                await login.assertFirstCredential(personalAddress, password)
                await login.promptWasShown()
            })
            test('I should not be prompted automatically to use my saved credentials if the form is below the fold', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    credentials,
                    pageType: 'withExtraText'
                })
                await login.fieldsContainIcons()
                await login.promptWasNotShown()
                await login.clickIntoUsernameInput()
                await login.assertFirstCredential(personalAddress, password)
            })
            test('the form should be submitted after autofill', async ({page}) => {
                const {login} = await testLoginPage(page, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    credentials,
                    pageType: 'withModal'
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
                    pageType: 'withExtraText'
                })

                const {username, password} = credentials

                await login.onlyPasswordFieldHasIcon()

                await login.typeIntoUsernameInput(username)

                await login.clickIntoPasswordInput()
                await login.assertPasswordFilled(password)
                await login.assertFormNotSubmittedAutomatically()
                await login.assertWasPromptedToSave({username, password})
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
