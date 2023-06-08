import {safeExecute, addInlineStyles, formatDuckAddress, escapeXML} from '../autofill-utils.js'
import { getSubtypeFromType } from '../Form/matching.js'
import { CSS_STYLES } from './styles/styles.js'

/**
 * @typedef {object} HTMLTooltipOptions
 * @property {boolean} testMode
 * @property {string | null} [wrapperClass]
 * @property {(top: number, left: number) => string} [tooltipPositionClass]
 * @property {(details: {height: number, width: number}) => void} [setSize] - if this is set, it will be called initially once + every times the size changes
 * @property {() => void} remove
 * @property {string} css
 * @property {boolean} checkVisibility
 */

/** @type {import('./HTMLTooltip.js').HTMLTooltipOptions} */
export const defaultOptions = {
    wrapperClass: '',
    tooltipPositionClass: (top, left) => `.wrapper {transform: translate(${left}px, ${top}px);}`,
    css: `<style>${CSS_STYLES}</style>`,
    setSize: undefined,
    remove: () => { /** noop */ },
    testMode: false,
    checkVisibility: true
}

export class HTMLTooltip {
    /** @type {HTMLTooltipOptions} */
    options;
    /**
     * @param config
     * @param inputType
     * @param getPosition
     * @param {HTMLTooltipOptions} options
     */
    constructor (config, inputType, getPosition, options) {
        this.options = options
        this.shadow = document.createElement('ddg-autofill').attachShadow({
            mode: options.testMode
                ? 'open'
                : 'closed'
        })
        this.host = this.shadow.host
        this.config = config
        this.subtype = getSubtypeFromType(inputType)
        this.tooltip = null
        this.getPosition = getPosition
        const forcedVisibilityStyles = {
            'display': 'block',
            'visibility': 'visible',
            'opacity': '1'
        }
        // @ts-ignore how to narrow this.host to HTMLElement?
        addInlineStyles(this.host, forcedVisibilityStyles)
        this.count = 0
    }
    append () {
        document.body.appendChild(this.host)
    }
    remove () {
        window.removeEventListener('scroll', this, {capture: true})
        this.resObs.disconnect()
        this.mutObs.disconnect()
        this.lift()
    }
    lift () {
        this.left = null
        this.top = null
        document.body.removeChild(this.host)
    }
    handleEvent (event) {
        switch (event.type) {
        case 'scroll':
            this.checkPosition()
            break
        }
    }
    focus (x, y) {
        const focusableElements = 'button'
        const currentFocusClassName = 'currentFocus'
        const currentFocused = this.shadow.querySelectorAll(`.${currentFocusClassName}`);
        [...currentFocused].forEach(el => {
            el.classList.remove(currentFocusClassName)
        })
        this.shadow.elementFromPoint(x, y)?.closest(focusableElements)?.classList.add(currentFocusClassName)
    }
    checkPosition () {
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame)
        }

        this.animationFrame = window.requestAnimationFrame(() => {
            const {left, bottom} = this.getPosition()

            if (left !== this.left || bottom !== this.top) {
                this.updatePosition({left, top: bottom})
            }

            this.animationFrame = null
        })
    }
    updatePosition ({left, top}) {
        const shadow = this.shadow
        // If the stylesheet is not loaded wait for load (Chrome bug)
        if (!shadow.styleSheets.length) {
            this.stylesheet?.addEventListener('load', () => this.checkPosition())
            return
        }

        this.left = left
        this.top = top

        if (this.transformRuleIndex && shadow.styleSheets[0].rules[this.transformRuleIndex]) {
            // If we have already set the rule, remove it…
            shadow.styleSheets[0].deleteRule(this.transformRuleIndex)
        } else {
            // …otherwise, set the index as the very last rule
            this.transformRuleIndex = shadow.styleSheets[0].rules.length
        }

        let cssRule = this.options.tooltipPositionClass?.(top, left)
        if (typeof cssRule === 'string') {
            shadow.styleSheets[0].insertRule(cssRule, this.transformRuleIndex)
        }
    }
    ensureIsLastInDOM () {
        this.count = this.count || 0
        // If DDG el is not the last in the doc, move it there
        if (document.body.lastElementChild !== this.host) {
            // Try up to 15 times to avoid infinite loop in case someone is doing the same
            if (this.count < 15) {
                this.lift()
                this.append()
                this.checkPosition()
                this.count++
            } else {
                // Remove the tooltip from the form to cleanup listeners and observers
                this.options.remove()
                console.info(`DDG autofill bailing out`)
            }
        }
    }
    resObs = new ResizeObserver(entries => entries.forEach(() => this.checkPosition()))
    mutObs = new MutationObserver((mutationList) => {
        for (const mutationRecord of mutationList) {
            if (mutationRecord.type === 'childList') {
                // Only check added nodes
                mutationRecord.addedNodes.forEach(el => {
                    if (el.nodeName === 'DDG-AUTOFILL') return

                    this.ensureIsLastInDOM()
                })
            }
        }
        this.checkPosition()
    })
    setActiveButton (e) {
        this.activeButton = e.target
    }
    unsetActiveButton () {
        this.activeButton = null
    }
    clickableButtons = new Map()
    registerClickableButton (btn, handler) {
        this.clickableButtons.set(btn, handler)
        // Needed because clicks within the shadow dom don't provide this info to the outside
        btn.addEventListener('mouseenter', (e) => this.setActiveButton(e))
        btn.addEventListener('mouseleave', () => this.unsetActiveButton())
    }
    dispatchClick () {
        const handler = this.clickableButtons.get(this.activeButton)
        if (handler) {
            safeExecute(this.activeButton, handler, {
                checkVisibility: this.options.checkVisibility
            })
        }
    }
    setupSizeListener () {
        // Listen to layout and paint changes to register the size
        const observer = new PerformanceObserver(() => {
            this.setSize()
        })
        observer.observe({entryTypes: ['layout-shift', 'paint']})
    }
    setSize () {
        const innerNode = this.shadow.querySelector('.wrapper--data')
        // Shouldn't be possible
        if (!innerNode) return
        const details = {height: innerNode.clientHeight, width: innerNode.clientWidth}
        this.options.setSize?.(details)
    }
    init () {
        this.animationFrame = null
        this.top = 0
        this.left = 0
        this.transformRuleIndex = null

        this.stylesheet = this.shadow.querySelector('link, style')
        // Un-hide once the style is loaded, to avoid flashing unstyled content
        this.stylesheet?.addEventListener('load', () =>
            this.tooltip?.removeAttribute('hidden'))

        this.append()
        this.resObs.observe(document.body)
        this.mutObs.observe(document.body, {childList: true, subtree: true, attributes: true})
        window.addEventListener('scroll', this, {capture: true})
        this.setSize()

        if (typeof this.options.setSize === 'function') {
            this.setupSizeListener()
        }
    }
    /** @type {"modern" | "legacy" | "emailsignup"} */
    kind = 'legacy'
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     * @param {TopContextData} [topContextData]
     */
    render(device, topContextData) {
        switch (this.kind) {
            case "legacy":
                this.device = device
                this.addresses = device.data.getLocalAddresses()
                this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--email">
    <div class="tooltip tooltip--email" hidden>
        <button class="tooltip__button tooltip__button--email js-use-personal">
            <span class="tooltip__button--email__primary-text">
                Use <span class="js-address">${formatDuckAddress(escapeXML(this.addresses.personalAddress))}</span>
            </span>
            <span class="tooltip__button--email__secondary-text">Blocks email trackers</span>
        </button>
        <button class="tooltip__button tooltip__button--email js-use-private">
            <span class="tooltip__button--email__primary-text">Generate a Private Duck Address</span>
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
            case "emailsignup":
                device.firePixel({pixelName: 'incontext_show'})
                this.device = device
                this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--email">
    <div class="tooltip tooltip--email tooltip--email-signup" hidden>
        <h1>
            Protect your inbox 💪 I've caught trackers hiding in 85% of emails.
        </h1>
        <p>
            Want me to hide your email address and remove hidden trackers before
            forwarding messages to your inbox?
        </p>
        <div class="notice-controls">
            <a href="https://duckduckgo.com/email/start-incontext" target="_blank" class="primary js-get-email-signup">
                Get Email Protection
            </a>
            <button class="ghost js-dismiss-email-signup">
                ${device.settings.incontextSignupInitiallyDismissed ? "Don't Ask Again" : 'Maybe Later'}
            </button>
        </div>
    </div>
</div>`

                this.tooltip = this.shadow.querySelector('.tooltip')

                this.dismissEmailSignup = this.shadow.querySelector('.js-dismiss-email-signup')
                this.registerClickableButton(this.dismissEmailSignup, () => {
                    device.onIncontextSignupDismissed()
                })

                this.getEmailSignup = this.shadow.querySelector('.js-get-email-signup')
                this.registerClickableButton(this.getEmailSignup, () => {
                    device.onIncontextSignup()
                })

                this.init()
                return this
            case "modern":
                if (!topContextData) throw new Error('unreachable')
                const data = device.data.dataForAutofill(this.config, topContextData.inputType, topContextData)
                // convert the data into tool tip item renderers
                const items = data.map(d => this.config.tooltipItem(d))
                const {wrapperClass, css} = this.options
                let hasAddedSeparator = false
                // Only show an hr above the first duck address button, but it can be either personal or private
                const shouldShowSeparator = (dataId) => {
                    const shouldShow = ['personalAddress', 'privateAddress'].includes(dataId) && !hasAddedSeparator
                    if (shouldShow) hasAddedSeparator = true
                    return shouldShow
                }

                const topClass = wrapperClass || ''
                const dataTypeClass = `tooltip__button--data--${this.config.type}`
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
                        device.onSelect(topContextData.inputType, data, btn.id)
                    })
                })

                this.init()
                return this
            default: throw new Error('unreachable')
        }
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

export default HTMLTooltip
