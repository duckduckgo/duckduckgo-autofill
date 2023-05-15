import { escapeXML } from '../autofill-utils.js'
import HTMLTooltip from './HTMLTooltip.js'
import {PROVIDER_LOCKED} from '../InputTypes/Credentials.js'

class DataHTMLTooltip extends HTMLTooltip {
    /**
     * @param {InputTypeConfigs} config
     * @param {TooltipItemRenderer[]} items
     * @param {{onSelect(id:string): void, onManage(type:InputTypeConfigs['type']): void}} callbacks
     */
    render (config, items, callbacks) {
        const {wrapperClass, css} = this.options
        let hasAddedSeparator = false
        // Only show an hr above the first duck address button, but it can be either personal or private
        const shouldShowSeparator = (dataId) => {
            const shouldShow = ['personalAddress', 'privateAddress'].includes(dataId) && !hasAddedSeparator
            if (shouldShow) hasAddedSeparator = true
            return shouldShow
        }

        // Don't show Manage… when we only have Email Protection addresses, or the provider is locked
        const shouldShowManageButton = items.some(item => !['personalAddress', 'privateAddress', PROVIDER_LOCKED].includes(item.id()))

        const topClass = wrapperClass || ''
        const dataTypeClass = `tooltip__button--data--${config.type}`
        this.shadow.innerHTML = `
${css}
<div class="wrapper wrapper--data ${topClass}" hidden>
    <div class="tooltip tooltip--data">
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
        ${shouldShowManageButton ? `
            <hr />
            <button id="manage-button" class="tooltip__button tooltip__button--manage" type="button">
                <span class="tooltip__button__text-container">
                    <span class="label label--medium">Manage ${config.displayName}…</span>
                </span>
            </button>`
        : ''}
    </div>
</div>`
        this.wrapper = this.shadow.querySelector('.wrapper')
        this.tooltip = this.shadow.querySelector('.tooltip')
        this.autofillButtons = this.shadow.querySelectorAll('.js-autofill-button')

        this.autofillButtons.forEach((btn) => {
            this.registerClickableButton(btn, () => {
                // Fire only if the cursor is hovering the button
                if (btn.matches('.wrapper:not(.top-autofill) button:hover, .currentFocus')) {
                    callbacks.onSelect(btn.id)
                } else {
                    console.warn('The button doesn\'t seem to be hovered. Please check.')
                }
            })
        })

        this.manageButton = this.shadow.getElementById('manage-button')
        if (this.manageButton) {
            this.registerClickableButton(this.manageButton, () => {
                callbacks.onManage(config.type)
            })
        }

        this.init()
        return this
    }
}

export default DataHTMLTooltip
