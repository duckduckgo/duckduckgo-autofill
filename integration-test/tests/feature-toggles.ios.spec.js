import {
    createAutofillScript,
    forwardConsoleMessages,
    setupServer,
    withIOSContext
} from '../helpers/harness.js'
import { test as base } from '@playwright/test'
import {constants, createWebkitMocks} from '../helpers/mocks.js'
import {emailAutofillPage} from '../helpers/pages.js'

/**
 *  Tests for email autofill on ios device
 */
const test = withIOSContext(base)

test.describe('ios feature toggles', () => {
    let server
    test.beforeAll(async () => {
        server = setupServer()
    })
    test.afterAll(async () => {
        server.close()
    })
    test.only('should autofill the selected email', async ({page}) => {
        // enable in-terminal exceptions
        forwardConsoleMessages(page)

        await createWebkitMocks('ios')
            .withPersonalEmail('0')
            .withPrivateEmail('0')
            .applyTo(page)

        // Load the autofill.js script with replacements
        // on iOS it's the user-agent that's used as the platform check
        await createAutofillScript()
            .replaceAll({
                contentScope: {
                    features: {
                        "autofill": {
                            exceptions: [],
                            state: "enabled",
                        }
                    },
                    unprotectedTemporary: []
                },
                userUnprotectedDomains: [],
                userPreferences: {
                    debug: true,
                    platform: { name: "ios" },
                    features: {
                        autofill: {
                            settings: {
                                featureToggles: {

                                }
                            }
                        }
                    }
                }
            })
            .platform('ios')
            .applyTo(page)

        // page abstraction
        const emailPage = emailAutofillPage(page, server)
        await emailPage.navigate()

        await page.pause();
    })
})
