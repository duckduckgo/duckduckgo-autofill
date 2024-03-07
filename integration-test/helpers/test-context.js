import {validPlatform} from './utils.js'
import {join} from 'path'
import {tmpdir} from 'os'
import {mkdtempSync} from 'fs'
import {chromium, firefox} from '@playwright/test'
import {addMocksAsAttachments} from './harness.js'

const DATA_DIR_PREFIX = 'ddg-temp-'

/**
 * A single place
 * @param {typeof import("@playwright/test").test} test
 */
export function testContext (test) {
    return test.extend({
        context: async ({ browser, browserName }, use, testInfo) => {
            // use `testInfo.project.name` is something we support.
            const platform = validPlatform(testInfo.project.name)
            let context

            // first, create the context
            switch (platform) {
            case 'ios':
            case 'android':
            case 'macos':
            case 'windows': {
                context = await browser.newContext()
                break
            }
            case 'extension': {
                const tmpDirPrefix = join(tmpdir(), DATA_DIR_PREFIX)
                const dataDir = mkdtempSync(tmpDirPrefix)
                const browserTypes = { chromium, firefox }
                const launchOptions = {
                    devtools: true,
                    headless: false,
                    viewport: {
                        width: 1920,
                        height: 1080
                    },
                    args: [
                        '--disable-extensions-except=integration-test/extension',
                        '--load-extension=integration-test/extension'
                    ]
                }
                context = await browserTypes[browserName].launchPersistentContext(
                    dataDir,
                    launchOptions
                )

                // don't allow tests to run until the background page is ready
                if (context.backgroundPages().length === 0) {
                    await new Promise((resolve) => context.on('backgroundpage', resolve))
                }
            }
            }

            // actually run the tests
            await use(context)

            // collect attachments (like mock calls) and append as attachments
            // note: skipping the extension for now, since it's testing setup has fallen behind
            if (platform !== 'extension') {
                for (let page of context.pages()) {
                    await addMocksAsAttachments(page, test, testInfo)
                }
            }
            await context.close()
        }
    })
}
