const {
    formatDuckAddress,
    escapeXML
} = require('../autofill-utils')
const Tooltip = require('./Tooltip')

class EmailAutofill extends Tooltip {
    /**
     * @param config
     * @param inputType
     * @param position
     * @param {import("../DeviceInterface/InterfacePrototype")} deviceInterface
     */
    constructor (config, inputType, position, deviceInterface) {
        super(config, inputType, position, deviceInterface)

        this.addresses = this.interface.getLocalAddresses()

        const includeStyles = deviceInterface.globalConfig.isApp
            ? `<style>${require('./styles/autofill-tooltip-styles.js')}</style>`
            : `<link rel="stylesheet" href="${chrome.runtime.getURL('public/css/autofill.css')}" crossorigin="anonymous">`

        this.shadow.innerHTML = `
${includeStyles}
<div class="wrapper wrapper--email">
    <div class="tooltip tooltip--email" hidden>
        <button class="tooltip__button tooltip__button--email js-use-personal">
            <span class="tooltip__button--email__primary-text">
                Use <span class="js-address">${formatDuckAddress(escapeXML(this.addresses.personalAddress))}</span>
            </span>
            <span class="tooltip__button--email__secondary-text">Blocks email trackers</span>
        </button>
        <button class="tooltip__button tooltip__button--email js-use-private">
            <span class="tooltip__button--email__primary-text">Use a Private Address</span>
            <span class="tooltip__button--email__secondary-text">Blocks email trackers and hides your address</span>
        </button>
    </div>
</div>`
        this.wrapper = this.shadow.querySelector('.wrapper')
        this.tooltip = this.shadow.querySelector('.tooltip')
        this.usePersonalButton = this.shadow.querySelector('.js-use-personal')
        this.usePrivateButton = this.shadow.querySelector('.js-use-private')
        this.addressEl = this.shadow.querySelector('.js-address')

        this.updateAddresses = (addresses) => {
            if (addresses && this.addressEl) {
                this.addresses = addresses
                this.addressEl.textContent = formatDuckAddress(addresses.personalAddress)
            }
        }
        this.registerClickableButton(this.usePersonalButton, () => {
            this.fillForm('personalAddress')
        })
        this.registerClickableButton(this.usePrivateButton, () => {
            this.fillForm('privateAddress')
        })

        // Get the alias from the extension
        this.interface.getAddresses().then(this.updateAddresses)

        this.init()
    }
    /**
     * @param {'personalAddress' | 'privateAddress'} id
     */
    async fillForm (id) {
        const address = this.addresses[id]
        const formattedAddress = formatDuckAddress(address)
        this.interface.selectedDetail({email: formattedAddress, id}, 'email')
    }
}

module.exports = EmailAutofill
