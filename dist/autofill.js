"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
  var __publicField = (obj, key2, value) => __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);

  // src/requestIdleCallback.js
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
  window.requestIdleCallback = window.requestIdleCallback || function(cb) {
    return setTimeout(function() {
      const start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };
  window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
    clearTimeout(id);
  };

  // src/config.js
  var DDG_DOMAIN_REGEX = /^https:\/\/(([a-z0-9-_]+?)\.)?duckduckgo\.com\/email/;
  function createGlobalConfig(overrides) {
    let isApp = false;
    let isTopFrame = false;
    let supportsTopFrame = false;
    let hasModernWebkitAPI = false;
    // INJECT isApp HERE
    // INJECT isTopFrame HERE
    // INJECT supportsTopFrame HERE
    // INJECT hasModernWebkitAPI HERE
    let isWindows = false;
    // INJECT isWindows HERE
    let webkitMessageHandlerNames = [];
    // INJECT webkitMessageHandlerNames HERE
    let isDDGTestMode = false;
    // INJECT isDDGTestMode HERE
    let contentScope = null;
    let userUnprotectedDomains = [];
    let userPreferences = null;
    // INJECT contentScope HERE
    // INJECT userUnprotectedDomains HERE
    // INJECT userPreferences HERE
    let availableInputTypes = null;
    // INJECT availableInputTypes HERE
    let secret = "PLACEHOLDER_SECRET";
    const isAndroid = userPreferences?.platform.name === "android";
    const isIOS = userPreferences?.platform.name === "ios";
    const isDDGApp = ["ios", "android", "macos", "windows"].includes(userPreferences?.platform.name) || isWindows;
    const isMobileApp = ["ios", "android"].includes(userPreferences?.platform.name);
    const isFirefox = navigator.userAgent.includes("Firefox");
    const isDDGDomain = Boolean(window.location.href.match(DDG_DOMAIN_REGEX));
    const isExtension = false;
    const config = {
      isApp,
      isDDGApp,
      isAndroid,
      isIOS,
      isFirefox,
      isMobileApp,
      isExtension,
      isTopFrame,
      isWindows,
      secret,
      supportsTopFrame,
      hasModernWebkitAPI,
      contentScope,
      userUnprotectedDomains,
      userPreferences,
      isDDGTestMode,
      isDDGDomain,
      availableInputTypes,
      webkitMessageHandlerNames,
      ...overrides
    };
    return config;
  }

  // src/constants.js
  var constants = {
    ATTR_INPUT_TYPE: "data-ddg-inputType",
    ATTR_AUTOFILL: "data-ddg-autofill",
    TEXT_LENGTH_CUTOFF: 100,
    MAX_INPUTS_PER_PAGE: 100,
    MAX_FORMS_PER_PAGE: 30,
    MAX_INPUTS_PER_FORM: 80,
    MAX_FORM_RESCANS: 50
  };

  // src/Form/label-util.js
  var EXCLUDED_TAGS = ["BR", "SCRIPT", "NOSCRIPT", "OPTION", "STYLE"];
  var extractElementStrings = (element) => {
    const strings = /* @__PURE__ */ new Set();
    const _extractElementStrings = (el) => {
      if (EXCLUDED_TAGS.includes(el.tagName)) {
        return;
      }
      if (el.nodeType === el.TEXT_NODE || !el.childNodes.length) {
        const trimmedText = removeExcessWhitespace(el.textContent);
        if (trimmedText) {
          strings.add(trimmedText);
        }
        return;
      }
      for (const node of el.childNodes) {
        const nodeType = node.nodeType;
        if (nodeType !== node.ELEMENT_NODE && nodeType !== node.TEXT_NODE) {
          continue;
        }
        _extractElementStrings(node);
      }
    };
    _extractElementStrings(element);
    return [...strings];
  };

  // src/Form/matching-config/__generated__/compiled-matching-config.js
  var matchingConfiguration = {
    matchers: {
      fields: {
        unknown: { type: "unknown", strategies: { ddgMatcher: "unknown" } },
        emailAddress: {
          type: "emailAddress",
          strategies: {
            cssSelector: "emailAddress",
            ddgMatcher: "emailAddress",
            vendorRegex: "email"
          }
        },
        password: {
          type: "password",
          strategies: { cssSelector: "password", ddgMatcher: "password" }
        },
        username: {
          type: "username",
          strategies: { cssSelector: "username", ddgMatcher: "username" }
        },
        firstName: {
          type: "firstName",
          strategies: {
            cssSelector: "firstName",
            ddgMatcher: "firstName",
            vendorRegex: "given-name"
          }
        },
        middleName: {
          type: "middleName",
          strategies: {
            cssSelector: "middleName",
            ddgMatcher: "middleName",
            vendorRegex: "additional-name"
          }
        },
        lastName: {
          type: "lastName",
          strategies: {
            cssSelector: "lastName",
            ddgMatcher: "lastName",
            vendorRegex: "family-name"
          }
        },
        fullName: {
          type: "fullName",
          strategies: {
            cssSelector: "fullName",
            ddgMatcher: "fullName",
            vendorRegex: "name"
          }
        },
        phone: {
          type: "phone",
          strategies: {
            cssSelector: "phone",
            ddgMatcher: "phone",
            vendorRegex: "tel"
          }
        },
        addressStreet: {
          type: "addressStreet",
          strategies: {
            cssSelector: "addressStreet",
            ddgMatcher: "addressStreet",
            vendorRegex: "address-line1"
          }
        },
        addressStreet2: {
          type: "addressStreet2",
          strategies: {
            cssSelector: "addressStreet2",
            ddgMatcher: "addressStreet2",
            vendorRegex: "address-line2"
          }
        },
        addressCity: {
          type: "addressCity",
          strategies: {
            cssSelector: "addressCity",
            ddgMatcher: "addressCity",
            vendorRegex: "address-level2"
          }
        },
        addressProvince: {
          type: "addressProvince",
          strategies: {
            cssSelector: "addressProvince",
            ddgMatcher: "addressProvince",
            vendorRegex: "address-level1"
          }
        },
        addressPostalCode: {
          type: "addressPostalCode",
          strategies: {
            cssSelector: "addressPostalCode",
            ddgMatcher: "addressPostalCode",
            vendorRegex: "postal-code"
          }
        },
        addressCountryCode: {
          type: "addressCountryCode",
          strategies: {
            cssSelector: "addressCountryCode",
            ddgMatcher: "addressCountryCode",
            vendorRegex: "country"
          }
        },
        birthdayDay: {
          type: "birthdayDay",
          strategies: { cssSelector: "birthdayDay", ddgMatcher: "birthdayDay" }
        },
        birthdayMonth: {
          type: "birthdayMonth",
          strategies: { cssSelector: "birthdayMonth", ddgMatcher: "birthdayMonth" }
        },
        birthdayYear: {
          type: "birthdayYear",
          strategies: { cssSelector: "birthdayYear", ddgMatcher: "birthdayYear" }
        },
        cardName: {
          type: "cardName",
          strategies: {
            cssSelector: "cardName",
            ddgMatcher: "cardName",
            vendorRegex: "cc-name"
          }
        },
        cardNumber: {
          type: "cardNumber",
          strategies: {
            cssSelector: "cardNumber",
            ddgMatcher: "cardNumber",
            vendorRegex: "cc-number"
          }
        },
        cardSecurityCode: {
          type: "cardSecurityCode",
          strategies: {
            cssSelector: "cardSecurityCode",
            ddgMatcher: "cardSecurityCode"
          }
        },
        expirationMonth: {
          type: "expirationMonth",
          strategies: {
            cssSelector: "expirationMonth",
            ddgMatcher: "expirationMonth",
            vendorRegex: "cc-exp-month"
          }
        },
        expirationYear: {
          type: "expirationYear",
          strategies: {
            cssSelector: "expirationYear",
            ddgMatcher: "expirationYear",
            vendorRegex: "cc-exp-year"
          }
        },
        expiration: {
          type: "expiration",
          strategies: {
            cssSelector: "expiration",
            ddgMatcher: "expiration",
            vendorRegex: "cc-exp"
          }
        }
      },
      lists: {
        unknown: ["unknown"],
        emailAddress: ["emailAddress"],
        password: ["password"],
        username: ["username"],
        cc: [
          "cardName",
          "cardNumber",
          "cardSecurityCode",
          "expirationMonth",
          "expirationYear",
          "expiration"
        ],
        id: [
          "firstName",
          "middleName",
          "lastName",
          "fullName",
          "phone",
          "addressStreet",
          "addressStreet2",
          "addressCity",
          "addressProvince",
          "addressPostalCode",
          "addressCountryCode",
          "birthdayDay",
          "birthdayMonth",
          "birthdayYear"
        ]
      }
    },
    strategies: {
      cssSelector: {
        selectors: {
          genericTextInputField: 'input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=radio]):not([type=range]):not([type=reset]):not([type=image]):not([type=search]):not([role=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week]):not([name^=fake i]):not([data-description^=dummy i]):not([name*=otp]):not([autocomplete="fake"]):not([placeholder^=search i]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=month])',
          submitButtonSelector: 'input[type=submit], input[type=button], input[type=image], button:not([role=switch]):not([role=link]):not([aria-label="clear" i]), [role=button]:not([aria-label="clear" i]), a[href="#"][id*=button i], a[href="#"][id*=btn i]',
          formInputsSelectorWithoutSelect: 'input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=radio]):not([type=range]):not([type=reset]):not([type=image]):not([type=search]):not([role=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week]):not([name^=fake i]):not([data-description^=dummy i]):not([name*=otp]):not([autocomplete="fake"]):not([placeholder^=search i]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=month]),[autocomplete=username]',
          formInputsSelector: 'input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=radio]):not([type=range]):not([type=reset]):not([type=image]):not([type=search]):not([role=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week]):not([name^=fake i]):not([data-description^=dummy i]):not([name*=otp]):not([autocomplete="fake"]):not([placeholder^=search i]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=month]),[autocomplete=username],select',
          safeUniversalSelector: "*:not(select):not(option):not(script):not(noscript):not(style):not(br)",
          emailAddress: 'input:not([type])[name*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([name*=code i]), input[type=""][name*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([type=tel]), input[type=text][name*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([name*=title i]):not([name*=tab i]):not([name*=code i]), input:not([type])[placeholder*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([name*=code i]), input[type=text][placeholder*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]), input[type=""][placeholder*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]), input[type=email], input[type=text][aria-label*=email i]:not([aria-label*=search i]), input:not([type])[aria-label*=email i]:not([aria-label*=search i]), input[name=username][type=email], input[autocomplete=username][type=email], input[autocomplete=username][placeholder*=email i], input[autocomplete=email],input[name="mail_tel" i],input[value=email i]',
          username: 'input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=radio]):not([type=range]):not([type=reset]):not([type=image]):not([type=search]):not([role=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week]):not([name^=fake i]):not([data-description^=dummy i]):not([name*=otp]):not([autocomplete="fake"]):not([placeholder^=search i]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=month])[autocomplete^=user i],input[name=username i],input[name="loginId" i],input[name="userid" i],input[id="userid" i],input[name="user_id" i],input[name="user-id" i],input[id="login-id" i],input[id="login_id" i],input[id="loginid" i],input[name="login" i],input[name=accountname i],input[autocomplete=username i],input[name*=accountid i],input[name="j_username" i],input[id="j_username" i],input[name="uwinid" i],input[name="livedoor_id" i],input[name="ssousername" i],input[name="j_userlogin_pwd" i],input[name="user[login]" i],input[name="user" i],input[name$="_username" i],input[id="lmSsoinput" i],input[name="account_subdomain" i],input[name="masterid" i],input[name="tridField" i],input[id="signInName" i],input[id="w3c_accountsbundle_accountrequeststep1_login" i],input[id="username" i],input[name="_user" i],input[name="login_username" i],input[name^="login-user-account" i],input[id="loginusuario" i],input[name="usuario" i],input[id="UserLoginFormUsername" i],input[id="nw_username" i],input[can-field="accountName"],input[name="login[username]"],input[placeholder^="username" i]',
          password: "input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code]):not([name*=answer i]):not([name*=mfa i]):not([name*=tin i]):not([name*=card i]):not([name*=cvv i]),input.js-cloudsave-phrase",
          cardName: 'input[autocomplete="cc-name" i], input[autocomplete="ccname" i], input[name="ccname" i], input[name="cc-name" i], input[name="ppw-accountHolderName" i], input[name="payment[name]"], input[id="cc-name" i], input[id="ccname" i], input[id*=cardname i], input[id*=card-name i], input[id*=card_name i]',
          cardNumber: 'input[autocomplete="cc-number" i], input[autocomplete="ccnumber" i], input[autocomplete="cardnumber" i], input[autocomplete="card-number" i], input[name="ccnumber" i], input[name="cc-number" i], input[name*=card i][name*=number i]:not([name*=verif i]):not([name*=phone i]):not([name*=secur i]), input[name*=cardnumber i], input[name="payment[card_no]"], input[id="cc-number" i], input[id="ccnumber" i], input[id*=cardnumber i], input[id*=card-number i], input[id*=card_number i]',
          cardSecurityCode: 'input[autocomplete="cc-csc" i], input[autocomplete="csc" i], input[autocomplete="cc-cvc" i], input[autocomplete="cvc" i], input[name*="cvc" i], input[name*="cvv" i], input[name="cc-cvc" i], input[name="cc-csc" i], input[name="csc" i], input[name*=security i][name*=code i], input[id="cc-csc" i], input[id="csc" i], input[id="cc-cvc" i], input[id="cvc" i]',
          expirationMonth: '[autocomplete="cc-exp-month" i], [autocomplete="cc_exp_month" i], [name="ccmonth" i], [name="ppw-expirationDate_month" i], [name=cardExpiryMonth i], [name*=ExpDate_Month i], [name*=exp i][name*=month i]:not([name*=year i]), [id*=exp i][id*=month i]:not([id*=year i]), [name*=cc-exp-month i], [name*="card_exp-month" i], [name*=cc_exp_month i], [id="cc-exp-month" i], [id="cc_exp_month" i], [id*=cc-month i]',
          expirationYear: '[autocomplete="cc-exp-year" i], [autocomplete="cc_exp_year" i], [name="ccyear" i], [name="ppw-expirationDate_year" i], [name=cardExpiryYear i], [name*=ExpDate_Year i], [name*=exp i][name*=year i]:not([name*=month i]), [id*=exp i][id*=year i]:not([id*=month i]), [name*="cc-exp-year" i], [name*="card_exp-year" i], [name*=cc_exp_year i], [id="cc-exp-year" i], [id="cc_exp_year" i], [id*=cc-year i]',
          expiration: '[autocomplete="cc-exp" i], [name="cc-exp" i], [name="exp-date" i], input[name="expiry" i], [name="expirationDate" i], input[name*=ex][placeholder="mm/yy" i], [id="cc-exp" i], input[id*=expiration i]',
          firstName: "[name*=fname i], [autocomplete*=given-name i], [name*=firstname i], [autocomplete*=firstname i], [name*=first-name i], [autocomplete*=first-name i], [name*=first_name i], [autocomplete*=first_name i], [name*=givenname i], [autocomplete*=givenname i], [name*=given-name i], [name*=given_name i], [autocomplete*=given_name i], [name*=forename i], [autocomplete*=forename i]",
          middleName: "[name*=mname i], [autocomplete*=additional-name i], [name*=middlename i], [autocomplete*=middlename i], [name*=middle-name i], [autocomplete*=middle-name i], [name*=middle_name i], [autocomplete*=middle_name i], [name*=additionalname i], [autocomplete*=additionalname i], [name*=additional-name i], [name*=additional_name i], [autocomplete*=additional_name i]",
          lastName: "[name=lname], [autocomplete*=family-name i], [name*=lastname i], [autocomplete*=lastname i], [name*=last-name i], [autocomplete*=last-name i], [name*=last_name i], [autocomplete*=last_name i], [name*=familyname i], [autocomplete*=familyname i], [name*=family-name i], [name*=family_name i], [autocomplete*=family_name i], [name*=surname i], [autocomplete*=surname i]",
          fullName: "[autocomplete=name], [name*=fullname i], [autocomplete*=fullname i], [name*=full-name i], [autocomplete*=full-name i], [name*=full_name i], [autocomplete*=full_name i], [name*=your-name i], [autocomplete*=your-name i]",
          phone: '[name*=phone i]:not([name*=extension i]):not([name*=type i]):not([name*=country i]), [name*=mobile i]:not([name*=type i]), [autocomplete=tel], [autocomplete="tel-national"], [placeholder*="phone number" i]',
          addressStreet: "[name=address i], [autocomplete=street-address i], [autocomplete=address-line1 i], [name=street i], [name=ppw-line1 i], [name*=addressLine1 i]",
          addressStreet2: "[name=address2 i], [autocomplete=address-line2 i], [name=ppw-line2 i], [name*=addressLine2 i]",
          addressCity: "[name=city i], [autocomplete=address-level2 i], [name=ppw-city i], [name*=addressCity i]",
          addressProvince: "[name=province i], [name=state i], [autocomplete=address-level1 i]",
          addressPostalCode: "[name=zip i], [name=zip2 i], [name=postal i], [autocomplete=postal-code i], [autocomplete=zip-code i], [name*=postalCode i], [name*=zipcode i]",
          addressCountryCode: "[name=country i], [autocomplete=country i], [name*=countryCode i], [name*=country-code i], [name*=countryName i], [name*=country-name i],select.idms-address-country",
          birthdayDay: '[autocomplete=bday-day i], [name=bday-day i], [name*=birthday_day i], [name*=birthday-day i], [name=date_of_birth_day i], [name=date-of-birth-day i], [name^=birthdate_d i], [name^=birthdate-d i], [aria-label="birthday" i][placeholder="day" i]',
          birthdayMonth: '[autocomplete=bday-month i], [name=bday-month i], [name*=birthday_month i], [name*=birthday-month i], [name=date_of_birth_month i], [name=date-of-birth-month i], [name^=birthdate_m i], [name^=birthdate-m i], select[name="mm" i]',
          birthdayYear: '[autocomplete=bday-year i], [name=bday-year i], [name*=birthday_year i], [name*=birthday-year i], [name=date_of_birth_year i], [name=date-of-birth-year i], [name^=birthdate_y i], [name^=birthdate-y i], [aria-label="birthday" i][placeholder="year" i]'
        }
      },
      ddgMatcher: {
        matchers: {
          unknown: {
            match: /search|find|filter|subject|title|captcha|mfa|2fa|(two|2).?factor|one-time|otp|social security number|ssn|cerca|filtr|oggetto|titolo|(due|2|più).?fattori|suche|filtern|betreff|zoeken|filter|onderwerp|titel|chercher|filtrer|objet|titre|authentification multifacteur|double authentification|à usage unique|busca|busqueda|filtra|dos pasos|un solo uso|sök|filter|ämne|multifaktorsautentisering|tvåfaktorsautentisering|två.?faktor|engångs/iu,
            skip: /phone|mobile|email|password/iu
          },
          emailAddress: {
            match: /.mail\b|apple.?id|posta elettronica|e.?mailadres|correo electr|correo-e|^correo$|\be.?post|e.?postadress/iu,
            skip: /phone|(first.?|last.?)name|number|code|\bdate\b/iu,
            forceUnknown: /search|filter|subject|title|\btab\b|otp/iu
          },
          password: {
            match: /password|passwort|kennwort|wachtwoord|mot de passe|clave|contraseña|lösenord/iu,
            skip: /email|one-time|error|hint|^username$/iu,
            forceUnknown: /search|captcha|mfa|2fa|two factor|otp|pin/iu
          },
          newPassword: { match: /new|confirm|re.?(enter|type)|repeat|update\b/iu },
          currentPassword: { match: /current|old|previous|expired|existing/iu },
          username: {
            match: /(user|account|online.?id|membership.?id|log(i|o)n|net)((.)?(name|i.?d.?|log(i|o)n).?)?(.?((or|\/).+|\*|:)( required)?)?$|(nome|id|login).?utente|(nome|id) (dell.)?account|codice (cliente|uten)|nutzername|anmeldename|gebruikersnaam|nom d.utilisateur|identifiant|pseudo|usuari|cuenta|identificador|apodo|\bdni\b|\bnie\b| del? documento|documento de identidad|användarnamn|kontonamn|användar-id/iu,
            skip: /phone/iu,
            forceUnknown: /search|policy|choose a user\b/iu
          },
          cardName: {
            match: /(card.*name|name.*card)|(card(.*)?holder|holder.*card)|(card.*owner|owner.*card)/iu,
            skip: /email|street|zip|city|state|address/iu
          },
          cardNumber: {
            match: /card.*number|number.*card/iu,
            skip: /phone/iu,
            forceUnknown: /plus/iu
          },
          cardSecurityCode: {
            match: /security.?code|card.?verif|cvv|csc|cvc|cv2|card id/iu
          },
          expirationMonth: {
            match: /(card|\bcc\b)?.?(exp(iry|iration)?)?.?(month|\bmm\b(?![.\s/-]yy))/iu,
            skip: /mm[/\s.\-_—–]|check|year/iu
          },
          expirationYear: {
            match: /(card|\bcc\b)?.?(exp(iry|iration)?)?.?(year|yy)/iu,
            skip: /mm[/\s.\-_—–]|check|month/iu
          },
          expiration: {
            match: /(\bmm\b|\b\d\d\b)[/\s.\-_—–](\byy|\bjj|\baa|\b\d\d)|\bexp|\bvalid(idity| through| until)/iu,
            skip: /invalid|^dd\/|check|street|zip|city|state|address/iu
          },
          firstName: {
            match: /(first|given|fore).?name|\bnome/iu,
            skip: /last|cognome|completo/iu
          },
          middleName: { match: /(middle|additional).?name/iu },
          lastName: {
            match: /(last|family|sur)[^i]?name|cognome/iu,
            skip: /first|\bnome/iu
          },
          fullName: {
            match: /^(full.?|whole\s|first.*last\s|real\s|contact.?)?name\b|\bnome/iu,
            forceUnknown: /company|org|item/iu
          },
          phone: {
            match: /phone|mobile|telefono|cellulare/iu,
            skip: /code|pass|country/iu,
            forceUnknown: /ext|type|otp/iu
          },
          addressStreet: {
            match: /address/iu,
            forceUnknown: /\bip\b|duck|web|url/iu,
            skip: /address.*(2|two|3|three)|email|log.?in|sign.?in|civico/iu
          },
          addressStreet2: {
            match: /address.*(2|two)|apartment|\bapt\b|\bflat\b|\bline.*(2|two)/iu,
            forceUnknown: /\bip\b|duck/iu,
            skip: /email|log.?in|sign.?in/iu
          },
          addressCity: {
            match: /city|town|città|comune/iu,
            skip: /\bzip\b|\bcap\b/iu,
            forceUnknown: /vatican/iu
          },
          addressProvince: {
            match: /state|province|region|county|provincia|regione/iu,
            forceUnknown: /united/iu,
            skip: /country/iu
          },
          addressPostalCode: {
            match: /\bzip\b|postal\b|post.?code|\bcap\b|codice postale/iu
          },
          addressCountryCode: { match: /country|\bnation\b|nazione|paese/iu },
          birthdayDay: { match: /(birth.*day|day.*birth)/iu, skip: /month|year/iu },
          birthdayMonth: { match: /(birth.*month|month.*birth)/iu, skip: /year/iu },
          birthdayYear: { match: /(birth.*year|year.*birth)/iu },
          loginRegex: {
            match: /sign(ing)?.?[io]n(?!g)|log.?[io]n|log.?out|unsubscri|(forgot(ten)?|reset) (your )?password|password( |-)(forgotten|lost|recovery)|mfa-submit-form|access.+?settings|unlock|logged in as|entra|accedi|accesso|resetta password|password dimenticata|dimenticato la password|recuper[ao] password|(ein|aus)loggen|anmeld(eformular|ung|efeld)|abmelden|passwort (vergessen|verloren)|zugang| zugangsformular|einwahl|inloggen|se (dé)?connecter|(dé)?connexion|récupérer ((mon|ton|votre|le) )?mot de passe|mot de passe (oublié|perdu)|clave(?! su)|olvidó su (clave|contraseña)|.*sesión|conect(arse|ado)|conéctate|acce(de|so)|entrar|logga (in|ut)|avprenumerera|avregistrera|glömt lösenord|återställ lösenord/iu
          },
          signupRegex: {
            match: /sign(ing)?.?up|join|\bregist(er|ration)|newsletter|\bsubscri(be|ption)|contact|create|start|enroll|settings|preferences|profile|update|checkout|purchase|buy|^order|schedule|estimate|request|new.?customer|(confirm|re.?(type|enter)|repeat) password|password confirm|iscri(viti|zione)|registra(ti|zione)|(?:nuovo|crea(?:zione)?) account|contatt(?:ac)i|sottoscriv|sottoscrizione|compra|acquist(a|o)|ordin[aeio]|richie(?:di|sta)|(?:conferma|ripeti) password|inizia|nuovo cliente|impostazioni|preferenze|profilo|aggiorna|paga|registrier(ung|en)|profil (anlegen|erstellen)| nachrichten|verteiler|neukunde|neuer (kunde|benutzer|nutzer)|passwort wiederholen|anmeldeseite|nieuwsbrief|aanmaken|profiel|s.inscrire|inscription|s.abonner|créer|préférences|profil|mise à jour|payer|ach(eter|at)| nouvel utilisateur|(confirmer|réessayer) ((mon|ton|votre|le) )?mot de passe|regis(trarse|tro)|regístrate|inscr(ibirse|ipción|íbete)|solicitar|crea(r cuenta)?|nueva cuenta|nuevo (cliente|usuario)|preferencias|perfil|lista de correo|registrer(a|ing)|(nytt|öppna) konto|nyhetsbrev|prenumer(era|ation)|kontakt|skapa|starta|inställningar|min (sida|kundvagn)|uppdatera|till kassan|gäst|köp|beställ|schemalägg|ny kund|(repetera|bekräfta) lösenord/iu
          },
          conservativeSignupRegex: {
            match: /sign.?up|join|register|enroll|(create|new).+account|newsletter|subscri(be|ption)|settings|preferences|update|iscri(viti|zione)|registra(ti|zione)|(?:nuovo|crea(?:zione)?) account|contatt(?:ac)?i|sottoscriv|sottoscrizione|impostazioni|preferenze|aggiorna|anmeld(en|ung)|registrier(en|ung)|neukunde|neuer (kunde|benutzer|nutzer)|registreren|eigenschappen|bijwerken|s.inscrire|inscription|s.abonner|abonnement|préférences|créer un compte|regis(trarse|tro)|regístrate|inscr(ibirse|ipción|íbete)|crea(r cuenta)?|nueva cuenta|nuevo (cliente|usuario)|preferencias|lista de correo|registrer(a|ing)|(nytt|öppna) konto|nyhetsbrev|prenumer(era|ation)|kontakt|skapa|starta|inställningar|min (sida|kundvagn)|uppdatera/iu
          },
          resetPasswordLink: {
            match: /(forgot(ten)?|reset|don't remember).?(your )?(password|username)|password forgotten|password dimenticata|reset(?:ta) password|recuper[ao] password|(vergessen|verloren|verlegt|wiederherstellen) passwort|wachtwoord (vergeten|reset)|(oublié|récupérer) ((mon|ton|votre|le) )?mot de passe|mot de passe (oublié|perdu)|re(iniciar|cuperar) (contraseña|clave)|olvid(ó su|aste tu|é mi) (contraseña|clave)|recordar( su)? (contraseña|clave)|glömt lösenord|återställ lösenord/iu
          },
          loginProvidersRegex: { match: / with | con | mit | met | avec /iu },
          passwordHintsRegex: {
            match: /at least (\d+|one) (character|letter|number|special|uppercase|lowercase)|must be between (\d+) and (\d+) characters/iu
          },
          submitButtonRegex: {
            match: /submit|send|confirm|save|continue|next|sign|log.?([io])n|buy|purchase|check.?out|subscribe|donate|update|\bset\b|invia|conferma|salva|continua|entra|acced|accesso|compra|paga|sottoscriv|registra|dona|senden|\bja\b|bestätigen|weiter|nächste|kaufen|bezahlen|spenden|versturen|verzenden|opslaan|volgende|koop|kopen|voeg toe|aanmelden|envoyer|confirmer|sauvegarder|continuer|suivant|signer|connexion|acheter|payer|s.abonner|donner|enviar|confirmar|registrarse|continuar|siguiente|comprar|donar|skicka|bekräfta|spara|fortsätt|nästa|logga in|köp|handla|till kassan|registrera|donera/iu
          },
          submitButtonUnlikelyRegex: {
            match: /facebook|twitter|google|apple|cancel|show|toggle|reveal|hide|print|back|already|annulla|mostra|nascondi|stampa|indietro|già|abbrechen|passwort|zeigen|verbergen|drucken|zurück|annuleer|wachtwoord|toon|vorige|annuler|mot de passe|montrer|cacher|imprimer|retour|déjà|anular|cancelar|imprimir|cerrar|avbryt|lösenord|visa|dölj|skirv ut|tillbaka|redan/iu
          }
        }
      },
      vendorRegex: {
        rules: {
          email: /((^e-?mail$)|(^email-?address$))|(e.?mail|courriel|correo.*electr(o|ó)nico|メールアドレス|электронной.?почты|邮件|邮箱|電郵地址|ഇ-മെയില്‍|ഇലക്ട്രോണിക്.?മെയിൽ|ایمیل|پست.*الکترونیک|ईमेल|इलॅक्ट्रॉनिक.?मेल|(\b|_)eposta(\b|_)|(?:이메일|전자.?우편|[ee]-?mail)(.?주소)?)/iu,
          tel: /((^phone$)|(^mobile$)|(^mobile-?phone$)|(^tel$)|(^telephone$)|(^phone-?number$))|(phone|mobile|contact.?number|telefonnummer|telefono|teléfono|telfixe|電話|telefone|telemovel|телефон|मोबाइल|(\b|_|\*)telefon(\b|_|\*)|电话|മൊബൈല്‍|(?:전화|핸드폰|휴대폰|휴대전화)(?:.?번호)?)/iu,
          organization: /((^company$)|(^company-?name$)|(^organization$)|(^organization-?name$))|(company|business|organization|organisation|empresa|societe|société|ragione.?sociale|会社|название.?компании|单位|公司|شرکت|회사|직장)/iu,
          "street-address": /((^address$)|(^street-?address$)|(^addr$)|(^street$)|(^mailing-?addr(ess)?$)|(^billing-?addr(ess)?$)|(^mail-?addr(ess)?$)|(^bill-?addr(ess)?$))|(streetaddress|street-address)/iu,
          "address-line1": /(addrline1|address_1)|((^address-?1$)|(^address-?line-?1$)|(^addr-?1$)|(^street-?1$))|(^address$|address[_-]?line[_-]?(1|one)|address1|addr1|street|(?:shipping|billing)address$|strasse|straße|hausnummer|housenumber|house.?name|direccion|dirección|adresse|indirizzo|^住所$|住所1|адрес|地址|(\b|_)adres(?! (başlığı(nız)?|tarifi))(\b|_)|^주소.?$|주소.?1)/iu,
          "address-line2": /(addrline2|address_2)|((^address-?2$)|(^address-?line-?2$)|(^addr-?2$)|(^street-?2$))|(address[_-]?line(2|two)|address2|addr2|street|suite|unit(?!e)|adresszusatz|ergänzende.?angaben|direccion2|colonia|adicional|addresssuppl|complementnom|appartement|indirizzo2|住所2|complemento|addrcomplement|улица|地址2|주소.?2)/iu,
          "address-line3": /(addrline3|address_3)|((^address-?3$)|(^address-?line-?3$)|(^addr-?3$)|(^street-?3$))|(address[_-]?line(3|three)|address3|addr3|street|suite|unit(?!e)|adresszusatz|ergänzende.?angaben|direccion3|colonia|adicional|addresssuppl|complementnom|appartement|indirizzo3|住所3|complemento|addrcomplement|улица|地址3|주소.?3)/iu,
          "address-level2": /((^city$)|(^town$)|(^address-?level-?2$)|(^address-?city$)|(^address-?town$))|(city|town|\bort\b|stadt|suburb|ciudad|provincia|localidad|poblacion|ville|commune|localit(a|à)|citt(a|à)|市区町村|cidade|город|市|分區|شهر|शहर|ग्राम|गाँव|നഗരം|ഗ്രാമം|((\b|_|\*)([i̇ii̇]l[cç]e(miz|niz)?)(\b|_|\*))|^시[^도·・]|시[·・]?군[·・]?구)/iu,
          "address-level1": /(land)|((^state$)|(^province$)|(^provence$)|(^address-?level-?1$)|(^address-?state$)|(^address-?province$))|(county|region|province|county|principality|都道府県|estado|provincia|область|省|地區|സംസ്ഥാനം|استان|राज्य|((\b|_|\*)(eyalet|[şs]ehir|[i̇ii̇]limiz|kent)(\b|_|\*))|^시[·・]?도)/iu,
          "postal-code": /((^postal$)|(^zip$)|(^zip2$)|(^zip-?code$)|(^postal-?code$)|(^post-?code$)|(^address-?zip$)|(^address-?postal$)|(^address-?code$)|(^address-?postal-?code$)|(^address-?zip-?code$))|(zip|postal|post.*code|pcode|pin.?code|postleitzahl|\bcp\b|\bcdp\b|\bcap\b|郵便番号|codigo|codpos|\bcep\b|почтовый.?индекс|पिन.?कोड|പിന്‍കോഡ്|邮政编码|邮编|郵遞區號|(\b|_)posta kodu(\b|_)|우편.?번호)/iu,
          country: /((^country$)|(^country-?code$)|(^country-?name$)|(^address-?country$)|(^address-?country-?name$)|(^address-?country-?code$))|(country|countries|país|pais|(\b|_)land(\b|_)(?!.*(mark.*))|国家|국가|나라|(\b|_)(ülke|ulce|ulke)(\b|_)|کشور)/iu,
          "cc-name": /(accountholdername|titulaire)|(cc-?name|card-?name|cardholder-?name|cardholder|cardholder(?!.*(street|zip|city|state|address))|(^nom$))|(card.?(?:holder|owner)|name.*(\b)?on(\b)?.*cardcard.?(?:holder|owner)(?!.*(street|zip|city|state|address))|name.*(\b)?on(\b)?.*card(?!.*(street|zip|city|state|address))|(?:card|cc).?name|cc.?full.?name|karteninhaber|nombre.*tarjeta|nom.*carte|nome.*cart|名前|имя.*карты|信用卡开户名|开户名|持卡人姓名|持卡人姓名)/iu,
          name: /((^name$)|full-?name|your-?name)|(^name|full.?name|your.?name|customer.?name|bill.?name|ship.?name|name.*first.*last|firstandlastname|nombre.*y.*apellidos|^nom(?!bre)\b|お名前|氏名|^nome|نام.*نام.*خانوادگی|姓名|(\b|_|\*)ad[ı]? soyad[ı]?(\b|_|\*)|성명)/iu,
          "given-name": /((^f-?name$)|(^first-?name$)|(^given-?name$)|(^first-?n$))|(first.*name|initials|fname|first$|given.*name|vorname|nombre|forename|prénom|prenom|名|\bnome|имя|نام|이름|പേര്|(\b|_|\*)(isim|ad|ad(i|ı|iniz|ınız)?)(\b|_|\*)|नाम)/iu,
          "additional-name": /(apellido.?materno|lastlastname)|((^m-?name$)|(^middle-?name$)|(^additional-?name$)|(^middle-?initial$)|(^middle-?n$)|(^middle-?i$))|(middle.*name|mname|middle$|middle.*initial|m\.i\.|mi$|\bmi\b)/iu,
          "family-name": /((^l-?name$)|(^last-?name$)|(^s-?name$)|(^surname$)|(^family-?name$)|(^family-?n$)|(^last-?n$))|(last.*name|lname|surname|last$|secondname|family.*name|nachname|apellidos?|famille|^nom(?!bre)|cognome|姓|apelidos|surename|sobrenome|фамилия|نام.*خانوادگی|उपनाम|മറുപേര്|(\b|_|\*)(soyisim|soyad(i|ı|iniz|ınız)?)(\b|_|\*)|\b성(?:[^명]|\b))/iu,
          "cc-number": /((cc|kk)nr)|(cc-?number|cc-?num|card-?number|card-?num|(^number$)|(^cc$)|cc-?no|card-?no|(^credit-?card$)|numero-?carte|(^carte$)|(^carte-?credit$)|num-?carte|cb-?num)|((add)?(?:card|cc|acct).?(?:number|#|no|num|field)|カード番号|номер.*карты|信用卡号|信用卡号码|信用卡卡號|카드|(numero|número|numéro)(?!.*(document|fono|phone|réservation)))/iu,
          "cc-exp-month": /((cc|kk)month)|((^exp-?month$)|(^cc-?exp-?month$)|(^cc-?month$)|(^card-?month$)|(^cc-?mo$)|(^card-?mo$)|(^exp-?mo$)|(^card-?exp-?mo$)|(^cc-?exp-?mo$)|(^card-?expiration-?month$)|(^expiration-?month$)|(^cc-?mm$)|(^cc-?m$)|(^card-?mm$)|(^card-?m$)|(^card-?exp-?mm$)|(^cc-?exp-?mm$)|(^exp-?mm$)|(^exp-?m$)|(^expire-?month$)|(^expire-?mo$)|(^expiry-?month$)|(^expiry-?mo$)|(^card-?expire-?month$)|(^card-?expire-?mo$)|(^card-?expiry-?month$)|(^card-?expiry-?mo$)|(^mois-?validite$)|(^mois-?expiration$)|(^m-?validite$)|(^m-?expiration$)|(^expiry-?date-?field-?month$)|(^expiration-?date-?month$)|(^expiration-?date-?mm$)|(^exp-?mon$)|(^validity-?mo$)|(^exp-?date-?mo$)|(^cb-?date-?mois$)|(^date-?m$))|(gueltig|gültig|monat|fecha|date.*exp|scadenza|有効期限|validade|срок действия карты|月)/iu,
          "cc-exp-year": /((cc|kk)year)|((^exp-?year$)|(^cc-?exp-?year$)|(^cc-?year$)|(^card-?year$)|(^cc-?yr$)|(^card-?yr$)|(^exp-?yr$)|(^card-?exp-?yr$)|(^cc-?exp-?yr$)|(^card-?expiration-?year$)|(^expiration-?year$)|(^cc-?yy$)|(^cc-?y$)|(^card-?yy$)|(^card-?y$)|(^card-?exp-?yy$)|(^cc-?exp-?yy$)|(^exp-?yy$)|(^exp-?y$)|(^cc-?yyyy$)|(^card-?yyyy$)|(^card-?exp-?yyyy$)|(^cc-?exp-?yyyy$)|(^expire-?year$)|(^expire-?yr$)|(^expiry-?year$)|(^expiry-?yr$)|(^card-?expire-?year$)|(^card-?expire-?yr$)|(^card-?expiry-?year$)|(^card-?expiry-?yr$)|(^an-?validite$)|(^an-?expiration$)|(^annee-?validite$)|(^annee-?expiration$)|(^expiry-?date-?field-?year$)|(^expiration-?date-?year$)|(^cb-?date-?ann$)|(^expiration-?date-?yy$)|(^expiration-?date-?yyyy$)|(^validity-?year$)|(^exp-?date-?year$)|(^date-?y$))|(ablaufdatum|gueltig|gültig|jahr|fecha|scadenza|有効期限|validade|срок действия карты|年|有效期)/iu,
          "cc-exp": /((^cc-?exp$)|(^card-?exp$)|(^cc-?expiration$)|(^card-?expiration$)|(^cc-?ex$)|(^card-?ex$)|(^card-?expire$)|(^card-?expiry$)|(^validite$)|(^expiration$)|(^expiry$)|mm-?yy|mm-?yyyy|yy-?mm|yyyy-?mm|expiration-?date|payment-?card-?expiration|(^payment-?cc-?date$))|(expir|exp.*date|^expfield$|gueltig|gültig|fecha|date.*exp|scadenza|有効期限|validade|срок действия карты)/iu,
          "cc-type": /(type|kartenmarke)|((^cc-?type$)|(^card-?type$)|(^card-?brand$)|(^cc-?brand$)|(^cb-?type$))/iu
        },
        ruleSets: [
          {
            "address-line1": "addrline1|address_1",
            "address-line2": "addrline2|address_2",
            "address-line3": "addrline3|address_3",
            "address-level1": "land",
            "additional-name": "apellido.?materno|lastlastname",
            "cc-name": "accountholdername|titulaire",
            "cc-number": "(cc|kk)nr",
            "cc-exp-month": "(cc|kk)month",
            "cc-exp-year": "(cc|kk)year",
            "cc-type": "type|kartenmarke"
          },
          {
            email: "(^e-?mail$)|(^email-?address$)",
            tel: "(^phone$)|(^mobile$)|(^mobile-?phone$)|(^tel$)|(^telephone$)|(^phone-?number$)",
            organization: "(^company$)|(^company-?name$)|(^organization$)|(^organization-?name$)",
            "street-address": "(^address$)|(^street-?address$)|(^addr$)|(^street$)|(^mailing-?addr(ess)?$)|(^billing-?addr(ess)?$)|(^mail-?addr(ess)?$)|(^bill-?addr(ess)?$)",
            "address-line1": "(^address-?1$)|(^address-?line-?1$)|(^addr-?1$)|(^street-?1$)",
            "address-line2": "(^address-?2$)|(^address-?line-?2$)|(^addr-?2$)|(^street-?2$)",
            "address-line3": "(^address-?3$)|(^address-?line-?3$)|(^addr-?3$)|(^street-?3$)",
            "address-level2": "(^city$)|(^town$)|(^address-?level-?2$)|(^address-?city$)|(^address-?town$)",
            "address-level1": "(^state$)|(^province$)|(^provence$)|(^address-?level-?1$)|(^address-?state$)|(^address-?province$)",
            "postal-code": "(^postal$)|(^zip$)|(^zip2$)|(^zip-?code$)|(^postal-?code$)|(^post-?code$)|(^address-?zip$)|(^address-?postal$)|(^address-?code$)|(^address-?postal-?code$)|(^address-?zip-?code$)",
            country: "(^country$)|(^country-?code$)|(^country-?name$)|(^address-?country$)|(^address-?country-?name$)|(^address-?country-?code$)",
            name: "(^name$)|full-?name|your-?name",
            "given-name": "(^f-?name$)|(^first-?name$)|(^given-?name$)|(^first-?n$)",
            "additional-name": "(^m-?name$)|(^middle-?name$)|(^additional-?name$)|(^middle-?initial$)|(^middle-?n$)|(^middle-?i$)",
            "family-name": "(^l-?name$)|(^last-?name$)|(^s-?name$)|(^surname$)|(^family-?name$)|(^family-?n$)|(^last-?n$)",
            "cc-name": "cc-?name|card-?name|cardholder-?name|cardholder|cardholder(?!.*(street|zip|city|state|address))|(^nom$)",
            "cc-number": "cc-?number|cc-?num|card-?number|card-?num|(^number$)|(^cc$)|cc-?no|card-?no|(^credit-?card$)|numero-?carte|(^carte$)|(^carte-?credit$)|num-?carte|cb-?num",
            "cc-exp": "(^cc-?exp$)|(^card-?exp$)|(^cc-?expiration$)|(^card-?expiration$)|(^cc-?ex$)|(^card-?ex$)|(^card-?expire$)|(^card-?expiry$)|(^validite$)|(^expiration$)|(^expiry$)|mm-?yy|mm-?yyyy|yy-?mm|yyyy-?mm|expiration-?date|payment-?card-?expiration|(^payment-?cc-?date$)",
            "cc-exp-month": "(^exp-?month$)|(^cc-?exp-?month$)|(^cc-?month$)|(^card-?month$)|(^cc-?mo$)|(^card-?mo$)|(^exp-?mo$)|(^card-?exp-?mo$)|(^cc-?exp-?mo$)|(^card-?expiration-?month$)|(^expiration-?month$)|(^cc-?mm$)|(^cc-?m$)|(^card-?mm$)|(^card-?m$)|(^card-?exp-?mm$)|(^cc-?exp-?mm$)|(^exp-?mm$)|(^exp-?m$)|(^expire-?month$)|(^expire-?mo$)|(^expiry-?month$)|(^expiry-?mo$)|(^card-?expire-?month$)|(^card-?expire-?mo$)|(^card-?expiry-?month$)|(^card-?expiry-?mo$)|(^mois-?validite$)|(^mois-?expiration$)|(^m-?validite$)|(^m-?expiration$)|(^expiry-?date-?field-?month$)|(^expiration-?date-?month$)|(^expiration-?date-?mm$)|(^exp-?mon$)|(^validity-?mo$)|(^exp-?date-?mo$)|(^cb-?date-?mois$)|(^date-?m$)",
            "cc-exp-year": "(^exp-?year$)|(^cc-?exp-?year$)|(^cc-?year$)|(^card-?year$)|(^cc-?yr$)|(^card-?yr$)|(^exp-?yr$)|(^card-?exp-?yr$)|(^cc-?exp-?yr$)|(^card-?expiration-?year$)|(^expiration-?year$)|(^cc-?yy$)|(^cc-?y$)|(^card-?yy$)|(^card-?y$)|(^card-?exp-?yy$)|(^cc-?exp-?yy$)|(^exp-?yy$)|(^exp-?y$)|(^cc-?yyyy$)|(^card-?yyyy$)|(^card-?exp-?yyyy$)|(^cc-?exp-?yyyy$)|(^expire-?year$)|(^expire-?yr$)|(^expiry-?year$)|(^expiry-?yr$)|(^card-?expire-?year$)|(^card-?expire-?yr$)|(^card-?expiry-?year$)|(^card-?expiry-?yr$)|(^an-?validite$)|(^an-?expiration$)|(^annee-?validite$)|(^annee-?expiration$)|(^expiry-?date-?field-?year$)|(^expiration-?date-?year$)|(^cb-?date-?ann$)|(^expiration-?date-?yy$)|(^expiration-?date-?yyyy$)|(^validity-?year$)|(^exp-?date-?year$)|(^date-?y$)",
            "cc-type": "(^cc-?type$)|(^card-?type$)|(^card-?brand$)|(^cc-?brand$)|(^cb-?type$)"
          },
          {
            email: "e.?mail|courriel|correo.*electr(o|\xF3)nico|\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9|\u042D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0439.?\u041F\u043E\u0447\u0442\u044B|\u90AE\u4EF6|\u90AE\u7BB1|\u96FB\u90F5\u5730\u5740|\u0D07-\u0D2E\u0D46\u0D2F\u0D3F\u0D32\u0D4D\u200D|\u0D07\u0D32\u0D15\u0D4D\u0D1F\u0D4D\u0D30\u0D4B\u0D23\u0D3F\u0D15\u0D4D.?\u0D2E\u0D46\u0D2F\u0D3F\u0D7D|\u0627\u06CC\u0645\u06CC\u0644|\u067E\u0633\u062A.*\u0627\u0644\u06A9\u062A\u0631\u0648\u0646\u06CC\u06A9|\u0908\u092E\u0947\u0932|\u0907\u0932\u0945\u0915\u094D\u091F\u094D\u0930\u0949\u0928\u093F\u0915.?\u092E\u0947\u0932|(\\b|_)eposta(\\b|_)|(?:\uC774\uBA54\uC77C|\uC804\uC790.?\uC6B0\uD3B8|[Ee]-?mail)(.?\uC8FC\uC18C)?",
            tel: "phone|mobile|contact.?number|telefonnummer|telefono|tel\xE9fono|telfixe|\u96FB\u8A71|telefone|telemovel|\u0442\u0435\u043B\u0435\u0444\u043E\u043D|\u092E\u094B\u092C\u093E\u0907\u0932|(\\b|_|\\*)telefon(\\b|_|\\*)|\u7535\u8BDD|\u0D2E\u0D4A\u0D2C\u0D48\u0D32\u0D4D\u200D|(?:\uC804\uD654|\uD578\uB4DC\uD3F0|\uD734\uB300\uD3F0|\uD734\uB300\uC804\uD654)(?:.?\uBC88\uD638)?",
            organization: "company|business|organization|organisation|empresa|societe|soci\xE9t\xE9|ragione.?sociale|\u4F1A\u793E|\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435.?\u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438|\u5355\u4F4D|\u516C\u53F8|\u0634\u0631\u06A9\u062A|\uD68C\uC0AC|\uC9C1\uC7A5",
            "street-address": "streetaddress|street-address",
            "address-line1": "^address$|address[_-]?line[_-]?(1|one)|address1|addr1|street|(?:shipping|billing)address$|strasse|stra\xDFe|hausnummer|housenumber|house.?name|direccion|direcci\xF3n|adresse|indirizzo|^\u4F4F\u6240$|\u4F4F\u62401|\u0410\u0434\u0440\u0435\u0441|\u5730\u5740|(\\b|_)adres(?! (ba\u015Fl\u0131\u011F\u0131(n\u0131z)?|tarifi))(\\b|_)|^\uC8FC\uC18C.?$|\uC8FC\uC18C.?1",
            "address-line2": "address[_-]?line(2|two)|address2|addr2|street|suite|unit(?!e)|adresszusatz|erg\xE4nzende.?angaben|direccion2|colonia|adicional|addresssuppl|complementnom|appartement|indirizzo2|\u4F4F\u62402|complemento|addrcomplement|\u0423\u043B\u0438\u0446\u0430|\u5730\u57402|\uC8FC\uC18C.?2",
            "address-line3": "address[_-]?line(3|three)|address3|addr3|street|suite|unit(?!e)|adresszusatz|erg\xE4nzende.?angaben|direccion3|colonia|adicional|addresssuppl|complementnom|appartement|indirizzo3|\u4F4F\u62403|complemento|addrcomplement|\u0423\u043B\u0438\u0446\u0430|\u5730\u57403|\uC8FC\uC18C.?3",
            "address-level2": "city|town|\\bort\\b|stadt|suburb|ciudad|provincia|localidad|poblacion|ville|commune|localit(a|\xE0)|citt(a|\xE0)|\u5E02\u533A\u753A\u6751|cidade|\u0413\u043E\u0440\u043E\u0434|\u5E02|\u5206\u5340|\u0634\u0647\u0631|\u0936\u0939\u0930|\u0917\u094D\u0930\u093E\u092E|\u0917\u093E\u0901\u0935|\u0D28\u0D17\u0D30\u0D02|\u0D17\u0D4D\u0D30\u0D3E\u0D2E\u0D02|((\\b|_|\\*)([\u0130ii\u0307]l[c\xE7]e(miz|niz)?)(\\b|_|\\*))|^\uC2DC[^\uB3C4\xB7\u30FB]|\uC2DC[\xB7\u30FB]?\uAD70[\xB7\u30FB]?\uAD6C",
            "address-level1": "county|region|province|county|principality|\u90FD\u9053\u5E9C\u770C|estado|provincia|\u043E\u0431\u043B\u0430\u0441\u0442\u044C|\u7701|\u5730\u5340|\u0D38\u0D02\u0D38\u0D4D\u0D25\u0D3E\u0D28\u0D02|\u0627\u0633\u062A\u0627\u0646|\u0930\u093E\u091C\u094D\u092F|((\\b|_|\\*)(eyalet|[\u015Fs]ehir|[\u0130ii\u0307]limiz|kent)(\\b|_|\\*))|^\uC2DC[\xB7\u30FB]?\uB3C4",
            "postal-code": "zip|postal|post.*code|pcode|pin.?code|postleitzahl|\\bcp\\b|\\bcdp\\b|\\bcap\\b|\u90F5\u4FBF\u756A\u53F7|codigo|codpos|\\bcep\\b|\u041F\u043E\u0447\u0442\u043E\u0432\u044B\u0439.?\u0418\u043D\u0434\u0435\u043A\u0441|\u092A\u093F\u0928.?\u0915\u094B\u0921|\u0D2A\u0D3F\u0D28\u0D4D\u200D\u0D15\u0D4B\u0D21\u0D4D|\u90AE\u653F\u7F16\u7801|\u90AE\u7F16|\u90F5\u905E\u5340\u865F|(\\b|_)posta kodu(\\b|_)|\uC6B0\uD3B8.?\uBC88\uD638",
            country: "country|countries|pa\xEDs|pais|(\\b|_)land(\\b|_)(?!.*(mark.*))|\u56FD\u5BB6|\uAD6D\uAC00|\uB098\uB77C|(\\b|_)(\xFClke|ulce|ulke)(\\b|_)|\u06A9\u0634\u0648\u0631",
            "cc-name": "card.?(?:holder|owner)|name.*(\\b)?on(\\b)?.*cardcard.?(?:holder|owner)(?!.*(street|zip|city|state|address))|name.*(\\b)?on(\\b)?.*card(?!.*(street|zip|city|state|address))|(?:card|cc).?name|cc.?full.?name|karteninhaber|nombre.*tarjeta|nom.*carte|nome.*cart|\u540D\u524D|\u0418\u043C\u044F.*\u043A\u0430\u0440\u0442\u044B|\u4FE1\u7528\u5361\u5F00\u6237\u540D|\u5F00\u6237\u540D|\u6301\u5361\u4EBA\u59D3\u540D|\u6301\u5361\u4EBA\u59D3\u540D",
            name: "^name|full.?name|your.?name|customer.?name|bill.?name|ship.?name|name.*first.*last|firstandlastname|nombre.*y.*apellidos|^nom(?!bre)\\b|\u304A\u540D\u524D|\u6C0F\u540D|^nome|\u0646\u0627\u0645.*\u0646\u0627\u0645.*\u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC|\u59D3\u540D|(\\b|_|\\*)ad[\u0131]? soyad[\u0131]?(\\b|_|\\*)|\uC131\uBA85",
            "given-name": "first.*name|initials|fname|first$|given.*name|vorname|nombre|forename|pr\xE9nom|prenom|\u540D|\\bnome|\u0418\u043C\u044F|\u0646\u0627\u0645|\uC774\uB984|\u0D2A\u0D47\u0D30\u0D4D|(\\b|_|\\*)(isim|ad|ad(i|\u0131|iniz|\u0131n\u0131z)?)(\\b|_|\\*)|\u0928\u093E\u092E",
            "additional-name": "middle.*name|mname|middle$|middle.*initial|m\\.i\\.|mi$|\\bmi\\b",
            "family-name": "last.*name|lname|surname|last$|secondname|family.*name|nachname|apellidos?|famille|^nom(?!bre)|cognome|\u59D3|apelidos|surename|sobrenome|\u0424\u0430\u043C\u0438\u043B\u0438\u044F|\u0646\u0627\u0645.*\u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC|\u0909\u092A\u0928\u093E\u092E|\u0D2E\u0D31\u0D41\u0D2A\u0D47\u0D30\u0D4D|(\\b|_|\\*)(soyisim|soyad(i|\u0131|iniz|\u0131n\u0131z)?)(\\b|_|\\*)|\\b\uC131(?:[^\uBA85]|\\b)",
            "cc-number": "(add)?(?:card|cc|acct).?(?:number|#|no|num|field)|\u30AB\u30FC\u30C9\u756A\u53F7|\u041D\u043E\u043C\u0435\u0440.*\u043A\u0430\u0440\u0442\u044B|\u4FE1\u7528\u5361\u53F7|\u4FE1\u7528\u5361\u53F7\u7801|\u4FE1\u7528\u5361\u5361\u865F|\uCE74\uB4DC|(numero|n\xFAmero|num\xE9ro)(?!.*(document|fono|phone|r\xE9servation))",
            "cc-exp-month": "gueltig|g\xFCltig|monat|fecha|date.*exp|scadenza|\u6709\u52B9\u671F\u9650|validade|\u0421\u0440\u043E\u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043A\u0430\u0440\u0442\u044B|\u6708",
            "cc-exp-year": "ablaufdatum|gueltig|g\xFCltig|jahr|fecha|scadenza|\u6709\u52B9\u671F\u9650|validade|\u0421\u0440\u043E\u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043A\u0430\u0440\u0442\u044B|\u5E74|\u6709\u6548\u671F",
            "cc-exp": "expir|exp.*date|^expfield$|gueltig|g\xFCltig|fecha|date.*exp|scadenza|\u6709\u52B9\u671F\u9650|validade|\u0421\u0440\u043E\u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043A\u0430\u0440\u0442\u044B"
          }
        ]
      }
    }
  };

  // src/Form/matching-utils.js
  function logMatching(el, matchingResult) {
    if (!shouldLog()) return;
    const fieldIdentifier = getInputIdentifier(el);
    console.group(fieldIdentifier);
    console.log(el);
    const { strategyName, matchedString, matchedFrom, matcherType } = matchingResult;
    const verb = getVerb(matchingResult);
    let stringToLog = `${verb} for "${matcherType}" with "${strategyName}"`;
    if (matchedString && matchedFrom) {
      stringToLog += `
String: "${matchedString}"
Source: "${matchedFrom}"`;
    }
    console.log(stringToLog);
    console.groupEnd();
  }
  function getVerb(matchingResult) {
    if (matchingResult.matched) return "Matched";
    if (matchingResult.proceed === false) return "Matched forceUnknown";
    if (matchingResult.skip) return "Skipped";
    return "";
  }
  function getInputIdentifier(el) {
    const label = getExplicitLabelsText(el);
    const placeholder = el instanceof HTMLInputElement && el.placeholder ? `${el.placeholder}` : "";
    const name = el.name ? `${el.name}` : "";
    const id = el.id ? `#${el.id}` : "";
    return "Field: " + (label || placeholder || name || id);
  }
  function logUnmatched(el, allStrings) {
    if (!shouldLog()) return;
    const fieldIdentifier = getInputIdentifier(el);
    console.group(fieldIdentifier);
    console.log(el);
    const stringToLog = "Field not matched.";
    console.log(stringToLog, allStrings);
    console.groupEnd();
  }

  // src/Form/matching.js
  var { TEXT_LENGTH_CUTOFF, ATTR_INPUT_TYPE } = constants;
  var dimensionBounds = {
    emailAddress: { minWidth: 35 }
  };
  var _config, _cssSelectors, _ddgMatchers, _vendorRegexRules, _matcherLists, _defaultStrategyOrder;
  var Matching = class {
    /**
     * @param {MatchingConfiguration} config
     */
    constructor(config) {
      /** @type {MatchingConfiguration} */
      __privateAdd(this, _config);
      /** @type {CssSelectorConfiguration['selectors']} */
      __privateAdd(this, _cssSelectors);
      /** @type {Record<string, DDGMatcher>} */
      __privateAdd(this, _ddgMatchers);
      /**
       * This acts as an internal cache for the larger vendorRegexes
       * @type {VendorRegexConfiguration['rules']}
       */
      __privateAdd(this, _vendorRegexRules);
      /** @type {MatcherLists} */
      __privateAdd(this, _matcherLists);
      /** @type {Array<StrategyNames>} */
      __privateAdd(this, _defaultStrategyOrder, ["cssSelector", "ddgMatcher", "vendorRegex"]);
      /** @type {Record<MatchableStrings, string>} */
      __publicField(this, "activeElementStrings", {
        nameAttr: "",
        labelText: "",
        placeholderAttr: "",
        relatedText: "",
        id: ""
      });
      /**
       * Yield strings in the order in which they should be checked against.
       *
       * Note: some strategies may not want to accept all strings, which is
       * where `matchableStrings` helps. It defaults to when you see below but can
       * be overridden.
       *
       * For example, `nameAttr` is first, since this has the highest chance of matching
       * and then the rest are in decreasing order of value vs cost
       *
       * A generator function is used here to prevent any potentially expensive
       * lookups occurring if they are rare. For example if 90% of all matching never needs
       * to look at the output from `relatedText`, then the cost of computing it will be avoided.
       *
       * @param {HTMLInputElement|HTMLSelectElement} el
       * @param {HTMLElement} form
       * @returns {Record<MatchableStrings, string>}
       */
      __publicField(this, "_elementStringCache", /* @__PURE__ */ new WeakMap());
      __privateSet(this, _config, config);
      __privateSet(this, _vendorRegexRules, __privateGet(this, _config).strategies.vendorRegex.rules);
      __privateSet(this, _cssSelectors, __privateGet(this, _config).strategies.cssSelector.selectors);
      __privateSet(this, _ddgMatchers, __privateGet(this, _config).strategies.ddgMatcher.matchers);
      __privateSet(this, _matcherLists, {
        unknown: [],
        cc: [],
        id: [],
        password: [],
        username: [],
        emailAddress: []
      });
      for (const [listName, matcherNames] of Object.entries(__privateGet(this, _config).matchers.lists)) {
        for (const fieldName of matcherNames) {
          if (!__privateGet(this, _matcherLists)[listName]) {
            __privateGet(this, _matcherLists)[listName] = [];
          }
          __privateGet(this, _matcherLists)[listName].push(__privateGet(this, _config).matchers.fields[fieldName]);
        }
      }
    }
    /**
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {HTMLElement} formEl
     */
    setActiveElementStrings(input, formEl) {
      this.activeElementStrings = this.getElementStrings(input, formEl);
    }
    /**
     * Try to access a 'vendor regex' by name
     * @param {string} regexName
     * @returns {RegExp | undefined}
     */
    vendorRegex(regexName) {
      const match = __privateGet(this, _vendorRegexRules)[regexName];
      if (!match) {
        console.warn("Vendor Regex not found for", regexName);
        return void 0;
      }
      return match;
    }
    /**
     * Strategies can have different lookup names. This returns the correct one
     * @param {MatcherTypeNames} matcherName
     * @param {StrategyNames} vendorRegex
     * @returns {MatcherTypeNames}
     */
    getStrategyLookupByType(matcherName, vendorRegex) {
      return __privateGet(this, _config).matchers.fields[matcherName]?.strategies[vendorRegex];
    }
    /**
     * Try to access a 'css selector' by name from configuration
     * @param {RequiredCssSelectors | string} selectorName
     * @returns {string};
     */
    cssSelector(selectorName) {
      const match = __privateGet(this, _cssSelectors)[selectorName];
      if (!match) {
        console.warn("CSS selector not found for %s, using a default value", selectorName);
        return "";
      }
      return match;
    }
    /**
     * Try to access a 'ddg matcher' by name from configuration
     * @param {MatcherTypeNames | string} matcherName
     * @returns {DDGMatcher | undefined}
     */
    ddgMatcher(matcherName) {
      const match = __privateGet(this, _ddgMatchers)[matcherName];
      if (!match) {
        console.warn("DDG matcher not found for", matcherName);
        return void 0;
      }
      return match;
    }
    /**
     * Returns the RegExp for the given matcherName, with proper flags
     * @param {AllDDGMatcherNames} matcherName
     * @returns {RegExp|undefined}
     */
    getDDGMatcherRegex(matcherName) {
      const matcher = this.ddgMatcher(matcherName);
      if (!matcher || !matcher.match) {
        console.warn("DDG matcher has unexpected format");
        return void 0;
      }
      return matcher?.match;
    }
    /**
     * Try to access a list of matchers by name - these are the ones collected in the constructor
     * @param {keyof MatcherLists} listName
     * @return {Matcher[]}
     */
    matcherList(listName) {
      const matcherList = __privateGet(this, _matcherLists)[listName];
      if (!matcherList) {
        console.warn("MatcherList not found for ", listName);
        return [];
      }
      return matcherList;
    }
    /**
     * Convert a list of matchers into a single CSS selector.
     *
     * This will consider all matchers in the list and if it
     * contains a CSS Selector it will be added to the final output
     *
     * @param {keyof MatcherLists} listName
     * @returns {string | undefined}
     */
    joinCssSelectors(listName) {
      const matcherList = this.matcherList(listName);
      if (!matcherList) {
        console.warn("Matcher list not found for", listName);
        return void 0;
      }
      const selectors = [];
      for (const matcher of matcherList) {
        if (matcher.strategies.cssSelector) {
          const css = this.cssSelector(matcher.strategies.cssSelector);
          if (css) {
            selectors.push(css);
          }
        }
      }
      return selectors.join(", ");
    }
    /**
     * Returns true if the field is visible and large enough
     * @param {keyof MatcherLists} matchedType
     * @param {HTMLInputElement} input
     * @returns {boolean}
     */
    isInputLargeEnough(matchedType, input) {
      const expectedDimensionBounds = dimensionBounds[matchedType];
      if (!expectedDimensionBounds) return true;
      const width = input.offsetWidth;
      const height = input.offsetHeight;
      const isHidden = height === 0 && width === 0;
      if (isHidden) return true;
      return width >= expectedDimensionBounds.minWidth;
    }
    /**
     * Tries to infer the input type for an input
     *
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {HTMLElement} formEl
     * @param {SetInputTypeOpts} [opts]
     * @returns {SupportedTypes}
     */
    inferInputType(input, formEl, opts = {}) {
      const presetType = getInputType(input);
      if (presetType !== "unknown") {
        return presetType;
      }
      this.setActiveElementStrings(input, formEl);
      if (this.subtypeFromMatchers("unknown", input)) return "unknown";
      if (opts.isCCForm) {
        const subtype = this.subtypeFromMatchers("cc", input);
        if (subtype && isValidCreditCardSubtype(subtype)) {
          return `creditCards.${subtype}`;
        }
      }
      if (input instanceof HTMLInputElement) {
        if (this.subtypeFromMatchers("password", input)) {
          if ((input.type === "password" || // Some sites might not use the password type, but a placeholder should catch those cases
          // See test-forms/playpiknik_login.html
          safeRegexTest(/password/i, input.placeholder)) && input.name !== "email" && // pcsretirement.com, improper use of the for attribute
          input.name !== "Username") {
            return this.inferPasswordVariant(input, opts);
          }
        }
        if (this.subtypeFromMatchers("emailAddress", input)) {
          if (!this.isInputLargeEnough("emailAddress", input)) {
            if (shouldLog()) {
              console.log("Field matched for Email Address, but discarded because too small when scanned");
            }
            return "unknown";
          }
          if (opts.isLogin || opts.isHybrid) {
            return "credentials.username";
          }
          if (window.location.href.includes("https://accounts.google.com/v3/signin/identifier") && input.matches("[type=email][autocomplete=username]")) {
            return "credentials.username";
          }
          return "identities.emailAddress";
        }
        if (this.subtypeFromMatchers("username", input)) {
          return "credentials.username";
        }
      }
      const idSubtype = this.subtypeFromMatchers("id", input);
      if (idSubtype && isValidIdentitiesSubtype(idSubtype)) {
        return `identities.${idSubtype}`;
      }
      logUnmatched(input, this.activeElementStrings);
      return "unknown";
    }
    /**
     * @typedef {{
     *   isLogin?: boolean,
     *   isHybrid?: boolean,
     *   isCCForm?: boolean,
     *   isSignup?: boolean,
     *   hasCredentials?: boolean,
     *   supportsIdentitiesAutofill?: boolean,
     * }} SetInputTypeOpts
     */
    /**
     * Sets the input type as a data attribute to the element and returns it
     * @param {HTMLInputElement} input
     * @param {HTMLElement} formEl
     * @param {import('../site-specific-feature.js').default | null} siteSpecificFeature
     * @param {SetInputTypeOpts} [opts]
     * @returns {SupportedSubTypes | string}
     */
    setInputType(input, formEl, siteSpecificFeature, opts = {}) {
      const forcedInputType = siteSpecificFeature?.getForcedInputType(input);
      const type = forcedInputType || this.inferInputType(input, formEl, opts);
      input.setAttribute(ATTR_INPUT_TYPE, type);
      return type;
    }
    /**
     * Tries to infer input subtype, with checks in decreasing order of reliability
     * @param {keyof MatcherLists} listName
     * @param {HTMLInputElement|HTMLSelectElement} el
     * @return {MatcherTypeNames|undefined}
     */
    subtypeFromMatchers(listName, el) {
      const matchers = this.matcherList(listName);
      for (const strategyName of __privateGet(this, _defaultStrategyOrder)) {
        let result;
        for (const matcher of matchers) {
          const lookup = matcher.strategies[strategyName];
          if (!lookup) continue;
          if (strategyName === "cssSelector") {
            result = this.execCssSelector(lookup, el);
          }
          if (strategyName === "ddgMatcher") {
            result = this.execDDGMatcher(lookup);
          }
          if (strategyName === "vendorRegex") {
            result = this.execVendorRegex(lookup);
          }
          if (result?.matched) {
            logMatching(el, result);
            return matcher.type;
          }
          if (!result?.matched && result?.proceed === false) {
            logMatching(el, result);
            return void 0;
          }
        }
        if (result?.skip) {
          logMatching(el, result);
          break;
        }
      }
      return void 0;
    }
    /**
     * Returns the password type string including the variant
     * @param {HTMLInputElement} input
     * @param opts
     * @returns {'credentials.password.new'|'credentials.password.current'}
     */
    inferPasswordVariant(input, opts) {
      const attrsToCheck = [input.autocomplete, input.name, input.id];
      if (opts.isSignup && attrsToCheck.some((str) => safeRegexTest(/new.?password|password.?new/i, str))) {
        return "credentials.password.new";
      }
      if ((opts.isLogin || opts.isHybrid) && attrsToCheck.some((str) => safeRegexTest(/(current|old|previous).?password|password.?(current|old|previous)/i, str))) {
        return "credentials.password.current";
      }
      const newPasswordMatch = this.execDDGMatcher("newPassword");
      if (newPasswordMatch.matched) {
        return "credentials.password.new";
      }
      const currentPasswordMatch = this.execDDGMatcher("currentPassword");
      if (currentPasswordMatch.matched) {
        return "credentials.password.current";
      }
      if (opts.isLogin || opts.isHybrid) {
        return "credentials.password.current";
      }
      return "credentials.password.new";
    }
    /**
     * CSS selector matching just leverages the `.matches` method on elements
     *
     * @param {MatcherTypeNames} lookup
     * @param {HTMLInputElement|HTMLSelectElement} el
     * @returns {MatchingResult}
     */
    execCssSelector(lookup, el) {
      const selector = this.cssSelector(lookup);
      return {
        matched: el.matches(selector),
        strategyName: "cssSelector",
        matcherType: lookup
      };
    }
    /**
     * A DDG Matcher can have a `match` regex along with a `not` regex. This is done
     * to allow it to be driven by configuration as it avoids needing to invoke custom functions.
     *
     * todo: maxDigits was added as an edge-case when converting this over to be declarative, but I'm
     * unsure if it's actually needed. It's not urgent, but we should consider removing it if that's the case
     *
     * @param {MatcherTypeNames} lookup
     * @returns {MatchingResult}
     */
    execDDGMatcher(lookup) {
      const defaultResult = { matched: false, strategyName: "ddgMatcher", matcherType: lookup };
      const ddgMatcher = this.ddgMatcher(lookup);
      if (!ddgMatcher || !ddgMatcher.match) {
        return defaultResult;
      }
      const matchRexExp = this.getDDGMatcherRegex(lookup);
      if (!matchRexExp) {
        return defaultResult;
      }
      const requiredScore = ["match", "forceUnknown", "maxDigits"].filter((ddgMatcherProp) => ddgMatcherProp in ddgMatcher).length;
      const matchableStrings = ddgMatcher.matchableStrings || ["labelText", "placeholderAttr", "relatedText"];
      for (const stringName of matchableStrings) {
        const elementString = this.activeElementStrings[stringName];
        if (!elementString) continue;
        let score = 0;
        const result = {
          ...defaultResult,
          matchedString: elementString,
          matchedFrom: stringName
        };
        if (ddgMatcher.forceUnknown) {
          const notRegex = ddgMatcher.forceUnknown;
          if (!notRegex) {
            return { ...result, matched: false };
          }
          if (safeRegexTest(notRegex, elementString)) {
            return { ...result, matched: false, proceed: false };
          } else {
            score++;
          }
        }
        if (ddgMatcher.skip) {
          const skipRegex = ddgMatcher.skip;
          if (!skipRegex) {
            return { ...result, matched: false };
          }
          if (safeRegexTest(skipRegex, elementString)) {
            return { ...result, matched: false, skip: true };
          }
        }
        if (!safeRegexTest(matchRexExp, elementString)) {
          continue;
        }
        score++;
        if (ddgMatcher.maxDigits) {
          const digitLength = elementString.replace(/[^0-9]/g, "").length;
          if (digitLength > ddgMatcher.maxDigits) {
            return { ...result, matched: false };
          } else {
            score++;
          }
        }
        if (score === requiredScore) {
          return { ...result, matched: true };
        }
      }
      return defaultResult;
    }
    /**
     * If we get here, a firefox/vendor regex was given and we can execute it on the element
     * strings
     * @param {MatcherTypeNames} lookup
     * @return {MatchingResult}
     */
    execVendorRegex(lookup) {
      const defaultResult = { matched: false, strategyName: "vendorRegex", matcherType: lookup };
      const regex = this.vendorRegex(lookup);
      if (!regex) {
        return defaultResult;
      }
      const stringsToMatch = ["placeholderAttr", "nameAttr", "labelText", "id", "relatedText"];
      for (const stringName of stringsToMatch) {
        const elementString = this.activeElementStrings[stringName];
        if (!elementString) continue;
        if (safeRegexTest(regex, elementString)) {
          return {
            ...defaultResult,
            matched: true,
            matchedString: elementString,
            matchedFrom: stringName
          };
        }
      }
      return defaultResult;
    }
    getElementStrings(el, form) {
      if (this._elementStringCache.has(el)) {
        return this._elementStringCache.get(el);
      }
      const explicitLabelsText = getExplicitLabelsText(el);
      const next = {
        nameAttr: el.name,
        labelText: explicitLabelsText,
        placeholderAttr: el.placeholder || "",
        id: el.id,
        relatedText: explicitLabelsText ? "" : getRelatedText(el, form, this.cssSelector("formInputsSelector"))
      };
      this._elementStringCache.set(el, next);
      return next;
    }
    clear() {
      this._elementStringCache = /* @__PURE__ */ new WeakMap();
    }
    /**
     * Only used for testing
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {HTMLElement} form
     * @returns {Matching}
     */
    forInput(input, form) {
      this.setActiveElementStrings(input, form);
      return this;
    }
  };
  _config = new WeakMap();
  _cssSelectors = new WeakMap();
  _ddgMatchers = new WeakMap();
  _vendorRegexRules = new WeakMap();
  _matcherLists = new WeakMap();
  _defaultStrategyOrder = new WeakMap();
  /**
   * @type {MatchingConfiguration}
   */
  __publicField(Matching, "emptyConfig", {
    matchers: {
      lists: {},
      fields: {}
    },
    strategies: {
      vendorRegex: {
        rules: {},
        ruleSets: []
      },
      ddgMatcher: {
        matchers: {}
      },
      cssSelector: {
        selectors: {}
      }
    }
  });
  function getInputType(input) {
    const attr = input?.getAttribute(ATTR_INPUT_TYPE);
    if (isValidSupportedType(attr)) {
      return attr;
    }
    return "unknown";
  }
  function getMainTypeFromType(type) {
    const mainType = type.split(".")[0];
    switch (mainType) {
      case "credentials":
      case "creditCards":
      case "identities":
        return mainType;
    }
    return "unknown";
  }
  var getInputMainType = (input) => getMainTypeFromType(getInputType(input));
  var supportedIdentitiesSubtypes = (
    /** @type {const} */
    [
      "emailAddress",
      "firstName",
      "middleName",
      "lastName",
      "fullName",
      "phone",
      "addressStreet",
      "addressStreet2",
      "addressCity",
      "addressProvince",
      "addressPostalCode",
      "addressCountryCode",
      "birthdayDay",
      "birthdayMonth",
      "birthdayYear"
    ]
  );
  function isValidIdentitiesSubtype(supportedType) {
    return supportedIdentitiesSubtypes.includes(supportedType);
  }
  var supportedCreditCardSubtypes = (
    /** @type {const} */
    [
      "cardName",
      "cardNumber",
      "cardSecurityCode",
      "expirationMonth",
      "expirationYear",
      "expiration"
    ]
  );
  function isValidCreditCardSubtype(supportedType) {
    return supportedCreditCardSubtypes.includes(supportedType);
  }
  var supportedCredentialsSubtypes = (
    /** @type {const} */
    ["password", "password.new", "password.current", "username"]
  );
  var supportedVariants = (
    /** @type {const} */
    ["new", "current"]
  );
  function isValidCredentialsSubtype(supportedType) {
    return supportedCredentialsSubtypes.includes(supportedType);
  }
  var supportedTypes = [
    ...supportedIdentitiesSubtypes.map((type) => `identities.${type}`),
    ...supportedCreditCardSubtypes.map((type) => `creditCards.${type}`),
    ...supportedCredentialsSubtypes.map((type) => `credentials.${type}`)
  ];
  function getSubtypeFromType(type) {
    const subType = type?.split(".")[1];
    const validType = isValidSubtype(subType);
    return validType ? subType : "unknown";
  }
  function getVariantFromType(type) {
    const variant = type?.split(".")[2];
    const validVariant = isValidVariant(variant);
    return validVariant ? variant : "";
  }
  function isValidSubtype(supportedSubType) {
    return isValidIdentitiesSubtype(supportedSubType) || isValidCreditCardSubtype(supportedSubType) || isValidCredentialsSubtype(supportedSubType);
  }
  function isValidSupportedType(supportedType) {
    return supportedTypes.includes(supportedType);
  }
  function isValidVariant(supportedVariant) {
    return supportedVariants.includes(supportedVariant);
  }
  function getInputSubtype(input) {
    const type = getInputType(input);
    return getSubtypeFromType(type);
  }
  function getInputVariant(input) {
    const type = getInputType(input);
    return getVariantFromType(type);
  }
  var removeExcessWhitespace = (string = "", textLengthCutoff = TEXT_LENGTH_CUTOFF) => {
    string = string?.trim() || "";
    if (!string || string.length > textLengthCutoff + 50) return "";
    return string.replace(/\n/g, " ").replace(/\s{2,}/g, " ");
  };
  var getExplicitLabelsText = (el) => {
    const labelTextCandidates = [];
    for (const label of el.labels || []) {
      labelTextCandidates.push(...extractElementStrings(label));
    }
    if (el.hasAttribute("aria-label")) {
      labelTextCandidates.push(removeExcessWhitespace(el.getAttribute("aria-label")));
    }
    const ariaLabelAttr = removeExcessWhitespace(el.getAttribute("aria-labelled") || el.getAttribute("aria-labelledby"));
    if (ariaLabelAttr) {
      const labelledByElement = document.getElementById(ariaLabelAttr);
      if (labelledByElement) {
        labelTextCandidates.push(...extractElementStrings(labelledByElement));
      }
    }
    const filteredLabels = labelTextCandidates.filter((string) => string.length < 65);
    if (filteredLabels.length > 0) {
      return filteredLabels.join(" ");
    }
    return "";
  };
  var recursiveGetPreviousElSibling = (el) => {
    const previousEl = el.previousElementSibling;
    if (!previousEl) return null;
    if (EXCLUDED_TAGS.includes(previousEl.tagName)) {
      return recursiveGetPreviousElSibling(previousEl);
    }
    return previousEl;
  };
  var getRelatedText = (el, form, cssSelector) => {
    let scope = getLargestMeaningfulContainer(el, form, cssSelector);
    if (scope === el) {
      const previousEl = recursiveGetPreviousElSibling(el);
      if (previousEl instanceof HTMLElement) {
        scope = previousEl;
      }
      if (scope === el || scope instanceof HTMLSelectElement) {
        if (el.previousSibling instanceof Text) {
          return removeExcessWhitespace(el.previousSibling.textContent);
        }
        return "";
      }
    }
    if (scope === el || scope instanceof HTMLSelectElement) {
      if (el.previousSibling instanceof Text) {
        return removeExcessWhitespace(el.previousSibling.textContent);
      }
      return "";
    }
    let trimmedText = "";
    const label = scope.querySelector("label");
    if (label) {
      trimmedText = extractElementStrings(label).join(" ");
    } else {
      trimmedText = extractElementStrings(scope).join(" ");
    }
    if (trimmedText.length < TEXT_LENGTH_CUTOFF) return trimmedText;
    return "";
  };
  var getLargestMeaningfulContainer = (el, form, cssSelector) => {
    const parentElement = el.parentElement;
    if (!parentElement || el === form || !cssSelector) return el;
    const inputsInParentsScope = parentElement.querySelectorAll(cssSelector);
    if (inputsInParentsScope.length === 1) {
      const labelInParentScope = parentElement.querySelector("label");
      if (labelInParentScope?.textContent?.trim()) {
        return parentElement;
      }
      return getLargestMeaningfulContainer(parentElement, form, cssSelector);
    }
    return el;
  };
  var matchInPlaceholderAndLabels = (input, regex, form, cssSelector) => {
    return input.placeholder?.match(regex) || getExplicitLabelsText(input).match(regex) || getRelatedText(input, form, cssSelector).match(regex);
  };
  var checkPlaceholderAndLabels = (input, regex, form, cssSelector) => {
    return !!matchInPlaceholderAndLabels(input, regex, form, cssSelector);
  };
  function createMatching() {
    return new Matching(matchingConfiguration);
  }

  // node_modules/@duckduckgo/content-scope-scripts/injected/src/captured-globals.js
  var Set2 = globalThis.Set;
  var Reflect2 = globalThis.Reflect;
  var customElementsGet = globalThis.customElements?.get.bind(globalThis.customElements);
  var customElementsDefine = globalThis.customElements?.define.bind(globalThis.customElements);
  var URL2 = globalThis.URL;
  var Proxy2 = globalThis.Proxy;
  var functionToString = Function.prototype.toString;
  var TypeError2 = globalThis.TypeError;
  var Symbol2 = globalThis.Symbol;
  var dispatchEvent = globalThis.dispatchEvent?.bind(globalThis);
  var addEventListener = globalThis.addEventListener?.bind(globalThis);
  var removeEventListener = globalThis.removeEventListener?.bind(globalThis);
  var CustomEvent2 = globalThis.CustomEvent;
  var Promise2 = globalThis.Promise;
  var String2 = globalThis.String;
  var Map2 = globalThis.Map;
  var Error2 = globalThis.Error;
  var randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto);

  // node_modules/@duckduckgo/content-scope-scripts/injected/src/utils.js
  var globalObj = typeof window === "undefined" ? globalThis : window;
  var Error3 = globalObj.Error;
  var originalWindowDispatchEvent = typeof window === "undefined" ? null : window.dispatchEvent.bind(window);
  function getTabHostname() {
    let framingOrigin = null;
    try {
      framingOrigin = globalThis.top.location.href;
    } catch {
      framingOrigin = globalThis.document.referrer;
    }
    if ("ancestorOrigins" in globalThis.location && globalThis.location.ancestorOrigins.length) {
      framingOrigin = globalThis.location.ancestorOrigins.item(globalThis.location.ancestorOrigins.length - 1);
    }
    try {
      framingOrigin = new URL(framingOrigin).hostname;
    } catch {
      framingOrigin = null;
    }
    return framingOrigin;
  }
  function matchHostname(hostname, exceptionDomain) {
    return hostname === exceptionDomain || hostname.endsWith(`.${exceptionDomain}`);
  }
  function camelcase(dashCaseText) {
    return dashCaseText.replace(/-(.)/g, (_, letter) => {
      return letter.toUpperCase();
    });
  }
  var DDGPromise = globalObj.Promise;
  var DDGReflect = globalObj.Reflect;
  function isUnprotectedDomain(topLevelHostname, featureList) {
    let unprotectedDomain = false;
    if (!topLevelHostname) {
      return false;
    }
    const domainParts = topLevelHostname.split(".");
    while (domainParts.length > 1 && !unprotectedDomain) {
      const partialDomain = domainParts.join(".");
      unprotectedDomain = featureList.filter((domain) => domain.domain === partialDomain).length > 0;
      domainParts.shift();
    }
    return unprotectedDomain;
  }
  function computeLimitedSiteObject() {
    const topLevelHostname = getTabHostname();
    return {
      domain: topLevelHostname
    };
  }
  function getPlatformVersion(preferences) {
    if (preferences.versionNumber) {
      return preferences.versionNumber;
    }
    if (preferences.versionString) {
      return preferences.versionString;
    }
    return void 0;
  }
  function parseVersionString(versionString) {
    return versionString.split(".").map(Number);
  }
  function satisfiesMinVersion(minVersionString, applicationVersionString) {
    const minVersions = parseVersionString(minVersionString);
    const currentVersions = parseVersionString(applicationVersionString);
    const maxLength = Math.max(minVersions.length, currentVersions.length);
    for (let i = 0; i < maxLength; i++) {
      const minNumberPart = minVersions[i] || 0;
      const currentVersionPart = currentVersions[i] || 0;
      if (currentVersionPart > minNumberPart) {
        return true;
      }
      if (currentVersionPart < minNumberPart) {
        return false;
      }
    }
    return true;
  }
  function isSupportedVersion(minSupportedVersion, currentVersion) {
    if (typeof currentVersion === "string" && typeof minSupportedVersion === "string") {
      if (satisfiesMinVersion(minSupportedVersion, currentVersion)) {
        return true;
      }
    } else if (typeof currentVersion === "number" && typeof minSupportedVersion === "number") {
      if (minSupportedVersion <= currentVersion) {
        return true;
      }
    }
    return false;
  }
  function processConfig(data, userList, preferences, platformSpecificFeatures = []) {
    const topLevelHostname = getTabHostname();
    const site = computeLimitedSiteObject();
    const allowlisted = userList.filter((domain) => domain === topLevelHostname).length > 0;
    const output = { ...preferences };
    if (output.platform) {
      const version = getPlatformVersion(preferences);
      if (version) {
        output.platform.version = version;
      }
    }
    const enabledFeatures = computeEnabledFeatures(data, topLevelHostname, preferences.platform?.version, platformSpecificFeatures);
    const isBroken = isUnprotectedDomain(topLevelHostname, data.unprotectedTemporary);
    output.site = Object.assign(site, {
      isBroken,
      allowlisted,
      enabledFeatures
    });
    output.featureSettings = parseFeatureSettings(data, enabledFeatures);
    output.bundledConfig = data;
    return output;
  }
  function computeEnabledFeatures(data, topLevelHostname, platformVersion, platformSpecificFeatures = []) {
    const remoteFeatureNames = Object.keys(data.features);
    const platformSpecificFeaturesNotInRemoteConfig = platformSpecificFeatures.filter(
      (featureName) => !remoteFeatureNames.includes(featureName)
    );
    const enabledFeatures = remoteFeatureNames.filter((featureName) => {
      const feature = data.features[featureName];
      if (feature.minSupportedVersion && platformVersion) {
        if (!isSupportedVersion(feature.minSupportedVersion, platformVersion)) {
          return false;
        }
      }
      return feature.state === "enabled" && !isUnprotectedDomain(topLevelHostname, feature.exceptions);
    }).concat(platformSpecificFeaturesNotInRemoteConfig);
    return enabledFeatures;
  }
  function parseFeatureSettings(data, enabledFeatures) {
    const featureSettings = {};
    const remoteFeatureNames = Object.keys(data.features);
    remoteFeatureNames.forEach((featureName) => {
      if (!enabledFeatures.includes(featureName)) {
        return;
      }
      featureSettings[featureName] = data.features[featureName].settings;
    });
    return featureSettings;
  }

  // src/autofill-utils.js
  var SIGN_IN_MSG = { signMeIn: true };
  var notifyWebApp = (message) => {
    window.postMessage(message, window.origin);
  };
  var sendAndWaitForAnswer = (msgOrFn, expectedResponse) => {
    if (typeof msgOrFn === "function") {
      msgOrFn();
    } else {
      window.postMessage(msgOrFn, window.origin);
    }
    return new Promise((resolve) => {
      const handler = (e) => {
        if (e.origin !== window.origin) return;
        if (!e.data || e.data && !(e.data[expectedResponse] || e.data.type === expectedResponse)) return;
        resolve(e.data);
        window.removeEventListener("message", handler);
      };
      window.addEventListener("message", handler);
    });
  };
  var autofillEnabled = (globalConfig) => {
    if (!globalConfig.contentScope) {
      return true;
    }
    if ("site" in globalConfig.contentScope) {
      const enabled = isAutofillEnabledFromProcessedConfig(globalConfig.contentScope);
      return enabled;
    }
    const { contentScope, userUnprotectedDomains, userPreferences } = globalConfig;
    if (!userPreferences) return false;
    const processedConfig = processConfig(contentScope, userUnprotectedDomains, userPreferences);
    return isAutofillEnabledFromProcessedConfig(processedConfig);
  };
  var isAutofillEnabledFromProcessedConfig = (processedConfig) => {
    const site = processedConfig.site;
    if (site.isBroken || !site.enabledFeatures.includes("autofill")) {
      if (shouldLog()) {
        console.log("\u26A0\uFE0F Autofill disabled by remote config");
      }
      return false;
    }
    return true;
  };
  var isIncontextSignupEnabledFromProcessedConfig = (processedConfig) => {
    const site = processedConfig.site;
    if (site.isBroken || !site.enabledFeatures.includes("incontextSignup")) {
      if (shouldLog()) {
        console.log("\u26A0\uFE0F In-context signup disabled by remote config");
      }
      return false;
    }
    return true;
  };
  var originalSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  var setValueForInput = (el, val, config) => {
    if (!config?.isAndroid) el.focus();
    el.dispatchEvent(new Event("keydown", { bubbles: true }));
    originalSet?.call(el, val);
    const events = [
      new Event("input", { bubbles: true }),
      // todo(Shane): Not sending a 'key' property on these events can cause exceptions on 3rd party listeners that expect it
      new Event("keyup", { bubbles: true }),
      new Event("change", { bubbles: true })
    ];
    events.forEach((ev) => el.dispatchEvent(ev));
    originalSet?.call(el, val);
    events.forEach((ev) => el.dispatchEvent(ev));
    el.blur();
    return true;
  };
  var fireEventsOnSelect = (el) => {
    const events = [
      new Event("mousedown", { bubbles: true }),
      new Event("mouseup", { bubbles: true }),
      new Event("click", { bubbles: true }),
      new Event("change", { bubbles: true })
    ];
    events.forEach((ev) => el.dispatchEvent(ev));
    events.forEach((ev) => el.dispatchEvent(ev));
    el.blur();
  };
  var setValueForSelect = (el, val) => {
    const subtype = getInputSubtype(el);
    const isMonth = subtype.includes("Month");
    const isZeroBasedNumber = isMonth && el.options[0].value === "0" && el.options.length === 12;
    const stringVal = String(val);
    const numberVal = Number(val);
    for (const option of el.options) {
      let value = option.value;
      if (isZeroBasedNumber) {
        value = `${Number(value) + 1}`;
      }
      if (value === stringVal || Number(value) === numberVal) {
        if (option.selected) return false;
        option.selected = true;
        fireEventsOnSelect(el);
        return true;
      }
    }
    for (const option of el.options) {
      if (option.innerText === stringVal || Number(option.innerText) === numberVal || safeRegexTest(new RegExp(stringVal, "i"), option.innerText)) {
        if (option.selected) return false;
        option.selected = true;
        fireEventsOnSelect(el);
        return true;
      }
    }
    return false;
  };
  var setValue = (el, val, config) => {
    if (el instanceof HTMLInputElement) return setValueForInput(el, val, config);
    if (el instanceof HTMLSelectElement) return setValueForSelect(el, val);
    return false;
  };
  var safeExecute = (el, fn, _opts = {}) => {
    const intObs = new IntersectionObserver(
      (changes) => {
        for (const change of changes) {
          if (typeof change.isVisible === "undefined") {
            change.isVisible = true;
          }
          if (change.isIntersecting) {
            fn();
          }
        }
        intObs.disconnect();
      },
      { trackVisibility: true, delay: 100 }
    );
    intObs.observe(el);
  };
  var isPotentiallyViewable = (el) => {
    const computedStyle = window.getComputedStyle(el);
    const opacity = parseFloat(computedStyle.getPropertyValue("opacity") || "1");
    const visibility = computedStyle.getPropertyValue("visibility");
    const opacityThreshold = 0.6;
    return el.clientWidth !== 0 && el.clientHeight !== 0 && opacity > opacityThreshold && visibility !== "hidden";
  };
  var getDaxBoundingBox = (input) => {
    const { right: inputRight, top: inputTop, height: inputHeight } = input.getBoundingClientRect();
    const inputRightPadding = parseInt(getComputedStyle(input).paddingRight);
    const width = 30;
    const height = 30;
    const top = inputTop + (inputHeight - height) / 2;
    const right = inputRight - inputRightPadding;
    const left = right - width;
    const bottom = top + height;
    return { bottom, height, left, right, top, width, x: left, y: top };
  };
  var isEventWithinDax = (e, input) => {
    const { left, right, top, bottom } = getDaxBoundingBox(input);
    const withinX = e.clientX >= left && e.clientX <= right;
    const withinY = e.clientY >= top && e.clientY <= bottom;
    return withinX && withinY;
  };
  var addInlineStyles = (el, styles) => Object.entries(styles).forEach(([property, val]) => el.style.setProperty(property, val, "important"));
  var removeInlineStyles = (el, styles) => Object.keys(styles).forEach((property) => el.style.removeProperty(property));
  var ADDRESS_DOMAIN = "@duck.com";
  var formatDuckAddress = (address) => address + ADDRESS_DOMAIN;
  function escapeXML(str) {
    const replacements = { "&": "&amp;", '"': "&quot;", "'": "&apos;", "<": "&lt;", ">": "&gt;", "/": "&#x2F;" };
    return String(str).replace(/[&"'<>/]/g, (m) => replacements[m]);
  }
  var isLikelyASubmitButton = (el, matching) => {
    const text = getTextShallow(el);
    const ariaLabel = el.getAttribute("aria-label") || "";
    const dataTestId = el.getAttribute("data-test-id") || "";
    if ((el.getAttribute("type") === "submit" || // is explicitly set as "submit"
    el.getAttribute("name") === "submit") && // is called "submit"
    !safeRegexTest(matching.getDDGMatcherRegex("submitButtonUnlikelyRegex"), text + " " + ariaLabel))
      return true;
    return (safeRegexTest(/primary|submit/i, el.className) || // has high-signal submit classes
    safeRegexTest(/submit/i, dataTestId) || safeRegexTest(matching.getDDGMatcherRegex("submitButtonRegex"), text) || // has high-signal text
    el.offsetHeight * el.offsetWidth >= 1e4 && !safeRegexTest(/secondary/i, el.className)) && // it's a large element 250x40px
    el.offsetHeight * el.offsetWidth >= 2e3 && // it's not a very small button like inline links and such
    !safeRegexTest(matching.getDDGMatcherRegex("submitButtonUnlikelyRegex"), text + " " + ariaLabel);
  };
  var buttonMatchesFormType = (el, formObj) => {
    if (formObj.isLogin) {
      return !safeRegexTest(/sign.?up|register|join/i, el.textContent || "");
    } else if (formObj.isSignup) {
      return !safeRegexTest(/(log|sign).?([io])n/i, el.textContent || "");
    } else {
      return true;
    }
  };
  var buttonInputTypes = ["submit", "button"];
  var getTextShallow = (el) => {
    if (el instanceof HTMLButtonElement) return removeExcessWhitespace(el.textContent);
    if (el instanceof HTMLInputElement) {
      if (buttonInputTypes.includes(el.type)) {
        return el.value;
      }
      if (el.type === "image") {
        return removeExcessWhitespace(el.alt || el.value || el.title || el.name);
      }
    }
    let text = "";
    for (const childNode of el.childNodes) {
      if (childNode instanceof Text) {
        text += " " + childNode.textContent;
      }
    }
    return removeExcessWhitespace(text);
  };
  function isLocalNetwork(hostname = window.location.hostname) {
    return ["localhost", "", "::1"].includes(hostname) || hostname.includes("127.0.0.1") || hostname.includes("192.168.") || hostname.startsWith("10.0.") || hostname.endsWith(".local") || hostname.endsWith(".internal");
  }
  var tldrs = /\.(?:c(?:o(?:m|op)?|at?|[iykgdmnxruhcfzvl])|o(?:rg|m)|n(?:et?|a(?:me)?|[ucgozrfpil])|e(?:d?u|[gechstr])|i(?:n(?:t|fo)?|[stqldroem])|m(?:o(?:bi)?|u(?:seum)?|i?l|[mcyvtsqhaerngxzfpwkd])|g(?:ov|[glqeriabtshdfmuywnp])|b(?:iz?|[drovfhtaywmzjsgbenl])|t(?:r(?:avel)?|[ncmfzdvkopthjwg]|e?l)|k[iemygznhwrp]|s[jtvberindlucygkhaozm]|u[gymszka]|h[nmutkr]|r[owesu]|d[kmzoej]|a(?:e(?:ro)?|r(?:pa)?|[qofiumsgzlwcnxdt])|p(?:ro?|[sgnthfymakwle])|v[aegiucn]|l[sayuvikcbrt]|j(?:o(?:bs)?|[mep])|w[fs]|z[amw]|f[rijkom]|y[eut]|qa)$/i;
  function isValidTLD(hostname = window.location.hostname) {
    return tldrs.test(hostname) || hostname === "fill.dev";
  }
  var wasAutofilledByChrome = (input) => {
    try {
      return input.matches("input:-internal-autofill-selected");
    } catch (e) {
      return false;
    }
  };
  function shouldLog() {
    return readDebugSetting("ddg-autofill-debug");
  }
  function shouldLogPerformance() {
    return readDebugSetting("ddg-autofill-perf");
  }
  function readDebugSetting(setting) {
    try {
      return window.sessionStorage?.getItem(setting) === "true";
    } catch (e) {
      return false;
    }
  }
  function logPerformance(markName) {
    if (shouldLogPerformance()) {
      const measurement = window.performance?.measure(`${markName}:init`, `${markName}:init:start`, `${markName}:init:end`);
      console.log(`${markName} took ${Math.round(measurement?.duration)}ms`);
      window.performance?.clearMarks();
    }
  }
  function whenIdle(callback) {
    let timer;
    return (...args) => {
      cancelIdleCallback(timer);
      timer = requestIdleCallback(() => callback.apply(this, args));
    };
  }
  function truncateFromMiddle(string, totalLength = 30) {
    if (totalLength < 4) {
      throw new Error("Do not use with strings shorter than 4");
    }
    if (string.length <= totalLength) return string;
    const truncated = string.slice(0, totalLength / 2).concat("\u2026", string.slice(totalLength / -2));
    return truncated;
  }
  function isFormLikelyToBeUsedAsPageWrapper(form) {
    if (form.parentElement !== document.body) return false;
    const formChildren = form.querySelectorAll("*").length;
    if (formChildren < 100) return false;
    const bodyChildren = document.body.querySelectorAll("*").length;
    const formChildrenPercentage = formChildren * 100 / bodyChildren;
    return formChildrenPercentage > 50;
  }
  function safeRegexTest(regex, string, textLengthCutoff = constants.TEXT_LENGTH_CUTOFF) {
    if (!string || !regex || string.length > textLengthCutoff) return false;
    return regex.test(string);
  }
  function pierceShadowTree(event, wantedTargetType) {
    const { target } = event;
    if (!(target instanceof Element) || !target?.shadowRoot || !event.composedPath) return target;
    const clickStack = event.composedPath();
    if (!wantedTargetType) {
      return clickStack[0];
    }
    return clickStack.find((el) => el instanceof wantedTargetType) || target;
  }
  function getActiveElement(root = document) {
    const activeElement = root.activeElement;
    if (!(activeElement instanceof Element) || !activeElement.shadowRoot) return activeElement;
    const innerActiveElement = activeElement.shadowRoot.activeElement;
    if (innerActiveElement?.shadowRoot) {
      return getActiveElement(innerActiveElement.shadowRoot);
    }
    return innerActiveElement;
  }
  function findElementsInShadowTree(root, selector) {
    const shadowElements = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node = walker.currentNode;
    while (node) {
      if (node instanceof HTMLElement && node.shadowRoot) {
        shadowElements.push(...node.shadowRoot.querySelectorAll(selector));
      }
      node = walker.nextNode();
    }
    return shadowElements;
  }
  function getFormControlElements(form, selector) {
    if (form instanceof HTMLFormElement && form.elements != null && Symbol.iterator in Object(form.elements)) {
      const formControls = [...form.elements].filter((el) => el.matches(selector));
      return [...formControls];
    } else {
      return null;
    }
  }
  function queryElementsWithShadow(element, selector, forceScanShadowTree = false) {
    const elements = element.querySelectorAll(selector);
    if (forceScanShadowTree || elements.length === 0) {
      return [...elements, ...findElementsInShadowTree(element, selector)];
    }
    return [...elements];
  }
  function getUsernameLikeIdentity(identities, creditCards) {
    if (identities?.emailAddress) {
      return identities.emailAddress;
    }
    if (identities && Object.keys(identities).length === 1 && Boolean(identities.phone)) {
      return identities.phone;
    }
    if (creditCards && Object.keys(creditCards).length === 1 && Boolean(creditCards.cardNumber)) {
      return creditCards.cardNumber;
    }
  }

  // src/Form/countryNames.js
  var COUNTRY_CODES_TO_NAMES = {
    AC: "Ascension Island",
    AD: "Andorra",
    AE: "United Arab Emirates",
    AF: "Afghanistan",
    AG: "Antigua & Barbuda",
    AI: "Anguilla",
    AL: "Albania",
    AM: "Armenia",
    AN: "Cura\xE7ao",
    AO: "Angola",
    AQ: "Antarctica",
    AR: "Argentina",
    AS: "American Samoa",
    AT: "Austria",
    AU: "Australia",
    AW: "Aruba",
    AX: "\xC5land Islands",
    AZ: "Azerbaijan",
    BA: "Bosnia & Herzegovina",
    BB: "Barbados",
    BD: "Bangladesh",
    BE: "Belgium",
    BF: "Burkina Faso",
    BG: "Bulgaria",
    BH: "Bahrain",
    BI: "Burundi",
    BJ: "Benin",
    BL: "St. Barth\xE9lemy",
    BM: "Bermuda",
    BN: "Brunei",
    BO: "Bolivia",
    BQ: "Caribbean Netherlands",
    BR: "Brazil",
    BS: "Bahamas",
    BT: "Bhutan",
    BU: "Myanmar (Burma)",
    BV: "Bouvet Island",
    BW: "Botswana",
    BY: "Belarus",
    BZ: "Belize",
    CA: "Canada",
    CC: "Cocos (Keeling) Islands",
    CD: "Congo - Kinshasa",
    CF: "Central African Republic",
    CG: "Congo - Brazzaville",
    CH: "Switzerland",
    CI: "C\xF4te d\u2019Ivoire",
    CK: "Cook Islands",
    CL: "Chile",
    CM: "Cameroon",
    CN: "China mainland",
    CO: "Colombia",
    CP: "Clipperton Island",
    CR: "Costa Rica",
    CS: "Serbia",
    CU: "Cuba",
    CV: "Cape Verde",
    CW: "Cura\xE7ao",
    CX: "Christmas Island",
    CY: "Cyprus",
    CZ: "Czechia",
    DD: "Germany",
    DE: "Germany",
    DG: "Diego Garcia",
    DJ: "Djibouti",
    DK: "Denmark",
    DM: "Dominica",
    DO: "Dominican Republic",
    DY: "Benin",
    DZ: "Algeria",
    EA: "Ceuta & Melilla",
    EC: "Ecuador",
    EE: "Estonia",
    EG: "Egypt",
    EH: "Western Sahara",
    ER: "Eritrea",
    ES: "Spain",
    ET: "Ethiopia",
    EU: "European Union",
    EZ: "Eurozone",
    FI: "Finland",
    FJ: "Fiji",
    FK: "Falkland Islands",
    FM: "Micronesia",
    FO: "Faroe Islands",
    FR: "France",
    FX: "France",
    GA: "Gabon",
    GB: "United Kingdom",
    GD: "Grenada",
    GE: "Georgia",
    GF: "French Guiana",
    GG: "Guernsey",
    GH: "Ghana",
    GI: "Gibraltar",
    GL: "Greenland",
    GM: "Gambia",
    GN: "Guinea",
    GP: "Guadeloupe",
    GQ: "Equatorial Guinea",
    GR: "Greece",
    GS: "So. Georgia & So. Sandwich Isl.",
    GT: "Guatemala",
    GU: "Guam",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HK: "Hong Kong",
    HM: "Heard & McDonald Islands",
    HN: "Honduras",
    HR: "Croatia",
    HT: "Haiti",
    HU: "Hungary",
    HV: "Burkina Faso",
    IC: "Canary Islands",
    ID: "Indonesia",
    IE: "Ireland",
    IL: "Israel",
    IM: "Isle of Man",
    IN: "India",
    IO: "Chagos Archipelago",
    IQ: "Iraq",
    IR: "Iran",
    IS: "Iceland",
    IT: "Italy",
    JE: "Jersey",
    JM: "Jamaica",
    JO: "Jordan",
    JP: "Japan",
    KE: "Kenya",
    KG: "Kyrgyzstan",
    KH: "Cambodia",
    KI: "Kiribati",
    KM: "Comoros",
    KN: "St. Kitts & Nevis",
    KP: "North Korea",
    KR: "South Korea",
    KW: "Kuwait",
    KY: "Cayman Islands",
    KZ: "Kazakhstan",
    LA: "Laos",
    LB: "Lebanon",
    LC: "St. Lucia",
    LI: "Liechtenstein",
    LK: "Sri Lanka",
    LR: "Liberia",
    LS: "Lesotho",
    LT: "Lithuania",
    LU: "Luxembourg",
    LV: "Latvia",
    LY: "Libya",
    MA: "Morocco",
    MC: "Monaco",
    MD: "Moldova",
    ME: "Montenegro",
    MF: "St. Martin",
    MG: "Madagascar",
    MH: "Marshall Islands",
    MK: "North Macedonia",
    ML: "Mali",
    MM: "Myanmar (Burma)",
    MN: "Mongolia",
    MO: "Macao",
    MP: "Northern Mariana Islands",
    MQ: "Martinique",
    MR: "Mauritania",
    MS: "Montserrat",
    MT: "Malta",
    MU: "Mauritius",
    MV: "Maldives",
    MW: "Malawi",
    MX: "Mexico",
    MY: "Malaysia",
    MZ: "Mozambique",
    NA: "Namibia",
    NC: "New Caledonia",
    NE: "Niger",
    NF: "Norfolk Island",
    NG: "Nigeria",
    NH: "Vanuatu",
    NI: "Nicaragua",
    NL: "Netherlands",
    NO: "Norway",
    NP: "Nepal",
    NR: "Nauru",
    NU: "Niue",
    NZ: "New Zealand",
    OM: "Oman",
    PA: "Panama",
    PE: "Peru",
    PF: "French Polynesia",
    PG: "Papua New Guinea",
    PH: "Philippines",
    PK: "Pakistan",
    PL: "Poland",
    PM: "St. Pierre & Miquelon",
    PN: "Pitcairn Islands",
    PR: "Puerto Rico",
    PS: "Palestinian Territories",
    PT: "Portugal",
    PW: "Palau",
    PY: "Paraguay",
    QA: "Qatar",
    QO: "Outlying Oceania",
    RE: "R\xE9union",
    RH: "Zimbabwe",
    RO: "Romania",
    RS: "Serbia",
    RU: "Russia",
    RW: "Rwanda",
    SA: "Saudi Arabia",
    SB: "Solomon Islands",
    SC: "Seychelles",
    SD: "Sudan",
    SE: "Sweden",
    SG: "Singapore",
    SH: "St. Helena",
    SI: "Slovenia",
    SJ: "Svalbard & Jan Mayen",
    SK: "Slovakia",
    SL: "Sierra Leone",
    SM: "San Marino",
    SN: "Senegal",
    SO: "Somalia",
    SR: "Suriname",
    SS: "South Sudan",
    ST: "S\xE3o Tom\xE9 & Pr\xEDncipe",
    SU: "Russia",
    SV: "El Salvador",
    SX: "Sint Maarten",
    SY: "Syria",
    SZ: "Eswatini",
    TA: "Tristan da Cunha",
    TC: "Turks & Caicos Islands",
    TD: "Chad",
    TF: "French Southern Territories",
    TG: "Togo",
    TH: "Thailand",
    TJ: "Tajikistan",
    TK: "Tokelau",
    TL: "Timor-Leste",
    TM: "Turkmenistan",
    TN: "Tunisia",
    TO: "Tonga",
    TP: "Timor-Leste",
    TR: "Turkey",
    TT: "Trinidad & Tobago",
    TV: "Tuvalu",
    TW: "Taiwan",
    TZ: "Tanzania",
    UA: "Ukraine",
    UG: "Uganda",
    UK: "United Kingdom",
    UM: "U.S. Outlying Islands",
    UN: "United Nations",
    US: "United States",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VA: "Vatican City",
    VC: "St. Vincent & Grenadines",
    VD: "Vietnam",
    VE: "Venezuela",
    VG: "British Virgin Islands",
    VI: "U.S. Virgin Islands",
    VN: "Vietnam",
    VU: "Vanuatu",
    WF: "Wallis & Futuna",
    WS: "Samoa",
    XA: "Pseudo-Accents",
    XB: "Pseudo-Bidi",
    XK: "Kosovo",
    YD: "Yemen",
    YE: "Yemen",
    YT: "Mayotte",
    YU: "Serbia",
    ZA: "South Africa",
    ZM: "Zambia",
    ZR: "Congo - Kinshasa",
    ZW: "Zimbabwe",
    ZZ: "Unknown Region"
  };
  var COUNTRY_NAMES_TO_CODES = {
    "Ascension Island": "AC",
    Andorra: "AD",
    "United Arab Emirates": "AE",
    Afghanistan: "AF",
    "Antigua & Barbuda": "AG",
    Anguilla: "AI",
    Albania: "AL",
    Armenia: "AM",
    Cura\u00E7ao: "CW",
    Angola: "AO",
    Antarctica: "AQ",
    Argentina: "AR",
    "American Samoa": "AS",
    Austria: "AT",
    Australia: "AU",
    Aruba: "AW",
    "\xC5land Islands": "AX",
    Azerbaijan: "AZ",
    "Bosnia & Herzegovina": "BA",
    Barbados: "BB",
    Bangladesh: "BD",
    Belgium: "BE",
    "Burkina Faso": "HV",
    Bulgaria: "BG",
    Bahrain: "BH",
    Burundi: "BI",
    Benin: "DY",
    "St. Barth\xE9lemy": "BL",
    Bermuda: "BM",
    Brunei: "BN",
    Bolivia: "BO",
    "Caribbean Netherlands": "BQ",
    Brazil: "BR",
    Bahamas: "BS",
    Bhutan: "BT",
    "Myanmar (Burma)": "MM",
    "Bouvet Island": "BV",
    Botswana: "BW",
    Belarus: "BY",
    Belize: "BZ",
    Canada: "CA",
    "Cocos (Keeling) Islands": "CC",
    "Congo - Kinshasa": "ZR",
    "Central African Republic": "CF",
    "Congo - Brazzaville": "CG",
    Switzerland: "CH",
    "C\xF4te d\u2019Ivoire": "CI",
    "Cook Islands": "CK",
    Chile: "CL",
    Cameroon: "CM",
    "China mainland": "CN",
    Colombia: "CO",
    "Clipperton Island": "CP",
    "Costa Rica": "CR",
    Serbia: "YU",
    Cuba: "CU",
    "Cape Verde": "CV",
    "Christmas Island": "CX",
    Cyprus: "CY",
    Czechia: "CZ",
    Germany: "DE",
    "Diego Garcia": "DG",
    Djibouti: "DJ",
    Denmark: "DK",
    Dominica: "DM",
    "Dominican Republic": "DO",
    Algeria: "DZ",
    "Ceuta & Melilla": "EA",
    Ecuador: "EC",
    Estonia: "EE",
    Egypt: "EG",
    "Western Sahara": "EH",
    Eritrea: "ER",
    Spain: "ES",
    Ethiopia: "ET",
    "European Union": "EU",
    Eurozone: "EZ",
    Finland: "FI",
    Fiji: "FJ",
    "Falkland Islands": "FK",
    Micronesia: "FM",
    "Faroe Islands": "FO",
    France: "FX",
    Gabon: "GA",
    "United Kingdom": "UK",
    Grenada: "GD",
    Georgia: "GE",
    "French Guiana": "GF",
    Guernsey: "GG",
    Ghana: "GH",
    Gibraltar: "GI",
    Greenland: "GL",
    Gambia: "GM",
    Guinea: "GN",
    Guadeloupe: "GP",
    "Equatorial Guinea": "GQ",
    Greece: "GR",
    "So. Georgia & So. Sandwich Isl.": "GS",
    Guatemala: "GT",
    Guam: "GU",
    "Guinea-Bissau": "GW",
    Guyana: "GY",
    "Hong Kong": "HK",
    "Heard & McDonald Islands": "HM",
    Honduras: "HN",
    Croatia: "HR",
    Haiti: "HT",
    Hungary: "HU",
    "Canary Islands": "IC",
    Indonesia: "ID",
    Ireland: "IE",
    Israel: "IL",
    "Isle of Man": "IM",
    India: "IN",
    "Chagos Archipelago": "IO",
    Iraq: "IQ",
    Iran: "IR",
    Iceland: "IS",
    Italy: "IT",
    Jersey: "JE",
    Jamaica: "JM",
    Jordan: "JO",
    Japan: "JP",
    Kenya: "KE",
    Kyrgyzstan: "KG",
    Cambodia: "KH",
    Kiribati: "KI",
    Comoros: "KM",
    "St. Kitts & Nevis": "KN",
    "North Korea": "KP",
    "South Korea": "KR",
    Kuwait: "KW",
    "Cayman Islands": "KY",
    Kazakhstan: "KZ",
    Laos: "LA",
    Lebanon: "LB",
    "St. Lucia": "LC",
    Liechtenstein: "LI",
    "Sri Lanka": "LK",
    Liberia: "LR",
    Lesotho: "LS",
    Lithuania: "LT",
    Luxembourg: "LU",
    Latvia: "LV",
    Libya: "LY",
    Morocco: "MA",
    Monaco: "MC",
    Moldova: "MD",
    Montenegro: "ME",
    "St. Martin": "MF",
    Madagascar: "MG",
    "Marshall Islands": "MH",
    "North Macedonia": "MK",
    Mali: "ML",
    Mongolia: "MN",
    Macao: "MO",
    "Northern Mariana Islands": "MP",
    Martinique: "MQ",
    Mauritania: "MR",
    Montserrat: "MS",
    Malta: "MT",
    Mauritius: "MU",
    Maldives: "MV",
    Malawi: "MW",
    Mexico: "MX",
    Malaysia: "MY",
    Mozambique: "MZ",
    Namibia: "NA",
    "New Caledonia": "NC",
    Niger: "NE",
    "Norfolk Island": "NF",
    Nigeria: "NG",
    Vanuatu: "VU",
    Nicaragua: "NI",
    Netherlands: "NL",
    Norway: "NO",
    Nepal: "NP",
    Nauru: "NR",
    Niue: "NU",
    "New Zealand": "NZ",
    Oman: "OM",
    Panama: "PA",
    Peru: "PE",
    "French Polynesia": "PF",
    "Papua New Guinea": "PG",
    Philippines: "PH",
    Pakistan: "PK",
    Poland: "PL",
    "St. Pierre & Miquelon": "PM",
    "Pitcairn Islands": "PN",
    "Puerto Rico": "PR",
    "Palestinian Territories": "PS",
    Portugal: "PT",
    Palau: "PW",
    Paraguay: "PY",
    Qatar: "QA",
    "Outlying Oceania": "QO",
    R\u00E9union: "RE",
    Zimbabwe: "ZW",
    Romania: "RO",
    Russia: "SU",
    Rwanda: "RW",
    "Saudi Arabia": "SA",
    "Solomon Islands": "SB",
    Seychelles: "SC",
    Sudan: "SD",
    Sweden: "SE",
    Singapore: "SG",
    "St. Helena": "SH",
    Slovenia: "SI",
    "Svalbard & Jan Mayen": "SJ",
    Slovakia: "SK",
    "Sierra Leone": "SL",
    "San Marino": "SM",
    Senegal: "SN",
    Somalia: "SO",
    Suriname: "SR",
    "South Sudan": "SS",
    "S\xE3o Tom\xE9 & Pr\xEDncipe": "ST",
    "El Salvador": "SV",
    "Sint Maarten": "SX",
    Syria: "SY",
    Eswatini: "SZ",
    "Tristan da Cunha": "TA",
    "Turks & Caicos Islands": "TC",
    Chad: "TD",
    "French Southern Territories": "TF",
    Togo: "TG",
    Thailand: "TH",
    Tajikistan: "TJ",
    Tokelau: "TK",
    "Timor-Leste": "TP",
    Turkmenistan: "TM",
    Tunisia: "TN",
    Tonga: "TO",
    Turkey: "TR",
    "Trinidad & Tobago": "TT",
    Tuvalu: "TV",
    Taiwan: "TW",
    Tanzania: "TZ",
    Ukraine: "UA",
    Uganda: "UG",
    "U.S. Outlying Islands": "UM",
    "United Nations": "UN",
    "United States": "US",
    Uruguay: "UY",
    Uzbekistan: "UZ",
    "Vatican City": "VA",
    "St. Vincent & Grenadines": "VC",
    Vietnam: "VN",
    Venezuela: "VE",
    "British Virgin Islands": "VG",
    "U.S. Virgin Islands": "VI",
    "Wallis & Futuna": "WF",
    Samoa: "WS",
    "Pseudo-Accents": "XA",
    "Pseudo-Bidi": "XB",
    Kosovo: "XK",
    Yemen: "YE",
    Mayotte: "YT",
    "South Africa": "ZA",
    Zambia: "ZM",
    "Unknown Region": "ZZ"
  };

  // src/Form/formatters.js
  var DATE_SEPARATOR_REGEX = /\b((.)\2{1,3}|\d+)(?<separator>\s?[/\s.\-_—–]\s?)((.)\5{1,3}|\d+)\b/i;
  var FOUR_DIGIT_YEAR_REGEX = /(\D)\1{3}|\d{4}/i;
  var formatCCYear = (input, year, form) => {
    const selector = form.matching.cssSelector("formInputsSelector");
    if (input.maxLength === 4 || checkPlaceholderAndLabels(input, FOUR_DIGIT_YEAR_REGEX, form.form, selector)) return year;
    return `${Number(year) - 2e3}`;
  };
  var getUnifiedExpiryDate = (input, month, year, form) => {
    const formattedYear = formatCCYear(input, year, form);
    const paddedMonth = `${month}`.padStart(2, "0");
    const cssSelector = form.matching.cssSelector("formInputsSelector");
    const separator = matchInPlaceholderAndLabels(input, DATE_SEPARATOR_REGEX, form.form, cssSelector)?.groups?.separator || "/";
    return `${paddedMonth}${separator}${formattedYear}`;
  };
  var formatFullName = ({ firstName = "", middleName = "", lastName = "" }) => `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim();
  var getCountryDisplayName = (locale, addressCountryCode) => {
    try {
      const regionNames = new Intl.DisplayNames([locale], { type: "region" });
      return regionNames.of(addressCountryCode);
    } catch (e) {
      return COUNTRY_CODES_TO_NAMES[addressCountryCode] || addressCountryCode;
    }
  };
  var inferElementLocale = (el) => el.lang || el.form?.lang || document.body.lang || document.documentElement.lang || "en";
  var getCountryName = (el, options = {}) => {
    const { addressCountryCode } = options;
    if (!addressCountryCode) return "";
    const elLocale = inferElementLocale(el);
    const localisedCountryName = getCountryDisplayName(elLocale, addressCountryCode);
    if (el.nodeName === "SELECT") {
      const englishCountryName = getCountryDisplayName("en", addressCountryCode);
      const countryNameRegex = new RegExp(
        String.raw`${localisedCountryName.replace(/ /g, ".?")}|${englishCountryName.replace(/ /g, ".?")}`,
        "i"
      );
      const countryCodeRegex = new RegExp(String.raw`\b${addressCountryCode}\b`, "i");
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
  var getLocalisedCountryNamesToCodes = (el) => {
    if (typeof Intl.DisplayNames !== "function") return COUNTRY_NAMES_TO_CODES;
    const elLocale = inferElementLocale(el);
    return Object.fromEntries(Object.entries(COUNTRY_CODES_TO_NAMES).map(([code]) => [getCountryDisplayName(elLocale, code), code]));
  };
  var inferCountryCodeFromElement = (el) => {
    if (COUNTRY_CODES_TO_NAMES[el.value]) return el.value;
    if (COUNTRY_NAMES_TO_CODES[el.value]) return COUNTRY_NAMES_TO_CODES[el.value];
    const localisedCountryNamesToCodes = getLocalisedCountryNamesToCodes(el);
    if (localisedCountryNamesToCodes[el.value]) return localisedCountryNamesToCodes[el.value];
    if (el instanceof HTMLSelectElement) {
      const selectedText = el.selectedOptions[0]?.text;
      if (COUNTRY_CODES_TO_NAMES[selectedText]) return selectedText;
      if (COUNTRY_NAMES_TO_CODES[selectedText]) return localisedCountryNamesToCodes[selectedText];
      if (localisedCountryNamesToCodes[selectedText]) return localisedCountryNamesToCodes[selectedText];
    }
    return "";
  };
  var getMMAndYYYYFromString = (expiration) => {
    const values = expiration.match(/(\d+)/g) || [];
    return values?.reduce(
      (output, current) => {
        if (Number(current) > 12) {
          output.expirationYear = current.padStart(4, "20");
        } else {
          output.expirationMonth = current.padStart(2, "0");
        }
        return output;
      },
      { expirationYear: "", expirationMonth: "" }
    );
  };
  var shouldStoreIdentities = ({ identities }) => Boolean((identities.firstName || identities.fullName) && identities.addressStreet && identities.addressCity);
  var shouldStoreCreditCards = ({ creditCards }) => {
    if (!creditCards.cardNumber) return false;
    if (creditCards.cardSecurityCode) return true;
    if (creditCards.expiration) return true;
    return Boolean(creditCards.expirationYear && creditCards.expirationMonth);
  };
  var formatPhoneNumber = (phone) => phone.replaceAll(/[^0-9|+]/g, "");
  var inferCredentialsForPartialSave = (credentials, identities, creditCards) => {
    if (!credentials.username) {
      const possibleUsername = getUsernameLikeIdentity(identities, creditCards);
      if (possibleUsername) credentials.username = possibleUsername;
    }
    if (Object.keys(credentials ?? {}).length === 0) {
      return void 0;
    }
    return credentials;
  };
  var inferCredentials = (credentials, identities, creditCards) => {
    if (!credentials.password) {
      return void 0;
    }
    if (credentials.password && !credentials.username) {
      credentials.username = getUsernameLikeIdentity(identities, creditCards);
    }
    return credentials;
  };
  var prepareFormValuesForStorage = (formValues, canTriggerPartialSave = false) => {
    let { credentials, identities, creditCards } = formValues;
    if (!creditCards.cardName && (identities?.fullName || identities?.firstName)) {
      creditCards.cardName = identities?.fullName || formatFullName(identities);
    }
    credentials = canTriggerPartialSave ? inferCredentialsForPartialSave(credentials, identities, creditCards) : inferCredentials(credentials, identities, creditCards);
    if (shouldStoreIdentities(formValues)) {
      if (identities.fullName) {
        if (!(identities.firstName && identities.lastName)) {
          const nameParts = identities.fullName.trim().split(/\s+/);
          if (nameParts.length === 2) {
            identities.firstName = nameParts[0];
            identities.lastName = nameParts[1];
          } else {
            identities.firstName = identities.fullName;
          }
        }
        delete identities.fullName;
      }
      if (identities.phone) {
        identities.phone = formatPhoneNumber(identities.phone);
      }
    } else {
      identities = void 0;
    }
    if (shouldStoreCreditCards(formValues)) {
      if (creditCards.expiration) {
        const { expirationMonth, expirationYear } = getMMAndYYYYFromString(creditCards.expiration);
        creditCards.expirationMonth = expirationMonth;
        creditCards.expirationYear = expirationYear;
        delete creditCards.expiration;
      }
      creditCards.expirationYear = creditCards.expirationYear?.padStart(4, "20");
      if (creditCards.cardNumber) {
        creditCards.cardNumber = creditCards.cardNumber.replace(/\D/g, "");
      }
    } else {
      creditCards = void 0;
    }
    return { credentials, identities, creditCards };
  };

  // src/InputTypes/Credentials.js
  var AUTOGENERATED_KEY = "autogenerated";
  var PROVIDER_LOCKED = "provider_locked";
  var _data;
  var CredentialsTooltipItem = class {
    /** @param {CredentialsObject} data */
    constructor(data) {
      /** @type {CredentialsObject} */
      __privateAdd(this, _data);
      __publicField(this, "id", () => String(__privateGet(this, _data).id));
      /** @param {import('../locales/strings.js').TranslateFn} t */
      __publicField(this, "labelMedium", (t) => {
        if (__privateGet(this, _data).username) {
          return __privateGet(this, _data).username;
        }
        if (__privateGet(this, _data).origin?.url) {
          return t("autofill:passwordForUrl", { url: truncateFromMiddle(__privateGet(this, _data).origin.url) });
        }
        return "";
      });
      __publicField(this, "labelSmall", () => {
        if (__privateGet(this, _data).origin?.url) {
          return truncateFromMiddle(__privateGet(this, _data).origin.url);
        }
        return "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022";
      });
      __publicField(this, "credentialsProvider", () => __privateGet(this, _data).credentialsProvider);
      __privateSet(this, _data, data);
    }
  };
  _data = new WeakMap();
  var _data2;
  var AutoGeneratedCredential = class {
    /** @param {CredentialsObject} data */
    constructor(data) {
      /** @type {CredentialsObject} */
      __privateAdd(this, _data2);
      __publicField(this, "id", () => String(__privateGet(this, _data2).id));
      __publicField(this, "label", (_subtype) => __privateGet(this, _data2).password);
      /** @param {import('../locales/strings.js').TranslateFn} t */
      __publicField(this, "labelMedium", (t) => t("autofill:generatedPassword"));
      /** @param {import('../locales/strings.js').TranslateFn} t */
      __publicField(this, "labelSmall", (t) => t("autofill:passwordWillBeSaved"));
      __privateSet(this, _data2, data);
    }
  };
  _data2 = new WeakMap();
  function fromPassword(password, username) {
    return {
      [AUTOGENERATED_KEY]: true,
      password,
      username
    };
  }
  var _data3;
  var ProviderLockedItem = class {
    /** @param {CredentialsObject} data */
    constructor(data) {
      /** @type {CredentialsObject} */
      __privateAdd(this, _data3);
      __publicField(this, "id", () => String(__privateGet(this, _data3).id));
      /** @param {import('../locales/strings.js').TranslateFn} t */
      __publicField(this, "labelMedium", (t) => t("autofill:bitwardenIsLocked"));
      /** @param {import('../locales/strings.js').TranslateFn} t */
      __publicField(this, "labelSmall", (t) => t("autofill:unlockYourVault"));
      __publicField(this, "credentialsProvider", () => __privateGet(this, _data3).credentialsProvider);
      __privateSet(this, _data3, data);
    }
  };
  _data3 = new WeakMap();
  function appendGeneratedKey(data, autofilledFields = {}) {
    let autogenerated = false;
    if (autofilledFields.password && data.credentials?.password === autofilledFields.password) {
      autogenerated = true;
    }
    if (autofilledFields.username && data.credentials?.username === autofilledFields.username) {
      autogenerated = true;
    }
    if (!autogenerated) return data;
    return {
      ...data,
      credentials: {
        ...data.credentials,
        [AUTOGENERATED_KEY]: true
      }
    };
  }
  function createCredentialsTooltipItem(data) {
    if (data.id === PROVIDER_LOCKED) {
      return new ProviderLockedItem(data);
    }
    if (AUTOGENERATED_KEY in data && data.password) {
      return new AutoGeneratedCredential(data);
    }
    return new CredentialsTooltipItem(data);
  }

  // packages/password/lib/rules-parser.js
  var Identifier = {
    ASCII_PRINTABLE: "ascii-printable",
    DIGIT: "digit",
    LOWER: "lower",
    SPECIAL: "special",
    UNICODE: "unicode",
    UPPER: "upper"
  };
  var RuleName = {
    ALLOWED: "allowed",
    MAX_CONSECUTIVE: "max-consecutive",
    REQUIRED: "required",
    MIN_LENGTH: "minlength",
    MAX_LENGTH: "maxlength"
  };
  var CHARACTER_CLASS_START_SENTINEL = "[";
  var CHARACTER_CLASS_END_SENTINEL = "]";
  var PROPERTY_VALUE_SEPARATOR = ",";
  var PROPERTY_SEPARATOR = ";";
  var PROPERTY_VALUE_START_SENTINEL = ":";
  var SPACE_CODE_POINT = " ".codePointAt(0);
  var SHOULD_NOT_BE_REACHED = "Should not be reached";
  var Rule = class {
    constructor(name, value) {
      this._name = name;
      this.value = value;
    }
    get name() {
      return this._name;
    }
    toString() {
      return JSON.stringify(this);
    }
  };
  var NamedCharacterClass = class {
    constructor(name) {
      console.assert(_isValidRequiredOrAllowedPropertyValueIdentifier(name));
      this._name = name;
    }
    get name() {
      return this._name.toLowerCase();
    }
    toString() {
      return this._name;
    }
    toHTMLString() {
      return this._name;
    }
  };
  var ParserError = class extends Error {
  };
  var CustomCharacterClass = class {
    constructor(characters) {
      console.assert(characters instanceof Array);
      this._characters = characters;
    }
    get characters() {
      return this._characters;
    }
    toString() {
      return `[${this._characters.join("")}]`;
    }
    toHTMLString() {
      return `[${this._characters.join("").replace('"', "&quot;")}]`;
    }
  };
  function _isIdentifierCharacter(c) {
    console.assert(c.length === 1);
    return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "-";
  }
  function _isASCIIDigit(c) {
    console.assert(c.length === 1);
    return c >= "0" && c <= "9";
  }
  function _isASCIIPrintableCharacter(c) {
    console.assert(c.length === 1);
    return c >= " " && c <= "~";
  }
  function _isASCIIWhitespace(c) {
    console.assert(c.length === 1);
    return c === " " || c === "\f" || c === "\n" || c === "\r" || c === "	";
  }
  function _bitSetIndexForCharacter(c) {
    console.assert(c.length === 1);
    return c.codePointAt(0) - SPACE_CODE_POINT;
  }
  function _characterAtBitSetIndex(index) {
    return String.fromCodePoint(index + SPACE_CODE_POINT);
  }
  function _markBitsForNamedCharacterClass(bitSet, namedCharacterClass) {
    console.assert(bitSet instanceof Array);
    console.assert(namedCharacterClass.name !== Identifier.UNICODE);
    console.assert(namedCharacterClass.name !== Identifier.ASCII_PRINTABLE);
    if (namedCharacterClass.name === Identifier.UPPER) {
      bitSet.fill(true, _bitSetIndexForCharacter("A"), _bitSetIndexForCharacter("Z") + 1);
    } else if (namedCharacterClass.name === Identifier.LOWER) {
      bitSet.fill(true, _bitSetIndexForCharacter("a"), _bitSetIndexForCharacter("z") + 1);
    } else if (namedCharacterClass.name === Identifier.DIGIT) {
      bitSet.fill(true, _bitSetIndexForCharacter("0"), _bitSetIndexForCharacter("9") + 1);
    } else if (namedCharacterClass.name === Identifier.SPECIAL) {
      bitSet.fill(true, _bitSetIndexForCharacter(" "), _bitSetIndexForCharacter("/") + 1);
      bitSet.fill(true, _bitSetIndexForCharacter(":"), _bitSetIndexForCharacter("@") + 1);
      bitSet.fill(true, _bitSetIndexForCharacter("["), _bitSetIndexForCharacter("`") + 1);
      bitSet.fill(true, _bitSetIndexForCharacter("{"), _bitSetIndexForCharacter("~") + 1);
    } else {
      console.assert(false, SHOULD_NOT_BE_REACHED, namedCharacterClass);
    }
  }
  function _markBitsForCustomCharacterClass(bitSet, customCharacterClass) {
    for (const character of customCharacterClass.characters) {
      bitSet[_bitSetIndexForCharacter(character)] = true;
    }
  }
  function _canonicalizedPropertyValues(propertyValues, keepCustomCharacterClassFormatCompliant) {
    const asciiPrintableBitSet = new Array("~".codePointAt(0) - " ".codePointAt(0) + 1);
    for (const propertyValue of propertyValues) {
      if (propertyValue instanceof NamedCharacterClass) {
        if (propertyValue.name === Identifier.UNICODE) {
          return [new NamedCharacterClass(Identifier.UNICODE)];
        }
        if (propertyValue.name === Identifier.ASCII_PRINTABLE) {
          return [new NamedCharacterClass(Identifier.ASCII_PRINTABLE)];
        }
        _markBitsForNamedCharacterClass(asciiPrintableBitSet, propertyValue);
      } else if (propertyValue instanceof CustomCharacterClass) {
        _markBitsForCustomCharacterClass(asciiPrintableBitSet, propertyValue);
      }
    }
    let charactersSeen = [];
    function checkRange(start, end) {
      const temp2 = [];
      for (let i = _bitSetIndexForCharacter(start); i <= _bitSetIndexForCharacter(end); ++i) {
        if (asciiPrintableBitSet[i]) {
          temp2.push(_characterAtBitSetIndex(i));
        }
      }
      const result2 = temp2.length === _bitSetIndexForCharacter(end) - _bitSetIndexForCharacter(start) + 1;
      if (!result2) {
        charactersSeen = charactersSeen.concat(temp2);
      }
      return result2;
    }
    const hasAllUpper = checkRange("A", "Z");
    const hasAllLower = checkRange("a", "z");
    const hasAllDigits = checkRange("0", "9");
    let hasAllSpecial = false;
    let hasDash = false;
    let hasRightSquareBracket = false;
    const temp = [];
    for (let i = _bitSetIndexForCharacter(" "); i <= _bitSetIndexForCharacter("/"); ++i) {
      if (!asciiPrintableBitSet[i]) {
        continue;
      }
      const character = _characterAtBitSetIndex(i);
      if (keepCustomCharacterClassFormatCompliant && character === "-") {
        hasDash = true;
      } else {
        temp.push(character);
      }
    }
    for (let i = _bitSetIndexForCharacter(":"); i <= _bitSetIndexForCharacter("@"); ++i) {
      if (asciiPrintableBitSet[i]) {
        temp.push(_characterAtBitSetIndex(i));
      }
    }
    for (let i = _bitSetIndexForCharacter("["); i <= _bitSetIndexForCharacter("`"); ++i) {
      if (!asciiPrintableBitSet[i]) {
        continue;
      }
      const character = _characterAtBitSetIndex(i);
      if (keepCustomCharacterClassFormatCompliant && character === "]") {
        hasRightSquareBracket = true;
      } else {
        temp.push(character);
      }
    }
    for (let i = _bitSetIndexForCharacter("{"); i <= _bitSetIndexForCharacter("~"); ++i) {
      if (asciiPrintableBitSet[i]) {
        temp.push(_characterAtBitSetIndex(i));
      }
    }
    if (hasDash) {
      temp.unshift("-");
    }
    if (hasRightSquareBracket) {
      temp.push("]");
    }
    const numberOfSpecialCharacters = _bitSetIndexForCharacter("/") - _bitSetIndexForCharacter(" ") + 1 + (_bitSetIndexForCharacter("@") - _bitSetIndexForCharacter(":") + 1) + (_bitSetIndexForCharacter("`") - _bitSetIndexForCharacter("[") + 1) + (_bitSetIndexForCharacter("~") - _bitSetIndexForCharacter("{") + 1);
    hasAllSpecial = temp.length === numberOfSpecialCharacters;
    if (!hasAllSpecial) {
      charactersSeen = charactersSeen.concat(temp);
    }
    const result = [];
    if (hasAllUpper && hasAllLower && hasAllDigits && hasAllSpecial) {
      return [new NamedCharacterClass(Identifier.ASCII_PRINTABLE)];
    }
    if (hasAllUpper) {
      result.push(new NamedCharacterClass(Identifier.UPPER));
    }
    if (hasAllLower) {
      result.push(new NamedCharacterClass(Identifier.LOWER));
    }
    if (hasAllDigits) {
      result.push(new NamedCharacterClass(Identifier.DIGIT));
    }
    if (hasAllSpecial) {
      result.push(new NamedCharacterClass(Identifier.SPECIAL));
    }
    if (charactersSeen.length) {
      result.push(new CustomCharacterClass(charactersSeen));
    }
    return result;
  }
  function _indexOfNonWhitespaceCharacter(input, position = 0) {
    console.assert(position >= 0);
    console.assert(position <= input.length);
    const length = input.length;
    while (position < length && _isASCIIWhitespace(input[position])) {
      ++position;
    }
    return position;
  }
  function _parseIdentifier(input, position) {
    console.assert(position >= 0);
    console.assert(position < input.length);
    console.assert(_isIdentifierCharacter(input[position]));
    const length = input.length;
    const seenIdentifiers = [];
    do {
      const c = input[position];
      if (!_isIdentifierCharacter(c)) {
        break;
      }
      seenIdentifiers.push(c);
      ++position;
    } while (position < length);
    return [seenIdentifiers.join(""), position];
  }
  function _isValidRequiredOrAllowedPropertyValueIdentifier(identifier) {
    return identifier && Object.values(Identifier).includes(identifier.toLowerCase());
  }
  function _parseCustomCharacterClass(input, position) {
    console.assert(position >= 0);
    console.assert(position < input.length);
    console.assert(input[position] === CHARACTER_CLASS_START_SENTINEL);
    const length = input.length;
    ++position;
    if (position >= length) {
      return [null, position];
    }
    const initialPosition = position;
    const result = [];
    do {
      const c = input[position];
      if (!_isASCIIPrintableCharacter(c)) {
        ++position;
        continue;
      }
      if (c === "-" && position - initialPosition > 0) {
        console.warn("Ignoring '-'; a '-' may only appear as the first character in a character class");
        ++position;
        continue;
      }
      result.push(c);
      ++position;
      if (c === CHARACTER_CLASS_END_SENTINEL) {
        break;
      }
    } while (position < length);
    if (position < length && input[position] !== CHARACTER_CLASS_END_SENTINEL) {
      result.pop();
      return [result, position];
    } else if (position === length && input[position - 1] === CHARACTER_CLASS_END_SENTINEL) {
      result.pop();
      return [result, position];
    }
    if (position < length && input[position] === CHARACTER_CLASS_END_SENTINEL) {
      return [result, position + 1];
    }
    return [null, position];
  }
  function _parsePasswordRequiredOrAllowedPropertyValue(input, position) {
    console.assert(position >= 0);
    console.assert(position < input.length);
    const length = input.length;
    const propertyValues = [];
    while (true) {
      if (_isIdentifierCharacter(input[position])) {
        const identifierStartPosition = position;
        var [propertyValue, position] = _parseIdentifier(input, position);
        if (!_isValidRequiredOrAllowedPropertyValueIdentifier(propertyValue)) {
          return [null, identifierStartPosition];
        }
        propertyValues.push(new NamedCharacterClass(propertyValue));
      } else if (input[position] === CHARACTER_CLASS_START_SENTINEL) {
        var [propertyValue, position] = _parseCustomCharacterClass(input, position);
        if (propertyValue && propertyValue.length) {
          propertyValues.push(new CustomCharacterClass(propertyValue));
        }
      } else {
        return [null, position];
      }
      position = _indexOfNonWhitespaceCharacter(input, position);
      if (position >= length || input[position] === PROPERTY_SEPARATOR) {
        break;
      }
      if (input[position] === PROPERTY_VALUE_SEPARATOR) {
        position = _indexOfNonWhitespaceCharacter(input, position + 1);
        if (position >= length) {
          return [null, position];
        }
        continue;
      }
      return [null, position];
    }
    return [propertyValues, position];
  }
  function _parsePasswordRule(input, position) {
    console.assert(position >= 0);
    console.assert(position < input.length);
    console.assert(_isIdentifierCharacter(input[position]));
    const length = input.length;
    const mayBeIdentifierStartPosition = position;
    var [identifier, position] = _parseIdentifier(input, position);
    if (!Object.values(RuleName).includes(identifier)) {
      return [null, mayBeIdentifierStartPosition, void 0];
    }
    if (position >= length) {
      return [null, position, void 0];
    }
    if (input[position] !== PROPERTY_VALUE_START_SENTINEL) {
      return [null, position, void 0];
    }
    const property = { name: identifier, value: null };
    position = _indexOfNonWhitespaceCharacter(input, position + 1);
    if (position >= length || input[position] === PROPERTY_SEPARATOR) {
      return [new Rule(property.name, property.value), position, void 0];
    }
    switch (identifier) {
      case RuleName.ALLOWED:
      case RuleName.REQUIRED: {
        var [propertyValue, position] = _parsePasswordRequiredOrAllowedPropertyValue(input, position);
        if (propertyValue) {
          property.value = propertyValue;
        }
        return [new Rule(property.name, property.value), position, void 0];
      }
      case RuleName.MAX_CONSECUTIVE: {
        var [propertyValue, position] = _parseMaxConsecutivePropertyValue(input, position);
        if (propertyValue) {
          property.value = propertyValue;
        }
        return [new Rule(property.name, property.value), position, void 0];
      }
      case RuleName.MIN_LENGTH:
      case RuleName.MAX_LENGTH: {
        var [propertyValue, position] = _parseMinLengthMaxLengthPropertyValue(input, position);
        if (propertyValue) {
          property.value = propertyValue;
        }
        return [new Rule(property.name, property.value), position, void 0];
      }
    }
    console.assert(false, SHOULD_NOT_BE_REACHED);
    return [null, -1, void 0];
  }
  function _parseMinLengthMaxLengthPropertyValue(input, position) {
    return _parseInteger(input, position);
  }
  function _parseMaxConsecutivePropertyValue(input, position) {
    return _parseInteger(input, position);
  }
  function _parseInteger(input, position) {
    console.assert(position >= 0);
    console.assert(position < input.length);
    if (!_isASCIIDigit(input[position])) {
      return [null, position];
    }
    const length = input.length;
    let result = 0;
    do {
      result = 10 * result + parseInt(input[position], 10);
      ++position;
    } while (position < length && input[position] !== PROPERTY_SEPARATOR && _isASCIIDigit(input[position]));
    if (position >= length || input[position] === PROPERTY_SEPARATOR) {
      return [result, position];
    }
    return [null, position];
  }
  function _parsePasswordRulesInternal(input) {
    const parsedProperties = [];
    const length = input.length;
    var position = _indexOfNonWhitespaceCharacter(input);
    while (position < length) {
      if (!_isIdentifierCharacter(input[position])) {
        return [parsedProperties, void 0];
      }
      var [parsedProperty, position, message] = _parsePasswordRule(input, position);
      if (parsedProperty && parsedProperty.value) {
        parsedProperties.push(parsedProperty);
      }
      position = _indexOfNonWhitespaceCharacter(input, position);
      if (position >= length) {
        break;
      }
      if (input[position] === PROPERTY_SEPARATOR) {
        position = _indexOfNonWhitespaceCharacter(input, position + 1);
        if (position >= length) {
          return [parsedProperties, void 0];
        }
        continue;
      }
      return [null, message || "Failed to find start of next property: " + input.substr(position)];
    }
    return [parsedProperties, void 0];
  }
  function parsePasswordRules(input, formatRulesForMinifiedVersion) {
    const [passwordRules, maybeMessage] = _parsePasswordRulesInternal(input);
    if (!passwordRules) {
      throw new ParserError(maybeMessage);
    }
    if (passwordRules.length === 0) {
      throw new ParserError("No valid rules were provided");
    }
    const suppressCopyingRequiredToAllowed = formatRulesForMinifiedVersion;
    const requiredRules = [];
    let newAllowedValues = [];
    let minimumMaximumConsecutiveCharacters = null;
    let maximumMinLength = 0;
    let minimumMaxLength = null;
    for (const rule of passwordRules) {
      switch (rule.name) {
        case RuleName.MAX_CONSECUTIVE:
          minimumMaximumConsecutiveCharacters = minimumMaximumConsecutiveCharacters ? Math.min(rule.value, minimumMaximumConsecutiveCharacters) : rule.value;
          break;
        case RuleName.MIN_LENGTH:
          maximumMinLength = Math.max(rule.value, maximumMinLength);
          break;
        case RuleName.MAX_LENGTH:
          minimumMaxLength = minimumMaxLength ? Math.min(rule.value, minimumMaxLength) : rule.value;
          break;
        case RuleName.REQUIRED:
          rule.value = _canonicalizedPropertyValues(rule.value, formatRulesForMinifiedVersion);
          requiredRules.push(rule);
          if (!suppressCopyingRequiredToAllowed) {
            newAllowedValues = newAllowedValues.concat(rule.value);
          }
          break;
        case RuleName.ALLOWED:
          newAllowedValues = newAllowedValues.concat(rule.value);
          break;
      }
    }
    let newPasswordRules = [];
    if (maximumMinLength > 0) {
      newPasswordRules.push(new Rule(RuleName.MIN_LENGTH, maximumMinLength));
    }
    if (minimumMaxLength !== null) {
      newPasswordRules.push(new Rule(RuleName.MAX_LENGTH, minimumMaxLength));
    }
    if (minimumMaximumConsecutiveCharacters !== null) {
      newPasswordRules.push(new Rule(RuleName.MAX_CONSECUTIVE, minimumMaximumConsecutiveCharacters));
    }
    const sortedRequiredRules = requiredRules.sort(function(a, b) {
      const namedCharacterClassOrder = [
        Identifier.LOWER,
        Identifier.UPPER,
        Identifier.DIGIT,
        Identifier.SPECIAL,
        Identifier.ASCII_PRINTABLE,
        Identifier.UNICODE
      ];
      const aIsJustOneNamedCharacterClass = a.value.length === 1 && a.value[0] instanceof NamedCharacterClass;
      const bIsJustOneNamedCharacterClass = b.value.length === 1 && b.value[0] instanceof NamedCharacterClass;
      if (aIsJustOneNamedCharacterClass && !bIsJustOneNamedCharacterClass) {
        return -1;
      }
      if (!aIsJustOneNamedCharacterClass && bIsJustOneNamedCharacterClass) {
        return 1;
      }
      if (aIsJustOneNamedCharacterClass && bIsJustOneNamedCharacterClass) {
        const aIndex = namedCharacterClassOrder.indexOf(a.value[0].name);
        const bIndex = namedCharacterClassOrder.indexOf(b.value[0].name);
        return aIndex - bIndex;
      }
      return 0;
    });
    newPasswordRules = newPasswordRules.concat(sortedRequiredRules);
    newAllowedValues = _canonicalizedPropertyValues(newAllowedValues, suppressCopyingRequiredToAllowed);
    if (!suppressCopyingRequiredToAllowed && !newAllowedValues.length) {
      newAllowedValues = [new NamedCharacterClass(Identifier.ASCII_PRINTABLE)];
    }
    if (newAllowedValues.length) {
      newPasswordRules.push(new Rule(RuleName.ALLOWED, newAllowedValues));
    }
    return newPasswordRules;
  }

  // packages/password/lib/constants.js
  var DEFAULT_MIN_LENGTH = 20;
  var DEFAULT_MAX_LENGTH = 30;
  var DEFAULT_REQUIRED_CHARS = "-!?$&#%";
  var DEFAULT_UNAMBIGUOUS_CHARS = "abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789";
  var DEFAULT_PASSWORD_RULES = [
    `minlength: ${DEFAULT_MIN_LENGTH}`,
    `maxlength: ${DEFAULT_MAX_LENGTH}`,
    `required: [${DEFAULT_REQUIRED_CHARS}]`,
    `required: digit`,
    `allowed: [${DEFAULT_UNAMBIGUOUS_CHARS}]`
  ].join("; ");
  var constants2 = {
    DEFAULT_MIN_LENGTH,
    DEFAULT_MAX_LENGTH,
    DEFAULT_PASSWORD_RULES,
    DEFAULT_REQUIRED_CHARS,
    DEFAULT_UNAMBIGUOUS_CHARS
  };

  // packages/password/lib/apple.password.js
  var defaults = Object.freeze({
    SCAN_SET_ORDER: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-~!@#$%^&*_+=`|(){}[:;\\\"'<>,.?/ ]",
    defaultUnambiguousCharacters: "abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789",
    defaultPasswordLength: constants2.DEFAULT_MIN_LENGTH,
    defaultPasswordRules: constants2.DEFAULT_PASSWORD_RULES,
    defaultRequiredCharacterSets: ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789"],
    /**
     * @type {typeof window.crypto.getRandomValues | null}
     */
    getRandomValues: null
  });
  var safeGlobals = {};
  if (typeof window !== "undefined") {
    safeGlobals.getRandomValues = window.crypto.getRandomValues.bind(window.crypto);
  }
  var Password = class _Password {
    /**
     * @param {Partial<typeof defaults>} [options]
     */
    constructor(options = {}) {
      this.options = {
        ...defaults,
        ...options
      };
      return this;
    }
    static get defaults() {
      return defaults;
    }
    /**
     * Generates a password from the given input.
     *
     * Note: This method will throw an error if parsing fails - use with caution
     *
     * @example
     *
     * ```javascript
     * const password = Password.generateOrThrow("minlength: 20")
     * ```
     * @public
     * @param {string} inputString
     * @param {Partial<typeof defaults>} [options]
     * @throws {ParserError|Error}
     * @returns {string}
     */
    static generateOrThrow(inputString, options = {}) {
      return new _Password(options).parse(inputString).generate();
    }
    /**
     * Generates a password using the default ruleset.
     *
     * @example
     *
     * ```javascript
     * const password = Password.generateDefault()
     * ```
     *
     * @public
     * @param {Partial<typeof defaults>} [options]
     * @returns {string}
     */
    static generateDefault(options = {}) {
      return new _Password(options).parse(_Password.defaults.defaultPasswordRules).generate();
    }
    /**
     * Convert a ruleset into it's internally-used component pieces.
     *
     * @param {string} inputString
     * @throws {parser.ParserError|Error}
     * @returns {{
     *    requirements: Requirements;
     *    parameters: PasswordParameters;
     *    rules: parser.Rule[],
     *    get entropy(): number;
     *    generate: () => string;
     * }}
     */
    parse(inputString) {
      const rules = parsePasswordRules(inputString);
      const requirements = this._requirementsFromRules(rules);
      if (!requirements) throw new Error("could not generate requirements for " + JSON.stringify(inputString));
      const parameters = this._passwordGenerationParametersDictionary(requirements);
      return {
        requirements,
        parameters,
        rules,
        get entropy() {
          return Math.log2(parameters.PasswordAllowedCharacters.length ** parameters.NumberOfRequiredRandomCharacters);
        },
        generate: () => {
          const password = this._generatedPasswordMatchingRequirements(requirements, parameters);
          if (password === "") throw new Error("unreachable");
          return password;
        }
      };
    }
    /**
     * Given an array of `Rule's`, convert into `Requirements`
     *
     * @param {parser.Rule[]} passwordRules
     * @returns {Requirements | null}
     */
    _requirementsFromRules(passwordRules) {
      const requirements = {};
      for (const rule of passwordRules) {
        if (rule.name === RuleName.ALLOWED) {
          console.assert(!("PasswordAllowedCharacters" in requirements));
          const chars = this._charactersFromCharactersClasses(rule.value);
          const scanSet = this._canonicalizedScanSetFromCharacters(chars);
          if (scanSet) {
            requirements.PasswordAllowedCharacters = scanSet;
          }
        } else if (rule.name === RuleName.MAX_CONSECUTIVE) {
          console.assert(!("PasswordRepeatedCharacterLimit" in requirements));
          requirements.PasswordRepeatedCharacterLimit = rule.value;
        } else if (rule.name === RuleName.REQUIRED) {
          let requiredCharacters = requirements.PasswordRequiredCharacters;
          if (!requiredCharacters) {
            requiredCharacters = requirements.PasswordRequiredCharacters = [];
          }
          requiredCharacters.push(this._canonicalizedScanSetFromCharacters(this._charactersFromCharactersClasses(rule.value)));
        } else if (rule.name === RuleName.MIN_LENGTH) {
          requirements.PasswordMinLength = rule.value;
        } else if (rule.name === RuleName.MAX_LENGTH) {
          requirements.PasswordMaxLength = rule.value;
        }
      }
      if (requirements.PasswordAllowedCharacters === this.options.SCAN_SET_ORDER && !requirements.PasswordRequiredCharacters) {
        delete requirements.PasswordAllowedCharacters;
      }
      if (requirements.PasswordRequiredCharacters && requirements.PasswordRequiredCharacters.length === 1 && requirements.PasswordRequiredCharacters[0] === this.options.SCAN_SET_ORDER) {
        delete requirements.PasswordRequiredCharacters;
      }
      return Object.keys(requirements).length ? requirements : null;
    }
    /**
     * @param {number} range
     * @returns {number}
     */
    _randomNumberWithUniformDistribution(range) {
      const getRandomValues = this.options.getRandomValues || safeGlobals.getRandomValues;
      const max = Math.floor(2 ** 32 / range) * range;
      let x;
      do {
        x = getRandomValues(new Uint32Array(1))[0];
      } while (x >= max);
      return x % range;
    }
    /**
     * @param {number} numberOfRequiredRandomCharacters
     * @param {string} allowedCharacters
     */
    _classicPassword(numberOfRequiredRandomCharacters, allowedCharacters) {
      const length = allowedCharacters.length;
      const randomCharArray = Array(numberOfRequiredRandomCharacters);
      for (let i = 0; i < numberOfRequiredRandomCharacters; i++) {
        const index = this._randomNumberWithUniformDistribution(length);
        randomCharArray[i] = allowedCharacters[index];
      }
      return randomCharArray.join("");
    }
    /**
     * @param {string} password
     * @param {number} consecutiveCharLimit
     * @returns {boolean}
     */
    _passwordHasNotExceededConsecutiveCharLimit(password, consecutiveCharLimit) {
      let longestConsecutiveCharLength = 1;
      let firstConsecutiveCharIndex = 0;
      let isSequenceAscending;
      for (let i = 1; i < password.length; i++) {
        const currCharCode = password.charCodeAt(i);
        const prevCharCode = password.charCodeAt(i - 1);
        if (isSequenceAscending) {
          if (isSequenceAscending.valueOf() && currCharCode === prevCharCode + 1 || !isSequenceAscending.valueOf() && currCharCode === prevCharCode - 1) {
            continue;
          }
          if (currCharCode === prevCharCode + 1) {
            firstConsecutiveCharIndex = i - 1;
            isSequenceAscending = Boolean(true);
            continue;
          }
          if (currCharCode === prevCharCode - 1) {
            firstConsecutiveCharIndex = i - 1;
            isSequenceAscending = Boolean(false);
            continue;
          }
          isSequenceAscending = null;
        } else if (currCharCode === prevCharCode + 1) {
          isSequenceAscending = Boolean(true);
          continue;
        } else if (currCharCode === prevCharCode - 1) {
          isSequenceAscending = Boolean(false);
          continue;
        }
        const currConsecutiveCharLength = i - firstConsecutiveCharIndex;
        if (currConsecutiveCharLength > longestConsecutiveCharLength) {
          longestConsecutiveCharLength = currConsecutiveCharLength;
        }
        firstConsecutiveCharIndex = i;
      }
      if (isSequenceAscending) {
        const currConsecutiveCharLength = password.length - firstConsecutiveCharIndex;
        if (currConsecutiveCharLength > longestConsecutiveCharLength) {
          longestConsecutiveCharLength = currConsecutiveCharLength;
        }
      }
      return longestConsecutiveCharLength <= consecutiveCharLimit;
    }
    /**
     * @param {string} password
     * @param {number} repeatedCharLimit
     * @returns {boolean}
     */
    _passwordHasNotExceededRepeatedCharLimit(password, repeatedCharLimit) {
      let longestRepeatedCharLength = 1;
      let lastRepeatedChar = password.charAt(0);
      let lastRepeatedCharIndex = 0;
      for (let i = 1; i < password.length; i++) {
        const currChar = password.charAt(i);
        if (currChar === lastRepeatedChar) {
          continue;
        }
        const currRepeatedCharLength = i - lastRepeatedCharIndex;
        if (currRepeatedCharLength > longestRepeatedCharLength) {
          longestRepeatedCharLength = currRepeatedCharLength;
        }
        lastRepeatedChar = currChar;
        lastRepeatedCharIndex = i;
      }
      return longestRepeatedCharLength <= repeatedCharLimit;
    }
    /**
     * @param {string} password
     * @param {string[]} requiredCharacterSets
     * @returns {boolean}
     */
    _passwordContainsRequiredCharacters(password, requiredCharacterSets) {
      const requiredCharacterSetsLength = requiredCharacterSets.length;
      const passwordLength = password.length;
      for (let i = 0; i < requiredCharacterSetsLength; i++) {
        const requiredCharacterSet = requiredCharacterSets[i];
        let hasRequiredChar = false;
        for (let j = 0; j < passwordLength; j++) {
          const char = password.charAt(j);
          if (requiredCharacterSet.indexOf(char) !== -1) {
            hasRequiredChar = true;
            break;
          }
        }
        if (!hasRequiredChar) {
          return false;
        }
      }
      return true;
    }
    /**
     * @param {string} string1
     * @param {string} string2
     * @returns {boolean}
     */
    _stringsHaveAtLeastOneCommonCharacter(string1, string2) {
      const string2Length = string2.length;
      for (let i = 0; i < string2Length; i++) {
        const char = string2.charAt(i);
        if (string1.indexOf(char) !== -1) {
          return true;
        }
      }
      return false;
    }
    /**
     * @param {Requirements} requirements
     * @returns {PasswordParameters}
     */
    _passwordGenerationParametersDictionary(requirements) {
      let minPasswordLength = requirements.PasswordMinLength;
      const maxPasswordLength = requirements.PasswordMaxLength;
      if (minPasswordLength > maxPasswordLength) {
        minPasswordLength = 0;
      }
      const requiredCharacterArray = requirements.PasswordRequiredCharacters;
      let allowedCharacters = requirements.PasswordAllowedCharacters;
      let requiredCharacterSets = this.options.defaultRequiredCharacterSets;
      if (requiredCharacterArray) {
        const mutatedRequiredCharacterSets2 = [];
        const requiredCharacterArrayLength = requiredCharacterArray.length;
        for (let i = 0; i < requiredCharacterArrayLength; i++) {
          const requiredCharacters = requiredCharacterArray[i];
          if (allowedCharacters && this._stringsHaveAtLeastOneCommonCharacter(requiredCharacters, allowedCharacters)) {
            mutatedRequiredCharacterSets2.push(requiredCharacters);
          }
        }
        requiredCharacterSets = mutatedRequiredCharacterSets2;
      }
      let numberOfRequiredRandomCharacters = this.options.defaultPasswordLength;
      if (minPasswordLength && minPasswordLength > numberOfRequiredRandomCharacters) {
        numberOfRequiredRandomCharacters = minPasswordLength;
      }
      if (maxPasswordLength && maxPasswordLength < numberOfRequiredRandomCharacters) {
        numberOfRequiredRandomCharacters = maxPasswordLength;
      }
      if (!allowedCharacters) {
        allowedCharacters = this.options.defaultUnambiguousCharacters;
      }
      if (!requiredCharacterSets) {
        requiredCharacterSets = this.options.defaultRequiredCharacterSets;
      }
      if (requiredCharacterSets.length > numberOfRequiredRandomCharacters) {
        requiredCharacterSets = [];
      }
      const requiredCharacterSetsLength = requiredCharacterSets.length;
      const mutatedRequiredCharacterSets = [];
      const allowedCharactersLength = allowedCharacters.length;
      for (let i = 0; i < requiredCharacterSetsLength; i++) {
        const requiredCharacterSet = requiredCharacterSets[i];
        let requiredCharacterSetContainsAllowedCharacters = false;
        for (let j = 0; j < allowedCharactersLength; j++) {
          const character = allowedCharacters.charAt(j);
          if (requiredCharacterSet.indexOf(character) !== -1) {
            requiredCharacterSetContainsAllowedCharacters = true;
            break;
          }
        }
        if (requiredCharacterSetContainsAllowedCharacters) {
          mutatedRequiredCharacterSets.push(requiredCharacterSet);
        }
      }
      requiredCharacterSets = mutatedRequiredCharacterSets;
      return {
        NumberOfRequiredRandomCharacters: numberOfRequiredRandomCharacters,
        PasswordAllowedCharacters: allowedCharacters,
        RequiredCharacterSets: requiredCharacterSets
      };
    }
    /**
     * @param {Requirements | null} requirements
     * @param {PasswordParameters} [parameters]
     * @returns {string}
     */
    _generatedPasswordMatchingRequirements(requirements, parameters) {
      requirements = requirements || {};
      parameters = parameters || this._passwordGenerationParametersDictionary(requirements);
      const numberOfRequiredRandomCharacters = parameters.NumberOfRequiredRandomCharacters;
      const repeatedCharLimit = requirements.PasswordRepeatedCharacterLimit;
      const allowedCharacters = parameters.PasswordAllowedCharacters;
      const shouldCheckRepeatedCharRequirement = !!repeatedCharLimit;
      while (true) {
        const password = this._classicPassword(numberOfRequiredRandomCharacters, allowedCharacters);
        if (!this._passwordContainsRequiredCharacters(password, parameters.RequiredCharacterSets)) {
          continue;
        }
        if (shouldCheckRepeatedCharRequirement) {
          if (repeatedCharLimit !== void 0 && repeatedCharLimit >= 1 && !this._passwordHasNotExceededRepeatedCharLimit(password, repeatedCharLimit)) {
            continue;
          }
        }
        const consecutiveCharLimit = requirements.PasswordConsecutiveCharacterLimit;
        if (consecutiveCharLimit && consecutiveCharLimit >= 1) {
          if (!this._passwordHasNotExceededConsecutiveCharLimit(password, consecutiveCharLimit)) {
            continue;
          }
        }
        return password || "";
      }
    }
    /**
     * @param {parser.CustomCharacterClass | parser.NamedCharacterClass} characterClass
     * @returns {string[]}
     */
    _scanSetFromCharacterClass(characterClass) {
      if (characterClass instanceof CustomCharacterClass) {
        return characterClass.characters;
      }
      console.assert(characterClass instanceof NamedCharacterClass);
      switch (characterClass.name) {
        case Identifier.ASCII_PRINTABLE:
        case Identifier.UNICODE:
          return this.options.SCAN_SET_ORDER.split("");
        case Identifier.DIGIT:
          return this.options.SCAN_SET_ORDER.substring(
            this.options.SCAN_SET_ORDER.indexOf("0"),
            this.options.SCAN_SET_ORDER.indexOf("9") + 1
          ).split("");
        case Identifier.LOWER:
          return this.options.SCAN_SET_ORDER.substring(
            this.options.SCAN_SET_ORDER.indexOf("a"),
            this.options.SCAN_SET_ORDER.indexOf("z") + 1
          ).split("");
        case Identifier.SPECIAL:
          return this.options.SCAN_SET_ORDER.substring(
            this.options.SCAN_SET_ORDER.indexOf("-"),
            this.options.SCAN_SET_ORDER.indexOf("]") + 1
          ).split("");
        case Identifier.UPPER:
          return this.options.SCAN_SET_ORDER.substring(
            this.options.SCAN_SET_ORDER.indexOf("A"),
            this.options.SCAN_SET_ORDER.indexOf("Z") + 1
          ).split("");
      }
      console.assert(false, SHOULD_NOT_BE_REACHED);
      return [];
    }
    /**
     * @param {(parser.CustomCharacterClass | parser.NamedCharacterClass)[]} characterClasses
     */
    _charactersFromCharactersClasses(characterClasses) {
      const output = [];
      for (const characterClass of characterClasses) {
        output.push(...this._scanSetFromCharacterClass(characterClass));
      }
      return output;
    }
    /**
     * @param {string[]} characters
     * @returns {string}
     */
    _canonicalizedScanSetFromCharacters(characters) {
      if (!characters.length) {
        return "";
      }
      const shadowCharacters = Array.prototype.slice.call(characters);
      shadowCharacters.sort((a, b) => this.options.SCAN_SET_ORDER.indexOf(a) - this.options.SCAN_SET_ORDER.indexOf(b));
      const uniqueCharacters = [shadowCharacters[0]];
      for (let i = 1, length = shadowCharacters.length; i < length; ++i) {
        if (shadowCharacters[i] === shadowCharacters[i - 1]) {
          continue;
        }
        uniqueCharacters.push(shadowCharacters[i]);
      }
      return uniqueCharacters.join("");
    }
  };

  // packages/password/index.js
  function generate(options = {}) {
    try {
      if (typeof options?.input === "string") {
        return Password.generateOrThrow(options.input);
      }
      if (typeof options?.domain === "string") {
        if (options?.rules) {
          const rules = _selectPasswordRules(options.domain, options.rules);
          if (rules) {
            return Password.generateOrThrow(rules);
          }
        }
      }
    } catch (e) {
      if (options?.onError && typeof options?.onError === "function") {
        options.onError(e);
      } else {
        const isKnownError = e instanceof ParserError || e instanceof HostnameInputError;
        if (!isKnownError) {
          console.error(e);
        }
      }
    }
    return Password.generateDefault();
  }
  var HostnameInputError = class extends Error {
  };
  function _selectPasswordRules(inputHostname, rules) {
    const hostname = _safeHostname(inputHostname);
    if (rules[hostname]) {
      return rules[hostname]["password-rules"];
    }
    const pieces = hostname.split(".");
    while (pieces.length > 1) {
      pieces.shift();
      const joined = pieces.join(".");
      if (rules[joined]) {
        return rules[joined]["password-rules"];
      }
    }
    return void 0;
  }
  function _safeHostname(inputHostname) {
    if (inputHostname.startsWith("http:") || inputHostname.startsWith("https:")) {
      throw new HostnameInputError("invalid input, you can only provide a hostname but you gave a scheme");
    }
    if (inputHostname.includes(":")) {
      throw new HostnameInputError("invalid input, you can only provide a hostname but you gave a :port");
    }
    try {
      const asUrl = new URL("https://" + inputHostname);
      return asUrl.hostname;
    } catch (e) {
      throw new HostnameInputError(`could not instantiate a URL from that hostname ${inputHostname}`);
    }
  }

  // packages/password/rules.json
  var rules_default = {
    "163.com": {
      "password-rules": "minlength: 6; maxlength: 16;"
    },
    "1800flowers.com": {
      "password-rules": "minlength: 6; required: lower, upper; required: digit;"
    },
    "access.service.gov.uk": {
      "password-rules": "minlength: 10; required: lower; required: upper; required: digit; required: special;"
    },
    "account.samsung.com": {
      "password-rules": "minlength: 8; maxlength: 15; required: digit; required: special; required: upper,lower;"
    },
    "acmemarkets.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "act.org": {
      "password-rules": "minlength: 8; maxlength: 64; required: lower; required: upper; required: digit; required: [!#$%&*@^];"
    },
    "admiral.com": {
      "password-rules": "minlength: 8; required: digit; required: [- !\"#$&'()*+,.:;<=>?@[^_`{|}~]]; allowed: lower, upper;"
    },
    "ae.com": {
      "password-rules": "minlength: 8; maxlength: 25; required: lower; required: upper; required: digit;"
    },
    "aeon.co.jp": {
      "password-rules": "minlength: 8; maxlength: 8; max-consecutive: 3; required: digit; required: upper,lower,[#$+./:=?@[^_|~]];"
    },
    "aeromexico.com": {
      "password-rules": "minlength: 8; maxlength: 25; required: lower; required: upper; required: digit;"
    },
    "aetna.com": {
      "password-rules": "minlength: 8; maxlength: 20; max-consecutive: 2; required: upper; required: digit; allowed: lower, [-_&#@];"
    },
    "airasia.com": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit;"
    },
    "airfrance.com": {
      "password-rules": "minlength: 8; maxlength: 12; required: lower; required: upper; required: digit; allowed: [-!#$&+/?@_];"
    },
    "airfrance.us": {
      "password-rules": "minlength: 8; maxlength: 12; required: lower; required: upper; required: digit; allowed: [-!#$&+/?@_];"
    },
    "ajisushionline.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; allowed: [ !#$%&*?@];"
    },
    "albertsons.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "alelo.com.br": {
      "password-rules": "minlength: 6; maxlength: 10; required: lower; required: upper; required: digit;"
    },
    "aliexpress.com": {
      "password-rules": "minlength: 6; maxlength: 20; allowed: lower, upper, digit;"
    },
    "alliantcreditunion.com": {
      "password-rules": "minlength: 8; maxlength: 20; max-consecutive: 3; required: lower, upper; required: digit; allowed: [!#$*];"
    },
    "allianz.com.br": {
      "password-rules": "minlength: 4; maxlength: 4;"
    },
    "americanexpress.com": {
      "password-rules": "minlength: 8; maxlength: 20; max-consecutive: 4; required: lower, upper; required: digit; allowed: [%&_?#=];"
    },
    "amnh.org": {
      "password-rules": "minlength: 8; maxlength: 16; required: digit; required: upper,lower; allowed: ascii-printable;"
    },
    "ana.co.jp": {
      "password-rules": "minlength: 8; maxlength: 16; required: digit; required: upper,lower;"
    },
    "anatel.gov.br": {
      "password-rules": "minlength: 6; maxlength: 15; allowed: lower, upper, digit;"
    },
    "ancestry.com": {
      "password-rules": "minlength: 8; required: lower, upper; required: digit;"
    },
    "andronicos.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "angieslist.com": {
      "password-rules": "minlength: 6; maxlength: 15;"
    },
    "anthem.com": {
      "password-rules": "minlength: 8; maxlength: 20; max-consecutive: 3; required: lower, upper; required: digit; allowed: [!$*?@|];"
    },
    "app.digiboxx.com": {
      "password-rules": "minlength: 8; maxlength: 14; required: lower; required: upper; required: digit; required: [@$!%*?&];"
    },
    "app.digio.in": {
      "password-rules": "minlength: 8; maxlength: 15;"
    },
    "app.parkmobile.io": {
      "password-rules": "minlength: 8; maxlength: 25; required: lower; required: upper; required: digit; required: [!@#$%^&];"
    },
    "app8menu.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [@$!%*?&];"
    },
    "apple.com": {
      "password-rules": "minlength: 8; maxlength: 63; required: lower; required: upper; required: digit; allowed: ascii-printable;"
    },
    "appleloan.citizensbank.com": {
      "password-rules": "minlength: 10; maxlength: 20; max-consecutive: 2; required: lower; required: upper; required: digit; required: [!#$%@^_];"
    },
    "areariservata.bancaetica.it": {
      "password-rules": "minlength: 8; maxlength: 10; required: lower; required: upper; required: digit; required: [!#&*+/=@_];"
    },
    "artscyclery.com": {
      "password-rules": "minlength: 6; maxlength: 19;"
    },
    "astonmartinf1.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; allowed: special;"
    },
    "auth.readymag.com": {
      "password-rules": "minlength: 8; maxlength: 128; required: lower; required: upper; allowed: special;"
    },
    "autify.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!\"#$%&'()*+,./:;<=>?@[^_`{|}~]];"
    },
    "axa.de": {
      "password-rules": `minlength: 8; maxlength: 65; required: lower; required: upper; required: digit; allowed: [-!"\xA7$%&/()=?;:_+*'#];`
    },
    "baidu.com": {
      "password-rules": "minlength: 6; maxlength: 14;"
    },
    "balduccis.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "bancochile.cl": {
      "password-rules": "minlength: 8; maxlength: 8; required: lower; required: upper; required: digit;"
    },
    "bankofamerica.com": {
      "password-rules": "minlength: 8; maxlength: 20; max-consecutive: 3; required: lower; required: upper; required: digit; allowed: [-@#*()+={}/?~;,._];"
    },
    "battle.net": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower, upper; allowed: digit, special;"
    },
    "bcassessment.ca": {
      "password-rules": "minlength: 8; maxlength: 14;"
    },
    "belkin.com": {
      "password-rules": "minlength: 8; required: lower, upper; required: digit; required: [$!@~_,%&];"
    },
    "benefitslogin.discoverybenefits.com": {
      "password-rules": "minlength: 10; required: upper; required: digit; required: [!#$%&*?@]; allowed: lower;"
    },
    "benjerry.com": {
      "password-rules": "required: upper; required: upper; required: digit; required: digit; required: special; required: special; allowed: lower;"
    },
    "bestbuy.com": {
      "password-rules": "minlength: 20; required: lower; required: upper; required: digit; required: special;"
    },
    "bhphotovideo.com": {
      "password-rules": "maxlength: 15;"
    },
    "bilibili.com": {
      "password-rules": "maxlength: 16;"
    },
    "billerweb.com": {
      "password-rules": "minlength: 8; max-consecutive: 2; required: digit; required: upper,lower;"
    },
    "biovea.com": {
      "password-rules": "maxlength: 19;"
    },
    "bitly.com": {
      "password-rules": "minlength: 6; required: lower; required: upper; required: digit; required: [`!@#$%^&*()+~{}'\";:<>?]];"
    },
    "blackwells.co.uk": {
      "password-rules": "minlength: 8; maxlength: 30; allowed: upper,lower,digit;"
    },
    "bloomingdales.com": {
      "password-rules": "minlength: 7; maxlength: 16; required: lower, upper; required: digit; required: [`!@#$%^&*()+~{}'\";:<>?]];"
    },
    "bluesguitarunleashed.com": {
      "password-rules": "allowed: lower, upper, digit, [!$#@];"
    },
    "bochk.com": {
      "password-rules": "minlength: 8; maxlength: 12; max-consecutive: 3; required: lower; required: upper; required: digit; allowed: [#$%&()*+,.:;<=>?@_];"
    },
    "box.com": {
      "password-rules": "minlength: 6; maxlength: 20; required: lower; required: upper; required: digit; required: digit;"
    },
    "bpl.bibliocommons.com": {
      "password-rules": "minlength: 4; maxlength: 4; required: digit;"
    },
    "brighthorizons.com": {
      "password-rules": "minlength: 8; maxlength: 16;"
    },
    "callofduty.com": {
      "password-rules": "minlength: 8; maxlength: 20; max-consecutive: 2; required: lower, upper; required: digit;"
    },
    "candyrect.com": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit;"
    },
    "capitalone.com": {
      "password-rules": "minlength: 8; maxlength: 32; required: lower, upper; required: digit; allowed: [-_./\\@$*&!#];"
    },
    "cardbenefitservices.com": {
      "password-rules": "minlength: 7; maxlength: 100; required: lower, upper; required: digit;"
    },
    "carrefour.it": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&*?@_];"
    },
    "carrsqc.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "carte-mobilite-inclusion.fr": {
      "password-rules": "minlength: 12; maxlength: 30; required: lower; required: upper; required: digit;"
    },
    "cathaypacific.com": {
      "password-rules": "minlength: 8; maxlength: 20; required: upper; required: digit; required: [!#$*^]; allowed: lower;"
    },
    "cb2.com": {
      "password-rules": "minlength: 9; required: lower, upper; required: digit; required: [!#*_%.$];"
    },
    "ccs-grp.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: digit; required: upper,lower; allowed: [-!#$%&'+./=?\\^_`{|}~];"
    },
    "cecredentialtrust.com": {
      "password-rules": "minlength: 12; required: lower; required: upper; required: digit; required: [!#$%&*@^];"
    },
    "charlie.mbta.com": {
      "password-rules": "minlength: 10; required: lower; required: upper; required: digit; required: [!#$%@^];"
    },
    "chase.com": {
      "password-rules": "minlength: 8; maxlength: 32; max-consecutive: 2; required: lower, upper; required: digit; required: [!#$%+/=@~];"
    },
    "cigna.co.uk": {
      "password-rules": "minlength: 8; maxlength: 12; required: lower; required: upper; required: digit;"
    },
    "citi.com": {
      "password-rules": "minlength: 8; maxlength: 64; max-consecutive: 2; required: digit; required: upper; required: lower; required: [-~`!@#$%^&*()_\\/|];"
    },
    "claimlookup.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: [@#$%^&+=!];"
    },
    "clarksoneyecare.com": {
      "password-rules": "minlength: 9; allowed: lower; required: upper; required: digit; required: [~!@#$%^&*()_+{}|;,.<>?[]];"
    },
    "claro.com.br": {
      "password-rules": "minlength: 8; required: lower; allowed: upper, digit, [-!@#$%&*_+=<>];"
    },
    "classmates.com": {
      "password-rules": "minlength: 6; maxlength: 20; allowed: lower, upper, digit, [!@#$%^&*];"
    },
    "clegc-gckey.gc.ca": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower, upper, digit;"
    },
    "clien.net": {
      "password-rules": "minlength: 5; required: lower, upper; required: digit;"
    },
    "cogmembers.org": {
      "password-rules": "minlength: 8; maxlength: 14; required: upper; required: digit; allowed: lower;"
    },
    "collectivehealth.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit;"
    },
    "comcastpaymentcenter.com": {
      "password-rules": "minlength: 8; maxlength: 20; max-consecutive: 2;required: lower, upper; required: digit;"
    },
    "comed.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; allowed: [-~!@#$%^&*_+=`|(){}[:;\"'<>,.?/\\]];"
    },
    "commerzbank.de": {
      "password-rules": "minlength: 5; maxlength: 8; required: lower, upper; required: digit;"
    },
    "consorsbank.de": {
      "password-rules": "minlength: 5; maxlength: 5; required: lower, upper, digit;"
    },
    "consorsfinanz.de": {
      "password-rules": "minlength: 6; maxlength: 15; allowed: lower, upper, digit, [-.];"
    },
    "costco.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower, upper; allowed: digit, [-!#$%&'()*+/:;=?@[^_`{|}~]];"
    },
    "coursera.com": {
      "password-rules": "minlength: 8; maxlength: 72;"
    },
    "cox.com": {
      "password-rules": "minlength: 8; maxlength: 24; required: digit; required: upper,lower; allowed: [!#$%()*@^];"
    },
    "crateandbarrel.com": {
      "password-rules": 'minlength: 9; maxlength: 64; required: lower; required: upper; required: digit; required: [!"#$%&()*,.:<>?@^_{|}];'
    },
    "crowdgen.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: [!#$%&()*+=@^_];"
    },
    "cvs.com": {
      "password-rules": "minlength: 8; maxlength: 25; required: lower, upper; required: digit; required: [!@#$%^&*()];"
    },
    "dailymail.co.uk": {
      "password-rules": "minlength: 5; maxlength: 15;"
    },
    "dan.org": {
      "password-rules": "minlength: 8; maxlength: 25; required: lower; required: upper; required: digit; required: [!@$%^&*];"
    },
    "danawa.com": {
      "password-rules": "minlength: 8; maxlength: 21; required: lower, upper; required: digit; required: [!@$%^&*];"
    },
    "darty.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit;"
    },
    "dbs.com.hk": {
      "password-rules": "minlength: 8; maxlength: 30; required: lower; required: upper; required: digit;"
    },
    "decluttr.com": {
      "password-rules": "minlength: 8; maxlength: 45; required: lower; required: upper; required: digit;"
    },
    "delta.com": {
      "password-rules": "minlength: 8; maxlength: 20; required: lower; required: upper; required: digit;"
    },
    "deutsche-bank.de": {
      "password-rules": "minlength: 5; maxlength: 5; required: lower, upper, digit;"
    },
    "devstore.cn": {
      "password-rules": "minlength: 6; maxlength: 12;"
    },
    "dickssportinggoods.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&*?@^];"
    },
    "dkb.de": {
      "password-rules": "minlength: 8; maxlength: 38; required: lower, upper; required: digit; allowed: [-\xE4\xFC\xF6\xC4\xDC\xD6\xDF!$%&/()=?+#,.:];"
    },
    "dmm.com": {
      "password-rules": "minlength: 4; maxlength: 16; required: lower; required: upper; required: digit;"
    },
    "dodgeridge.com": {
      "password-rules": "minlength: 8; maxlength: 12; required: lower; required: upper; required: digit;"
    },
    "dowjones.com": {
      "password-rules": "maxlength: 15;"
    },
    "ea.com": {
      "password-rules": "minlength: 8; maxlength: 64; required: lower; required: upper; required: digit; allowed: special;"
    },
    "easycoop.com": {
      "password-rules": "minlength: 8; required: upper; required: special; allowed: lower, digit;"
    },
    "easyjet.com": {
      "password-rules": "minlength: 6; maxlength: 20; required: lower; required: upper; required: digit; required: [-];"
    },
    "ebrap.org": {
      "password-rules": "minlength: 15; required: lower; required: lower; required: upper; required: upper; required: digit; required: digit; required: [-!@#$%^&*()_+|~=`{}[:\";'?,./.]]; required: [-!@#$%^&*()_+|~=`{}[:\";'?,./.]];"
    },
    "ecompanystore.com": {
      "password-rules": "minlength: 8; maxlength: 16; max-consecutive: 2; required: lower; required: upper; required: digit; required: [#$%*+.=@^_];"
    },
    "eddservices.edd.ca.gov": {
      "password-rules": "minlength: 8; maxlength: 12; required: lower; required: upper; required: digit; required: [!@#$%^&*()];"
    },
    "edistrict.kerala.gov.in": {
      "password-rules": "minlength: 5; maxlength: 15; required: lower; required: upper; required: digit; required: [!@#$];"
    },
    "empower-retirement.com": {
      "password-rules": "minlength: 8; maxlength: 16;"
    },
    "epicgames.com": {
      "password-rules": "minlength: 7; required: lower; required: upper; required: digit; required: [-!\"#$%&'()*+,./:;<=>?@[^_`{|}~]];"
    },
    "epicmix.com": {
      "password-rules": "minlength: 8; maxlength: 16;"
    },
    "equifax.com": {
      "password-rules": "minlength: 8; maxlength: 20; required: lower; required: upper; required: digit; required: [!$*+@];"
    },
    "essportal.excelityglobal.com": {
      "password-rules": "minlength: 6; maxlength: 8; allowed: lower, upper, digit;"
    },
    "ettoday.net": {
      "password-rules": "minlength: 6; maxlength: 12;"
    },
    "examservice.com.tw": {
      "password-rules": "minlength: 6; maxlength: 8;"
    },
    "expertflyer.com": {
      "password-rules": "minlength: 5; maxlength: 16; required: lower, upper; required: digit;"
    },
    "extraspace.com": {
      "password-rules": "minlength: 8; maxlength: 20; allowed: lower; required: upper, digit, [!#$%&*?@];"
    },
    "ezpassva.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: special;"
    },
    "fc2.com": {
      "password-rules": "minlength: 8; maxlength: 16;"
    },
    "fccaccessonline.com": {
      "password-rules": "minlength: 8; maxlength: 14; max-consecutive: 3; required: lower; required: upper; required: digit; required: [!#$%*^_];"
    },
    "fedex.com": {
      "password-rules": "minlength: 8; max-consecutive: 3; required: lower; required: upper; required: digit; allowed: [-!@#$%^&*_+=`|(){}[:;,.?]];"
    },
    "fidelity.com": {
      "password-rules": "minlength: 6; maxlength: 20; required: lower; required: upper; required: digit; required: [-!$%+,./:;=?@^_|]; max-consecutive: 2;"
    },
    "flysas.com": {
      "password-rules": "minlength: 8; maxlength: 14; required: lower; required: upper; required: digit; required: [-~!@#$%^&_+=`|(){}[:\"'<>,.?]];"
    },
    "fnac.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit;"
    },
    "fuelrewards.com": {
      "password-rules": "minlength: 8; maxlength: 16; allowed: upper,lower,digit,[!#$%@];"
    },
    "gamestop.com": {
      "password-rules": "minlength: 8; maxlength: 225; required: lower; required: upper; required: digit; required: [!@#$%];"
    },
    "gap.com": {
      "password-rules": "minlength: 8; maxlength: 24; required: lower; required: upper; required: digit; required: [-!@#$%^&*()_+];"
    },
    "garmin.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit;"
    },
    "getflywheel.com": {
      "password-rules": "minlength: 7; maxlength: 72;"
    },
    "girlscouts.org": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; allowed: [$#!];"
    },
    "gmx.net": {
      "password-rules": "minlength: 8; maxlength: 40; allowed: lower, upper, digit, [-<=>~!|()@#{}$%,.?^'&*_+`:;\"[]];"
    },
    "gocurb.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [$%&#*?!@^];"
    },
    "google.com": {
      "password-rules": `minlength: 8; allowed: lower, upper, digit, [-!"#$%&'()*+,./:;<=>?@[^_{|}~]];`
    },
    "guardiananytime.com": {
      "password-rules": "minlength: 8; maxlength: 50; max-consecutive: 2; required: lower; required: upper; required: digit, [-~!@#$%^&*_+=`|(){}[:;,.?]];"
    },
    "gwl.greatwestlife.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [-!#$%_=+<>];"
    },
    "haggen.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "hangseng.com": {
      "password-rules": "minlength: 8; maxlength: 30; required: lower; required: upper; required: digit;"
    },
    "hawaiianairlines.com": {
      "password-rules": "maxlength: 16;"
    },
    "hertz-japan.com": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz-kuwait.com": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz-saudi.com": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.at": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.be": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.bh": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.ca": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.ch": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.cn": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.co.ao": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.co.id": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.co.kr": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.co.nz": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.co.th": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.co.uk": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.com": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.com.au": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.com.bh": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.com.hk": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.com.kw": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.com.mt": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.com.pl": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.com.pt": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.com.sg": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.com.tw": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.cv": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.cz": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.de": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.ee": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.es": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.fi": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.fr": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.hu": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.ie": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.it": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.jo": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.lt": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.nl": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.no": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.nu": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.pl": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.pt": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.qa": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.ru": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.se": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertz.si": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hertzcaribbean.com": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower; required: upper; required: digit; required: [#$%^&!@];"
    },
    "hetzner.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [-^!$%/()=?+#.,;:~*@{}_&[]];"
    },
    "hilton.com": {
      "password-rules": "minlength: 8; maxlength: 32; required: lower; required: upper; required: digit;"
    },
    "hkbea.com": {
      "password-rules": "minlength: 8; maxlength: 12; required: lower; required: upper; required: digit;"
    },
    "hkexpress.com": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit; required: special;"
    },
    "hotels.com": {
      "password-rules": "minlength: 6; maxlength: 20; required: digit; required: [-~#@$%&!*_?^]; allowed: lower, upper;"
    },
    "hotwire.com": {
      "password-rules": "minlength: 6; maxlength: 30; allowed: lower, upper, digit, [-~!@#$%^&*_+=`|(){}[:;\"'<>,.?]];"
    },
    "hrblock.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [$#%!];"
    },
    "hsbc.com.hk": {
      "password-rules": "minlength: 6; maxlength: 30; required: lower; required: upper; required: digit; allowed: ['.@_];"
    },
    "hsbc.com.my": {
      "password-rules": "minlength: 8; maxlength: 30; required: lower, upper; required: digit; allowed: [-!$*.=?@_'];"
    },
    "hypovereinsbank.de": {
      "password-rules": 'minlength: 6; maxlength: 10; required: lower, upper, digit; allowed: [!"#$%&()*+:;<=>?@[{}~]];'
    },
    "hyresbostader.se": {
      "password-rules": "minlength: 6; maxlength: 20; required: lower, upper; required: digit;"
    },
    "ichunqiu.com": {
      "password-rules": "minlength: 8; maxlength: 20; required: lower; required: upper; required: digit;"
    },
    "id.sonyentertainmentnetwork.com": {
      "password-rules": "minlength: 8; maxlength: 30; required: lower, upper; required: digit; allowed: [-!@#^&*=+;:];"
    },
    "identity.codesignal.com": {
      "password-rules": "minlength: 14; required: digit; required: lower, upper; required: [!#$%&*@^]"
    },
    "identitytheft.gov": {
      "password-rules": "allowed: lower, upper, digit, [!#%&*@^];"
    },
    "idestination.info": {
      "password-rules": "maxlength: 15;"
    },
    "impots.gouv.fr": {
      "password-rules": "minlength: 12; maxlength: 128; required: lower; required: digit; allowed: [-!#$%&*+/=?^_'.{|}];"
    },
    "indochino.com": {
      "password-rules": "minlength: 6; maxlength: 15; required: upper; required: digit; allowed: lower, special;"
    },
    "inntopia.travel": {
      "password-rules": "minlength: 7; maxlength: 19; required: digit; allowed: upper,lower,[-];"
    },
    "internationalsos.com": {
      "password-rules": "required: lower; required: upper; required: digit; required: [@#$%^&+=_];"
    },
    "irctc.co.in": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit; required: [!@#$%^&*()+];"
    },
    "irs.gov": {
      "password-rules": "minlength: 8; maxlength: 32; required: lower; required: upper; required: digit; required: [!#$%&*@];"
    },
    "jal.co.jp": {
      "password-rules": "minlength: 8; maxlength: 16;"
    },
    "japanpost.jp": {
      "password-rules": "minlength: 8; maxlength: 16; required: digit; required: upper,lower;"
    },
    "jewelosco.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "jordancu-onlinebanking.org": {
      "password-rules": "minlength: 6; maxlength: 32; allowed: upper, lower, digit,[-!\"#$%&'()*+,.:;<=>?@[^_`{|}~]];"
    },
    "keldoc.com": {
      "password-rules": "minlength: 12; required: lower; required: upper; required: digit; required: [!@#$%^&*];"
    },
    "kennedy-center.org": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&*?@];"
    },
    "key.harvard.edu": {
      "password-rules": "minlength: 10; maxlength: 100; required: lower; required: upper; required: digit; allowed: [-@_#!&$`%*+()./,;~:{}|?>=<^[']];"
    },
    "kfc.ca": {
      "password-rules": "minlength: 6; maxlength: 15; required: lower; required: upper; required: digit; required: [!@#$%&?*];"
    },
    "kiehls.com": {
      "password-rules": "minlength: 8; maxlength: 25; required: lower; required: upper; required: digit; required: [!#$%&?@];"
    },
    "kingsfoodmarkets.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "klm.com": {
      "password-rules": "minlength: 8; maxlength: 12;"
    },
    "kundenportal.edeka-smart.de": {
      "password-rules": 'minlength: 8; maxlength: 16; required: digit; required: upper, lower; required: [!"\xA7$%&#];'
    },
    "la-z-boy.com": {
      "password-rules": "minlength: 6; maxlength: 15; required: lower, upper; required: digit;"
    },
    "labcorp.com": {
      "password-rules": "minlength: 8; maxlength: 20; required: upper; required: lower; required: digit; required: [!@#$%^&*];"
    },
    "ladwp.com": {
      "password-rules": "minlength: 8; maxlength: 20; required: digit; allowed: lower, upper;"
    },
    "launtel.net.au": {
      "password-rules": "minlength: 8; required: digit; required: digit; allowed: lower, upper;"
    },
    "leetchi.com": {
      "password-rules": 'minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&()*+,./:;<>?@"_];'
    },
    "lepida.it": {
      "password-rules": "minlength: 8; maxlength: 16; max-consecutive: 2; required: lower; required: upper; required: digit; required: [-!\"#$%&'()*+,.:;<=>?@[^_`{|}~]];"
    },
    "lg.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; allowed: [-!#$%&'()*+,.:;=?@[^_{|}~]];"
    },
    "linearity.io": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: special;"
    },
    "live.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; allowed: [-@_#!&$`%*+()./,;~:{}|?>=<^'[]];"
    },
    "lloydsbank.co.uk": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: digit; allowed: upper;"
    },
    "lowes.com": {
      "password-rules": "minlength: 8; maxlength: 128; max-consecutive: 3; required: lower, upper; required: digit;"
    },
    "loyalty.accor.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&=@];"
    },
    "lsacsso.b2clogin.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit, [-!#$%&*?@^_];"
    },
    "lufthansa.com": {
      "password-rules": 'minlength: 8; maxlength: 32; required: lower; required: upper; required: digit; required: [!#$%&()*+,./:;<>?@"_];'
    },
    "lufthansagroup.careers": {
      "password-rules": "minlength: 12; required: lower; required: upper; required: digit; required: [!#$%&*?@];"
    },
    "macys.com": {
      "password-rules": "minlength: 7; maxlength: 16; allowed: lower, upper, digit, [~!@#$%^&*+`(){}[:;\"'<>?]];"
    },
    "mailbox.org": {
      "password-rules": 'minlength: 8; required: lower; required: upper; required: digit; allowed: [-!$"%&/()=*+#.,;:@?{}[]];'
    },
    "makemytrip.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [@$!%*#?&];"
    },
    "marriott.com": {
      "password-rules": "minlength: 8; maxlength: 20; required: lower; required: upper; required: digit; allowed: [$!#&@?%=];"
    },
    "maybank2u.com.my": {
      "password-rules": "minlength: 8; maxlength: 12; max-consecutive: 2; required: lower; required: upper; required: digit; required: [-~!@#$%^&*_+=`|(){}[:;\"'<>,.?];"
    },
    "medicare.gov": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: [@!$%^*()];"
    },
    "meineschufa.de": {
      "password-rules": "minlength: 10; required: lower; required: upper; required: digit; required: [!?#%$];"
    },
    "member.everbridge.net": {
      "password-rules": "minlength: 8; required: lower, upper; required: digit; allowed: [!@#$%^&*()];"
    },
    "metlife.com": {
      "password-rules": "minlength: 6; maxlength: 20;"
    },
    "microsoft.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: special;"
    },
    "milogin.michigan.gov": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [@#$!~&];"
    },
    "mintmobile.com": {
      "password-rules": "minlength: 8; maxlength: 20; required: lower; required: upper; required: digit; required: special; allowed: [!#$%&()*+:;=@[^_`{}~]];"
    },
    "mlb.com": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit;"
    },
    "mountainwarehouse.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; allowed: [-@#$%^&*_+={}|\\:',?/`~\"();.];"
    },
    "mpv.tickets.com": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit;"
    },
    "museumofflight.org": {
      "password-rules": "minlength: 8; maxlength: 15;"
    },
    "my.konami.net": {
      "password-rules": "minlength: 8; maxlength: 32; required: lower; required: upper; required: digit;"
    },
    "myaccess.dmdc.osd.mil": {
      "password-rules": "minlength: 9; maxlength: 20; required: lower; required: upper; required: digit; allowed: [-@_#!&$`%*+()./,;~:{}|?>=<^'[]];"
    },
    "mygoodtogo.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower, upper, digit;"
    },
    "myhealthrecord.com": {
      "password-rules": "minlength: 8; maxlength: 20; allowed: lower, upper, digit, [_.!$*=];"
    },
    "mypay.dfas.mil": {
      "password-rules": "minlength: 9; maxlength: 30; required: lower; required: upper; required: digit; required: [#@$%^!*+=_];"
    },
    "mysavings.breadfinancial.com": {
      "password-rules": "minlength: 8; maxlength: 25; required: lower; required: upper; required: digit; required: [+_%@!$*~];"
    },
    "mysedgwick.com": {
      "password-rules": "minlength: 8; maxlength: 16; allowed: lower; required: upper; required: digit; required: [@#%^&+=!]; allowed: [-~_$.,;]"
    },
    "mysubaru.com": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit; allowed: [!#$%()*+,./:;=?@\\^`~];"
    },
    "naver.com": {
      "password-rules": "minlength: 6; maxlength: 16;"
    },
    "nekochat.cn": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit;"
    },
    "nelnet.net": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit, [!@#$&*];"
    },
    "netflix.com": {
      "password-rules": "minlength: 4; maxlength: 60; required: lower, upper, digit; allowed: special;"
    },
    "netgear.com": {
      "password-rules": "minlength: 6; maxlength: 128; allowed: lower, upper, digit, [!@#$%^&*()];"
    },
    "nowinstock.net": {
      "password-rules": "minlength: 6; maxlength: 20; allowed: lower, upper, digit;"
    },
    "order.wendys.com": {
      "password-rules": "minlength: 6; maxlength: 20; required: lower; required: upper; required: digit; allowed: [!#$%&()*+/=?^_{}];"
    },
    "ototoy.jp": {
      "password-rules": "minlength: 8; allowed: upper,lower,digit,[- .=_];"
    },
    "packageconciergeadmin.com": {
      "password-rules": "minlength: 4; maxlength: 4; allowed: digit;"
    },
    "pavilions.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "paypal.com": {
      "password-rules": "minlength: 8; maxlength: 20; max-consecutive: 3; required: lower, upper; required: digit, [!@#$%^&*()];"
    },
    "payvgm.youraccountadvantage.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: special;"
    },
    "pilotflyingj.com": {
      "password-rules": "minlength: 7; required: digit; allowed: lower, upper;"
    },
    "pixnet.cc": {
      "password-rules": "minlength: 4; maxlength: 16; allowed: lower, upper;"
    },
    "planetary.org": {
      "password-rules": "minlength: 5; maxlength: 20; required: lower; required: upper; required: digit; allowed: ascii-printable;"
    },
    "plazapremiumlounge.com": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit; allowed: [!#$%&*,@^];"
    },
    "portal.edd.ca.gov": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&()*@^];"
    },
    "portals.emblemhealth.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&'()*+,./:;<>?@\\^_`{|}~[]];"
    },
    "portlandgeneral.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; allowed: [!#$%&*?@];"
    },
    "poste.it": {
      "password-rules": "minlength: 8; maxlength: 16; max-consecutive: 2; required: lower; required: upper; required: digit; required: special;"
    },
    "posteo.de": {
      "password-rules": 'minlength: 8; required: lower; required: upper; required: digit, [-~!#$%&_+=|(){}[:;"\u2019<>,.? ]];'
    },
    "powells.com": {
      "password-rules": 'minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: ["!@#$%^&*(){}[]];'
    },
    "preferredhotels.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&()*+@^_];"
    },
    "premier.ticketek.com.au": {
      "password-rules": "minlength: 6; maxlength: 16;"
    },
    "premierinn.com": {
      "password-rules": "minlength: 8; required: upper; required: digit; allowed: lower;"
    },
    "prepaid.bankofamerica.com": {
      "password-rules": `minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: [!@#$%^&*()+~{}'";:<>?];`
    },
    "prestocard.ca": {
      "password-rules": `minlength: 8; required: lower; required: upper; required: digit,[!"#$%&'()*+,<>?@];`
    },
    "pret.com": {
      "password-rules": "minlength: 12; required: lower; required: digit; required: [@$!%*#?&]; allowed: upper;"
    },
    "propelfuels.com": {
      "password-rules": "minlength: 6; maxlength: 16;"
    },
    "qdosstatusreview.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&@^];"
    },
    "questdiagnostics.com": {
      "password-rules": "minlength: 8; maxlength: 30; required: upper, lower; required: digit, [!#$%&()*+<>?@^_~];"
    },
    "randalls.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "rejsekort.dk": {
      "password-rules": "minlength: 7; maxlength: 15; required: lower; required: upper; required: digit;"
    },
    "renaud-bray.com": {
      "password-rules": "minlength: 8; maxlength: 38; allowed: upper,lower,digit;"
    },
    "ring.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!@#$%^&*<>?];"
    },
    "riteaid.com": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit;"
    },
    "robinhood.com": {
      "password-rules": "minlength: 10;"
    },
    "rogers.com": {
      "password-rules": "minlength: 8; required: lower, upper; required: digit; required: [!@#$];"
    },
    "ruc.dk": {
      "password-rules": "minlength: 6; maxlength: 8; required: lower, upper; required: [-!#%&(){}*+;%/<=>?_];"
    },
    "runescape.com": {
      "password-rules": "minlength: 5; maxlength: 20; required: lower; required: upper; required: digit;"
    },
    "ruten.com.tw": {
      "password-rules": "minlength: 6; maxlength: 15; required: lower, upper;"
    },
    "safeway.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "salslimo.com": {
      "password-rules": "minlength: 8; maxlength: 50; required: upper; required: lower; required: digit; required: [!@#$&*];"
    },
    "santahelenasaude.com.br": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit; required: [-!@#$%&*_+=<>];"
    },
    "santander.de": {
      "password-rules": "minlength: 8; maxlength: 12; required: lower, upper; required: digit; allowed: [-!#$%&'()*,.:;=?^{}];"
    },
    "savemart.com": {
      "password-rules": "minlength: 8; maxlength: 12; required: digit; required: upper,lower; required: [!#$%&@]; allowed: ascii-printable;"
    },
    "sbisec.co.jp": {
      "password-rules": "minlength: 10; maxlength: 20; allowed: upper,lower,digit;"
    },
    "secure-arborfcu.org": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit; required: [!#$%&'()+,.:?@[_`~]];"
    },
    "secure.orclinic.com": {
      "password-rules": "minlength: 6; maxlength: 15; required: lower; required: digit; allowed: ascii-printable;"
    },
    "secure.snnow.ca": {
      "password-rules": "minlength: 7; maxlength: 16; required: digit; allowed: lower, upper;"
    },
    "sephora.com": {
      "password-rules": "minlength: 6; maxlength: 12;"
    },
    "serviziconsolari.esteri.it": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: special;"
    },
    "servizioelettriconazionale.it": {
      "password-rules": "minlength: 8; maxlength: 20; required: lower; required: upper; required: digit; required: [!#$%&*?@^_~];"
    },
    "sfwater.org": {
      "password-rules": "minlength: 10; maxlength: 30; required: digit; allowed: lower, upper, [!@#$%*()_+^}{:;?.];"
    },
    "shaws.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "signin.ea.com": {
      "password-rules": "minlength: 8; maxlength: 64; required: lower, upper; required: digit; allowed: [-!@#^&*=+;:];"
    },
    "southwest.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: upper; required: digit; allowed: lower, [!@#$%^*(),.;:/\\];"
    },
    "speedway.com": {
      "password-rules": "minlength: 4; maxlength: 8; required: digit;"
    },
    "spirit.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: [!@#$%^&*()];"
    },
    "splunk.com": {
      "password-rules": "minlength: 8; maxlength: 64; required: lower; required: upper; required: digit; required: [-!@#$%&*_+=<>];"
    },
    "ssa.gov": {
      "password-rules": "required: lower; required: upper; required: digit; required: [~!@#$%^&*];"
    },
    "starmarket.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "store.nintendo.co.uk": {
      "password-rules": "minlength: 8; maxlength: 20;"
    },
    "store.nvidia.com": {
      "password-rules": "minlength: 8; maxlength: 32; required: lower; required: upper; required: digit; required: [-!@#$%^*~:;&><[{}|_+=?]];"
    },
    "store.steampowered.com": {
      "password-rules": "minlength: 6; required: lower; required: upper; required: digit; allowed: [~!@#$%^&*];"
    },
    "subscribe.free.fr": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: [!#&()*+/@[_]];"
    },
    "successfactors.eu": {
      "password-rules": "minlength: 8; maxlength: 18; required: lower; required: upper; required: digit,[-!\"#$%&'()*+,.:;<=>?@[^_`{|}~]];"
    },
    "sulamericaseguros.com.br": {
      "password-rules": "minlength: 6; maxlength: 6;"
    },
    "sunlife.com": {
      "password-rules": "minlength: 8; maxlength: 10; required: digit; required: lower, upper;"
    },
    "t-mobile.net": {
      "password-rules": "minlength: 8; maxlength: 16;"
    },
    "target.com": {
      "password-rules": "minlength: 8; maxlength: 20; required: lower, upper; required: digit, [-!\"#$%&'()*+,./:;=?@[\\^_`{|}~];"
    },
    "tdscpc.gov.in": {
      "password-rules": `minlength: 8; maxlength: 15; required: lower; required: upper; required: digit; required: [ &',;"];`
    },
    "telekom-dienste.de": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: [#$%&()*+,./<=>?@_{|}~];"
    },
    "thameswater.co.uk": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: special;"
    },
    "themovingportal.co.uk": {
      "password-rules": `minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; allowed: [-@#$%^&*_+={}|\\:',?/'~" ();.[]];`
    },
    "ticketweb.com": {
      "password-rules": "minlength: 12; maxlength: 15;"
    },
    "tix.soundrink.com": {
      "password-rules": "minlength: 6; maxlength: 16;"
    },
    "tomthumb.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "training.confluent.io": {
      "password-rules": "minlength: 6; maxlength: 16; required: lower; required: upper; required: digit; allowed: [!#$%*@^_~];"
    },
    "treasurer.mo.gov": {
      "password-rules": "minlength: 8; maxlength: 26; required: lower; required: upper; required: digit; required: [!#$&];"
    },
    "truist.com": {
      "password-rules": "minlength: 8; maxlength: 28; max-consecutive: 2; required: lower; required: upper; required: digit; required: [!#$%()*,:;=@_];"
    },
    "turkishairlines.com": {
      "password-rules": "minlength: 6; maxlength: 6; required: digit; max-consecutive: 3;"
    },
    "twitch.tv": {
      "password-rules": "minlength: 8; maxlength: 71;"
    },
    "twitter.com": {
      "password-rules": "minlength: 8;"
    },
    "ubisoft.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: [-]; required: [!@#$%^&*()+];"
    },
    "udel.edu": {
      "password-rules": "minlength: 12; maxlength: 30; required: lower; required: upper; required: digit; required: [!@#$%^&*()+];"
    },
    "umterps.evenue.net": {
      "password-rules": "minlength: 14; required: digit; required: upper; required: lower; required: [-~!@#$%^&*_+=`|(){}:;];"
    },
    "unito.it": {
      "password-rules": `minlength: 8; required: upper; required: lower; required: digit; required: [-!?+*/:;'"{}()@\xA3$%&=^#[]];`
    },
    "user.ornl.gov": {
      "password-rules": "minlength: 8; maxlength: 30; max-consecutive: 3; required: lower, upper; required: digit; allowed: [!#$%./_];"
    },
    "usps.com": {
      "password-rules": `minlength: 8; maxlength: 50; max-consecutive: 2; required: lower; required: upper; required: digit; allowed: [-!"#&'()+,./?@];`
    },
    "vanguard.com": {
      "password-rules": "minlength: 6; maxlength: 20; required: lower; required: upper; required: digit; required: digit;"
    },
    "vanguardinvestor.co.uk": {
      "password-rules": "minlength: 8; maxlength: 50; required: lower; required: upper; required: digit; required: digit;"
    },
    "ventrachicago.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit, [!@#$%^];"
    },
    "verizonwireless.com": {
      "password-rules": "minlength: 8; maxlength: 20; required: lower, upper; required: digit; allowed: unicode;"
    },
    "vetsfirstchoice.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; allowed: [?!@$%^+=&];"
    },
    "vince.com": {
      "password-rules": "minlength: 8; required: digit; required: lower; required: upper; required: [$%/(){}=?!.,_*|+~#[]];"
    },
    "virginmobile.ca": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$@];"
    },
    "visa.com": {
      "password-rules": "minlength: 6; maxlength: 32;"
    },
    "visabenefits-auth.axa-assistance.us": {
      "password-rules": 'minlength: 8; required: lower; required: upper; required: digit; required: [!"#$%&()*,.:<>?@^{|}];'
    },
    "vivo.com.br": {
      "password-rules": "maxlength: 6; max-consecutive: 3; allowed: digit;"
    },
    "volaris.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; required: special;"
    },
    "vons.com": {
      "password-rules": "minlength: 8; maxlength: 40; required: upper; required: [!#$%&*@^]; allowed: lower,digit;"
    },
    "wa.aaa.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; allowed: ascii-printable;"
    },
    "walkhighlands.co.uk": {
      "password-rules": "minlength: 9; maxlength: 15; required: lower; required: upper; required: digit; allowed: special;"
    },
    "walmart.com": {
      "password-rules": "allowed: lower, upper, digit, [-(~!@#$%^&*_+=`|(){}[:;\"'<>,.?]];"
    },
    "waze.com": {
      "password-rules": "minlength: 8; maxlength: 64; required: lower, upper, digit;"
    },
    "wccls.org": {
      "password-rules": "minlength: 4; maxlength: 16; allowed: lower, upper, digit;"
    },
    "web.de": {
      "password-rules": "minlength: 8; maxlength: 40; allowed: lower, upper, digit, [-<=>~!|()@#{}$%,.?^'&*_+`:;\"[]];"
    },
    "wegmans.com": {
      "password-rules": "minlength: 8; required: digit; required: upper,lower; required: [!#$%&*+=?@^];"
    },
    "weibo.com": {
      "password-rules": "minlength: 6; maxlength: 16;"
    },
    "wellsfargo.com": {
      "password-rules": "minlength: 8; maxlength: 32; required: lower; required: upper; required: digit;"
    },
    "wmata.com": {
      "password-rules": 'minlength: 8; required: lower, upper; required: digit; required: digit; required: [-!@#$%^&*~/"()_=+\\|,.?[]];'
    },
    "worldstrides.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [-!#$%&*+=?@^_~];"
    },
    "wsj.com": {
      "password-rules": "minlength: 5; maxlength: 15; required: digit; allowed: lower, upper, [-~!@#$^*_=`|(){}[:;\"'<>,.?]];"
    },
    "xfinity.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower, upper; required: digit;"
    },
    "xvoucher.com": {
      "password-rules": "minlength: 11; required: upper; required: digit; required: [!@#$%&_];"
    },
    "yatra.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&'()+,.:?@[_`~]];"
    },
    "zara.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit;"
    },
    "zdf.de": {
      "password-rules": "minlength: 8; required: upper; required: digit; allowed: lower, special;"
    },
    "zoom.us": {
      "password-rules": "minlength: 8; maxlength: 32; max-consecutive: 6; required: lower; required: upper; required: digit;"
    }
  };

  // src/PasswordGenerator.js
  var _previous;
  var PasswordGenerator = class {
    constructor() {
      /** @type {string|null} */
      __privateAdd(this, _previous, null);
    }
    /** @returns {boolean} */
    get generated() {
      return __privateGet(this, _previous) !== null;
    }
    /** @returns {string|null} */
    get password() {
      return __privateGet(this, _previous);
    }
    /** @param {import('../packages/password').GenerateOptions} [params] */
    generate(params = {}) {
      if (__privateGet(this, _previous)) {
        return __privateGet(this, _previous);
      }
      __privateSet(this, _previous, generate({ ...params, rules: rules_default }));
      return __privateGet(this, _previous);
    }
  };
  _previous = new WeakMap();

  // src/Form/FormAnalyzer.js
  var FormAnalyzer = class {
    /**
     * @param {HTMLElement} form
     * @param {import('../site-specific-feature').default|null} siteSpecificFeature
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {Matching} [matching]
     */
    constructor(form, siteSpecificFeature, input, matching) {
      /** @type HTMLElement */
      __publicField(this, "form");
      /** @type Matching */
      __publicField(this, "matching");
      /** @type {import('../site-specific-feature').default|null} */
      __publicField(this, "siteSpecificFeature");
      /** @type {undefined|boolean} */
      __publicField(this, "_isCCForm");
      this.form = form;
      this.siteSpecificFeature = siteSpecificFeature;
      this.matching = matching || new Matching(matchingConfiguration);
      this.autofillSignal = 0;
      this.hybridSignal = 0;
      this.signals = [];
      this.evaluateElAttributes(input, 1, true);
      if (form !== input) {
        this.evaluateForm();
      } else {
        this.evaluatePage();
      }
      return this;
    }
    areLoginOrSignupSignalsWeak() {
      return Math.abs(this.autofillSignal) < 10;
    }
    /**
     * Hybrid forms can be used for both login and signup
     * @returns {boolean}
     */
    get isHybrid() {
      const forcedFormType = this.siteSpecificFeature?.getForcedFormType(this.form);
      if (forcedFormType) {
        return forcedFormType === "hybrid";
      }
      return this.hybridSignal > 0 && this.areLoginOrSignupSignalsWeak();
    }
    get isLogin() {
      const forcedFormType = this.siteSpecificFeature?.getForcedFormType(this.form);
      if (forcedFormType) {
        return forcedFormType === "login";
      }
      if (this.isHybrid) return false;
      return this.autofillSignal < 0;
    }
    get isSignup() {
      const forcedFormType = this.siteSpecificFeature?.getForcedFormType(this.form);
      if (forcedFormType) {
        return forcedFormType === "signup";
      }
      if (this.isHybrid) return false;
      return this.autofillSignal >= 0;
    }
    /**
     * Tilts the scoring towards Signup
     * @param {number} strength
     * @param {string} signal
     * @returns {FormAnalyzer}
     */
    increaseSignalBy(strength, signal) {
      this.autofillSignal += strength;
      this.signals.push(`${signal}: +${strength}`);
      return this;
    }
    /**
     * Tilts the scoring towards Login
     * @param {number} strength
     * @param {string} signal
     * @returns {FormAnalyzer}
     */
    decreaseSignalBy(strength, signal) {
      this.autofillSignal -= strength;
      this.signals.push(`${signal}: -${strength}`);
      return this;
    }
    /**
     * Increases the probability that this is a hybrid form (can be either login or signup)
     * @param {number} strength
     * @param {string} signal
     * @returns {FormAnalyzer}
     */
    increaseHybridSignal(strength, signal) {
      this.hybridSignal += strength;
      this.signals.push(`${signal} (hybrid): +${strength}`);
      return this;
    }
    /**
     * Updates the Login<->Signup signal according to the provided parameters
     * @param {object} p
     * @param {string} p.string - The string to check
     * @param {number} p.strength - Strength of the signal
     * @param {string} [p.signalType] - For debugging purposes, we give a name to the signal
     * @param {boolean} [p.shouldFlip] - Flips the signals, i.e. when a link points outside. See below
     * @param {boolean} [p.shouldCheckUnifiedForm] - Should check for login/signup forms
     * @param {boolean} [p.shouldBeConservative] - Should use the conservative signup regex
     * @returns {FormAnalyzer}
     */
    updateSignal({
      string,
      strength,
      signalType = "generic",
      shouldFlip = false,
      shouldCheckUnifiedForm = false,
      shouldBeConservative = false
    }) {
      if (!string || string.length > constants.TEXT_LENGTH_CUTOFF) return this;
      const matchesLogin = safeRegexTest(/current.?password/i, string) || safeRegexTest(this.matching.getDDGMatcherRegex("loginRegex"), string) || safeRegexTest(this.matching.getDDGMatcherRegex("resetPasswordLink"), string);
      if (shouldCheckUnifiedForm && matchesLogin && safeRegexTest(this.matching.getDDGMatcherRegex("conservativeSignupRegex"), string)) {
        this.increaseHybridSignal(strength, signalType);
        return this;
      }
      const signupRegexToUse = this.matching.getDDGMatcherRegex(shouldBeConservative ? "conservativeSignupRegex" : "signupRegex");
      const matchesSignup = safeRegexTest(/new.?(password|username)/i, string) || safeRegexTest(signupRegexToUse, string);
      if (shouldFlip) {
        if (matchesLogin) this.increaseSignalBy(strength, signalType);
        if (matchesSignup) this.decreaseSignalBy(strength, signalType);
      } else {
        if (matchesLogin) this.decreaseSignalBy(strength, signalType);
        if (matchesSignup) this.increaseSignalBy(strength, signalType);
      }
      return this;
    }
    evaluateElAttributes(el, signalStrength = 3, isInput = false) {
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name === "style") return;
        const attributeString = `${attr.name}=${attr.value}`;
        this.updateSignal({
          string: attributeString,
          strength: signalStrength,
          signalType: `${el.name} attr: ${attributeString}`,
          shouldCheckUnifiedForm: isInput,
          shouldBeConservative: true
        });
      });
    }
    evaluateUrl() {
      const { pathname, hash } = window.location;
      const pathToMatch = pathname + hash;
      const matchesLogin = safeRegexTest(this.matching.getDDGMatcherRegex("loginRegex"), pathToMatch);
      const matchesSignup = safeRegexTest(this.matching.getDDGMatcherRegex("conservativeSignupRegex"), pathToMatch);
      if (matchesLogin && matchesSignup) return;
      if (matchesLogin) {
        this.decreaseSignalBy(1, "url matches login");
      }
      if (matchesSignup) {
        this.increaseSignalBy(1, "url matches signup");
      }
    }
    evaluatePageTitle() {
      const pageTitle = document.title;
      this.updateSignal({ string: pageTitle, strength: 2, signalType: `page title: ${pageTitle}`, shouldCheckUnifiedForm: true });
    }
    evaluatePageHeadings() {
      const headings = document.querySelectorAll("h1, h2, h3");
      headings.forEach((heading) => {
        const textContent = removeExcessWhitespace(heading.textContent || "");
        this.updateSignal({
          string: textContent,
          strength: 0.5,
          signalType: `heading: ${textContent}`,
          shouldCheckUnifiedForm: true,
          shouldBeConservative: true
        });
      });
    }
    evaluatePage() {
      this.evaluateUrl();
      this.evaluatePageTitle();
      this.evaluatePageHeadings();
      const buttons = document.querySelectorAll(this.matching.cssSelector("submitButtonSelector"));
      buttons.forEach((button) => {
        if (button instanceof HTMLButtonElement) {
          if (!button.form && !button.closest("form")) {
            this.evaluateElement(button);
            this.evaluateElAttributes(button, 0.5);
          }
        }
      });
    }
    evaluatePasswordHints() {
      const textContent = removeExcessWhitespace(this.form.textContent, 200);
      if (textContent) {
        const hasPasswordHints = safeRegexTest(this.matching.getDDGMatcherRegex("passwordHintsRegex"), textContent, 500);
        if (hasPasswordHints) {
          this.increaseSignalBy(5, "Password hints");
        }
      }
    }
    /**
     * Function that checks if the element is link like and navigating away from the current page
     * @param {any} el
     * @returns {boolean}
     */
    isOutboundLink(el) {
      const tagName = el.nodeName.toLowerCase();
      const isCustomWebElementLink = customElements?.get(tagName) != null && /-link$/.test(tagName) && findElementsInShadowTree(el, "a").length > 0;
      const isElementLikelyALink = (el2) => {
        if (el2 == null) return false;
        return el2 instanceof HTMLAnchorElement && el2.href && !el2.getAttribute("href")?.startsWith("#") || (el2.getAttribute("role") || "").toUpperCase() === "LINK" || el2.matches("button[class*=secondary]");
      };
      return isCustomWebElementLink || isElementLikelyALink(el) || isElementLikelyALink(el.closest("a"));
    }
    evaluateElement(el) {
      const string = getTextShallow(el);
      if (el.matches(this.matching.cssSelector("password"))) {
        this.updateSignal({
          string: el.getAttribute("autocomplete") || el.getAttribute("name") || "",
          strength: 5,
          signalType: `explicit: ${el.getAttribute("autocomplete")}`
        });
        return;
      }
      if (el.matches(this.matching.cssSelector("submitButtonSelector") + ", *[class*=button]")) {
        let likelyASubmit = isLikelyASubmitButton(el, this.matching);
        let shouldFlip = false;
        if (likelyASubmit) {
          this.form.querySelectorAll("input[type=submit], button[type=submit]").forEach((submit) => {
            if (el.getAttribute("type") !== "submit" && el !== submit) {
              likelyASubmit = false;
            }
          });
        } else {
          const hasAnotherSubmitButton = Boolean(this.form.querySelector("input[type=submit], button[type=submit]"));
          const buttonText = string;
          if (hasAnotherSubmitButton) {
            shouldFlip = this.shouldFlipScoreForButtonText(buttonText);
          } else {
            const isOutboundLink = this.isOutboundLink(el);
            shouldFlip = isOutboundLink && this.shouldFlipScoreForButtonText(buttonText);
          }
        }
        const strength = likelyASubmit ? 20 : 4;
        this.updateSignal({ string, strength, signalType: `button: ${string}`, shouldFlip });
        return;
      }
      if (this.isOutboundLink(el)) {
        let shouldFlip = true;
        let strength = 1;
        if (safeRegexTest(this.matching.getDDGMatcherRegex("resetPasswordLink"), string)) {
          shouldFlip = false;
          strength = 3;
        } else if (safeRegexTest(this.matching.getDDGMatcherRegex("loginProvidersRegex"), string)) {
          shouldFlip = false;
        }
        this.updateSignal({ string, strength, signalType: `external link: ${string}`, shouldFlip });
      } else {
        const isH1Element = el.tagName === "H1";
        this.updateSignal({ string, strength: isH1Element ? 3 : 1, signalType: `generic: ${string}`, shouldCheckUnifiedForm: true });
      }
    }
    evaluateForm() {
      this.evaluateUrl();
      this.evaluatePageTitle();
      this.evaluateElAttributes(this.form);
      const selector = this.matching.cssSelector("safeUniversalSelector");
      const formElements = queryElementsWithShadow(this.form, selector);
      for (let i = 0; i < formElements.length; i++) {
        if (i >= 200) break;
        const element = formElements[i];
        const displayValue = window.getComputedStyle(element, null).getPropertyValue("display");
        if (displayValue !== "none") this.evaluateElement(element);
      }
      const relevantFields = this.form.querySelectorAll(this.matching.cssSelector("genericTextInputField"));
      if (relevantFields.length >= 4) {
        this.increaseSignalBy(relevantFields.length * 1.5, "many fields: it is probably not a login");
      }
      if (this.areLoginOrSignupSignalsWeak()) {
        this.evaluatePasswordHints();
      }
      if (this.autofillSignal === 0) {
        this.evaluatePageHeadings();
      }
      return this;
    }
    /**
     * Tries to infer if it's a credit card form
     * @returns {boolean}
     */
    isCCForm() {
      if (this._isCCForm !== void 0) return this._isCCForm;
      const formEl = this.form;
      const ccFieldSelector = this.matching.joinCssSelectors("cc");
      if (!ccFieldSelector) {
        this._isCCForm = false;
        return this._isCCForm;
      }
      const hasCCSelectorChild = formEl.matches(ccFieldSelector) || formEl.querySelector(ccFieldSelector);
      if (hasCCSelectorChild) {
        this._isCCForm = true;
        return this._isCCForm;
      }
      const hasCCAttribute = [...formEl.attributes].some(
        ({ name, value }) => safeRegexTest(/(credit|payment).?card/i, `${name}=${value}`)
      );
      if (hasCCAttribute) {
        this._isCCForm = true;
        return this._isCCForm;
      }
      const textMatches = formEl.textContent?.match(/(credit|payment).?card(.?number)?|ccv|security.?code|cvv|cvc|csc/gi);
      const deDupedMatches = new Set(textMatches?.map((match) => match.toLowerCase()));
      this._isCCForm = Boolean(textMatches && deDupedMatches.size > 1);
      return this._isCCForm;
    }
    /**
     * @param {string} text
     * @returns {boolean}
     */
    shouldFlipScoreForButtonText(text) {
      const isForgotPassword = safeRegexTest(this.matching.getDDGMatcherRegex("resetPasswordLink"), text);
      const isSocialButton = /facebook|twitter|google|apple/i.test(text);
      return !isForgotPassword && !isSocialButton;
    }
  };
  var FormAnalyzer_default = FormAnalyzer;

  // src/Form/logo-svg.js
  var daxSvg = `
<svg width="128" height="128" fill="none" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <path clip-rule="evenodd" d="m64 128c35.346 0 64-28.654 64-64s-28.654-64-64-64-64 28.654-64 64 28.654 64 64 64z" fill="#de5833" fill-rule="evenodd"/>
    <path clip-rule="evenodd" d="m73 111.75c0-.5.123-.614-1.466-3.782-4.224-8.459-8.47-20.384-6.54-28.075.353-1.397-3.978-51.744-7.04-53.365-3.402-1.813-7.588-4.69-11.418-5.33-1.943-.31-4.49-.164-6.482.105-.353.047-.368.683-.03.798 1.308.443 2.895 1.212 3.83 2.375.178.22-.06.566-.342.577-.882.032-2.482.402-4.593 2.195-.244.207-.041.592.273.53 4.536-.897 9.17-.455 11.9 2.027.177.16.084.45-.147.512-23.694 6.44-19.003 27.05-12.696 52.344 5.619 22.53 7.733 29.792 8.4 32.004a.718.718 0 0 0 .423.467c8.156 3.248 25.928 3.392 25.928-2.132z" fill="#ddd" fill-rule="evenodd"/>
    <path d="m76.25 116.5c-2.875 1.125-8.5 1.625-11.75 1.625-4.764 0-11.625-.75-14.125-1.875-1.544-4.751-6.164-19.48-10.727-38.185l-.447-1.827-.004-.015c-5.424-22.157-9.855-40.253 14.427-45.938.222-.052.33-.317.184-.492-2.786-3.305-8.005-4.388-14.605-2.111-.27.093-.506-.18-.337-.412 1.294-1.783 3.823-3.155 5.071-3.756.258-.124.242-.502-.03-.588a27.877 27.877 0 0 0 -3.772-.9c-.37-.059-.403-.693-.032-.743 9.356-1.259 19.125 1.55 24.028 7.726a.326.326 0 0 0 .186.114c17.952 3.856 19.238 32.235 17.17 33.528-.408.255-1.715.108-3.438-.085-6.986-.781-20.818-2.329-9.402 18.948.113.21-.036.488-.272.525-6.438 1 1.812 21.173 7.875 34.461z" fill="#fff"/>
    <path d="m84.28 90.698c-1.367-.633-6.621 3.135-10.11 6.028-.728-1.031-2.103-1.78-5.203-1.242-2.713.472-4.211 1.126-4.88 2.254-4.283-1.623-11.488-4.13-13.229-1.71-1.902 2.646.476 15.161 3.003 16.786 1.32.849 7.63-3.208 10.926-6.005.532.749 1.388 1.178 3.148 1.137 2.662-.062 6.979-.681 7.649-1.921.04-.075.075-.164.105-.266 3.388 1.266 9.35 2.606 10.682 2.406 3.47-.521-.484-16.723-2.09-17.467z" fill="#3ca82b"/>
    <path d="m74.49 97.097c.144.256.26.526.358.8.483 1.352 1.27 5.648.674 6.709-.595 1.062-4.459 1.574-6.843 1.615s-2.92-.831-3.403-2.181c-.387-1.081-.577-3.621-.572-5.075-.098-2.158.69-2.916 4.334-3.506 2.696-.436 4.121.071 4.944.94 3.828-2.857 10.215-6.889 10.838-6.152 3.106 3.674 3.499 12.42 2.826 15.939-.22 1.151-10.505-1.139-10.505-2.38 0-5.152-1.337-6.565-2.65-6.71zm-22.53-1.609c.843-1.333 7.674.325 11.424 1.993 0 0-.77 3.491.456 7.604.359 1.203-8.627 6.558-9.8 5.637-1.355-1.065-3.85-12.432-2.08-15.234z" fill="#4cba3c"/>
    <path clip-rule="evenodd" d="m55.269 68.406c.553-2.403 3.127-6.932 12.321-6.822 4.648-.019 10.422-.002 14.25-.436a51.312 51.312 0 0 0 12.726-3.095c3.98-1.519 5.392-1.18 5.887-.272.544.999-.097 2.722-1.488 4.309-2.656 3.03-7.431 5.38-15.865 6.076-8.433.698-14.02-1.565-16.425 2.118-1.038 1.589-.236 5.333 7.92 6.512 11.02 1.59 20.072-1.917 21.19.201 1.119 2.118-5.323 6.428-16.362 6.518s-17.934-3.865-20.379-5.83c-3.102-2.495-4.49-6.133-3.775-9.279z" fill="#fc3" fill-rule="evenodd"/>
    <g fill="#14307e" opacity=".8">
      <path d="m69.327 42.127c.616-1.008 1.981-1.786 4.216-1.786 2.234 0 3.285.889 4.013 1.88.148.202-.076.44-.306.34a59.869 59.869 0 0 1 -.168-.073c-.817-.357-1.82-.795-3.54-.82-1.838-.026-2.997.435-3.727.831-.246.134-.634-.133-.488-.372zm-25.157 1.29c2.17-.907 3.876-.79 5.081-.504.254.06.43-.213.227-.377-.935-.755-3.03-1.692-5.76-.674-2.437.909-3.585 2.796-3.592 4.038-.002.292.6.317.756.07.42-.67 1.12-1.646 3.289-2.553z"/>
      <path clip-rule="evenodd" d="m75.44 55.92a3.47 3.47 0 0 1 -3.474-3.462 3.47 3.47 0 0 1 3.475-3.46 3.47 3.47 0 0 1 3.474 3.46 3.47 3.47 0 0 1 -3.475 3.462zm2.447-4.608a.899.899 0 0 0 -1.799 0c0 .494.405.895.9.895.499 0 .9-.4.9-.895zm-25.464 3.542a4.042 4.042 0 0 1 -4.049 4.037 4.045 4.045 0 0 1 -4.05-4.037 4.045 4.045 0 0 1 4.05-4.037 4.045 4.045 0 0 1 4.05 4.037zm-1.193-1.338a1.05 1.05 0 0 0 -2.097 0 1.048 1.048 0 0 0 2.097 0z" fill-rule="evenodd"/>
    </g>
    <path clip-rule="evenodd" d="m64 117.75c29.685 0 53.75-24.065 53.75-53.75s-24.065-53.75-53.75-53.75-53.75 24.065-53.75 53.75 24.065 53.75 53.75 53.75zm0 5c32.447 0 58.75-26.303 58.75-58.75s-26.303-58.75-58.75-58.75-58.75 26.303-58.75 58.75 26.303 58.75 58.75 58.75z" fill="#fff" fill-rule="evenodd"/>
</svg>
`.trim();
  var daxBase64 = `data:image/svg+xml;base64,${window.btoa(daxSvg)}`;
  var daxGrayscaleSvg = `
<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M64 128C99.3586 128 128 99.3586 128 64C128 28.6414 99.3586 0 64 0C28.6414 0 0 28.6414 0 64C0 99.3586 28.6414 128 64 128Z" fill="#444444"/>
    <path d="M76.9991 52.2137C77.4966 52.2137 77.9009 51.8094 77.9009 51.3118C77.9009 50.8143 77.4966 50.41 76.9991 50.41C76.5015 50.41 76.0972 50.8143 76.0972 51.3118C76.0972 51.8094 76.5015 52.2137 76.9991 52.2137Z" fill="white"/>
    <path d="M50.1924 54.546C50.7833 54.546 51.2497 54.0796 51.2497 53.4887C51.2497 52.8978 50.7833 52.4314 50.1924 52.4314C49.6015 52.4314 49.1351 52.8978 49.1351 53.4887C49.1351 54.0796 49.6015 54.546 50.1924 54.546Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M122.75 64C122.75 96.4468 96.4467 122.75 64 122.75C31.5533 122.75 5.25 96.4468 5.25 64C5.25 31.5533 31.5533 5.25 64 5.25C96.4467 5.25 122.75 31.5533 122.75 64ZM46.7837 114.934C45.5229 110.558 42.6434 100.26 38.2507 82.659C31.9378 57.3762 27.2419 36.7581 50.9387 30.3208C51.1875 30.2586 51.2808 29.9787 51.0942 29.8232C48.3576 27.3353 43.724 26.9 39.1836 27.8018C38.9659 27.8329 38.8105 27.6774 38.8105 27.4908C38.8105 27.4286 38.8105 27.3664 38.8726 27.3042C39.9611 25.7804 41.9203 24.5987 43.2575 23.8834C42.3245 23.0438 41.0806 22.484 40.0233 22.1109C39.7123 21.9865 39.7123 21.4578 39.9922 21.3334C40.0233 21.3023 40.0544 21.2712 40.1166 21.2712C49.446 20.0273 59.2419 22.8261 64.0622 28.9835C64.1243 29.0457 64.1865 29.0768 64.2487 29.1079C80.0777 32.4976 82.9698 54.9194 82.0058 61.1079C87.5724 60.4549 91.7395 59.0866 94.5072 58.0292C98.4878 56.5054 99.8872 56.8475 100.385 57.7493C100.913 58.7756 100.292 60.486 98.8921 62.072C96.2487 65.0885 91.4596 67.452 83.032 68.1361C80.1189 68.3726 77.544 68.2598 75.3225 68.1625C71.1174 67.9784 68.1791 67.8497 66.6122 70.2508C65.586 71.8368 66.3945 75.5686 74.5422 76.7503C80.3586 77.5883 85.6281 77.0026 89.4701 76.5755C92.8998 76.1943 95.192 75.9395 95.7201 76.9369C96.8396 79.0827 90.4023 83.3742 79.3624 83.4675C78.5228 83.4675 77.6831 83.4364 76.8746 83.4053C70.033 83.0633 64.9951 81.1974 61.8542 79.487C61.7609 79.4559 61.6987 79.4248 61.6676 79.3937C61.1078 79.0827 60.0194 79.6424 60.6725 80.8242C61.0456 81.5394 63.0359 83.3742 66.0213 84.9602C65.7104 87.4481 66.4878 91.2732 67.825 95.6269C67.9804 95.601 68.1357 95.5697 68.2955 95.5376C68.5196 95.4924 68.7526 95.4455 69.0068 95.4092C71.7123 94.9738 73.1428 95.4714 73.9514 96.3422C77.7764 93.4811 84.1516 89.4384 84.7735 90.1847C87.8833 93.8854 88.2876 102.624 87.6035 106.138C87.5724 106.2 87.5102 106.262 87.3858 106.325C85.9242 106.947 77.8698 104.746 77.8698 103.596C77.5588 97.866 76.4937 97.3373 75.2498 97.0574H74.4178C74.4489 97.0885 74.48 97.1507 74.5111 97.2129L74.791 97.866C75.2886 99.2343 76.066 103.526 75.4752 104.583C74.8843 105.641 71.0281 106.169 68.6336 106.2C66.2701 106.231 65.7415 105.361 65.2439 104.023C64.8707 102.935 64.6841 100.416 64.6841 98.9544C64.653 98.519 64.6841 98.1459 64.7463 97.8038C64.0311 98.1148 62.9816 98.83 62.6395 99.2964C62.5462 100.696 62.5462 102.935 63.2925 105.423C63.6657 106.605 55.1992 111.642 54.0174 110.71C52.8046 109.745 50.6278 100.292 51.5607 96.4666C50.5656 96.5599 49.757 96.8708 49.3216 97.4928C47.3624 100.198 49.8192 113.135 52.4314 114.814C53.7998 115.716 60.6414 111.86 64.0311 108.968C64.5908 109.745 65.6638 109.808 66.9854 109.808C68.7269 109.745 71.1525 109.497 72.8629 108.968C73.8867 111.367 75.1219 114.157 76.1353 116.374C99.9759 110.873 117.75 89.5121 117.75 64C117.75 34.3147 93.6853 10.25 64 10.25C34.3147 10.25 10.25 34.3147 10.25 64C10.25 87.664 25.5423 107.756 46.7837 114.934ZM77.1275 42.5198C77.168 42.5379 77.2081 42.5558 77.2478 42.5734C77.4655 42.6667 77.7142 42.418 77.5587 42.2314C76.8435 41.2673 75.7862 40.3655 73.5471 40.3655C71.308 40.3655 69.9397 41.1429 69.3177 42.1381C69.1933 42.3869 69.5665 42.6356 69.8153 42.5112C70.5617 42.107 71.7123 41.6405 73.5471 41.6716C75.2952 41.7012 76.3094 42.1543 77.1275 42.5198ZM75.4441 55.9146C77.3722 55.9146 78.9271 54.3596 78.9271 52.4627C78.9271 50.5346 77.3722 49.0108 75.4441 49.0108C73.516 49.0108 71.9611 50.5657 71.9611 52.4627C71.9611 54.3596 73.516 55.9146 75.4441 55.9146ZM52.4314 54.8572C52.4314 52.6181 50.6278 50.8145 48.3887 50.8145C46.1496 50.8145 44.3148 52.6181 44.3459 54.8572C44.3459 57.0963 46.1496 58.9 48.3887 58.9C50.6278 58.9 52.4314 57.0963 52.4314 54.8572ZM40.8629 45.9631C41.2983 45.3101 41.9825 44.3149 44.1593 43.4131C46.3362 42.5112 48.0466 42.6356 49.2283 42.9155C49.4771 42.9777 49.6637 42.6978 49.446 42.5423C48.5131 41.7649 46.4295 40.8319 43.6929 41.8582C41.2672 42.76 40.1166 44.657 40.1166 45.9009C40.1166 46.1808 40.7074 46.2119 40.8629 45.9631Z" fill="white"/>
</svg>
`.trim();
  var daxGrayscaleBase64 = `data:image/svg+xml;base64,${window.btoa(daxGrayscaleSvg)}`;

  // src/UI/img/ddgPasswordIcon.js
  var key = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuOSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTUuNSA2YTIuNSAyLjUgMCAxIDEgMCA1IDIuNSAyLjUgMCAwIDEgMC01bTAgMS41YTEgMSAwIDEgMCAwIDIgMSAxIDAgMCAwIDAtMiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuOSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQuOTk4IDJBNy4wMDUgNy4wMDUgMCAwIDEgMjIgOS4wMDdhNy4wMDQgNy4wMDQgMCAwIDEtOC43MDUgNi43OTdjLS4xNjMtLjA0MS0uMjg2LjAwOC0uMzQ1LjA2N2wtMi41NTcgMi41NTlhMiAyIDAgMCAxLTEuNDE1LjU4NmgtLjk4MnYuNzM0QTIuMjUgMi4yNSAwIDAgMSA1Ljc0NSAyMmgtLjk5M2EyLjc1IDIuNzUgMCAwIDEtMi43NS0yLjczNUwyIDE4Ljc3YTMuNzUgMy43NSAwIDAgMSAxLjA5OC0yLjY3bDUuMDQtNS4wNDNjLjA2LS4wNi4xMDctLjE4My4wNjYtLjM0NmE3IDcgMCAwIDEtLjIwOC0xLjcwNEE3LjAwNCA3LjAwNCAwIDAgMSAxNC45OTggMm0wIDEuNWE1LjUwNCA1LjUwNCAwIDAgMC01LjMzNyA2Ljg0OGMuMTQ3LjU4OS4wMjcgMS4yNzktLjQ2MiAxLjc2OGwtNS4wNCA1LjA0NGEyLjI1IDIuMjUgMCAwIDAtLjY1OSAxLjYwM2wuMDAzLjQ5NGExLjI1IDEuMjUgMCAwIDAgMS4yNSAxLjI0M2guOTkyYS43NS43NSAwIDAgMCAuNzUtLjc1di0uNzM0YTEuNSAxLjUgMCAwIDEgMS41LTEuNWguOTgzYS41LjUgMCAwIDAgLjM1My0uMTQ3bDIuNTU4LTIuNTU5Yy40OS0uNDkgMS4xOC0uNjA5IDEuNzctLjQ2MWE1LjUwNCA1LjUwNCAwIDAgMCA2Ljg0LTUuMzQyQTUuNTA1IDUuNTA1IDAgMCAwIDE1IDMuNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=";
  var keyFilled = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzc2NDMxMCIgZmlsbC1vcGFjaXR5PSIuOSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTUuNSA2YTIuNSAyLjUgMCAxIDEgMCA1IDIuNSAyLjUgMCAwIDEgMC01bTAgMS41YTEgMSAwIDEgMCAwIDIgMSAxIDAgMCAwIDAtMiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iIzc2NDMxMCIgZmlsbC1vcGFjaXR5PSIuOSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQuOTk4IDJBNy4wMDUgNy4wMDUgMCAwIDEgMjIgOS4wMDdhNy4wMDQgNy4wMDQgMCAwIDEtOC43MDUgNi43OTdjLS4xNjMtLjA0MS0uMjg2LjAwOC0uMzQ1LjA2N2wtMi41NTcgMi41NTlhMiAyIDAgMCAxLTEuNDE1LjU4NmgtLjk4MnYuNzM0QTIuMjUgMi4yNSAwIDAgMSA1Ljc0NSAyMmgtLjk5M2EyLjc1IDIuNzUgMCAwIDEtMi43NS0yLjczNUwyIDE4Ljc3YTMuNzUgMy43NSAwIDAgMSAxLjA5OC0yLjY3bDUuMDQtNS4wNDNjLjA2LS4wNi4xMDctLjE4My4wNjYtLjM0NmE3IDcgMCAwIDEtLjIwOC0xLjcwNEE3LjAwNCA3LjAwNCAwIDAgMSAxNC45OTggMm0wIDEuNWE1LjUwNCA1LjUwNCAwIDAgMC01LjMzNyA2Ljg0OGMuMTQ3LjU4OS4wMjcgMS4yNzktLjQ2MiAxLjc2OGwtNS4wNCA1LjA0NGEyLjI1IDIuMjUgMCAwIDAtLjY1OSAxLjYwM2wuMDAzLjQ5NGExLjI1IDEuMjUgMCAwIDAgMS4yNSAxLjI0M2guOTkyYS43NS43NSAwIDAgMCAuNzUtLjc1di0uNzM0YTEuNSAxLjUgMCAwIDEgMS41LTEuNWguOTgzYS41LjUgMCAwIDAgLjM1My0uMTQ3bDIuNTU4LTIuNTU5Yy40OS0uNDkgMS4xOC0uNjA5IDEuNzctLjQ2MWE1LjUwNCA1LjUwNCAwIDAgMCA2Ljg0LTUuMzQyQTUuNTA1IDUuNTA1IDAgMCAwIDE1IDMuNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4K";
  var keyLogin = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTExLjIyNCA0LjY0YS45LjkgMCAwIDAgLjY0Ny0uMTY1IDUuNDcgNS40NyAwIDAgMSAzLjEyNy0uOTc1QTUuNTA0IDUuNTA0IDAgMCAxIDIwLjUgOS4wMDZhNS41MDQgNS41MDQgMCAwIDEtNi44NCA1LjM0M2MtLjU5LS4xNDgtMS4yODEtLjAyOC0xLjc3MS40NjJsLTIuNTU3IDIuNTU4YS41LjUgMCAwIDEtLjM1NC4xNDdoLS45ODJhMS41IDEuNSAwIDAgMC0xLjUgMS41di43MzRhLjc1Ljc1IDAgMCAxLS43NS43NWgtLjk5M2ExLjI1IDEuMjUgMCAwIDEtMS4yNS0xLjI0NGwtLjAwMy0uNDk0YTIuMjUgMi4yNSAwIDAgMSAuNjU5LTEuNjAybDUuMDQtNS4wNDNjLjM0My0uMzQ0LjQ2MS0uNzExLjQ3OS0xLjA5NS4wMjctLjU4Mi0uNzM3LS44NDctMS4xNzktLjQ2N2wtLjA2Ni4wNTZhLjcuNyAwIDAgMC0uMTU4LjIzMi44LjggMCAwIDEtLjEzNy4yMTNMMy4wOTggMTYuMUEzLjc1IDMuNzUgMCAwIDAgMiAxOC43N2wuMDAzLjQ5NEEyLjc1IDIuNzUgMCAwIDAgNC43NTMgMjJoLjk5MmEyLjI1IDIuMjUgMCAwIDAgMi4yNS0yLjI1di0uNzM0aC45ODNhMiAyIDAgMCAwIDEuNDE1LS41ODZsMi41NTctMi41NTljLjA1OS0uMDU5LjE4Mi0uMTA4LjM0Ni0uMDY3QTcuMDA0IDcuMDA0IDAgMCAwIDIyIDkuMDA2IDcuMDA0IDcuMDA0IDAgMCAwIDEwLjgyNiAzLjM4Yy0uNTMzLjM5NS0uMjYgMS4xNjYuMzk3IDEuMjZaIi8+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTUuNSA2YTIuNSAyLjUgMCAxIDEgMCA1IDIuNSAyLjUgMCAwIDEgMC01bTAgMS41YTEgMSAwIDEgMCAwIDIgMSAxIDAgMCAwIDAtMiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTcuMTI1IDIuODA0QzcgMi4xNiA2LjkxNSAyIDYuNSAyYy0uNDE0IDAtLjUuMTYtLjYyNS44MDQtLjA4LjQxMy0uMjEyIDEuODItLjI5NiAyLjc3NS0uOTU0LjA4NC0yLjM2Mi4yMTYtMi43NzUuMjk2QzIuMTYgNiAyIDYuMDg1IDIgNi41YzAgLjQxNC4xNjEuNS44MDQuNjI1LjQxMi4wOCAxLjgxOC4yMTIgMi43NzIuMjk2LjA4My45ODkuMjE4IDIuNDYxLjMgMi43NzUuMTI0LjQ4My4yMS44MDQuNjI0LjgwNHMuNS0uMTYuNjI1LS44MDRjLjA4LS40MTIuMjEyLTEuODE3LjI5Ni0yLjc3MS45OS0uMDg0IDIuNDYyLS4yMTkgMi43NzYtLjNDMTAuNjc5IDcgMTEgNi45MTUgMTEgNi41YzAtLjQxNC0uMTYtLjUtLjgwMy0uNjI1LS40MTMtLjA4LTEuODIxLS4yMTItMi43NzUtLjI5Ni0uMDg1LS45NTQtLjIxNi0yLjM2Mi0uMjk3LTIuNzc1bS00LjM0MiA4Ljc2MWEuNzgzLjc4MyAwIDEgMCAwLTEuNTY1Ljc4My43ODMgMCAwIDAgMCAxLjU2NSIvPgo8L3N2Zz4K";
  var keyLoginFilled = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzc2NDMxMCIgZD0iTTExLjIyNCA0LjY0YS45LjkgMCAwIDAgLjY0Ny0uMTY1IDUuNDcgNS40NyAwIDAgMSAzLjEyNy0uOTc1QTUuNTA0IDUuNTA0IDAgMCAxIDIwLjUgOS4wMDZhNS41MDQgNS41MDQgMCAwIDEtNi44NCA1LjM0M2MtLjU5LS4xNDgtMS4yODEtLjAyOC0xLjc3MS40NjJsLTIuNTU3IDIuNTU4YS41LjUgMCAwIDEtLjM1NC4xNDdoLS45ODJhMS41IDEuNSAwIDAgMC0xLjUgMS41di43MzRhLjc1Ljc1IDAgMCAxLS43NS43NWgtLjk5M2ExLjI1IDEuMjUgMCAwIDEtMS4yNS0xLjI0NGwtLjAwMy0uNDk0YTIuMjUgMi4yNSAwIDAgMSAuNjU5LTEuNjAybDUuMDQtNS4wNDNjLjM0My0uMzQ0LjQ2MS0uNzExLjQ3OS0xLjA5NS4wMjctLjU4Mi0uNzM3LS44NDctMS4xNzktLjQ2N2wtLjA2Ni4wNTZhLjcuNyAwIDAgMC0uMTU4LjIzMi44LjggMCAwIDEtLjEzNy4yMTNMMy4wOTggMTYuMUEzLjc1IDMuNzUgMCAwIDAgMiAxOC43N2wuMDAzLjQ5NEEyLjc1IDIuNzUgMCAwIDAgNC43NTMgMjJoLjk5MmEyLjI1IDIuMjUgMCAwIDAgMi4yNS0yLjI1di0uNzM0aC45ODNhMiAyIDAgMCAwIDEuNDE1LS41ODZsMi41NTctMi41NTljLjA1OS0uMDU5LjE4Mi0uMTA4LjM0Ni0uMDY3QTcuMDA0IDcuMDA0IDAgMCAwIDIyIDkuMDA2IDcuMDA0IDcuMDA0IDAgMCAwIDEwLjgyNiAzLjM4Yy0uNTMzLjM5NS0uMjYgMS4xNjYuMzk3IDEuMjZaIi8+CiAgPHBhdGggZmlsbD0iIzc2NDMxMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTUuNSA2YTIuNSAyLjUgMCAxIDEgMCA1IDIuNSAyLjUgMCAwIDEgMC01bTAgMS41YTEgMSAwIDEgMCAwIDIgMSAxIDAgMCAwIDAtMiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iIzc2NDMxMCIgZD0iTTcuMTI1IDIuODA0QzcgMi4xNiA2LjkxNSAyIDYuNSAyYy0uNDE0IDAtLjUuMTYtLjYyNS44MDQtLjA4LjQxMy0uMjEyIDEuODItLjI5NiAyLjc3NS0uOTU0LjA4NC0yLjM2Mi4yMTYtMi43NzUuMjk2QzIuMTYgNiAyIDYuMDg1IDIgNi41YzAgLjQxNC4xNjEuNS44MDQuNjI1LjQxMi4wOCAxLjgxOC4yMTIgMi43NzIuMjk2LjA4My45ODkuMjE4IDIuNDYxLjMgMi43NzUuMTI0LjQ4My4yMS44MDQuNjI0LjgwNHMuNS0uMTYuNjI1LS44MDRjLjA4LS40MTIuMjEyLTEuODE3LjI5Ni0yLjc3MS45OS0uMDg0IDIuNDYyLS4yMTkgMi43NzYtLjNDMTAuNjc5IDcgMTEgNi45MTUgMTEgNi41YzAtLjQxNC0uMTYtLjUtLjgwMy0uNjI1LS40MTMtLjA4LTEuODIxLS4yMTItMi43NzUtLjI5Ni0uMDg1LS45NTQtLjIxNi0yLjM2Mi0uMjk3LTIuNzc1bS00LjM0MiA4Ljc2MWEuNzgzLjc4MyAwIDEgMCAwLTEuNTY1Ljc4My43ODMgMCAwIDAgMCAxLjU2NSIvPgo8L3N2Zz4K";
  var ddgPasswordIconBase = key;
  var ddgPasswordIconFilled = keyFilled;
  var ddgPasswordGenIconBase = keyLogin;
  var ddgPasswordGenIconFilled = keyLoginFilled;

  // src/InputTypes/CreditCard.js
  var _data4;
  var CreditCardTooltipItem = class {
    /** @param {CreditCardObject} data */
    constructor(data) {
      /** @type {CreditCardObject} */
      __privateAdd(this, _data4);
      __publicField(this, "id", () => String(__privateGet(this, _data4).id));
      __publicField(this, "labelMedium", () => __privateGet(this, _data4).title);
      /** @param {import('../locales/strings.js').TranslateFn} t */
      __publicField(this, "labelSmall", (t) => {
        const { displayNumber, expirationMonth, expirationYear } = __privateGet(this, _data4);
        const expiration = expirationMonth && expirationYear ? `\xA0 ${t("autofill:expiry")}: ${String(expirationMonth).padStart(2, "0")}/${expirationYear}` : "";
        return `\u2022\u2022\u2022\u2022 ${displayNumber}${expiration}`;
      });
      __publicField(this, "paymentProvider", () => __privateGet(this, _data4).paymentProvider || "");
      __privateSet(this, _data4, data);
    }
  };
  _data4 = new WeakMap();

  // src/InputTypes/Identity.js
  var _data5;
  var IdentityTooltipItem = class {
    /** @param {IdentityObject} data */
    constructor(data) {
      /** @type {IdentityObject} */
      __privateAdd(this, _data5);
      __publicField(this, "id", () => String(__privateGet(this, _data5).id));
      /**
       * @param {import('../locales/strings.js').TranslateFn} t
       * @param {string} subtype
       */
      __publicField(this, "labelMedium", (t, subtype) => {
        if (subtype === "addressCountryCode") {
          return getCountryDisplayName("en", __privateGet(this, _data5).addressCountryCode || "");
        }
        if (__privateGet(this, _data5).id === "privateAddress") {
          return t("autofill:generatePrivateDuckAddr");
        }
        return __privateGet(this, _data5)[subtype];
      });
      __publicField(this, "labelSmall", (_) => {
        return __privateGet(this, _data5).title;
      });
      __privateSet(this, _data5, data);
    }
    label(_t, subtype) {
      if (__privateGet(this, _data5).id === "privateAddress") {
        return __privateGet(this, _data5)[subtype];
      }
      return null;
    }
  };
  _data5 = new WeakMap();

  // src/Form/inputTypeConfig.js
  var getIdentitiesIcon = (input, { device }) => {
    if (!canBeInteractedWith(input)) return "";
    const { isDDGApp, isFirefox, isExtension } = device.globalConfig;
    const subtype = getInputSubtype(input);
    if (device.inContextSignup?.isAvailable(subtype)) {
      if (isDDGApp || isFirefox) {
        return daxGrayscaleBase64;
      } else if (isExtension) {
        return chrome.runtime.getURL("img/logo-small-grayscale.svg");
      }
    }
    if (subtype === "emailAddress" && device.isDeviceSignedIn()) {
      if (isDDGApp || isFirefox) {
        return daxBase64;
      } else if (isExtension) {
        return chrome.runtime.getURL("img/logo-small.svg");
      }
    }
    return "";
  };
  var getIdentitiesAlternateIcon = (input, { device }) => {
    if (!canBeInteractedWith(input)) return "";
    const { isDDGApp, isFirefox, isExtension } = device.globalConfig;
    const subtype = getInputSubtype(input);
    const isIncontext = device.inContextSignup?.isAvailable(subtype);
    const isEmailProtection = subtype === "emailAddress" && device.isDeviceSignedIn();
    if (isIncontext || isEmailProtection) {
      if (isDDGApp || isFirefox) {
        return daxBase64;
      } else if (isExtension) {
        return chrome.runtime.getURL("img/logo-small.svg");
      }
    }
    return "";
  };
  var canBeInteractedWith = (input) => !input.readOnly && !input.disabled;
  var canBeAutofilled = async (input, device) => {
    const mainType = getInputMainType(input);
    if (mainType === "unknown") return false;
    const subtype = getInputSubtype(input);
    const variant = getInputVariant(input);
    await device.settings.populateDataIfNeeded({ mainType, subtype });
    const canAutofill = device.settings.canAutofillType({ mainType, subtype, variant }, device.inContextSignup);
    return Boolean(canAutofill);
  };
  var inputTypeConfig = {
    /** @type {CredentialsInputTypeConfig} */
    credentials: {
      type: "credentials",
      displayName: "passwords",
      getIconBase: (input, form) => {
        const { device } = form;
        if (!canBeInteractedWith(input)) return "";
        if (device.credentialsImport?.isAvailable() && (form?.isLogin || form?.isHybrid)) return "";
        if (device.settings.featureToggles.inlineIcon_credentials) {
          const subtype = getInputSubtype(input);
          const variant = getInputVariant(input);
          if (subtype === "password" && variant === "new") {
            return ddgPasswordGenIconBase;
          }
          return ddgPasswordIconBase;
        }
        return "";
      },
      getIconFilled: (input, { device }) => {
        if (device.settings.featureToggles.inlineIcon_credentials) {
          const subtype = getInputSubtype(input);
          const variant = getInputVariant(input);
          if (subtype === "password" && variant === "new") {
            return ddgPasswordGenIconFilled;
          }
          return ddgPasswordIconFilled;
        }
        return "";
      },
      getIconAlternate: () => "",
      shouldDecorate: async (input, { isLogin, isHybrid, device, isCredentialsImportAvailable }) => {
        const subtype = getInputSubtype(input);
        const variant = getInputVariant(input);
        if (subtype === "password" && variant === "new" || // New passord field
        isLogin || isHybrid || variant === "current") {
          return isCredentialsImportAvailable || canBeAutofilled(input, device);
        }
        return false;
      },
      dataType: "Credentials",
      tooltipItem: (data) => createCredentialsTooltipItem(data)
    },
    /** @type {CreditCardsInputTypeConfig} */
    creditCards: {
      type: "creditCards",
      displayName: "credit cards",
      getIconBase: () => "",
      getIconFilled: () => "",
      getIconAlternate: () => "",
      shouldDecorate: async (input, { device }) => {
        return canBeAutofilled(input, device);
      },
      dataType: "CreditCards",
      tooltipItem: (data) => new CreditCardTooltipItem(data)
    },
    /** @type {IdentitiesInputTypeConfig} */
    identities: {
      type: "identities",
      displayName: "identities",
      getIconBase: getIdentitiesIcon,
      getIconFilled: getIdentitiesIcon,
      getIconAlternate: getIdentitiesAlternateIcon,
      shouldDecorate: async (input, { device }) => {
        return canBeAutofilled(input, device);
      },
      dataType: "Identities",
      tooltipItem: (data) => new IdentityTooltipItem(data)
    },
    /** @type {UnknownInputTypeConfig} */
    unknown: {
      type: "unknown",
      displayName: "",
      getIconBase: () => "",
      getIconFilled: () => "",
      getIconAlternate: () => "",
      shouldDecorate: async () => false,
      dataType: "",
      tooltipItem: (_data7) => {
        throw new Error("unreachable - setting tooltip to unknown field type");
      }
    }
  };
  var getInputConfig = (input) => {
    const inputType = getInputType(input);
    return getInputConfigFromType(inputType);
  };
  var getInputConfigFromType = (inputType) => {
    const inputMainType = getMainTypeFromType(inputType);
    return inputTypeConfig[inputMainType];
  };
  var isFieldDecorated = (input) => {
    return input.hasAttribute(constants.ATTR_INPUT_TYPE);
  };

  // src/Form/inputStyles.js
  var getIcon = (input, form, type = "base") => {
    const config = getInputConfig(input);
    if (type === "base") {
      return config.getIconBase(input, form);
    }
    if (type === "filled") {
      return config.getIconFilled(input, form);
    }
    if (type === "alternate") {
      return config.getIconAlternate(input, form);
    }
    return "";
  };
  var getBasicStyles = (input, icon) => ({
    // Height must be > 0 to account for fields initially hidden
    "background-size": `auto ${input.offsetHeight <= 30 && input.offsetHeight > 0 ? "100%" : "20px"}`,
    "background-position": "center right",
    "background-repeat": "no-repeat",
    "background-origin": "content-box",
    "background-image": `url(${icon})`,
    transition: "background 0s"
  });
  var getIconStylesBase = (input, form) => {
    const icon = getIcon(input, form);
    if (!icon) return {};
    return getBasicStyles(input, icon);
  };
  var getIconStylesAlternate = (input, form) => {
    const icon = getIcon(input, form, "alternate");
    if (!icon) return {};
    return {
      ...getBasicStyles(input, icon)
    };
  };
  var getIconStylesAutofilled = (input, form) => {
    const icon = getIcon(input, form, "filled");
    const iconStyle = icon ? getBasicStyles(input, icon) : {};
    return {
      ...iconStyle,
      "background-color": "#F8F498",
      color: "#333333"
    };
  };

  // src/Form/Form.js
  var { ATTR_AUTOFILL, ATTR_INPUT_TYPE: ATTR_INPUT_TYPE2, MAX_INPUTS_PER_FORM, MAX_FORM_RESCANS } = constants;
  var Form = class {
    /**
     * @param {HTMLElement} form
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {import("../DeviceInterface/InterfacePrototype").default} deviceInterface
     * @param {import("../Form/matching").Matching} [matching]
     * @param {Boolean} [shouldAutoprompt]
     * @param {Boolean} [hasShadowTree]
     */
    constructor(form, input, deviceInterface, matching, shouldAutoprompt = false, hasShadowTree = false) {
      /** @type {import("../Form/matching").Matching} */
      __publicField(this, "matching");
      /** @type {HTMLElement} */
      __publicField(this, "form");
      /** @type {HTMLInputElement | null} */
      __publicField(this, "activeInput");
      this.form = form;
      this.matching = matching || createMatching();
      this.formAnalyzer = new FormAnalyzer_default(form, deviceInterface.settings.siteSpecificFeature, input, matching);
      this.device = deviceInterface;
      this.hasShadowTree = hasShadowTree;
      this.inputs = {
        all: /* @__PURE__ */ new Set(),
        credentials: /* @__PURE__ */ new Set(),
        creditCards: /* @__PURE__ */ new Set(),
        identities: /* @__PURE__ */ new Set(),
        unknown: /* @__PURE__ */ new Set()
      };
      this.touched = /* @__PURE__ */ new Set();
      this.listeners = /* @__PURE__ */ new Set();
      this.activeInput = null;
      this.isAutofilling = false;
      this.submitHandlerExecuted = false;
      this.shouldPromptToStoreData = deviceInterface.settings.featureToggles.credentials_saving;
      this.shouldAutoSubmit = this.device.globalConfig.isMobileApp;
      this.intObs = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) this.removeTooltip();
        }
      });
      this.rescanCount = 0;
      this.mutObsConfig = { childList: true, subtree: true };
      this.mutObs = new MutationObserver((records) => {
        const anythingRemoved = records.some((record) => record.removedNodes.length > 0);
        if (anythingRemoved) {
          if (!this.form.isConnected) {
            this.destroy();
            return;
          }
          if ([...this.inputs.all].some((input2) => !input2.isConnected)) {
            this.mutObs.disconnect();
            window.requestIdleCallback(() => {
              this.formAnalyzer = new FormAnalyzer_default(this.form, this.device.settings.siteSpecificFeature, input, this.matching);
              this.recategorizeAllInputs();
            });
          }
        }
      });
      this.initFormListeners();
      this.categorizeInputs();
      this.logFormInfo();
      if (shouldAutoprompt) {
        this.promptLoginIfNeeded();
      }
    }
    get isLogin() {
      return this.formAnalyzer.isLogin;
    }
    get isSignup() {
      return this.formAnalyzer.isSignup;
    }
    get isHybrid() {
      return this.formAnalyzer.isHybrid;
    }
    get isCCForm() {
      return this.formAnalyzer.isCCForm();
    }
    logFormInfo() {
      if (!shouldLog()) return;
      console.log(`Form type: %c${this.getFormType()}`, "font-weight: bold");
      console.log("Signals: ", this.formAnalyzer.signals);
      console.log("Wrapping element: ", this.form);
      console.log("Inputs: ", this.inputs);
      console.log("Submit Buttons: ", this.submitButtons);
    }
    getFormType() {
      if (this.isHybrid) return `hybrid (hybrid score: ${this.formAnalyzer.hybridSignal}, score: ${this.formAnalyzer.autofillSignal})`;
      if (this.isLogin) return `login (score: ${this.formAnalyzer.autofillSignal}, hybrid score: ${this.formAnalyzer.hybridSignal})`;
      if (this.isSignup) return `signup (score: ${this.formAnalyzer.autofillSignal}, hybrid score: ${this.formAnalyzer.hybridSignal})`;
      return "something went wrong";
    }
    /**
     * Checks if the form element contains the activeElement or the event target
     * @return {boolean}
     * @param {KeyboardEvent | null} [e]
     */
    hasFocus(e) {
      return this.form.contains(getActiveElement()) || this.form.contains(
        /** @type HTMLElement */
        e?.target
      );
    }
    submitHandler(via = "unknown") {
      if (this.device.globalConfig.isDDGTestMode) {
        console.log("Form.submitHandler via:", via, this);
      }
      if (this.submitHandlerExecuted) return;
      const values = this.getValuesReadyForStorage();
      this.device.postSubmit?.(values, this);
      this.submitHandlerExecuted = true;
    }
    /**
     * Reads the values from the form without preparing to store them
     * @return {InternalDataStorageObject}
     */
    getRawValues() {
      const formValues = [...this.inputs.credentials, ...this.inputs.identities, ...this.inputs.creditCards].reduce(
        (output, inputEl) => {
          const mainType = getInputMainType(inputEl);
          const subtype = getInputSubtype(inputEl);
          let value = inputEl.value || output[mainType]?.[subtype];
          if (subtype === "addressCountryCode") {
            value = inferCountryCodeFromElement(inputEl);
          }
          if (subtype === "password" && value?.length <= 3) {
            value = void 0;
          }
          if (value) {
            output[mainType][subtype] = value;
          }
          return output;
        },
        { credentials: {}, creditCards: {}, identities: {} }
      );
      if (!formValues.credentials.username && !formValues.identities.emailAddress) {
        const hiddenFields = (
          /** @type [HTMLInputElement] */
          [...this.form.querySelectorAll("input[type=hidden]")]
        );
        const probableField = hiddenFields.find((field) => {
          const regex = new RegExp("email|" + this.matching.getDDGMatcherRegex("username")?.source);
          const attributeText = field.id + " " + field.name;
          return safeRegexTest(regex, attributeText);
        });
        if (probableField?.value) {
          formValues.credentials.username = probableField.value;
        } else if (
          // If a form has phone + password(s) fields, save the phone as username
          formValues.identities.phone && this.inputs.all.size - this.inputs.unknown.size < 4
        ) {
          formValues.credentials.username = formValues.identities.phone;
        } else {
          this.form.querySelectorAll(this.matching.cssSelector("safeUniversalSelector")).forEach((el) => {
            const elText = getTextShallow(el);
            if (elText.length > 70) return;
            const emailOrUsername = elText.match(
              // https://www.emailregex.com/
              /[a-zA-Z\d.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)*/
            )?.[0];
            if (emailOrUsername) {
              formValues.credentials.username = emailOrUsername;
            }
          });
        }
      }
      return formValues;
    }
    /**
     * Return form values ready for storage
     * @returns {DataStorageObject}
     */
    getValuesReadyForStorage() {
      const formValues = this.getRawValues();
      return prepareFormValuesForStorage(formValues, this.device.settings.featureToggles.partial_form_saves);
    }
    /**
     * Determine if the form has values we want to store in the device
     * @param {DataStorageObject} [values]
     * @return {boolean}
     */
    hasValues(values) {
      const { credentials, creditCards, identities } = values || this.getValuesReadyForStorage();
      return Boolean(credentials || creditCards || identities);
    }
    async removeTooltip() {
      const tooltip = this.device.isTooltipActive();
      if (this.isAutofilling || !tooltip) {
        return;
      }
      await this.device.removeTooltip();
      this.intObs?.disconnect();
    }
    showingTooltip(input) {
      this.intObs?.observe(input);
    }
    removeInputHighlight(input) {
      if (!input.classList.contains("ddg-autofilled")) return;
      removeInlineStyles(input, getIconStylesAutofilled(input, this));
      removeInlineStyles(input, { cursor: "pointer" });
      input.classList.remove("ddg-autofilled");
      this.addAutofillStyles(input);
    }
    resetIconStylesToInitial() {
      const input = this.activeInput;
      if (input) {
        const initialStyles = getIconStylesBase(input, this);
        addInlineStyles(input, initialStyles);
      }
    }
    removeAllHighlights(e, dataType) {
      if (e && !e.isTrusted) return;
      this.resetShouldPromptToStoreData();
      this.execOnInputs((input) => this.removeInputHighlight(input), dataType);
    }
    removeInputDecoration(input) {
      removeInlineStyles(input, getIconStylesBase(input, this));
      removeInlineStyles(input, getIconStylesAlternate(input, this));
      input.removeAttribute(ATTR_AUTOFILL);
      input.removeAttribute(ATTR_INPUT_TYPE2);
    }
    removeAllDecorations() {
      this.execOnInputs((input) => this.removeInputDecoration(input));
      this.listeners.forEach(({ el, type, fn, opts }) => el.removeEventListener(type, fn, opts));
    }
    redecorateAllInputs() {
      this.execOnInputs((input) => {
        if (input instanceof HTMLInputElement) {
          this.decorateInput(input);
        }
      });
    }
    /**
     * Removes all scoring attributes from the inputs and deletes them from memory
     */
    forgetAllInputs() {
      this.execOnInputs((input) => {
        input.removeAttribute(ATTR_AUTOFILL);
        input.removeAttribute(ATTR_INPUT_TYPE2);
      });
      Object.values(this.inputs).forEach((inputSet) => inputSet.clear());
    }
    /**
     * Resets our input scoring and starts from scratch
     */
    recategorizeAllInputs() {
      if (this.rescanCount >= MAX_FORM_RESCANS) {
        this.mutObs.disconnect();
        return;
      }
      this.rescanCount++;
      this.initialScanComplete = false;
      this.removeAllDecorations();
      this.forgetAllInputs();
      this.initFormListeners();
      this.categorizeInputs();
    }
    resetAllInputs() {
      this.execOnInputs((input) => {
        setValue(input, "", this.device.globalConfig);
        this.removeInputHighlight(input);
      });
      if (this.activeInput) this.activeInput.focus();
      this.matching.clear();
    }
    resetShouldPromptToStoreData() {
      this.shouldPromptToStoreData = this.device.settings.featureToggles.credentials_saving;
    }
    dismissTooltip() {
      this.removeTooltip();
    }
    // This removes all listeners to avoid memory leaks and weird behaviours
    destroy() {
      this.mutObs.disconnect();
      this.removeAllDecorations();
      this.removeTooltip();
      this.forgetAllInputs();
      this.matching.clear();
      this.intObs = null;
      this.device.scanner.forms.delete(this.form);
    }
    initFormListeners() {
      this.addListener(this.form, "input", (e) => {
        if (!this.isAutofilling) {
          this.submitHandlerExecuted = false;
          const inputType = e.target.getAttribute(ATTR_INPUT_TYPE2);
          if (inputType && inputType !== "unknown") {
            this.resetShouldPromptToStoreData();
          } else {
            this.shouldPromptToStoreData = false;
          }
        }
      });
      if (this.form instanceof HTMLFormElement && this.form.getRootNode()) {
        this.addListener(
          this.form,
          "submit",
          () => {
            this.submitHandler("in-form submit handler");
          },
          { capture: true }
        );
      }
    }
    canCategorizeAmbiguousInput() {
      return this.device.settings.featureToggles.unknown_username_categorization && this.isLogin && this.ambiguousInputs?.length === 1;
    }
    canCategorizePasswordVariant() {
      return this.device.settings.featureToggles.password_variant_categorization;
    }
    /**
     * Takes an ambiguous input and tries to get a target type that the input should be categorized to.
     * @param {HTMLInputElement} ambiguousInput
     * @returns {import('./matching.js').SupportedTypes | undefined}
     */
    getTargetTypeForAmbiguousInput(ambiguousInput) {
      const ambiguousInputSubtype = getInputSubtype(ambiguousInput);
      const hasUsernameData = Boolean(this.device.settings.availableInputTypes.credentials?.username);
      const hasPhoneData = Boolean(this.device.settings.availableInputTypes.identities?.phone);
      const hasCreditCardData = Boolean(this.device.settings.availableInputTypes.creditCards?.cardNumber);
      if (hasUsernameData || ambiguousInputSubtype === "unknown") return "credentials.username";
      if (hasPhoneData && ambiguousInputSubtype === "phone") return "identities.phone";
      if (hasCreditCardData && ambiguousInputSubtype === "cardNumber") return "creditCards.cardNumber";
    }
    /**
     * Returns the ambiguous inputs that should be categorised.
     * An input is considered ambiguous if it's unknown, phone or credit card and,
     * the form doesn't have a username field,
     * the form has password fields.
     * @returns {HTMLInputElement[] | null}
     */
    get ambiguousInputs() {
      const hasUsernameInput = [...this.inputs.credentials].some((input) => getInputSubtype(input) === "username");
      if (hasUsernameInput) return null;
      const hasPasswordInputs = [...this.inputs.credentials].filter((input) => getInputSubtype(input) === "password").length > 0;
      if (!hasPasswordInputs) return null;
      const phoneInputs = [...this.inputs.identities].filter((input) => getInputSubtype(input) === "phone");
      const cardNumberInputs = [...this.inputs.creditCards].filter((input) => getInputSubtype(input) === "cardNumber");
      return [...this.inputs.unknown, ...phoneInputs, ...cardNumberInputs];
    }
    /**
     * Recategorizes input's attribute to username, decorates it and also updates the input set.
     */
    recategorizeInputToTargetType() {
      const ambiguousInput = this.ambiguousInputs?.[0];
      const inputSelector = this.matching.cssSelector("formInputsSelectorWithoutSelect");
      if (ambiguousInput?.matches?.(inputSelector)) {
        const targetType = this.getTargetTypeForAmbiguousInput(ambiguousInput);
        const inputType = getInputType(ambiguousInput);
        if (!targetType || targetType === inputType) return;
        ambiguousInput.setAttribute(ATTR_INPUT_TYPE2, targetType);
        this.decorateInput(ambiguousInput);
        this.inputs[getMainTypeFromType(targetType)].add(ambiguousInput);
        this.inputs[getMainTypeFromType(inputType)].delete(ambiguousInput);
        if (shouldLog()) console.log(`Recategorized input from ${inputType} to ${targetType}`, ambiguousInput);
      }
    }
    /**
     * Recategorizes the new/current password field variant
     */
    recategorizeInputVariantIfNeeded() {
      let newPasswordFields = 0;
      let currentPasswordFields = 0;
      let firstNewPasswordField = null;
      for (const credentialElement of this.inputs.credentials) {
        const variant = getInputVariant(credentialElement);
        if (variant === "new") {
          newPasswordFields++;
          if (!firstNewPasswordField) firstNewPasswordField = credentialElement;
        }
        if (variant === "current") currentPasswordFields++;
        if (newPasswordFields > 3 || currentPasswordFields > 0) return;
      }
      if (newPasswordFields === 3 && currentPasswordFields === 0) {
        if (shouldLog()) console.log('Recategorizing password variant to "current"', firstNewPasswordField);
        firstNewPasswordField.setAttribute(ATTR_INPUT_TYPE2, "credentials.password.current");
      }
    }
    categorizeInputs() {
      const selector = this.matching.cssSelector("formInputsSelector");
      if (this.form.matches(selector)) {
        this.addInput(this.form);
      } else {
        const formControlElements = getFormControlElements(this.form, selector);
        const foundInputs = formControlElements != null ? [...formControlElements, ...findElementsInShadowTree(this.form, selector)] : queryElementsWithShadow(this.form, selector, true);
        if (foundInputs.length < (this.device.settings.siteSpecificFeature?.maxInputsPerForm || MAX_INPUTS_PER_FORM)) {
          foundInputs.forEach((input) => this.addInput(input));
        } else {
          this.device.scanner.setMode("stopped", `The form has too many inputs (${foundInputs.length}), bailing.`);
          return;
        }
      }
      if (this.canCategorizeAmbiguousInput()) this.recategorizeInputToTargetType();
      if (this.canCategorizePasswordVariant()) this.recategorizeInputVariantIfNeeded();
      if (this.inputs.all.size === 1 && this.inputs.unknown.size === 1) {
        this.destroy();
        return;
      }
      this.initialScanComplete = true;
      if (this.form !== document.body) {
        this.mutObs.observe(this.form, this.mutObsConfig);
      }
    }
    get submitButtons() {
      const selector = this.matching.cssSelector("submitButtonSelector");
      const allButtons = (
        /** @type {HTMLElement[]} */
        queryElementsWithShadow(this.form, selector)
      );
      return allButtons.filter(
        (btn) => isPotentiallyViewable(btn) && isLikelyASubmitButton(btn, this.matching) && buttonMatchesFormType(btn, this)
      );
    }
    attemptSubmissionIfNeeded() {
      if (!this.isLogin || // Only submit login forms
      this.submitButtons.length > 1)
        return;
      let isThereAnEmptyVisibleField = false;
      this.execOnInputs(
        (input) => {
          if (input.value === "" && isPotentiallyViewable(input)) isThereAnEmptyVisibleField = true;
        },
        "all",
        false
      );
      if (isThereAnEmptyVisibleField) return;
      this.submitButtons.forEach((button) => {
        if (isPotentiallyViewable(button)) {
          button.click();
        }
      });
    }
    /**
     * Executes a function on input elements. Can be limited to certain element types
     * @param {(input: HTMLInputElement|HTMLSelectElement) => void} fn
     * @param {'all' | SupportedMainTypes} inputType
     * @param {boolean} shouldCheckForDecorate
     */
    execOnInputs(fn, inputType = "all", shouldCheckForDecorate = true) {
      const inputs = this.inputs[inputType];
      for (const input of inputs) {
        let canExecute = true;
        if (shouldCheckForDecorate) {
          canExecute = isFieldDecorated(input);
        }
        if (canExecute) fn(input);
      }
    }
    addInput(input) {
      if (this.inputs.all.has(input)) return this;
      const siteSpecificFeature = this.device.settings.siteSpecificFeature;
      if (this.inputs.all.size > (siteSpecificFeature?.maxInputsPerForm || MAX_INPUTS_PER_FORM)) {
        this.device.scanner.setMode("stopped", "The form has too many inputs, bailing.");
        return this;
      }
      if (this.initialScanComplete && this.rescanCount < MAX_FORM_RESCANS) {
        this.formAnalyzer = new FormAnalyzer_default(this.form, siteSpecificFeature, input, this.matching);
        this.recategorizeAllInputs();
        return this;
      }
      if (input.maxLength === 1) return this;
      this.inputs.all.add(input);
      const opts = {
        isLogin: this.isLogin,
        isHybrid: this.isHybrid,
        isCCForm: this.isCCForm,
        hasCredentials: Boolean(this.device.settings.availableInputTypes.credentials?.username),
        supportsIdentitiesAutofill: this.device.settings.featureToggles.inputType_identities
      };
      this.matching.setInputType(input, this.form, this.device.settings.siteSpecificFeature, opts);
      const mainInputType = getInputMainType(input);
      this.inputs[mainInputType].add(input);
      this.decorateInput(input);
      return this;
    }
    /**
     * Adds event listeners and keeps track of them for subsequent removal
     * @param {HTMLElement} el
     * @param {Event['type']} type
     * @param {(Event) => void} fn
     * @param {AddEventListenerOptions} [opts]
     */
    addListener(el, type, fn, opts) {
      el.addEventListener(type, fn, opts);
      this.listeners.add({ el, type, fn, opts });
    }
    addAutofillStyles(input) {
      const initialStyles = getIconStylesBase(input, this);
      const activeStyles = getIconStylesAlternate(input, this);
      addInlineStyles(input, initialStyles);
      return {
        onMouseMove: activeStyles,
        onMouseLeave: initialStyles
      };
    }
    /**
     * Decorate here means adding listeners and an optional icon
     * @param {HTMLInputElement} input
     * @returns {Promise<Form>}
     */
    async decorateInput(input) {
      const config = getInputConfig(input);
      const shouldDecorate = await config.shouldDecorate(input, this);
      if (!shouldDecorate) return this;
      input.setAttribute(ATTR_AUTOFILL, "true");
      const hasIcon = !!config.getIconBase(input, this);
      if (hasIcon) {
        const { onMouseMove, onMouseLeave } = this.addAutofillStyles(input);
        this.addListener(input, "mousemove", (e) => {
          if (wasAutofilledByChrome(input)) return;
          if (isEventWithinDax(e, e.target)) {
            addInlineStyles(e.target, {
              cursor: "pointer",
              ...onMouseMove
            });
          } else {
            removeInlineStyles(e.target, { cursor: "pointer" });
            if (!this.device.isTooltipActive()) {
              addInlineStyles(e.target, { ...onMouseLeave });
            }
          }
        });
        this.addListener(input, "mouseleave", (e) => {
          removeInlineStyles(e.target, { cursor: "pointer" });
          if (!this.device.isTooltipActive()) {
            addInlineStyles(e.target, { ...onMouseLeave });
          }
        });
      }
      function getMainClickCoords(e) {
        if (!e.isTrusted) return;
        const isMainMouseButton = e.button === 0;
        if (!isMainMouseButton) return;
        return {
          x: e.clientX,
          y: e.clientY
        };
      }
      function getClickCoords(e, storedClickCoords2) {
        if (e.type === "pointerdown") {
          return getMainClickCoords(
            /** @type {PointerEvent} */
            e
          ) || null;
        }
        const click = storedClickCoords2.get(input);
        storedClickCoords2.delete(input);
        return click || null;
      }
      let storedClickCoords = /* @__PURE__ */ new WeakMap();
      let timeout = null;
      const handlerLabel = (e) => {
        const control = (
          /** @type HTMLElement */
          e.target?.closest("label")?.control
        );
        if (!control) return;
        if (e.isTrusted) {
          storedClickCoords.set(control, getMainClickCoords(e));
        }
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          storedClickCoords = /* @__PURE__ */ new WeakMap();
        }, 1e3);
      };
      const handlerSelect = () => {
        this.touched.add(input);
      };
      const handler = (e) => {
        if (this.isAutofilling || this.device.isTooltipActive()) {
          return;
        }
        const isLabel = e.target instanceof HTMLLabelElement;
        const input2 = isLabel ? e.target.control : e.target;
        if (!input2 || !this.inputs.all.has(input2)) return;
        if (wasAutofilledByChrome(input2)) return;
        if (!canBeInteractedWith(input2)) return;
        const clickCoords = getClickCoords(e, storedClickCoords);
        if (e.type === "pointerdown") {
          if (!e.isTrusted || !clickCoords) return;
        }
        if (this.shouldOpenTooltip(e, input2)) {
          const iconClicked = isEventWithinDax(e, input2);
          if ((this.device.globalConfig.isMobileApp || this.device.globalConfig.isExtension) && // Avoid the icon capturing clicks on small fields making it impossible to focus
          input2.offsetWidth > 50 && iconClicked) {
            e.preventDefault();
            e.stopImmediatePropagation();
            input2.blur();
          }
          this.touched.add(input2);
          this.device.attachTooltip({
            form: this,
            input: input2,
            click: clickCoords,
            trigger: "userInitiated",
            triggerMetaData: {
              // An 'icon' click is very different to a field click or focus.
              // It indicates an explicit opt-in to the feature.
              type: iconClicked ? "explicit-opt-in" : "implicit-opt-in"
            }
          });
          const activeStyles = getIconStylesAlternate(input2, this);
          addInlineStyles(input2, activeStyles);
        }
      };
      const isMobileApp = this.device.globalConfig.isMobileApp;
      if (!(input instanceof HTMLSelectElement)) {
        const events = ["pointerdown"];
        if (!isMobileApp) events.push("focus");
        input.labels?.forEach((label) => {
          this.addListener(label, "pointerdown", isMobileApp ? handler : handlerLabel);
        });
        events.forEach((ev) => this.addListener(input, ev, handler));
      } else {
        this.addListener(input, "change", handlerSelect);
        input.labels?.forEach((label) => {
          this.addListener(label, "pointerdown", isMobileApp ? handlerSelect : handlerLabel);
        });
      }
      return this;
    }
    shouldOpenTooltip(e, input) {
      if (!isPotentiallyViewable(input)) return false;
      if (isEventWithinDax(e, input)) return true;
      if (this.device.globalConfig.isWindows) return true;
      const subtype = getInputSubtype(input);
      const variant = getInputVariant(input);
      const isIncontextSignupAvailable = this.device.inContextSignup?.isAvailable(subtype);
      if (this.device.globalConfig.isApp) {
        const mainType = getInputMainType(input);
        const hasSavedDetails = this.device.settings.canAutofillType({ mainType, subtype, variant }, null);
        if (hasSavedDetails) {
          return true;
        } else if (isIncontextSignupAvailable) {
          return false;
        } else {
          const isInputEmpty = input.value === "";
          return this.isCredentialsImportAvailable && isInputEmpty;
        }
      }
      if (this.device.globalConfig.isExtension || this.device.globalConfig.isMobileApp) {
        if (isIncontextSignupAvailable) return false;
      }
      return !this.touched.has(input) && !input.classList.contains("ddg-autofilled");
    }
    /**
     * Skip overridding values that the user provided if:
     * - we're autofilling non credit card type and,
     * - it's a previously filled input or,
     * - it's a select input that was already "touched" by the user.
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {'all' | SupportedMainTypes} dataType
     * @returns {boolean}
     **/
    shouldSkipInput(input, dataType) {
      if (dataType === "creditCards") {
        return false;
      }
      const isPreviouslyFilledInput = input.value !== "" && this.activeInput !== input;
      return input.nodeName === "SELECT" ? this.touched.has(input) : isPreviouslyFilledInput;
    }
    autofillInput(input, string, dataType) {
      if (input instanceof HTMLInputElement && !isPotentiallyViewable(input)) return;
      if (!canBeInteractedWith(input)) return;
      if (this.shouldSkipInput(input, dataType)) return;
      if (input.value === string) return;
      const successful = setValue(input, string, this.device.globalConfig);
      if (!successful) return;
      input.classList.add("ddg-autofilled");
      addInlineStyles(input, getIconStylesAutofilled(input, this));
      this.touched.add(input);
      input.addEventListener("input", (e) => this.removeAllHighlights(e, dataType), { once: true });
    }
    /**
     * Autofill method for email protection only
     * @param {string} alias
     * @param {'all' | SupportedMainTypes} dataType
     */
    autofillEmail(alias, dataType = "identities") {
      this.isAutofilling = true;
      this.execOnInputs((input) => {
        const inputSubtype = getInputSubtype(input);
        if (inputSubtype === "emailAddress") {
          this.autofillInput(input, alias, dataType);
        }
      }, dataType);
      this.isAutofilling = false;
      this.removeTooltip();
    }
    autofillData(data, dataType) {
      this.isAutofilling = true;
      this.execOnInputs((input) => {
        const inputSubtype = getInputSubtype(input);
        let autofillData = data[inputSubtype];
        if (inputSubtype === "expiration" && input instanceof HTMLInputElement) {
          autofillData = getUnifiedExpiryDate(input, data.expirationMonth, data.expirationYear, this);
        }
        if (inputSubtype === "expirationYear" && input instanceof HTMLInputElement) {
          autofillData = formatCCYear(input, autofillData, this);
        }
        if (inputSubtype === "addressCountryCode") {
          autofillData = getCountryName(input, data);
        }
        if (autofillData) {
          const variant = getInputVariant(input);
          if (!variant) {
            return this.autofillInput(input, autofillData, dataType);
          }
          if (variant === "new" && AUTOGENERATED_KEY in data) {
            return this.autofillInput(input, autofillData, dataType);
          }
          if (variant === "current" && !(AUTOGENERATED_KEY in data)) {
            return this.autofillInput(input, autofillData, dataType);
          }
        }
      }, dataType);
      this.isAutofilling = false;
      const formValues = this.getValuesReadyForStorage();
      const areAllFormValuesKnown = Object.keys(formValues[dataType] || {}).every(
        (subtype) => formValues[dataType][subtype] === data[subtype]
      );
      if (areAllFormValuesKnown) {
        this.shouldPromptToStoreData = false;
        this.shouldAutoSubmit = this.device.globalConfig.isMobileApp;
      } else {
        this.resetShouldPromptToStoreData();
        this.shouldAutoSubmit = false;
      }
      this.device.postAutofill?.(data, dataType, this);
      this.removeTooltip();
    }
    /**
     * Set all inputs of the data type to "touched"
     * @param {'all' | SupportedMainTypes} dataType
     */
    touchAllInputs(dataType = "all") {
      this.execOnInputs((input) => this.touched.add(input), dataType);
    }
    get isCredentialsImportAvailable() {
      const isLoginOrHybrid = this.isLogin || this.isHybrid;
      return isLoginOrHybrid && this.device.credentialsImport.isAvailable();
    }
    getFirstViableCredentialsInput() {
      return [...this.inputs.credentials].find((input) => canBeInteractedWith(input) && isPotentiallyViewable(input));
    }
    async promptLoginIfNeeded() {
      if (document.visibilityState !== "visible" || !this.isLogin) return;
      const firstCredentialInput = this.getFirstViableCredentialsInput();
      const input = this.activeInput || firstCredentialInput;
      if (!input) return;
      const mainType = getInputMainType(input);
      const subtype = getInputSubtype(input);
      const variant = getInputVariant(input);
      await this.device.settings.populateDataIfNeeded({ mainType, subtype });
      if (this.device.settings.canAutofillType({ mainType, subtype, variant }, this.device.inContextSignup) || this.isCredentialsImportAvailable) {
        setTimeout(() => {
          safeExecute(this.form, () => {
            const { x, y, width, height } = this.form.getBoundingClientRect();
            const elHCenter = x + width / 2;
            const elVCenter = y + height / 2;
            const topMostElementFromPoint = document.elementFromPoint(elHCenter, elVCenter);
            if (this.form.contains(topMostElementFromPoint)) {
              this.execOnInputs((input2) => {
                if (isPotentiallyViewable(input2)) {
                  this.touched.add(input2);
                }
              }, "credentials");
              this.device.attachTooltip({
                form: this,
                input,
                click: null,
                trigger: "autoprompt",
                triggerMetaData: {
                  type: "implicit-opt-in"
                }
              });
            }
          });
        }, 200);
      }
    }
  };

  // src/Scanner.js
  var { ATTR_INPUT_TYPE: ATTR_INPUT_TYPE3, MAX_INPUTS_PER_PAGE, MAX_FORMS_PER_PAGE, MAX_INPUTS_PER_FORM: MAX_INPUTS_PER_FORM2 } = constants;
  var defaultScannerOptions = {
    // This buffer size is very large because it's an unexpected edge-case that
    // a DOM will be continually modified over and over without ever stopping. If we do see 1000 unique
    // new elements in the buffer however then this will prevent the algorithm from never ending.
    bufferSize: 50,
    // wait for a 500ms window of event silence before performing the scan
    debounceTimePeriod: 500,
    // how long to wait when performing the initial scan
    initialDelay: 0,
    // How many inputs is too many on the page. If we detect that there's above
    // this maximum, then we don't scan the page. This will prevent slowdowns on
    // large pages which are unlikely to require autofill anyway.
    maxInputsPerPage: MAX_INPUTS_PER_PAGE,
    maxFormsPerPage: MAX_FORMS_PER_PAGE,
    maxInputsPerForm: MAX_INPUTS_PER_FORM2
  };
  var DefaultScanner = class {
    /**
     * @param {import("./DeviceInterface/InterfacePrototype").default} device
     * @param {ScannerOptions} options
     */
    constructor(device, options) {
      /** @type Map<HTMLElement, Form> */
      __publicField(this, "forms", /* @__PURE__ */ new Map());
      /** @type {any|undefined} the timer to reset */
      __publicField(this, "debounceTimer");
      /** @type {Set<HTMLElement|Document>} stored changed elements until they can be processed */
      __publicField(this, "changedElements", /* @__PURE__ */ new Set());
      /** @type {ScannerOptions} */
      __publicField(this, "options");
      /** @type {HTMLInputElement | null} */
      __publicField(this, "activeInput", null);
      /** @type {boolean} A flag to indicate the whole page will be re-scanned */
      __publicField(this, "rescanAll", false);
      /** @type {Mode} Indicates the mode in which the scanner is operating */
      __publicField(this, "mode", "scanning");
      /** @type {import("./Form/matching").Matching} matching */
      __publicField(this, "matching");
      /** @type {HTMLElement|null} */
      __publicField(this, "_forcedForm", null);
      /**
       * Watch for changes in the DOM, and enqueue elements to be scanned
       * @type {MutationObserver}
       */
      __publicField(this, "mutObs", new MutationObserver((mutationList) => {
        if (this.rescanAll) {
          this.enqueue([]);
          return;
        }
        const outgoing = [];
        for (const mutationRecord of mutationList) {
          if (mutationRecord.type === "childList") {
            for (const addedNode of mutationRecord.addedNodes) {
              if (!(addedNode instanceof HTMLElement)) continue;
              if (addedNode.nodeName === "DDG-AUTOFILL") continue;
              outgoing.push(addedNode);
            }
          }
        }
        this.enqueue(outgoing);
      }));
      this.device = device;
      this.matching = createMatching();
      this.options = options;
      this.initTimeStamp = Date.now();
    }
    /**
     * Determine whether we should fire the credentials autoprompt. This is needed because some sites are blank
     * on page load and load scripts asynchronously, so our initial scan didn't set the autoprompt correctly
     * @returns {boolean}
     */
    get shouldAutoprompt() {
      if (this.device.globalConfig.isMobileApp && this.device.credentialsImport.isAvailable()) {
        return false;
      }
      return Date.now() - this.initTimeStamp <= 1500;
    }
    /**
     * Call this to scan once and then watch for changes.
     *
     * Call the returned function to remove listeners.
     * @returns {(reason: string, ...rest) => void}
     */
    init() {
      window.addEventListener("pointerdown", this, true);
      if (!this.device.globalConfig.isMobileApp) {
        window.addEventListener("focus", this, true);
      }
      const delay = this.options.initialDelay;
      if (delay === 0) {
        window.requestIdleCallback(() => this.scanAndObserve());
      } else {
        setTimeout(() => this.scanAndObserve(), delay);
      }
      return (reason, ...rest) => {
        this.setMode("stopped", reason, ...rest);
      };
    }
    /**
     * Scan the page and begin observing changes
     */
    scanAndObserve() {
      window.performance?.mark?.("initial_scanner:init:start");
      this.findEligibleInputs(document);
      window.performance?.mark?.("initial_scanner:init:end");
      logPerformance("initial_scanner");
      this.mutObs.observe(document.documentElement, { childList: true, subtree: true });
    }
    /**
     * Core logic for find inputs that are eligible for autofill. If they are,
     * then call addInput which will attempt to add the input to a parent form.
     * @param context
     */
    findEligibleInputs(context) {
      if (this.device.globalConfig.isDDGDomain) {
        return this;
      }
      const formInputsSelectorWithoutSelect = this.matching.cssSelector("formInputsSelectorWithoutSelect");
      if ("matches" in context && context.matches?.(formInputsSelectorWithoutSelect)) {
        this.addInput(context);
      } else {
        const inputs = context.querySelectorAll(formInputsSelectorWithoutSelect);
        if (inputs.length > (this.device.settings.siteSpecificFeature?.maxInputsPerPage || this.options.maxInputsPerPage)) {
          this.setMode("stopped", `Too many input fields in the given context (${inputs.length}), stop scanning`, context);
          return this;
        }
        inputs.forEach((input) => this.addInput(input));
        if (context instanceof HTMLFormElement && this.forms.get(context)?.hasShadowTree) {
          findElementsInShadowTree(context, formInputsSelectorWithoutSelect).forEach((input) => {
            if (input instanceof HTMLInputElement) {
              this.addInput(input, context);
            }
          });
        }
      }
      return this;
    }
    /**
     * Sets the scanner mode, logging the reason and any additional arguments.
     * 'stopped', switches off the mutation observer and clears all forms and listeners,
     * 'on-click', keeps event listeners so that scanning can continue on clicking,
     * 'scanning', default operation triggered in normal conditions
     * Keep the listener for pointerdown to scan on click if needed.
     * @param {Mode} mode
     * @param {string} reason
     * @param {any} rest
     */
    setMode(mode, reason, ...rest) {
      this.mode = mode;
      if (shouldLog()) {
        console.log(mode, reason, ...rest);
      }
      if (mode === "scanning") return;
      if (mode === "stopped") {
        window.removeEventListener("pointerdown", this, true);
        window.removeEventListener("focus", this, true);
      }
      clearTimeout(this.debounceTimer);
      this.changedElements.clear();
      this.mutObs.disconnect();
      this.forms.forEach((form) => {
        form.destroy();
      });
      this.forms.clear();
      const activeInput = this.device.activeForm?.activeInput;
      activeInput?.focus();
    }
    get isStopped() {
      return this.mode === "stopped";
    }
    /**
     * @param {HTMLElement} input
     * @returns {HTMLElement}
     */
    getParentForm(input) {
      this._forcedForm = this.device.settings.siteSpecificFeature?.getForcedForm() || null;
      if (this._forcedForm?.contains(input)) {
        return this._forcedForm;
      }
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
        if (input.form) {
          if (this.forms.has(input.form) || // If we've added the form we've already checked that it's not a page wrapper
          !isFormLikelyToBeUsedAsPageWrapper(input.form)) {
            return input.form;
          }
        }
      }
      let traversalLayerCount = 0;
      let element = input;
      while (traversalLayerCount <= 5 && element.parentElement !== document.documentElement) {
        const siblingForm = element.parentElement?.querySelector("form");
        if (siblingForm && siblingForm !== element) {
          return element;
        }
        if (element instanceof HTMLFormElement) {
          return element;
        }
        if (element.parentElement) {
          element = element.parentElement;
          if (element.childElementCount > 1) {
            const inputs = element.querySelectorAll(this.matching.cssSelector("formInputsSelector"));
            const buttons = element.querySelectorAll(this.matching.cssSelector("submitButtonSelector"));
            if (inputs.length > 1 || buttons.length) {
              return element;
            }
            traversalLayerCount++;
          }
        } else {
          const root = element.getRootNode();
          if (root instanceof ShadowRoot && root.host) {
            element = root.host;
          } else {
            break;
          }
        }
      }
      return input;
    }
    /**
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @returns {boolean}
     */
    inputExistsInForms(input) {
      return [...this.forms.values()].some((form) => form.inputs.all.has(input));
    }
    /**
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {HTMLFormElement|null} form
     */
    addInput(input, form = null) {
      if (this.isStopped) return;
      if (this.inputExistsInForms(input)) return;
      const parentForm = form || this.getParentForm(input);
      if (parentForm instanceof HTMLFormElement && this.forms.has(parentForm)) {
        const foundForm = this.forms.get(parentForm);
        if (foundForm && foundForm.inputs.all.size < (this.device.settings.siteSpecificFeature?.maxInputsPerForm || MAX_INPUTS_PER_FORM2)) {
          foundForm.addInput(input);
        } else {
          this.setMode("stopped", "The form has too many inputs, destroying.");
        }
        return;
      }
      if (parentForm.role === "search") return;
      let previouslyFoundParent, childForm;
      for (const [formEl] of this.forms) {
        if (!formEl.isConnected) {
          this.forms.delete(formEl);
          continue;
        }
        if (formEl.contains(parentForm)) {
          previouslyFoundParent = formEl;
          break;
        }
        if (parentForm.contains(formEl)) {
          childForm = formEl;
          break;
        }
      }
      if (previouslyFoundParent) {
        if (parentForm instanceof HTMLFormElement && parentForm !== previouslyFoundParent) {
          this.forms.delete(previouslyFoundParent);
        } else {
          this.forms.get(previouslyFoundParent)?.addInput(input);
        }
      } else {
        if (childForm && childForm !== this._forcedForm) {
          this.forms.get(childForm)?.destroy();
          this.forms.delete(childForm);
        }
        if (this.forms.size < this.options.maxFormsPerPage) {
          this.forms.set(parentForm, new Form(parentForm, input, this.device, this.matching, this.shouldAutoprompt));
        } else {
          this.setMode("on-click", "The page has too many forms, stop adding them.");
        }
      }
    }
    /**
     * enqueue elements to be re-scanned after the given
     * amount of time has elapsed.
     *
     * @param {(HTMLElement|Document)[]} htmlElements
     */
    enqueue(htmlElements) {
      if (this.changedElements.size >= this.options.bufferSize) {
        this.rescanAll = true;
        this.changedElements.clear();
      } else if (!this.rescanAll) {
        for (const element of htmlElements) {
          this.changedElements.add(element);
        }
      }
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        window.performance?.mark?.("scanner:init:start");
        this.processChangedElements();
        this.changedElements.clear();
        this.rescanAll = false;
        window.performance?.mark?.("scanner:init:end");
        logPerformance("scanner");
      }, this.options.debounceTimePeriod);
    }
    /**
     * re-scan the changed elements, but only if they
     * are still present in the DOM
     */
    processChangedElements() {
      if (this.rescanAll) {
        this.findEligibleInputs(document);
        return;
      }
      for (const element of this.changedElements) {
        if (element.isConnected) {
          this.findEligibleInputs(element);
        }
      }
    }
    handleEvent(event) {
      switch (event.type) {
        case "pointerdown":
        case "focus":
          this.scanOnClick(event);
          break;
      }
    }
    /**
     * Scan clicked input fields, even if they're within a shadow tree
     * @param {FocusEvent | PointerEvent} event
     */
    scanOnClick(event) {
      if (this.isStopped || !(event.target instanceof Element)) return;
      window.performance?.mark?.("scan_shadow:init:start");
      const realTarget = pierceShadowTree(event, HTMLInputElement);
      if (realTarget instanceof HTMLInputElement && realTarget.matches(this.matching.cssSelector("genericTextInputField")) && !realTarget.hasAttribute(ATTR_INPUT_TYPE3)) {
        if (shouldLog()) console.log("scanOnClick executing for target", realTarget);
        const parentForm = this.getParentForm(realTarget);
        if (parentForm instanceof HTMLInputElement) return;
        const hasShadowTree = event.target?.shadowRoot != null;
        const form = this.forms.get(parentForm);
        if (!form) {
          this.forms.set(
            parentForm,
            new Form(parentForm, realTarget, this.device, this.matching, this.shouldAutoprompt, hasShadowTree)
          );
        } else {
          form.addInput(realTarget);
        }
        this.findEligibleInputs(parentForm);
      }
      window.performance?.mark?.("scan_shadow:init:end");
      logPerformance("scan_shadow");
    }
  };
  function createScanner(device, scannerOptions) {
    return new DefaultScanner(device, {
      ...defaultScannerOptions,
      ...scannerOptions
    });
  }

  // src/UI/controllers/UIController.js
  var UIController = class {
    /**
     * Implement this method to control what happen when Autofill
     * has enough information to 'attach' a tooltip.
     *
     * @param {AttachTooltipArgs} _args
     * @returns {void}
     */
    attachTooltip(_args2) {
      throw new Error("must implement attachTooltip");
    }
    /**
     * Implement this method to control what happen when Autofill
     * has enough information to show the keyboard extension.
     *
     * @param {AttachKeyboardArgs} _args
     * @returns {void}
     */
    attachKeyboard(_args2) {
      throw new Error("must implement attachKeyboard");
    }
    /**
     * Implement this if your tooltip can be created from positioning
     * + topContextData.
     *
     * For example, in an 'overlay' on macOS/Windows this is needed since
     * there's no page information to call 'attach' above.
     *
     * @param {import("../interfaces").PosFn} _pos
     * @param {TopContextData} _topContextData
     * @returns {any | null}
     */
    createTooltip(_pos, _topContextData) {
    }
    /**
     * @param {string} _via
     */
    removeTooltip(_via) {
    }
    /**
     * Set the currently open HTMLTooltip instance
     *
     * @param {import("../HTMLTooltip.js").HTMLTooltip} _tooltip
     */
    setActiveTooltip(_tooltip) {
    }
    /**
     * Get the currently open HTMLTooltip instance, if one exists
     *
     * @returns {import("../HTMLTooltip.js").HTMLTooltip | null}
     */
    getActiveTooltip() {
      return null;
    }
    /**
     * Indicate whether the controller deems itself 'active'
     *
     * @returns {boolean}
     */
    isActive() {
      return false;
    }
    /**
     * Updates the items in the tooltip based on new data. Currently only supporting credentials.
     * @param {CredentialsObject[]} _data
     */
    updateItems(_data7) {
    }
    destroy() {
    }
  };

  // zod-replacers:./validators.zod.js
  var sendJSPixelParamsSchema = null;
  var addDebugFlagParamsSchema = null;
  var getAutofillDataFocusRequestSchema = null;
  var getAutofillCredentialsParamsSchema = null;
  var setSizeParamsSchema = null;
  var selectedDetailParamsSchema = null;
  var setIncontextSignupPermanentlyDismissedAtSchema = null;
  var getIncontextSignupDismissedAtSchema = null;
  var emailProtectionStoreUserDataParamsSchema = null;
  var showInContextEmailProtectionSignupPromptSchema = null;
  var getAutofillDataFocusResponseSchema = null;
  var getAutofillInitDataResponseSchema = null;
  var getAutofillCredentialsResultSchema = null;
  var checkCredentialsProviderStatusResultSchema = null;
  var getIdentityResultSchema = null;
  var getCreditCardResultSchema = null;
  var emailProtectionGetIsLoggedInResultSchema = null;
  var emailProtectionGetUserDataResultSchema = null;
  var emailProtectionGetCapabilitiesResultSchema = null;
  var emailProtectionGetAddressesResultSchema = null;
  var emailProtectionRefreshPrivateAddressResultSchema = null;
  var getAutofillDataRequestSchema = null;
  var getAutofillDataResponseSchema = null;
  var storeFormDataSchema = null;
  var getAvailableInputTypesResultSchema = null;
  var askToUnlockProviderResultSchema = null;
  var getRuntimeConfigurationResponseSchema = null;

  // packages/device-api/lib/device-api-call.js
  var DeviceApiCall = class {
    /**
     * @param {import("zod").infer<Params>} data
     */
    constructor(data) {
      /** @type {string} */
      __publicField(this, "method", "unknown");
      /**
       * An optional 'id' - used to indicate if a request requires a response.
       * @type {string|null}
       */
      __publicField(this, "id", null);
      /** @type {Params | null | undefined} */
      __publicField(this, "paramsValidator", null);
      /** @type {Result | null | undefined} */
      __publicField(this, "resultValidator", null);
      /** @type {import("zod").infer<Params>} */
      __publicField(this, "params");
      /**
       * This is a carve-out for legacy messages that are not typed yet.
       * If you set this to 'true', then the response will not be checked to conform
       * to any shape
       * @deprecated this is here to aid migration, should be removed ASAP
       * @type {boolean}
       */
      __publicField(this, "throwOnResultKeysMissing", true);
      /**
       * New messages should be in a particular format, eg: { success: T },
       * but you can set this to false if you want to access the result as-is,
       * without any unwrapping logic
       * @deprecated this is here to aid migration, should be removed ASAP
       * @type {boolean}
       */
      __publicField(this, "unwrapResult", true);
      this.params = data;
    }
    /**
     * @returns {import("zod").infer<Params>|undefined}
     */
    validateParams() {
      if (this.params === void 0) {
        return void 0;
      }
      this._validate(this.params, this.paramsValidator);
      return this.params;
    }
    /**
     * @param {any|null} incoming
     * @returns {import("zod").infer<Result>}
     */
    validateResult(incoming) {
      this._validate(incoming, this.resultValidator);
      if (!incoming) {
        return incoming;
      }
      if (!this.unwrapResult) {
        return incoming;
      }
      if ("data" in incoming) {
        console.warn("response had `data` property. Please migrate to `success`");
        return incoming.data;
      }
      if ("success" in incoming) {
        return incoming.success;
      }
      if ("error" in incoming) {
        if (typeof incoming.error.message === "string") {
          throw new DeviceApiCallError(`${this.method}: ${incoming.error.message}`);
        }
      }
      if (this.throwOnResultKeysMissing) {
        throw new Error("unreachable. Response did not contain `success` or `data`");
      }
      return incoming;
    }
    /**
     * @param {any} data
     * @param {import("zod").ZodType|undefined|null} [validator]
     * @private
     */
    _validate(data, validator) {
      if (!validator) return data;
      if (validator) {
        const result = validator?.safeParse(data);
        if (!result) {
          throw new Error("unreachable, data failure", data);
        }
        if (!result.success) {
          if ("error" in result) {
            this.throwError(result.error.issues);
          } else {
            console.error("unknown error from validate");
          }
        }
      }
    }
    /**
     * @param {import('zod').ZodIssue[]} errors
     */
    throwError(errors) {
      const error = SchemaValidationError.fromZodErrors(errors, this.constructor.name);
      throw error;
    }
    /**
     * Use this helper for creating stand-in response messages that are typed correctly.
     *
     * @examples
     *
     * ```js
     * const msg = new Message();
     * const response = msg.response({}) // <-- This argument will be typed correctly
     * ```
     *
     * @param {import("zod").infer<Result>} response
     * @returns {import("zod").infer<Result>}
     */
    result(response) {
      return response;
    }
    /**
     * @returns {import("zod").infer<Result>}
     */
    preResultValidation(response) {
      return response;
    }
  };
  var DeviceApiCallError = class extends Error {
  };
  var SchemaValidationError = class _SchemaValidationError extends Error {
    constructor() {
      super(...arguments);
      /** @type {import("zod").ZodIssue[]} */
      __publicField(this, "validationErrors", []);
    }
    /**
     * @param {import("zod").ZodIssue[]} errors
     * @param {string} name
     * @returns {SchemaValidationError}
     */
    static fromZodErrors(errors, name) {
      const heading = `${errors.length} SchemaValidationError(s) errors for ` + name;
      function log(issue) {
        switch (issue.code) {
          case "invalid_literal":
          case "invalid_type": {
            console.log(`${name}. Path: '${issue.path.join(".")}', Error: '${issue.message}'`);
            break;
          }
          case "invalid_union": {
            for (const unionError of issue.unionErrors) {
              for (const issue1 of unionError.issues) {
                log(issue1);
              }
            }
            break;
          }
          default: {
            console.log(name, "other issue:", issue);
          }
        }
      }
      for (const error2 of errors) {
        log(error2);
      }
      const message = [heading, "please see the details above"].join("\n    ");
      const error = new _SchemaValidationError(message);
      error.validationErrors = errors;
      return error;
    }
  };
  function createDeviceApiCall(method, params, paramsValidator = null, resultValidator = null) {
    const deviceApiCall = new DeviceApiCall(params);
    deviceApiCall.paramsValidator = paramsValidator;
    deviceApiCall.resultValidator = resultValidator;
    deviceApiCall.method = method;
    deviceApiCall.throwOnResultKeysMissing = false;
    deviceApiCall.unwrapResult = false;
    return deviceApiCall;
  }
  function createRequest(method, params, id = "n/a", paramsValidator = null, resultValidator = null) {
    const call = createDeviceApiCall(method, params, paramsValidator, resultValidator);
    call.id = id;
    return call;
  }
  var createNotification = createDeviceApiCall;
  function validate(data, validator = null) {
    if (validator) {
      return validator.parse(data);
    }
    return data;
  }

  // packages/device-api/lib/device-api.js
  var DeviceApiTransport = class {
    /**
     * @param {import("./device-api-call.js").DeviceApiCall} _deviceApiCall
     * @param {CallOptions} [_options]
     * @returns {Promise<any>}
     */
    async send(_deviceApiCall, _options) {
      return void 0;
    }
  };
  var DeviceApi = class {
    /** @param {DeviceApiTransport} transport */
    constructor(transport) {
      /** @type {DeviceApiTransport} */
      __publicField(this, "transport");
      this.transport = transport;
    }
    /**
     * @template {import("./device-api-call").DeviceApiCall} D
     * @param {D} deviceApiCall
     * @param {CallOptions} [options]
     * @returns {Promise<NonNullable<ReturnType<D['validateResult']>['success']>>}
     */
    async request(deviceApiCall, options) {
      deviceApiCall.validateParams();
      const result = await this.transport.send(deviceApiCall, options);
      const processed = deviceApiCall.preResultValidation(result);
      return deviceApiCall.validateResult(processed);
    }
    /**
     * @template {import("./device-api-call").DeviceApiCall} P
     * @param {P} deviceApiCall
     * @param {CallOptions} [options]
     * @returns {Promise<void>}
     */
    async notify(deviceApiCall, options) {
      deviceApiCall.validateParams();
      return this.transport.send(deviceApiCall, options);
    }
  };

  // src/deviceApiCalls/__generated__/deviceApiCalls.js
  var AddDebugFlagCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "addDebugFlag");
      __publicField(this, "paramsValidator", addDebugFlagParamsSchema);
    }
  };
  var GetAutofillDataCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "getAutofillData");
      __publicField(this, "id", "getAutofillDataResponse");
      __publicField(this, "paramsValidator", getAutofillDataRequestSchema);
      __publicField(this, "resultValidator", getAutofillDataResponseSchema);
    }
  };
  var GetAutofillDataFocusCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "getAutofillDataFocus");
      __publicField(this, "id", "getAutofillDataFocusResponse");
      __publicField(this, "paramsValidator", getAutofillDataFocusRequestSchema);
      __publicField(this, "resultValidator", getAutofillDataFocusResponseSchema);
    }
  };
  var GetRuntimeConfigurationCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "getRuntimeConfiguration");
      __publicField(this, "id", "getRuntimeConfigurationResponse");
      __publicField(this, "resultValidator", getRuntimeConfigurationResponseSchema);
    }
  };
  var StoreFormDataCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "storeFormData");
      __publicField(this, "paramsValidator", storeFormDataSchema);
    }
  };
  var GetAvailableInputTypesCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "getAvailableInputTypes");
      __publicField(this, "id", "getAvailableInputTypesResponse");
      __publicField(this, "resultValidator", getAvailableInputTypesResultSchema);
    }
  };
  var GetAutofillInitDataCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "getAutofillInitData");
      __publicField(this, "id", "getAutofillInitDataResponse");
      __publicField(this, "resultValidator", getAutofillInitDataResponseSchema);
    }
  };
  var GetAutofillCredentialsCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "getAutofillCredentials");
      __publicField(this, "id", "getAutofillCredentialsResponse");
      __publicField(this, "paramsValidator", getAutofillCredentialsParamsSchema);
      __publicField(this, "resultValidator", getAutofillCredentialsResultSchema);
    }
  };
  var SetSizeCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "setSize");
      __publicField(this, "paramsValidator", setSizeParamsSchema);
    }
  };
  var SelectedDetailCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "selectedDetail");
      __publicField(this, "paramsValidator", selectedDetailParamsSchema);
    }
  };
  var CloseAutofillParentCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "closeAutofillParent");
    }
  };
  var AskToUnlockProviderCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "askToUnlockProvider");
      __publicField(this, "id", "askToUnlockProviderResponse");
      __publicField(this, "resultValidator", askToUnlockProviderResultSchema);
    }
  };
  var CheckCredentialsProviderStatusCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "checkCredentialsProviderStatus");
      __publicField(this, "id", "checkCredentialsProviderStatusResponse");
      __publicField(this, "resultValidator", checkCredentialsProviderStatusResultSchema);
    }
  };
  var SendJSPixelCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "sendJSPixel");
      __publicField(this, "paramsValidator", sendJSPixelParamsSchema);
    }
  };
  var SetIncontextSignupPermanentlyDismissedAtCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "setIncontextSignupPermanentlyDismissedAt");
      __publicField(this, "paramsValidator", setIncontextSignupPermanentlyDismissedAtSchema);
    }
  };
  var GetIncontextSignupDismissedAtCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "getIncontextSignupDismissedAt");
      __publicField(this, "id", "getIncontextSignupDismissedAt");
      __publicField(this, "resultValidator", getIncontextSignupDismissedAtSchema);
    }
  };
  var OpenManagePasswordsCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "openManagePasswords");
    }
  };
  var OpenManageCreditCardsCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "openManageCreditCards");
    }
  };
  var OpenManageIdentitiesCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "openManageIdentities");
    }
  };
  var StartCredentialsImportFlowCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "startCredentialsImportFlow");
    }
  };
  var GetIdentityCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "getIdentity");
      __publicField(this, "id", "getIdentityResponse");
      __publicField(this, "resultValidator", getIdentityResultSchema);
    }
  };
  var GetCreditCardCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "getCreditCard");
      __publicField(this, "id", "getCreditCardResponse");
      __publicField(this, "resultValidator", getCreditCardResultSchema);
    }
  };
  var CredentialsImportFlowPermanentlyDismissedCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "credentialsImportFlowPermanentlyDismissed");
    }
  };
  var EmailProtectionStoreUserDataCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "emailProtectionStoreUserData");
      __publicField(this, "id", "emailProtectionStoreUserDataResponse");
      __publicField(this, "paramsValidator", emailProtectionStoreUserDataParamsSchema);
    }
  };
  var EmailProtectionRemoveUserDataCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "emailProtectionRemoveUserData");
    }
  };
  var EmailProtectionGetIsLoggedInCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "emailProtectionGetIsLoggedIn");
      __publicField(this, "id", "emailProtectionGetIsLoggedInResponse");
      __publicField(this, "resultValidator", emailProtectionGetIsLoggedInResultSchema);
    }
  };
  var EmailProtectionGetUserDataCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "emailProtectionGetUserData");
      __publicField(this, "id", "emailProtectionGetUserDataResponse");
      __publicField(this, "resultValidator", emailProtectionGetUserDataResultSchema);
    }
  };
  var EmailProtectionGetCapabilitiesCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "emailProtectionGetCapabilities");
      __publicField(this, "id", "emailProtectionGetCapabilitiesResponse");
      __publicField(this, "resultValidator", emailProtectionGetCapabilitiesResultSchema);
    }
  };
  var EmailProtectionGetAddressesCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "emailProtectionGetAddresses");
      __publicField(this, "id", "emailProtectionGetAddressesResponse");
      __publicField(this, "resultValidator", emailProtectionGetAddressesResultSchema);
    }
  };
  var EmailProtectionRefreshPrivateAddressCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "emailProtectionRefreshPrivateAddress");
      __publicField(this, "id", "emailProtectionRefreshPrivateAddressResponse");
      __publicField(this, "resultValidator", emailProtectionRefreshPrivateAddressResultSchema);
    }
  };
  var StartEmailProtectionSignupCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "startEmailProtectionSignup");
    }
  };
  var CloseEmailProtectionTabCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "closeEmailProtectionTab");
    }
  };
  var ShowInContextEmailProtectionSignupPromptCall = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "ShowInContextEmailProtectionSignupPrompt");
      __publicField(this, "id", "ShowInContextEmailProtectionSignupPromptResponse");
      __publicField(this, "resultValidator", showInContextEmailProtectionSignupPromptSchema);
    }
  };

  // src/UI/controllers/NativeUIController.js
  var _passwordStatus;
  var NativeUIController = class extends UIController {
    constructor() {
      super(...arguments);
      /**
       * Keep track of when passwords were suggested/rejected/accepted etc
       * State is kept here because it's specific to the interactions on mobile (eg: NativeUIController)
       *
       * @type {"default" | "rejected"}
       */
      __privateAdd(this, _passwordStatus, "default");
    }
    /**
     * @param {import('./UIController').AttachTooltipArgs} args
     */
    attachTooltip(args) {
      const { form, input, device, trigger, triggerMetaData, topContextData } = args;
      const inputType = getInputType(input);
      const mainType = getMainTypeFromType(inputType);
      const subType = getSubtypeFromType(inputType);
      if (mainType === "unknown") {
        throw new Error('unreachable, should not be here if (mainType === "unknown")');
      }
      if (trigger === "autoprompt") {
        window.scrollTo({
          behavior: "smooth",
          top: form.form.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 50
        });
      }
      let payload = {
        inputType,
        mainType,
        subType,
        trigger
      };
      if (device.settings.featureToggles.password_generation) {
        payload = this.appendGeneratedPassword(topContextData, payload, triggerMetaData);
      }
      device.deviceApi.request(new GetAutofillDataCall(payload)).then((resp) => {
        switch (resp.action) {
          case "fill": {
            if (mainType in resp) {
              form.autofillData(resp[mainType], mainType);
            } else {
              throw new Error(`action: "fill" cannot occur because "${mainType}" was missing`);
            }
            break;
          }
          case "focus": {
            form.activeInput?.focus();
            break;
          }
          case "refreshAvailableInputTypes": {
            device.credentialsImport.refresh(resp.availableInputTypes);
            break;
          }
          case "acceptGeneratedPassword": {
            form.autofillData(
              {
                password: topContextData.credentials?.[0].password,
                [AUTOGENERATED_KEY]: true
              },
              mainType
            );
            break;
          }
          case "none": {
            form.touchAllInputs(mainType);
            break;
          }
          case "rejectGeneratedPassword": {
            __privateSet(this, _passwordStatus, "rejected");
            form.touchAllInputs("credentials");
            form.activeInput?.focus();
            break;
          }
          default: {
            if (args.device.isTestMode()) {
              console.warn("response not handled", resp);
            }
          }
        }
      }).catch((e) => {
        console.error("NativeTooltip::device.getAutofillData(payload)");
        console.error(e);
      });
    }
    /**
     * @param {import('./UIController').AttachKeyboardArgs} args
     */
    async attachKeyboard(args) {
      const { device, form, element } = args;
      const inputType = getInputType(element);
      const mainType = getMainTypeFromType(inputType);
      try {
        const resp = await device.deviceApi.request(
          new GetAutofillDataFocusCall({
            inputType,
            mainType
          })
        );
        switch (resp.action) {
          case "fill": {
            form?.autofillData(resp.creditCards, "creditCards");
            element.blur();
            break;
          }
          case "none": {
            break;
          }
        }
      } catch (e) {
        console.error("NativeTooltip::device.getAutofillDataFocus()");
        console.error(e);
      }
    }
    /**
     * If a password exists in `topContextData`, we can append it to the outgoing data
     * in a way that native platforms can easily understand.
     *
     * @param {TopContextData} topContextData
     * @param {import('../../deviceApiCalls/__generated__/validators-ts.js').GetAutofillDataRequest} outgoingData
     * @param {import('../../UI/controllers/UIController.js').AttachTooltipArgs['triggerMetaData']} triggerMetaData
     * @return {import('../../deviceApiCalls/__generated__/validators-ts.js').GetAutofillDataRequest}
     */
    appendGeneratedPassword(topContextData, outgoingData, triggerMetaData) {
      const autoGeneratedCredential = topContextData.credentials?.find((credential) => credential.autogenerated);
      if (!autoGeneratedCredential?.password) {
        return outgoingData;
      }
      function suggestPassword() {
        if (!autoGeneratedCredential?.password) throw new Error("unreachable");
        return {
          ...outgoingData,
          generatedPassword: {
            value: autoGeneratedCredential.password,
            username: autoGeneratedCredential.username
          }
        };
      }
      if (triggerMetaData.type === "explicit-opt-in") {
        return suggestPassword();
      }
      if (triggerMetaData.type === "implicit-opt-in" && __privateGet(this, _passwordStatus) !== "rejected") {
        return suggestPassword();
      }
      return outgoingData;
    }
  };
  _passwordStatus = new WeakMap();

  // packages/messaging/webkit.js
  var WebkitMessagingTransport = class {
    /**
     * @param {WebkitMessagingConfig} config
     */
    constructor(config) {
      /** @type {WebkitMessagingConfig} */
      __publicField(this, "config");
      __publicField(this, "globals");
      /**
       * @type {{name: string, length: number}}
       */
      __publicField(this, "algoObj", { name: "AES-GCM", length: 256 });
      this.config = config;
      this.globals = captureGlobals();
      if (!this.config.hasModernWebkitAPI) {
        this.captureWebkitHandlers(this.config.webkitMessageHandlerNames);
      }
    }
    /**
     * Sends message to the webkit layer (fire and forget)
     * @param {String} handler
     * @param {*} data
     * @internal
     */
    wkSend(handler, data = {}) {
      if (!(handler in this.globals.window.webkit.messageHandlers)) {
        throw new MissingHandler(`Missing webkit handler: '${handler}'`, handler);
      }
      const outgoing = {
        ...data,
        messageHandling: { ...data.messageHandling, secret: this.config.secret }
      };
      if (!this.config.hasModernWebkitAPI) {
        if (!(handler in this.globals.capturedWebkitHandlers)) {
          throw new MissingHandler(`cannot continue, method ${handler} not captured on macos < 11`, handler);
        } else {
          return this.globals.capturedWebkitHandlers[handler](outgoing);
        }
      }
      return this.globals.window.webkit.messageHandlers[handler].postMessage?.(outgoing);
    }
    /**
     * Sends message to the webkit layer and waits for the specified response
     * @param {String} handler
     * @param {*} data
     * @returns {Promise<*>}
     * @internal
     */
    async wkSendAndWait(handler, data = {}) {
      if (this.config.hasModernWebkitAPI) {
        const response = await this.wkSend(handler, data);
        return this.globals.JSONparse(response || "{}");
      }
      try {
        const randMethodName = this.createRandMethodName();
        const key2 = await this.createRandKey();
        const iv = this.createRandIv();
        const { ciphertext, tag } = await new this.globals.Promise((resolve) => {
          this.generateRandomMethod(randMethodName, resolve);
          data.messageHandling = new SecureMessagingParams({
            methodName: randMethodName,
            secret: this.config.secret,
            key: this.globals.Arrayfrom(key2),
            iv: this.globals.Arrayfrom(iv)
          });
          this.wkSend(handler, data);
        });
        const cipher = new this.globals.Uint8Array([...ciphertext, ...tag]);
        const decrypted = await this.decrypt(cipher, key2, iv);
        return this.globals.JSONparse(decrypted || "{}");
      } catch (e) {
        if (e instanceof MissingHandler) {
          throw e;
        } else {
          console.error("decryption failed", e);
          console.error(e);
          return { error: e };
        }
      }
    }
    /**
     * @param {string} name
     * @param {Record<string, any>} [data]
     */
    notify(name, data = {}) {
      this.wkSend(name, data);
    }
    /**
     * @param {string} name
     * @param {Record<string, any>} [data]
     */
    request(name, data = {}) {
      return this.wkSendAndWait(name, data);
    }
    /**
     * Generate a random method name and adds it to the global scope
     * The native layer will use this method to send the response
     * @param {string | number} randomMethodName
     * @param {Function} callback
     */
    generateRandomMethod(randomMethodName, callback) {
      this.globals.ObjectDefineProperty(this.globals.window, randomMethodName, {
        enumerable: false,
        // configurable, To allow for deletion later
        configurable: true,
        writable: false,
        /**
         * @param {any[]} args
         */
        value: (...args) => {
          callback(...args);
          delete this.globals.window[randomMethodName];
        }
      });
    }
    randomString() {
      return "" + this.globals.getRandomValues(new this.globals.Uint32Array(1))[0];
    }
    createRandMethodName() {
      return "_" + this.randomString();
    }
    /**
     * @returns {Promise<Uint8Array>}
     */
    async createRandKey() {
      const key2 = await this.globals.generateKey(this.algoObj, true, ["encrypt", "decrypt"]);
      const exportedKey = await this.globals.exportKey("raw", key2);
      return new this.globals.Uint8Array(exportedKey);
    }
    /**
     * @returns {Uint8Array}
     */
    createRandIv() {
      return this.globals.getRandomValues(new this.globals.Uint8Array(12));
    }
    /**
     * @param {BufferSource} ciphertext
     * @param {BufferSource} key
     * @param {Uint8Array} iv
     * @returns {Promise<string>}
     */
    async decrypt(ciphertext, key2, iv) {
      const cryptoKey = await this.globals.importKey("raw", key2, "AES-GCM", false, ["decrypt"]);
      const algo = { name: "AES-GCM", iv };
      const decrypted = await this.globals.decrypt(algo, cryptoKey, ciphertext);
      const dec = new this.globals.TextDecoder();
      return dec.decode(decrypted);
    }
    /**
     * When required (such as on macos 10.x), capture the `postMessage` method on
     * each webkit messageHandler
     *
     * @param {string[]} handlerNames
     */
    captureWebkitHandlers(handlerNames) {
      const handlers = window.webkit.messageHandlers;
      if (!handlers) throw new MissingHandler("window.webkit.messageHandlers was absent", "all");
      for (const webkitMessageHandlerName of handlerNames) {
        if (typeof handlers[webkitMessageHandlerName]?.postMessage === "function") {
          const original = handlers[webkitMessageHandlerName];
          const bound = handlers[webkitMessageHandlerName].postMessage?.bind(original);
          this.globals.capturedWebkitHandlers[webkitMessageHandlerName] = bound;
          delete handlers[webkitMessageHandlerName].postMessage;
        }
      }
    }
  };
  var WebkitMessagingConfig = class {
    /**
     * @param {object} params
     * @param {boolean} params.hasModernWebkitAPI
     * @param {string[]} params.webkitMessageHandlerNames
     * @param {string} params.secret
     */
    constructor(params) {
      this.hasModernWebkitAPI = params.hasModernWebkitAPI;
      this.webkitMessageHandlerNames = params.webkitMessageHandlerNames;
      this.secret = params.secret;
    }
  };
  var SecureMessagingParams = class {
    /**
     * @param {object} params
     * @param {string} params.methodName
     * @param {string} params.secret
     * @param {number[]} params.key
     * @param {number[]} params.iv
     */
    constructor(params) {
      this.methodName = params.methodName;
      this.secret = params.secret;
      this.key = params.key;
      this.iv = params.iv;
    }
  };
  function captureGlobals() {
    return {
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
      ObjectDefineProperty: window.Object.defineProperty,
      addEventListener: window.addEventListener.bind(window),
      /** @type {Record<string, any>} */
      capturedWebkitHandlers: {}
    };
  }

  // packages/messaging/messaging.js
  var Messaging = class {
    /**
     * @param {WebkitMessagingConfig} config
     */
    constructor(config) {
      this.transport = getTransport(config);
    }
    /**
     * Send a 'fire-and-forget' message.
     * @throws {Error}
     * {@link MissingHandler}
     *
     * @example
     *
     * ```
     * const messaging = new Messaging(config)
     * messaging.notify("foo", {bar: "baz"})
     * ```
     * @param {string} name
     * @param {Record<string, any>} [data]
     */
    notify(name, data = {}) {
      this.transport.notify(name, data);
    }
    /**
     * Send a request, and wait for a response
     * @throws {Error}
     * {@link MissingHandler}
     *
     * @example
     * ```
     * const messaging = new Messaging(config)
     * const response = await messaging.request("foo", {bar: "baz"})
     * ```
     *
     * @param {string} name
     * @param {Record<string, any>} [data]
     * @return {Promise<any>}
     */
    request(name, data = {}) {
      return this.transport.request(name, data);
    }
  };
  function getTransport(config) {
    if (config instanceof WebkitMessagingConfig) {
      return new WebkitMessagingTransport(config);
    }
    throw new Error("unreachable");
  }
  var MissingHandler = class extends Error {
    /**
     * @param {string} message
     * @param {string} handlerName
     */
    constructor(message, handlerName) {
      super(message);
      this.handlerName = handlerName;
    }
  };

  // src/deviceApiCalls/transports/apple.transport.js
  var AppleTransport = class extends DeviceApiTransport {
    /** @param {GlobalConfig} globalConfig */
    constructor(globalConfig) {
      super();
      this.config = globalConfig;
      const webkitConfig = new WebkitMessagingConfig({
        hasModernWebkitAPI: this.config.hasModernWebkitAPI,
        webkitMessageHandlerNames: this.config.webkitMessageHandlerNames,
        secret: this.config.secret
      });
      this.messaging = new Messaging(webkitConfig);
    }
    async send(deviceApiCall) {
      try {
        if (deviceApiCall.id) {
          return await this.messaging.request(deviceApiCall.method, deviceApiCall.params || void 0);
        } else {
          return this.messaging.notify(deviceApiCall.method, deviceApiCall.params || void 0);
        }
      } catch (e) {
        if (e instanceof MissingHandler) {
          if (this.config.isDDGTestMode) {
            console.log("MissingWebkitHandler error for:", deviceApiCall.method);
          }
          throw new Error("unimplemented handler: " + deviceApiCall.method);
        } else {
          throw e;
        }
      }
    }
  };

  // src/deviceApiCalls/transports/android.transport.js
  var AndroidTransport = class extends DeviceApiTransport {
    /** @param {GlobalConfig} globalConfig */
    constructor(globalConfig) {
      super();
      /** @type {GlobalConfig} */
      __publicField(this, "config");
      this.config = globalConfig;
      if (this.config.isDDGTestMode) {
        if (typeof window.BrowserAutofill?.getAutofillData !== "function") {
          console.warn("window.BrowserAutofill.getAutofillData missing");
        }
        if (typeof window.BrowserAutofill?.storeFormData !== "function") {
          console.warn("window.BrowserAutofill.storeFormData missing");
        }
      }
    }
    /**
     * @param {import("../../../packages/device-api").DeviceApiCall} deviceApiCall
     * @returns {Promise<any>}
     */
    async send(deviceApiCall) {
      if (deviceApiCall instanceof GetRuntimeConfigurationCall) {
        return androidSpecificRuntimeConfiguration(this.config);
      }
      if (deviceApiCall instanceof GetAvailableInputTypesCall) {
        return androidSpecificAvailableInputTypes(this.config);
      }
      if (deviceApiCall instanceof GetIncontextSignupDismissedAtCall) {
        window.BrowserAutofill.getIncontextSignupDismissedAt(JSON.stringify(deviceApiCall.params));
        return waitForResponse(deviceApiCall.id, this.config);
      }
      if (deviceApiCall instanceof SetIncontextSignupPermanentlyDismissedAtCall) {
        return window.BrowserAutofill.setIncontextSignupPermanentlyDismissedAt(JSON.stringify(deviceApiCall.params));
      }
      if (deviceApiCall instanceof StartEmailProtectionSignupCall) {
        return window.BrowserAutofill.startEmailProtectionSignup(JSON.stringify(deviceApiCall.params));
      }
      if (deviceApiCall instanceof CloseEmailProtectionTabCall) {
        return window.BrowserAutofill.closeEmailProtectionTab(JSON.stringify(deviceApiCall.params));
      }
      if (deviceApiCall instanceof ShowInContextEmailProtectionSignupPromptCall) {
        window.BrowserAutofill.showInContextEmailProtectionSignupPrompt(JSON.stringify(deviceApiCall.params));
        return waitForResponse(deviceApiCall.id, this.config);
      }
      if (deviceApiCall instanceof GetAutofillDataCall) {
        window.BrowserAutofill.getAutofillData(JSON.stringify(deviceApiCall.params));
        return waitForResponse(deviceApiCall.id, this.config);
      }
      if (deviceApiCall instanceof StoreFormDataCall) {
        return window.BrowserAutofill.storeFormData(JSON.stringify(deviceApiCall.params));
      }
      throw new Error("android: not implemented: " + deviceApiCall.method);
    }
  };
  function waitForResponse(expectedResponse, config) {
    return new Promise((resolve) => {
      const handler = (e) => {
        if (!config.isDDGTestMode) {
          if (e.origin !== "") {
            return;
          }
        }
        if (!e.data) {
          return;
        }
        if (typeof e.data !== "string") {
          if (config.isDDGTestMode) {
            console.log("\u274C event.data was not a string. Expected a string so that it can be JSON parsed");
          }
          return;
        }
        try {
          const data = JSON.parse(e.data);
          if (data.type === expectedResponse) {
            window.removeEventListener("message", handler);
            return resolve(data);
          }
          if (config.isDDGTestMode) {
            console.log(`\u274C event.data.type was '${data.type}', which didnt match '${expectedResponse}'`, JSON.stringify(data));
          }
        } catch (e2) {
          window.removeEventListener("message", handler);
          if (config.isDDGTestMode) {
            console.log("\u274C Could not JSON.parse the response");
          }
        }
      };
      window.addEventListener("message", handler);
    });
  }
  function androidSpecificRuntimeConfiguration(globalConfig) {
    if (!globalConfig.userPreferences) {
      throw new Error("globalConfig.userPreferences not supported yet on Android");
    }
    return {
      success: {
        // @ts-ignore
        contentScope: globalConfig.contentScope,
        // @ts-ignore
        userPreferences: globalConfig.userPreferences,
        // @ts-ignore
        userUnprotectedDomains: globalConfig.userUnprotectedDomains,
        // @ts-ignore
        availableInputTypes: globalConfig.availableInputTypes
      }
    };
  }
  function androidSpecificAvailableInputTypes(globalConfig) {
    if (!globalConfig.availableInputTypes) {
      throw new Error("globalConfig.availableInputTypes not supported yet on Android");
    }
    return {
      success: globalConfig.availableInputTypes
    };
  }

  // zod-replacers:./deviceApiCalls/__generated__/validators.zod.js
  var providerStatusUpdatedSchema = null;
  var autofillSettingsSchema = null;

  // node_modules/immutable-json-patch/lib/esm/typeguards.js
  function isJSONArray(value) {
    return Array.isArray(value);
  }
  function isJSONObject(value) {
    return value !== null && typeof value === "object" && (value.constructor === void 0 || // for example Object.create(null)
    value.constructor.name === "Object");
  }

  // node_modules/immutable-json-patch/lib/esm/utils.js
  function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  function initial(array) {
    return array.slice(0, array.length - 1);
  }
  function last(array) {
    return array[array.length - 1];
  }
  function isObjectOrArray(value) {
    return typeof value === "object" && value !== null;
  }

  // node_modules/immutable-json-patch/lib/esm/immutabilityHelpers.js
  function shallowClone(value) {
    if (isJSONArray(value)) {
      const copy2 = value.slice();
      Object.getOwnPropertySymbols(value).forEach((symbol) => {
        copy2[symbol] = value[symbol];
      });
      return copy2;
    } else if (isJSONObject(value)) {
      const copy2 = {
        ...value
      };
      Object.getOwnPropertySymbols(value).forEach((symbol) => {
        copy2[symbol] = value[symbol];
      });
      return copy2;
    } else {
      return value;
    }
  }
  function applyProp(object, key2, value) {
    if (object[key2] === value) {
      return object;
    } else {
      const updatedObject = shallowClone(object);
      updatedObject[key2] = value;
      return updatedObject;
    }
  }
  function getIn(object, path) {
    let value = object;
    let i = 0;
    while (i < path.length) {
      if (isJSONObject(value)) {
        value = value[path[i]];
      } else if (isJSONArray(value)) {
        value = value[parseInt(path[i])];
      } else {
        value = void 0;
      }
      i++;
    }
    return value;
  }
  function setIn(object, path, value) {
    let createPath = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    if (path.length === 0) {
      return value;
    }
    const key2 = path[0];
    const updatedValue = setIn(object ? object[key2] : void 0, path.slice(1), value, createPath);
    if (isJSONObject(object) || isJSONArray(object)) {
      return applyProp(object, key2, updatedValue);
    } else {
      if (createPath) {
        const newObject = IS_INTEGER_REGEX.test(key2) ? [] : {};
        newObject[key2] = updatedValue;
        return newObject;
      } else {
        throw new Error("Path does not exist");
      }
    }
  }
  var IS_INTEGER_REGEX = /^\d+$/;
  function updateIn(object, path, transform) {
    if (path.length === 0) {
      return transform(object);
    }
    if (!isObjectOrArray(object)) {
      throw new Error("Path doesn't exist");
    }
    const key2 = path[0];
    const updatedValue = updateIn(object[key2], path.slice(1), transform);
    return applyProp(object, key2, updatedValue);
  }
  function deleteIn(object, path) {
    if (path.length === 0) {
      return object;
    }
    if (!isObjectOrArray(object)) {
      throw new Error("Path does not exist");
    }
    if (path.length === 1) {
      const key3 = path[0];
      if (!(key3 in object)) {
        return object;
      } else {
        const updatedObject = shallowClone(object);
        if (isJSONArray(updatedObject)) {
          updatedObject.splice(parseInt(key3), 1);
        }
        if (isJSONObject(updatedObject)) {
          delete updatedObject[key3];
        }
        return updatedObject;
      }
    }
    const key2 = path[0];
    const updatedValue = deleteIn(object[key2], path.slice(1));
    return applyProp(object, key2, updatedValue);
  }
  function insertAt(document2, path, value) {
    const parentPath = path.slice(0, path.length - 1);
    const index = path[path.length - 1];
    return updateIn(document2, parentPath, (items) => {
      if (!Array.isArray(items)) {
        throw new TypeError("Array expected at path " + JSON.stringify(parentPath));
      }
      const updatedItems = shallowClone(items);
      updatedItems.splice(parseInt(index), 0, value);
      return updatedItems;
    });
  }
  function existsIn(document2, path) {
    if (document2 === void 0) {
      return false;
    }
    if (path.length === 0) {
      return true;
    }
    if (document2 === null) {
      return false;
    }
    return existsIn(document2[path[0]], path.slice(1));
  }

  // node_modules/immutable-json-patch/lib/esm/jsonPointer.js
  function parseJSONPointer(pointer) {
    const path = pointer.split("/");
    path.shift();
    return path.map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"));
  }
  function compileJSONPointer(path) {
    return path.map(compileJSONPointerProp).join("");
  }
  function compileJSONPointerProp(pathProp) {
    return "/" + String(pathProp).replace(/~/g, "~0").replace(/\//g, "~1");
  }

  // node_modules/immutable-json-patch/lib/esm/immutableJSONPatch.js
  function immutableJSONPatch(document2, operations, options) {
    let updatedDocument = document2;
    for (let i = 0; i < operations.length; i++) {
      validateJSONPatchOperation(operations[i]);
      let operation = operations[i];
      if (options && options.before) {
        const result = options.before(updatedDocument, operation);
        if (result !== void 0) {
          if (result.document !== void 0) {
            updatedDocument = result.document;
          }
          if (result.json !== void 0) {
            throw new Error('Deprecation warning: returned object property ".json" has been renamed to ".document"');
          }
          if (result.operation !== void 0) {
            operation = result.operation;
          }
        }
      }
      const previousDocument = updatedDocument;
      const path = parsePath(updatedDocument, operation.path);
      if (operation.op === "add") {
        updatedDocument = add(updatedDocument, path, operation.value);
      } else if (operation.op === "remove") {
        updatedDocument = remove(updatedDocument, path);
      } else if (operation.op === "replace") {
        updatedDocument = replace(updatedDocument, path, operation.value);
      } else if (operation.op === "copy") {
        updatedDocument = copy(updatedDocument, path, parseFrom(operation.from));
      } else if (operation.op === "move") {
        updatedDocument = move(updatedDocument, path, parseFrom(operation.from));
      } else if (operation.op === "test") {
        test(updatedDocument, path, operation.value);
      } else {
        throw new Error("Unknown JSONPatch operation " + JSON.stringify(operation));
      }
      if (options && options.after) {
        const result = options.after(updatedDocument, operation, previousDocument);
        if (result !== void 0) {
          updatedDocument = result;
        }
      }
    }
    return updatedDocument;
  }
  function replace(document2, path, value) {
    return setIn(document2, path, value);
  }
  function remove(document2, path) {
    return deleteIn(document2, path);
  }
  function add(document2, path, value) {
    if (isArrayItem(document2, path)) {
      return insertAt(document2, path, value);
    } else {
      return setIn(document2, path, value);
    }
  }
  function copy(document2, path, from) {
    const value = getIn(document2, from);
    if (isArrayItem(document2, path)) {
      return insertAt(document2, path, value);
    } else {
      const value2 = getIn(document2, from);
      return setIn(document2, path, value2);
    }
  }
  function move(document2, path, from) {
    const value = getIn(document2, from);
    const removedJson = deleteIn(document2, from);
    return isArrayItem(removedJson, path) ? insertAt(removedJson, path, value) : setIn(removedJson, path, value);
  }
  function test(document2, path, value) {
    if (value === void 0) {
      throw new Error(`Test failed: no value provided (path: "${compileJSONPointer(path)}")`);
    }
    if (!existsIn(document2, path)) {
      throw new Error(`Test failed: path not found (path: "${compileJSONPointer(path)}")`);
    }
    const actualValue = getIn(document2, path);
    if (!isEqual(actualValue, value)) {
      throw new Error(`Test failed, value differs (path: "${compileJSONPointer(path)}")`);
    }
  }
  function isArrayItem(document2, path) {
    if (path.length === 0) {
      return false;
    }
    const parent = getIn(document2, initial(path));
    return Array.isArray(parent);
  }
  function resolvePathIndex(document2, path) {
    if (last(path) !== "-") {
      return path;
    }
    const parentPath = initial(path);
    const parent = getIn(document2, parentPath);
    return parentPath.concat(parent.length);
  }
  function validateJSONPatchOperation(operation) {
    const ops = ["add", "remove", "replace", "copy", "move", "test"];
    if (!ops.includes(operation.op)) {
      throw new Error("Unknown JSONPatch op " + JSON.stringify(operation.op));
    }
    if (typeof operation.path !== "string") {
      throw new Error('Required property "path" missing or not a string in operation ' + JSON.stringify(operation));
    }
    if (operation.op === "copy" || operation.op === "move") {
      if (typeof operation.from !== "string") {
        throw new Error('Required property "from" missing or not a string in operation ' + JSON.stringify(operation));
      }
    }
  }
  function parsePath(document2, pointer) {
    return resolvePathIndex(document2, parseJSONPointer(pointer));
  }
  function parseFrom(fromPointer) {
    return parseJSONPointer(fromPointer);
  }

  // node_modules/@duckduckgo/content-scope-scripts/injected/src/config-feature.js
  var _bundledConfig, _args;
  var ConfigFeature = class {
    /**
     * @param {string} name
     * @param {import('./content-scope-features.js').LoadArgs} args
     */
    constructor(name, args) {
      /** @type {import('./utils.js').RemoteConfig | undefined} */
      __privateAdd(this, _bundledConfig);
      /** @type {string} */
      __publicField(this, "name");
      /** @type {{ debug?: boolean, desktopModeEnabled?: boolean, forcedZoomEnabled?: boolean, featureSettings?: Record<string, unknown>, assets?: import('./content-feature.js').AssetConfig | undefined, site: import('./content-feature.js').Site, messagingConfig?: import('@duckduckgo/messaging').MessagingConfig } | null} */
      __privateAdd(this, _args);
      this.name = name;
      const { bundledConfig, site, platform } = args;
      __privateSet(this, _bundledConfig, bundledConfig);
      __privateSet(this, _args, args);
      if (__privateGet(this, _bundledConfig) && __privateGet(this, _args)) {
        const enabledFeatures = computeEnabledFeatures(bundledConfig, site.domain, platform.version);
        __privateGet(this, _args).featureSettings = parseFeatureSettings(bundledConfig, enabledFeatures);
      }
    }
    get args() {
      return __privateGet(this, _args);
    }
    set args(args) {
      __privateSet(this, _args, args);
    }
    get featureSettings() {
      return __privateGet(this, _args)?.featureSettings;
    }
    /**
     * Given a config key, interpret the value as a list of domain overrides, and return the elements that match the current page
     * Consider using patchSettings instead as per `getFeatureSetting`.
     * @param {string} featureKeyName
     * @return {any[]}
     * @protected
     */
    matchDomainFeatureSetting(featureKeyName) {
      const domain = this.args?.site.domain;
      if (!domain) return [];
      const domains = this._getFeatureSettings()?.[featureKeyName] || [];
      return domains.filter((rule) => {
        if (Array.isArray(rule.domain)) {
          return rule.domain.some((domainRule) => {
            return matchHostname(domain, domainRule);
          });
        }
        return matchHostname(domain, rule.domain);
      });
    }
    /**
     * Return the settings object for a feature
     * @param {string} [featureName] - The name of the feature to get the settings for; defaults to the name of the feature
     * @returns {any}
     */
    _getFeatureSettings(featureName) {
      const camelFeatureName = featureName || camelcase(this.name);
      return this.featureSettings?.[camelFeatureName];
    }
    /**
     * For simple boolean settings, return true if the setting is 'enabled'
     * For objects, verify the 'state' field is 'enabled'.
     * This allows for future forwards compatibility with more complex settings if required.
     * For example:
     * ```json
     * {
     *    "toggle": "enabled"
     * }
     * ```
     * Could become later (without breaking changes):
     * ```json
     * {
     *   "toggle": {
     *       "state": "enabled",
     *       "someOtherKey": 1
     *   }
     * }
     * ```
     * This also supports domain overrides as per `getFeatureSetting`.
     * @param {string} featureKeyName
     * @param {string} [featureName]
     * @returns {boolean}
     */
    getFeatureSettingEnabled(featureKeyName, featureName) {
      const result = this.getFeatureSetting(featureKeyName, featureName);
      if (typeof result === "object") {
        return result.state === "enabled";
      }
      return result === "enabled";
    }
    /**
      * Return a specific setting from the feature settings
      * If the "settings" key within the config has a "domains" key, it will be used to override the settings.
      * This uses JSONPatch to apply the patches to settings before getting the setting value.
      * For example.com getFeatureSettings('val') will return 1:
      * ```json
      *  {
      *      "settings": {
      *         "domains": [
      *             {
      *                "domain": "example.com",
      *                "patchSettings": [
      *                    { "op": "replace", "path": "/val", "value": 1 }
      *                ]
      *             }
      *         ]
      *      }
      *  }
      * ```
      * "domain" can either be a string or an array of strings.
    
      * For boolean states you should consider using getFeatureSettingEnabled.
      * @param {string} featureKeyName
      * @param {string} [featureName]
      * @returns {any}
    */
    getFeatureSetting(featureKeyName, featureName) {
      let result = this._getFeatureSettings(featureName);
      if (featureKeyName === "domains") {
        throw new Error("domains is a reserved feature setting key name");
      }
      const domainMatch = [...this.matchDomainFeatureSetting("domains")].sort((a, b) => {
        return a.domain.length - b.domain.length;
      });
      for (const match of domainMatch) {
        if (match.patchSettings === void 0) {
          continue;
        }
        try {
          result = immutableJSONPatch(result, match.patchSettings);
        } catch (e) {
          console.error("Error applying patch settings", e);
        }
      }
      return result?.[featureKeyName];
    }
    /**
     * @returns {import('./utils.js').RemoteConfig | undefined}
     **/
    get bundledConfig() {
      return __privateGet(this, _bundledConfig);
    }
  };
  _bundledConfig = new WeakMap();
  _args = new WeakMap();

  // src/site-specific-feature.js
  var FEATURE_NAME = "siteSpecificFixes";
  var SiteSpecificFeature = class extends ConfigFeature {
    constructor(args) {
      super(FEATURE_NAME, args);
    }
    /**
     * @returns {InputTypeSetting[]}
     */
    get inputTypeSettings() {
      return this.getFeatureSetting("inputTypeSettings") || [];
    }
    /**
     * @param {HTMLInputElement} input
     * @returns {import('./Form/matching').SupportedTypes | null}
     */
    getForcedInputType(input) {
      const setting = this.inputTypeSettings.find((config) => input.matches(config.selector));
      if (!isValidSupportedType(setting?.type)) return null;
      return setting?.type;
    }
    /**
     * @returns {FormTypeSetting[]}
     */
    get formTypeSettings() {
      return this.getFeatureSetting("formTypeSettings") || [];
    }
    /**
     * @returns {FormBoundarySelector|null}
     */
    get formBoundarySelector() {
      return this.getFeatureSetting("formBoundarySelector");
    }
    /**
     * @returns {FailsafeSettings}
     */
    get failsafeSettings() {
      return this.getFeatureSetting("failsafeSettings");
    }
    /**
     * @returns {number|undefined}
     */
    get maxInputsPerPage() {
      return this.failsafeSettings?.maxInputsPerPage;
    }
    /**
     * @returns {number|undefined}
     */
    get maxFormsPerPage() {
      return this.failsafeSettings?.maxFormsPerPage;
    }
    /**
     * @returns {number|undefined}
     */
    get maxInputsPerForm() {
      return this.failsafeSettings?.maxInputsPerForm;
    }
    /**
     * Checks if there's a forced form type configuration for the given form element
     * @param {HTMLElement} form
     * @returns {string|null|undefined}
     */
    getForcedFormType(form) {
      return this.formTypeSettings.find((config) => form.matches(config.selector))?.type;
    }
    /**
     * @returns {HTMLElement|null}
     */
    getForcedForm() {
      return this.formBoundarySelector ? document.querySelector(this.formBoundarySelector) : null;
    }
  };

  // src/Settings.js
  var _Settings = class _Settings {
    /**
     * @param {GlobalConfig} config
     * @param {DeviceApi} deviceApi
     */
    constructor(config, deviceApi) {
      /** @type {GlobalConfig} */
      __publicField(this, "globalConfig");
      /** @type {DeviceApi} */
      __publicField(this, "deviceApi");
      /** @type {AutofillFeatureToggles | null} */
      __publicField(this, "_featureToggles", null);
      /** @type {AvailableInputTypes | null} */
      __publicField(this, "_availableInputTypes", null);
      /** @type {RuntimeConfiguration | null | undefined} */
      __publicField(this, "_runtimeConfiguration", null);
      /** @type {boolean | null} */
      __publicField(this, "_enabled", null);
      /** @type {string} */
      __publicField(this, "_language", "en");
      /** @type {SiteSpecificFeature | null} */
      __publicField(this, "_siteSpecificFeature", null);
      this.deviceApi = deviceApi;
      this.globalConfig = config;
    }
    /**
     * Feature toggles are delivered as part of the Runtime Configuration - a flexible design that
     * allows data per user + remote config to be accessed together.
     *
     * Once we access the Runtime Configuration, we then extract the autofill-specific settings via
     * `runtimeConfig.userPreferences.features.autofill.settings` and validate that separately.
     *
     * The 2-step validation occurs because RuntimeConfiguration will be coming from a shared library
     * and does not know about the shape of Autofill specific settings.
     *
     * @returns {Promise<AutofillFeatureToggles>}
     */
    async getFeatureToggles() {
      try {
        const runtimeConfig = await this._getRuntimeConfiguration();
        const autofillSettings = validate(runtimeConfig.userPreferences?.features?.autofill?.settings, autofillSettingsSchema);
        return autofillSettings.featureToggles;
      } catch (e) {
        if (this.globalConfig.isDDGTestMode) {
          console.log("isDDGTestMode: getFeatureToggles: \u274C", e);
        }
        return _Settings.defaults.featureToggles;
      }
    }
    /**
     * If the platform can derive its 'enabled' state from the RuntimeConfiguration,
     * then it should use this. Currently, only Windows supports this, but we plan to extend support
     * to all platforms in the future.
     * @returns {Promise<boolean|null>}
     */
    async getEnabled() {
      try {
        const runtimeConfig = await this._getRuntimeConfiguration();
        const enabled = autofillEnabled(runtimeConfig);
        return enabled;
      } catch (e) {
        if (this.globalConfig.isDDGTestMode) {
          console.log("isDDGTestMode: getEnabled: \u274C", e);
        }
        return null;
      }
    }
    /**
     * Retrieves the user's language from the current platform's `RuntimeConfiguration`. If the
     * platform doesn't include a two-character `.userPreferences.language` property in its runtime
     * configuration, or if an error occurs, 'en' is used as a fallback.
     *
     * NOTE: This function returns the two-character 'language' code of a typical POSIX locale
     * (e.g. 'en', 'de', 'fr') listed in ISO 639-1[1].
     *
     * [1] https://en.wikipedia.org/wiki/ISO_639-1
     *
     * @returns {Promise<string>} the device's current language code, or 'en' if something goes wrong
     */
    async getLanguage() {
      try {
        const conf = await this._getRuntimeConfiguration();
        const language = conf.userPreferences.language ?? "en";
        if (language.length !== 2) {
          console.warn(`config.userPreferences.language must be two characters, but received '${language}'`);
          return "en";
        }
        return language;
      } catch (e) {
        if (this.globalConfig.isDDGTestMode) {
          console.log("isDDGTestMode: getLanguage: \u274C", e);
        }
        return "en";
      }
    }
    /**
     * Get runtime configuration, but only once.
     *
     * Some platforms may be reading this directly from inlined variables, whilst others
     * may make a DeviceApiCall.
     *
     * Currently, it's only read once - but we should be open to the idea that we may need
     * this to be called multiple times in the future.
     *
     * @returns {Promise<RuntimeConfiguration>}
     * @throws
     * @private
     */
    async _getRuntimeConfiguration() {
      if (this._runtimeConfiguration) return this._runtimeConfiguration;
      const runtimeConfig = await this.deviceApi.request(new GetRuntimeConfigurationCall(null));
      this._runtimeConfiguration = runtimeConfig;
      return this._runtimeConfiguration;
    }
    /**
     * Available Input Types are boolean indicators to represent which input types the
     * current **user** has data available for.
     *
     * @returns {Promise<AvailableInputTypes>}
     */
    async getAvailableInputTypes() {
      try {
        if (this.globalConfig.isTopFrame) {
          return _Settings.defaults.availableInputTypes;
        }
        return await this.deviceApi.request(new GetAvailableInputTypesCall(null));
      } catch (e) {
        if (this.globalConfig.isDDGTestMode) {
          console.log("isDDGTestMode: getAvailableInputTypes: \u274C", e);
        }
        return _Settings.defaults.availableInputTypes;
      }
    }
    /**
     * @returns {SiteSpecificFeature|null}
     */
    get siteSpecificFeature() {
      return this._siteSpecificFeature;
    }
    /**
     * WORKAROUND: Currently C-S-S only suppports parsing top level features, so we need to manually allow
     * setting top level features in the content scope from nested features.
     * @param {RuntimeConfiguration} runtimeConfig
     * @param {string} name
     * @returns {RuntimeConfiguration}
     */
    setTopLevelFeatureInContentScopeIfNeeded(runtimeConfig, name) {
      const contentScope = (
        /** @type {import("@duckduckgo/privacy-configuration/schema/config").CurrentGenericConfig} */
        runtimeConfig.contentScope
      );
      const feature = contentScope.features?.autofill?.features?.[name];
      if (feature?.state !== "enabled" || contentScope.features[name]) return runtimeConfig;
      if (feature) {
        runtimeConfig.contentScope.features = {
          ...contentScope.features,
          [name]: {
            ...feature,
            exceptions: [],
            hash: ""
          }
        };
      }
      return runtimeConfig;
    }
    async getsiteSpecificFeature() {
      if (this._siteSpecificFeature) return this._siteSpecificFeature;
      try {
        const runtimeConfig = await this._getRuntimeConfiguration();
        this.setTopLevelFeatureInContentScopeIfNeeded(runtimeConfig, "siteSpecificFixes");
        const args = processConfig(runtimeConfig.contentScope, runtimeConfig.userUnprotectedDomains, runtimeConfig.userPreferences);
        return new SiteSpecificFeature(args);
      } catch (e) {
        if (this.globalConfig.isDDGTestMode) {
          console.log("isDDGTestMode: getsiteSpecificFeature: \u274C", e);
        }
        return _Settings.defaults.siteSpecificFeature;
      }
    }
    setsiteSpecificFeature(siteSpecificFeature) {
      if (this._siteSpecificFeature) return;
      this._siteSpecificFeature = siteSpecificFeature;
    }
    /**
     * To 'refresh' settings means to re-call APIs to determine new state. This may
     * only occur once per page, but it must be done before any page scanning/decorating
     * or translation can happen.
     *
     * @returns {Promise<{
     *      availableInputTypes: AvailableInputTypes,
     *      featureToggles: AutofillFeatureToggles,
     *      enabled: boolean | null
     * }>}
     */
    async refresh() {
      this.setEnabled(await this.getEnabled());
      this.setsiteSpecificFeature(await this.getsiteSpecificFeature());
      this.setFeatureToggles(await this.getFeatureToggles());
      this.setAvailableInputTypes(await this.getAvailableInputTypes());
      this.setLanguage(await this.getLanguage());
      if (typeof this.enabled === "boolean") {
        if (!this.enabled) {
          return _Settings.defaults;
        }
      }
      return {
        featureToggles: this.featureToggles,
        availableInputTypes: this.availableInputTypes,
        enabled: this.enabled
      };
    }
    /**
     * Checks if input type is one which we can't autofill
     * @param {{
     *   mainType: SupportedMainTypes
     *   subtype: import('./Form/matching.js').SupportedSubTypes | "unknown"
     *   variant?: import('./Form/matching.js').SupportedVariants | ""
     * }} types
     * @returns {boolean}
     */
    isTypeUnavailable({ mainType, subtype, variant }) {
      if (mainType === "unknown") return true;
      if (subtype === "password" && variant === "new") {
        return !this.featureToggles.password_generation;
      }
      if (!this.featureToggles[`inputType_${mainType}`] && subtype !== "emailAddress") {
        return true;
      }
      return false;
    }
    /**
     * Requests data from remote
     * @returns {Promise<>}
     */
    async populateData() {
      const availableInputTypesFromRemote = await this.getAvailableInputTypes();
      this.setAvailableInputTypes(availableInputTypesFromRemote);
    }
    /**
     * Requests data from remote if not available
     * @param {{
     *   mainType: SupportedMainTypes
     *   subtype: import('./Form/matching.js').SupportedSubTypes | "unknown"
     *   variant?: import('./Form/matching.js').SupportedVariants | ""
     * }} types
     * @returns {Promise<boolean>}
     */
    async populateDataIfNeeded({ mainType, subtype, variant }) {
      if (this.isTypeUnavailable({ mainType, subtype, variant })) return false;
      if (this.availableInputTypes?.[mainType] === void 0) {
        await this.populateData();
        return true;
      }
      return false;
    }
    /**
     * Checks if items will show in the autofill menu, including in-context signup.
     * Triggers side-effect if input types is not already available.
     * @param {{
     *   mainType: SupportedMainTypes
     *   subtype: import('./Form/matching.js').SupportedSubTypes | "unknown"
     *   variant: import('./Form/matching.js').SupportedVariants | ""
     * }} types
     * @param {import("./InContextSignup.js").InContextSignup?} inContextSignup
     * @returns {boolean}
     */
    canAutofillType({ mainType, subtype, variant }, inContextSignup) {
      if (this.isTypeUnavailable({ mainType, subtype, variant })) return false;
      const isEmailProtectionEnabled = this.featureToggles.emailProtection && this.availableInputTypes.email;
      if (subtype === "emailAddress" && isEmailProtectionEnabled) {
        return true;
      }
      if (inContextSignup?.isAvailable(subtype)) {
        return true;
      }
      if (subtype === "password" && variant === "new" && this.featureToggles.password_generation) {
        return true;
      }
      if (subtype === "fullName") {
        return Boolean(this.availableInputTypes.identities?.firstName || this.availableInputTypes.identities?.lastName);
      }
      if (subtype === "expiration") {
        return Boolean(this.availableInputTypes.creditCards?.expirationMonth || this.availableInputTypes.creditCards?.expirationYear);
      }
      return Boolean(this.availableInputTypes[mainType]?.[subtype]);
    }
    /** @returns {AutofillFeatureToggles} */
    get featureToggles() {
      if (this._featureToggles === null) throw new Error("feature toggles accessed before being set");
      return this._featureToggles;
    }
    /** @param {AutofillFeatureToggles} input */
    setFeatureToggles(input) {
      this._featureToggles = input;
    }
    /** @returns {AvailableInputTypes} */
    get availableInputTypes() {
      if (this._availableInputTypes === null) throw new Error("available input types accessed before being set");
      return this._availableInputTypes;
    }
    /** @param {AvailableInputTypes} value */
    setAvailableInputTypes(value) {
      this._availableInputTypes = { ...this._availableInputTypes, ...value };
    }
    /** @returns {string} the user's current two-character language code, as provided by the platform */
    get language() {
      return this._language;
    }
    /**
     * Sets the current two-character language code.
     * @param {string} language - the language
     */
    setLanguage(language) {
      this._language = language;
    }
    static default(globalConfig, deviceApi) {
      const settings = new _Settings(globalConfig, deviceApi);
      settings.setFeatureToggles(_Settings.defaults.featureToggles);
      settings.setAvailableInputTypes(_Settings.defaults.availableInputTypes);
      return settings;
    }
    /** @returns {boolean|null} */
    get enabled() {
      return this._enabled;
    }
    /**
     * @param {boolean|null} enabled
     */
    setEnabled(enabled) {
      this._enabled = enabled;
    }
  };
  __publicField(_Settings, "defaults", {
    /** @type {SiteSpecificFeature | null} */
    siteSpecificFeature: null,
    /** @type {AutofillFeatureToggles} */
    featureToggles: {
      autocomplete_attribute_support: false,
      credentials_saving: false,
      password_generation: false,
      emailProtection: false,
      emailProtection_incontext_signup: false,
      inputType_identities: false,
      inputType_credentials: false,
      inputType_creditCards: false,
      input_focus_api: false,
      inlineIcon_credentials: false,
      unknown_username_categorization: false,
      password_variant_categorization: false,
      partial_form_saves: false
    },
    /** @type {AvailableInputTypes} */
    availableInputTypes: {
      credentials: {
        username: false,
        password: false
      },
      identities: {
        firstName: false,
        middleName: false,
        lastName: false,
        birthdayDay: false,
        birthdayMonth: false,
        birthdayYear: false,
        addressStreet: false,
        addressStreet2: false,
        addressCity: false,
        addressProvince: false,
        addressPostalCode: false,
        addressCountryCode: false,
        phone: false,
        emailAddress: false
      },
      creditCards: {
        cardName: false,
        cardSecurityCode: false,
        expirationMonth: false,
        expirationYear: false,
        cardNumber: false
      },
      email: false
    },
    /** @type {boolean | null} */
    enabled: null
  });
  var Settings = _Settings;

  // src/deviceApiCalls/transports/extension.transport.js
  var ExtensionTransport = class extends DeviceApiTransport {
    /** @param {GlobalConfig} globalConfig */
    constructor(globalConfig) {
      super();
      this.config = globalConfig;
    }
    async send(deviceApiCall) {
      if (deviceApiCall instanceof GetRuntimeConfigurationCall) {
        return deviceApiCall.result(await extensionSpecificRuntimeConfiguration(this));
      }
      if (deviceApiCall instanceof GetAvailableInputTypesCall) {
        return deviceApiCall.result(await extensionSpecificGetAvailableInputTypes());
      }
      if (deviceApiCall instanceof SetIncontextSignupPermanentlyDismissedAtCall) {
        return deviceApiCall.result(await extensionSpecificSetIncontextSignupPermanentlyDismissedAtCall(deviceApiCall.params));
      }
      if (deviceApiCall instanceof GetIncontextSignupDismissedAtCall) {
        return deviceApiCall.result(await extensionSpecificGetIncontextSignupDismissedAt());
      }
      if (deviceApiCall instanceof SendJSPixelCall) {
        return deviceApiCall.result(await extensionSpecificSendPixel(deviceApiCall.params));
      }
      if (deviceApiCall instanceof AddDebugFlagCall) {
        return deviceApiCall.result(await extensionSpecificAddDebugFlag(deviceApiCall.params));
      }
      if (deviceApiCall instanceof CloseAutofillParentCall || deviceApiCall instanceof StartEmailProtectionSignupCall) {
        return;
      }
      console.error("Send not implemented for " + deviceApiCall.method);
    }
  };
  async function extensionSpecificRuntimeConfiguration(deviceApi) {
    const contentScope = await getContentScopeConfig();
    const emailProtectionEnabled = isAutofillEnabledFromProcessedConfig(contentScope);
    const incontextSignupEnabled = isIncontextSignupEnabledFromProcessedConfig(contentScope);
    return {
      success: {
        // @ts-ignore
        contentScope,
        // @ts-ignore
        userPreferences: {
          // Copy locale to user preferences as 'language' to match expected payload
          language: contentScope.locale,
          features: {
            autofill: {
              settings: {
                featureToggles: {
                  ...Settings.defaults.featureToggles,
                  emailProtection: emailProtectionEnabled,
                  emailProtection_incontext_signup: incontextSignupEnabled
                }
              }
            }
          }
        },
        // @ts-ignore
        userUnprotectedDomains: deviceApi.config?.userUnprotectedDomains || []
      }
    };
  }
  async function extensionSpecificGetAvailableInputTypes() {
    const contentScope = await getContentScopeConfig();
    const emailProtectionEnabled = isAutofillEnabledFromProcessedConfig(contentScope);
    return {
      success: {
        ...Settings.defaults.availableInputTypes,
        email: emailProtectionEnabled
      }
    };
  }
  async function getContentScopeConfig() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          registeredTempAutofillContentScript: true,
          documentUrl: window.location.href
        },
        (response) => {
          if (response && "site" in response) {
            resolve(response);
          }
        }
      );
    });
  }
  async function extensionSpecificSendPixel(params) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          messageType: "sendJSPixel",
          options: params
        },
        () => {
          resolve(true);
        }
      );
    });
  }
  async function extensionSpecificAddDebugFlag(params) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          messageType: "addDebugFlag",
          options: params
        },
        () => {
          resolve(true);
        }
      );
    });
  }
  async function extensionSpecificGetIncontextSignupDismissedAt() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          messageType: "getIncontextSignupDismissedAt"
        },
        (response) => {
          resolve(response);
        }
      );
    });
  }
  async function extensionSpecificSetIncontextSignupPermanentlyDismissedAtCall(params) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          messageType: "setIncontextSignupPermanentlyDismissedAt",
          options: params
        },
        () => {
          resolve(true);
        }
      );
    });
  }

  // src/deviceApiCalls/transports/windows.transport.js
  var WindowsTransport = class extends DeviceApiTransport {
    async send(deviceApiCall, options) {
      if (deviceApiCall.id) {
        return windowsTransport(deviceApiCall, options).withResponse(deviceApiCall.id);
      }
      return windowsTransport(deviceApiCall, options);
    }
  };
  function windowsTransport(deviceApiCall, options) {
    windowsInteropPostMessage({
      Feature: "Autofill",
      Name: deviceApiCall.method,
      Data: deviceApiCall.params
    });
    return {
      /**
       * Sends a message and returns a Promise that resolves with the response
       * @param responseId
       * @returns {Promise<*>}
       */
      withResponse(responseId) {
        return waitForWindowsResponse(responseId, options);
      }
    };
  }
  function waitForWindowsResponse(responseId, options) {
    return new Promise((resolve, reject) => {
      if (options?.signal?.aborted) {
        return reject(new DOMException("Aborted", "AbortError"));
      }
      let teardown;
      const handler = (event) => {
        if (!event.data) {
          console.warn("data absent from message");
          return;
        }
        if (event.data.type === responseId) {
          teardown();
          resolve(event.data);
        }
      };
      const abortHandler = () => {
        teardown();
        reject(new DOMException("Aborted", "AbortError"));
      };
      windowsInteropAddEventListener("message", handler);
      options?.signal?.addEventListener("abort", abortHandler);
      teardown = () => {
        windowsInteropRemoveEventListener("message", handler);
        options?.signal?.removeEventListener("abort", abortHandler);
      };
    });
  }

  // src/deviceApiCalls/transports/transports.js
  function createTransport(globalConfig) {
    if (typeof globalConfig.userPreferences?.platform?.name === "string") {
      switch (globalConfig.userPreferences?.platform?.name) {
        case "ios":
        case "macos":
          return new AppleTransport(globalConfig);
        case "android":
          return new AndroidTransport(globalConfig);
        default:
          throw new Error("selectSender unimplemented!");
      }
    }
    if (globalConfig.isWindows) {
      return new WindowsTransport();
    }
    if (globalConfig.isDDGApp) {
      if (globalConfig.isAndroid) {
        return new AndroidTransport(globalConfig);
      }
      throw new Error("unreachable, createTransport");
    }
    return new ExtensionTransport(globalConfig);
  }

  // src/DeviceInterface/initFormSubmissionsApi.js
  function initFormSubmissionsApi(forms, matching) {
    window.addEventListener(
      "submit",
      (e) => {
        return forms.get(e.target)?.submitHandler("global submit event");
      },
      true
    );
    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Enter") {
          const focusedForm = [...forms.values()].find((form) => form.hasFocus(e));
          focusedForm?.submitHandler("global keydown + Enter");
        }
      },
      true
    );
    window.addEventListener(
      "pointerdown",
      (event) => {
        const realTarget = pierceShadowTree(event);
        const formsArray = [...forms.values()];
        const matchingForm = formsArray.find((form) => {
          const btns = [...form.submitButtons];
          if (btns.includes(realTarget)) return true;
          if (btns.find((btn) => btn.contains(realTarget))) return true;
          return false;
        });
        matchingForm?.submitHandler("global pointerdown event + matching form");
        if (!matchingForm) {
          const selector = matching.cssSelector("submitButtonSelector") + ', a[href="#"], a[href^=javascript], *[onclick], [class*=button i]';
          const button = (
            /** @type HTMLElement */
            realTarget?.closest(selector)
          );
          if (!button) return;
          const buttonIsAFalsePositive = formsArray.some((form) => button?.contains(form.form));
          if (buttonIsAFalsePositive) return;
          const text = getTextShallow(button) || extractElementStrings(button).join(" ");
          const hasRelevantText = safeRegexTest(matching.getDDGMatcherRegex("submitButtonRegex"), text);
          if (hasRelevantText && text.length < 25) {
            const filledForm = formsArray.find((form) => form.hasValues());
            if (filledForm && buttonMatchesFormType(
              /** @type HTMLElement */
              button,
              filledForm
            )) {
              filledForm?.submitHandler("global pointerdown event + filled form");
            }
          }
          if (
            /** @type HTMLElement */
            realTarget?.closest("#passwordNext button, #identifierNext button")
          ) {
            const filledForm = formsArray.find((form) => form.hasValues());
            filledForm?.submitHandler("global pointerdown event + google escape hatch");
          }
        }
      },
      true
    );
    const observer = new PerformanceObserver((list) => {
      const formsArray = [...forms.values()];
      const entries = list.getEntries().filter(
        (entry) => (
          // @ts-ignore why does TS not know about `entry.initiatorType`?
          ["fetch", "xmlhttprequest"].includes(entry.initiatorType) && safeRegexTest(/login|sign-in|signin/, entry.name)
        )
      );
      if (!entries.length) return;
      const filledForm = formsArray.find((form) => form.hasValues());
      const focusedForm = formsArray.find((form) => form.hasFocus());
      if (focusedForm) return;
      filledForm?.submitHandler("performance observer");
    });
    observer.observe({ entryTypes: ["resource"] });
  }

  // src/DeviceInterface/initFocusApi.js
  function getAutocompleteValueFromInputType(inputType) {
    const subtype = getSubtypeFromType(inputType);
    const autocompleteMap = {
      // Identities
      emailAddress: "email",
      fullName: "name",
      firstName: "given-name",
      middleName: "additional-name",
      lastName: "family-name",
      phone: "tel",
      addressStreet: "street-address",
      addressStreet2: "address-line2",
      addressCity: "address-level2",
      addressProvince: "address-level1",
      addressPostalCode: "postal-code",
      addressCountryCode: "country"
    };
    return autocompleteMap[subtype];
  }
  function setAutocompleteOnIdentityField(element) {
    if (!(element instanceof HTMLInputElement) || element.hasAttribute("autocomplete")) {
      return;
    }
    const inputType = getInputType(element);
    const mainType = getMainTypeFromType(inputType);
    if (mainType !== "identities") {
      return;
    }
    const autocompleteValue = getAutocompleteValueFromInputType(inputType);
    if (autocompleteValue) {
      element.setAttribute("autocomplete", autocompleteValue);
      element.addEventListener(
        "blur",
        () => {
          element.removeAttribute("autocomplete");
        },
        { once: true }
      );
    }
  }
  function handleFocusEvent(forms, settings, attachKeyboardCallback, e) {
    const isAnyFormAutofilling = [...forms.values()].some((form2) => form2.isAutofilling);
    if (isAnyFormAutofilling) return;
    const targetElement = pierceShadowTree(e);
    if (!targetElement || targetElement instanceof Window) return;
    const form = [...forms.values()].find((form2) => form2.hasFocus());
    if (settings.featureToggles.input_focus_api) {
      attachKeyboardCallback({ form, element: targetElement });
    }
    if (settings.featureToggles.autocomplete_attribute_support) {
      setAutocompleteOnIdentityField(targetElement);
    }
  }
  function initFocusApi(forms, settings, attachKeyboardCallback) {
    const boundHandleFocusEvent = handleFocusEvent.bind(null, forms, settings, attachKeyboardCallback);
    window.addEventListener("focus", boundHandleFocusEvent, true);
    return {
      setAutocompleteOnIdentityField,
      handleFocusEvent: boundHandleFocusEvent,
      cleanup: () => {
        window.removeEventListener("focus", boundHandleFocusEvent, true);
      }
    };
  }

  // src/EmailProtection.js
  var _previous2;
  var EmailProtection = class {
    /** @param {import("./DeviceInterface/InterfacePrototype").default} device */
    constructor(device) {
      /** @type {string|null} */
      __privateAdd(this, _previous2, null);
      this.device = device;
    }
    /** @returns {string|null} */
    get lastGenerated() {
      return __privateGet(this, _previous2);
    }
    /**
     * Store the last received email address
     * @param {string} emailAddress
     */
    storeReceived(emailAddress) {
      __privateSet(this, _previous2, emailAddress);
      return emailAddress;
    }
  };
  _previous2 = new WeakMap();

  // src/locales/bg/autofill.json
  var autofill_default = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "\u0417\u0434\u0440\u0430\u0432\u0435\u0439, \u0441\u0432\u044F\u0442",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "\u0418\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u043D\u0435 \u043D\u0430 {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "\u0411\u043B\u043E\u043A\u0438\u0440\u0430\u043D\u0435 \u043D\u0430 \u0438\u043C\u0435\u0439\u043B \u0442\u0440\u0430\u043A\u0435\u0440\u0438",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "\u041F\u0430\u0440\u043E\u043B\u0430 \u0437\u0430 {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "\u0413\u0435\u043D\u0435\u0440\u0438\u0440\u0430\u043D\u0430 \u043F\u0430\u0440\u043E\u043B\u0430",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "\u041F\u0430\u0440\u043E\u043B\u0430\u0442\u0430 \u0437\u0430 \u0442\u043E\u0437\u0438 \u0443\u0435\u0431\u0441\u0430\u0439\u0442 \u0449\u0435 \u0431\u044A\u0434\u0435 \u0437\u0430\u043F\u0430\u0437\u0435\u043D\u0430",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u0442\u043E Bitwarden \u0435 \u0437\u0430\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u0442\u0435 \u0441\u0432\u043E\u044F \u0442\u0440\u0435\u0437\u043E\u0440, \u0437\u0430 \u0434\u0430 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u0434\u043E\u0441\u0442\u044A\u043F \u0434\u043E \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u043E\u043D\u043D\u0438 \u0434\u0430\u043D\u043D\u0438 \u0438\u043B\u0438 \u0434\u0430 \u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0430\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u0438",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "\u0413\u0435\u043D\u0435\u0440\u0438\u0440\u0430\u043D\u0435 \u043D\u0430 \u043B\u0438\u0447\u0435\u043D Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "\u0421\u043A\u0440\u0438\u0439\u0442\u0435 \u0438\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441\u0430 \u0441\u0438 \u0438 \u0431\u043B\u043E\u043A\u0438\u0440\u0430\u0439\u0442\u0435 \u0442\u0440\u0430\u043A\u0435\u0440\u0438\u0442\u0435",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "\u0421\u044A\u0437\u0434\u0430\u0439\u0442\u0435 \u0443\u043D\u0438\u043A\u0430\u043B\u0435\u043D, \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u043B\u0435\u043D \u0430\u0434\u0440\u0435\u0441, \u043A\u043E\u0439\u0442\u043E \u043F\u0440\u0435\u043C\u0430\u0445\u0432\u0430 \u0441\u043A\u0440\u0438\u0442\u0438\u0442\u0435 \u0442\u0440\u0430\u043A\u0435\u0440\u0438 \u0438 \u043F\u0440\u0435\u043F\u0440\u0430\u0449\u0430 \u0438\u043C\u0435\u0439\u043B\u0438\u0442\u0435 \u043A\u044A\u043C \u043F\u043E\u0449\u0435\u043D\u0441\u043A\u0430\u0442\u0430 \u0412\u0438 \u043A\u0443\u0442\u0438\u044F.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0430 \u0437\u0430\u043F\u0430\u0437\u0435\u043D\u0438\u0442\u0435 \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0438\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0430 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u0438\u0442\u0435 \u043A\u0430\u0440\u0442\u0438\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0430 \u0441\u0430\u043C\u043E\u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0438\u0442\u0435\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0430 \u043F\u0430\u0440\u043E\u043B\u0438\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "\u0413\u0435\u043D\u0435\u0440\u0438\u0440\u0430\u043D\u0435 \u043D\u0430 \u043F\u043E\u0432\u0435\u0440\u0438\u0442\u0435\u043B\u0435\u043D Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "\u0411\u043B\u043E\u043A\u0438\u0440\u0430\u043D\u0435 \u043D\u0430 \u0438\u043C\u0435\u0439\u043B \u0442\u0440\u0430\u043A\u0435\u0440\u0438\u0442\u0435 \u0438 \u0441\u043A\u0440\u0438\u0432\u0430\u043D\u0435 \u043D\u0430 \u0430\u0434\u0440\u0435\u0441\u0430",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043D\u0430 \u043C\u043E\u044F \u0438\u043C\u0435\u0439\u043B",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "\u041D\u0435 \u043F\u043E\u043A\u0430\u0437\u0432\u0430\u0439 \u043E\u0442\u043D\u043E\u0432\u043E",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u0430\u043D\u0435 \u043D\u0430 \u043F\u0430\u0440\u043E\u043B\u0430 \u0432 DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "\u041F\u0440\u0435\u0445\u0432\u044A\u0440\u043B\u044F\u0439\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u0438\u0442\u0435 \u0441\u0438 \u043E\u0442 \u0434\u0440\u0443\u0433 \u0431\u0440\u0430\u0443\u0437\u044A\u0440 \u0438\u043B\u0438 \u043C\u0435\u043D\u0438\u0434\u0436\u044A\u0440 \u043D\u0430 \u043F\u0430\u0440\u043E\u043B\u0438 \u0431\u044A\u0440\u0437\u043E \u0438 \u0441\u0438\u0433\u0443\u0440\u043D\u043E.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "\u0421\u0440\u043E\u043A \u043D\u0430 \u0432\u0430\u043B\u0438\u0434\u043D\u043E\u0441\u0442",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/cs/autofill.json
  var autofill_default2 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Ahoj, sv\u011Bte",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Pou\u017E\xEDt {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blokuj e-mailov\xE9 trackery",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Heslo pro {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Vygenerovan\xE9 heslo",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Heslo pro tenhle web se ulo\u017E\xED",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Aplikace Bitwarden je zam\u010Den\xE1",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Pro p\u0159\xEDstup k p\u0159ihla\u0161ovac\xEDm \xFAdaj\u016Fm a generov\xE1n\xED hesel je pot\u0159eba odemknout aplikaci Bitwarden",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Vygenerovat soukromou Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Skryj sv\u016Fj e-mail a blokuj trackery",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Vytvo\u0159 si jedine\u010Dnou, n\xE1hodnou adresu, kter\xE1 bude odstra\u0148ovat skryt\xE9 trackery a p\u0159epos\xEDlat e-maily do tv\xE9 schr\xE1nky.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Spravovat ulo\u017Een\xE9 polo\u017Eky\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Spravovat platebn\xED karty\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Spravovat identity\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Spravovat hesla\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Vygenerovat soukromou Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blokuj e-mailov\xE9 trackery a skryj svou adresu",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Chr\xE1nit m\u016Fj e-mail",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "U\u017E neukazovat",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Import hesla do DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Rychle a\xA0bezpe\u010Dn\u011B p\u0159enes svoje hesla z\xA0jin\xE9ho prohl\xED\u017Ee\u010De nebo spr\xE1vce hesel.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Datum konce platnosti",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/da/autofill.json
  var autofill_default3 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Hej verden",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Brug {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blokerer e-mailtrackere",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Adgangskode til {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Genereret adgangskode",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Adgangskoden bliver gemt for dette websted",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden er l\xE5st",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "L\xE5s din boks op for at f\xE5 adgang til legitimationsoplysninger eller generere adgangskoder",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Opret privat Duck-adresse",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Skjul din e-mail og bloker trackere",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Opret en unik, tilf\xE6ldig adresse, der ogs\xE5 fjerner skjulte trackere og videresender e-mails til din indbakke.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Administrer gemte elementer\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Administrer kreditkort\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Administrer identiteter\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Administrer adgangskoder\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Opret en privat Duck-adresse",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Bloker e-mailtrackere og skjul adresse",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Beskyt min e-mail",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Vis ikke igen",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Import\xE9r adgangskode til DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Overf\xF8r hurtigt og sikkert dine adgangskoder fra en anden browser eller adgangskodeadministrator.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Udl\xF8bsdato",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/de/autofill.json
  var autofill_default4 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Hallo Welt",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "{email} verwenden",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "E-Mail-Tracker blockieren",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Passwort f\xFCr {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Generiertes Passwort",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Passwort wird f\xFCr diese Website gespeichert",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden ist verschlossen",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Entsperre deinen Bitwarden-Datentresor, um auf deine Zugangsdaten zuzugreifen oder Passw\xF6rter zu generieren",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Private Duck-Adresse generieren",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "E-Mail-Adresse verbergen und Tracker blockieren",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Einmalige, zuf\xE4llige Adresse erstellen, die versteckte Tracker entfernt und E-Mails an deinen Posteingang weiterleitet.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Gespeicherte Elemente verwalten\xA0\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Kreditkarten verwalten\xA0\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Identit\xE4ten verwalten\xA0\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Passw\xF6rter verwalten\xA0\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Private Duck Address generieren",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "E-Mail-Tracker blockieren & Adresse verbergen",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Meine E-Mail-Adresse sch\xFCtzen",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Nicht erneut anzeigen",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Passwort in DuckDuckGo importieren",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "\xDCbertrage deine Passw\xF6rter schnell und sicher von einem anderen Browser oder Passwort-Manager.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "G\xFCltigkeit",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/el/autofill.json
  var autofill_default5 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "\u0393\u03B5\u03B9\u03B1 \u03C3\u03BF\u03C5 \u03BA\u03CC\u03C3\u03BC\u03B5",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "\u03A7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03B9\u03AE\u03C3\u03C4\u03B5 \u03C4\u03B7 \u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "\u0391\u03C0\u03BF\u03BA\u03BB\u03B5\u03B9\u03C3\u03BC\u03CC\u03C2 \u03B5\u03C6\u03B1\u03C1\u03BC\u03BF\u03B3\u03CE\u03BD \u03C0\u03B1\u03C1\u03B1\u03BA\u03BF\u03BB\u03BF\u03CD\u03B8\u03B7\u03C3\u03B7\u03C2 email",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "\u039A\u03C9\u03B4\u03B9\u03BA\u03CC\u03C2 \u03C0\u03C1\u03CC\u03C3\u03B2\u03B1\u03C3\u03B7\u03C2 \u03B3\u03B9\u03B1 {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "\u0394\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03AE\u03B8\u03B7\u03BA\u03B5 \u03BA\u03C9\u03B4\u03B9\u03BA\u03CC\u03C2 \u03C0\u03C1\u03CC\u03C3\u03B2\u03B1\u03C3\u03B7\u03C2",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "\u039F \u03BA\u03C9\u03B4\u03B9\u03BA\u03CC\u03C2 \u03C0\u03C1\u03CC\u03C3\u03B2\u03B1\u03C3\u03B7\u03C2 \u03B8\u03B1 \u03B1\u03C0\u03BF\u03B8\u03B7\u03BA\u03B5\u03C5\u03C4\u03B5\u03AF \u03B3\u03B9\u03B1 \u03C4\u03BF\u03BD \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF \u03B1\u03C5\u03C4\u03CC",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "\u03A4\u03BF Bitwarden \u03B5\u03AF\u03BD\u03B1\u03B9 \u03BA\u03BB\u03B5\u03B9\u03B4\u03C9\u03BC\u03AD\u03BD\u03BF",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "\u039E\u03B5\u03BA\u03BB\u03B5\u03B9\u03B4\u03CE\u03C3\u03C4\u03B5 \u03C4\u03BF \u03B8\u03B7\u03C3\u03B1\u03C5\u03C1\u03BF\u03C6\u03C5\u03BB\u03AC\u03BA\u03B9\u03CC \u03C3\u03B1\u03C2 \u03B3\u03B9\u03B1 \u03C0\u03C1\u03CC\u03C3\u03B2\u03B1\u03C3\u03B7 \u03C3\u03B5 \u03B4\u03B9\u03B1\u03C0\u03B9\u03C3\u03C4\u03B5\u03C5\u03C4\u03AE\u03C1\u03B9\u03B1 \u03AE \u03B4\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03BA\u03C9\u03B4\u03B9\u03BA\u03CE\u03BD \u03C0\u03C1\u03CC\u03C3\u03B2\u03B1\u03C3\u03B7\u03C2",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "\u0394\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03AE\u03C3\u03C4\u03B5 \u03B9\u03B4\u03B9\u03C9\u03C4\u03B9\u03BA\u03AE Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "\u0391\u03C0\u03CC\u03BA\u03C1\u03C5\u03C8\u03B7 \u03C4\u03BF\u03C5 email \u03C3\u03B1\u03C2 \u03BA\u03B1\u03B9 \u03B1\u03C0\u03BF\u03BA\u03BB\u03B5\u03B9\u03C3\u03BC\u03CC\u03C2 \u03B5\u03C6\u03B1\u03C1\u03BC\u03BF\u03B3\u03CE\u03BD \u03C0\u03B1\u03C1\u03B1\u03BA\u03BF\u03BB\u03BF\u03CD\u03B8\u03B7\u03C3\u03B7\u03C2",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "\u0394\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03AE\u03C3\u03C4\u03B5 \u03BC\u03B9\u03B1 \u03BC\u03BF\u03BD\u03B1\u03B4\u03B9\u03BA\u03AE, \u03C4\u03C5\u03C7\u03B1\u03AF\u03B1 \u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 \u03B7 \u03BF\u03C0\u03BF\u03AF\u03B1 \u03B1\u03C6\u03B1\u03B9\u03C1\u03B5\u03AF \u03B5\u03C0\u03AF\u03C3\u03B7\u03C2 \u03BA\u03C1\u03C5\u03C6\u03AD\u03C2 \u03B5\u03C6\u03B1\u03C1\u03BC\u03BF\u03B3\u03AD\u03C2 \u03C0\u03B1\u03C1\u03B1\u03BA\u03BF\u03BB\u03BF\u03CD\u03B8\u03B7\u03C3\u03B7\u03C2 \u03BA\u03B1\u03B9 \u03C0\u03C1\u03BF\u03C9\u03B8\u03B5\u03AF email \u03C3\u03C4\u03B1 \u03B5\u03B9\u03C3\u03B5\u03C1\u03C7\u03CC\u03BC\u03B5\u03BD\u03AC \u03C3\u03B1\u03C2.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "\u0394\u03B9\u03B1\u03C7\u03B5\u03AF\u03C1\u03B9\u03C3\u03B7 \u03B1\u03C0\u03BF\u03B8\u03B7\u03BA\u03B5\u03C5\u03BC\u03AD\u03BD\u03C9\u03BD \u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03C9\u03BD\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "\u0394\u03B9\u03B1\u03C7\u03B5\u03AF\u03C1\u03B9\u03C3\u03B7 \u03C0\u03B9\u03C3\u03C4\u03C9\u03C4\u03B9\u03BA\u03CE\u03BD \u03BA\u03B1\u03C1\u03C4\u03CE\u03BD\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "\u0394\u03B9\u03B1\u03C7\u03B5\u03AF\u03C1\u03B9\u03C3\u03B7 \u03C4\u03B1\u03C5\u03C4\u03BF\u03C4\u03AE\u03C4\u03C9\u03BD\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "\u0394\u03B9\u03B1\u03C7\u03B5\u03AF\u03C1\u03B9\u03C3\u03B7 \u03BA\u03C9\u03B4\u03B9\u03BA\u03CE\u03BD \u03C0\u03C1\u03CC\u03C3\u03B2\u03B1\u03C3\u03B7\u03C2\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "\u0394\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03AE\u03C3\u03C4\u03B5 \u03BC\u03B9\u03B1 \u03B9\u03B4\u03B9\u03C9\u03C4\u03B9\u03BA\u03AE Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "\u0391\u03C0\u03BF\u03BA\u03BB\u03B5\u03B9\u03C3\u03BC\u03CC\u03C2 \u03B5\u03C6\u03B1\u03C1\u03BC\u03BF\u03B3\u03CE\u03BD \u03C0\u03B1\u03C1\u03B1\u03BA\u03BF\u03BB\u03BF\u03CD\u03B8\u03B7\u03C3\u03B7\u03C2 email \u03BA\u03B1\u03B9 \u03B1\u03C0\u03CC\u03BA\u03C1\u03C5\u03C8\u03B7 \u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7\u03C2",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "\u03A0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1 \u03C4\u03BF\u03C5 email \u03BC\u03BF\u03C5",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "\u039D\u03B1 \u03BC\u03B7\u03BD \u03B5\u03BC\u03C6\u03B1\u03BD\u03B9\u03C3\u03C4\u03B5\u03AF \u03BE\u03B1\u03BD\u03AC",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "\u0395\u03B9\u03C3\u03B1\u03B3\u03C9\u03B3\u03AE \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03CD \u03C0\u03C1\u03CC\u03C3\u03B2\u03B1\u03C3\u03B7\u03C2 \u03C3\u03C4\u03BF DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "\u039C\u03B5\u03C4\u03B1\u03C6\u03AD\u03C1\u03B5\u03C4\u03B5 \u03B3\u03C1\u03AE\u03B3\u03BF\u03C1\u03B1 \u03BA\u03B1\u03B9 \u03BC\u03B5 \u03B1\u03C3\u03C6\u03AC\u03BB\u03B5\u03B9\u03B1 \u03C4\u03BF\u03C5\u03C2 \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03CD\u03C2 \u03C0\u03C1\u03CC\u03C3\u03B2\u03B1\u03C3\u03AE\u03C2 \u03C3\u03B1\u03C2 \u03B1\u03C0\u03CC \u03AC\u03BB\u03BB\u03BF \u03C0\u03C1\u03CC\u03B3\u03C1\u03B1\u03BC\u03BC\u03B1 \u03C0\u03B5\u03C1\u03B9\u03AE\u03B3\u03B7\u03C3\u03B7\u03C2 \u03AE \u03C0\u03C1\u03CC\u03B3\u03C1\u03B1\u03BC\u03BC\u03B1 \u03B4\u03B9\u03B1\u03C7\u03B5\u03AF\u03C1\u03B9\u03C3\u03B7\u03C2 \u03BA\u03C9\u03B4\u03B9\u03BA\u03CE\u03BD \u03C0\u03C1\u03CC\u03C3\u03B2\u03B1\u03C3\u03B7\u03C2.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "\u039B\u03AE\u03BE\u03B7",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/en/autofill.json
  var autofill_default6 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Hello world",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Use {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Block email trackers",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Password for {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Generated password",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Password will be saved for this website",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden is locked",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Unlock your vault to access credentials or generate passwords",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Generate Private Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Hide your email and block trackers",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Create a unique, random address that also removes hidden trackers and forwards email to your inbox.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Manage Saved Items\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePasswords". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Manage Credit Cards\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Manage Identities\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combination of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Manage Passwords\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Generate a Private Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Block email trackers & hide address",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Protect My Email",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Don't Show Again",
      note: "Button that prevents the DuckDuckGo email protection signup prompt and credentials import prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Import passwords to DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Quickly and securely transfer your passwords from another browser or password manager.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Expiry",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/es/autofill.json
  var autofill_default7 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Hola mundo",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Usar {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Bloquea de rastreadores de correo electr\xF3nico",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Contrase\xF1a para {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Contrase\xF1a generada",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Se guardar\xE1 la contrase\xF1a de este sitio web",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden est\xE1 bloqueado",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Desbloquea tu caja fuerte para acceder a las credenciales o generar contrase\xF1as",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Generar Duck Address privada",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Ocultar tu correo electr\xF3nico y bloquear rastreadores",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Crea una direcci\xF3n aleatoria \xFAnica que tambi\xE9n elimine los rastreadores ocultos y reenv\xEDe el correo electr\xF3nico a tu bandeja de entrada.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Gestionar elementos guardados\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Administrar tarjetas de cr\xE9dito\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Administrar identidades\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Administrar contrase\xF1as\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Generar Duck Address privada",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Bloquea rastreadores de correo electr\xF3nico y oculta la direcci\xF3n",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Proteger mi correo electr\xF3nico",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "No volver a mostrar",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Importar contrase\xF1as a DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Transfiere tus contrase\xF1as de forma r\xE1pida y segura desde otro navegador o administrador de contrase\xF1as.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Fecha de caducidad",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/et/autofill.json
  var autofill_default8 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Tere maailm",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Kasutage {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blokeeri e-posti j\xE4lgijad",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Saidi {url} parool",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Loodud parool",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Parool salvestatakse selle veebilehe jaoks",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden on lukustatud",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Ava mandaatidele juurdep\xE4\xE4suks v\xF5i paroolide loomiseks oma varamu",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Loo privaatne Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Peida oma e-post ja blokeeri j\xE4lgijad",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Loo unikaalne, juhuslik aadress, mis eemaldab ka varjatud j\xE4glijad ja edastab e-kirjad sinu postkasti.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Halda salvestatud \xFCksuseid\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Halda krediitkaarte\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Halda identiteete\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Halda paroole\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Loo privaatne Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blokeeri e-posti j\xE4lgijad ja peida aadress",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Kaitse minu e-posti aadressi",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "\xC4ra enam n\xE4ita",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Impordi parool DuckDuckGosse",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Vii oma paroolid kiiresti ja turvaliselt \xFCle teisest brauserist v\xF5i paroolihaldurist.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Aegumiskuup\xE4ev",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/fi/autofill.json
  var autofill_default9 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Hei, maailma",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "K\xE4yt\xE4 {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Est\xE4 s\xE4hk\xF6postin seurantaohjelmat",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Sivuston {url} salasana",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Luotu salasana",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Salasana tallennetaan t\xE4lle verkkosivustolle",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden on lukittu",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Avaa holvin lukitus p\xE4\xE4st\xE4ksesi k\xE4siksi tunnistetietoihin tai luodaksesi salasanoja",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Luo yksityinen Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Piilota s\xE4hk\xF6postisi ja Est\xE4 seurantaohjelmat",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Luo yksil\xF6llinen, satunnainen osoite, joka lis\xE4ksi poistaa piilotetut seurantaohjelmat ja v\xE4litt\xE4\xE4 s\xE4hk\xF6postin omaan postilaatikkoosi.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Hallitse tallennettuja kohteita\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Hallitse luottokortteja\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Hallitse k\xE4ytt\xE4j\xE4tietoja\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Hallitse salasanoja\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Luo yksityinen Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Est\xE4 s\xE4hk\xF6postin seurantaohjelmat ja piilota osoite",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Suojaa s\xE4hk\xF6postini",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "\xC4l\xE4 n\xE4yt\xE4 en\xE4\xE4",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Tuo salasana DuckDuckGoon",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Siirr\xE4 salasanasi nopeasti ja turvallisesti toisesta selaimesta tai salasanojen hallintaohjelmasta.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Vanhenemisp\xE4iv\xE4",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/fr/autofill.json
  var autofill_default10 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Bonjour \xE0 tous",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Utiliser {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Bloquer les traqueurs d'e-mails",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Mot de passe pour {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Mot de passe g\xE9n\xE9r\xE9",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Le mot de passe sera enregistr\xE9 pour ce site",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden est verrouill\xE9",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "D\xE9verrouillez votre coffre-fort pour acc\xE9der \xE0 vos informations d'identification ou g\xE9n\xE9rer des mots de passe",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "G\xE9n\xE9rer une Duck Address priv\xE9e",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Masquez votre adresse e-mail et bloquez les traqueurs",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Cr\xE9ez une adresse unique et al\xE9atoire qui supprime les traqueurs masqu\xE9s et transf\xE8re les e-mails vers votre bo\xEEte de r\xE9ception.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "G\xE9rez les \xE9l\xE9ments enregistr\xE9s\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "G\xE9rez les cartes bancaires\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "G\xE9rez les identit\xE9s\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "G\xE9rer les mots de passe\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "G\xE9n\xE9rer une Duck Address priv\xE9e",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Bloquer les traqueurs d'e-mails et masquer l'adresse",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Prot\xE9ger mon adresse e-mail",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Ne plus afficher",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Importer des mots de passe sur DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Transf\xE9rez vos mots de passe rapidement et en toute s\xE9curit\xE9 \xE0 partir d\u2019un autre navigateur ou d\u2019un autre gestionnaire de mots de passe.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Expiration",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/hr/autofill.json
  var autofill_default11 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Pozdrav svijete",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Upotrijebite {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blokiranje alata za pra\u0107enje e-po\u0161te",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Lozinka za {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Generirana lozinka",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Lozinka \u0107e biti spremljena za ovo web-mjesto",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden je zaklju\u010Dan",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Otklju\u010Daj svoj trezor za pristup vjerodajnicama ili generiranje lozinki",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Generiraj privatnu adresu Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Sakrij svoju e-po\u0161tu i blokiraj traga\u010De",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: 'Izradi jedinstvenu, nasumi\u010Dnu adresu koja tako\u0111er uklanja skrivene alate za pra\u0107enje ("traga\u010De") i proslje\u0111uje e-po\u0161tu u tvoj sandu\u010Di\u0107 za pristiglu po\u0161tu.',
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Upravljanje spremljenim stavkama\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Upravljanje kreditnim karticama\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Upravljanje identitetima\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Upravljanje lozinkama\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Generiraj privatnu adresu Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blokiraj pra\u0107enje e-po\u0161te i sakrij adresu",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Za\u0161titi moju e-po\u0161tu",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Nemoj ponovno prikazivati",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Uvezi lozinku u DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Brzo i sigurno prenesi svoje lozinke iz drugog preglednika ili upravitelja lozinkama.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Istje\u010De",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/hu/autofill.json
  var autofill_default12 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Hell\xF3, vil\xE1g!",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "{email} haszn\xE1lata",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "E-mail nyomk\xF6vet\u0151k blokkol\xE1sa",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "{url} jelszava",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Gener\xE1lt jelsz\xF3",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "A webhelyhez tartoz\xF3 jelsz\xF3 mentve lesz",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "A Bitwarden z\xE1rolva van",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "A hiteles\xEDt\u0151 adatok el\xE9r\xE9s\xE9hez vagy a jelszavak gener\xE1l\xE1s\xE1hoz oldd fel a t\xE1rol\xF3t",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Priv\xE1t Duck Address l\xE9trehoz\xE1sa",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "E-mail elrejt\xE9se \xE9s nyomk\xF6vet\u0151k blokkol\xE1sa",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Hozz l\xE9tre egy egyedi, v\xE9letlenszer\u0171 c\xEDmet, amely elt\xE1vol\xEDtja a rejtett nyomk\xF6vet\u0151ket is, \xE9s a postafi\xF3kodba tov\xE1bb\xEDtja az e-maileket.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Mentett elemek kezel\xE9se\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Hitelk\xE1rty\xE1k kezel\xE9se\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Identit\xE1sok kezel\xE9se\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Jelszavak kezel\xE9se\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Priv\xE1t Duck Address l\xE9trehoz\xE1sa",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "E-mail nyomk\xF6vet\u0151k blokkol\xE1sa, \xE9s a c\xEDm elrejt\xE9se",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "E-mail v\xE9delme",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Ne jelenjen meg \xFAjra",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Jelsz\xF3 import\xE1l\xE1sa a DuckDuckG\xF3ba",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Gyorsan \xE9s biztons\xE1gosan \xE1thozhatod a jelszavaid egy m\xE1sik b\xF6ng\xE9sz\u0151b\u0151l vagy jelsz\xF3kezel\u0151b\u0151l.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Lej\xE1rat",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/it/autofill.json
  var autofill_default13 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Ciao mondo",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Usa {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blocca i sistemi di tracciamento e-mail",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Password per {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Password generata",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "La password verr\xE0 salvata per questo sito web",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden \xE8 bloccato",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Sblocca la tua cassaforte per accedere alle credenziali o generare password",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Genera Duck Address privato",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Nascondi il tuo indirizzo e-mail e blocca i sistemi di tracciamento",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Crea un indirizzo univoco e casuale che rimuove anche i sistemi di tracciamento nascosti e inoltra le e-mail alla tua casella di posta.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Gestisci gli elementi salvati\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Gestisci carte di credito\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Gestisci identit\xE0\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Gestisci password\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Genera un Duck Address privato",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blocca i sistemi di tracciamento e-mail e nascondi il tuo indirizzo",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Proteggi la mia e-mail",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Non mostrare pi\xF9",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Importa le tue password in DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Trasferisci in modo rapido e sicuro le tue password da un altro browser o gestore di password.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Scadenza",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/lt/autofill.json
  var autofill_default14 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Labas pasauli",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Naudoti {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blokuoti el. pa\u0161to sekimo priemones",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "\u201E{url}\u201C slapta\u017Eodis",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Sugeneruotas slapta\u017Eodis",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Slapta\u017Eodis bus i\u0161saugotas \u0161iai svetainei",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "\u201EBitwarden\u201C u\u017Erakinta",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Atrakinkite saugykl\u0105, kad pasiektum\u0117te prisijungimo duomenis arba sugeneruotum\u0117te slapta\u017Eod\u017Eius",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Generuoti privat\u0173 \u201EDuck Address\u201C",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Pasl\u0117pkite savo el. pa\u0161t\u0105 ir blokuokite steb\u0117jimo priemones",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Sukurkite unikal\u0173 atsitiktin\u012F adres\u0105, kuriuo taip pat pa\u0161alinamos slaptos sekimo priemon\u0117s ir el. lai\u0161kai persiun\u010Diami \u012F pa\u0161to d\u0117\u017Eut\u0119.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Tvarkykite i\u0161saugotus elementus\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Tvarkykite kredito korteles\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Tvarkykite tapatybes\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Slapta\u017Eod\u017Ei\u0173 valdymas\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Generuoti privat\u0173 \u201EDuck Address\u201C",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blokuoti el. pa\u0161to steb\u0117jimo priemones ir sl\u0117pti adres\u0105",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Apsaugoti mano el. pa\u0161t\u0105",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Daugiau nerodyti",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Importuoti slapta\u017Eod\u012F \u012F \u201EDuckDuckGo\u201C",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Greitai ir saugiai perkelkite slapta\u017Eod\u017Eius i\u0161 kitos nar\u0161ykl\u0117s ar slapta\u017Eod\u017Ei\u0173 tvarkykl\u0117s.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Galiojimo data",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/lv/autofill.json
  var autofill_default15 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Sveika, pasaule",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Izmantot {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blo\u0137\u0113 e-pasta izsekot\u0101jus",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "{url} parole",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "\u0122ener\u0113ta parole",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Parole tiks saglab\u0101ta \u0161ai vietnei",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden ir blo\u0137\u0113ts",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Atblo\u0137\u0113 glab\u0101tavu, lai piek\u013C\u016Btu pieteik\u0161an\u0101s datiem vai \u0123ener\u0113tu paroles",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "\u0122ener\u0113t priv\u0101tu Duck adresi",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Pasl\u0113p savu e-pastu un blo\u0137\u0113 izsekot\u0101jus",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Izveido unik\u0101lu, nejau\u0161i izv\u0113l\u0113tu adresi, kas ar\u012B aizv\u0101c sl\u0113ptos izsekot\u0101jus un p\u0101rs\u016Bta e-pastus uz tavu pastkast\u012Bti.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "P\u0101rvald\u012Bt saglab\u0101tos vienumus\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "P\u0101rvald\u012Bt kred\u012Btkartes\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "P\u0101rvald\u012Bt identit\u0101tes",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "P\u0101rvald\u012Bt paroles\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "\u0122ener\u0113t priv\u0101tu Duck adresi",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blo\u0137\u0113 e-pasta izsekot\u0101jus un pasl\u0113p adresi",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Aizsarg\u0101t manu e-pastu",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Turpm\u0101k ner\u0101d\u012Bt",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Import\u0113t paroli DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "\u0100tri un dro\u0161i p\u0101rnes savas paroles no citas p\u0101rl\u016Bkprogrammas vai paro\u013Cu p\u0101rvaldnieka.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Der\u012Bguma termi\u0146\u0161",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/nb/autofill.json
  var autofill_default16 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Hallo verden",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Bruk {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blokker e-postsporere",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Passord for {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Generert passord",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Passordet blir lagret for dette nettstedet",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden er l\xE5st",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "L\xE5s opp hvelvet ditt for \xE5 f\xE5 tilgang til legitimasjon eller generere passord",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Generer privat Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Skjul e-postadressen din og blokker sporere",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Opprett en unik, tilfeldig adresse som ogs\xE5 fjerner skjulte sporere og videresender e-post til innboksen din.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Administrer lagrede elementer\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Administrer kredittkort\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Administrer identiteter\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Administrer passord\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Generer en privat Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blokker e-postsporere og skjul adresse",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Beskytt e-postadressen min",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Ikke vis igjen",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Importer passord til DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Overf\xF8r passordene dine raskt og sikkert fra en annen nettleser eller passordbehandling.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Utl\xF8psdato",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/nl/autofill.json
  var autofill_default17 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Hallo wereld",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "{email} gebruiken",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "E-mailtrackers blokkeren",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Wachtwoord voor {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Gegenereerd wachtwoord",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Wachtwoord wordt opgeslagen voor deze website",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden is vergrendeld",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Ontgrendelt je kluis om toegang te krijgen tot inloggegevens of om wachtwoorden te genereren",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Priv\xE9-Duck Address genereren",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Je e-mailadres verbergen en trackers blokkeren",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Maak een uniek, willekeurig adres dat ook verborgen trackers verwijdert en e-mails doorstuurt naar je inbox.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Opgeslagen items beheren\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Creditcards beheren\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Identiteiten beheren\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Wachtwoorden beheren\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Priv\xE9-Duck Address genereren",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "E-mailtrackers blokkeren en adres verbergen",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Mijn e-mailadres beschermen",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Niet meer weergeven",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Wachtwoorden importeren naar DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Snel en veilig je wachtwoorden overzetten vanuit een andere browser of wachtwoordmanager.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Vervaldatum",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/pl/autofill.json
  var autofill_default18 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Witajcie",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "U\u017Cyj {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blokuj mechanizmy \u015Bledz\u0105ce poczt\u0119 e-mail",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Has\u0142o do witryny {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Wygenerowane has\u0142o",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Has\u0142o zostanie zapisane na potrzeby tej witryny",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Aplikacja Bitwarden jest zablokowana",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Odblokuj sejf, aby uzyska\u0107 dost\u0119p do po\u015Bwiadcze\u0144 lub generowa\u0107 has\u0142a",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Wygeneruj prywatny adres Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Ukryj sw\xF3j adres e-mail i blokuj skrypty \u015Bledz\u0105ce",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Utw\xF3rz unikalny, losowy adres, kt\xF3ry usuwa ukryte mechanizmy \u015Bledz\u0105ce i przekazuje wiadomo\u015Bci e-mail do Twojej skrzynki odbiorczej.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Zarz\u0105dzaj zapisanymi elementami\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Zarz\u0105dzaj kartami kredytowymi\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Zarz\u0105dzaj to\u017Csamo\u015Bciami\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Zarz\u0105dzaj has\u0142ami\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Wygeneruj prywatny adres Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Zablokuj mechanizmy \u015Bledz\u0105ce poczt\u0119 e-mail i ukryj adres",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Chro\u0144 moj\u0105 poczt\u0119 e-mail",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Nie pokazuj wi\u0119cej",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Importuj has\u0142a do DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Szybko i bezpiecznie przenie\u015B has\u0142a z innej przegl\u0105darki lub mened\u017Cera hase\u0142.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Wa\u017Cno\u015B\u0107",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/pt/autofill.json
  var autofill_default19 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Ol\xE1, mundo",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Usar {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Bloquear rastreadores de e-mail",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Palavra-passe de {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Palavra-passe gerada",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "A palavra-passe deste site ser\xE1 guardada",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "O Bitwarden est\xE1 bloqueado",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Desbloqueia o teu cofre para aceder a credenciais ou gerar palavras-passe",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Gerar um Duck Address privado",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Ocultar o teu e-mail e bloquear rastreadores",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Criar um endere\xE7o aleat\xF3rio exclusivo que tamb\xE9m remove rastreadores escondidos e encaminha o e-mail para a tua caixa de entrada.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Gerir itens guardados\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Gerir cart\xF5es de cr\xE9dito\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Gerir identidades\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Gerir palavras-passe\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Gerar um Duck Address Privado",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Bloquear rastreadores de e-mail e ocultar endere\xE7o",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Proteger o meu e-mail",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "N\xE3o mostrar novamente",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Importar palavras-passe para o DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Transfere de forma r\xE1pida e segura as tuas palavras-passe a partir de outro navegador ou gestor de palavras-passe.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Validade",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/ro/autofill.json
  var autofill_default20 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Salut!",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Utilizeaz\u0103 {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blocheaz\u0103 tehnologiile de urm\u0103rire din e-mail",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Parola pentru {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Parola generat\u0103",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Parola va fi salvat\u0103 pentru acest site",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden este blocat",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Deblocheaz\u0103 seiful pentru a accesa datele de conectare sau pentru a genera parole",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Genereaz\u0103 o Duck Address privat\u0103",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Ascunde-\u021Bi e-mailul \u0219i blocheaz\u0103 tehnologiile de urm\u0103rire",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Creeaz\u0103 o adres\u0103 unic\u0103, aleatorie, care elimin\u0103 \u0219i tehnologiile de urm\u0103rire ascunse \u0219i redirec\u021Bioneaz\u0103 e-mailurile c\u0103tre c\u0103su\u021Ba ta de inbox.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Gestioneaz\u0103 elementele salvate\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Gestioneaz\u0103 cardurile de credit\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Gestioneaz\u0103 identit\u0103\u021Bile\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Gestioneaz\u0103 parolele\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Genereaz\u0103 o Duck Address privat\u0103",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blocheaz\u0103 tehnologiile de urm\u0103rire din e-mailuri \u0219i ascunde adresa",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Protejeaz\u0103-mi adresa de e-mail",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Nu mai afi\u0219a",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Import\u0103 parola \xEEn DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Transfer\u0103 rapid \u0219i sigur parolele dintr-un alt browser sau manager de parole.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Expir\u0103",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/ru/autofill.json
  var autofill_default21 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "\u041F\u0440\u0438\u0432\u0435\u0442, \u043C\u0438\u0440!",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "\u0411\u043B\u043E\u043A\u0438\u0440\u0443\u0435\u0442 \u043F\u043E\u0447\u0442\u043E\u0432\u044B\u0435 \u0442\u0440\u0435\u043A\u0435\u0440\u044B",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043B\u044F {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "\u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "\u041F\u0430\u0440\u043E\u043B\u044C \u0431\u0443\u0434\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0441\u0430\u0439\u0442\u0430",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 Bitwarden \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u0443\u0439\u0442\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C\u0441\u044F \u0443\u0447\u0435\u0442\u043D\u044B\u043C\u0438 \u0434\u0430\u043D\u043D\u044B\u043C\u0438 \u0438 \u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u0438.",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "\u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "\u0421\u043A\u0440\u044B\u0442\u0438\u0435 \u0430\u0434\u0440\u0435\u0441\u0430 \u043F\u043E\u0447\u0442\u044B \u0438 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0430 \u0442\u0440\u0435\u043A\u0435\u0440\u043E\u0432",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0443\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439 \u0430\u0434\u0440\u0435\u0441, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0442\u0430\u043A\u0436\u0435 \u0443\u0434\u0430\u043B\u0438\u0442 \u0441\u043A\u0440\u044B\u0442\u044B\u0435 \u0442\u0440\u0435\u043A\u0435\u0440\u044B \u0438 \u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u0438\u0442 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0443\u044E \u043F\u043E\u0447\u0442\u0443 \u043D\u0430 \u0432\u0430\u0448 \u044F\u0449\u0438\u043A.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u043F\u043B\u0430\u0442\u0435\u0436\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u044B\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0443\u0447\u0435\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F\u043C\u0438\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "\u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "\u0421\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0432\u0430\u0448 \u0430\u0434\u0440\u0435\u0441 \u0438 \u0411\u043B\u043E\u043A\u0438\u0440\u0443\u0435\u0442 \u043F\u043E\u0447\u0442\u043E\u0432\u044B\u0435 \u0442\u0440\u0435\u043A\u0435\u0440\u044B",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "\u0417\u0430\u0449\u0438\u0442\u0438\u0442\u044C \u043F\u043E\u0447\u0442\u0443",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "\u0411\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0439\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u0438 \u0432 DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "\u0411\u044B\u0441\u0442\u0440\u044B\u0439 \u0438 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u044B\u0439 \u0441\u043F\u043E\u0441\u043E\u0431 \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0442\u0438 \u043F\u0430\u0440\u043E\u043B\u0438 \u0438\u0437 \u0434\u0440\u0443\u0433\u043E\u0433\u043E \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0438\u043B\u0438 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "\u0421\u0440\u043E\u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/sk/autofill.json
  var autofill_default22 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Ahoj, svet!",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Pou\u017Ei\u0165 {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blokuje e-mailov\xE9 sledova\u010De",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Heslo pre {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Vygenerovan\xE9 heslo",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Heslo pre t\xFAto webov\xFA str\xE1nku bude ulo\u017Een\xE9",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden je uzamknut\xFD",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Odomknite trezor pre pr\xEDstup k prihlasovac\xEDm \xFAdajom alebo generovaniu hesiel",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Generova\u0165 s\xFAkromn\xFA Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Skryte svoj e-mail a blokujte sledova\u010De",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Vytvorte si n\xE1hodn\xFA jedine\u010Dn\xFA adresu, ktor\xE1 odstr\xE1ni aj skryt\xE9 sledovacie prvky a prepo\u0161le e-maily do va\u0161ej schr\xE1nky.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Spravova\u0165 ulo\u017Een\xE9 polo\u017Eky\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Spravova\u0165 kreditn\xE9 karty\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Spravova\u0165 identity\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Spravova\u0165 hesl\xE1\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Generova\u0165 s\xFAkromn\xFA Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blokujte sledova\u010De e-mailov a skryte adresu",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Ochrana m\xF4jho e-mailu",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Nabud\xFAce u\u017E neukazova\u0165",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Importova\u0165 heslo do slu\u017Eby DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "R\xFDchlo a\xA0bezpe\u010Dne preneste svoje hesl\xE1 z\xA0in\xE9ho prehliada\u010Da alebo spr\xE1vcu hesiel.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Vypr\u0161anie platnosti",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/sl/autofill.json
  var autofill_default23 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Pozdravljen, svet",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Uporabite {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blokirajte sledilnike e-po\u0161te",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "Geslo za spletno mesto {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Ustvarjeno geslo",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Geslo bo shranjeno za to spletno mesto",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden je zaklenjen",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Odklenite trezor za dostop do poverilnic ali ustvarjanje gesel",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Ustvarjanje zasebnega naslova Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "Skrijte svojo e-po\u0161to in blokirajte sledilnike",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Ustvarite edinstven, naklju\u010Den naslov, ki odstrani tudi skrite sledilnike in posreduje e-po\u0161to v va\u0161 e-po\u0161tni predal.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Upravljaj shranjene elemente\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Upravljaj kreditne kartice\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Upravljaj identitete\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Upravljanje gesel\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Ustvari zasebni naslov Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blokirajte sledilnike e-po\u0161te in skrijte naslov",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Za\u0161\u010Diti mojo e-po\u0161to",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Ne prika\u017Ei ve\u010D",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Uvoz gesla v DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "Hitro in varno prenesite gesla iz drugega brskalnika ali upravitelja gesel.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Datum poteka",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/sv/autofill.json
  var autofill_default24 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Hej v\xE4rlden",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "Anv\xE4nd {email}",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "Blockera e-postsp\xE5rare",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "L\xF6senord f\xF6r {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Genererat l\xF6senord",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "L\xF6senordet sparas f\xF6r den h\xE4r webbplatsen",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden \xE4r l\xE5st",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "L\xE5s upp ditt valv f\xF6r att komma \xE5t inloggningsuppgifter eller generera l\xF6senord",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Generera privat Duck Address",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "D\xF6lj din e-postadress och blockera sp\xE5rare",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Skapa en unik, slumpm\xE4ssig adress som ocks\xE5 tar bort dolda sp\xE5rare och vidarebefordrar e-post till din inkorg.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Hantera sparade objekt\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Hantera kreditkort\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Hantera identiteter\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "Hantera l\xF6senord\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "Generera en privat Duck Address",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blockera e-postsp\xE5rare och d\xF6lj din adress",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Skydda min e-postadress",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Visa inte igen",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "Importera l\xF6senord till DuckDuckGo",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "\xD6verf\xF6r snabbt och s\xE4kert dina l\xF6senord fr\xE5n en annan webbl\xE4sare eller l\xF6senordshanterare.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Utg\xE5ngsdatum",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/tr/autofill.json
  var autofill_default25 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "Hello world",
      note: "Static text for testing."
    },
    lipsum: {
      title: "Lorem ipsum dolor sit amet, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "{email} kullan",
      note: 'Button that fills a form using a specific email address. The placeholder is the email address, e.g. "Use test@duck.com".'
    },
    blockEmailTrackers: {
      title: "E-posta izleyicileri engelleyin",
      note: 'Label explaining that by using a duck.com address, email trackers will be blocked. "Block" is a verb in imperative form.'
    },
    passwordForUrl: {
      title: "{url} \u015Fifresi",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Olu\u015Fturulan \u015Fifre",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "\u015Eifre bu web sitesi i\xE7in kaydedilecek",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden kilitlendi",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Kimlik bilgilerine eri\u015Fmek veya \u015Fifre olu\u015Fturmak i\xE7in kasan\u0131z\u0131n kilidini a\xE7\u0131n",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "\xD6zel Duck Address Olu\u015Ftur",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    hideEmailAndBlockTrackers: {
      title: "E-postan\u0131z\u0131 Gizleyin ve \u0130zleyicileri Engelleyin",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "Gizli izleyicileri de kald\u0131ran ve e-postalar\u0131 gelen kutunuza ileten benzersiz, rastgele bir adres olu\u015Fturun.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "Kaydedilen \xF6\u011Feleri y\xF6netin\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "Kredi kartlar\u0131n\u0131 y\xF6netin\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "Kimlikleri y\xF6netin\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "\u015Eifreleri y\xF6net\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "\xD6zel Duck Address Olu\u015Ftur",
      note: 'Button that when clicked creates a new private email address and fills the corresponding field with the generated address. "Generate" is a verb in imperative form, and "Duck Address" is a proper noun that should not be translated.'
    },
    blockEmailTrackersAndHideAddress: {
      title: "E-posta izleyicileri engelleyin ve adresi gizleyin",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "E-postam\u0131 Koru",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Bir Daha G\xF6sterme",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    credentialsImportHeading: {
      title: "\u015Eifreyi DuckDuckGo'ya aktar",
      note: "Label that when clicked, will open a dialog to import user's credentials from other browsers"
    },
    credentialsImportText: {
      title: "\u015Eifrelerinizi ba\u015Fka bir taray\u0131c\u0131dan veya \u015Fifre y\xF6neticisinden h\u0131zl\u0131 ve g\xFCvenli bir \u015Fekilde aktar\u0131n.",
      note: "Subtitle that explains the purpose of the import dialog"
    },
    expiry: {
      title: "Son kullanma tarihi",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/xa/autofill.json
  var autofill_default26 = {
    smartling: {
      string_format: "icu",
      translate_paths: [
        {
          path: "*/title",
          key: "{*}/title",
          instruction: "*/note"
        }
      ]
    },
    hello: {
      title: "H33ll00 w\xBArrld",
      note: "Static text for testing."
    },
    lipsum: {
      title: "L\xBArr3e3m 1p$$$um d00l1loor s!t @@mett, {foo} {bar}",
      note: "Placeholder text."
    },
    usePersonalDuckAddr: {
      title: "\xDC55\xA3\xA3 {email}",
      note: "Shown when a user can choose their personal @duck.com address."
    },
    blockEmailTrackers: {
      title: "Bl000ck \u20ACm@@@i1il1l tr\xE4\xE1\xE5ck33rr55",
      note: "Shown when a user can choose their personal @duck.com address on native platforms."
    },
    passwordForUrl: {
      title: "Pa@assw0rdd ffo\xF6r {url}",
      note: "Button that fills a form's password field with the saved password for that site. The placeholder 'url' is URL of the matched site, e.g. 'https://example.duckduckgo.com'."
    },
    generatedPassword: {
      title: "Gen33rat\xE9\xE9\xE9d pa@assw0rdd",
      note: 'Label on a button that, when clicked, fills an automatically-created password into a signup form. "Generated" is an adjective in past tense.'
    },
    passwordWillBeSaved: {
      title: "Pa@assw0rdd wi11lll \xDF3 $avvved for th\xEE\xEF$s website",
      note: "Label explaining that the associated automatically-created password will be persisted for the current site when the form is submitted"
    },
    bitwardenIsLocked: {
      title: "Bitwarden iiss l\xF6\xF8c\xE7k3d\u2202",
      note: "Label explaining that passwords are not available because the vault provided by third-party application Bitwarden has not been unlocked"
    },
    unlockYourVault: {
      title: "Unlock yo0ur va@u\xFClt to acce\xE9$$s cr\xE9de\xF1\xF1t\xEF\xE5\xE5\xE5ls or g\xE9\xE9nera\xE5te pass55w\xBA\xBArds5",
      note: "Label explaining that users must unlock the third-party password manager Bitwarden before they can use passwords stored there or create new passwords"
    },
    generatePrivateDuckAddr: {
      title: "Ge\xF1\xF1\xEB\xE9r\xE5\xE5te Priiivate Duck Addddrrreess",
      note: 'Button that creates a new single-use email address and fills a form with that address. "Generate" is a verb in imperative form.'
    },
    hideEmailAndBlockTrackers: {
      title: "H\xEE\xEF\xEDde yo0\xF8ur \xA3\xA3m@il an\u2202\u2202\u2202 bll\xBAck tr@c\xE7ck3rs",
      note: 'Button title prompting users to use an randomly-generated email address. "Hide" and "block" are imperative verbs.'
    },
    createUniqueRandomAddr: {
      title: "\xC7\xC7r3\xA3ate @ \xFC\xFB\xFAn11que, r@@nd0\xF8m ad\u2202dr3s5s that als0\xBA r3mov3s hidd\xA3\xA3n tr@cker$5$ and forwards em@@1l to your 1\xF1b0x.",
      note: 'Button subtitle (paired with "hideEmailAndBlockTrackers") explaining that by creating a randomly-generated address, trackers within emails will also be blocked.'
    },
    manageSavedItems: {
      title: "M\xE5an\xF1age\xE9 s@@ved 17733m5\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved items used to fill forms on web pages. The type of item is indeterminate, so this is intentionally more vague than "manageCreditCards", "manageIdentities", and "managePassworeds". "Manage" is an imperative verb.'
    },
    manageCreditCards: {
      title: "M\xE5an\xF1age\xE9 \xA2\xA2r\xA3d17 ca\xAE\xAE\xAE\u2202\u2202s\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more credit cards used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    manageIdentities: {
      title: "M\xE5an\xF1age\xE9 \xA1d\xA3\xA3nt11ties\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more identities. "Manage" is an imperative verb. An "Identity" (singular of "identities") is a noun representing the combiantion of name, birthday, physical address, email address, and phone number used to fill forms on a web page.'
    },
    managePasswords: {
      title: "M\xE5an\xF1age\xE9 p@\xE5$$$w\xBA\xBAr\u2202\u2202s\u2026",
      note: 'Button that when clicked allows users to add, edit, or delete one or more saved passwords used to fill forms on a web page. "Manage" is an imperative verb.'
    },
    generateDuckAddr: {
      title: "G\xE9\xE9\xE9ner@te a Pr\xEE\xEE\xEEvate DDDuck Addr\xE9\xE9s$s",
      note: "Button that when clicked creates a new private email address and fills the corresponding field with the generated address."
    },
    blockEmailTrackersAndHideAddress: {
      title: "Blo\xBA\xF8ck \xA3m\xE5\xE5il tr@\xE5ack\xA3\xA3rs && h\xEF\xEF\xEFd\xE9\xE9 ad\u2202dr33s5s$",
      note: 'Label (paired with "generateDuckAddr") explaining the benefits of creating a private DuckDuckGo email address. "Block" and "hide" are imperative verbs.'
    },
    protectMyEmail: {
      title: "Pr\xBA\xBA\u2020\u2020\xA3ct M\xA5\xA5 Em@@i\xEEl",
      note: 'Link that takes users to "https://duckduckgo.com/email/start-incontext", where they can sign up for DuckDuckGo email protection.'
    },
    dontShowAgain: {
      title: "Do\xF8\xBAn\xF1't Sh00w Ag@\xE5\xE5\xEEn",
      note: "Button that prevents the DuckDuckGo email protection signup prompt from appearing again."
    },
    expiry: {
      title: "\xA3\xA3xp@\xEE\xEFr\xA5\xA5",
      note: "Label that indicates the expiration date of credit cards."
    }
  };

  // src/locales/translations.js
  var translations_default = {
    bg: { autofill: autofill_default },
    cs: { autofill: autofill_default2 },
    da: { autofill: autofill_default3 },
    de: { autofill: autofill_default4 },
    el: { autofill: autofill_default5 },
    en: { autofill: autofill_default6 },
    es: { autofill: autofill_default7 },
    et: { autofill: autofill_default8 },
    fi: { autofill: autofill_default9 },
    fr: { autofill: autofill_default10 },
    hr: { autofill: autofill_default11 },
    hu: { autofill: autofill_default12 },
    it: { autofill: autofill_default13 },
    lt: { autofill: autofill_default14 },
    lv: { autofill: autofill_default15 },
    nb: { autofill: autofill_default16 },
    nl: { autofill: autofill_default17 },
    pl: { autofill: autofill_default18 },
    pt: { autofill: autofill_default19 },
    ro: { autofill: autofill_default20 },
    ru: { autofill: autofill_default21 },
    sk: { autofill: autofill_default22 },
    sl: { autofill: autofill_default23 },
    sv: { autofill: autofill_default24 },
    tr: { autofill: autofill_default25 },
    xa: { autofill: autofill_default26 }
  };

  // src/locales/strings.js
  function getTranslator(settings) {
    let library;
    return function t(id, opts) {
      if (!library) {
        const { language } = settings;
        library = translations_default[language];
        if (!library) {
          console.warn(`Received unsupported locale '${language}'. Falling back to 'en'.`);
          library = translations_default.en;
        }
      }
      return translateImpl(library, id, opts);
    };
  }
  function translateImpl(library, namespacedId, opts) {
    const [namespace, id] = namespacedId.split(":", 2);
    const namespacedLibrary = library[namespace];
    if (!namespacedLibrary) {
      return id;
    }
    const msg = namespacedLibrary[id];
    if (!msg) {
      return id;
    }
    if (!opts) {
      return msg.title;
    }
    let out = msg.title;
    for (const [name, value] of Object.entries(opts)) {
      out = out.replaceAll(`{${name}}`, value);
    }
    return out;
  }

  // src/CredentialsImport.js
  var CredentialsImport = class {
    /** @param {import("./DeviceInterface/InterfacePrototype").default} device */
    constructor(device) {
      this.device = device;
    }
    /**
     * Check if password promotion prompt should be shown. Only returns valid value in the main webiew.
     */
    isAvailable() {
      return Boolean(this.device.settings.availableInputTypes.credentialsImport);
    }
    init() {
      if (!this.device.globalConfig.hasModernWebkitAPI) return;
      try {
        Object.defineProperty(window, "credentialsImportFinished", {
          enumerable: false,
          configurable: false,
          writable: false,
          value: () => {
            this.refresh();
          }
        });
      } catch (e) {
      }
    }
    /**
     * @param {import("./deviceApiCalls/__generated__/validators-ts").AvailableInputTypes} [availableInputTypes]
     */
    async refresh(availableInputTypes) {
      const inputTypes = availableInputTypes || await this.device.settings.getAvailableInputTypes();
      this.device.settings.setAvailableInputTypes(inputTypes);
      this.device.scanner.forms.forEach((form) => form.redecorateAllInputs());
      this.device.uiController?.removeTooltip("interface");
      const activeForm = this.device.activeForm;
      if (!activeForm) return;
      const { activeInput } = activeForm;
      const { username, password } = this.device.settings.availableInputTypes.credentials || {};
      if (activeInput && (username || password)) {
        this.device.attachTooltip({
          form: activeForm,
          input: activeInput,
          click: null,
          trigger: "credentialsImport",
          triggerMetaData: {
            type: "transactional"
          }
        });
      }
    }
    async started() {
      this.device.deviceApi.notify(new StartCredentialsImportFlowCall({}));
      this.device.deviceApi.notify(new CloseAutofillParentCall(null));
    }
    async dismissed() {
      this.device.deviceApi.notify(new CredentialsImportFlowPermanentlyDismissedCall(null));
      this.device.deviceApi.notify(new CloseAutofillParentCall(null));
    }
  };

  // src/DeviceInterface/InterfacePrototype.js
  var _addresses, _data6;
  var _InterfacePrototype = class _InterfacePrototype {
    /**
     * @param {GlobalConfig} config
     * @param {import("../../packages/device-api").DeviceApi} deviceApi
     * @param {Settings} settings
     */
    constructor(config, deviceApi, settings) {
      __publicField(this, "attempts", 0);
      /** @type {import("../Form/Form").Form | null} */
      __publicField(this, "activeForm", null);
      /** @type {import("../UI/HTMLTooltip.js").default | null} */
      __publicField(this, "currentTooltip", null);
      /** @type {number} */
      __publicField(this, "initialSetupDelayMs", 0);
      __publicField(this, "autopromptFired", false);
      /** @type {PasswordGenerator} */
      __publicField(this, "passwordGenerator", new PasswordGenerator());
      __publicField(this, "emailProtection", new EmailProtection(this));
      __publicField(this, "credentialsImport", new CredentialsImport(this));
      /** @type {Object | null} */
      __publicField(this, "focusApi", null);
      /** @type {import("../InContextSignup.js").InContextSignup | null} */
      __publicField(this, "inContextSignup", null);
      /** @type {import("../ThirdPartyProvider.js").ThirdPartyProvider | null} */
      __publicField(this, "thirdPartyProvider", null);
      /** @type {{privateAddress: string, personalAddress: string}} */
      __privateAdd(this, _addresses, {
        privateAddress: "",
        personalAddress: ""
      });
      /** @type {GlobalConfig} */
      __publicField(this, "globalConfig");
      /** @type {import('../Scanner').Scanner} */
      __publicField(this, "scanner");
      /** @type {import("../UI/controllers/UIController.js").UIController | null} */
      __publicField(this, "uiController");
      /** @type {import("../../packages/device-api").DeviceApi} */
      __publicField(this, "deviceApi");
      /**
       * Translates a string to the current language, replacing each placeholder
       * with a key present in `opts` with the corresponding value.
       * @type {import('../locales/strings').TranslateFn}
       */
      __publicField(this, "t");
      /** @type {boolean} */
      __publicField(this, "isInitializationStarted");
      /** @type {((reason, ...rest) => void) | null} */
      __publicField(this, "_scannerCleanup", null);
      /** @type { PMData } */
      __privateAdd(this, _data6, {
        credentials: [],
        creditCards: [],
        identities: [],
        topContextData: void 0
      });
      this.globalConfig = config;
      this.deviceApi = deviceApi;
      this.settings = settings;
      this.t = getTranslator(settings);
      this.uiController = null;
      this.scanner = createScanner(this, {
        initialDelay: this.initialSetupDelayMs
      });
      this.isInitializationStarted = false;
    }
    /**
     * Implementors should override this with a UI controller that suits
     * their platform.
     *
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createUIController() {
      return new NativeUIController();
    }
    /**
     * @param {string} reason
     */
    removeAutofillUIFromPage(reason) {
      this.uiController?.destroy();
      this._scannerCleanup?.(reason);
      this.focusApi?.cleanup?.();
    }
    get hasLocalAddresses() {
      return !!(__privateGet(this, _addresses)?.privateAddress && __privateGet(this, _addresses)?.personalAddress);
    }
    getLocalAddresses() {
      return __privateGet(this, _addresses);
    }
    storeLocalAddresses(addresses) {
      __privateSet(this, _addresses, addresses);
      const identities = this.getLocalIdentities();
      const privateAddressIdentity = identities.find(({ id }) => id === "privateAddress");
      if (privateAddressIdentity) {
        privateAddressIdentity.emailAddress = formatDuckAddress(addresses.privateAddress);
      } else {
        __privateGet(this, _data6).identities = this.addDuckAddressesToIdentities(identities);
      }
    }
    /**
     * @returns {import('../Form/matching').SupportedTypes}
     */
    getCurrentInputType() {
      throw new Error("Not implemented");
    }
    addDuckAddressesToIdentities(identities) {
      if (!this.hasLocalAddresses) return identities;
      const newIdentities = [];
      let { privateAddress, personalAddress } = this.getLocalAddresses();
      privateAddress = formatDuckAddress(privateAddress);
      personalAddress = formatDuckAddress(personalAddress);
      const duckEmailsInIdentities = identities.reduce(
        (duckEmails, { emailAddress: email }) => email?.includes(ADDRESS_DOMAIN) ? duckEmails.concat(email) : duckEmails,
        []
      );
      if (!duckEmailsInIdentities.includes(personalAddress)) {
        newIdentities.push({
          id: "personalAddress",
          emailAddress: personalAddress,
          title: this.t("autofill:blockEmailTrackers")
        });
      }
      newIdentities.push({
        id: "privateAddress",
        emailAddress: privateAddress,
        title: this.t("autofill:blockEmailTrackersAndHideAddress")
      });
      return [...identities, ...newIdentities];
    }
    /**
     * Stores init data coming from the tooltipHandler
     * @param { InboundPMData } data
     */
    storeLocalData(data) {
      this.storeLocalCredentials(data.credentials);
      data.creditCards.forEach((cc) => delete cc.cardNumber && delete cc.cardSecurityCode);
      const updatedIdentities = data.identities.map((identity) => ({
        ...identity,
        fullName: formatFullName(identity)
      }));
      __privateGet(this, _data6).identities = this.addDuckAddressesToIdentities(updatedIdentities);
      __privateGet(this, _data6).creditCards = data.creditCards;
      if (data.serializedInputContext) {
        try {
          __privateGet(this, _data6).topContextData = JSON.parse(data.serializedInputContext);
        } catch (e) {
          console.error(e);
          this.removeTooltip();
        }
      }
    }
    /**
     * Stores credentials locally
     * @param {CredentialsObject[]} credentials
     */
    storeLocalCredentials(credentials) {
      credentials.forEach((cred) => delete cred.password);
      __privateGet(this, _data6).credentials = credentials;
    }
    getTopContextData() {
      return __privateGet(this, _data6).topContextData;
    }
    /**
     * @deprecated use `availableInputTypes.credentials` directly instead
     * @returns {boolean}
     */
    get hasLocalCredentials() {
      return __privateGet(this, _data6).credentials.length > 0;
    }
    getLocalCredentials() {
      return __privateGet(this, _data6).credentials.map((cred) => {
        const { password, ...rest } = cred;
        return rest;
      });
    }
    /**
     * @deprecated use `availableInputTypes.identities` directly instead
     * @returns {boolean}
     */
    get hasLocalIdentities() {
      return __privateGet(this, _data6).identities.length > 0;
    }
    getLocalIdentities() {
      return __privateGet(this, _data6).identities;
    }
    /**
     * @deprecated use `availableInputTypes.creditCards` directly instead
     * @returns {boolean}
     */
    get hasLocalCreditCards() {
      return __privateGet(this, _data6).creditCards.length > 0;
    }
    /** @return {CreditCardObject[]} */
    getLocalCreditCards() {
      return __privateGet(this, _data6).creditCards;
    }
    /**
     * Initializes a global focus event handler that handles iOS keyboard and autocomplete functionality
     * @param {Map<HTMLElement, import("../Form/Form").Form>} forms - Collection of form objects to monitor
     * @returns {Object}
     */
    initGlobalFocusHandler(forms) {
      return initFocusApi(forms, this.settings, ({ form, element }) => this.attachKeyboard({ device: this, form, element }));
    }
    async startInit() {
      if (this.isInitializationStarted) return;
      this.isInitializationStarted = true;
      this.addDeviceListeners();
      await this.setupAutofill();
      this.uiController = this.createUIController();
      if (!this.settings.enabled) {
        return;
      }
      await this.setupSettingsPage();
      await this.postInit();
      if (this.settings.featureToggles.credentials_saving) {
        initFormSubmissionsApi(this.scanner.forms, this.scanner.matching);
      }
      if (this.settings.featureToggles.input_focus_api || this.settings.featureToggles.autocomplete_attribute_support) {
        this.focusApi = this.initGlobalFocusHandler(this.scanner.forms);
      }
    }
    async init() {
      const settings = await this.settings.refresh();
      if (!settings.enabled) return;
      const handler = async () => {
        if (document.readyState === "complete") {
          window.removeEventListener("load", handler);
          document.removeEventListener("readystatechange", handler);
          await this.startInit();
        }
      };
      if (document.readyState === "complete") {
        await this.startInit();
      } else {
        window.addEventListener("load", handler);
        document.addEventListener("readystatechange", handler);
      }
    }
    postInit() {
      const cleanup = this.scanner.init();
      this.addLogoutListener(() => {
        cleanup("Logged out");
        if (this.globalConfig.isDDGDomain) {
          notifyWebApp({ deviceSignedIn: { value: false } });
        }
      });
    }
    /**
     * @deprecated This was a port from the macOS implementation so the API may not be suitable for all
     * @returns {Promise<any>}
     */
    async getSelectedCredentials() {
      throw new Error("`getSelectedCredentials` not implemented");
    }
    isTestMode() {
      return this.globalConfig.isDDGTestMode;
    }
    /**
     * This indicates an item was selected on Desktop, and we should try to autofill
     *
     * Note: When we're in a top-frame scenario, like on like macOS & Windows in the webview,
     * this method gets overridden {@see WindowsOverlayDeviceInterface} {@see AppleOverlayDeviceInterface}
     *
     * @param {IdentityObject|CreditCardObject|CredentialsObject|{email:string, id: string}} data
     * @param {string} type
     */
    async selectedDetail(data, type) {
      const form = this.activeForm;
      if (!form) {
        return;
      }
      if (type === "email" && "email" in data) {
        form.autofillEmail(data.email);
      } else {
        form.autofillData(data, type);
      }
      const isPrivateAddress = data.id === "privateAddress";
      if (isPrivateAddress) {
        this.refreshAlias();
        if ("emailAddress" in data && data.emailAddress) {
          this.emailProtection.storeReceived(data.emailAddress);
          const formValues = {
            credentials: {
              username: data.emailAddress,
              autogenerated: true
            }
          };
          this.storeFormData(formValues, "emailProtection");
        }
      }
      await this.removeTooltip();
    }
    /**
     * Before the DataWebTooltip opens, we collect the data based on the config.type
     * @param {InputTypeConfigs} config
     * @param {import('../Form/matching').SupportedTypes} inputType
     * @param {TopContextData} [data]
     * @returns {(CredentialsObject|CreditCardObject|IdentityObject)[]}
     */
    dataForAutofill(config, inputType, data) {
      const subtype = getSubtypeFromType(inputType);
      if (config.type === "identities") {
        return this.getLocalIdentities().filter((identity) => !!identity[subtype]);
      }
      if (config.type === "creditCards") {
        return this.getLocalCreditCards();
      }
      if (config.type === "credentials") {
        if (data) {
          if (Array.isArray(data.credentials) && data.credentials.length > 0) {
            return data.credentials;
          } else {
            return this.getLocalCredentials().filter(
              (cred) => !!cred[subtype] || subtype === "password" || cred.id === PROVIDER_LOCKED
            );
          }
        }
      }
      return [];
    }
    /**
     * @param {object} params
     * @param {import("../Form/Form").Form} params.form
     * @param {HTMLInputElement} params.input
     * @param {{ x: number; y: number; } | null} params.click
     * @param {import('../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest['trigger']} params.trigger
     * @param {import('../UI/controllers/UIController.js').AttachTooltipArgs["triggerMetaData"]} params.triggerMetaData
     */
    attachTooltip(params) {
      const { form, input, click, trigger } = params;
      if (document.visibilityState !== "visible" && trigger !== "postSignup") return;
      if (trigger === "autoprompt" && !this.globalConfig.isMobileApp) return;
      if (trigger === "autoprompt" && this.autopromptFired) return;
      form.activeInput = input;
      this.activeForm = form;
      const inputType = getInputType(input);
      const getPosition = () => {
        const alignLeft = this.globalConfig.isApp || this.globalConfig.isWindows;
        return alignLeft ? input.getBoundingClientRect() : getDaxBoundingBox(input);
      };
      if (this.globalConfig.isMobileApp && inputType === "identities.emailAddress") {
        this.getAlias().then((alias) => {
          if (alias) {
            form.autofillEmail(alias);
            this.emailProtection.storeReceived(alias);
          } else {
            form.activeInput?.focus();
          }
          this.updateForStateChange();
          this.onFinishedAutofill();
        });
        return;
      }
      const topContextData = {
        inputType,
        credentialsImport: this.credentialsImport.isAvailable() && (this.activeForm.isLogin || this.activeForm.isHybrid)
      };
      const processedTopContext = this.preAttachTooltip(topContextData, input, form);
      this.uiController?.attachTooltip({
        input,
        form,
        click,
        getPosition,
        topContextData: processedTopContext,
        device: this,
        trigger,
        triggerMetaData: params.triggerMetaData
      });
      if (trigger === "autoprompt") {
        this.autopromptFired = true;
      }
    }
    /**
     * @param {import('../UI/controllers/UIController.js').AttachKeyboardArgs} args
     */
    attachKeyboard(args) {
      this.uiController?.attachKeyboard(args);
    }
    /**
     * When an item was selected, we then call back to the device
     * to fetch the full suite of data needed to complete the autofill
     *
     * @param {import('../Form/matching').SupportedTypes} inputType
     * @param {(CreditCardObject|IdentityObject|CredentialsObject)[]} items
     * @param {CreditCardObject['id']|IdentityObject['id']|CredentialsObject['id']} id
     */
    onSelect(inputType, items, id) {
      id = String(id);
      const mainType = getMainTypeFromType(inputType);
      const subtype = getSubtypeFromType(inputType);
      if (id === PROVIDER_LOCKED) {
        return this.thirdPartyProvider?.askToUnlockProvider();
      }
      const matchingData = items.find((item) => String(item.id) === id);
      if (!matchingData) throw new Error("unreachable (fatal)");
      const dataPromise = (() => {
        switch (mainType) {
          case "creditCards":
            return this.getAutofillCreditCard(id);
          case "identities":
            return this.getAutofillIdentity(id);
          case "credentials": {
            if (AUTOGENERATED_KEY in matchingData) {
              const autogeneratedPayload = { ...matchingData, username: "" };
              return Promise.resolve({ success: autogeneratedPayload });
            }
            return this.getAutofillCredentials(id);
          }
          default:
            throw new Error("unreachable!");
        }
      })();
      dataPromise.then((response) => {
        if (response) {
          const data = response.success || response;
          if (mainType === "identities") {
            this.firePixel({ pixelName: "autofill_identity", params: { fieldType: subtype } });
            switch (id) {
              case "personalAddress":
                this.firePixel({ pixelName: "autofill_personal_address" });
                break;
              case "privateAddress":
                this.firePixel({ pixelName: "autofill_private_address" });
                break;
              default: {
                const checks = [
                  subtype === "emailAddress",
                  this.hasLocalAddresses,
                  data?.emailAddress === formatDuckAddress(__privateGet(this, _addresses).personalAddress)
                ];
                if (checks.every(Boolean)) {
                  this.firePixel({ pixelName: "autofill_personal_address" });
                }
                break;
              }
            }
          }
          return this.selectedDetail(data, mainType);
        } else {
          return Promise.reject(new Error("none-success response"));
        }
      }).catch((e) => {
        console.error(e);
        return this.removeTooltip();
      });
    }
    isTooltipActive() {
      return this.uiController?.isActive?.() ?? false;
    }
    removeTooltip() {
      return this.uiController?.removeTooltip?.("interface");
    }
    onFinishedAutofill() {
      this.activeForm?.activeInput?.dispatchEvent(new Event("mouseleave"));
    }
    async updateForStateChange() {
      this.activeForm?.removeAllDecorations();
      await this.refreshData();
      this.activeForm?.recategorizeAllInputs();
    }
    async refreshData() {
      await this.inContextSignup?.refreshData();
      await this.settings.populateData();
    }
    async setupSettingsPage({ shouldLog: shouldLog2 } = { shouldLog: false }) {
      if (!this.globalConfig.isDDGDomain) {
        return;
      }
      notifyWebApp({ isApp: this.globalConfig.isApp });
      if (this.isDeviceSignedIn()) {
        let userData;
        try {
          userData = await this.getUserData();
        } catch (e) {
        }
        let capabilities;
        try {
          capabilities = await this.getEmailProtectionCapabilities();
        } catch (e) {
        }
        if (this.globalConfig.isDDGDomain) {
          window.addEventListener("message", (e) => {
            if (e.data.removeUserData) {
              this.removeUserData();
            }
            if (e.data.closeEmailProtection) {
              this.closeEmailProtection();
            }
          });
        }
        const hasUserData = userData && !userData.error && Object.entries(userData).length > 0;
        notifyWebApp({
          deviceSignedIn: {
            value: true,
            shouldLog: shouldLog2,
            userData: hasUserData ? userData : void 0,
            capabilities
          }
        });
      } else {
        this.trySigningIn();
      }
    }
    async setupAutofill() {
    }
    /** @returns {Promise<EmailAddresses>} */
    async getAddresses() {
      throw new Error("unimplemented");
    }
    /** @returns {Promise<null|Record<any,any>>} */
    getUserData() {
      return Promise.resolve(null);
    }
    /** @returns {void} */
    removeUserData() {
    }
    /** @returns {void} */
    closeEmailProtection() {
    }
    /** @returns {Promise<null|Record<string,boolean>>} */
    getEmailProtectionCapabilities() {
      throw new Error("unimplemented");
    }
    refreshAlias() {
    }
    async trySigningIn() {
      if (this.globalConfig.isDDGDomain) {
        if (this.attempts < 10) {
          this.attempts++;
          const data = await sendAndWaitForAnswer(SIGN_IN_MSG, "addUserData");
          this.storeUserData(data);
          await this.setupAutofill();
          await this.settings.refresh();
          await this.setupSettingsPage({ shouldLog: true });
          await this.postInit();
        } else {
          console.warn("max attempts reached, bailing");
        }
      }
    }
    storeUserData(_data7) {
    }
    addDeviceListeners() {
    }
    /** @param {() => void} _fn */
    addLogoutListener(_fn) {
    }
    isDeviceSignedIn() {
      return false;
    }
    /**
     * @returns {Promise<string|undefined>}
     */
    async getAlias() {
      return void 0;
    }
    // PM endpoints
    getAccounts() {
    }
    /**
     * Gets credentials ready for autofill
     * @param {CredentialsObject['id']} id - the credential id
     * @returns {Promise<CredentialsObject|{success:CredentialsObject}>}
     */
    async getAutofillCredentials(id) {
      return this.deviceApi.request(new GetAutofillCredentialsCall({ id: String(id) }));
    }
    /** @returns {APIResponseSingle<CreditCardObject>} */
    async getAutofillCreditCard(_id) {
      throw new Error("getAutofillCreditCard unimplemented");
    }
    /** @returns {Promise<{success: IdentityObject|undefined}>} */
    async getAutofillIdentity(_id) {
      throw new Error("getAutofillIdentity unimplemented");
    }
    openManagePasswords() {
    }
    openManageCreditCards() {
    }
    openManageIdentities() {
    }
    /**
     * @param {StoreFormData} values
     * @param {StoreFormData['trigger']} trigger
     */
    storeFormData(values, trigger) {
      this.deviceApi.notify(new StoreFormDataCall({ ...values, trigger }));
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
     * @param {import("../Form/Form").Form} form
     */
    preAttachTooltip(topContextData, input, form) {
      const checks = [topContextData.inputType === "credentials.password.new", this.settings.featureToggles.password_generation];
      if (checks.every(Boolean)) {
        const password = this.passwordGenerator.generate({
          input: input.getAttribute("passwordrules"),
          domain: window.location.hostname
        });
        const rawValues = form.getRawValues();
        const username = rawValues.credentials?.username || rawValues.identities?.emailAddress || "";
        topContextData.credentials = [fromPassword(password, username)];
      }
      return topContextData;
    }
    /**
     * `postAutofill` gives features an opportunity to perform an action directly
     * following an autofill.
     *
     * For example, if a generated password was used, we want to fire a save event.
     *
     * @param {IdentityObject|CreditCardObject|CredentialsObject} data
     * @param {SupportedMainTypes} dataType
     * @param {import("../Form/Form").Form} formObj
     */
    postAutofill(data, dataType, formObj) {
      if (AUTOGENERATED_KEY in data && "password" in data && // Don't send message on Android to avoid potential abuse. Data is saved on native confirmation instead.
      !this.globalConfig.isAndroid) {
        const formValues = formObj.getValuesReadyForStorage();
        if (formValues.credentials?.password === data.password) {
          const formData = appendGeneratedKey(formValues, { password: data.password });
          this.storeFormData(formData, "passwordGeneration");
        }
      }
      if (dataType === "credentials" && formObj.shouldAutoSubmit) {
        formObj.attemptSubmissionIfNeeded();
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
    postSubmit(values, form) {
      if (!form.form) return;
      if (!form.hasValues(values)) return;
      const shouldTriggerPartialSave = Object.keys(values?.credentials || {}).length === 1 && Boolean(values?.credentials?.username) && this.settings.featureToggles.partial_form_saves;
      const checks = [
        form.shouldPromptToStoreData && !form.submitHandlerExecuted,
        this.passwordGenerator.generated,
        shouldTriggerPartialSave
      ];
      if (checks.some(Boolean)) {
        const formData = appendGeneratedKey(values, {
          password: this.passwordGenerator.password,
          username: this.emailProtection.lastGenerated
        });
        const trigger = shouldTriggerPartialSave ? "partialSave" : "formSubmission";
        this.storeFormData(formData, trigger);
      }
    }
    /**
     * Sends a pixel to be fired on the client side
     * @param {import('../deviceApiCalls/__generated__/validators-ts').SendJSPixelParams} pixelParams
     */
    firePixel(pixelParams) {
      this.deviceApi.notify(new SendJSPixelCall(pixelParams));
    }
    /**
     * This serves as a single place to create a default instance
     * of InterfacePrototype that can be useful in testing scenarios
     * @param {Partial<GlobalConfig>} [globalConfigOverrides]
     * @returns {InterfacePrototype}
     */
    static default(globalConfigOverrides) {
      const globalConfig = createGlobalConfig(globalConfigOverrides);
      const transport = createTransport(globalConfig);
      const deviceApi = new DeviceApi(transport);
      const settings = Settings.default(globalConfig, deviceApi);
      return new _InterfacePrototype(globalConfig, deviceApi, settings);
    }
  };
  _addresses = new WeakMap();
  _data6 = new WeakMap();
  var InterfacePrototype = _InterfacePrototype;
  var InterfacePrototype_default = InterfacePrototype;

  // src/InContextSignup.js
  var InContextSignup = class {
    /**
     * @param {import("./DeviceInterface/InterfacePrototype").default} device
     */
    constructor(device) {
      this.device = device;
    }
    async init() {
      await this.refreshData();
      this.addNativeAccessibleGlobalFunctions();
    }
    addNativeAccessibleGlobalFunctions() {
      if (!this.device.globalConfig.hasModernWebkitAPI) return;
      try {
        Object.defineProperty(window, "openAutofillAfterClosingEmailProtectionTab", {
          enumerable: false,
          configurable: false,
          writable: false,
          value: () => {
            this.openAutofillTooltip();
          }
        });
      } catch (e) {
      }
    }
    async refreshData() {
      const incontextSignupDismissedAt = await this.device.deviceApi.request(new GetIncontextSignupDismissedAtCall(null));
      this.permanentlyDismissedAt = incontextSignupDismissedAt.permanentlyDismissedAt;
      this.isInstalledRecently = incontextSignupDismissedAt.isInstalledRecently;
    }
    async openAutofillTooltip() {
      await this.device.refreshData();
      await this.device.uiController?.removeTooltip("stateChange");
      const activeInput = this.device.activeForm?.activeInput;
      activeInput?.blur();
      const selectActiveInput = () => {
        activeInput?.focus();
      };
      if (document.hasFocus()) {
        selectActiveInput();
      } else {
        document.addEventListener(
          "visibilitychange",
          () => {
            selectActiveInput();
          },
          { once: true }
        );
      }
    }
    isPermanentlyDismissed() {
      return Boolean(this.permanentlyDismissedAt);
    }
    isOnValidDomain() {
      return isValidTLD() && !isLocalNetwork();
    }
    isAllowedByDevice() {
      if (typeof this.isInstalledRecently === "boolean") {
        return this.isInstalledRecently;
      } else {
        return true;
      }
    }
    /**
     * @param {import('./Form/matching.js').SupportedSubTypes | "unknown"} [inputType]
     * @returns {boolean}
     */
    isAvailable(inputType = "emailAddress") {
      const isEmailInput = inputType === "emailAddress";
      const isEmailProtectionEnabled = !!this.device.settings?.featureToggles.emailProtection;
      const isIncontextSignupEnabled = !!this.device.settings?.featureToggles.emailProtection_incontext_signup;
      const isNotAlreadyLoggedIn = !this.device.isDeviceSignedIn();
      const isNotDismissed = !this.isPermanentlyDismissed();
      const isOnExpectedPage = this.device.globalConfig.isTopFrame || this.isOnValidDomain();
      const isAllowedByDevice = this.isAllowedByDevice();
      return isEmailInput && isEmailProtectionEnabled && isIncontextSignupEnabled && isNotAlreadyLoggedIn && isNotDismissed && isOnExpectedPage && isAllowedByDevice;
    }
    onIncontextSignup() {
      this.device.deviceApi.notify(new StartEmailProtectionSignupCall({}));
      this.device.firePixel({ pixelName: "incontext_primary_cta" });
    }
    onIncontextSignupDismissed(options = { shouldHideTooltip: true }) {
      if (options.shouldHideTooltip) {
        this.device.removeAutofillUIFromPage("Email Protection in-context signup dismissed.");
        this.device.deviceApi.notify(new CloseAutofillParentCall(null));
      }
      this.permanentlyDismissedAt = (/* @__PURE__ */ new Date()).getTime();
      this.device.deviceApi.notify(new SetIncontextSignupPermanentlyDismissedAtCall({ value: this.permanentlyDismissedAt }));
      this.device.firePixel({ pixelName: "incontext_dismiss_persisted" });
    }
    // In-context signup can be closed when displayed as a stand-alone tooltip, e.g. extension
    onIncontextSignupClosed() {
      this.device.activeForm?.dismissTooltip();
      this.device.firePixel({ pixelName: "incontext_close_x" });
    }
  };

  // src/DeviceInterface/AndroidInterface.js
  var AndroidInterface = class extends InterfacePrototype_default {
    constructor() {
      super(...arguments);
      __publicField(this, "inContextSignup", new InContextSignup(this));
    }
    /**
     * @returns {Promise<string|undefined>}
     */
    async getAlias() {
      const { alias } = await sendAndWaitForAnswer(async () => {
        if (this.inContextSignup.isAvailable()) {
          const { isSignedIn } = await this.deviceApi.request(new ShowInContextEmailProtectionSignupPromptCall(null));
          if (this.globalConfig.availableInputTypes) {
            this.globalConfig.availableInputTypes.email = isSignedIn;
          }
          this.updateForStateChange();
          this.onFinishedAutofill();
        }
        return window.EmailInterface.showTooltip();
      }, "getAliasResponse");
      return alias;
    }
    /**
     * @override
     */
    createUIController() {
      return new NativeUIController();
    }
    /**
     * @deprecated use `this.settings.availableInputTypes.email` in the future
     * @returns {boolean}
     */
    isDeviceSignedIn() {
      if (this.globalConfig.isDDGDomain) {
        return window.EmailInterface.isSignedIn() === "true";
      }
      if (typeof this.globalConfig.availableInputTypes?.email === "boolean") {
        return this.globalConfig.availableInputTypes.email;
      }
      return true;
    }
    async setupAutofill() {
      await this.inContextSignup.init();
    }
    /**
     * Used by the email web app
     * Settings page displays data of the logged in user data
     */
    getUserData() {
      let userData = null;
      try {
        userData = JSON.parse(window.EmailInterface.getUserData());
      } catch (e) {
        if (this.globalConfig.isDDGTestMode) {
          console.error(e);
        }
      }
      return Promise.resolve(userData);
    }
    /**
     * Used by the email web app
     * Device capabilities determine which functionality is available to the user
     */
    getEmailProtectionCapabilities() {
      let deviceCapabilities = null;
      try {
        deviceCapabilities = JSON.parse(window.EmailInterface.getDeviceCapabilities());
      } catch (e) {
        if (this.globalConfig.isDDGTestMode) {
          console.error(e);
        }
      }
      return Promise.resolve(deviceCapabilities);
    }
    storeUserData({ addUserData: { token, userName, cohort } }) {
      return window.EmailInterface.storeCredentials(token, userName, cohort);
    }
    /**
     * Used by the email web app
     * Provides functionality to log the user out
     */
    removeUserData() {
      try {
        return window.EmailInterface.removeCredentials();
      } catch (e) {
        if (this.globalConfig.isDDGTestMode) {
          console.error(e);
        }
      }
    }
    /**
     * Used by the email web app
     * Provides functionality to close the window after in-context sign-up or sign-in
     */
    closeEmailProtection() {
      this.deviceApi.request(new CloseEmailProtectionTabCall(null));
    }
    addLogoutListener(handler) {
      if (!this.globalConfig.isDDGDomain) return;
      window.addEventListener("message", (e) => {
        if (this.globalConfig.isDDGDomain && e.data.emailProtectionSignedOut) {
          handler();
        }
      });
    }
    /** Noop */
    firePixel(_pixelParam) {
    }
  };

  // src/UI/styles/autofill-tooltip-styles.css
  var autofill_tooltip_styles_default = '/* src/UI/styles/autofill-tooltip-styles.css */\n:root {\n  color-scheme: light dark;\n}\n:host {\n  --t-text-primary: #1C1F21;\n  --t-text-secondary: rgba(28, 31, 33, 0.72);\n  --t-text-primary-dark: rgba(255, 255, 255, .84);\n  --t-text-secondary-dark: rgba(255, 255, 255, .60);\n  --t-backdrop-mac: #F2F0F0;\n  --t-backdrop-mac-dark: #646264;\n  --t-backdrop-windows: #FFF;\n  --t-backdrop-windows-dark: #333;\n  --t-mac-interactive: #3969EF;\n  --t-mac-interactive-text: #FFF;\n  --t-windows-interactive: #f0f0f0;\n  --t-windows-interactive-dark: #3f3f3f;\n  --color-primary: var(--t-text-primary);\n  --color-secondary: var(--t-text-secondary);\n  --color-primary-dark: var(--t-text-primary-dark);\n  --color-secondary-dark: var(--t-text-secondary-dark);\n  --bg: var(--t-backdrop-mac);\n  --bg-dark: var(--t-backdrop-mac-dark);\n  --font-size-primary: 13px;\n  --font-size-secondary: 11px;\n  --font-weight: 500;\n  --padding: 6px;\n  --hr-margin: 5px 9px;\n  --border-radius: 4px;\n  --hover-color-primary: var(--t-mac-interactive-text);\n  --hover-color-secondary: var(--t-mac-interactive-text);\n  --hover-color-primary-dark: var(--t-mac-interactive-text);\n  --hover-color-secondary-dark: var(--t-mac-interactive-text);\n  --hover-bg: var(--t-mac-interactive);\n  --hover-bg-dark: var(--t-mac-interactive);\n  --hover-effect: invert(100%);\n  --hover-effect-dark: invert(100%);\n}\n:host:has([data-platform=windows]) {\n  --bg: var(--t-backdrop-windows);\n  --bg-dark: var(--t-backdrop-windows-dark);\n  --font-size-primary: 14px;\n  --font-size-secondary: 12px;\n  --font-weight: 400;\n  --padding: 0px;\n  --hr-margin: 4px 0px;\n  --border-radius: 3px;\n  --hover-color-primary: var(--t-text-primary);\n  --hover-color-secondary: var(--t-text-secondary);\n  --hover-color-primary-dark: var(--t-text-primary-dark);\n  --hover-color-secondary-dark: var(--t-text-secondary-dark);\n  --hover-bg: var(--t-windows-interactive);\n  --hover-bg-dark: var(--t-windows-interactive-dark);\n  --hover-effect: none;\n  --hover-effect-dark: invert(100%);\n}\n.wrapper *,\n.wrapper *::before,\n.wrapper *::after {\n  box-sizing: border-box;\n}\n.wrapper {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 2147483647;\n  padding: 0;\n  font-family: system-ui;\n  -webkit-font-smoothing: antialiased;\n}\n.wrapper:not(.top-autofill) .tooltip {\n  position: absolute;\n  width: 300px;\n  max-width: calc(100vw - 25px);\n  transform: translate(-1000px, -1000px);\n  z-index: 2147483647;\n}\n.tooltip--data,\n#topAutofill {\n  background-color: var(--bg);\n}\n@media (prefers-color-scheme: dark) {\n  .tooltip--data,\n  #topAutofill {\n    background: var(--bg-dark);\n  }\n}\n.tooltip--data {\n  width: 315px;\n  max-height: 290px;\n  padding: var(--padding);\n  font-size: var(--font-size-primary);\n  line-height: 14px;\n  overflow-y: auto;\n}\n.top-autofill .tooltip--data {\n  min-height: 100vh;\n}\n.tooltip--data.tooltip--incontext-signup {\n  width: 360px;\n}\n.wrapper:not(.top-autofill) .tooltip--data {\n  top: 100%;\n  left: 100%;\n}\n.wrapper:not(.top-autofill) .tooltip--email {\n  top: calc(100% + 6px);\n  right: calc(100% - 48px);\n  padding: 8px;\n  border: 1px solid #D0D0D0;\n  border-radius: 10px;\n  background-color: #FFF;\n  font-size: 14px;\n  line-height: 1.3;\n  color: #333;\n  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);\n}\n.tooltip--email__caret {\n  position: absolute;\n  transform: translate(-1000px, -1000px);\n  z-index: 2147483647;\n}\n.tooltip--email__caret::before,\n.tooltip--email__caret::after {\n  content: "";\n  display: block;\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  position: absolute;\n  border-bottom: 8px solid #D0D0D0;\n  right: -28px;\n}\n.tooltip--email__caret::before {\n  border-bottom-color: #D0D0D0;\n  top: -1px;\n}\n.tooltip--email__caret::after {\n  border-bottom-color: #FFF;\n  top: 0px;\n}\n.tooltip__button {\n  display: flex;\n  width: 100%;\n  padding: 8px 8px 8px 0px;\n  font-family: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  border-radius: 6px;\n  text-align: left;\n}\n.tooltip__button.currentFocus,\n.wrapper:not(.top-autofill) .tooltip__button:hover {\n  background-color: var(--hover-bg);\n  color: var(--hover-color-primary);\n}\n@media (prefers-color-scheme: dark) {\n  .tooltip__button.currentFocus,\n  .wrapper:not(.top-autofill) .tooltip__button:hover {\n    background-color: var(--hover-bg-dark);\n  }\n}\n.tooltip__button--data {\n  position: relative;\n  min-height: 48px;\n  flex-direction: row;\n  justify-content: flex-start;\n  font-size: inherit;\n  font-weight: var(--font-weight);\n  line-height: 16px;\n  text-align: left;\n  border-radius: var(--border-radius);\n}\n.tooltip--data__item-container {\n  max-height: 220px;\n  overflow: auto;\n}\n.tooltip__button--data:first-child {\n  margin-top: 0;\n}\n.tooltip__button--data:last-child {\n  margin-bottom: 0;\n}\n.tooltip__button--data::before {\n  content: "";\n  display: block;\n  flex-shrink: 0;\n  width: 32px;\n  height: 32px;\n  margin: 0 8px;\n  background-size: 20px 20px;\n  background-repeat: no-repeat;\n  background-position: center center;\n}\n.tooltip__button--data.currentFocus:not(.tooltip__button--data--bitwarden)::before,\n.wrapper:not(.top-autofill) .tooltip__button--data:not(.tooltip__button--data--bitwarden):hover::before {\n  filter: var(--hover-effect);\n}\n.tooltip__button--data.currentFocus.no-hover-effect::before,\n.wrapper:not(.top-autofill) .tooltip__button--data.no-hover-effect:hover::before,\n.tooltip__button--data.no-hover-effect:hover::before {\n  filter: none;\n}\n@media (prefers-color-scheme: dark) {\n  .tooltip__button--data:not(.tooltip__button--data--bitwarden)::before {\n    filter: var(--hover-effect-dark);\n    opacity: .9;\n  }\n  .tooltip__button--data.no-hover-effect::before,\n  .wrapper:not(.top-autofill) .tooltip__button--data.no-hover-effect::before {\n    filter: none;\n    opacity: 1;\n  }\n  .tooltip__button--data.currentFocus:not(.tooltip__button--data--bitwarden)::before,\n  .wrapper:not(.top-autofill) .tooltip__button--data:not(.tooltip__button--data--bitwarden):hover::before {\n    filter: var(--hover-effect-dark);\n  }\n  .tooltip__button--data.currentFocus.no-hover-effect::before,\n  .tooltip__button--data.no-hover-effect:hover::before,\n  .wrapper:not(.top-autofill) .tooltip__button--data.no-hover-effect:hover::before {\n    filter: none;\n  }\n}\n.tooltip__button__text-container {\n  margin: auto 0;\n  width: 100%;\n}\n.label {\n  display: block;\n  font-weight: 400;\n  letter-spacing: -0.25px;\n  color: var(--color-primary);\n  font-size: var(--font-size-primary);\n  line-height: 1;\n}\n.label + .label {\n  margin-top: 3px;\n}\n.label.label--medium {\n  font-weight: var(--font-weight);\n  letter-spacing: -0.25px;\n}\n.label.label--small {\n  font-size: var(--font-size-secondary);\n  font-weight: 400;\n  letter-spacing: 0.06px;\n  color: var(--color-secondary);\n}\n@media (prefers-color-scheme: dark) {\n  .tooltip--data .label {\n    color: var(--color-primary-dark);\n  }\n  .tooltip--data .label--medium {\n    color: var(--color-primary-dark);\n  }\n  .tooltip--data .label--small {\n    color: var(--color-secondary-dark);\n  }\n}\n.tooltip__button.currentFocus .label,\n.wrapper:not(.top-autofill) .tooltip__button:hover .label {\n  color: var(--hover-color-primary);\n  &.label--small {\n    color: var(--hover-color-secondary);\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .tooltip__button.currentFocus .label,\n  .wrapper:not(.top-autofill) .tooltip__button:hover .label {\n    color: var(--hover-color-primary-dark);\n    &.label--small {\n      color: var(--hover-color-secondary-dark);\n    }\n  }\n}\n.tooltip__button--secondary {\n  font-size: 13px;\n  padding: 5px 9px;\n  border-radius: var(--border-radius);\n  margin: 0;\n}\n.tooltip__button--data--credentials::before,\n.tooltip__button--data--credentials__current::before {\n  background-size: 20px;\n  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuOSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTUuNSA2YTIuNSAyLjUgMCAxIDEgMCA1IDIuNSAyLjUgMCAwIDEgMC01bTAgMS41YTEgMSAwIDEgMCAwIDIgMSAxIDAgMCAwIDAtMiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuOSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQuOTk4IDJBNy4wMDUgNy4wMDUgMCAwIDEgMjIgOS4wMDdhNy4wMDQgNy4wMDQgMCAwIDEtOC43MDUgNi43OTdjLS4xNjMtLjA0MS0uMjg2LjAwOC0uMzQ1LjA2N2wtMi41NTcgMi41NTlhMiAyIDAgMCAxLTEuNDE1LjU4NmgtLjk4MnYuNzM0QTIuMjUgMi4yNSAwIDAgMSA1Ljc0NSAyMmgtLjk5M2EyLjc1IDIuNzUgMCAwIDEtMi43NS0yLjczNUwyIDE4Ljc3YTMuNzUgMy43NSAwIDAgMSAxLjA5OC0yLjY3bDUuMDQtNS4wNDNjLjA2LS4wNi4xMDctLjE4My4wNjYtLjM0NmE3IDcgMCAwIDEtLjIwOC0xLjcwNEE3LjAwNCA3LjAwNCAwIDAgMSAxNC45OTggMm0wIDEuNWE1LjUwNCA1LjUwNCAwIDAgMC01LjMzNyA2Ljg0OGMuMTQ3LjU4OS4wMjcgMS4yNzktLjQ2MiAxLjc2OGwtNS4wNCA1LjA0NGEyLjI1IDIuMjUgMCAwIDAtLjY1OSAxLjYwM2wuMDAzLjQ5NGExLjI1IDEuMjUgMCAwIDAgMS4yNSAxLjI0M2guOTkyYS43NS43NSAwIDAgMCAuNzUtLjc1di0uNzM0YTEuNSAxLjUgMCAwIDEgMS41LTEuNWguOTgzYS41LjUgMCAwIDAgLjM1My0uMTQ3bDIuNTU4LTIuNTU5Yy40OS0uNDkgMS4xOC0uNjA5IDEuNzctLjQ2MWE1LjUwNCA1LjUwNCAwIDAgMCA2Ljg0LTUuMzQyQTUuNTA1IDUuNTA1IDAgMCAwIDE1IDMuNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4K);\n}\n.tooltip__button--data--credentials__new::before {\n  background-size: 20px;\n  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTExLjIyNCA0LjY0YS45LjkgMCAwIDAgLjY0Ny0uMTY1IDUuNDcgNS40NyAwIDAgMSAzLjEyNy0uOTc1QTUuNTA0IDUuNTA0IDAgMCAxIDIwLjUgOS4wMDZhNS41MDQgNS41MDQgMCAwIDEtNi44NCA1LjM0M2MtLjU5LS4xNDgtMS4yODEtLjAyOC0xLjc3MS40NjJsLTIuNTU3IDIuNTU4YS41LjUgMCAwIDEtLjM1NC4xNDdoLS45ODJhMS41IDEuNSAwIDAgMC0xLjUgMS41di43MzRhLjc1Ljc1IDAgMCAxLS43NS43NWgtLjk5M2ExLjI1IDEuMjUgMCAwIDEtMS4yNS0xLjI0NGwtLjAwMy0uNDk0YTIuMjUgMi4yNSAwIDAgMSAuNjU5LTEuNjAybDUuMDQtNS4wNDNjLjM0My0uMzQ0LjQ2MS0uNzExLjQ3OS0xLjA5NS4wMjctLjU4Mi0uNzM3LS44NDctMS4xNzktLjQ2N2wtLjA2Ni4wNTZhLjcuNyAwIDAgMC0uMTU4LjIzMi44LjggMCAwIDEtLjEzNy4yMTNMMy4wOTggMTYuMUEzLjc1IDMuNzUgMCAwIDAgMiAxOC43N2wuMDAzLjQ5NEEyLjc1IDIuNzUgMCAwIDAgNC43NTMgMjJoLjk5MmEyLjI1IDIuMjUgMCAwIDAgMi4yNS0yLjI1di0uNzM0aC45ODNhMiAyIDAgMCAwIDEuNDE1LS41ODZsMi41NTctMi41NTljLjA1OS0uMDU5LjE4Mi0uMTA4LjM0Ni0uMDY3QTcuMDA0IDcuMDA0IDAgMCAwIDIyIDkuMDA2IDcuMDA0IDcuMDA0IDAgMCAwIDEwLjgyNiAzLjM4Yy0uNTMzLjM5NS0uMjYgMS4xNjYuMzk3IDEuMjZaIi8+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTUuNSA2YTIuNSAyLjUgMCAxIDEgMCA1IDIuNSAyLjUgMCAwIDEgMC01bTAgMS41YTEgMSAwIDEgMCAwIDIgMSAxIDAgMCAwIDAtMiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTcuMTI1IDIuODA0QzcgMi4xNiA2LjkxNSAyIDYuNSAyYy0uNDE0IDAtLjUuMTYtLjYyNS44MDQtLjA4LjQxMy0uMjEyIDEuODItLjI5NiAyLjc3NS0uOTU0LjA4NC0yLjM2Mi4yMTYtMi43NzUuMjk2QzIuMTYgNiAyIDYuMDg1IDIgNi41YzAgLjQxNC4xNjEuNS44MDQuNjI1LjQxMi4wOCAxLjgxOC4yMTIgMi43NzIuMjk2LjA4My45ODkuMjE4IDIuNDYxLjMgMi43NzUuMTI0LjQ4My4yMS44MDQuNjI0LjgwNHMuNS0uMTYuNjI1LS44MDRjLjA4LS40MTIuMjEyLTEuODE3LjI5Ni0yLjc3MS45OS0uMDg0IDIuNDYyLS4yMTkgMi43NzYtLjNDMTAuNjc5IDcgMTEgNi45MTUgMTEgNi41YzAtLjQxNC0uMTYtLjUtLjgwMy0uNjI1LS40MTMtLjA4LTEuODIxLS4yMTItMi43NzUtLjI5Ni0uMDg1LS45NTQtLjIxNi0yLjM2Mi0uMjk3LTIuNzc1bS00LjM0MiA4Ljc2MWEuNzgzLjc4MyAwIDEgMCAwLTEuNTY1Ljc4My43ODMgMCAwIDAgMCAxLjU2NSIvPgo8L3N2Zz4K);\n}\n.tooltip__button--data--creditCards::before,\n.tooltip__button--data--provider__generic::before {\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2IDRDMjkuMzEzNyA0IDMyIDYuNjg2MjkgMzIgMTBMMzIgMjJDMzIgMjUuMzEzNyAyOS4zMTM3IDI4IDI2IDI4TDYgMjhDMi42ODYyOSAyOCA5Ljc1Njk3ZS0wNyAyNS4zMTM3IDEuMTIwNTRlLTA2IDIyTDEuNjQ1MDhlLTA2IDEwQzEuNzg5OTNlLTA2IDYuNjg2MjkgMi42ODYyOSA0IDYgNEwyNiA0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMCAyMkwzMCAxMEMzMCA3Ljc5MDg2IDI4LjIwOTEgNiAyNiA2TDYgNkMzLjc5MDg2IDYgMiA3Ljc5MDg2IDIgMTBMMiAyMkMyIDI0LjIwOTEgMy43OTA4NiAyNiA2IDI2TDI2IDI2QzI4LjIwOTEgMjYgMzAgMjQuMjA5MSAzMCAyMlpNMzIgMTBDMzIgNi42ODYyOSAyOS4zMTM3IDQgMjYgNEw2IDRDMi42ODYyOSA0IDEuNzg5OTNlLTA2IDYuNjg2MjkgMS42NDUwOGUtMDYgMTBMMS4xMjA1NGUtMDYgMjJDOS43NTY5N2UtMDcgMjUuMzEzNyAyLjY4NjI5IDI4IDYgMjhMMjYgMjhDMjkuMzEzNyAyOCAzMiAyNS4zMTM3IDMyIDIyTDMyIDEwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNNCAxM0M0IDEyLjQ0NzcgNC40NDc3MiAxMiA1IDEySDlDOS41NTIyOCAxMiAxMCAxMi40NDc3IDEwIDEzVjE1QzEwIDE1LjU1MjMgOS41NTIyOCAxNiA5IDE2SDVDNC40NDc3MiAxNiA0IDE1LjU1MjMgNCAxNVYxM1oiIGZpbGw9IiNGRkQ2NUMiLz4KPHBhdGggZD0iTTQgMjBDNCAxOS40NDc3IDQuNDQ3NzIgMTkgNSAxOUgxMEMxMC41NTIzIDE5IDExIDE5LjQ0NzcgMTEgMjBDMTEgMjAuNTUyMyAxMC41NTIzIDIxIDEwIDIxSDVDNC40NDc3MiAyMSA0IDIwLjU1MjMgNCAyMFoiIGZpbGw9IiNBQUFBQUEiLz4KPHBhdGggZD0iTTEyIDIwQzEyIDE5LjQ0NzcgMTIuNDQ3NyAxOSAxMyAxOUgxNEMxNC41NTIzIDE5IDE1IDE5LjQ0NzcgMTUgMjBDMTUgMjAuNTUyMyAxNC41NTIzIDIxIDE0IDIxSDEzQzEyLjQ0NzcgMjEgMTIgMjAuNTUyMyAxMiAyMFoiIGZpbGw9IiNBQUFBQUEiLz4KPHBhdGggZD0iTTE2IDIwQzE2IDE5LjQ0NzcgMTYuNDQ3NyAxOSAxNyAxOUgyN0MyNy41NTIzIDE5IDI4IDE5LjQ0NzcgMjggMjBDMjggMjAuNTUyMyAyNy41NTIzIDIxIDI3IDIxSDE3QzE2LjQ0NzcgMjEgMTYgMjAuNTUyMyAxNiAyMFoiIGZpbGw9IiNBQUFBQUEiLz4KPC9zdmc+Cg==);\n}\n.tooltip__button--data--provider__dinersClub::before {\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2IDRDMjkuMzEzNyA0IDMyIDYuNjg2MjkgMzIgMTBMMzIgMjJDMzIgMjUuMzEzNyAyOS4zMTM3IDI4IDI2IDI4TDYgMjhDMi42ODYyOSAyOCA5Ljc1Njk3ZS0wNyAyNS4zMTM3IDEuMTIwNTRlLTA2IDIyTDEuNjQ1MDhlLTA2IDEwQzEuNzg5OTNlLTA2IDYuNjg2MjkgMi42ODYyOSA0IDYgNEwyNiA0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMCAyMkwzMCAxMEMzMCA3Ljc5MDg2IDI4LjIwOTEgNiAyNiA2TDYgNkMzLjc5MDg2IDYgMiA3Ljc5MDg2IDIgMTBMMiAyMkMyIDI0LjIwOTEgMy43OTA4NiAyNiA2IDI2TDI2IDI2QzI4LjIwOTEgMjYgMzAgMjQuMjA5MSAzMCAyMlpNMzIgMTBDMzIgNi42ODYyOSAyOS4zMTM3IDQgMjYgNEw2IDRDMi42ODYyOSA0IDEuNzg5OTNlLTA2IDYuNjg2MjkgMS42NDUwOGUtMDYgMTBMMS4xMjA1NGUtMDYgMjJDOS43NTY5N2UtMDcgMjUuMzEzNyAyLjY4NjI5IDI4IDYgMjhMMjYgMjhDMjkuMzEzNyAyOCAzMiAyNS4zMTM3IDMyIDIyTDMyIDEwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTUuOTI5MTggMTcuODg5QzUuOTI5MTggMTcuNDg0NCA1LjcxODA2IDE3LjUxMSA1LjUxNjExIDE3LjUwNjhWMTcuMzg5OEM1LjY5MTIyIDE3LjM5ODQgNS44NzA3NyAxNy4zOTg0IDYuMDQ2MzUgMTcuMzk4NEM2LjIzNDk3IDE3LjM5ODQgNi40OTEwNiAxNy4zODk4IDYuODIzNzkgMTcuMzg5OEM3Ljk4NzM2IDE3LjM4OTggOC42MjExNiAxOC4xNjc3IDguNjIxMTYgMTguOTY0NEM4LjYyMTE2IDE5LjQxMDIgOC4zNjA1MyAyMC41MzAxIDYuNzY5NzQgMjAuNTMwMUM2LjU0MDc2IDIwLjUzMDEgNi4zMjkyOCAyMC41MjEyIDYuMTE4MTcgMjAuNTIxMkM1LjkxNjEzIDIwLjUyMTIgNS43MTgwNiAyMC41MjU0IDUuNTE2MTEgMjAuNTMwMVYyMC40MTNDNS43ODU0NCAyMC4zODU4IDUuOTE2MTMgMjAuMzc3IDUuOTI5MTggMjAuMDcxMVYxNy44ODlaTTYuMzY5NTggMTkuOTk5QzYuMzY5NTggMjAuMzQ1NiA2LjYxNjk3IDIwLjM4NTkgNi44MzcwNiAyMC4zODU5QzcuODA3OTQgMjAuMzg1OSA4LjEyNjUxIDE5LjY1MjcgOC4xMjY1MSAxOC45ODI1QzguMTI2NTEgMTguMTQxMiA3LjU4NzM5IDE3LjUzNCA2LjcyMDI2IDE3LjUzNEM2LjUzNTYyIDE3LjUzNCA2LjQ1MDY2IDE3LjU0NzEgNi4zNjk1OCAxNy41NTJWMTkuOTk5WiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTguNzc3ODMgMjAuNDEzMkg4Ljg2Mjk4QzguOTg4NzYgMjAuNDEzMiA5LjA3ODcyIDIwLjQxMzIgOS4wNzg3MiAyMC4yNjQ0VjE5LjA0NTNDOS4wNzg3MiAxOC44NDc3IDkuMDExNDQgMTguODIwMyA4Ljg0NDkzIDE4LjczMDZWMTguNjU4OEM5LjA1NjE0IDE4LjU5NTIgOS4zMDc5NyAxOC41MTA0IDkuMzI1NzQgMTguNDk2OEM5LjM1NzQgMTguNDc4OCA5LjM4Mzk2IDE4LjQ3MzkgOS40MDY4MiAxOC40NzM5QzkuNDI4ODUgMTguNDczOSA5LjQzODEgMTguNTAxIDkuNDM4MSAxOC41MzczVjIwLjI2NDRDOS40MzgxIDIwLjQxMzIgOS41MzcxMyAyMC40MTMyIDkuNjYzMSAyMC40MTMySDkuNzM5MThWMjAuNTMwMkM5LjU4NjM3IDIwLjUzMDIgOS40Mjg4NSAyMC41MjEzIDkuMjY3NjIgMjAuNTIxM0M5LjEwNTg0IDIwLjUyMTMgOC45NDM5NiAyMC41MjU1IDguNzc3ODMgMjAuNTMwMlYyMC40MTMyWk05LjI1ODI5IDE3Ljc4MTNDOS4xNDEyMSAxNy43ODEzIDkuMDM4MTEgMTcuNjczNCA5LjAzODExIDE3LjU1NjVDOS4wMzgxMSAxNy40NDM4IDkuMTQ2MTIgMTcuMzQwMSA5LjI1ODI5IDE3LjM0MDFDOS4zNzQ5MSAxNy4zNDAxIDkuNDc4NTcgMTcuNDM0OSA5LjQ3ODU3IDE3LjU1NjVDOS40Nzg1NyAxNy42NzgxIDkuMzc5NDQgMTcuNzgxMyA5LjI1ODI5IDE3Ljc4MTNaIiBmaWxsPSIjMUExOTE5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAuMTY2NyAxOS4wNzIzQzEwLjE2NjcgMTguOTA2MSAxMC4xMTcgMTguODYxMiA5LjkwNjIxIDE4Ljc3NTZWMTguNjkwMkMxMC4wOTkxIDE4LjYyNzIgMTAuMjgzMiAxOC41Njg1IDEwLjQ5OTEgMTguNDczOUMxMC41MTI3IDE4LjQ3MzkgMTAuNTI1OCAxOC40ODI5IDEwLjUyNTggMTguNTE4OFYxOC44MTE0QzEwLjc4MjMgMTguNjI3MiAxMS4wMDI1IDE4LjQ3MzkgMTEuMzA0IDE4LjQ3MzlDMTEuNjg1NCAxOC40NzM5IDExLjgyMDIgMTguNzUyOSAxMS44MjAyIDE5LjEwMzhWMjAuMjY0M0MxMS44MjAyIDIwLjQxMzEgMTEuOTE5MyAyMC40MTMxIDEyLjA0NSAyMC40MTMxSDEyLjEyNjFWMjAuNTMwMkMxMS45NjgzIDIwLjUzMDIgMTEuODExMiAyMC41MjEzIDExLjY0OTYgMjAuNTIxM0MxMS40ODc4IDIwLjUyMTMgMTEuMzI1OSAyMC41MjU0IDExLjE2NDEgMjAuNTMwMlYyMC40MTMxSDExLjI0NTJDMTEuMzcxIDIwLjQxMzEgMTEuNDYwNSAyMC40MTMxIDExLjQ2MDUgMjAuMjY0M1YxOS4wOTk2QzExLjQ2MDUgMTguODQyOSAxMS4zMDQgMTguNzE3IDExLjA0NzYgMTguNzE3QzEwLjkwMzcgMTguNzE3IDEwLjY3NDUgMTguODMzOCAxMC41MjU4IDE4LjkzMzJWMjAuMjY0M0MxMC41MjU4IDIwLjQxMzEgMTAuNjI1MSAyMC40MTMxIDEwLjc1MDkgMjAuNDEzMUgxMC44MzE2VjIwLjUzMDJDMTAuNjc0NSAyMC41MzAyIDEwLjUxNzIgMjAuNTIxMyAxMC4zNTUxIDIwLjUyMTNDMTAuMTkzNyAyMC41MjEzIDEwLjAzMTcgMjAuNTI1NCA5Ljg3MDEyIDIwLjUzMDJWMjAuNDEzMUg5Ljk1MTE5QzEwLjA3NjkgMjAuNDEzMSAxMC4xNjY3IDIwLjQxMzEgMTAuMTY2NyAyMC4yNjQzVjE5LjA3MjNaIiBmaWxsPSIjMUExOTE5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuNDY3NSAxOS4yODg2QzEyLjQ1ODMgMTkuMzI5MSAxMi40NTgzIDE5LjM5NjQgMTIuNDY3NSAxOS41NDk1QzEyLjQ5MzkgMTkuOTc2OCAxMi43Njg2IDIwLjMyNzUgMTMuMTI3NyAyMC4zMjc1QzEzLjM3NTIgMjAuMzI3NSAxMy41Njg2IDIwLjE5MjUgMTMuNzM0NSAyMC4wMjY0TDEzLjc5NzMgMjAuMDg5NEMxMy41OTA1IDIwLjM2MzcgMTMuMzM0NSAyMC41OTc4IDEyLjk2NjMgMjAuNTk3OEMxMi4yNTE2IDIwLjU5NzggMTIuMTA3OSAxOS45MDQ2IDEyLjEwNzkgMTkuNjE2OUMxMi4xMDc5IDE4LjczNSAxMi43MDA5IDE4LjQ3MzkgMTMuMDE1MSAxOC40NzM5QzEzLjM3OTUgMTguNDczOSAxMy43NzA3IDE4LjcwMzMgMTMuNzc0OSAxOS4xODAzQzEzLjc3NDkgMTkuMjA3NyAxMy43NzQ5IDE5LjIzNDQgMTMuNzcwNyAxOS4yNjE0TDEzLjczMDEgMTkuMjg4NkgxMi40Njc1Wk0xMy4yNjI3IDE5LjE0NDRDMTMuMzc0NyAxOS4xNDQ0IDEzLjM4NzkgMTkuMDg1OCAxMy4zODc5IDE5LjAzMTZDMTMuMzg3OSAxOC44MDI2IDEzLjI0ODcgMTguNjE4MSAxMi45OTY5IDE4LjYxODFDMTIuNzIzMSAxOC42MTgxIDEyLjUzNDMgMTguODIwMiAxMi40ODA0IDE5LjE0NDRIMTMuMjYyN1oiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy44Nzg0IDIwLjQxMzFIMTMuOTk5OEMxNC4xMjUyIDIwLjQxMzEgMTQuMjE1MSAyMC40MTMxIDE0LjIxNTEgMjAuMjY0M1YxOS4wMDA0QzE0LjIxNTEgMTguODYxMiAxNC4wNDkgMTguODMzOCAxMy45ODE1IDE4Ljc5NzhWMTguNzMwNkMxNC4zMDk1IDE4LjU5MSAxNC40ODk0IDE4LjQ3MzkgMTQuNTMwNSAxOC40NzM5QzE0LjU1NjcgMTguNDczOSAxNC41NzAyIDE4LjQ4NzQgMTQuNTcwMiAxOC41MzI2VjE4LjkzNzZIMTQuNTc5N0MxNC42OTE3IDE4Ljc2MjIgMTQuODgwOCAxOC40NzM5IDE1LjE1NDcgMTguNDczOUMxNS4yNjcgMTguNDczOSAxNS40MTA2IDE4LjU1MDMgMTUuNDEwNiAxOC43MTI0QzE1LjQxMDYgMTguODMzOCAxNS4zMjU3IDE4Ljk0MjMgMTUuMTk5OSAxOC45NDIzQzE1LjA2MDEgMTguOTQyMyAxNS4wNjAxIDE4LjgzMzggMTQuOTAyNyAxOC44MzM4QzE0LjgyNjQgMTguODMzOCAxNC41NzQ4IDE4LjkzNzYgMTQuNTc0OCAxOS4yMDc3VjIwLjI2NDNDMTQuNTc0OCAyMC40MTMxIDE0LjY2NDYgMjAuNDEzMSAxNC43OTA0IDIwLjQxMzFIMTUuMDQxOFYyMC41MzAyQzE0Ljc5NDcgMjAuNTI1NCAxNC42MDY2IDIwLjUyMTMgMTQuNDEzMiAyMC41MjEzQzE0LjIyODkgMjAuNTIxMyAxNC4wNDAxIDIwLjUyNTQgMTMuODc4NCAyMC41MzAyVjIwLjQxMzFaIiBmaWxsPSIjMUExOTE5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTUuNjA4MiAxOS45MDQ2QzE1LjY2NjggMjAuMjAxNSAxNS44NDYyIDIwLjQ1MzggMTYuMTc0OCAyMC40NTM4QzE2LjQzOTUgMjAuNDUzOCAxNi41MzgzIDIwLjI5MTYgMTYuNTM4MyAyMC4xMzQzQzE2LjUzODMgMTkuNjAzMSAxNS41NTkgMTkuNzc0MyAxNS41NTkgMTkuMDVDMTUuNTU5IDE4Ljc5NzggMTUuNzYxMyAxOC40NzM5IDE2LjI1NTYgMTguNDczOUMxNi4zOTkyIDE4LjQ3MzkgMTYuNTkyMyAxOC41MTQ3IDE2Ljc2NzUgMTguNjA0OEwxNi43OTkgMTkuMDYzM0gxNi42OTU3QzE2LjY1MDggMTguNzggMTYuNDkzOCAxOC42MTgxIDE2LjIwNTggMTguNjE4MUMxNi4wMjYxIDE4LjYxODEgMTUuODU1NSAxOC43MjE0IDE1Ljg1NTUgMTguOTE0OUMxNS44NTU1IDE5LjQ0MTYgMTYuODk3OCAxOS4yNzk0IDE2Ljg5NzggMTkuOTg1N0MxNi44OTc4IDIwLjI4MjQgMTYuNjU5OSAyMC41OTc4IDE2LjEyNSAyMC41OTc4QzE1Ljk0NTQgMjAuNTk3OCAxNS43MzM4IDIwLjUzNDcgMTUuNTc3IDIwLjQ0NDdMMTUuNTI3MyAxOS45MjczTDE1LjYwODIgMTkuOTA0NloiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMC45NTUgMTguMjAzOUgyMC44NDI5QzIwLjc1NzQgMTcuNjc4IDIwLjM4NDQgMTcuNDY2MyAxOS44ODE1IDE3LjQ2NjNDMTkuMzY0MSAxNy40NjYzIDE4LjYxNCAxNy44MTI1IDE4LjYxNCAxOC44OTIyQzE4LjYxNCAxOS44MDEzIDE5LjI2MTMgMjAuNDUzNyAxOS45NTMxIDIwLjQ1MzdDMjAuMzk3NiAyMC40NTM3IDIwLjc2NjkgMjAuMTQ3NyAyMC44NTY1IDE5LjY3NUwyMC45NTk5IDE5LjcwMTlMMjAuODU2NSAyMC4zNTlDMjAuNjY3OCAyMC40NzYxIDIwLjE1OTkgMjAuNTk3NyAxOS44NjMgMjAuNTk3N0MxOC44MTIgMjAuNTk3NyAxOC4xNDcgMTkuOTE4MiAxOC4xNDcgMTguOTA2MUMxOC4xNDcgMTcuOTgzNSAxOC45NjkzIDE3LjMyMiAxOS44NSAxNy4zMjJDMjAuMjEzOSAxNy4zMjIgMjAuNTY0MyAxNy40MzkzIDIwLjkxMDMgMTcuNTYwOUwyMC45NTUgMTguMjAzOVoiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMS4xMTcyIDIwLjQxMzFIMjEuMjAyMkMyMS4zMjg1IDIwLjQxMzEgMjEuNDE4MiAyMC40MTMxIDIxLjQxODIgMjAuMjY0M1YxNy43NTkxQzIxLjQxODIgMTcuNDY2NCAyMS4zNTA5IDE3LjQ1NzUgMjEuMTc5OSAxNy40MDc5VjE3LjMzNThDMjEuMzU5NiAxNy4yNzc0IDIxLjU0ODUgMTcuMTk2NiAyMS42NDMxIDE3LjE0MjJDMjEuNjkxOCAxNy4xMTU2IDIxLjcyODEgMTcuMDkyNyAyMS43NDE0IDE3LjA5MjdDMjEuNzY4OSAxNy4wOTI3IDIxLjc3NzcgMTcuMTIgMjEuNzc3NyAxNy4xNTYxVjIwLjI2NDNDMjEuNzc3NyAyMC40MTMxIDIxLjg3NjcgMjAuNDEzMSAyMi4wMDI0IDIwLjQxMzFIMjIuMDc4NFYyMC41MzAyQzIxLjkyNjEgMjAuNTMwMiAyMS43Njg5IDIwLjUyMTMgMjEuNjA3IDIwLjUyMTNDMjEuNDQ1MyAyMC41MjEzIDIxLjI4MzcgMjAuNTI1NCAyMS4xMTcyIDIwLjUzMDJWMjAuNDEzMVoiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNC4wMDI0IDIwLjI4MjNDMjQuMDAyNCAyMC4zNjM2IDI0LjA1MTYgMjAuMzY3OSAyNC4xMjc4IDIwLjM2NzlDMjQuMTgyIDIwLjM2NzkgMjQuMjQ5MSAyMC4zNjM2IDI0LjMwOCAyMC4zNjM2VjIwLjQ1ODNDMjQuMTE0NiAyMC40NzYxIDIzLjc0NiAyMC41NzA2IDIzLjY2MDUgMjAuNTk3N0wyMy42MzgxIDIwLjU4MzlWMjAuMjE5NUMyMy4zNjg3IDIwLjQzOTkgMjMuMTYxOCAyMC41OTc3IDIyLjg0MjMgMjAuNTk3N0MyMi41OTk3IDIwLjU5NzcgMjIuMzQ4MiAyMC40Mzk5IDIyLjM0ODIgMjAuMDYyNFYxOC45MTA0QzIyLjM0ODIgMTguNzkzMiAyMi4zMzA0IDE4LjY4MDcgMjIuMDc5MSAxOC42NTg2VjE4LjU3MjlDMjIuMjQxIDE4LjU2ODQgMjIuNTk5NyAxOC41NDE2IDIyLjY1ODMgMTguNTQxNkMyMi43MDgyIDE4LjU0MTYgMjIuNzA4MiAxOC41NzI5IDIyLjcwODIgMTguNjcyVjE5LjgzMjZDMjIuNzA4MiAxOS45Njc3IDIyLjcwODIgMjAuMzU0MiAyMy4wOTkgMjAuMzU0MkMyMy4yNTE2IDIwLjM1NDIgMjMuNDUzOCAyMC4yMzc2IDIzLjY0MjQgMjAuMDgwM1YxOC44Njk4QzIzLjY0MjQgMTguNzc5OSAyMy40MjY5IDE4LjczMDQgMjMuMjY1MyAxOC42ODU3VjE4LjYwNDhDMjMuNjY5MyAxOC41NzczIDIzLjkyMTMgMTguNTQxNiAyMy45NjYyIDE4LjU0MTZDMjQuMDAyNCAxOC41NDE2IDI0LjAwMjQgMTguNTcyOSAyNC4wMDI0IDE4LjYyMjZWMjAuMjgyM1oiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNC44OTY1IDE4Ljc5NzhDMjUuMDc2MiAxOC42NDUyIDI1LjMxODkgMTguNDczOSAyNS41NjYxIDE4LjQ3MzlDMjYuMDg3NCAxOC40NzM5IDI2LjQwMiAxOC45Mjg4IDI2LjQwMiAxOS40MTlDMjYuNDAyIDIwLjAwODIgMjUuOTcwNCAyMC41OTc4IDI1LjMyNzYgMjAuNTk3OEMyNC45OTU0IDIwLjU5NzggMjQuODIwMSAyMC40ODk1IDI0LjcwMyAyMC40NEwyNC41Njg2IDIwLjU0MzVMMjQuNDc0NCAyMC40OTQyQzI0LjUxNDYgMjAuMjI4OCAyNC41MzcyIDE5Ljk2NzkgMjQuNTM3MiAxOS42OTMzVjE3Ljc1OTFDMjQuNTM3MiAxNy40NjY0IDI0LjQ2OTYgMTcuNDU3NSAyNC4yOTg4IDE3LjQwNzlWMTcuMzM1OEMyNC40Nzg4IDE3LjI3NzQgMjQuNjY3MyAxNy4xOTY2IDI0Ljc2MTYgMTcuMTQyMkMyNC44MTEyIDE3LjExNTYgMjQuODQ3IDE3LjA5MjcgMjQuODYwNyAxNy4wOTI3QzI0Ljg4NzUgMTcuMDkyNyAyNC44OTY1IDE3LjEyMDEgMjQuODk2NSAxNy4xNTYxVjE4Ljc5NzhaTTI0Ljg5NjMgMjAuMDIxN0MyNC44OTYzIDIwLjE5MjYgMjUuMDU4MiAyMC40ODA3IDI1LjM1OTIgMjAuNDgwN0MyNS44Mzk5IDIwLjQ4MDcgMjYuMDQyIDIwLjAwODMgMjYuMDQyIDE5LjYwNzdDMjYuMDQyIDE5LjEyMTkgMjUuNjc0IDE4LjcxNzEgMjUuMzIzNiAxOC43MTcxQzI1LjE1NjYgMTguNzE3MSAyNS4wMTc2IDE4LjgyNTIgMjQuODk2MyAxOC45Mjg4VjIwLjAyMTdaIiBmaWxsPSIjMUExOTE5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy45MzU3MyAyMi43MzdMNy45NDA2MyAyMi43MzIyVjIxLjgxNDRDNy45NDA2MyAyMS42MTM1IDcuODAxMDYgMjEuNTg0MiA3LjcyNzc2IDIxLjU4NDJINy42NzM4OVYyMS41MTA3QzcuNzg5MDMgMjEuNTEwNyA3LjkwMTQ4IDIxLjUyMDQgOC4wMTYyNSAyMS41MjA0QzguMTE2NDggMjEuNTIwNCA4LjIxNzE4IDIxLjUxMDcgOC4zMTcwNCAyMS41MTA3VjIxLjU4NDJIOC4yODA2N0M4LjE3NzY2IDIxLjU4NDIgOC4wNjI3MSAyMS42MDM3IDguMDYyNzEgMjEuODk1VjIzLjAwODlDOC4wNjI3MSAyMy4wOTQ3IDguMDY1MTEgMjMuMTgwMyA4LjA3NzE1IDIzLjI1NjNINy45ODQyMkw2LjcyNTIzIDIxLjg1MDhWMjIuODU5N0M2LjcyNTIzIDIzLjA3MjggNi43NjY2IDIzLjE0NTkgNi45NTQ4NSAyMy4xNDU5SDYuOTk2NVYyMy4yMTk1QzYuODkxMzYgMjMuMjE5NSA2Ljc4NjMxIDIzLjIwOTkgNi42ODExNyAyMy4yMDk5QzYuNTcxNDEgMjMuMjA5OSA2LjQ1ODc3IDIzLjIxOTUgNi4zNDg2MyAyMy4yMTk1VjIzLjE0NTlINi4zODI5N0M2LjU1MTYgMjMuMTQ1OSA2LjYwMjk3IDIzLjAzMDggNi42MDI5NyAyMi44MzU2VjIxLjgwNDFDNi42MDI5NyAyMS42NjcyIDYuNDkwMTUgMjEuNTg0MiA2LjM4MDU2IDIxLjU4NDJINi4zNDg2M1YyMS41MTA3QzYuNDQxMzcgMjEuNTEwNyA2LjUzNjg4IDIxLjUyMDQgNi42Mjk2MiAyMS41MjA0QzYuNzAzMiAyMS41MjA0IDYuNzc0MSAyMS41MTA3IDYuODQ3NCAyMS41MTA3TDcuOTM1NzMgMjIuNzM3WiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTguMDc4MjEgMjMuMjY2Nkw3Ljk3NzUxIDIzLjI2MzJMNi43MzY2NiAyMS44Nzg1VjIyLjg1OTdDNi43Mzk2MiAyMy4wNzI1IDYuNzcxOTIgMjMuMTMzMSA2Ljk1NjAxIDIzLjEzNTRINy4wMDgzOVYyMy4yM0g2Ljk5NzU2QzYuODkxNzggMjMuMjMgNi43ODY1NCAyMy4yMjAyIDYuNjgyMjQgMjMuMjIwMkM2LjU3Mjc1IDIzLjIyMDIgNi40NjAzOSAyMy4yMyA2LjM0OTYgMjMuMjNINi4zMzg4N1YyMy4xMzU0SDYuMzg0MDNDNi41NDU2MyAyMy4xMzQ0IDYuNTkxODEgMjMuMDMwNSA2LjU5MzU3IDIyLjgzNTVWMjEuODA0NkM2LjU5MzExIDIxLjY3NDIgNi40ODYzIDIxLjU5NDkgNi4zODE3MiAyMS41OTQ5SDYuMzM4ODdWMjEuNTAwMUg2LjM0OTZDNi40NDMwOCAyMS41MDAxIDYuNTM4NzggMjEuNTA5NiA2LjYzMDUgMjEuNTA5NkM2LjcwMzQzIDIxLjUwOTYgNi43NzQwNSAyMS41MDAxIDYuODU2NTEgMjEuNTAzOUw3LjkzMTA1IDIyLjcxNDlWMjEuODE0NUM3LjkyOTg1IDIxLjYyMDEgNy44MDAwOSAyMS41OTY0IDcuNzI4OTIgMjEuNTk0OUg3LjY2NDIyVjIxLjUwMDFINy42NzUwNUM3Ljc5MDU2IDIxLjUwMDEgNy45MDMxIDIxLjUwOTYgOC4wMTczMSAyMS41MDk2QzguMTE2OCAyMS41MDk2IDguMjE3MDQgMjEuNTAwMSA4LjMxODExIDIxLjUwMDFIOC4zMjg4NFYyMS41OTQ5SDguMjgxNzNDOC4xODA3NiAyMS41OTc0IDguMDc3MTkgMjEuNjA2MyA4LjA3NDIzIDIxLjg5NTFWMjMuMDA4OUM4LjA3NDIzIDIzLjA5NDYgOC4wNzY5MSAyMy4xOCA4LjA4ODY3IDIzLjI1NDRMOC4wOTA4OSAyMy4yNjY2SDguMDc4MjFaTTcuOTg1NDkgMjMuMjQ1Mkg4LjA2NjM4QzguMDU1NDYgMjMuMTcxNSA4LjA1MzUyIDIzLjA5MDMgOC4wNTM1MiAyMy4wMDg4VjIxLjg5NUM4LjA1MzUyIDIxLjYwMTIgOC4xNzY1MiAyMS41NzM1IDguMjgxODQgMjEuNTczM0g4LjMwNzU3VjIxLjUyMTJDOC4yMTEyMyAyMS41MjIgOC4xMTQ2OSAyMS41MzA5IDguMDE3NDIgMjEuNTMwOUM3LjkwNTQzIDIxLjUzMDkgNy43OTY1OSAyMS41MjIgNy42ODYwOCAyMS41MjEyTDcuNjg1OCAyMS41NzMzSDcuNzI5MDNDNy44MDQxOCAyMS41NzM1IDcuOTUyMzYgMjEuNjA2OSA3Ljk1MjM2IDIxLjgxNDRMNy45NDkxMiAyMi43Mzk4TDcuOTQ0MyAyMi43NDQ2TDcuOTM1OTcgMjIuNzUyNEw2Ljg0ODU3IDIxLjUyMTJDNi43NzU5MiAyMS41MjEyIDYuNzA1MjEgMjEuNTMwOSA2LjYzMDYxIDIxLjUzMDlDNi41NDEwMiAyMS41MzA5IDYuNDQ5MjEgMjEuNTIyIDYuMzYwNTQgMjEuNTIxMkw2LjM2MDA4IDIxLjU3MzNINi4zODE4M0M2LjQ5NjUgMjEuNTczNSA2LjYxNDUxIDIxLjY2MTEgNi42MTQ1MSAyMS44MDQ1VjIyLjgzNTVDNi42MTQ1MSAyMy4wMzE0IDYuNTU5OTkgMjMuMTU2NCA2LjM4NDE0IDIzLjE1NzFMNi4zNjA1NCAyMy4xNTY0VjIzLjIwOUM2LjQ2NjQyIDIzLjIwODIgNi41NzU1NCAyMy4xOTkyIDYuNjgyMzUgMjMuMTk5MkM2Ljc4NDM0IDIzLjE5OTIgNi44ODYxNSAyMy4yMDgyIDYuOTg3MDMgMjMuMjA5VjIzLjE1NzFINi45NTYxMkM2Ljc2MzcgMjMuMTU2NCA2LjcxNjA0IDIzLjA3MjUgNi43MTU4NSAyMi44NTk2VjIxLjgyMzRMNy45ODU0OSAyMy4yNDUyWk03LjkzNzIzIDIyLjczNjlMNy45NDQ5MSAyMi43Mjk5TDcuOTM3MjMgMjIuNzM2OVpNNy45MzA5MiAyMi43MzIyVjIyLjczMTNMNy45Mjg5OCAyMi43Mjk3TDcuOTMwOTIgMjIuNzMyMloiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjY4MzYxIDIxLjYzMzFDOC40OTk5OCAyMS42MzMxIDguNDkyODYgMjEuNjc3MyA4LjQ1NjIxIDIxLjg1NThIOC4zODI4MUM4LjM5MjQ0IDIxLjc4NzIgOC40MDQ1NiAyMS43MTg4IDguNDEyMTUgMjEuNjQ3OEM4LjQyMTk2IDIxLjU3ODkgOC40MjY4NyAyMS41MTA2IDguNDI2ODcgMjEuNDM5OEg4LjQ4NTQ1QzguNTA1MTcgMjEuNTEzMyA4LjU2NjI1IDIxLjUxMDYgOC42MzI2MSAyMS41MTA2SDkuODkzNzNDOS45NjAwOSAyMS41MTA2IDEwLjAyMTEgMjEuNTA4MiAxMC4wMjYxIDIxLjQzNDhMMTAuMDg0NSAyMS40NDQ4QzEwLjA3NSAyMS41MTA2IDEwLjA2NSAyMS41NzY4IDEwLjA1NzkgMjEuNjQzMUMxMC4wNTMxIDIxLjcwOTEgMTAuMDUzMSAyMS43NzUgMTAuMDUzMSAyMS44NDExTDkuOTc5NjIgMjEuODY4M0M5Ljk3NDYzIDIxLjc3NzkgOS45NjI1IDIxLjYzMzEgOS43OTg2OCAyMS42MzMxSDkuMzk3NjVWMjIuOTM1NEM5LjM5NzY1IDIzLjEyNDMgOS40ODMzNiAyMy4xNDU5IDkuNjAwNTMgMjMuMTQ1OUg5LjY0NzE3VjIzLjIxOTRDOS41NTE3NSAyMy4yMTk0IDkuMzgwNTMgMjMuMjEgOS4yNDg3MyAyMy4yMUM5LjEwMTg1IDIzLjIxIDguOTMwNTQgMjMuMjE5NCA4LjgzNTEyIDIzLjIxOTRWMjMuMTQ1OUg4Ljg4MTc2QzkuMDE2NTIgMjMuMTQ1OSA5LjA4NDY0IDIzLjEzMzggOS4wODQ2NCAyMi45NDA1VjIxLjYzMzFIOC42ODM2MVoiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjY0Nzg2IDIzLjIyOTlDOS41NTE1MSAyMy4yMjk5IDkuMzgwNDcgMjMuMjIwMiA5LjI0OTIzIDIzLjIyMDJDOS4xMDI1NCAyMy4yMjAyIDguOTMxNSAyMy4yMjk5IDguODM1NjIgMjMuMjI5OUg4LjgyNTE2VjIzLjEzNTNIOC44ODIyNkM5LjAxNzAyIDIzLjEzMjIgOS4wNzExNiAyMy4xMzA0IDkuMDc0MjIgMjIuOTQwNlYyMS42NDM1SDguNjg0MTFWMjEuNjIyMUg5LjA5NTQxVjIyLjk0MDZDOS4wOTU0MSAyMy4xMzcxIDkuMDE2MjggMjMuMTU2OSA4Ljg4MjI2IDIzLjE1NzFIOC44NDYwN1YyMy4yMDg4QzguOTQyNTEgMjMuMjA4MiA5LjEwNzI2IDIzLjE5OTIgOS4yNDkyMyAyMy4xOTkyQzkuMzc2NDkgMjMuMTk5MiA5LjUzOTg1IDIzLjIwODIgOS42MzY3NSAyMy4yMDg4VjIzLjE1NzFIOS42MDEwM0M5LjQ4Mjc0IDIzLjE1NjkgOS4zODc2IDIzLjEyNzggOS4zODc2IDIyLjkzNTVWMjEuNjIyMUg5Ljc5OTE4QzkuOTYzMTggMjEuNjIyOCA5Ljk4NDkzIDIxLjc2MjMgOS45OTAwMiAyMS44NTM0TDEwLjA0MyAyMS44MzM5QzEwLjA0MyAyMS43Njk5IDEwLjA0MzIgMjEuNzA1OSAxMC4wNDc2IDIxLjY0MTZDMTAuMDU0OCAyMS41NzgzIDEwLjA2MzcgMjEuNTE2MSAxMC4wNzI5IDIxLjQ1MzRMMTAuMDM1NyAyMS40NDcyQzEwLjAyNDQgMjEuNTE4NSA5Ljk1NTQxIDIxLjUyMjMgOS44OTQxNCAyMS41MjEzSDguNjIwMzRDOC41NjI3NyAyMS41MjE0IDguNTAwMTEgMjEuNTE4NiA4LjQ3ODA4IDIxLjQ1MDNIOC40Mzc3M0M4LjQzNzM2IDIxLjUxOCA4LjQzMjczIDIxLjU4MzcgOC40MjM0OCAyMS42NDg5QzguNDE2MTcgMjEuNzE2MiA4LjQwNDk3IDIxLjc4MDggOC4zOTYwOCAyMS44NDU2SDguNDQ4MjhDOC40ODA0IDIxLjY3NDkgOC41MDEzMiAyMS42MTk3IDguNjg0MTEgMjEuNjIyMVYyMS42NDM1QzguNTAyOTggMjEuNjQ3MiA4LjUwNjk2IDIxLjY3NzUgOC40NjcwNyAyMS44NTgzTDguNDY1MzEgMjEuODY2N0g4LjM3MTA5TDguMzcyMzkgMjEuODU0QzguMzgyMzkgMjEuNzg1NyA4LjM5NDc5IDIxLjcxNjkgOC40MDE5MSAyMS42NDU5QzguNDEyMDkgMjEuNTc3OSA4LjQxNjcyIDIxLjUxIDguNDE2NzIgMjEuNDM5OVYyMS40MjlIOC40OTQzN0w4LjQ5NjIyIDIxLjQzNjdDOC41MTI3IDIxLjQ5ODQgOC41NTc5NiAyMS40OTg5IDguNjIwMzQgMjEuNUg5Ljg5NDE0QzkuOTYyMjYgMjEuNDk4OSAxMC4wMTE5IDIxLjQ5OCAxMC4wMTYgMjEuNDMzOUwxMC4wMTY5IDIxLjQyMjRMMTAuMDI4IDIxLjQyNDZMMTAuMDk3MSAyMS40MzU1TDEwLjA5NTMgMjEuNDQ2NEMxMC4wODU2IDIxLjUxMjEgMTAuMDc2MSAyMS41Nzc5IDEwLjA2ODcgMjEuNjQzNUMxMC4wNjQyIDIxLjcwOTIgMTAuMDY0MiAyMS43NzQ5IDEwLjA2NDIgMjEuODQxMVYyMS44NDg1TDEwLjA1NyAyMS44NTE0TDkuOTcwNSAyMS44ODMxTDkuOTY5OTQgMjEuODY4OUM5Ljk2MzE4IDIxLjc3NjggOS45NTM3NCAyMS42NDM1IDkuNzk5MTggMjEuNjQzNUg5LjQwODg5VjIyLjkzNTVDOS40MTEyOSAyMy4xMiA5LjQ4NDQxIDIzLjEzMyA5LjYwMTAzIDIzLjEzNTNIOS42NTgyMlYyMy4yMjk5SDkuNjQ3ODZaIiBmaWxsPSIjMUExOTE5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAuMTYyNiAyMy4xNDU5SDEwLjE5N0MxMC4yODQ4IDIzLjE0NTkgMTAuMzc4IDIzLjEzMzkgMTAuMzc4IDIzLjAwNjRWMjEuNzI0QzEwLjM3OCAyMS41OTY0IDEwLjI4NDggMjEuNTg0MyAxMC4xOTcgMjEuNTg0M0gxMC4xNjI2VjIxLjUxMDdDMTAuMzExMiAyMS41MTA3IDEwLjU2NjEgMjEuNTIwNCAxMC43NzExIDIxLjUyMDRDMTAuOTc2OSAyMS41MjA0IDExLjIzMDggMjEuNTEwNyAxMS4zOTcxIDIxLjUxMDdDMTEuMzkyOCAyMS42MTU5IDExLjM5NTEgMjEuNzc3OSAxMS40MDIzIDIxLjg4NTRMMTEuMzI4NyAyMS45MDQ5QzExLjMxNjkgMjEuNzQ1NyAxMS4yODc2IDIxLjYxODcgMTEuMDMwNyAyMS42MTg3SDEwLjY5MTNWMjIuMjU5N0gxMC45ODE3QzExLjEyODQgMjIuMjU5NyAxMS4xNjAzIDIyLjE3NjcgMTEuMTc0OCAyMi4wNDQ0SDExLjI0ODFDMTEuMjQzMiAyMi4xNCAxMS4yNDA3IDIyLjIzNTUgMTEuMjQwNyAyMi4zMzA4QzExLjI0MDcgMjIuNDI0MSAxMS4yNDMyIDIyLjUxNyAxMS4yNDgxIDIyLjYwOThMMTEuMTc0OCAyMi42MjQ1QzExLjE2MDMgMjIuNDc3OCAxMS4xNTMgMjIuMzgyNCAxMC45ODQxIDIyLjM4MjRIMTAuNjkxM1YyMi45NTI0QzEwLjY5MTMgMjMuMTExOCAxMC44MzI1IDIzLjExMTggMTAuOTg5MSAyMy4xMTE4QzExLjI4MjYgMjMuMTExOCAxMS40MTIxIDIzLjA5MjEgMTEuNDg1NSAyMi44MTMzTDExLjU1MzcgMjIuODMwMkMxMS41MjE5IDIyLjk2MDIgMTEuNDkyOCAyMy4wODk2IDExLjQ3MDggMjMuMjE5NUMxMS4zMTQxIDIzLjIxOTUgMTEuMDMzIDIzLjIxIDEwLjgxMzMgMjMuMjFDMTAuNTkyOCAyMy4yMSAxMC4zMDIxIDIzLjIxOTUgMTAuMTYyNiAyMy4yMTk1VjIzLjE0NTlaIiBmaWxsPSIjMUExOTE5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNDcwOCAyMy4yM0MxMS4zMTM5IDIzLjIzIDExLjAzMjUgMjMuMjE5OCAxMC44MTMyIDIzLjIxOThDMTAuNTkyOSAyMy4yMTk4IDEwLjMwMjMgMjMuMjMgMTAuMTYyNiAyMy4yM0gxMC4xNTIzVjIzLjEzNTRIMTAuMTk3QzEwLjI4NTUgMjMuMTMzOSAxMC4zNjYgMjMuMTI2MSAxMC4zNjcyIDIzLjAwNjVWMjEuNzI0QzEwLjM2NiAyMS42MDQ0IDEwLjI4NTUgMjEuNTk2NCAxMC4xOTcgMjEuNTk0OUgxMC4xNTIzVjIxLjUwMDFIMTAuMTYyNkMxMC4zMTIgMjEuNTAwMSAxMC41NjYzIDIxLjUwOTYgMTAuNzcxMiAyMS41MDk2QzEwLjk3NjggMjEuNTA5NiAxMS4yMzA3IDIxLjUwMDEgMTEuMzk3MiAyMS41MDAxSDExLjQwOEwxMS40MDc2IDIxLjUxMTRDMTEuNDA2MSAyMS41NDggMTEuNDA1IDIxLjU5MTUgMTEuNDA1IDIxLjYzNzZDMTEuNDA1IDIxLjcyMjIgMTEuNDA3NiAyMS44MTQ5IDExLjQxMjQgMjEuODg0NkwxMS40MTI5IDIxLjg5MzNMMTEuNDA0NyAyMS44OTU4TDExLjMxODcgMjEuOTE4M0wxMS4zMTgzIDIxLjkwNTdDMTEuMzAzOSAyMS43NDY5IDExLjI4MjYgMjEuNjMxNCAxMS4wMzA5IDIxLjYyOUgxMC43MDEzTDEwLjcwMTEgMjIuMjQ5SDEwLjk4MTdDMTEuMTIyNyAyMi4yNDc1IDExLjE0NzggMjIuMTc1NCAxMS4xNjQ1IDIyLjA0MzNMMTEuMTY1MSAyMi4wMzM1SDExLjI1OTFMMTEuMjU4OSAyMi4wNDQ3QzExLjI1NDIgMjIuMTQwNCAxMS4yNTEzIDIyLjIzNTUgMTEuMjUxMyAyMi4zMzA5QzExLjI1MTMgMjIuNDIzNCAxMS4yNTQyIDIyLjUxNjQgMTEuMjU4OSAyMi42MDk0TDExLjI1OTEgMjIuNjE4M0wxMS4yNTAyIDIyLjYyMDRMMTEuMTY1MSAyMi42MzczTDExLjE2NDUgMjIuNjI1OEMxMS4xNDc2IDIyLjQ3NjQgMTEuMTQ2NSAyMi4zOTQ0IDEwLjk4NDIgMjIuMzkyN0gxMC43MDEzVjIyLjk1MjVDMTAuNzAxNiAyMy4xMDEzIDEwLjgyOTcgMjMuMTAwNCAxMC45ODkxIDIzLjEwMTNDMTEuMjgzNSAyMy4wOTk1IDExLjQwMTQgMjMuMDg1MSAxMS40NzUxIDIyLjgxMDVMMTEuNDc3NiAyMi44MDA2TDExLjQ4NzkgMjIuODAyM0wxMS41NjYzIDIyLjgyMjZMMTEuNTY0IDIyLjgzMjdDMTEuNTMyMyAyMi45NjIzIDExLjUwMzEgMjMuMDkxNyAxMS40ODEgMjMuMjIxM0wxMS40NzkyIDIzLjIzSDExLjQ3MDhaTTExLjQ2MTggMjMuMjA4OEMxMS40ODMyIDIzLjA4NSAxMS41MTEgMjIuOTYxNCAxMS41NDEgMjIuODM4MkwxMS40OTI5IDIyLjgyNkMxMS40MTk3IDIzLjA5OTggMTEuMjc3OCAyMy4xMjQzIDEwLjk4OTIgMjMuMTIyNEMxMC44MzUxIDIzLjEyMjQgMTAuNjgxMSAyMy4xMjI0IDEwLjY4MDMgMjIuOTUyNFYyMi4zNzE3SDEwLjk4NDNDMTEuMTU1MSAyMi4zNjk5IDExLjE3MjMgMjIuNDczIDExLjE4NDUgMjIuNjEyMkwxMS4yMzcyIDIyLjYwMTRDMTEuMjMyNSAyMi41MTExIDExLjIzMDEgMjIuNDIwNSAxMS4yMzAxIDIyLjMzMDhDMTEuMjMwMSAyMi4yMzg5IDExLjIzMjUgMjIuMTQ3MiAxMS4yMzcyIDIyLjA1NDhIMTEuMTg0NUMxMS4xNzA3IDIyLjE4MjcgMTEuMTMwOCAyMi4yNzE5IDEwLjk4MTggMjIuMjcwM0gxMC42ODAzVjIxLjYwNzdIMTEuMDMwOUMxMS4yODUyIDIxLjYwNTYgMTEuMzI3MyAyMS43Mzc0IDExLjMzODQgMjEuODkxNEwxMS4zOTExIDIxLjg3NzFDMTEuMzg2OCAyMS44MDggMTEuMzgzOSAyMS43MTkyIDExLjM4MzkgMjEuNjM3NUMxMS4zODM5IDIxLjU5NTYgMTEuMzg1IDIxLjU1NTkgMTEuMzg2NCAyMS41MjEyQzExLjIyMDMgMjEuNTIyIDEwLjk3MjQgMjEuNTMwOSAxMC43NzEzIDIxLjUzMDlDMTAuNTcwNCAyMS41MzA5IDEwLjMyMzEgMjEuNTIyIDEwLjE3MzQgMjEuNTIxMlYyMS41NzMzSDEwLjE5NzFDMTAuMjg0MSAyMS41NzM1IDEwLjM4ODIgMjEuNTg4NiAxMC4zODg3IDIxLjcyNFYyMy4wMDY0QzEwLjM4ODIgMjMuMTQxNSAxMC4yODQxIDIzLjE1NjQgMTAuMTk3MSAyMy4xNTcxSDEwLjE3MzRWMjMuMjA4OEMxMC4zMTU4IDIzLjIwODMgMTAuNTk4NCAyMy4xOTkyIDEwLjgxMzMgMjMuMTk5MkMxMS4wMjkxIDIzLjE5OTIgMTEuMzA0MiAyMy4yMDgzIDExLjQ2MTggMjMuMjA4OFoiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS44ODUgMjEuNzdDMTEuODg1IDIxLjU5MTUgMTEuNzg3IDIxLjU4NDIgMTEuNzExMSAyMS41ODQySDExLjY2N1YyMS41MTA3QzExLjc0NTMgMjEuNTEwNyAxMS44OTY5IDIxLjUyMDQgMTIuMDQ2MiAyMS41MjA0QzEyLjE5MjYgMjEuNTIwNCAxMi4zMTAxIDIxLjUxMDcgMTIuNDM5NyAyMS41MTA3QzEyLjc0NzQgMjEuNTEwNyAxMy4wMjE4IDIxLjU5MzggMTMuMDIxOCAyMS45NDE3QzEzLjAyMTggMjIuMTYxOCAxMi44NzUgMjIuMjk2MyAxMi42ODE5IDIyLjM3MjZMMTMuMDk5OCAyMi45OTg5QzEzLjE2ODUgMjMuMTAyNSAxMy4yMTcgMjMuMTMxNSAxMy4zMzcxIDIzLjE0NTlWMjMuMjE5NUMxMy4yNTYyIDIzLjIxOTUgMTMuMTc4IDIzLjIxIDEzLjA5NzYgMjMuMjFDMTMuMDIxOCAyMy4yMSAxMi45NDMyIDIzLjIxOTUgMTIuODY3OCAyMy4yMTk1QzEyLjY3OTMgMjIuOTcyMyAxMi41MTc4IDIyLjcwODEgMTIuMzU5IDIyLjQyNjFIMTIuMTk3OVYyMi45NTAzQzEyLjE5NzkgMjMuMTM4OCAxMi4yODU3IDIzLjE0NTkgMTIuMzk3OCAyMy4xNDU5SDEyLjQ0MjFWMjMuMjE5NUMxMi4zMDI1IDIzLjIxOTUgMTIuMTYxMiAyMy4yMSAxMi4wMjE2IDIzLjIxQzExLjkwNDIgMjMuMjEgMTEuNzg5MyAyMy4yMTk1IDExLjY2NyAyMy4yMTk1VjIzLjE0NTlIMTEuNzExMUMxMS44MDE5IDIzLjE0NTkgMTEuODg1IDIzLjEwNDUgMTEuODg1IDIzLjAxNFYyMS43N1pNMTIuMTk3OSAyMi4zMzc3SDEyLjMxNzRDMTIuNTYyMiAyMi4zMzc3IDEyLjY5NCAyMi4yNDQ5IDEyLjY5NCAyMS45NTU5QzEyLjY5NCAyMS43MzgyIDEyLjU1NDYgMjEuNTk4NyAxMi4zMzY3IDIxLjU5ODdDMTIuMjYzMyAyMS41OTg3IDEyLjIzMiAyMS42MDYyIDEyLjE5NzkgMjEuNjA4NlYyMi4zMzc3WiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjMzNjUgMjMuMjNDMTMuMjU0NSAyMy4yMyAxMy4xNzY4IDIzLjIyMDIgMTMuMDk2MyAyMy4yMjAyQzEzLjAyMTggMjMuMjIwMiAxMi45NDM2IDIzLjIzIDEyLjg1ODUgMjMuMjI1OUMxMi42NzA5IDIyLjk3OTQgMTIuNTEwMSAyMi43MTY2IDEyLjM1MjIgMjIuNDM3MkgxMi4yMDc3VjIyLjk0OTlDMTIuMjEwNCAyMy4xMzQyIDEyLjI4NDIgMjMuMTMyOCAxMi4zOTcyIDIzLjEzNTRIMTIuNDUyMVYyMy4yM0gxMi40NDEzQzEyLjMwMTUgMjMuMjMgMTIuMTU5NCAyMy4yMjAyIDEyLjAyMDkgMjMuMjIwMkMxMS45MDQxIDIzLjIyMDIgMTEuNzg5MiAyMy4yMyAxMS42NjY0IDIzLjIzSDExLjY1NThWMjMuMTM1NEgxMS43MTA2QzExLjc5ODUgMjMuMTM0NyAxMS44NzI4IDIzLjA5NjQgMTEuODczMiAyMy4wMTQxVjIxLjc3QzExLjg3MTMgMjEuNTk2NCAxMS43ODY0IDIxLjU5NzMgMTEuNzEwNiAyMS41OTQ5SDExLjY1NThWMjEuNTAwMUgxMS42NjY0QzExLjc0NTUgMjEuNTAwMSAxMS44OTY1IDIxLjUwOTYgMTIuMDQ1NiAyMS41MDk2QzEyLjE5MTUgMjEuNTA5NiAxMi4zMDg4IDIxLjUwMDEgMTIuNDM5MSAyMS41MDAxQzEyLjc0NzQgMjEuNTAwNyAxMy4wMzExIDIxLjU4NTcgMTMuMDMxOCAyMS45NDEzQzEzLjAzMTggMjIuMTYyMiAxMi44ODYgMjIuMzAwMyAxMi42OTc0IDIyLjM3NzNMMTMuMTA4IDIyLjk5MzFDMTMuMTc2NCAyMy4wOTQ3IDEzLjIxOSAyMy4xMjAxIDEzLjMzNzkgMjMuMTM1NEwxMy4zNDY4IDIzLjEzNjhWMjMuMjNIMTMuMzM2NVpNMTIuMTk3NCAyMi40MTU1SDEyLjM2NDVMMTIuMzY3NSAyMi40MjFDMTIuNTI2NyAyMi43MDIyIDEyLjY4NzQgMjIuOTY2NiAxMi44Njc0IDIzLjIwOUMxMi45NDE4IDIzLjIwOSAxMy4wMjA0IDIzLjE5OTIgMTMuMDk2NiAyMy4xOTkyQzEzLjE3NDYgMjMuMTk5MiAxMy4yNTAxIDIzLjIwNzcgMTMuMzI2IDIzLjIwODhWMjMuMTU1MUMxMy4yMTE0IDIzLjE0MTEgMTMuMTU3NSAyMy4xMDY0IDEzLjA5MDggMjMuMDA0OUwxMi42NjUyIDIyLjM2NzdMMTIuNjc3MiAyMi4zNjI4QzEyLjg2ODcgMjIuMjg3MyAxMy4wMTA2IDIyLjE1NjUgMTMuMDEwNyAyMS45NDEzQzEzLjAxMDYgMjEuNjAxNyAxMi43NDY3IDIxLjUyMjkgMTIuNDM5MyAyMS41MjEyQzEyLjMxMDYgMjEuNTIxMiAxMi4xOTMxIDIxLjUzMTEgMTIuMDQ1OCAyMS41MzExQzExLjkwMjIgMjEuNTMxMSAxMS43NTcgMjEuNTIyIDExLjY3NzEgMjEuNTIxMlYyMS41NzMzSDExLjcxMDhDMTEuNzg2NyAyMS41NzM1IDExLjg5NDcgMjEuNTg2MSAxMS44OTQ3IDIxLjc2OTlWMjMuMDE0QzExLjg5NDcgMjMuMTEyMiAxMS44MDI4IDIzLjE1NjkgMTEuNzEwOCAyMy4xNTcxSDExLjY3NzFWMjMuMjA4OEMxMS43OTQ2IDIzLjIwODMgMTEuOTA2MiAyMy4xOTkyIDEyLjAyMTEgMjMuMTk5MkMxMi4xNTc2IDIzLjE5OTIgMTIuMjk1NyAyMy4yMDgzIDEyLjQzMDkgMjMuMjA4OFYyMy4xNTcxSDEyLjM5NzRDMTIuMjg2MSAyMy4xNTY5IDEyLjE4NjYgMjMuMTQzMSAxMi4xODY2IDIyLjk0OThWMjIuNDE1NUgxMi4xOTc0Wk0xMi4xOTcyIDIyLjM0ODRIMTIuMTg2NFYyMS41OTg5TDEyLjE5NTcgMjEuNTk4MUMxMi4yMjkyIDIxLjU5NTQgMTIuMjYyMiAyMS41ODg3IDEyLjMzNjEgMjEuNTg4N0MxMi41NTg4IDIxLjU4ODcgMTIuNzAzOCAyMS43MzM1IDEyLjcwNCAyMS45NTY3QzEyLjcwMzQgMjIuMjQ5IDEyLjU2MzQgMjIuMzQ4MyAxMi4zMTY4IDIyLjM0ODRIMTIuMTk3MlpNMTIuMzE3NCAyMi4zMjc2QzEyLjU1OTQgMjIuMzI1MiAxMi42ODE0IDIyLjI0MTIgMTIuNjgzOCAyMS45NTY4QzEyLjY4MjMgMjEuNzQyOSAxMi41NDk3IDIxLjYxMDIgMTIuMzM2NyAyMS42MDkzQzEyLjI3MDggMjEuNjA5MyAxMi4yMzk2IDIxLjYxNTQgMTIuMjA4NCAyMS42MTg1VjIyLjMyNzZIMTIuMzE3NFoiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNC45OTcxIDIyLjczN0wxNS4wMDEzIDIyLjczMjJWMjEuODE0NEMxNS4wMDEzIDIxLjYxMzUgMTQuODYyNCAyMS41ODQyIDE0Ljc4OSAyMS41ODQySDE0LjczNTRWMjEuNTEwN0MxNC44NTA0IDIxLjUxMDcgMTQuOTYyNSAyMS41MjA0IDE1LjA3NzcgMjEuNTIwNEMxNS4xNzgyIDIxLjUyMDQgMTUuMjc3NyAyMS41MTA3IDE1LjM3ODcgMjEuNTEwN1YyMS41ODQySDE1LjM0MThDMTUuMjM5MSAyMS41ODQyIDE1LjEyNDIgMjEuNjAzNyAxNS4xMjQyIDIxLjg5NVYyMy4wMDg5QzE1LjEyNDIgMjMuMDk0NyAxNS4xMjY2IDIzLjE4MDMgMTUuMTM4NyAyMy4yNTYzSDE1LjA0NjFMMTMuNzg3IDIxLjg1MDhWMjIuODU5N0MxMy43ODcgMjMuMDcyOCAxMy44MjgzIDIzLjE0NTkgMTQuMDE2NiAyMy4xNDU5SDE0LjA1ODJWMjMuMjE5NUMxMy45NTMyIDIzLjIxOTUgMTMuODQ3OCAyMy4yMDk5IDEzLjc0MjggMjMuMjA5OUMxMy42MzI0IDIzLjIwOTkgMTMuNTIwMSAyMy4yMTk1IDEzLjQxMDIgMjMuMjE5NVYyMy4xNDU5SDEzLjQ0NDFDMTMuNjEyOSAyMy4xNDU5IDEzLjY2NDYgMjMuMDMwOCAxMy42NjQ2IDIyLjgzNTZWMjEuODA0MUMxMy42NjQ2IDIxLjY2NzIgMTMuNTUxOSAyMS41ODQyIDEzLjQ0MiAyMS41ODQySDEzLjQxMDJWMjEuNTEwN0MxMy41MDI3IDIxLjUxMDcgMTMuNTk4OCAyMS41MjA0IDEzLjY5MTUgMjEuNTIwNEMxMy43NjQyIDIxLjUyMDQgMTMuODM1NCAyMS41MTA3IDEzLjkwODkgMjEuNTEwN0wxNC45OTcxIDIyLjczN1oiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS4xMzc5IDIzLjI2NjZMMTUuMDM3NSAyMy4yNjMyTDEzLjc5NjQgMjEuODc4N1YyMi44NTk2QzEzLjc5OTMgMjMuMDcyOCAxMy44MzE1IDIzLjEzMzEgMTQuMDE1OSAyMy4xMzU0SDE0LjA2NzdWMjMuMjNIMTQuMDU3QzEzLjk1MTMgMjMuMjMgMTMuODQ2NCAyMy4yMTk4IDEzLjc0MTYgMjMuMjE5OEMxMy42MzI1IDIzLjIxOTggMTMuNTE5NSAyMy4yMyAxMy40MDk0IDIzLjIzSDEzLjM5ODRWMjMuMTM1NEgxMy40NDM0QzEzLjYwNDkgMjMuMTM0NyAxMy42NTEyIDIzLjAzMDUgMTMuNjUyOCAyMi44MzVWMjEuODA0MkMxMy42NTI1IDIxLjY3MzcgMTMuNTQ1OSAyMS41OTQ5IDEzLjQ0MTMgMjEuNTk0OUgxMy4zOTg0VjIxLjUwMDFIMTMuNDA5NEMxMy41MDI3IDIxLjUwMDEgMTMuNTk4NCAyMS41MDk2IDEzLjY5MDcgMjEuNTA5NkMxMy43NjI1IDIxLjUwOTYgMTMuODMzMyAyMS41MDAxIDEzLjkxNTMgMjEuNTAzMkwxNC45OTAzIDIyLjcxNDlWMjEuODE0NUMxNC45ODk2IDIxLjYyMDEgMTQuODU5NCAyMS41OTYgMTQuNzg4MyAyMS41OTQ5SDE0LjcyMzhWMjEuNTAwMUgxNC43MzQ0QzE0Ljg0OTkgMjEuNTAwMSAxNC45NjI3IDIxLjUwOTYgMTUuMDc3IDIxLjUwOTZDMTUuMTc2NiAyMS41MDk2IDE1LjI3NjcgMjEuNTAwMSAxNS4zNzc1IDIxLjUwMDFIMTUuMzg4M1YyMS41OTQ5SDE1LjM0MTFDMTUuMjQwMiAyMS41OTczIDE1LjEzNjMgMjEuNjA2MyAxNS4xMzM5IDIxLjg5NTFWMjMuMDA4OUMxNS4xMzM5IDIzLjA5NDYgMTUuMTM2IDIzLjE3OTUgMTUuMTQ4NSAyMy4yNTQ1TDE1LjE0OTcgMjMuMjY2NkgxNS4xMzc5Wk0xNS4wNDUyIDIzLjI0NTJIMTUuMTI1NEMxNS4xMTQ3IDIzLjE3MiAxNS4xMTI1IDIzLjA5MDMgMTUuMTEyNSAyMy4wMDg4VjIxLjg5NUMxNS4xMTI3IDIxLjYwMTIgMTUuMjM2NCAyMS41NzQgMTUuMzQxIDIxLjU3MzNIMTUuMzY2OFYyMS41MjEyQzE1LjI3MDUgMjEuNTIyIDE1LjE3MzkgMjEuNTMwOSAxNS4wNzY5IDIxLjUzMDlDMTQuOTY0NSAyMS41MzA5IDE0Ljg1NTYgMjEuNTIyIDE0Ljc0NSAyMS41MjEyVjIxLjU3MzNIMTQuNzg4MkMxNC44NjM2IDIxLjU3NCAxNS4wMTE2IDIxLjYwNjkgMTUuMDExNiAyMS44MTQ0TDE1LjAwODEgMjIuNzM5OEwxNS4wMDM3IDIyLjc0NDZMMTQuOTk2IDIyLjc1MjZMMTMuOTA4MSAyMS41MjEyQzEzLjgzNTQgMjEuNTIxMiAxMy43NjQ1IDIxLjUzMDkgMTMuNjkwNiAyMS41MzA5QzEzLjU5OTkgMjEuNTMwOSAxMy41MDg2IDIxLjUyMiAxMy40MTk3IDIxLjUyMTJWMjEuNTczM0gxMy40NDEyQzEzLjU1NjMgMjEuNTc0IDEzLjY3MzkgMjEuNjYwOCAxMy42NzM5IDIxLjgwNDFWMjIuODM0OUMxMy42NzM5IDIzLjAzMTQgMTMuNjE4NiAyMy4xNTY0IDEzLjQ0MzMgMjMuMTU3MUwxMy40MTk3IDIzLjE1NjlWMjMuMjA4OUMxMy41MjUzIDIzLjIwODIgMTMuNjM0MyAyMy4xOTkyIDEzLjc0MTUgMjMuMTk5MkMxMy44NDQxIDIzLjE5OTIgMTMuOTQ1NyAyMy4yMDgyIDE0LjA0NjggMjMuMjA4OVYyMy4xNTcxSDE0LjAxNThDMTMuODIzNCAyMy4xNTY5IDEzLjc3NTQgMjMuMDcyOCAxMy43NzQ5IDIyLjg1OTZWMjEuODIzOEwxNS4wNDUyIDIzLjI0NTJaTTE0Ljk5NTkgMjIuNzM2OUwxNS4wMDM4IDIyLjcyOTlMMTQuOTk1OSAyMi43MzY5Wk0xNC45OTA2IDIyLjczMjJWMjIuNzMxNkwxNC45ODg5IDIyLjcyOTdMMTQuOTkwNiAyMi43MzIyWiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1Ljc3MTggMjIuODY5NkMxNS43NDcyIDIyLjk1MjUgMTUuNzE3NiAyMy4wMTY4IDE1LjcxNzYgMjMuMDYwM0MxNS43MTc2IDIzLjEzMzkgMTUuODIwNyAyMy4xNDYxIDE1LjkwMTEgMjMuMTQ2MUgxNS45Mjg0VjIzLjIxOTVDMTUuODMwMiAyMy4yMTQzIDE1LjczMDQgMjMuMjEwMSAxNS42MzIgMjMuMjEwMUMxNS41NDQgMjMuMjEwMSAxNS40NTY1IDIzLjIxNDMgMTUuMzY4MiAyMy4yMTk1VjIzLjE0NjFIMTUuMzgzMUMxNS40NzgyIDIzLjE0NjEgMTUuNTU5MiAyMy4wODk2IDE1LjU5NTUgMjIuOTg2OEwxNS45ODY3IDIxLjg2MzVDMTYuMDE4NiAyMS43NzI3IDE2LjA2MjcgMjEuNjUwNCAxNi4wNzc2IDIxLjU1OTZDMTYuMTU1MyAyMS41MzI4IDE2LjI1MzUgMjEuNDg0MiAxNi4yOTk4IDIxLjQ1NDRDMTYuMzA3NCAyMS40NTE5IDE2LjMxMTkgMjEuNDQ5NCAxNi4zMTkzIDIxLjQ0OTRDMTYuMzI2NyAyMS40NDk0IDE2LjMzMTMgMjEuNDQ5NCAxNi4zMzY2IDIxLjQ1NzFDMTYuMzQzOSAyMS40NzY1IDE2LjM1MSAyMS40OTg1IDE2LjM1ODYgMjEuNTE4MUwxNi44MDg3IDIyLjc5ODZDMTYuODM4IDIyLjg4NCAxNi44NjcxIDIyLjk3NDUgMTYuODk4MyAyMy4wNDg0QzE2LjkyODEgMjMuMTE3MSAxNi45Nzk1IDIzLjE0NjEgMTcuMDYwNSAyMy4xNDYxSDE3LjA3NTFWMjMuMjE5NUMxNi45NjUgMjMuMjE0MyAxNi44NTQ3IDIzLjIxMDEgMTYuNzM3OCAyMy4yMTAxQzE2LjYxOCAyMy4yMTAxIDE2LjQ5NTQgMjMuMjE0MyAxNi4zNzA3IDIzLjIxOTVWMjMuMTQ2MUgxNi4zOTc2QzE2LjQ1MzUgMjMuMTQ2MSAxNi41NDk1IDIzLjEzNjMgMTYuNTQ5NSAyMy4wNzUxQzE2LjU0OTUgMjMuMDQzNSAxNi41Mjc0IDIyLjk3NzMgMTYuNTAwMSAyMi44OTg2TDE2LjQwNDggMjIuNjE0OEgxNS44NDk5TDE1Ljc3MTggMjIuODY5NlpNMTYuMTI4NSAyMS43ODQ5SDE2LjEyMzRMMTUuODk2MiAyMi40Nzc3SDE2LjM1MzFMMTYuMTI4NSAyMS43ODQ5WiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE3LjA3MzcgMjMuMjI5OUMxNi45NjM4IDIzLjIyNTIgMTYuODUzNiAyMy4yMTk3IDE2LjczNzIgMjMuMjE5N0MxNi42MTczIDIzLjIxOTcgMTYuNDk1MyAyMy4yMjUyIDE2LjM3MDYgMjMuMjI5OUwxNi4zNTkzIDIzLjIzMDVWMjMuMTM0OEgxNi4zOTY5QzE2LjQ1MzYgMjMuMTM0OCAxNi41Mzc2IDIzLjEyMjEgMTYuNTM3OCAyMy4wNzVDMTYuNTM4NCAyMy4wNDcxIDE2LjUxNjQgMjIuOTggMTYuNDg5NSAyMi45MDIyTDE2LjM5NjQgMjIuNjI1MkgxNS44NTcxTDE1Ljc4MSAyMi44NzI2QzE1Ljc1NjQgMjIuOTU1OCAxNS43MjY3IDIzLjAyMDUgMTUuNzI3MSAyMy4wNjAzQzE1LjcyOCAyMy4xMjAxIDE1LjgxOTIgMjMuMTM0OCAxNS45MDA0IDIzLjEzNDhIMTUuOTM4VjIzLjIzMDVMMTUuOTI2OSAyMy4yMjk5QzE1LjgyOTEgMjMuMjI1MiAxNS43Mjk0IDIzLjIxOTcgMTUuNjMxNSAyMy4yMTk3QzE1LjU0NDMgMjMuMjE5NyAxNS40NTU5IDIzLjIyNTIgMTUuMzY4MyAyMy4yMjk5TDE1LjM1NjkgMjMuMjMwNVYyMy4xMzQ4SDE1LjM4MjNDMTUuNDczMiAyMy4xMzQ3IDE1LjU0OTEgMjMuMDgyNyAxNS41ODQ0IDIyLjk4MzJMMTUuOTc2IDIxLjg1OTZDMTYuMDA3NiAyMS43NjkgMTYuMDUyIDIxLjY0NzIgMTYuMDczMSAyMS41NDk0QzE2LjE0OTggMjEuNTIzMyAxNi4yNDgyIDIxLjQ3MzkgMTYuMjk1MSAyMS40NDQ0QzE2LjMwMiAyMS40NDIgMTYuMzA4NyAyMS40Mzg4IDE2LjMxODYgMjEuNDM4OEMxNi4zMjQ2IDIxLjQzODUgMTYuMzM3NyAyMS40NCAxNi4zNDU3IDIxLjQ1MjhDMTYuMzUyNiAyMS40NzI5IDE2LjM2MDQgMjEuNDk0OSAxNi4zNjc4IDIxLjUxNDZMMTYuODE4IDIyLjc5NDlDMTYuODQ2OCAyMi44ODA3IDE2Ljg3NiAyMi45NzExIDE2LjkwOCAyMy4wNDM3QzE2LjkzNjMgMjMuMTA4OSAxNi45ODEyIDIzLjEzNDcgMTcuMDU5OCAyMy4xMzQ4SDE3LjA4NDVWMjMuMjMwNUwxNy4wNzM3IDIzLjIyOTlaTTE2LjM4MDYgMjMuMjA4MkMxNi41MDE2IDIzLjIwNCAxNi42MjAzIDIzLjE5OTMgMTYuNzM3MSAyMy4xOTkzQzE2Ljg1MDUgMjMuMTk5MyAxNi45NTcxIDIzLjIwNCAxNy4wNjM0IDIzLjIwODJWMjMuMTU3SDE3LjA1OThDMTYuOTc1OSAyMy4xNTc2IDE2LjkxODMgMjMuMTI0NiAxNi44ODgzIDIzLjA1MjRDMTYuODU2NCAyMi45Nzg0IDE2LjgyNjcgMjIuODg3NSAxNi43OTc4IDIyLjgwMThMMTYuMzQ3NyAyMS41MjE0QzE2LjM0MDMgMjEuNTAxOSAxNi4zMzMzIDIxLjQ4IDE2LjMyNjkgMjEuNDYyNkMxNi4zMjQ1IDIxLjQ2MDIgMTYuMzI1MSAyMS40NjAyIDE2LjMyMzEgMjEuNDYwMkgxNi4zMTg1QzE2LjMxMzYgMjEuNDYwMiAxNi4zMTA2IDIxLjQ2MTYgMTYuMzA0NCAyMS40NjMyQzE2LjI1NzMgMjEuNDkzOCAxNi4xNTkzIDIxLjU0MjEgMTYuMDg2NiAyMS41NjEyQzE2LjA3MTcgMjEuNjUzOSAxNi4wMjc2IDIxLjc3NjIgMTUuOTk1OSAyMS44NjY5TDE1LjYwNDcgMjIuOTkwM0MxNS41Njc0IDIzLjA5NjcgMTUuNDgxNSAyMy4xNTcyIDE1LjM4MjMgMjMuMTU3SDE1LjM3ODJWMjMuMjA4MkMxNS40NjIgMjMuMjA0IDE1LjU0NjYgMjMuMTk5MyAxNS42MzE1IDIzLjE5OTNDMTUuNzI2MSAyMy4xOTkzIDE1LjgyMjUgMjMuMjA0IDE1LjkxNjEgMjMuMjA4MlYyMy4xNTdIMTUuOTAwNEMxNS44MjA1IDIzLjE1NTkgMTUuNzA5MiAyMy4xNDcyIDE1LjcwNjUgMjMuMDYwNEMxNS43MDY2IDIzLjAxMTkgMTUuNzM2NiAyMi45NDkyIDE1Ljc2MDYgMjIuODY2NUwxNS43NzEgMjIuODY5NkwxNS43NjA2IDIyLjg2NjJMMTUuODQxMSAyMi42MDQ2SDE2LjQxMTNMMTYuNTA5MiAyMi44OTUzQzE2LjUzNjcgMjIuOTc0MSAxNi41NTg5IDIzLjAzOTMgMTYuNTU4OSAyMy4wNzUxQzE2LjU1NTMgMjMuMTUgMTYuNDUyMyAyMy4xNTU2IDE2LjM5NjkgMjMuMTU3SDE2LjM4MDZWMjMuMjA4MlpNMTUuODgwNyAyMi40ODg0TDE2LjExNDggMjEuNzc0MUgxNi4xMjc5VjIxLjc4NUwxNi4xMjUzIDIxLjc4NTdMMTYuMTI3OSAyMS43ODVWMjEuNzc0MUgxNi4xMzUyTDE2LjM2NzYgMjIuNDg4NEgxNS44ODA3Wk0xNS45MDk3IDIyLjQ2N0gxNi4zMzc4TDE2LjEyNSAyMS44MTFMMTUuOTA5NyAyMi40NjdaTTE2LjExNzUgMjEuNzg4MUwxNi4xMjMxIDIxLjc4NjRMMTYuMTE3NSAyMS43ODgxWiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE3LjE4MTkgMjEuNjMzMUMxNi45OTg2IDIxLjYzMzEgMTYuOTkxMiAyMS42NzczIDE2Ljk1NDMgMjEuODU1OEgxNi44ODA5QzE2Ljg5MDUgMjEuNzg3MiAxNi45MDMgMjEuNzE4OCAxNi45MTA2IDIxLjY0NzhDMTYuOTIwMSAyMS41Nzg5IDE2LjkyNDggMjEuNTEwNiAxNi45MjQ4IDIxLjQzOThIMTYuOTg0QzE3LjAwMzEgMjEuNTEzMyAxNy4wNjQ0IDIxLjUxMDYgMTcuMTMwNCAyMS41MTA2SDE4LjM5MjJDMTguNDU4IDIxLjUxMDYgMTguNTE5IDIxLjUwODIgMTguNTIzOSAyMS40MzQ4TDE4LjU4MjMgMjEuNDQ0OEMxOC41NzMzIDIxLjUxMDYgMTguNTYzNiAyMS41NzY4IDE4LjU1NTkgMjEuNjQzMUMxOC41NTA1IDIxLjcwOTEgMTguNTUwNSAyMS43NzUgMTguNTUwNSAyMS44NDExTDE4LjQ3NzUgMjEuODY4M0MxOC40NzMxIDIxLjc3NzkgMTguNDYwOCAyMS42MzMxIDE4LjI5NjYgMjEuNjMzMUgxNy44OTU3VjIyLjkzNTRDMTcuODk1NyAyMy4xMjQzIDE3Ljk4MTQgMjMuMTQ1OSAxOC4wOTg2IDIzLjE0NTlIMTguMTQ1M1YyMy4yMTk0QzE4LjA0OTggMjMuMjE5NCAxNy44Nzg5IDIzLjIxIDE3Ljc0NjYgMjMuMjFDMTcuNjAwMiAyMy4yMSAxNy40Mjg2IDIzLjIxOTQgMTcuMzMzMyAyMy4yMTk0VjIzLjE0NTlIMTcuMzc5OEMxNy41MTQ2IDIzLjE0NTkgMTcuNTgyOCAyMy4xMzM4IDE3LjU4MjggMjIuOTQwNVYyMS42MzMxSDE3LjE4MTlaIiBmaWxsPSIjMUExOTE5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTguMTQ1NCAyMy4yMjk5QzE4LjA0OTMgMjMuMjI5OSAxNy44Nzc5IDIzLjIyMDIgMTcuNzQ2NSAyMy4yMjAyQzE3LjYwMDUgMjMuMjIwMiAxNy40MjkyIDIzLjIyOTkgMTcuMzMzNSAyMy4yMjk5SDE3LjMyMjZWMjMuMTM1M0gxNy4zNzk5QzE3LjUxNDggMjMuMTMyMiAxNy41Njg4IDIzLjEzMDQgMTcuNTcyMSAyMi45NDA2TDE3LjU3MTkgMjEuNjQzNUgxNy4xODJWMjEuNjIyMUgxNy41OTM0VjIyLjk0MDZDMTcuNTkzNCAyMy4xMzcxIDE3LjUxNDIgMjMuMTU2NSAxNy4zNzk5IDIzLjE1NjlIMTcuMzQzOVYyMy4yMDlDMTcuNDQwNSAyMy4yMDgyIDE3LjYwNDggMjMuMTk5MiAxNy43NDY1IDIzLjE5OTJDMTcuODc0MyAyMy4xOTkyIDE4LjAzOCAyMy4yMDgyIDE4LjEzNDUgMjMuMjA5VjIzLjE1NjlIMTguMDk4NkMxNy45ODA4IDIzLjE1NjUgMTcuODg1NSAyMy4xMjgxIDE3Ljg4NTMgMjIuOTM1NVYyMS42MjIxSDE4LjI5NjdDMTguNDYxIDIxLjYyMjggMTguNDgyNCAyMS43NjIzIDE4LjQ4NzEgMjEuODUzNEwxOC41NDAyIDIxLjgzMzlDMTguNTQwMiAyMS43Njk5IDE4LjU0MDYgMjEuNzA1OSAxOC41NDU2IDIxLjY0MTlDMTguNTUyMiAyMS41Nzg4IDE4LjU2MTQgMjEuNTE2MSAxOC41NzAzIDIxLjQ1MzdMMTguNTMzNCAyMS40NDcyQzE4LjUyMjIgMjEuNTE4NSAxOC40NTMyIDIxLjUyMjQgMTguMzkyMyAyMS41MjEzSDE3LjExOEMxNy4wNjAzIDIxLjUyMiAxNi45OTc5IDIxLjUxODYgMTYuOTc1NyAyMS40NTAySDE2LjkzNThDMTYuOTM1MiAyMS41MTc5IDE2LjkzMDQgMjEuNTgzNyAxNi45MjA4IDIxLjY0ODlDMTYuOTE0MSAyMS43MTY1IDE2LjkwMjMgMjEuNzgxMiAxNi44OTMgMjEuODQ1NkgxNi45NDU2QzE2Ljk3NzcgMjEuNjc0OSAxNi45OTg5IDIxLjYxOTUgMTcuMTgyIDIxLjYyMjFWMjEuNjQzNUMxNy4wMDA3IDIxLjY0NjcgMTcuMDA0NyAyMS42Nzc1IDE2Ljk2NDggMjEuODU4M0wxNi45NjMxIDIxLjg2NjdIMTYuODY4N0wxNi44NzAxIDIxLjg1NDVDMTYuODgwNCAyMS43ODU3IDE2Ljg5MjQgMjEuNzE2OSAxNi44OTk2IDIxLjY0NjRDMTYuOTA5NiAyMS41Nzc5IDE2LjkxNDEgMjEuNTEgMTYuOTE0MSAyMS40Mzk5VjIxLjQyOUgxNi45OTE3TDE2Ljk5MzggMjEuNDM2N0MxNy4wMTA5IDIxLjQ5ODQgMTcuMDU1NCAyMS40OTg5IDE3LjExOCAyMS41SDE4LjM5MjNDMTguNDYgMjEuNDk4OSAxOC41MDkzIDIxLjQ5OCAxOC41MTM3IDIxLjQzNDFMMTguNTE0MSAyMS40MjI0TDE4LjUyNTQgMjEuNDI0NkwxOC41OTQ5IDIxLjQzNTVMMTguNTkzMiAyMS40NDY0QzE4LjU4MzEgMjEuNTEyMSAxOC41NzM4IDIxLjU3NzkgMTguNTY2NCAyMS42NDM1QzE4LjU2MTQgMjEuNzA5MiAxOC41NjE0IDIxLjc3NSAxOC41NjE0IDIxLjg0MTFWMjEuODQ4NUwxOC41NTQzIDIxLjg1MTRMMTguNDY3OCAyMS44ODMxTDE4LjQ2NzQgMjEuODY4OUMxOC40NjEgMjEuNzc2OCAxOC40NTEzIDIxLjY0MzUgMTguMjk2NyAyMS42NDM1SDE3LjkwNjRWMjIuOTM1NUMxNy45MDg5IDIzLjEyIDE3Ljk4MjEgMjMuMTMzIDE4LjA5ODYgMjMuMTM1M0gxOC4xNTU2VjIzLjIyOTlIMTguMTQ1NFoiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xOC42NzI5IDIzLjE0NTlIMTguNzA3MUMxOC43OTUyIDIzLjE0NTkgMTguODg3OCAyMy4xMzM5IDE4Ljg4NzggMjMuMDA2NFYyMS43MjRDMTguODg3OCAyMS41OTY0IDE4Ljc5NTIgMjEuNTg0MyAxOC43MDcxIDIxLjU4NDNIMTguNjcyOVYyMS41MTA3QzE4Ljc2ODMgMjEuNTEwNyAxOC45MTQ3IDIxLjUyMDQgMTkuMDM0NCAyMS41MjA0QzE5LjE1NjkgMjEuNTIwNCAxOS4zMDM3IDIxLjUxMDcgMTkuNDE4OCAyMS41MTA3VjIxLjU4NDNIMTkuMzg0NUMxOS4yOTYxIDIxLjU4NDMgMTkuMjAzMiAyMS41OTY0IDE5LjIwMzIgMjEuNzI0VjIzLjAwNjRDMTkuMjAzMiAyMy4xMzM5IDE5LjI5NjEgMjMuMTQ1OSAxOS4zODQ1IDIzLjE0NTlIMTkuNDE4OFYyMy4yMTk1QzE5LjMwMTQgMjMuMjE5NSAxOS4xNTQ1IDIzLjIxIDE5LjAzMjQgMjMuMjFDMTguOTEyNCAyMy4yMSAxOC43NjgzIDIzLjIxOTUgMTguNjcyOSAyMy4yMTk1VjIzLjE0NTlaIiBmaWxsPSIjMUExOTE5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTkuNDE4NSAyMy4yM0MxOS4zMDA0IDIzLjIzIDE5LjE1NDEgMjMuMjE5OCAxOS4wMzIxIDIzLjIxOThDMTguOTEyNSAyMy4yMTk4IDE4Ljc2ODEgMjMuMjMgMTguNjcyNiAyMy4yM0gxOC42NjIxVjIzLjEzNTRIMTguNzA2OUMxOC43OTUgMjMuMTMzOSAxOC44NzYzIDIzLjEyNjEgMTguODc2OCAyMy4wMDY1VjIxLjcyNEMxOC44NzYzIDIxLjYwNDQgMTguNzk1IDIxLjU5NjQgMTguNzA2OSAyMS41OTQ5SDE4LjY2MjFWMjEuNTAwMUgxOC42NzI2QzE4Ljc2ODEgMjEuNTAwMSAxOC45MTUxIDIxLjUwOTYgMTkuMDM0MSAyMS41MDk2QzE5LjE1NiAyMS41MDk2IDE5LjMwMjcgMjEuNTAwMSAxOS40MTg1IDIxLjUwMDFIMTkuNDI4N1YyMS41OTQ5SDE5LjM4NDNDMTkuMjk0OCAyMS41OTY0IDE5LjIxNDQgMjEuNjA0NCAxOS4yMTM1IDIxLjcyNFYyMy4wMDY1QzE5LjIxNDQgMjMuMTI2MSAxOS4yOTQ4IDIzLjEzMzkgMTkuMzg0MyAyMy4xMzU0SDE5LjQyODdWMjMuMjNIMTkuNDE4NVpNMTkuNDA3NSAyMy4yMDg4VjIzLjE1NjlIMTkuMzg0M0MxOS4yOTY2IDIzLjE1NjkgMTkuMTkyOCAyMy4xNDE1IDE5LjE5MjggMjMuMDA2NFYyMS43MjRDMTkuMTkyOCAyMS41ODg2IDE5LjI5NjYgMjEuNTczNSAxOS4zODQzIDIxLjU3MzNIMTkuNDA3NVYyMS41MjEyQzE5LjI5NDcgMjEuNTIyIDE5LjE1MzEgMjEuNTMwOSAxOS4wMzQxIDIxLjUzMDlDMTguOTE4IDIxLjUzMDkgMTguNzc4MSAyMS41MjIgMTguNjgzMiAyMS41MjEyVjIxLjU3MzNIMTguNzA2OUMxOC43OTM3IDIxLjU3MzUgMTguODk4IDIxLjU4ODYgMTguODk4MiAyMS43MjRWMjMuMDA2NEMxOC44OTggMjMuMTQxNSAxOC43OTM3IDIzLjE1NjkgMTguNzA2OSAyMy4xNTY5SDE4LjY4MzJWMjMuMjA4OEMxOC43Nzc1IDIzLjIwNzcgMTguOTE1NyAyMy4xOTkyIDE5LjAzMjIgMjMuMTk5MkMxOS4xNTA3IDIzLjE5OTIgMTkuMjkyMSAyMy4yMDgyIDE5LjQwNzUgMjMuMjA4OFoiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMC4zOTQxIDIxLjQ3NDJDMjAuOTE1NCAyMS40NzQyIDIxLjMzMDggMjEuNzk3NyAyMS4zMzA4IDIyLjMxOTFDMjEuMzMwOCAyMi44ODIyIDIwLjkyNzMgMjMuMjU2NSAyMC40MDY3IDIzLjI1NjVDMTkuODg4MSAyMy4yNTY1IDE5LjQ5MjIgMjIuOTAzOSAxOS40OTIyIDIyLjM3NzVDMTkuNDkyMiAyMS44Njg2IDE5Ljg4NTcgMjEuNDc0MiAyMC4zOTQxIDIxLjQ3NDJaTTIwLjQzMDcgMjMuMTQ4N0MyMC45MDUyIDIzLjE0ODcgMjAuOTg4IDIyLjcyOTcgMjAuOTg4IDIyLjM3MjhDMjAuOTg4IDIyLjAxNSAyMC43OTUzIDIxLjU4MTkgMjAuMzg5MSAyMS41ODE5QzE5Ljk2MTQgMjEuNTgxOSAxOS44MzQxIDIxLjk2MzkgMTkuODM0MSAyMi4yOTE2QzE5LjgzNDEgMjIuNzI5NyAyMC4wMzQ4IDIzLjE0ODcgMjAuNDMwNyAyMy4xNDg3WiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE5LjQ4MDUgMjIuMzc3M0MxOS40ODE1IDIxLjg2MjUgMTkuODc5NiAyMS40NjQyIDIwLjM5MzIgMjEuNDYzNFYyMS40ODQ4QzE5Ljg5MDYgMjEuNDg0OCAxOS41MDE4IDIxLjg3MzggMTkuNTAxMiAyMi4zNzczQzE5LjUwMjIgMjIuODk3OCAxOS44OTI0IDIzLjI0NTEgMjAuNDA2IDIzLjI0NTNDMjAuOTIxMyAyMy4yNDUxIDIxLjMxOSAyMi44NzYyIDIxLjMxOTcgMjIuMzE4NkMyMS4zMTkyIDIxLjgwMzYgMjAuOTEwMyAyMS40ODUyIDIwLjM5MzIgMjEuNDg0OFYyMS40NjM0QzIwLjkxODIgMjEuNDYzOSAyMS4zMzk2IDIxLjc5MDYgMjEuMzQwNSAyMi4zMTg2QzIxLjMzOTkgMjIuODg3NSAyMC45MzE2IDIzLjI2NTcgMjAuNDA2IDIzLjI2NjZDMTkuODgzIDIzLjI2NTcgMTkuNDgxNSAyMi45MDk2IDE5LjQ4MDUgMjIuMzc3M1pNMTkuODIyOCAyMi4yOTE1QzE5LjgyMzYgMjEuOTYyMSAxOS45NTIgMjEuNTcwOSAyMC4zODg1IDIxLjU3MDlDMjAuODAzNyAyMS41NzE4IDIwLjk5NzMgMjIuMDEyOSAyMC45OTgyIDIyLjM3MjdDMjAuOTk3MyAyMi43Mjk2IDIwLjkxMzUgMjMuMTU4NSAyMC40MzAzIDIzLjE1ODVWMjMuMTM3OEMyMC44OTUyIDIzLjEzNzQgMjAuOTc2IDIyLjcyOTYgMjAuOTc2NyAyMi4zNzI3QzIwLjk3NjcgMjIuMDE4IDIwLjc4NTkgMjEuNTkzMSAyMC4zODg1IDIxLjU5MjRDMTkuOTY5MSAyMS41OTI5IDE5Ljg0NTEgMjEuOTY1NCAxOS44NDQgMjIuMjkxNUMxOS44NDQyIDIyLjcyNzYgMjAuMDQzIDIzLjEzNzEgMjAuNDMwMyAyMy4xMzc4VjIzLjE1ODVDMjAuMDI0NCAyMy4xNTgyIDE5LjgyMzYgMjIuNzMyMiAxOS44MjI4IDIyLjI5MTVaIiBmaWxsPSIjMUExOTE5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjIuOTc4NSAyMi43MzdMMjIuOTgzNiAyMi43MzIyVjIxLjgxNDRDMjIuOTgzNiAyMS42MTM1IDIyLjg0MzggMjEuNTg0MiAyMi43NzA0IDIxLjU4NDJIMjIuNzE3MlYyMS41MTA3QzIyLjgzMTggMjEuNTEwNyAyMi45NDQ1IDIxLjUyMDQgMjMuMDU5MSAyMS41MjA0QzIzLjE1OTYgMjEuNTIwNCAyMy4yNTk5IDIxLjUxMDcgMjMuMzYwMiAyMS41MTA3VjIxLjU4NDJIMjMuMzIzNUMyMy4yMjEgMjEuNTg0MiAyMy4xMDU2IDIxLjYwMzcgMjMuMTA1NiAyMS44OTVWMjMuMDA4OUMyMy4xMDU2IDIzLjA5NDcgMjMuMTA4MiAyMy4xODAzIDIzLjEyMDYgMjMuMjU2M0gyMy4wMjc2TDIxLjc2ODEgMjEuODUwOFYyMi44NTk3QzIxLjc2ODEgMjMuMDcyOCAyMS44MDk4IDIzLjE0NTkgMjEuOTk3NyAyMy4xNDU5SDIyLjAzOTdWMjMuMjE5NUMyMS45MzQ0IDIzLjIxOTUgMjEuODI5NSAyMy4yMDk5IDIxLjcyNDMgMjMuMjA5OUMyMS42MTQyIDIzLjIwOTkgMjEuNTAxNiAyMy4yMTk1IDIxLjM5MTYgMjMuMjE5NVYyMy4xNDU5SDIxLjQyNTlDMjEuNTk0OSAyMy4xNDU5IDIxLjY0NTkgMjMuMDMwOCAyMS42NDU5IDIyLjgzNTZWMjEuODA0MUMyMS42NDU5IDIxLjY2NzIgMjEuNTMzOSAyMS41ODQyIDIxLjQyMzMgMjEuNTg0MkgyMS4zOTE2VjIxLjUxMDdDMjEuNDg0NSAyMS41MTA3IDIxLjU3OTggMjEuNTIwNCAyMS42NzI5IDIxLjUyMDRDMjEuNzQ2MSAyMS41MjA0IDIxLjgxNjYgMjEuNTEwNyAyMS44OTAzIDIxLjUxMDdMMjIuOTc4NSAyMi43MzdaIiBmaWxsPSIjMUExOTE5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjMuMTIwNyAyMy4yNjY2TDIzLjAxOTUgMjMuMjYzMkwyMS43Nzg3IDIxLjg3ODdWMjIuODU5N0MyMS43ODE1IDIzLjA3MjggMjEuODEzOCAyMy4xMzI4IDIxLjk5NzUgMjMuMTM0OUgyMi4wNTAxVjIzLjIzSDIyLjAzOThDMjEuOTMzOSAyMy4yMyAyMS44Mjg5IDIzLjIyMDIgMjEuNzI0MyAyMy4yMjAyQzIxLjYxNDggMjMuMjIwMiAyMS41MDIyIDIzLjIzIDIxLjM5MTMgMjMuMjNIMjEuMzgxM1YyMy4xMzQ5SDIxLjQyNTlDMjEuNTg3IDIzLjEzNDQgMjEuNjMzNSAyMy4wMzA1IDIxLjYzNTQgMjIuODM1NVYyMS44MDQyQzIxLjYzNTMgMjEuNjczNyAyMS41Mjg0IDIxLjU5NDkgMjEuNDIzNCAyMS41OTQ5SDIxLjM4MTNWMjEuNTAwMUgyMS4zOTEzQzIxLjQ4NTEgMjEuNTAwMSAyMS41ODA0IDIxLjUwOTYgMjEuNjcyOCAyMS41MDk2QzIxLjc0NTQgMjEuNTA5NiAyMS44MTU2IDIxLjUwMDEgMjEuODk4NSAyMS41MDM5TDIyLjk3MjkgMjIuNzE0OVYyMS44MTQ1QzIyLjk3MjEgMjEuNjIwMSAyMi44NDE4IDIxLjU5NjQgMjIuNzcwNSAyMS41OTQ5SDIyLjcwNjFWMjEuNTAwMUgyMi43MTczQzIyLjgzMjEgMjEuNTAwMSAyMi45NDQ5IDIxLjUwOTYgMjMuMDU4OSAyMS41MDk2QzIzLjE1ODkgMjEuNTA5NiAyMy4yNTg3IDIxLjUwMDEgMjMuMzYwMyAyMS41MDAxSDIzLjM3MDZWMjEuNTk0OUgyMy4zMjM0QzIzLjIyMjYgMjEuNTk3NCAyMy4xMTg2IDIxLjYwNjcgMjMuMTE2NSAyMS44OTUxVjIzLjAwODlDMjMuMTE2NSAyMy4wOTQ2IDIzLjExODUgMjMuMTggMjMuMTMwMyAyMy4yNTQ1TDIzLjEzMjQgMjMuMjY2NkgyMy4xMjA3Wk0yMy4wMjc0IDIzLjI0NTJIMjMuMTA3NkMyMy4wOTcyIDIzLjE3MTUgMjMuMDk0OCAyMy4wOTAzIDIzLjA5NDggMjMuMDA4OFYyMS44OTVDMjMuMDk0OCAyMS42MDA3IDIzLjIxODMgMjEuNTc0IDIzLjMyMzIgMjEuNTczM0gyMy4zNDk3VjIxLjUyMTJDMjMuMjUyNiAyMS41MjIgMjMuMTU2NSAyMS41MzA5IDIzLjA1ODcgMjEuNTMwOUMyMi45NDc0IDIxLjUzMDkgMjIuODM4MSAyMS41MjIgMjIuNzI3NCAyMS41MjEyVjIxLjU3MzNIMjIuNzcwM0MyMi44NDU5IDIxLjU3NCAyMi45OTM1IDIxLjYwNzQgMjIuOTkzNSAyMS44MTQ0TDIyLjk5MDkgMjIuNzM5OEwyMi45ODYyIDIyLjc0NDZMMjIuOTc4NCAyMi43NTI2TDIxLjg5MDIgMjEuNTIxMkMyMS44MTc5IDIxLjUyMTIgMjEuNzQ2NyAyMS41MzA5IDIxLjY3MjcgMjEuNTMwOUMyMS41ODI1IDIxLjUzMDkgMjEuNDkwNyAyMS41MjIgMjEuNDAxOCAyMS41MjEyVjIxLjU3MzNIMjEuNDIzMkMyMS41MzgyIDIxLjU3NCAyMS42NTYzIDIxLjY2MDggMjEuNjU2MyAyMS44MDQxVjIyLjgzNTVDMjEuNjU2MyAyMy4wMzE0IDIxLjYwMTcgMjMuMTU2NCAyMS40MjU3IDIzLjE1NzFMMjEuNDAxOCAyMy4xNTY5VjIzLjIwODlDMjEuNTA3OSAyMy4yMDgyIDIxLjYxNjggMjMuMTk5MiAyMS43MjQyIDIzLjE5OTJDMjEuODI2MiAyMy4xOTkyIDIxLjkyNzUgMjMuMjA4MiAyMi4wMjg5IDIzLjIwODlWMjMuMTU3MUgyMS45OTczQzIxLjgwNTUgMjMuMTU2OSAyMS43NTczIDIzLjA3MjggMjEuNzU3MyAyMi44NTk2VjIxLjgyMzRMMjMuMDI3NCAyMy4yNDUyWk0yMi45Nzg3IDIyLjczNjlMMjIuOTg2NCAyMi43Mjk5TDIyLjk3ODcgMjIuNzM2OVpNMjIuOTcyMyAyMi43MzIyVjIyLjczMTZMMjIuOTcwNCAyMi43Mjk3TDIyLjk3MjMgMjIuNzMyMloiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMy43NTI0IDIyLjg2OTZDMjMuNzI4NCAyMi45NTI1IDIzLjY5ODkgMjMuMDE2OCAyMy42OTg5IDIzLjA2MDNDMjMuNjk4OSAyMy4xMzM5IDIzLjgwMTkgMjMuMTQ2MSAyMy44ODIxIDIzLjE0NjFIMjMuOTA5NFYyMy4yMTk1QzIzLjgxMTQgMjMuMjE0MyAyMy43MTExIDIzLjIxMDEgMjMuNjEzMiAyMy4yMTAxQzIzLjUyNTIgMjMuMjEwMSAyMy40MzczIDIzLjIxNDMgMjMuMzQ5NiAyMy4yMTk1VjIzLjE0NjFIMjMuMzYzNUMyMy40NTk0IDIzLjE0NjEgMjMuNTQwNCAyMy4wODk2IDIzLjU3NjEgMjIuOTg2OEwyMy45NjgxIDIxLjg2MzVDMjMuOTk5NyAyMS43NzI3IDI0LjA0MzkgMjEuNjUwNCAyNC4wNTggMjEuNTU5NkMyNC4xMzY2IDIxLjUzMjggMjQuMjM0MSAyMS40ODQyIDI0LjI4MTIgMjEuNDU0NEMyNC4yODgxIDIxLjQ1MTkgMjQuMjkzIDIxLjQ0OTQgMjQuMzAwNiAyMS40NDk0QzI0LjMwNzcgMjEuNDQ5NCAyNC4zMTIzIDIxLjQ0OTQgMjQuMzE3MyAyMS40NTcxQzI0LjMyNDcgMjEuNDc2NSAyNC4zMzIxIDIxLjQ5ODUgMjQuMzM5NSAyMS41MTgxTDI0Ljc4OTQgMjIuNzk4NkMyNC44MTg1IDIyLjg4NCAyNC44NDggMjIuOTc0NSAyNC44OCAyMy4wNDg0QzI0LjkwOTMgMjMuMTE3MSAyNC45NjA2IDIzLjE0NjEgMjUuMDQxMiAyMy4xNDYxSDI1LjA1NjNWMjMuMjE5NUMyNC45NDYxIDIzLjIxNDMgMjQuODM1OSAyMy4yMTAxIDI0LjcxODUgMjMuMjEwMUMyNC41OTg5IDIzLjIxMDEgMjQuNDc2NCAyMy4yMTQzIDI0LjM1MTYgMjMuMjE5NVYyMy4xNDYxSDI0LjM3ODdDMjQuNDM0NiAyMy4xNDYxIDI0LjUzMDUgMjMuMTM2MyAyNC41MzA1IDIzLjA3NTFDMjQuNTMwNSAyMy4wNDM1IDI0LjUwODYgMjIuOTc3MyAyNC40ODEzIDIyLjg5ODZMMjQuMzg1OSAyMi42MTQ4SDIzLjgzMUwyMy43NTI0IDIyLjg2OTZaTTI0LjEwOTggMjEuNzg0OUgyNC4xMDQ5TDIzLjg3NyAyMi40Nzc3SDI0LjMzNDlMMjQuMTA5OCAyMS43ODQ5WiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI1LjA1NTEgMjMuMjMwMUMyNC45NDQ4IDIzLjIyNTggMjQuODM1MSAyMy4yMjAzIDI0LjcxODUgMjMuMjIwM0MyNC41OTkyIDIzLjIyMDMgMjQuNDc2NiAyMy4yMjU4IDI0LjM1MiAyMy4yMzAxTDI0LjM0MTIgMjMuMjMwN1YyMy4xMzU1SDI0LjM3ODRDMjQuNDM1MiAyMy4xMzU1IDI0LjUxOTUgMjMuMTIyNCAyNC41MTk2IDIzLjA3NTJDMjQuNTIwMiAyMy4wNDczIDI0LjQ5ODEgMjIuOTgwNSAyNC40NzA2IDIyLjkwMjRMMjQuMzc3OSAyMi42MjU0SDIzLjgzODFMMjMuNzYyNiAyMi44NzI4QzIzLjczOCAyMi45NTY3IDIzLjcwOTEgMjMuMDIwNyAyMy43MDk0IDIzLjA2MDRDMjMuNzA5NCAyMy4xMjAzIDIzLjgwMTEgMjMuMTM1NSAyMy44ODE5IDIzLjEzNTVIMjMuOTE5M1YyMy4yMzA3TDIzLjkwODMgMjMuMjMwMUMyMy44MTA2IDIzLjIyNTggMjMuNzEwNSAyMy4yMjAzIDIzLjYxMzEgMjMuMjIwM0MyMy41MjU1IDIzLjIyMDMgMjMuNDM3NyAyMy4yMjU4IDIzLjM0OTUgMjMuMjMwMUwyMy4zMzg5IDIzLjIzMDdWMjMuMTM1NUgyMy4zNjM0QzIzLjQ1NDYgMjMuMTM1MSAyMy41MzA4IDIzLjA4MjggMjMuNTY2NiAyMi45ODM1TDIzLjk1NzcgMjEuODU5OEMyMy45ODkgMjEuNzY5MiAyNC4wMzMyIDIxLjY0NzUgMjQuMDU0NyAyMS41NUMyNC4xMzE1IDIxLjUyMzMgMjQuMjI5NyAyMS40NzQyIDI0LjI3NzMgMjEuNDQ0NkMyNC4yODM2IDIxLjQ0MjIgMjQuMjkwNCAyMS40MzkyIDI0LjMwMDQgMjEuNDM5MkMyNC4zMDY3IDIxLjQzODcgMjQuMzE5NiAyMS40NDAzIDI0LjMyNzEgMjEuNDUzNkMyNC4zMzQ1IDIxLjQ3MjkgMjQuMzQxNyAyMS40OTUxIDI0LjM0OTYgMjEuNTE0OUwyNC43OTkzIDIyLjc5NTJDMjQuODI4NyAyMi44ODA5IDI0Ljg1NzggMjIuOTcxMyAyNC44ODk2IDIzLjA0NDNDMjQuOTE4NCAyMy4xMDkxIDI0Ljk2MjYgMjMuMTM0OSAyNS4wNDA4IDIzLjEzNTVIMjUuMDY2MVYyMy4yMzA3TDI1LjA1NTEgMjMuMjMwMVpNMjQuMzYyMyAyMy4yMDg2QzI0LjQ4MzMgMjMuMjA0MiAyNC42MDIyIDIzLjE5OTQgMjQuNzE4OSAyMy4xOTk0QzI0LjgzMjUgMjMuMTk5NCAyNC45Mzg5IDIzLjIwNDIgMjUuMDQ1NiAyMy4yMDg0TDI1LjA0NTMgMjMuMTU3MkgyNS4wNDEyQzI0Ljk1ODQgMjMuMTU3NCAyNC45MDA3IDIzLjEyNDggMjQuODcwMiAyMy4wNTI2QzI0LjgzOCAyMi45Nzg2IDI0LjgwODkgMjIuODg3NyAyNC43Nzk2IDIyLjgwMjNMMjQuMzI5NyAyMS41MjE2QzI0LjMyMjUgMjEuNTAyIDI0LjMxNDcgMjEuNDgwMiAyNC4zMDg5IDIxLjQ2MzJDMjQuMzA2OSAyMS40NjAzIDI0LjMwNzEgMjEuNDYwMyAyNC4zMDU2IDIxLjQ2MDNIMjQuMzAwOEMyNC4yOTU1IDIxLjQ2MDMgMjQuMjkyOCAyMS40NjIgMjQuMjg3IDIxLjQ2MzdDMjQuMjM5MiAyMS40OTM2IDI0LjE0MTMgMjEuNTQyNyAyNC4wNjkxIDIxLjU2MTNDMjQuMDU0IDIxLjY1NDEgMjQuMDA5NSAyMS43NzYyIDIzLjk3ODEgMjEuODY3MUwyMy41ODY1IDIyLjk5MDVDMjMuNTQ5MyAyMy4wOTY5IDIzLjQ2MzggMjMuMTU3NCAyMy4zNjM4IDIzLjE1NzJIMjMuMzYwMlYyMy4yMDg0QzIzLjQ0NDQgMjMuMjA0MiAyMy41Mjg0IDIzLjE5OTQgMjMuNjEzNSAyMy4xOTk0QzIzLjcwODIgMjMuMTk5NCAyMy44MDQ5IDIzLjIwNDIgMjMuODk4OCAyMy4yMDg0VjIzLjE1NzJIMjMuODgyM0MyMy44MDI4IDIzLjE1NjEgMjMuNjkxMyAyMy4xNDc2IDIzLjY4ODIgMjMuMDYwNEMyMy42ODg4IDIzLjAxMjEgMjMuNzE4OSAyMi45NDk2IDIzLjc0MjkgMjIuODY2N0wyMy43NTI3IDIyLjg2OTdMMjMuNzQyOSAyMi44NjY0TDIzLjgyMzMgMjIuNjA0OEgyNC4zOTMzTDI0LjQ5MTUgMjIuODk1NUMyNC41MTg0IDIyLjk3NDMgMjQuNTQwNyAyMy4wMzk1IDI0LjU0MDcgMjMuMDc1M0MyNC41MzcyIDIzLjE1MDIgMjQuNDM0MyAyMy4xNTU4IDI0LjM3ODggMjMuMTU3MkgyNC4zNjIzVjIzLjIwODZaTTIzLjg2MyAyMi40ODg1TDI0LjA5NzggMjEuNzc0M0gyNC4xMTA1VjIxLjc4NTJMMjQuMTA3NyAyMS43ODU5TDI0LjExMDUgMjEuNzg1MlYyMS43NzQzSDI0LjExNzlMMjQuMzQ5MSAyMi40ODg1SDIzLjg2M1pNMjMuODkyMiAyMi40NjcxSDI0LjMyTDI0LjEwNzMgMjEuODExNUwyMy44OTIyIDIyLjQ2NzFaTTI0LjEgMjEuNzg4M0wyNC4xMDQ4IDIxLjc4NjZMMjQuMSAyMS43ODgzWiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI1LjY3MjkgMjIuOTc5NEMyNS42NzI5IDIzLjA3NzggMjUuNzQwOCAyMy4xMDY4IDI1LjgxOTMgMjMuMTE3QzI1LjkxOTMgMjMuMTI0MyAyNi4wMjk1IDIzLjEyNDMgMjYuMTQyMyAyMy4xMTE4QzI2LjI0NDkgMjMuMDk5NSAyNi4zMzI5IDIzLjA0MTEgMjYuMzc2NyAyMi45Nzk0QzI2LjQxNTYgMjIuOTI1NiAyNi40Mzc2IDIyLjg1NzEgMjYuNDUyNiAyMi44MDMzSDI2LjUyMzNDMjYuNDk2NCAyMi45NDI5IDI2LjQ2MjMgMjMuMDgwMSAyNi40MzI5IDIzLjIxOTVDMjYuMjE4MiAyMy4yMTk1IDI2LjAwMjQgMjMuMjEgMjUuNzg3NiAyMy4yMUMyNS41NzIyIDIzLjIxIDI1LjM1NzIgMjMuMjE5NSAyNS4xNDIxIDIzLjIxOTVWMjMuMTQ1OUgyNS4xNzZDMjUuMjY0MiAyMy4xNDU5IDI1LjM1OTkgMjMuMTMzOSAyNS4zNTk5IDIyLjk4MjFWMjEuNzI0QzI1LjM1OTkgMjEuNTk2NCAyNS4yNjQyIDIxLjU4NDIgMjUuMTc2IDIxLjU4NDJIMjUuMTQyMVYyMS41MTA3QzI1LjI3MTUgMjEuNTEwNyAyNS4zOTg4IDIxLjUyMDQgMjUuNTI4MiAyMS41MjA0QzI1LjY1MzIgMjEuNTIwNCAyNS43NzUxIDIxLjUxMDcgMjUuOTAwMiAyMS41MTA3VjIxLjU4NDJIMjUuODM4N0MyNS43NDU4IDIxLjU4NDIgMjUuNjcyOSAyMS41ODY4IDI1LjY3MjkgMjEuNzE2NVYyMi45Nzk0WiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI2LjQzMiAyMy4yM0MyNi4yMTY0IDIzLjIzIDI2LjAwMSAyMy4yMjAyIDI1Ljc4NjYgMjMuMjIwMkMyNS41NzE1IDIzLjIyMDIgMjUuMzU2MyAyMy4yMyAyNS4xNDA2IDIzLjIzSDI1LjEzMDRWMjMuMTM1NEgyNS4xNzVDMjUuMjYzNCAyMy4xMzMyIDI1LjM0NzMgMjMuMTI3IDI1LjM0ODMgMjIuOTgyMVYyMS43MjM2QzI1LjM0NzMgMjEuNjA0NCAyNS4yNjM3IDIxLjU5NjQgMjUuMTc1IDIxLjU5NDlIMjUuMTMwNFYyMS41MDAxSDI1LjE0MDZDMjUuMjcwOSAyMS41MDAxIDI1LjM5ODEgMjEuNTA5NiAyNS41MjcxIDIxLjUwOTZDMjUuNjUxNSAyMS41MDk2IDI1Ljc3MzMgMjEuNTAwMSAyNS44OTkyIDIxLjUwMDFIMjUuOTA5VjIxLjU5NDlIMjUuODM3OEMyNS43NDI5IDIxLjU5NzMgMjUuNjg0IDIxLjU5MyAyNS42ODE5IDIxLjcxNjVWMjIuOTc5NEMyNS42ODI1IDIzLjA3MSAyNS43NDI0IDIzLjA5NTQgMjUuODE4OSAyMy4xMDY0QzI1Ljg2MTkgMjMuMTA5MyAyNS45MDc0IDIzLjExMDkgMjUuOTU0NSAyMy4xMTA5QzI2LjAxNDIgMjMuMTEwOSAyNi4wNzY0IDIzLjEwODEgMjYuMTM5NiAyMy4xMDE1QzI2LjIzOTIgMjMuMDg5NiAyNi4zMjQ5IDIzLjAzMiAyNi4zNjcyIDIyLjk3MzZDMjYuNDA0OSAyMi45MjEyIDI2LjQyNjIgMjIuODU0MSAyNi40NDEgMjIuODAwOUwyNi40NDMgMjIuNzkyOEgyNi41MzUyTDI2LjUzMzEgMjIuODA1N0MyNi41MDU0IDIyLjk0NTYgMjYuNDcxNyAyMy4wODIyIDI2LjQ0MjEgMjMuMjIxN0wyNi40NDAyIDIzLjIzSDI2LjQzMlpNMjYuNDIzIDIzLjIwODhDMjYuNDUxMyAyMy4wNzU4IDI2LjQ4MzMgMjIuOTQ1OCAyNi41MDk3IDIyLjgxMzhIMjYuNDU5M0MyNi40NDQzIDIyLjg2NzEgMjYuNDIyNCAyMi45MzI4IDI2LjM4NDEgMjIuOTg2QzI2LjMzODQgMjMuMDQ5NCAyNi4yNDc5IDIzLjEwOTMgMjYuMTQxOCAyMy4xMjI0QzI2LjA3NzkgMjMuMTI4OSAyNi4wMTQzIDIzLjEzMjMgMjUuOTU0NCAyMy4xMzIzQzI1LjkwNyAyMy4xMzIzIDI1Ljg2MTMgMjMuMTMwMSAyNS44MTY4IDIzLjEyN0MyNS43MzczIDIzLjExODMgMjUuNjYwNCAyMy4wODQxIDI1LjY2MDUgMjIuOTc5NFYyMS43MTY1QzI1LjY2MDUgMjEuNTgwMyAyNS43NDY0IDIxLjU3MzMgMjUuODM3NyAyMS41NzMzSDI1Ljg4OFYyMS41MjEyQzI1Ljc2NzYgMjEuNTIyIDI1LjY0ODcgMjEuNTMxMSAyNS41MjcgMjEuNTMxMUMyNS40MDA3IDIxLjUzMTEgMjUuMjc2NyAyMS41MjIgMjUuMTUxNiAyMS41MjEyVjIxLjU3MzNIMjUuMTc0OUMyNS4yNjIxIDIxLjU3MzMgMjUuMzY4OCAyMS41ODg2IDI1LjM2ODggMjEuNzIzNVYyMi45ODIxQzI1LjM2ODggMjMuMTQwNSAyNS4yNjI2IDIzLjE1NjkgMjUuMTc0OSAyMy4xNTY5SDI1LjE1MTZWMjMuMjA4OEMyNS4zNjI4IDIzLjIwODMgMjUuNTc0MiAyMy4xOTkyIDI1Ljc4NjUgMjMuMTk5MkMyNS45OTkxIDIzLjE5OTIgMjYuMjExMyAyMy4yMDgzIDI2LjQyMyAyMy4yMDg4WiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTExLjIyMTcgMTIuODY4NEMxMS4yMjE3IDEwLjU3ODYgMTMuMDc1NyA4LjcyMjQxIDE1LjM2MjcgOC43MjI0MUMxNy42NDk3IDguNzIyNDEgMTkuNTAzOCAxMC41Nzg2IDE5LjUwMzggMTIuODY4NEMxOS41MDM4IDE1LjE1ODIgMTcuNjQ5NyAxNy4wMTQ1IDE1LjM2MjcgMTcuMDE0NUMxMy4wNzU3IDE3LjAxNDUgMTEuMjIxNyAxNS4xNTgyIDExLjIyMTcgMTIuODY4NFoiIGZpbGw9IiNGRkZGRkUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNy44NjY2IDEyLjc4NjhDMTcuODY0OSAxMS43MjUgMTcuMjAyMSAxMC44MTk1IDE2LjI2OCAxMC40NjA5VjE1LjExMjRDMTcuMjAyMSAxNC43NTM0IDE3Ljg2NDkgMTMuODQ4NyAxNy44NjY2IDEyLjc4NjhaTTE0LjQ4NiAxNS4xMTE1VjEwLjQ2MTRDMTMuNTUyOCAxMC44MjExIDEyLjg5MDkgMTEuNzI1MyAxMi44ODg0IDEyLjc4NjdDMTIuODkwOSAxMy44NDc5IDEzLjU1MjggMTQuNzUyIDE0LjQ4NiAxNS4xMTE1Wk0xNS4zNzc2IDguODU1MTZDMTMuMjA5IDguODU1OTkgMTEuNDUxOSAxMC42MTU1IDExLjQ1MTYgMTIuNzg2N0MxMS40NTE5IDE0Ljk1NzcgMTMuMjA5IDE2LjcxNjkgMTUuMzc3NiAxNi43MTczQzE3LjU0NjMgMTYuNzE2OSAxOS4zMDM3IDE0Ljk1NzcgMTkuMzA0MyAxMi43ODY3QzE5LjMwMzcgMTAuNjE1NSAxNy41NDYzIDguODU1OTkgMTUuMzc3NiA4Ljg1NTE2Wk0xNS4zNjc5IDE3LjA4ODRDMTIuOTk0NyAxNy4wOTk3IDExLjA0MTUgMTUuMTc0OCAxMS4wNDE1IDEyLjgzMTZDMTEuMDQxNSAxMC4yNzA4IDEyLjk5NDcgOC40OTk1NCAxNS4zNjc5IDguNUgxNi40OEMxOC44MjUxIDguNDk5NTQgMjAuOTY1NCAxMC4yNyAyMC45NjU0IDEyLjgzMTZDMjAuOTY1NCAxNS4xNzM5IDE4LjgyNTEgMTcuMDg4NCAxNi40OCAxNy4wODg0SDE1LjM2NzlaIiBmaWxsPSIjMDA2OUFBIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNS41MTAyNSAyMy4xNDU5SDUuNTQ0NTlDNS42MzI1MiAyMy4xNDU5IDUuNzI1NDQgMjMuMTMzOSA1LjcyNTQ0IDIzLjAwNjRWMjEuNzI0QzUuNzI1NDQgMjEuNTk2NCA1LjYzMjUyIDIxLjU4NDMgNS41NDQ1OSAyMS41ODQzSDUuNTEwMjVWMjEuNTEwN0M1LjYwNTU4IDIxLjUxMDcgNS43NTIyOCAyMS41MjA0IDUuODcyNDEgMjEuNTIwNEM1Ljk5NDU4IDIxLjUyMDQgNi4xNDEwOSAyMS41MTA3IDYuMjU2MDQgMjEuNTEwN1YyMS41ODQzSDYuMjIxNTJDNi4xMzM5NyAyMS41ODQzIDYuMDQwODYgMjEuNTk2NCA2LjA0MDg2IDIxLjcyNFYyMy4wMDY0QzYuMDQwODYgMjMuMTMzOSA2LjEzMzk3IDIzLjE0NTkgNi4yMjE1MiAyMy4xNDU5SDYuMjU2MDRWMjMuMjE5NUM2LjEzODc4IDIzLjIxOTUgNS45OTE3MSAyMy4yMSA1Ljg2OTkxIDIzLjIxQzUuNzQ5ODcgMjMuMjEgNS42MDU1OCAyMy4yMTk1IDUuNTEwMjUgMjMuMjE5NVYyMy4xNDU5WiIgZmlsbD0iIzFBMTkxOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTYuMjU2NDMgMjMuMjNDNi4xMzgxNSAyMy4yMyA1Ljk5MTgyIDIzLjIyMDIgNS44NzAxMiAyMy4yMjAyQzUuNzUwNDUgMjMuMjIwMiA1LjYwNjYyIDIzLjIzIDUuNTEwNjQgMjMuMjNINS41VjIzLjEzNTRINS41NDQ4QzUuNjMzNTUgMjMuMTMzMiA1LjcxNDI2IDIzLjEyNjEgNS43MTUgMjMuMDA2NVYyMS43MjRDNS43MTQyNiAyMS42MDQyIDUuNjMzNTUgMjEuNTk2NCA1LjU0NDggMjEuNTk0OUg1LjVWMjEuNTAwMUg1LjUxMDY0QzUuNjA2NjIgMjEuNTAwMSA1Ljc1MzIyIDIxLjUwOTYgNS44NzI4IDIxLjUwOTZDNS45OTQ0MiAyMS41MDk2IDYuMTQwODMgMjEuNTAwMSA2LjI1NjQzIDIxLjUwMDFINi4yNjczNVYyMS41OTQ5SDYuMjIyMzdDNi4xMzM1MiAyMS41OTY0IDYuMDUyMzUgMjEuNjA0MiA2LjA1MTg5IDIxLjcyNFYyMy4wMDY1QzYuMDUyMzUgMjMuMTI2MSA2LjEzMzUyIDIzLjEzMzIgNi4yMjIzNyAyMy4xMzU0SDYuMjY3MzVWMjMuMjNINi4yNTY0M1pNNi4yNDU3NSAyMy4yMDlMNi4yNDU4NSAyMy4xNTY5SDYuMjIyMjVDNi4xMzQ3OCAyMy4xNTY5IDYuMDMwODUgMjMuMTQxNSA2LjAzMDI5IDIzLjAwNjRWMjEuNzI0QzYuMDMwODUgMjEuNTg4NiA2LjEzNDc4IDIxLjU3MzUgNi4yMjIyNSAyMS41NzM1SDYuMjQ1NzVWMjEuNTIxMkM2LjEzMjkzIDIxLjUyMTMgNS45OTEyMyAyMS41MzExIDUuODcyNjcgMjEuNTMxMUM1Ljc1NjUyIDIxLjUzMTEgNS42MTU5MyAyMS41MjIgNS41MjEyNSAyMS41MjEyVjIxLjU3MzVINS41NDQ2N0M1LjYzMTg1IDIxLjU3MzUgNS43MzU5NyAyMS41ODg2IDUuNzM1OTcgMjEuNzI0VjIzLjAwNjRDNS43MzU5NyAyMy4xNDE1IDUuNjMxODUgMjMuMTU2OSA1LjU0NDY3IDIzLjE1NjlINS41MjEyNVYyMy4yMDlDNS42MTU5MyAyMy4yMDgyIDUuNzU0MDIgMjMuMTk5MiA1Ljg2OTk5IDIzLjE5OTJDNS45ODkxMSAyMy4xOTkyIDYuMTMwNDMgMjMuMjA4MyA2LjI0NTc1IDIzLjIwOVoiIGZpbGw9IiMxQTE5MTkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNi40OTI3IDIxLjQ0MTRDMjYuNjQwMyAyMS40NDE0IDI2Ljc1MDMgMjEuNTU0OCAyNi43NTAzIDIxLjY5OThDMjYuNzUwMyAyMS44NDQ2IDI2LjY0MDMgMjEuOTU2OCAyNi40OTI3IDIxLjk1NjhDMjYuMzQ1NiAyMS45NTY4IDI2LjIzNTQgMjEuODQ0NiAyNi4yMzU0IDIxLjY5OThDMjYuMjM1NCAyMS41NTQ4IDI2LjM0NTYgMjEuNDQxNCAyNi40OTI3IDIxLjQ0MTRaTTI2LjQ5MjQgMjEuOTA4OUMyNi42MDc5IDIxLjkwODkgMjYuNjk2MSAyMS44MTA2IDI2LjY5NjEgMjEuNjk5N0MyNi42OTYxIDIxLjU4ODcgMjYuNjA5IDIxLjQ4OTcgMjYuNDkyNCAyMS40ODk3QzI2LjM3NjYgMjEuNDg5NyAyNi4yODg1IDIxLjU4ODcgMjYuMjg4NSAyMS42OTk3QzI2LjI4ODUgMjEuODEwNiAyNi4zNzY2IDIxLjkwODkgMjYuNDkyNCAyMS45MDg5Wk0yNi4zNjQ1IDIxLjgzNTdWMjEuODIzMkMyNi4zOTU5IDIxLjgxODcgMjYuNDAxOCAyMS44MTk1IDI2LjQwMTggMjEuODAwMlYyMS42MDkyQzI2LjQwMTggMjEuNTgyMyAyNi4zOTkyIDIxLjU3MyAyNi4zNjU1IDIxLjU3NDVWMjEuNTYxNEgyNi40OTczQzI2LjU0MjUgMjEuNTYxNCAyNi41ODQzIDIxLjU4MyAyNi41ODQzIDIxLjYyOTlDMjYuNTg0MyAyMS42NjgyIDI2LjU1OTEgMjEuNjk2NiAyNi41MjM0IDIxLjcwNzdMMjYuNTY1OCAyMS43NjY4QzI2LjU4NTUgMjEuNzkzNSAyNi42MDggMjEuODE4NyAyNi42MjI0IDIxLjgyNzZWMjEuODM1N0gyNi41NzIzQzI2LjU0ODMgMjEuODM1NyAyNi41MjcgMjEuNzg1MSAyNi40Nzk4IDIxLjcxNzJIMjYuNDUxM1YyMS44MDI2QzI2LjQ1MTMgMjEuODE5NSAyNi40NTcyIDIxLjgxODcgMjYuNDg4OCAyMS44MjMyVjIxLjgzNTdIMjYuMzY0NVpNMjYuNDUxIDIxLjY5OThIMjYuNDgxM0MyNi41MTQ1IDIxLjY5OTggMjYuNTI5OSAyMS42NzQ3IDI2LjUyOTkgMjEuNjM0QzI2LjUyOTkgMjEuNTkzIDI2LjUwNjIgMjEuNTc4NSAyNi40Nzk3IDIxLjU3ODVIMjYuNDUxVjIxLjY5OThaIiBmaWxsPSIjMUExOTE5Ii8+Cjwvc3ZnPgo=);\n}\n.tooltip__button--data--provider__discover::before {\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2IDRDMjkuMzEzNyA0IDMyIDYuNjg2MjkgMzIgMTBMMzIgMjJDMzIgMjUuMzEzNyAyOS4zMTM3IDI4IDI2IDI4TDYgMjhDMi42ODYyOSAyOCA5Ljc1Njk3ZS0wNyAyNS4zMTM3IDEuMTIwNTRlLTA2IDIyTDEuNjQ1MDhlLTA2IDEwQzEuNzg5OTNlLTA2IDYuNjg2MjkgMi42ODYyOSA0IDYgNEwyNiA0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMCAyMkwzMCAxMEMzMCA3Ljc5MDg2IDI4LjIwOTEgNiAyNiA2TDYgNkMzLjc5MDg2IDYgMiA3Ljc5MDg2IDIgMTBMMiAyMkMyIDI0LjIwOTEgMy43OTA4NiAyNiA2IDI2TDI2IDI2QzI4LjIwOTEgMjYgMzAgMjQuMjA5MSAzMCAyMlpNMzIgMTBDMzIgNi42ODYyOSAyOS4zMTM3IDQgMjYgNEw2IDRDMi42ODYyOSA0IDEuNzg5OTNlLTA2IDYuNjg2MjkgMS42NDUwOGUtMDYgMTBMMS4xMjA1NGUtMDYgMjJDOS43NTY5N2UtMDcgMjUuMzEzNyAyLjY4NjI5IDI4IDYgMjhMMjYgMjhDMjkuMzEzNyAyOCAzMiAyNS4zMTM3IDMyIDIyTDMyIDEwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTYuNDg4NjMgMTYuODE2MUM2LjI2MTA5IDE3LjAxMDcgNS45NzE0NCAxNy4wOTU3IDUuNTA4MjQgMTcuMDk1N0g1LjMxNjA0VjE0Ljc3NEg1LjUwODI0QzUuOTcxNDQgMTQuNzc0IDYuMjQ5OTggMTQuODUzNCA2LjQ4ODYzIDE1LjA1NzZDNi43MzQ5NyAxNS4yNjg3IDYuODgzMDEgMTUuNTk0MiA2Ljg4MzAxIDE1LjkzMUM2Ljg4MzAxIDE2LjI2OTQgNi43MzQ5NyAxNi42MDY2IDYuNDg4NjMgMTYuODE2MVpNNS42NTE3MiAxNC4xNzkzSDQuNjAwMVYxNy42OTA3SDUuNjQ1MzFDNi4yMDE1NCAxNy42OTA3IDYuNjAzMDQgMTcuNTY0IDYuOTU0OTYgMTcuMjg0NkM3LjM3Mjk5IDE2Ljk1MzUgNy42MjEwNCAxNi40NTM3IDcuNjIxMDQgMTUuOTM1OUM3LjYyMTA0IDE0Ljg5OTMgNi44MTE3NyAxNC4xNzkzIDUuNjUxNzIgMTQuMTc5M1oiIGZpbGw9IiMyMDFEMUMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03Ljk1MTE3IDE0LjE3OTNIOC42NjQyN1YxNy42OTA3SDcuOTUxMTdWMTQuMTc5M1oiIGZpbGw9IiMyMDFEMUMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC40MTU5IDE1LjUyNTFDOS45ODU0NCAxNS4zNzQxIDkuODU5NjMgMTUuMjczNCA5Ljg1OTYzIDE1LjA4MzdDOS44NTk2MyAxNC44NjMxIDEwLjA4NDUgMTQuNjk1OCAxMC4zOTM2IDE0LjY5NThDMTAuNjA3OSAxNC42OTU4IDEwLjc4NDUgMTQuNzc3OSAxMC45NzI1IDE0Ljk3ODRMMTEuMzQ0OCAxNC41MTFDMTEuMDM3MiAxNC4yNTIgMTAuNjY5IDE0LjEyMDggMTAuMjY3NyAxNC4xMjA4QzkuNjE4MjggMTQuMTIwOCA5LjEyMzMxIDE0LjU1MzIgOS4xMjMzMSAxNS4xMjQ4QzkuMTIzMzEgMTUuNjEwMiA5LjM1MzQxIDE1Ljg1NjQgMTAuMDI0OSAxNi4wOTAyQzEwLjMwNTYgMTYuMTgzNiAxMC40NDgyIDE2LjI0NzQgMTAuNTIwNCAxNi4yOTA3QzEwLjY2MzUgMTYuMzc5MSAxMC43MzQ3IDE2LjUwNTkgMTAuNzM0NyAxNi42NTI1QzEwLjczNDcgMTYuOTM4MSAxMC40OTgyIDE3LjE0ODEgMTAuMTc4NSAxNy4xNDgxQzkuODM4MTIgMTcuMTQ4MSA5LjU2MjcxIDE2Ljk4NSA5LjM5Nzg3IDE2LjY3ODhMOC45MzY1MiAxNy4xMDY0QzkuMjY2MzYgMTcuNTY4OCA5LjY2MTczIDE3Ljc3NTUgMTAuMjA2NCAxNy43NzU1QzEwLjk0OTMgMTcuNzc1NSAxMS40NzI4IDE3LjI5OTYgMTEuNDcyOCAxNi42MjE3QzExLjQ3MjggMTYuMDYzMSAxMS4yMyAxNS44MDk5IDEwLjQxNTkgMTUuNTI1MVoiIGZpbGw9IiMyMDFEMUMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS42OTczIDE1LjkzNTlDMTEuNjk3MyAxNi45Njg1IDEyLjU0NDMgMTcuNzY4NyAxMy42MzQ3IDE3Ljc2ODdDMTMuOTQyMSAxNy43Njg3IDE0LjIwNTcgMTcuNzEwNiAxNC41MzAzIDE3LjU2NFYxNi43NTcxQzE0LjI0MzUgMTcuMDMyOSAxMy45OTE3IDE3LjE0MTcgMTMuNjY2IDE3LjE0MTdDMTIuOTQ1NSAxNy4xNDE3IDEyLjQzNTIgMTYuNjQyOCAxMi40MzUyIDE1LjkzMUMxMi40MzUyIDE1LjI1ODQgMTIuOTYyIDE0LjcyNTYgMTMuNjM0NyAxNC43MjU2QzEzLjk3NDEgMTQuNzI1NiAxNC4yMzM0IDE0Ljg0MDcgMTQuNTMwMyAxNS4xMjA2VjE0LjMxNDZDMTQuMjE2NyAxNC4xNjI4IDEzLjk1OTQgMTQuMSAxMy42NDkzIDE0LjFDMTIuNTY1MiAxNC4xIDExLjY5NzMgMTQuOTE1OCAxMS42OTczIDE1LjkzNTlaIiBmaWxsPSIjMjAxRDFDIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjAuMzI4MSAxNi41MzY3TDE5LjM0OTUgMTQuMTc5M0gxOC41NjkzTDIwLjEyNDkgMTcuNzc5M0gyMC41MDg2TDIyLjA5NDQgMTQuMTc5M0gyMS4zMjAzTDIwLjMyODEgMTYuNTM2N1oiIGZpbGw9IiMyMDFEMUMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMi40MTg5IDE3LjY5MDdIMjQuNDQ4MlYxNy4wOTU3SDIzLjEzNDlWMTYuMTQ3OUgyNC4zOTg0VjE1LjU1MzFIMjMuMTM0OVYxNC43NzRIMjQuNDQ4MlYxNC4xNzkzSDIyLjQxODlWMTcuNjkwN1oiIGZpbGw9IiMyMDFEMUMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNS44NDU3IDE1Ljc5NEgyNS42Mzc5VjE0LjczMTlIMjUuODU3M0MyNi4zMDQ0IDE0LjczMTkgMjYuNTQzOSAxNC45MTE1IDI2LjU0MzkgMTUuMjUzNkMyNi41NDM5IDE1LjYwNSAyNi4zMDQ0IDE1Ljc5NCAyNS44NDU3IDE1Ljc5NFpNMjcuMjgwOCAxNS4yMTU0QzI3LjI4MDggMTQuNTU3OCAyNi44MDk1IDE0LjE3OTMgMjUuOTgzMyAxNC4xNzkzSDI0LjkyMDRWMTcuNjkwN0gyNS42Mzc5VjE2LjI3ODlIMjUuNzMxTDI2LjcxOTYgMTcuNjkwN0gyNy42TDI2LjQ0NTUgMTYuMjEwOEMyNi45ODUgMTYuMTA1MiAyNy4yODA4IDE1Ljc1MjcgMjcuMjgwOCAxNS4yMTU0WiIgZmlsbD0iIzIwMUQxQyIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE4LjY3MDQgMTUuOTQ0MUMxOC42NzA0IDE2Ljk1NSAxNy44MTQ0IDE3Ljc3NDQgMTYuNzU3NSAxNy43NzQ0QzE1LjcwMDkgMTcuNzc0NCAxNC44NDQ3IDE2Ljk1NSAxNC44NDQ3IDE1Ljk0NDFDMTQuODQ0NyAxNC45MzMgMTUuNzAwOSAxNC4xMTM1IDE2Ljc1NzUgMTQuMTEzNUMxNy44MTQ0IDE0LjExMzUgMTguNjcwNCAxNC45MzMgMTguNjcwNCAxNS45NDQxWiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzg5NDVfODMzKSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE4LjY3MDQgMTUuOTQ0MUMxOC42NzA0IDE2Ljk1NSAxNy44MTQ0IDE3Ljc3NDQgMTYuNzU3NSAxNy43NzQ0QzE1LjcwMDkgMTcuNzc0NCAxNC44NDQ3IDE2Ljk1NSAxNC44NDQ3IDE1Ljk0NDFDMTQuODQ0NyAxNC45MzMgMTUuNzAwOSAxNC4xMTM1IDE2Ljc1NzUgMTQuMTEzNUMxNy44MTQ0IDE0LjExMzUgMTguNjcwNCAxNC45MzMgMTguNjcwNCAxNS45NDQxWiIgZmlsbD0idXJsKCNwYWludDFfcmFkaWFsXzg5NDVfODMzKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzg5NDVfODMzIiB4MT0iMTUuNTgzOSIgeTE9IjE0LjQ1OTQiIHgyPSIxNy45NjQ4IiB5Mj0iMTcuMzM0NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRTY3NzJGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0VBOUQyQyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MV9yYWRpYWxfODk0NV84MzMiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcuMTc4NyAxNi43MDU1KSByb3RhdGUoLTEyOC4xKSBzY2FsZSgyLjUxMTcyIDIuNjI0NzMpIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0VBOUQyQyIgc3RvcC1vcGFjaXR5PSIwIi8+CjxzdG9wIG9mZnNldD0iMC4zMjgxMjUiIHN0b3AtY29sb3I9IiNERjc2MjQiIHN0b3Atb3BhY2l0eT0iMCIvPgo8c3RvcCBvZmZzZXQ9IjAuNzYwMTg4IiBzdG9wLWNvbG9yPSIjQkY0QjIzIiBzdG9wLW9wYWNpdHk9IjAuNzUiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjN0QzMDE3Ii8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==);\n}\n.tooltip__button--data--provider__jcb::before {\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2IDRDMjkuMzEzNyA0IDMyIDYuNjg2MjkgMzIgMTBMMzIgMjJDMzIgMjUuMzEzNyAyOS4zMTM3IDI4IDI2IDI4TDYgMjhDMi42ODYyOSAyOCA5Ljc1Njk3ZS0wNyAyNS4zMTM3IDEuMTIwNTRlLTA2IDIyTDEuNjQ1MDhlLTA2IDEwQzEuNzg5OTNlLTA2IDYuNjg2MjkgMi42ODYyOSA0IDYgNEwyNiA0WiIgZmlsbD0iIzAwOEVFRCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwIDIyTDMwIDEwQzMwIDcuNzkwODYgMjguMjA5MSA2IDI2IDZMNiA2QzMuNzkwODYgNiAyIDcuNzkwODYgMiAxMEwyIDIyQzIgMjQuMjA5MSAzLjc5MDg2IDI2IDYgMjZMMjYgMjZDMjguMjA5MSAyNiAzMCAyNC4yMDkxIDMwIDIyWk0zMiAxMEMzMiA2LjY4NjI5IDI5LjMxMzcgNCAyNiA0TDYgNEMyLjY4NjI5IDQgMS43ODk5M2UtMDYgNi42ODYyOSAxLjY0NTA4ZS0wNiAxMEwxLjEyMDU0ZS0wNiAyMkM5Ljc1Njk3ZS0wNyAyNS4zMTM3IDIuNjg2MjkgMjggNiAyOEwyNiAyOEMyOS4zMTM3IDI4IDMyIDI1LjMxMzcgMzIgMjJMMzIgMTBaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjE4Ii8+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF84OTQ1Xzg0NSkiPgo8cGF0aCBkPSJNMjUgMjAuMDA4NUMyNSAyMS41NDUxIDIzLjc0ODggMjIuNzk2MyAyMi4yMTIyIDIyLjc5NjNINy4wNDM5NVYxMS43NTQ4QzcuMDQzOTUgMTAuMjE4MyA4LjI5NTE2IDguOTY3MDQgOS44MzE3NSA4Ljk2NzA0SDI1VjIwLjAwODVaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjAuMDYxIDE3LjE3NjhIMjEuMjEzNUMyMS4yNDY0IDE3LjE3NjggMjEuMzIzMiAxNy4xNjU4IDIxLjM1NjIgMTcuMTY1OEMyMS41NzU3IDE3LjEyMTkgMjEuNzYyMyAxNi45MjQzIDIxLjc2MjMgMTYuNjQ5OUMyMS43NjIzIDE2LjM4NjUgMjEuNTc1NyAxNi4xODkgMjEuMzU2MiAxNi4xMzQxQzIxLjMyMzIgMTYuMTIzMSAyMS4yNTc0IDE2LjEyMzEgMjEuMjEzNSAxNi4xMjMxSDIwLjA2MVYxNy4xNzY4WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzg5NDVfODQ1KSIvPgo8cGF0aCBkPSJNMjEuMDgxOCA5Ljg5OTk2QzE5Ljk4NDIgOS44OTk5NiAxOS4wODQyIDEwLjc4OSAxOS4wODQyIDExLjg5NzVWMTMuOTcxOUgyMS45MDQ5QzIxLjk3MDggMTMuOTcxOSAyMi4wNDc2IDEzLjk3MTkgMjIuMTAyNSAxMy45ODI5QzIyLjczOTEgMTQuMDE1OCAyMy4yMTEgMTQuMzQ1MSAyMy4yMTEgMTQuOTE1OEMyMy4yMTEgMTUuMzY1OCAyMi44OTI4IDE1Ljc1IDIyLjMwMDEgMTUuODI2OFYxNS44NDg3QzIyLjk0NzYgMTUuODkyNiAyMy40NDE1IDE2LjI1NDggMjMuNDQxNSAxNi44MTQ2QzIzLjQ0MTUgMTcuNDE4MyAyMi44OTI4IDE3LjgxMzQgMjIuMTY4NCAxNy44MTM0SDE5LjA3MzJWMjEuODc0NEgyMi4wMDM3QzIzLjEwMTMgMjEuODc0NCAyNC4wMDEzIDIwLjk4NTMgMjQuMDAxMyAxOS44NzY4VjkuODk5OTZIMjEuMDgxOFoiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl84OTQ1Xzg0NSkiLz4KPHBhdGggZD0iTTIxLjYxOTYgMTUuMDQ3NUMyMS42MTk2IDE0Ljc4NDEgMjEuNDMzIDE0LjYwODUgMjEuMjEzNSAxNC41NzU2QzIxLjE5MTUgMTQuNTc1NiAyMS4xMzY2IDE0LjU2NDYgMjEuMTAzNyAxNC41NjQ2SDIwLjA2MVYxNS41MzA0SDIxLjEwMzdDMjEuMTM2NiAxNS41MzA0IDIxLjIwMjUgMTUuNTMwNCAyMS4yMTM1IDE1LjUxOTVDMjEuNDMzIDE1LjQ4NjUgMjEuNjE5NiAxNS4zMTA5IDIxLjYxOTYgMTUuMDQ3NVoiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl84OTQ1Xzg0NSkiLz4KPHBhdGggZD0iTTEwLjA0MDMgOS44OTk5NkM4Ljk0MjcxIDkuODk5OTYgOC4wNDI3MSAxMC43ODkgOC4wNDI3MSAxMS44OTc1VjE2LjgyNTZDOC42MDI0NyAxNy4xIDkuMTg0MTggMTcuMjc1NiA5Ljc2NTg4IDE3LjI3NTZDMTAuNDU3MyAxNy4yNzU2IDEwLjgzMDUgMTYuODU4NSAxMC44MzA1IDE2LjI4NzhWMTMuOTYwOUgxMi41NDI3VjE2LjI3NjhDMTIuNTQyNyAxNy4xNzY4IDExLjk4MyAxNy45MTIyIDEwLjA4NDIgMTcuOTEyMkM4LjkzMTc0IDE3LjkxMjIgOC4wMzE3NCAxNy42NTk3IDguMDMxNzQgMTcuNjU5N1YyMS44NjM0SDEwLjk2MjJDMTIuMDU5OCAyMS44NjM0IDEyLjk1OTggMjAuOTc0NCAxMi45NTk4IDE5Ljg2NThWOS44OTk5NkgxMC4wNDAzWiIgZmlsbD0idXJsKCNwYWludDNfbGluZWFyXzg5NDVfODQ1KSIvPgo8cGF0aCBkPSJNMTUuNTYxIDkuODk5OTZDMTQuNDYzNSA5Ljg5OTk2IDEzLjU2MzUgMTAuNzg5IDEzLjU2MzUgMTEuODk3NVYxNC41MDk3QzE0LjA2ODQgMTQuMDgxNyAxNC45NDY0IDEzLjgwNzMgMTYuMzYyMyAxMy44NzMxQzE3LjExOTYgMTMuOTA2MSAxNy45MzE4IDE0LjExNDYgMTcuOTMxOCAxNC4xMTQ2VjE0Ljk1OTdDMTcuNTI1NyAxNC43NTEyIDE3LjA0MjcgMTQuNTY0NiAxNi40MTcxIDE0LjUyMDdDMTUuMzQxNSAxNC40NDM5IDE0LjY5NCAxNC45NzA3IDE0LjY5NCAxNS44OTI2QzE0LjY5NCAxNi44MjU2IDE1LjM0MTUgMTcuMzUyNCAxNi40MTcxIDE3LjI2NDZDMTcuMDQyNyAxNy4yMjA3IDE3LjUyNTcgMTcuMDIzMSAxNy45MzE4IDE2LjgyNTZWMTcuNjcwN0MxNy45MzE4IDE3LjY3MDcgMTcuMTMwNSAxNy44NzkyIDE2LjM2MjMgMTcuOTEyMkMxNC45NDY0IDE3Ljk3OCAxNC4wNjg0IDE3LjcwMzYgMTMuNTYzNSAxNy4yNzU2VjIxLjg4NTNIMTYuNDk0QzE3LjU5MTUgMjEuODg1MyAxOC40OTE1IDIwLjk5NjMgMTguNDkxNSAxOS44ODc4VjkuODk5OTZIMTUuNTYxWiIgZmlsbD0idXJsKCNwYWludDRfbGluZWFyXzg5NDVfODQ1KSIvPgo8L2c+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfODk0NV84NDUiIHgxPSIxOS4wODIxIiB5MT0iMTYuNjUxIiB4Mj0iMjQuMDE0OCIgeTI9IjE2LjY1MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA3OTQwIi8+CjxzdG9wIG9mZnNldD0iMC4yMjg1IiBzdG9wLWNvbG9yPSIjMDA4NzNGIi8+CjxzdG9wIG9mZnNldD0iMC43NDMzIiBzdG9wLWNvbG9yPSIjNDBBNzM3Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzVDQjUzMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfODk0NV84NDUiIHgxPSIxOS4wODIyIiB5MT0iMTUuODgyMiIgeDI9IjI0LjAxNDgiIHkyPSIxNS44ODIyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwMDc5NDAiLz4KPHN0b3Agb2Zmc2V0PSIwLjIyODUiIHN0b3AtY29sb3I9IiMwMDg3M0YiLz4KPHN0b3Agb2Zmc2V0PSIwLjc0MzMiIHN0b3AtY29sb3I9IiM0MEE3MzciLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNUNCNTMxIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl84OTQ1Xzg0NSIgeDE9IjE5LjA4MiIgeTE9IjE1LjA0NTgiIHgyPSIyNC4wMTQ0IiB5Mj0iMTUuMDQ1OCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA3OTQwIi8+CjxzdG9wIG9mZnNldD0iMC4yMjg1IiBzdG9wLWNvbG9yPSIjMDA4NzNGIi8+CjxzdG9wIG9mZnNldD0iMC43NDMzIiBzdG9wLWNvbG9yPSIjNDBBNzM3Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzVDQjUzMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50M19saW5lYXJfODk0NV84NDUiIHgxPSI4LjA0MDIyIiB5MT0iMTUuODgyMiIgeDI9IjEzLjA0ODgiIHkyPSIxNS44ODIyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMxRjI4NkYiLz4KPHN0b3Agb2Zmc2V0PSIwLjQ3NTEiIHN0b3AtY29sb3I9IiMwMDRFOTQiLz4KPHN0b3Agb2Zmc2V0PSIwLjgyNjEiIHN0b3AtY29sb3I9IiMwMDY2QjEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDA2RkJDIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQ0X2xpbmVhcl84OTQ1Xzg0NSIgeDE9IjEzLjUzNSIgeTE9IjE1Ljg4MjIiIHgyPSIxOC4zOTkzIiB5Mj0iMTUuODgyMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNkMyQzJGIi8+CjxzdG9wIG9mZnNldD0iMC4xNzM1IiBzdG9wLWNvbG9yPSIjODgyNzMwIi8+CjxzdG9wIG9mZnNldD0iMC41NzMxIiBzdG9wLWNvbG9yPSIjQkUxODMzIi8+CjxzdG9wIG9mZnNldD0iMC44NTg1IiBzdG9wLWNvbG9yPSIjREMwNDM2Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0U2MDAzOSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzg5NDVfODQ1Ij4KPHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjEzLjgyOTMiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3IDkpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==);\n}\n.tooltip__button--data--provider__mastercard::before {\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2IDRDMjkuMzEzNyA0IDMyIDYuNjg2MjkgMzIgMTBMMzIgMjJDMzIgMjUuMzEzNyAyOS4zMTM3IDI4IDI2IDI4TDYgMjhDMi42ODYyOSAyOCA5Ljc1Njk3ZS0wNyAyNS4zMTM3IDEuMTIwNTRlLTA2IDIyTDEuNjQ1MDhlLTA2IDEwQzEuNzg5OTNlLTA2IDYuNjg2MjkgMi42ODYyOSA0IDYgNEwyNiA0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMCAyMkwzMCAxMEMzMCA3Ljc5MDg2IDI4LjIwOTEgNiAyNiA2TDYgNkMzLjc5MDg2IDYgMiA3Ljc5MDg2IDIgMTBMMiAyMkMyIDI0LjIwOTEgMy43OTA4NiAyNiA2IDI2TDI2IDI2QzI4LjIwOTEgMjYgMzAgMjQuMjA5MSAzMCAyMlpNMzIgMTBDMzIgNi42ODYyOSAyOS4zMTM3IDQgMjYgNEw2IDRDMi42ODYyOSA0IDEuNzg5OTNlLTA2IDYuNjg2MjkgMS42NDUwOGUtMDYgMTBMMS4xMjA1NGUtMDYgMjJDOS43NTY5N2UtMDcgMjUuMzEzNyAyLjY4NjI5IDI4IDYgMjhMMjYgMjhDMjkuMzEzNyAyOCAzMiAyNS4zMTM3IDMyIDIyTDMyIDEwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNMTguNDAzOCAyMC4xNjExSDEzLjU5MjhWMTEuNTY5SDE4LjQwMzhWMjAuMTYxMVoiIGZpbGw9IiNGRjVGMDAiLz4KPHBhdGggZD0iTTEzLjkwMTYgMTUuODY0NEMxMy45MDE2IDE0LjEyMTQgMTQuNzIyOCAxMi41Njg5IDE2LjAwMTcgMTEuNTY4M0MxNS4wNjY1IDEwLjgzNjcgMTMuODg2MyAxMC40IDEyLjYwMzYgMTAuNEM5LjU2Njk4IDEwLjQgNy4xMDU0NyAxMi44NDY0IDcuMTA1NDcgMTUuODY0NEM3LjEwNTQ3IDE4Ljg4MjMgOS41NjY5OCAyMS4zMjg3IDEyLjYwMzYgMjEuMzI4N0MxMy44ODYzIDIxLjMyODcgMTUuMDY2NSAyMC44OTIgMTYuMDAxNyAyMC4xNjA0QzE0LjcyMjggMTkuMTU5OSAxMy45MDE2IDE3LjYwNzMgMTMuOTAxNiAxNS44NjQ0WiIgZmlsbD0iI0VCMDAxQiIvPgo8cGF0aCBkPSJNMjQuODkzNiAxNS44NjQ0QzI0Ljg5MzYgMTguODgyMyAyMi40MzIxIDIxLjMyODcgMTkuMzk1NSAyMS4zMjg3QzE4LjExMjggMjEuMzI4NyAxNi45MzI2IDIwLjg5MiAxNS45OTcxIDIwLjE2MDRDMTcuMjc2MiAxOS4xNTk5IDE4LjA5NzQgMTcuNjA3MyAxOC4wOTc0IDE1Ljg2NDRDMTguMDk3NCAxNC4xMjE0IDE3LjI3NjIgMTIuNTY4OSAxNS45OTcxIDExLjU2ODNDMTYuOTMyNiAxMC44MzY3IDE4LjExMjggMTAuNCAxOS4zOTU1IDEwLjRDMjIuNDMyMSAxMC40IDI0Ljg5MzYgMTIuODQ2NCAyNC44OTM2IDE1Ljg2NDRaIiBmaWxsPSIjRjc5RTFCIi8+Cjwvc3ZnPgo=);\n}\n.tooltip__button--data--provider__unionPay::before {\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2IDRDMjkuMzEzNyA0IDMyIDYuNjg2MjkgMzIgMTBMMzIgMjJDMzIgMjUuMzEzNyAyOS4zMTM3IDI4IDI2IDI4TDYgMjhDMi42ODYyOSAyOCA5Ljc1Njk3ZS0wNyAyNS4zMTM3IDEuMTIwNTRlLTA2IDIyTDEuNjQ1MDhlLTA2IDEwQzEuNzg5OTNlLTA2IDYuNjg2MjkgMi42ODYyOSA0IDYgNEwyNiA0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMCAyMkwzMCAxMEMzMCA3Ljc5MDg2IDI4LjIwOTEgNiAyNiA2TDYgNkMzLjc5MDg2IDYgMiA3Ljc5MDg2IDIgMTBMMiAyMkMyIDI0LjIwOTEgMy43OTA4NiAyNiA2IDI2TDI2IDI2QzI4LjIwOTEgMjYgMzAgMjQuMjA5MSAzMCAyMlpNMzIgMTBDMzIgNi42ODYyOSAyOS4zMTM3IDQgMjYgNEw2IDRDMi42ODYyOSA0IDEuNzg5OTNlLTA2IDYuNjg2MjkgMS42NDUwOGUtMDYgMTBMMS4xMjA1NGUtMDYgMjJDOS43NTY5N2UtMDcgMjUuMzEzNyAyLjY4NjI5IDI4IDYgMjhMMjYgMjhDMjkuMzEzNyAyOCAzMiAyNS4zMTM3IDMyIDIyTDMyIDEwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI1LjAxMzQgOS41MDM3MkwyMC4wODgyIDkuNTAyNDRDMjAuMDg3NiA5LjUwMjQ0IDIwLjA4NjkgOS41MDI0NCAyMC4wODY5IDkuNTAyNDRDMjAuMDgzMSA5LjUwMjQ0IDIwLjA3OTQgOS41MDMxMiAyMC4wNzU3IDkuNTAzMTJDMTkuMzk5MSA5LjUyNDAyIDE4LjU1NjQgMTAuMDcxMSAxOC40MDI5IDEwLjc0NTZMMTYuMDczNyAyMS4xMzQ2QzE1LjkyMDMgMjEuODE1NCAxNi4zMzc4IDIyLjM2OTQgMTcuMDA5NSAyMi4zNzk2SDIyLjE4MzZDMjIuODQ1IDIyLjM0NjYgMjMuNDg3OCAyMS44MDU5IDIzLjYzODcgMjEuMTM5TDI1Ljk2NzkgMTAuNzVDMjYuMTIzOCAxMC4wNjIyIDI1LjY5NjIgOS41MDM3MiAyNS4wMTM0IDkuNTAzNzJaIiBmaWxsPSIjMDE3OThBIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYuMDczOCAyMS4xMzQ2TDE4LjQwMjkgMTAuNzQ1N0MxOC41NTY0IDEwLjA3MTEgMTkuMzk5MSA5LjUyNDA4IDIwLjA3NTcgOS41MDMxOEwxOC4xMTc1IDkuNTAxOUwxNC41ODkzIDkuNTAxMjJDMTMuOTEwOSA5LjUxNTIxIDEzLjA1NzIgMTAuMDY2MSAxMi45MDM4IDEwLjc0NTdMMTAuNTczOSAyMS4xMzQ2QzEwLjQxOTkgMjEuODE1NSAxMC44MzggMjIuMzY5NSAxMS41MDkzIDIyLjM3OTdIMTcuMDA5NUMxNi4zMzc4IDIyLjM2OTUgMTUuOTIwMyAyMS44MTU1IDE2LjA3MzggMjEuMTM0NloiIGZpbGw9IiMwMjQzODEiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC41NzM5IDIxLjEzNDZMMTIuOTAzNyAxMC43NDU2QzEzLjA1NzIgMTAuMDY2MSAxMy45MTA4IDkuNTE1MTggMTQuNTg5MyA5LjUwMTE5TDEwLjA2OTYgOS41QzkuMzg3MjcgOS41IDguNTEyNTEgMTAuMDU3MiA4LjM1NjU4IDEwLjc0NTZMNi4wMjY3NCAyMS4xMzQ2QzYuMDEyNTYgMjEuMTk4IDYuMDA0NjkgMjEuMjYwMSA2IDIxLjMyMDlWMjEuNTEzN0M2LjA0NTYxIDIyLjAxIDYuNDIxNjIgMjIuMzcxNCA2Ljk2MjExIDIyLjM3OTdIMTEuNTA5M0MxMC44MzggMjIuMzY5NSAxMC40MTk4IDIxLjgxNTQgMTAuNTczOSAyMS4xMzQ2WiIgZmlsbD0iI0REMDIyOCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE0LjY4NDYgMTcuMDcxM0gxNC43NzAxQzE0Ljg0ODcgMTcuMDcxMyAxNC45MDE2IDE3LjA0NDcgMTQuOTI2NCAxNi45OTIxTDE1LjE0ODYgMTYuNjU2N0gxNS43NDM4TDE1LjYxOTcgMTYuODc3M0gxNi4zMzM0TDE2LjI0MjkgMTcuMjE1MkgxNS4zOTM3QzE1LjI5NTkgMTcuMzYzNSAxNS4xNzU1IDE3LjQzMzMgMTUuMDMwNyAxNy40MjVIMTQuNTg4NEwxNC42ODQ2IDE3LjA3MTNaTTE0LjU4NjggMTcuNTU1NkgxNi4xNTA0TDE2LjA1MDcgMTcuOTIyN0gxNS40MjE5TDE1LjMyNiAxOC4yNzdIMTUuOTM3OEwxNS44MzgyIDE4LjY0NEgxNS4yMjYzTDE1LjA4NDIgMTkuMTY3NkMxNS4wNDkgMTkuMjU1MSAxNS4wOTUyIDE5LjI5NDUgMTUuMjIyMiAxOS4yODU1SDE1LjcyMDlMMTUuNjI4NSAxOS42MjY2SDE0LjY3MTFDMTQuNDg5NiAxOS42MjY2IDE0LjQyNzQgMTkuNTIyIDE0LjQ4NDMgMTkuMzEyMkwxNC42NjYgMTguNjQ0SDE0LjI3NDlMMTQuMzc0MyAxOC4yNzdIMTQuNzY1NEwxNC44NjEzIDE3LjkyMjdIMTQuNDg3NEwxNC41ODY4IDE3LjU1NTZaTTE3LjA4MjQgMTYuNjU0MkwxNy4wNTc4IDE2Ljg2OTFDMTcuMDU3OCAxNi44NjkxIDE3LjM1MjcgMTYuNjQ1OSAxNy42MjA2IDE2LjY0NTlIMTguNjEwNEwxOC4yMzE5IDE4LjAyNzJDMTguMjAwNSAxOC4xODUxIDE4LjA2NTkgMTguMjYzNiAxNy44MjgxIDE4LjI2MzZIMTYuNzA2MkwxNi40NDM1IDE5LjIzMzVDMTYuNDI4MyAxOS4yODU1IDE2LjQ0OTcgMTkuMzEyMSAxNi41MDYzIDE5LjMxMjFIMTYuNzI3MUwxNi42NDU5IDE5LjYxMzJIMTYuMDg0N0MxNS44NjkzIDE5LjYxMzIgMTUuNzc5NyAxOS41NDc5IDE1LjgxNTIgMTkuNDE2OEwxNi41NTc4IDE2LjY1NDJIMTcuMDgyNFpNMTcuOTIwNiAxNy4wNDQ3SDE3LjAzNzFMMTYuOTMxNSAxNy40MTc0QzE2LjkzMTUgMTcuNDE3NCAxNy4wNzg2IDE3LjMxMDMgMTcuMzI0NSAxNy4zMDY1QzE3LjU2OTcgMTcuMzAyNiAxNy44NDk1IDE3LjMwNjUgMTcuODQ5NSAxNy4zMDY1TDE3LjkyMDYgMTcuMDQ0N1pNMTcuNjAwNSAxNy45MDkzQzE3LjY2NTkgMTcuOTE4MiAxNy43MDI0IDE3Ljg5MjIgMTcuNzA2OCAxNy44MzA3TDE3Ljc2MDkgMTcuNjM0MkgxNi44NzYxTDE2LjgwMTkgMTcuOTA5M0gxNy42MDA1Wk0xNy4wMDM3IDE4LjM1NTZIMTcuNTEzOEwxNy41MDQzIDE4LjU3OEgxNy42NDAxQzE3LjcwODcgMTguNTc4IDE3Ljc0MjcgMTguNTU1OSAxNy43NDI3IDE4LjUxMjJMMTcuNzgyOSAxOC4zNjgySDE4LjIwNjhMMTguMTUwMiAxOC41NzhDMTguMTAyMyAxOC43NTMgMTcuOTc1NCAxOC44NDQzIDE3Ljc2OTEgMTguODUzMkgxNy40OTc0TDE3LjQ5NjIgMTkuMjMzNUMxNy40OTEyIDE5LjI5NDQgMTcuNTQ1OCAxOS4zMjU1IDE3LjY1ODMgMTkuMzI1NUgxNy45MTM3TDE3LjgzMTMgMTkuNjI2NkgxNy4yMTg4QzE3LjA0NzEgMTkuNjM0OCAxNi45NjMgMTkuNTUyNCAxNi45NjQ3IDE5LjM3NzRMMTcuMDAzNyAxOC4zNTU2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC44MjM4IDE0LjgxNEMxMC43NTQ2IDE1LjE1NTcgMTAuNTk0MiAxNS40MTgxIDEwLjM0NTUgMTUuNjA0NUMxMC4wOTkgMTUuNzg3NyA5Ljc4MTEgMTUuODc5NiA5LjM5MTg4IDE1Ljg3OTZDOS4wMjU1OSAxNS44Nzk2IDguNzU3MDUgMTUuNzg1NyA4LjU4NTY5IDE1LjU5NzVDOC40NjY4NCAxNS40NjM3IDguNDA3NzEgMTUuMjkzOCA4LjQwNzcxIDE1LjA4ODRDOC40MDc3MSAxNS4wMDM1IDguNDE3OCAxNC45MTIyIDguNDM3OTMgMTQuODE0TDguODUyNjMgMTIuNzk4Mkg5LjQ3ODk2TDkuMDY5OSAxNC43OTEyQzkuMDU3MzEgMTQuODQ2MyA5LjA1MjI5IDE0Ljg5NzcgOS4wNTI5NSAxNC45NDRDOS4wNTIyOSAxNS4wNDYgOS4wNzc0MyAxNS4xMjk3IDkuMTI4MzcgMTUuMTk1QzkuMjAyNTcgMTUuMjkyIDkuMzIzIDE1LjM0MDEgOS40OTA1OSAxNS4zNDAxQzkuNjgzMzEgMTUuMzQwMSA5Ljg0MjExIDE1LjI5MjYgOS45NjUzNSAxNS4xOTY5QzEwLjA4ODYgMTUuMTAxOCAxMC4xNjkxIDE0Ljk2NjggMTAuMjA1MyAxNC43OTEyTDEwLjYxNTYgMTIuNzk4MkgxMS4yMzg4TDEwLjgyMzggMTQuODE0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy40NTQxIDE0LjAyMDlIMTMuOTQ0NkwxMy41NjA0IDE1LjgxOTlIMTMuMDcwOEwxMy40NTQxIDE0LjAyMDlaTTEzLjYwODUgMTMuMzY1NUgxNC4xMDM0TDE0LjAxMDkgMTMuODAyMkgxMy41MTYxTDEzLjYwODUgMTMuMzY1NVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTQuMzc4OCAxNS42ODNDMTQuMjUwNSAxNS41NTk0IDE0LjE4NTcgMTUuMzkyNyAxNC4xODUxIDE1LjE4MUMxNC4xODUxIDE1LjE0NDggMTQuMTg3MiAxNS4xMDM2IDE0LjE5MiAxNS4wNTg2QzE0LjE5NjcgMTUuMDEyOSAxNC4yMDI3IDE0Ljk2ODYgMTQuMjExMiAxNC45Mjc0QzE0LjI2OTMgMTQuNjM1MiAxNC4zOTMyIDE0LjQwMzIgMTQuNTg0MSAxNC4yMzJDMTQuNzc0NiAxNC4wNjAyIDE1LjAwNDUgMTMuOTc0IDE1LjI3MzYgMTMuOTc0QzE1LjQ5NCAxMy45NzQgMTUuNjY4OCAxNC4wMzYxIDE1Ljc5NjggMTQuMTYwNEMxNS45MjQ4IDE0LjI4NTMgMTUuOTg4OSAxNC40NTM4IDE1Ljk4ODkgMTQuNjY4MkMxNS45ODg5IDE0LjcwNDkgMTUuOTg2MSAxNC43NDc0IDE1Ljk4MTQgMTQuNzkzQzE1Ljk3NTcgMTQuODM5MyAxNS45Njg4IDE0Ljg4MzcgMTUuOTYwOSAxNC45Mjc0QzE1LjkwNCAxNS4yMTUyIDE1Ljc4MDUgMTUuNDQ0NyAxNS41ODk2IDE1LjYxMjdDMTUuMzk4OCAxNS43ODE5IDE1LjE2OTYgMTUuODY2MiAxNC45MDIzIDE1Ljg2NjJDMTQuNjgwOSAxNS44NjYyIDE0LjUwNjcgMTUuODA1MyAxNC4zNzg4IDE1LjY4M1pNMTUuMzEzNSAxNS4zMjY4QzE1LjQgMTUuMjMyMyAxNS40NjE5IDE1LjA4OSAxNS40OTk3IDE0Ljg5ODNDMTUuNTA1MyAxNC44Njg1IDE1LjUxMDMgMTQuODM3NCAxNS41MTM1IDE0LjgwNjNDMTUuNTE2NiAxNC43NzU5IDE1LjUxNzkgMTQuNzQ3NCAxNS41MTc5IDE0LjcyMTRDMTUuNTE3OSAxNC42MTA0IDE1LjQ4OTkgMTQuNTI0MyAxNS40MzM2IDE0LjQ2MzRDMTUuMzc3NyAxNC40MDE5IDE1LjI5ODEgMTQuMzcxNSAxNS4xOTUzIDE0LjM3MTVDMTUuMDU5NSAxNC4zNzE1IDE0Ljk0ODggMTQuNDE5NiAxNC44NjIxIDE0LjUxNkMxNC43NzQ2IDE0LjYxMjQgMTQuNzEyNyAxNC43NTgyIDE0LjY3MzcgMTQuOTUyMUMxNC42NjgzIDE0Ljk4MTkgMTQuNjYzOSAxNS4wMTE3IDE0LjY1OTkgMTUuMDQwOUMxNC42NTY3IDE1LjA3MDcgMTQuNjU1OCAxNS4wOTg2IDE0LjY1NjQgMTUuMTIzOUMxNC42NTY0IDE1LjIzNDIgMTQuNjg0NCAxNS4zMTkyIDE0Ljc0MDcgMTUuMzc5NEMxNC43OTY2IDE1LjQzOTYgMTQuODc1OCAxNS40Njk0IDE0Ljk3OTkgMTUuNDY5NEMxNS4xMTY0IDE1LjQ2OTQgMTUuMjI3MSAxNS40MjE4IDE1LjMxMzUgMTUuMzI2OFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTkuMTcxNCAxNy4wODY1TDE5LjI4OTcgMTYuNjY2OEgxOS44ODc3TDE5Ljg2MTkgMTYuODIwOEMxOS44NjE5IDE2LjgyMDggMjAuMTY3NSAxNi42NjY4IDIwLjM4NzYgMTYuNjY2OEMyMC42MDc3IDE2LjY2NjggMjEuMTI3IDE2LjY2NjggMjEuMTI3IDE2LjY2NjhMMjEuMDA5NSAxNy4wODY1SDIwLjg5MzJMMjAuMzM1NCAxOS4wNjU1SDIwLjQ1MTdMMjAuMzQxIDE5LjQ1ODVIMjAuMjI0N0wyMC4xNzYzIDE5LjYyOTFIMTkuNTk3MkwxOS42NDU1IDE5LjQ1ODVIMTguNTAyOUwxOC42MTQzIDE5LjA2NTVIMTguNzI4N0wxOS4yODcxIDE3LjA4NjVIMTkuMTcxNFpNMTkuODE2NiAxNy4wODY1TDE5LjY2NDQgMTcuNjIyMUMxOS42NjQ0IDE3LjYyMjEgMTkuOTI0OCAxNy41MjE0IDIwLjE0OTMgMTcuNDkyOEMyMC4xOTg5IDE3LjMwNTggMjAuMjYzNyAxNy4wODY1IDIwLjI2MzcgMTcuMDg2NUwxOS44MTY2IDE3LjA4NjVaTTE5LjU5MzkgMTcuODczMUwxOS40NDEyIDE4LjQzNDFDMTkuNDQxMiAxOC40MzQxIDE5LjcyOTggMTguMjkwOSAxOS45Mjc5IDE4LjI3ODhDMTkuOTg1MSAxOC4wNjIgMjAuMDQyNCAxNy44NzMxIDIwLjA0MjQgMTcuODczMUgxOS41OTM5Wk0xOS43MDU5IDE5LjA2NTVMMTkuODIwNCAxOC42NTg2SDE5LjM3NEwxOS4yNTg5IDE5LjA2NTVIMTkuNzA1OVpNMjEuMTUyMiAxNi42NDA5SDIxLjcxNDVMMjEuNzM4MyAxNi44NUMyMS43MzQ2IDE2LjkwMzIgMjEuNzY2IDE2LjkyODYgMjEuODMyNiAxNi45Mjg2SDIxLjkzMkwyMS44MzE1IDE3LjI4M0gyMS40MTgyQzIxLjI2MDQgMTcuMjkxMiAyMS4xNzkzIDE3LjIzMDQgMjEuMTcxOCAxNy4wOTkxTDIxLjE1MjIgMTYuNjQwOVpNMjAuOTg3NSAxNy40MDA5SDIyLjgwODZMMjIuNzAxNyAxNy43ODEzSDIyLjEyMTlMMjIuMDIyNSAxOC4xMzQ5SDIyLjYwMTdMMjIuNDk0MiAxOC41MTQ2SDIxLjg0OTFMMjEuNzAzMSAxOC43MzcySDIyLjAxODlMMjIuMDkxOCAxOS4xODI4QzIyLjEwMDUgMTkuMjI3MiAyMi4xMzk1IDE5LjI0ODcgMjIuMjA2MiAxOS4yNDg3SDIyLjMwNDJMMjIuMjAxMiAxOS42MTU3SDIxLjg1NDFDMjEuNjc0MiAxOS42MjQ2IDIxLjU4MTIgMTkuNTYzOCAyMS41NzM2IDE5LjQzMjZMMjEuNDg5OSAxOS4wMjU2TDIxLjIwMjYgMTkuNDU4NkMyMS4xMzQ2IDE5LjU4MDkgMjEuMDMwMiAxOS42MzggMjAuODg5NCAxOS42MjkxSDIwLjM1OTNMMjAuNDYyNCAxOS4yNjJIMjAuNjI3OEMyMC42OTU4IDE5LjI2MiAyMC43NTIzIDE5LjIzMTYgMjAuODAzMiAxOS4xNzAxTDIxLjI1MjkgMTguNTE0NkgyMC42NzMxTDIwLjc4MDYgMTguMTM0OUgyMS40MDk0TDIxLjUwOTQgMTcuNzgxM0gyMC44OEwyMC45ODc1IDE3LjQwMDlaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTExLjQwMDMgMTQuMDIwNEgxMS44NDI3TDExLjc5MjEgMTQuMjgwM0wxMS44NTU2IDE0LjIwNjFDMTEuOTk5IDE0LjA1MTUgMTIuMTczMiAxMy45NzQ3IDEyLjM3ODggMTMuOTc0N0MxMi41NjQ5IDEzLjk3NDcgMTIuNjk5MiAxNC4wMjkzIDEyLjc4MzUgMTQuMTM4OUMxMi44NjY0IDE0LjI0ODYgMTIuODg5MSAxNC40MDAxIDEyLjg0OTggMTQuNTk0N0wxMi42MDYxIDE1LjgyMDdIMTIuMTUxNUwxMi4zNzE2IDE0LjcwOTRDMTIuMzk0MiAxNC41OTQ3IDEyLjM4OCAxNC41MDkxIDEyLjM1MyAxNC40NTRDMTIuMzE4NCAxNC4zOTg4IDEyLjI1MjQgMTQuMzcxNiAxMi4xNTcxIDE0LjM3MTZDMTIuMDQwMiAxNC4zNzE2IDExLjk0MTcgMTQuNDA4MyAxMS44NjE2IDE0LjQ4MTJDMTEuNzgxMSAxNC41NTQ4IDExLjcyNzkgMTQuNjU2OCAxMS43MDE4IDE0Ljc4NjhMMTEuNDk5IDE1LjgyMDdIMTEuMDQzNUwxMS40MDAzIDE0LjAyMDRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE2LjQ3MzUgMTQuMDIwNEgxNi45MTYyTDE2Ljg2NiAxNC4yODAzTDE2LjkyODggMTQuMjA2MUMxNy4wNzIzIDE0LjA1MTUgMTcuMjQ3MSAxMy45NzQ3IDE3LjQ1MjEgMTMuOTc0N0MxNy42MzgyIDEzLjk3NDcgMTcuNzcyNyAxNC4wMjkzIDE3Ljg1NjMgMTQuMTM4OUMxNy45Mzg4IDE0LjI0ODYgMTcuOTYyNyAxNC40MDAxIDE3LjkyMjQgMTQuNTk0N0wxNy42Nzk3IDE1LjgyMDdIMTcuMjI0NEwxNy40NDQ1IDE0LjcwOTRDMTcuNDY3MSAxNC41OTQ3IDE3LjQ2MDkgMTQuNTA5MSAxNy40MjYzIDE0LjQ1NEMxNy4zOTA0IDE0LjM5ODggMTcuMzI1NiAxNC4zNzE2IDE3LjIzMDcgMTQuMzcxNkMxNy4xMTM3IDE0LjM3MTYgMTcuMDE1NyAxNC40MDgzIDE2LjkzNDUgMTQuNDgxMkMxNi44NTQgMTQuNTU0OCAxNi44MDA2IDE0LjY1NjggMTYuNzc1NSAxNC43ODY4TDE2LjU3MTcgMTUuODIwN0gxNi4xMTY3TDE2LjQ3MzUgMTQuMDIwNCIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xOC42NjIxIDEyLjkwNDdIMTkuOTQ3NEMyMC4xOTQ1IDEyLjkwNDcgMjAuMzg1NyAxMi45NjExIDIwLjUxNzEgMTMuMDcyQzIwLjY0NzkgMTMuMTg0MiAyMC43MTM0IDEzLjM0NTMgMjAuNzEzNCAxMy41NTUxVjEzLjU2MTRDMjAuNzEzNCAxMy42MDEzIDIwLjcxMDcgMTMuNjQ2MyAyMC43MDcgMTMuNjk1MUMyMC43MDA3IDEzLjc0MzMgMjAuNjkyNSAxMy43OTIxIDIwLjY4MTkgMTMuODQyOEMyMC42MjUzIDE0LjEyMDUgMjAuNDkzOCAxNC4zNDM2IDIwLjI5MDcgMTQuNTEyOUMyMC4wODY5IDE0LjY4MTUgMTkuODQ1NSAxNC43NjY1IDE5LjU2NzYgMTQuNzY2NUgxOC44NzgzTDE4LjY2NTIgMTUuODIwNkgxOC4wNjg0TDE4LjY2MjEgMTIuOTA0N1pNMTguOTgzMyAxNC4yNTkzSDE5LjU1NUMxOS43MDQgMTQuMjU5MyAxOS44MjIyIDE0LjIyNDQgMTkuOTA4NCAxNC4xNTU0QzE5Ljk5MzkgMTQuMDg1NiAyMC4wNTA1IDEzLjk3OTIgMjAuMDgxOSAxMy44MzQ2QzIwLjA4NjkgMTMuODA3OSAyMC4wOSAxMy43ODM5IDIwLjA5MzkgMTMuNzYxN0MyMC4wOTU4IDEzLjc0MDggMjAuMDk4MyAxMy43MTk4IDIwLjA5ODMgMTMuNjk5NkMyMC4wOTgzIDEzLjU5NjMgMjAuMDYxOSAxMy41MjE1IDE5Ljk4ODkgMTMuNDc0NkMxOS45MTU5IDEzLjQyNyAxOS44MDE1IDEzLjQwNDIgMTkuNjQzIDEzLjQwNDJIMTkuMTU3NUwxOC45ODMzIDE0LjI1OTNaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIzLjM4NDggMTYuMTY4N0MyMy4xOTYxIDE2LjU3MzEgMjMuMDE2MyAxNi44MDg5IDIyLjkxMDcgMTYuOTE4NUMyMi44MDUgMTcuMDI3IDIyLjU5NTcgMTcuMjc5MyAyMi4wOTEzIDE3LjI2MDJMMjIuMTM0NyAxNi45NTE2QzIyLjU1OTEgMTYuODE5NyAyMi43ODg2IDE2LjIyNTcgMjIuOTE5NCAxNS45NjI2TDIyLjc2MzUgMTQuMDI1NEwyMy4wOTE4IDE0LjAyMUgyMy4zNjcyTDIzLjM5NjggMTUuMjM2MkwyMy45MTMgMTQuMDIxSDI0LjQzNTZMMjMuMzg0OCAxNi4xNjg3WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMS45MjMzIDE0LjE2NzNMMjEuNzE1NyAxNC4zMTEzQzIxLjQ5ODcgMTQuMTQwMSAyMS4zMDA3IDE0LjAzNDMgMjAuOTE4NCAxNC4yMTNDMjAuMzk3NyAxNC40NTY0IDE5Ljk2MjUgMTYuMzIzMyAyMS4zOTYzIDE1LjcwODRMMjEuNDc4IDE1LjgwNkwyMi4wNDIxIDE1LjgyMDZMMjIuNDEyNSAxNC4xMjQyTDIxLjkyMzMgMTQuMTY3M1pNMjEuNjAyNSAxNS4wOTQ3QzIxLjUxMTkgMTUuMzY0MiAyMS4zMDk1IDE1LjU0MjMgMjEuMTUxMSAxNS40OTE2QzIwLjk5MjYgMTUuNDQyMSAyMC45MzYgMTUuMTgyMiAyMS4wMjc4IDE0LjkxMjJDMjEuMTE4MyAxNC42NDIxIDIxLjMyMjEgMTQuNDY0NiAyMS40NzkzIDE0LjUxNTRDMjEuNjM3NyAxNC41NjQ4IDIxLjY5NDkgMTQuODI0NyAyMS42MDI1IDE1LjA5NDdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K);\n}\n.tooltip__button--data--provider__visa::before {\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2IDRDMjkuMzEzNyA0IDMyIDYuNjg2MjkgMzIgMTBMMzIgMjJDMzIgMjUuMzEzNyAyOS4zMTM3IDI4IDI2IDI4TDYgMjhDMi42ODYyOSAyOCA5Ljc1Njk3ZS0wNyAyNS4zMTM3IDEuMTIwNTRlLTA2IDIyTDEuNjQ1MDhlLTA2IDEwQzEuNzg5OTNlLTA2IDYuNjg2MjkgMi42ODYyOSA0IDYgNEwyNiA0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMCAyMkwzMCAxMEMzMCA3Ljc5MDg2IDI4LjIwOTEgNiAyNiA2TDYgNkMzLjc5MDg2IDYgMiA3Ljc5MDg2IDIgMTBMMiAyMkMyIDI0LjIwOTEgMy43OTA4NiAyNiA2IDI2TDI2IDI2QzI4LjIwOTEgMjYgMzAgMjQuMjA5MSAzMCAyMlpNMzIgMTBDMzIgNi42ODYyOSAyOS4zMTM3IDQgMjYgNEw2IDRDMi42ODYyOSA0IDEuNzg5OTNlLTA2IDYuNjg2MjkgMS42NDUwOGUtMDYgMTBMMS4xMjA1NGUtMDYgMjJDOS43NTY5N2UtMDcgMjUuMzEzNyAyLjY4NjI5IDI4IDYgMjhMMjYgMjhDMjkuMzEzNyAyOCAzMiAyNS4zMTM3IDMyIDIyTDMyIDEwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE4Ljg5NTYgMTIuNUMxOS41ODQ5IDEyLjUgMjAuMTQyNSAxMi42NDQ1IDIwLjQ5NCAxMi43NzU0TDIwLjI1MTYgMTQuMTcyNEwyMC4wOTA0IDE0LjEwMzdDMTkuNzY4IDEzLjk3MjkgMTkuMzQyMyAxMy44NDIyIDE4Ljc2MjkgMTMuODU2QzE4LjA1OTMgMTMuODU2IDE3Ljc0MzcgMTQuMTM4IDE3LjczNjQgMTQuNDEzM0MxNy43MzY0IDE0LjcxNjIgMTguMTE4MiAxNC45MTU4IDE4Ljc0MTUgMTUuMjExOEMxOS43NjgzIDE1LjY3MjkgMjAuMjQ0NSAxNi4yMzcyIDIwLjIzNzQgMTYuOTczN0MyMC4yMjMgMTguMzE1NyAxOS4wMDU2IDE5LjE4MyAxNy4xMzU2IDE5LjE4M0MxNi4zMzYxIDE5LjE3NiAxNS41NjYgMTkuMDE3NCAxNS4xNDggMTguODM4N0wxNS4zOTc0IDE3LjM4NjVMMTUuNjMyMSAxNy40ODk4QzE2LjIxMTUgMTcuNzMxIDE2LjU5MjcgMTcuODM0IDE3LjMwNDIgMTcuODM0QzE3LjgxNzMgMTcuODM0IDE4LjM2NzQgMTcuNjM0MiAxOC4zNzQ1IDE3LjIwMDhDMTguMzc0NSAxNi45MTg2IDE4LjE0MDEgMTYuNzExOSAxNy40NTA2IDE2LjM5NTRDMTYuNzc2IDE2LjA4NTUgMTUuODc0MSAxNS41Njk1IDE1Ljg4ODcgMTQuNjQwM0MxNS44OTYzIDEzLjM4MDkgMTcuMTM1NiAxMi41IDE4Ljg5NTYgMTIuNVpNMTIuMjUxMyAxOS4wODY3SDE0LjAzMzVMMTUuMTQ4IDEyLjYxNzRIMTMuMzY2TDEyLjI1MTMgMTkuMDg2N1pNMjMuNjgzNiAxMi42MTc0SDI1LjA2MjFMMjYuNDk5OSAxOS4wODY2SDI0Ljg0OThDMjQuODQ5OCAxOS4wODY2IDI0LjY4ODMgMTguMzQzMyAyNC42MzcxIDE4LjExNjFIMjIuMzQ5QzIyLjI4MjggMTguMjg4MSAyMS45NzQ5IDE5LjA4NjYgMjEuOTc0OSAxOS4wODY2SDIwLjEwNUwyMi43NTIxIDEzLjE1NDFDMjIuOTM1NiAxMi43MzQzIDIzLjI1ODUgMTIuNjE3NCAyMy42ODM2IDEyLjYxNzRaTTIzLjU3MzUgMTQuOTg0N0MyMy41NzM1IDE0Ljk4NDcgMjMuMDA4OCAxNi40MjMyIDIyLjg2MiAxNi43OTQ4SDI0LjM0MzNDMjQuMjcgMTYuNDcxNCAyMy45MzI2IDE0LjkyMjggMjMuOTMyNiAxNC45MjI4TDIzLjgwOCAxNC4zNjU0QzIzLjc1NTYgMTQuNTA4OSAyMy42Nzk3IDE0LjcwNjMgMjMuNjI4NiAxNC44Mzk0QzIzLjU5MzkgMTQuOTI5NiAyMy41NzA1IDE0Ljk5MDMgMjMuNTczNSAxNC45ODQ3Wk0xMC43NjI1IDEyLjYxNzRMOS4wMTcyIDE3LjAyODhMOC44MjY0OCAxNi4xMzQxTDguODI2NDUgMTYuMTM0TDguODI2NiAxNi4xMzQ0TDguMjAzMjggMTMuMTYxMkM4LjEwMDY2IDEyLjc0OCA3Ljc4NTMgMTIuNjMxIDcuMzk2NjUgMTIuNjE3NEg0LjUyOTMzTDQuNSAxMi43NDgxQzUuMTk5MjcgMTIuOTE1OSA1LjgyNDcxIDEzLjE1NzggNi4zNzI3MyAxMy40NTg1TDcuOTYxMTggMTkuMDc5OEg5Ljg0NTc2TDEyLjY0NyAxMi42MTc0SDEwLjc2MjVaIiBmaWxsPSIjMTQzNENCIi8+Cjwvc3ZnPgo=);\n}\n.tooltip__button--data--provider__amex::before {\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2IDRDMjkuMzEzNyA0IDMyIDYuNjg2MjkgMzIgMTBMMzIgMjJDMzIgMjUuMzEzNyAyOS4zMTM3IDI4IDI2IDI4TDYgMjhDMi42ODYyOSAyOCA5Ljc1Njk3ZS0wNyAyNS4zMTM3IDEuMTIwNTRlLTA2IDIyTDEuNjQ1MDhlLTA2IDEwQzEuNzg5OTNlLTA2IDYuNjg2MjkgMi42ODYyOSA0IDYgNEwyNiA0WiIgZmlsbD0iIzAwNkZDRiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwIDIyTDMwIDEwQzMwIDcuNzkwODYgMjguMjA5MSA2IDI2IDZMNiA2QzMuNzkwODYgNiAyIDcuNzkwODYgMiAxMEwyIDIyQzIgMjQuMjA5MSAzLjc5MDg2IDI2IDYgMjZMMjYgMjZDMjguMjA5MSAyNiAzMCAyNC4yMDkxIDMwIDIyWk0zMiAxMEMzMiA2LjY4NjI5IDI5LjMxMzcgNCAyNiA0TDYgNEMyLjY4NjI5IDQgMS43ODk5M2UtMDYgNi42ODYyOSAxLjY0NTA4ZS0wNiAxMEwxLjEyMDU0ZS0wNiAyMkM5Ljc1Njk3ZS0wNyAyNS4zMTM3IDIuNjg2MjkgMjggNiAyOEwyNiAyOEMyOS4zMTM3IDI4IDMyIDI1LjMxMzcgMzIgMjJMMzIgMTBaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjE4Ii8+CjxwYXRoIGQ9Ik0yNi41NzAyIDE0LjkyNjVIMjguNjkwNFYxMEgyNi4zODMxVjEwLjY4NkwyNS45NDY1IDEwSDIzLjk1MVYxMC44NzMxTDIzLjU3NjggMTBIMTkuODk3NkMxOS43NzI4IDEwIDE5LjY0ODEgMTAuMDYyNCAxOS41MjM0IDEwLjA2MjRDMTkuMzk4NyAxMC4wNjI0IDE5LjMzNjMgMTAuMTI0NyAxOS4yMTE2IDEwLjE4NzFDMTkuMDg2OSAxMC4yNDk0IDE5LjAyNDUgMTAuMjQ5NCAxOC44OTk4IDEwLjMxMThWMTBIOC4zNjA4TDguMDQ5IDEwLjgxMDdMNy43MzcxOSAxMEg1LjI0Mjc2VjEwLjg3MzFMNC44Njg2IDEwSDIuODczMDVMMiAxMi4xMjAzVjE0LjkyNjVIMy40MzQzTDMuNjgzNzQgMTQuMjQwNUg0LjE4MjYzTDQuNDMyMDcgMTQuOTI2NUgxNS40MDc2VjE0LjMwMjlMMTUuODQ0MSAxNC45MjY1SDE4Ljg5OThWMTQuNTUyM0MxOC45NjIxIDE0LjYxNDcgMTkuMDg2OSAxNC42MTQ3IDE5LjE0OTIgMTQuNjc3MUMxOS4yMTE2IDE0LjczOTQgMTkuMzM2MyAxNC43Mzk0IDE5LjM5ODcgMTQuODAxOEMxOS41MjM0IDE0Ljg2NDEgMTkuNjQ4MSAxNC44NjQxIDE5Ljc3MjggMTQuODY0MUgyMi4wMTc4TDIyLjI2NzMgMTQuMTc4MkgyMi43NjYxTDIzLjAxNTYgMTQuODY0MUgyNi4wNzEzVjE0LjI0MDVMMjYuNTcwMiAxNC45MjY1Wk0zMCAyMS4xNjI2VjE2LjU0NzlIMTIuODUwOEwxMi40MTQzIDE3LjE3MTVMMTEuOTc3NyAxNi41NDc5SDYuOTg4ODZWMjEuNDc0NEgxMS45Nzc3TDEyLjQxNDMgMjAuODUwOEwxMi44NTA4IDIxLjQ3NDRIMTUuOTY4OFYyMC40MTQzSDE1Ljg0NDFDMTYuMjgwNiAyMC40MTQzIDE2LjY1NDggMjAuMzUxOSAxNi45NjY2IDIwLjIyNzJWMjEuNTM2N0gxOS4yMTE2VjIwLjkxMzFMMTkuNjQ4MSAyMS41MzY3SDI4LjkzOTlDMjkuMzE0IDIxLjQxMiAyOS42ODgyIDIxLjM0OTcgMzAgMjEuMTYyNloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yOC45Mzk5IDE5Ljk3NzdIMjcuMjU2MVYyMC42NjM3SDI4Ljg3NzVDMjkuNTYzNSAyMC42NjM3IDMwIDIwLjIyNzEgMzAgMTkuNjAzNUMzMCAxOC45Nzk5IDI5LjYyNTggMTguNjY4MSAyOS4wMDIyIDE4LjY2ODFIMjguMjUzOUMyOC4wNjY4IDE4LjY2ODEgMjcuOTQyMSAxOC41NDM0IDI3Ljk0MjEgMTguMzU2M0MyNy45NDIxIDE4LjE2OTIgMjguMDY2OCAxOC4wNDQ1IDI4LjI1MzkgMTguMDQ0NUgyOS42ODgyTDMwIDE3LjM1ODZIMjguMzE2M0MyNy42MzAzIDE3LjM1ODYgMjcuMTkzOCAxNy43OTUxIDI3LjE5MzggMTguMzU2M0MyNy4xOTM4IDE4Ljk3OTkgMjcuNTY3OSAxOS4yOTE3IDI4LjE5MTUgMTkuMjkxN0gyOC45Mzk5QzI5LjEyNjkgMTkuMjkxNyAyOS4yNTE3IDE5LjQxNjUgMjkuMjUxNyAxOS42MDM1QzI5LjMxNCAxOS44NTMgMjkuMTg5MyAxOS45Nzc3IDI4LjkzOTkgMTkuOTc3N1pNMjUuODg0MiAxOS45Nzc3SDI0LjIwMDRWMjAuNjYzN0gyNS44MjE4QzI2LjUwNzggMjAuNjYzNyAyNi45NDQzIDIwLjIyNzEgMjYuOTQ0MyAxOS42MDM1QzI2Ljk0NDMgMTguOTc5OSAyNi41NzAyIDE4LjY2ODEgMjUuOTQ2NSAxOC42NjgxSDI1LjE5ODJDMjUuMDExMSAxOC42NjgxIDI0Ljg4NjQgMTguNTQzNCAyNC44ODY0IDE4LjM1NjNDMjQuODg2NCAxOC4xNjkyIDI1LjAxMTEgMTguMDQ0NSAyNS4xOTgyIDE4LjA0NDVIMjYuNjMyNUwyNi45NDQzIDE3LjM1ODZIMjUuMjYwNkMyNC41NzQ2IDE3LjM1ODYgMjQuMTM4MSAxNy43OTUxIDI0LjEzODEgMTguMzU2M0MyNC4xMzgxIDE4Ljk3OTkgMjQuNTEyMiAxOS4yOTE3IDI1LjEzNTkgMTkuMjkxN0gyNS44ODQyQzI2LjA3MTMgMTkuMjkxNyAyNi4xOTYgMTkuNDE2NSAyNi4xOTYgMTkuNjAzNUMyNi4yNTg0IDE5Ljg1MyAyNi4wNzEzIDE5Ljk3NzcgMjUuODg0MiAxOS45Nzc3Wk0yMy43MDE2IDE3Ljk4MjJWMTcuMjk2MkgyMS4wODI0VjIwLjYwMTNIMjMuNzAxNlYxOS45MTUzSDIxLjgzMDdWMTkuMjI5NEgyMy42MzkyVjE4LjU0MzRIMjEuODMwN1YxNy45MTk4SDIzLjcwMTZWMTcuOTgyMlpNMTkuNDYxIDE3Ljk4MjJDMTkuNzcyOCAxNy45ODIyIDE5Ljg5NzYgMTguMTY5MiAxOS44OTc2IDE4LjM1NjNDMTkuODk3NiAxOC41NDM0IDE5Ljc3MjggMTguNzMwNSAxOS40NjEgMTguNzMwNUgxOC41MjU2VjE3LjkxOThMMTkuNDYxIDE3Ljk4MjJaTTE4LjUyNTYgMTkuNDE2NUgxOC44OTk4TDE5Ljg5NzYgMjAuNjAxM0gyMC44MzNMMTkuNzEwNSAxOS4zNTQxQzIwLjI3MTcgMTkuMjI5NCAyMC41ODM1IDE4Ljg1NTIgMjAuNTgzNSAxOC4zNTYzQzIwLjU4MzUgMTcuNzMyNyAyMC4xNDcgMTcuMjk2MiAxOS40NjEgMTcuMjk2MkgxNy43MTQ5VjIwLjYwMTNIMTguNDYzM0wxOC41MjU2IDE5LjQxNjVaTTE2LjUzMDEgMTguNDE4N0MxNi41MzAxIDE4LjY2ODEgMTYuNDA1MyAxOC44NTUyIDE2LjA5MzUgMTguODU1MkgxNS4wOTU4VjE3Ljk4MjJIMTYuMDMxMkMxNi4zNDMgMTcuOTgyMiAxNi41MzAxIDE4LjE2OTIgMTYuNTMwMSAxOC40MTg3Wk0xNC4zNDc0IDE3LjI5NjJWMjAuNjAxM0gxNS4wOTU4VjE5LjQ3ODhIMTYuMDkzNUMxNi43Nzk1IDE5LjQ3ODggMTcuMjc4NCAxOS4wNDIzIDE3LjI3ODQgMTguMzU2M0MxNy4yNzg0IDE3LjczMjcgMTYuODQxOSAxNy4yMzM4IDE2LjE1NTkgMTcuMjMzOEwxNC4zNDc0IDE3LjI5NjJaTTEzLjIyNDkgMjAuNjAxM0gxNC4xNjA0TDEyLjg1MDggMTguOTE3NkwxNC4xNjA0IDE3LjI5NjJIMTMuMjI0OUwxMi40MTQzIDE4LjM1NjNMMTEuNjAzNiAxNy4yOTYySDEwLjY2ODJMMTEuOTc3NyAxOC45MTc2TDEwLjY2ODIgMjAuNTM5SDExLjYwMzZMMTIuNDE0MyAxOS40Nzg4TDEzLjIyNDkgMjAuNjAxM1pNMTAuNDE4NyAxNy45ODIyVjE3LjI5NjJINy43OTk1NVYyMC42MDEzSDEwLjQxODdWMTkuOTE1M0g4LjU0Nzg4VjE5LjIyOTRIMTAuMzU2M1YxOC41NDM0SDguNTQ3ODhWMTcuOTE5OEgxMC40MTg3VjE3Ljk4MjJaTTI1LjU3MjQgMTIuMTIwMkwyNi44ODIgMTQuMTE1OEgyNy44MTc0VjEwLjgxMDdIMjcuMDY5VjEyLjk5MzNMMjYuODgyIDEyLjY4MTVMMjUuNjk3MSAxMC44MTA3SDI0LjY5OTNWMTQuMTE1OEgyNS40NDc3VjExLjg3MDhMMjUuNTcyNCAxMi4xMjAyWk0yMi4zMjk2IDEyLjA1NzlMMjIuNTc5MSAxMS4zNzE5TDIyLjgyODUgMTIuMDU3OUwyMy4xNDAzIDEyLjgwNjJIMjIuMDE3OEwyMi4zMjk2IDEyLjA1NzlaTTIzLjYzOTIgMTQuMTE1OEgyNC40NDk5TDIzLjAxNTYgMTAuODEwN0gyMi4wMTc4TDIwLjU4MzUgMTQuMTE1OEgyMS4zOTQyTDIxLjcwNiAxMy40Mjk4SDIzLjMyNzRMMjMuNjM5MiAxNC4xMTU4Wk0yMC4xNDcgMTQuMTE1OEwyMC40NTg4IDEzLjQyOThIMjAuMjcxN0MxOS43MTA1IDEzLjQyOTggMTkuMzk4NyAxMy4wNTU3IDE5LjM5ODcgMTIuNDk0NFYxMi40MzJDMTkuMzk4NyAxMS44NzA4IDE5LjcxMDUgMTEuNDk2NiAyMC4yNzE3IDExLjQ5NjZIMjEuMDgyNFYxMC44MTA3SDIwLjIwOTRDMTkuMjExNiAxMC44MTA3IDE4LjY1MDMgMTEuNDk2NiAxOC42NTAzIDEyLjQzMlYxMi40OTQ0QzE4LjY1MDMgMTMuNDkyMiAxOS4yMTE2IDE0LjExNTggMjAuMTQ3IDE0LjExNThaTTE3LjM0MDggMTQuMTE1OEgxOC4wODkxVjEwLjg3M0gxNy4zNDA4VjE0LjExNThaTTE1LjcxOTQgMTEuNDk2NkMxNi4wMzEyIDExLjQ5NjYgMTYuMTU1OSAxMS42ODM3IDE2LjE1NTkgMTEuODcwOEMxNi4xNTU5IDEyLjA1NzkgMTYuMDMxMiAxMi4yNDUgMTUuNzE5NCAxMi4yNDVIMTQuNzg0VjExLjQzNDNMMTUuNzE5NCAxMS40OTY2Wk0xNC43ODQgMTIuOTMwOUgxNS4xNTgxTDE2LjE1NTkgMTQuMTE1OEgxNy4wOTEzTDE1Ljk2ODggMTIuODY4NkMxNi41MzAxIDEyLjc0MzkgMTYuODQxOSAxMi4zNjk3IDE2Ljg0MTkgMTEuODcwOEMxNi44NDE5IDExLjI0NzIgMTYuNDA1MyAxMC44MTA3IDE1LjcxOTQgMTAuODEwN0gxMy45NzMzVjE0LjExNThIMTQuNzIxNkwxNC43ODQgMTIuOTMwOVpNMTMuNDEyIDExLjQ5NjZWMTAuODEwN0gxMC43OTI5VjE0LjExNThIMTMuNDEyVjEzLjQyOThIMTEuNTQxMlYxMi43NDM5SDEzLjM0OTdWMTIuMDU3OUgxMS41NDEyVjExLjQzNDNIMTMuNDEyVjExLjQ5NjZaTTcuNzM3MTkgMTQuMTE1OEg4LjQyMzE2TDkuMzU4NTcgMTEuNDM0M1YxNC4xMTU4SDEwLjEwNjlWMTAuODEwN0g4Ljg1OTY5TDguMTExMzYgMTMuMDU1N0w3LjM2MzAzIDEwLjgxMDdINi4xMTU4MVYxNC4xMTU4SDYuODY0MTRWMTEuNDM0M0w3LjczNzE5IDE0LjExNThaTTMuNjgzNzQgMTIuMDU3OUwzLjkzMzE4IDExLjM3MTlMNC4xODI2MyAxMi4wNTc5TDQuNDk0NDMgMTIuODA2MkgzLjM3MTk0TDMuNjgzNzQgMTIuMDU3OVpNNC45OTMzMiAxNC4xMTU4SDUuODA0MDFMNC4zNjk3MSAxMC44MTA3SDMuNDM0M0wyIDE0LjExNThIMi44MTA2OUwzLjEyMjQ5IDEzLjQyOThINC43NDM4OEw0Ljk5MzMyIDE0LjExNThaIiBmaWxsPSIjMDA2RkNGIi8+Cjwvc3ZnPgo=);\n}\n.tooltip__button--data--identities::before {\n  background-size: 20px;\n  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTYgOS41YTQgNCAwIDEgMS04IDAgNCA0IDAgMCAxIDggMG0tMS41IDBhMi41IDIuNSAwIDEgMS01IDAgMi41IDIuNSAwIDAgMSA1IDAiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogIDxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDIyYzUuNTIzIDAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTBtMC0xLjVhOC40NyA4LjQ3IDAgMCAwIDUuNzA2LTIuMkE2LjU4IDYuNTggMCAwIDAgMTIgMTVhNi41OCA2LjU4IDAgMCAwLTUuNzA1IDMuM0E4LjQ3IDguNDcgMCAwIDAgMTIgMjAuNW0wLTdhOC4wNyA4LjA3IDAgMCAxIDYuNzYgMy42NTMgOC41IDguNSAwIDEgMC0xMy41MiAwQTguMDcgOC4wNyAwIDAgMSAxMiAxMy41IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg==);\n}\n.tooltip__button--data--credentials.tooltip__button--data--bitwarden::before,\n.tooltip__button--data--credentials__current.tooltip__button--data--bitwarden::before {\n  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTkuMzM3IDNINC42ODRjLS40MTgtLjAxNC0uODA3LjMyNy0uODA5Ljc0OHY5LjAxYy4wMDQuNjg2LjE1IDEuMzY1LjQyOCAyIC41MjggMS4yOSAxLjQ2NSAyLjM4IDIuNTQ1IDMuMjUzLjk2NC44MzggMi4wNDUgMS41IDMuMTY0IDIuMTEuNTIzLjI4NSAxLjM0OC44NzkgMS45NzQuODc5LjY0MyAwIDEuNDYtLjU4NSAxLjk5OS0uODc5IDEuMTItLjYxMSAyLjE5MS0xLjI4MyAzLjE2My0yLjExIDEuMDgtLjg5MyAxLjk5NC0xLjk2IDIuNTQ2LTMuMjUzYTUuMDQ4IDUuMDQ4IDAgMCAwIC40MjgtMnYtOS4wMWMuMDQ0LS40My0uMzgtLjc1NC0uNzg1LS43NDhaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICA8cGF0aCBmaWxsPSJ1cmwoI0JpdHdhcmRlbi1Db2xvci0yNF9zdmdfX2EpIiBkPSJNNS4wMzMgMmgxMy45NjVhMi4wNDcgMi4wNDcgMCAwIDEgMS4zNzMuNTI4Yy4zNjYuMzMuNjYyLjg1NC42MjYgMS40OXY4LjcyN2E2LjIzOCA2LjIzOCAwIDAgMS0uNTEgMi40MzFjLS42MjEgMS40NzYtMS42MyAyLjY2LTIuNzU4IDMuNjEzLS45NTMuODI2LTEuOTgxIDEuNDkzLTMuMDIgMi4wODJsLS4yMDguMTE3Yy0uMTAzLjA1Ny0uMjIuMTI5LS4zOS4yMzFhMTEuMyAxMS4zIDAgMCAxLS41NDguMzE1Yy0uMzU3LjE5LS45NC40NjYtMS41NzYuNDY2LS42MzUgMC0xLjIyLS4yODUtMS41Ny0uNDcyYTExLjYzIDExLjYzIDAgMCAxLS41NDItLjMxNGMtLjEyNi0uMDc2LS4yMjEtLjEzNS0uMzAyLS4xODJsLS4wNzctLjA0NGMtMS4wOTItLjYwOC0yLjIwOC0xLjI5OS0zLjIyMi0yLjE5NC0xLjEzMS0uOTM1LTIuMTY5LTIuMTQ1LTIuNzY5LTMuNjNBNi4yMzYgNi4yMzYgMCAwIDEgMyAxMi43NDVWMy45NzNjLjAwNC0xLjE0Ny45ODYtMS45OSAyLjAzMy0xLjk3MlptLS4wMTIgMS4yNWMtLjM5OC0uMDE0LS43Ny4zMTgtLjc3MS43Mjd2OC43NmMuMDA0LjY2Ny4xNDMgMS4zMjcuNDA4IDEuOTQ1LjUwMyAxLjI1NCAxLjM5OCAyLjMxNCAyLjQyOCAzLjE2Mi45Mi44MTQgMS45NSAxLjQ1NyAzLjAxOCAyLjA1MS40OTguMjc4IDEuMjg2Ljg1NSAxLjg4My44NTUuNjEzIDAgMS4zOTMtLjU3IDEuOTA2LS44NTUgMS4wNjgtLjU5NCAyLjA5LTEuMjQ3IDMuMDE4LTIuMDUgMS4wMjktLjg2OSAxLjkwMi0xLjkwNyAyLjQyOC0zLjE2M2E0Ljk4NiA0Ljk4NiAwIDAgMCAuNDA4LTEuOTQ1di04Ljc2Yy4wNDItLjQxNy0uMzYyLS43MzMtLjc0OS0uNzI3SDUuMDIxWm0xMi45NzYgOS40NzdjLS4wMDIuNDMtLjA5Mi44NTgtLjI2NiAxLjI2My0uNDI4Ljk5NC0xLjEyNiAxLjgyMi0xLjk0OCAyLjUxNmExNi4zNCAxNi4zNCAwIDAgMS0yLjU1MyAxLjc1NWMtLjQxLjIzLS44LjUwNy0xLjIzLjdWNS4wMDFoNS45OTd2Ny43MjZaIi8+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9IkJpdHdhcmRlbi1Db2xvci0yNF9zdmdfX2EiIHgxPSIxMiIgeDI9IjEyIiB5MT0iMiIgeTI9IjIyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiM1NTdGRjMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMkI1NUNBIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KPC9zdmc+Cg==);\n}\n.tooltip__button--data--credentials.tooltip__button--data--bitwarden#provider_locked::before,\n.tooltip__button--data--credentials__current.tooltip__button--data--bitwarden#provider_locked::before {\n  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxMiIgeDI9IjEyIiB5MT0iMiIgeTI9IjIxLjg0MSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNTU3ZmYzIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMmI1NWNhIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTciIHgyPSIxNyIgeTE9IjE5LjI1IiB5Mj0iMTEuNjI1Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4ODgiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhYWEiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxNi45ODYiIHgyPSIxNi45ODYiIHkxPSIxNy4wMzciIHkyPSIyMS4xNTQiPjxzdG9wIG9mZnNldD0iLjAwOCIgc3RvcC1jb2xvcj0iI2UyYTQxMiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2MxODAxMCIvPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggZD0ibTE5LjMzNyAzYy40MDUtLjAwNi44MjkuMzE5Ljc4NS43NDh2NC4yNTJjMCAuNTY4LS4zMjYgMi44LS4zMjYgMi44YTQuMjMyIDQuMjMyIDAgMCAwIC0yLjY4Ny0xLjA0OGwtLjEwOS0uMDAyYTQuMjUgNC4yNSAwIDAgMCAtNC4yNSA0LjI1di44NjVhMi43OTggMi43OTggMCAwIDAgLTIgMi42ODJ2Mi43NDhzLS41My0uMDYtLjczOC0uMTc0Yy0xLjExOS0uNjExLTIuMi0xLjI3Mi0zLjE2My0yLjExLTEuMDgtLjg3Mi0yLjAxOS0xLjk2My0yLjU0Ni0zLjI1M2E1LjA0OCA1LjA0OCAwIDAgMSAtLjQyOC0ydi05LjAxYy4wMDItLjQyMS4zOS0uNzYyLjgwOS0uNzQ3aDE0LjY1M3oiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMTkuMTkgMi4wMWMuNDQ2LjA0Ljg2My4yMyAxLjE4MS41MTguMzY2LjMzLjY2Mi44NTQuNjI2IDEuNDl2Ni4zMjJjMCAuNDM1LS45MTguNjk5LTEuMjUuNDE4di02Ljc4Yy4wNDItLjQxOC0uMzYzLS43MzMtLjc0OS0uNzI3aC0xMy45NzdjLS4zOTgtLjAxNS0uNzcuMzE3LS43NzEuNzI2djguNzYxYy4wMDQuNjY3LjE0MiAxLjMyNy40MDggMS45NDQuNTAzIDEuMjU0IDEuMzk4IDIuMzE0IDIuNDI4IDMuMTYyLjkyLjgxNCAxLjk1IDEuNDU3IDMuMDE4IDIuMDUxLjE4My4xMDMuNDA4LjI0NS42NDYuMzg1IDAgLjU2NC0uNTgzIDEuMTAyLTEuMDcuODE1YTEyLjgzMyAxMi44MzMgMCAwIDAgLS4xODQtLjEwN2MtMS4wOTItLjYwOC0yLjIwOC0xLjMtMy4yMjMtMi4xOTQtMS4xMy0uOTM1LTIuMTY3LTIuMTQ1LTIuNzY3LTMuNjNhNi4yMzggNi4yMzggMCAwIDEgLS41MDYtMi40MTl2LTguNzcyYy4wMDQtMS4xNDcuOTg2LTEuOTkgMi4wMzMtMS45NzFoMTMuOTY1eiIgZmlsbD0idXJsKCNhKSIvPjxwYXRoIGQ9Im0xNy45OTcgOS44NjhhNC4yNTcgNC4yNTcgMCAwIDAgLS44ODgtLjExNmwtLjEwOS0uMDAyYTQuMjUgNC4yNSAwIDAgMCAtNC4yNSA0LjI1di44NjVjLS4yNy4wOC0uNTIxLjItLjc1LjM1MnYtMTAuMjE1aDUuOTk3djQuODY3eiIgZmlsbD0idXJsKCNhKSIvPjxnIHN0cm9rZS13aWR0aD0iMS4yNSI+PHJlY3QgaGVpZ2h0PSI3LjYyNSIgcng9IjIuMzc1IiBzdHJva2U9InVybCgjYikiIHdpZHRoPSI0Ljc1IiB4PSIxNC42MjUiIHk9IjExLjYyNSIvPjxwYXRoIGQ9Im0xMi42MjUgMTcuNTQ2YS45Mi45MiAwIDAgMSAuOTIxLS45MjFoNi45MDhhLjkyLjkyIDAgMCAxIC45MjEuOTIxdjIuOTA4YS45MjEuOTIxIDAgMCAxIC0uOTIxLjkyMWgtNi45MDhhLjkyMS45MjEgMCAwIDEgLS45MjEtLjkyMXoiIGZpbGw9IiNmYzMiIHN0cm9rZT0idXJsKCNjKSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9nPjwvc3ZnPg==);\n}\nhr {\n  display: block;\n  margin: var(--hr-margin);\n  border: none;\n  border-top: 1px solid rgba(0, 0, 0, .1);\n}\nhr:first-child {\n  display: none;\n}\n@media (prefers-color-scheme: dark) {\n  hr {\n    border-top: 1px solid rgba(255, 255, 255, .2);\n  }\n}\n#privateAddress {\n  align-items: flex-start;\n}\n#personalAddress::before,\n#privateAddress::before,\n#incontextSignup::before,\n#personalAddress.currentFocus::before,\n#personalAddress:hover::before,\n#privateAddress.currentFocus::before,\n#privateAddress:hover::before {\n  filter: none;\n  background-size: 24px;\n  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iI0RFNTgzMyIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTIgMjJjNS41MjMgMCAxMC00LjQ3NyAxMC0xMFMxNy41MjMgMiAxMiAyIDIgNi40NzcgMiAxMnM0LjQ3NyAxMCAxMCAxMCIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iI0RERCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTMuNDA2IDE5LjQ2YzAtLjA3Ny4wMi0uMDk1LS4yMjktLjU5LS42Ni0xLjMyMi0xLjMyMy0zLjE4NS0xLjAyMS00LjM4Ny4wNTUtLjIxOC0uNjIyLTguMDg1LTEuMS04LjMzOC0uNTMyLS4yODMtMS4xODYtLjczMy0xLjc4NC0uODMzLS4zMDQtLjA0OC0uNzAyLS4wMjUtMS4wMTMuMDE3LS4wNTYuMDA3LS4wNTguMTA2LS4wMDUuMTI0LjIwNC4wNy40NTIuMTkuNTk5LjM3MS4wMjcuMDM1LS4wMS4wODktLjA1NC4wOS0uMTM4LjAwNi0uMzg4LjA2My0uNzE4LjM0NC0uMDM4LjAzMi0uMDA2LjA5Mi4wNDMuMDgyLjcwOS0uMTQgMS40MzMtLjA3IDEuODYuMzE3LjAyNy4wMjUuMDEzLjA3LS4wMjQuMDgtMy43MDIgMS4wMDYtMi45NjkgNC4yMjctMS45ODMgOC4xNzkuODc4IDMuNTIgMS4yMDggNC42NTUgMS4zMTIgNXEuMDE2LjA1Mi4wNjYuMDczYzEuMjc1LjUwOCA0LjA1MS41MyA0LjA1MS0uMzMzdi0uMTk1WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEzLjkxNCAyMC4yMDNjLS40NDkuMTc2LTEuMzI4LjI1NC0xLjgzNi4yNTQtLjc0NCAwLTEuODE2LS4xMTctMi4yMDctLjI5M2E4OCA4OCAwIDAgMS0xLjY3Ni01Ljk2NmwtLjA3LS4yODZ2LS4wMDJjLS44NDgtMy40NjItMS41NC02LjI5IDIuMjU0LTcuMTc4LjAzNS0uMDA4LjA1Mi0uMDUuMDI5LS4wNzctLjQzNi0uNTE2LTEuMjUxLS42ODYtMi4yODItLjMzLS4wNDMuMDE1LS4wOC0uMDI4LS4wNTMtLjA2NC4yMDItLjI3OS41OTctLjQ5My43OTItLjU4Ny4wNC0uMDIuMDM4LS4wNzktLjAwNC0uMDkyYTQgNCAwIDAgMC0uNTktLjE0Yy0uMDU4LS4wMS0uMDYzLS4xMDktLjAwNS0uMTE3IDEuNDYyLS4xOTYgMi45ODkuMjQzIDMuNzU1IDEuMjA3YS4wNS4wNSAwIDAgMCAuMDI5LjAxOGMyLjgwNS42MDMgMy4wMDYgNS4wMzcgMi42ODIgNS4yNC0uMDYzLjAzOS0uMjY3LjAxNi0uNTM3LS4wMTQtMS4wOTEtLjEyMi0zLjI1Mi0uMzY0LTEuNDY5IDIuOTYuMDE4LjAzMy0uMDA1LjA3Ny0uMDQyLjA4Mi0xLjAwNi4xNTcuMjgzIDMuMzA5IDEuMjMgNS4zODUiLz4KICA8cGF0aCBmaWxsPSIjM0NBODJCIiBkPSJNMTUuMTY5IDE2LjE3MmMtLjIxMy0uMS0xLjAzNS40OS0xLjU4Ljk0Mi0uMTE0LS4xNjItLjMyOC0uMjc5LS44MTMtLjE5NS0uNDI0LjA3NC0uNjU4LjE3Ny0uNzYyLjM1My0uNjctLjI1NC0xLjc5NS0uNjQ2LTIuMDY3LS4yNjctLjI5Ny40MTMuMDc0IDIuMzY4LjQ3IDIuNjIyLjIwNS4xMzMgMS4xOTEtLjUwMSAxLjcwNi0uOTM4LjA4My4xMTcuMjE3LjE4NC40OTIuMTc4LjQxNi0uMDEgMS4wOS0uMTA3IDEuMTk1LS4zYS4yLjIgMCAwIDAgLjAxNy0uMDQyYy41MjkuMTk4IDEuNDYuNDA3IDEuNjY5LjM3Ni41NDItLjA4MS0uMDc2LTIuNjEzLS4zMjctMi43M1oiLz4KICA8cGF0aCBmaWxsPSIjNENCQTNDIiBkPSJNMTMuNjQgMTcuMTcycS4wMzMuMDYuMDU1LjEyNWMuMDc2LjIxLjE5OS44ODIuMTA2IDEuMDQ4cy0uNjk3LjI0Ni0xLjA3LjI1MmMtLjM3Mi4wMDctLjQ1Ni0uMTMtLjUzMS0uMzQtLjA2LS4xNy0uMDktLjU2Ni0uMDktLjc5NC0uMDE1LS4zMzcuMTA4LS40NTUuNjc3LS41NDcuNDIyLS4wNjkuNjQ0LjAxLjc3My4xNDYuNTk4LS40NDYgMS41OTYtMS4wNzYgMS42OTMtLjk2LjQ4Ni41NzMuNTQ3IDEuOTQuNDQyIDIuNDktLjAzNC4xOC0xLjY0MS0uMTc4LTEuNjQxLS4zNzIgMC0uODA1LS4yMS0xLjAyNi0uNDE1LTEuMDQ4Wm0tMy41Mi0uMjUyYy4xMy0uMjA4IDEuMTk4LjA1IDEuNzg0LjMxMiAwIDAtLjEyLjU0NS4wNzEgMS4xODguMDU2LjE4OC0xLjM0OCAxLjAyNC0xLjUzMS44OC0uMjEyLS4xNjYtLjYwMi0xLjk0Mi0uMzI1LTIuMzhaIi8+CiAgPHBhdGggZmlsbD0iI0ZDMyIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTAuNjM2IDEyLjY4OGMuMDg2LS4zNzUuNDg5LTEuMDgzIDEuOTI1LTEuMDY2LjcyNi0uMDAyIDEuNjI5IDAgMi4yMjctLjA2OGE4IDggMCAwIDAgMS45ODgtLjQ4M2MuNjIyLS4yMzcuODQzLS4xODUuOTItLjA0My4wODUuMTU2LS4wMTUuNDI2LS4yMzIuNjczLS40MTUuNDc0LTEuMTYyLjg0MS0yLjQ4Ljk1LTEuMzE3LjEwOS0yLjE5LS4yNDUtMi41NjYuMzMtLjE2Mi4yNS0uMDM3LjgzNCAxLjIzOCAxLjAxOCAxLjcyMi4yNDkgMy4xMzYtLjMgMy4zMS4wMzIuMTc1LjMzLS44MzEgMS4wMDQtMi41NTYgMS4wMThzLTIuODAyLS42MDQtMy4xODQtLjkxYy0uNDg1LS4zOS0uNzAyLS45NTktLjU5LTEuNDVaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICA8ZyBmaWxsPSIjMTQzMDdFIiBvcGFjaXR5PSIuOCI+CiAgICA8cGF0aCBkPSJNMTIuODMzIDguNTgyYy4wOTYtLjE1Ny4zMS0uMjc5LjY1OC0uMjc5LjM1IDAgLjUxNC4xNC42MjcuMjk0LjAyNC4wMzItLjAxMi4wNjktLjA0OC4wNTNsLS4wMjYtLjAxMWExLjMgMS4zIDAgMCAwLS41NTMtLjEyOCAxLjE0IDEuMTQgMCAwIDAtLjU4Mi4xM2MtLjAzOS4wMi0uMS0uMDIxLS4wNzYtLjA1OW0tMy45MzEuMjAyYTEuMjUgMS4yNSAwIDAgMSAuNzk0LS4wNzljLjA0LjAxLjA2Ny0uMDMzLjAzNS0uMDU5LS4xNDYtLjExOC0uNDczLS4yNjQtLjktLjEwNS0uMzguMTQyLS41Ni40MzctLjU2MS42MyAwIC4wNDcuMDk0LjA1LjExOC4wMTIuMDY2LS4xMDUuMTc1LS4yNTcuNTE0LS40WiIvPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTMuNzg4IDEwLjczOGEuNTQyLjU0MiAwIDEgMS0uMDAyLTEuMDguNTQyLjU0MiAwIDAgMSAuMDAyIDEuMDhtLjM4Mi0uNzJhLjE0LjE0IDAgMCAwLS4yODEgMCAuMTQuMTQgMCAwIDAgLjI4MSAwbS0zLjk3OS41NTJhLjYzMi42MzIgMCAxIDEtMS4yNjMgMCAuNjMyLjYzMiAwIDAgMSAxLjI2MyAwbS0uMTg2LS4yMDhhLjE2NC4xNjQgMCAwIDAtLjMyOCAwIC4xNjQuMTY0IDAgMCAwIC4zMjggMCIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPC9nPgogIDxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDIwYTggOCAwIDEgMCAwLTE2IDggOCAwIDAgMCAwIDE2bTAgMWE5IDkgMCAxIDAgMC0xOCA5IDkgMCAwIDAgMCAxOCIgY2xpcC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPgo=);\n}\n.tooltip__button--email {\n  flex-direction: column;\n  justify-content: center;\n  align-items: flex-start;\n  font-size: 14px;\n  padding: 4px 8px;\n}\n.tooltip__button--email__primary-text {\n  font-weight: bold;\n}\n.tooltip__button--email__secondary-text {\n  font-size: 12px;\n}\n:not(.top-autofill) .tooltip--email-signup {\n  text-align: left;\n  color: #222;\n  padding: 16px 20px;\n  width: 380px;\n}\n.tooltip--email-signup h1 {\n  font-weight: 700;\n  font-size: 16px;\n  line-height: 1.5;\n  margin: 0;\n}\n.tooltip--email-signup p {\n  font-weight: 400;\n  font-size: 14px;\n  line-height: 1.4;\n}\n.notice-controls {\n  display: flex;\n}\n.tooltip--email-signup .notice-controls > * {\n  border-radius: 8px;\n  border: 0;\n  cursor: pointer;\n  display: inline-block;\n  font-family: inherit;\n  font-style: normal;\n  font-weight: bold;\n  padding: 8px 12px;\n  text-decoration: none;\n}\n.notice-controls .ghost {\n  margin-left: 1rem;\n}\n.tooltip--email-signup a.primary {\n  background: #3969EF;\n  color: #fff;\n}\n.tooltip--email-signup a.primary:hover,\n.tooltip--email-signup a.primary:focus {\n  background: #2b55ca;\n}\n.tooltip--email-signup a.primary:active {\n  background: #1e42a4;\n}\n.tooltip--email-signup button.ghost {\n  background: transparent;\n  color: #3969EF;\n}\n.tooltip--email-signup button.ghost:hover,\n.tooltip--email-signup button.ghost:focus {\n  background-color: rgba(0, 0, 0, 0.06);\n  color: #2b55ca;\n}\n.tooltip--email-signup button.ghost:active {\n  background-color: rgba(0, 0, 0, 0.12);\n  color: #1e42a4;\n}\n.tooltip--email-signup button.close-tooltip {\n  background-color: transparent;\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMiAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wLjI5Mjg5NCAwLjY1NjkwN0MwLjY4MzQxOCAwLjI2NjM4MyAxLjMxNjU4IDAuMjY2MzgzIDEuNzA3MTEgMC42NTY5MDdMNiA0Ljk0OThMMTAuMjkyOSAwLjY1NjkwN0MxMC42ODM0IDAuMjY2MzgzIDExLjMxNjYgMC4yNjYzODMgMTEuNzA3MSAwLjY1NjkwN0MxMi4wOTc2IDEuMDQ3NDMgMTIuMDk3NiAxLjY4MDYgMTEuNzA3MSAyLjA3MTEyTDcuNDE0MjEgNi4zNjQwMUwxMS43MDcxIDEwLjY1NjlDMTIuMDk3NiAxMS4wNDc0IDEyLjA5NzYgMTEuNjgwNiAxMS43MDcxIDEyLjA3MTFDMTEuMzE2NiAxMi40NjE2IDEwLjY4MzQgMTIuNDYxNiAxMC4yOTI5IDEyLjA3MTFMNiA3Ljc3ODIzTDEuNzA3MTEgMTIuMDcxMUMxLjMxNjU4IDEyLjQ2MTYgMC42ODM0MTcgMTIuNDYxNiAwLjI5Mjg5MyAxMi4wNzExQy0wLjA5NzYzMTEgMTEuNjgwNiAtMC4wOTc2MzExIDExLjA0NzQgMC4yOTI4OTMgMTAuNjU2OUw0LjU4NTc5IDYuMzY0MDFMMC4yOTI4OTQgMi4wNzExMkMtMC4wOTc2MzA2IDEuNjgwNiAtMC4wOTc2MzA2IDEuMDQ3NDMgMC4yOTI4OTQgMC42NTY5MDdaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjg0Ii8+Cjwvc3ZnPgo=);\n  background-position: center center;\n  background-repeat: no-repeat;\n  border: 0;\n  cursor: pointer;\n  padding: 16px;\n  position: absolute;\n  right: 12px;\n  top: 12px;\n}\n.tooltip__button--credentials-import::before {\n  background-size: 20px;\n  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuOSIgZD0iTTE0Ljk5OCAyQTcuMDA0IDcuMDA0IDAgMCAxIDIyIDkuMDA2YzAgMi0uODM4IDMuODA2LTIuMTgyIDUuMDgyYS42Ni42NiAwIDAgMS0uNzY4LjA5MmMtLjQ3Mi0uMjUxLS41MDctLjkzLS4xMzItMS4zMUE1LjUgNS41IDAgMCAwIDIwLjUgOS4wMDYgNS41MDQgNS41MDQgMCAwIDAgMTQuOTk4IDMuNWE1LjUwNCA1LjUwNCAwIDAgMC01LjMzOCA2Ljg0N2wuMDI1LjExMmMuMTAzLjU0NC0uMDE4IDEuMTU2LS40NCAxLjYxMWwtLjA0Ni4wNDctNS4wNCA1LjA0M2EyLjI1IDIuMjUgMCAwIDAtLjY1OSAxLjYwMmwuMDAzLjQ5NC4wMDIuMDY1QTEuMjUgMS4yNSAwIDAgMCA0Ljc1MyAyMC41aC45OTNhLjc1Ljc1IDAgMCAwIC43NS0uNzV2LS43MzRhMS41IDEuNSAwIDAgMSAxLjUtMS41aC45ODJhLjUuNSAwIDAgMCAuMzU0LS4xNDdsMS4xNzgtMS4xNzhhLjczNi43MzYgMCAwIDEgMS4wNjIgMS4wMmwtLjUzMi41Ny0uNjQ3LjY0OWEyIDIgMCAwIDEtMS40MTUuNTg2aC0uOTgydi43MzRBMi4yNSAyLjI1IDAgMCAxIDUuNzQ2IDIyaC0uOTkzYTIuNzUgMi43NSAwIDAgMS0yLjc0Ni0yLjU5NWwtLjAwNC0uMTRMMiAxOC43N2EzLjc1IDMuNzUgMCAwIDEgMS4wOTgtMi42N2w1LjA0LTUuMDQ0LjAyMi0uMDI1YS4zNi4zNiAwIDAgMCAuMDU2LS4yNmwtLjAxMS0uMDZBNy4wMDQgNy4wMDQgMCAwIDEgMTQuOTk4IDIiLz4KICA8cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii45IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS41IDZhMi41IDIuNSAwIDEgMSAwIDUgMi41IDIuNSAwIDAgMSAwLTVtMCAxLjVhMSAxIDAgMSAwIDAgMiAxIDEgMCAwIDAgMC0yIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICA8cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTMuMDAzIDE2LjE5cTAtLjAzLjAwMy0uMDU4YTEgMSAwIDAgMSAuMDE5LS4wOTdsLjAxLS4wNGExIDEgMCAwIDEgLjA0Ni0uMTEybC4wMDgtLjAxOS4wMDMtLjAwNi4wMDYtLjAwOWExIDEgMCAwIDEgLjA2NS0uMDk2bC4wMDgtLjAxMS4wMDMtLjAwNCAzLjEyNS0zLjc1YS43NS43NSAwIDAgMSAxLjE1Mi45NjFsLTIuMTI2IDIuNTVoNS4xNDRhLjc1Ljc1IDAgMCAxIDAgMS41aC01LjA5MmwyLjA3NCAyLjQ5LjA0Ni4wNmEuNzUuNzUgMCAwIDEtMS4xNDYuOTU2bC0uMDUyLS4wNTYtMy4xMjUtMy43NS0uMDAzLS4wMDMtLjAxNi0uMDIxLS4wMjctLjAzOC0uMDItLjAzNi0uMDM1LS4wNjNhLjguOCAwIDAgMS0uMDctLjI3MXoiLz4KPC9zdmc+Cg==);\n}\n.truncate {\n  display: block;\n  width: 0;\n  min-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n';

  // src/UI/HTMLTooltip.js
  var defaultOptions = {
    wrapperClass: "",
    platform: null,
    tooltipPositionClass: (top, left) => `
        .tooltip {
            transform: translate(${Math.floor(left)}px, ${Math.floor(top)}px) !important;
        }
    `,
    caretPositionClass: (top, left, isAboveInput) => `
        .tooltip--email__caret {
            ${isAboveInput ? `transform: translate(${Math.floor(left)}px, ${Math.floor(top)}px) rotate(180deg); transform-origin: 18px !important;` : `transform: translate(${Math.floor(left)}px, ${Math.floor(top)}px) !important;`}
        }`,
    css: `<style>${autofill_tooltip_styles_default}</style>`,
    setSize: void 0,
    remove: () => {
    },
    testMode: false,
    checkVisibility: true,
    hasCaret: false,
    isTopAutofill: false,
    isIncontextSignupAvailable: () => false
  };
  var HTMLTooltip = class {
    /**
     * @param inputType
     * @param getPosition
     * @param {HTMLTooltipOptions} options
     */
    constructor(inputType, getPosition, options) {
      __publicField(this, "isAboveInput", false);
      /** @type {HTMLTooltipOptions} */
      __publicField(this, "options");
      __publicField(this, "resObs", new ResizeObserver((entries) => entries.forEach(() => this.checkPosition())));
      __publicField(this, "mutObsCheckPositionWhenIdle", whenIdle.call(this, this.checkPosition));
      __publicField(this, "mutObs", new MutationObserver((mutationList) => {
        for (const mutationRecord of mutationList) {
          if (mutationRecord.type === "childList") {
            mutationRecord.addedNodes.forEach((el) => {
              if (el.nodeName === "DDG-AUTOFILL") return;
              this.ensureIsLastInDOM();
            });
          }
        }
        this.mutObsCheckPositionWhenIdle();
      }));
      __publicField(this, "clickableButtons", /* @__PURE__ */ new Map());
      this.options = options;
      this.shadow = document.createElement("ddg-autofill").attachShadow({
        mode: options.testMode ? "open" : "closed"
      });
      this.host = this.shadow.host;
      this.subtype = getSubtypeFromType(inputType);
      this.variant = getVariantFromType(inputType);
      this.tooltip = null;
      this.getPosition = getPosition;
      const forcedVisibilityStyles = {
        display: "block",
        visibility: "visible",
        opacity: "1"
      };
      addInlineStyles(this.host, forcedVisibilityStyles);
      this.count = 0;
      this.device = null;
      this.transformRules = {
        caret: {
          getRuleString: this.options.caretPositionClass,
          index: null
        },
        tooltip: {
          getRuleString: this.options.tooltipPositionClass,
          index: null
        }
      };
    }
    get isHidden() {
      return this.tooltip.parentNode.hidden;
    }
    append() {
      document.body.appendChild(this.host);
    }
    remove() {
      this.device?.activeForm.resetIconStylesToInitial();
      window.removeEventListener("scroll", this, { capture: true });
      this.resObs.disconnect();
      this.mutObs.disconnect();
      this.lift();
    }
    lift() {
      this.left = null;
      this.top = null;
      document.body.removeChild(this.host);
    }
    handleEvent(event) {
      switch (event.type) {
        case "scroll":
          this.checkPosition();
          break;
      }
    }
    focus(x, y) {
      const focusableElements = "button";
      const currentFocusClassName = "currentFocus";
      const currentFocused = this.shadow.querySelectorAll(`.${currentFocusClassName}`);
      [...currentFocused].forEach((el) => {
        el.classList.remove(currentFocusClassName);
      });
      this.shadow.elementFromPoint(x, y)?.closest(focusableElements)?.classList.add(currentFocusClassName);
    }
    checkPosition() {
      if (this.animationFrame) {
        window.cancelAnimationFrame(this.animationFrame);
      }
      this.animationFrame = window.requestAnimationFrame(() => {
        if (this.isHidden) return;
        const { left, bottom, height, top } = this.getPosition();
        if (left !== this.left || bottom !== this.top) {
          const coords = { left, top: bottom };
          this.updatePosition("tooltip", coords);
          if (this.options.hasCaret) {
            const { top: tooltipTop } = this.tooltip.getBoundingClientRect();
            this.isAboveInput = top > tooltipTop;
            const borderWidth = 2;
            const caretTop = this.isAboveInput ? coords.top - height - borderWidth : coords.top;
            this.updatePosition("caret", { ...coords, top: caretTop });
          }
        }
        this.animationFrame = null;
      });
    }
    getOverridePosition({ left, top }) {
      const tooltipBoundingBox = this.tooltip.getBoundingClientRect();
      const smallScreenWidth = tooltipBoundingBox.width * 2;
      const spacing = 5;
      if (tooltipBoundingBox.bottom > window.innerHeight) {
        const inputPosition = this.getPosition();
        const caretHeight = 14;
        const overriddenTopPosition = top - tooltipBoundingBox.height - inputPosition.height - caretHeight;
        if (overriddenTopPosition >= 0) return { left, top: overriddenTopPosition };
      }
      if (tooltipBoundingBox.left < 0 && window.innerWidth <= smallScreenWidth) {
        const leftOverflow = Math.abs(tooltipBoundingBox.left);
        const leftPosWhenCentered = (window.innerWidth - tooltipBoundingBox.width) / 2;
        const overriddenLeftPosition = left + leftOverflow + leftPosWhenCentered;
        return { left: overriddenLeftPosition, top };
      }
      if (tooltipBoundingBox.left < 0 && window.innerWidth > smallScreenWidth) {
        const leftOverflow = Math.abs(tooltipBoundingBox.left);
        const overriddenLeftPosition = left + leftOverflow + spacing;
        return { left: overriddenLeftPosition, top };
      }
      if (tooltipBoundingBox.right > window.innerWidth) {
        const rightOverflow = tooltipBoundingBox.right - window.innerWidth;
        const overriddenLeftPosition = left - rightOverflow - spacing;
        return { left: overriddenLeftPosition, top };
      }
    }
    /**
     * @param {'tooltip' | 'caret'} element
     * @param {{
     *     left: number,
     *     top: number
     * }} coords
     */
    applyPositionalStyles(element, { left, top }) {
      const shadow = this.shadow;
      const ruleObj = this.transformRules[element];
      if (ruleObj.index) {
        if (shadow.styleSheets[0].rules[ruleObj.index]) {
          shadow.styleSheets[0].deleteRule(ruleObj.index);
        }
      } else {
        ruleObj.index = shadow.styleSheets[0].rules.length;
      }
      const cssRule = ruleObj.getRuleString?.(top, left, this.isAboveInput);
      if (typeof cssRule === "string") {
        shadow.styleSheets[0].insertRule(cssRule, ruleObj.index);
      }
    }
    /**
     * @param {'tooltip' | 'caret'} element
     * @param {{
     *     left: number,
     *     top: number
     * }} coords
     */
    updatePosition(element, { left, top }) {
      if (!this.shadow.styleSheets.length) {
        this.stylesheet?.addEventListener("load", () => this.checkPosition());
        return;
      }
      this.left = left;
      this.top = top;
      this.applyPositionalStyles(element, { left, top });
      if (this.options.hasCaret) {
        const overridePosition = this.getOverridePosition({ left, top });
        if (overridePosition) this.updatePosition(element, overridePosition);
      }
    }
    ensureIsLastInDOM() {
      this.count = this.count || 0;
      if (document.body.lastElementChild !== this.host) {
        if (this.count < 15) {
          this.lift();
          this.append();
          this.checkPosition();
          this.count++;
        } else {
          this.options.remove();
          console.info(`DDG autofill bailing out`);
        }
      }
    }
    setActiveButton(e) {
      this.activeButton = e.target;
    }
    unsetActiveButton() {
      this.activeButton = null;
    }
    registerClickableButton(btn, handler) {
      this.clickableButtons.set(btn, handler);
      btn.addEventListener("mouseenter", (e) => this.setActiveButton(e));
      btn.addEventListener("mouseleave", () => this.unsetActiveButton());
    }
    dispatchClick() {
      const handler = this.clickableButtons.get(this.activeButton);
      if (handler) {
        if (this.activeButton.matches(".wrapper:not(.top-autofill) button:hover, .wrapper:not(.top-autofill) a:hover, .currentFocus")) {
          safeExecute(this.activeButton, handler, {
            checkVisibility: this.options.checkVisibility
          });
        } else {
          console.warn("The button doesn't seem to be hovered. Please check.");
        }
      }
    }
    setupSizeListener() {
      const observer = new PerformanceObserver(() => {
        this.setSize();
      });
      observer.observe({ entryTypes: ["layout-shift", "paint"] });
    }
    setSize() {
      const innerNode = this.shadow.querySelector(".wrapper--data");
      if (!innerNode) return;
      const details = { height: innerNode.clientHeight, width: innerNode.clientWidth };
      this.options.setSize?.(details);
    }
    init() {
      this.animationFrame = null;
      this.top = 0;
      this.left = 0;
      this.transformRuleIndex = null;
      this.stylesheet = this.shadow.querySelector("link, style");
      this.stylesheet?.addEventListener("load", () => {
        Promise.allSettled([
          document.fonts.load("normal 13px 'DDG_ProximaNova'"),
          document.fonts.load("bold 13px 'DDG_ProximaNova'")
        ]).then(() => {
          this.tooltip.parentNode.removeAttribute("hidden");
          this.checkPosition();
          this.setSize();
        });
      });
      this.append();
      this.resObs.observe(document.body);
      this.mutObs.observe(document.body, { childList: true, subtree: true, attributes: true });
      window.addEventListener("scroll", this, { capture: true });
      this.setSize();
      if (typeof this.options.setSize === "function") {
        this.setupSizeListener();
      }
    }
  };
  var HTMLTooltip_default = HTMLTooltip;

  // src/UI/DataHTMLTooltip.js
  var manageItemStringIds = {
    credentials: "autofill:managePasswords",
    creditCards: "autofill:manageCreditCards",
    identities: "autofill:manageIdentities",
    unknown: "autofill:manageSavedItems"
  };
  var DataHTMLTooltip = class extends HTMLTooltip_default {
    /**
     * @param {import("../locales/strings").TranslateFn} t
     * @param {boolean} isOtherItems
     */
    renderEmailProtectionIncontextSignup(t, isOtherItems) {
      const dataTypeClass = `tooltip__button--data--identities`;
      const providerIconClass = "tooltip__button--data--duckduckgo";
      return `
            ${isOtherItems ? "<hr />" : ""}
            <button id="incontextSignup" class="tooltip__button tooltip__button--data ${dataTypeClass} ${providerIconClass} js-get-email-signup">
                <span class="tooltip__button__text-container">
                    <span class="label label--medium">
                        ${t("autofill:hideEmailAndBlockTrackers")}
                    </span>
                    <span class="label label--small">
                        ${t("autofill:createUniqueRandomAddr")}
                    </span>
                </span>
            </button>
        `;
    }
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     * @param {InputTypeConfigs} config
     * @param {import('./interfaces.js').TooltipItemRenderer[]} items
     * @param {{
     *   onSelect(id:string): void
     *   onManage(type:InputTypeConfigs['type']): void
     *   onIncontextSignupDismissed?(data: {
     *      hasOtherOptions: Boolean
     *   }): void
     *   onIncontextSignup?(): void
     * }} callbacks
     */
    render(device, config, items, callbacks) {
      const t = device.t;
      const { wrapperClass, css, isTopAutofill, platform } = this.options;
      let hasAddedSeparator = false;
      const shouldShowSeparator = (dataId, index) => {
        const shouldShow = ["personalAddress", "privateAddress"].includes(dataId) && !hasAddedSeparator;
        if (shouldShow) hasAddedSeparator = true;
        const isFirst = index === 0;
        return shouldShow && !isFirst;
      };
      const shouldShowManageButton = isTopAutofill && items.some((item) => !["personalAddress", "privateAddress", PROVIDER_LOCKED].includes(item.id()));
      const topClass = wrapperClass || "";
      const dataTypeClass = `tooltip__button--data--${config.type}${this.variant ? "__" + this.variant : ""}`;
      this.shadow.innerHTML = `
${css}
<div class="wrapper wrapper--data ${topClass}" hidden data-platform=${platform}>
    <div class="tooltip tooltip--data${this.options.isIncontextSignupAvailable() ? " tooltip--incontext-signup" : ""}">
        ${items.map((item, index) => {
        const credentialsProvider = item.credentialsProvider?.();
        const providerIconClass = credentialsProvider ? `tooltip__button--data--${credentialsProvider}` : "";
        const paymentProvider = item.paymentProvider?.();
        const paymentProviderIconClass = paymentProvider ? `tooltip__button--data--provider__${paymentProvider}` : "";
        const disableHoverEffectClass = paymentProvider ? "no-hover-effect" : "";
        const labelSmall = item.labelSmall?.(t, this.subtype);
        const label = item.label?.(t, this.subtype);
        return `
            ${shouldShowSeparator(item.id(), index) ? "<hr />" : ""}
            <button id="${item.id()}" class="tooltip__button tooltip__button--data ${dataTypeClass} ${paymentProviderIconClass} ${providerIconClass} js-autofill-button ${disableHoverEffectClass}">
                <span class="tooltip__button__text-container">
                    <span class="label label--medium truncate">${escapeXML(item.labelMedium(t, this.subtype))}</span>
                    ${label ? `<span class="label">${escapeXML(label)}</span>` : ""}
                    ${labelSmall ? `<span class="label label--small">${escapeXML(labelSmall)}</span>` : ""}
                </span>
            </button>
        `;
      }).join("")}
        ${this.options.isIncontextSignupAvailable() ? this.renderEmailProtectionIncontextSignup(t, items.length > 0) : ""}
        ${shouldShowManageButton ? `
            <hr />
            <button id="manage-button" class="tooltip__button tooltip__button--secondary" type="button">
                <span class="tooltip__button__text-container">
                    <span class="label label--medium">
                        ${t(manageItemStringIds[config.type] ?? "autofill:manageSavedItems")}
                    </span>
                </span>
            </button>` : ""}
    </div>
</div>`;
      this.wrapper = this.shadow.querySelector(".wrapper");
      this.tooltip = this.shadow.querySelector(".tooltip");
      this.autofillButtons = this.shadow.querySelectorAll(".js-autofill-button");
      this.autofillButtons.forEach((btn) => {
        this.registerClickableButton(btn, () => {
          if (btn.matches(".wrapper:not(.top-autofill) button:hover, .currentFocus")) {
            callbacks.onSelect(btn.id);
          } else {
            console.warn("The button doesn't seem to be hovered. Please check.");
          }
        });
      });
      this.manageButton = this.shadow.getElementById("manage-button");
      if (this.manageButton) {
        this.registerClickableButton(this.manageButton, () => {
          callbacks.onManage(config.type);
        });
      }
      const getIncontextSignup = this.shadow.querySelector(".js-get-email-signup");
      if (getIncontextSignup) {
        this.registerClickableButton(getIncontextSignup, () => {
          callbacks.onIncontextSignupDismissed?.({ hasOtherOptions: items.length > 0 });
          callbacks.onIncontextSignup?.();
        });
      }
      this.init();
      return this;
    }
  };

  // src/UI/EmailHTMLTooltip.js
  var EmailHTMLTooltip = class extends HTMLTooltip_default {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    render(device) {
      this.device = device;
      this.addresses = device.getLocalAddresses();
      this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--email" hidden data-platform=${this.options.platform}>
    <div class="tooltip tooltip--email">
        <button class="tooltip__button tooltip__button--email js-use-personal">
            <span class="tooltip__button--email__primary-text">
                ${this.device.t("autofill:usePersonalDuckAddr", { email: formatDuckAddress(escapeXML(this.addresses.personalAddress)) })}
            </span>
            <span class="tooltip__button--email__secondary-text">${this.device.t("autofill:blockEmailTrackers")}</span>
        </button>
        <button class="tooltip__button tooltip__button--email js-use-private">
            <span class="tooltip__button--email__primary-text">${this.device.t("autofill:generateDuckAddr")}</span>
            <span class="tooltip__button--email__secondary-text">${this.device.t("autofill:blockEmailTrackersAndHideAddress")}</span>
        </button>
    </div>
    <div class="tooltip--email__caret"></div>
</div>`;
      this.wrapper = this.shadow.querySelector(".wrapper");
      this.tooltip = this.shadow.querySelector(".tooltip");
      this.usePersonalButton = this.shadow.querySelector(".js-use-personal");
      this.usePrivateButton = this.shadow.querySelector(".js-use-private");
      this.usePersonalCta = this.shadow.querySelector(".js-use-personal > span:first-of-type");
      this.updateAddresses = (addresses) => {
        if (addresses && this.usePersonalCta) {
          this.addresses = addresses;
          this.usePersonalCta.textContent = this.device.t("autofill:usePersonalDuckAddr", {
            email: formatDuckAddress(addresses.personalAddress)
          });
        }
      };
      const firePixel = this.device.firePixel.bind(this.device);
      this.registerClickableButton(this.usePersonalButton, () => {
        this.fillForm("personalAddress");
        firePixel({ pixelName: "autofill_personal_address" });
      });
      this.registerClickableButton(this.usePrivateButton, () => {
        this.fillForm("privateAddress");
        firePixel({ pixelName: "autofill_private_address" });
      });
      this.device.getAddresses().then(this.updateAddresses);
      this.init();
      return this;
    }
    /**
     * @param {'personalAddress' | 'privateAddress'} id
     */
    async fillForm(id) {
      const address = this.addresses[id];
      const formattedAddress = formatDuckAddress(address);
      this.device?.selectedDetail({ email: formattedAddress, id }, "email");
    }
  };

  // src/UI/EmailSignupHTMLTooltip.js
  var EmailSignupHTMLTooltip = class extends HTMLTooltip_default {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    render(device) {
      this.device = device;
      const t = this.device.t;
      this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--email" hidden data-platform=${this.options.platform}>
    <div class="tooltip tooltip--email tooltip--email-signup">
        <button class="close-tooltip js-close-email-signup" aria-label="Close"></button>
        <h1>${t("autofill:hideEmailAndBlockTrackers")}</h1>
        <p>${t("autofill:createUniqueRandomAddr")}</p>
        <div class="notice-controls">
            <a href="https://duckduckgo.com/email/start-incontext" target="_blank" class="primary js-get-email-signup">
                ${t("autofill:protectMyEmail")}
            </a>
            <button class="ghost js-dismiss-email-signup">
                ${t("autofill:dontShowAgain")}
            </button>
        </div>
    </div>
    <div class="tooltip--email__caret"></div>
</div>`;
      this.tooltip = this.shadow.querySelector(".tooltip");
      this.closeEmailSignup = this.shadow.querySelector(".js-close-email-signup");
      this.registerClickableButton(this.closeEmailSignup, () => {
        device.inContextSignup?.onIncontextSignupClosed();
      });
      this.dismissEmailSignup = this.shadow.querySelector(".js-dismiss-email-signup");
      this.registerClickableButton(this.dismissEmailSignup, () => {
        device.inContextSignup?.onIncontextSignupDismissed();
      });
      this.getEmailSignup = this.shadow.querySelector(".js-get-email-signup");
      this.registerClickableButton(this.getEmailSignup, () => {
        device.inContextSignup?.onIncontextSignup();
      });
      this.init();
      return this;
    }
  };

  // src/UI/CredentialsImportTooltip.js
  var CredentialsImportTooltip = class extends HTMLTooltip_default {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype.js").default} device
     * @param {{ onStarted(): void, onDismissed(): void }} callbacks
     */
    render(device, callbacks) {
      this.device = device;
      const t = device.t;
      this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--data ${this.options.isTopAutofill ? "top-autofill" : ""}" hidden data-platform=${this.options.platform}>
    <div class="tooltip tooltip--data">
        <button class="tooltip__button tooltip__button--data tooltip__button--credentials-import js-promo-wrapper">
            <span class="tooltip__button__text-container">
                <span class="label label--medium">${t("autofill:credentialsImportHeading")}</span>
                <span class="label label--small">${t("autofill:credentialsImportText")}</span>
            </span>
        </button>
        <hr />
        <button class="tooltip__button tooltip__button--secondary js-dismiss">
            <span class="tooltip__button__text-container">
                <span class="label label--medium">${t("autofill:dontShowAgain")}</span>
            </span>
        </button>
    </div>
</div>
`;
      this.tooltip = this.shadow.querySelector(".tooltip");
      this.buttonWrapper = this.shadow.querySelector(".js-promo-wrapper");
      this.dismissWrapper = this.shadow.querySelector(".js-dismiss");
      this.registerClickableButton(this.buttonWrapper, () => {
        callbacks.onStarted();
      });
      this.registerClickableButton(this.dismissWrapper, () => {
        callbacks.onDismissed();
      });
      this.init();
      return this;
    }
  };

  // src/UI/controllers/HTMLTooltipUIController.js
  var HTMLTooltipUIController = class extends UIController {
    /**
     * @param {HTMLTooltipControllerOptions} options
     * @param {Partial<import('../HTMLTooltip.js').HTMLTooltipOptions>} htmlTooltipOptions
     */
    constructor(options, htmlTooltipOptions = defaultOptions) {
      super();
      /** @type {import("../HTMLTooltip.js").HTMLTooltip | null} */
      __publicField(this, "_activeTooltip", null);
      /** @type {HTMLTooltipControllerOptions} */
      __publicField(this, "_options");
      /** @type {import('../HTMLTooltip.js').HTMLTooltipOptions} */
      __publicField(this, "_htmlTooltipOptions");
      /**
       * Overwritten when calling createTooltip
       * @type {import('../../Form/matching').SupportedTypes}
       */
      __publicField(this, "_activeInputType", "unknown");
      __publicField(this, "_activeInput");
      __publicField(this, "_activeInputOriginalAutocomplete");
      this._options = options;
      this._htmlTooltipOptions = Object.assign({}, defaultOptions, htmlTooltipOptions);
      if (options.device.globalConfig.isTopFrame) {
        window.addEventListener("pointerup", this, true);
      } else {
        window.addEventListener("pointerdown", this, true);
      }
    }
    /**
     * Cleans up after this UI controller by removing the tooltip and all
     * listeners.
     */
    destroy() {
      this.removeTooltip();
      window.removeEventListener("pointerdown", this, true);
      window.removeEventListener("pointerup", this, true);
    }
    /**
     * @param {import('./UIController').AttachTooltipArgs} args
     */
    attachTooltip(args) {
      if (this.getActiveTooltip()) {
        return;
      }
      const { topContextData, getPosition, input, form } = args;
      const tooltip = this.createTooltip(getPosition, topContextData);
      this.setActiveTooltip(tooltip);
      form.showingTooltip(input);
      this._activeInput = input;
      this._activeInputOriginalAutocomplete = input.getAttribute("autocomplete");
      input.setAttribute("autocomplete", "off");
    }
    /**
     * Actually create the HTML Tooltip
     * @param {import('../interfaces.js').PosFn} getPosition
     * @param {TopContextData} topContextData
     * @return {import("../HTMLTooltip").HTMLTooltip}
     */
    createTooltip(getPosition, topContextData) {
      this._attachListeners();
      const config = getInputConfigFromType(topContextData.inputType);
      this._activeInputType = topContextData.inputType;
      const tooltipOptions = {
        ...this._htmlTooltipOptions,
        remove: () => this.removeTooltip(),
        isIncontextSignupAvailable: () => {
          const subtype = getSubtypeFromType(topContextData.inputType);
          return !!this._options.device.inContextSignup?.isAvailable(subtype);
        }
      };
      const hasNoCredentialsData = this._options.device.getLocalCredentials().length === 0;
      if (topContextData.credentialsImport && hasNoCredentialsData) {
        this._options.device.firePixel({ pixelName: "autofill_import_credentials_prompt_shown" });
        return new CredentialsImportTooltip(topContextData.inputType, getPosition, tooltipOptions).render(this._options.device, {
          onStarted: () => {
            this._options.device.credentialsImport.started();
          },
          onDismissed: () => {
            this._options.device.credentialsImport.dismissed();
          }
        });
      }
      if (this._options.tooltipKind === "legacy") {
        this._options.device.firePixel({ pixelName: "autofill_show" });
        return new EmailHTMLTooltip(topContextData.inputType, getPosition, tooltipOptions).render(this._options.device);
      }
      if (this._options.tooltipKind === "emailsignup") {
        this._options.device.firePixel({ pixelName: "incontext_show" });
        return new EmailSignupHTMLTooltip(topContextData.inputType, getPosition, tooltipOptions).render(this._options.device);
      }
      const data = this._dataForAutofill(config, topContextData.inputType, topContextData);
      const asRenderers = data.map((d) => config.tooltipItem(d));
      return new DataHTMLTooltip(topContextData.inputType, getPosition, tooltipOptions).render(
        this._options.device,
        config,
        asRenderers,
        {
          onSelect: (id) => {
            this._onSelect(topContextData.inputType, data, id);
          },
          onManage: (type) => {
            this._onManage(type);
          },
          onIncontextSignupDismissed: (flags) => {
            this._onIncontextSignupDismissed(flags);
          },
          onIncontextSignup: () => {
            this._onIncontextSignup();
          }
        }
      );
    }
    updateItems(data) {
      if (this._activeInputType === "unknown") return;
      const config = getInputConfigFromType(this._activeInputType);
      const asRenderers = data.map((d) => config.tooltipItem(d));
      const activeTooltip = this.getActiveTooltip();
      if (activeTooltip instanceof DataHTMLTooltip) {
        activeTooltip?.render(this._options.device, config, asRenderers, {
          onSelect: (id) => {
            this._onSelect(this._activeInputType, data, id);
          },
          onManage: (type) => {
            this._onManage(type);
          },
          onIncontextSignupDismissed: (flags) => {
            this._onIncontextSignupDismissed(flags);
          },
          onIncontextSignup: () => {
            this._onIncontextSignup();
          }
        });
      }
      setTimeout(() => {
        this.getActiveTooltip()?.setSize();
      }, 10);
    }
    _attachListeners() {
      window.addEventListener("input", this);
      window.addEventListener("keydown", this, true);
    }
    _removeListeners() {
      window.removeEventListener("input", this);
      window.removeEventListener("keydown", this, true);
    }
    handleEvent(event) {
      switch (event.type) {
        case "keydown":
          if (["Escape", "Tab", "Enter"].includes(event.code)) {
            if (event.code === "Escape") {
              event.preventDefault();
              event.stopImmediatePropagation();
            }
            this.removeTooltip();
          }
          break;
        case "input":
          this.removeTooltip();
          break;
        case "pointerdown": {
          this._pointerDownListener(event);
          break;
        }
        case "pointerup": {
          this._pointerUpListener(event);
          break;
        }
      }
    }
    // Global listener for event delegation
    _pointerDownListener(e) {
      if (!e.isTrusted) return;
      if (isEventWithinDax(e, e.target)) return;
      if (e.target.nodeName === "DDG-AUTOFILL") {
        this._handleClickInTooltip(e);
      } else {
        this.removeTooltip().catch((e2) => {
          console.error("error removing tooltip", e2);
        });
      }
    }
    // Global listener for event delegation
    _pointerUpListener(e) {
      if (!e.isTrusted) return;
      if (isEventWithinDax(e, e.target)) return;
      if (e.target.nodeName === "DDG-AUTOFILL") {
        this._handleClickInTooltip(e);
      }
    }
    _handleClickInTooltip(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const isMainMouseButton = e.button === 0;
      if (!isMainMouseButton) return;
      const activeTooltip = this.getActiveTooltip();
      activeTooltip?.dispatchClick();
    }
    async removeTooltip(_via) {
      this._htmlTooltipOptions.remove();
      if (this._activeTooltip) {
        this._removeListeners();
        this._activeTooltip.remove();
        this._activeTooltip = null;
      }
      if (this._activeInput) {
        if (this._activeInputOriginalAutocomplete) {
          this._activeInput.setAttribute("autocomplete", this._activeInputOriginalAutocomplete);
        } else {
          this._activeInput.removeAttribute("autocomplete");
        }
        this._activeInput = null;
        this._activeInputOriginalAutocomplete = null;
      }
    }
    /**
     * @returns {import("../HTMLTooltip.js").HTMLTooltip|null}
     */
    getActiveTooltip() {
      return this._activeTooltip;
    }
    /**
     * @param {import("../HTMLTooltip.js").HTMLTooltip} value
     */
    setActiveTooltip(value) {
      this._activeTooltip = value;
    }
    /**
     * Collect the data that's needed to populate the Autofill UI.
     *
     * Note: ideally we'd pass this data instead, so that we didn't have a circular dependency
     *
     * @param {InputTypeConfigs} config - This is the selected `InputTypeConfig` based on the type of field
     * @param {import('../../Form/matching').SupportedTypes} inputType - The input type for the current field
     * @param {TopContextData} topContextData
     */
    _dataForAutofill(config, inputType, topContextData) {
      return this._options.device.dataForAutofill(config, inputType, topContextData);
    }
    /**
     * When a field is selected, call the `onSelect` method from the device.
     *
     * Note: ideally we'd pass this data instead, so that we didn't have a circular dependency
     *
     * @param {import('../../Form/matching').SupportedTypes} inputType
     * @param {(CreditCardObject | IdentityObject | CredentialsObject)[]} data
     * @param {CreditCardObject['id']|IdentityObject['id']|CredentialsObject['id']} id
     */
    _onSelect(inputType, data, id) {
      return this._options.device.onSelect(inputType, data, id);
    }
    /**
     * Called when clicking on the Manage… button in the html tooltip
     * @param {SupportedMainTypes} type
     * @returns {*}
     * @private
     */
    _onManage(type) {
      switch (type) {
        case "credentials":
          this._options.device.openManagePasswords();
          break;
        case "creditCards":
          this._options.device.openManageCreditCards();
          break;
        case "identities":
          this._options.device.openManageIdentities();
          break;
        default:
      }
      this.removeTooltip();
    }
    _onIncontextSignupDismissed({ hasOtherOptions }) {
      this._options.device.inContextSignup?.onIncontextSignupDismissed({ shouldHideTooltip: !hasOtherOptions });
      if (hasOtherOptions) {
        const topContextData = this._options.device.getTopContextData();
        if (!topContextData) return;
        const config = getInputConfigFromType(topContextData.inputType);
        const data = this._dataForAutofill(config, topContextData.inputType, topContextData);
        this.updateItems(data);
      }
    }
    _onIncontextSignup() {
      this._options.device.inContextSignup?.onIncontextSignup();
    }
    isActive() {
      return Boolean(this.getActiveTooltip());
    }
  };

  // src/DeviceInterface/ExtensionInterface.js
  var TOOLTIP_TYPES = {
    EmailProtection: "EmailProtection",
    EmailSignup: "EmailSignup"
  };
  var ExtensionInterface = class extends InterfacePrototype_default {
    constructor() {
      super(...arguments);
      /**
       * Adding this here since only the extension currently supports this
       */
      __publicField(this, "inContextSignup", new InContextSignup(this));
    }
    /**
     * @override
     */
    createUIController() {
      const htmlTooltipOptions = {
        ...defaultOptions,
        platform: "extension",
        css: `<link rel="stylesheet" href="${chrome.runtime.getURL("public/css/autofill.css")}" crossOrigin="anonymous">`,
        testMode: this.isTestMode(),
        hasCaret: true
      };
      const tooltipKinds = {
        [TOOLTIP_TYPES.EmailProtection]: "legacy",
        [TOOLTIP_TYPES.EmailSignup]: "emailsignup"
      };
      const tooltipKind = tooltipKinds[this.getActiveTooltipType()] || tooltipKinds[TOOLTIP_TYPES.EmailProtection];
      return new HTMLTooltipUIController({ tooltipKind, device: this }, htmlTooltipOptions);
    }
    getActiveTooltipType() {
      if (this.hasLocalAddresses) {
        return TOOLTIP_TYPES.EmailProtection;
      }
      const inputType = this.activeForm?.activeInput ? getInputSubtype(this.activeForm.activeInput) : void 0;
      if (this.inContextSignup?.isAvailable(inputType)) {
        return TOOLTIP_TYPES.EmailSignup;
      }
      return null;
    }
    async resetAutofillUI(callback) {
      this.removeAutofillUIFromPage("Resetting autofill.");
      await this.setupAutofill();
      if (callback) await callback();
      this.uiController = this.createUIController();
      await this.postInit();
    }
    isDeviceSignedIn() {
      return this.hasLocalAddresses;
    }
    async setupAutofill() {
      await this.inContextSignup.init();
      return this.getAddresses();
    }
    postInit() {
      switch (this.getActiveTooltipType()) {
        case TOOLTIP_TYPES.EmailProtection: {
          this._scannerCleanup = this.scanner.init();
          this.addLogoutListener(() => {
            this.resetAutofillUI();
            if (this.globalConfig.isDDGDomain) {
              notifyWebApp({ deviceSignedIn: { value: false } });
            }
          });
          if (this.activeForm?.activeInput) {
            this.attachTooltip({
              form: this.activeForm,
              input: this.activeForm?.activeInput,
              click: null,
              trigger: "postSignup",
              triggerMetaData: {
                type: "transactional"
              }
            });
          }
          break;
        }
        case TOOLTIP_TYPES.EmailSignup: {
          this._scannerCleanup = this.scanner.init();
          break;
        }
        default: {
          break;
        }
      }
    }
    getAddresses() {
      return new Promise(
        (resolve) => chrome.runtime.sendMessage({ getAddresses: true }, (data) => {
          this.storeLocalAddresses(data);
          return resolve(data);
        })
      );
    }
    /**
     * Used by the email web app
     * Settings page displays data of the logged in user data
     */
    getUserData() {
      return new Promise((resolve) => chrome.runtime.sendMessage({ getUserData: true }, (data) => resolve(data)));
    }
    /**
     * Used by the email web app
     * Device capabilities determine which functionality is available to the user
     */
    getEmailProtectionCapabilities() {
      return new Promise((resolve) => chrome.runtime.sendMessage({ getEmailProtectionCapabilities: true }, (data) => resolve(data)));
    }
    refreshAlias() {
      return chrome.runtime.sendMessage({ refreshAlias: true }, (addresses) => this.storeLocalAddresses(addresses));
    }
    async trySigningIn() {
      if (this.globalConfig.isDDGDomain) {
        const data = await sendAndWaitForAnswer(SIGN_IN_MSG, "addUserData");
        this.storeUserData(data);
      }
    }
    /**
     * @param {object} message
     * @param {object} message.addUserData
     * @param {string} message.addUserData.token
     * @param {string} message.addUserData.userName
     * @param {string} message.addUserData.cohort
     */
    storeUserData(message) {
      return chrome.runtime.sendMessage(message);
    }
    /**
     * Used by the email web app
     * Provides functionality to log the user out
     */
    removeUserData() {
      return chrome.runtime.sendMessage({ removeUserData: true });
    }
    addDeviceListeners() {
      let activeEl = null;
      document.addEventListener("contextmenu", (e) => {
        activeEl = e.target;
      });
      chrome.runtime.onMessage.addListener((message, sender) => {
        if (sender.id !== chrome.runtime.id) return;
        switch (message.type) {
          case "ddgUserReady":
            this.resetAutofillUI(() => this.setupSettingsPage({ shouldLog: true }));
            break;
          case "contextualAutofill":
            setValue(activeEl, formatDuckAddress(message.alias), this.globalConfig);
            activeEl.classList.add("ddg-autofilled");
            this.refreshAlias();
            activeEl.addEventListener("input", (e) => e.target.classList.remove("ddg-autofilled"), { once: true });
            break;
          default:
            break;
        }
      });
    }
    addLogoutListener(handler) {
      if (this._logoutListenerHandler) {
        chrome.runtime.onMessage.removeListener(this._logoutListenerHandler);
      }
      this._logoutListenerHandler = (message, sender) => {
        if (sender.id === chrome.runtime.id && message.type === "logout") {
          handler();
        }
      };
      chrome.runtime.onMessage.addListener(this._logoutListenerHandler);
    }
  };

  // src/UI/controllers/OverlayUIController.js
  var _state;
  var OverlayUIController = class extends UIController {
    /**
     * @param {OverlayControllerOptions} options
     */
    constructor(options) {
      super();
      /** @type {"idle" | "parentShown"} */
      __privateAdd(this, _state, "idle");
      /** @type {import('../HTMLTooltip.js').HTMLTooltip | null} */
      __publicField(this, "_activeTooltip", null);
      /**
       * @type {OverlayControllerOptions}
       */
      __publicField(this, "_options");
      this._options = options;
      window.addEventListener("pointerdown", this, true);
    }
    /**
     * @param {import('./UIController').AttachTooltipArgs} args
     */
    attachTooltip(args) {
      const { getPosition, topContextData, click, input } = args;
      if (!input.parentNode) return;
      this._mutObs = new MutationObserver((mutationList) => {
        for (const mutationRecord of mutationList) {
          mutationRecord.removedNodes.forEach((el) => {
            if (el.contains(input)) {
              this.removeTooltip("mutation observer");
            }
          });
        }
      });
      this._mutObs.observe(document.body, { childList: true, subtree: true });
      const position = getPosition();
      if (!click && !this.elementIsInViewport(position)) {
        input.scrollIntoView(true);
        this._mutObs?.disconnect();
        setTimeout(() => {
          this.attachTooltip(args);
        }, 50);
        return;
      }
      __privateSet(this, _state, "parentShown");
      this.showTopTooltip(click, position, topContextData).catch((e) => {
        console.error("error from showTopTooltip", e);
        __privateSet(this, _state, "idle");
      });
    }
    /**
     * @param {{ x: number; y: number; height: number; width: number; }} inputDimensions
     * @returns {boolean}
     */
    elementIsInViewport(inputDimensions) {
      if (inputDimensions.x < 0 || inputDimensions.y < 0 || inputDimensions.x + inputDimensions.width > document.documentElement.clientWidth || inputDimensions.y + inputDimensions.height > document.documentElement.clientHeight) {
        return false;
      }
      const viewport = document.documentElement;
      if (inputDimensions.x + inputDimensions.width > viewport.clientWidth || inputDimensions.y + inputDimensions.height > viewport.clientHeight) {
        return false;
      }
      return true;
    }
    /**
     * @param {{ x: number; y: number; } | null} click
     * @param {{ x: number; y: number; height: number; width: number; }} inputDimensions
     * @param {TopContextData} data
     */
    async showTopTooltip(click, inputDimensions, data) {
      let diffX = inputDimensions.x;
      let diffY = inputDimensions.y;
      if (click) {
        diffX -= click.x;
        diffY -= click.y;
      } else if (!this.elementIsInViewport(inputDimensions)) {
        return;
      }
      if (!data.inputType) {
        throw new Error("No input type found");
      }
      const mainType = getMainTypeFromType(data.inputType);
      const subType = getSubtypeFromType(data.inputType);
      if (mainType === "unknown") {
        throw new Error('unreachable, should not be here if (mainType === "unknown")');
      }
      const details = {
        inputType: data.inputType,
        mainType,
        subType,
        serializedInputContext: JSON.stringify(data),
        triggerContext: {
          wasFromClick: Boolean(click),
          inputTop: Math.floor(diffY),
          inputLeft: Math.floor(diffX),
          inputHeight: Math.floor(inputDimensions.height),
          inputWidth: Math.floor(inputDimensions.width)
        }
      };
      try {
        __privateSet(this, _state, "parentShown");
        this._attachListeners();
        await this._options.show(details);
      } catch (e) {
        console.error("could not show parent", e);
        __privateSet(this, _state, "idle");
      }
    }
    _attachListeners() {
      window.addEventListener("scroll", this);
      window.addEventListener("keydown", this, true);
      window.addEventListener("input", this);
    }
    _removeListeners() {
      window.removeEventListener("scroll", this);
      window.removeEventListener("keydown", this, true);
      window.removeEventListener("input", this);
    }
    handleEvent(event) {
      switch (event.type) {
        case "scroll": {
          this.removeTooltip(event.type);
          break;
        }
        case "keydown": {
          if (["Escape", "Tab", "Enter"].includes(event.code)) {
            if (event.code === "Escape") {
              event.preventDefault();
              event.stopImmediatePropagation();
            }
            this.removeTooltip(event.type);
          }
          break;
        }
        case "input": {
          this.removeTooltip(event.type);
          break;
        }
        case "pointerdown": {
          this.removeTooltip(event.type);
          break;
        }
      }
    }
    /**
     * @param {string} trigger
     * @returns {Promise<void>}
     */
    async removeTooltip(trigger) {
      if (trigger !== "pointerdown") {
        if (__privateGet(this, _state) !== "parentShown") {
          return;
        }
      }
      try {
        await this._options.remove();
      } catch (e) {
        console.error("Could not close parent", e);
      }
      __privateSet(this, _state, "idle");
      this._removeListeners();
      this._mutObs?.disconnect();
    }
    isActive() {
      return __privateGet(this, _state) === "parentShown";
    }
  };
  _state = new WeakMap();

  // zod-replacers:./__generated__/validators.zod.js
  var getAliasParamsSchema = null;
  var getAliasResultSchema = null;

  // src/deviceApiCalls/additionalDeviceApiCalls.js
  var GetAlias = class extends DeviceApiCall {
    constructor() {
      super(...arguments);
      __publicField(this, "method", "emailHandlerGetAlias");
      __publicField(this, "id", "n/a");
      __publicField(this, "paramsValidator", getAliasParamsSchema);
      __publicField(this, "resultValidator", getAliasResultSchema);
    }
    preResultValidation(response) {
      return { success: response };
    }
  };

  // src/ThirdPartyProvider.js
  var ThirdPartyProvider = class {
    /**
     * @param {import("./DeviceInterface/InterfacePrototype").default} device
     */
    constructor(device) {
      this.device = device;
    }
    init() {
      if (this.device.settings.featureToggles.third_party_credentials_provider) {
        if (this.device.globalConfig.hasModernWebkitAPI) {
          Object.defineProperty(window, "providerStatusUpdated", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: (data) => {
              this.providerStatusUpdated(data);
            }
          });
        } else {
          setTimeout(() => this._pollForUpdatesToCredentialsProvider(), 2e3);
        }
      }
    }
    async askToUnlockProvider() {
      const response = await this.device.deviceApi.request(new AskToUnlockProviderCall(null));
      this.providerStatusUpdated(response);
    }
    /**
     * Called by the native layer on all tabs when the provider status is updated
     * @param {import("./deviceApiCalls/__generated__/validators-ts").ProviderStatusUpdated} data
     */
    providerStatusUpdated(data) {
      try {
        const { credentials, availableInputTypes } = validate(data, providerStatusUpdatedSchema);
        this.device.settings.setAvailableInputTypes(availableInputTypes);
        this.device.storeLocalCredentials(credentials);
        this.device.uiController?.updateItems(credentials);
        if (!this.device.globalConfig.isTopFrame) {
          const currentInputSubtype = getSubtypeFromType(this.device.getCurrentInputType());
          if (!availableInputTypes.credentials?.[currentInputSubtype]) {
            this.device.removeTooltip();
          }
          this.device.scanner.forms.forEach((form) => form.recategorizeAllInputs());
        }
      } catch (e) {
        if (this.device.globalConfig.isDDGTestMode) {
          console.log("isDDGTestMode: providerStatusUpdated error: \u274C", e);
        }
      }
    }
    // Only used on Catalina
    async _pollForUpdatesToCredentialsProvider() {
      try {
        const response = await this.device.deviceApi.request(new CheckCredentialsProviderStatusCall(null));
        if (response.availableInputTypes.credentialsProviderStatus !== this.device.settings.availableInputTypes.credentialsProviderStatus) {
          this.providerStatusUpdated(response);
        }
        setTimeout(() => this._pollForUpdatesToCredentialsProvider(), 2e3);
      } catch (e) {
        if (this.device.globalConfig.isDDGTestMode) {
          console.log("isDDGTestMode: _pollForUpdatesToCredentialsProvider: \u274C", e);
        }
      }
    }
  };

  // src/DeviceInterface/AppleDeviceInterface.js
  var AppleDeviceInterface = class extends InterfacePrototype_default {
    constructor() {
      super(...arguments);
      __publicField(this, "inContextSignup", new InContextSignup(this));
      /** @override */
      __publicField(this, "initialSetupDelayMs", 300);
      __publicField(this, "thirdPartyProvider", new ThirdPartyProvider(this));
      /** @type {any} */
      __publicField(this, "pollingTimeout", null);
    }
    /**
     * The default functionality of this class is to operate as an 'overlay controller' -
     * which means it's purpose is to message the native layer about when to open/close the overlay.
     *
     * There is an additional use-case though, when running on older macOS versions, we just display the
     * HTMLTooltip in-page (like the extension does). This is why the `!this.globalConfig.supportsTopFrame`
     * check exists below - if we know we don't support the overlay, we fall back to in-page.
     *
     * @override
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createUIController() {
      if (this.globalConfig.userPreferences?.platform?.name === "ios") {
        return new NativeUIController();
      }
      if (!this.globalConfig.supportsTopFrame) {
        const options = {
          ...defaultOptions,
          platform: "macos",
          testMode: this.isTestMode()
        };
        return new HTMLTooltipUIController(
          {
            device: this,
            tooltipKind: "modern"
          },
          options
        );
      }
      return new OverlayUIController({
        remove: async () => this._closeAutofillParent(),
        show: async (details) => this._show(details)
      });
    }
    /**
     * For now, this could be running
     *  1) on iOS
     *  2) on macOS + Overlay
     *  3) on macOS + in-page HTMLTooltip
     *
     * @override
     * @returns {Promise<void>}
     */
    async setupAutofill() {
      if (!this.globalConfig.supportsTopFrame) {
        await this._getAutofillInitData();
      }
      await this.inContextSignup.init();
      const signedIn = await this._checkDeviceSignedIn();
      if (signedIn) {
        if (this.globalConfig.isApp) {
          await this.getAddresses();
        }
      }
    }
    /**
     * Used by the email web app
     * Settings page displays data of the logged in user data
     */
    getUserData() {
      return this.deviceApi.request(createRequest("emailHandlerGetUserData"));
    }
    /**
     * Used by the email web app
     * Device capabilities determine which functionality is available to the user
     */
    getEmailProtectionCapabilities() {
      return this.deviceApi.request(createRequest("emailHandlerGetCapabilities"));
    }
    /**
     */
    async getSelectedCredentials() {
      return this.deviceApi.request(createRequest("getSelectedCredentials"));
    }
    /**
     * The data format provided here for `parentArgs` matches Window now.
     * @param {GetAutofillDataRequest} parentArgs
     */
    async _showAutofillParent(parentArgs) {
      const applePayload = {
        ...parentArgs.triggerContext,
        serializedInputContext: parentArgs.serializedInputContext
      };
      return this.deviceApi.notify(createNotification("showAutofillParent", applePayload));
    }
    /**
     * @returns {Promise<any>}
     */
    async _closeAutofillParent() {
      return this.deviceApi.notify(createNotification("closeAutofillParent", {}));
    }
    /**
     * @param {GetAutofillDataRequest} details
     */
    async _show(details) {
      await this._showAutofillParent(details);
      this._listenForSelectedCredential(async (response) => {
        if (!response) return;
        if ("configType" in response) {
          this.selectedDetail(response.data, response.configType);
        } else if ("stop" in response) {
          await this.onFinishedAutofill();
        } else if ("stateChange" in response) {
          await this.updateForStateChange();
        }
      });
    }
    async refreshData() {
      await super.refreshData();
      await this._checkDeviceSignedIn();
    }
    async getAddresses() {
      if (!this.globalConfig.isApp) return this.getAlias();
      const { addresses } = await this.deviceApi.request(createRequest("emailHandlerGetAddresses"));
      this.storeLocalAddresses(addresses);
      return addresses;
    }
    async refreshAlias() {
      await this.deviceApi.notify(createNotification("emailHandlerRefreshAlias"));
      if (this.globalConfig.isApp) this.getAddresses();
    }
    async _checkDeviceSignedIn() {
      const { isAppSignedIn } = await this.deviceApi.request(createRequest("emailHandlerCheckAppSignedInStatus"));
      this.isDeviceSignedIn = () => !!isAppSignedIn;
      return !!isAppSignedIn;
    }
    storeUserData({ addUserData: { token, userName, cohort } }) {
      return this.deviceApi.notify(createNotification("emailHandlerStoreToken", { token, username: userName, cohort }));
    }
    /**
     * Used by the email web app
     * Provides functionality to log the user out
     */
    removeUserData() {
      this.deviceApi.notify(createNotification("emailHandlerRemoveToken"));
    }
    /**
     * Used by the email web app
     * Provides functionality to close the window after in-context sign-up or sign-in
     */
    closeEmailProtection() {
      this.deviceApi.request(new CloseEmailProtectionTabCall(null));
    }
    /**
     * PM endpoints
     */
    /**
     * Gets the init data from the device
     * @returns {APIResponse<PMData>}
     */
    async _getAutofillInitData() {
      const response = await this.deviceApi.request(createRequest("pmHandlerGetAutofillInitData"));
      this.storeLocalData(response.success);
      return response;
    }
    /**
     * Gets credentials ready for autofill
     * @param {CredentialsObject['id']} id - the credential id
     * @returns {APIResponseSingle<CredentialsObject>}
     */
    getAutofillCredentials(id) {
      return this.deviceApi.request(createRequest("pmHandlerGetAutofillCredentials", { id }));
    }
    /**
     * Opens the native UI for managing passwords
     */
    openManagePasswords() {
      return this.deviceApi.notify(createNotification("pmHandlerOpenManagePasswords"));
    }
    /**
     * Opens the native UI for managing identities
     */
    openManageIdentities() {
      return this.deviceApi.notify(createNotification("pmHandlerOpenManageIdentities"));
    }
    /**
     * Opens the native UI for managing credit cards
     */
    openManageCreditCards() {
      return this.deviceApi.notify(createNotification("pmHandlerOpenManageCreditCards"));
    }
    /**
     * Gets a single identity obj once the user requests it
     * @param {IdentityObject['id']} id
     * @returns {Promise<{success: IdentityObject|undefined}>}
     */
    getAutofillIdentity(id) {
      const identity = this.getLocalIdentities().find(({ id: identityId }) => `${identityId}` === `${id}`);
      return Promise.resolve({ success: identity });
    }
    /**
     * Gets a single complete credit card obj once the user requests it
     * @param {CreditCardObject['id']} id
     * @returns {APIResponseSingle<CreditCardObject>}
     */
    getAutofillCreditCard(id) {
      return this.deviceApi.request(createRequest("pmHandlerGetCreditCard", { id }));
    }
    getCurrentInputType() {
      const topContextData = this.getTopContextData();
      return topContextData?.inputType ? topContextData.inputType : getInputType(this.activeForm?.activeInput);
    }
    /**
     * @returns {Promise<string|undefined>}
     */
    async getAlias() {
      const { alias } = await this.deviceApi.request(
        new GetAlias({
          requiresUserPermission: !this.globalConfig.isApp,
          shouldConsumeAliasIfProvided: !this.globalConfig.isApp,
          isIncontextSignupAvailable: this.inContextSignup.isAvailable()
        })
      );
      return alias ? formatDuckAddress(alias) : alias;
    }
    addLogoutListener(handler) {
      if (!this.globalConfig.isDDGDomain) return;
      window.addEventListener("message", (e) => {
        if (this.globalConfig.isDDGDomain && e.data.emailProtectionSignedOut) {
          handler();
        }
      });
    }
    async addDeviceListeners() {
      this.thirdPartyProvider.init();
      this.credentialsImport.init();
    }
    /**
     * Poll the native listener until the user has selected a credential.
     * Message return types are:
     * - 'stop' is returned whenever the message sent doesn't match the native last opened tooltip.
     *     - This also is triggered when the close event is called and prevents any edge case continued polling.
     * - 'ok' is when the user has selected a credential and the value can be injected into the page.
     * - 'none' is when the tooltip is open in the native window however hasn't been entered.
     * @param {(response: {data:IdentityObject|CreditCardObject|CredentialsObject, configType: string} | {stateChange: boolean} | {stop: boolean} | null) => void} callback
     */
    async _listenForSelectedCredential(callback) {
      const poll = async () => {
        clearTimeout(this.pollingTimeout);
        const response = await this.getSelectedCredentials();
        switch (response.type) {
          case "none":
            this.pollingTimeout = setTimeout(() => poll(), 100);
            return;
          case "ok": {
            await callback({ data: response.data, configType: response.configType });
            return;
          }
          case "state": {
            await callback({ stateChange: true });
            this.pollingTimeout = setTimeout(() => poll(), 100);
            return;
          }
          case "stop":
            await callback({ stop: true });
        }
      };
      poll();
    }
  };

  // src/DeviceInterface/overlayApi.js
  function overlayApi(device) {
    return {
      /**
       * When we are inside an 'overlay' - the HTML tooltip will be opened immediately
       */
      showImmediately() {
        const topContextData = device.getTopContextData();
        if (!topContextData) throw new Error("unreachable, topContextData should be available");
        const getPosition = () => {
          return {
            x: 0,
            y: 0,
            height: 50,
            width: 50
          };
        };
        const tooltip = device.uiController?.createTooltip?.(getPosition, topContextData);
        if (tooltip) {
          device.uiController?.setActiveTooltip?.(tooltip);
        }
      },
      /**
       * @param {IdentityObject|CreditCardObject|CredentialsObject|{email:string, id: string}} data
       * @param {string} type
       * @returns {Promise<void>}
       */
      async selectedDetail(data, type) {
        const detailsEntries = Object.entries(data).map(([key2, value]) => {
          return [key2, String(value)];
        });
        const entries = Object.fromEntries(detailsEntries);
        await device.deviceApi.notify(new SelectedDetailCall({ data: entries, configType: type }));
      }
    };
  }

  // src/DeviceInterface/AppleOverlayDeviceInterface.js
  var AppleOverlayDeviceInterface = class extends AppleDeviceInterface {
    constructor() {
      super(...arguments);
      /**
       * Mark top frame as not stripping credential data
       * @type {boolean}
       */
      __publicField(this, "stripCredentials", false);
      /**
       * overlay API helpers
       */
      __publicField(this, "overlay", overlayApi(this));
      __publicField(this, "previousX", 0);
      __publicField(this, "previousY", 0);
    }
    /**
     * Because we're running inside the Overlay, we always create the HTML
     * Tooltip controller.
     *
     * @override
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createUIController() {
      return new HTMLTooltipUIController(
        {
          tooltipKind: (
            /** @type {const} */
            "modern"
          ),
          device: this
        },
        {
          ...defaultOptions,
          platform: "macos",
          wrapperClass: "top-autofill",
          isTopAutofill: true,
          tooltipPositionClass: () => ".wrapper { transform: none; }",
          setSize: (details) => this.deviceApi.notify(createNotification("setSize", details)),
          remove: async () => this._closeAutofillParent(),
          testMode: this.isTestMode()
        }
      );
    }
    async startCredentialsImportFlow() {
      this._closeAutofillParent();
      await this.deviceApi.notify(createNotification("startCredentialsImportFlow"));
    }
    addDeviceListeners() {
      window.addEventListener("mouseMove", (event) => {
        if (!this.previousX && !this.previousY || // if no previous coords
        this.previousX === event.detail.x && this.previousY === event.detail.y) {
          this.previousX = event.detail.x;
          this.previousY = event.detail.y;
          return;
        }
        const activeTooltip = this.uiController?.getActiveTooltip?.();
        activeTooltip?.focus(event.detail.x, event.detail.y);
        this.previousX = event.detail.x;
        this.previousY = event.detail.y;
      });
      return super.addDeviceListeners();
    }
    /**
     * Since we're running inside the Overlay we can limit what happens here to
     * be only things that are needed to power the HTML Tooltip
     *
     * @override
     * @returns {Promise<void>}
     */
    async setupAutofill() {
      await this._getAutofillInitData();
      await this.inContextSignup.init();
      const signedIn = await this._checkDeviceSignedIn();
      if (signedIn) {
        await this.getAddresses();
      }
    }
    async postInit() {
      this.overlay.showImmediately();
      super.postInit();
    }
    /**
     * In the top-frame scenario we override the base 'selectedDetail'.
     *
     * This
     *
     * @override
     * @param {IdentityObject|CreditCardObject|CredentialsObject|{email:string, id: string}} data
     * @param {string} type
     */
    async selectedDetail(data, type) {
      return this.overlay.selectedDetail(data, type);
    }
  };

  // src/DeviceInterface/WindowsInterface.js
  var EMAIL_PROTECTION_LOGOUT_MESSAGE = "EMAIL_PROTECTION_LOGOUT";
  var WindowsInterface = class extends InterfacePrototype_default {
    constructor() {
      super(...arguments);
      __publicField(this, "ready", false);
      /** @type {AbortController|null} */
      __publicField(this, "_abortController", null);
    }
    async setupAutofill() {
      const loggedIn = await this._getIsLoggedIn();
      if (loggedIn) {
        await this.getAddresses();
      }
    }
    postInit() {
      super.postInit();
      this.ready = true;
    }
    createUIController() {
      return new OverlayUIController({
        remove: async () => this._closeAutofillParent(),
        show: async (details) => this._show(details)
      });
    }
    /**
     * @param {GetAutofillDataRequest} details
     */
    async _show(details) {
      const { mainType } = details;
      if (this._abortController && !this._abortController.signal.aborted) {
        this._abortController.abort();
      }
      this._abortController = new AbortController();
      try {
        const resp = await this.deviceApi.request(new GetAutofillDataCall(details), { signal: this._abortController.signal });
        if (!this.activeForm) {
          throw new Error("this.currentAttached was absent");
        }
        switch (resp.action) {
          case "fill": {
            if (mainType in resp) {
              this.activeForm?.autofillData(resp[mainType], mainType);
            } else {
              throw new Error(`action: "fill" cannot occur because "${mainType}" was missing`);
            }
            break;
          }
          case "focus": {
            this.activeForm?.activeInput?.focus();
            break;
          }
          case "none": {
            break;
          }
          case "refreshAvailableInputTypes": {
            await this.removeTooltip();
            return await this.credentialsImport.refresh();
          }
          default:
            if (this.globalConfig.isDDGTestMode) {
              console.warn("unhandled response", resp);
            }
            return this._closeAutofillParent();
        }
      } catch (e) {
        if (this.globalConfig.isDDGTestMode) {
          if (e instanceof DOMException && e.name === "AbortError") {
            console.log("Promise Aborted");
          } else {
            console.error("Promise Rejected", e);
          }
        }
      }
    }
    /**
     * @returns {Promise<any>}
     */
    async _closeAutofillParent() {
      return this.deviceApi.notify(new CloseAutofillParentCall(null));
    }
    /**
     * Email Protection calls
     */
    /**
     * @returns {Promise<any>}
     */
    getEmailProtectionCapabilities() {
      return this.deviceApi.request(new EmailProtectionGetCapabilitiesCall({}));
    }
    async _getIsLoggedIn() {
      const isLoggedIn = await this.deviceApi.request(new EmailProtectionGetIsLoggedInCall({}));
      this.isDeviceSignedIn = () => isLoggedIn;
      return isLoggedIn;
    }
    addLogoutListener(handler) {
      if (!this.globalConfig.isDDGDomain) return;
      windowsInteropAddEventListener("message", (e) => {
        if (this.globalConfig.isDDGDomain && e.data === EMAIL_PROTECTION_LOGOUT_MESSAGE) {
          handler();
        }
      });
    }
    /**
     * @returns {Promise<any>}
     */
    storeUserData({ addUserData }) {
      return this.deviceApi.request(new EmailProtectionStoreUserDataCall(addUserData));
    }
    /**
     * @returns {Promise<any>}
     */
    removeUserData() {
      return this.deviceApi.request(new EmailProtectionRemoveUserDataCall({}));
    }
    /**
     * @returns {Promise<any>}
     */
    getUserData() {
      return this.deviceApi.request(new EmailProtectionGetUserDataCall({}));
    }
    async refreshAlias() {
      const addresses = await this.deviceApi.request(new EmailProtectionRefreshPrivateAddressCall({}));
      this.storeLocalAddresses(addresses);
    }
    async getAddresses() {
      const addresses = await this.deviceApi.request(new EmailProtectionGetAddressesCall({}));
      this.storeLocalAddresses(addresses);
      return addresses;
    }
  };

  // src/DeviceInterface/WindowsOverlayDeviceInterface.js
  var WindowsOverlayDeviceInterface = class extends InterfacePrototype_default {
    constructor() {
      super(...arguments);
      /**
       * Mark top frame as not stripping credential data
       * @type {boolean}
       */
      __publicField(this, "stripCredentials", false);
      /**
       * overlay API helpers
       */
      __publicField(this, "overlay", overlayApi(this));
      __publicField(this, "previousScreenX", 0);
      __publicField(this, "previousScreenY", 0);
    }
    /**
     * Because we're running inside the Overlay, we always create the HTML
     * Tooltip controller.
     *
     * @override
     * @returns {import("../UI/controllers/UIController.js").UIController}
     */
    createUIController() {
      return new HTMLTooltipUIController(
        {
          tooltipKind: (
            /** @type {const} */
            "modern"
          ),
          device: this
        },
        {
          ...defaultOptions,
          platform: "windows",
          wrapperClass: "top-autofill",
          isTopAutofill: true,
          tooltipPositionClass: () => ".wrapper { transform: none; }",
          setSize: (details) => this.deviceApi.notify(new SetSizeCall(details)),
          remove: async () => this._closeAutofillParent(),
          testMode: this.isTestMode(),
          /**
           * Note: This is needed because Mutation observer didn't support visibility checks on Windows
           */
          checkVisibility: false
        }
      );
    }
    addDeviceListeners() {
      window.addEventListener("mousemove", (event) => {
        if (!this.previousScreenX && !this.previousScreenY || // if no previous coords
        this.previousScreenX === event.screenX && this.previousScreenY === event.screenY) {
          this.previousScreenX = event.screenX;
          this.previousScreenY = event.screenY;
          return;
        }
        const activeTooltip = this.uiController?.getActiveTooltip?.();
        activeTooltip?.focus(event.x, event.y);
        this.previousScreenX = event.screenX;
        this.previousScreenY = event.screenY;
      });
      return super.addDeviceListeners();
    }
    /**
     * @returns {Promise<any>}
     */
    async _closeAutofillParent() {
      return this.deviceApi.notify(new CloseAutofillParentCall(null));
    }
    /**
     * @returns {Promise<any>}
     */
    openManagePasswords() {
      return this.deviceApi.notify(new OpenManagePasswordsCall({}));
    }
    /**
     * @returns {Promise<any>}
     */
    openManageCreditCards() {
      return this.deviceApi.notify(new OpenManageCreditCardsCall({}));
    }
    /**
     * @returns {Promise<any>}
     */
    openManageIdentities() {
      return this.deviceApi.notify(new OpenManageIdentitiesCall({}));
    }
    /**
     * Since we're running inside the Overlay we can limit what happens here to
     * be only things that are needed to power the HTML Tooltip
     *
     * @override
     * @returns {Promise<void>}
     */
    async setupAutofill() {
      const loggedIn = await this._getIsLoggedIn();
      if (loggedIn) {
        await this.getAddresses();
      }
      const response = await this.deviceApi.request(new GetAutofillInitDataCall(null));
      this.storeLocalData(response);
    }
    async postInit() {
      this.overlay.showImmediately();
      super.postInit();
    }
    /**
     * In the top-frame scenario, we send a message to the native
     * side to indicate a selection. Once received, the native side will store that selection so that a
     * subsequence call from main webpage can retrieve it
     *
     * @override
     * @param {IdentityObject|CreditCardObject|CredentialsObject|{email:string, id: string}} data
     * @param {string} type
     */
    async selectedDetail(data, type) {
      return this.overlay.selectedDetail(data, type);
    }
    /**
     * Email Protection calls
     */
    async _getIsLoggedIn() {
      const isLoggedIn = await this.deviceApi.request(new EmailProtectionGetIsLoggedInCall({}));
      this.isDeviceSignedIn = () => isLoggedIn;
      return isLoggedIn;
    }
    async getAddresses() {
      const addresses = await this.deviceApi.request(new EmailProtectionGetAddressesCall({}));
      this.storeLocalAddresses(addresses);
      return addresses;
    }
    /**
     * Gets a single identity obj once the user requests it
     * @param {IdentityObject['id']} id
     * @returns {Promise<{success: IdentityObject|undefined}>}
     */
    async getAutofillIdentity(id) {
      const PRIVATE_ADDRESS_ID = "privateAddress";
      const PERSONAL_ADDRESS_ID = "personalAddress";
      if (id === PRIVATE_ADDRESS_ID || id === PERSONAL_ADDRESS_ID) {
        const identity = this.getLocalIdentities().find(({ id: identityId }) => identityId === id);
        return { success: identity };
      }
      const result = await this.deviceApi.request(new GetIdentityCall({ id }));
      return { success: result };
    }
    /**
     * Gets a single complete credit card obj once the user requests it
     * @param {CreditCardObject['id']} id
     * @returns {APIResponseSingle<CreditCardObject>}
     */
    async getAutofillCreditCard(id) {
      const result = await this.deviceApi.request(new GetCreditCardCall({ id }));
      return { success: result };
    }
  };

  // src/DeviceInterface.js
  function createDevice() {
    const globalConfig = createGlobalConfig();
    const transport = createTransport(globalConfig);
    const loggingTransport = {
      async send(deviceApiCall) {
        console.log("[->outgoing]", "id:", deviceApiCall.method, deviceApiCall.params || null);
        const result = await transport.send(deviceApiCall);
        console.log("[<-incoming]", "id:", deviceApiCall.method, result || null);
        return result;
      }
    };
    const deviceApi = new DeviceApi(globalConfig.isDDGTestMode ? loggingTransport : transport);
    const settings = new Settings(globalConfig, deviceApi);
    if (globalConfig.isWindows) {
      if (globalConfig.isTopFrame) {
        return new WindowsOverlayDeviceInterface(globalConfig, deviceApi, settings);
      }
      return new WindowsInterface(globalConfig, deviceApi, settings);
    }
    if (globalConfig.isDDGApp) {
      if (globalConfig.isAndroid) {
        return new AndroidInterface(globalConfig, deviceApi, settings);
      }
      if (globalConfig.isTopFrame) {
        return new AppleOverlayDeviceInterface(globalConfig, deviceApi, settings);
      }
      return new AppleDeviceInterface(globalConfig, deviceApi, settings);
    }
    globalConfig.isExtension = true;
    return new ExtensionInterface(globalConfig, deviceApi, settings);
  }

  // src/autofill.js
  (() => {
    if (shouldLog()) {
      console.log("DuckDuckGo Autofill Active");
    }
    if (!window.isSecureContext) return false;
    try {
      const startupAutofill = () => {
        if (document.visibilityState === "visible") {
          const deviceInterface = createDevice();
          deviceInterface.init();
        } else {
          document.addEventListener("visibilitychange", startupAutofill, { once: true });
        }
      };
      startupAutofill();
    } catch (e) {
      console.error(e);
    }
  })();
})();
