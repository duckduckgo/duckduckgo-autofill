import {constants} from '../helpers/mocks.js'
import {createWebkitMocks, macosContentScopeReplacements} from '../helpers/mocks.webkit.js'
import {createAutofillScript, forwardConsoleMessages, mockedCalls} from '../helpers/harness.js'
import {loginPage, loginPageWithFormInModal, loginPageWithText, overlayPage} from '../helpers/pages.js'
import {expect, test as base} from '@playwright/test'
import {createAvailableInputTypes} from '../helpers/utils.js'

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
 * @param {{overlay?: boolean, clickLabel?: boolean, pageType?: 'standard' | 'withExtraText' | 'withModal'}} opts
 */
async function testLoginPage (page, opts = {}) {
    const {overlay = false, clickLabel = false, pageType = 'standard'} = opts

    // enable in-terminal exceptions
    await forwardConsoleMessages(page)

    const {personalAddress, password} = await mocks(page)

    // Load the autofill.js script with replacements
    await createAutofillScript()
        .replaceAll(macosContentScopeReplacements({overlay}))
        .platform('macos')
        .applyTo(page)

    let login
    switch (pageType) {
    case 'withExtraText':
        login = loginPageWithText(page, {overlay, clickLabel})
        break
    case 'withModal':
        login = loginPageWithFormInModal(page, {overlay, clickLabel})
        break
    default:
        login = loginPage(page, {overlay, clickLabel})
        break
    }

    await login.navigate()
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

    const login = loginPageWithFormInModal(page)
    await login.navigate()
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
                const login = await testLoginPage(page, {overlay: true, pageType: 'withExtraText'})
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
        test('by clicking a label', async ({page}) => {
            await testLoginPage(page, {clickLabel: true, pageType: 'withExtraText'})
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
            test('I should be able to use my saved credentials by clicking', async ({page}) => {
                await forwardConsoleMessages(page)
                const {personalAddress, password} = await mocks(page)

                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements())
                    .platform('macos')
                    .applyTo(page)

                const login = loginPageWithText(page)
                await login.navigate()
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
        test('Filling the form should not close the modal', async ({page}) => {
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
            await login.clickIntoUsernameInput()
            await login.hitEscapeKey()
            await login.assertDialogOpen()
            await login.hitEscapeKey()
            await login.assertDialogClose()
        })
    })

    test.describe('When Bitwarden is the password provider', () => {
        test('When we have Bitwarden credentials', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)

            await createWebkitMocks()
                .withAvailableInputTypes(createAvailableInputTypes())
                .withCredentials({
                    id: '01',
                    username: personalAddress,
                    password,
                    credentialsProvider: 'bitwarden'
                })
                .applyTo(page)

            // Load the autofill.js script with replacements
            await createAutofillScript()
                .replaceAll(macosContentScopeReplacements({
                    featureToggles: {
                        third_party_credentials_provider: true
                    }
                }))
                .platform('macos')
                .applyTo(page)

            const login = loginPage(page)
            await login.navigate()
            await login.fieldsContainIcons()

            await login.assertTooltipNotOpen(personalAddress)

            await login.assertBitwardenTooltipWorking(personalAddress, password)
        })

        test.describe('When bitwarden is locked', async () => {
            test('in overlay', async ({page}) => {
                await forwardConsoleMessages(page)
                await createWebkitMocks()
                    .withAvailableInputTypes(createAvailableInputTypes({
                        credentialsProviderStatus: 'locked'
                    }))
                    .withCredentials({
                        id: 'provider_locked',
                        username: '',
                        password: '',
                        credentialsProvider: 'bitwarden'
                    })
                    .withAskToUnlockProvider?.()
                    .applyTo(page)

                // Pretend we're running in a top-frame scenario
                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements())
                    .replace('isTopFrame', true)
                    .replace('supportsTopFrame', true)
                    .platform('macos')
                    .applyTo(page)

                const overlay = overlayPage(page)
                await overlay.navigate()
                await overlay.clickButtonWithText('Bitwarden is locked')
                await overlay.doesNotCloseParentAfterCall('askToUnlockProvider')

                const autofillCalls = await mockedCalls(page, ['setSize'], true)
                expect(autofillCalls.length).toBeGreaterThanOrEqual(1)
            })

            test('when the native layer calls to unblock provider UI (on modern macOS versions)', async ({page}) => {
                // enable in-terminal exceptions
                await forwardConsoleMessages(page)

                await createWebkitMocks()
                    .withAvailableInputTypes(createAvailableInputTypes({
                        credentialsProviderStatus: 'locked'
                    }))
                    .withCredentials({
                        id: 'provider_locked',
                        username: '',
                        password: '',
                        credentialsProvider: 'bitwarden'
                    })
                    .applyTo(page)

                // Load the autofill.js script with replacements
                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements({
                        featureToggles: {
                            third_party_credentials_provider: true
                        }
                    }))
                    .replace('hasModernWebkitAPI', true)
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page)
                await login.navigate()
                await login.fieldsContainIcons()

                await login.assertTooltipNotOpen(personalAddress)

                // NOTE: I'm not creating separate test cases because these calls can happen multiple times
                // in the page lifecycle with different values, so this is a realistic use case

                // unlocked with no credentials available
                await page.evaluate(`
                    window.providerStatusUpdated({
                        status: 'unlocked',
                        credentials: [],
                        availableInputTypes: {credentials: {password: false, username: false}}
                    })
                `)

                await login.fieldsDoNotContainIcons()

                // unlocked with credentials available
                await page.evaluate(`
                    window.providerStatusUpdated({
                        status: 'unlocked',
                        credentials: [
                            {id: '3', password: '${password}', username: '${personalAddress}', credentialsProvider: 'bitwarden'}
                        ],
                        availableInputTypes: {credentials: {password: true, username: true}}
                    })
                `)

                await login.fieldsContainIcons()

                // unlocked with only a password field
                await page.evaluate(`
                    window.providerStatusUpdated({
                        status: 'unlocked',
                        credentials: [
                            {id: '3', password: '${password}', username: '', credentialsProvider: 'bitwarden'}
                        ],
                        availableInputTypes: {credentials: {password: true, username: false}}
                    })
                `)

                await login.onlyPasswordFieldHasIcon()
            })

            test('without overlay (Catalina)', async ({page}) => {
                // enable in-terminal exceptions
                await forwardConsoleMessages(page)

                await createWebkitMocks()
                    .withAvailableInputTypes(createAvailableInputTypes({
                        credentialsProviderStatus: 'locked'
                    }))
                    .withCredentials({
                        id: 'provider_locked',
                        username: '',
                        password: '',
                        credentialsProvider: 'bitwarden'
                    })
                    .withAskToUnlockProvider?.()
                    .applyTo(page)

                // Load the autofill.js script with replacements
                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements({
                        featureToggles: {
                            third_party_credentials_provider: true
                        }
                    }))
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page)
                await login.navigate()
                await login.fieldsContainIcons()

                await login.assertTooltipNotOpen(personalAddress)

                await login.assertBitwardenLockedWorking()
            })

            test('when the native layer calls to unblock provider UI (on Catalina)', async ({page}) => {
                // enable in-terminal exceptions
                await forwardConsoleMessages(page)

                await createWebkitMocks()
                    .withAvailableInputTypes(createAvailableInputTypes({
                        credentialsProviderStatus: 'locked'
                    }))
                    .withCredentials({
                        id: 'provider_locked',
                        username: '',
                        password: '',
                        credentialsProvider: 'bitwarden'
                    })
                    .withCheckCredentialsProviderStatus?.()
                    .applyTo(page)

                // Load the autofill.js script with replacements
                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements({
                        featureToggles: {
                            third_party_credentials_provider: true
                        }
                    }))
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page)
                await login.navigate()
                await login.fieldsContainIcons()

                await login.assertTooltipNotOpen(personalAddress)

                // The call is executed every 2s and we have encoded responses in mocks.webkit.js
                await page.waitForTimeout(2000)

                // unlocked with no credentials available
                await login.fieldsDoNotContainIcons()
                await page.waitForTimeout(2000)

                // unlocked with credentials available
                await login.fieldsContainIcons()
                await page.waitForTimeout(2000)

                // unlocked with only a password field
                await login.onlyPasswordFieldHasIcon()
                await page.waitForTimeout(2000)

                // back to being locked
                await login.fieldsContainIcons()
            })
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
                expectedLabel: 'Manage Logins…'
            },
            {
                description: 'with identities',
                identity: constants.fields.identity,
                expectedLabel: 'Manage Identities…'
            },
            {
                description: 'with identities and Email Protection',
                identity: constants.fields.identity,
                emailProtection: {personalAddress, privateAddress},
                expectedLabel: 'Manage Identities…'
            },
            {
                description: 'with Email Protection and no identities should not show',
                emailProtection: {personalAddress, privateAddress},
                expectedLabel: null
            },
            {
                description: 'with credit card',
                creditCard: constants.fields.creditCard,
                expectedLabel: 'Manage Credit Cards…'
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
