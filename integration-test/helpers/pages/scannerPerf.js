import { constants } from '../mocks.js'
import { performanceEntries } from '../harness.js'
import { expect } from '@playwright/test'

/**
 * A wrapper around interactions for `integration-test/pages/scanner-perf.html`
 *
 * @param {import("@playwright/test").Page} page
 */
export function scannerPerf(page) {
    return /** @type {const} */ ({
        async navigate(url = constants.pages['scanner-perf']) {
            await page.goto(url, { waitUntil: 'load' })
        },
        async validateInitialScanPerf(expectedDuration) {
            const entries = await performanceEntries(page, 'initial_scanner:init')

            expect(entries).toHaveLength(1)

            // we only care about the first one (for now)
            const entry = entries[0]
            console.log(`🏎💨 initial scan took: ${Math.round(entry.duration)}ms`)

            expect(entry.duration).toBeLessThan(expectedDuration)
        },
    })
}
