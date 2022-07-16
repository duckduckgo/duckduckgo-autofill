import { createScanner } from './Scanner.js'

/**
 * Scanner.debug.js
 *
 * Load this script into any HTML to debug Scanning logic
 */

/**
 * Mock just enough of the device interface to prevent errors.
 */
const mockInterface = {
    settings: {
        availableInputTypes: {
            credentials: true,
            identities: true
        },
        featureToggles: {
            inputType_credentials: true,
            inputType_identities: true,
            inputType_creditCards: true
        }
    },
    globalConfig: {
        isDDGApp: true
    },
    getLocalIdentities () {
        return []
    },
    isDeviceSignedIn () {
        return false
    }
}

// @ts-ignore
const scanner = createScanner(mockInterface, {
    initialDelay: 0
})

scanner.init()

setTimeout(() => {
    console.group('forms')
    for (const [formElement, { isLogin, isSignup, formAnalyzer, inputs }] of scanner.forms) {
        console.log(formElement)
        console.log({
            isLogin,
            isSignup,
            autofillSignal: formAnalyzer.autofillSignal,
            signals: formAnalyzer.signals
        })
        console.group('inputs')
        for (let input of inputs.all) {
            console.log(input)
        }
        console.groupEnd()
    }
    console.groupEnd()
}, 500)
