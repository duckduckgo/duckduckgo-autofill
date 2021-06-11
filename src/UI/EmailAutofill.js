const {
    isApp,
    formatAddress,
    safeExecute,
    escapeXML
} = require('../autofill-utils')
const Tooltip = require('./Tooltip')

class EmailAutofill extends Tooltip {
    constructor (input, associatedForm, Interface) {
        super(input, associatedForm, Interface)

        this.addresses = this.interface.getLocalAddresses()

        const includeStyles = isApp
            ? `<style>${require('./styles/DDGAutofill-styles.js')}</style>`
            : `<link rel="stylesheet" href="${chrome.runtime.getURL('public/css/autofill.css')}" crossorigin="anonymous">`

        this.shadow.innerHTML = `
${includeStyles}
<div class="wrapper">
    <div class="tooltip" hidden>
        <button class="tooltip__button tooltip__button--secondary js-use-personal">
            <span class="tooltip__button__primary-text">
                Use <span class="js-address">${formatAddress(escapeXML(this.addresses.personalAddress))}</span>
            </span>
            <span class="tooltip__button__secondary-text">Blocks email trackers</span>
        </button>
        <button class="tooltip__button tooltip__button--primary js-use-private">
            <span class="tooltip__button__primary-text">Use a Private Address</span>
            <span class="tooltip__button__secondary-text">Blocks email trackers and hides your address</span>
        </button>
    </div>
</div>`
        this.wrapper = this.shadow.querySelector('.wrapper')
        this.tooltip = this.shadow.querySelector('.tooltip')
        this.usePersonalButton = this.shadow.querySelector('.js-use-personal')
        this.usePrivateButton = this.shadow.querySelector('.js-use-private')
        this.addressEl = this.shadow.querySelector('.js-address')

        this.updateAddresses = (addresses) => {
            if (addresses) {
                this.addresses = addresses
                this.addressEl.textContent = formatAddress(addresses.personalAddress)
            }
        }
        this.usePersonalButton.addEventListener('click', (e) => {
            if (!e.isTrusted) return
            e.stopImmediatePropagation()

            safeExecute(this.usePersonalButton, () => {
                this.associatedForm.autofillEmail(formatAddress(this.addresses.personalAddress))
            })
        })
        this.usePrivateButton.addEventListener('click', (e) => {
            if (!e.isTrusted) return
            e.stopImmediatePropagation()

            safeExecute(this.usePersonalButton, () => {
                this.associatedForm.autofillEmail(formatAddress(this.addresses.privateAddress))
                this.interface.refreshAlias()
            })
        })

        // Get the alias from the extension
        this.interface.getAddresses().then(this.updateAddresses)

        this.init()
    }
}

module.exports = EmailAutofill
