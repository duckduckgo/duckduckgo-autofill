import * as fs from 'fs'
import * as path from 'path'
import * as http from 'http'
import {join} from 'path'
import {tmpdir} from 'os'
import {mkdtempSync} from 'fs'
import {chromium, firefox} from '@playwright/test'

const DATA_DIR_PREFIX = 'ddg-temp-'

/**
 * A simple file server, this is done manually here to enable us
 * to manipulate some requests if needed.
 * @param {string|number} [port]
 * @return {{address: AddressInfo, urlForPath(path: string): string, close(): void, url: module:url.URL}}
 */
export function setupServer (port) {

    const server = http.createServer(function (req, res) {
        const url = new URL(req.url, `http://${req.headers.host}`)
        const importUrl = new URL(import.meta.url)
        const dirname = importUrl.pathname.replace(/\/[^/]*$/, '')
        const pathname = path.join(dirname, '../pages', url.pathname)

        fs.readFile(pathname, (err, data) => {
            if (err) {
                res.writeHead(404)
                res.end(JSON.stringify(err))
                return
            }
            res.writeHead(200)
            res.end(data)
        })
    }).listen(port)

    const address = server.address();
    const url = new URL("http://localhost:" + address.port);

    return {
        address,
        url,
        urlForPath(path) {
            const local_url = new URL(path, url);
            return local_url.href;
        },
        close() {
            server.close();
        }
    }
}

/**
 * @param {import("@playwright/test").test} test
 */
export function withChromeExtensionContext(test) {
    return test.extend({
        context: async ({ browserName }, use, testInfo) => {
            testInfo.skip(testInfo.project.name !== "chromium");
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
            const context = await browserTypes[browserName].launchPersistentContext(
                dataDir,
                launchOptions
            )
            await use(context)
            await context.close()
        },
    })
}

export async function setup (ops = {}) {
    /**
     * A wrapper around page.goto() that supports sending additional
     * arguments to content-scope's init methods + waits for a known
     * indicators to avoid race conditions
     *
     * @param {import("puppeteer").Page} page
     * @param {string} urlString
     * @param {Record<string, any>} [args]
     * @returns {Promise<void>}
     */
    async function gotoAndWait (page, urlString, args = {}) {
        const url = new URL(urlString)

        // Append the flag so that the script knows to wait for incoming args.
        // url.searchParams.append('wait-for-init-args', 'true')

        await page.goto(url.href, {waitUntil: 'networkidle0'})

        // // wait until contentScopeFeatures.load() has completed
        // await page.waitForFunction(() => {
        //     return window.__content_scope_status === 'loaded'
        // })
        //
        // const evalString = `
        //     const detail = ${JSON.stringify(args)}
        //     const evt = new CustomEvent('content-scope-init-args', { detail })
        //     document.dispatchEvent(evt)
        // `
        // await page.evaluate(evalString)
        //
        // // wait until contentScopeFeatures.init(args) has completed
        // await page.waitForFunction(() => {
        //     return window.__content_scope_status === 'initialized'
        // })
    }

    return { teardown, setupServer, gotoAndWait }
}
