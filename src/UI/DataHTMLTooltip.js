import { escapeXML } from '../autofill-utils.js'
import HTMLTooltip from './HTMLTooltip.js'
import {PROVIDER_LOCKED} from '../InputTypes/Credentials.js'

/**
 * A mapping of main autofill item type to the 'Manage XYZ…' string ID for that
 * item.
 * @type {Record<SupportedMainTypes, import('../locales/strings').AutofillKeys>}
 *
 * @example
 * const id = manageItemStringIds['credentials'] // => 'autofill:managePasswords'
 * const str = t(id);                            // => 'Manage passwords…' in English
 */
const manageItemStringIds = {
    credentials: 'autofill:managePasswords',
    creditCards: 'autofill:manageCreditCards',
    identities: 'autofill:manageIdentities',
    unknown: 'autofill:manageSavedItems'
}

class DataHTMLTooltip extends HTMLTooltip {
    /**
     * @param {import("../locales/strings").TranslateFn} t
     * @param {boolean} isOtherItems
     */
    renderEmailProtectionIncontextSignup (t, isOtherItems) {
        const dataTypeClass = `tooltip__button--data--identities`
        const providerIconClass = 'tooltip__button--data--duckduckgo'
        return `
            ${isOtherItems ? '<hr />' : ''}
            <button id="incontextSignup" class="tooltip__button tooltip__button--data ${dataTypeClass} ${providerIconClass} js-get-email-signup">
                <span class="tooltip__button__text-container">
                    <span class="label label--medium">
                        ${t('autofill:hideEmailAndBlockTrackers')}
                    </span>
                    <span class="label label--small">
                        ${t('autofill:createUniqueRandomAddr')}
                    </span>
                </span>
            </button>
        `
    }

    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     * @param {InputTypeConfigs} config
     * @param {import('./interfaces.js').TooltipItemRenderer[]} items
     * @param {{
     *   onSelect(id:string): void
     *   onManage(type:InputTypeConfigs['type']): void
     *   onIncontextSignupDismissed?(data: {
     *      hasOtherOptions: Boolean
     *   }): void
     *   onIncontextSignup?(): void
     * }} callbacks
     */
    render (device, config, items, callbacks) {
        const t = device.t
        const {wrapperClass, css} = this.options
        const isTopAutofill = wrapperClass?.includes('top-autofill')
        let hasAddedSeparator = false
        // Only show an hr above the first duck address button, but it can be either personal or private
        const shouldShowSeparator = (dataId, index) => {
            const shouldShow = ['personalAddress', 'privateAddress'].includes(dataId) && !hasAddedSeparator
            if (shouldShow) hasAddedSeparator = true

            // Don't show the separator if we want to show it, but it's unnecessary as the first item in the menu
            const isFirst = index === 0
            return shouldShow && !isFirst
        }

        // Only show manage Manage… when it's topAutofill, the provider is unlocked, and it's not just EmailProtection
        const shouldShowManageButton =
            isTopAutofill &&
            items.some(item => !['personalAddress', 'privateAddress', PROVIDER_LOCKED].includes(item.id()))

        const topClass = wrapperClass || ''

        const dataTypeClass = `tooltip__button--data--${config.type}${this.variant ? '__' + this.variant : ''}`
        this.shadow.innerHTML = `
${css}
<div class="wrapper wrapper--data ${topClass}" hidden>
    <div class="tooltip tooltip--data${this.options.isIncontextSignupAvailable() ? ' tooltip--incontext-signup' : ''}">
        ${items.map((item, index) => {
        const credentialsProvider = item.credentialsProvider?.()
        const providerIconClass = credentialsProvider ? `tooltip__button--data--${credentialsProvider}` : ''
        // these 2 are optional
        const labelSmall = item.labelSmall?.(t, this.subtype)
        const label = item.label?.(t, this.subtype)

        return `
            ${shouldShowSeparator(item.id(), index) ? '<hr />' : ''}
            <button id="${item.id()}" class="tooltip__button tooltip__button--data ${dataTypeClass} ${providerIconClass} js-autofill-button">
                <span class="tooltip__button__text-container">
                    <span class="label label--medium">${escapeXML(item.labelMedium(t, this.subtype))}</span>
                    ${label ? `<span class="label">${escapeXML(label)}</span>` : ''}
                    ${labelSmall ? `<span class="label label--small">${escapeXML(labelSmall)}</span>` : ''}
                </span>
            </button>
        `
    }).join('')}
        ${this.options.isIncontextSignupAvailable()
        ? this.renderEmailProtectionIncontextSignup(t, items.length > 0)
        : ''}
        ${shouldShowManageButton ? `
            <hr />
            <button id="manage-button" class="tooltip__button tooltip__button--secondary" type="button">
                <span class="tooltip__button__text-container">
                    <span class="label label--medium">
                        ${t(manageItemStringIds[config.type] ?? 'autofill:manageSavedItems')}
                    </span>
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

        const getIncontextSignup = this.shadow.querySelector('.js-get-email-signup')
        if (getIncontextSignup) {
            this.registerClickableButton(getIncontextSignup, () => {
                callbacks.onIncontextSignupDismissed?.({ hasOtherOptions: items.length > 0 })
                callbacks.onIncontextSignup?.()
            })
        }

        this.init()
        return this
    }
}

export default DataHTMLTooltip
