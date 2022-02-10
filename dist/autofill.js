(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

const {
  isDDGApp,
  isAndroid
} = require('./autofill-utils');

const AndroidInterface = require('./DeviceInterface/AndroidInterface');

const ExtensionInterface = require('./DeviceInterface/ExtensionInterface');

const AppleDeviceInterface = require('./DeviceInterface/AppleDeviceInterface'); // Exports a device interface instance


const deviceInterface = (() => {
  if (isDDGApp) {
    return isAndroid ? new AndroidInterface() : new AppleDeviceInterface();
  }

  return new ExtensionInterface();
})();

module.exports = deviceInterface;

},{"./DeviceInterface/AndroidInterface":2,"./DeviceInterface/AppleDeviceInterface":3,"./DeviceInterface/ExtensionInterface":4,"./autofill-utils":23}],2:[function(require,module,exports){
"use strict";

const InterfacePrototype = require('./InterfacePrototype.js');

const {
  notifyWebApp,
  isDDGDomain,
  sendAndWaitForAnswer
} = require('../autofill-utils');

const {
  scanForInputs
} = require('../scanForInputs.js');

class AndroidInterface extends InterfacePrototype {
  async getAlias() {
    // @ts-ignore
    const {
      alias
    } = sendAndWaitForAnswer(() => {
      return window.EmailInterface.showTooltip();
    }, 'getAliasResponse');
    return alias;
  }

  isDeviceSignedIn() {
    // isDeviceSignedIn is only available on DDG domains...
    if (isDDGDomain()) return window.EmailInterface.isSignedIn() === 'true'; // ...on other domains we assume true because the script wouldn't exist otherwise

    return true;
  }

  setupAutofill({
    shouldLog
  } = {
    shouldLog: false
  }) {
    if (this.isDeviceSignedIn()) {
      notifyWebApp({
        deviceSignedIn: {
          value: true,
          shouldLog
        }
      });
      scanForInputs(this);
    } else {
      this.trySigningIn();
    }
  }

  storeUserData({
    addUserData: {
      token,
      userName,
      cohort
    }
  }) {
    return window.EmailInterface.storeCredentials(token, userName, cohort);
  }

}

module.exports = AndroidInterface;

},{"../autofill-utils":23,"../scanForInputs.js":28,"./InterfacePrototype.js":5}],3:[function(require,module,exports){
"use strict";

const InterfacePrototype = require('./InterfacePrototype.js');

const {
  wkSend,
  wkSendAndWait
} = require('../appleDeviceUtils/appleDeviceUtils');

const {
  isApp,
  notifyWebApp,
  isDDGDomain,
  formatDuckAddress
} = require('../autofill-utils');

const {
  scanForInputs,
  forms
} = require('../scanForInputs.js');

class AppleDeviceInterface extends InterfacePrototype {
  async setupAutofill({
    shouldLog
  } = {
    shouldLog: false
  }) {
    if (isDDGDomain()) {
      // Tell the web app whether we're in the app
      notifyWebApp({
        isApp
      });
    }

    if (isApp) {
      await this.getAutofillInitData();
    }

    const signedIn = await this._checkDeviceSignedIn();

    if (signedIn) {
      if (isApp) {
        await this.getAddresses();
      }

      notifyWebApp({
        deviceSignedIn: {
          value: true,
          shouldLog
        }
      });
      forms.forEach(form => form.redecorateAllInputs());
    } else {
      this.trySigningIn();
    }

    scanForInputs(this);
  }

  async getAddresses() {
    if (!isApp) return this.getAlias();
    const {
      addresses
    } = await wkSendAndWait('emailHandlerGetAddresses');
    this.storeLocalAddresses(addresses);
    return addresses;
  }

  async refreshAlias() {
    await wkSendAndWait('emailHandlerRefreshAlias'); // On macOS we also update the addresses stored locally

    if (isApp) this.getAddresses();
  }

  async _checkDeviceSignedIn() {
    const {
      isAppSignedIn
    } = await wkSendAndWait('emailHandlerCheckAppSignedInStatus');

    this.isDeviceSignedIn = () => !!isAppSignedIn;

    return !!isAppSignedIn;
  }

  storeUserData({
    addUserData: {
      token,
      userName,
      cohort
    }
  }) {
    return wkSend('emailHandlerStoreToken', {
      token,
      username: userName,
      cohort
    });
  }
  /**
   * PM endpoints
   */

  /**
   * Sends credentials to the native layer
   * @param {{username: string, password: string}} credentials
   * @deprecated
   */


  storeCredentials(credentials) {
    return wkSend('pmHandlerStoreCredentials', credentials);
  }
  /**
   * Sends credentials to the native layer
   * @param {DataStorageObject} data
   */


  storeFormData(data) {
    return wkSend('pmHandlerStoreData', data);
  }
  /**
   * Gets the init data from the device
   * @returns {APIResponse<PMData>}
   */


  async getAutofillInitData() {
    const response = await wkSendAndWait('pmHandlerGetAutofillInitData');
    this.storeLocalData(response.success);
    return response;
  }
  /**
   * Gets credentials ready for autofill
   * @param {Number} id - the credential id
   * @returns {APIResponse<CredentialsObject>}
   */


  getAutofillCredentials(id) {
    return wkSendAndWait('pmHandlerGetAutofillCredentials', {
      id
    });
  }
  /**
   * Opens the native UI for managing passwords
   */


  openManagePasswords() {
    return wkSend('pmHandlerOpenManagePasswords');
  }
  /**
   * Opens the native UI for managing identities
   */


  openManageIdentities() {
    return wkSend('pmHandlerOpenManageIdentities');
  }
  /**
   * Opens the native UI for managing credit cards
   */


  openManageCreditCards() {
    return wkSend('pmHandlerOpenManageCreditCards');
  }
  /**
   * Gets a single identity obj once the user requests it
   * @param {Number} id
   * @returns {Promise<{success: IdentityObject | undefined}>}
   */


  getAutofillIdentity(id) {
    const identity = this.getLocalIdentities().find(({
      id: identityId
    }) => "".concat(identityId) === "".concat(id));
    return Promise.resolve({
      success: identity
    });
  }
  /**
   * Gets a single complete credit card obj once the user requests it
   * @param {Number} id
   * @returns {APIResponse<CreditCardObject>}
   */


  getAutofillCreditCard(id) {
    return wkSendAndWait('pmHandlerGetCreditCard', {
      id
    });
  }

  async getAlias() {
    const {
      alias
    } = await wkSendAndWait('emailHandlerGetAlias', {
      requiresUserPermission: !isApp,
      shouldConsumeAliasIfProvided: !isApp
    });
    return formatDuckAddress(alias);
  }

}

module.exports = AppleDeviceInterface;

},{"../appleDeviceUtils/appleDeviceUtils":21,"../autofill-utils":23,"../scanForInputs.js":28,"./InterfacePrototype.js":5}],4:[function(require,module,exports){
"use strict";

const InterfacePrototype = require('./InterfacePrototype.js');

const {
  SIGN_IN_MSG,
  notifyWebApp,
  isDDGDomain,
  sendAndWaitForAnswer,
  setValue,
  formatDuckAddress
} = require('../autofill-utils');

const {
  scanForInputs
} = require('../scanForInputs.js');

class ExtensionInterface extends InterfacePrototype {
  isDeviceSignedIn() {
    return this.hasLocalAddresses;
  }

  setupAutofill({
    shouldLog
  } = {
    shouldLog: false
  }) {
    this.getAddresses().then(_addresses => {
      if (this.hasLocalAddresses) {
        notifyWebApp({
          deviceSignedIn: {
            value: true,
            shouldLog
          }
        });
        scanForInputs(this);
      } else {
        this.trySigningIn();
      }
    });
  }

  getAddresses() {
    return new Promise(resolve => chrome.runtime.sendMessage({
      getAddresses: true
    }, data => {
      this.storeLocalAddresses(data);
      return resolve(data);
    }));
  }

  refreshAlias() {
    return chrome.runtime.sendMessage({
      refreshAlias: true
    }, addresses => this.storeLocalAddresses(addresses));
  }

  async trySigningIn() {
    if (isDDGDomain()) {
      const data = await sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData');
      this.storeUserData(data);
    }
  }

  storeUserData(data) {
    return chrome.runtime.sendMessage(data);
  }

  addDeviceListeners() {
    // Add contextual menu listeners
    let activeEl = null;
    document.addEventListener('contextmenu', e => {
      activeEl = e.target;
    });
    chrome.runtime.onMessage.addListener((message, sender) => {
      if (sender.id !== chrome.runtime.id) return;

      switch (message.type) {
        case 'ddgUserReady':
          this.setupAutofill({
            shouldLog: true
          });
          break;

        case 'contextualAutofill':
          setValue(activeEl, formatDuckAddress(message.alias));
          activeEl.classList.add('ddg-autofilled');
          this.refreshAlias(); // If the user changes the alias, remove the decoration

          activeEl.addEventListener('input', e => e.target.classList.remove('ddg-autofilled'), {
            once: true
          });
          break;

        default:
          break;
      }
    });
  }

  addLogoutListener(handler) {
    // Cleanup on logout events
    chrome.runtime.onMessage.addListener((message, sender) => {
      if (sender.id === chrome.runtime.id && message.type === 'logout') {
        handler();
      }
    });
  }

}

module.exports = ExtensionInterface;

},{"../autofill-utils":23,"../scanForInputs.js":28,"./InterfacePrototype.js":5}],5:[function(require,module,exports){
"use strict";

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

const {
  ADDRESS_DOMAIN,
  SIGN_IN_MSG,
  isApp,
  isMobileApp,
  isDDGDomain,
  sendAndWaitForAnswer,
  formatDuckAddress
} = require('../autofill-utils');

const {
  forms
} = require('../scanForInputs');

const {
  formatFullName
} = require('../Form/formatters');

const EmailAutofill = require('../UI/EmailAutofill');

const DataAutofill = require('../UI/DataAutofill');

let attempts = 0;

var _addresses = new WeakMap();

var _data2 = new WeakMap();

class InterfacePrototype {
  constructor() {
    _addresses.set(this, {
      writable: true,
      value: {
        privateAddress: '',
        personalAddress: ''
      }
    });

    _data2.set(this, {
      writable: true,
      value: {
        credentials: [],
        creditCards: [],
        identities: []
      }
    });
  }

  get hasLocalAddresses() {
    var _classPrivateFieldGet2, _classPrivateFieldGet3;

    return !!((_classPrivateFieldGet2 = _classPrivateFieldGet(this, _addresses)) !== null && _classPrivateFieldGet2 !== void 0 && _classPrivateFieldGet2.privateAddress && (_classPrivateFieldGet3 = _classPrivateFieldGet(this, _addresses)) !== null && _classPrivateFieldGet3 !== void 0 && _classPrivateFieldGet3.personalAddress);
  }

  getLocalAddresses() {
    return _classPrivateFieldGet(this, _addresses);
  }

  storeLocalAddresses(addresses) {
    _classPrivateFieldSet(this, _addresses, addresses); // When we get new duck addresses, add them to the identities list


    const identities = this.getLocalIdentities();
    const privateAddressIdentity = identities.find(({
      id
    }) => id === 'privateAddress'); // If we had previously stored them, just update the private address

    if (privateAddressIdentity) {
      privateAddressIdentity.emailAddress = formatDuckAddress(addresses.privateAddress);
    } else {
      // Otherwise, add both addresses
      _classPrivateFieldGet(this, _data2).identities = this.addDuckAddressesToIdentities(identities);
    }
  }
  /** @type { PMData } */


  addDuckAddressesToIdentities(identities) {
    if (!this.hasLocalAddresses) return identities;
    const newIdentities = [];
    let {
      privateAddress,
      personalAddress
    } = this.getLocalAddresses();
    privateAddress = formatDuckAddress(privateAddress);
    personalAddress = formatDuckAddress(personalAddress); // Get the duck addresses in identities

    const duckEmailsInIdentities = identities.reduce((duckEmails, {
      emailAddress: email
    }) => email.includes(ADDRESS_DOMAIN) ? duckEmails.concat(email) : duckEmails, []); // Only add the personal duck address to identities if the user hasn't
    // already manually added it

    if (!duckEmailsInIdentities.includes(personalAddress)) {
      newIdentities.push({
        id: 'personalAddress',
        emailAddress: personalAddress,
        title: 'Blocks Email Trackers'
      });
    }

    newIdentities.push({
      id: 'privateAddress',
      emailAddress: privateAddress,
      title: 'Blocks Email Trackers and hides Your Address'
    });
    return [...identities, ...newIdentities];
  }
  /**
   * Stores init data coming from the device
   * @param { PMData } data
   */


  storeLocalData(data) {
    data.credentials.forEach(cred => delete cred.password);
    data.creditCards.forEach(cc => delete cc.cardNumber && delete cc.cardSecurityCode); // Store the full name as a separate field to simplify autocomplete

    const updatedIdentities = data.identities.map(identity => ({ ...identity,
      fullName: formatFullName(identity)
    })); // Add addresses

    data.identities = this.addDuckAddressesToIdentities(updatedIdentities);

    _classPrivateFieldSet(this, _data2, data);
  }

  get hasLocalCredentials() {
    return _classPrivateFieldGet(this, _data2).credentials.length > 0;
  }

  getLocalCredentials() {
    return _classPrivateFieldGet(this, _data2).credentials.map(cred => delete cred.password && cred);
  }

  get hasLocalIdentities() {
    return _classPrivateFieldGet(this, _data2).identities.length > 0;
  }

  getLocalIdentities() {
    return _classPrivateFieldGet(this, _data2).identities;
  }

  get hasLocalCreditCards() {
    return _classPrivateFieldGet(this, _data2).creditCards.length > 0;
  }

  getLocalCreditCards() {
    return _classPrivateFieldGet(this, _data2).creditCards;
  }

  init() {
    const start = () => {
      this.addDeviceListeners();
      this.setupAutofill();
    };

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start);
    }
  }

  attachTooltip(form, input) {
    form.activeInput = input;

    if (isMobileApp) {
      this.getAlias().then(alias => {
        if (alias) form.autofillEmail(alias);else form.activeInput.focus();
      });
    } else {
      if (form.tooltip) return;
      form.tooltip = !isApp ? new EmailAutofill(input, form, this) : new DataAutofill(input, form, this);
      form.intObs.observe(input);
      window.addEventListener('pointerdown', form.removeTooltip, {
        capture: true
      });
      window.addEventListener('input', form.removeTooltip, {
        once: true
      });
    }
  }

  getActiveForm() {
    return [...forms.values()].find(form => form.tooltip);
  }

  setupAutofill(_opts) {}

  getAddresses() {}

  refreshAlias() {}

  async trySigningIn() {
    if (isDDGDomain()) {
      if (attempts < 10) {
        attempts++;
        const data = await sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData'); // This call doesn't send a response, so we can't know if it succeeded

        this.storeUserData(data);
        this.setupAutofill({
          shouldLog: true
        });
      } else {
        console.warn('max attempts reached, bailing');
      }
    }
  }

  storeUserData(_data) {}

  addDeviceListeners() {}

  addLogoutListener() {}

  isDeviceSignedIn() {}
  /**
   * @returns {Promise<null|string>}
   */


  async getAlias() {
    return null;
  } // PM endpoints


  storeCredentials(_opts) {}

  getAccounts() {}

  getAutofillCredentials(_id) {}

  openManagePasswords() {}

}

module.exports = InterfacePrototype;

},{"../Form/formatters":9,"../UI/DataAutofill":16,"../UI/EmailAutofill":17,"../autofill-utils":23,"../scanForInputs":28}],6:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const FormAnalyzer = require('./FormAnalyzer');

const {
  SUBMIT_BUTTON_SELECTOR,
  FORM_ELS_SELECTOR
} = require('./selectors');

const {
  addInlineStyles,
  removeInlineStyles,
  setValue,
  isEventWithinDax,
  isMobileApp,
  isApp
} = require('../autofill-utils');

const {
  getInputSubtype,
  setInputType,
  getInputMainType
} = require('./input-classifiers');

const {
  getIconStylesAutofilled,
  getIconStylesBase
} = require('./inputStyles');

const {
  ATTR_AUTOFILL
} = require('../constants');

const getInputConfig = require('./inputTypeConfig.js');

const {
  getUnifiedExpiryDate,
  formatCCYear,
  getCountryName,
  prepareFormValuesForStorage,
  inferCountryCodeFromElement
} = require('./formatters');

class Form {
  constructor(form, _input, deviceInterface) {
    _defineProperty(this, "autofillInput", (input, string, dataType) => {
      const activeInputSubtype = getInputSubtype(this.activeInput);
      const inputSubtype = getInputSubtype(input);
      const isEmailAutofill = activeInputSubtype === 'emailAddress' && inputSubtype === 'emailAddress'; // Don't override values for identities, unless it's the current input or we're autofilling email

      if (dataType === 'identities' && // only for identities
      input.nodeName !== 'SELECT' && input.value !== '' && // if the input is not empty
      this.activeInput !== input && // and this is not the active input
      !isEmailAutofill // and we're not auto-filling email
      ) return; // do not overwrite the value

      const successful = setValue(input, string);
      if (!successful) return;
      input.classList.add('ddg-autofilled');
      addInlineStyles(input, getIconStylesAutofilled(input, this)); // If the user changes the value, remove the decoration

      input.addEventListener('input', e => this.removeAllHighlights(e, dataType), {
        once: true
      });
    });

    this.form = form;
    this.formAnalyzer = new FormAnalyzer(form, _input);
    this.isLogin = this.formAnalyzer.isLogin;
    this.isSignup = this.formAnalyzer.isSignup;
    this.device = deviceInterface;
    /** @type Object<'all' | SupportedMainTypes, Set> */

    this.inputs = {
      all: new Set(),
      credentials: new Set(),
      creditCards: new Set(),
      identities: new Set(),
      unknown: new Set()
    };
    this.touched = new Set();
    this.listeners = new Set();
    this.tooltip = null;
    this.activeInput = null; // We set this to true to skip event listeners while we're autofilling

    this.isAutofilling = false;
    this.handlerExecuted = false;
    this.shouldPromptToStoreData = true;

    this.submitHandler = () => {
      if (this.handlerExecuted) return;
      const values = this.getValues();

      if (this.hasValues(values)) {
        // ask to store credentials and/or fireproof
        if (this.shouldPromptToStoreData) {
          this.device.storeFormData(values);
        }

        this.handlerExecuted = true;
      }
    };
    /**
     * Get values from the form and format them for our device storage
     * @return {DataStorageObject}
     */


    this.getValues = () => {
      const formValues = [...this.inputs.credentials, ...this.inputs.identities, ...this.inputs.creditCards].reduce((output, inputEl) => {
        var _output$mainType;

        const mainType = getInputMainType(inputEl);
        const subtype = getInputSubtype(inputEl);
        let value = inputEl.value || ((_output$mainType = output[mainType]) === null || _output$mainType === void 0 ? void 0 : _output$mainType[subtype]);

        if (subtype === 'addressCountryCode') {
          value = inferCountryCodeFromElement(inputEl);
        }

        if (value) {
          output[mainType][subtype] = value;
        }

        return output;
      }, {
        credentials: {},
        creditCards: {},
        identities: {}
      });
      return prepareFormValuesForStorage(formValues);
    };
    /**
     * Determine if the form has values we want to store in the device
     * @param {DataStorageObject} [values]
     * @return {boolean}
     */


    this.hasValues = values => {
      const {
        credentials,
        creditCards,
        identities
      } = values || this.getValues();
      return Boolean(credentials || creditCards || identities);
    };
    /**
     * @type {IntersectionObserver | null}
     */


    this.intObs = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) this.removeTooltip();
      }
    });

    this.removeTooltip = e => {
      var _this$intObs;

      if (this.isAutofilling || !this.tooltip || e && e.target === this.tooltip.host) {
        return;
      }

      this.tooltip.remove();
      this.tooltip = null;
      (_this$intObs = this.intObs) === null || _this$intObs === void 0 ? void 0 : _this$intObs.disconnect();
      window.removeEventListener('pointerdown', this.removeTooltip, {
        capture: true
      });
    };

    this.removeInputHighlight = input => {
      removeInlineStyles(input, getIconStylesAutofilled(input, this));
      input.classList.remove('ddg-autofilled');
      this.addAutofillStyles(input);
    };

    this.removeAllHighlights = (e, dataType) => {
      // This ensures we are not removing the highlight ourselves when autofilling more than once
      if (e && !e.isTrusted) return; // If the user has changed the value, we prompt to update the stored creds

      this.shouldPromptToStoreData = true;
      this.execOnInputs(this.removeInputHighlight, dataType);
    };

    this.removeInputDecoration = input => {
      removeInlineStyles(input, getIconStylesBase(input, this));
      input.removeAttribute(ATTR_AUTOFILL);
    };

    this.removeAllDecorations = () => {
      this.execOnInputs(this.removeInputDecoration);
      this.listeners.forEach(({
        el,
        type,
        fn
      }) => el.removeEventListener(type, fn));
    };

    this.redecorateAllInputs = () => {
      this.removeAllDecorations();
      this.execOnInputs(input => this.decorateInput(input));
    };

    this.resetAllInputs = () => {
      this.execOnInputs(input => {
        setValue(input, '');
        this.removeInputHighlight(input);
      });
      if (this.activeInput) this.activeInput.focus();
    };

    this.dismissTooltip = () => {
      this.removeTooltip();
    }; // This removes all listeners to avoid memory leaks and weird behaviours


    this.destroy = () => {
      this.removeAllDecorations();
      this.removeTooltip();
      this.intObs = null;
    };

    this.categorizeInputs();
    return this;
  }

  categorizeInputs() {
    this.form.querySelectorAll(FORM_ELS_SELECTOR).forEach(input => this.addInput(input));
  }

  get submitButtons() {
    return [...this.form.querySelectorAll(SUBMIT_BUTTON_SELECTOR)].filter(button => {
      const content = button.textContent;
      const ariaLabel = button.getAttribute('aria-label');
      const title = button.title; // trying to exclude the little buttons to show and hide passwords

      return !/password|show|toggle|reveal|hide/i.test(content + ariaLabel + title);
    });
  }

  execOnInputs(fn, inputType = 'all') {
    const inputs = this.inputs[inputType];

    for (const input of inputs) {
      const {
        shouldDecorate
      } = getInputConfig(input);
      if (shouldDecorate(input, this)) fn(input);
    }
  }

  addInput(input) {
    if (this.inputs.all.has(input)) return this;
    this.inputs.all.add(input);
    setInputType(input, this);
    const mainInputType = getInputMainType(input);
    this.inputs[mainInputType].add(input);
    this.decorateInput(input);
    return this;
  }

  areAllInputsEmpty(inputType) {
    let allEmpty = true;
    this.execOnInputs(input => {
      if (input.value) allEmpty = false;
    }, inputType);
    return allEmpty;
  }

  addListener(el, type, fn) {
    el.addEventListener(type, fn);
    this.listeners.add({
      el,
      type,
      fn
    });
  }

  addAutofillStyles(input) {
    const styles = getIconStylesBase(input, this);
    addInlineStyles(input, styles);
  }

  decorateInput(input) {
    const config = getInputConfig(input);
    if (!config.shouldDecorate(input, this)) return this;
    input.setAttribute(ATTR_AUTOFILL, 'true');
    const hasIcon = !!config.getIconBase(input, this);

    if (hasIcon) {
      this.addAutofillStyles(input);
      this.addListener(input, 'mousemove', e => {
        if (isEventWithinDax(e, e.target)) {
          e.target.style.setProperty('cursor', 'pointer', 'important');
        } else {
          e.target.style.removeProperty('cursor');
        }
      });
    }

    const handler = e => {
      if (this.tooltip || this.isAutofilling) return; // Checks for mousedown event

      if (e.type === 'pointerdown') {
        if (!e.isTrusted) return;
        const isMainMouseButton = e.button === 0;
        if (!isMainMouseButton) return;
      }

      if (this.shouldOpenTooltip(e, e.target)) {
        if (isEventWithinDax(e, e.target) || isMobileApp) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }

        this.touched.add(e.target);
        this.device.attachTooltip(this, e.target);
      }
    };

    if (input.nodeName !== 'SELECT') {
      const events = ['pointerdown'];
      if (!isMobileApp) events.push('focus');
      events.forEach(ev => this.addListener(input, ev, handler));
    }

    return this;
  }

  shouldOpenTooltip(e, input) {
    if (isApp) return true;
    const inputType = getInputMainType(input);
    return !this.touched.has(input) && this.areAllInputsEmpty(inputType) || isEventWithinDax(e, input);
  }

  autofillEmail(alias, dataType = 'emailAddress') {
    this.isAutofilling = true;
    this.execOnInputs(input => this.autofillInput(input, alias, dataType), dataType);
    this.isAutofilling = false;

    if (this.tooltip) {
      this.removeTooltip();
    }
  }

  autofillData(data, dataType) {
    this.shouldPromptToStoreData = false;
    this.isAutofilling = true;
    this.execOnInputs(input => {
      const inputSubtype = getInputSubtype(input);
      let autofillData = data[inputSubtype];

      if (inputSubtype === 'expiration') {
        autofillData = getUnifiedExpiryDate(input, data.expirationMonth, data.expirationYear, this.form);
      }

      if (inputSubtype === 'expirationYear' && input.nodeName === 'INPUT') {
        autofillData = formatCCYear(input, autofillData, this.form);
      }

      if (inputSubtype === 'addressCountryCode') {
        autofillData = getCountryName(input, data);
      }

      if (autofillData) this.autofillInput(input, autofillData, dataType);
    }, dataType);
    this.isAutofilling = false;

    if (this.tooltip) {
      this.removeTooltip();
    }
  }

}

module.exports = Form;

},{"../autofill-utils":23,"../constants":25,"./FormAnalyzer":7,"./formatters":9,"./input-classifiers":10,"./inputStyles":11,"./inputTypeConfig.js":12,"./selectors":15}],7:[function(require,module,exports){
"use strict";

const {
  PASSWORD_SELECTOR,
  SUBMIT_BUTTON_SELECTOR
} = require('./selectors');

const {
  removeExcessWhitespace
} = require('./input-classifiers');

const {
  TEXT_LENGTH_CUTOFF
} = require('../constants');

class FormAnalyzer {
  constructor(form, input) {
    this.form = form;
    this.autofillSignal = 0;
    this.signals = []; // Avoid autofill on our signup page

    if (window.location.href.match(/^https:\/\/(.+\.)?duckduckgo\.com\/email\/choose-address/i)) {
      return this;
    }

    this.evaluateElAttributes(input, 3, true);
    form ? this.evaluateForm() : this.evaluatePage();
    return this;
  }

  get isLogin() {
    return this.autofillSignal < 0;
  }

  get isSignup() {
    return this.autofillSignal >= 0;
  }

  increaseSignalBy(strength, signal) {
    this.autofillSignal += strength;
    this.signals.push("".concat(signal, ": +").concat(strength));
    return this;
  }

  decreaseSignalBy(strength, signal) {
    this.autofillSignal -= strength;
    this.signals.push("".concat(signal, ": -").concat(strength));
    return this;
  }

  updateSignal({
    string,
    // The string to check
    strength,
    // Strength of the signal
    signalType = 'generic',
    // For debugging purposes, we give a name to the signal
    shouldFlip = false,
    // Flips the signals, i.e. when a link points outside. See below
    shouldCheckUnifiedForm = false,
    // Should check for login/signup forms
    shouldBeConservative = false // Should use the conservative signup regex

  }) {
    const negativeRegex = new RegExp(/sign(ing)?.?in(?!g)|log.?in|unsubscri/i);
    const positiveRegex = new RegExp(/sign(ing)?.?up|join|\bregist(er|ration)|newsletter|\bsubscri(be|ption)|contact|create|start|settings|preferences|profile|update|checkout|guest|purchase|buy|order|schedule|estimate|request/i);
    const conservativePositiveRegex = new RegExp(/sign.?up|join|register|newsletter|subscri(be|ption)|settings|preferences|profile|update/i);
    const strictPositiveRegex = new RegExp(/sign.?up|join|register|settings|preferences|profile|update/i);
    const matchesNegative = string === 'current-password' || string.match(negativeRegex); // Check explicitly for unified login/signup forms. They should always be negative, so we increase signal

    if (shouldCheckUnifiedForm && matchesNegative && string.match(strictPositiveRegex)) {
      this.decreaseSignalBy(strength + 2, "Unified detected ".concat(signalType));
      return this;
    }

    const matchesPositive = string === 'new-password' || string.match(shouldBeConservative ? conservativePositiveRegex : positiveRegex); // In some cases a login match means the login is somewhere else, i.e. when a link points outside

    if (shouldFlip) {
      if (matchesNegative) this.increaseSignalBy(strength, signalType);
      if (matchesPositive) this.decreaseSignalBy(strength, signalType);
    } else {
      if (matchesNegative) this.decreaseSignalBy(strength, signalType);
      if (matchesPositive) this.increaseSignalBy(strength, signalType);
    }

    return this;
  }

  evaluateElAttributes(el, signalStrength = 3, isInput = false) {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name === 'style') return;
      const attributeString = "".concat(attr.name, "=").concat(attr.value);
      this.updateSignal({
        string: attributeString,
        strength: signalStrength,
        signalType: "".concat(el.name, " attr: ").concat(attributeString),
        shouldCheckUnifiedForm: isInput
      });
    });
  }

  evaluatePageTitle() {
    const pageTitle = document.title;
    this.updateSignal({
      string: pageTitle,
      strength: 2,
      signalType: "page title: ".concat(pageTitle)
    });
  }

  evaluatePageHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, [class*="title"], [id*="title"]');

    if (headings) {
      headings.forEach(({
        textContent
      }) => {
        textContent = removeExcessWhitespace(textContent || '');
        this.updateSignal({
          string: textContent,
          strength: 0.5,
          signalType: "heading: ".concat(textContent),
          shouldCheckUnifiedForm: true,
          shouldBeConservative: true
        });
      });
    }
  }

  evaluatePage() {
    this.evaluatePageTitle();
    this.evaluatePageHeadings(); // Check for submit buttons

    const buttons = document.querySelectorAll("\n                button[type=submit],\n                button:not([type]),\n                [role=button]\n            ");
    buttons.forEach(button => {
      // if the button has a form, it's not related to our input, because our input has no form here
      if (button instanceof HTMLButtonElement) {
        if (!button.form && !button.closest('form')) {
          this.evaluateElement(button);
          this.evaluateElAttributes(button, 0.5);
        }
      }
    });
  }

  elementIs(el, type) {
    return el.nodeName.toLowerCase() === type.toLowerCase();
  }

  getText(el) {
    // for buttons, we don't care about descendants, just get the whole text as is
    // this is important in order to give proper attribution of the text to the button
    if (this.elementIs(el, 'BUTTON')) return removeExcessWhitespace(el.textContent);
    if (this.elementIs(el, 'INPUT') && ['submit', 'button'].includes(el.type)) return el.value;
    return removeExcessWhitespace(Array.from(el.childNodes).reduce((text, child) => this.elementIs(child, '#text') ? text + ' ' + child.textContent : text, ''));
  }

  evaluateElement(el) {
    const string = this.getText(el);

    if (el.matches(PASSWORD_SELECTOR)) {
      // These are explicit signals by the web author, so we weigh them heavily
      this.updateSignal({
        string: el.getAttribute('autocomplete') || '',
        strength: 20,
        signalType: "explicit: ".concat(el.getAttribute('autocomplete'))
      });
    } // check button contents


    if (el.matches(SUBMIT_BUTTON_SELECTOR)) {
      // If we're sure this is a submit button, it's a stronger signal
      const strength = el.getAttribute('type') === 'submit' || /primary|submit/i.test(el.className) || el.offsetHeight * el.offsetWidth >= 10000 ? 20 : 2;
      this.updateSignal({
        string,
        strength,
        signalType: "submit: ".concat(string)
      });
    } // if a link points to relevant urls or contain contents outside the page…


    if (this.elementIs(el, 'A') && el.href && el.href !== '#' || (el.getAttribute('role') || '').toUpperCase() === 'LINK') {
      // …and matches one of the regexes, we assume the match is not pertinent to the current form
      this.updateSignal({
        string,
        strength: 1,
        signalType: "external link: ".concat(string),
        shouldFlip: true
      });
    } else {
      var _removeExcessWhitespa;

      // any other case
      // only consider the el if it's a small text to avoid noisy disclaimers
      if (((_removeExcessWhitespa = removeExcessWhitespace(el.textContent)) === null || _removeExcessWhitespa === void 0 ? void 0 : _removeExcessWhitespa.length) < TEXT_LENGTH_CUTOFF) {
        this.updateSignal({
          string,
          strength: 1,
          signalType: "generic: ".concat(string),
          shouldCheckUnifiedForm: true
        });
      }
    }
  }

  evaluateForm() {
    // Check page title
    this.evaluatePageTitle(); // Check form attributes

    this.evaluateElAttributes(this.form); // Check form contents (skip select and option because they contain too much noise)

    this.form.querySelectorAll('*:not(select):not(option)').forEach(el => {
      // Check if element is not hidden. Note that we can't use offsetHeight
      // nor intersectionObserver, because the element could be outside the
      // viewport or its parent hidden
      const displayValue = window.getComputedStyle(el, null).getPropertyValue('display');
      if (displayValue !== 'none') this.evaluateElement(el);
    }); // If we can't decide at this point, try reading page headings

    if (this.autofillSignal === 0) {
      this.evaluatePageHeadings();
    }

    return this;
  }

}

module.exports = FormAnalyzer;

},{"../constants":25,"./input-classifiers":10,"./selectors":15}],8:[function(require,module,exports){
"use strict";

/**
 * Country names object using 2-letter country codes to reference country name
 * Derived from the Intl.DisplayNames implementation
 * @source https://stackoverflow.com/a/70517921/1948947
 */
const COUNTRY_CODES_TO_NAMES = {
  AC: 'Ascension Island',
  AD: 'Andorra',
  AE: 'United Arab Emirates',
  AF: 'Afghanistan',
  AG: 'Antigua & Barbuda',
  AI: 'Anguilla',
  AL: 'Albania',
  AM: 'Armenia',
  AN: 'Curaçao',
  AO: 'Angola',
  AQ: 'Antarctica',
  AR: 'Argentina',
  AS: 'American Samoa',
  AT: 'Austria',
  AU: 'Australia',
  AW: 'Aruba',
  AX: 'Åland Islands',
  AZ: 'Azerbaijan',
  BA: 'Bosnia & Herzegovina',
  BB: 'Barbados',
  BD: 'Bangladesh',
  BE: 'Belgium',
  BF: 'Burkina Faso',
  BG: 'Bulgaria',
  BH: 'Bahrain',
  BI: 'Burundi',
  BJ: 'Benin',
  BL: 'St. Barthélemy',
  BM: 'Bermuda',
  BN: 'Brunei',
  BO: 'Bolivia',
  BQ: 'Caribbean Netherlands',
  BR: 'Brazil',
  BS: 'Bahamas',
  BT: 'Bhutan',
  BU: 'Myanmar (Burma)',
  BV: 'Bouvet Island',
  BW: 'Botswana',
  BY: 'Belarus',
  BZ: 'Belize',
  CA: 'Canada',
  CC: 'Cocos (Keeling) Islands',
  CD: 'Congo - Kinshasa',
  CF: 'Central African Republic',
  CG: 'Congo - Brazzaville',
  CH: 'Switzerland',
  CI: 'Côte d’Ivoire',
  CK: 'Cook Islands',
  CL: 'Chile',
  CM: 'Cameroon',
  CN: 'China mainland',
  CO: 'Colombia',
  CP: 'Clipperton Island',
  CR: 'Costa Rica',
  CS: 'Serbia',
  CU: 'Cuba',
  CV: 'Cape Verde',
  CW: 'Curaçao',
  CX: 'Christmas Island',
  CY: 'Cyprus',
  CZ: 'Czechia',
  DD: 'Germany',
  DE: 'Germany',
  DG: 'Diego Garcia',
  DJ: 'Djibouti',
  DK: 'Denmark',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  DY: 'Benin',
  DZ: 'Algeria',
  EA: 'Ceuta & Melilla',
  EC: 'Ecuador',
  EE: 'Estonia',
  EG: 'Egypt',
  EH: 'Western Sahara',
  ER: 'Eritrea',
  ES: 'Spain',
  ET: 'Ethiopia',
  EU: 'European Union',
  EZ: 'Eurozone',
  FI: 'Finland',
  FJ: 'Fiji',
  FK: 'Falkland Islands',
  FM: 'Micronesia',
  FO: 'Faroe Islands',
  FR: 'France',
  FX: 'France',
  GA: 'Gabon',
  GB: 'United Kingdom',
  GD: 'Grenada',
  GE: 'Georgia',
  GF: 'French Guiana',
  GG: 'Guernsey',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GL: 'Greenland',
  GM: 'Gambia',
  GN: 'Guinea',
  GP: 'Guadeloupe',
  GQ: 'Equatorial Guinea',
  GR: 'Greece',
  GS: 'So. Georgia & So. Sandwich Isl.',
  GT: 'Guatemala',
  GU: 'Guam',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HK: 'Hong Kong',
  HM: 'Heard & McDonald Islands',
  HN: 'Honduras',
  HR: 'Croatia',
  HT: 'Haiti',
  HU: 'Hungary',
  HV: 'Burkina Faso',
  IC: 'Canary Islands',
  ID: 'Indonesia',
  IE: 'Ireland',
  IL: 'Israel',
  IM: 'Isle of Man',
  IN: 'India',
  IO: 'Chagos Archipelago',
  IQ: 'Iraq',
  IR: 'Iran',
  IS: 'Iceland',
  IT: 'Italy',
  JE: 'Jersey',
  JM: 'Jamaica',
  JO: 'Jordan',
  JP: 'Japan',
  KE: 'Kenya',
  KG: 'Kyrgyzstan',
  KH: 'Cambodia',
  KI: 'Kiribati',
  KM: 'Comoros',
  KN: 'St. Kitts & Nevis',
  KP: 'North Korea',
  KR: 'South Korea',
  KW: 'Kuwait',
  KY: 'Cayman Islands',
  KZ: 'Kazakhstan',
  LA: 'Laos',
  LB: 'Lebanon',
  LC: 'St. Lucia',
  LI: 'Liechtenstein',
  LK: 'Sri Lanka',
  LR: 'Liberia',
  LS: 'Lesotho',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LV: 'Latvia',
  LY: 'Libya',
  MA: 'Morocco',
  MC: 'Monaco',
  MD: 'Moldova',
  ME: 'Montenegro',
  MF: 'St. Martin',
  MG: 'Madagascar',
  MH: 'Marshall Islands',
  MK: 'North Macedonia',
  ML: 'Mali',
  MM: 'Myanmar (Burma)',
  MN: 'Mongolia',
  MO: 'Macao',
  MP: 'Northern Mariana Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MS: 'Montserrat',
  MT: 'Malta',
  MU: 'Mauritius',
  MV: 'Maldives',
  MW: 'Malawi',
  MX: 'Mexico',
  MY: 'Malaysia',
  MZ: 'Mozambique',
  NA: 'Namibia',
  NC: 'New Caledonia',
  NE: 'Niger',
  NF: 'Norfolk Island',
  NG: 'Nigeria',
  NH: 'Vanuatu',
  NI: 'Nicaragua',
  NL: 'Netherlands',
  NO: 'Norway',
  NP: 'Nepal',
  NR: 'Nauru',
  NU: 'Niue',
  NZ: 'New Zealand',
  OM: 'Oman',
  PA: 'Panama',
  PE: 'Peru',
  PF: 'French Polynesia',
  PG: 'Papua New Guinea',
  PH: 'Philippines',
  PK: 'Pakistan',
  PL: 'Poland',
  PM: 'St. Pierre & Miquelon',
  PN: 'Pitcairn Islands',
  PR: 'Puerto Rico',
  PS: 'Palestinian Territories',
  PT: 'Portugal',
  PW: 'Palau',
  PY: 'Paraguay',
  QA: 'Qatar',
  QO: 'Outlying Oceania',
  RE: 'Réunion',
  RH: 'Zimbabwe',
  RO: 'Romania',
  RS: 'Serbia',
  RU: 'Russia',
  RW: 'Rwanda',
  SA: 'Saudi Arabia',
  SB: 'Solomon Islands',
  SC: 'Seychelles',
  SD: 'Sudan',
  SE: 'Sweden',
  SG: 'Singapore',
  SH: 'St. Helena',
  SI: 'Slovenia',
  SJ: 'Svalbard & Jan Mayen',
  SK: 'Slovakia',
  SL: 'Sierra Leone',
  SM: 'San Marino',
  SN: 'Senegal',
  SO: 'Somalia',
  SR: 'Suriname',
  SS: 'South Sudan',
  ST: 'São Tomé & Príncipe',
  SU: 'Russia',
  SV: 'El Salvador',
  SX: 'Sint Maarten',
  SY: 'Syria',
  SZ: 'Eswatini',
  TA: 'Tristan da Cunha',
  TC: 'Turks & Caicos Islands',
  TD: 'Chad',
  TF: 'French Southern Territories',
  TG: 'Togo',
  TH: 'Thailand',
  TJ: 'Tajikistan',
  TK: 'Tokelau',
  TL: 'Timor-Leste',
  TM: 'Turkmenistan',
  TN: 'Tunisia',
  TO: 'Tonga',
  TP: 'Timor-Leste',
  TR: 'Turkey',
  TT: 'Trinidad & Tobago',
  TV: 'Tuvalu',
  TW: 'Taiwan',
  TZ: 'Tanzania',
  UA: 'Ukraine',
  UG: 'Uganda',
  UK: 'United Kingdom',
  UM: 'U.S. Outlying Islands',
  UN: 'United Nations',
  US: 'United States',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VA: 'Vatican City',
  VC: 'St. Vincent & Grenadines',
  VD: 'Vietnam',
  VE: 'Venezuela',
  VG: 'British Virgin Islands',
  VI: 'U.S. Virgin Islands',
  VN: 'Vietnam',
  VU: 'Vanuatu',
  WF: 'Wallis & Futuna',
  WS: 'Samoa',
  XA: 'Pseudo-Accents',
  XB: 'Pseudo-Bidi',
  XK: 'Kosovo',
  YD: 'Yemen',
  YE: 'Yemen',
  YT: 'Mayotte',
  YU: 'Serbia',
  ZA: 'South Africa',
  ZM: 'Zambia',
  ZR: 'Congo - Kinshasa',
  ZW: 'Zimbabwe',
  ZZ: 'Unknown Region'
};
/**
 * Country names object using country name to reference 2-letter country codes
 * Derived from the solution above with
 * Object.fromEntries(Object.entries(COUNTRY_CODES_TO_NAMES).map(entry => [entry[1], entry[0]]))
 */

const COUNTRY_NAMES_TO_CODES = {
  'Ascension Island': 'AC',
  Andorra: 'AD',
  'United Arab Emirates': 'AE',
  Afghanistan: 'AF',
  'Antigua & Barbuda': 'AG',
  Anguilla: 'AI',
  Albania: 'AL',
  Armenia: 'AM',
  'Curaçao': 'CW',
  Angola: 'AO',
  Antarctica: 'AQ',
  Argentina: 'AR',
  'American Samoa': 'AS',
  Austria: 'AT',
  Australia: 'AU',
  Aruba: 'AW',
  'Åland Islands': 'AX',
  Azerbaijan: 'AZ',
  'Bosnia & Herzegovina': 'BA',
  Barbados: 'BB',
  Bangladesh: 'BD',
  Belgium: 'BE',
  'Burkina Faso': 'HV',
  Bulgaria: 'BG',
  Bahrain: 'BH',
  Burundi: 'BI',
  Benin: 'DY',
  'St. Barthélemy': 'BL',
  Bermuda: 'BM',
  Brunei: 'BN',
  Bolivia: 'BO',
  'Caribbean Netherlands': 'BQ',
  Brazil: 'BR',
  Bahamas: 'BS',
  Bhutan: 'BT',
  'Myanmar (Burma)': 'MM',
  'Bouvet Island': 'BV',
  Botswana: 'BW',
  Belarus: 'BY',
  Belize: 'BZ',
  Canada: 'CA',
  'Cocos (Keeling) Islands': 'CC',
  'Congo - Kinshasa': 'ZR',
  'Central African Republic': 'CF',
  'Congo - Brazzaville': 'CG',
  Switzerland: 'CH',
  'Côte d’Ivoire': 'CI',
  'Cook Islands': 'CK',
  Chile: 'CL',
  Cameroon: 'CM',
  'China mainland': 'CN',
  Colombia: 'CO',
  'Clipperton Island': 'CP',
  'Costa Rica': 'CR',
  Serbia: 'YU',
  Cuba: 'CU',
  'Cape Verde': 'CV',
  'Christmas Island': 'CX',
  Cyprus: 'CY',
  Czechia: 'CZ',
  Germany: 'DE',
  'Diego Garcia': 'DG',
  Djibouti: 'DJ',
  Denmark: 'DK',
  Dominica: 'DM',
  'Dominican Republic': 'DO',
  Algeria: 'DZ',
  'Ceuta & Melilla': 'EA',
  Ecuador: 'EC',
  Estonia: 'EE',
  Egypt: 'EG',
  'Western Sahara': 'EH',
  Eritrea: 'ER',
  Spain: 'ES',
  Ethiopia: 'ET',
  'European Union': 'EU',
  Eurozone: 'EZ',
  Finland: 'FI',
  Fiji: 'FJ',
  'Falkland Islands': 'FK',
  Micronesia: 'FM',
  'Faroe Islands': 'FO',
  France: 'FX',
  Gabon: 'GA',
  'United Kingdom': 'UK',
  Grenada: 'GD',
  Georgia: 'GE',
  'French Guiana': 'GF',
  Guernsey: 'GG',
  Ghana: 'GH',
  Gibraltar: 'GI',
  Greenland: 'GL',
  Gambia: 'GM',
  Guinea: 'GN',
  Guadeloupe: 'GP',
  'Equatorial Guinea': 'GQ',
  Greece: 'GR',
  'So. Georgia & So. Sandwich Isl.': 'GS',
  Guatemala: 'GT',
  Guam: 'GU',
  'Guinea-Bissau': 'GW',
  Guyana: 'GY',
  'Hong Kong': 'HK',
  'Heard & McDonald Islands': 'HM',
  Honduras: 'HN',
  Croatia: 'HR',
  Haiti: 'HT',
  Hungary: 'HU',
  'Canary Islands': 'IC',
  Indonesia: 'ID',
  Ireland: 'IE',
  Israel: 'IL',
  'Isle of Man': 'IM',
  India: 'IN',
  'Chagos Archipelago': 'IO',
  Iraq: 'IQ',
  Iran: 'IR',
  Iceland: 'IS',
  Italy: 'IT',
  Jersey: 'JE',
  Jamaica: 'JM',
  Jordan: 'JO',
  Japan: 'JP',
  Kenya: 'KE',
  Kyrgyzstan: 'KG',
  Cambodia: 'KH',
  Kiribati: 'KI',
  Comoros: 'KM',
  'St. Kitts & Nevis': 'KN',
  'North Korea': 'KP',
  'South Korea': 'KR',
  Kuwait: 'KW',
  'Cayman Islands': 'KY',
  Kazakhstan: 'KZ',
  Laos: 'LA',
  Lebanon: 'LB',
  'St. Lucia': 'LC',
  Liechtenstein: 'LI',
  'Sri Lanka': 'LK',
  Liberia: 'LR',
  Lesotho: 'LS',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Latvia: 'LV',
  Libya: 'LY',
  Morocco: 'MA',
  Monaco: 'MC',
  Moldova: 'MD',
  Montenegro: 'ME',
  'St. Martin': 'MF',
  Madagascar: 'MG',
  'Marshall Islands': 'MH',
  'North Macedonia': 'MK',
  Mali: 'ML',
  Mongolia: 'MN',
  Macao: 'MO',
  'Northern Mariana Islands': 'MP',
  Martinique: 'MQ',
  Mauritania: 'MR',
  Montserrat: 'MS',
  Malta: 'MT',
  Mauritius: 'MU',
  Maldives: 'MV',
  Malawi: 'MW',
  Mexico: 'MX',
  Malaysia: 'MY',
  Mozambique: 'MZ',
  Namibia: 'NA',
  'New Caledonia': 'NC',
  Niger: 'NE',
  'Norfolk Island': 'NF',
  Nigeria: 'NG',
  Vanuatu: 'VU',
  Nicaragua: 'NI',
  Netherlands: 'NL',
  Norway: 'NO',
  Nepal: 'NP',
  Nauru: 'NR',
  Niue: 'NU',
  'New Zealand': 'NZ',
  Oman: 'OM',
  Panama: 'PA',
  Peru: 'PE',
  'French Polynesia': 'PF',
  'Papua New Guinea': 'PG',
  Philippines: 'PH',
  Pakistan: 'PK',
  Poland: 'PL',
  'St. Pierre & Miquelon': 'PM',
  'Pitcairn Islands': 'PN',
  'Puerto Rico': 'PR',
  'Palestinian Territories': 'PS',
  Portugal: 'PT',
  Palau: 'PW',
  Paraguay: 'PY',
  Qatar: 'QA',
  'Outlying Oceania': 'QO',
  'Réunion': 'RE',
  Zimbabwe: 'ZW',
  Romania: 'RO',
  Russia: 'SU',
  Rwanda: 'RW',
  'Saudi Arabia': 'SA',
  'Solomon Islands': 'SB',
  Seychelles: 'SC',
  Sudan: 'SD',
  Sweden: 'SE',
  Singapore: 'SG',
  'St. Helena': 'SH',
  Slovenia: 'SI',
  'Svalbard & Jan Mayen': 'SJ',
  Slovakia: 'SK',
  'Sierra Leone': 'SL',
  'San Marino': 'SM',
  Senegal: 'SN',
  Somalia: 'SO',
  Suriname: 'SR',
  'South Sudan': 'SS',
  'São Tomé & Príncipe': 'ST',
  'El Salvador': 'SV',
  'Sint Maarten': 'SX',
  Syria: 'SY',
  Eswatini: 'SZ',
  'Tristan da Cunha': 'TA',
  'Turks & Caicos Islands': 'TC',
  Chad: 'TD',
  'French Southern Territories': 'TF',
  Togo: 'TG',
  Thailand: 'TH',
  Tajikistan: 'TJ',
  Tokelau: 'TK',
  'Timor-Leste': 'TP',
  Turkmenistan: 'TM',
  Tunisia: 'TN',
  Tonga: 'TO',
  Turkey: 'TR',
  'Trinidad & Tobago': 'TT',
  Tuvalu: 'TV',
  Taiwan: 'TW',
  Tanzania: 'TZ',
  Ukraine: 'UA',
  Uganda: 'UG',
  'U.S. Outlying Islands': 'UM',
  'United Nations': 'UN',
  'United States': 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
  'Vatican City': 'VA',
  'St. Vincent & Grenadines': 'VC',
  Vietnam: 'VN',
  Venezuela: 'VE',
  'British Virgin Islands': 'VG',
  'U.S. Virgin Islands': 'VI',
  'Wallis & Futuna': 'WF',
  Samoa: 'WS',
  'Pseudo-Accents': 'XA',
  'Pseudo-Bidi': 'XB',
  Kosovo: 'XK',
  Yemen: 'YE',
  Mayotte: 'YT',
  'South Africa': 'ZA',
  Zambia: 'ZM',
  'Unknown Region': 'ZZ'
};
module.exports = {
  COUNTRY_CODES_TO_NAMES,
  COUNTRY_NAMES_TO_CODES
};

},{}],9:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

const {
  FOUR_DIGIT_YEAR_REGEX,
  DATE_SEPARATOR_REGEX
} = require('./selectors');

const {
  matchInPlaceholderAndLabels,
  checkPlaceholderAndLabels
} = require('./input-classifiers');

const {
  COUNTRY_CODES_TO_NAMES,
  COUNTRY_NAMES_TO_CODES
} = require('./countryNames');
/**
 * Format the cc year to best adapt to the input requirements (YY vs YYYY)
 * @param {HTMLInputElement} input
 * @param {number} year
 * @param {HTMLFormElement} form
 * @returns {number}
 */


const formatCCYear = (input, year, form) => {
  if (input.maxLength === 4 || checkPlaceholderAndLabels(input, FOUR_DIGIT_YEAR_REGEX, form)) return year;
  return year - 2000;
};
/**
 * Get a unified expiry date with separator
 * @param {HTMLInputElement} input
 * @param {number} month
 * @param {number} year
 * @param {HTMLFormElement} form
 * @returns {string}
 */


const getUnifiedExpiryDate = (input, month, year, form) => {
  var _matchInPlaceholderAn, _matchInPlaceholderAn2;

  const formattedYear = formatCCYear(input, year, form);
  const paddedMonth = "".concat(month).padStart(2, '0');
  const separator = ((_matchInPlaceholderAn = matchInPlaceholderAndLabels(input, DATE_SEPARATOR_REGEX, form)) === null || _matchInPlaceholderAn === void 0 ? void 0 : (_matchInPlaceholderAn2 = _matchInPlaceholderAn.groups) === null || _matchInPlaceholderAn2 === void 0 ? void 0 : _matchInPlaceholderAn2.separator) || '/';
  return "".concat(paddedMonth).concat(separator).concat(formattedYear);
};

const formatFullName = ({
  firstName = '',
  middleName = '',
  lastName = ''
}) => "".concat(firstName, " ").concat(middleName ? middleName + ' ' : '').concat(lastName).trim();
/**
 * Tries to look up a human-readable country name from the country code
 * @param {string} locale
 * @param {string} addressCountryCode
 * @return {string} - Returns the country code if we can't find a name
 */


const getCountryDisplayName = (locale, addressCountryCode) => {
  try {
    const regionNames = new Intl.DisplayNames([locale], {
      type: 'region'
    });
    return regionNames.of(addressCountryCode);
  } catch (e) {
    return COUNTRY_CODES_TO_NAMES[addressCountryCode] || addressCountryCode;
  }
};
/**
 * Tries to infer the element locale or returns 'en'
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @return {string | 'en'}
 */


const inferElementLocale = el => {
  var _el$form;

  return el.lang || ((_el$form = el.form) === null || _el$form === void 0 ? void 0 : _el$form.lang) || document.body.lang || document.documentElement.lang || 'en';
};
/**
 * Tries to format the country code into a localised country name
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @param {{addressCountryCode?: string}} options
 */


const getCountryName = (el, options = {}) => {
  const {
    addressCountryCode
  } = options;
  if (!addressCountryCode) return ''; // Try to infer the field language or fallback to en

  const elLocale = inferElementLocale(el);
  const localisedCountryName = getCountryDisplayName(elLocale, addressCountryCode); // If it's a select el we try to find a suitable match to autofill

  if (el.nodeName === 'SELECT') {
    const englishCountryName = getCountryDisplayName('en', addressCountryCode); // This regex matches both the localised and English country names

    const countryNameRegex = new RegExp(String.raw(_templateObject || (_templateObject = _taggedTemplateLiteral(["", "|", ""])), localisedCountryName.replaceAll(' ', '.?'), englishCountryName.replaceAll(' ', '.?')), 'i');
    const countryCodeRegex = new RegExp(String.raw(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\b", "\b"], ["\\b", "\\b"])), addressCountryCode), 'i'); // We check the country code first because it's more accurate

    if (el instanceof HTMLSelectElement) {
      for (const option of el.options) {
        if (countryCodeRegex.test(option.value)) {
          return option.value;
        }
      }

      for (const option of el.options) {
        if (countryNameRegex.test(option.value) || countryNameRegex.test(option.innerText)) return option.value;
      }
    }
  }

  return localisedCountryName;
};
/**
 * Try to get a map of localised country names to code, or falls back to the English map
 * @param {HTMLInputElement | HTMLSelectElement} el
 */


const getLocalisedCountryNamesToCodes = el => {
  if (typeof Intl.DisplayNames !== 'function') return COUNTRY_NAMES_TO_CODES; // Try to infer the field language or fallback to en

  const elLocale = inferElementLocale(el);
  return Object.fromEntries(Object.entries(COUNTRY_CODES_TO_NAMES).map(([code]) => [getCountryDisplayName(elLocale, code), code]));
};
/**
 * Try to infer a country code from an element we identified as identities.addressCountryCode
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @return {string}
 */


const inferCountryCodeFromElement = el => {
  if (COUNTRY_CODES_TO_NAMES[el.value]) return el.value;
  if (COUNTRY_NAMES_TO_CODES[el.value]) return COUNTRY_NAMES_TO_CODES[el.value];
  const localisedCountryNamesToCodes = getLocalisedCountryNamesToCodes(el);
  if (localisedCountryNamesToCodes[el.value]) return localisedCountryNamesToCodes[el.value];

  if (el instanceof HTMLSelectElement) {
    const selectedText = el.selectedOptions[0].text;
    if (COUNTRY_CODES_TO_NAMES[selectedText]) return selectedText;
    if (COUNTRY_NAMES_TO_CODES[selectedText]) return localisedCountryNamesToCodes[selectedText];
    if (localisedCountryNamesToCodes[selectedText]) return localisedCountryNamesToCodes[selectedText];
  }

  return '';
};
/** @param {InternalDataStorageObject} credentials */


const shouldStoreCredentials = ({
  credentials
}) => credentials.password;
/** @param {InternalDataStorageObject} credentials */


const shouldStoreIdentities = ({
  identities
}) => (identities.firstName || identities.fullName) && identities.addressStreet && identities.addressCity;
/** @param {InternalDataStorageObject} credentials */


const shouldStoreCreditCards = ({
  creditCards
}) => creditCards.cardNumber && creditCards.cardSecurityCode;
/**
 * Formats form data into an object to send to the device for storage
 * If values are insufficient for a complete entry, they are discarded
 * @param {InternalDataStorageObject} formValues
 * @return {DataStorageObject}
 */


const prepareFormValuesForStorage = formValues => {
  let {
    credentials,
    identities,
    creditCards
  } = formValues;
  /** Fixes for credentials **/
  // Don't store if there isn't enough data

  if (shouldStoreCredentials(formValues)) {
    // If we don't have a username to match a password, let's see if the email is available
    if (credentials.password && !credentials.username && identities.emailAddress) {
      credentials.username = identities.emailAddress;
    }
  } else {
    // @ts-ignore
    credentials = null;
  }
  /** Fixes for identities **/
  // Don't store if there isn't enough data


  if (shouldStoreIdentities(formValues)) {
    if (identities.fullName) {
      // If the fullname can be easily split into two, we'll store it as first and last
      const nameParts = identities.fullName.trim().split(/\s+/);

      if (nameParts.length === 2) {
        identities.firstName = nameParts[0];
        identities.lastName = nameParts[1];
      } else {
        // If we can't split it, just store it as first name
        identities.firstName = identities.fullName;
      }

      delete identities.fullName;
    }
  } else {
    // @ts-ignore
    identities = null;
  }
  /** Fixes for credit cards **/
  // Don't store if there isn't enough data


  if (shouldStoreCreditCards(formValues)) {
    if (creditCards.expiration) {
      const [expirationMonth, expirationYear] = creditCards.expiration.split(/\D/);
      creditCards.expirationMonth = expirationMonth;
      creditCards.expirationYear = expirationYear;
      delete creditCards.expiration;
    }

    if (Number(creditCards.expirationYear) <= 2020) {
      creditCards.expirationYear = "".concat(Number(creditCards.expirationYear) + 2000);
    }

    if (creditCards.cardNumber) {
      creditCards.cardNumber = creditCards.cardNumber.replaceAll(/\D/g, '');
    }
  } else {
    // @ts-ignore
    creditCards = null;
  }

  return {
    credentials,
    identities,
    creditCards
  };
};

module.exports = {
  formatCCYear,
  getUnifiedExpiryDate,
  formatFullName,
  getCountryDisplayName,
  getCountryName,
  inferCountryCodeFromElement,
  prepareFormValuesForStorage
};

},{"./countryNames":8,"./input-classifiers":10,"./selectors":15}],10:[function(require,module,exports){
"use strict";

const {
  CC_FIELD_SELECTOR,
  CC_MATCHERS_LIST,
  PASSWORD_MATCHER,
  EMAIL_MATCHER,
  USERNAME_MATCHER,
  ID_MATCHERS_LIST,
  FORM_ELS_SELECTOR
} = require('./selectors');

const {
  ATTR_INPUT_TYPE,
  TEXT_LENGTH_CUTOFF
} = require('../constants'); // TODO: move this to formatters.js after migrating the codebase to ES modules

/**
 * Remove whitespace of more than 2 in a row and trim the string
 * @param string
 * @return {string}
 */


const removeExcessWhitespace = (string = '') => string.replace(/\s{2,}/, ' ').trim();
/**
 * Get text from all explicit labels
 * @param {HTMLInputElement} el
 * @return {String}
 */


const getExplicitLabelsText = el => {
  var _document$getElementB;

  const text = [...(el.labels || [])].reduce((text, label) => "".concat(text, " ").concat(label.textContent), '');
  const ariaLabel = el.getAttribute('aria-label') || '';
  const labelledByText = ((_document$getElementB = document.getElementById(el.getAttribute('aria-labelled') || '')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.textContent) || '';
  return removeExcessWhitespace("".concat(text, " ").concat(ariaLabel, " ").concat(labelledByText));
};
/**
 * Get all text close to the input (useful when no labels are defined)
 * @param {HTMLInputElement} el
 * @param {HTMLFormElement} form
 * @return {string}
 */


const getRelatedText = (el, form) => {
  var _container$querySelec, _container$textConten;

  const container = getLargestMeaningfulContainer(el, form); // If there is no meaningful container return empty string

  if (container === el || container.nodeName === 'SELECT') return ''; // If the container has a select element, remove its contents to avoid noise

  const noisyText = ((_container$querySelec = container.querySelector('select')) === null || _container$querySelec === void 0 ? void 0 : _container$querySelec.textContent) || '';
  const sanitizedText = removeExcessWhitespace((_container$textConten = container.textContent) === null || _container$textConten === void 0 ? void 0 : _container$textConten.replace(noisyText, '')); // If the text is longer than n chars it's too noisy and likely to yield false positives, so return ''

  if (sanitizedText.length < TEXT_LENGTH_CUTOFF) return sanitizedText;
  return '';
};
/**
 * Find a container for the input field that won't contain other inputs (useful to get elements related to the field)
 * @param {HTMLElement} el
 * @param {HTMLFormElement} form
 * @return {HTMLElement}
 */


const getLargestMeaningfulContainer = (el, form) => {
  /* TODO: there could be more than one select el for the same label, in that case we should
      change how we compute the container */
  const parentElement = el.parentElement;
  if (!parentElement || el === form) return el;
  const inputsInParentsScope = parentElement.querySelectorAll(FORM_ELS_SELECTOR); // To avoid noise, ensure that our input is the only in scope

  if (inputsInParentsScope.length === 1) {
    return getLargestMeaningfulContainer(parentElement, form);
  }

  return el;
};
/**
 * Tries to infer input subtype, with checks in decreasing order of reliability
 * @type {(el: HTMLInputElement, form: HTMLFormElement, matchers: Matcher[]) => string|undefined}
 */


const getSubtypeFromMatchers = (el, form, matchers) => {
  var _found;

  let found; // Selectors give high confidence and are least expensive

  found = matchers.find(({
    selector
  }) => el.matches(selector));
  if (found) return found.type; // Labels are second-highest confidence and pretty cheap

  const labelText = getExplicitLabelsText(el);
  found = matchers.find(({
    matcherFn
  }) => matcherFn === null || matcherFn === void 0 ? void 0 : matcherFn(labelText));
  if (found) return found.type; // Next up, placeholder

  const placeholder = el.placeholder || '';
  found = matchers.find(({
    matcherFn
  }) => matcherFn === null || matcherFn === void 0 ? void 0 : matcherFn(placeholder));
  if (found) return found.type; // The related text is the most expensive and gives the least confidence
  // If the field had an explicit label, don't check related text to decrease false positives

  if (!labelText) {
    const relatedText = getRelatedText(el, form);
    found = matchers.find(({
      matcherFn
    }) => matcherFn === null || matcherFn === void 0 ? void 0 : matcherFn(relatedText));
  }

  return (_found = found) === null || _found === void 0 ? void 0 : _found.type;
};
/**
 * Tries to infer if input is for password
 * @type {(el: HTMLInputElement, form: HTMLFormElement) => Boolean}
 */


const isPassword = (el, form) => !!getSubtypeFromMatchers(el, form, [PASSWORD_MATCHER]);
/**
 * Tries to infer if input is for email
 * @type {(el: HTMLInputElement, form: HTMLFormElement) => Boolean}
 */


const isEmail = (el, form) => !!getSubtypeFromMatchers(el, form, [EMAIL_MATCHER]);
/**
 * Tries to infer if input is for username
 * @type {(el: HTMLInputElement, form: HTMLFormElement) => Boolean}
 */


const isUserName = (el, form) => !!getSubtypeFromMatchers(el, form, [USERNAME_MATCHER]);
/**
 * Tries to infer if it's a credit card form
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */


const isCCForm = form => {
  var _form$textContent;

  const hasCCSelectorChild = form.querySelector(CC_FIELD_SELECTOR); // If the form contains one of the specific selectors, we have high confidence

  if (hasCCSelectorChild) return true; // Read form attributes to find a signal

  const hasCCAttribute = [...form.attributes].some(({
    name,
    value
  }) => /(credit|payment).?card/i.test("".concat(name, "=").concat(value)));
  if (hasCCAttribute) return true; // Match form textContent against common cc fields (includes hidden labels)

  const textMatches = (_form$textContent = form.textContent) === null || _form$textContent === void 0 ? void 0 : _form$textContent.match(/(credit)?card(.?number)?|ccv|security.?code|cvv|cvc|csc/ig); // We check for more than one to minimise false positives

  return Boolean(textMatches && textMatches.length > 1);
};
/**
 * Tries to infer the input type
 * @param {HTMLInputElement} input
 * @param {import("./Form")} form
 * @returns {SupportedSubTypes | string}
 */


const inferInputType = (input, form) => {
  const presetType = input.getAttribute(ATTR_INPUT_TYPE);
  if (presetType) return presetType;
  const formEl = form.form; // For CC forms we run aggressive matches, so we want to make sure we only
  // run them on actual CC forms to avoid false positives and expensive loops

  if (isCCForm(formEl)) {
    const subtype = getSubtypeFromMatchers(input, formEl, CC_MATCHERS_LIST);
    if (subtype) return "creditCards.".concat(subtype);
  }

  if (isPassword(input, formEl)) return 'credentials.password';
  if (isEmail(input, formEl)) return form.isLogin ? 'credentials.username' : 'identities.emailAddress';
  if (isUserName(input, formEl)) return 'credentials.username';
  const idSubtype = getSubtypeFromMatchers(input, formEl, ID_MATCHERS_LIST);
  if (idSubtype) return "identities.".concat(idSubtype);
  return 'unknown';
};
/**
 * Sets the input type as a data attribute to the element and returns it
 * @param {HTMLInputElement} input
 * @param {import("./Form")} form
 * @returns {SupportedSubTypes | string}
 */


const setInputType = (input, form) => {
  const type = inferInputType(input, form);
  input.setAttribute(ATTR_INPUT_TYPE, type);
  return type;
};
/**
 * Retrieves the input main type
 * @param {HTMLInputElement} input
 * @returns {SupportedSubTypes | string}
 */


const getInputMainType = input => {
  var _input$getAttribute;

  return ((_input$getAttribute = input.getAttribute(ATTR_INPUT_TYPE)) === null || _input$getAttribute === void 0 ? void 0 : _input$getAttribute.split('.')[0]) || 'unknown';
};
/**
 * Retrieves the input subtype
 * @param {HTMLInputElement|Element} input
 * @returns {SupportedSubTypes | string}
 */


const getInputSubtype = input => {
  var _input$getAttribute2, _input$getAttribute3;

  return ((_input$getAttribute2 = input.getAttribute(ATTR_INPUT_TYPE)) === null || _input$getAttribute2 === void 0 ? void 0 : _input$getAttribute2.split('.')[1]) || ((_input$getAttribute3 = input.getAttribute(ATTR_INPUT_TYPE)) === null || _input$getAttribute3 === void 0 ? void 0 : _input$getAttribute3.split('.')[0]) || 'unknown';
};
/**
 * Find a regex match for a given input
 * @param {HTMLInputElement} input
 * @param {RegExp} regex
 * @param {HTMLFormElement} form
 * @returns {RegExpMatchArray|null}
 */


const matchInPlaceholderAndLabels = (input, regex, form) => {
  var _input$placeholder;

  return ((_input$placeholder = input.placeholder) === null || _input$placeholder === void 0 ? void 0 : _input$placeholder.match(regex)) || getExplicitLabelsText(input).match(regex) || getRelatedText(input, form).match(regex);
};
/**
 * Check if a given input matches a regex
 * @param {HTMLInputElement} input
 * @param {RegExp} regex
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */


const checkPlaceholderAndLabels = (input, regex, form) => !!matchInPlaceholderAndLabels(input, regex, form);

module.exports = {
  removeExcessWhitespace,
  isPassword,
  isEmail,
  isUserName,
  getSubtypeFromMatchers,
  inferInputType,
  setInputType,
  getInputMainType,
  getInputSubtype,
  matchInPlaceholderAndLabels,
  checkPlaceholderAndLabels
};

},{"../constants":25,"./selectors":15}],11:[function(require,module,exports){
"use strict";

const getInputConfig = require('./inputTypeConfig.js');
/**
 * Returns the css-ready base64 encoding of the icon for the given input
 * @param {HTMLInputElement} input
 * @param {import("./Form")} form
 * @param {'base' | 'filled'} type
 * @return {string}
 */


const getIcon = (input, form, type = 'base') => {
  const config = getInputConfig(input);

  if (type === 'base') {
    return config.getIconBase(input, form);
  }

  if (type === 'filled') {
    return config.getIconFilled(input, form);
  }

  return '';
};
/**
 * Returns an object with styles to be applied inline
 * @param {HTMLInputElement} input
 * @param {String} icon
 * @return {Object<string, string>}
 */


const getBasicStyles = (input, icon) => ({
  // Height must be > 0 to account for fields initially hidden
  'background-size': "auto ".concat(input.offsetHeight <= 30 && input.offsetHeight > 0 ? '100%' : '26px'),
  'background-position': 'center right',
  'background-repeat': 'no-repeat',
  'background-origin': 'content-box',
  'background-image': "url(".concat(icon, ")"),
  'transition': 'background 0s'
});
/**
 * Get inline styles for the injected icon, base state
 * @param {HTMLInputElement} input
 * @param {import("./Form")} form
 * @return {Object<string, string>}
 */


const getIconStylesBase = (input, form) => {
  const icon = getIcon(input, form);
  if (!icon) return {};
  return getBasicStyles(input, icon);
};
/**
 * Get inline styles for the injected icon, autofilled state
 * @param {HTMLInputElement} input
 * @param {import("./Form")} form
 * @return {Object<string, string>}
 */


const getIconStylesAutofilled = (input, form) => {
  const icon = getIcon(input, form, 'filled');
  const iconStyle = icon ? getBasicStyles(input, icon) : {};
  return { ...iconStyle,
    'background-color': '#F8F498',
    'color': '#333333'
  };
};

module.exports = {
  getIconStylesBase,
  getIconStylesAutofilled
};

},{"./inputTypeConfig.js":12}],12:[function(require,module,exports){
"use strict";

const {
  isDDGApp,
  isMobileApp
} = require('../autofill-utils');

const {
  daxBase64
} = require('./logo-svg');

const ddgPasswordIcons = require('../UI/img/ddgPasswordIcon');

const {
  getInputMainType,
  getInputSubtype
} = require('./input-classifiers');

const {
  getCountryDisplayName
} = require('./formatters'); // In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here


const isFirefox = navigator.userAgent.includes('Firefox');
const getDaxImg = isDDGApp || isFirefox ? daxBase64 : chrome.runtime.getURL('img/logo-small.svg');
/**
 * Get the icon for the identities (currently only Dax for emails)
 * @param {HTMLInputElement} input
 * @param device
 * @return {string}
 */

const getIdentitiesIcon = (input, {
  device
}) => {
  const subtype = getInputSubtype(input);
  if (subtype === 'emailAddress' && device.hasLocalAddresses) return getDaxImg;
  return '';
};
/**
 * Inputs with readOnly or disabled should never be decorated
 * @param {HTMLInputElement} input
 * @return {boolean}
 */


const canBeDecorated = input => !input.readOnly && !input.disabled;
/**
 * A map of config objects. These help by centralising here some complexity
 * TODO: We're removing emailNew everywhere. The new thing is identities.emailAddress. We still have to backport this properly to other platforms.
 * @type {Record<SupportedMainTypes & {'emailNew': InputTypeConfig}, InputTypeConfig>}
 */


const inputTypeConfig = {
  emailNew: {
    type: 'emailNew',
    getIconBase: () => getDaxImg,
    getIconFilled: () => getDaxImg,
    shouldDecorate: (_input, {
      device
    }) => {
      if (!canBeDecorated(_input)) return false;
      if (isMobileApp) return device.isDeviceSignedIn();
      return device.hasLocalAddresses;
    },
    dataType: 'Addresses',
    displayTitlePropName: () => '',
    displaySubtitlePropName: '',
    autofillMethod: ''
  },
  credentials: {
    type: 'credentials',
    getIconBase: () => ddgPasswordIcons.ddgPasswordIconBase,
    getIconFilled: () => ddgPasswordIcons.ddgPasswordIconFilled,
    shouldDecorate: (_input, {
      isLogin,
      device
    }) => canBeDecorated(_input) && isLogin && device.hasLocalCredentials,
    dataType: 'Credentials',
    displayTitlePropName: (_input, data) => data.username,
    displaySubtitlePropName: '•••••••••••••••',
    autofillMethod: 'getAutofillCredentials'
  },
  creditCards: {
    type: 'creditCards',
    getIconBase: () => '',
    getIconFilled: () => '',
    shouldDecorate: (_input, {
      device
    }) => canBeDecorated(_input) && device.hasLocalCreditCards,
    dataType: 'CreditCards',
    displayTitlePropName: (_input, data) => data.title,
    displaySubtitlePropName: 'displayNumber',
    autofillMethod: 'getAutofillCreditCard'
  },
  identities: {
    type: 'identities',
    getIconBase: getIdentitiesIcon,
    getIconFilled: getIdentitiesIcon,
    shouldDecorate: (_input, {
      device
    }) => {
      var _device$getLocalIdent;

      if (!canBeDecorated(_input)) return false;
      const subtype = getInputSubtype(_input);
      return (_device$getLocalIdent = device.getLocalIdentities()) === null || _device$getLocalIdent === void 0 ? void 0 : _device$getLocalIdent.some(identity => !!identity[subtype]);
    },
    dataType: 'Identities',
    displayTitlePropName: (_input, data) => {
      const subtype = getInputSubtype(_input);

      if (subtype === 'addressCountryCode') {
        return getCountryDisplayName('en', data.addressCountryCode);
      }

      return data[subtype];
    },
    displaySubtitlePropName: 'title',
    autofillMethod: 'getAutofillIdentity'
  },
  unknown: {
    type: 'unknown',
    getIconBase: () => '',
    getIconFilled: () => '',
    shouldDecorate: () => false,
    dataType: '',
    displayTitlePropName: () => 'unknown',
    displaySubtitlePropName: '',
    autofillMethod: ''
  }
};
/**
 * Retrieves configs from an input el
 * @param {HTMLInputElement} input
 * @returns {InputTypeConfig}
 */

const getInputConfig = input => {
  const inputType = getInputMainType(input);
  return inputTypeConfig[inputType || 'unknown'];
};

module.exports = getInputConfig;

},{"../UI/img/ddgPasswordIcon":19,"../autofill-utils":23,"./formatters":9,"./input-classifiers":10,"./logo-svg":14}],13:[function(require,module,exports){
"use strict";

const {
  forms
} = require('../scanForInputs');

const isApp = require('../autofill-utils');

const listenForGlobalFormSubmission = () => {
  if (!isApp) return;

  try {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries().filter(entry => // @ts-ignore why does TS not know about `entry.initiatorType`?
      ['fetch', 'xmlhttprequest'].includes(entry.initiatorType) && entry.name.match(/login|sign-in|signin|session/));
      if (!entries.length) return;
      const filledForm = [...forms.values()].find(form => form.hasValues());
      filledForm === null || filledForm === void 0 ? void 0 : filledForm.submitHandler();
    });
    observer.observe({
      entryTypes: ['resource']
    });
  } catch (error) {// Unable to detect form submissions using AJAX calls
  }
};

module.exports = listenForGlobalFormSubmission;

},{"../autofill-utils":23,"../scanForInputs":28}],14:[function(require,module,exports){
"use strict";

const daxBase64 = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgNDQgNDQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9Ii4wMSIgc3RvcC1jb2xvcj0iIzYxNzZiOSIvPjxzdG9wIG9mZnNldD0iLjY5IiBzdG9wLWNvbG9yPSIjMzk0YTlmIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTMuOTI5NyIgeDI9IjE3LjA3MiIgeGxpbms6aHJlZj0iI2EiIHkxPSIxNi4zOTgiIHkyPSIxNi4zOTgiLz48bGluZWFyR3JhZGllbnQgaWQ9ImMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMjMuODExNSIgeDI9IjI2LjY3NTIiIHhsaW5rOmhyZWY9IiNhIiB5MT0iMTQuOTY3OSIgeTI9IjE0Ljk2NzkiLz48bWFzayBpZD0iZCIgaGVpZ2h0PSI0MCIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiB4PSIyIiB5PSIyIj48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im0yMi4wMDAzIDQxLjA2NjljMTAuNTMwMiAwIDE5LjA2NjYtOC41MzY0IDE5LjA2NjYtMTkuMDY2NiAwLTEwLjUzMDMtOC41MzY0LTE5LjA2NjcxLTE5LjA2NjYtMTkuMDY2NzEtMTAuNTMwMyAwLTE5LjA2NjcxIDguNTM2NDEtMTkuMDY2NzEgMTkuMDY2NzEgMCAxMC41MzAyIDguNTM2NDEgMTkuMDY2NiAxOS4wNjY3MSAxOS4wNjY2eiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9tYXNrPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTIyIDQ0YzEyLjE1MDMgMCAyMi05Ljg0OTcgMjItMjIgMC0xMi4xNTAyNi05Ljg0OTctMjItMjItMjItMTIuMTUwMjYgMC0yMiA5Ljg0OTc0LTIyIDIyIDAgMTIuMTUwMyA5Ljg0OTc0IDIyIDIyIDIyeiIgZmlsbD0iI2RlNTgzMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+PGcgbWFzaz0idXJsKCNkKSI+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtMjYuMDgxMyA0MS42Mzg2Yy0uOTIwMy0xLjc4OTMtMS44MDAzLTMuNDM1Ni0yLjM0NjYtNC41MjQ2LTEuNDUyLTIuOTA3Ny0yLjkxMTQtNy4wMDctMi4yNDc3LTkuNjUwNy4xMjEtLjQ4MDMtMS4zNjc3LTE3Ljc4Njk5LTIuNDItMTguMzQ0MzItMS4xNjk3LS42MjMzMy0zLjcxMDctMS40NDQ2Ny01LjAyNy0xLjY2NDY3LS45MTY3LS4xNDY2Ni0xLjEyNTcuMTEtMS41MTA3LjE2ODY3LjM2My4wMzY2NyAyLjA5Ljg4NzMzIDIuNDIzNy45MzUtLjMzMzcuMjI3MzMtMS4zMi0uMDA3MzMtMS45NTA3LjI3MTMzLS4zMTkuMTQ2NjctLjU1NzMuNjg5MzQtLjU1Ljk0NiAxLjc5NjctLjE4MzMzIDQuNjA1NC0uMDAzNjYgNi4yNy43MzMyOS0xLjMyMzYuMTUwNC0zLjMzMy4zMTktNC4xOTgzLjc3MzctMi41MDggMS4zMi0zLjYxNTMgNC40MTEtMi45NTUzIDguMTE0My42NTYzIDMuNjk2IDMuNTY0IDE3LjE3ODQgNC40OTE2IDIxLjY4MS45MjQgNC40OTkgMTEuNTUzNyAzLjU1NjcgMTAuMDE3NC41NjF6IiBmaWxsPSIjZDVkN2Q4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJtMjIuMjg2NSAyNi44NDM5Yy0uNjYgMi42NDM2Ljc5MiA2LjczOTMgMi4yNDc2IDkuNjUwNi40ODkxLjk3MjcgMS4yNDM4IDIuMzkyMSAyLjA1NTggMy45NjM3LTEuODk0LjQ2OTMtNi40ODk1IDEuMTI2NC05LjcxOTEgMC0uOTI0LTQuNDkxNy0zLjgzMTctMTcuOTc3Ny00LjQ5NTMtMjEuNjgxLS42Ni0zLjcwMzMgMC02LjM0NyAyLjUxNTMtNy42NjcuODYxNy0uNDU0NyAyLjA5MzctLjc4NDcgMy40MTM3LS45MzEzLTEuNjY0Ny0uNzQwNy0zLjYzNzQtMS4wMjY3LTUuNDQxNC0uODQzMzYtLjAwNzMtLjc2MjY3IDEuMzM4NC0uNzE4NjcgMS44NDQ0LTEuMDYzMzQtLjMzMzctLjA0NzY2LTEuMTYyNC0uNzk1NjYtMS41MjktLjgzMjMzIDIuMjg4My0uMzkyNDQgNC42NDIzLS4wMjEzOCA2LjY5OSAxLjA1NiAxLjA0ODYuNTYxIDEuNzg5MyAxLjE2MjMzIDIuMjQ3NiAxLjc5MzAzIDEuMTk1NC4yMjczIDIuMjUxNC42NiAyLjk0MDcgMS4zNDkzIDIuMTE5MyAyLjExNTcgNC4wMTEzIDYuOTUyIDMuMjE5MyA5LjczMTMtLjIyMzYuNzctLjczMzMgMS4zMzEtMS4zNzEzIDEuNzk2Ny0xLjIzOTMuOTAyLTEuMDE5My0xLjA0NS00LjEwMy45NzE3LS4zOTk3LjI2MDMtLjM5OTcgMi4yMjU2LS41MjQzIDIuNzA2eiIgZmlsbD0iI2ZmZiIvPjwvZz48ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTE2LjY3MjQgMjAuMzU0Yy43Njc1IDAgMS4zODk2LS42MjIxIDEuMzg5Ni0xLjM4OTZzLS42MjIxLTEuMzg5Ny0xLjM4OTYtMS4zODk3LTEuMzg5Ny42MjIyLTEuMzg5NyAxLjM4OTcuNjIyMiAxLjM4OTYgMS4zODk3IDEuMzg5NnoiIGZpbGw9IiMyZDRmOGUiLz48cGF0aCBkPSJtMTcuMjkyNCAxOC44NjE3Yy4xOTg1IDAgLjM1OTQtLjE2MDguMzU5NC0uMzU5M3MtLjE2MDktLjM1OTMtLjM1OTQtLjM1OTNjLS4xOTg0IDAtLjM1OTMuMTYwOC0uMzU5My4zNTkzcy4xNjA5LjM1OTMuMzU5My4zNTkzeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0yNS45NTY4IDE5LjMzMTFjLjY1ODEgMCAxLjE5MTctLjUzMzUgMS4xOTE3LTEuMTkxNyAwLS42NTgxLS41MzM2LTEuMTkxNi0xLjE5MTctMS4xOTE2cy0xLjE5MTcuNTMzNS0xLjE5MTcgMS4xOTE2YzAgLjY1ODIuNTMzNiAxLjE5MTcgMS4xOTE3IDEuMTkxN3oiIGZpbGw9IiMyZDRmOGUiLz48cGF0aCBkPSJtMjYuNDg4MiAxOC4wNTExYy4xNzAxIDAgLjMwOC0uMTM3OS4zMDgtLjMwOHMtLjEzNzktLjMwOC0uMzA4LS4zMDgtLjMwOC4xMzc5LS4zMDguMzA4LjEzNzkuMzA4LjMwOC4zMDh6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTE3LjA3MiAxNC45NDJzLTEuMDQ4Ni0uNDc2Ni0yLjA2NDMuMTY1Yy0xLjAxNTcuNjM4LS45NzkgMS4yOTA3LS45NzkgMS4yOTA3cy0uNTM5LTEuMjAyNy44OTgzLTEuNzkzYzEuNDQxLS41ODY3IDIuMTQ1LjMzNzMgMi4xNDUuMzM3M3oiIGZpbGw9InVybCgjYikiLz48cGF0aCBkPSJtMjYuNjc1MiAxNC44NDY3cy0uNzUxNy0uNDI5LTEuMzM4My0uNDIxN2MtMS4xOTkuMDE0Ny0xLjUyNTQuNTQyNy0xLjUyNTQuNTQyN3MuMjAxNy0xLjI2MTQgMS43MzQ0LTEuMDA4NGMuNDk5Ny4wOTE0LjkyMjMuNDIzNCAxLjEyOTMuODg3NHoiIGZpbGw9InVybCgjYykiLz48cGF0aCBkPSJtMjAuOTI1OCAyNC4zMjFjLjEzOTMtLjg0MzMgMi4zMS0yLjQzMSAzLjg1LTIuNTMgMS41NC0uMDk1MyAyLjAxNjctLjA3MzMgMy4zLS4zODEzIDEuMjg3LS4zMDQzIDQuNTk4LTEuMTI5MyA1LjUxMS0xLjU1NDcuOTE2Ny0uNDIxNiA0LjgwMzMuMjA5IDIuMDY0MyAxLjczOC0xLjE4NDMuNjYzNy00LjM3OCAxLjg4MS02LjY2MjMgMi41NjMtMi4yODA3LjY4Mi0zLjY2My0uNjUyNi00LjQyMi40Njk0LS42MDEzLjg5MS0uMTIxIDIuMTEyIDIuNjAzMyAyLjM2NSAzLjY4MTQuMzQxIDcuMjA4Ny0xLjY1NzQgNy41OTc0LS41OTQuMzg4NiAxLjA2MzMtMy4xNjA3IDIuMzgzMy01LjMyNCAyLjQyNzMtMi4xNjM0LjA0MDMtNi41MTk0LTEuNDMtNy4xNzItMS44ODQ3LS42NTY0LS40NTEtMS41MjU0LTEuNTE0My0xLjM0NTctMi42MTh6IiBmaWxsPSIjZmRkMjBhIi8+PHBhdGggZD0ibTI4Ljg4MjUgMzEuODM4NmMtLjc3NzMtLjE3MjQtNC4zMTIgMi41MDA2LTQuMzEyIDIuNTAwNmguMDAzN2wtLjE2NSAyLjA1MzRzNC4wNDA2IDEuNjUzNiA0LjczIDEuMzk3Yy42ODkzLS4yNjQuNTE3LTUuNzc1LS4yNTY3LTUuOTUxem0tMTEuNTQ2MyAxLjAzNGMuMDg0My0xLjExODQgNS4yNTQzIDEuNjQyNiA1LjI1NDMgMS42NDI2bC4wMDM3LS4wMDM2LjI1NjYgMi4xNTZzLTQuMzA4MyAyLjU4MTMtNC45MTMzIDIuMjM2NmMtLjYwMTMtLjM0NDYtLjY4OTMtNC45MDk2LS42MDEzLTYuMDMxNnoiIGZpbGw9IiM2NWJjNDYiLz48cGF0aCBkPSJtMjEuMzQgMzQuODA0OWMwIDEuODA3Ny0uMjYwNCAyLjU4NS41MTMzIDIuNzU3NC43NzczLjE3MjMgMi4yNDAzIDAgMi43NjEtLjM0NDcuNTEzMy0uMzQ0Ny4wODQzLTIuNjY5My0uMDg4LTMuMTAycy0zLjE5LS4wODgtMy4xOS42ODkzeiIgZmlsbD0iIzQzYTI0NCIvPjxwYXRoIGQ9Im0yMS42NzAxIDM0LjQwNTFjMCAxLjgwNzYtLjI2MDQgMi41ODEzLjUxMzMgMi43NTM2Ljc3MzcuMTc2IDIuMjM2NyAwIDIuNzU3My0uMzQ0Ni41MTctLjM0NDcuMDg4LTIuNjY5NC0uMDg0My0zLjEwMi0uMTcyMy0uNDMyNy0zLjE5LS4wODQ0LTMuMTkuNjg5M3oiIGZpbGw9IiM2NWJjNDYiLz48cGF0aCBkPSJtMjIuMDAwMiA0MC40NDgxYzEwLjE4ODUgMCAxOC40NDc5LTguMjU5NCAxOC40NDc5LTE4LjQ0NzlzLTguMjU5NC0xOC40NDc5NS0xOC40NDc5LTE4LjQ0Nzk1LTE4LjQ0Nzk1IDguMjU5NDUtMTguNDQ3OTUgMTguNDQ3OTUgOC4yNTk0NSAxOC40NDc5IDE4LjQ0Nzk1IDE4LjQ0Nzl6bTAgMS43MTg3YzExLjEzNzcgMCAyMC4xNjY2LTkuMDI4OSAyMC4xNjY2LTIwLjE2NjYgMC0xMS4xMzc4LTkuMDI4OS0yMC4xNjY3LTIwLjE2NjYtMjAuMTY2Ny0xMS4xMzc4IDAtMjAuMTY2NyA5LjAyODktMjAuMTY2NyAyMC4xNjY3IDAgMTEuMTM3NyA5LjAyODkgMjAuMTY2NiAyMC4xNjY3IDIwLjE2NjZ6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==';
module.exports = {
  daxBase64
};

},{}],15:[function(require,module,exports){
"use strict";

const FORM_ELS_SELECTOR = "\ninput:not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=hidden]):not([type=file]),\nselect";
const EMAIL_SELECTOR = "\ninput:not([type])[name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\ninput[type=\"\"][name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\ninput[type=text][name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\ninput:not([type])[id*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\ninput[type=\"\"][id*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\ninput:not([type])[placeholder*=mail i]:not([placeholder*=search i]):not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\ninput[type=text][placeholder*=mail i]:not([placeholder*=search i]):not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\ninput[type=\"\"][placeholder*=mail i]:not([placeholder*=search i]):not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\ninput:not([type])[placeholder*=mail i]:not([placeholder*=search i]):not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\ninput[type=email]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\ninput[type=text][aria-label*=mail i]:not([aria-label*=search i]),\ninput:not([type])[aria-label*=mail i]:not([aria-label*=search i]),\ninput[type=text][placeholder*=mail i]:not([placeholder*=search i]):not([readonly]),\ninput[autocomplete=email]:not([readonly]):not([hidden]):not([disabled])";
/** @type Matcher */

const EMAIL_MATCHER = {
  type: 'email',
  selector: EMAIL_SELECTOR,
  matcherFn: string => /.mail/i.test(string) && !/search/i.test(string)
}; // We've seen non-standard types like 'user'. This selector should get them, too

const GENERIC_TEXT_FIELD = "\ninput:not([type=button]):not([type=checkbox]):not([type=color]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=file]):not([type=hidden]):not([type=month]):not([type=number]):not([type=radio]):not([type=range]):not([type=reset]):not([type=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week]):not([readonly]):not([disabled])";
const PASSWORD_SELECTOR = "input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code])";
/** @type Matcher */

const PASSWORD_MATCHER = {
  type: 'password',
  selector: PASSWORD_SELECTOR,
  matcherFn: string => /password/i.test(string) && !/captcha/i.test(string)
}; // This is more generic, used only when we have identified a form

const USERNAME_SELECTOR = "".concat(GENERIC_TEXT_FIELD, "[autocomplete^=user]");
/** @type Matcher */

const USERNAME_MATCHER = {
  type: 'username',
  selector: USERNAME_SELECTOR,
  matcherFn: string => /user((.)?(name|id|login))?$/i.test(string) && !/search/i.test(string)
};
const CC_NAME_SELECTOR = "\ninput[autocomplete=\"cc-name\"],\ninput[autocomplete=\"ccname\"],\ninput[name=\"ccname\"],\ninput[name=\"cc-name\"],\ninput[name=\"ppw-accountHolderName\"],\ninput[id*=cardname i],\ninput[id*=card-name i],\ninput[id*=card_name i]";
const CC_NUMBER_SELECTOR = "\ninput[autocomplete=\"cc-number\"],\ninput[autocomplete=\"ccnumber\"],\ninput[autocomplete=\"cardnumber\"],\ninput[autocomplete=\"card-number\"],\ninput[name=\"ccnumber\"],\ninput[name=\"cc-number\"],\ninput[name=\"cardnumber\"],\ninput[name=\"card-number\"],\ninput[name*=creditCardNumber i],\ninput[id*=cardnumber i],\ninput[id*=card-number i],\ninput[id*=card_number i]";
const CC_CVC_SELECTOR = "\ninput[autocomplete=\"cc-csc\"],\ninput[autocomplete=\"csc\"],\ninput[autocomplete=\"cc-cvc\"],\ninput[autocomplete=\"cvc\"],\ninput[name=\"cvc\"],\ninput[name=\"cc-cvc\"],\ninput[name=\"cc-csc\"],\ninput[name=\"csc\"],\ninput[name=\"securityCode\"]";
const CC_MONTH_SELECTOR = "\n[autocomplete=\"cc-exp-month\"],\n[name=\"ccmonth\"],\n[name=\"ppw-expirationDate_month\"],\n[name=cardExpiryMonth],\n[name=\"expiration-month\"],\n[name*=ExpDate_Month i],\n[id*=expiration-month i]";
const CC_YEAR_SELECTOR = "\n[autocomplete=\"cc-exp-year\"],\n[name=\"ccyear\"],\n[name=\"ppw-expirationDate_year\"],\n[name=cardExpiryYear],\n[name=\"expiration-year\"],\n[name*=ExpDate_Year i],\n[id*=expiration-year i]";
const CC_EXP_SELECTOR = "\n[autocomplete=\"cc-exp\"],\n[name=\"cc-exp\"],\n[name=\"exp-date\"],\n[name=\"expirationDate\"],\ninput[id*=expiration i]"; // Matches strings like mm/yy, mm-yyyy, mm-aa

const DATE_SEPARATOR_REGEX = /\w\w\s?(?<separator>[/\s.\-_—–])\s?\w\w/i; // Matches 4 non-digit repeated characters (YYYY or AAAA) or 4 digits (2022)

const FOUR_DIGIT_YEAR_REGEX = /(\D)\1{3}|\d{4}/i;
/**
 * This is used to map a selector with the data type we store for credit cards
 * @type Matcher[]
 */

const CC_MATCHERS_LIST = [{
  type: 'cardName',
  selector: CC_NAME_SELECTOR,
  matcherFn: string => /(card.*name|name.*card)|(card.*holder|holder.*card)|(card.*owner|owner.*card)/i.test(string)
}, {
  type: 'cardNumber',
  selector: CC_NUMBER_SELECTOR,
  matcherFn: string => /card.*number|number.*card/i.test(string)
}, {
  type: 'cardSecurityCode',
  selector: CC_CVC_SELECTOR,
  matcherFn: string => /security.?code|card.?verif|cvv|csc|cvc/i.test(string)
}, {
  type: 'expirationMonth',
  selector: CC_MONTH_SELECTOR,
  matcherFn: string => /(card|\bcc\b)?.?(exp(iry|iration)?)?.?(month|\bmm\b(?![.\s/-]yy))/i.test(string) && !/mm[/\s.\-_—–]/i.test(string)
}, {
  type: 'expirationYear',
  selector: CC_YEAR_SELECTOR,
  matcherFn: string => /(card|\bcc\b)?.?(exp(iry|iration)?)?.?(year|yy)/i.test(string) && !/mm[/\s.\-_—–]/i.test(string)
}, {
  type: 'expiration',
  selector: CC_EXP_SELECTOR,
  matcherFn: string => /(\bmm\b|\b\d\d\b)[/\s.\-_—–](\byy|\bjj|\baa|\b\d\d)|\bexp|\bvalid(idity| through| until)/i.test(string) && !/invalid/i.test(string) && // if there are more than six digits it could be a phone number
  string.replace(/\D+/g, '').length <= 6
}];
const CC_FIELD_SELECTOR = CC_MATCHERS_LIST.map(({
  selector
}) => selector).join(', ');
const ID_FIRST_NAME_SELECTOR = "\n[name*=fname i], [autocomplete*=given-name i],\n[name*=firstname i], [autocomplete*=firstname i],\n[name*=first-name i], [autocomplete*=first-name i],\n[name*=first_name i], [autocomplete*=first_name i],\n[name*=givenname i], [autocomplete*=givenname i],\n[name*=given-name i],\n[name*=given_name i], [autocomplete*=given_name i],\n[name*=forename i], [autocomplete*=forename i]";
const ID_MIDDLE_NAME_SELECTOR = "\n[name*=mname i], [autocomplete*=additional-name i],\n[name*=middlename i], [autocomplete*=middlename i],\n[name*=middle-name i], [autocomplete*=middle-name i],\n[name*=middle_name i], [autocomplete*=middle_name i],\n[name*=additionalname i], [autocomplete*=additionalname i],\n[name*=additional-name i],\n[name*=additional_name i], [autocomplete*=additional_name i]";
const ID_LAST_NAME_SELECTOR = "\n[name=lname], [autocomplete*=family-name i],\n[name*=lastname i], [autocomplete*=lastname i],\n[name*=last-name i], [autocomplete*=last-name i],\n[name*=last_name i], [autocomplete*=last_name i],\n[name*=familyname i], [autocomplete*=familyname i],\n[name*=family-name i],\n[name*=family_name i], [autocomplete*=family_name i],\n[name*=surname i], [autocomplete*=surname i]";
const ID_NAME_SELECTOR = "\n[name=name], [autocomplete=name],\n[name*=fullname i], [autocomplete*=fullname i],\n[name*=full-name i], [autocomplete*=full-name i],\n[name*=full_name i], [autocomplete*=full_name i],\n[name*=your-name i], [autocomplete*=your-name i]";
const ID_PHONE_SELECTOR = "\n[name*=phone i], [name*=mobile i], [autocomplete=tel]";
const ID_ADDRESS_STREET_1 = "\n[name=address], [autocomplete=street-address], [autocomplete=address-line1],\n[name=street],\n[name=ppw-line1]";
const ID_ADDRESS_STREET_2 = "\n[name=address], [autocomplete=address-line2],\n[name=ppw-line2]";
const ID_CITY_STREET = "\n[name=city], [autocomplete=address-level2],\n[name=ppw-city]";
const ID_PROVINCE_STREET = "\n[name=province], [name=state], [autocomplete=address-level1]";
const ID_POSTAL_CODE = "\n[name=zip], [name=zip2], [name=postal], [autocomplete=postal-code], [autocomplete=zip-code],\n[name*=postalCode i], [name*=zipcode i]";
const ID_COUNTRY = "\n[name=country] [autocomplete=country],\n[name*=countryCode i], [name*=country-code i],\n[name*=countryName i], [name*=country-name i]";
const ID_BDAY_DAY = "\n[name=bday-day],\n[name=birthday_day], [name=birthday-day],\n[name=date_of_birth_day], [name=date-of-birth-day],\n[name^=birthdate_d], [name^=birthdate-d]";
const ID_BDAY_MONTH = "\n[name=bday-month],\n[name=birthday_month], [name=birthday-month],\n[name=date_of_birth_month], [name=date-of-birth-month],\n[name^=birthdate_m], [name^=birthdate-m]";
const ID_BDAY_YEAR = "\n[name=bday-year],\n[name=birthday_year], [name=birthday-year],\n[name=date_of_birth_year], [name=date-of-birth-year],\n[name^=birthdate_y], [name^=birthdate-y]";
/** @type Matcher[] */

const ID_MATCHERS_LIST = [{
  type: 'firstName',
  selector: ID_FIRST_NAME_SELECTOR,
  matcherFn: string => /(first|given|fore).?name/i.test(string)
}, {
  type: 'middleName',
  selector: ID_MIDDLE_NAME_SELECTOR,
  matcherFn: string => /(middle|additional).?name/i.test(string)
}, {
  type: 'lastName',
  selector: ID_LAST_NAME_SELECTOR,
  matcherFn: string => // matches surname, but not Suriname, the country
  /(last|family|sur)[^i]?name/i.test(string)
}, {
  type: 'fullName',
  selector: ID_NAME_SELECTOR,
  matcherFn: string => /^(full.?|whole\s)?name\b/i.test(string) && !/company|org/i.test(string)
}, {
  type: 'phone',
  selector: ID_PHONE_SELECTOR,
  matcherFn: string => /phone/i.test(string) && !/code|pass/i.test(string)
}, {
  type: 'addressStreet',
  selector: ID_ADDRESS_STREET_1,
  matcherFn: string => /address/i.test(string) && !/email|\bip\b|address.*(2|two)|duck|log.?in|sign.?in/i.test(string)
}, {
  type: 'addressStreet2',
  selector: ID_ADDRESS_STREET_2,
  matcherFn: string => /address.*(2|two)|apartment|\bapt\b|\bflat\b|\bline.*(2|two)/i.test(string) && !/email|\bip\b|duck|log.?in|sign.?in/i.test(string)
}, {
  type: 'addressCity',
  selector: ID_CITY_STREET,
  matcherFn: string => /city|town/i.test(string) && !/vatican/i.test(string)
}, {
  type: 'addressProvince',
  selector: ID_PROVINCE_STREET,
  matcherFn: string => /state|province|region|county/i.test(string) && !/country|united/i.test(string)
}, {
  type: 'addressPostalCode',
  selector: ID_POSTAL_CODE,
  matcherFn: string => /\bzip\b|postal|post.?code/i.test(string)
}, {
  type: 'addressCountryCode',
  selector: ID_COUNTRY,
  matcherFn: string => /country/i.test(string)
}, {
  type: 'birthdayDay',
  selector: ID_BDAY_DAY,

  /* For birthday we only support css selectors */
  matcherFn: () => false
}, {
  type: 'birthdayMonth',
  selector: ID_BDAY_MONTH,

  /* For birthday we only support css selectors */
  matcherFn: () => false
}, {
  type: 'birthdayYear',
  selector: ID_BDAY_YEAR,

  /* For birthday we only support css selectors */
  matcherFn: () => false
}];
const ID_FIELD_SELECTOR = ID_MATCHERS_LIST.map(({
  selector
}) => selector).join(', ');
const FIELD_SELECTOR = [PASSWORD_SELECTOR, GENERIC_TEXT_FIELD, EMAIL_SELECTOR, CC_FIELD_SELECTOR, ID_FIELD_SELECTOR].join(', ');
const SUBMIT_BUTTON_SELECTOR = "\ninput[type=submit],\ninput[type=button],\nbutton:not([role=switch]):not([role=link]),\n[role=button]";
module.exports = {
  FORM_ELS_SELECTOR,
  PASSWORD_SELECTOR,
  EMAIL_MATCHER,
  PASSWORD_MATCHER,
  USERNAME_MATCHER,
  FOUR_DIGIT_YEAR_REGEX,
  CC_MATCHERS_LIST,
  DATE_SEPARATOR_REGEX,
  CC_FIELD_SELECTOR,
  ID_MATCHERS_LIST,
  ID_FIELD_SELECTOR,
  FIELD_SELECTOR,
  SUBMIT_BUTTON_SELECTOR
};

},{}],16:[function(require,module,exports){
"use strict";

const {
  isApp,
  escapeXML
} = require('../autofill-utils');

const Tooltip = require('./Tooltip');

const getInputConfig = require('../Form/inputTypeConfig');

const {
  getInputSubtype
} = require('../Form/input-classifiers');

class DataAutofill extends Tooltip {
  constructor(input, associatedForm, deviceInterface) {
    super(input, associatedForm, deviceInterface);
    const config = getInputConfig(input);
    const subtype = getInputSubtype(input);
    this.data = this.interface["getLocal".concat(config.dataType)]();

    if (config.type === 'identities') {
      // For identities, we don't show options where this subtype is not available
      this.data = this.data.filter(singleData => !!singleData[subtype]);
    }

    const includeStyles = isApp ? "<style>".concat(require('./styles/autofill-tooltip-styles.js'), "</style>") : "<link rel=\"stylesheet\" href=\"".concat(chrome.runtime.getURL('public/css/autofill.css'), "\" crossorigin=\"anonymous\">");
    let hasAddedSeparator = false; // Only show an hr above the first duck address button, but it can be either personal or private

    const shouldShowSeparator = dataId => {
      const shouldShow = ['personalAddress', 'privateAddress'].includes(dataId) && !hasAddedSeparator;
      if (shouldShow) hasAddedSeparator = true;
      return shouldShow;
    };

    this.shadow.innerHTML = "\n".concat(includeStyles, "\n<div class=\"wrapper wrapper--data\">\n    <div class=\"tooltip tooltip--data\" hidden>\n        ").concat(this.data.map(singleData => "\n            ".concat(shouldShowSeparator(singleData.id) ? '<hr />' : '', "\n            <button\n                class=\"tooltip__button tooltip__button--data tooltip__button--data--").concat(config.type, " js-autofill-button\"\n                id=\"").concat(singleData.id, "\"\n            >\n                <span class=\"tooltip__button__text-container\">\n                    <span class=\"tooltip__button__primary-text\">\n").concat(singleData.id === 'privateAddress' ? 'Generated Private Address\n' : '', "\n").concat(escapeXML(config.displayTitlePropName(input, singleData)), "\n                    </span><br />\n                    <span class=\"tooltip__button__secondary-text\">\n").concat(escapeXML(singleData[config.displaySubtitlePropName] || config.displaySubtitlePropName), "\n                    </span>\n                </span>\n            </button>\n        ")).join(''), "\n    </div>\n</div>");
    this.wrapper = this.shadow.querySelector('.wrapper');
    this.tooltip = this.shadow.querySelector('.tooltip');
    this.autofillButtons = this.shadow.querySelectorAll('.js-autofill-button');
    this.autofillButtons.forEach(btn => {
      this.registerClickableButton(btn, () => {
        this.interface["".concat(config.autofillMethod)](btn.id).then(({
          success
        }) => {
          if (success) {
            this.associatedForm.autofillData(success, config.type);
            if (btn.id === 'privateAddress') this.interface.refreshAlias();
          }
        });
      });
    });
    this.init();
  }

}

module.exports = DataAutofill;

},{"../Form/input-classifiers":10,"../Form/inputTypeConfig":12,"../autofill-utils":23,"./Tooltip":18,"./styles/autofill-tooltip-styles.js":20}],17:[function(require,module,exports){
"use strict";

const {
  isApp,
  formatDuckAddress,
  escapeXML
} = require('../autofill-utils');

const Tooltip = require('./Tooltip');

class EmailAutofill extends Tooltip {
  constructor(input, associatedForm, deviceInterface) {
    super(input, associatedForm, deviceInterface);
    this.addresses = this.interface.getLocalAddresses();
    const includeStyles = isApp ? "<style>".concat(require('./styles/autofill-tooltip-styles.js'), "</style>") : "<link rel=\"stylesheet\" href=\"".concat(chrome.runtime.getURL('public/css/autofill.css'), "\" crossorigin=\"anonymous\">");
    this.shadow.innerHTML = "\n".concat(includeStyles, "\n<div class=\"wrapper wrapper--email\">\n    <div class=\"tooltip tooltip--email\" hidden>\n        <button class=\"tooltip__button tooltip__button--email js-use-personal\">\n            <span class=\"tooltip__button--email__primary-text\">\n                Use <span class=\"js-address\">").concat(formatDuckAddress(escapeXML(this.addresses.personalAddress)), "</span>\n            </span>\n            <span class=\"tooltip__button--email__secondary-text\">Blocks email trackers</span>\n        </button>\n        <button class=\"tooltip__button tooltip__button--email js-use-private\">\n            <span class=\"tooltip__button--email__primary-text\">Use a Private Address</span>\n            <span class=\"tooltip__button--email__secondary-text\">Blocks email trackers and hides your address</span>\n        </button>\n    </div>\n</div>");
    this.wrapper = this.shadow.querySelector('.wrapper');
    this.tooltip = this.shadow.querySelector('.tooltip');
    this.usePersonalButton = this.shadow.querySelector('.js-use-personal');
    this.usePrivateButton = this.shadow.querySelector('.js-use-private');
    this.addressEl = this.shadow.querySelector('.js-address');

    this.updateAddresses = addresses => {
      if (addresses && this.addressEl) {
        this.addresses = addresses;
        this.addressEl.textContent = formatDuckAddress(addresses.personalAddress);
      }
    };

    this.registerClickableButton(this.usePersonalButton, () => {
      this.associatedForm.autofillEmail(formatDuckAddress(this.addresses.personalAddress));
    });
    this.registerClickableButton(this.usePrivateButton, () => {
      this.associatedForm.autofillEmail(formatDuckAddress(this.addresses.privateAddress));
      this.interface.refreshAlias();
    }); // Get the alias from the extension

    this.interface.getAddresses().then(this.updateAddresses);
    this.init();
  }

}

module.exports = EmailAutofill;

},{"../autofill-utils":23,"./Tooltip":18,"./styles/autofill-tooltip-styles.js":20}],18:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  safeExecute,
  addInlineStyles,
  getDaxBoundingBox,
  isApp
} = require('../autofill-utils');
/**
 * @this {Tooltip}
 */


const updatePosition = function ({
  left,
  top
}) {
  const shadow = this.shadow; // If the stylesheet is not loaded wait for load (Chrome bug)

  if (!shadow.styleSheets.length) {
    var _this$stylesheet;

    (_this$stylesheet = this.stylesheet) === null || _this$stylesheet === void 0 ? void 0 : _this$stylesheet.addEventListener('load', this.checkPosition);
    return;
  }

  this.left = left;
  this.top = top;

  if (this.transformRuleIndex && shadow.styleSheets[0].rules[this.transformRuleIndex]) {
    // If we have already set the rule, remove it…
    shadow.styleSheets[0].deleteRule(this.transformRuleIndex);
  } else {
    // …otherwise, set the index as the very last rule
    this.transformRuleIndex = shadow.styleSheets[0].rules.length;
  }

  const newRule = ".wrapper {transform: translate(".concat(left, "px, ").concat(top, "px);}");
  shadow.styleSheets[0].insertRule(newRule, this.transformRuleIndex);
};
/**
 * @this {Tooltip}
 */


const checkPosition = function () {
  if (this.animationFrame) {
    window.cancelAnimationFrame(this.animationFrame);
  }

  this.animationFrame = window.requestAnimationFrame(() => {
    // In extensions, the tooltip is centered on the Dax icon
    const position = isApp ? this.input.getBoundingClientRect() : getDaxBoundingBox(this.input);
    const {
      left,
      bottom
    } = position;

    if (left !== this.left || bottom !== this.top) {
      this.updatePosition({
        left,
        top: bottom
      });
    }

    this.animationFrame = null;
  });
};
/**
 * @this {Tooltip}
 */


const ensureIsLastInDOM = function () {
  this.count = this.count || 0; // If DDG el is not the last in the doc, move it there

  if (document.body.lastElementChild !== this.host) {
    // Try up to 15 times to avoid infinite loop in case someone is doing the same
    if (this.count < 15) {
      this.lift();
      this.append();
      this.checkPosition();
      this.count++;
    } else {
      // Remove the tooltip from the form to cleanup listeners and observers
      this.associatedForm.removeTooltip();
      console.info("DDG autofill bailing out");
    }
  }
};

class Tooltip {
  constructor(input, associatedForm, deviceInterface) {
    _defineProperty(this, "checkPosition", checkPosition.bind(this));

    _defineProperty(this, "updatePosition", updatePosition.bind(this));

    _defineProperty(this, "ensureIsLastInDOM", ensureIsLastInDOM.bind(this));

    _defineProperty(this, "resObs", new ResizeObserver(entries => entries.forEach(this.checkPosition)));

    _defineProperty(this, "mutObs", new MutationObserver(mutationList => {
      for (const mutationRecord of mutationList) {
        if (mutationRecord.type === 'childList') {
          // Only check added nodes
          mutationRecord.addedNodes.forEach(el => {
            if (el.nodeName === 'DDG-AUTOFILL') return;
            this.ensureIsLastInDOM();
          });
        }
      }

      this.checkPosition();
    }));

    _defineProperty(this, "clickableButtons", new Map());

    this.shadow = document.createElement('ddg-autofill').attachShadow({
      mode: 'closed'
    });
    this.host = this.shadow.host;
    this.tooltip = null;
    const forcedVisibilityStyles = {
      'display': 'block',
      'visibility': 'visible',
      'opacity': '1'
    }; // @ts-ignore how to narrow this.host to HTMLElement?

    addInlineStyles(this.host, forcedVisibilityStyles);
    this.input = input;
    this.associatedForm = associatedForm;
    this.interface = deviceInterface;
    this.count = 0;
  }

  append() {
    document.body.appendChild(this.host);
  }

  remove() {
    window.removeEventListener('scroll', this.checkPosition, {
      capture: true
    });
    this.resObs.disconnect();
    this.mutObs.disconnect();
    this.lift();
  }

  lift() {
    this.left = null;
    this.top = null;
    document.body.removeChild(this.host);
  }

  setActiveButton(e) {
    this.activeButton = e.target;
  }

  unsetActiveButton() {
    this.activeButton = null;
  }

  registerClickableButton(btn, handler) {
    this.clickableButtons.set(btn, handler); // Needed because clicks within the shadow dom don't provide this info to the outside

    btn.addEventListener('mouseenter', e => this.setActiveButton(e));
    btn.addEventListener('mouseleave', () => this.unsetActiveButton());
  }

  dispatchClick() {
    const handler = this.clickableButtons.get(this.activeButton);

    if (handler) {
      safeExecute(this.activeButton, handler);
    }
  }

  init() {
    var _this$stylesheet2;

    this.animationFrame = null;
    this.top = 0;
    this.left = 0;
    this.transformRuleIndex = null;
    this.stylesheet = this.shadow.querySelector('link, style'); // Un-hide once the style is loaded, to avoid flashing unstyled content

    (_this$stylesheet2 = this.stylesheet) === null || _this$stylesheet2 === void 0 ? void 0 : _this$stylesheet2.addEventListener('load', () => this.tooltip.removeAttribute('hidden'));
    this.append();
    this.resObs.observe(document.body);
    this.mutObs.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    window.addEventListener('scroll', this.checkPosition, {
      capture: true
    });
  }

}

module.exports = Tooltip;

},{"../autofill-utils":23}],19:[function(require,module,exports){
"use strict";

const ddgPasswordIconBase = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tYmFzZTwvdGl0bGU+CiAgICA8ZyBpZD0iZGRnLXBhc3N3b3JkLWljb24tYmFzZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IlVuaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjMzMzMsMi42NjY2NyBDMTAuMjI4OCwyLjY2NjY3IDkuMzMzMzMsMy41NjIxIDkuMzMzMzMsNC42NjY2NyBDOS4zMzMzMyw1Ljc3MTI0IDEwLjIyODgsNi42NjY2NyAxMS4zMzMzLDYuNjY2NjcgQzEyLjQzNzksNi42NjY2NyAxMy4zMzMzLDUuNzcxMjQgMTMuMzMzMyw0LjY2NjY3IEMxMy4zMzMzLDMuNTYyMSAxMi40Mzc5LDIuNjY2NjcgMTEuMzMzMywyLjY2NjY3IFogTTEwLjY2NjcsNC42NjY2NyBDMTAuNjY2Nyw0LjI5ODQ4IDEwLjk2NTEsNCAxMS4zMzMzLDQgQzExLjcwMTUsNCAxMiw0LjI5ODQ4IDEyLDQuNjY2NjcgQzEyLDUuMDM0ODYgMTEuNzAxNSw1LjMzMzMzIDExLjMzMzMsNS4zMzMzMyBDMTAuOTY1MSw1LjMzMzMzIDEwLjY2NjcsNS4wMzQ4NiAxMC42NjY3LDQuNjY2NjcgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC42NjY3LDAgQzcuNzIxMTUsMCA1LjMzMzMzLDIuMzg3ODEgNS4zMzMzMyw1LjMzMzMzIEM1LjMzMzMzLDUuNzYxMTkgNS4zODM4NSw2LjE3Nzk4IDUuNDc5NDUsNi41Nzc3NSBMMC4xOTUyNjIsMTEuODYxOSBDMC4wNzAyMzc5LDExLjk4NyAwLDEyLjE1NjUgMCwxMi4zMzMzIEwwLDE1LjMzMzMgQzAsMTUuNzAxNSAwLjI5ODQ3NywxNiAwLjY2NjY2NywxNiBMMy4zMzMzMywxNiBDNC4wNjk3MSwxNiA0LjY2NjY3LDE1LjQwMyA0LjY2NjY3LDE0LjY2NjcgTDQuNjY2NjcsMTQgTDUuMzMzMzMsMTQgQzYuMDY5NzEsMTQgNi42NjY2NywxMy40MDMgNi42NjY2NywxMi42NjY3IEw2LjY2NjY3LDExLjMzMzMgTDgsMTEuMzMzMyBDOC4xNzY4MSwxMS4zMzMzIDguMzQ2MzgsMTEuMjYzMSA4LjQ3MTQxLDExLjEzODEgTDkuMTU5MDYsMTAuNDUwNCBDOS42Mzc3MiwxMC41OTEyIDEwLjE0MzksMTAuNjY2NyAxMC42NjY3LDEwLjY2NjcgQzEzLjYxMjIsMTAuNjY2NyAxNiw4LjI3ODg1IDE2LDUuMzMzMzMgQzE2LDIuMzg3ODEgMTMuNjEyMiwwIDEwLjY2NjcsMCBaIE02LjY2NjY3LDUuMzMzMzMgQzYuNjY2NjcsMy4xMjQxOSA4LjQ1NzUzLDEuMzMzMzMgMTAuNjY2NywxLjMzMzMzIEMxMi44NzU4LDEuMzMzMzMgMTQuNjY2NywzLjEyNDE5IDE0LjY2NjcsNS4zMzMzMyBDMTQuNjY2Nyw3LjU0MjQ3IDEyLjg3NTgsOS4zMzMzMyAxMC42NjY3LDkuMzMzMzMgQzEwLjE1NTgsOS4zMzMzMyA5LjY2ODg2LDkuMjM3OSA5LjIyMTUyLDkuMDY0NSBDOC45NzUyOCw4Ljk2OTA1IDguNjk1OTEsOS4wMjc5NSA4LjUwOTE2LDkuMjE0NjkgTDcuNzIzODYsMTAgTDYsMTAgQzUuNjMxODEsMTAgNS4zMzMzMywxMC4yOTg1IDUuMzMzMzMsMTAuNjY2NyBMNS4zMzMzMywxMi42NjY3IEw0LDEyLjY2NjcgQzMuNjMxODEsMTIuNjY2NyAzLjMzMzMzLDEyLjk2NTEgMy4zMzMzMywxMy4zMzMzIEwzLjMzMzMzLDE0LjY2NjcgTDEuMzMzMzMsMTQuNjY2NyBMMS4zMzMzMywxMi42MDk1IEw2LjY5Nzg3LDcuMjQ0OTQgQzYuODc1MDIsNy4wNjc3OSA2LjkzNzksNi44MDYyOSA2Ljg2MDY1LDYuNTY3OTggQzYuNzM0ODksNi4xNzk5NyA2LjY2NjY3LDUuNzY1MjcgNi42NjY2Nyw1LjMzMzMzIFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';
const ddgPasswordIconBaseWhite = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tYmFzZS13aGl0ZTwvdGl0bGU+CiAgICA8ZyBpZD0iZGRnLXBhc3N3b3JkLWljb24tYmFzZS13aGl0ZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IlVuaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjMzMzMsMi42NjY2NyBDMTAuMjI4OCwyLjY2NjY3IDkuMzMzMzMsMy41NjIxIDkuMzMzMzMsNC42NjY2NyBDOS4zMzMzMyw1Ljc3MTI0IDEwLjIyODgsNi42NjY2NyAxMS4zMzMzLDYuNjY2NjcgQzEyLjQzNzksNi42NjY2NyAxMy4zMzMzLDUuNzcxMjQgMTMuMzMzMyw0LjY2NjY3IEMxMy4zMzMzLDMuNTYyMSAxMi40Mzc5LDIuNjY2NjcgMTEuMzMzMywyLjY2NjY3IFogTTEwLjY2NjcsNC42NjY2NyBDMTAuNjY2Nyw0LjI5ODQ4IDEwLjk2NTEsNCAxMS4zMzMzLDQgQzExLjcwMTUsNCAxMiw0LjI5ODQ4IDEyLDQuNjY2NjcgQzEyLDUuMDM0ODYgMTEuNzAxNSw1LjMzMzMzIDExLjMzMzMsNS4zMzMzMyBDMTAuOTY1MSw1LjMzMzMzIDEwLjY2NjcsNS4wMzQ4NiAxMC42NjY3LDQuNjY2NjcgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC42NjY3LDAgQzcuNzIxMTUsMCA1LjMzMzMzLDIuMzg3ODEgNS4zMzMzMyw1LjMzMzMzIEM1LjMzMzMzLDUuNzYxMTkgNS4zODM4NSw2LjE3Nzk4IDUuNDc5NDUsNi41Nzc3NSBMMC4xOTUyNjIsMTEuODYxOSBDMC4wNzAyMzc5LDExLjk4NyAwLDEyLjE1NjUgMCwxMi4zMzMzIEwwLDE1LjMzMzMgQzAsMTUuNzAxNSAwLjI5ODQ3NywxNiAwLjY2NjY2NywxNiBMMy4zMzMzMywxNiBDNC4wNjk3MSwxNiA0LjY2NjY3LDE1LjQwMyA0LjY2NjY3LDE0LjY2NjcgTDQuNjY2NjcsMTQgTDUuMzMzMzMsMTQgQzYuMDY5NzEsMTQgNi42NjY2NywxMy40MDMgNi42NjY2NywxMi42NjY3IEw2LjY2NjY3LDExLjMzMzMgTDgsMTEuMzMzMyBDOC4xNzY4MSwxMS4zMzMzIDguMzQ2MzgsMTEuMjYzMSA4LjQ3MTQxLDExLjEzODEgTDkuMTU5MDYsMTAuNDUwNCBDOS42Mzc3MiwxMC41OTEyIDEwLjE0MzksMTAuNjY2NyAxMC42NjY3LDEwLjY2NjcgQzEzLjYxMjIsMTAuNjY2NyAxNiw4LjI3ODg1IDE2LDUuMzMzMzMgQzE2LDIuMzg3ODEgMTMuNjEyMiwwIDEwLjY2NjcsMCBaIE02LjY2NjY3LDUuMzMzMzMgQzYuNjY2NjcsMy4xMjQxOSA4LjQ1NzUzLDEuMzMzMzMgMTAuNjY2NywxLjMzMzMzIEMxMi44NzU4LDEuMzMzMzMgMTQuNjY2NywzLjEyNDE5IDE0LjY2NjcsNS4zMzMzMyBDMTQuNjY2Nyw3LjU0MjQ3IDEyLjg3NTgsOS4zMzMzMyAxMC42NjY3LDkuMzMzMzMgQzEwLjE1NTgsOS4zMzMzMyA5LjY2ODg2LDkuMjM3OSA5LjIyMTUyLDkuMDY0NSBDOC45NzUyOCw4Ljk2OTA1IDguNjk1OTEsOS4wMjc5NSA4LjUwOTE2LDkuMjE0NjkgTDcuNzIzODYsMTAgTDYsMTAgQzUuNjMxODEsMTAgNS4zMzMzMywxMC4yOTg1IDUuMzMzMzMsMTAuNjY2NyBMNS4zMzMzMywxMi42NjY3IEw0LDEyLjY2NjcgQzMuNjMxODEsMTIuNjY2NyAzLjMzMzMzLDEyLjk2NTEgMy4zMzMzMywxMy4zMzMzIEwzLjMzMzMzLDE0LjY2NjcgTDEuMzMzMzMsMTQuNjY2NyBMMS4zMzMzMywxMi42MDk1IEw2LjY5Nzg3LDcuMjQ0OTQgQzYuODc1MDIsNy4wNjc3OSA2LjkzNzksNi44MDYyOSA2Ljg2MDY1LDYuNTY3OTggQzYuNzM0ODksNi4xNzk5NyA2LjY2NjY3LDUuNzY1MjcgNi42NjY2Nyw1LjMzMzMzIFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';
const ddgPasswordIconFilled = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tZmlsbGVkPC90aXRsZT4KICAgIDxnIGlkPSJkZGctcGFzc3dvcmQtaWNvbi1maWxsZWQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTaGFwZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC4wMDAwMDAsIDQuMDAwMDAwKSIgZmlsbD0iIzc2NDMxMCI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS4yNSwyLjc1IEMxMC4xNDU0LDIuNzUgOS4yNSwzLjY0NTQzIDkuMjUsNC43NSBDOS4yNSw1Ljg1NDU3IDEwLjE0NTQsNi43NSAxMS4yNSw2Ljc1IEMxMi4zNTQ2LDYuNzUgMTMuMjUsNS44NTQ1NyAxMy4yNSw0Ljc1IEMxMy4yNSwzLjY0NTQzIDEyLjM1NDYsMi43NSAxMS4yNSwyLjc1IFogTTEwLjc1LDQuNzUgQzEwLjc1LDQuNDczODYgMTAuOTczOSw0LjI1IDExLjI1LDQuMjUgQzExLjUyNjEsNC4yNSAxMS43NSw0LjQ3Mzg2IDExLjc1LDQuNzUgQzExLjc1LDUuMDI2MTQgMTEuNTI2MSw1LjI1IDExLjI1LDUuMjUgQzEwLjk3MzksNS4yNSAxMC43NSw1LjAyNjE0IDEwLjc1LDQuNzUgWiI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNMTAuNjI1LDAgQzcuNjU2NDcsMCA1LjI1LDIuNDA2NDcgNS4yNSw1LjM3NSBDNS4yNSw1Ljc4MDk4IDUuMjk1MTQsNi4xNzcxNCA1LjM4MDg4LDYuNTU4NDYgTDAuMjE5NjcsMTEuNzE5NyBDMC4wNzkwMTc2LDExLjg2MDMgMCwxMi4wNTExIDAsMTIuMjUgTDAsMTUuMjUgQzAsMTUuNjY0MiAwLjMzNTc4NiwxNiAwLjc1LDE2IEwzLjc0NjYxLDE2IEM0LjMwMDc2LDE2IDQuNzUsMTUuNTUwOCA0Ljc1LDE0Ljk5NjYgTDQuNzUsMTQgTDUuNzQ2NjEsMTQgQzYuMzAwNzYsMTQgNi43NSwxMy41NTA4IDYuNzUsMTIuOTk2NiBMNi43NSwxMS41IEw4LDExLjUgQzguMTk4OTEsMTEuNSA4LjM4OTY4LDExLjQyMSA4LjUzMDMzLDExLjI4MDMgTDkuMjQwNzgsMTAuNTY5OSBDOS42ODMwNCwxMC42ODc1IDEwLjE0NzIsMTAuNzUgMTAuNjI1LDEwLjc1IEMxMy41OTM1LDEwLjc1IDE2LDguMzQzNTMgMTYsNS4zNzUgQzE2LDIuNDA2NDcgMTMuNTkzNSwwIDEwLjYyNSwwIFogTTYuNzUsNS4zNzUgQzYuNzUsMy4yMzQ5IDguNDg0OSwxLjUgMTAuNjI1LDEuNSBDMTIuNzY1MSwxLjUgMTQuNSwzLjIzNDkgMTQuNSw1LjM3NSBDMTQuNSw3LjUxNTEgMTIuNzY1MSw5LjI1IDEwLjYyNSw5LjI1IEMxMC4xNTQ1LDkuMjUgOS43MDUyOCw5LjE2NjUgOS4yOTAxMSw5LjAxNDE2IEM5LjAxNTgxLDguOTEzNSA4LjcwODAzLDguOTgxMzEgOC41MDE0Miw5LjE4NzkyIEw3LjY4OTM0LDEwIEw2LDEwIEM1LjU4NTc5LDEwIDUuMjUsMTAuMzM1OCA1LjI1LDEwLjc1IEw1LjI1LDEyLjUgTDQsMTIuNSBDMy41ODU3OSwxMi41IDMuMjUsMTIuODM1OCAzLjI1LDEzLjI1IEwzLjI1LDE0LjUgTDEuNSwxNC41IEwxLjUsMTIuNTYwNyBMNi43NDgyNiw3LjMxMjQgQzYuOTQ2NjYsNy4xMTQgNy4wMTc3Myw2LjgyMTQ1IDYuOTMyNDUsNi41NTQxMyBDNi44MTQxNSw2LjE4MzI3IDYuNzUsNS43ODczNSA2Ljc1LDUuMzc1IFoiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';
const ddgPasswordIconFocused = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tZm9jdXNlZDwvdGl0bGU+CiAgICA8ZyBpZD0iZGRnLXBhc3N3b3JkLWljb24tZm9jdXNlZCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ikljb24tQ29udGFpbmVyIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZSIgZmlsbC1vcGFjaXR5PSIwLjEiIGZpbGwtcnVsZT0ibm9uemVybyIgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iMTIiPjwvcmVjdD4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC4wMDAwMDApIiBmaWxsLW9wYWNpdHk9IjAuOSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEuMjUsMi43NSBDMTAuMTQ1NCwyLjc1IDkuMjUsMy42NDU0MyA5LjI1LDQuNzUgQzkuMjUsNS44NTQ1NyAxMC4xNDU0LDYuNzUgMTEuMjUsNi43NSBDMTIuMzU0Niw2Ljc1IDEzLjI1LDUuODU0NTcgMTMuMjUsNC43NSBDMTMuMjUsMy42NDU0MyAxMi4zNTQ2LDIuNzUgMTEuMjUsMi43NSBaIE0xMC43NSw0Ljc1IEMxMC43NSw0LjQ3Mzg2IDEwLjk3MzksNC4yNSAxMS4yNSw0LjI1IEMxMS41MjYxLDQuMjUgMTEuNzUsNC40NzM4NiAxMS43NSw0Ljc1IEMxMS43NSw1LjAyNjE0IDExLjUyNjEsNS4yNSAxMS4yNSw1LjI1IEMxMC45NzM5LDUuMjUgMTAuNzUsNS4wMjYxNCAxMC43NSw0Ljc1IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwLjYyNSwwIEM3LjY1NjUsMCA1LjI1LDIuNDA2NDcgNS4yNSw1LjM3NSBDNS4yNSw1Ljc4MDk4IDUuMjk1MTQsNi4xNzcxIDUuMzgwODgsNi41NTg1IEwwLjIxOTY3LDExLjcxOTcgQzAuMDc5MDIsMTEuODYwMyAwLDEyLjA1MTEgMCwxMi4yNSBMMCwxNS4yNSBDMCwxNS42NjQyIDAuMzM1NzksMTYgMC43NSwxNiBMMy43NDY2MSwxNiBDNC4zMDA3NiwxNiA0Ljc1LDE1LjU1MDggNC43NSwxNC45OTY2IEw0Ljc1LDE0IEw1Ljc0NjYxLDE0IEM2LjMwMDgsMTQgNi43NSwxMy41NTA4IDYuNzUsMTIuOTk2NiBMNi43NSwxMS41IEw4LDExLjUgQzguMTk4OSwxMS41IDguMzg5NywxMS40MjEgOC41MzAzLDExLjI4MDMgTDkuMjQwOCwxMC41Njk5IEM5LjY4MywxMC42ODc1IDEwLjE0NzIsMTAuNzUgMTAuNjI1LDEwLjc1IEMxMy41OTM1LDEwLjc1IDE2LDguMzQzNSAxNiw1LjM3NSBDMTYsMi40MDY0NyAxMy41OTM1LDAgMTAuNjI1LDAgWiBNNi43NSw1LjM3NSBDNi43NSwzLjIzNDkgOC40ODQ5LDEuNSAxMC42MjUsMS41IEMxMi43NjUxLDEuNSAxNC41LDMuMjM0OSAxNC41LDUuMzc1IEMxNC41LDcuNTE1MSAxMi43NjUxLDkuMjUgMTAuNjI1LDkuMjUgQzEwLjE1NDUsOS4yNSA5LjcwNTMsOS4xNjY1IDkuMjkwMSw5LjAxNDIgQzkuMDE1OCw4LjkxMzUgOC43MDgsOC45ODEzIDguNTAxNCw5LjE4NzkgTDcuNjg5MywxMCBMNiwxMCBDNS41ODU3OSwxMCA1LjI1LDEwLjMzNTggNS4yNSwxMC43NSBMNS4yNSwxMi41IEw0LDEyLjUgQzMuNTg1NzksMTIuNSAzLjI1LDEyLjgzNTggMy4yNSwxMy4yNSBMMy4yNSwxNC41IEwxLjUsMTQuNSBMMS41LDEyLjU2MDcgTDYuNzQ4Myw3LjMxMjQgQzYuOTQ2Nyw3LjExNCA3LjAxNzcsNi44MjE0IDYuOTMyNSw2LjU1NDEgQzYuODE0MSw2LjE4MzMgNi43NSw1Ljc4NzM1IDYuNzUsNS4zNzUgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';
const ddgCcIconBase = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBkPSJNNSA5Yy0uNTUyIDAtMSAuNDQ4LTEgMXYyYzAgLjU1Mi40NDggMSAxIDFoM2MuNTUyIDAgMS0uNDQ4IDEtMXYtMmMwLS41NTItLjQ0OC0xLTEtMUg1eiIgZmlsbD0iIzAwMCIvPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDZjMC0yLjIxIDEuNzktNCA0LTRoMTRjMi4yMSAwIDQgMS43OSA0IDR2MTJjMCAyLjIxLTEuNzkgNC00IDRINWMtMi4yMSAwLTQtMS43OS00LTRWNnptNC0yYy0xLjEwNSAwLTIgLjg5NS0yIDJ2OWgxOFY2YzAtMS4xMDUtLjg5NS0yLTItMkg1em0wIDE2Yy0xLjEwNSAwLTItLjg5NS0yLTJoMThjMCAxLjEwNS0uODk1IDItMiAySDV6IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPgo=';
const ddgCcIconFilled = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBkPSJNNSA5Yy0uNTUyIDAtMSAuNDQ4LTEgMXYyYzAgLjU1Mi40NDggMSAxIDFoM2MuNTUyIDAgMS0uNDQ4IDEtMXYtMmMwLS41NTItLjQ0OC0xLTEtMUg1eiIgZmlsbD0iIzc2NDMxMCIvPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDZjMC0yLjIxIDEuNzktNCA0LTRoMTRjMi4yMSAwIDQgMS43OSA0IDR2MTJjMCAyLjIxLTEuNzkgNC00IDRINWMtMi4yMSAwLTQtMS43OS00LTRWNnptNC0yYy0xLjEwNSAwLTIgLjg5NS0yIDJ2OWgxOFY2YzAtMS4xMDUtLjg5NS0yLTItMkg1em0wIDE2Yy0xLjEwNSAwLTItLjg5NS0yLTJoMThjMCAxLjEwNS0uODk1IDItMiAySDV6IiBmaWxsPSIjNzY0MzEwIi8+Cjwvc3ZnPgo=';
const ddgIdentityIconBase = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDIxYzIuMTQzIDAgNC4xMTEtLjc1IDUuNjU3LTItLjYyNi0uNTA2LTEuMzE4LS45MjctMi4wNi0xLjI1LTEuMS0uNDgtMi4yODUtLjczNS0zLjQ4Ni0uNzUtMS4yLS4wMTQtMi4zOTIuMjExLTMuNTA0LjY2NC0uODE3LjMzMy0xLjU4Ljc4My0yLjI2NCAxLjMzNiAxLjU0NiAxLjI1IDMuNTE0IDIgNS42NTcgMnptNC4zOTctNS4wODNjLjk2Ny40MjIgMS44NjYuOTggMi42NzIgMS42NTVDMjAuMjc5IDE2LjAzOSAyMSAxNC4xMDQgMjEgMTJjMC00Ljk3LTQuMDMtOS05LTlzLTkgNC4wMy05IDljMCAyLjEwNC43MjIgNC4wNCAxLjkzMiA1LjU3Mi44NzQtLjczNCAxLjg2LTEuMzI4IDIuOTIxLTEuNzYgMS4zNi0uNTU0IDIuODE2LS44MyA0LjI4My0uODExIDEuNDY3LjAxOCAyLjkxNi4zMyA0LjI2LjkxNnpNMTIgMjNjNi4wNzUgMCAxMS00LjkyNSAxMS0xMVMxOC4wNzUgMSAxMiAxIDEgNS45MjUgMSAxMnM0LjkyNSAxMSAxMSAxMXptMy0xM2MwIDEuNjU3LTEuMzQzIDMtMyAzcy0zLTEuMzQzLTMtMyAxLjM0My0zIDMtMyAzIDEuMzQzIDMgM3ptMiAwYzAgMi43NjEtMi4yMzkgNS01IDVzLTUtMi4yMzktNS01IDIuMjM5LTUgNS01IDUgMi4yMzkgNSA1eiIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4KPHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDIxYzIuMTQzIDAgNC4xMTEtLjc1IDUuNjU3LTItLjYyNi0uNTA2LTEuMzE4LS45MjctMi4wNi0xLjI1LTEuMS0uNDgtMi4yODUtLjczNS0zLjQ4Ni0uNzUtMS4yLS4wMTQtMi4zOTIuMjExLTMuNTA0LjY2NC0uODE3LjMzMy0xLjU4Ljc4My0yLjI2NCAxLjMzNiAxLjU0NiAxLjI1IDMuNTE0IDIgNS42NTcgMnptNC4zOTctNS4wODNjLjk2Ny40MjIgMS44NjYuOTggMi42NzIgMS42NTVDMjAuMjc5IDE2LjAzOSAyMSAxNC4xMDQgMjEgMTJjMC00Ljk3LTQuMDMtOS05LTlzLTkgNC4wMy05IDljMCAyLjEwNC43MjIgNC4wNCAxLjkzMiA1LjU3Mi44NzQtLjczNCAxLjg2LTEuMzI4IDIuOTIxLTEuNzYgMS4zNi0uNTU0IDIuODE2LS44MyA0LjI4My0uODExIDEuNDY3LjAxOCAyLjkxNi4zMyA0LjI2LjkxNnpNMTIgMjNjNi4wNzUgMCAxMS00LjkyNSAxMS0xMVMxOC4wNzUgMSAxMiAxIDEgNS45MjUgMSAxMnM0LjkyNSAxMSAxMSAxMXptMy0xM2MwIDEuNjU3LTEuMzQzIDMtMyAzcy0zLTEuMzQzLTMtMyAxLjM0My0zIDMtMyAzIDEuMzQzIDMgM3ptMiAwYzAgMi43NjEtMi4yMzkgNS01IDVzLTUtMi4yMzktNS01IDIuMjM5LTUgNS01IDUgMi4yMzkgNSA1eiIgZmlsbD0iIzAwMCIvPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJub25lIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyMWMyLjE0MyAwIDQuMTExLS43NSA1LjY1Ny0yLS42MjYtLjUwNi0xLjMxOC0uOTI3LTIuMDYtMS4yNS0xLjEtLjQ4LTIuMjg1LS43MzUtMy40ODYtLjc1LTEuMi0uMDE0LTIuMzkyLjIxMS0zLjUwNC42NjQtLjgxNy4zMzMtMS41OC43ODMtMi4yNjQgMS4zMzYgMS41NDYgMS4yNSAzLjUxNCAyIDUuNjU3IDJ6bTQuMzk3LTUuMDgzYy45NjcuNDIyIDEuODY2Ljk4IDIuNjcyIDEuNjU1QzIwLjI3OSAxNi4wMzkgMjEgMTQuMTA0IDIxIDEyYzAtNC45Ny00LjAzLTktOS05cy05IDQuMDMtOSA5YzAgMi4xMDQuNzIyIDQuMDQgMS45MzIgNS41NzIuODc0LS43MzQgMS44Ni0xLjMyOCAyLjkyMS0xLjc2IDEuMzYtLjU1NCAyLjgxNi0uODMgNC4yODMtLjgxMSAxLjQ2Ny4wMTggMi45MTYuMzMgNC4yNi45MTZ6TTEyIDIzYzYuMDc1IDAgMTEtNC45MjUgMTEtMTFTMTguMDc1IDEgMTIgMSAxIDUuOTI1IDEgMTJzNC45MjUgMTEgMTEgMTF6bTMtMTNjMCAxLjY1Ny0xLjM0MyAzLTMgM3MtMy0xLjM0My0zLTMgMS4zNDMtMyAzLTMgMyAxLjM0MyAzIDN6bTIgMGMwIDIuNzYxLTIuMjM5IDUtNSA1cy01LTIuMjM5LTUtNSAyLjIzOS01IDUtNSA1IDIuMjM5IDUgNXoiIGZpbGw9IiMwMDAiLz4KPC9zdmc+Cg==";
module.exports = {
  ddgPasswordIconBase,
  ddgPasswordIconBaseWhite,
  ddgPasswordIconFilled,
  ddgPasswordIconFocused,
  ddgCcIconBase,
  ddgCcIconFilled,
  ddgIdentityIconBase
};

},{}],20:[function(require,module,exports){
"use strict";

module.exports = "\n.wrapper *, .wrapper *::before, .wrapper *::after {\n    box-sizing: border-box;\n}\n.wrapper {\n    position: fixed;\n    top: 0;\n    left: 0;\n    padding: 0;\n    font-family: 'DDG_ProximaNova', 'Proxima Nova', -apple-system,\n    BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',\n    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n    -webkit-font-smoothing: antialiased;\n    /* move it offscreen to avoid flashing */\n    transform: translate(-1000px);\n    z-index: 2147483647;\n}\n.wrapper--data {\n    font-family: 'SF Pro Text', -apple-system,\n    BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',\n    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n}\n.tooltip {\n    position: absolute;\n    width: 300px;\n    max-width: calc(100vw - 25px);\n    z-index: 2147483647;\n}\n.tooltip--data {\n    top: 100%;\n    left: 100%;\n    width: 315px;\n    padding: 4px;\n    border: 0.5px solid rgba(0, 0, 0, 0.2);\n    border-radius: 6px;\n    background-color: rgba(242, 240, 240, 0.9);\n    -webkit-backdrop-filter: blur(40px);\n    backdrop-filter: blur(40px);\n    font-size: 13px;\n    line-height: 14px;\n    color: #222222;\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.32);\n}\n.tooltip--email {\n    top: calc(100% + 6px);\n    right: calc(100% - 46px);\n    padding: 8px;\n    border: 1px solid #D0D0D0;\n    border-radius: 10px;\n    background-color: #FFFFFF;\n    font-size: 14px;\n    line-height: 1.3;\n    color: #333333;\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);\n}\n.tooltip--email::before,\n.tooltip--email::after {\n    content: \"\";\n    width: 0;\n    height: 0;\n    border-left: 10px solid transparent;\n    border-right: 10px solid transparent;\n    display: block;\n    border-bottom: 8px solid #D0D0D0;\n    position: absolute;\n    right: 20px;\n}\n.tooltip--email::before {\n    border-bottom-color: #D0D0D0;\n    top: -9px;\n}\n.tooltip--email::after {\n    border-bottom-color: #FFFFFF;\n    top: -8px;\n}\n\n/* Buttons */\n.tooltip__button {\n    display: flex;\n    width: 100%;\n    padding: 4px;\n    font-family: inherit;\n    color: inherit;\n    background: transparent;\n    border: none;\n    border-radius: 6px;\n}\n.tooltip__button:hover {\n    background-color: rgba(0, 121, 242, 0.8);\n    color: #FFFFFF;\n}\n\n/* Data autofill tooltip specific */\n.tooltip__button--data {\n    min-height: 48px;\n    flex-direction: row;\n    justify-content: flex-start;\n    align-items: center;\n    font-size: inherit;\n    font-weight: 500;\n    line-height: 16px;\n    text-align: left;\n}\n.tooltip__button--data > * {\n    opacity: 0.9;\n}\n.tooltip__button--data:first-child {\n    margin-top: 0;\n}\n.tooltip__button--data:last-child {\n    margin-bottom: 0;\n}\n.tooltip__button--data::before {\n    content: '';\n    flex-shrink: 0;\n    display: block;\n    width: 32px;\n    height: 32px;\n    margin: 0 8px;\n    background-size: 24px 24px;\n    background-repeat: no-repeat;\n    background-position: center;\n}\n.tooltip__button--data:hover::before {\n    filter: invert(100%);\n}\n.tooltip__button__text-container {\n    margin: auto 0;\n}\n.tooltip__button__primary-text {\n    font-size: 13px;\n    letter-spacing: -0.08px;\n    color: rgba(0,0,0,.8)\n}\n.tooltip__button__primary-text::first-line {\n    font-size: 12px;\n    font-weight: 400;\n    letter-spacing: -0.25px;\n    color: rgba(0,0,0,.9)\n}\n.tooltip__button__secondary-text {\n    font-size: 11px;\n    font-weight: 400;\n    letter-spacing: 0.06px;\n    color: rgba(0,0,0,0.6);\n}\n.tooltip__button:hover .tooltip__button__primary-text,\n.tooltip__button:hover .tooltip__button__secondary-text {\n    color: #FFFFFF;\n}\n\n/* Icons */\n.tooltip__button--data--credentials::before {\n    /* TODO: use dynamically from src/UI/img/ddgPasswordIcon.js */\n    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tYmFzZTwvdGl0bGU+CiAgICA8ZyBpZD0iZGRnLXBhc3N3b3JkLWljb24tYmFzZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IlVuaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjMzMzMsMi42NjY2NyBDMTAuMjI4OCwyLjY2NjY3IDkuMzMzMzMsMy41NjIxIDkuMzMzMzMsNC42NjY2NyBDOS4zMzMzMyw1Ljc3MTI0IDEwLjIyODgsNi42NjY2NyAxMS4zMzMzLDYuNjY2NjcgQzEyLjQzNzksNi42NjY2NyAxMy4zMzMzLDUuNzcxMjQgMTMuMzMzMyw0LjY2NjY3IEMxMy4zMzMzLDMuNTYyMSAxMi40Mzc5LDIuNjY2NjcgMTEuMzMzMywyLjY2NjY3IFogTTEwLjY2NjcsNC42NjY2NyBDMTAuNjY2Nyw0LjI5ODQ4IDEwLjk2NTEsNCAxMS4zMzMzLDQgQzExLjcwMTUsNCAxMiw0LjI5ODQ4IDEyLDQuNjY2NjcgQzEyLDUuMDM0ODYgMTEuNzAxNSw1LjMzMzMzIDExLjMzMzMsNS4zMzMzMyBDMTAuOTY1MSw1LjMzMzMzIDEwLjY2NjcsNS4wMzQ4NiAxMC42NjY3LDQuNjY2NjcgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC42NjY3LDAgQzcuNzIxMTUsMCA1LjMzMzMzLDIuMzg3ODEgNS4zMzMzMyw1LjMzMzMzIEM1LjMzMzMzLDUuNzYxMTkgNS4zODM4NSw2LjE3Nzk4IDUuNDc5NDUsNi41Nzc3NSBMMC4xOTUyNjIsMTEuODYxOSBDMC4wNzAyMzc5LDExLjk4NyAwLDEyLjE1NjUgMCwxMi4zMzMzIEwwLDE1LjMzMzMgQzAsMTUuNzAxNSAwLjI5ODQ3NywxNiAwLjY2NjY2NywxNiBMMy4zMzMzMywxNiBDNC4wNjk3MSwxNiA0LjY2NjY3LDE1LjQwMyA0LjY2NjY3LDE0LjY2NjcgTDQuNjY2NjcsMTQgTDUuMzMzMzMsMTQgQzYuMDY5NzEsMTQgNi42NjY2NywxMy40MDMgNi42NjY2NywxMi42NjY3IEw2LjY2NjY3LDExLjMzMzMgTDgsMTEuMzMzMyBDOC4xNzY4MSwxMS4zMzMzIDguMzQ2MzgsMTEuMjYzMSA4LjQ3MTQxLDExLjEzODEgTDkuMTU5MDYsMTAuNDUwNCBDOS42Mzc3MiwxMC41OTEyIDEwLjE0MzksMTAuNjY2NyAxMC42NjY3LDEwLjY2NjcgQzEzLjYxMjIsMTAuNjY2NyAxNiw4LjI3ODg1IDE2LDUuMzMzMzMgQzE2LDIuMzg3ODEgMTMuNjEyMiwwIDEwLjY2NjcsMCBaIE02LjY2NjY3LDUuMzMzMzMgQzYuNjY2NjcsMy4xMjQxOSA4LjQ1NzUzLDEuMzMzMzMgMTAuNjY2NywxLjMzMzMzIEMxMi44NzU4LDEuMzMzMzMgMTQuNjY2NywzLjEyNDE5IDE0LjY2NjcsNS4zMzMzMyBDMTQuNjY2Nyw3LjU0MjQ3IDEyLjg3NTgsOS4zMzMzMyAxMC42NjY3LDkuMzMzMzMgQzEwLjE1NTgsOS4zMzMzMyA5LjY2ODg2LDkuMjM3OSA5LjIyMTUyLDkuMDY0NSBDOC45NzUyOCw4Ljk2OTA1IDguNjk1OTEsOS4wMjc5NSA4LjUwOTE2LDkuMjE0NjkgTDcuNzIzODYsMTAgTDYsMTAgQzUuNjMxODEsMTAgNS4zMzMzMywxMC4yOTg1IDUuMzMzMzMsMTAuNjY2NyBMNS4zMzMzMywxMi42NjY3IEw0LDEyLjY2NjcgQzMuNjMxODEsMTIuNjY2NyAzLjMzMzMzLDEyLjk2NTEgMy4zMzMzMywxMy4zMzMzIEwzLjMzMzMzLDE0LjY2NjcgTDEuMzMzMzMsMTQuNjY2NyBMMS4zMzMzMywxMi42MDk1IEw2LjY5Nzg3LDcuMjQ0OTQgQzYuODc1MDIsNy4wNjc3OSA2LjkzNzksNi44MDYyOSA2Ljg2MDY1LDYuNTY3OTggQzYuNzM0ODksNi4xNzk5NyA2LjY2NjY3LDUuNzY1MjcgNi42NjY2Nyw1LjMzMzMzIFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');\n}\n.tooltip__button--data--creditCard::before {\n    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBkPSJNNSA5Yy0uNTUyIDAtMSAuNDQ4LTEgMXYyYzAgLjU1Mi40NDggMSAxIDFoM2MuNTUyIDAgMS0uNDQ4IDEtMXYtMmMwLS41NTItLjQ0OC0xLTEtMUg1eiIgZmlsbD0iIzAwMCIvPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDZjMC0yLjIxIDEuNzktNCA0LTRoMTRjMi4yMSAwIDQgMS43OSA0IDR2MTJjMCAyLjIxLTEuNzkgNC00IDRINWMtMi4yMSAwLTQtMS43OS00LTRWNnptNC0yYy0xLjEwNSAwLTIgLjg5NS0yIDJ2OWgxOFY2YzAtMS4xMDUtLjg5NS0yLTItMkg1em0wIDE2Yy0xLjEwNSAwLTItLjg5NS0yLTJoMThjMCAxLjEwNS0uODk1IDItMiAySDV6IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPgo=');\n}\n.tooltip__button--data--identities::before {\n    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDIxYzIuMTQzIDAgNC4xMTEtLjc1IDUuNjU3LTItLjYyNi0uNTA2LTEuMzE4LS45MjctMi4wNi0xLjI1LTEuMS0uNDgtMi4yODUtLjczNS0zLjQ4Ni0uNzUtMS4yLS4wMTQtMi4zOTIuMjExLTMuNTA0LjY2NC0uODE3LjMzMy0xLjU4Ljc4My0yLjI2NCAxLjMzNiAxLjU0NiAxLjI1IDMuNTE0IDIgNS42NTcgMnptNC4zOTctNS4wODNjLjk2Ny40MjIgMS44NjYuOTggMi42NzIgMS42NTVDMjAuMjc5IDE2LjAzOSAyMSAxNC4xMDQgMjEgMTJjMC00Ljk3LTQuMDMtOS05LTlzLTkgNC4wMy05IDljMCAyLjEwNC43MjIgNC4wNCAxLjkzMiA1LjU3Mi44NzQtLjczNCAxLjg2LTEuMzI4IDIuOTIxLTEuNzYgMS4zNi0uNTU0IDIuODE2LS44MyA0LjI4My0uODExIDEuNDY3LjAxOCAyLjkxNi4zMyA0LjI2LjkxNnpNMTIgMjNjNi4wNzUgMCAxMS00LjkyNSAxMS0xMVMxOC4wNzUgMSAxMiAxIDEgNS45MjUgMSAxMnM0LjkyNSAxMSAxMSAxMXptMy0xM2MwIDEuNjU3LTEuMzQzIDMtMyAzcy0zLTEuMzQzLTMtMyAxLjM0My0zIDMtMyAzIDEuMzQzIDMgM3ptMiAwYzAgMi43NjEtMi4yMzkgNS01IDVzLTUtMi4yMzktNS01IDIuMjM5LTUgNS01IDUgMi4yMzkgNSA1eiIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4=');\n}\n\nhr {\n    display: block;\n    margin: 5px 10px;\n    border: none; /* reset the border */\n    border-top: 1px solid rgba(0,0,0,.1);\n}\n\nhr:first-child {\n    display: none;\n}\n\n#privateAddress {\n    align-items: flex-start;\n}\n#personalAddress::before,\n#privateAddress::before,\n#personalAddress:hover::before,\n#privateAddress:hover::before {\n    filter: none;\n    background-image: url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgNDQgNDQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9Ii4wMSIgc3RvcC1jb2xvcj0iIzYxNzZiOSIvPjxzdG9wIG9mZnNldD0iLjY5IiBzdG9wLWNvbG9yPSIjMzk0YTlmIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTMuOTI5NyIgeDI9IjE3LjA3MiIgeGxpbms6aHJlZj0iI2EiIHkxPSIxNi4zOTgiIHkyPSIxNi4zOTgiLz48bGluZWFyR3JhZGllbnQgaWQ9ImMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMjMuODExNSIgeDI9IjI2LjY3NTIiIHhsaW5rOmhyZWY9IiNhIiB5MT0iMTQuOTY3OSIgeTI9IjE0Ljk2NzkiLz48bWFzayBpZD0iZCIgaGVpZ2h0PSI0MCIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiB4PSIyIiB5PSIyIj48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im0yMi4wMDAzIDQxLjA2NjljMTAuNTMwMiAwIDE5LjA2NjYtOC41MzY0IDE5LjA2NjYtMTkuMDY2NiAwLTEwLjUzMDMtOC41MzY0LTE5LjA2NjcxLTE5LjA2NjYtMTkuMDY2NzEtMTAuNTMwMyAwLTE5LjA2NjcxIDguNTM2NDEtMTkuMDY2NzEgMTkuMDY2NzEgMCAxMC41MzAyIDguNTM2NDEgMTkuMDY2NiAxOS4wNjY3MSAxOS4wNjY2eiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9tYXNrPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTIyIDQ0YzEyLjE1MDMgMCAyMi05Ljg0OTcgMjItMjIgMC0xMi4xNTAyNi05Ljg0OTctMjItMjItMjItMTIuMTUwMjYgMC0yMiA5Ljg0OTc0LTIyIDIyIDAgMTIuMTUwMyA5Ljg0OTc0IDIyIDIyIDIyeiIgZmlsbD0iI2RlNTgzMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+PGcgbWFzaz0idXJsKCNkKSI+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtMjYuMDgxMyA0MS42Mzg2Yy0uOTIwMy0xLjc4OTMtMS44MDAzLTMuNDM1Ni0yLjM0NjYtNC41MjQ2LTEuNDUyLTIuOTA3Ny0yLjkxMTQtNy4wMDctMi4yNDc3LTkuNjUwNy4xMjEtLjQ4MDMtMS4zNjc3LTE3Ljc4Njk5LTIuNDItMTguMzQ0MzItMS4xNjk3LS42MjMzMy0zLjcxMDctMS40NDQ2Ny01LjAyNy0xLjY2NDY3LS45MTY3LS4xNDY2Ni0xLjEyNTcuMTEtMS41MTA3LjE2ODY3LjM2My4wMzY2NyAyLjA5Ljg4NzMzIDIuNDIzNy45MzUtLjMzMzcuMjI3MzMtMS4zMi0uMDA3MzMtMS45NTA3LjI3MTMzLS4zMTkuMTQ2NjctLjU1NzMuNjg5MzQtLjU1Ljk0NiAxLjc5NjctLjE4MzMzIDQuNjA1NC0uMDAzNjYgNi4yNy43MzMyOS0xLjMyMzYuMTUwNC0zLjMzMy4zMTktNC4xOTgzLjc3MzctMi41MDggMS4zMi0zLjYxNTMgNC40MTEtMi45NTUzIDguMTE0My42NTYzIDMuNjk2IDMuNTY0IDE3LjE3ODQgNC40OTE2IDIxLjY4MS45MjQgNC40OTkgMTEuNTUzNyAzLjU1NjcgMTAuMDE3NC41NjF6IiBmaWxsPSIjZDVkN2Q4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJtMjIuMjg2NSAyNi44NDM5Yy0uNjYgMi42NDM2Ljc5MiA2LjczOTMgMi4yNDc2IDkuNjUwNi40ODkxLjk3MjcgMS4yNDM4IDIuMzkyMSAyLjA1NTggMy45NjM3LTEuODk0LjQ2OTMtNi40ODk1IDEuMTI2NC05LjcxOTEgMC0uOTI0LTQuNDkxNy0zLjgzMTctMTcuOTc3Ny00LjQ5NTMtMjEuNjgxLS42Ni0zLjcwMzMgMC02LjM0NyAyLjUxNTMtNy42NjcuODYxNy0uNDU0NyAyLjA5MzctLjc4NDcgMy40MTM3LS45MzEzLTEuNjY0Ny0uNzQwNy0zLjYzNzQtMS4wMjY3LTUuNDQxNC0uODQzMzYtLjAwNzMtLjc2MjY3IDEuMzM4NC0uNzE4NjcgMS44NDQ0LTEuMDYzMzQtLjMzMzctLjA0NzY2LTEuMTYyNC0uNzk1NjYtMS41MjktLjgzMjMzIDIuMjg4My0uMzkyNDQgNC42NDIzLS4wMjEzOCA2LjY5OSAxLjA1NiAxLjA0ODYuNTYxIDEuNzg5MyAxLjE2MjMzIDIuMjQ3NiAxLjc5MzAzIDEuMTk1NC4yMjczIDIuMjUxNC42NiAyLjk0MDcgMS4zNDkzIDIuMTE5MyAyLjExNTcgNC4wMTEzIDYuOTUyIDMuMjE5MyA5LjczMTMtLjIyMzYuNzctLjczMzMgMS4zMzEtMS4zNzEzIDEuNzk2Ny0xLjIzOTMuOTAyLTEuMDE5My0xLjA0NS00LjEwMy45NzE3LS4zOTk3LjI2MDMtLjM5OTcgMi4yMjU2LS41MjQzIDIuNzA2eiIgZmlsbD0iI2ZmZiIvPjwvZz48ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTE2LjY3MjQgMjAuMzU0Yy43Njc1IDAgMS4zODk2LS42MjIxIDEuMzg5Ni0xLjM4OTZzLS42MjIxLTEuMzg5Ny0xLjM4OTYtMS4zODk3LTEuMzg5Ny42MjIyLTEuMzg5NyAxLjM4OTcuNjIyMiAxLjM4OTYgMS4zODk3IDEuMzg5NnoiIGZpbGw9IiMyZDRmOGUiLz48cGF0aCBkPSJtMTcuMjkyNCAxOC44NjE3Yy4xOTg1IDAgLjM1OTQtLjE2MDguMzU5NC0uMzU5M3MtLjE2MDktLjM1OTMtLjM1OTQtLjM1OTNjLS4xOTg0IDAtLjM1OTMuMTYwOC0uMzU5My4zNTkzcy4xNjA5LjM1OTMuMzU5My4zNTkzeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0yNS45NTY4IDE5LjMzMTFjLjY1ODEgMCAxLjE5MTctLjUzMzUgMS4xOTE3LTEuMTkxNyAwLS42NTgxLS41MzM2LTEuMTkxNi0xLjE5MTctMS4xOTE2cy0xLjE5MTcuNTMzNS0xLjE5MTcgMS4xOTE2YzAgLjY1ODIuNTMzNiAxLjE5MTcgMS4xOTE3IDEuMTkxN3oiIGZpbGw9IiMyZDRmOGUiLz48cGF0aCBkPSJtMjYuNDg4MiAxOC4wNTExYy4xNzAxIDAgLjMwOC0uMTM3OS4zMDgtLjMwOHMtLjEzNzktLjMwOC0uMzA4LS4zMDgtLjMwOC4xMzc5LS4zMDguMzA4LjEzNzkuMzA4LjMwOC4zMDh6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTE3LjA3MiAxNC45NDJzLTEuMDQ4Ni0uNDc2Ni0yLjA2NDMuMTY1Yy0xLjAxNTcuNjM4LS45NzkgMS4yOTA3LS45NzkgMS4yOTA3cy0uNTM5LTEuMjAyNy44OTgzLTEuNzkzYzEuNDQxLS41ODY3IDIuMTQ1LjMzNzMgMi4xNDUuMzM3M3oiIGZpbGw9InVybCgjYikiLz48cGF0aCBkPSJtMjYuNjc1MiAxNC44NDY3cy0uNzUxNy0uNDI5LTEuMzM4My0uNDIxN2MtMS4xOTkuMDE0Ny0xLjUyNTQuNTQyNy0xLjUyNTQuNTQyN3MuMjAxNy0xLjI2MTQgMS43MzQ0LTEuMDA4NGMuNDk5Ny4wOTE0LjkyMjMuNDIzNCAxLjEyOTMuODg3NHoiIGZpbGw9InVybCgjYykiLz48cGF0aCBkPSJtMjAuOTI1OCAyNC4zMjFjLjEzOTMtLjg0MzMgMi4zMS0yLjQzMSAzLjg1LTIuNTMgMS41NC0uMDk1MyAyLjAxNjctLjA3MzMgMy4zLS4zODEzIDEuMjg3LS4zMDQzIDQuNTk4LTEuMTI5MyA1LjUxMS0xLjU1NDcuOTE2Ny0uNDIxNiA0LjgwMzMuMjA5IDIuMDY0MyAxLjczOC0xLjE4NDMuNjYzNy00LjM3OCAxLjg4MS02LjY2MjMgMi41NjMtMi4yODA3LjY4Mi0zLjY2My0uNjUyNi00LjQyMi40Njk0LS42MDEzLjg5MS0uMTIxIDIuMTEyIDIuNjAzMyAyLjM2NSAzLjY4MTQuMzQxIDcuMjA4Ny0xLjY1NzQgNy41OTc0LS41OTQuMzg4NiAxLjA2MzMtMy4xNjA3IDIuMzgzMy01LjMyNCAyLjQyNzMtMi4xNjM0LjA0MDMtNi41MTk0LTEuNDMtNy4xNzItMS44ODQ3LS42NTY0LS40NTEtMS41MjU0LTEuNTE0My0xLjM0NTctMi42MTh6IiBmaWxsPSIjZmRkMjBhIi8+PHBhdGggZD0ibTI4Ljg4MjUgMzEuODM4NmMtLjc3NzMtLjE3MjQtNC4zMTIgMi41MDA2LTQuMzEyIDIuNTAwNmguMDAzN2wtLjE2NSAyLjA1MzRzNC4wNDA2IDEuNjUzNiA0LjczIDEuMzk3Yy42ODkzLS4yNjQuNTE3LTUuNzc1LS4yNTY3LTUuOTUxem0tMTEuNTQ2MyAxLjAzNGMuMDg0My0xLjExODQgNS4yNTQzIDEuNjQyNiA1LjI1NDMgMS42NDI2bC4wMDM3LS4wMDM2LjI1NjYgMi4xNTZzLTQuMzA4MyAyLjU4MTMtNC45MTMzIDIuMjM2NmMtLjYwMTMtLjM0NDYtLjY4OTMtNC45MDk2LS42MDEzLTYuMDMxNnoiIGZpbGw9IiM2NWJjNDYiLz48cGF0aCBkPSJtMjEuMzQgMzQuODA0OWMwIDEuODA3Ny0uMjYwNCAyLjU4NS41MTMzIDIuNzU3NC43NzczLjE3MjMgMi4yNDAzIDAgMi43NjEtLjM0NDcuNTEzMy0uMzQ0Ny4wODQzLTIuNjY5My0uMDg4LTMuMTAycy0zLjE5LS4wODgtMy4xOS42ODkzeiIgZmlsbD0iIzQzYTI0NCIvPjxwYXRoIGQ9Im0yMS42NzAxIDM0LjQwNTFjMCAxLjgwNzYtLjI2MDQgMi41ODEzLjUxMzMgMi43NTM2Ljc3MzcuMTc2IDIuMjM2NyAwIDIuNzU3My0uMzQ0Ni41MTctLjM0NDcuMDg4LTIuNjY5NC0uMDg0My0zLjEwMi0uMTcyMy0uNDMyNy0zLjE5LS4wODQ0LTMuMTkuNjg5M3oiIGZpbGw9IiM2NWJjNDYiLz48cGF0aCBkPSJtMjIuMDAwMiA0MC40NDgxYzEwLjE4ODUgMCAxOC40NDc5LTguMjU5NCAxOC40NDc5LTE4LjQ0NzlzLTguMjU5NC0xOC40NDc5NS0xOC40NDc5LTE4LjQ0Nzk1LTE4LjQ0Nzk1IDguMjU5NDUtMTguNDQ3OTUgMTguNDQ3OTUgOC4yNTk0NSAxOC40NDc5IDE4LjQ0Nzk1IDE4LjQ0Nzl6bTAgMS43MTg3YzExLjEzNzcgMCAyMC4xNjY2LTkuMDI4OSAyMC4xNjY2LTIwLjE2NjYgMC0xMS4xMzc4LTkuMDI4OS0yMC4xNjY3LTIwLjE2NjYtMjAuMTY2Ny0xMS4xMzc4IDAtMjAuMTY2NyA5LjAyODktMjAuMTY2NyAyMC4xNjY3IDAgMTEuMTM3NyA5LjAyODkgMjAuMTY2NiAyMC4xNjY3IDIwLjE2NjZ6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==');\n}\n\n/* Email tooltip specific */\n.tooltip__button--email {\n    flex-direction: column;\n    justify-content: center;\n    align-items: flex-start;\n    font-size: 14px;\n}\n.tooltip__button--email__primary-text {\n    font-weight: bold;\n}\n.tooltip__button--email__secondary-text {\n    font-size: 12px;\n}\n";

},{}],21:[function(require,module,exports){
"use strict";

// Do not remove -- Apple devices change this when they support modern webkit messaging
let hasModernWebkitAPI = false; // INJECT hasModernWebkitAPI HERE
// The native layer will inject a randomised secret here and use it to verify the origin

let secret = 'PLACEHOLDER_SECRET';

const ddgGlobals = require('./captureDdgGlobals');
/**
 * Sends message to the webkit layer (fire and forget)
 * @param {String} handler
 * @param {*} data
 * @returns {*}
 */


const wkSend = (handler, data = {}) => window.webkit.messageHandlers[handler].postMessage({ ...data,
  messageHandling: { ...data.messageHandling,
    secret
  }
});
/**
 * Generate a random method name and adds it to the global scope
 * The native layer will use this method to send the response
 * @param {String} randomMethodName
 * @param {Function} callback
 */


const generateRandomMethod = (randomMethodName, callback) => {
  ddgGlobals.ObjectDefineProperty(ddgGlobals.window, randomMethodName, {
    enumerable: false,
    // configurable, To allow for deletion later
    configurable: true,
    writable: false,
    value: (...args) => {
      callback(...args);
      delete ddgGlobals.window[randomMethodName];
    }
  });
};
/**
 * Sends message to the webkit layer and waits for the specified response
 * @param {String} handler
 * @param {*} data
 * @returns {Promise<*>}
 */


const wkSendAndWait = async (handler, data = {}) => {
  if (hasModernWebkitAPI) {
    const response = await wkSend(handler, data);
    return ddgGlobals.JSONparse(response || '{}');
  }

  try {
    const randMethodName = createRandMethodName();
    const key = await createRandKey();
    const iv = createRandIv();
    const {
      ciphertext,
      tag
    } = await new ddgGlobals.Promise(resolve => {
      generateRandomMethod(randMethodName, resolve);
      data.messageHandling = {
        methodName: randMethodName,
        secret,
        key: ddgGlobals.Arrayfrom(key),
        iv: ddgGlobals.Arrayfrom(iv)
      };
      wkSend(handler, data);
    });
    const cipher = new ddgGlobals.Uint8Array([...ciphertext, ...tag]);
    const decrypted = await decrypt(cipher, key, iv);
    return ddgGlobals.JSONparse(decrypted || '{}');
  } catch (e) {
    console.error('decryption failed', e);
    return {
      error: e
    };
  }
};

const randomString = () => '' + ddgGlobals.getRandomValues(new ddgGlobals.Uint32Array(1))[0];

const createRandMethodName = () => '_' + randomString();

const algoObj = {
  name: 'AES-GCM',
  length: 256
};

const createRandKey = async () => {
  const key = await ddgGlobals.generateKey(algoObj, true, ['encrypt', 'decrypt']);
  const exportedKey = await ddgGlobals.exportKey('raw', key);
  return new ddgGlobals.Uint8Array(exportedKey);
};

const createRandIv = () => ddgGlobals.getRandomValues(new ddgGlobals.Uint8Array(12));

const decrypt = async (ciphertext, key, iv) => {
  const cryptoKey = await ddgGlobals.importKey('raw', key, 'AES-GCM', false, ['decrypt']);
  const algo = {
    name: 'AES-GCM',
    iv
  };
  let decrypted = await ddgGlobals.decrypt(algo, cryptoKey, ciphertext);
  let dec = new ddgGlobals.TextDecoder();
  return dec.decode(decrypted);
};

module.exports = {
  wkSend,
  wkSendAndWait
};

},{"./captureDdgGlobals":22}],22:[function(require,module,exports){
"use strict";

// Capture the globals we need on page start
const secretGlobals = {
  window,
  // Methods must be bound to their interface, otherwise they throw Illegal invocation
  encrypt: window.crypto.subtle.encrypt.bind(window.crypto.subtle),
  decrypt: window.crypto.subtle.decrypt.bind(window.crypto.subtle),
  generateKey: window.crypto.subtle.generateKey.bind(window.crypto.subtle),
  exportKey: window.crypto.subtle.exportKey.bind(window.crypto.subtle),
  importKey: window.crypto.subtle.importKey.bind(window.crypto.subtle),
  getRandomValues: window.crypto.getRandomValues.bind(window.crypto),
  TextEncoder,
  TextDecoder,
  Uint8Array,
  Uint16Array,
  Uint32Array,
  JSONstringify: window.JSON.stringify,
  JSONparse: window.JSON.parse,
  Arrayfrom: window.Array.from,
  Promise: window.Promise,
  ObjectDefineProperty: window.Object.defineProperty
};
module.exports = secretGlobals;

},{}],23:[function(require,module,exports){
"use strict";

const {
  getInputSubtype
} = require('./Form/input-classifiers');

let isApp = false; // Do not modify or remove the next line -- the app code will replace it with `isApp = true;`
// INJECT isApp HERE

const isDDGApp = /(iPhone|iPad|Android|Mac).*DuckDuckGo\/[0-9]/i.test(window.navigator.userAgent) || isApp;
const isAndroid = isDDGApp && /Android/i.test(window.navigator.userAgent);
const isMobileApp = isDDGApp && !isApp;
const DDG_DOMAIN_REGEX = new RegExp(/^https:\/\/(([a-z0-9-_]+?)\.)?duckduckgo\.com\/email/);
const SIGN_IN_MSG = {
  signMeIn: true
};

const isDDGDomain = () => window.location.href.match(DDG_DOMAIN_REGEX); // Send a message to the web app (only on DDG domains)


const notifyWebApp = message => {
  if (isDDGDomain()) {
    window.postMessage(message, window.origin);
  }
};
/**
 * Sends a message and returns a Promise that resolves with the response
 * @param {{} | Function} msgOrFn - a fn to call or an object to send via postMessage
 * @param {String} expectedResponse - the name of the response
 * @returns {Promise<*>}
 */


const sendAndWaitForAnswer = (msgOrFn, expectedResponse) => {
  if (typeof msgOrFn === 'function') {
    msgOrFn();
  } else {
    window.postMessage(msgOrFn, window.origin);
  }

  return new Promise(resolve => {
    const handler = e => {
      if (e.origin !== window.origin) return;
      if (!e.data || e.data && !(e.data[expectedResponse] || e.data.type === expectedResponse)) return;
      resolve(e.data);
      window.removeEventListener('message', handler);
    };

    window.addEventListener('message', handler);
  });
}; // Access the original setter (needed to bypass React's implementation on mobile)
// @ts-ignore


const originalSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
/**
 * Ensures the value is set properly and dispatches events to simulate real user action
 * @param {HTMLInputElement} el
 * @param {string | number} val
 * @return {boolean}
 */

const setValueForInput = (el, val) => {
  // Avoid keyboard flashing on Android
  if (!isAndroid) {
    el.focus();
  }

  el.dispatchEvent(new Event('keydown', {
    bubbles: true
  }));
  originalSet === null || originalSet === void 0 ? void 0 : originalSet.call(el, val);
  const events = [new Event('input', {
    bubbles: true
  }), new Event('keyup', {
    bubbles: true
  }), new Event('change', {
    bubbles: true
  })];
  events.forEach(ev => el.dispatchEvent(ev)); // We call this again to make sure all forms are happy

  originalSet === null || originalSet === void 0 ? void 0 : originalSet.call(el, val);
  events.forEach(ev => el.dispatchEvent(ev));
  el.blur();
  return true;
};
/**
 * Fires events on a select element to simulate user interaction
 * @param {HTMLSelectElement} el
 */


const fireEventsOnSelect = el => {
  const events = [new Event('mousedown', {
    bubbles: true
  }), new Event('focus', {
    bubbles: true
  }), new Event('change', {
    bubbles: true
  }), new Event('mouseup', {
    bubbles: true
  }), new Event('click', {
    bubbles: true
  })]; // Events fire on the select el, not option

  events.forEach(ev => el.dispatchEvent(ev));
  events.forEach(ev => el.dispatchEvent(ev));
  el.blur();
};
/**
 * Selects an option of a select element
 * We assume Select is only used for dates, i.e. in the credit card
 * @param {HTMLSelectElement} el
 * @param {string | number} val
 * @return {boolean}
 */


const setValueForSelect = (el, val) => {
  const subtype = getInputSubtype(el);
  const isMonth = subtype.includes('Month');
  const isZeroBasedNumber = isMonth && el.options[0].value === '0' && el.options.length === 12; // Loop first through all values because they tend to be more precise

  for (const option of el.options) {
    // If values for months are zero-based (Jan === 0), add one to match our data type
    let value = option.value;

    if (isZeroBasedNumber) {
      value = "".concat(Number(value) + 1);
    } // TODO: try to match localised month names


    if (value.includes(String(val))) {
      option.selected = true;
      fireEventsOnSelect(el);
      return true;
    }
  }

  for (const option of el.options) {
    if (option.innerText.includes(String(val))) {
      option.selected = true;
      fireEventsOnSelect(el);
      return true;
    }
  } // If we didn't find a matching option return false


  return false;
};
/**
 * Sets or selects a value to a form element
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @param {string | number} val
 * @return {boolean}
 */


const setValue = (el, val) => {
  if (el instanceof HTMLInputElement) return setValueForInput(el, val);
  if (el instanceof HTMLSelectElement) return setValueForSelect(el, val);
  return false;
};
/**
 * Use IntersectionObserver v2 to make sure the element is visible when clicked
 * https://developers.google.com/web/updates/2019/02/intersectionobserver-v2
 */


const safeExecute = (el, fn) => {
  const intObs = new IntersectionObserver(changes => {
    for (const change of changes) {
      // Feature detection
      if (typeof change.isVisible === 'undefined') {
        // The browser doesn't support Intersection Observer v2, falling back to v1 behavior.
        change.isVisible = true;
      }

      if (change.isIntersecting && change.isVisible) {
        fn();
      }
    }

    intObs.disconnect();
  }, {
    trackVisibility: true,
    delay: 100
  });
  intObs.observe(el);
};
/**
 * Gets the bounding box of the icon
 * @param {HTMLInputElement} input
 * @returns {{top: number, left: number, bottom: number, width: number, x: number, y: number, right: number, height: number}}
 */


const getDaxBoundingBox = input => {
  const {
    right: inputRight,
    top: inputTop,
    height: inputHeight
  } = input.getBoundingClientRect();
  const inputRightPadding = parseInt(getComputedStyle(input).paddingRight);
  const width = 30;
  const height = 30;
  const top = inputTop + (inputHeight - height) / 2;
  const right = inputRight - inputRightPadding;
  const left = right - width;
  const bottom = top + height;
  return {
    bottom,
    height,
    left,
    right,
    top,
    width,
    x: left,
    y: top
  };
};
/**
 * Check if a mouse event is within the icon
 * @param {MouseEvent} e
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */


const isEventWithinDax = (e, input) => {
  const {
    left,
    right,
    top,
    bottom
  } = getDaxBoundingBox(input);
  const withinX = e.clientX >= left && e.clientX <= right;
  const withinY = e.clientY >= top && e.clientY <= bottom;
  return withinX && withinY;
};
/**
 * Adds inline styles from a prop:value object
 * @param {HTMLElement} el
 * @param {Object<string, string>} styles
 */


const addInlineStyles = (el, styles) => Object.entries(styles).forEach(([property, val]) => el.style.setProperty(property, val, 'important'));
/**
 * Removes inline styles from a prop:value object
 * @param {HTMLElement} el
 * @param {Object<string, string>} styles
 */


const removeInlineStyles = (el, styles) => Object.keys(styles).forEach(property => el.style.removeProperty(property));

const ADDRESS_DOMAIN = '@duck.com';
/**
 * Given a username, returns the full email address
 * @param {string} address
 * @returns {string}
 */

const formatDuckAddress = address => address + ADDRESS_DOMAIN;
/**
 * Escapes any occurrences of &, ", <, > or / with XML entities.
 * @param {string} str The string to escape.
 * @return {string} The escaped string.
 */


function escapeXML(str) {
  const replacements = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
    '/': '&#x2F;'
  };
  return String(str).replace(/[&"'<>/]/g, m => replacements[m]);
}

module.exports = {
  isApp,
  isDDGApp,
  isAndroid,
  isMobileApp,
  DDG_DOMAIN_REGEX,
  isDDGDomain,
  notifyWebApp,
  sendAndWaitForAnswer,
  setValue,
  safeExecute,
  getDaxBoundingBox,
  isEventWithinDax,
  addInlineStyles,
  removeInlineStyles,
  SIGN_IN_MSG,
  ADDRESS_DOMAIN,
  formatDuckAddress,
  escapeXML
};

},{"./Form/input-classifiers":10}],24:[function(require,module,exports){
"use strict";

(() => {
  try {
    if (!window.isSecureContext) return;

    const listenForGlobalFormSubmission = require('./Form/listenForFormSubmission');

    const inject = require('./inject'); // chrome is only present in desktop browsers


    if (typeof chrome === 'undefined') {
      listenForGlobalFormSubmission();
      inject();
    } else {
      // Check if the site is marked to skip autofill
      chrome.runtime.sendMessage({
        registeredTempAutofillContentScript: true,
        documentUrl: window.location.href
      }, response => {
        var _response$site, _response$site$broken;

        if (!(response !== null && response !== void 0 && (_response$site = response.site) !== null && _response$site !== void 0 && (_response$site$broken = _response$site.brokenFeatures) !== null && _response$site$broken !== void 0 && _response$site$broken.includes('autofill'))) {
          inject();
        }
      });
    }
  } catch (e) {// Noop, we errored
  }
})();

},{"./Form/listenForFormSubmission":13,"./inject":26}],25:[function(require,module,exports){
"use strict";

module.exports = {
  ATTR_INPUT_TYPE: 'data-ddg-inputType',
  ATTR_AUTOFILL: 'data-ddg-autofill',
  TEXT_LENGTH_CUTOFF: 50
};

},{}],26:[function(require,module,exports){
"use strict";

// Polyfills/shims
require('./requestIdleCallback');

const {
  forms
} = require('./scanForInputs');

const {
  isApp
} = require('./autofill-utils');

const DeviceInterface = require('./DeviceInterface');

const inject = () => {
  // Global listener for event delegation
  window.addEventListener('pointerdown', e => {
    if (!e.isTrusted) return; // @ts-ignore

    if (e.target.nodeName === 'DDG-AUTOFILL') {
      e.preventDefault();
      e.stopImmediatePropagation();
      const activeForm = DeviceInterface.getActiveForm();

      if (activeForm) {
        activeForm.tooltip.dispatchClick();
      }
    }

    if (!isApp) return; // Check for clicks on submit buttons

    const matchingForm = [...forms.values()].find(form => {
      const btns = [...form.submitButtons];
      if (btns.includes(e.target)) return true;
      if (btns.find(btn => btn.contains(e.target))) return true;
    });
    matchingForm === null || matchingForm === void 0 ? void 0 : matchingForm.submitHandler();
  }, true);

  if (isApp) {
    window.addEventListener('submit', e => {
      var _forms$get;

      return (// @ts-ignore
        (_forms$get = forms.get(e.target)) === null || _forms$get === void 0 ? void 0 : _forms$get.submitHandler()
      );
    }, true);
  }

  DeviceInterface.init();
};

module.exports = inject;

},{"./DeviceInterface":1,"./autofill-utils":23,"./requestIdleCallback":27,"./scanForInputs":28}],27:[function(require,module,exports){
"use strict";

/*!
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/*
 * @see https://developers.google.com/web/updates/2015/08/using-requestidlecallback
 */
// @ts-ignore
window.requestIdleCallback = window.requestIdleCallback || function (cb) {
  return setTimeout(function () {
    const start = Date.now(); // eslint-disable-next-line standard/no-callback-literal

    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

window.cancelIdleCallback = window.cancelIdleCallback || function (id) {
  clearTimeout(id);
};

module.exports = {};

},{}],28:[function(require,module,exports){
"use strict";

const Form = require('./Form/Form');

const {
  notifyWebApp
} = require('./autofill-utils');

const {
  SUBMIT_BUTTON_SELECTOR,
  FORM_ELS_SELECTOR
} = require('./Form/selectors');
/** @type Map<HTMLFormElement, Form> */


const forms = new Map(); // Accepts the DeviceInterface as an explicit dependency

const scanForInputs = DeviceInterface => {
  const getParentForm = input => {
    if (input.form) return input.form;
    let element = input; // traverse the DOM to search for related inputs

    while (element.parentElement && element.parentElement !== document.body) {
      element = element.parentElement;
      const inputs = element.querySelectorAll(FORM_ELS_SELECTOR);
      const buttons = element.querySelectorAll(SUBMIT_BUTTON_SELECTOR); // If we find a button or another input, we assume that's our form

      if (inputs.length > 1 || buttons.length) {
        // found related input, return common ancestor
        return element;
      }
    }

    return input;
  };

  const addInput = input => {
    const parentForm = getParentForm(input); // Note that el.contains returns true for el itself

    const previouslyFoundParent = [...forms.keys()].find(form => form.contains(parentForm));

    if (previouslyFoundParent) {
      var _forms$get;

      // If we've already met the form or a descendant, add the input
      (_forms$get = forms.get(previouslyFoundParent)) === null || _forms$get === void 0 ? void 0 : _forms$get.addInput(input);
    } else {
      // if this form is an ancestor of an existing form, remove that before adding this
      const childForm = [...forms.keys()].find(form => parentForm.contains(form));

      if (childForm) {
        var _forms$get2;

        (_forms$get2 = forms.get(childForm)) === null || _forms$get2 === void 0 ? void 0 : _forms$get2.destroy();
        forms.delete(childForm);
      }

      forms.set(parentForm, new Form(parentForm, input, DeviceInterface));
    }
  };

  const findEligibleInput = context => {
    var _context$matches;

    if ((_context$matches = context.matches) !== null && _context$matches !== void 0 && _context$matches.call(context, FORM_ELS_SELECTOR)) {
      addInput(context);
    } else {
      context.querySelectorAll(FORM_ELS_SELECTOR).forEach(addInput);
    }
  }; // For all DOM mutations, search for new eligible inputs and update existing inputs positions


  const mutObs = new MutationObserver(mutationList => {
    for (const mutationRecord of mutationList) {
      if (mutationRecord.type === 'childList') {
        // We query only within the context of added/removed nodes
        mutationRecord.addedNodes.forEach(el => {
          if (el.nodeName === 'DDG-AUTOFILL') return;

          if (el instanceof HTMLElement) {
            window.requestIdleCallback(() => {
              findEligibleInput(el);
            });
          }
        });
      }
    }
  });

  const logoutHandler = () => {
    // remove Dax, listeners, and observers
    mutObs.disconnect();
    forms.forEach(form => {
      form.resetAllInputs();
      form.removeAllDecorations();
    });
    forms.clear();
    notifyWebApp({
      deviceSignedIn: {
        value: false
      }
    });
  };

  DeviceInterface.addLogoutListener(logoutHandler);
  window.requestIdleCallback(() => {
    findEligibleInput(document);
    mutObs.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
};

module.exports = {
  scanForInputs,
  forms
};

},{"./Form/Form":6,"./Form/selectors":15,"./autofill-utils":23}]},{},[24]);
