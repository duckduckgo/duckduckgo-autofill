import {
    SetIncontextSignupInitiallyDismissedAtCall,
    SetIncontextSignupPermanentlyDismissedAtCall
} from "../deviceApiCalls/__generated__/deviceApiCalls";

export class IncontextSignup {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    constructor(device) {
        this.device = device;
    }
    onIncontextSignup() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios":
            case "android":
            case "windows":
            case "windows-overlay":
            case "extension": {
                return this.device.firePixel({pixelName: 'incontext_get_email_protection'})
            }
        }
    }
    onIncontextSignupDismissed() {
        switch (this.device.ctx) {
            case "macos-legacy":
            case "macos-modern":
            case "macos-overlay":
            case "ios":
            case "android":
            case "windows":
            case "windows-overlay":
                break;
            case "extension": {
                // Check if the email signup tooltip has previously been dismissed.
                // If it has, make the dismissal persist and remove it from the page.
                // If it hasn't, set a flag for next time and just hide the tooltip.
                if (this.device.settings.incontextSignupInitiallyDismissed) {
                    this.device.settings.setIncontextSignupPermanentlyDismissed(true)
                    this.device.deviceApi.notify(new SetIncontextSignupPermanentlyDismissedAtCall({value: new Date().getTime()}))
                    this.device.removeAutofillUIFromPage()
                    this.device.firePixel({pixelName: 'incontext_dismiss_persisted'})
                } else {
                    this.device.settings.setIncontextSignupInitiallyDismissed(true)
                    this.device.deviceApi.notify(new SetIncontextSignupInitiallyDismissedAtCall({value: new Date().getTime()}))
                    this.device.removeTooltip('onIncontextSignupDismissed')
                    this.device.firePixel({pixelName: 'incontext_dismiss_initial'})
                }
            }
        }
    }
}
