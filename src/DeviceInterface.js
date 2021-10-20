const EmailAutofill = require('./UI/EmailAutofill')
const CredentialsAutofill = require('./UI/CredentialsAutofill')
const {
    isApp,
    notifyWebApp,
    isDDGApp,
    isAndroid,
    isDDGDomain,
    sendAndWaitForAnswer,
    setValue,
    formatAddress
} = require('./autofill-utils')
const {
    wkSend,
    wkSendAndWait
} = require('./appleDeviceUtils/appleDeviceUtils')
const {scanForInputs, forms} = require('./scanForInputs.js')
const getInputConfig = require('./Form/inputTypeConfig')

const SIGN_IN_MSG = { signMeIn: true }

const attachTooltip = function (form, input) {
    if (isDDGApp && !isApp) {
        form.activeInput = input
        this.getAlias().then((alias) => {
            if (alias) form.autofillEmail(alias)
            else form.activeInput.focus()
        })
    } else {
        if (form.tooltip) return

        form.activeInput = input
        const inputType = getInputConfig(input).type
        form.tooltip = inputType === 'emailNew'
            ? new EmailAutofill(input, form, this)
            : new DataAutofill(input, form, this)
        form.intObs.observe(input)
        window.addEventListener('mousedown', form.removeTooltip, {capture: true})
        window.addEventListener('input', form.removeTooltip, {once: true})
    }
}

let attempts = 0

class InterfacePrototype {
    /** @type {{privateAddress: String, personalAddress: String}} */
    #addresses = {}
    get hasLocalAddresses () {
        return !!(this.#addresses?.privateAddress && this.#addresses?.personalAddress)
    }
    getLocalAddresses () {
        return this.#addresses
    }
    storeLocalAddresses (addresses) {
        this.#addresses = addresses
    }

    /** @type {[CredentialsObject]} */
    #credentials = []
    get hasLocalCredentials () {
        return this.#credentials.length > 0
    }
    getLocalCredentials () {
        return this.#credentials.map(cred => delete cred.password && cred)
    }
    storeLocalCredentials (credentials) {
        this.#credentials = credentials.map(cred => delete cred.password && cred)
    }

    /** @type { PMData } */
    #data = {
        credentials: [],
        creditCards: [],
        identities: []
    }

    /**
     * Stores init data coming from the device
     * @param { PMData } data
     */
    storeLocalData (data) {
        console.log('init data', data)
        data.credentials.forEach((cred) => delete cred.password)
        data.creditCards.forEach((cc) => delete cc.cardNumber && delete cc.cardSecurityCode)
        this.#data = data
    }
    get hasIdentities () {
        return this.#data.identities.length > 0
    }
    getIdentities () {
        return this.#data.identities
    }
    get hasCreditCards () {
        return this.#data.creditCards.length > 0
    }
    getCreditCards () {
        return this.#data.creditCards
    }

    init () {
        this.attachTooltip = attachTooltip.bind(this)
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
    setupAutofill () {}
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
    storeUserData () {}
    addDeviceListeners () {}
    addLogoutListener () {}
    attachTooltip () {}
    isDeviceSignedIn () {}
    getAlias () {}
    // PM endpoints
    storeCredentials () {}
    getAccounts () {}
    getAutofillCredentials () {}
    openManagePasswords () {}
}

class ExtensionInterface extends InterfacePrototype {
    constructor () {
        super()

        this.isDeviceSignedIn = () => this.hasLocalAddresses

        this.setupAutofill = ({shouldLog} = {shouldLog: false}) => {
            this.getAddresses().then(addresses => {
                if (this.hasLocalAddresses) {
                    notifyWebApp({ deviceSignedIn: {value: true, shouldLog} })
                    scanForInputs(this)
                } else {
                    this.trySigningIn()
                }
            })
        }

        this.getAddresses = () => new Promise(resolve => chrome.runtime.sendMessage(
            {getAddresses: true},
            (data) => {
                this.storeLocalAddresses(data)
                return resolve(data)
            }
        ))

        this.refreshAlias = () => chrome.runtime.sendMessage(
            {refreshAlias: true},
            (addresses) => this.storeLocalAddresses(addresses)
        )

        this.trySigningIn = () => {
            if (isDDGDomain()) {
                sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData')
                    .then(data => this.storeUserData(data))
            }
        }

        this.storeUserData = (data) => chrome.runtime.sendMessage(data)

        this.addDeviceListeners = () => {
            // Add contextual menu listeners
            let activeEl = null
            document.addEventListener('contextmenu', e => {
                activeEl = e.target
            })

            chrome.runtime.onMessage.addListener((message, sender) => {
                if (sender.id !== chrome.runtime.id) return

                switch (message.type) {
                case 'ddgUserReady':
                    this.setupAutofill({shouldLog: true})
                    break
                case 'contextualAutofill':
                    setValue(activeEl, formatAddress(message.alias))
                    activeEl.classList.add('ddg-autofilled')
                    this.refreshAlias()

                    // If the user changes the alias, remove the decoration
                    activeEl.addEventListener(
                        'input',
                        (e) => e.target.classList.remove('ddg-autofilled'),
                        {once: true}
                    )
                    break
                default:
                    break
                }
            })
        }

        this.addLogoutListener = (handler) => {
            // Cleanup on logout events
            chrome.runtime.onMessage.addListener((message, sender) => {
                if (sender.id === chrome.runtime.id && message.type === 'logout') {
                    handler()
                }
            })
        }
    }
}

class AndroidInterface extends InterfacePrototype {
    constructor () {
        super()

        this.getAlias = () => sendAndWaitForAnswer(() =>
            window.EmailInterface.showTooltip(), 'getAliasResponse')
            .then(({alias}) => alias)

        this.isDeviceSignedIn = () => {
            // isDeviceSignedIn is only available on DDG domains...
            if (isDDGDomain()) return window.EmailInterface.isSignedIn() === 'true'

            // ...on other domains we assume true because the script wouldn't exist otherwise
            return true
        }

        this.setupAutofill = ({shouldLog} = {shouldLog: false}) => {
            if (this.isDeviceSignedIn()) {
                notifyWebApp({ deviceSignedIn: {value: true, shouldLog} })
                scanForInputs(this)
            } else {
                this.trySigningIn()
            }
        }

        this.storeUserData = ({addUserData: {token, userName, cohort}}) =>
            window.EmailInterface.storeCredentials(token, userName, cohort)
    }
}

class AppleDeviceInterface extends InterfacePrototype {
    constructor () {
        super()

        this.setupAutofill = async ({shouldLog} = {shouldLog: false}) => {
            if (isDDGDomain()) {
                // Tell the web app whether we're in the app
                notifyWebApp({isApp})
            }

            if (isApp) {
                await this.getAccounts()
            }

            const signedIn = await this._checkDeviceSignedIn()
            if (signedIn) {
                if (isApp) {
                    await this.getAddresses()
                }
                notifyWebApp({ deviceSignedIn: {value: true, shouldLog} })
                forms.forEach(form => form.redecorateAllInputs())
            } else {
                this.trySigningIn()
            }

            scanForInputs(this)
        }

        this.getAddresses = async () => {
            if (!isApp) return this.getAlias()

            const {addresses} = await wkSendAndWait('emailHandlerGetAddresses')
            this.storeLocalAddresses(addresses)
            return addresses
        }

        this.getAlias = async () => {
            const {alias} = await wkSendAndWait(
                'emailHandlerGetAlias',
                {
                    requiresUserPermission: !isApp,
                    shouldConsumeAliasIfProvided: !isApp
                }
            )
            return formatAddress(alias)
        }

        this.refreshAlias = () => wkSend('emailHandlerRefreshAlias')

        this._checkDeviceSignedIn = async () => {
            const {isAppSignedIn} = await wkSendAndWait('emailHandlerCheckAppSignedInStatus')
            this.isDeviceSignedIn = () => !!isAppSignedIn
            return !!isAppSignedIn
        }

        this.storeUserData = ({addUserData: {token, userName, cohort}}) =>
            wkSend('emailHandlerStoreToken', { token, username: userName, cohort })

        /**
         * PM endpoints
         */

        /**
         * @typedef {{
         *      id: Number,
         *      username: String,
         *      password?: String,
         *      lastUpdated: String,
         * }} CredentialsObject
         *
         * @typedef {{
         *      id: Number,
         *      title: String,
         *      firstName?: String,
         *      middleName?: String,
         *      lastName?: String,
         *      birthdayDay?: Number,
         *      birthdayMonth?: Number,
         *      birthdayYear?: Number,
         *      addressStreet?: String,
         *      addressStreet2?: String,
         *      addressCity?: String,
         *      addressProvince?: String,
         *      addressPostalCode?: String,
         *      addressCountryCode?: String,
         *      phone?: String,
         *      emailAddress?: String,
         * }} IdentityObject
         *
         * @typedef {{
         *      id: Number,
         *      title: String,
         *      displayNumber: String,
         *      cardName?: String,
         *      cardNumber?: String,
         *      cardSecurityCode?: String,
         *      expirationMonth?: Number,
         *      expirationYear?: Number,
         * }} CreditCardObject
         *
         * @typedef {{
         *      credentials: [ CredentialsObject ],
         *      creditCards: [ CreditCardObject ],
         *      identities: [ IdentityObject ],
         * }} PMData
         */

        /**
         * Sends credentials to the native layer
         * @param {{username: String, password: String}} credentials
         */
        this.storeCredentials = (credentials) =>
            wkSend('pmHandlerStoreCredentials', credentials)

        /**
         * Gets the init data from the device
         * @returns {Promise<{ success: PMData, error?: String }>}
         */
        this.getAutofillInitData = () =>
            wkSendAndWait('pmHandlerGetAutofillInitData')
                .then((response) => this.storeLocalData(response.success))

        /**
         * Gets a list of credentials for the current site
         * @returns {Promise<{ success: [CredentialsObject], error?: String }>}
         */
        this.getAccounts = () =>
            wkSendAndWait('pmHandlerGetAccounts')
                .then((response) => {
                    this.storeLocalCredentials(response.success)
                    return response
                })

        /**
         * Gets credentials ready for autofill
         * @param {Number} id - the credential id
         * @returns {Promise<{ success: CredentialsObject, error?: String }>}
         */
        this.getAutofillCredentials = (id) =>
            wkSendAndWait('pmHandlerGetAutofillCredentials', { id })

        /**
         * Opens the native UI for managing passwords
         */
        this.openManagePasswords = () => wkSend('pmHandlerOpenManagePasswords')

        /**
         * Opens the native UI for managing identities
         */
        this.openManageIdentities = () => wkSend('pmHandlerOpenManageIdentities')

        /**
         * Opens the native UI for managing credit cards
         */
        this.openManageCreditCards = () => wkSend('pmHandlerOpenManageCreditCards')

        /**
         * Gets a single identity obj once the user requests it
         * @param {Number} id
         * @returns {Promise<{ success: IdentityObject, error?: String }>}
         */
        this.getIdentity = (id) =>
            wkSendAndWait('pmHandlerGetIdentity', { id })

        /**
         * Gets a single complete credit card obj once the user requests it
         * @param {Number} id
         * @returns {Promise<{ success: CreditCardObject, error?: String }>}
         */
        this.getCreditCard = (id) =>
            wkSendAndWait('pmHandlerGetCreditCard', { id })
    }
}

const DeviceInterface = (() => {
    if (isDDGApp) {
        return isAndroid ? new AndroidInterface() : new AppleDeviceInterface()
    }
    return new ExtensionInterface()
})()

module.exports = DeviceInterface
