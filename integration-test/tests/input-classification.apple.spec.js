import {setupServer, withMockedWebkit, withStringReplacements} from '../helpers/harness.js'
import { test as base } from '@playwright/test'

/**
 *  Tests for initial scan in webkit
 */
const test = base

test.describe('scanning', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test('should decorate the email field when signed in', async ({page, browserName}) => {
        test.skip(browserName !== 'webkit')

        // Mock the native calls with just enough data to get the script running
        await withMockedWebkit(page, {
            pmHandlerGetAutofillInitData: {
                'success': {
                    'identities': [],
                    'credentials': [],
                    'creditCards': []
                }
            },
            emailHandlerCheckAppSignedInStatus: {'isAppSignedIn': 'true'},
            emailHandlerGetAddresses: {
                'addresses': {
                    personalAddress: 'shane',
                    privateAddress: '123456'
                }
            },
            closeAutofillParent: {},
            getSelectedCredentials: {type: 'none'}
        })

        // Load the autofill.js script with replacements
        await withStringReplacements(page, {
            isApp: true,
            supportsTopFrame: false,
            hasModernWebkitAPI: true
        })

        const selector = '[data-ddg-inputtype="identities.emailAddress"]'
        await page.goto(server.urlForPath('email-autofill.html'))

        // if we get this far, then we know the interface has initialized, and an initial scan was complete ✅
        await page.waitForSelector(selector)
    })
})
