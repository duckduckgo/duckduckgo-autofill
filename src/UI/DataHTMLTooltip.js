import { escapeXML } from '../autofill-utils.js'
import HTMLTooltip from './HTMLTooltip.js'

class DataHTMLTooltip extends HTMLTooltip {
    /**
     * @param {InputTypeConfigs} config
     * @param {TooltipItemRenderer[]} items
     * @param {{onSelect(id:string): void}} callbacks
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    render (config, items, callbacks, device) {
        const {wrapperClass, css} = this.options
        let hasAddedSeparator = false
        // Only show an hr above the first duck address button, but it can be either personal or private
        const shouldShowSeparator = (dataId) => {
            const shouldShow = ['personalAddress', 'privateAddress'].includes(dataId) && !hasAddedSeparator
            if (shouldShow) hasAddedSeparator = true
            return shouldShow
        }

        const topClass = wrapperClass || ''
        const dataTypeClass = `tooltip__button--data--${config.type}`
        this.shadow.innerHTML = `
${css}
<div class="wrapper wrapper--data ${topClass}">
    <div class="tooltip tooltip--data" hidden>
        ${items.map((item) => {
        const credentialsProvider = item.credentialsProvider?.()
        const providerIconClass = credentialsProvider ? `tooltip__button--data--${credentialsProvider}` : ''
        // these 2 are optional
        const labelSmall = item.labelSmall?.(this.subtype)
        const label = item.label?.(this.subtype)

        return `
            ${shouldShowSeparator(item.id()) ? '<hr />' : ''}
            <button id="${item.id()}" class="tooltip__button tooltip__button--data ${dataTypeClass} ${providerIconClass} js-autofill-button" >
                <span class="tooltip__button__text-container">
                    <span class="label label--medium">${escapeXML(item.labelMedium(this.subtype))}</span>
                    ${label ? `<span class="label">${escapeXML(label)}</span>` : ''}
                    ${labelSmall ? `<span class="label label--small">${escapeXML(labelSmall)}</span>` : ''}
                </span>
            </button>
        `
    }).join('')}
    </div>
</div>`
        this.wrapper = this.shadow.querySelector('.wrapper')
        this.tooltip = this.shadow.querySelector('.tooltip')
        this.autofillButtons = this.shadow.querySelectorAll('.js-autofill-button')

        this.autofillButtons.forEach((btn) => {
            this.registerClickableButton(btn, () => {
                callbacks.onSelect(btn.id)

                switch (btn.id) {
                case 'personalAddress':
                    device.firePixel('autofill_personal_address')
                    break
                case 'privateAddress':
                    device.firePixel('autofill_private_address')
                    break
                default:
                    break
                }
            })
        })

        this.init()
        return this
    }
}

export default DataHTMLTooltip
