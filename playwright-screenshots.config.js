// @ts-check
const { devices, defineConfig } = require('@playwright/test');

const SERVER_PORT = 3210;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
    testDir: './integration-test/screenshots',
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000,
        toHaveScreenshot: {
            maxDiffPixels: 50,
        },
    },
    snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 2 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ? 'github' : [['html', { open: 'never' }]],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 5000,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: `http://localhost:${SERVER_PORT}`,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },
    /* let Playwright start/stop the server for us */
    webServer: {
        port: SERVER_PORT,
        reuseExistingServer: true,
        command: 'npm run build && npm run serve',
        ignoreHTTPSErrors: true,
    },

    /* Configure projects for each platform */
    projects: [
        {
            name: 'ios',
            use: {
                ...devices['iPhone 14'],
                platform: 'ios',
            },
        },
        {
            name: 'android',
            use: {
                ...devices['Pixel 5'],
                platform: 'android',
            },
        },
        {
            name: 'extension',
            use: {
                ...devices['Desktop Chrome'],
                platform: 'extension',
            },
        },
        {
            name: 'macos',
            use: {
                ...devices['Desktop Safari'],
                platform: 'macos',
            },
        },
        {
            name: 'windows',
            use: {
                ...devices['Desktop Chrome'],
                platform: 'windows',
            },
        },
    ],
});
