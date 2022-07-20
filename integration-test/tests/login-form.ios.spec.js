import {constants} from '../helpers/mocks.js'
import {
    forwardConsoleMessages,
    setupServer,
    withIOSContext, withIOSFeatureToggles
} from '../helpers/harness.js'
import {loginPage, loginPageWithFormInModal, loginPageWithText} from '../helpers/pages.js'
import {test as base} from '@playwright/test'
import {createWebkitMocks} from '../helpers/mocks.webkit.js'

/**
 *  Tests for email autofill on android tooltipHandler
 */
const test = withIOSContext(base)

/**
 * @param {import('playwright').Page} page
 * @param {ServerWrapper} server
 * @param {object} opts
 * @param {Partial<import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles>} opts.featureToggles
 * @param {Partial<import('../../src/deviceApiCalls/__generated__/validators-ts').AvailableInputTypes>} opts.availableInputTypes
 * @param {CredentialsMock} [opts.credentials]
 * @param {'standard' | 'withExtraText' | 'withModal'} [opts.pageType]
 */
async function testLoginPage (page, server, opts) {
    // enable in-terminal exceptions
    await forwardConsoleMessages(page)

    // android specific mocks
    const mocks = createWebkitMocks()
        .withAvailableInputTypes(opts.availableInputTypes)

    if (opts.credentials) {
        mocks.withCredentials(opts.credentials)
    }

    await mocks.applyTo(page)

    await withIOSFeatureToggles(page, opts.featureToggles)

    let login
    switch (opts.pageType) {
    case 'withExtraText':
        login = loginPageWithText(page, server)
        break
    case 'withModal':
        login = loginPageWithFormInModal(page, server)
        break
    default:
        login = loginPage(page, server)
        break
    }

    await login.navigate()
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
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test.describe('when `inputType_credentials` is true', () => {
        test.describe('and I have saved credentials', () => {
            test('I should be prompted to use my saved credentials with autoprompt', async ({page}) => {
                const {login} = await testLoginPage(page, server, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    availableInputTypes: {
                        credentials: true
                    },
                    credentials
                })
                await login.promptWasShown('ios')
                await login.assertFirstCredential(personalAddress, password)
                await login.fieldsDoNotContainIcons()
            })
            test('I should not be prompted automatically to use my saved credentials if the form is below the fold', async ({page}) => {
                const {login} = await testLoginPage(page, server, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    availableInputTypes: {
                        credentials: true
                    },
                    credentials,
                    pageType: 'withExtraText'
                })
                await login.promptWasNotShown()
                await login.fieldsDoNotContainIcons()

                await login.clickIntoUsernameInput()
                await login.assertFirstCredential(personalAddress, password)
            })
        })
        test.describe('but I dont have saved credentials', () => {
            test('I should not be prompted', async ({page}) => {
                const {login} = await testLoginPage(page, server, {
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
                const {login} = await testLoginPage(page, server, {
                    featureToggles: {
                        inputType_credentials: true
                    },
                    availableInputTypes: {
                        credentials: true
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
            const {login} = await testLoginPage(page, server, {
                featureToggles: {
                    inputType_credentials: false
                },
                availableInputTypes: {
                    credentials: true
                },
                credentials
            })
            await login.promptWasNotShown()
        })
    })
})
