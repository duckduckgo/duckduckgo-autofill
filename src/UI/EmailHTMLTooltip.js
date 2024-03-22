import { formatDuckAddress, escapeXML } from '../autofill-utils.js'
import HTMLTooltip from './HTMLTooltip.js'

function useDuckAddrCta (username) {
    return `Use ${formatDuckAddress(escapeXML(username))}`
}

class EmailHTMLTooltip extends HTMLTooltip {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    render (device) {
        this.device = device
        this.addresses = device.getLocalAddresses()

        this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--email" hidden>
    <div class="tooltip tooltip--email">
        <button class="tooltip__button tooltip__button--email js-use-personal">
            <span class="tooltip__button--email__primary-text">
                ${useDuckAddrCta(this.addresses.personalAddress)}
            </span>
            <span class="tooltip__button--email__secondary-text">Block email trackers</span>
        </button>
        <button class="tooltip__button tooltip__button--email js-use-private">
            <span class="tooltip__button--email__primary-text">Generate a Private Duck Address</span>
            <span class="tooltip__button--email__secondary-text">Block email trackers & hide address</span>
        </button>
    </div>
    <div class="tooltip--email__caret"></div>
</div>`
        this.wrapper = this.shadow.querySelector('.wrapper')
        this.tooltip = this.shadow.querySelector('.tooltip')
        this.usePersonalButton = this.shadow.querySelector('.js-use-personal')
        this.usePrivateButton = this.shadow.querySelector('.js-use-private')
        this.usePersonalCta = this.shadow.querySelector('.js-use-personal .tooltip__button--email__primary-text')

        this.updateAddresses = (addresses) => {
            if (addresses && this.usePersonalCta) {
                this.addresses = addresses
                this.usePersonalCta.textContent = useDuckAddrCta(addresses.personalAddress)
            }
        }

        const firePixel = this.device.firePixel.bind(this.device)

        this.registerClickableButton(this.usePersonalButton, () => {
            this.fillForm('personalAddress')
            firePixel({pixelName: 'autofill_personal_address'})
        })
        this.registerClickableButton(this.usePrivateButton, () => {
            this.fillForm('privateAddress')
            firePixel({pixelName: 'autofill_private_address'})
        })

        // Get the alias from the extension
        this.device.getAddresses().then(this.updateAddresses)

        this.init()
        return this
    }
    /**
     * @param {'personalAddress' | 'privateAddress'} id
     */
    async fillForm (id) {
        const address = this.addresses[id]
        const formattedAddress = formatDuckAddress(address)
        this.device?.selectedDetail({email: formattedAddress, id}, 'email')
    }
}

export default EmailHTMLTooltip
