/** @typedef {import("../UI/interfaces").TooltipItemRenderer} TooltipItemRenderer */

import { getCountryDisplayName } from '../Form/formatters.js'

/**
 * @implements {TooltipItemRenderer}
 */
export class IdentityTooltipItem {
    /** @type {IdentityObject} */
    #data
    /** @param {IdentityObject} data */
    constructor (data) {
        this.#data = data
    }
    id = () => String(this.#data.id)
    /**
     * @param {import('../locales/strings.js').TranslateFn} t
     * @param {string} subtype
     */
    labelMedium = (t, subtype) => {
        if (subtype === 'addressCountryCode') {
            return getCountryDisplayName('en', this.#data.addressCountryCode || '')
        }
        if (this.#data.id === 'privateAddress') {
            return t('generatePrivateDuckAddr')
        }
        return this.#data[subtype]
    }
    label (_t, subtype) {
        if (this.#data.id === 'privateAddress') {
            return this.#data[subtype]
        }
        return null
    }
    labelSmall = (_) => {
        return this.#data.title
    }
}
