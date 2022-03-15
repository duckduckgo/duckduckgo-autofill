import {
    ADDRESS_DOMAIN,
    SIGN_IN_MSG,
    sendAndWaitForAnswer,
    formatDuckAddress,
    autofillEnabled,
    notifyWebApp
} from '../autofill-utils'

import { getInputType, getSubtypeFromType } from '../Form/matching'
import { formatFullName } from '../Form/formatters'
import EmailAutofill from '../UI/EmailAutofill'
import DataAutofill from '../UI/DataAutofill'
import { getInputConfigFromType } from '../Form/inputTypeConfig'
import listenForGlobalFormSubmission from '../Form/listenForFormSubmission'
import { fromPassword, appendGeneratedId, AUTOGENERATED_KEY } from '../InputTypes/Credentials'
import { PasswordGenerator } from '../PasswordGenerator'
import { createScanner } from '../Scanner'

/**
 * @implements {FeatureToggles}
 * @implements {GlobalConfigImpl}
 * @implements {FormExtensionPoints}
 * @implements {DeviceExtensionPoints}
 */
class InterfacePrototype {
    attempts = 0
    /** @type {import("../Form/Form").Form | null} */
    currentAttached = null
    /** @type {import("../UI/Tooltip").default | null} */
    currentTooltip = null
    stripCredentials = true
    /** @type {number} */
    initialSetupDelayMs = 0

    /** @type {FeatureToggleNames[]} */
    supportedFeatures = [];

    /** @type {PasswordGenerator} */
    passwordGenerator = new PasswordGenerator();

    /** @type {{privateAddress: string, personalAddress: string}} */
    #addresses = {
        privateAddress: '',
        personalAddress: ''
    }

    /** @type {GlobalConfig} */
    globalConfig;

    /** @type {import('../Scanner').Scanner} */
    scanner;

    /** @param {GlobalConfig} config */
    constructor (config) {
        this.globalConfig = config
        this.scanner = createScanner(this, {
            initialDelay: this.initialSetupDelayMs
        })
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
        identities: [],
        topContextData: undefined
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
     * Stores init data coming from the device
     * @param { InboundPMData } data
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
        this.#data.identities = this.addDuckAddressesToIdentities(updatedIdentities)
        this.#data.creditCards = data.creditCards
        this.#data.credentials = data.credentials

        // Top autofill only
        if (data.serializedInputContext) {
            try {
                this.#data.topContextData = JSON.parse(data.serializedInputContext)
            } catch (e) {
                console.error(e)
                this.removeTooltip()
            }
        }
    }
    getTopContextData () {
        return this.#data.topContextData
    }
    get hasLocalCredentials () {
        return this.#data.credentials.length > 0
    }
    getLocalCredentials () {
        return this.#data.credentials.map(cred => {
            const { password, ...rest } = cred
            return rest
        })
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
    /** @return {CreditCardObject[]} */
    getLocalCreditCards () {
        return this.#data.creditCards
    }

    async startInit () {
        window.addEventListener('pointerdown', this, true)

        // Only setup listeners on macOS
        if (this.globalConfig.isApp) {
            listenForGlobalFormSubmission(this.scanner.forms)
        }

        this.addDeviceListeners()
        await this.setupAutofill()
        await this.setupSettingsPage()
        this.postInit()
    }

    postInit () {}

    async isEnabled () {
        return autofillEnabled(this.globalConfig)
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

        if (!this.globalConfig.isApp) return

        // Check for clicks on submit buttons
        const matchingForm = [...this.scanner.forms.values()].find(
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

    /**
     * @param {IdentityObject|CreditCardObject|CredentialsObject|{email:string, id: string}} data
     * @param {string} type
     */
    async selectedDetail (data, type) {
        this.activeFormSelectedDetail(data, type)
    }

    /**
     * @param {IdentityObject|CreditCardObject|CredentialsObject|{email:string, id: string}} data
     * @param {string} type
     */
    activeFormSelectedDetail (data, type) {
        const form = this.currentAttached
        if (!form) {
            return
        }
        if (data.id === 'privateAddress') {
            this.refreshAlias()
        }
        if (type === 'email' && 'email' in data) {
            form.autofillEmail(data.email)
        } else {
            form.autofillData(data, type)
        }
        this.removeTooltip()
    }

    /**
     * @param {()=>void} getPosition
     * @param {TopContextData} topContextData
     */
    createTooltip (getPosition, topContextData) {
        const config = getInputConfigFromType(topContextData.inputType)

        if (this.globalConfig.isApp) {
            // collect the data for each item to display
            const data = this.dataForAutofill(config, topContextData.inputType, topContextData)

            // convert the data into tool tip item renderers
            const asRenderers = data.map(d => config.tooltipItem(d))

            // construct the autofill
            return new DataAutofill(config, topContextData.inputType, getPosition, this)
                .render(config, asRenderers, {
                    onSelect: (id) => this.onSelect(config, data, id)
                })
        } else {
            return new EmailAutofill(config, topContextData.inputType, getPosition, this)
        }
    }

    /**
     * Before the DataAutofill opens, we collect the data based on the config.type
     * @param {InputTypeConfigs} config
     * @param {import('../Form/matching').SupportedTypes} inputType
     * @param {TopContextData} [data]
     * @returns {(CredentialsObject|CreditCardObject|IdentityObject)[]}
     */
    dataForAutofill (config, inputType, data) {
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

    /**
     * @param {import("../Form/Form").Form} form
     * @param {HTMLInputElement} input
     * @param {{ (): { x: number; y: number; height: number; width: number; }; (): void; }} getPosition
     * @param {{ x: number; y: number; } | null} click
     */
    attachTooltip (form, input, getPosition, click) {
        form.activeInput = input
        this.currentAttached = form
        const inputType = getInputType(input)

        if (this.globalConfig.isMobileApp) {
            this.getAlias().then((alias) => {
                if (alias) form.autofillEmail(alias)
                else form.activeInput?.focus()
            })
            return
        }

        /** @type {TopContextData} */
        const topContextData = {
            inputType
        }

        // Allow features to append/change top context data
        // for example, generated passwords may get appended here
        const processedTopContext = this.preAttachTooltip(topContextData, input, form)

        this.attachCloseListeners()

        this.attachTooltipInner(form, input, getPosition, click, processedTopContext)
    }

    attachCloseListeners () {
        window.addEventListener('input', this)
        window.addEventListener('keydown', this)
    }

    removeCloseListeners () {
        window.removeEventListener('input', this)
        window.removeEventListener('keydown', this)
    }

    /**
     * When an item was selected, we then call back to the device
     * to fetch the full suite of data needed to complete the autofill
     *
     * @param {InputTypeConfigs} config
     * @param {(CreditCardObject|IdentityObject|CredentialsObject)[]} items
     * @param {string|number} id
     */
    onSelect (config, items, id) {
        id = String(id)
        const matchingData = items.find(item => String(item.id) === id)
        if (!matchingData) throw new Error('unreachable (fatal)')

        const dataPromise = (() => {
            switch (config.type) {
            case 'creditCards': return this.getAutofillCreditCard(id)
            case 'identities': return this.getAutofillIdentity(id)
            case 'credentials': {
                if (AUTOGENERATED_KEY in matchingData) {
                    return Promise.resolve({ success: matchingData })
                }
                return this.getAutofillCredentials(id)
            }
            default: throw new Error('unreachable!')
            }
        })()

        // wait for the data back from the device
        dataPromise.then(response => {
            if (response.success) {
                return this.selectedDetail(response.success, config.type)
            } else {
                return Promise.reject(new Error('none-success response'))
            }
        }).catch(e => {
            console.error(e)
            return this.removeTooltip()
        })
    }

    /**
     * @param {import("../Form/Form").Form} form
     * @param {any} input
     * @param {{ (): { x: number; y: number; height: number; width: number; }; (): void; }} getPosition
     * @param {{ x: number; y: number; } | null} _click
     * @param {TopContextData} data
     */
    attachTooltipInner (form, input, getPosition, _click, data) {
        if (this.currentTooltip) return
        this.currentTooltip = this.createTooltip(getPosition, data)
        form.showingTooltip(input)
    }

    async removeTooltip () {
        if (this.currentTooltip) {
            this.removeCloseListeners()
            this.currentTooltip.remove()
            this.currentTooltip = null
            this.currentAttached = null
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
        case 'keydown':
            if (['Escape', 'Tab', 'Enter'].includes(event.code)) {
                this.removeTooltip()
            }
            break
        case 'input':
            this.removeTooltip()
            break
        case 'pointerdown':
            this.pointerDownListener(event)
            break
        }
    }

    async setupSettingsPage ({shouldLog} = {shouldLog: false}) {
        if (this.globalConfig.isDDGDomain) {
            notifyWebApp({isApp: this.globalConfig.isApp})

            if (this.isDeviceSignedIn()) {
                let userData
                try {
                    userData = await this.getUserData()
                } catch (e) {}

                const hasUserData = userData && !userData.error && Object.entries(userData).length > 0
                notifyWebApp({
                    deviceSignedIn: {
                        value: true,
                        shouldLog,
                        userData: hasUserData ? userData : undefined
                    }
                })
            } else {
                this.trySigningIn()
            }
        }
    }

    async setupAutofill () {}

    /** @returns {Promise<EmailAddresses>} */
    async getAddresses () { throw new Error('unimplemented') }

    /** @returns {Promise<null|Record<any,any>>} */
    getUserData () { return Promise.resolve(null) }

    refreshAlias () {}
    async trySigningIn () {
        if (this.globalConfig.isDDGDomain) {
            if (this.attempts < 10) {
                this.attempts++
                const data = await sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData')
                // This call doesn't send a response, so we can't know if it succeeded
                this.storeUserData(data)
                await this.setupAutofill()
                await this.setupSettingsPage({shouldLog: true})
            } else {
                console.warn('max attempts reached, bailing')
            }
        }
    }
    storeUserData (_data) {}

    addDeviceListeners () {}
    /** @param {() => void} _fn */
    addLogoutListener (_fn) {}
    isDeviceSignedIn () { return false }
    /**
     * @returns {Promise<null|string>}
     */
    async getAlias () {
        return null
    }
    // PM endpoints
    storeCredentials (_opts) {}
    getAccounts () {}
    /**
     * Gets credentials ready for autofill
     * @param {number|string} _id - the credential id
     * @returns {APIResponseSingle<CredentialsObject>}
     */
    getAutofillCredentials (_id) { throw new Error('unimplemented') }
    /** @returns {APIResponse<CreditCardObject>} */
    async getAutofillCreditCard (_id) { throw new Error('unimplemented') }
    /** @returns {Promise<{success: IdentityObject|undefined}>} */
    async getAutofillIdentity (_id) { throw new Error('unimplemented') }

    openManagePasswords () {}
    storeFormData (_values) {}

    /** @param {{height: number, width: number}} _args */
    setSize (_args) {}

    /** @param {FeatureToggleNames} name */
    supportsFeature (name) {
        return this.supportedFeatures.includes(name)
    }

    /**
     * `preAttachTooltip` happens just before a tooltip is show - features may want to append some data
     * at this point.
     *
     * For example, if password generation is enabled, this will generate
     * a password and send it to the tooltip as though it were a stored credential.
     *
     * @param {TopContextData} topContextData
     * @param {HTMLInputElement} input
     * @param {{isSignup: boolean|null}} form
     */
    preAttachTooltip (topContextData, input, form) {
        // A list of checks to determine if we need to generate a password
        const checks = [
            topContextData.inputType === 'credentials.password',
            this.supportsFeature('password.generation'),
            form.isSignup
        ]

        // if all checks pass, generate and save a password
        if (checks.every(Boolean)) {
            const password = this.passwordGenerator.generate({
                input: input.getAttribute('passwordrules'),
                domain: window.location.hostname
            })

            // append the new credential to the topContextData so that the top autofill can display it
            topContextData.credentials = [fromPassword(password)]
        }

        return topContextData
    }

    /**
     * `postAutofill` gives features an opportunity to perform an action directly
     * following an autofill.
     *
     * For example, if a generated password was used, we want to fire a save event.
     *
     * @param {IdentityObject|CreditCardObject|CredentialsObject} data
     * @param {DataStorageObject} formValues
     */
    postAutofill (data, formValues) {
        if (AUTOGENERATED_KEY in data && 'password' in data) {
            if (formValues.credentials?.password === data.password) {
                const withAutoGeneratedFlag = appendGeneratedId(formValues, data.password)
                this.storeFormData(withAutoGeneratedFlag)
            }
        }
    }

    /**
     * `postSubmit` gives features a one-time-only opportunity to perform an
     * action directly after a form submission was observed.
     *
     * Mostly this is about storing data from the form submission, but it can
     * also be used like in the case of Password generation, to append additional
     * data before it's sent to be saved.
     *
     * @param {DataStorageObject} values
     * @param {import("../Form/Form").Form} form
     */
    postSubmit (values, form) {
        if (!form.form) return

        const checks = [
            form.shouldPromptToStoreData,
            form.hasValues(values),
            this.passwordGenerator.generated
        ]

        // if *any* of the checks are truthy, proceed to offer
        if (checks.some(Boolean)) {
            const withAutoGeneratedFlag = appendGeneratedId(values, this.passwordGenerator.password)
            this.storeFormData(withAutoGeneratedFlag)
        }
    }
}

export default InterfacePrototype
