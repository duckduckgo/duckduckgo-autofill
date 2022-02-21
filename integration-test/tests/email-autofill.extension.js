/**
 *  Tests for email autofill
 */
import { setup } from '../helpers/harness.js'

describe('Ensure email autofill works in extension', () => {
    /**
     * @type {import("puppeteer").Browser}
     */
    let browser
    let server
    let teardown
    let setupServer
    let gotoAndWait
    beforeAll(async () => {
        ({ browser, setupServer, teardown, gotoAndWait } = await setup({ withExtension: true }))
        server = setupServer()
    })
    afterAll(async () => {
        await server?.close()
        await teardown()
    })

    it('should populate and select email autofill', async () => {
        const page = await browser.newPage()
        const selector = '[data-ddg-inputtype="identities.emailAddress"]'
        await gotoAndWait(page, `http://localhost:${server.address().port}/email-autofill.html`)
        const inputElement = await page.$(selector)
        await inputElement.click()
        const autofill = await page.$(`ddg-autofill`)
        const buttons = await autofill.$$('pierce/button')

        // assert values are populated into the email tooltip
        const button1Text = await page.evaluate(elem => elem.textContent.trim(), buttons[0])
        expect(button1Text).toContain('shane-123@duck.com')
        expect(button1Text).toContain('Blocks email trackers')

        const button2Text = await page.evaluate(elem => elem.textContent.trim(), buttons[1])
        expect(button2Text).toContain('Use a Private Address')
        expect(button2Text).toContain('Blocks email trackers and hides your address')

        // now check that selecting an element works
        await buttons[0].click()

        // this is to avoid race conditions with checking the field's value before it's set.
        await page.waitForFunction(() => document.querySelector('[data-ddg-inputtype="identities.emailAddress"]').value === 'shaness-123@duck.com', {polling: 100, timeout: 2000})
    })
})
