import {
    GetIncontextSignupDismissedAtCall,
    SetIncontextSignupInitiallyDismissedAtCall,
    SetIncontextSignupPermanentlyDismissedAtCall
} from './deviceApiCalls/__generated__/deviceApiCalls.js'

export class InContextSignup {
    permanentlyDismissed = false
    initiallyDismissed = false

    /**
     * @param {import("./DeviceInterface/InterfacePrototype").default} device
     */
    constructor (device) {
        this.device = device
    }

    async init () {
        const incontextSignupDismissedAt = await this.device.deviceApi.request(new GetIncontextSignupDismissedAtCall(null))
        this.permanentlyDismissed = Boolean(incontextSignupDismissedAt.permanentlyDismissedAt)
        this.initiallyDismissed = Boolean(incontextSignupDismissedAt.initiallyDismissedAt)
    }

    onIncontextSignup () {
        this.device.firePixel({pixelName: 'incontext_get_email_protection'})
    }

    onIncontextSignupDismissed () {
        // Check if the email signup tooltip has previously been dismissed.
        // If it has, make the dismissal persist and remove it from the page.
        // If it hasn't, set a flag for next time and just hide the tooltip.
        if (this.initiallyDismissed) {
            this.permanentlyDismissed = true
            this.device.deviceApi.notify(new SetIncontextSignupPermanentlyDismissedAtCall({ value: new Date().getTime() }))
            this.device.removeAutofillUIFromPage()
            this.device.firePixel({pixelName: 'incontext_dismiss_persisted'})
        } else {
            this.initiallyDismissed = true
            this.device.deviceApi.notify(new SetIncontextSignupInitiallyDismissedAtCall({ value: new Date().getTime() }))
            this.device.removeTooltip()
            this.device.firePixel({pixelName: 'incontext_dismiss_initial'})
        }
    }
}
