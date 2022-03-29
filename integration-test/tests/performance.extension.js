/**
 *  Performance testing
 */
import { setup } from '../helpers/harness.js'
import ss from '../../src/Form/test-cases/index.js'
import * as fs from 'fs'
const baseline = JSON.parse(fs.readFileSync('./integration-test/stats/scan-original.json', 'utf8'))

xdescribe('Performance measuring', () => {
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

    /**
     * Initial: 110ms
     */
    it('measures `findEligibleInputs` against real-world tests', async () => {
        async function run (url) {
            const page = await browser.newPage()
            page.on('console', (mdg) => {
                const text = mdg.text()
                console.log(`${[mdg.type()]}`, text)
                if (text.startsWith('~') || text.startsWith('\t~')) {
                }
            })
            await gotoAndWait(page, `http://localhost:${server.address().port}/${url}`)
            const entries = JSON.parse(await page.evaluate(() => {
                window.performance.measure('findEligibleInputs', 'findEligibleInputs:start', 'findEligibleInputs:end')
                return JSON.stringify([...window.performance.getEntriesByName('findEligibleInputs')])
            }))
            const findEligibleInputs = entries.find(x => x.name === 'findEligibleInputs')
            await page.close()
            return { findEligibleInputs }
        }

        /**
         * @param regex
         * @return {Promise<void>}
         */
        async function runFor (regex) {
            // chunks of 5 to run concurrently
            const size = 5
            const array = ss.filter(x => x.html.match(regex))

            const chunks = []
            let current = []

            array.forEach((number, index) => {
                current.push(number)
                if (current.length === size) {
                    chunks.push(current.slice())
                    current = []
                } else if (index === array.length - 1) {
                    chunks.push(current.slice())
                    current = []
                }
            })

            let results = []
            for (let urls of chunks) {
                const allResults = await Promise.all(urls.map(test => {
                    return run(`src/Form/test-cases/${test.html}`)
                        .then(res => {
                            return {
                                url: test.html,
                                duration: res.findEligibleInputs.duration.toFixed(2)
                            }
                        })
                }))
                results.push(...allResults)
            }

            const displayItems = []
            results.forEach((result) => {
                const original = baseline.find(item => item.url === result.url)
                if (!original) {
                    console.log('not found in original data', result.url)
                } else {
                    const diff = (original.duration - result.duration).toFixed(2)
                    displayItems.push({
                        url: result.url,
                        original: original.duration,
                        current: result.duration,
                        diffstr: diff > 0 ? `✅ -${diff}ms` : `❌ +${Math.abs(diff)}ms`,
                        p: (100 - ((result.duration / original.duration) * 100)).toFixed(2) + '% faster',
                        diff: diff
                    })
                }
            })

            console.table(displayItems.sort((a, b) => b.diff - a.diff))
        }

        // run 3 times for the given regexes
        await runFor(/steam_checkout|oil|steam|ups/)
        await runFor(/steam_checkout|oil|steam|ups/)
        await runFor(/steam_checkout|oil|steam|ups/)
    })
})
