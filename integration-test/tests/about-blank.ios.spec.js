import { test } from '@playwright/test';
import { aboutBlankPage } from '../helpers/pages/aboutBlankPage.js';

test.describe('Autofill in about:blank frames (iOS)', () => {
    test('only about:blank frames wait for content', async ({ page }) => {
        const frames = aboutBlankPage(page);
        await frames.openWithAutofillInEveryFrame();

        await frames.addFrameWithAboutBlankFragmentSrc('about-blank-fragment');
        await frames.addEmptyFrameWithRealUrl('real-url');
        await frames.addEmptySrcdocFrame('srcdoc');

        await frames.assertAutofillDormant('about-blank-fragment');
        await frames.assertAutofillStarted('real-url');
        await frames.assertAutofillStarted('srcdoc');
    });

    test('keeps waiting when a javascript: URL writes an ad pixel', async ({ page }) => {
        const frames = aboutBlankPage(page);
        await frames.openWithAutofillInEveryFrame();

        await frames.addFrameWithJavascriptUrlWritingPixel('frame');
        await frames.assertAutofillDormant('frame');
    });

    test('starts once when document.write replaces the document with a form, and works on the first tap', async ({ page }) => {
        const frames = aboutBlankPage(page);
        await frames.openWithAutofillInEveryFrame();
        await frames.addFrameWithoutSrc('frame');
        await frames.assertAutofillDormant('frame');

        await frames.writeFormWithDocumentWrite('frame');
        await frames.assertAutofillStarted('frame');

        await frames.tapPasswordField('frame');
        await frames.assertAutofillDataRequested('frame');

        await frames.appendInput('frame');
        await frames.assertAutofillStartedOnlyOnce('frame');
    });

    test('starts when a lone input is added', async ({ page }) => {
        const frames = aboutBlankPage(page);
        await frames.openWithAutofillInEveryFrame();
        await frames.addFrameWithoutSrc('frame');

        await frames.appendInput('frame');
        await frames.assertAutofillStarted('frame');
    });

    test('starts for shadow DOM forms that querySelector cannot see', async ({ page }) => {
        const frames = aboutBlankPage(page);
        await frames.openWithAutofillInEveryFrame();
        await frames.addFrameWithoutSrc('custom-element');
        await frames.addFrameWithoutSrc('div-host');
        await frames.addFrameWithoutSrc('wrapped-div-host');

        await frames.appendCustomElementThenDefineIt('custom-element');
        await frames.appendDivHostingShadowForm('div-host');
        await frames.appendDivHostingShadowFormInsideWrapper('wrapped-div-host');

        await frames.assertAutofillStarted('custom-element');
        await frames.assertAutofillStarted('div-host');
        await frames.assertAutofillStarted('wrapped-div-host');
    });
});
