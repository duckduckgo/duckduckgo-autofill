const {
    ADDRESS_DOMAIN,
    SIGN_IN_MSG,
    isApp,
    isMobileApp,
    isDDGDomain,
    sendAndWaitForAnswer,
    formatDuckAddress
} = require('../autofill-utils')
const {forms} = require('../scanForInputs')
const {
    formatFullName
} = require('../Form/formatters')
const EmailAutofill = require('../UI/EmailAutofill')
const DataAutofill = require('../UI/DataAutofill')

let attempts = 0

class InterfacePrototype {
    /** @type {{privateAddress: string, personalAddress: string}} */
    #addresses = {
        privateAddress: '',
        personalAddress: ''
    }
    get hasLocalAddresses () {
        return !!(this.#addresses?.privateAddress && this.#addresses?.personalAddress)
    }
    getLocalAddresses () {
        return this.#addresses
    }
    storeLocalAddresses (addresses) {
        this.#addresses = addresses
        // When we get new duck addresses, add them to the identities list
        const identities = this.getLocalIdentities()
        const privateAddressIdentity = identities.find(({id}) => id === 'privateAddress')
        // If we had previously stored them, just update the private address
        if (privateAddressIdentity) {
            privateAddressIdentity.emailAddress = formatDuckAddress(addresses.privateAddress)
        } else {
            // Otherwise, add both addresses
            this.#data.identities = this.addDuckAddressesToIdentities(identities)
        }
    }

    /** @type { PMData } */
    #data = {
        credentials: [],
        creditCards: [],
        identities: []
    }

    addDuckAddressesToIdentities (identities) {
        if (!this.hasLocalAddresses) return identities

        const newIdentities = []
        let { privateAddress, personalAddress } = this.getLocalAddresses()
        privateAddress = formatDuckAddress(privateAddress)
        personalAddress = formatDuckAddress(personalAddress)

        // Get the duck addresses in identities
        const duckEmailsInIdentities = identities.reduce(
            (duckEmails, { emailAddress: email }) =>
                email.includes(ADDRESS_DOMAIN) ? duckEmails.concat(email) : duckEmails,
            []
        )

        // Only add the personal duck address to identities if the user hasn't
        // already manually added it
        if (!duckEmailsInIdentities.includes(personalAddress)) {
            newIdentities.push({
                id: 'personalAddress',
                emailAddress: personalAddress,
                title: 'Blocks Email Trackers'
            })
        }

        newIdentities.push({
            id: 'privateAddress',
            emailAddress: privateAddress,
            title: 'Blocks Email Trackers and hides Your Address'
        })

        return [...identities, ...newIdentities]
    }

    /**
     * Stores init data coming from the device
     * @param { PMData } data
     */
    storeLocalData (data) {
        data.credentials.forEach((cred) => delete cred.password)
        data.creditCards.forEach((cc) => delete cc.cardNumber && delete cc.cardSecurityCode)
        // Store the full name as a separate field to simplify autocomplete
        const updatedIdentities = data.identities.map((identity) => ({
            ...identity,
            fullName: formatFullName(identity)
        }))
        // Add addresses
        data.identities = this.addDuckAddressesToIdentities(updatedIdentities)
        this.#data = data
    }
    get hasLocalCredentials () {
        return this.#data.credentials.length > 0
    }
    getLocalCredentials () {
        return this.#data.credentials.map(cred => delete cred.password && cred)
    }
    get hasLocalIdentities () {
        return this.#data.identities.length > 0
    }
    getLocalIdentities () {
        return this.#data.identities
    }
    get hasLocalCreditCards () {
        return this.#data.creditCards.length > 0
    }
    getLocalCreditCards () {
        return this.#data.creditCards
    }

    init () {
        const start = () => {
            this.addDeviceListeners()
            this.setupAutofill()
        }
        if (document.readyState === 'complete') {
            start()
        } else {
            window.addEventListener('load', start)
        }
    }

    attachTooltip (form, input) {
        form.activeInput = input

        if (isMobileApp) {
            this.getAlias().then((alias) => {
                if (alias) form.autofillEmail(alias)
                else form.activeInput.focus()
            })
        } else {
            if (form.tooltip) return

            form.tooltip = !isApp
                ? new EmailAutofill(input, form, this)
                : new DataAutofill(input, form, this)
            form.intObs.observe(input)
            window.addEventListener('pointerdown', form.removeTooltip, {capture: true})
            window.addEventListener('input', form.removeTooltip, {once: true})
        }
    }

    getActiveForm () {
        return [...forms.values()].find((form) => form.tooltip)
    }
    setupAutofill (_opts) {}
    getAddresses () {}
    refreshAlias () {}
    async trySigningIn () {
        if (isDDGDomain()) {
            if (attempts < 10) {
                attempts++
                const data = await sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData')
                // This call doesn't send a response, so we can't know if it succeeded
                this.storeUserData(data)
                this.setupAutofill({shouldLog: true})
            } else {
                console.warn('max attempts reached, bailing')
            }
        }
    }
    storeUserData (_data) {}
    addDeviceListeners () {}

    /** @param {() => void} _fn */
    addLogoutListener (_fn) {}
    isDeviceSignedIn () {}
    /**
     * @returns {Promise<null|string>}
     */
    async getAlias () {
        return null
    }
    // PM endpoints
    storeCredentials (_opts) {}
    getAccounts () {}
    getAutofillCredentials (_id) {}
    openManagePasswords () {}
}

module.exports = InterfacePrototype
