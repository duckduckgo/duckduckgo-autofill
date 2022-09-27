import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer, withWindowsContext
} from '../helpers/harness.js'
import {test as base, expect} from '@playwright/test'
import {signupPage} from '../helpers/pages.js'
import {createWindowsMocks} from '../helpers/mocks.windows.js'

/**
 *  Tests for autofill scenarios on Windows
 */
const test = withWindowsContext(base)

test.describe('Windows secure messaging', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test.describe('When autofill script runs', () => {
        test('the window.chrome.webview variables have been removed', async ({page}) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page)

            const signup = signupPage(page, server)
            await signup.navigate()

            // this will add `window.chome.webview` to mimic what the Windows platform would do
            await createWindowsMocks().applyTo(page)

            // this part ensures that we actually have a `window.chrome.webview.postMessage` initially on page load.
            // We need to prevent the possible false positive in the next assertion - because if
            // we assert that the method is absent then it could pass if it was never present.
            let res = await page.evaluate(() => typeof window.chrome.webview.postMessage)
            expect(res).toBe('function')

            // now we add the script like Windows will, wrapped with access to a couple of vars
            await createAutofillScript()
                .platform('windows')
                .applyTo(page)

            let prev = await page.evaluate(() => typeof window.chrome.webview.postMessage)
            let current = await page.evaluate(() => typeof windowsInteropPostMessage)

            // both should be absent now
            expect(prev).toBe('undefined')
            expect(current).toBe('undefined')
        })
    })
})
