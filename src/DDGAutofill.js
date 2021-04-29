const {
    isApp,
    formatAddress,
    getDaxBoundingBox,
    safeExecute,
    escapeXML
} = require('./autofill-utils')

class DDGAutofill {
    constructor (input, associatedForm, getAddresses, refreshAlias, addresses) {
        const shadow = document.createElement('ddg-autofill').attachShadow({mode: 'closed'})
        this.host = shadow.host
        this.input = input
        this.associatedForm = associatedForm
        this.addresses = addresses
        this.animationFrame = null

        const includeStyles = isApp
            ? `<style>${require('./DDGAutofill-styles.js')}</style>`
            : `<link rel="stylesheet" href="${chrome.runtime.getURL('public/css/email-autofill.css')}" crossorigin="anonymous">`

        shadow.innerHTML = `
${includeStyles}
<div class="wrapper">
    <div class="tooltip" hidden>
        <button class="tooltip__button tooltip__button--secondary js-use-personal">
            <span class="tooltip__button__primary-text">
                Use <span class="js-address">${formatAddress(escapeXML(this.addresses.personalAddress))}</span>
            </span>
            <span class="tooltip__button__secondary-text">Blocks email trackers</span>
        </button>
        <button class="tooltip__button tooltip__button--primary js-use-private">
            <span class="tooltip__button__primary-text">Use a Private Address</span>
            <span class="tooltip__button__secondary-text">Blocks email trackers and hides your address</span>
        </button>
    </div>
</div>`
        this.wrapper = shadow.querySelector('.wrapper')
        this.tooltip = shadow.querySelector('.tooltip')
        this.usePersonalButton = shadow.querySelector('.js-use-personal')
        this.usePrivateButton = shadow.querySelector('.js-use-private')
        this.addressEl = shadow.querySelector('.js-address')
        this.stylesheet = shadow.querySelector('link, style')
        // Un-hide once the style is loaded, to avoid flashing unstyled content
        this.stylesheet.addEventListener('load', () =>
            this.tooltip.removeAttribute('hidden'))

        this.updateAddresses = (addresses) => {
            if (addresses) {
                this.addresses = addresses
                this.addressEl.textContent = formatAddress(addresses.personalAddress)
            }
        }

        // Get the alias from the extension
        getAddresses().then(this.updateAddresses)

        this.top = 0
        this.left = 0
        this.transformRuleIndex = null
        this.updatePosition = ({left, top}) => {
            // If the stylesheet is not loaded wait for load (Chrome bug)
            if (!shadow.styleSheets.length) return this.stylesheet.addEventListener('load', this.checkPosition)

            this.left = left
            this.top = top

            if (this.transformRuleIndex && shadow.styleSheets[this.transformRuleIndex]) {
                // If we have already set the rule, remove it…
                shadow.styleSheets[0].deleteRule(this.transformRuleIndex)
            } else {
                // …otherwise, set the index as the very last rule
                this.transformRuleIndex = shadow.styleSheets[0].rules.length
            }

            const newRule = `.wrapper {transform: translate(${left}px, ${top}px);}`
            shadow.styleSheets[0].insertRule(newRule, this.transformRuleIndex)
        }

        this.append = () => document.body.appendChild(shadow.host)
        this.append()
        this.lift = () => {
            this.left = null
            this.top = null
            document.body.removeChild(this.host)
        }

        this.remove = () => {
            window.removeEventListener('scroll', this.checkPosition, {passive: true, capture: true})
            this.resObs.disconnect()
            this.mutObs.disconnect()
            this.lift()
        }

        this.checkPosition = () => {
            if (this.animationFrame) {
                window.cancelAnimationFrame(this.animationFrame)
            }

            this.animationFrame = window.requestAnimationFrame(() => {
                const {left, bottom} = getDaxBoundingBox(this.input)

                if (left !== this.left || bottom !== this.top) {
                    this.updatePosition({left, top: bottom})
                }

                this.animationFrame = null
            })
        }
        this.resObs = new ResizeObserver(entries => entries.forEach(this.checkPosition))
        this.resObs.observe(document.body)
        this.count = 0
        this.ensureIsLastInDOM = () => {
            // If DDG el is not the last in the doc, move it there
            if (document.body.lastElementChild !== this.host) {
                this.lift()

                // Try up to 5 times to avoid infinite loop in case someone is doing the same
                if (this.count < 15) {
                    this.append()
                    this.checkPosition()
                    this.count++
                } else {
                    // Reset count so we can resume normal flow
                    this.count = 0
                    console.info(`DDG autofill bailing out`)
                }
            }
        }
        this.mutObs = new MutationObserver((mutationList) => {
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
        this.mutObs.observe(document.body, {childList: true, subtree: true, attributes: true})
        window.addEventListener('scroll', this.checkPosition, {passive: true, capture: true})

        this.usePersonalButton.addEventListener('click', (e) => {
            if (!e.isTrusted) return
            e.stopImmediatePropagation()

            safeExecute(this.usePersonalButton, () => {
                this.associatedForm.autofill(formatAddress(this.addresses.personalAddress))
            })
        })
        this.usePrivateButton.addEventListener('click', (e) => {
            if (!e.isTrusted) return
            e.stopImmediatePropagation()

            safeExecute(this.usePersonalButton, () => {
                this.associatedForm.autofill(formatAddress(this.addresses.privateAddress))
                refreshAlias()
            })
        })
    }
}

module.exports = DDGAutofill
