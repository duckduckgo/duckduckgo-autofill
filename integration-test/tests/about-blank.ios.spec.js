import { expect, test } from '@playwright/test';
import { createAutofillScript } from '../helpers/harness.js';
import { createWebkitMocks, iosContentScopeReplacements } from '../helpers/mocks.webkit.js';

test.describe('About Blank Page', () => {
    test('autofill waits for content in about:blank frames only', async ({ page }) => {
        // init scripts run in every frame, like WKUserScripts with forMainFrameOnly: false
        await createWebkitMocks('ios').applyTo(page);
        await createAutofillScript()
            .replaceAll(iosContentScopeReplacements())
            .platform('ios')
            .bundle('./dist/autofill.ios.js')
            .applyTo(page);

        await page.route('https://example.com/', (route) =>
            route.fulfill({
                contentType: 'text/html',
                body: `<!doctype html><body>
                    <iframe id="explicit" src="about:blank"></iframe>
                    <iframe id="fragment" src="about:blank#foo"></iframe>
                    <iframe id="real-url" src="https://example.com/empty"></iframe>
                    <script>
                        const iframe = document.createElement('iframe');
                        iframe.id = 'no-src';
                        document.body.append(iframe);
                    </script>
                </body>`,
            }),
        );
        await page.route('https://example.com/empty', (route) =>
            route.fulfill({ contentType: 'text/html', body: '<!doctype html><body></body>' }),
        );
        await page.goto('https://example.com/');

        /** @param {import('@playwright/test').Frame} frame */
        const calls = (frame) => frame.evaluate(() => window.__playwright_autofill.mocks.calls.map(([name]) => name));

        /** @param {string} id */
        const frameById = async (id) => {
            const frame = await page
                .locator(`#${id}`)
                .elementHandle()
                .then((el) => el?.contentFrame());
            if (!frame) throw new Error(`no frame for #${id}`);
            return frame;
        };

        const realUrl = await frameById('real-url');
        expect(realUrl.url()).toBe('https://example.com/empty');
        await expect
            .poll(() => calls(realUrl), { message: 'autofill should start in an empty iframe with a real URL' })
            .toContain('getRuntimeConfiguration');

        const noSrc = await frameById('no-src');
        expect(noSrc.url()).toBe('about:blank');
        expect(await calls(noSrc), 'autofill should not start in an empty about:blank frame (no src)').toEqual([]);

        const explicit = await frameById('explicit');
        expect(explicit.url()).toBe('about:blank');
        expect(await calls(explicit), 'autofill should not start in an empty about:blank frame (src="about:blank")').toEqual([]);

        const fragment = await frameById('fragment');
        expect(fragment.url()).toBe('about:blank#foo');
        expect(await calls(fragment), 'autofill should not start in an empty about:blank frame (src="about:blank#foo")').toEqual([]);
    });

    test('autofill comes back to life when a skipped about:blank frame later gets a form', async ({ page }) => {
        await createWebkitMocks('ios').applyTo(page);
        await createAutofillScript()
            .replaceAll(iosContentScopeReplacements())
            .platform('ios')
            .bundle('./dist/autofill.ios.js')
            .applyTo(page);

        await page.clock.install();

        await page.route('https://example.com/', (route) =>
            route.fulfill({
                contentType: 'text/html',
                body: `<!doctype html><body>
                    <iframe id="late-inner-html"></iframe>
                    <iframe id="late-document-write"></iframe>
                    <script>
                        const form = '<form><input type="email" autocomplete="email"><input type="password" autocomplete="new-password"><button type="submit">Create account</button></form>';
                        setTimeout(() => {
                            document.getElementById('late-inner-html').contentDocument.body.innerHTML = form;

                            const doc = document.getElementById('late-document-write').contentDocument;
                            doc.open();
                            doc.write('<!doctype html><html><body>' + form + '</body></html>');
                            doc.close();
                        }, 1000);
                        setTimeout(() => {
                            const doc = document.getElementById('late-inner-html').contentDocument;
                            doc.body.insertAdjacentHTML('beforeend', '<input name="later">');
                        }, 2000);
                    </script>
                </body>`,
            }),
        );
        await page.goto('https://example.com/');

        const innerHtmlFrame = await page
            .locator('#late-inner-html')
            .elementHandle()
            .then((el) => el?.contentFrame());
        if (!innerHtmlFrame) throw new Error('no frame for #late-inner-html');

        const documentWriteFrame = await page
            .locator('#late-document-write')
            .elementHandle()
            .then((el) => el?.contentFrame());
        if (!documentWriteFrame) throw new Error('no frame for #late-document-write');

        /** @param {import('@playwright/test').Frame} frame */
        const calls = (frame) => frame.evaluate(() => window.__playwright_autofill.mocks.calls.map(([name]) => name));

        await expect
            .poll(() => calls(page.mainFrame()), { message: 'autofill should start in the main frame' })
            .toContain('getRuntimeConfiguration');
        expect(await calls(innerHtmlFrame), 'autofill should not start in an about:blank frame before it gets content').toEqual([]);
        expect(await calls(documentWriteFrame), 'autofill should not start in an about:blank frame before it gets content').toEqual([]);

        await page.clock.runFor(1000);

        await expect
            .poll(() => calls(innerHtmlFrame), { timeout: 1000, message: 'autofill should start when a form is set with innerHTML' })
            .toContain('getRuntimeConfiguration');
        await expect
            .poll(() => calls(documentWriteFrame), {
                timeout: 1000,
                message: 'autofill should start when a form is written with document.write',
            })
            .toContain('getRuntimeConfiguration');

        await documentWriteFrame.locator('input[type="password"]').click();
        await expect
            .poll(() => calls(documentWriteFrame), {
                timeout: 1000,
                message: 'the first tap after document.write should ask native for autofill data',
            })
            .toContain('getAutofillData');

        await page.clock.runFor(1000);

        await expect(innerHtmlFrame.locator('input[name="later"]')).toBeAttached();

        const startCount = (await calls(innerHtmlFrame)).filter((name) => name === 'getRuntimeConfiguration').length;
        expect(startCount, 'autofill should start only once in a frame, however the page changes afterwards').toBe(1);
    });

    test('autofill starts before any tap when a skipped about:blank frame gets a form inside a shadow root', async ({ page }) => {
        await createWebkitMocks('ios').applyTo(page);
        await createAutofillScript()
            .replaceAll(iosContentScopeReplacements())
            .platform('ios')
            .bundle('./dist/autofill.ios.js')
            .applyTo(page);

        await page.clock.install();

        await page.route('https://example.com/', (route) =>
            route.fulfill({
                contentType: 'text/html',
                body: `<!doctype html><body>
                    <iframe id="shadow-late"></iframe>
                    <script>
                        const form = '<form><input type="email" autocomplete="email"><input type="password" autocomplete="new-password"><button type="submit">Create account</button></form>';
                        setTimeout(() => {
                            // the shadow root is only filled after the host is added
                            const lateDoc = document.getElementById('shadow-late').contentDocument;
                            const lateHost = lateDoc.createElement('acme-sign-up');
                            const lateRoot = lateHost.attachShadow({ mode: 'open' });
                            lateDoc.body.append(lateHost);
                            setTimeout(() => (lateRoot.innerHTML = form), 0);
                        }, 1000);
                    </script>
                </body>`,
            }),
        );
        await page.goto('https://example.com/');

        const lateFrame = await page
            .locator('#shadow-late')
            .elementHandle()
            .then((el) => el?.contentFrame());
        if (!lateFrame) throw new Error('no frame for #shadow-late');

        /** @param {import('@playwright/test').Frame} frame */
        const calls = (frame) => frame.evaluate(() => window.__playwright_autofill.mocks.calls.map(([name]) => name));

        await expect
            .poll(() => calls(page.mainFrame()), { message: 'autofill should start in the main frame' })
            .toContain('getRuntimeConfiguration');
        expect(await calls(lateFrame), 'autofill should not start in an about:blank frame before it gets content').toEqual([]);

        await page.clock.runFor(1000);

        await expect
            .poll(() => calls(lateFrame), {
                timeout: 1000,
                message: 'autofill should start, without a tap, when a custom element is added',
            })
            .toContain('getRuntimeConfiguration');

        await lateFrame.locator('input[type="password"]').click();
        await expect
            .poll(() => calls(lateFrame), { timeout: 1000, message: 'the first tap should ask native for autofill data' })
            .toContain('getAutofillData');
    });

    test('autofill starts for shadow DOM forms behind wrappers or built-in hosts, but not for childless content', async ({ page }) => {
        await createWebkitMocks('ios').applyTo(page);
        await createAutofillScript()
            .replaceAll(iosContentScopeReplacements())
            .platform('ios')
            .bundle('./dist/autofill.ios.js')
            .applyTo(page);

        await page.clock.install();

        await page.route('https://example.com/', (route) =>
            route.fulfill({
                contentType: 'text/html',
                body: `<!doctype html><body>
                    <iframe id="nested-custom"></iframe>
                    <iframe id="div-host"></iframe>
                    <iframe id="nested-div-host"></iframe>
                    <iframe id="pixel"></iframe>
                    <iframe id="empty-div-and-script"></iframe>
                    <iframe id="document-write-pixel"></iframe>
                    <script>
                        const form = '<form><input type="email" autocomplete="email"><input type="password" autocomplete="new-password"><button type="submit">Create account</button></form>';
                        const doc = (id) => document.getElementById(id).contentDocument;
                        setTimeout(() => {
                            const nestedCustom = doc('nested-custom');
                            nestedCustom.defaultView.customElements.define(
                                'acme-sign-up',
                                class extends nestedCustom.defaultView.HTMLElement {
                                    connectedCallback() {
                                        this.attachShadow({ mode: 'open' }).innerHTML = form;
                                    }
                                },
                            );
                            nestedCustom.body.innerHTML = '<div class="wrap"><acme-sign-up></acme-sign-up></div>';

                            const divHost = doc('div-host').createElement('div');
                            divHost.attachShadow({ mode: 'open' }).innerHTML = form;
                            doc('div-host').body.append(divHost);

                            const wrapper = doc('nested-div-host').createElement('section');
                            const nestedDivHost = doc('nested-div-host').createElement('div');
                            wrapper.append(nestedDivHost);
                            nestedDivHost.attachShadow({ mode: 'open' }).innerHTML = form;
                            doc('nested-div-host').body.append(wrapper);

                            doc('pixel').body.append(doc('pixel').createElement('img'));
                            doc('empty-div-and-script').body.append(
                                doc('empty-div-and-script').createElement('div'),
                                doc('empty-div-and-script').createElement('script'),
                            );
                            const writeDoc = doc('document-write-pixel');
                            writeDoc.open();
                            writeDoc.write('<!doctype html><html><head><script></' + 'script></head><body><img></body></html>');
                            writeDoc.close();
                        }, 1000);
                    </script>
                </body>`,
            }),
        );
        await page.goto('https://example.com/');

        /** @param {import('@playwright/test').Frame} frame */
        const calls = (frame) => frame.evaluate(() => window.__playwright_autofill.mocks.calls.map(([name]) => name));

        /** @param {string} id */
        const frameById = async (id) => {
            const frame = await page
                .locator(`#${id}`)
                .elementHandle()
                .then((el) => el?.contentFrame());
            if (!frame) throw new Error(`no frame for #${id}`);
            return frame;
        };

        const starting = {
            'nested-custom': 'a custom element shadow host nested in a wrapper is added',
            'div-host': 'a built-in element hosting a shadow root is added',
            'nested-div-host': 'a built-in shadow host nested in a wrapper is added',
        };
        const dormant = {
            pixel: 'only a tracking pixel is added',
            'empty-div-and-script': 'only an empty div and a script are added',
            'document-write-pixel': 'document.write only writes a script and a pixel',
        };

        await expect
            .poll(() => calls(page.mainFrame()), { message: 'autofill should start in the main frame' })
            .toContain('getRuntimeConfiguration');
        for (const id of [...Object.keys(starting), ...Object.keys(dormant)]) {
            expect(await calls(await frameById(id)), `autofill should not start in #${id} before it gets content`).toEqual([]);
        }

        await page.clock.runFor(1000);

        for (const [id, reason] of Object.entries(starting)) {
            const frame = await frameById(id);
            await expect
                .poll(() => calls(frame), { timeout: 1000, message: `autofill should start, without a tap, when ${reason}` })
                .toContain('getRuntimeConfiguration');
        }

        // let any pending mutations settle before asserting the dormant frames
        await page.clock.runFor(1000);
        for (const [id, reason] of Object.entries(dormant)) {
            expect(await calls(await frameById(id)), `autofill should not start when ${reason}`).toEqual([]);
        }

        const divHostFrame = await frameById('div-host');
        await divHostFrame.locator('input[type="password"]').click();
        await expect
            .poll(() => calls(divHostFrame), { timeout: 1000, message: 'the first tap should ask native for autofill data' })
            .toContain('getAutofillData');
    });
});
