import {constants} from '../mocks.js'
import {expect} from '@playwright/test'
import {clickOnIcon} from '../utils.js'
import { withEmailProtectionExtensionSignedInAs } from '../harness.js'

/**
 * @param {import("@playwright/test").Page} page
 * @param {object} [opts]
 * @param {string} [opts.platform]
 * @param {string} [opts.username]
 */
export async function incontextSignupPage (page, opts) {
    const { platform, username } = { platform: 'extension', username: '', ...opts }
    const isExtension = platform === 'extension'
    const {selectors} = constants.fields.email
    const getCallToAction = () => {
        if (username) {
            return page.locator(`text=${username}`)
        }

        const text = isExtension ? 'Protect My Email' : 'Hide your email and block trackers'
        return page.locator(`text=${text}`)
    }
    const getTooltip = () => page.locator('.tooltip--email, .tooltip--incontext-signup')

    if (username) {
        await withEmailProtectionExtensionSignedInAs(page, username)
    }

    class IncontextSignupPage {
        /**
         * @param {keyof typeof constants.pages} [to] - any key matching in `constants.pages`
         */
        async navigate (domain, to = 'iframeContainer') {
            const pageName = constants.pages[to]
            const pagePath = `/${pageName}`
            await page.goto(new URL(pagePath, domain).href)
        }

        async assertIsShowing () {
            await expect(getCallToAction()).toBeVisible()
            await expect(getTooltip()).toBeInViewport({ratio: 1})
        }

        async assertIsHidden () {
            await expect(getCallToAction()).toBeHidden()
        }

        async getEmailProtection () {
            (await getCallToAction()).click({timeout: 500})
        }

        async dismissTooltipWith (text) {
            const dismissTooltipButton = await page.locator(`text=${text}`)
            await dismissTooltipButton.click({timeout: 500})
        }

        async closeTooltip () {
            if (username) {
                await page.keyboard.press('Escape')
                return
            }
            const dismissTooltipButton = await page.locator(`[aria-label=Close]`)
            await dismissTooltipButton.click({timeout: 500})
        }

        async clickDirectlyOnDax () {
            const input = page.locator(selectors.identity)
            await clickOnIcon(input)
        }

        async clickDirectlyOnDaxInIframe () {
            const input = await page.frameLocator('iframe').locator('input#email')
            await clickOnIcon(input)
        }

        async assertTooltipWithinFrame () {
            const tooltip = await page.frameLocator('iframe').locator('.tooltip--email')
            await expect(tooltip).toBeVisible()
            await expect(tooltip).toBeInViewport({ratio: 1})
        }
    }

    return new IncontextSignupPage()
}
