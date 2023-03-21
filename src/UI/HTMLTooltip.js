import { safeExecute, addInlineStyles } from '../autofill-utils.js'
import { getSubtypeFromType } from '../Form/matching.js'
import { CSS_STYLES } from './styles/styles.js'

/**
 * @typedef {object} HTMLTooltipOptions
 * @property {boolean} testMode
 * @property {string | null} [wrapperClass]
 * @property {(top: number, left: number) => string} [tooltipPositionClass]
 * @property {(top: number, left: number, isAboveInput: boolean) => string} [caretPositionClass]
 * @property {(details: {height: number, width: number}) => void} [setSize] - if this is set, it will be called initially once + every times the size changes
 * @property {() => void} remove
 * @property {string} css
 * @property {boolean} checkVisibility
 * @property {boolean} hasCaret
 */

/**
 * @typedef {object}  TransformRuleObj
 * @property {HTMLTooltipOptions['caretPositionClass']} getRuleString
 * @property {number | null} index
 */

/** @type {HTMLTooltipOptions} */
export const defaultOptions = {
    wrapperClass: '',
    tooltipPositionClass: (top, left) => `
        .tooltip {
            transform: translate(${left}px, ${top}px);
        }
    `,
    caretPositionClass: (top, left, isAboveInput) => `
        .tooltip--email__caret {
            ${isAboveInput
        ? `transform: translate(${left}px, ${top}px) rotate(180deg); transform-origin: 16px;`
        : `transform: translate(${left}px, ${top}px);`
}
        }`,
    css: `<style>${CSS_STYLES}</style>`,
    setSize: undefined,
    remove: () => { /** noop */ },
    testMode: false,
    checkVisibility: true,
    hasCaret: false
}

export class HTMLTooltip {
    isAboveInput = false;
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
        this.device = null
        /**
         * @type {{
         *   'tooltip': TransformRuleObj,
         *   'caret': TransformRuleObj
         * }}
         */
        this.transformRules = {
            caret: {
                getRuleString: this.options.caretPositionClass,
                index: null
            },
            tooltip: {
                getRuleString: this.options.tooltipPositionClass,
                index: null
            }
        }
    }
    append () {
        document.body.appendChild(this.host)
    }
    remove () {
        this.device?.activeForm.resetIconStylesToInitial()
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
            const {left, bottom, height} = this.getPosition()

            if (left !== this.left || bottom !== this.top) {
                const coords = {left, top: bottom}
                this.updatePosition('tooltip', coords)
                if (this.options.hasCaret) {
                    this.isAboveInput = this.getPosition().top > this.tooltip.getBoundingClientRect().top
                    const borderWidth = 2
                    const caretTop = this.isAboveInput ? coords.top - height - borderWidth : coords.top
                    this.updatePosition('caret', { ...coords, top: caretTop })
                }
            }

            this.animationFrame = null
        })
    }

    getOverridePosition ({left, top}) {
        const tooltipBoundingBox = this.tooltip.getBoundingClientRect()

        // If overflowing from the bottom, try moving to the top
        if (tooltipBoundingBox.bottom > window.innerHeight) {
            const inputPosition = this.getPosition()
            const caretHeight = 14
            const overriddenTopPosition = top - tooltipBoundingBox.height - inputPosition.height - caretHeight
            if (overriddenTopPosition >= 0) return {left, top: overriddenTopPosition}
        }

        // If overflowing from the left, try centering it in the window
        if (tooltipBoundingBox.left < 0) {
            const leftPosWhenCentered = (window.innerWidth - tooltipBoundingBox.width) / 2
            const overriddenLeftPosition = left + Math.abs(tooltipBoundingBox.left) + leftPosWhenCentered
            return {left: overriddenLeftPosition, top}
        }

        // If overflowing from the right, move it slightly to the left
        if (tooltipBoundingBox.right > window.innerWidth) {
            const rightOverflow = tooltipBoundingBox.right - window.innerWidth
            const extraPadding = 5
            const overriddenLeftPosition = left - rightOverflow - extraPadding
            return {left: overriddenLeftPosition, top}
        }
    }

    /**
     *
     * @param {'tooltip' | 'caret'} element
     * @param {{
     *     left: number,
     *     top: number
     * }} coords
     */
    updatePosition (element, {left, top}) {
        const shadow = this.shadow
        // If the stylesheet is not loaded wait for load (Chrome bug)
        if (!shadow.styleSheets.length) {
            this.stylesheet?.addEventListener('load', () => this.checkPosition())
            return
        }

        this.left = left
        this.top = top

        const ruleObj = this.transformRules[element]

        if (ruleObj.index) {
            if (shadow.styleSheets[0].rules[ruleObj.index]) {
                // If we have already set the rule, remove it…
                shadow.styleSheets[0].deleteRule(ruleObj.index)
            }
        } else {
            // …otherwise, set the index as the very last rule
            ruleObj.index = shadow.styleSheets[0].rules.length
        }

        const cssRule = ruleObj.getRuleString?.(top, left, this.isAboveInput)
        if (typeof cssRule === 'string') {
            shadow.styleSheets[0].insertRule(cssRule, ruleObj.index)
        }

        if (this.options.hasCaret) {
            const overridePosition = this.getOverridePosition({left, top})
            if (overridePosition) this.updatePosition(element, overridePosition)
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
            this.tooltip.removeAttribute('hidden'))

        this.append()
        this.resObs.observe(document.body)
        this.mutObs.observe(document.body, {childList: true, subtree: true, attributes: true})
        window.addEventListener('scroll', this, {capture: true})
        this.setSize()

        if (typeof this.options.setSize === 'function') {
            this.setupSizeListener()
        }
    }
}

export default HTMLTooltip
