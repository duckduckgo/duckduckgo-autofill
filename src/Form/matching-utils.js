const EXCLUDED_TAGS = ['SCRIPT', 'NOSCRIPT', 'OPTION', 'STYLE']

/**
 * Extract all strings of an element's children to an array.
 * "element.textContent" is a string which is merged of all children nodes,
 * which can cause issues with things like script tags etc.
 *
 * @param  {HTMLElement} element
 *         A DOM element to be extracted.
 * @returns {string[]}
 *          All strings in an element.
 */
const extractElementStrings = (element) => {
    const strings = []
    const _extractElementStrings = el => {
        if (EXCLUDED_TAGS.includes(el.tagName)) {
            return
        }

        // only take the string when it's an explicit text node
        if (el.nodeType === el.TEXT_NODE || !el.childNodes.length) {
            let trimmedText = removeExcessWhitespace(el.textContent)
            if (trimmedText) {
                strings.push(trimmedText)
            }
            return
        }

        for (let node of el.childNodes) {
            let nodeType = node.nodeType
            if (nodeType !== node.ELEMENT_NODE && nodeType !== node.TEXT_NODE) {
                continue
            }
            _extractElementStrings(node)
        }
    }
    _extractElementStrings(element)
    return strings
}

/**
 * Remove whitespace of more than 2 in a row and trim the string
 * @param {string | null} string
 * @return {string}
 */
const removeExcessWhitespace = (string = '') => {
    return (string || '')
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ').trim()
}

/**
 * Get text from all explicit labels
 * @param {HTMLInputElement|HTMLSelectElement} el
 * @return {string}
 */
const getExplicitLabelsText = (el) => {
    const labelTextCandidates = []
    for (let label of el.labels || []) {
        labelTextCandidates.push(...extractElementStrings(label))
    }
    if (el.hasAttribute('aria-label')) {
        labelTextCandidates.push(removeExcessWhitespace(el.getAttribute('aria-label')))
    }

    // Try to access another element if it was marked as the label for this input/select
    const ariaLabelAttr = removeExcessWhitespace(el.getAttribute('aria-labelled') || el.getAttribute('aria-labelledby'))

    if (ariaLabelAttr) {
        const labelledByElement = document.getElementById(ariaLabelAttr)
        if (labelledByElement) {
            labelTextCandidates.push(...extractElementStrings(labelledByElement))
        }
    }

    // Labels with long text are likely to be noisy and lead to false positives
    const filteredLabels = labelTextCandidates.filter((string) => string.length < 65)

    if (filteredLabels.length > 0) {
        return filteredLabels.join(' ')
    }

    return ''
}

/**
 * Returns true if the field is visible and too small
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
const isInputTooSmall = (input) => {
    const width = input.offsetWidth
    const height = input.offsetHeight

    // If dimensions are 0 the field is hidden so we can't know if it's too small
    if (height === 0 && width === 0) return false

    if (width <= 40) return true

    return false
}

export {
    removeExcessWhitespace,
    getExplicitLabelsText,
    extractElementStrings,
    isInputTooSmall
}
