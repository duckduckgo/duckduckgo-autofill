import {validPlatform} from './utils.js'
import {join} from 'path'
import {tmpdir} from 'os'
import {mkdtempSync} from 'fs'
import {chromium, firefox} from '@playwright/test'
import {addMocksAsAttachments} from './harness.js'

const DATA_DIR_PREFIX = 'ddg-temp-'

/**
 * @param {typeof import("@playwright/test").test} test
 */
export function testContext (test) {
    return test.extend({
        context: async ({ browser, browserName }, use, testInfo) => {
            // ensure this test setup cannot be used by anything other than webkit browsers
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
                }
            }

            await use(context)
            for (let page of context.pages()) {
                await addMocksAsAttachments(page, test)
            }
            await context.close()
        }
    })
}
