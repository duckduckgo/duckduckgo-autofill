import {constants} from '../helpers/mocks.js'
import {createWebkitMocks, macosContentScopeReplacements} from '../helpers/mocks.webkit.js'
import {createAutofillScript, forwardConsoleMessages} from '../helpers/harness.js'
import {test as base} from '@playwright/test'
import {createAvailableInputTypes} from '../helpers/utils.js'
import {loginPage} from '../helpers/pages/loginPage.js'
import {overlayPage} from '../helpers/pages/overlayPage.js'
import {genericPage} from '../helpers/pages/genericPage.js'

/**
 *  Tests for various auto-fill scenarios on macos
 */
const test = base.extend({})

const {personalAddress, privateAddress0: privateAddress} = constants.fields.email
const password = '123456'

/**
 * @param {import("@playwright/test").Page} page
 */
async function mocks (page) {
    await createWebkitMocks()
        .withAvailableInputTypes(createAvailableInputTypes())
        .withCredentials({
            id: '01',
            username: personalAddress,
            password,
            credentialsProvider: 'duckduckgo'
        })
        .applyTo(page)
    return {personalAddress, password}
}

/**
 * @param {import("@playwright/test").Page} page
 * @param {{overlay?: boolean, clickLabel?: boolean, pageType?: keyof typeof constants.pages}} [opts]
 */
async function testLoginPage (page, opts = {}) {
    const {overlay = false, clickLabel = false, pageType = 'login'} = opts

    // enable in-terminal exceptions
    await forwardConsoleMessages(page)

    const {personalAddress, password} = await mocks(page)

    // Load the autofill.js script with replacements
    await createAutofillScript()
        .replaceAll(macosContentScopeReplacements({overlay}))
        .platform('macos')
        .applyTo(page)

    const login = loginPage(page, {overlay, clickLabel})
    await login.navigate(pageType)
    await page.waitForTimeout(200)

    await login.selectFirstCredential(personalAddress)
    await login.assertFirstCredential(personalAddress, password)
    return login
}

/**
 * @param {import("@playwright/test").Page} page
 */
async function createLoginFormInModalPage (page) {
    await forwardConsoleMessages(page)
    await mocks(page)

    // Pretend we're running in a top-frame scenario
    await createAutofillScript()
        .replaceAll(macosContentScopeReplacements())
        .platform('macos')
        .applyTo(page)

    const login = loginPage(page)
    await login.navigate('loginWithFormInModal')
    await login.assertDialogClose()
    await login.openDialog()
    await login.hitEscapeKey()
    await login.assertDialogClose()
    return login
}

test.describe('Auto-fill a login form on macOS', () => {
    test.describe('without getAvailableInputTypes API', () => {
        test('with in-page HTMLTooltip', async ({page}) => {
            await testLoginPage(page)
        })
        test.describe('with overlay', () => {
            test('with click', async ({page}) => {
                const login = await testLoginPage(page, { overlay: true, pageType: 'loginWithText' })
                // this is not ideal as it's checking an implementation detail.
                // But it's done to ensure we're not getting a false positive
                // and definitely loading the overlay code paths
                await login.assertParentOpened()
                await login.assertClickMessage()
            })
            test('with focus', async ({page}) => {
                // enable in-terminal exceptions
                await forwardConsoleMessages(page)

                await mocks(page)

                // Load the autofill.js script with replacements
                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements({overlay: true}))
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page, {overlay: true})

                await login.navigate()
                await page.waitForTimeout(200)

                const emailField = await page.locator('#email')
                await emailField.focus()
                await login.assertFocusMessage()
            })
            test('when focusing a field below the fold', async ({page}) => {
                // enable in-terminal exceptions
                await forwardConsoleMessages(page)

                await mocks(page)

                // Load the autofill.js script with replacements
                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements({overlay: true}))
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page, {overlay: true})

                await login.navigate()
                await page.waitForTimeout(200)

                const offScreenField = await page.locator('#password-3')
                await offScreenField.focus()

                await login.assertFocusMessage()
            })
        })
        test('by clicking a label @flaky', async ({page}) => {
            await testLoginPage(page, {clickLabel: true, pageType: 'loginWithText'})
        })
        test('selecting an item inside an overlay', async ({page}) => {
            await forwardConsoleMessages(page)
            const {personalAddress} = await mocks(page)

            // Pretend we're running in a top-frame scenario
            await createAutofillScript()
                .replaceAll(macosContentScopeReplacements({overlay: true}))
                .replace('isTopFrame', true)
                .platform('macos')
                .applyTo(page)

            const overlay = overlayPage(page)
            await overlay.navigate()
            await overlay.clickButtonWithText(personalAddress)
            await overlay.doesNotCloseParentAfterCall('pmHandlerGetAutofillCredentials')
        })
    })
    test.describe('Displays the correct button text', () => {
        /** @type {CredentialsMock} */
        const baseCredential = {
            id: '01',
            username: personalAddress,
            password,
            credentialsProvider: 'duckduckgo',
            origin: {
                url: 'example.com',
                partialMatch: false
            }
        }
        const testCases = [
            {
                description: 'when the origin is not provided',
                credentials: {...baseCredential, origin: undefined},
                expectedText: '•••••••••••••••'
            },
            {
                description: 'when credentials come from the same domain',
                credentials: {...baseCredential, origin: {url: 'example.com', partialMatch: false}},
                expectedText: 'example.com'
            },
            {
                description: 'when credentials come from a subdomain',
                credentials: {...baseCredential, origin: {url: 'sub.example.com', partialMatch: true}},
                expectedText: 'sub.example.com'
            },
            {
                description: 'when credentials come from a very long subdomain',
                credentials: {...baseCredential, origin: {url: 'looooooooooooooooooooooooooong.example.com', partialMatch: true}},
                expectedText: 'loooooooooooooo…ong.example.com'
            },
            {
                description: 'when there\'s no username and we clicked on a username field',
                credentials: {...baseCredential, username: ''},
                expectedText: 'Password for example.com',
                inputTypeTrigger: 'credentials.username',
                shouldRender: false
            },
            {
                description: 'when there\'s no username and we clicked on a password field',
                credentials: {...baseCredential, username: ''},
                expectedText: 'Password for example.com',
                inputTypeTrigger: 'credentials.password',
                shouldRender: true
            }
        ]

        for (const testCase of testCases) {
            const {description, credentials, expectedText, inputTypeTrigger = 'credentials.username', shouldRender = true} = testCase
            test(description, async ({page}) => {
                await forwardConsoleMessages(page)
                await createWebkitMocks()
                    .withAvailableInputTypes(createAvailableInputTypes())
                    .withCredentials(credentials, inputTypeTrigger)
                    .applyTo(page)

                // Pretend we're running in a top-frame scenario
                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements({overlay: true}))
                    .replace('isTopFrame', true)
                    .platform('macos')
                    .applyTo(page)

                const overlay = overlayPage(page)
                await overlay.navigate()
                if (shouldRender) {
                    await overlay.clickButtonWithText(expectedText)
                    await overlay.doesNotCloseParentAfterCall('pmHandlerGetAutofillCredentials')
                } else {
                    await overlay.assertTextNotPresent(expectedText)
                }
            })
        }
    })
    test.describe('When availableInputTypes API is available', () => {
        test.describe('and I have saved credentials', () => {
            test('I should be able to use my saved credentials by clicking @flaky', async ({page}) => {
                await forwardConsoleMessages(page)
                const {personalAddress, password} = await mocks(page)

                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements())
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page)
                await login.navigate('loginWithText')
                await login.fieldsContainIcons()

                await login.assertTooltipNotOpen(personalAddress)

                await login.selectFirstCredential(personalAddress)
                await login.assertFirstCredential(personalAddress, password)

                await login.assertNoPixelFired()
            })
            test('autofill should not submit the form automatically', async ({page}) => {
                const login = await createLoginFormInModalPage(page)
                await login.promptWasNotShown()
                await login.assertDialogClose()
                await login.openDialog()

                await genericPage(page).passwordFieldShowsFillKey()

                await login.selectFirstCredential(personalAddress)
                await login.assertFirstCredential(personalAddress, password)
                await login.assertFormNotSubmittedAutomatically()
            })
        })
        test.describe('but I dont have saved credentials', () => {
            test('I should not see the key icon', async ({page}) => {
                await forwardConsoleMessages(page)
                await createWebkitMocks()
                    .applyTo(page)

                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements({
                        availableInputTypes: {
                            credentials: {username: false, password: false}
                        }
                    }))
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page)
                await login.navigate()
                await login.clickIntoUsernameInput()
                await login.fieldsDoNotContainIcons()
            })
            test('I should not see Dax even if Email Protection is enabled', async ({page}) => {
                await forwardConsoleMessages(page)
                await createWebkitMocks()
                    .withAvailableInputTypes({
                        credentials: {username: false, password: false},
                        email: true
                    })
                    .withPersonalEmail(personalAddress)
                    .withPrivateEmail('random123@duck.com')
                    .applyTo(page)

                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements())
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page)
                await login.navigate()
                await login.clickIntoUsernameInput()
                await login.fieldsDoNotContainIcons()
            })
        })
    })

    test.describe('When the form is in a modal', () => {
        test('Filling the form should not close the modal @flaky', async ({page}) => {
            const login = await createLoginFormInModalPage(page)
            await login.openDialog()
            await login.fieldsContainIcons()
            await login.selectFirstCredential(personalAddress)
            await login.assertFirstCredential(personalAddress, password)
            await login.assertDialogOpen()
        })
        test('Escape key should only close the dialog if our tooltip is not showing', async ({page}) => {
            const login = await createLoginFormInModalPage(page)
            await login.openDialog()

            await genericPage(page).passwordFieldShowsFillKey()

            await login.clickIntoUsernameInput()
            await login.hitEscapeKey()
            await login.assertDialogOpen()
            await login.hitEscapeKey()
            await login.assertDialogClose()
        })
    })

    test.describe('The manage button', () => {
        const testCases = [
            {
                description: 'when Bitwarden is locked it should not show',
                credentials: {
                    id: 'provider_locked',
                    username: '',
                    password,
                    credentialsProvider: 'bitwarden'
                },
                expectedLabel: null
            },
            {
                description: 'with credentials',
                credentials: {
                    id: '1',
                    username: personalAddress,
                    password
                },
                expectedLabel: 'Manage passwords…'
            },
            {
                description: 'with identities',
                identity: constants.fields.identity,
                expectedLabel: 'Manage identities…'
            },
            {
                description: 'with identities and Email Protection',
                identity: constants.fields.identity,
                emailProtection: {personalAddress, privateAddress},
                expectedLabel: 'Manage identities…'
            },
            {
                description: 'with Email Protection and no identities should not show',
                emailProtection: {personalAddress, privateAddress},
                expectedLabel: null
            },
            {
                description: 'with credit card',
                creditCard: constants.fields.creditCard,
                expectedLabel: 'Manage credit cards…'
            }
        ]

        for (const testCase of testCases) {
            const {description, credentials, identity, creditCard, expectedLabel} = testCase
            test(description, async ({page}) => {
                await forwardConsoleMessages(page)
                await createWebkitMocks()
                    .withAvailableInputTypes(createAvailableInputTypes())
                    .withDataType({credentials, identity, creditCard})
                    .applyTo(page)

                // Pretend we're running in a top-frame scenario
                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements({overlay: true}))
                    .replace('isTopFrame', true)
                    .platform('macos')
                    .applyTo(page)

                const overlay = overlayPage(page)
                await overlay.navigate()
                if (expectedLabel) {
                    await overlay.clickButtonWithText(expectedLabel)
                    await overlay.assertCloseAutofillParent()
                } else {
                    await overlay.assertTextNotPresent('Manage')
                }
            })
        }
    })
})
