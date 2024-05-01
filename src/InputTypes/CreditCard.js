/** @typedef {import("../UI/interfaces").TooltipItemRenderer} TooltipItemRenderer */

/**
 * @implements {TooltipItemRenderer}
 */
export class CreditCardTooltipItem {
    /** @type {CreditCardObject} */
    #data
    /** @param {CreditCardObject} data */
    constructor (data) {
        this.#data = data
    }
    id = () => String(this.#data.id)
    labelMedium = () => this.#data.title
    labelSmall = () => this.#data.displayNumber
}
