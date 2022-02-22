const {
    ADDRESS_DOMAIN,
    SIGN_IN_MSG,
    isApp,
    isMobileApp,
    isDDGDomain,
    sendAndWaitForAnswer,
    formatDuckAddress,
    autofillEnabled
} = require('../autofill-utils')
const {getInputType} = require('../Form/matching')
const {
    formatFullName
} = require('../Form/formatters')
const EmailAutofill = require('../UI/EmailAutofill')
const DataAutofill = require('../UI/DataAutofill')
const {getInputConfigFromType} = require('../Form/inputTypeConfig')
const listenForGlobalFormSubmission = require('../Form/listenForFormSubmission')
const {forms} = require('../scanForInputs')

class InterfacePrototype {
    attempts = 0
    /** @type {import("../Form/Form").Form | null} */
    currentAttached = null
    /** @type {import("../UI/Tooltip") | null} */
    currentTooltip = null
    stripCredentials = true

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

    /**
     * @returns {Promise<import('../Form/matching').SupportedTypes>}
     */
    async getCurrentInputType () {
        throw new Error('Not implemented')
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
        if (this.stripCredentials) {
            data.credentials.forEach((cred) => delete cred.password)
            data.creditCards.forEach((cc) => delete cc.cardNumber && delete cc.cardSecurityCode)
        }
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

    async startInit () {
        window.addEventListener('pointerdown', this, true)

        listenForGlobalFormSubmission()
        this.addDeviceListeners()
        await this.setupAutofill()
        this.postInit()
    }

    postInit () {}

    async isEnabled () {
        return autofillEnabled()
    }

    async init () {
        const isEnabled = await this.isEnabled()
        if (!isEnabled) return
        if (document.readyState === 'complete') {
            this.startInit()
        } else {
            window.addEventListener('load', () => {
                this.startInit()
            })
        }
    }

    // Global listener for event delegation
    pointerDownListener (e) {
        if (!e.isTrusted) return

        // @ts-ignore
        if (e.target.nodeName === 'DDG-AUTOFILL') {
            e.preventDefault()
            e.stopImmediatePropagation()

            const activeTooltip = this.getActiveTooltip()
            activeTooltip?.dispatchClick()
        } else {
            this.removeTooltip()
        }

        if (!isApp) return

        // Check for clicks on submit buttons
        const matchingForm = [...forms.values()].find(
            (form) => {
                const btns = [...form.submitButtons]
                // @ts-ignore
                if (btns.includes(e.target)) return true

                // @ts-ignore
                if (btns.find((btn) => btn.contains(e.target))) return true
            }
        )
        matchingForm?.submitHandler()
    }

    async selectedDetail (data, type) {
        this.activeFormSelectedDetail(data, type)
    }

    activeFormSelectedDetail (data, type) {
        const form = this.currentAttached
        if (!form) {
            return
        }
        if (data.id === 'privateAddress') {
            this.refreshAlias()
        }
        if (type === 'email') {
            form.autofillEmail(data.email)
        } else {
            form.autofillData(data, type)
        }
        this.removeTooltip()
    }

    createTooltip (inputType, getPosition) {
        const config = getInputConfigFromType(inputType)

        // Attach close listeners
        window.addEventListener('input', () => this.removeTooltip(), {once: true})

        if (isApp) {
            return new DataAutofill(config, inputType, getPosition, this)
        } else {
            return new EmailAutofill(config, inputType, getPosition, this)
        }
    }

    attachTooltip (form, input, getPosition, click) {
        form.activeInput = input
        this.currentAttached = form
        const inputType = getInputType(input)

        if (isMobileApp) {
            this.getAlias().then((alias) => {
                if (alias) form.autofillEmail(alias)
                else form.activeInput.focus()
            })
        } else {
            this.attachTooltipInner(form, input, inputType, getPosition, click)
        }
    }

    attachTooltipInner (form, input, inputType, getPosition, _click) {
        if (this.currentTooltip) return
        this.currentTooltip = this.createTooltip(inputType, getPosition)
        form.showingTooltip(input)
    }

    async removeTooltip () {
        if (this.currentTooltip) {
            this.currentTooltip.remove()
            this.currentTooltip = null
        }
    }

    getActiveTooltip () {
        return this.currentTooltip
    }

    setActiveTooltip (tooltip) {
        this.currentTooltip = tooltip
    }

    handleEvent (event) {
        switch (event.type) {
        case 'pointerdown':
            this.pointerDownListener(event)
            break
        }
    }
    setupAutofill (_opts) {}
    getAddresses () {}
    refreshAlias () {}
    async trySigningIn () {
        if (isDDGDomain()) {
            if (this.attempts < 10) {
                this.attempts++
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
