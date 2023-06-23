import {readFileSync} from 'fs'
import {join} from 'path'
import {macosContentScopeReplacements, iosContentScopeReplacements} from './mocks.webkit.js'
import {validPlatform} from "./utils.js";

/**
 * @param {import("@playwright/test").Page} page
 * @param {string} domain
 */
export async function setupMockedDomain (page, domain) {
    const contentType = {
        html: 'text/html',
        css: 'text/css',
        default: 'text/plain'
    }
    await page.route(`${domain}/**/*`, (route, request) => {
        const { pathname } = new URL(request.url())
        const fileType = pathname.split('.').pop()
        return route.fulfill({
            status: 200,
            contentType: contentType[fileType] || contentType.default,
            body: readFileSync(join('.', pathname), 'utf8')
        })
    })
}

export async function withEmailProtectionExtensionSignedInAs (page, username) {
    const [backgroundPage] = await page.context().backgroundPages()
    await backgroundPage.evaluateHandle((personalAddress) => {
        // eslint-disable-next-line no-undef
        globalThis.setEmailProtectionUserData(personalAddress)
    }, [username])
}

/**
 * @param {import("@playwright/test").Page} page
 * @param {Record<string, string | boolean>} replacements
 * @param {Platform} [platform]
 * @return {Promise<void>}
 */
function withStringReplacements (page, replacements, platform = 'macos') {
    const content = readFileSync('./dist/autofill.js', 'utf8')
    let output = content
    for (let [keyName, value] of Object.entries(replacements)) {
        let replacement = typeof value === 'boolean' || typeof value === 'string'
            ? value
            : JSON.stringify(value)
        output = output.replace(`// INJECT ${keyName} HERE`, `${keyName} = ${replacement};`)
    }

    // 'macos' + 'ios'  can execute scripts before page scripts
    if (['macos', 'ios'].includes(platform)) {
        return page.addInitScript(output)
    }

    /**
     * On Windows the `window.chrome.webview.x` API's are 'deleted' from the global scope
     * So this part is here to better simulate how our script runs on Windows, with access to the injected
     * variables like `windowsInteropPostMessage`.
     *
     * Please see:
     *   - `types.d.ts` in the root to see where we add these variables for Typescript
     *   - `src/deviceApiCalls/transports/windows.transport.js` for where these are actually used
     */
    if (platform === 'windows') {
        const script = `
            (function() {
                const windowsInteropPostMessage = window.chrome.webview.postMessage;
                const windowsInteropAddEventListener = window.chrome.webview.addEventListener;
                const windowsInteropRemoveEventListener = window.chrome.webview.removeEventListener;
                delete window.chrome.webview.postMessage;
                delete window.chrome.webview.addEventListener;
                delete window.chrome.webview.removeEventListener;
                try {
                    ${output}
                } catch (e) {
                     console.error("uncaught error from windows interop", e);
                }
            })()
            `
        return page.evaluate(script)
    }

    return page.evaluate(output)
}

/**
 * @return {ScriptBuilder}
 */
export function createAutofillScript () {
    /** @type {Partial<Replacements>} */
    const replacements = {
        isDDGTestMode: true,
        supportsTopFrame: false,
        hasModernWebkitAPI: true
    }

    /** @type {Platform} */
    let platform = 'macos'

    /** @type {ScriptBuilder} */
    const builder = {
        replace (key, value) {
            replacements[key] = value
            return this
        },
        tap (fn) {
            fn(replacements, platform)
            return this
        },
        replaceAll: function (incoming) {
            Object.assign(replacements, incoming)
            return this
        },
        platform (p) {
            platform = p
            return this
        },
        async applyTo (page) {
            if (platform === 'windows') {
                replacements['isWindows'] = true
            }
            return withStringReplacements(page, replacements, platform)
        }
    }

    return builder
}

/**
 * @param {import("@playwright/test").Page} page
 */
export async function defaultMacosScript (page) {
    return createAutofillScript()
        .replaceAll(macosContentScopeReplacements())
        .platform('macos')
        .applyTo(page)
}

/**
 * @param {import("@playwright/test").Page} page
 */
export async function defaultIOSScript (page) {
    return createAutofillScript()
        .replaceAll(iosContentScopeReplacements())
        .platform('ios')
        .applyTo(page)
}

/**
 * @param {import("@playwright/test").Page} page
 * @param {Partial<import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles>} featureToggles
 */
export async function withIOSFeatureToggles (page, featureToggles) {
    return createAutofillScript()
        .replaceAll(iosContentScopeReplacements({
            featureToggles: featureToggles
        }))
        .platform('ios')
        .applyTo(page)
}

/**
 * Relay browser exceptions to the terminal to aid debugging.
 *
 * @param {import("@playwright/test").Page} page
 * @param {{verbose?: boolean}} [_opts]
 */
export function forwardConsoleMessages (page, _opts = {}) {
    page.on('pageerror', (msg) => {
        console.log('🌍 ❌ [in-page error]', msg)
    })
    page.on('console', (msg) => {
        const type = msg.type()
        const icon = (() => {
            switch (type) {
            case 'warning': return '☢️'
            case 'error': return '❌️'
            default: return '🌍'
            }
        })()

        console.log(`${icon} [console.${type}]`, msg.text())
    })
}

/**
 * @param {import("@playwright/test").Page} page
 * @param {string} measureName
 * @return {Promise<PerformanceEntryList>}
 */
export async function performanceEntries (page, measureName) {
    const result = await page.evaluate((measureName) => {
        window.performance?.measure?.(measureName, `${measureName}:start`, `${measureName}:end`)
        const entries = window.performance?.getEntriesByName(measureName)
        return JSON.stringify(entries)
    }, measureName)
    return JSON.parse(result)
}

export async function printPerformanceSummary (name, times) {
    const sum = times.reduce((acc, item) => acc + Number(item), 0)
    const average = sum / times.length
    console.log(name, times)
    console.log('➡️ %s average: ', name, average)
}

/**
 * @param {import("@playwright/test").Page} page
 * @param {object} [params]
 * @param {string[]} [params.names]
 * @param {number} [params.minCount]
 * @returns {Promise<MockCall[]>}
 */
export async function mockedCalls (page, params = {}) {
    const { minCount = 1, names = [] } = params
    if (minCount > 0) {
        await page.waitForFunction(({names, minCount}) => {
            const calls = window.__playwright_autofill.mocks.calls
            if (names.length > 0) {
                const matching = calls.filter(([name]) => names.includes(name))
                return matching.length >= minCount
            } else {
                return calls.length >= minCount
            }
        }, {names, minCount})
    }

    if (minCount === 0) {
        await page.waitForTimeout(500)
    }

    return page.evaluate(({names}) => {
        if (!Array.isArray(window.__playwright_autofill?.mocks?.calls)) {
            throw new Error('unreachable, window.__playwright_autofill.mocks.calls must be defined')
        }

        // no need to filter if no names were given, assume the caller wants all mocks
        if (names.length === 0) {
            return window.__playwright_autofill.mocks.calls
        }

        // otherwise filter on the given names
        return window.__playwright_autofill.mocks.calls
            .filter(([name]) => names.includes(name))
    }, {names})
}

/**
 * @param {MockCall[]} mockCalls
 * @return {Record<string, unknown>[]}
 */
export function payloadsOnly (mockCalls) {
    return mockCalls.map(call => {
        let [, sent] = call
        if (typeof sent === 'string') {
            sent = JSON.parse(sent)
        }
        return sent
    })
}

/**
 * This gathers all mocked API calls and adds them as an attachment to the
 * test run.
 *
 * This means that when you run `npx playwright show-results` you can
 * access every piece of JSON that was sent and received.
 *
 * @param {import("@playwright/test").Page} page
 * @param {typeof import("@playwright/test").test} test
 * @param {import("@playwright/test").TestInfo} testInfo
 * @returns {Promise<void>}
 */
export async function addMocksAsAttachments (page, test, testInfo) {
    const calls = await mockedCalls(page, {minCount: 0})
    const platform = validPlatform(testInfo.project.name);
    let index = 0
    for (let call of calls) {
        index += 1
        let [name, params, response] = call
        const lines = [`name: ${name}`]
        if (platform === 'android') {
            lines.push('sent as json string: \n\n' + JSON.stringify(params))
            params = JSON.parse(/** @type {any} */(params));
        }
        lines.push(`\n\nparams: \n\n` + JSON.stringify(params, null, 2))
        lines.push(`\n\nresponse: \n\n` + JSON.stringify(response, null, 2))
        test.info().attachments.push({
            name: `mock ${index} ${name} info`,
            contentType: 'text/plain',
            body: Buffer.from(lines.join('\n'))
        })
        test.info().attachments.push({
            name: `mock ${index} params as JSON`,
            contentType: 'text/json',
            body: Buffer.from(JSON.stringify(params, null, 2))
        })
    }
}
