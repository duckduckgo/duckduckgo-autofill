import { expect } from '@playwright/test';
import { createAutofillScript } from '../harness.js';
import { createWebkitMocks, iosContentScopeReplacements } from '../mocks.webkit.js';

const PAGE_URL = 'https://example.com/';
const EMPTY_PAGE_URL = 'https://example.com/empty';
const SIGN_UP_FORM =
    '<form><input type="email" autocomplete="email"><input type="password" autocomplete="new-password"><button type="submit">Create account</button></form>';

/**
 * A page that adds iframes, then changes their content, to check when the iOS build starts autofill in each frame.
 *
 * Frames are referred to by name. Inside the page object they're found by `window.name`, as element handles
 * and locators stall on frames that never finish loading (such as those written by `javascript:document.write()`).
 *
 * @param {import("@playwright/test").Page} page
 */
export function aboutBlankPage(page) {
    /**
     * @param {string} name
     * @return {Promise<import("@playwright/test").Frame>}
     */
    async function frameNamed(name) {
        for (const frame of page.mainFrame().childFrames()) {
            if ((await frame.evaluate(() => window.name)) === name) return frame;
        }
        throw new Error(`no frame named ${name}`);
    }

    /**
     * @param {import("@playwright/test").Frame} frame
     * @return {Promise<string[]>}
     */
    function callsIn(frame) {
        return frame.evaluate(() => window.__playwright_autofill.mocks.calls.map(([name]) => name));
    }

    /**
     * Adds an iframe and waits for it to load (or, for frames that never finish loading, to be attached).
     *
     * @param {string} name
     * @param {Record<string, string>} attributes
     * @param {{waitForLoad: boolean}} options
     */
    function appendFrame(name, attributes, { waitForLoad }) {
        return page.evaluate(
            ({ name, attributes, waitForLoad }) =>
                new Promise((resolve) => {
                    const iframe = document.createElement('iframe');
                    iframe.name = name;
                    for (const [key, value] of Object.entries(attributes)) iframe.setAttribute(key, value);
                    iframe.addEventListener('load', resolve, { once: true });
                    document.body.append(iframe);
                    if (!waitForLoad) resolve(undefined);
                }),
            { name, attributes, waitForLoad },
        );
    }

    class AboutBlankPage {
        // ---- setup ----

        /** Loads the iOS build into every frame, like WKUserScripts with forMainFrameOnly: false, then opens an empty page */
        async openWithAutofillInEveryFrame() {
            await createWebkitMocks('ios').applyTo(page);
            await createAutofillScript()
                .replaceAll(iosContentScopeReplacements())
                .platform('ios')
                .bundle('./dist/autofill.ios.js')
                .applyTo(page);
            await page.route(PAGE_URL, (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><body></body>' }));
            await page.route(EMPTY_PAGE_URL, (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><body></body>' }));
            await page.goto(PAGE_URL);
            await expect
                .poll(() => callsIn(page.mainFrame()), { message: 'autofill should start in the main frame' })
                .toContain('getRuntimeConfiguration');
        }

        // ---- adding frames ----

        /** @param {string} name */
        addFrameWithoutSrc(name) {
            return appendFrame(name, {}, { waitForLoad: true });
        }

        /** @param {string} name */
        addFrameWithAboutBlankFragmentSrc(name) {
            return appendFrame(name, { src: 'about:blank#foo' }, { waitForLoad: true });
        }

        /**
         * The ad-injection pattern: the frame keeps the about:blank URL, gets a pixel, and the written document never finishes loading
         * @param {string} name
         */
        addFrameWithJavascriptUrlWritingPixel(name) {
            return appendFrame(name, { src: "javascript:document.write('<img>')" }, { waitForLoad: false });
        }

        /** @param {string} name */
        addEmptyFrameWithRealUrl(name) {
            return appendFrame(name, { src: EMPTY_PAGE_URL }, { waitForLoad: true });
        }

        /** @param {string} name */
        addEmptySrcdocFrame(name) {
            return appendFrame(name, { srcdoc: '' }, { waitForLoad: true });
        }

        // ---- changing frame content, from the parent page ----

        /**
         * Replaces the document, including the <html> element
         * @param {string} name
         */
        writeFormWithDocumentWrite(name) {
            return page.evaluate(
                ({ name, html }) => {
                    const iframe = /** @type {HTMLIFrameElement} */ (document.querySelector(`iframe[name="${name}"]`));
                    const doc = /** @type {Document} */ (iframe.contentDocument);
                    doc.open();
                    doc.write(`<!doctype html><html><body>${html}</body></html>`);
                    doc.close();
                },
                { name, html: SIGN_UP_FORM },
            );
        }

        /**
         * A lone, childless input
         * @param {string} name
         */
        appendInput(name) {
            return page.evaluate(
                ({ name }) => {
                    const iframe = /** @type {HTMLIFrameElement} */ (document.querySelector(`iframe[name="${name}"]`));
                    const doc = /** @type {Document} */ (iframe.contentDocument);
                    doc.body.append(doc.createElement('input'));
                },
                { name },
            );
        }

        /**
         * When added, the custom element has no children and no shadow root. It only gets its form when defined, a task later.
         * @param {string} name
         */
        appendCustomElementThenDefineIt(name) {
            return page.evaluate(
                async ({ name, html }) => {
                    const iframe = /** @type {HTMLIFrameElement} */ (document.querySelector(`iframe[name="${name}"]`));
                    const doc = /** @type {Document} */ (iframe.contentDocument);
                    const win = /** @type {Window & typeof globalThis} */ (doc.defaultView);
                    doc.body.append(doc.createElement('acme-sign-up'));
                    await new Promise((resolve) => setTimeout(resolve, 0));
                    win.customElements.define(
                        'acme-sign-up',
                        class extends win.HTMLElement {
                            connectedCallback() {
                                this.attachShadow({ mode: 'open' }).innerHTML = html;
                            }
                        },
                    );
                },
                { name, html: SIGN_UP_FORM },
            );
        }

        /** @param {string} name */
        appendDivHostingShadowForm(name) {
            return page.evaluate(
                ({ name, html }) => {
                    const iframe = /** @type {HTMLIFrameElement} */ (document.querySelector(`iframe[name="${name}"]`));
                    const doc = /** @type {Document} */ (iframe.contentDocument);
                    const host = doc.createElement('div');
                    host.attachShadow({ mode: 'open' }).innerHTML = html;
                    doc.body.append(host);
                },
                { name, html: SIGN_UP_FORM },
            );
        }

        /** @param {string} name */
        appendDivHostingShadowFormInsideWrapper(name) {
            return page.evaluate(
                ({ name, html }) => {
                    const iframe = /** @type {HTMLIFrameElement} */ (document.querySelector(`iframe[name="${name}"]`));
                    const doc = /** @type {Document} */ (iframe.contentDocument);
                    const wrapper = doc.createElement('section');
                    const host = doc.createElement('div');
                    wrapper.append(host);
                    host.attachShadow({ mode: 'open' }).innerHTML = html;
                    doc.body.append(wrapper);
                },
                { name, html: SIGN_UP_FORM },
            );
        }

        // ---- interacting ----

        /** @param {string} name */
        async tapPasswordField(name) {
            const frame = await frameNamed(name);
            await frame.locator('input[type="password"]').click();
        }

        // ---- assertions ----

        /** @param {string} name */
        async assertAutofillStarted(name) {
            const frame = await frameNamed(name);
            await expect
                .poll(() => callsIn(frame), { message: `autofill should start in frame "${name}"` })
                .toContain('getRuntimeConfiguration');
        }

        /** @param {string} name */
        async assertAutofillStartedOnlyOnce(name) {
            const frame = await frameNamed(name);
            const starts = (await callsIn(frame)).filter((call) => call === 'getRuntimeConfiguration');
            expect(starts, `autofill should start only once in frame "${name}"`).toHaveLength(1);
        }

        /**
         * Gives any pending mutations time to start autofill before checking it didn't.
         *
         * @param {string} name
         */
        async assertAutofillDormant(name) {
            await page.waitForTimeout(200);
            const frame = await frameNamed(name);
            expect(await callsIn(frame), `autofill should stay dormant in frame "${name}"`).toEqual([]);
        }

        /** @param {string} name */
        async assertAutofillDataRequested(name) {
            const frame = await frameNamed(name);
            await expect
                .poll(() => callsIn(frame), { message: `tapping in frame "${name}" should ask native for autofill data` })
                .toContain('getAutofillData');
        }
    }

    return new AboutBlankPage();
}
