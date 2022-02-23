/**
 * @implements {TooltipItemRenderer}
 */
class CreditCardTooltipItem {
    /** @type {CreditCardObject} */
    #data;
    /** @param {CreditCardObject} data */
    constructor (data) {
        this.#data = data
    }
    id = () => String(this.#data.id)
    primaryText = (_) => this.#data.title;
    secondaryText = (_) => this.#data.displayNumber
}

module.exports.CreditCardTooltipItem = CreditCardTooltipItem
