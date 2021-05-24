(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = "\n.wrapper *, .wrapper *::before, .wrapper *::after {\n    box-sizing: border-box;\n}\n.wrapper {\n    position: fixed;\n    top: 0;\n    left: 0;\n    padding: 0;\n    font-family: 'DDG_ProximaNova', 'Proxima Nova', -apple-system,\n    BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',\n    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n    -webkit-font-smoothing: antialiased;\n    z-index: 2147483647;\n}\n.tooltip {\n    position: absolute;\n    top: calc(100% + 6px);\n    right: calc(100% - 46px);\n    width: 300px;\n    max-width: calc(100vw - 25px);\n    padding: 8px;\n    border: 1px solid #D0D0D0;\n    border-radius: 10px;\n    background-color: #FFFFFF;\n    font-size: 14px;\n    color: #333333;\n    line-height: 1.3;\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);\n    z-index: 2147483647;\n}\n.tooltip::before,\n.tooltip::after {\n    content: \"\";\n    width: 0;\n    height: 0;\n    border-left: 10px solid transparent;\n    border-right: 10px solid transparent;\n    display: block;\n    border-bottom: 8px solid #D0D0D0;\n    position: absolute;\n    right: 20px;\n}\n.tooltip::before {\n    border-bottom-color: #D0D0D0;\n    top: -9px;\n}\n.tooltip::after {\n    border-bottom-color: #FFFFFF;\n    top: -8px;\n}\n.tooltip__button {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: flex-start;\n    width: 100%;\n    padding: 4px 8px 7px;\n    font-family: inherit;\n    font-size: 14px;\n    background: transparent;\n    border: none;\n    border-radius: 6px;\n}\n.tooltip__button:hover {\n    background-color: #3969EF;\n    color: #FFFFFF;\n}\n.tooltip__button__primary-text {\n    font-weight: bold;\n}\n.tooltip__button__secondary-text {\n    font-size: 12px;\n}\n";

},{}],2:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./autofill-utils'),
    isApp = _require.isApp,
    formatAddress = _require.formatAddress,
    getDaxBoundingBox = _require.getDaxBoundingBox,
    safeExecute = _require.safeExecute,
    escapeXML = _require.escapeXML;

var DDGAutofill = function DDGAutofill(input, associatedForm, getAddresses, refreshAlias, addresses) {
  var _this = this;

  _classCallCheck(this, DDGAutofill);

  var shadow = document.createElement('ddg-autofill').attachShadow({
    mode: 'closed'
  });
  this.host = shadow.host;
  this.input = input;
  this.associatedForm = associatedForm;
  this.addresses = addresses;
  this.animationFrame = null;
  var includeStyles = isApp ? "<style>".concat(require('./DDGAutofill-styles.js'), "</style>") : "<link rel=\"stylesheet\" href=\"".concat(chrome.runtime.getURL('public/css/email-autofill.css'), "\" crossorigin=\"anonymous\">");
  shadow.innerHTML = "\n".concat(includeStyles, "\n<div class=\"wrapper\">\n    <div class=\"tooltip\" hidden>\n        <button class=\"tooltip__button tooltip__button--secondary js-use-personal\">\n            <span class=\"tooltip__button__primary-text\">\n                Use <span class=\"js-address\">").concat(formatAddress(escapeXML(this.addresses.personalAddress)), "</span>\n            </span>\n            <span class=\"tooltip__button__secondary-text\">Blocks email trackers</span>\n        </button>\n        <button class=\"tooltip__button tooltip__button--primary js-use-private\">\n            <span class=\"tooltip__button__primary-text\">Use a Private Address</span>\n            <span class=\"tooltip__button__secondary-text\">Blocks email trackers and hides your address</span>\n        </button>\n    </div>\n</div>");
  this.wrapper = shadow.querySelector('.wrapper');
  this.tooltip = shadow.querySelector('.tooltip');
  this.usePersonalButton = shadow.querySelector('.js-use-personal');
  this.usePrivateButton = shadow.querySelector('.js-use-private');
  this.addressEl = shadow.querySelector('.js-address');
  this.stylesheet = shadow.querySelector('link, style'); // Un-hide once the style is loaded, to avoid flashing unstyled content

  this.stylesheet.addEventListener('load', function () {
    return _this.tooltip.removeAttribute('hidden');
  });

  this.updateAddresses = function (addresses) {
    if (addresses) {
      _this.addresses = addresses;
      _this.addressEl.textContent = formatAddress(addresses.personalAddress);
    }
  }; // Get the alias from the extension


  getAddresses().then(this.updateAddresses);
  this.top = 0;
  this.left = 0;
  this.transformRuleIndex = null;

  this.updatePosition = function (_ref) {
    var left = _ref.left,
        top = _ref.top;
    // If the stylesheet is not loaded wait for load (Chrome bug)
    if (!shadow.styleSheets.length) return _this.stylesheet.addEventListener('load', _this.checkPosition);
    _this.left = left;
    _this.top = top;

    if (_this.transformRuleIndex && shadow.styleSheets[_this.transformRuleIndex]) {
      // If we have already set the rule, remove it…
      shadow.styleSheets[0].deleteRule(_this.transformRuleIndex);
    } else {
      // …otherwise, set the index as the very last rule
      _this.transformRuleIndex = shadow.styleSheets[0].rules.length;
    }

    var newRule = ".wrapper {transform: translate(".concat(left, "px, ").concat(top, "px);}");
    shadow.styleSheets[0].insertRule(newRule, _this.transformRuleIndex);
  };

  this.append = function () {
    return document.body.appendChild(shadow.host);
  };

  this.append();

  this.lift = function () {
    _this.left = null;
    _this.top = null;
    document.body.removeChild(_this.host);
  };

  this.remove = function () {
    window.removeEventListener('scroll', _this.checkPosition, {
      passive: true,
      capture: true
    });

    _this.resObs.disconnect();

    _this.mutObs.disconnect();

    _this.lift();
  };

  this.checkPosition = function () {
    if (_this.animationFrame) {
      window.cancelAnimationFrame(_this.animationFrame);
    }

    _this.animationFrame = window.requestAnimationFrame(function () {
      var _getDaxBoundingBox = getDaxBoundingBox(_this.input),
          left = _getDaxBoundingBox.left,
          bottom = _getDaxBoundingBox.bottom;

      if (left !== _this.left || bottom !== _this.top) {
        _this.updatePosition({
          left: left,
          top: bottom
        });
      }

      _this.animationFrame = null;
    });
  };

  this.resObs = new ResizeObserver(function (entries) {
    return entries.forEach(_this.checkPosition);
  });
  this.resObs.observe(document.body);
  this.count = 0;

  this.ensureIsLastInDOM = function () {
    // If DDG el is not the last in the doc, move it there
    if (document.body.lastElementChild !== _this.host) {
      _this.lift(); // Try up to 5 times to avoid infinite loop in case someone is doing the same


      if (_this.count < 15) {
        _this.append();

        _this.checkPosition();

        _this.count++;
      } else {
        // Reset count so we can resume normal flow
        _this.count = 0;
        console.info("DDG autofill bailing out");
      }
    }
  };

  this.mutObs = new MutationObserver(function (mutationList) {
    var _iterator = _createForOfIteratorHelper(mutationList),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var mutationRecord = _step.value;

        if (mutationRecord.type === 'childList') {
          // Only check added nodes
          mutationRecord.addedNodes.forEach(function (el) {
            if (el.nodeName === 'DDG-AUTOFILL') return;

            _this.ensureIsLastInDOM();
          });
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    _this.checkPosition();
  });
  this.mutObs.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
  window.addEventListener('scroll', this.checkPosition, {
    passive: true,
    capture: true
  });
  this.usePersonalButton.addEventListener('click', function (e) {
    if (!e.isTrusted) return;
    e.stopImmediatePropagation();
    safeExecute(_this.usePersonalButton, function () {
      _this.associatedForm.autofill(formatAddress(_this.addresses.personalAddress));
    });
  });
  this.usePrivateButton.addEventListener('click', function (e) {
    if (!e.isTrusted) return;
    e.stopImmediatePropagation();
    safeExecute(_this.usePersonalButton, function () {
      _this.associatedForm.autofill(formatAddress(_this.addresses.privateAddress));

      refreshAlias();
    });
  });
};

module.exports = DDGAutofill;

},{"./DDGAutofill-styles.js":1,"./autofill-utils":6}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DDGAutofill = require('./DDGAutofill');

var _require = require('./autofill-utils'),
    isApp = _require.isApp,
    notifyWebApp = _require.notifyWebApp,
    isDDGApp = _require.isDDGApp,
    isAndroid = _require.isAndroid,
    isDDGDomain = _require.isDDGDomain,
    sendAndWaitForAnswer = _require.sendAndWaitForAnswer,
    wkSend = _require.wkSend,
    wkSendAndWait = _require.wkSendAndWait,
    setValue = _require.setValue,
    formatAddress = _require.formatAddress;

var scanForInputs = require('./scanForInputs.js');

var SIGN_IN_MSG = {
  signMeIn: true
};

var createAttachTooltip = function createAttachTooltip(getAutofillData, refreshAlias, addresses) {
  return function (form, input) {
    if (isDDGApp && !isApp) {
      form.activeInput = input;
      getAutofillData().then(function (alias) {
        if (alias) form.autofill(alias);else form.activeInput.focus();
      });
    } else {
      if (form.tooltip) return;
      form.activeInput = input;
      form.tooltip = new DDGAutofill(input, form, getAutofillData, refreshAlias, addresses);
      form.intObs.observe(input);
      window.addEventListener('mousedown', form.removeTooltip, {
        capture: true
      });
    }
  };
};

var InterfacePrototype = /*#__PURE__*/function () {
  function InterfacePrototype() {
    _classCallCheck(this, InterfacePrototype);
  }

  _createClass(InterfacePrototype, [{
    key: "init",
    value: function init() {
      this.addDeviceListeners();
      this.setupAutofill();
    } // Default setup used on extensions and Apple devices

  }, {
    key: "setupAutofill",
    value: function setupAutofill() {
      var _this = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        shouldLog: false
      },
          shouldLog = _ref.shouldLog;

      this.getAddresses().then(function (addresses) {
        if (addresses !== null && addresses !== void 0 && addresses.privateAddress && addresses !== null && addresses !== void 0 && addresses.personalAddress) {
          _this.attachTooltip = createAttachTooltip(_this.getAddresses, _this.refreshAlias, addresses);
          notifyWebApp({
            deviceSignedIn: {
              value: true,
              shouldLog: shouldLog
            }
          });
          scanForInputs(_this);
        } else {
          _this.trySigningIn();
        }
      });
    }
  }, {
    key: "getAddresses",
    value: function getAddresses() {}
  }, {
    key: "refreshAlias",
    value: function refreshAlias() {}
  }, {
    key: "trySigningIn",
    value: function trySigningIn() {}
  }, {
    key: "storeUserData",
    value: function storeUserData() {}
  }, {
    key: "addDeviceListeners",
    value: function addDeviceListeners() {}
  }, {
    key: "addLogoutListener",
    value: function addLogoutListener() {}
  }, {
    key: "attachTooltip",
    value: function attachTooltip() {} // TODO: deprecated?

  }, {
    key: "isDeviceSignedIn",
    value: function isDeviceSignedIn() {}
  }, {
    key: "getAlias",
    value: function getAlias() {}
  }]);

  return InterfacePrototype;
}();

var ExtensionInterface = /*#__PURE__*/function (_InterfacePrototype) {
  _inherits(ExtensionInterface, _InterfacePrototype);

  var _super = _createSuper(ExtensionInterface);

  function ExtensionInterface() {
    var _this2;

    _classCallCheck(this, ExtensionInterface);

    _this2 = _super.call(this);

    _this2.getAddresses = function () {
      return new Promise(function (resolve) {
        return chrome.runtime.sendMessage({
          getAddresses: true
        }, function (data) {
          return resolve(data);
        });
      });
    };

    _this2.refreshAlias = function () {
      return chrome.runtime.sendMessage({
        refreshAlias: true
      }, function (addresses) {
        _this2.addresses = addresses;
      });
    };

    _this2.trySigningIn = function () {
      if (isDDGDomain()) {
        sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData').then(function (data) {
          return _this2.storeUserData(data);
        });
      }
    };

    _this2.storeUserData = function (data) {
      return chrome.runtime.sendMessage(data);
    };

    _this2.addDeviceListeners = function () {
      // Add contextual menu listeners
      var activeEl = null;
      document.addEventListener('contextmenu', function (e) {
        activeEl = e.target;
      });
      chrome.runtime.onMessage.addListener(function (message, sender) {
        if (sender.id !== chrome.runtime.id) return;

        switch (message.type) {
          case 'ddgUserReady':
            _this2.setupAutofill({
              shouldLog: true
            });

            break;

          case 'contextualAutofill':
            setValue(activeEl, formatAddress(message.alias));
            activeEl.classList.add('ddg-autofilled');

            _this2.refreshAlias(); // If the user changes the alias, remove the decoration


            activeEl.addEventListener('input', function (e) {
              return e.target.classList.remove('ddg-autofilled');
            }, {
              once: true
            });
            break;

          default:
            break;
        }
      });
    };

    _this2.addLogoutListener = function (handler) {
      // Cleanup on logout events
      chrome.runtime.onMessage.addListener(function (message, sender) {
        if (sender.id === chrome.runtime.id && message.type === 'logout') {
          handler();
        }
      });
    };

    return _this2;
  }

  return ExtensionInterface;
}(InterfacePrototype);

var AndroidInterface = /*#__PURE__*/function (_InterfacePrototype2) {
  _inherits(AndroidInterface, _InterfacePrototype2);

  var _super2 = _createSuper(AndroidInterface);

  function AndroidInterface() {
    var _this3;

    _classCallCheck(this, AndroidInterface);

    _this3 = _super2.call(this);

    _this3.getAlias = function () {
      return sendAndWaitForAnswer(function () {
        return window.EmailInterface.showTooltip();
      }, 'getAliasResponse').then(function (_ref2) {
        var alias = _ref2.alias;
        return alias;
      });
    };

    _this3.isDeviceSignedIn = function () {
      return new Promise(function (resolve) {
        resolve(window.EmailInterface.isSignedIn() === 'true');
      });
    };

    _this3.setupAutofill = function () {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        shouldLog: false
      },
          shouldLog = _ref3.shouldLog;

      _this3.isDeviceSignedIn().then(function (signedIn) {
        if (signedIn) {
          notifyWebApp({
            deviceSignedIn: {
              value: true,
              shouldLog: shouldLog
            }
          });
          scanForInputs(_assertThisInitialized(_this3));
        } else {
          _this3.trySigningIn();
        }
      });
    };

    _this3.trySigningIn = function () {
      if (isDDGDomain()) {
        sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData').then(function (data) {
          // This call doesn't send a response, so we can't know if it succeeded
          _this3.storeUserData(data);

          _this3.setupAutofill({
            shouldLog: true
          });
        });
      }
    };

    _this3.storeUserData = function (_ref4) {
      var _ref4$addUserData = _ref4.addUserData,
          token = _ref4$addUserData.token,
          userName = _ref4$addUserData.userName;
      return window.EmailInterface.storeCredentials(token, userName);
    };

    _this3.attachTooltip = createAttachTooltip(_this3.getAlias);
    return _this3;
  }

  return AndroidInterface;
}(InterfacePrototype);

var AppleDeviceInterface = /*#__PURE__*/function (_InterfacePrototype3) {
  _inherits(AppleDeviceInterface, _InterfacePrototype3);

  var _super3 = _createSuper(AppleDeviceInterface);

  function AppleDeviceInterface() {
    var _this4;

    _classCallCheck(this, AppleDeviceInterface);

    _this4 = _super3.call(this);

    if (isDDGDomain()) {
      // Tell the web app whether we're in the app
      notifyWebApp({
        isApp: isApp
      });
    }

    _this4.getAddresses = function () {
      if (!isApp) return _this4.getAlias();
      return wkSendAndWait('emailHandlerGetAddresses').then(function (_ref5) {
        var addresses = _ref5.addresses;
        return addresses;
      });
    };

    _this4.getAlias = function () {
      return wkSendAndWait('emailHandlerGetAlias', {
        requiresUserPermission: !isApp,
        shouldConsumeAliasIfProvided: !isApp
      }).then(function (_ref6) {
        var alias = _ref6.alias;
        return alias;
      });
    };

    _this4.refreshAlias = function () {
      return wkSend('emailHandlerRefreshAlias');
    };

    _this4.trySigningIn = function () {
      if (isDDGDomain()) {
        sendAndWaitForAnswer(SIGN_IN_MSG, 'addUserData').then(function (data) {
          // This call doesn't send a response, so we can't know if it succeeded
          _this4.storeUserData(data);

          _this4.setupAutofill({
            shouldLog: true
          });
        });
      }
    };

    _this4.storeUserData = function (_ref7) {
      var _ref7$addUserData = _ref7.addUserData,
          token = _ref7$addUserData.token,
          userName = _ref7$addUserData.userName;
      return wkSend('emailHandlerStoreToken', {
        token: token,
        username: userName
      });
    };

    _this4.attachTooltip = createAttachTooltip(_this4.getAlias, _this4.refreshAlias);
    return _this4;
  }

  return AppleDeviceInterface;
}(InterfacePrototype);

var DeviceInterface = function () {
  if (isDDGApp) {
    return isAndroid ? new AndroidInterface() : new AppleDeviceInterface();
  }

  return new ExtensionInterface();
}();

module.exports = DeviceInterface;

},{"./DDGAutofill":2,"./autofill-utils":6,"./scanForInputs.js":10}],4:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FormAnalyzer = require('./FormAnalyzer');

var _require = require('./autofill-utils'),
    addInlineStyles = _require.addInlineStyles,
    removeInlineStyles = _require.removeInlineStyles,
    isDDGApp = _require.isDDGApp,
    setValue = _require.setValue,
    isEventWithinDax = _require.isEventWithinDax;

var _require2 = require('./logo-svg'),
    daxBase64 = _require2.daxBase64; // In Firefox web_accessible_resources could leak a unique user identifier, so we avoid it here


var isFirefox = navigator.userAgent.includes('Firefox');
var getDaxImg = isDDGApp || isFirefox ? daxBase64 : chrome.runtime.getURL('img/logo-small.svg');

var getDaxStyles = function getDaxStyles(input) {
  return {
    // Height must be > 0 to account for fields initially hidden
    'background-size': "auto ".concat(input.offsetHeight <= 30 && input.offsetHeight > 0 ? '100%' : '26px'),
    'background-position': 'center right',
    'background-repeat': 'no-repeat',
    'background-origin': 'content-box',
    'background-image': "url(".concat(getDaxImg, ")")
  };
};

var INLINE_AUTOFILLED_STYLES = {
  'background-color': '#F8F498',
  'color': '#333333'
};

var Form = /*#__PURE__*/function () {
  function Form(form, input, attachTooltip) {
    var _this = this;

    _classCallCheck(this, Form);

    this.form = form;
    this.formAnalyzer = new FormAnalyzer(form, input);
    this.attachTooltip = attachTooltip;
    this.relevantInputs = new Set();
    this.touched = new Set();
    this.listeners = new Set();
    this.addInput(input);
    this.tooltip = null;
    this.activeInput = null;
    this.intObs = new IntersectionObserver(function (entries) {
      var _iterator = _createForOfIteratorHelper(entries),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          if (!entry.isIntersecting) _this.removeTooltip();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });

    this.removeTooltip = function (e) {
      if (e && e.target === _this.tooltip.host) {
        return;
      }

      _this.tooltip.remove();

      _this.tooltip = null;

      _this.intObs.disconnect();

      window.removeEventListener('mousedown', _this.removeTooltip, {
        capture: true
      });
    };

    this.removeInputHighlight = function (input) {
      removeInlineStyles(input, INLINE_AUTOFILLED_STYLES);
      input.classList.remove('ddg-autofilled');
    };

    this.removeAllHighlights = function (e) {
      // This ensures we are not removing the highlight ourselves when autofilling more than once
      if (e && !e.isTrusted) return;

      _this.execOnInputs(_this.removeInputHighlight);
    };

    this.removeInputDecoration = function (input) {
      removeInlineStyles(input, getDaxStyles(input));
      input.removeAttribute('data-ddg-autofill');
    };

    this.removeAllDecorations = function () {
      _this.execOnInputs(_this.removeInputDecoration);

      _this.listeners.forEach(function (_ref) {
        var el = _ref.el,
            type = _ref.type,
            fn = _ref.fn;
        return el.removeEventListener(type, fn);
      });
    };

    this.resetAllInputs = function () {
      _this.execOnInputs(function (input) {
        setValue(input, '');

        _this.removeInputHighlight(input);
      });

      if (_this.activeInput) _this.activeInput.focus();
    };

    this.dismissTooltip = function () {
      _this.removeTooltip();
    };

    return this;
  }

  _createClass(Form, [{
    key: "execOnInputs",
    value: function execOnInputs(fn) {
      this.relevantInputs.forEach(fn);
    }
  }, {
    key: "addInput",
    value: function addInput(input) {
      this.relevantInputs.add(input);
      if (this.formAnalyzer.autofillSignal > 0) this.decorateInput(input);
      return this;
    }
  }, {
    key: "areAllInputsEmpty",
    value: function areAllInputsEmpty() {
      var allEmpty = true;
      this.execOnInputs(function (input) {
        if (input.value) allEmpty = false;
      });
      return allEmpty;
    }
  }, {
    key: "addListener",
    value: function addListener(el, type, fn) {
      el.addEventListener(type, fn);
      this.listeners.add({
        el: el,
        type: type,
        fn: fn
      });
    }
  }, {
    key: "decorateInput",
    value: function decorateInput(input) {
      var _this2 = this;

      input.setAttribute('data-ddg-autofill', 'true');
      addInlineStyles(input, getDaxStyles(input));
      this.addListener(input, 'mousemove', function (e) {
        if (isEventWithinDax(e, e.target)) {
          e.target.style.setProperty('cursor', 'pointer', 'important');
        } else {
          e.target.style.removeProperty('cursor');
        }
      });
      this.addListener(input, 'mousedown', function (e) {
        if (!e.isTrusted) return;
        if (e.button !== 0) return;

        if (_this2.shouldOpenTooltip(e, e.target)) {
          e.preventDefault();
          e.stopImmediatePropagation();

          _this2.touched.add(e.target);

          _this2.attachTooltip(_this2, e.target);
        }
      });
      return this;
    }
  }, {
    key: "shouldOpenTooltip",
    value: function shouldOpenTooltip(e, input) {
      return !this.touched.has(input) && this.areAllInputsEmpty() || isEventWithinDax(e, input);
    }
  }, {
    key: "autofill",
    value: function autofill(alias) {
      var _this3 = this;

      this.execOnInputs(function (input) {
        setValue(input, alias);
        input.classList.add('ddg-autofilled');
        addInlineStyles(input, INLINE_AUTOFILLED_STYLES); // If the user changes the alias, remove the decoration

        input.addEventListener('input', _this3.removeAllHighlights, {
          once: true
        });
      });

      if (this.tooltip) {
        this.removeTooltip();
      }
    }
  }]);

  return Form;
}();

module.exports = Form;

},{"./FormAnalyzer":5,"./autofill-utils":6,"./logo-svg":8}],5:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FormAnalyzer = /*#__PURE__*/function () {
  function FormAnalyzer(form, input) {
    _classCallCheck(this, FormAnalyzer);

    this.form = form;
    this.autofillSignal = 0;
    this.signals = []; // Avoid autofill on our signup page

    if (window.location.href.match(/^https:\/\/.+\.duckduckgo\.com\/email\/signup/i)) return this;
    this.evaluateElAttributes(input, 3, true);
    form ? this.evaluateForm() : this.evaluatePage();
    return this;
  }

  _createClass(FormAnalyzer, [{
    key: "increaseSignalBy",
    value: function increaseSignalBy(strength, signal) {
      this.autofillSignal += strength;
      this.signals.push("".concat(signal, ": +").concat(strength));
      return this;
    }
  }, {
    key: "decreaseSignalBy",
    value: function decreaseSignalBy(strength, signal) {
      this.autofillSignal -= strength;
      this.signals.push("".concat(signal, ": -").concat(strength));
      return this;
    }
  }, {
    key: "updateSignal",
    value: function updateSignal(_ref) {
      var string = _ref.string,
          strength = _ref.strength,
          _ref$signalType = _ref.signalType,
          signalType = _ref$signalType === void 0 ? 'generic' : _ref$signalType,
          _ref$shouldFlip = _ref.shouldFlip,
          shouldFlip = _ref$shouldFlip === void 0 ? false : _ref$shouldFlip,
          _ref$shouldCheckUnifi = _ref.shouldCheckUnifiedForm,
          shouldCheckUnifiedForm = _ref$shouldCheckUnifi === void 0 ? false : _ref$shouldCheckUnifi,
          _ref$shouldBeConserva = _ref.shouldBeConservative,
          shouldBeConservative = _ref$shouldBeConserva === void 0 ? false : _ref$shouldBeConserva;
      var negativeRegex = new RegExp(/sign(ing)?.?in(?!g)|log.?in/i);
      var positiveRegex = new RegExp(/sign(ing)?.?up|join|regist(er|ration)|newsletter|subscri(be|ption)|contact|create|start|settings|preferences|profile|update|checkout|guest|purchase|buy|order/i);
      var conservativePositiveRegex = new RegExp(/sign.?up|join|register|newsletter|subscri(be|ption)|settings|preferences|profile|update/i);
      var strictPositiveRegex = new RegExp(/sign.?up|join|register|settings|preferences|profile|update/i);
      var matchesNegative = string.match(negativeRegex); // Check explicitly for unified login/signup forms. They should always be negative, so we increase signal

      if (shouldCheckUnifiedForm && matchesNegative && string.match(strictPositiveRegex)) {
        this.decreaseSignalBy(strength + 2, "Unified detected ".concat(signalType));
        return this;
      }

      var matchesPositive = string.match(shouldBeConservative ? conservativePositiveRegex : positiveRegex); // In some cases a login match means the login is somewhere else, i.e. when a link points outside

      if (shouldFlip) {
        if (matchesNegative) this.increaseSignalBy(strength, signalType);
        if (matchesPositive) this.decreaseSignalBy(strength, signalType);
      } else {
        if (matchesNegative) this.decreaseSignalBy(strength, signalType);
        if (matchesPositive) this.increaseSignalBy(strength, signalType);
      }

      return this;
    }
  }, {
    key: "evaluateElAttributes",
    value: function evaluateElAttributes(el) {
      var _this = this;

      var signalStrength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      var isInput = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      Array.from(el.attributes).forEach(function (attr) {
        var attributeString = "".concat(attr.nodeName, "=").concat(attr.nodeValue);

        _this.updateSignal({
          string: attributeString,
          strength: signalStrength,
          signalType: "".concat(el.nodeName, " attr: ").concat(attributeString),
          shouldCheckUnifiedForm: isInput
        });
      });
    }
  }, {
    key: "evaluatePageTitle",
    value: function evaluatePageTitle() {
      var pageTitle = document.title;
      this.updateSignal({
        string: pageTitle,
        strength: 2,
        signalType: "page title: ".concat(pageTitle)
      });
    }
  }, {
    key: "evaluatePageHeadings",
    value: function evaluatePageHeadings() {
      var _this2 = this;

      var headings = document.querySelectorAll('h1, h2, h3, [class*="title"], [id*="title"]');

      if (headings) {
        headings.forEach(function (_ref2) {
          var innerText = _ref2.innerText;

          _this2.updateSignal({
            string: innerText,
            strength: 0.5,
            signalType: "heading: ".concat(innerText),
            shouldCheckUnifiedForm: true,
            shouldBeConservative: true
          });
        });
      }
    }
  }, {
    key: "evaluatePage",
    value: function evaluatePage() {
      var _this3 = this;

      this.evaluatePageTitle();
      this.evaluatePageHeadings(); // Check for submit buttons

      var buttons = document.querySelectorAll("\n                button[type=submit],\n                button:not([type]),\n                [role=button]\n            ");
      buttons.forEach(function (button) {
        // if the button has a form, it's not related to our input, because our input has no form here
        if (!button.form && !button.closest('form')) {
          _this3.evaluateElement(button);

          _this3.evaluateElAttributes(button, 0.5);
        }
      });
    }
  }, {
    key: "elementIs",
    value: function elementIs(el, type) {
      return el.nodeName.toLowerCase() === type.toLowerCase();
    }
  }, {
    key: "getText",
    value: function getText(el) {
      var _this4 = this;

      // for buttons, we don't care about descendants, just get the whole text as is
      // this is important in order to give proper attribution of the text to the button
      if (this.elementIs(el, 'BUTTON')) return el.innerText;
      if (this.elementIs(el, 'INPUT') && ['submit', 'button'].includes(el.type)) return el.value;
      return Array.from(el.childNodes).reduce(function (text, child) {
        return _this4.elementIs(child, '#text') ? text + ' ' + child.textContent : text;
      }, '');
    }
  }, {
    key: "evaluateElement",
    value: function evaluateElement(el) {
      var string = this.getText(el); // check button contents

      if (this.elementIs(el, 'INPUT') && ['submit', 'button'].includes(el.type) || this.elementIs(el, 'BUTTON') && el.type === 'submit' || (el.getAttribute('role') || '').toUpperCase() === 'BUTTON') {
        this.updateSignal({
          string: string,
          strength: 2,
          signalType: "submit: ".concat(string)
        });
      } // if a link points to relevant urls or contain contents outside the page…


      if (this.elementIs(el, 'A') && el.href && el.href !== '#' || (el.getAttribute('role') || '').toUpperCase() === 'LINK') {
        // …and matches one of the regexes, we assume the match is not pertinent to the current form
        this.updateSignal({
          string: string,
          strength: 1,
          signalType: "external link: ".concat(string),
          shouldFlip: true
        });
      } else {
        // any other case
        this.updateSignal({
          string: string,
          strength: 1,
          signalType: "generic: ".concat(string),
          shouldCheckUnifiedForm: true
        });
      }
    }
  }, {
    key: "evaluateForm",
    value: function evaluateForm() {
      var _this5 = this;

      // Check page title
      this.evaluatePageTitle(); // Check form attributes

      this.evaluateElAttributes(this.form); // Check form contents (skip select and option because they contain too much noise)

      this.form.querySelectorAll('*:not(select):not(option)').forEach(function (el) {
        return _this5.evaluateElement(el);
      }); // If we can't decide at this point, try reading page headings

      if (this.autofillSignal === 0) {
        this.evaluatePageHeadings();
      }

      return this;
    }
  }]);

  return FormAnalyzer;
}();

module.exports = FormAnalyzer;

},{}],6:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var isApp = false; // Do not modify or remove the next line -- the app code will replace it with `isApp = true;`
// INJECT isApp HERE

var isDDGApp = /(iPhone|iPad|Android|Mac).*DuckDuckGo\/[0-9]/i.test(window.navigator.userAgent) || isApp;
var isAndroid = isDDGApp && /Android/i.test(window.navigator.userAgent);
var DDG_DOMAIN_REGEX = new RegExp(/^https:\/\/(([a-z0-9-_]+?)\.)?duckduckgo\.com/);

var isDDGDomain = function isDDGDomain() {
  return window.origin.match(DDG_DOMAIN_REGEX);
}; // Send a message to the web app (only on DDG domains)


var notifyWebApp = function notifyWebApp(message) {
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


var sendAndWaitForAnswer = function sendAndWaitForAnswer(msgOrFn, expectedResponse) {
  if (typeof msgOrFn === 'function') {
    msgOrFn();
  } else {
    window.postMessage(msgOrFn, window.origin);
  }

  return new Promise(function (resolve) {
    var handler = function handler(e) {
      if (e.origin !== window.origin) return;
      if (!e.data || e.data && !(e.data[expectedResponse] || e.data.type === expectedResponse)) return;
      resolve(e.data);
      window.removeEventListener('message', handler);
    };

    window.addEventListener('message', handler);
  });
};
/**
 * Sends message to the webkit layer
 * @param {String} handler
 * @param {*} data
 * @returns {*}
 */


var wkSend = function wkSend(handler) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return window.webkit.messageHandlers[handler].postMessage(data);
};
/**
 * Sends message to the webkit layer and waits for the specified response
 * @param {String} handler
 * @param {*} data
 * @returns {Promise<*>}
 */


var wkSendAndWait = function wkSendAndWait(handler) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return sendAndWaitForAnswer(function () {
    return wkSend(handler, data);
  }, handler + 'Response');
}; // Access the original setter (needed to bypass React's implementation on mobile)


var originalSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; // This ensures that the value is set properly and dispatches events to simulate a real user action

var setValue = function setValue(el, val) {
  // Avoid keyboard flashing on Android
  if (!isAndroid) {
    el.focus();
  }

  originalSet.call(el, val);
  var ev = new Event('input', {
    bubbles: true
  });
  el.dispatchEvent(ev);
  el.blur();
};
/**
 * Use IntersectionObserver v2 to make sure the element is visible when clicked
 * https://developers.google.com/web/updates/2019/02/intersectionobserver-v2
 */


var safeExecute = function safeExecute(el, fn) {
  var intObs = new IntersectionObserver(function (changes) {
    var _iterator = _createForOfIteratorHelper(changes),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var change = _step.value;

        // Feature detection
        if (typeof change.isVisible === 'undefined') {
          // The browser doesn't support Intersection Observer v2, falling back to v1 behavior.
          change.isVisible = true;
        }

        if (change.isIntersecting && change.isVisible) {
          fn();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    intObs.disconnect();
  }, {
    trackVisibility: true,
    delay: 100
  });
  intObs.observe(el);
};

var getDaxBoundingBox = function getDaxBoundingBox(input) {
  var _input$getBoundingCli = input.getBoundingClientRect(),
      inputRight = _input$getBoundingCli.right,
      inputTop = _input$getBoundingCli.top,
      inputHeight = _input$getBoundingCli.height;

  var inputRightPadding = parseInt(getComputedStyle(input).paddingRight);
  var width = 30;
  var height = 30;
  var top = inputTop + (inputHeight - height) / 2;
  var right = inputRight - inputRightPadding;
  var left = right - width;
  var bottom = top + height;
  return {
    bottom: bottom,
    height: height,
    left: left,
    right: right,
    top: top,
    width: width,
    x: left,
    y: top
  };
};

var isEventWithinDax = function isEventWithinDax(e, input) {
  var _getDaxBoundingBox = getDaxBoundingBox(input),
      left = _getDaxBoundingBox.left,
      right = _getDaxBoundingBox.right,
      top = _getDaxBoundingBox.top,
      bottom = _getDaxBoundingBox.bottom;

  var withinX = e.clientX >= left && e.clientX <= right;
  var withinY = e.clientY >= top && e.clientY <= bottom;
  return withinX && withinY;
};

var addInlineStyles = function addInlineStyles(el, styles) {
  return Object.entries(styles).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        property = _ref2[0],
        val = _ref2[1];

    return el.style.setProperty(property, val, 'important');
  });
};

var removeInlineStyles = function removeInlineStyles(el, styles) {
  return Object.keys(styles).forEach(function (property) {
    return el.style.removeProperty(property);
  });
};

var ADDRESS_DOMAIN = '@duck.com';
/**
 * Given a username, returns the full email address
 * @param {string} address
 * @returns {string}
 */

var formatAddress = function formatAddress(address) {
  return address + ADDRESS_DOMAIN;
};
/**
 * Escapes any occurrences of &, ", <, > or / with XML entities.
 * @param {string} str The string to escape.
 * @return {string} The escaped string.
 */


function escapeXML(str) {
  var replacements = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
    '/': '&#x2F;'
  };
  return String(str).replace(/[&"'<>/]/g, function (m) {
    return replacements[m];
  });
}

module.exports = {
  isApp: isApp,
  isDDGApp: isDDGApp,
  isAndroid: isAndroid,
  DDG_DOMAIN_REGEX: DDG_DOMAIN_REGEX,
  isDDGDomain: isDDGDomain,
  notifyWebApp: notifyWebApp,
  sendAndWaitForAnswer: sendAndWaitForAnswer,
  wkSend: wkSend,
  wkSendAndWait: wkSendAndWait,
  setValue: setValue,
  safeExecute: safeExecute,
  getDaxBoundingBox: getDaxBoundingBox,
  isEventWithinDax: isEventWithinDax,
  addInlineStyles: addInlineStyles,
  removeInlineStyles: removeInlineStyles,
  ADDRESS_DOMAIN: ADDRESS_DOMAIN,
  formatAddress: formatAddress,
  escapeXML: escapeXML
};

},{}],7:[function(require,module,exports){
"use strict";

(function () {
  var inject = function inject() {
    // Polyfills/shims
    require('./requestIdleCallback');

    var DeviceInterface = require('./DeviceInterface');

    DeviceInterface.init();
  }; // chrome is only present in desktop browsers


  if (typeof chrome === 'undefined') {
    inject();
  } else {
    // Check if the site is marked to skip autofill
    chrome.runtime.sendMessage({
      registeredTempAutofillContentScript: true
    }, function (response) {
      var _response$site, _response$site$broken;

      if (response !== null && response !== void 0 && (_response$site = response.site) !== null && _response$site !== void 0 && (_response$site$broken = _response$site.brokenFeatures) !== null && _response$site$broken !== void 0 && _response$site$broken.includes('autofill')) return;
      inject();
    });
  }
})();

},{"./DeviceInterface":3,"./requestIdleCallback":9}],8:[function(require,module,exports){
"use strict";

var daxBase64 = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgNDQgNDQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9Ii4wMSIgc3RvcC1jb2xvcj0iIzYxNzZiOSIvPjxzdG9wIG9mZnNldD0iLjY5IiBzdG9wLWNvbG9yPSIjMzk0YTlmIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTMuOTI5NyIgeDI9IjE3LjA3MiIgeGxpbms6aHJlZj0iI2EiIHkxPSIxNi4zOTgiIHkyPSIxNi4zOTgiLz48bGluZWFyR3JhZGllbnQgaWQ9ImMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMjMuODExNSIgeDI9IjI2LjY3NTIiIHhsaW5rOmhyZWY9IiNhIiB5MT0iMTQuOTY3OSIgeTI9IjE0Ljk2NzkiLz48bWFzayBpZD0iZCIgaGVpZ2h0PSI0MCIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiB4PSIyIiB5PSIyIj48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im0yMi4wMDAzIDQxLjA2NjljMTAuNTMwMiAwIDE5LjA2NjYtOC41MzY0IDE5LjA2NjYtMTkuMDY2NiAwLTEwLjUzMDMtOC41MzY0LTE5LjA2NjcxLTE5LjA2NjYtMTkuMDY2NzEtMTAuNTMwMyAwLTE5LjA2NjcxIDguNTM2NDEtMTkuMDY2NzEgMTkuMDY2NzEgMCAxMC41MzAyIDguNTM2NDEgMTkuMDY2NiAxOS4wNjY3MSAxOS4wNjY2eiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9tYXNrPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTIyIDQ0YzEyLjE1MDMgMCAyMi05Ljg0OTcgMjItMjIgMC0xMi4xNTAyNi05Ljg0OTctMjItMjItMjItMTIuMTUwMjYgMC0yMiA5Ljg0OTc0LTIyIDIyIDAgMTIuMTUwMyA5Ljg0OTc0IDIyIDIyIDIyeiIgZmlsbD0iI2RlNTgzMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+PGcgbWFzaz0idXJsKCNkKSI+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtMjYuMDgxMyA0MS42Mzg2Yy0uOTIwMy0xLjc4OTMtMS44MDAzLTMuNDM1Ni0yLjM0NjYtNC41MjQ2LTEuNDUyLTIuOTA3Ny0yLjkxMTQtNy4wMDctMi4yNDc3LTkuNjUwNy4xMjEtLjQ4MDMtMS4zNjc3LTE3Ljc4Njk5LTIuNDItMTguMzQ0MzItMS4xNjk3LS42MjMzMy0zLjcxMDctMS40NDQ2Ny01LjAyNy0xLjY2NDY3LS45MTY3LS4xNDY2Ni0xLjEyNTcuMTEtMS41MTA3LjE2ODY3LjM2My4wMzY2NyAyLjA5Ljg4NzMzIDIuNDIzNy45MzUtLjMzMzcuMjI3MzMtMS4zMi0uMDA3MzMtMS45NTA3LjI3MTMzLS4zMTkuMTQ2NjctLjU1NzMuNjg5MzQtLjU1Ljk0NiAxLjc5NjctLjE4MzMzIDQuNjA1NC0uMDAzNjYgNi4yNy43MzMyOS0xLjMyMzYuMTUwNC0zLjMzMy4zMTktNC4xOTgzLjc3MzctMi41MDggMS4zMi0zLjYxNTMgNC40MTEtMi45NTUzIDguMTE0My42NTYzIDMuNjk2IDMuNTY0IDE3LjE3ODQgNC40OTE2IDIxLjY4MS45MjQgNC40OTkgMTEuNTUzNyAzLjU1NjcgMTAuMDE3NC41NjF6IiBmaWxsPSIjZDVkN2Q4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJtMjIuMjg2NSAyNi44NDM5Yy0uNjYgMi42NDM2Ljc5MiA2LjczOTMgMi4yNDc2IDkuNjUwNi40ODkxLjk3MjcgMS4yNDM4IDIuMzkyMSAyLjA1NTggMy45NjM3LTEuODk0LjQ2OTMtNi40ODk1IDEuMTI2NC05LjcxOTEgMC0uOTI0LTQuNDkxNy0zLjgzMTctMTcuOTc3Ny00LjQ5NTMtMjEuNjgxLS42Ni0zLjcwMzMgMC02LjM0NyAyLjUxNTMtNy42NjcuODYxNy0uNDU0NyAyLjA5MzctLjc4NDcgMy40MTM3LS45MzEzLTEuNjY0Ny0uNzQwNy0zLjYzNzQtMS4wMjY3LTUuNDQxNC0uODQzMzYtLjAwNzMtLjc2MjY3IDEuMzM4NC0uNzE4NjcgMS44NDQ0LTEuMDYzMzQtLjMzMzctLjA0NzY2LTEuMTYyNC0uNzk1NjYtMS41MjktLjgzMjMzIDIuMjg4My0uMzkyNDQgNC42NDIzLS4wMjEzOCA2LjY5OSAxLjA1NiAxLjA0ODYuNTYxIDEuNzg5MyAxLjE2MjMzIDIuMjQ3NiAxLjc5MzAzIDEuMTk1NC4yMjczIDIuMjUxNC42NiAyLjk0MDcgMS4zNDkzIDIuMTE5MyAyLjExNTcgNC4wMTEzIDYuOTUyIDMuMjE5MyA5LjczMTMtLjIyMzYuNzctLjczMzMgMS4zMzEtMS4zNzEzIDEuNzk2Ny0xLjIzOTMuOTAyLTEuMDE5My0xLjA0NS00LjEwMy45NzE3LS4zOTk3LjI2MDMtLjM5OTcgMi4yMjU2LS41MjQzIDIuNzA2eiIgZmlsbD0iI2ZmZiIvPjwvZz48ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTE2LjY3MjQgMjAuMzU0Yy43Njc1IDAgMS4zODk2LS42MjIxIDEuMzg5Ni0xLjM4OTZzLS42MjIxLTEuMzg5Ny0xLjM4OTYtMS4zODk3LTEuMzg5Ny42MjIyLTEuMzg5NyAxLjM4OTcuNjIyMiAxLjM4OTYgMS4zODk3IDEuMzg5NnoiIGZpbGw9IiMyZDRmOGUiLz48cGF0aCBkPSJtMTcuMjkyNCAxOC44NjE3Yy4xOTg1IDAgLjM1OTQtLjE2MDguMzU5NC0uMzU5M3MtLjE2MDktLjM1OTMtLjM1OTQtLjM1OTNjLS4xOTg0IDAtLjM1OTMuMTYwOC0uMzU5My4zNTkzcy4xNjA5LjM1OTMuMzU5My4zNTkzeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0yNS45NTY4IDE5LjMzMTFjLjY1ODEgMCAxLjE5MTctLjUzMzUgMS4xOTE3LTEuMTkxNyAwLS42NTgxLS41MzM2LTEuMTkxNi0xLjE5MTctMS4xOTE2cy0xLjE5MTcuNTMzNS0xLjE5MTcgMS4xOTE2YzAgLjY1ODIuNTMzNiAxLjE5MTcgMS4xOTE3IDEuMTkxN3oiIGZpbGw9IiMyZDRmOGUiLz48cGF0aCBkPSJtMjYuNDg4MiAxOC4wNTExYy4xNzAxIDAgLjMwOC0uMTM3OS4zMDgtLjMwOHMtLjEzNzktLjMwOC0uMzA4LS4zMDgtLjMwOC4xMzc5LS4zMDguMzA4LjEzNzkuMzA4LjMwOC4zMDh6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTE3LjA3MiAxNC45NDJzLTEuMDQ4Ni0uNDc2Ni0yLjA2NDMuMTY1Yy0xLjAxNTcuNjM4LS45NzkgMS4yOTA3LS45NzkgMS4yOTA3cy0uNTM5LTEuMjAyNy44OTgzLTEuNzkzYzEuNDQxLS41ODY3IDIuMTQ1LjMzNzMgMi4xNDUuMzM3M3oiIGZpbGw9InVybCgjYikiLz48cGF0aCBkPSJtMjYuNjc1MiAxNC44NDY3cy0uNzUxNy0uNDI5LTEuMzM4My0uNDIxN2MtMS4xOTkuMDE0Ny0xLjUyNTQuNTQyNy0xLjUyNTQuNTQyN3MuMjAxNy0xLjI2MTQgMS43MzQ0LTEuMDA4NGMuNDk5Ny4wOTE0LjkyMjMuNDIzNCAxLjEyOTMuODg3NHoiIGZpbGw9InVybCgjYykiLz48cGF0aCBkPSJtMjAuOTI1OCAyNC4zMjFjLjEzOTMtLjg0MzMgMi4zMS0yLjQzMSAzLjg1LTIuNTMgMS41NC0uMDk1MyAyLjAxNjctLjA3MzMgMy4zLS4zODEzIDEuMjg3LS4zMDQzIDQuNTk4LTEuMTI5MyA1LjUxMS0xLjU1NDcuOTE2Ny0uNDIxNiA0LjgwMzMuMjA5IDIuMDY0MyAxLjczOC0xLjE4NDMuNjYzNy00LjM3OCAxLjg4MS02LjY2MjMgMi41NjMtMi4yODA3LjY4Mi0zLjY2My0uNjUyNi00LjQyMi40Njk0LS42MDEzLjg5MS0uMTIxIDIuMTEyIDIuNjAzMyAyLjM2NSAzLjY4MTQuMzQxIDcuMjA4Ny0xLjY1NzQgNy41OTc0LS41OTQuMzg4NiAxLjA2MzMtMy4xNjA3IDIuMzgzMy01LjMyNCAyLjQyNzMtMi4xNjM0LjA0MDMtNi41MTk0LTEuNDMtNy4xNzItMS44ODQ3LS42NTY0LS40NTEtMS41MjU0LTEuNTE0My0xLjM0NTctMi42MTh6IiBmaWxsPSIjZmRkMjBhIi8+PHBhdGggZD0ibTI4Ljg4MjUgMzEuODM4NmMtLjc3NzMtLjE3MjQtNC4zMTIgMi41MDA2LTQuMzEyIDIuNTAwNmguMDAzN2wtLjE2NSAyLjA1MzRzNC4wNDA2IDEuNjUzNiA0LjczIDEuMzk3Yy42ODkzLS4yNjQuNTE3LTUuNzc1LS4yNTY3LTUuOTUxem0tMTEuNTQ2MyAxLjAzNGMuMDg0My0xLjExODQgNS4yNTQzIDEuNjQyNiA1LjI1NDMgMS42NDI2bC4wMDM3LS4wMDM2LjI1NjYgMi4xNTZzLTQuMzA4MyAyLjU4MTMtNC45MTMzIDIuMjM2NmMtLjYwMTMtLjM0NDYtLjY4OTMtNC45MDk2LS42MDEzLTYuMDMxNnoiIGZpbGw9IiM2NWJjNDYiLz48cGF0aCBkPSJtMjEuMzQgMzQuODA0OWMwIDEuODA3Ny0uMjYwNCAyLjU4NS41MTMzIDIuNzU3NC43NzczLjE3MjMgMi4yNDAzIDAgMi43NjEtLjM0NDcuNTEzMy0uMzQ0Ny4wODQzLTIuNjY5My0uMDg4LTMuMTAycy0zLjE5LS4wODgtMy4xOS42ODkzeiIgZmlsbD0iIzQzYTI0NCIvPjxwYXRoIGQ9Im0yMS42NzAxIDM0LjQwNTFjMCAxLjgwNzYtLjI2MDQgMi41ODEzLjUxMzMgMi43NTM2Ljc3MzcuMTc2IDIuMjM2NyAwIDIuNzU3My0uMzQ0Ni41MTctLjM0NDcuMDg4LTIuNjY5NC0uMDg0My0zLjEwMi0uMTcyMy0uNDMyNy0zLjE5LS4wODQ0LTMuMTkuNjg5M3oiIGZpbGw9IiM2NWJjNDYiLz48cGF0aCBkPSJtMjIuMDAwMiA0MC40NDgxYzEwLjE4ODUgMCAxOC40NDc5LTguMjU5NCAxOC40NDc5LTE4LjQ0NzlzLTguMjU5NC0xOC40NDc5NS0xOC40NDc5LTE4LjQ0Nzk1LTE4LjQ0Nzk1IDguMjU5NDUtMTguNDQ3OTUgMTguNDQ3OTUgOC4yNTk0NSAxOC40NDc5IDE4LjQ0Nzk1IDE4LjQ0Nzl6bTAgMS43MTg3YzExLjEzNzcgMCAyMC4xNjY2LTkuMDI4OSAyMC4xNjY2LTIwLjE2NjYgMC0xMS4xMzc4LTkuMDI4OS0yMC4xNjY3LTIwLjE2NjYtMjAuMTY2Ny0xMS4xMzc4IDAtMjAuMTY2NyA5LjAyODktMjAuMTY2NyAyMC4xNjY3IDAgMTEuMTM3NyA5LjAyODkgMjAuMTY2NiAyMC4xNjY3IDIwLjE2NjZ6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==';
module.exports = {
  daxBase64: daxBase64
};

},{}],9:[function(require,module,exports){
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
    var start = Date.now(); // eslint-disable-next-line standard/no-callback-literal

    cb({
      didTimeout: false,
      timeRemaining: function timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

window.cancelIdleCallback = window.cancelIdleCallback || function (id) {
  clearTimeout(id);
};

},{}],10:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Form = require('./Form');

var _require = require('./autofill-utils'),
    notifyWebApp = _require.notifyWebApp; // Accepts the DeviceInterface as an explicit dependency


var scanForInputs = function scanForInputs(DeviceInterface) {
  var forms = new Map();
  var EMAIL_SELECTOR = "\n            input:not([type])[name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n            input[type=\"\"][name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n            input[type=text][name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n            input:not([type])[id*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n            input:not([type])[placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n            input[type=\"\"][id*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n            input[type=text][placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n            input[type=\"\"][placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n            input:not([type])[placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n            input[type=email]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),\n            input[type=text][aria-label*=mail i],\n            input:not([type])[aria-label*=mail i],\n            input[type=text][placeholder*=mail i]:not([readonly])\n        ";

  var addInput = function addInput(input) {
    var parentForm = input.form;

    if (forms.has(parentForm)) {
      // If we've already met the form, add the input
      forms.get(parentForm).addInput(input);
    } else {
      forms.set(parentForm || input, new Form(parentForm, input, DeviceInterface.attachTooltip));
    }
  };

  var findEligibleInput = function findEligibleInput(context) {
    if (context.nodeName === 'INPUT' && context.matches(EMAIL_SELECTOR)) {
      addInput(context);
    } else {
      context.querySelectorAll(EMAIL_SELECTOR).forEach(addInput);
    }
  };

  findEligibleInput(document); // For all DOM mutations, search for new eligible inputs and update existing inputs positions

  var mutObs = new MutationObserver(function (mutationList) {
    var _iterator = _createForOfIteratorHelper(mutationList),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var mutationRecord = _step.value;

        if (mutationRecord.type === 'childList') {
          // We query only within the context of added/removed nodes
          mutationRecord.addedNodes.forEach(function (el) {
            if (el.nodeName === 'DDG-AUTOFILL') return;

            if (el instanceof HTMLElement) {
              window.requestIdleCallback(function () {
                findEligibleInput(el);
              });
            }
          });
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  mutObs.observe(document.body, {
    childList: true,
    subtree: true
  });

  var logoutHandler = function logoutHandler() {
    // remove Dax, listeners, and observers
    mutObs.disconnect();
    forms.forEach(function (form) {
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
};

module.exports = scanForInputs;

},{"./Form":4,"./autofill-utils":6}]},{},[6,7,1,2,3,4,5,8,9,10]);
