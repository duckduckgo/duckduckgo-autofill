import { test, expect } from '@playwright/test';
import { DebugUIPage } from './debug-ui.page.js';

test.describe('Debug UI Screenshots', { tag: ['@screenshots'] }, () => {
    test('light-mode', async ({ page }, testInfo) => {
        const debugUI = DebugUIPage.create(page, testInfo);
        await debugUI.reducedMotion();
        await debugUI.lightMode();
        await debugUI.openPage();
        await expect(page).toHaveScreenshot('light-mode.png', { fullPage: true });
    });

    test('dark-mode', async ({ page }, testInfo) => {
        const debugUI = DebugUIPage.create(page, testInfo);
        await debugUI.reducedMotion();
        await debugUI.darkMode();
        await debugUI.openPage();
        await expect(page).toHaveScreenshot('dark-mode.png', { fullPage: true });
    });
});
