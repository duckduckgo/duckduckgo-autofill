(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

const EmailAutofill = require('./UI/EmailAutofill');

const DataAutofill = require('./UI/DataAutofill');

const {
  isApp,
  notifyWebApp,
  isDDGApp,
  isAndroid,
  isDDGDomain,
  sendAndWaitForAnswer,
  setValue,
  formatAddress
} = require('./autofill-utils');

const {
  wkSend,
  wkSendAndWait
} = require('./appleDeviceUtils/appleDeviceUtils');

const {
  scanForInputs,
  forms
} = require('./scanForInputs.js');

const getInputConfig = require('./Form/inputTypeConfig');

const SIGN_IN_MSG = {
  signMeIn: true
};

const attachTooltip = function (form, input) {
  if (isDDGApp && !isApp) {
    form.activeInput = input;
    this.getAlias().then(alias => {
      if (alias) form.autofillEmail(alias);else form.activeInput.focus();
    });
  } else {
    if (form.tooltip) return;
    form.activeInput = input;
    const inputType = getInputConfig(input).type;
    form.tooltip = inputType === 'emailNew' ? new EmailAutofill(input, form, this) : new DataAutofill(input, form, this);
    form.intObs.observe(input);
    window.addEventListener('mousedown', form.removeTooltip, {
      capture: true
    });
    window.addEventListener('input', form.removeTooltip, {
      once: true
    });
  }
};

let attempts = 0;

var _addresses = new WeakMap();

var _data = new WeakMap();

class InterfacePrototype {
  constructor() {
    _addresses.set(this, {
      writable: true,
      value: {}
    });

    _data.set(this, {
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
    _classPrivateFieldSet(this, _addresses, addresses);
  }
  /** @type { PMData } */


  /**
   * Stores init data coming from the device
   * @param { PMData } data
   */
  storeLocalData(data) {
    data.credentials.forEach(cred => delete cred.password);
    data.creditCards.forEach(cc => delete cc.cardNumber && delete cc.cardSecurityCode);

    _classPrivateFieldSet(this, _data, data);
  }

  get hasLocalCredentials() {
    return _classPrivateFieldGet(this, _data).credentials.length > 0;
  }

  getLocalCredentials() {
    return _classPrivateFieldGet(this, _data).credentials.map(cred => delete cred.password && cred);
  }

  get hasLocalIdentities() {
    return _classPrivateFieldGet(this, _data).identities.length > 0;
  }

  getLocalIdentities() {
    return _classPrivateFieldGet(this, _data).identities;
  }

  get hasLocalCreditCards() {
    return _classPrivateFieldGet(this, _data).creditCards.length > 0;
  }

  getLocalCreditCards() {
    return _classPrivateFieldGet(this, _data).creditCards;
  }

  init() {
    this.attachTooltip = attachTooltip.bind(this);

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

  setupAutofill() {}

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

  storeUserData() {}

  addDeviceListeners() {}

  addLogoutListener() {}

  attachTooltip() {}

  isDeviceSignedIn() {}

  getAlias() {} // PM endpoints


  storeCredentials() {}

  getAccounts() {}

  getAutofillCredentials() {}

  openManagePasswords() {}

}

class ExtensionInterface extends InterfacePrototype {
  constructor() {
    super();

    this.isDeviceSignedIn = () => this.hasLocalAddresses;

    this.setupAutofill = ({
      shouldLog
    } = {
      shouldLog: false
    }) => {
      this.getAddresses().then(addresses => {
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
    };

    this.getAddresses = () => new Promise(resolve => chrome.runtime.sendMessage({
      getAddresses: true
    }, data => {
      this.storeLocalAddresses(data);
      return resolve(data);
    }));

    this.refreshAlias = () => chrome.runtime.sendMessage({
      refreshAlias: true
    }, addresses => this.storeLocalAddresses(addresses));

    this.trySigningIn = () => {
      if (isDDGDomain()) {
        sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData').then(data => this.storeUserData(data));
      }
    };

    this.storeUserData = data => chrome.runtime.sendMessage(data);

    this.addDeviceListeners = () => {
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
            setValue(activeEl, formatAddress(message.alias));
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
    };

    this.addLogoutListener = handler => {
      // Cleanup on logout events
      chrome.runtime.onMessage.addListener((message, sender) => {
        if (sender.id === chrome.runtime.id && message.type === 'logout') {
          handler();
        }
      });
    };
  }

}

class AndroidInterface extends InterfacePrototype {
  constructor() {
    super();

    this.getAlias = () => sendAndWaitForAnswer(() => window.EmailInterface.showTooltip(), 'getAliasResponse').then(({
      alias
    }) => alias);

    this.isDeviceSignedIn = () => {
      // isDeviceSignedIn is only available on DDG domains...
      if (isDDGDomain()) return window.EmailInterface.isSignedIn() === 'true'; // ...on other domains we assume true because the script wouldn't exist otherwise

      return true;
    };

    this.setupAutofill = ({
      shouldLog
    } = {
      shouldLog: false
    }) => {
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
    };

    this.storeUserData = ({
      addUserData: {
        token,
        userName,
        cohort
      }
    }) => window.EmailInterface.storeCredentials(token, userName, cohort);
  }

}

class AppleDeviceInterface extends InterfacePrototype {
  constructor() {
    super();

    this.setupAutofill = async ({
      shouldLog
    } = {
      shouldLog: false
    }) => {
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
    };

    this.getAddresses = async () => {
      if (!isApp) return this.getAlias();
      const {
        addresses
      } = await wkSendAndWait('emailHandlerGetAddresses');
      this.storeLocalAddresses(addresses);
      return addresses;
    };

    this.getAlias = async () => {
      const {
        alias
      } = await wkSendAndWait('emailHandlerGetAlias', {
        requiresUserPermission: !isApp,
        shouldConsumeAliasIfProvided: !isApp
      });
      return formatAddress(alias);
    };

    this.refreshAlias = () => wkSend('emailHandlerRefreshAlias');

    this._checkDeviceSignedIn = async () => {
      const {
        isAppSignedIn
      } = await wkSendAndWait('emailHandlerCheckAppSignedInStatus');

      this.isDeviceSignedIn = () => !!isAppSignedIn;

      return !!isAppSignedIn;
    };

    this.storeUserData = ({
      addUserData: {
        token,
        userName,
        cohort
      }
    }) => wkSend('emailHandlerStoreToken', {
      token,
      username: userName,
      cohort
    });
    /**
     * PM endpoints
     */

    /**
     * Sends credentials to the native layer
     * @param {{username: String, password: String}} credentials
     */


    this.storeCredentials = credentials => wkSend('pmHandlerStoreCredentials', credentials);
    /**
     * Gets the init data from the device
     * @returns {APIResponse<PMData>}
     */


    this.getAutofillInitData = () => wkSendAndWait('pmHandlerGetAutofillInitData').then(response => {
      this.storeLocalData(response.success);
      return response;
    });
    /**
     * Gets credentials ready for autofill
     * @param {Number} id - the credential id
     * @returns {APIResponse<CredentialsObject>}
     */


    this.getAutofillCredentials = id => wkSendAndWait('pmHandlerGetAutofillCredentials', {
      id
    });
    /**
     * Opens the native UI for managing passwords
     */


    this.openManagePasswords = () => wkSend('pmHandlerOpenManagePasswords');
    /**
     * Opens the native UI for managing identities
     */


    this.openManageIdentities = () => wkSend('pmHandlerOpenManageIdentities');
    /**
     * Opens the native UI for managing credit cards
     */


    this.openManageCreditCards = () => wkSend('pmHandlerOpenManageCreditCards');
    /**
     * Gets a single identity obj once the user requests it
     * @param {Number} id
     * @returns {APIResponse<IdentityObject>}
     */


    this.getAutofillIdentity = id => wkSendAndWait('pmHandlerGetIdentity', {
      id
    });
    /**
     * Gets a single complete credit card obj once the user requests it
     * @param {Number} id
     * @returns {APIResponse<CreditCardObject>}
     */


    this.getAutofillCreditCard = id => wkSendAndWait('pmHandlerGetCreditCard', {
      id
    });
  }

}

const DeviceInterface = (() => {
  if (isDDGApp) {
    return isAndroid ? new AndroidInterface() : new AppleDeviceInterface();
  }

  return new ExtensionInterface();
})();

module.exports = DeviceInterface;

},{"./Form/inputTypeConfig":6,"./UI/DataAutofill":10,"./UI/EmailAutofill":11,"./appleDeviceUtils/appleDeviceUtils":15,"./autofill-utils":17,"./scanForInputs.js":21}],2:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const FormAnalyzer = require('./FormAnalyzer');

const {
  PASSWORD_SELECTOR,
  SUBMIT_BUTTON_SELECTOR,
  FIELD_SELECTOR
} = require('./selectors');

const {
  addInlineStyles,
  removeInlineStyles,
  isDDGApp,
  isApp,
  setValue,
  isEventWithinDax
} = require('../autofill-utils');

const {
  getInputSubtype,
  setInputType,
  getInputMainType,
  formatCCYear
} = require('./input-classifiers');

const {
  getIconStylesAutofilled,
  getIconStylesBase
} = require('./inputStyles');

const {
  ATTR_AUTOFILL
} = require('../constants');

const getInputConfig = require('./inputTypeConfig');

class Form {
  constructor(form, _input, DeviceInterface) {
    _defineProperty(this, "autofillInput", (input, string, dataType) => {
      setValue(input, string);
      input.classList.add('ddg-autofilled');
      addInlineStyles(input, getIconStylesAutofilled(input, this.isLogin)); // If the user changes the alias, remove the decoration

      input.addEventListener('input', e => this.removeAllHighlights(e, dataType), {
        once: true
      });
    });

    this.form = form;
    this.formAnalyzer = new FormAnalyzer(form, _input);
    this.isLogin = this.formAnalyzer.isLogin;
    this.isSignup = this.formAnalyzer.isSignup;
    this.Device = DeviceInterface;
    this.attachTooltip = DeviceInterface.attachTooltip;
    this.allInputs = new Set();
    this.emailNewInputs = new Set();
    this.credentialsInputs = new Set();
    this.creditCardInputs = new Set();
    this.unknownInputs = new Set();
    this.touched = new Set();
    this.listeners = new Set();
    this.tooltip = null;
    this.activeInput = null;
    this.handlerExecuted = false;
    this.shouldPromptToStoreCredentials = true;

    this.submitHandler = () => {
      if (this.handlerExecuted) return;
      const credentials = this.getValues();

      if (credentials.password) {
        // ask to store credentials and/or fireproof
        if (this.shouldPromptToStoreCredentials) {
          this.Device.storeCredentials(credentials);
        }

        this.handlerExecuted = true;
      }
    };

    this.getValues = () => {
      return [...this.credentialsInputs].reduce((output, input) => {
        const subtype = getInputSubtype(input);
        output[subtype] = input.value || output[subtype];
        return output;
      }, {
        username: '',
        password: ''
      });
    };

    this.hasValues = () => {
      const {
        username,
        password
      } = this.getValues();
      return !!(username && password);
    };

    this.intObs = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) this.removeTooltip();
      }
    });

    this.removeTooltip = e => {
      if (!this.tooltip || e && e.target === this.tooltip.host) {
        return;
      }

      this.tooltip.remove();
      this.tooltip = null;
      this.intObs.disconnect();
      window.removeEventListener('mousedown', this.removeTooltip, {
        capture: true
      });
    };

    this.removeInputHighlight = input => {
      removeInlineStyles(input, getIconStylesAutofilled(input, this.isLogin));
      input.classList.remove('ddg-autofilled');
      this.addAutofillStyles(input);
    };

    this.removeAllHighlights = (e, dataType) => {
      // This ensures we are not removing the highlight ourselves when autofilling more than once
      if (e && !e.isTrusted) return; // If the user has changed the value, we prompt to update the stored creds

      this.shouldPromptToStoreCredentials = true;
      this.execOnInputs(this.removeInputHighlight, dataType);
    };

    this.removeInputDecoration = input => {
      removeInlineStyles(input, getIconStylesBase(input, this.isLogin));
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
      this.execOnInputs(this.decorateInput);
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
    };

    this.categorizeInputs();
    return this;
  }

  categorizeInputs() {
    this.form.querySelectorAll(FIELD_SELECTOR).forEach(input => this.addInput(input));
  } // TODO: try to filter down to only submit buttons


  get submitButtons() {
    return this.form.querySelectorAll(SUBMIT_BUTTON_SELECTOR);
  }

  execOnInputs(fn, inputType = 'all') {
    const inputs = this["".concat(inputType, "Inputs")];

    for (const input of inputs) {
      const {
        shouldDecorate
      } = getInputConfig(input);
      if (shouldDecorate(this.isLogin, this.Device)) fn(input);
    }
  }

  addInput(input) {
    if (this.allInputs.has(input)) return this;
    this.allInputs.add(input);
    setInputType(input, this);
    const mainInputType = getInputMainType(input);
    this["".concat(mainInputType, "Inputs")].add(input);
    this.decorateInput(input);
    return this;
  }

  areAllInputsEmpty() {
    let allEmpty = true;
    this.execOnInputs(input => {
      if (input.value) allEmpty = false;
    });
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
    const styles = getIconStylesBase(input, this.isLogin);
    addInlineStyles(input, styles);
  }

  decorateInput(input) {
    const config = getInputConfig(input);
    if (!config.shouldDecorate(this.isLogin, this.Device)) return this;
    input.setAttribute(ATTR_AUTOFILL, 'true');
    const hasIcon = !!config.getIconBase();

    if (hasIcon) {
      this.addAutofillStyles(input, config);
      this.addListener(input, 'mousemove', e => {
        if (isEventWithinDax(e, e.target)) {
          e.target.style.setProperty('cursor', 'pointer', 'important');
        } else {
          e.target.style.removeProperty('cursor');
        }
      });
    }

    const handler = e => {
      if (this.tooltip) return; // Checks for mousedown event

      if (e.type === 'mousedown') {
        if (!e.isTrusted) return;
        const isMainMouseButton = e.button === 0;
        if (!isMainMouseButton) return;
      }

      if (this.shouldOpenTooltip(e, e.target)) {
        if (isEventWithinDax(e, e.target) || isDDGApp && !isApp) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }

        this.touched.add(e.target);
        this.attachTooltip(this, e.target);
      }
    }; // TODO: on mobile, focus could open keyboard before tooltip


    ['mousedown', 'focus'].forEach(ev => this.addListener(input, ev, handler, true));
    return this;
  }

  shouldOpenTooltip(e, input) {
    const inputType = getInputMainType(input);
    if (inputType !== 'emailNew') return true;
    return !this.touched.has(input) && this.areAllInputsEmpty() || isEventWithinDax(e, input);
  }

  autofillEmail(alias, dataType = 'emailNew') {
    this.execOnInputs(input => !input.matches(PASSWORD_SELECTOR) && this.autofillInput(input, alias, dataType), dataType);

    if (this.tooltip) {
      this.removeTooltip();
    }
  }

  autofillData(data, dataType) {
    this.shouldPromptToStoreCredentials = false;
    this.execOnInputs(input => {
      const inputSubtype = getInputSubtype(input);
      let autofillData = data[inputSubtype];
      if (!autofillData) return;

      if (inputSubtype === 'expirationYear' && input.nodeName === 'INPUT') {
        autofillData = formatCCYear(input, autofillData);
      }

      this.autofillInput(input, autofillData, dataType);
    }, dataType);

    if (this.tooltip) {
      this.removeTooltip();
    }
  }

}

module.exports = Form;

},{"../autofill-utils":17,"../constants":19,"./FormAnalyzer":3,"./input-classifiers":4,"./inputStyles":5,"./inputTypeConfig":6,"./selectors":9}],3:[function(require,module,exports){
"use strict";

const {
  PASSWORD_SELECTOR,
  SUBMIT_BUTTON_SELECTOR
} = require('./selectors');

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
    return this.autofillSignal <= 0;
  }

  get isSignup() {
    return this.autofillSignal > 0;
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
    const negativeRegex = new RegExp(/sign(ing)?.?in(?!g)|log.?in/i);
    const positiveRegex = new RegExp(/sign(ing)?.?up|join|regist(er|ration)|newsletter|subscri(be|ption)|contact|create|start|settings|preferences|profile|update|checkout|guest|purchase|buy|order|schedule|estimate/i);
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
        innerText
      }) => {
        this.updateSignal({
          string: innerText,
          strength: 0.5,
          signalType: "heading: ".concat(innerText),
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
      if (!button.form && !button.closest('form')) {
        this.evaluateElement(button);
        this.evaluateElAttributes(button, 0.5);
      }
    });
  }

  elementIs(el, type) {
    return el.nodeName.toLowerCase() === type.toLowerCase();
  }

  getText(el) {
    // for buttons, we don't care about descendants, just get the whole text as is
    // this is important in order to give proper attribution of the text to the button
    if (this.elementIs(el, 'BUTTON')) return el.innerText;
    if (this.elementIs(el, 'INPUT') && ['submit', 'button'].includes(el.type)) return el.value;
    return Array.from(el.childNodes).reduce((text, child) => this.elementIs(child, '#text') ? text + ' ' + child.textContent : text, '');
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
      const strength = el.getAttribute('type') === 'submit' ? 20 : 2;
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
      var _el$innerText;

      // any other case
      // only consider the el if it's a small text to avoid noisy disclaimers
      if (((_el$innerText = el.innerText) === null || _el$innerText === void 0 ? void 0 : _el$innerText.length) < 50) {
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

},{"./selectors":9}],4:[function(require,module,exports){
"use strict";

const {
  PASSWORD_SELECTOR,
  EMAIL_SELECTOR,
  USERNAME_SELECTOR,
  CC_FIELD_SELECTOR,
  CC_SELECTORS_MAP
} = require('./selectors');

const {
  ATTR_INPUT_TYPE
} = require('../constants');
/**
 * Tries to get labels even when they're not explicitly set with for="id"
 * @param el
 * @returns {[]|NodeList}
 */


const findLabels = el => {
  const parentNode = el.parentNode;
  const inputsInScope = parentNode === null || parentNode === void 0 ? void 0 : parentNode.querySelectorAll('input'); // To avoid noise, ensure that our input is the only in scope

  if ((inputsInScope === null || inputsInScope === void 0 ? void 0 : inputsInScope.length) === 1) {
    const labels = parentNode.querySelectorAll('label'); // If no label, recurse

    return labels.length ? labels : findLabels(parentNode);
  }

  return [];
};
/**
 * Tries to infer input type, with checks in decreasing order of reliability
 * @param {HTMLInputElement} el
 * @param {String} selector - a css selector
 * @param {RegExp} [regex] - defaults to a regex that never matches https://stackoverflow.com/a/1723207/1948947
 * @returns {boolean}
 */


const checkMatch = (el, selector, regex = new RegExp('(?!)')) => {
  var _el$id;

  if (selector && el.matches(selector) || [...el.labels].filter(label => regex.test(label.textContent)).length > 0 || regex.test(el.getAttribute('aria-label')) || (_el$id = el.id) !== null && _el$id !== void 0 && _el$id.match(regex)) return true;
  return [...findLabels(el)].filter(label => regex.test(label.textContent)).length > 0;
};
/**
 * Tries to infer if input is for password
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */


const isPassword = input => checkMatch(input, PASSWORD_SELECTOR, /password/i);
/**
 * Tries to infer if input is for email
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */


const isEmail = input => checkMatch(input, EMAIL_SELECTOR, /.mail/i);
/**
 * Tries to infer if input is for username
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */


const isUserName = input => checkMatch(input, USERNAME_SELECTOR, /user((.)?name)?/i);
/**
 * Tries to infer if it's a credit card form
 * @param {HTMLElement} form
 * @returns {boolean}
 */


const isCCForm = form => {
  const hasCCSelectorChild = form.querySelector(CC_FIELD_SELECTOR); // If the form contains one of the specific selectors, we have high confidence

  if (hasCCSelectorChild) return true; // Read form attributes to find a signal

  const hasCCAttribute = Array.from(form.attributes).some(({
    name,
    value
  }) => {
    /(credit)?card|cc/i.test("".concat(name, "=").concat(value));
  });
  if (hasCCAttribute) return true; // Match form innerText against common cc fields

  const textMatches = form.innerText.match(/(credit)?card(.?number)?|ccv|security.?code|cvv|cvc|csc/ig); // We check for more than one to minimise false positives

  return (textMatches === null || textMatches === void 0 ? void 0 : textMatches.length) > 1;
};
/**
 * Tries to infer if input is for credit card
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */


const isCCField = input => checkMatch(input, CC_FIELD_SELECTOR);
/**
 * Get a CC subtype based on selectors and regexes
 * @param {HTMLInputElement} input
 * @return {string}
 */


const getCCFieldSubtype = input => {
  const matchingSelector = Object.keys(CC_SELECTORS_MAP).find(selector => input.matches(selector));
  if (matchingSelector) return CC_SELECTORS_MAP[matchingSelector].ccType; // Loop through types until something matches

  for (const {
    ccType,
    regex
  } of Object.values(CC_SELECTORS_MAP)) {
    if (checkMatch(input, '', regex)) return ccType;
  }

  return '';
};
/**
 * Tries to infer the input type
 * @param {HTMLInputElement} input
 * @param {Form} form
 * @returns {SupportedTypes}
 */


const inferInputType = (input, form) => {
  const presetType = input.getAttribute(ATTR_INPUT_TYPE);
  if (presetType) return presetType; // For CC forms we run aggressive matches, so we want to make sure we only
  // run them on actual CC forms to avoid false positives and expensive loops

  if (isCCForm(form.form)) {
    const subtype = getCCFieldSubtype(input);
    if (subtype) return "creditCard.".concat(subtype);
  }

  if (isPassword(input)) return 'credentials.password';
  if (isEmail(input)) return form.isLogin ? 'credentials.username' : 'emailNew';
  if (isUserName(input)) return 'credentials.username';
  return 'unknown';
};
/**
 * Sets the input type as a data attribute to the element and returns it
 * @param {HTMLInputElement} input
 * @param {Form} form
 * @returns {SupportedTypes}
 */


const setInputType = (input, form) => {
  const type = inferInputType(input, form);
  input.setAttribute(ATTR_INPUT_TYPE, type);
  return type;
};
/**
 * Retrieves the input main type
 * @param {HTMLInputElement} input
 * @returns {SupportedTypes}
 */


const getInputMainType = input => input.getAttribute(ATTR_INPUT_TYPE).split('.')[0];
/**
 * Retrieves the input subtype
 * @param {HTMLInputElement} input
 * @returns {String}
 */


const getInputSubtype = input => input.getAttribute(ATTR_INPUT_TYPE).split('.')[1] || input.getAttribute(ATTR_INPUT_TYPE).split('.')[0];

const fourDigitYearRegex = /(\D)\1{3}|\d{4}/i;
/**
 * Format the cc year to best adapt to the input requirements (YY vs YYYY)
 * @param {HTMLInputElement} input
 * @param {number} year
 * @returns {number}
 */

const formatCCYear = (input, year) => {
  if (input.maxLength === 4 || fourDigitYearRegex.test(input.placeholder) || [...input.labels].some(label => fourDigitYearRegex.test(label))) return 2000 + year;
  return year;
};

module.exports = {
  isPassword,
  isEmail,
  isUserName,
  isCCField,
  inferInputType,
  setInputType,
  getInputMainType,
  getInputSubtype,
  formatCCYear
};

},{"../constants":19,"./selectors":9}],5:[function(require,module,exports){
"use strict";

const getTypeConfig = require('./inputTypeConfig');
/**
 * Get inline styles for the injected icon, base state
 * @param {HTMLInputElement} input
 * @param {boolean} isLogin
 */


const getIconStylesBase = (input, isLogin) => {
  const config = getTypeConfig(input);
  const icon = config.getIconBase();
  if (!icon) return {};
  return {
    // Height must be > 0 to account for fields initially hidden
    'background-size': "auto ".concat(input.offsetHeight <= 30 && input.offsetHeight > 0 ? '100%' : '26px'),
    'background-position': 'center right',
    'background-repeat': 'no-repeat',
    'background-origin': 'content-box',
    'background-image': "url(".concat(icon, ")"),
    'transition': 'background 0s'
  };
};
/**
 * Get inline styles for the injected icon, autofilled state
 * @param {HTMLInputElement} input
 * @param {boolean} isLogin
 */


const getIconStylesAutofilled = (input, isLogin) => {
  const config = getTypeConfig(input);
  const icon = config.getIconBase();
  const iconStyle = icon ? {
    'background-image': "url(".concat(icon)
  } : {};
  return { ...iconStyle,
    'background-color': '#F8F498',
    'color': '#333333'
  };
};

module.exports = {
  getIconStylesBase,
  getIconStylesAutofilled
};

},{"./inputTypeConfig":6}],6:[function(require,module,exports){
"use strict";

const {
  isDDGApp
} = require('../autofill-utils');

const {
  daxBase64
} = require('./logo-svg');

const ddgPasswordIcons = require('../UI/img/ddgPasswordIcon');

const {
  getInputMainType
} = require('./input-classifiers'); // In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here


const isFirefox = navigator.userAgent.includes('Firefox');
const getDaxImg = isDDGApp || isFirefox ? daxBase64 : chrome.runtime.getURL('img/logo-small.svg');
/**
 * A map of config objects. These help by centralising here some of the complexity
 * @type {Object.<SupportedTypes, InputTypeConfig>}
 */

const inputTypeConfig = {
  emailNew: {
    type: 'emailNew',
    getIconBase: () => getDaxImg,
    getIconFilled: () => getDaxImg,
    shouldDecorate: (isLogin, device) => device.hasLocalAddresses,
    dataType: 'Addresses'
  },
  credentials: {
    type: 'credentials',
    getIconBase: () => ddgPasswordIcons.ddgPasswordIconBase,
    getIconFilled: () => ddgPasswordIcons.ddgPasswordIconFilled,
    shouldDecorate: (isLogin, device) => isLogin && device.hasLocalCredentials,
    dataType: 'Credentials',
    displayTitlePropName: 'username',
    displaySubtitlePropName: '•••••••••••••••',
    autofillMethod: 'getAutofillCredentials'
  },
  creditCard: {
    type: 'creditCard',
    getIconBase: () => false,
    getIconFilled: () => false,
    shouldDecorate: (isLogin, device) => device.hasLocalCreditCards,
    dataType: 'CreditCards',
    displayTitlePropName: 'title',
    displaySubtitlePropName: 'displayNumber',
    autofillMethod: 'getAutofillCreditCard'
  },
  unknown: {
    type: 'unknown',
    getIconBase: () => '',
    getIconFilled: () => '',
    shouldDecorate: () => false,
    dataType: ''
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

},{"../UI/img/ddgPasswordIcon":13,"../autofill-utils":17,"./input-classifiers":4,"./logo-svg":8}],7:[function(require,module,exports){
"use strict";

const {
  forms
} = require('../scanForInputs');

const isApp = require('../autofill-utils');

const listenForGlobalFormSubmission = () => {
  if (!isApp) return;

  try {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries().filter(entry => ['fetch', 'xmlhttprequest'].includes(entry.initiatorType) && entry.name.match(/login|sign-in|signin|session/));
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

},{"../autofill-utils":17,"../scanForInputs":21}],8:[function(require,module,exports){
"use strict";

const daxBase64 = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgNDQgNDQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9Ii4wMSIgc3RvcC1jb2xvcj0iIzYxNzZiOSIvPjxzdG9wIG9mZnNldD0iLjY5IiBzdG9wLWNvbG9yPSIjMzk0YTlmIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTMuOTI5NyIgeDI9IjE3LjA3MiIgeGxpbms6aHJlZj0iI2EiIHkxPSIxNi4zOTgiIHkyPSIxNi4zOTgiLz48bGluZWFyR3JhZGllbnQgaWQ9ImMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMjMuODExNSIgeDI9IjI2LjY3NTIiIHhsaW5rOmhyZWY9IiNhIiB5MT0iMTQuOTY3OSIgeTI9IjE0Ljk2NzkiLz48bWFzayBpZD0iZCIgaGVpZ2h0PSI0MCIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiB4PSIyIiB5PSIyIj48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im0yMi4wMDAzIDQxLjA2NjljMTAuNTMwMiAwIDE5LjA2NjYtOC41MzY0IDE5LjA2NjYtMTkuMDY2NiAwLTEwLjUzMDMtOC41MzY0LTE5LjA2NjcxLTE5LjA2NjYtMTkuMDY2NzEtMTAuNTMwMyAwLTE5LjA2NjcxIDguNTM2NDEtMTkuMDY2NzEgMTkuMDY2NzEgMCAxMC41MzAyIDguNTM2NDEgMTkuMDY2NiAxOS4wNjY3MSAxOS4wNjY2eiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9tYXNrPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTIyIDQ0YzEyLjE1MDMgMCAyMi05Ljg0OTcgMjItMjIgMC0xMi4xNTAyNi05Ljg0OTctMjItMjItMjItMTIuMTUwMjYgMC0yMiA5Ljg0OTc0LTIyIDIyIDAgMTIuMTUwMyA5Ljg0OTc0IDIyIDIyIDIyeiIgZmlsbD0iI2RlNTgzMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+PGcgbWFzaz0idXJsKCNkKSI+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtMjYuMDgxMyA0MS42Mzg2Yy0uOTIwMy0xLjc4OTMtMS44MDAzLTMuNDM1Ni0yLjM0NjYtNC41MjQ2LTEuNDUyLTIuOTA3Ny0yLjkxMTQtNy4wMDctMi4yNDc3LTkuNjUwNy4xMjEtLjQ4MDMtMS4zNjc3LTE3Ljc4Njk5LTIuNDItMTguMzQ0MzItMS4xNjk3LS42MjMzMy0zLjcxMDctMS40NDQ2Ny01LjAyNy0xLjY2NDY3LS45MTY3LS4xNDY2Ni0xLjEyNTcuMTEtMS41MTA3LjE2ODY3LjM2My4wMzY2NyAyLjA5Ljg4NzMzIDIuNDIzNy45MzUtLjMzMzcuMjI3MzMtMS4zMi0uMDA3MzMtMS45NTA3LjI3MTMzLS4zMTkuMTQ2NjctLjU1NzMuNjg5MzQtLjU1Ljk0NiAxLjc5NjctLjE4MzMzIDQuNjA1NC0uMDAzNjYgNi4yNy43MzMyOS0xLjMyMzYuMTUwNC0zLjMzMy4zMTktNC4xOTgzLjc3MzctMi41MDggMS4zMi0zLjYxNTMgNC40MTEtMi45NTUzIDguMTE0My42NTYzIDMuNjk2IDMuNTY0IDE3LjE3ODQgNC40OTE2IDIxLjY4MS45MjQgNC40OTkgMTEuNTUzNyAzLjU1NjcgMTAuMDE3NC41NjF6IiBmaWxsPSIjZDVkN2Q4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJtMjIuMjg2NSAyNi44NDM5Yy0uNjYgMi42NDM2Ljc5MiA2LjczOTMgMi4yNDc2IDkuNjUwNi40ODkxLjk3MjcgMS4yNDM4IDIuMzkyMSAyLjA1NTggMy45NjM3LTEuODk0LjQ2OTMtNi40ODk1IDEuMTI2NC05LjcxOTEgMC0uOTI0LTQuNDkxNy0zLjgzMTctMTcuOTc3Ny00LjQ5NTMtMjEuNjgxLS42Ni0zLjcwMzMgMC02LjM0NyAyLjUxNTMtNy42NjcuODYxNy0uNDU0NyAyLjA5MzctLjc4NDcgMy40MTM3LS45MzEzLTEuNjY0Ny0uNzQwNy0zLjYzNzQtMS4wMjY3LTUuNDQxNC0uODQzMzYtLjAwNzMtLjc2MjY3IDEuMzM4NC0uNzE4NjcgMS44NDQ0LTEuMDYzMzQtLjMzMzctLjA0NzY2LTEuMTYyNC0uNzk1NjYtMS41MjktLjgzMjMzIDIuMjg4My0uMzkyNDQgNC42NDIzLS4wMjEzOCA2LjY5OSAxLjA1NiAxLjA0ODYuNTYxIDEuNzg5MyAxLjE2MjMzIDIuMjQ3NiAxLjc5MzAzIDEuMTk1NC4yMjczIDIuMjUxNC42NiAyLjk0MDcgMS4zNDkzIDIuMTE5MyAyLjExNTcgNC4wMTEzIDYuOTUyIDMuMjE5MyA5LjczMTMtLjIyMzYuNzctLjczMzMgMS4zMzEtMS4zNzEzIDEuNzk2Ny0xLjIzOTMuOTAyLTEuMDE5My0xLjA0NS00LjEwMy45NzE3LS4zOTk3LjI2MDMtLjM5OTcgMi4yMjU2LS41MjQzIDIuNzA2eiIgZmlsbD0iI2ZmZiIvPjwvZz48ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTE2LjY3MjQgMjAuMzU0Yy43Njc1IDAgMS4zODk2LS42MjIxIDEuMzg5Ni0xLjM4OTZzLS42MjIxLTEuMzg5Ny0xLjM4OTYtMS4zODk3LTEuMzg5Ny42MjIyLTEuMzg5NyAxLjM4OTcuNjIyMiAxLjM4OTYgMS4zODk3IDEuMzg5NnoiIGZpbGw9IiMyZDRmOGUiLz48cGF0aCBkPSJtMTcuMjkyNCAxOC44NjE3Yy4xOTg1IDAgLjM1OTQtLjE2MDguMzU5NC0uMzU5M3MtLjE2MDktLjM1OTMtLjM1OTQtLjM1OTNjLS4xOTg0IDAtLjM1OTMuMTYwOC0uMzU5My4zNTkzcy4xNjA5LjM1OTMuMzU5My4zNTkzeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0yNS45NTY4IDE5LjMzMTFjLjY1ODEgMCAxLjE5MTctLjUzMzUgMS4xOTE3LTEuMTkxNyAwLS42NTgxLS41MzM2LTEuMTkxNi0xLjE5MTctMS4xOTE2cy0xLjE5MTcuNTMzNS0xLjE5MTcgMS4xOTE2YzAgLjY1ODIuNTMzNiAxLjE5MTcgMS4xOTE3IDEuMTkxN3oiIGZpbGw9IiMyZDRmOGUiLz48cGF0aCBkPSJtMjYuNDg4MiAxOC4wNTExYy4xNzAxIDAgLjMwOC0uMTM3OS4zMDgtLjMwOHMtLjEzNzktLjMwOC0uMzA4LS4zMDgtLjMwOC4xMzc5LS4zMDguMzA4LjEzNzkuMzA4LjMwOC4zMDh6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTE3LjA3MiAxNC45NDJzLTEuMDQ4Ni0uNDc2Ni0yLjA2NDMuMTY1Yy0xLjAxNTcuNjM4LS45NzkgMS4yOTA3LS45NzkgMS4yOTA3cy0uNTM5LTEuMjAyNy44OTgzLTEuNzkzYzEuNDQxLS41ODY3IDIuMTQ1LjMzNzMgMi4xNDUuMzM3M3oiIGZpbGw9InVybCgjYikiLz48cGF0aCBkPSJtMjYuNjc1MiAxNC44NDY3cy0uNzUxNy0uNDI5LTEuMzM4My0uNDIxN2MtMS4xOTkuMDE0Ny0xLjUyNTQuNTQyNy0xLjUyNTQuNTQyN3MuMjAxNy0xLjI2MTQgMS43MzQ0LTEuMDA4NGMuNDk5Ny4wOTE0LjkyMjMuNDIzNCAxLjEyOTMuODg3NHoiIGZpbGw9InVybCgjYykiLz48cGF0aCBkPSJtMjAuOTI1OCAyNC4zMjFjLjEzOTMtLjg0MzMgMi4zMS0yLjQzMSAzLjg1LTIuNTMgMS41NC0uMDk1MyAyLjAxNjctLjA3MzMgMy4zLS4zODEzIDEuMjg3LS4zMDQzIDQuNTk4LTEuMTI5MyA1LjUxMS0xLjU1NDcuOTE2Ny0uNDIxNiA0LjgwMzMuMjA5IDIuMDY0MyAxLjczOC0xLjE4NDMuNjYzNy00LjM3OCAxLjg4MS02LjY2MjMgMi41NjMtMi4yODA3LjY4Mi0zLjY2My0uNjUyNi00LjQyMi40Njk0LS42MDEzLjg5MS0uMTIxIDIuMTEyIDIuNjAzMyAyLjM2NSAzLjY4MTQuMzQxIDcuMjA4Ny0xLjY1NzQgNy41OTc0LS41OTQuMzg4NiAxLjA2MzMtMy4xNjA3IDIuMzgzMy01LjMyNCAyLjQyNzMtMi4xNjM0LjA0MDMtNi41MTk0LTEuNDMtNy4xNzItMS44ODQ3LS42NTY0LS40NTEtMS41MjU0LTEuNTE0My0xLjM0NTctMi42MTh6IiBmaWxsPSIjZmRkMjBhIi8+PHBhdGggZD0ibTI4Ljg4MjUgMzEuODM4NmMtLjc3NzMtLjE3MjQtNC4zMTIgMi41MDA2LTQuMzEyIDIuNTAwNmguMDAzN2wtLjE2NSAyLjA1MzRzNC4wNDA2IDEuNjUzNiA0LjczIDEuMzk3Yy42ODkzLS4yNjQuNTE3LTUuNzc1LS4yNTY3LTUuOTUxem0tMTEuNTQ2MyAxLjAzNGMuMDg0My0xLjExODQgNS4yNTQzIDEuNjQyNiA1LjI1NDMgMS42NDI2bC4wMDM3LS4wMDM2LjI1NjYgMi4xNTZzLTQuMzA4MyAyLjU4MTMtNC45MTMzIDIuMjM2NmMtLjYwMTMtLjM0NDYtLjY4OTMtNC45MDk2LS42MDEzLTYuMDMxNnoiIGZpbGw9IiM2NWJjNDYiLz48cGF0aCBkPSJtMjEuMzQgMzQuODA0OWMwIDEuODA3Ny0uMjYwNCAyLjU4NS41MTMzIDIuNzU3NC43NzczLjE3MjMgMi4yNDAzIDAgMi43NjEtLjM0NDcuNTEzMy0uMzQ0Ny4wODQzLTIuNjY5My0uMDg4LTMuMTAycy0zLjE5LS4wODgtMy4xOS42ODkzeiIgZmlsbD0iIzQzYTI0NCIvPjxwYXRoIGQ9Im0yMS42NzAxIDM0LjQwNTFjMCAxLjgwNzYtLjI2MDQgMi41ODEzLjUxMzMgMi43NTM2Ljc3MzcuMTc2IDIuMjM2NyAwIDIuNzU3My0uMzQ0Ni41MTctLjM0NDcuMDg4LTIuNjY5NC0uMDg0My0zLjEwMi0uMTcyMy0uNDMyNy0zLjE5LS4wODQ0LTMuMTkuNjg5M3oiIGZpbGw9IiM2NWJjNDYiLz48cGF0aCBkPSJtMjIuMDAwMiA0MC40NDgxYzEwLjE4ODUgMCAxOC40NDc5LTguMjU5NCAxOC40NDc5LTE4LjQ0NzlzLTguMjU5NC0xOC40NDc5NS0xOC40NDc5LTE4LjQ0Nzk1LTE4LjQ0Nzk1IDguMjU5NDUtMTguNDQ3OTUgMTguNDQ3OTUgOC4yNTk0NSAxOC40NDc5IDE4LjQ0Nzk1IDE4LjQ0Nzl6bTAgMS43MTg3YzExLjEzNzcgMCAyMC4xNjY2LTkuMDI4OSAyMC4xNjY2LTIwLjE2NjYgMC0xMS4xMzc4LTkuMDI4OS0yMC4xNjY3LTIwLjE2NjYtMjAuMTY2Ny0xMS4xMzc4IDAtMjAuMTY2NyA5LjAyODktMjAuMTY2NyAyMC4xNjY3IDAgMTEuMTM3NyA5LjAyODkgMjAuMTY2NiAyMC4xNjY3IDIwLjE2NjZ6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==';
module.exports = {
  daxBase64
};

},{}],9:[function(require,module,exports){
"use strict";

const EMAIL_SELECTOR = "\n    input:not([type])[name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n    input[type=\"\"][name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n    input[type=text][name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n    input:not([type])[id*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n    input:not([type])[placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n    input[type=\"\"][id*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n    input[type=text][placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n    input[type=\"\"][placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n    input:not([type])[placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n    input[type=email]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n    input[type=text][aria-label*=mail i],\n    input:not([type])[aria-label*=mail i],\n    input[type=text][placeholder*=mail i]:not([readonly]),\n    input[autocomplete=email]:not([readonly]):not([hidden]):not([disabled])\n"; // We've seen non-standard types like 'user'. This selector should get them, too

const GENERIC_TEXT_FIELD = "\ninput:not([type=button],\n[type=checkbox],\n[type=color],\n[type=date],\n[type=datetime-local],\n[type=datetime],\n[type=file],\n[type=hidden],\n[type=month],\n[type=number],\n[type=radio],\n[type=range],\n[type=reset],\n[type=search],\n[type=submit],\n[type=tel],\n[type=time],\n[type=url],\n[type=week])";
const PASSWORD_SELECTOR = "input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code])"; // This is more generic, used only when we have identified a form

const USERNAME_SELECTOR = "".concat(GENERIC_TEXT_FIELD, "[autocomplete^=user]");
const CC_NAME_SELECTOR = "\n[autocomplete=\"cc-name\"],\n[autocomplete=\"ccname\"],\n[name=\"ccname\"],\n[name=\"cc-name\"],\n[name=\"ppw-accountHolderName\"]";
const CC_NUMBER_SELECTOR = "\n[autocomplete=\"cc-number\"],\n[autocomplete=\"ccnumber\"],\n[autocomplete=\"cardnumber\"],\n[autocomplete=\"card-number\"],\n[name=\"ccnumber\"],\n[name=\"cc-number\"],\n[name=\"cardnumber\"],\n[name=\"card-number\"],\n[name=\"creditCardNumber\"],\n[name=\"addCreditCardNumber\"]";
const CC_CVC_SELECTOR = "\n[autocomplete=\"cc-csc\"],\n[autocomplete=\"csc\"],\n[autocomplete=\"cc-cvc\"],\n[autocomplete=\"cvc\"],\n[name=\"cvc\"],\n[name=\"cc-cvc\"],\n[name=\"cc-csc\"],\n[name=\"csc\"],\n[name=\"securityCode\"]";
const CC_MONTH_SELECTOR = "\n[autocomplete=\"cc-exp-month\"],\n[name=\"ccmonth\"],\n[name=\"ppw-expirationDate_month\"]";
const CC_YEAR_SELECTOR = "\n[autocomplete=\"cc-exp-year\"],\n[name=\"ccyear\"],\n[name=\"ppw-expirationDate_year\"]";
const CC_EXP_SELECTOR = "\n[autocomplete=\"cc-exp\"],\n[name=\"exp-date\"],\n[name=\"expirationDate\"]";
/* This is used to map a selector with the data type we store for credit cards */

const CC_SELECTORS_MAP = {
  [CC_NAME_SELECTOR]: {
    ccType: 'cardName',
    regex: /(card.*name|name.*card)|(card.*holder|holder.*card)|(card.*owner|owner.*card)/i
  },
  [CC_NUMBER_SELECTOR]: {
    ccType: 'cardNumber',
    regex: /card.*number|number.*card/i
  },
  [CC_CVC_SELECTOR]: {
    ccType: 'cardSecurityCode',
    regex: /security.?code|cvv|csc|cvc/i
  },
  [CC_MONTH_SELECTOR]: {
    ccType: 'expirationMonth',
    regex: /(card|cc)?.?(exp(iry|iration)?)?.?(mo(nth)?|mm)/i
  },
  [CC_YEAR_SELECTOR]: {
    ccType: 'expirationYear',
    regex: /(card|cc)?.?(exp(iry|iration)?)?.?(ye(ar)?|yy)/i
  },
  [CC_EXP_SELECTOR]: {
    ccType: 'expiration',
    regex: /exp(iry|iration)?/i
  }
};
const CC_FIELD_SELECTOR = Object.keys(CC_SELECTORS_MAP).join(', ');
const FIELD_SELECTOR = [PASSWORD_SELECTOR, GENERIC_TEXT_FIELD, EMAIL_SELECTOR, CC_FIELD_SELECTOR].join(', ');
const SUBMIT_BUTTON_SELECTOR = 'input[type=submit], input[type=button], button, [role=button]';
module.exports = {
  EMAIL_SELECTOR,
  GENERIC_TEXT_FIELD,
  PASSWORD_SELECTOR,
  CC_NAME_SELECTOR,
  CC_NUMBER_SELECTOR,
  CC_CVC_SELECTOR,
  CC_MONTH_SELECTOR,
  CC_YEAR_SELECTOR,
  CC_EXP_SELECTOR,
  CC_SELECTORS_MAP,
  CC_FIELD_SELECTOR,
  FIELD_SELECTOR,
  USERNAME_SELECTOR,
  SUBMIT_BUTTON_SELECTOR
};

},{}],10:[function(require,module,exports){
"use strict";

const {
  isApp,
  escapeXML
} = require('../autofill-utils');

const Tooltip = require('./Tooltip');

const getInputConfig = require('../Form/inputTypeConfig');

class DataAutofill extends Tooltip {
  constructor(input, associatedForm, Interface) {
    super(input, associatedForm, Interface);
    const config = getInputConfig(input);
    this.data = this.interface["getLocal".concat(config.dataType)]();
    const includeStyles = isApp ? "<style>".concat(require('./styles/autofill-tooltip-styles.js'), "</style>") : "<link rel=\"stylesheet\" href=\"".concat(chrome.runtime.getURL('public/css/autofill.css'), "\" crossorigin=\"anonymous\">");
    this.shadow.innerHTML = "\n".concat(includeStyles, "\n<div class=\"wrapper wrapper--data\">\n    <div class=\"tooltip tooltip--data\" hidden>\n        ").concat(this.data.map(singleData => "\n            <button\n                class=\"tooltip__button tooltip__button--data tooltip__button--data--".concat(config.type, " js-autofill-button\"\n                id=\"").concat(singleData.id, "\"\n            >\n                <span>\n                    <span>").concat(escapeXML(singleData[config.displayTitlePropName]), "</span><br />\n                    <span class=\"tooltip__button__secondary-text\">\n").concat(escapeXML(singleData[config.displaySubtitlePropName] || config.displaySubtitlePropName), "\n                    </span>\n                </span>\n            </button>\n        ")).join(''), "\n    </div>\n</div>");
    this.wrapper = this.shadow.querySelector('.wrapper');
    this.tooltip = this.shadow.querySelector('.tooltip');
    this.autofillButtons = this.shadow.querySelectorAll('.js-autofill-button');
    this.autofillButtons.forEach(btn => {
      this.registerClickableButton(btn, () => {
        this.interface["".concat(config.autofillMethod)](btn.id).then(({
          success,
          error
        }) => {
          if (success) this.associatedForm.autofillData(success, config.type);
        });
      });
    });
    this.init();
  }

}

module.exports = DataAutofill;

},{"../Form/inputTypeConfig":6,"../autofill-utils":17,"./Tooltip":12,"./styles/autofill-tooltip-styles.js":14}],11:[function(require,module,exports){
"use strict";

const {
  isApp,
  formatAddress,
  escapeXML
} = require('../autofill-utils');

const Tooltip = require('./Tooltip');

class EmailAutofill extends Tooltip {
  constructor(input, associatedForm, Interface) {
    super(input, associatedForm, Interface);
    this.addresses = this.interface.getLocalAddresses();
    const includeStyles = isApp ? "<style>".concat(require('./styles/autofill-tooltip-styles.js'), "</style>") : "<link rel=\"stylesheet\" href=\"".concat(chrome.runtime.getURL('public/css/autofill.css'), "\" crossorigin=\"anonymous\">");
    this.shadow.innerHTML = "\n".concat(includeStyles, "\n<div class=\"wrapper wrapper--email\">\n    <div class=\"tooltip tooltip--email\" hidden>\n        <button class=\"tooltip__button tooltip__button--email js-use-personal\">\n            <span class=\"tooltip__button--email__primary-text\">\n                Use <span class=\"js-address\">").concat(formatAddress(escapeXML(this.addresses.personalAddress)), "</span>\n            </span>\n            <span class=\"tooltip__button--email__secondary-text\">Blocks email trackers</span>\n        </button>\n        <button class=\"tooltip__button tooltip__button--email js-use-private\">\n            <span class=\"tooltip__button--email__primary-text\">Use a Private Address</span>\n            <span class=\"tooltip__button--email__secondary-text\">Blocks email trackers and hides your address</span>\n        </button>\n    </div>\n</div>");
    this.wrapper = this.shadow.querySelector('.wrapper');
    this.tooltip = this.shadow.querySelector('.tooltip');
    this.usePersonalButton = this.shadow.querySelector('.js-use-personal');
    this.usePrivateButton = this.shadow.querySelector('.js-use-private');
    this.addressEl = this.shadow.querySelector('.js-address');

    this.updateAddresses = addresses => {
      if (addresses) {
        this.addresses = addresses;
        this.addressEl.textContent = formatAddress(addresses.personalAddress);
      }
    };

    this.registerClickableButton(this.usePersonalButton, () => {
      this.associatedForm.autofillEmail(formatAddress(this.addresses.personalAddress));
    });
    this.registerClickableButton(this.usePrivateButton, () => {
      this.associatedForm.autofillEmail(formatAddress(this.addresses.privateAddress));
      this.interface.refreshAlias();
    }); // Get the alias from the extension

    this.interface.getAddresses().then(this.updateAddresses);
    this.init();
  }

}

module.exports = EmailAutofill;

},{"../autofill-utils":17,"./Tooltip":12,"./styles/autofill-tooltip-styles.js":14}],12:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  safeExecute,
  addInlineStyles
} = require('../autofill-utils');

const {
  getDaxBoundingBox
} = require('../autofill-utils');

const {
  getInputMainType
} = require('../Form/input-classifiers');

const updatePosition = function ({
  left,
  top
}) {
  const shadow = this.shadow; // If the stylesheet is not loaded wait for load (Chrome bug)

  if (!shadow.styleSheets.length) return this.stylesheet.addEventListener('load', this.checkPosition);
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

const checkPosition = function () {
  if (this.animationFrame) {
    window.cancelAnimationFrame(this.animationFrame);
  }

  this.animationFrame = window.requestAnimationFrame(() => {
    const {
      left,
      bottom
    } = getInputMainType(this.input) === 'emailNew' ? getDaxBoundingBox(this.input) : this.input.getBoundingClientRect();

    if (left !== this.left || bottom !== this.top) {
      this.updatePosition({
        left,
        top: bottom
      });
    }

    this.animationFrame = null;
  });
};

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
  constructor(input, associatedForm, Interface) {
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
    const forcedVisibilityStyles = {
      'display': 'block',
      'visibility': 'visible',
      'opacity': '1'
    };
    addInlineStyles(this.host, forcedVisibilityStyles);
    this.input = input;
    this.associatedForm = associatedForm;
    this.interface = Interface;
  }

  append() {
    document.body.appendChild(this.host);
  }

  remove() {
    window.removeEventListener('scroll', this.checkPosition, {
      passive: true,
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

  unsetActiveButton(e) {
    this.activeButton = null;
  }

  registerClickableButton(btn, handler) {
    this.clickableButtons.set(btn, handler); // Needed because clicks within the shadow dom don't provide this info to the outside

    btn.addEventListener('mouseenter', e => this.setActiveButton(e));
    btn.addEventListener('mouseleave', e => this.unsetActiveButton(e));
  }

  dispatchClick() {
    const handler = this.clickableButtons.get(this.activeButton);

    if (handler) {
      safeExecute(this.activeButton, handler);
    }
  }

  init() {
    this.animationFrame = null;
    this.top = 0;
    this.left = 0;
    this.transformRuleIndex = null;
    this.stylesheet = this.shadow.querySelector('link, style'); // Un-hide once the style is loaded, to avoid flashing unstyled content

    this.stylesheet.addEventListener('load', () => this.tooltip.removeAttribute('hidden'));
    this.append();
    this.resObs.observe(document.body);
    this.mutObs.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    window.addEventListener('scroll', this.checkPosition, {
      passive: true,
      capture: true
    });
  }

}

module.exports = Tooltip;

},{"../Form/input-classifiers":4,"../autofill-utils":17}],13:[function(require,module,exports){
"use strict";

const ddgPasswordIconBase = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tYmFzZTwvdGl0bGU+CiAgICA8ZyBpZD0iZGRnLXBhc3N3b3JkLWljb24tYmFzZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IlVuaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjMzMzMsMi42NjY2NyBDMTAuMjI4OCwyLjY2NjY3IDkuMzMzMzMsMy41NjIxIDkuMzMzMzMsNC42NjY2NyBDOS4zMzMzMyw1Ljc3MTI0IDEwLjIyODgsNi42NjY2NyAxMS4zMzMzLDYuNjY2NjcgQzEyLjQzNzksNi42NjY2NyAxMy4zMzMzLDUuNzcxMjQgMTMuMzMzMyw0LjY2NjY3IEMxMy4zMzMzLDMuNTYyMSAxMi40Mzc5LDIuNjY2NjcgMTEuMzMzMywyLjY2NjY3IFogTTEwLjY2NjcsNC42NjY2NyBDMTAuNjY2Nyw0LjI5ODQ4IDEwLjk2NTEsNCAxMS4zMzMzLDQgQzExLjcwMTUsNCAxMiw0LjI5ODQ4IDEyLDQuNjY2NjcgQzEyLDUuMDM0ODYgMTEuNzAxNSw1LjMzMzMzIDExLjMzMzMsNS4zMzMzMyBDMTAuOTY1MSw1LjMzMzMzIDEwLjY2NjcsNS4wMzQ4NiAxMC42NjY3LDQuNjY2NjcgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC42NjY3LDAgQzcuNzIxMTUsMCA1LjMzMzMzLDIuMzg3ODEgNS4zMzMzMyw1LjMzMzMzIEM1LjMzMzMzLDUuNzYxMTkgNS4zODM4NSw2LjE3Nzk4IDUuNDc5NDUsNi41Nzc3NSBMMC4xOTUyNjIsMTEuODYxOSBDMC4wNzAyMzc5LDExLjk4NyAwLDEyLjE1NjUgMCwxMi4zMzMzIEwwLDE1LjMzMzMgQzAsMTUuNzAxNSAwLjI5ODQ3NywxNiAwLjY2NjY2NywxNiBMMy4zMzMzMywxNiBDNC4wNjk3MSwxNiA0LjY2NjY3LDE1LjQwMyA0LjY2NjY3LDE0LjY2NjcgTDQuNjY2NjcsMTQgTDUuMzMzMzMsMTQgQzYuMDY5NzEsMTQgNi42NjY2NywxMy40MDMgNi42NjY2NywxMi42NjY3IEw2LjY2NjY3LDExLjMzMzMgTDgsMTEuMzMzMyBDOC4xNzY4MSwxMS4zMzMzIDguMzQ2MzgsMTEuMjYzMSA4LjQ3MTQxLDExLjEzODEgTDkuMTU5MDYsMTAuNDUwNCBDOS42Mzc3MiwxMC41OTEyIDEwLjE0MzksMTAuNjY2NyAxMC42NjY3LDEwLjY2NjcgQzEzLjYxMjIsMTAuNjY2NyAxNiw4LjI3ODg1IDE2LDUuMzMzMzMgQzE2LDIuMzg3ODEgMTMuNjEyMiwwIDEwLjY2NjcsMCBaIE02LjY2NjY3LDUuMzMzMzMgQzYuNjY2NjcsMy4xMjQxOSA4LjQ1NzUzLDEuMzMzMzMgMTAuNjY2NywxLjMzMzMzIEMxMi44NzU4LDEuMzMzMzMgMTQuNjY2NywzLjEyNDE5IDE0LjY2NjcsNS4zMzMzMyBDMTQuNjY2Nyw3LjU0MjQ3IDEyLjg3NTgsOS4zMzMzMyAxMC42NjY3LDkuMzMzMzMgQzEwLjE1NTgsOS4zMzMzMyA5LjY2ODg2LDkuMjM3OSA5LjIyMTUyLDkuMDY0NSBDOC45NzUyOCw4Ljk2OTA1IDguNjk1OTEsOS4wMjc5NSA4LjUwOTE2LDkuMjE0NjkgTDcuNzIzODYsMTAgTDYsMTAgQzUuNjMxODEsMTAgNS4zMzMzMywxMC4yOTg1IDUuMzMzMzMsMTAuNjY2NyBMNS4zMzMzMywxMi42NjY3IEw0LDEyLjY2NjcgQzMuNjMxODEsMTIuNjY2NyAzLjMzMzMzLDEyLjk2NTEgMy4zMzMzMywxMy4zMzMzIEwzLjMzMzMzLDE0LjY2NjcgTDEuMzMzMzMsMTQuNjY2NyBMMS4zMzMzMywxMi42MDk1IEw2LjY5Nzg3LDcuMjQ0OTQgQzYuODc1MDIsNy4wNjc3OSA2LjkzNzksNi44MDYyOSA2Ljg2MDY1LDYuNTY3OTggQzYuNzM0ODksNi4xNzk5NyA2LjY2NjY3LDUuNzY1MjcgNi42NjY2Nyw1LjMzMzMzIFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';
const ddgPasswordIconBaseWhite = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tYmFzZS13aGl0ZTwvdGl0bGU+CiAgICA8ZyBpZD0iZGRnLXBhc3N3b3JkLWljb24tYmFzZS13aGl0ZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IlVuaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjMzMzMsMi42NjY2NyBDMTAuMjI4OCwyLjY2NjY3IDkuMzMzMzMsMy41NjIxIDkuMzMzMzMsNC42NjY2NyBDOS4zMzMzMyw1Ljc3MTI0IDEwLjIyODgsNi42NjY2NyAxMS4zMzMzLDYuNjY2NjcgQzEyLjQzNzksNi42NjY2NyAxMy4zMzMzLDUuNzcxMjQgMTMuMzMzMyw0LjY2NjY3IEMxMy4zMzMzLDMuNTYyMSAxMi40Mzc5LDIuNjY2NjcgMTEuMzMzMywyLjY2NjY3IFogTTEwLjY2NjcsNC42NjY2NyBDMTAuNjY2Nyw0LjI5ODQ4IDEwLjk2NTEsNCAxMS4zMzMzLDQgQzExLjcwMTUsNCAxMiw0LjI5ODQ4IDEyLDQuNjY2NjcgQzEyLDUuMDM0ODYgMTEuNzAxNSw1LjMzMzMzIDExLjMzMzMsNS4zMzMzMyBDMTAuOTY1MSw1LjMzMzMzIDEwLjY2NjcsNS4wMzQ4NiAxMC42NjY3LDQuNjY2NjcgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC42NjY3LDAgQzcuNzIxMTUsMCA1LjMzMzMzLDIuMzg3ODEgNS4zMzMzMyw1LjMzMzMzIEM1LjMzMzMzLDUuNzYxMTkgNS4zODM4NSw2LjE3Nzk4IDUuNDc5NDUsNi41Nzc3NSBMMC4xOTUyNjIsMTEuODYxOSBDMC4wNzAyMzc5LDExLjk4NyAwLDEyLjE1NjUgMCwxMi4zMzMzIEwwLDE1LjMzMzMgQzAsMTUuNzAxNSAwLjI5ODQ3NywxNiAwLjY2NjY2NywxNiBMMy4zMzMzMywxNiBDNC4wNjk3MSwxNiA0LjY2NjY3LDE1LjQwMyA0LjY2NjY3LDE0LjY2NjcgTDQuNjY2NjcsMTQgTDUuMzMzMzMsMTQgQzYuMDY5NzEsMTQgNi42NjY2NywxMy40MDMgNi42NjY2NywxMi42NjY3IEw2LjY2NjY3LDExLjMzMzMgTDgsMTEuMzMzMyBDOC4xNzY4MSwxMS4zMzMzIDguMzQ2MzgsMTEuMjYzMSA4LjQ3MTQxLDExLjEzODEgTDkuMTU5MDYsMTAuNDUwNCBDOS42Mzc3MiwxMC41OTEyIDEwLjE0MzksMTAuNjY2NyAxMC42NjY3LDEwLjY2NjcgQzEzLjYxMjIsMTAuNjY2NyAxNiw4LjI3ODg1IDE2LDUuMzMzMzMgQzE2LDIuMzg3ODEgMTMuNjEyMiwwIDEwLjY2NjcsMCBaIE02LjY2NjY3LDUuMzMzMzMgQzYuNjY2NjcsMy4xMjQxOSA4LjQ1NzUzLDEuMzMzMzMgMTAuNjY2NywxLjMzMzMzIEMxMi44NzU4LDEuMzMzMzMgMTQuNjY2NywzLjEyNDE5IDE0LjY2NjcsNS4zMzMzMyBDMTQuNjY2Nyw3LjU0MjQ3IDEyLjg3NTgsOS4zMzMzMyAxMC42NjY3LDkuMzMzMzMgQzEwLjE1NTgsOS4zMzMzMyA5LjY2ODg2LDkuMjM3OSA5LjIyMTUyLDkuMDY0NSBDOC45NzUyOCw4Ljk2OTA1IDguNjk1OTEsOS4wMjc5NSA4LjUwOTE2LDkuMjE0NjkgTDcuNzIzODYsMTAgTDYsMTAgQzUuNjMxODEsMTAgNS4zMzMzMywxMC4yOTg1IDUuMzMzMzMsMTAuNjY2NyBMNS4zMzMzMywxMi42NjY3IEw0LDEyLjY2NjcgQzMuNjMxODEsMTIuNjY2NyAzLjMzMzMzLDEyLjk2NTEgMy4zMzMzMywxMy4zMzMzIEwzLjMzMzMzLDE0LjY2NjcgTDEuMzMzMzMsMTQuNjY2NyBMMS4zMzMzMywxMi42MDk1IEw2LjY5Nzg3LDcuMjQ0OTQgQzYuODc1MDIsNy4wNjc3OSA2LjkzNzksNi44MDYyOSA2Ljg2MDY1LDYuNTY3OTggQzYuNzM0ODksNi4xNzk5NyA2LjY2NjY3LDUuNzY1MjcgNi42NjY2Nyw1LjMzMzMzIFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';
const ddgPasswordIconFilled = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tZmlsbGVkPC90aXRsZT4KICAgIDxnIGlkPSJkZGctcGFzc3dvcmQtaWNvbi1maWxsZWQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTaGFwZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC4wMDAwMDAsIDQuMDAwMDAwKSIgZmlsbD0iIzc2NDMxMCI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS4yNSwyLjc1IEMxMC4xNDU0LDIuNzUgOS4yNSwzLjY0NTQzIDkuMjUsNC43NSBDOS4yNSw1Ljg1NDU3IDEwLjE0NTQsNi43NSAxMS4yNSw2Ljc1IEMxMi4zNTQ2LDYuNzUgMTMuMjUsNS44NTQ1NyAxMy4yNSw0Ljc1IEMxMy4yNSwzLjY0NTQzIDEyLjM1NDYsMi43NSAxMS4yNSwyLjc1IFogTTEwLjc1LDQuNzUgQzEwLjc1LDQuNDczODYgMTAuOTczOSw0LjI1IDExLjI1LDQuMjUgQzExLjUyNjEsNC4yNSAxMS43NSw0LjQ3Mzg2IDExLjc1LDQuNzUgQzExLjc1LDUuMDI2MTQgMTEuNTI2MSw1LjI1IDExLjI1LDUuMjUgQzEwLjk3MzksNS4yNSAxMC43NSw1LjAyNjE0IDEwLjc1LDQuNzUgWiI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNMTAuNjI1LDAgQzcuNjU2NDcsMCA1LjI1LDIuNDA2NDcgNS4yNSw1LjM3NSBDNS4yNSw1Ljc4MDk4IDUuMjk1MTQsNi4xNzcxNCA1LjM4MDg4LDYuNTU4NDYgTDAuMjE5NjcsMTEuNzE5NyBDMC4wNzkwMTc2LDExLjg2MDMgMCwxMi4wNTExIDAsMTIuMjUgTDAsMTUuMjUgQzAsMTUuNjY0MiAwLjMzNTc4NiwxNiAwLjc1LDE2IEwzLjc0NjYxLDE2IEM0LjMwMDc2LDE2IDQuNzUsMTUuNTUwOCA0Ljc1LDE0Ljk5NjYgTDQuNzUsMTQgTDUuNzQ2NjEsMTQgQzYuMzAwNzYsMTQgNi43NSwxMy41NTA4IDYuNzUsMTIuOTk2NiBMNi43NSwxMS41IEw4LDExLjUgQzguMTk4OTEsMTEuNSA4LjM4OTY4LDExLjQyMSA4LjUzMDMzLDExLjI4MDMgTDkuMjQwNzgsMTAuNTY5OSBDOS42ODMwNCwxMC42ODc1IDEwLjE0NzIsMTAuNzUgMTAuNjI1LDEwLjc1IEMxMy41OTM1LDEwLjc1IDE2LDguMzQzNTMgMTYsNS4zNzUgQzE2LDIuNDA2NDcgMTMuNTkzNSwwIDEwLjYyNSwwIFogTTYuNzUsNS4zNzUgQzYuNzUsMy4yMzQ5IDguNDg0OSwxLjUgMTAuNjI1LDEuNSBDMTIuNzY1MSwxLjUgMTQuNSwzLjIzNDkgMTQuNSw1LjM3NSBDMTQuNSw3LjUxNTEgMTIuNzY1MSw5LjI1IDEwLjYyNSw5LjI1IEMxMC4xNTQ1LDkuMjUgOS43MDUyOCw5LjE2NjUgOS4yOTAxMSw5LjAxNDE2IEM5LjAxNTgxLDguOTEzNSA4LjcwODAzLDguOTgxMzEgOC41MDE0Miw5LjE4NzkyIEw3LjY4OTM0LDEwIEw2LDEwIEM1LjU4NTc5LDEwIDUuMjUsMTAuMzM1OCA1LjI1LDEwLjc1IEw1LjI1LDEyLjUgTDQsMTIuNSBDMy41ODU3OSwxMi41IDMuMjUsMTIuODM1OCAzLjI1LDEzLjI1IEwzLjI1LDE0LjUgTDEuNSwxNC41IEwxLjUsMTIuNTYwNyBMNi43NDgyNiw3LjMxMjQgQzYuOTQ2NjYsNy4xMTQgNy4wMTc3Myw2LjgyMTQ1IDYuOTMyNDUsNi41NTQxMyBDNi44MTQxNSw2LjE4MzI3IDYuNzUsNS43ODczNSA2Ljc1LDUuMzc1IFoiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';
const ddgPasswordIconFocused = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tZm9jdXNlZDwvdGl0bGU+CiAgICA8ZyBpZD0iZGRnLXBhc3N3b3JkLWljb24tZm9jdXNlZCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ikljb24tQ29udGFpbmVyIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZSIgZmlsbC1vcGFjaXR5PSIwLjEiIGZpbGwtcnVsZT0ibm9uemVybyIgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iMTIiPjwvcmVjdD4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC4wMDAwMDApIiBmaWxsLW9wYWNpdHk9IjAuOSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEuMjUsMi43NSBDMTAuMTQ1NCwyLjc1IDkuMjUsMy42NDU0MyA5LjI1LDQuNzUgQzkuMjUsNS44NTQ1NyAxMC4xNDU0LDYuNzUgMTEuMjUsNi43NSBDMTIuMzU0Niw2Ljc1IDEzLjI1LDUuODU0NTcgMTMuMjUsNC43NSBDMTMuMjUsMy42NDU0MyAxMi4zNTQ2LDIuNzUgMTEuMjUsMi43NSBaIE0xMC43NSw0Ljc1IEMxMC43NSw0LjQ3Mzg2IDEwLjk3MzksNC4yNSAxMS4yNSw0LjI1IEMxMS41MjYxLDQuMjUgMTEuNzUsNC40NzM4NiAxMS43NSw0Ljc1IEMxMS43NSw1LjAyNjE0IDExLjUyNjEsNS4yNSAxMS4yNSw1LjI1IEMxMC45NzM5LDUuMjUgMTAuNzUsNS4wMjYxNCAxMC43NSw0Ljc1IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwLjYyNSwwIEM3LjY1NjUsMCA1LjI1LDIuNDA2NDcgNS4yNSw1LjM3NSBDNS4yNSw1Ljc4MDk4IDUuMjk1MTQsNi4xNzcxIDUuMzgwODgsNi41NTg1IEwwLjIxOTY3LDExLjcxOTcgQzAuMDc5MDIsMTEuODYwMyAwLDEyLjA1MTEgMCwxMi4yNSBMMCwxNS4yNSBDMCwxNS42NjQyIDAuMzM1NzksMTYgMC43NSwxNiBMMy43NDY2MSwxNiBDNC4zMDA3NiwxNiA0Ljc1LDE1LjU1MDggNC43NSwxNC45OTY2IEw0Ljc1LDE0IEw1Ljc0NjYxLDE0IEM2LjMwMDgsMTQgNi43NSwxMy41NTA4IDYuNzUsMTIuOTk2NiBMNi43NSwxMS41IEw4LDExLjUgQzguMTk4OSwxMS41IDguMzg5NywxMS40MjEgOC41MzAzLDExLjI4MDMgTDkuMjQwOCwxMC41Njk5IEM5LjY4MywxMC42ODc1IDEwLjE0NzIsMTAuNzUgMTAuNjI1LDEwLjc1IEMxMy41OTM1LDEwLjc1IDE2LDguMzQzNSAxNiw1LjM3NSBDMTYsMi40MDY0NyAxMy41OTM1LDAgMTAuNjI1LDAgWiBNNi43NSw1LjM3NSBDNi43NSwzLjIzNDkgOC40ODQ5LDEuNSAxMC42MjUsMS41IEMxMi43NjUxLDEuNSAxNC41LDMuMjM0OSAxNC41LDUuMzc1IEMxNC41LDcuNTE1MSAxMi43NjUxLDkuMjUgMTAuNjI1LDkuMjUgQzEwLjE1NDUsOS4yNSA5LjcwNTMsOS4xNjY1IDkuMjkwMSw5LjAxNDIgQzkuMDE1OCw4LjkxMzUgOC43MDgsOC45ODEzIDguNTAxNCw5LjE4NzkgTDcuNjg5MywxMCBMNiwxMCBDNS41ODU3OSwxMCA1LjI1LDEwLjMzNTggNS4yNSwxMC43NSBMNS4yNSwxMi41IEw0LDEyLjUgQzMuNTg1NzksMTIuNSAzLjI1LDEyLjgzNTggMy4yNSwxMy4yNSBMMy4yNSwxNC41IEwxLjUsMTQuNSBMMS41LDEyLjU2MDcgTDYuNzQ4Myw3LjMxMjQgQzYuOTQ2Nyw3LjExNCA3LjAxNzcsNi44MjE0IDYuOTMyNSw2LjU1NDEgQzYuODE0MSw2LjE4MzMgNi43NSw1Ljc4NzM1IDYuNzUsNS4zNzUgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';
const ddgCcIconBase = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBkPSJNNSA5Yy0uNTUyIDAtMSAuNDQ4LTEgMXYyYzAgLjU1Mi40NDggMSAxIDFoM2MuNTUyIDAgMS0uNDQ4IDEtMXYtMmMwLS41NTItLjQ0OC0xLTEtMUg1eiIgZmlsbD0iIzAwMCIvPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDZjMC0yLjIxIDEuNzktNCA0LTRoMTRjMi4yMSAwIDQgMS43OSA0IDR2MTJjMCAyLjIxLTEuNzkgNC00IDRINWMtMi4yMSAwLTQtMS43OS00LTRWNnptNC0yYy0xLjEwNSAwLTIgLjg5NS0yIDJ2OWgxOFY2YzAtMS4xMDUtLjg5NS0yLTItMkg1em0wIDE2Yy0xLjEwNSAwLTItLjg5NS0yLTJoMThjMCAxLjEwNS0uODk1IDItMiAySDV6IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPgo=';
const ddgCcIconFilled = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBkPSJNNSA5Yy0uNTUyIDAtMSAuNDQ4LTEgMXYyYzAgLjU1Mi40NDggMSAxIDFoM2MuNTUyIDAgMS0uNDQ4IDEtMXYtMmMwLS41NTItLjQ0OC0xLTEtMUg1eiIgZmlsbD0iIzc2NDMxMCIvPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDZjMC0yLjIxIDEuNzktNCA0LTRoMTRjMi4yMSAwIDQgMS43OSA0IDR2MTJjMCAyLjIxLTEuNzkgNC00IDRINWMtMi4yMSAwLTQtMS43OS00LTRWNnptNC0yYy0xLjEwNSAwLTIgLjg5NS0yIDJ2OWgxOFY2YzAtMS4xMDUtLjg5NS0yLTItMkg1em0wIDE2Yy0xLjEwNSAwLTItLjg5NS0yLTJoMThjMCAxLjEwNS0uODk1IDItMiAySDV6IiBmaWxsPSIjNzY0MzEwIi8+Cjwvc3ZnPgo=';
module.exports = {
  ddgPasswordIconBase,
  ddgPasswordIconBaseWhite,
  ddgPasswordIconFilled,
  ddgPasswordIconFocused,
  ddgCcIconBase,
  ddgCcIconFilled
};

},{}],14:[function(require,module,exports){
"use strict";

module.exports = "\n.wrapper *, .wrapper *::before, .wrapper *::after {\n    box-sizing: border-box;\n}\n.wrapper {\n    position: fixed;\n    top: 0;\n    left: 0;\n    padding: 0;\n    font-family: 'DDG_ProximaNova', 'Proxima Nova', -apple-system,\n    BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',\n    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n    -webkit-font-smoothing: antialiased;\n    /* move it offscreen to avoid flashing */\n    transform: translate(-1000px);\n    z-index: 2147483647;\n}\n.wrapper--data {\n    font-family: 'SF Pro Text', -apple-system,\n    BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',\n    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n}\n.tooltip {\n    position: absolute;\n    width: 300px;\n    max-width: calc(100vw - 25px);\n    z-index: 2147483647;\n}\n.tooltip--data {\n    top: 100%;\n    left: 100%;\n    padding: 4px;\n    border: 0.5px solid rgba(0, 0, 0, 0.2);\n    border-radius: 6px;\n    background-color: rgba(242, 240, 240, 0.9);\n    -webkit-backdrop-filter: blur(40px);\n    backdrop-filter: blur(40px);\n    font-size: 13px;\n    line-height: 15px;\n    color: #222222;\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.32);\n}\n.tooltip--email {\n    top: calc(100% + 6px);\n    right: calc(100% - 46px);\n    padding: 8px;\n    border: 1px solid #D0D0D0;\n    border-radius: 10px;\n    background-color: #FFFFFF;\n    font-size: 14px;\n    line-height: 1.3;\n    color: #333333;\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);\n}\n.tooltip--email::before,\n.tooltip--email::after {\n    content: \"\";\n    width: 0;\n    height: 0;\n    border-left: 10px solid transparent;\n    border-right: 10px solid transparent;\n    display: block;\n    border-bottom: 8px solid #D0D0D0;\n    position: absolute;\n    right: 20px;\n}\n.tooltip--email::before {\n    border-bottom-color: #D0D0D0;\n    top: -9px;\n}\n.tooltip--email::after {\n    border-bottom-color: #FFFFFF;\n    top: -8px;\n}\n\n/* Buttons */\n.tooltip__button {\n    display: flex;\n    width: 100%;\n    padding: 4px 8px 7px;\n    font-family: inherit;\n    background: transparent;\n    border: none;\n    border-radius: 6px;\n}\n.tooltip__button:hover {\n    background-color: rgba(0, 121, 242, 0.8);\n    color: #FFFFFF;\n}\n\n/* Data autofill tooltip specific */\n.tooltip__button--data {\n    min-height: 48px;\n    flex-direction: row;\n    justify-content: flex-start;\n    align-items: center;\n    font-size: inherit;\n    font-weight: 500;\n    text-align: left;\n    letter-spacing: -0.25px;\n}\n.tooltip__button--data > * {\n    opacity: 0.9;\n}\n.tooltip__button--data:first-child {\n    margin-top: 0;\n}\n.tooltip__button--data:last-child {\n    margin-bottom: 0;\n}\n.tooltip__button--data::before {\n    content: '';\n    display: block;\n    width: 26px;\n    height: 26px;\n    margin: auto 8px auto 0;\n    background-size: cover;\n}\n.tooltip__button__secondary-text {\n    font-size: 11px;\n    color: rgba(0,0,0,0.6);\n}\n.tooltip__button:hover .tooltip__button__secondary-text {\n    color: #FFFFFF;\n}\n\n/* Icons */\n.tooltip__button--data--credentials::before {\n    /* TODO: use dynamically from src/UI/img/ddgPasswordIcon.js */\n    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tYmFzZTwvdGl0bGU+CiAgICA8ZyBpZD0iZGRnLXBhc3N3b3JkLWljb24tYmFzZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IlVuaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjMzMzMsMi42NjY2NyBDMTAuMjI4OCwyLjY2NjY3IDkuMzMzMzMsMy41NjIxIDkuMzMzMzMsNC42NjY2NyBDOS4zMzMzMyw1Ljc3MTI0IDEwLjIyODgsNi42NjY2NyAxMS4zMzMzLDYuNjY2NjcgQzEyLjQzNzksNi42NjY2NyAxMy4zMzMzLDUuNzcxMjQgMTMuMzMzMyw0LjY2NjY3IEMxMy4zMzMzLDMuNTYyMSAxMi40Mzc5LDIuNjY2NjcgMTEuMzMzMywyLjY2NjY3IFogTTEwLjY2NjcsNC42NjY2NyBDMTAuNjY2Nyw0LjI5ODQ4IDEwLjk2NTEsNCAxMS4zMzMzLDQgQzExLjcwMTUsNCAxMiw0LjI5ODQ4IDEyLDQuNjY2NjcgQzEyLDUuMDM0ODYgMTEuNzAxNSw1LjMzMzMzIDExLjMzMzMsNS4zMzMzMyBDMTAuOTY1MSw1LjMzMzMzIDEwLjY2NjcsNS4wMzQ4NiAxMC42NjY3LDQuNjY2NjcgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC42NjY3LDAgQzcuNzIxMTUsMCA1LjMzMzMzLDIuMzg3ODEgNS4zMzMzMyw1LjMzMzMzIEM1LjMzMzMzLDUuNzYxMTkgNS4zODM4NSw2LjE3Nzk4IDUuNDc5NDUsNi41Nzc3NSBMMC4xOTUyNjIsMTEuODYxOSBDMC4wNzAyMzc5LDExLjk4NyAwLDEyLjE1NjUgMCwxMi4zMzMzIEwwLDE1LjMzMzMgQzAsMTUuNzAxNSAwLjI5ODQ3NywxNiAwLjY2NjY2NywxNiBMMy4zMzMzMywxNiBDNC4wNjk3MSwxNiA0LjY2NjY3LDE1LjQwMyA0LjY2NjY3LDE0LjY2NjcgTDQuNjY2NjcsMTQgTDUuMzMzMzMsMTQgQzYuMDY5NzEsMTQgNi42NjY2NywxMy40MDMgNi42NjY2NywxMi42NjY3IEw2LjY2NjY3LDExLjMzMzMgTDgsMTEuMzMzMyBDOC4xNzY4MSwxMS4zMzMzIDguMzQ2MzgsMTEuMjYzMSA4LjQ3MTQxLDExLjEzODEgTDkuMTU5MDYsMTAuNDUwNCBDOS42Mzc3MiwxMC41OTEyIDEwLjE0MzksMTAuNjY2NyAxMC42NjY3LDEwLjY2NjcgQzEzLjYxMjIsMTAuNjY2NyAxNiw4LjI3ODg1IDE2LDUuMzMzMzMgQzE2LDIuMzg3ODEgMTMuNjEyMiwwIDEwLjY2NjcsMCBaIE02LjY2NjY3LDUuMzMzMzMgQzYuNjY2NjcsMy4xMjQxOSA4LjQ1NzUzLDEuMzMzMzMgMTAuNjY2NywxLjMzMzMzIEMxMi44NzU4LDEuMzMzMzMgMTQuNjY2NywzLjEyNDE5IDE0LjY2NjcsNS4zMzMzMyBDMTQuNjY2Nyw3LjU0MjQ3IDEyLjg3NTgsOS4zMzMzMyAxMC42NjY3LDkuMzMzMzMgQzEwLjE1NTgsOS4zMzMzMyA5LjY2ODg2LDkuMjM3OSA5LjIyMTUyLDkuMDY0NSBDOC45NzUyOCw4Ljk2OTA1IDguNjk1OTEsOS4wMjc5NSA4LjUwOTE2LDkuMjE0NjkgTDcuNzIzODYsMTAgTDYsMTAgQzUuNjMxODEsMTAgNS4zMzMzMywxMC4yOTg1IDUuMzMzMzMsMTAuNjY2NyBMNS4zMzMzMywxMi42NjY3IEw0LDEyLjY2NjcgQzMuNjMxODEsMTIuNjY2NyAzLjMzMzMzLDEyLjk2NTEgMy4zMzMzMywxMy4zMzMzIEwzLjMzMzMzLDE0LjY2NjcgTDEuMzMzMzMsMTQuNjY2NyBMMS4zMzMzMywxMi42MDk1IEw2LjY5Nzg3LDcuMjQ0OTQgQzYuODc1MDIsNy4wNjc3OSA2LjkzNzksNi44MDYyOSA2Ljg2MDY1LDYuNTY3OTggQzYuNzM0ODksNi4xNzk5NyA2LjY2NjY3LDUuNzY1MjcgNi42NjY2Nyw1LjMzMzMzIFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');\n}\n.tooltip__button--data--credentials:hover::before {\n    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGRnLXBhc3N3b3JkLWljb24tYmFzZS13aGl0ZTwvdGl0bGU+CiAgICA8ZyBpZD0iZGRnLXBhc3N3b3JkLWljb24tYmFzZS13aGl0ZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IlVuaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjMzMzMsMi42NjY2NyBDMTAuMjI4OCwyLjY2NjY3IDkuMzMzMzMsMy41NjIxIDkuMzMzMzMsNC42NjY2NyBDOS4zMzMzMyw1Ljc3MTI0IDEwLjIyODgsNi42NjY2NyAxMS4zMzMzLDYuNjY2NjcgQzEyLjQzNzksNi42NjY2NyAxMy4zMzMzLDUuNzcxMjQgMTMuMzMzMyw0LjY2NjY3IEMxMy4zMzMzLDMuNTYyMSAxMi40Mzc5LDIuNjY2NjcgMTEuMzMzMywyLjY2NjY3IFogTTEwLjY2NjcsNC42NjY2NyBDMTAuNjY2Nyw0LjI5ODQ4IDEwLjk2NTEsNCAxMS4zMzMzLDQgQzExLjcwMTUsNCAxMiw0LjI5ODQ4IDEyLDQuNjY2NjcgQzEyLDUuMDM0ODYgMTEuNzAxNSw1LjMzMzMzIDExLjMzMzMsNS4zMzMzMyBDMTAuOTY1MSw1LjMzMzMzIDEwLjY2NjcsNS4wMzQ4NiAxMC42NjY3LDQuNjY2NjcgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC42NjY3LDAgQzcuNzIxMTUsMCA1LjMzMzMzLDIuMzg3ODEgNS4zMzMzMyw1LjMzMzMzIEM1LjMzMzMzLDUuNzYxMTkgNS4zODM4NSw2LjE3Nzk4IDUuNDc5NDUsNi41Nzc3NSBMMC4xOTUyNjIsMTEuODYxOSBDMC4wNzAyMzc5LDExLjk4NyAwLDEyLjE1NjUgMCwxMi4zMzMzIEwwLDE1LjMzMzMgQzAsMTUuNzAxNSAwLjI5ODQ3NywxNiAwLjY2NjY2NywxNiBMMy4zMzMzMywxNiBDNC4wNjk3MSwxNiA0LjY2NjY3LDE1LjQwMyA0LjY2NjY3LDE0LjY2NjcgTDQuNjY2NjcsMTQgTDUuMzMzMzMsMTQgQzYuMDY5NzEsMTQgNi42NjY2NywxMy40MDMgNi42NjY2NywxMi42NjY3IEw2LjY2NjY3LDExLjMzMzMgTDgsMTEuMzMzMyBDOC4xNzY4MSwxMS4zMzMzIDguMzQ2MzgsMTEuMjYzMSA4LjQ3MTQxLDExLjEzODEgTDkuMTU5MDYsMTAuNDUwNCBDOS42Mzc3MiwxMC41OTEyIDEwLjE0MzksMTAuNjY2NyAxMC42NjY3LDEwLjY2NjcgQzEzLjYxMjIsMTAuNjY2NyAxNiw4LjI3ODg1IDE2LDUuMzMzMzMgQzE2LDIuMzg3ODEgMTMuNjEyMiwwIDEwLjY2NjcsMCBaIE02LjY2NjY3LDUuMzMzMzMgQzYuNjY2NjcsMy4xMjQxOSA4LjQ1NzUzLDEuMzMzMzMgMTAuNjY2NywxLjMzMzMzIEMxMi44NzU4LDEuMzMzMzMgMTQuNjY2NywzLjEyNDE5IDE0LjY2NjcsNS4zMzMzMyBDMTQuNjY2Nyw3LjU0MjQ3IDEyLjg3NTgsOS4zMzMzMyAxMC42NjY3LDkuMzMzMzMgQzEwLjE1NTgsOS4zMzMzMyA5LjY2ODg2LDkuMjM3OSA5LjIyMTUyLDkuMDY0NSBDOC45NzUyOCw4Ljk2OTA1IDguNjk1OTEsOS4wMjc5NSA4LjUwOTE2LDkuMjE0NjkgTDcuNzIzODYsMTAgTDYsMTAgQzUuNjMxODEsMTAgNS4zMzMzMywxMC4yOTg1IDUuMzMzMzMsMTAuNjY2NyBMNS4zMzMzMywxMi42NjY3IEw0LDEyLjY2NjcgQzMuNjMxODEsMTIuNjY2NyAzLjMzMzMzLDEyLjk2NTEgMy4zMzMzMywxMy4zMzMzIEwzLjMzMzMzLDE0LjY2NjcgTDEuMzMzMzMsMTQuNjY2NyBMMS4zMzMzMywxMi42MDk1IEw2LjY5Nzg3LDcuMjQ0OTQgQzYuODc1MDIsNy4wNjc3OSA2LjkzNzksNi44MDYyOSA2Ljg2MDY1LDYuNTY3OTggQzYuNzM0ODksNi4xNzk5NyA2LjY2NjY3LDUuNzY1MjcgNi42NjY2Nyw1LjMzMzMzIFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');\n}\n.tooltip__button--data--creditCard::before {\n    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBkPSJNNSA5Yy0uNTUyIDAtMSAuNDQ4LTEgMXYyYzAgLjU1Mi40NDggMSAxIDFoM2MuNTUyIDAgMS0uNDQ4IDEtMXYtMmMwLS41NTItLjQ0OC0xLTEtMUg1eiIgZmlsbD0iIzAwMCIvPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDZjMC0yLjIxIDEuNzktNCA0LTRoMTRjMi4yMSAwIDQgMS43OSA0IDR2MTJjMCAyLjIxLTEuNzkgNC00IDRINWMtMi4yMSAwLTQtMS43OS00LTRWNnptNC0yYy0xLjEwNSAwLTIgLjg5NS0yIDJ2OWgxOFY2YzAtMS4xMDUtLjg5NS0yLTItMkg1em0wIDE2Yy0xLjEwNSAwLTItLjg5NS0yLTJoMThjMCAxLjEwNS0uODk1IDItMiAySDV6IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPgo=');\n}\n.tooltip__button--data--creditCard:hover::before {\n    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBkPSJNNSA5Yy0uNTUyIDAtMSAuNDQ4LTEgMXYyYzAgLjU1Mi40NDggMSAxIDFoM2MuNTUyIDAgMS0uNDQ4IDEtMXYtMmMwLS41NTItLjQ0OC0xLTEtMUg1eiIgZmlsbD0iI2ZmZiIvPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDZjMC0yLjIxIDEuNzktNCA0LTRoMTRjMi4yMSAwIDQgMS43OSA0IDR2MTJjMCAyLjIxLTEuNzkgNC00IDRINWMtMi4yMSAwLTQtMS43OS00LTRWNnptNC0yYy0xLjEwNSAwLTIgLjg5NS0yIDJ2OWgxOFY2YzAtMS4xMDUtLjg5NS0yLTItMkg1em0wIDE2Yy0xLjEwNSAwLTItLjg5NS0yLTJoMThjMCAxLjEwNS0uODk1IDItMiAySDV6IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPgo=');\n}\n\n/* Email tooltip specific */\n.tooltip__button--email {\n    flex-direction: column;\n    justify-content: center;\n    align-items: flex-start;\n    font-size: 14px;\n}\n.tooltip__button--email__primary-text {\n    font-weight: bold;\n}\n.tooltip__button--email__secondary-text {\n    font-size: 12px;\n}\n";

},{}],15:[function(require,module,exports){
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
    return ddgGlobals.JSONparse(response);
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
    return ddgGlobals.JSONparse(decrypted);
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

},{"./captureDdgGlobals":16}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
"use strict";

let isApp = false; // Do not modify or remove the next line -- the app code will replace it with `isApp = true;`
// INJECT isApp HERE

const isDDGApp = /(iPhone|iPad|Android|Mac).*DuckDuckGo\/[0-9]/i.test(window.navigator.userAgent) || isApp;
const isAndroid = isDDGApp && /Android/i.test(window.navigator.userAgent);
const DDG_DOMAIN_REGEX = new RegExp(/^https:\/\/(([a-z0-9-_]+?)\.)?duckduckgo\.com\/email/);

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


const originalSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
/**
 * Ensures the value is set properly and dispatches events to simulate real user action
 * @param {HTMLInputElement} el
 * @param {string | number} val
 */

const setValueForInput = (el, val) => {
  // Avoid keyboard flashing on Android
  if (!isAndroid) {
    el.focus();
  }

  originalSet.call(el, val);
  const events = [new Event('keydown', {
    bubbles: true
  }), new Event('keyup', {
    bubbles: true
  }), new Event('input', {
    bubbles: true
  }), new Event('change', {
    bubbles: true
  })];
  events.forEach(ev => el.dispatchEvent(ev)); // We call this again to make sure all forms are happy

  originalSet.call(el, val);
  el.blur();
};
/**
 * Selects an option of a select element
 * We assume Select is only used for dates, i.e. in the credit card
 * @param {HTMLSelectElement} el
 * @param {string | number} val
 */


const setValueForSelect = (el, val) => {
  for (const option of el.options) {
    // TODO: try to match localised month names
    const optValue = option.value || option.innerText;

    if (optValue.contains(val)) {
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
      })];
      option.selected = true; // Events fire on the select el, not option

      events.forEach(ev => el.dispatchEvent(ev));
      option.selected = true;
      option.blur();
      return;
    }
  }
};
/**
 * Sets or selects a value to a form element
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @param {string | number} val
 */


const setValue = (el, val) => {
  if (el.nodeName === 'INPUT') setValueForInput(el, val);
  if (el.nodeName === 'SELECT') setValueForSelect(el, val);
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

const formatAddress = address => address + ADDRESS_DOMAIN;
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
  ADDRESS_DOMAIN,
  formatAddress,
  escapeXML
};

},{}],18:[function(require,module,exports){
"use strict";

(() => {
  try {
    if (!window.isSecureContext) return;

    const listenForGlobalFormSubmission = require('./Form/listenForFormSubmission');

    const {
      forms
    } = require('./scanForInputs');

    const {
      isApp
    } = require('./autofill-utils');

    const inject = () => {
      // Polyfills/shims
      require('./requestIdleCallback');

      const DeviceInterface = require('./DeviceInterface'); // Global listener for event delegation


      window.addEventListener('pointerdown', e => {
        if (!e.isTrusted) return;

        if (e.target.nodeName === 'DDG-AUTOFILL') {
          e.preventDefault();
          e.stopImmediatePropagation();
          const activeForm = [...forms.values()].find(form => form.tooltip);

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

          return (_forms$get = forms.get(e.target)) === null || _forms$get === void 0 ? void 0 : _forms$get.submitHandler();
        }, true);
      }

      DeviceInterface.init();
    }; // chrome is only present in desktop browsers


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

},{"./DeviceInterface":1,"./Form/listenForFormSubmission":7,"./autofill-utils":17,"./requestIdleCallback":20,"./scanForInputs":21}],19:[function(require,module,exports){
"use strict";

module.exports = {
  ATTR_INPUT_TYPE: 'data-ddg-inputType',
  ATTR_AUTOFILL: 'data-ddg-autofill'
};

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
"use strict";

const Form = require('./Form/Form');

const {
  notifyWebApp
} = require('./autofill-utils');

const {
  FIELD_SELECTOR,
  SUBMIT_BUTTON_SELECTOR
} = require('./Form/selectors');

const forms = new Map(); // Accepts the DeviceInterface as an explicit dependency

const scanForInputs = DeviceInterface => {
  const getParentForm = input => {
    if (input.form) return input.form;
    let element = input; // traverse the DOM to search for related inputs

    while (element.parentNode && element !== document.body) {
      element = element.parentElement;
      const inputs = element.querySelectorAll(FIELD_SELECTOR);
      const buttons = element.querySelectorAll(SUBMIT_BUTTON_SELECTOR); // If we find a button or another input, we assume that's our form

      if (inputs.length > 1 || buttons.length) {
        // found related input, return common ancestor
        return element;
      }
    }

    return input;
  };

  const addInput = input => {
    const parentForm = getParentForm(input);

    if ([...forms.keys()].find(form => form.contains(parentForm))) {
      // If we've already met the form or a descendant, add the input
      forms.get(parentForm).addInput(input);
    } else {
      // if this form is an ancestor of an existing form, remove that before adding this
      const childForm = [...forms.keys()].find(form => parentForm.contains(form));
      forms.delete(childForm);
      forms.set(parentForm, new Form(parentForm, input, DeviceInterface));
    }
  };

  const findEligibleInput = context => {
    if (context.nodeName === 'INPUT' && context.matches(FIELD_SELECTOR)) {
      addInput(context);
    } else {
      context.querySelectorAll(FIELD_SELECTOR).forEach(addInput);
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

},{"./Form/Form":2,"./Form/selectors":9,"./autofill-utils":17}]},{},[18]);
