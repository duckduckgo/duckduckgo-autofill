import * as fs from 'fs'
import * as path from 'path'
import * as http from 'http'
import {join} from 'path'
import {tmpdir} from 'os'
import {mkdtempSync, readFileSync} from 'fs'
import {chromium, firefox} from '@playwright/test'

const DATA_DIR_PREFIX = 'ddg-temp-'

export const constants = {
    pages: {
        'email-autofill': 'email-autofill.html'
    },
    fields: {
        email: {
            personalAddress: `shane-123@duck.com`,
            privateAddress0: '0@duck.com',
            selectors: {
                identity: '[data-ddg-inputtype="identities.emailAddress"]'
            }
        }
    }
}

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
        let pathname = path.join(dirname, '../pages', url.pathname)

        if (url.pathname.startsWith('/src')) {
            pathname = path.join(dirname, '../../', url.pathname)
        }

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

    const address = server.address()
    const url = new URL('http://localhost:' + address.port)

    return {
        address,
        url,
        urlForPath (path) {
            const nextUrl = new URL(path, url)
            return nextUrl.href
        },
        close () {
            server.close()
        }
    }
}

/**
 * @param {import("@playwright/test").test} test
 */
export function withChromeExtensionContext (test) {
    return test.extend({
        context: async ({ browserName }, use, testInfo) => {
            // ensure this test setup cannot be used by anything other than chrome
            testInfo.skip(testInfo.project.name !== 'chromium')

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
        }
    })
}

/**
 * @param {import("playwright").Page} page
 * @param {Record<string, string | boolean>} replacements
 * @return {Promise<void>}
 */
export async function withStringReplacements (page, replacements) {
    const content = readFileSync('./dist/autofill.js', 'utf8')
    let output = content
    for (let [keyName, value] of Object.entries(replacements)) {
        output = output.replace(`// INJECT ${keyName} HERE`, `${keyName} = ${value};`)
    }
    await page.addInitScript(output)
}

/**
 * @param {import("playwright").Page} page
 * @param {Record<string, any>} mocks
 */
export async function withMockedWebkit (page, mocks) {
    await page.addInitScript((mocks) => {
        window.webkit = {
            messageHandlers: {}
        }

        for (let [msgName, response] of Object.entries(mocks)) {
            window.webkit.messageHandlers[msgName] = {
                postMessage: async () => {
                    return JSON.stringify(response)
                }
            }
        }
    }, mocks)
}
