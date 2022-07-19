import {
    ADDRESS_DOMAIN,
    SIGN_IN_MSG,
    sendAndWaitForAnswer,
    formatDuckAddress,
    autofillEnabled,
    notifyWebApp, getDaxBoundingBox, buttonMatchesFormType
} from '../autofill-utils.js'

import {getInputType, getSubtypeFromType, removeExcessWhitespace} from '../Form/matching.js'
import { formatFullName } from '../Form/formatters.js'
import listenForGlobalFormSubmission from '../Form/listenForFormSubmission.js'
import { fromPassword, appendGeneratedId, AUTOGENERATED_KEY } from '../InputTypes/Credentials.js'
import { PasswordGenerator } from '../PasswordGenerator.js'
import { createScanner } from '../Scanner.js'
import { createGlobalConfig } from '../config.js'
import { NativeUIController } from '../UI/controllers/NativeUIController.js'
import {createTransport} from '../deviceApiCalls/transports/transports.js'
import {Settings} from '../Settings.js'
import {DeviceApi} from '../../packages/device-api/index.js'
import {StoreFormDataCall} from '../deviceApiCalls/__generated__/deviceApiCalls.js'
import {SUBMIT_BUTTON_SELECTOR} from '../Form/selectors-css.js'

/**
 * @typedef {import('../deviceApiCalls/__generated__/validators-ts').StoreFormData} StoreFormData
 */

/**
 * @implements {GlobalConfigImpl}
 * @implements {FormExtensionPoints}
 * @implements {DeviceExtensionPoints}
 */
class InterfacePrototype {
    attempts = 0
    /** @type {import("../Form/Form").Form | null} */
    currentAttached = null
    /** @type {import("../UI/HTMLTooltip.js").default | null} */
    currentTooltip = null
    stripCredentials = true
    /** @type {number} */
    initialSetupDelayMs = 0
    autopromptFired = false

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

    /** @type {import("../UI/controllers/UIController.js").UIController} */
    uiController;

    /** @type {import("../../packages/device-api").DeviceApi} */
    deviceApi;

    /**
     * @param {GlobalConfig} config
     * @param {import("../../packages/device-api").DeviceApi} deviceApi
     * @param {Settings} settings
     */
    constructor (config, deviceApi, settings) {
        this.globalConfig = config
        this.deviceApi = deviceApi
        this.uiController = this.createUIController()
        this.settings = settings
        this.scanner = createScanner(this, {
            initialDelay: this.initialSetupDelayMs
        })
    }

    /**
     * Implementors should override this with a UI controller that suits
     * their platform.
     *
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createUIController () {
        return new NativeUIController()
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
     * Stores init data coming from the tooltipHandler
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

    /**
     * @deprecated use `availableInputTypes.credentials` directly instead
     * @returns {boolean}
     */
    get hasLocalCredentials () {
        return this.#data.credentials.length > 0
    }
    getLocalCredentials () {
        return this.#data.credentials.map(cred => {
            const { password, ...rest } = cred
            return rest
        })
    }
    /**
     * @deprecated use `availableInputTypes.identities` directly instead
     * @returns {boolean}
     */
    get hasLocalIdentities () {
        return this.#data.identities.length > 0
    }
    getLocalIdentities () {
        return this.#data.identities
    }

    /**
     * @deprecated use `availableInputTypes.creditCards` directly instead
     * @returns {boolean}
     */
    get hasLocalCreditCards () {
        return this.#data.creditCards.length > 0
    }
    /** @return {CreditCardObject[]} */
    getLocalCreditCards () {
        return this.#data.creditCards
    }

    async startInit () {
        this.addDeviceListeners()

        await this.setupAutofill()
        await this.refreshSettings()
        await this.setupSettingsPage()
        await this.postInit()

        if (this.settings.featureToggles.credentials_saving) {
            listenForGlobalFormSubmission(this.scanner.forms)
        }
    }

    /**
     * This is a fall-back situation for macOS since it was the only
     * platform to support anything none-email based in the past.
     *
     * Once macOS fully supports 'getAvailableInputTypes' this can be removed
     *
     * @returns {Promise<void>}
     */
    async refreshSettings () {
        const defaults = this.globalConfig.userPreferences?.platform?.name === 'macos'
            ? {
                identities: this.hasLocalIdentities,
                credentials: this.hasLocalCredentials,
                creditCards: this.hasLocalCreditCards,
                email: this.isDeviceSignedIn()
            }
            : undefined

        await this.settings.refresh(defaults)
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

    /**
     * @deprecated This was a port from the macOS implementation so the API may not be suitable for all
     * @returns {Promise<any>}
     */
    async getSelectedCredentials () {
        throw new Error('`getSelectedCredentials` not implemented')
    }

    isTestMode () {
        return this.globalConfig.isDDGTestMode
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
     * Before the DataWebTooltip opens, we collect the data based on the config.type
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
     * @param {{ x: number; y: number; } | null} click
     * @param {'user-initiated' | 'auto-prompt'} trigger
     */
    attachTooltip (form, input, click, trigger = 'user-initiated') {
        // Avoid flashing tooltip from background tabs on macOS
        if (document.visibilityState !== 'visible') return
        if (trigger === 'auto-prompt' && this.autopromptFired) return

        form.activeInput = input
        this.currentAttached = form
        const inputType = getInputType(input)

        /** @type {PosFn} */
        const getPosition = () => {
            // In extensions, the tooltip is centered on the Dax icon
            return this.globalConfig.isApp ? input.getBoundingClientRect() : getDaxBoundingBox(input)
        }

        // todo: this will be migrated to use NativeUIController soon
        if (this.globalConfig.isMobileApp && inputType === 'identities.emailAddress') {
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

        this.uiController.attach({input, form, click, getPosition, topContextData: processedTopContext, device: this, trigger})

        if (trigger === 'auto-prompt') {
            this.autopromptFired = true
        }
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

    isTooltipActive () {
        return this.uiController.isActive?.() ?? false
    }

    removeTooltip () {
        return this.uiController.removeTooltip?.('interface')
    }

    async setupSettingsPage ({shouldLog} = {shouldLog: false}) {
        if (!this.globalConfig.isDDGDomain) {
            return
        }

        notifyWebApp({isApp: this.globalConfig.isApp})

        if (this.isDeviceSignedIn()) {
            let userData
            try {
                userData = await this.getUserData()
            } catch (e) {
            }

            let capabilities
            try {
                capabilities = await this.getEmailProtectionCapabilities()
            } catch (e) {}

            // Set up listener for web app actions
            window.addEventListener('message', (e) => {
                if (this.globalConfig.isDDGDomain && e.data.removeUserData) {
                    this.removeUserData()
                }
            })

            const hasUserData = userData && !userData.error && Object.entries(userData).length > 0
            notifyWebApp({
                deviceSignedIn: {
                    value: true,
                    shouldLog,
                    userData: hasUserData ? userData : undefined,
                    capabilities
                }
            })
        } else {
            this.trySigningIn()
        }
    }

    async setupAutofill () {}

    /** @returns {Promise<EmailAddresses>} */
    async getAddresses () { throw new Error('unimplemented') }

    /** @returns {Promise<null|Record<any,any>>} */
    getUserData () { return Promise.resolve(null) }

    /** @returns {void} */
    removeUserData () {}

    /** @returns {Promise<null|Record<string,boolean>>} */
    getEmailProtectionCapabilities () { throw new Error('unimplemented') }

    refreshAlias () {}
    async trySigningIn () {
        if (this.globalConfig.isDDGDomain) {
            if (this.attempts < 10) {
                this.attempts++
                const data = await sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData')
                // This call doesn't send a response, so we can't know if it succeeded
                this.storeUserData(data)

                await this.setupAutofill()
                await this.refreshSettings()
                await this.setupSettingsPage({shouldLog: true})
                await this.postInit()
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

    /** @param {StoreFormData} values */
    storeFormData (values) {
        this.deviceApi.notify(new StoreFormDataCall(values))
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
            this.settings.featureToggles.password_generation,
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
        if (!form.hasValues(values)) return
        const checks = [
            form.shouldPromptToStoreData,
            this.passwordGenerator.generated
        ]

        if (checks.some(Boolean)) {
            const withAutoGeneratedFlag = appendGeneratedId(values, this.passwordGenerator.password)
            this.storeFormData(withAutoGeneratedFlag)
        }
    }
    /**
     * on macOS we try to detect if a click occurred within a form
     * @param {PointerEvent} event
     */
    _onPointerDown (event) {
        if (this.settings.featureToggles.credentials_saving) {
            this._detectFormSubmission(event)
        }
    }
    /**
     * @param {PointerEvent} event
     */
    _detectFormSubmission (event) {
        const matchingForm = [...this.scanner.forms.values()].find(
            (form) => {
                const btns = [...form.submitButtons]
                // @ts-ignore
                if (btns.includes(event.target)) return true

                // @ts-ignore
                if (btns.find((btn) => btn.contains(event.target))) return true
            }
        )

        matchingForm?.submitHandler()

        if (!matchingForm) {
            const selector = SUBMIT_BUTTON_SELECTOR + ', a[href="#"], a[href^=javascript], *[onclick]'
            // check if the click happened on a button
            const button = /** @type HTMLElement */(event.target)?.closest(selector)
            if (!button) return

            const text = removeExcessWhitespace(button?.textContent)
            const hasRelevantText = /(log|sign).?(in|up)|continue|next|submit/i.test(text)
            if (hasRelevantText && text.length < 25) {
                // check if there's a form with values
                const filledForm = [...this.scanner.forms.values()].find(form => form.hasValues())
                if (filledForm && buttonMatchesFormType(/** @type HTMLElement */(button), filledForm)) {
                    filledForm?.submitHandler()
                }
            }
        }
    }

    /**
     * This serves as a single place to create a default instance
     * of InterfacePrototype that can be useful in testing scenarios
     * @returns {InterfacePrototype}
     */
    static default () {
        const globalConfig = createGlobalConfig()
        const transport = createTransport(globalConfig)
        const deviceApi = new DeviceApi(transport)
        const settings = Settings.default(globalConfig, deviceApi)
        return new InterfacePrototype(globalConfig, deviceApi, settings)
    }
}

export default InterfacePrototype
