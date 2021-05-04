const DDGAutofill = require('./DDGAutofill')
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
const scanForInputs = require('./scanForInputs.js')

const SIGN_IN_MSG = { signMeIn: true }

const createAttachTooltip = (getAutofillData, refreshAlias, addresses) => (form, input) => {
    if (isDDGApp && !isApp) {
        form.activeInput = input
        getAutofillData().then((alias) => {
            if (alias) form.autofill(alias)
            else form.activeInput.focus()
        })
    } else {
        if (form.tooltip) return

        form.activeInput = input
        form.tooltip = new DDGAutofill(input, form, getAutofillData, refreshAlias, addresses)
        form.intObs.observe(input)
        window.addEventListener('mousedown', form.removeTooltip, {capture: true})
    }
}

class InterfacePrototype {
    init () {
        this.addDeviceListeners()
        this.setupAutofill()
    }
    // Default setup used on extensions and Apple devices
    setupAutofill ({shouldLog} = {shouldLog: false}) {
        this.getAddresses().then(addresses => {
            if (addresses?.privateAddress && addresses?.personalAddress) {
                this.attachTooltip = createAttachTooltip(this.getAddresses, this.refreshAlias, addresses)
                notifyWebApp({ deviceSignedIn: {value: true, shouldLog} })
                scanForInputs(this)
            } else {
                this.trySigningIn()
            }
        })
    }
    getAddresses () {}
    refreshAlias () {}
    trySigningIn () {}
    storeUserData () {}
    addDeviceListeners () {}
    addLogoutListener () {}
    attachTooltip () {}

    // TODO: deprecated?
    isDeviceSignedIn () {}
    getAlias () {}
}

class ExtensionInterface extends InterfacePrototype {
    constructor () {
        super()

        this.getAddresses = () => new Promise(resolve => chrome.runtime.sendMessage(
            {getAddresses: true},
            (data) => resolve(data)
        ))

        this.refreshAlias = () => chrome.runtime.sendMessage(
            {refreshAlias: true},
            (addresses) => { this.addresses = addresses })

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

        this.isDeviceSignedIn = () => new Promise(resolve => {
            resolve(window.EmailInterface.isSignedIn() === 'true')
        })

        this.setupAutofill = ({shouldLog} = {shouldLog: false}) => {
            this.isDeviceSignedIn().then((signedIn) => {
                if (signedIn) {
                    notifyWebApp({ deviceSignedIn: {value: true, shouldLog} })
                    scanForInputs(this)
                } else {
                    this.trySigningIn()
                }
            })
        }

        this.trySigningIn = () => {
            if (isDDGDomain()) {
                sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData')
                    .then(data => {
                        // This call doesn't send a response, so we can't know if it succeeded
                        this.storeUserData(data)
                        this.setupAutofill({shouldLog: true})
                    })
            }
        }

        this.storeUserData = ({addUserData: {token, userName}}) =>
            window.EmailInterface.storeCredentials(token, userName)

        this.attachTooltip = createAttachTooltip(this.getAlias)
    }
}

class AppleDeviceInterface extends InterfacePrototype {
    constructor () {
        super()
        if (isDDGDomain()) {
            // Tell the web app whether we're in the app
            notifyWebApp({isApp})
        }

        this.getAddresses = () => {
            if (!isApp) return this.getAlias()

            return sendAndWaitForAnswer(() =>
                window.webkit.messageHandlers['emailHandlerGetAddresses'].postMessage({}),
            'getAddressesResponse'
            ).then(({addresses}) => addresses)
        }

        this.getAlias = () => sendAndWaitForAnswer(() =>
            window.webkit.messageHandlers['emailHandlerGetAlias'].postMessage({
                requiresUserPermission: !isApp,
                shouldConsumeAliasIfProvided: !isApp
            }), 'getAliasResponse').then(({alias}) => alias)

        this.refreshAlias = () => window.webkit.messageHandlers['emailHandlerRefreshAlias'].postMessage({})

        this.isDeviceSignedIn = () => sendAndWaitForAnswer(() =>
            window.webkit.messageHandlers['emailHandlerCheckAppSignedInStatus'].postMessage({}),
        'checkExtensionSignedInCallback'
        ).then(data => !!data.isAppSignedIn)

        this.trySigningIn = () => {
            if (isDDGDomain()) {
                sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData')
                    .then(data => {
                        // This call doesn't send a response, so we can't know if it succeeded
                        this.storeUserData(data)
                        this.setupAutofill({shouldLog: true})
                    })
            }
        }

        this.storeUserData = ({addUserData: {token, userName}}) =>
            window.webkit.messageHandlers['emailHandlerStoreToken'].postMessage({ token, username: userName })

        this.attachTooltip = createAttachTooltip(this.getAlias, this.refreshAlias)
    }
}

const DeviceInterface = (() => {
    if (isDDGApp) {
        return isAndroid ? new AndroidInterface() : new AppleDeviceInterface()
    }
    return new ExtensionInterface()
})()

module.exports = DeviceInterface
