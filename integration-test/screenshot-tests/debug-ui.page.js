/// <reference path="./playwright.d.ts" />

/**
 * Page object for the debug-ui page.
 * Provides helpers for navigating and preparing the page for screenshots.
 */
export class DebugUIPage {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {string} platform
     */
    constructor(page, platform) {
        this.page = page;
        this.platform = platform;
    }

    /**
     * Create a DebugUIPage instance from test context.
     * @param {import('@playwright/test').Page} page
     * @param {import('@playwright/test').TestInfo} testInfo
     * @returns {DebugUIPage}
     */
    static create(page, testInfo) {
        const platform = testInfo.project.use.platform || 'extension';
        return new DebugUIPage(page, platform);
    }

    /**
     * Enable reduced motion for stable screenshots (prevents animations).
     */
    async reducedMotion() {
        await this.page.emulateMedia({ reducedMotion: 'reduce' });
    }

    /**
     * Emulate dark color scheme.
     */
    async darkMode() {
        await this.page.emulateMedia({ colorScheme: 'dark' });
    }

    /**
     * Emulate light color scheme.
     */
    async lightMode() {
        await this.page.emulateMedia({ colorScheme: 'light' });
    }

    /**
     * Navigate to the debug-ui page with the platform query parameter.
     * @param {Object} [options]
     * @param {boolean} [options.waitForLoad=true] - Wait for page to fully load
     */
    async openPage(options = {}) {
        const { waitForLoad = true } = options;
        const url = `/debug/index.html?platform=${this.platform}`;
        await this.page.goto(url);

        if (waitForLoad) {
            await this.waitForTooltipsToRender();
        }
    }

    /**
     * Wait for the main content to be visible and tooltips to render.
     */
    async waitForTooltipsToRender() {
        // Wait for the last tooltip to be rendered (importTooltips is the last section created)
        await this.page.locator('#importTooltips-0').waitFor({ state: 'visible' });

        // Wait for network idle to ensure all CSS background images (icons) are loaded
        await this.page.waitForLoadState('networkidle');
    }
}
