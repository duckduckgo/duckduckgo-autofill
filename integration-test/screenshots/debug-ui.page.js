/**
 * Page object for the debug UI page
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').TestInfo} testInfo
 */
export function DebugUIPage(page, testInfo) {
    const projectUse = /** @type {{platform?: string}} */ (testInfo.project.use);
    const platform = projectUse.platform || 'macos';

    return {
        /**
         * Navigate to the debug UI page with a specific platform and locale
         * @param {{ locale?: string }} [options]
         */
        async openPage(options = {}) {
            const { locale = 'en' } = options;
            await page.goto(`/debug/index.html?platform=${platform}&locale=${locale}`);
        },

        /**
         * Navigate to the icons debug page
         */
        async openIconsPage() {
            await page.goto(`/debug/icons.html`);
        },

        /**
         * Wait for all tooltips to be rendered
         */
        async waitForTooltipsRendered() {
            // Wait for the main content to be present
            await page.waitForSelector('main');
            // Wait for at least one tooltip to be attached (even if not visible yet)
            await page.waitForSelector('ddg-autofill', { state: 'attached', timeout: 10000 });
            // Give time for fonts to load and tooltips to become visible
            await page.waitForTimeout(2000);
        },

        /**
         * Get the main content element
         */
        main() {
            return page.locator('main');
        },

        /**
         * Get all tooltip containers
         */
        tooltips() {
            return page.locator('[class*="tooltip"]');
        },

        /**
         * Get a specific tooltip by data-testid
         * @param {string} id
         */
        tooltipById(id) {
            return page.locator(`#${id}`).locator('..').locator('[class*="tooltip"]');
        },

        /**
         * Get the platform being used
         */
        getPlatform() {
            return platform;
        },

        /**
         * Force a specific color scheme
         * @param {'light' | 'dark'} scheme
         */
        async setColorScheme(scheme) {
            await page.emulateMedia({ colorScheme: scheme });
        },
    };
}
