const {
    isApp,
    safeExecute,
    escapeXML
} = require('../autofill-utils')
const Tooltip = require('./Tooltip')

class CredentialsAutofill extends Tooltip {
    constructor (input, associatedForm, Interface) {
        super(input, associatedForm, Interface)

        this.credentials = this.interface.getLocalCredentials()

        const includeStyles = isApp
            ? `<style>${require('./styles/autofill-tooltip-styles.js')}</style>`
            : `<link rel="stylesheet" href="${chrome.runtime.getURL('public/css/autofill.css')}" crossorigin="anonymous">`

        this.shadow.innerHTML = `
${includeStyles}
<div class="wrapper wrapper--credentials">
    <div class="tooltip tooltip--credentials" hidden>
        <button class="tooltip__button tooltip__button--credentials js-autofill-button">
            <span>
                <span class="js-address">${escapeXML(this.credentials[0].username)}</span><br />
                <span class="tooltip__button__password">•••••••••••••••</span>
            </span>
        </button>
    </div>
</div>`
        this.wrapper = this.shadow.querySelector('.wrapper')
        this.tooltip = this.shadow.querySelector('.tooltip')
        this.autofillButton = this.shadow.querySelector('.js-autofill-button')

        this.autofillButton.addEventListener('click', (e) => {
            if (!e.isTrusted) return
            e.stopImmediatePropagation()

            safeExecute(this.autofillButton, () => {
                this.interface.getAutofillCredentials().then(({success, error}) => {
                    if (success) this.associatedForm.autofillCredentials(success)
                })
            })
        })

        this.init()
    }
}

module.exports = CredentialsAutofill
