const InterfacePrototype = require('./InterfacePrototype')

/** @type {IdentityObject} */
const IDENTITY = {
    id: '01',
    firstName: 'Shane',
    lastName: 'Osbourne',
    title: 'Main',
    emailAddress: 'shane@duck.com',
    addressStreet: '7 turner lane Boughton'
}

/** @type {CreditCardObject} */
const CC = {
    id: '01-01',
    title: 'Monzon',
    displayNumber: '012',
    cardNumber: '411111111111111',
    cardSecurityCode: '006'
}

/**
 * @implements {FeatureToggles}
 */
class BrowserInterface extends InterfacePrototype {
    /** @type {FeatureToggleNames[]} */
    #supportedFeatures = ['inputType.identities', 'password.generation'];

    async setupAutofill () {
        // @ts-ignore
        const _cleanup = this.scanner.init()
        this.storeLocalAddresses({personalAddress: 'shane_dd', privateAddress: '987hgd'})
        this.storeLocalData({
            serializedInputContext: '',
            credentials: [],
            creditCards: [{
                ...CC
            }],
            identities: [IDENTITY]
        })
    }

    async getAddresses () {
        return {personalAddress: 'shane_dd', privateAddress: '987hgd'}
    }

    isDeviceSignedIn () {
        return true
    }

    /**
     * Gets a single identity obj once the user requests it
     * @param {Number} id
     * @returns {Promise<{success: IdentityObject|undefined}>}
     */
    getAutofillIdentity (id) {
        const identity = this.getLocalIdentities().find(({id: identityId}) => `${identityId}` === `${id}`)
        return Promise.resolve({success: identity})
    }

    /**
     * @param _id
     * @returns {APIResponseSingle<CreditCardObject>}
     */
    async getAutofillCreditCard (_id) {
        return { success: CC }
    }

    /**
     * @param {FeatureToggleNames} name
     * @return {boolean}
     */
    supportsFeature (name) {
        return this.#supportedFeatures.includes(name)
    }
}

module.exports.BrowserInterface = BrowserInterface
