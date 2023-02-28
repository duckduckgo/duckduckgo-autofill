import {
    GetIncontextSignupDismissedAtCall,
    SetIncontextSignupInitiallyDismissedAtCall,
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
        this.initiallyDismissedAt = incontextSignupDismissedAt.initiallyDismissedAt
    }

    isPermanentlyDismissed () {
        return Boolean(this.permanentlyDismissedAt)
    }

    isInitiallyDismissed () {
        return Boolean(this.initiallyDismissedAt)
    }

    isOnValidDomain () {
        // Only show in-context signup if we've high confidence that the page is
        // not internally hosted or an intranet
        return isValidTLD() && !isLocalNetwork()
    }

    isAvailable () {
        const isEnabled = this.device.settings?.featureToggles.emailProtection_incontext_signup
        const isLoggedIn = this.device.isDeviceSignedIn()
        return isEnabled && !isLoggedIn && !this.isPermanentlyDismissed() && this.isOnValidDomain()
    }

    onIncontextSignup () {
        this.device.firePixel({pixelName: 'incontext_get_email_protection'})
    }

    onIncontextSignupDismissed () {
        // Check if the email signup tooltip has previously been dismissed.
        // If it has, make the dismissal persist and remove it from the page.
        // If it hasn't, set a flag for next time and just hide the tooltip.
        if (this.isInitiallyDismissed()) {
            this.permanentlyDismissedAt = new Date().getTime()
            this.device.deviceApi.notify(new SetIncontextSignupPermanentlyDismissedAtCall({ value: this.permanentlyDismissedAt }))
            this.device.removeAutofillUIFromPage()
            this.device.firePixel({pixelName: 'incontext_dismiss_persisted'})
        } else {
            this.initiallyDismissedAt = new Date().getTime()
            this.device.deviceApi.notify(new SetIncontextSignupInitiallyDismissedAtCall({ value: this.initiallyDismissedAt }))
            this.device.removeTooltip()
            this.device.firePixel({pixelName: 'incontext_dismiss_initial'})
        }
    }
}
