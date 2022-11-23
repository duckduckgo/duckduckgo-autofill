import {constants} from '../helpers/mocks.js'
import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer,
    withWindowsContext
} from '../helpers/harness.js'
import {loginPage, overlayPage} from '../helpers/pages.js'
import {test as base} from '@playwright/test'
import {createWindowsMocks} from '../helpers/mocks.windows.js'
import {createAvailableInputTypes} from '../helpers/utils.js'

const test = withWindowsContext(base)

test.describe('Auto-fill a login form on windows', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test.describe('when `inputType_credentials` is true', () => {
        test.describe('and I have saved credentials', () => {
            test('I should be prompted to use my saved credentials', async ({page}) => {
                await forwardConsoleMessages(page)
                const {personalAddress} = constants.fields.email
                const password = '123456'

                const login = loginPage(page, server, {overlay: true})
                await login.navigate()

                await createWindowsMocks()
                    .withAvailableInputTypes(createAvailableInputTypes())
                    .withCredentials({
                        id: '01',
                        username: personalAddress,
                        password
                    })
                    .withFeatureToggles({
                        inputType_credentials: true
                    })
                    .applyTo(page)

                // Pretend we're running in a top-frame scenario
                await createAutofillScript()
                    .platform('windows')
                    .applyTo(page)
                await page.pause()

                await login.selectFirstCredential(personalAddress)
                await login.assertFirstCredential(personalAddress, password)
            })
        })
        test.describe('but I dont have saved credentials', () => {
            test('I should not be prompted', async ({page}) => {
                await forwardConsoleMessages(page)
                const login = loginPage(page, server)
                await login.navigate()

                await createWindowsMocks()
                    .withAvailableInputTypes({credentials: {username: false, password: false}})
                    .applyTo(page)

                await createAutofillScript()
                    .platform('windows')
                    .applyTo(page)

                await login.clickIntoUsernameInput()
                await login.fieldsDoNotContainIcons()
            })
        })
        test.describe('when `inputType_credentials` is false', () => {
            test('I should not be prompted at all', async ({page}) => {
                await forwardConsoleMessages(page)
                const login = loginPage(page, server)
                await login.navigate()

                await createWindowsMocks()
                    .withFeatureToggles({inputType_credentials: false})
                    .applyTo(page)

                await createAutofillScript()
                    .platform('windows')
                    .applyTo(page)

                await login.clickIntoUsernameInput()
                await login.fieldsDoNotContainIcons()
            })
        })
    })
    test.describe('when executing in the top frame', () => {
        test('I can select an item', async ({page}) => {
            await forwardConsoleMessages(page)

            const {personalAddress} = constants.fields.email
            const password = '123456'

            const overlay = overlayPage(page, server)
            await overlay.navigate()

            await createWindowsMocks()
                .withCredentials({
                    id: '01',
                    username: personalAddress,
                    password
                })
                .applyTo(page)

            // Pretend we're running in a top-frame scenario
            await createAutofillScript()
                .replace('isTopFrame', true)
                .platform('windows')
                .applyTo(page)

            await overlay.clickButtonWithText(personalAddress)
            await overlay.assertSelectedDetail()
        })
    })
})
