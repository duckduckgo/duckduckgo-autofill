import {createPRTemplate} from '../create-pr-template.js'
import {data} from './release-test-helpers.js'

describe('it returns the expected result', () => {
    test('for Android', () => {
        const output = createPRTemplate('android', data)
        expect(output).toEqual(`**Task/Issue URL:** https://app.asana.com/0/1203244608564622/1203244608564622
**Autofill Release:** https://github.com/duckduckgo/duckduckgo-autofill/releases/tag/1.0.0_test


## Description
Updates Autofill to version [1.0.0_test](https://github.com/duckduckgo/duckduckgo-autofill/releases/tag/1.0.0_test).

### Autofill 1.0.0_test release notes
These are my release notes.

## Steps to test
This release has been tested during autofill development. For smoke test steps see [this task](https://app.asana.com/0/1198964220583541/1200583647142330/f).
`)
    })

    test('for iOS', () => {
        const output = createPRTemplate('ios', data)
        expect(output).toEqual(`**Task/Issue URL:** https://app.asana.com/0/1203244608626550/1203244608626550
**Autofill Release:** https://github.com/duckduckgo/duckduckgo-autofill/releases/tag/1.0.0_test
**BSK PR:** https://github.com/duckduckgo/BrowserServicesKit/pull/159

## Description
Updates Autofill to version [1.0.0_test](https://github.com/duckduckgo/duckduckgo-autofill/releases/tag/1.0.0_test).

### Autofill 1.0.0_test release notes
These are my release notes.

## Steps to test
This release has been tested during autofill development. For smoke test steps see [this task](https://app.asana.com/0/1198964220583541/1200583647142330/f).
`)
    })
})
