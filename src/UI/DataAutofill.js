const {
    isApp,
    escapeXML
} = require('../autofill-utils')
const Tooltip = require('./Tooltip')
const getInputConfig = require('../Form/inputTypeConfig')

class DataAutofill extends Tooltip {
    constructor (input, associatedForm, Interface) {
        super(input, associatedForm, Interface)

        const config = getInputConfig(input)

        this.data = this.interface[`getLocal${config.dataType}`]()

        const includeStyles = isApp
            ? `<style>${require('./styles/autofill-tooltip-styles.js')}</style>`
            : `<link rel="stylesheet" href="${chrome.runtime.getURL('public/css/autofill.css')}" crossorigin="anonymous">`

        this.shadow.innerHTML = `
${includeStyles}
<div class="wrapper wrapper--data">
    <div class="tooltip tooltip--data" hidden>
        ${this.data.map((singleData) => `
            <button
                class="tooltip__button tooltip__button--data tooltip__button--data--${config.type} js-autofill-button"
                id="${singleData.id}"
            >
                <span>
                    <span>${escapeXML(singleData[config.displayTitlePropName])}</span><br />
                    <span class="tooltip__button__secondary-text">
${escapeXML(singleData[config.displaySubtitlePropName] || config.displaySubtitlePropName)}
                    </span>
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
                this.interface[`${config.autofillMethod}`](btn.id).then(({success, error}) => {
                    if (success) this.associatedForm.autofillData(success, config.type)
                })
            })
        })

        this.init()
    }
}

module.exports = DataAutofill
