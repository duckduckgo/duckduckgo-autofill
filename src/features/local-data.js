import {ADDRESS_DOMAIN, formatDuckAddress} from "../autofill-utils";
import {formatFullName} from "../Form/formatters";
import {getSubtypeFromType} from "../Form/matching";

export class LocalData {
    /** @type { PMData } */
    #data = {
        credentials: [],
        creditCards: [],
        identities: [],
        topContextData: undefined
    }

    /** @type {{privateAddress: string, personalAddress: string}} */
    addresses = {
        privateAddress: '',
        personalAddress: ''
    }

    get hasLocalAddresses() {
        return !!(this.addresses?.privateAddress && this.addresses?.personalAddress)
    }

    getLocalAddresses() {
        return this.addresses
    }

    storeLocalAddresses(addresses) {
        this.addresses = addresses
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
    addDuckAddressesToIdentities(identities) {
        if (!this.hasLocalAddresses) return identities

        const newIdentities = []
        let {privateAddress, personalAddress} = this.getLocalAddresses()
        privateAddress = formatDuckAddress(privateAddress)
        personalAddress = formatDuckAddress(personalAddress)

        // Get the duck addresses in identities
        const duckEmailsInIdentities = identities.reduce(
            (duckEmails, {emailAddress: email}) =>
                email?.includes(ADDRESS_DOMAIN) ? duckEmails.concat(email) : duckEmails,
            []
        )

        // Only add the personal duck address to identities if the user hasn't
        // already manually added it
        if (!duckEmailsInIdentities.includes(personalAddress)) {
            newIdentities.push({
                id: 'personalAddress',
                emailAddress: personalAddress,
                title: 'Blocks email trackers'
            })
        }

        newIdentities.push({
            id: 'privateAddress',
            emailAddress: privateAddress,
            title: 'Blocks email trackers and hides your address'
        })

        return [...identities, ...newIdentities]
    }

    /**
     * Stores init data coming from the tooltipHandler
     * @param { InboundPMData } data
     */
    storeLocalData(data) {
        this.storeLocalCredentials(data.credentials)

        data.creditCards.forEach((cc) => delete cc.cardNumber && delete cc.cardSecurityCode)
        // Store the full name as a separate field to simplify autocomplete
        const updatedIdentities = data.identities.map((identity) => ({
            ...identity,
            fullName: formatFullName(identity)
        }))
        // Add addresses
        this.#data.identities = this.addDuckAddressesToIdentities(updatedIdentities)
        this.#data.creditCards = data.creditCards

        // Top autofill only
        if (data.serializedInputContext) {
            try {
                this.#data.topContextData = JSON.parse(data.serializedInputContext)
            } catch (e) {
                console.error(e)
                // this.removeTooltip('error caught triyng to deserialize json from serializedInputContext')
            }
        }
    }

    /**
     * Stores credentials locally
     * @param {CredentialsObject[]} credentials
     */
    storeLocalCredentials(credentials) {
        credentials.forEach((cred) => delete cred.password)
        this.#data.credentials = credentials
    }

    getTopContextData() {
        return this.#data.topContextData
    }

    getLocalCredentials() {
        return this.#data.credentials.map(cred => {
            const {password, ...rest} = cred
            return rest
        })
    }

    getLocalIdentities() {
        return this.#data.identities
    }

    /** @return {CreditCardObject[]} */
    getLocalCreditCards() {
        return this.#data.creditCards
    }
    /**
     * Before the DataWebTooltip opens, we collect the data based on the config.type
     * @param {InputTypeConfigs} config
     * @param {import('../Form/matching').SupportedTypes} inputType
     * @param {TopContextData} [data]
     * @returns {(CredentialsObject|CreditCardObject|IdentityObject)[]}
     */
    dataForAutofill(config, inputType, data) {
        const subtype = getSubtypeFromType(inputType)
        if (config.type === 'identities') {
            return this.getLocalIdentities().filter(identity => !!identity[subtype])
        }
        if (config.type === 'creditCards') {
            return this.getLocalCreditCards()
        }
        if (config.type === 'credentials') {
            if (data) {
                if (Array.isArray(data.credentials) && data.credentials.length > 0) {
                    return data.credentials
                } else {
                    return this.getLocalCredentials()
                }
            }
        }
        return []
    }
}
