/// <reference path="./integration-test/screenshot-tests/playwright.d.ts" />
const { devices } = require('@playwright/test');

/**
 * Playwright configuration for screenshot tests.
 * Uses a desktop viewport for all platforms since debug-ui is a test harness.
 *
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
    testDir: './integration-test/screenshot-tests',
    /* Maximum time one test can run for. */
    timeout: 60 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         */
        timeout: 10000,
        toHaveScreenshot: {
            /* Allow some pixel differences for font rendering variations */
            maxDiffPixels: 20,
        },
    },
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Run tests in parallel */
    workers: process.env.CI ? 2 : 4,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ? 'github' : [['html', { open: 'never' }]],
    /* Shared settings for all the projects below. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:3210',
        /* Collect trace when retrying the failed test. */
        trace: 'on-first-retry',
        /* Viewport width for consistent rendering */
        viewport: { width: 1280, height: 800 },
    },
    /* Let Playwright start/stop the server for us */
    webServer: {
        port: 3210,
        reuseExistingServer: true,
        command: 'DEBUG_UI=true npm run build && npm run serve',
        ignoreHTTPSErrors: true,
    },
    /* Configure snapshot paths per-platform */
    snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',

    /* Configure projects for each platform - all use Desktop Chrome for consistent rendering */
    projects: [
        {
            name: 'ios',
            use: {
                ...devices['Desktop Chrome'],
                platform: 'ios',
            },
        },
        {
            name: 'android',
            use: {
                ...devices['Desktop Chrome'],
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
                ...devices['Desktop Chrome'],
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
};

module.exports = config;
