const {getDaxBoundingBox} = require('../autofill-utils')

const updatePosition = function ({left, top}) {
    const shadow = this.shadow
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

const checkPosition = function () {
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

const ensureIsLastInDOM = function () {
    this.count = this.count || 0
    // If DDG el is not the last in the doc, move it there
    if (document.body.lastElementChild !== this.host) {
        // Try up to 5 times to avoid infinite loop in case someone is doing the same
        if (this.count < 15) {
            this.lift()
            this.append()
            this.checkPosition()
            this.count++
        } else {
            // Remove the tooltip from the form to cleanup listeners and observers
            this.associatedForm.removeTooltip()
            console.info(`DDG autofill bailing out`)
        }
    }
}

class Tooltip {
    append () {
        document.body.appendChild(this.host)
    }
    remove () {
        window.removeEventListener('scroll', this.checkPosition, {passive: true, capture: true})
        this.resObs.disconnect()
        this.mutObs.disconnect()
        this.lift()
    }
    lift () {
        this.left = null
        this.top = null
        document.body.removeChild(this.host)
    }
    checkPosition = checkPosition.bind(this)
    updatePosition = updatePosition.bind(this)
    ensureIsLastInDOM = ensureIsLastInDOM.bind(this)
    resObs = new ResizeObserver(entries => entries.forEach(this.checkPosition))
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
    init () {
        this.animationFrame = null
        this.top = 0
        this.left = 0
        this.transformRuleIndex = null

        this.stylesheet = this.shadow.querySelector('link, style')
        // Un-hide once the style is loaded, to avoid flashing unstyled content
        this.stylesheet.addEventListener('load', () =>
            this.tooltip.removeAttribute('hidden'))
    }
    setupStylesheet () {
        this.stylesheet = this.shadow.querySelector('link, style')
        // Un-hide once the style is loaded, to avoid flashing unstyled content
        this.stylesheet.addEventListener('load', () =>
            this.tooltip.removeAttribute('hidden'))
    }
}

module.exports = Tooltip
