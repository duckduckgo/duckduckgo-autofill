import {removeExcessWhitespace} from './matching.js'
const EXCLUDED_TAGS = ['BR', 'SCRIPT', 'NOSCRIPT', 'OPTION', 'STYLE']

/**
 * Extract all strings of an element's children to an array.
 * "element.textContent" is a string which is merged of all children nodes,
 * which can cause issues with things like script tags etc.
 *
 * @param  {Element} element
 *         A DOM element to be extracted.
 * @returns {string[]}
 *          All strings in an element.
 */
const extractElementStrings = (element) => {
    const strings = new Set()
    const _extractElementStrings = el => {
        if (EXCLUDED_TAGS.includes(el.tagName)) {
            return
        }

        // only take the string when it's an explicit text node
        if (el.nodeType === el.TEXT_NODE || !el.childNodes.length) {
            const trimmedText = removeExcessWhitespace(el.textContent)
            if (trimmedText) {
                strings.add(trimmedText)
            }
            return
        }

        for (const node of el.childNodes) {
            const nodeType = node.nodeType
            if (nodeType !== node.ELEMENT_NODE && nodeType !== node.TEXT_NODE) {
                continue
            }
            _extractElementStrings(node)
        }
    }
    _extractElementStrings(element)
    return [...strings]
}

export {extractElementStrings, EXCLUDED_TAGS}
