import InterfacePrototype from './InterfacePrototype.js'
import { sendAndWaitForAnswer } from '../autofill-utils'
import { NativeUIController } from '../UI/controllers/NativeUIController.js'

class AndroidInterface extends InterfacePrototype {
    async getAlias () {
        const { alias } = await sendAndWaitForAnswer(() => {
            return window.EmailInterface.showTooltip()
        }, 'getAliasResponse')
        return alias
    }

    /**
     * @override
     */
    createUIController () {
        return new NativeUIController()
    }

    isDeviceSignedIn () {
        // isDeviceSignedIn is only available on DDG domains...
        if (this.globalConfig.isDDGDomain) return window.EmailInterface.isSignedIn() === 'true'

        // ...on other domains we assume true because the script wouldn't exist otherwise
        return true
    }

    async setupAutofill () {
        if (this.isDeviceSignedIn()) {
            const cleanup = this.scanner.init()
            this.addLogoutListener(cleanup)
        }
    }

    /**
     * Used by the email web app
     * Settings page displays data of the logged in user data
     */
    getUserData () {
        let userData = null

        try {
            userData = JSON.parse(window.EmailInterface.getUserData())
        } catch (e) {
            if (this.globalConfig.isDDGTestMode) {
                console.error(e)
            }
        }

        return Promise.resolve(userData)
    }

    /**
     * Used by the email web app
     * Device capabilities determine which functionality is available to the user
     */
    getEmailProtectionCapabilities () {
        let deviceCapabilities = null

        try {
            deviceCapabilities = JSON.parse(window.EmailInterface.getDeviceCapabilities())
        } catch (e) {
            if (this.globalConfig.isDDGTestMode) {
                console.error(e)
            }
        }

        return Promise.resolve(deviceCapabilities)
    }

    storeUserData ({addUserData: {token, userName, cohort}}) {
        return window.EmailInterface.storeCredentials(token, userName, cohort)
    }

    /**
      * Used by the email web app
      * Provides functionality to log the user out
      */
    removeUserData () {
        try {
            return window.EmailInterface.removeCredentials()
        } catch (e) {
            if (this.globalConfig.isDDGTestMode) {
                console.error(e)
            }
        }
    }

    addLogoutListener (handler) {
        // Only deal with logging out if we're in the email web app
        if (!this.globalConfig.isDDGDomain) return

        window.addEventListener('message', (e) => {
            if (this.globalConfig.isDDGDomain && e.data.emailProtectionSignedOut) {
                handler()
            }
        })
    }
}

export {AndroidInterface}
