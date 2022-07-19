import {constants} from '../helpers/mocks.js'
import {createWebkitMocks, macosContentScopeReplacements} from '../helpers/mocks.webkit.js'
import {createAutofillScript, forwardConsoleMessages, setupServer} from '../helpers/harness.js'
import {loginPage, loginPageWithFormInModal, overlayPage} from '../helpers/pages.js'
import {test as base} from '@playwright/test'

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
            password
        })
        .applyTo(page)
    return {personalAddress, password}
}

/**
 * @param {import("playwright").Page} page
 * @param {ServerWrapper} server
 * @param {{overlay?: boolean, clickLabel?: boolean}} opts
 */
async function testLoginPage (page, server, opts = {}) {
    const {overlay = false, clickLabel = false} = opts

    // enable in-terminal exceptions
    await forwardConsoleMessages(page)

    const {personalAddress, password} = await mocks(page)

    // Load the autofill.js script with replacements
    await createAutofillScript()
        .replaceAll(macosContentScopeReplacements({overlay}))
        .platform('macos')
        .applyTo(page)

    const login = loginPage(page, server, {overlay, clickLabel})
    await login.navigate()
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
    const {personalAddress} = constants.fields.email
    const password = '123456'

    await createWebkitMocks()
        .withCredentials({
            id: '01',
            username: personalAddress,
            password
        })
        .withAvailableInputTypes({ credentials: true })
        .applyTo(page)

    // Pretend we're running in a top-frame scenario
    await createAutofillScript()
        .replaceAll(macosContentScopeReplacements())
        .platform('macos')
        .applyTo(page)

    const login = loginPageWithFormInModal(page, server)
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
        test('with overlay', async ({page}) => {
            const login = await testLoginPage(page, server, {overlay: true})
            // this is not ideal as it's checking an implementation detail.
            // But it's done to ensure we're not getting a false positive
            // and definitely loading the overlay code paths
            await login.assertParentOpened()
        })
        test('by clicking a label', async ({page}) => {
            await testLoginPage(page, server, {clickLabel: true})
        })
        test('selecting an item in overlay', async ({page}) => {
            await forwardConsoleMessages(page)
            const {personalAddress} = await mocks(page)

            // Pretend we're running in a top-frame scenario
            await createAutofillScript()
                .replaceAll(macosContentScopeReplacements())
                .replace('isTopFrame', true)
                .replace('supportsTopFrame', true)
                .platform('macos')
                .applyTo(page)

            const overlay = overlayPage(page, server)
            await overlay.navigate()
            await overlay.selectFirstCredential(personalAddress)
            await overlay.doesNotCloseParent()
        })
    })
    test.describe('When availableInputTypes API is available', () => {
        test.describe('and I have saved credentials', () => {
            test('I should be able to use my saved credentials', async ({page}) => {
                await forwardConsoleMessages(page)
                const {personalAddress} = constants.fields.email
                const password = '123456'

                await createWebkitMocks()
                    .withCredentials({
                        id: '01',
                        username: personalAddress,
                        password
                    })
                    .withAvailableInputTypes({ credentials: true })
                    .applyTo(page)

                // Pretend we're running in a top-frame scenario
                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements())
                    .platform('macos')
                    .applyTo(page)

                const login = loginPage(page, server)
                await login.navigate()
                await login.fieldsContainIcons()
                await login.selectFirstCredential(personalAddress)
                await login.assertFirstCredential(personalAddress, password)
            })
        })
        test.describe('but I dont have saved credentials', () => {
            test('I should not see the key icon', async ({page}) => {
                await forwardConsoleMessages(page)
                await createWebkitMocks()
                    .withAvailableInputTypes({ credentials: false })
                    .applyTo(page)

                await createAutofillScript()
                    .replaceAll(macosContentScopeReplacements())
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
            await login.navigate()
            await login.assertDialogClose()
            await login.openDialog()
            await login.clickOutsideTheDialog()
            await login.assertDialogClose()
            await login.openDialog()
            await login.fieldsContainIcons()
            await login.selectFirstCredential(personalAddress)
            await login.assertFirstCredential(personalAddress, password)
            await login.assertDialogOpen()
        })
        test('Escape key should only close the dialog if our tooltip is not showing', async ({page}) => {
            const login = await createLoginFormInModalPage(page, server)
            await login.navigate()
            await page.pause()
            await login.assertDialogClose()
            await login.openDialog()
            await login.hitEscapeKey()
            await login.assertDialogClose()
            await login.openDialog()
            await login.clickIntoUsernameInput()
            await login.hitEscapeKey()
            await login.assertDialogOpen()
            await login.hitEscapeKey()
            await login.assertDialogClose()
        })
    })
})
