import HTMLTooltip from './HTMLTooltip.js'

class CredentialsImportTooltip extends HTMLTooltip {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype.js").default} device
     * @param {{ onStarted(): void }} callbacks
     */
    render (device, callbacks) {
        this.device = device
        const t = device.t

        this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--data top-autofill" hidden>
    <div class="tooltip tooltip--data">
        <button class="tooltip__button tooltip__button--data tooltip__button--credentials-import js-promo-wrapper">
            <span class="tooltip__button__text-container">
                <span class="label label--medium">${t('autofill:credentialsImportHeading')}</span>
                <span class="label label--small">${t('autofill:credentialsImportText')}</span>
            </span>
        </button>
    </div>
</div>
`

        this.tooltip = this.shadow.querySelector('.tooltip')

        this.buttonWrapper = this.shadow.querySelector('.js-promo-wrapper')
        this.registerClickableButton(this.buttonWrapper, () => {
            callbacks.onStarted()
        })

        this.init()
        return this
    }
}

export default CredentialsImportTooltip
