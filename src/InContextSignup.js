import {
    GetIncontextSignupDismissedAtCall,
    SetIncontextSignupPermanentlyDismissedAtCall
} from './deviceApiCalls/__generated__/deviceApiCalls.js'
import { isLocalNetwork, isValidTLD } from './autofill-utils.js'

export class InContextSignup {
    /**
     * @param {import("./DeviceInterface/InterfacePrototype").default} device
     */
    constructor (device) {
        this.device = device
    }

    async init () {
        await this.refreshData()
    }

    async refreshData () {
        const incontextSignupDismissedAt = await this.device.deviceApi.request(new GetIncontextSignupDismissedAtCall(null))
        this.permanentlyDismissedAt = incontextSignupDismissedAt.permanentlyDismissedAt
        this.isInstalledRecently = incontextSignupDismissedAt.isInstalledRecently
    }

    isPermanentlyDismissed () {
        return Boolean(this.permanentlyDismissedAt)
    }

    isOnValidDomain () {
        // Only show in-context signup if we've high confidence that the page is
        // not internally hosted or an intranet
        return isValidTLD() && !isLocalNetwork()
    }

    isAvailable () {
        const isEnabled = this.device.settings?.featureToggles.emailProtection_incontext_signup
        const isLoggedIn = this.device.isDeviceSignedIn()
        return isEnabled && !isLoggedIn && !this.isPermanentlyDismissed() && this.isOnValidDomain() && this.isInstalledRecently
    }

    onIncontextSignup () {
        this.device.firePixel({pixelName: 'incontext_get_email_protection'})
    }

    onIncontextSignupDismissed () {
        this.device.removeAutofillUIFromPage()
        this.permanentlyDismissedAt = new Date().getTime()
        this.device.deviceApi.notify(new SetIncontextSignupPermanentlyDismissedAtCall({ value: this.permanentlyDismissedAt }))
        this.device.firePixel({pixelName: 'incontext_dismiss_persisted'})
    }
}
