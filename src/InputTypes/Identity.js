const {getCountryDisplayName} = require('../Form/formatters')

/**
 * @implements {TooltipItemRenderer}
 */
class IdentityTooltipItem {
    /** @type {IdentityObject} */
    #data;
    /** @param {IdentityObject} data */
    constructor (data) {
        this.#data = data
    }
    id = () => String(this.#data.id)
    primaryText = (subtype) => {
        if (subtype === 'addressCountryCode') {
            return getCountryDisplayName('en', this.#data.addressCountryCode || '')
        }
        if (this.#data.id === 'privateAddress') {
            return 'Generated Private Address\n' + this.#data[subtype]
        }
        return this.#data[subtype]
    };
    secondaryText = (_) => this.#data.title;
}

module.exports.IdentityTooltipItem = IdentityTooltipItem
