import { constants } from '../helpers/mocks.js';
import { createAutofillScript, forwardConsoleMessages, mockedCalls } from '../helpers/harness.js';
import { createWebkitMocks, macosContentScopeReplacements } from '../helpers/mocks.webkit.js';
import { createAvailableInputTypes } from '../helpers/utils.js';
import { expect, test as base } from '@playwright/test';
import { loginPage } from '../helpers/pages/loginPage.js';
import { overlayPage } from '../helpers/pages/overlayPage.js';

/**
 *  Tests for various Bitwarden scenarios on macos
 */
const test = base.extend({});

const { personalAddress } = constants.fields.email;
const password = '123456';

test.describe('When Bitwarden is the password provider', () => {
    test('When we have Bitwarden credentials', async ({ page }) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page);

        await createWebkitMocks()
            .withFeatureToggles({
                third_party_credentials_provider: true,
            })
            .withAvailableInputTypes(createAvailableInputTypes())
            .withCredentials({
                id: '01',
                username: personalAddress,
                password,
                credentialsProvider: 'bitwarden',
            })
            .applyTo(page);

        // Load the autofill.js script with replacements
        await createAutofillScript().replaceAll(macosContentScopeReplacements()).platform('macos').applyTo(page);

        const login = loginPage(page);
        await login.navigate();
        await login.fieldsContainIcons();

        await login.assertTooltipNotOpen(personalAddress);

        await login.assertBitwardenTooltipWorking(personalAddress, password);
    });

    test.describe('When bitwarden is locked', async () => {
        test('in overlay', async ({ page }) => {
            await forwardConsoleMessages(page);
            await createWebkitMocks()
                .withFeatureToggles({
                    third_party_credentials_provider: true,
                })
                .withAvailableInputTypes(
                    createAvailableInputTypes({
                        credentialsProviderStatus: 'locked',
                    }),
                )
                .withCredentials({
                    id: 'provider_locked',
                    username: '',
                    password: '',
                    credentialsProvider: 'bitwarden',
                })
                .withAskToUnlockProvider?.()
                .applyTo(page);

            // Pretend we're running in a top-frame scenario
            await createAutofillScript()
                .replaceAll(macosContentScopeReplacements())
                .replace('isTopFrame', true)
                .replace('supportsTopFrame', true)
                .platform('macos')
                .applyTo(page);

            const overlay = overlayPage(page);
            await overlay.navigate();
            await overlay.clickButtonWithText('Bitwarden is locked');
            await overlay.doesNotCloseParentAfterCall('askToUnlockProvider');

            const autofillCalls = await mockedCalls(page, { names: ['setSize'], minCount: 1 });
            expect(autofillCalls.length).toBeGreaterThanOrEqual(1);
        });

        test('when the native layer calls to unblock provider UI (on modern macOS versions)', async ({ page }) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page);

            await createWebkitMocks()
                .withFeatureToggles({
                    third_party_credentials_provider: true,
                })
                .withAvailableInputTypes(
                    createAvailableInputTypes({
                        credentialsProviderStatus: 'locked',
                    }),
                )
                .withCredentials({
                    id: 'provider_locked',
                    username: '',
                    password: '',
                    credentialsProvider: 'bitwarden',
                })
                .applyTo(page);

            // Load the autofill.js script with replacements
            // prettier-ignore
            await createAutofillScript()
                .replaceAll(macosContentScopeReplacements())
                .platform('macos')
                .applyTo(page);

            const login = loginPage(page);
            await login.navigate();
            await login.fieldsContainIcons();

            await login.assertTooltipNotOpen(personalAddress);

            // NOTE: I'm not creating separate test cases because these calls can happen multiple times
            // in the page lifecycle with different values, so this is a realistic use case

            // unlocked with no credentials available
            await page.evaluate(`
                    window.providerStatusUpdated({
                        status: 'unlocked',
                        credentials: [],
                        availableInputTypes: {credentials: {password: false, username: false}}
                    })
                `);

            await login.fieldsDoNotContainIcons();

            // unlocked with credentials available
            await page.evaluate(`
                    window.providerStatusUpdated({
                        status: 'unlocked',
                        credentials: [
                            {id: '3', password: '${password}', username: '${personalAddress}', credentialsProvider: 'bitwarden'}
                        ],
                        availableInputTypes: {credentials: {password: true, username: true}}
                    })
                `);

            await login.fieldsContainIcons();

            // unlocked with only a password field
            await page.evaluate(`
                    window.providerStatusUpdated({
                        status: 'unlocked',
                        credentials: [
                            {id: '3', password: '${password}', username: '', credentialsProvider: 'bitwarden'}
                        ],
                        availableInputTypes: {credentials: {password: true, username: false}}
                    })
                `);

            await login.onlyPasswordFieldHasIcon();
        });

        test('without overlay (Catalina)', async ({ page }) => {
            // enable in-terminal exceptions
            await forwardConsoleMessages(page);

            await createWebkitMocks()
                .withAvailableInputTypes(
                    createAvailableInputTypes({
                        credentialsProviderStatus: 'locked',
                    }),
                )
                .withCredentials({
                    id: 'provider_locked',
                    username: '',
                    password: '',
                    credentialsProvider: 'bitwarden',
                })
                .withAskToUnlockProvider?.()
                .applyTo(page);

            // Load the autofill.js script with replacements
            await createAutofillScript()
                .replaceAll(
                    macosContentScopeReplacements({
                        featureToggles: {
                            third_party_credentials_provider: true,
                        },
                    }),
                )
                .platform('macos')
                .applyTo(page);

            const login = loginPage(page);
            await login.navigate();
            await login.fieldsContainIcons();

            await login.assertTooltipNotOpen(personalAddress);

            await login.assertBitwardenLockedWorking();
        });
    });
});
