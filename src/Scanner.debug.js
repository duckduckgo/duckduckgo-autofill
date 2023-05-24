import { createScanner } from './Scanner.js'

sessionStorage.setItem('ddg-autofill-debug', 'true')

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
