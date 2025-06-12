// @ts-check
const { devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
    testDir: './integration-test/tests',
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000,
    },
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 5 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 4 : 6,
    // workers: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ? 'github' : [['html', { open: 'never' }]],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://localhost:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },
    /* let Playwright start/stop the server for us */
    webServer: {
        port: 3210,
        reuseExistingServer: true,
        command: 'npm run build && npm run serve',
        ignoreHTTPSErrors: true,
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'extension',
            testMatch: /.*extension.spec.js/,
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'windows',
            testMatch: /.*windows.spec.js/,
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'android',
            testMatch: [/.*android.spec.js/],
            use: {
                ...devices['Pixel 5'],
                userAgent:
                    'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.88 DuckDuckGo/7 Mobile Safari/537.36',
            },
        },
        // {
        //   name: 'firefox',
        //   use: {
        //     ...devices['Desktop Firefox'],
        //   },
        // },
        {
            name: 'ios',
            testMatch: [/.*ios.spec.js/],
            use: {
                ...devices['iPhone 12'],
                userAgent:
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 DuckDuckGo/7 Safari/605.1.15',
            },
        },
        {
            name: 'macos',
            testMatch: [/.*macos.spec.js/],
            use: {
                ...devices['Desktop Safari'],
            },
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: {
        //     ...devices['Pixel 5'],
        //   },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: {
        //     ...devices['iPhone 12'],
        //   },
        // },
    ],
};

module.exports = config;
