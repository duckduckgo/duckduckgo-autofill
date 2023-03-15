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
            identities: false
        },
        featureToggles: {
            inputType_credentials: true,
            inputType_identities: false,
            inputType_creditCards: false
        },
        canAutofillType: (type) => {
            if (type === 'credentials') return true
            return false
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
    },
    attachTooltip (...args) {
        console.log('device.attachTooltip', args)
    }
}

// @ts-ignore
const scanner = createScanner(mockInterface, {
    initialDelay: 1 // allow debugging directly on macOS - if this was 0 then it would try to use requestIdleCallback, which is absent in WebKit
})

scanner.init()

setTimeout(() => {
    console.group('forms')
    for (const [formElement, formInstance] of scanner.forms) {
        const { isLogin, isSignup, formAnalyzer, inputs, submitButtons } = formInstance
        console.log(formElement)
        console.log({
            isLogin,
            isSignup,
            submitButtons,
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
