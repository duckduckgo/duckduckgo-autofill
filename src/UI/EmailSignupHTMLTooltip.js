import HTMLTooltip from './HTMLTooltip.js'

class EmailSignupHTMLTooltip extends HTMLTooltip {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    render (device) {
        this.device = device

        this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--email" hidden>
    <div class="tooltip tooltip--email tooltip--email-signup">
        <button class="close-tooltip js-close-email-signup" aria-label="Close"></button>
        <h1>
            Hide your email and block trackers
        </h1>
        <p>
            Create a unique, random address that also removes hidden trackers and forwards email to your inbox.
        </p>
        <div class="notice-controls">
            <a href="https://duckduckgo.com/email/start-incontext" target="_blank" class="primary js-get-email-signup">
                Protect My Email
            </a>
            <button class="ghost js-dismiss-email-signup">
                Don't Show Again
            </button>
        </div>
    </div>
    <div class="tooltip--email__caret"></div>
</div>`

        this.tooltip = this.shadow.querySelector('.tooltip')

        this.closeEmailSignup = this.shadow.querySelector('.js-close-email-signup')
        this.registerClickableButton(this.closeEmailSignup, () => {
            device.inContextSignup?.onIncontextSignupClosed()
        })

        this.dismissEmailSignup = this.shadow.querySelector('.js-dismiss-email-signup')
        this.registerClickableButton(this.dismissEmailSignup, () => {
            device.inContextSignup?.onIncontextSignupDismissed()
        })

        this.getEmailSignup = this.shadow.querySelector('.js-get-email-signup')
        this.registerClickableButton(this.getEmailSignup, () => {
            device.inContextSignup?.onIncontextSignup()
        })

        this.init()
        return this
    }
}

export default EmailSignupHTMLTooltip
