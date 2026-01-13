import { expect, test } from '@playwright/test';
import { DebugUIPage } from './debug-ui.page.js';

const maxDiffPixels = 50;

test.describe('debug UI screenshots @screenshots', () => {
    test('main debug UI page', async ({ page }, testInfo) => {
        const debugUI = DebugUIPage(page, testInfo);
        await debugUI.openPage();
        await debugUI.waitForTooltipsRendered();

        await expect(page).toHaveScreenshot('debug-ui-main.png', { maxDiffPixels });
    });

    test('debug UI page with dark mode', async ({ page }, testInfo) => {
        const debugUI = DebugUIPage(page, testInfo);
        await debugUI.setColorScheme('dark');
        await debugUI.openPage();
        await debugUI.waitForTooltipsRendered();

        await expect(page).toHaveScreenshot('debug-ui-dark.png', { maxDiffPixels });
    });

    test('debug UI with French locale', async ({ page }, testInfo) => {
        const debugUI = DebugUIPage(page, testInfo);
        await debugUI.openPage({ locale: 'fr' });
        await debugUI.waitForTooltipsRendered();

        await expect(page).toHaveScreenshot('debug-ui-french.png', { maxDiffPixels });
    });

    test('debug UI with German locale', async ({ page }, testInfo) => {
        const debugUI = DebugUIPage(page, testInfo);
        await debugUI.openPage({ locale: 'de' });
        await debugUI.waitForTooltipsRendered();

        await expect(page).toHaveScreenshot('debug-ui-german.png', { maxDiffPixels });
    });
});

test.describe('icons page screenshots @screenshots', () => {
    test('icons debug page', async ({ page }, testInfo) => {
        const debugUI = DebugUIPage(page, testInfo);
        await debugUI.openIconsPage();
        // Wait for icons to load
        await page.waitForTimeout(500);

        await expect(page).toHaveScreenshot('icons-page.png', { maxDiffPixels });
    });
});
