const {
    isApp,
    isTopFrame,
    escapeXML
} = require('../autofill-utils')
const Tooltip = require('./Tooltip')

class DataAutofill extends Tooltip {
    constructor (config, inputType, position, deviceInterface) {
        super(config, inputType, position, deviceInterface)

        this.data = this.interface[`getLocal${config.dataType}`]()

        if (config.type === 'identities') {
            // For identities, we don't show options where this subtype is not available
            this.data = this.data.filter((singleData) => !!singleData[this.subtype])
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

        const topClass = isTopFrame ? 'top-autofill' : ''

        this.shadow.innerHTML = `
${includeStyles}
<div class="wrapper wrapper--data ${topClass}">
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
${escapeXML(config.displayTitlePropName(this.subtype, singleData))}
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
                        this.fillForm(success)
                    }
                })
            })
        })

        this.init()
    }
    async fillForm (data) {
        if (data.id === 'privateAddress') {
            await this.interface.refreshAlias()
        }
        this.interface.selectedDetail(data, this.config.type)
    }
}

module.exports = DataAutofill
