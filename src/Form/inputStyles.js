const getInputConfig = require('./inputTypeConfig.js')

/**
 * Get inline styles for the injected icon, base state
 * @param {HTMLInputElement} input
 * @return {Object<string, string>}
 */
const getIconStylesBase = (input) => {
    const config = getInputConfig(input)
    const icon = config.getIconBase()

    if (!icon) return {}

    return {
        // Height must be > 0 to account for fields initially hidden
        'background-size': `auto ${input.offsetHeight <= 30 && input.offsetHeight > 0 ? '100%' : '26px'}`,
        'background-position': 'center right',
        'background-repeat': 'no-repeat',
        'background-origin': 'content-box',
        'background-image': `url(${icon})`,
        'transition': 'background 0s'
    }
}

/**
 * Get inline styles for the injected icon, autofilled state
 * @param {HTMLInputElement} input
 */
const getIconStylesAutofilled = (input) => {
    const config = getInputConfig(input)
    const icon = config.getIconBase()

    const iconStyle = icon ? {'background-image': `url(${icon}`} : {}

    return {
        ...iconStyle,
        'background-color': '#F8F498',
        'color': '#333333'
    }
}

module.exports = {getIconStylesBase, getIconStylesAutofilled}
