import { constants } from '../mocks.js';
import { expect } from '@playwright/test';
import { clickOnIcon } from '../utils.js';

/**
 * @param {import("@playwright/test").Page} page
 */
export function incontextSignupPage(page, { platform } = { platform: 'extension' }) {
    const isExtension = platform === 'extension';
    const { selectors } = constants.fields.email;
    const getCallToAction = () => {
        const text = isExtension ? 'Protect My Email' : 'Hide your email and block trackers';
        return page.locator(`text=${text}`);
    };
    const getTooltip = () => page.locator('.tooltip--email, .tooltip--incontext-signup');

    class IncontextSignupPage {
        /**
         * @param {keyof typeof constants.pages} [to] - any key matching in `constants.pages`
         */
        async navigate(domain, to = 'iframeContainer') {
            const pageName = constants.pages[to];
            const pagePath = `/${pageName}`;
            await page.goto(new URL(pagePath, domain).href);
        }

        async assertIsShowing() {
            await expect(getCallToAction()).toBeVisible();
            await expect(getTooltip()).toBeInViewport({ ratio: 1 });
        }

        async assertIsHidden() {
            await expect(getCallToAction()).toBeHidden();
        }

        async getEmailProtection() {
            (await getCallToAction()).click({ timeout: 500 });
        }

        async dismissTooltipWith(text) {
            const dismissTooltipButton = await page.locator(`text=${text}`);
            await dismissTooltipButton.click({ timeout: 500 });
        }

        async closeTooltip() {
            const dismissTooltipButton = await page.locator(`[aria-label=Close]`);
            await dismissTooltipButton.click({ timeout: 500 });
        }

        async clickDirectlyOnDax() {
            const input = page.locator(selectors.identity);
            await clickOnIcon(input);
        }

        async clickDirectlyOnDaxInIframe() {
            const input = await page.frameLocator('iframe').locator('input#email');
            await clickOnIcon(input);
        }

        async assertTooltipWithinFrame() {
            const tooltip = await page.frameLocator('iframe').locator('.tooltip--email');
            await expect(tooltip).toBeVisible();
            await expect(tooltip).toBeInViewport({ ratio: 1 });
        }
    }

    return new IncontextSignupPage();
}
