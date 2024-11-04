import { createPRTemplate } from '../create-pr-template.js'
import { data } from './release-test-helpers.js'

describe('it returns the expected result', () => {
    test('for Android', () => {
        const output = createPRTemplate('android', data)
        /** @type {import('../asana-create-tasks').AsanaOutput} */
        const asanaData = JSON.parse(data.asanaOutputRaw)
        expect(output).toContain(data.version)
        expect(output).toContain(data.releaseNotesRaw)
        expect(output).toContain(data.releaseUrl)
        expect(output).toContain(asanaData.android.taskGid)
        expect(output).not.toContain(data.bskPrUrl)
    })

    test('for iOS', () => {
        const output = createPRTemplate('ios', data)
        /** @type {import('../asana-create-tasks').AsanaOutput} */
        const asanaData = JSON.parse(data.asanaOutputRaw)
        expect(output).toContain(data.version)
        expect(output).toContain(data.releaseNotesRaw)
        expect(output).toContain(data.releaseUrl)
        expect(output).toContain(asanaData.bsk.taskGid)
        expect(output).toContain(data.bskPrUrl)
    })

    test('for macOS', () => {
        const output = createPRTemplate('macos', data)
        /** @type {import('../asana-create-tasks').AsanaOutput} */
        const asanaData = JSON.parse(data.asanaOutputRaw)
        expect(output).toContain(data.version)
        expect(output).toContain(data.releaseNotesRaw)
        expect(output).toContain(data.releaseUrl)
        expect(output).toContain(asanaData.bsk.taskGid)
        expect(output).toContain(data.bskPrUrl)
    })

    test('for extensions', () => {
        const output = createPRTemplate('extensions', data)
        /** @type {import('../asana-create-tasks').AsanaOutput} */
        expect(output).toContain(data.version)
        expect(output).toContain(data.releaseNotesRaw)
        expect(output).toContain(data.releaseUrl)
        expect(output).not.toContain(data.bskPrUrl)
    })
})
