const {
    isApp,
    escapeXML
} = require('../autofill-utils')
const Tooltip = require('./Tooltip')
const getInputConfig = require('../Form/inputTypeConfig')
const {getInputSubtype} = require('../Form/matching')

class DataAutofill extends Tooltip {
    constructor (input, associatedForm, deviceInterface) {
        super(input, associatedForm, deviceInterface)

        const config = getInputConfig(input)
        const subtype = getInputSubtype(input)

        this.data = this.interface[`getLocal${config.dataType}`]()

        if (config.type === 'identities') {
            // For identities, we don't show options where this subtype is not available
            this.data = this.data.filter((singleData) => !!singleData[subtype])
        }

        const includeStyles = isApp
            ? `<style>${require('./styles/autofill-tooltip-styles.js')}</style>`
            : `<link rel="stylesheet" href="${chrome.runtime.getURL('public/css/autofill.css')}" crossorigin="anonymous">`

        let hasAddedSeparator = false
        // Only show an hr above the first duck address button, but it can be either personal or private
        const shouldShowSeparator = (dataId) => {
            const shouldShow = ['personalAddress', 'privateAddress'].includes(dataId) && !hasAddedSeparator
            if (shouldShow) hasAddedSeparator = true
            return shouldShow
        }

        this.shadow.innerHTML = `
${includeStyles}
<div class="wrapper wrapper--data">
    <div class="tooltip tooltip--data" hidden>
        ${this.data.map((singleData) => `
            ${shouldShowSeparator(singleData.id) ? '<hr />' : ''}
            <button
                class="tooltip__button tooltip__button--data tooltip__button--data--${config.type} js-autofill-button"
                id="${singleData.id}"
            >
                <span class="tooltip__button__text-container">
                    <span class="tooltip__button__primary-text">
${singleData.id === 'privateAddress' ? 'Generated Private Address\n' : ''}
${escapeXML(config.displayTitlePropName(input, singleData))}
                    </span><br />
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
                this.interface[`${config.autofillMethod}`](btn.id).then(({success}) => {
                    if (success) {
                        this.associatedForm.autofillData(success, config.type)
                        if (btn.id === 'privateAddress') this.interface.refreshAlias()
                    }
                })
            })
        })

        this.init()
    }
}

module.exports = DataAutofill
