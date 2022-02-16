const InterfacePrototype = require('./InterfacePrototype.js')
const {
    notifyWebApp,
    isDDGDomain, sendAndWaitForAnswer
} = require('../autofill-utils')
const {scanForInputs} = require('../scanForInputs.js')

class AndroidInterface extends InterfacePrototype {
    async getAlias () {
        const { alias } = await sendAndWaitForAnswer(() => {
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
        this.getAutofillInitData()

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

    /**
     * Gets the init data from the device
     * @returns {APIResponse<PMData>}
     */
    getAutofillInitData () {
        console.log('getting autofill init')
        const response = window.EmailInterface.getAutofillInitData?.()
        if (response) {
            this.storeLocalData(response.success)
            console.log('hasLocalCredentials', this.hasLocalCredentials)
        }
    }

    /**
     * Gets credentials ready for autofill
     * @returns {APIResponse<CredentialsObject>}
     */
    async getAutofillCredentials () {
        const response = await sendAndWaitForAnswer(
            window.EmailInterface.getAutofillCredentials,
            'getAutofillCredentialsResponse'
        )
        console.log('receiving creds', response)
        return response.getAutofillCredentialsResponse
    }
}

module.exports = AndroidInterface
