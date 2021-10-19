const inputTypeConfig = require('./inputTypeConfig')
const {ATTR_INPUT_TYPE} = require('../constants')

/**
 * Get inline styles for the injected icon, base state
 * @param {HTMLInputElement} input
 * @param {boolean} isLogin
 */
const getIconStylesBase = (input, isLogin) => {
    const inputType = input.getAttribute(ATTR_INPUT_TYPE)
    const icon = inputTypeConfig[inputType].getIconBase(isLogin)

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
 * @param {boolean} isLogin
 */
const getIconStylesAutofilled = (input, isLogin) => {
    const inputType = input.getAttribute(ATTR_INPUT_TYPE)
    const icon = inputTypeConfig[inputType].getIconFilled(isLogin)

    return {
        'background-image': `url(${icon}`,
        'background-color': '#F8F498',
        'color': '#333333'
    }
}

module.exports = {getIconStylesBase, getIconStylesAutofilled}
