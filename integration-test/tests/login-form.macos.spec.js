import {constants} from '../helpers/mocks.js'
import {createWebkitMocks, macosContentScopeReplacements} from '../helpers/mocks.webkit.js'
import {createAutofillScript, forwardConsoleMessages, mockedCalls, setupServer} from '../helpers/harness.js'
import {loginPage, loginPageWithFormInModal, loginPageWithText, overlayPage} from '../helpers/pages.js'
import {expect, test as base} from '@playwright/test'

/**
 *  Tests for various auto-fill scenarios on macos
 */
const test = base.extend({})

const {personalAddress} = constants.fields.email
const password = '123456'

/**
 * @param {import("playwright-core").Page} page
 */
async function mocks (page) {
    await createWebkitMocks()
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
 * @param {import("playwright").Page} page
 * @param {ServerWrapper} server
 * @param {{overlay?: boolean, clickLabel?: boolean, pageType?: 'standard' | 'withExtraText' | 'withModal'}} opts
 */
async function testLoginPage (page, server, opts = {}) {
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
        login = loginPageWithText(page, server, {overlay, clickLabel})
        break
    case 'withModal':
        login = loginPageWithFormInModal(page, server, {overlay, clickLabel})
        break
    default:
        login = loginPage(page, server, {overlay, clickLabel})
        break
    }

    await login.navigate()
    await page.waitForTimeout(200)

    await login.selectFirstCredential(personalAddress)
    await login.assertFirstCredential(personalAddress, password)
    return login
}

/**
 * @param {import("playwright").Page} page
 * @param {ServerWrapper} server
 */
async function createLoginFormInModalPage (page, server) {
    await forwardConsoleMessages(page)
    await mocks(page)

    // Pretend we're running in a top-frame scenario
    await createAutofillScript()
        .replaceAll(macosContentScopeReplacements())
        .platform('macos')
        .applyTo(page)

    const login = loginPageWithFormInModal(page, server)
    await login.navigate()
    await login.assertDialogClose()
    await login.openDialog()
    await login.hitEscapeKey()
    await login.assertDialogClose()
    return login
}

test.describe('Auto-fill a login form on macOS', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test.describe('without getAvailableInputTypes API', () => {
        test('with in-page HTMLTooltip', async ({page}) => {
            await testLoginPage(page, server)
        })
        test.describe('with overlay', () => {
            test('with click and focus', async ({page}) => {
                const login = await testLoginPage(page, server, {overlay: true, pageType: 'withExtraText'})
                // this is not ideal as it's checking an implementation detail.
                // But it's done to ensure we're not getting a false positive
                // and definitely loading the overlay code paths
                await login.assertParentOpened()
                await login.assertClickAndFocusMessages()
            })
        })
        test('by clicking a label', async ({page}) => {
            await testLoginPage(page, server, {clickLabel: true, pageType: 'withExtraText'})
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

            const overlay = overlayPage(page, server)
            await overlay.navigate()
            await overlay.clickButtonWithText(personalAddress)
            await overlay.doesNotCloseParentAfterCall('pmHandlerGetAutofillCredentials')
        })
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

                const login = loginPageWithText(page, server)
                await login.navigate()
                await login.fieldsContainIcons()

                await login.assertTooltipNotOpen(personalAddress)

                await login.selectFirstCredential(personalAddress)
                await login.assertFirstCredential(personalAddress, password)
            })
            test('autofill should not submit the form automatically', async ({page}) => {
                const login = await createLoginFormInModalPage(page, server)
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

                const login = loginPage(page, server)
                await login.navigate()
                await login.clickIntoUsernameInput()
                await login.fieldsDoNotContainIcons()
            })
        })
    })

    test.describe('When the form is in a modal', () => {
        test('Filling the form should not close the modal', async ({page}) => {
            const login = await createLoginFormInModalPage(page, server)
            await login.openDialog()
            await login.fieldsContainIcons()
            await login.selectFirstCredential(personalAddress)
            await login.assertFirstCredential(personalAddress, password)
            await login.assertDialogOpen()
        })
        test('Escape key should only close the dialog if our tooltip is not showing', async ({page}) => {
            const login = await createLoginFormInModalPage(page, server)
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

            const login = loginPage(page, server)
            await login.navigate()
            await login.fieldsContainIcons()

            await login.assertTooltipNotOpen(personalAddress)

            await login.assertBitwardenTooltipWorking(personalAddress, password)
        })

        test.describe('When bitwarden is locked', async () => {
            test('in overlay', async ({page}) => {
                await forwardConsoleMessages(page)
                await createWebkitMocks()
                    .withCredentials({
                        id: 'provider_locked',
                        username: '',
                        password: '',
                        credentialsProvider: 'bitwarden'
                    })
                    .applyTo(page)

                // Pretend we're running in a top-frame scenario
                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements())
                    .replace('isTopFrame', true)
                    .replace('supportsTopFrame', true)
                    .platform('macos')
                    .applyTo(page)

                const overlay = overlayPage(page, server)
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

                const login = loginPage(page, server)
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
                        },
                        availableInputTypes: {
                            credentialsProviderStatus: 'locked'
                        }
                    }))
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page, server)
                await login.navigate()
                await login.fieldsContainIcons()

                await login.assertTooltipNotOpen(personalAddress)

                await login.assertBitwardenLockedWorking()
            })

            test('when the native layer calls to unblock provider UI (on Catalina)', async ({page}) => {
                // enable in-terminal exceptions
                await forwardConsoleMessages(page)

                await createWebkitMocks()
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
                        },
                        availableInputTypes: {
                            credentialsProviderStatus: 'locked'
                        }
                    }))
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page, server)
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
})
