const {
    isApp,
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
        ${this.credentials.map(({username, id}) => `
            <button class="tooltip__button tooltip__button--credentials js-autofill-button" id="${id}">
                <span>
                    <span>${escapeXML(username)}</span><br />
                    <span class="tooltip__button__password">•••••••••••••••</span>
                </span>
            </button>
        `).join('')}
    </div>
</div>`
        this.wrapper = this.shadow.querySelector('.wrapper')
        this.tooltip = this.shadow.querySelector('.tooltip')
        this.autofillButtons = this.shadow.querySelectorAll('.js-autofill-button')

        this.autofillButtons.forEach((btn) => {
            this.registerClickableButton(btn, () => {
                this.interface.getAutofillCredentials(btn.id).then(({success, error}) => {
                    if (success) this.associatedForm.autofillCredentials(success)
                })
            })
        })

        this.init()
    }
}

module.exports = CredentialsAutofill
