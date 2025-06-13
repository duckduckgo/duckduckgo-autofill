/** @typedef {import("../UI/interfaces").TooltipItemRenderer} TooltipItemRenderer */

/**
 * @implements {TooltipItemRenderer}
 */
export class CreditCardTooltipItem {
    /** @type {CreditCardObject} */
    #data;
    /** @param {CreditCardObject} data */
    constructor(data) {
        this.#data = data;
    }
    id = () => String(this.#data.id);
    labelMedium = () => this.#data.title;
    /** @param {import('../locales/strings.js').TranslateFn} t */
    labelSmall = (t) => {
        const { displayNumber, expirationMonth, expirationYear } = this.#data;
        const expiration =
            expirationMonth && expirationYear
                ? `\u00A0 ${t('autofill:expiry')}: ${String(expirationMonth).padStart(2, '0')}/${expirationYear}`
                : '';

        return `•••• ${displayNumber}${expiration}`;
    };
    paymentProvider = () => this.#data.paymentProvider || '';
}
