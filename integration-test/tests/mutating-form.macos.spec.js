import {createAutofillScript, forwardConsoleMessages} from '../helpers/harness.js'
import {createWebkitMocks, macosContentScopeReplacements} from '../helpers/mocks.webkit.js'
import {mutatingFormPage} from '../helpers/pages.js'
import {test as base} from '@playwright/test'
import {createAvailableInputTypes} from '../helpers/utils.js'
import {constants} from '../helpers/mocks.js'

/**
 *  Tests for various auto-fill scenarios on macos
 */
const test = base.extend({})

const {personalAddress} = constants.fields.email
const password = '123456'

test.describe('Mutating form page', () => {
    async function applyScript (page) {
        await createAutofillScript()
            .replaceAll(macosContentScopeReplacements())
            .platform('macos')
            .applyTo(page)
    }

    test('works fine on macOS', async ({page}) => {
        // enable in-terminal exceptions
        await forwardConsoleMessages(page)
        await createWebkitMocks()
            .withAvailableInputTypes(createAvailableInputTypes())
            .withCredentials({
                id: '01',
                username: personalAddress,
                password,
                credentialsProvider: 'duckduckgo'
            })
            .applyTo(page)

        // Load the autofill.js script with replacements
        await await applyScript(page)

        const mutatingForm = mutatingFormPage(page)
        await mutatingForm.navigate()

        await mutatingForm.passwordFieldShowsGenKey()

        await mutatingForm.toggleLoginOrSignup()

        await mutatingForm.passwordFieldShowsFillKey()
    })
})
