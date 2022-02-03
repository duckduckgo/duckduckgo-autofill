const InterfacePrototype = require('./InterfacePrototype.js')
const {
    notifyWebApp,
    isDDGDomain, sendAndWaitForAnswer
} = require('../autofill-utils')
const {scanForInputs} = require('../scanForInputs.js')

class AndroidInterface extends InterfacePrototype {
    async getAlias () {
        // @ts-ignore
        const { alias } = sendAndWaitForAnswer(() => {
            return window.EmailInterface.showTooltip()
        }, 'getAliasResponse')
        return alias
    }

    isDeviceSignedIn () {
        // isDeviceSignedIn is only available on DDG domains...
        if (isDDGDomain()) return window.EmailInterface.isSignedIn() === 'true'

        // ...on other domains we assume true because the script wouldn't exist otherwise
        return true
    }

    setupAutofill ({shouldLog} = {shouldLog: false}) {
        if (this.isDeviceSignedIn()) {
            notifyWebApp({ deviceSignedIn: {value: true, shouldLog} })
            const cleanup = scanForInputs(this).init()
            this.addLogoutListener(cleanup)
        } else {
            this.trySigningIn()
        }
    }

    storeUserData ({addUserData: {token, userName, cohort}}) {
        return window.EmailInterface.storeCredentials(token, userName, cohort)
    }
}

module.exports = AndroidInterface
