import HTMLTooltip from './HTMLTooltip.js'

class EmailSignupHTMLTooltip extends HTMLTooltip {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    render (device) {
        this.device = device

        this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--email">
    <div class="tooltip tooltip--email tooltip--email-signup" hidden>
        <h1>
            Protect your inbox 💪 I've caught trackers hiding in 85% of emails.
        </h1>
        <p>
            Want me to hide your email address and remove hidden trackers before
            forwarding messages to your inbox?
        </p>
        <div class="notice-controls">
            <a href="https://duckduckgo.com/email/start-incontext" target="_blank" class="primary js-get-email-signup">
                Get Email Protection
            </a>
            <button class="ghost js-dismiss-email-signup">
                ${device.emailSignupInitialDismissal ? "Don't Ask Again" : 'Maybe Later'}
            </button>
        </div>
    </div>
</div>`

        this.tooltip = this.shadow.querySelector('.tooltip')

        this.dismissEmailSignup = this.shadow.querySelector('.js-dismiss-email-signup')
        this.registerClickableButton(this.dismissEmailSignup, () => {
            device.onIncontextSignupDismissed()
        })

        this.getEmailSignup = this.shadow.querySelector('.js-get-email-signup')
        this.registerClickableButton(this.getEmailSignup, () => {
            device.onIncontextSignup()
        })

        this.init()
        return this
    }
}

export default EmailSignupHTMLTooltip
