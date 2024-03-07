"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
  };

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
  var DDG_DOMAIN_REGEX = new RegExp(/^https:\/\/(([a-z0-9-_]+?)\.)?duckduckgo\.com\/email/);
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
    let userUnprotectedDomains = null;
    let userPreferences = null;
    // INJECT contentScope HERE
    // INJECT userUnprotectedDomains HERE
    // INJECT userPreferences HERE
    let availableInputTypes = null;
    // INJECT availableInputTypes HERE
    let secret = "PLACEHOLDER_SECRET";
    const isAndroid = userPreferences?.platform.name === "android";
    const isDDGApp = ["ios", "android", "macos", "windows"].includes(userPreferences?.platform.name) || isWindows;
    const isMobileApp = ["ios", "android"].includes(userPreferences?.platform.name);
    const isFirefox = navigator.userAgent.includes("Firefox");
    const isDDGDomain = Boolean(window.location.href.match(DDG_DOMAIN_REGEX));
    const isExtension = false;
    const config = {
      isApp,
      isDDGApp,
      isAndroid,
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
        let trimmedText = removeExcessWhitespace(el.textContent);
        if (trimmedText) {
          strings.add(trimmedText);
        }
        return;
      }
      for (let node of el.childNodes) {
        let nodeType = node.nodeType;
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
          genericTextField: 'input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=radio]):not([type=range]):not([type=reset]):not([type=image]):not([type=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week]):not([name^=fake i]):not([data-description^=dummy i]):not([name*=otp]):not([autocomplete="fake"]):not([placeholder^=search i]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=month])',
          submitButtonSelector: 'input[type=submit], input[type=button], input[type=image], button:not([role=switch]):not([role=link]), [role=button], a[href="#"][id*=button i], a[href="#"][id*=btn i]',
          formInputsSelector: 'input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=radio]):not([type=range]):not([type=reset]):not([type=image]):not([type=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week]):not([name^=fake i]):not([data-description^=dummy i]):not([name*=otp]):not([autocomplete="fake"]):not([placeholder^=search i]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=month]),[autocomplete=username],select',
          safeUniversalSelector: "*:not(select):not(option):not(script):not(noscript):not(style):not(br)",
          emailAddress: 'input:not([type])[name*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([name*=code i]), input[type=""][name*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([type=tel]), input[type=text][name*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([name*=title i]):not([name*=tab i]):not([name*=code i]), input:not([type])[placeholder*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([name*=code i]), input[type=text][placeholder*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]), input[type=""][placeholder*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]), input[type=email], input[type=text][aria-label*=email i]:not([aria-label*=search i]), input:not([type])[aria-label*=email i]:not([aria-label*=search i]), input[name=username][type=email], input[autocomplete=username][type=email], input[autocomplete=username][placeholder*=email i], input[autocomplete=email],input[name="mail_tel" i],input[value=email i]',
          username: 'input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=radio]):not([type=range]):not([type=reset]):not([type=image]):not([type=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week]):not([name^=fake i]):not([data-description^=dummy i]):not([name*=otp]):not([autocomplete="fake"]):not([placeholder^=search i]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=month])[autocomplete^=user i],input[name=username i],input[name="loginId" i],input[name="userid" i],input[id="userid" i],input[name="user_id" i],input[name="user-id" i],input[id="login-id" i],input[id="login_id" i],input[id="loginid" i],input[name="login" i],input[name=accountname i],input[autocomplete=username i],input[name*=accountid i],input[name="j_username" i],input[id="j_username" i],input[name="uwinid" i],input[name="livedoor_id" i],input[name="ssousername" i],input[name="j_userlogin_pwd" i],input[name="user[login]" i],input[name="user" i],input[name$="_username" i],input[id="lmSsoinput" i],input[name="account_subdomain" i],input[name="masterid" i],input[name="tridField" i],input[id="signInName" i],input[id="w3c_accountsbundle_accountrequeststep1_login" i],input[id="username" i],input[name="_user" i],input[name="login_username" i],input[name^="login-user-account" i],input[id="loginusuario" i],input[name="usuario" i],input[id="UserLoginFormUsername" i],input[id="nw_username" i],input[can-field="accountName"],input[placeholder^="username" i]',
          password: "input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code]):not([name*=answer i]):not([name*=mfa i]):not([name*=tin i]):not([name*=card i]):not([name*=cvv i]),input.js-cloudsave-phrase",
          cardName: 'input[autocomplete="cc-name" i], input[autocomplete="ccname" i], input[name="ccname" i], input[name="cc-name" i], input[name="ppw-accountHolderName" i], input[id*=cardname i], input[id*=card-name i], input[id*=card_name i]',
          cardNumber: 'input[autocomplete="cc-number" i], input[autocomplete="ccnumber" i], input[autocomplete="cardnumber" i], input[autocomplete="card-number" i], input[name="ccnumber" i], input[name="cc-number" i], input[name*=card i][name*=number i], input[name*=cardnumber i], input[id*=cardnumber i], input[id*=card-number i], input[id*=card_number i]',
          cardSecurityCode: 'input[autocomplete="cc-csc" i], input[autocomplete="csc" i], input[autocomplete="cc-cvc" i], input[autocomplete="cvc" i], input[name="cvc" i], input[name="cc-cvc" i], input[name="cc-csc" i], input[name="csc" i], input[name*=security i][name*=code i]',
          expirationMonth: '[autocomplete="cc-exp-month" i], [autocomplete="cc_exp_month" i], [name="ccmonth" i], [name="ppw-expirationDate_month" i], [name=cardExpiryMonth i], [name*=ExpDate_Month i], [name*=expiration i][name*=month i], [id*=expiration i][id*=month i], [name*=cc-exp-month i], [name*="card_exp-month" i], [name*=cc_exp_month i], [id*=cc-month i]',
          expirationYear: '[autocomplete="cc-exp-year" i], [autocomplete="cc_exp_year" i], [name="ccyear" i], [name="ppw-expirationDate_year" i], [name=cardExpiryYear i], [name*=ExpDate_Year i], [name*=expiration i][name*=year i], [id*=expiration i][id*=year i], [name*="cc-exp-year" i], [name*="card_exp-year" i], [name*=cc_exp_year i], [id*=cc-year i]',
          expiration: '[autocomplete="cc-exp" i], [name="cc-exp" i], [name="exp-date" i], [name="expirationDate" i], input[id*=expiration i]',
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
          birthdayDay: '[name=bday-day i], [name*=birthday_day i], [name*=birthday-day i], [name=date_of_birth_day i], [name=date-of-birth-day i], [name^=birthdate_d i], [name^=birthdate-d i], [aria-label="birthday" i][placeholder="day" i]',
          birthdayMonth: '[name=bday-month i], [name*=birthday_month i], [name*=birthday-month i], [name=date_of_birth_month i], [name=date-of-birth-month i], [name^=birthdate_m i], [name^=birthdate-m i], select[name="mm" i]',
          birthdayYear: '[name=bday-year i], [name*=birthday_year i], [name*=birthday-year i], [name=date_of_birth_year i], [name=date-of-birth-year i], [name^=birthdate_y i], [name^=birthdate-y i], [aria-label="birthday" i][placeholder="year" i]'
        }
      },
      ddgMatcher: {
        matchers: {
          unknown: {
            match: /search|filter|subject|title|captcha|mfa|2fa|(two|2).?factor|one-time|otp|cerca|filtr|oggetto|titolo|(due|2|più).?fattori|suche|filtern|betreff|zoeken|filter|onderwerp|titel|chercher|filtrer|objet|titre|authentification multifacteur|double authentification|à usage unique|busca|busqueda|filtra|dos pasos|un solo uso|sök|filter|ämne|multifaktorsautentisering|tvåfaktorsautentisering|två.?faktor|engångs/iu,
            skip: /phone|mobile|email|password/iu
          },
          emailAddress: {
            match: /.mail\b|apple.?id|posta elettronica|e.?mailadres|correo electr|correo-e|^correo$|\be.?post|e.?postadress/iu,
            skip: /phone|(first.?|last.?)name|number|code/iu,
            forceUnknown: /search|filter|subject|title|\btab\b|otp/iu
          },
          password: {
            match: /password|passwort|kennwort|wachtwoord|mot de passe|clave|contraseña|lösenord/iu,
            skip: /email|one-time|error|hint/iu,
            forceUnknown: /captcha|mfa|2fa|two factor|otp|pin/iu
          },
          newPassword: { match: /new|re.?(enter|type)|repeat|update|reset\b/iu },
          currentPassword: { match: /current|old|previous|expired|existing/iu },
          username: {
            match: /(user|account|online.?id|log(i|o)n|net)((.)?(name|i.?d.?|log(i|o)n).?)?(.?((or|\/).+|\*|:)( required)?)?$|(nome|id|login).?utente|(nome|id) (dell.)?account|codice cliente|nutzername|anmeldename|gebruikersnaam|nom d.utilisateur|identifiant|pseudo|usuari|cuenta|identificador|apodo|\bdni\b|\bnie\b| del? documento|documento de identidad|användarnamn|kontonamn|användar-id/iu,
            skip: /phone/iu,
            forceUnknown: /search|policy|choose a user\b/iu
          },
          cardName: {
            match: /(card.*name|name.*card)|(card.*holder|holder.*card)|(card.*owner|owner.*card)/iu
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
            skip: /mm[/\s.\-_—–]|check/iu
          },
          expirationYear: {
            match: /(card|\bcc\b)?.?(exp(iry|iration)?)?.?(year|yy)/iu,
            skip: /mm[/\s.\-_—–]|check/iu
          },
          expiration: {
            match: /(\bmm\b|\b\d\d\b)[/\s.\-_—–](\byy|\bjj|\baa|\b\d\d)|\bexp|\bvalid(idity| through| until)/iu,
            skip: /invalid|^dd\/|check/iu
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
            match: /sign(ing)?.?[io]n(?!g)|log.?[io]n|log.?out|unsubscri|(forgot(ten)?|reset) (your )?password|password (forgotten|lost)|mfa-submit-form|unlock|logged in as|entra|accedi|accesso|resetta password|password dimenticata|dimenticato la password|recuper[ao] password|(ein|aus)loggen|anmeld(eformular|ung|efeld)|abmelden|passwort (vergessen|verloren)|zugang| zugangsformular|einwahl|inloggen|se (dé)?connecter|(dé)?connexion|récupérer ((mon|ton|votre|le) )?mot de passe|mot de passe (oublié|perdu)|clave(?! su)|olvidó su (clave|contraseña)|.*sesión|conect(arse|ado)|conéctate|acce(de|so)|entrar|logga (in|ut)|avprenumerera|avregistrera|glömt lösenord|återställ lösenord/iu
          },
          signupRegex: {
            match: /sign(ing)?.?up|join|\bregist(er|ration)|newsletter|\bsubscri(be|ption)|contact|create|start|enroll|settings|preferences|profile|update|checkout|purchase|buy|order|schedule|estimate|request|new.?customer|(confirm|re.?(type|enter)|repeat) password|password confirm|iscri(viti|zione)|registra(ti|zione)|(?:nuovo|crea(?:zione)?) account|contatt(?:ac)i|sottoscriv|sottoscrizione|compra|acquist(a|o)|ordin[aeio]|richie(?:di|sta)|(?:conferma|ripeti) password|inizia|nuovo cliente|impostazioni|preferenze|profilo|aggiorna|paga|registrier(ung|en)|profil (anlegen|erstellen)| nachrichten|verteiler|neukunde|neuer (kunde|benutzer|nutzer)|passwort wiederholen|anmeldeseite|nieuwsbrief|aanmaken|profiel|s.inscrire|inscription|s.abonner|créer|préférences|profil|mise à jour|payer|ach(eter|at)| nouvel utilisateur|(confirmer|réessayer) ((mon|ton|votre|le) )?mot de passe|regis(trarse|tro)|regístrate|inscr(ibirse|ipción|íbete)|solicitar|crea(r cuenta)?|nueva cuenta|nuevo (cliente|usuario)|preferencias|perfil|lista de correo|registrer(a|ing)|(nytt|öppna) konto|nyhetsbrev|prenumer(era|ation)|kontakt|skapa|starta|inställningar|min (sida|kundvagn)|uppdatera|till kassan|gäst|köp|beställ|schemalägg|ny kund|(repetera|bekräfta) lösenord/iu
          },
          conservativeSignupRegex: {
            match: /sign.?up|join|register|enroll|(create|new).+account|newsletter|subscri(be|ption)|settings|preferences|profile|update|iscri(viti|zione)|registra(ti|zione)|(?:nuovo|crea(?:zione)?) account|contatt(?:ac)?i|sottoscriv|sottoscrizione|impostazioni|preferenze|aggiorna|anmeld(en|ung)|registrier(en|ung)|neukunde|neuer (kunde|benutzer|nutzer)|registreren|eigenschappen|profiel|bijwerken|s.inscrire|inscription|s.abonner|abonnement|préférences|profil|créer un compte|regis(trarse|tro)|regístrate|inscr(ibirse|ipción|íbete)|crea(r cuenta)?|nueva cuenta|nuevo (cliente|usuario)|preferencias|perfil|lista de correo|registrer(a|ing)|(nytt|öppna) konto|nyhetsbrev|prenumer(era|ation)|kontakt|skapa|starta|inställningar|min (sida|kundvagn)|uppdatera/iu
          },
          resetPasswordLink: {
            match: /(forgot(ten)?|reset|don't remember) (your )?password|password forgotten|password dimenticata|reset(?:ta) password|recuper[ao] password|(vergessen|verloren|verlegt|wiederherstellen) passwort|wachtwoord (vergeten|reset)|(oublié|récupérer) ((mon|ton|votre|le) )?mot de passe|mot de passe (oublié|perdu)|re(iniciar|cuperar) (contraseña|clave)|olvid(ó su|aste tu|é mi) (contraseña|clave)|recordar( su)? (contraseña|clave)|glömt lösenord|återställ lösenord/iu
          },
          loginProvidersRegex: { match: / with | con | mit | met | avec /iu },
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
          "cc-name": /(accountholdername|titulaire)|(cc-?name|card-?name|cardholder-?name|cardholder|(^nom$))|(card.?(?:holder|owner)|name.*(\b)?on(\b)?.*card|(?:card|cc).?name|cc.?full.?name|karteninhaber|nombre.*tarjeta|nom.*carte|nome.*cart|名前|имя.*карты|信用卡开户名|开户名|持卡人姓名|持卡人姓名)/iu,
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
            "cc-name": "cc-?name|card-?name|cardholder-?name|cardholder|(^nom$)",
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
            "cc-name": "card.?(?:holder|owner)|name.*(\\b)?on(\\b)?.*card|(?:card|cc).?name|cc.?full.?name|karteninhaber|nombre.*tarjeta|nom.*carte|nome.*cart|\u540D\u524D|\u0418\u043C\u044F.*\u043A\u0430\u0440\u0442\u044B|\u4FE1\u7528\u5361\u5F00\u6237\u540D|\u5F00\u6237\u540D|\u6301\u5361\u4EBA\u59D3\u540D|\u6301\u5361\u4EBA\u59D3\u540D",
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
    if (!shouldLog())
      return;
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
    if (matchingResult.matched)
      return "Matched";
    if (matchingResult.proceed === false)
      return "Matched forceUnknown";
    if (matchingResult.skip)
      return "Skipped";
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
    if (!shouldLog())
      return;
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
      __privateAdd(this, _config, void 0);
      /** @type {CssSelectorConfiguration['selectors']} */
      __privateAdd(this, _cssSelectors, void 0);
      /** @type {Record<string, DDGMatcher>} */
      __privateAdd(this, _ddgMatchers, void 0);
      /**
       * This acts as an internal cache for the larger vendorRegexes
       * @type {VendorRegexConfiguration['rules']}
       */
      __privateAdd(this, _vendorRegexRules, void 0);
      /** @type {MatcherLists} */
      __privateAdd(this, _matcherLists, void 0);
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
      for (let [listName, matcherNames] of Object.entries(__privateGet(this, _config).matchers.lists)) {
        for (let fieldName of matcherNames) {
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
      for (let matcher of matcherList) {
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
      if (!expectedDimensionBounds)
        return true;
      const width = input.offsetWidth;
      const height = input.offsetHeight;
      const isHidden = height === 0 && width === 0;
      if (isHidden)
        return true;
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
      if (this.subtypeFromMatchers("unknown", input))
        return "unknown";
      if (opts.isCCForm) {
        const subtype = this.subtypeFromMatchers("cc", input);
        if (subtype && isValidCreditCardSubtype(subtype)) {
          return `creditCards.${subtype}`;
        }
      }
      if (input instanceof HTMLInputElement) {
        if (this.subtypeFromMatchers("password", input)) {
          if (["password", "text"].includes(input.type) && input.name !== "email" && // pcsretirement.com, improper use of the for attribute
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
     *   hasCredentials?: boolean,
     *   supportsIdentitiesAutofill?: boolean
     * }} SetInputTypeOpts
     */
    /**
     * Sets the input type as a data attribute to the element and returns it
     * @param {HTMLInputElement} input
     * @param {HTMLElement} formEl
     * @param {SetInputTypeOpts} [opts]
     * @returns {SupportedSubTypes | string}
     */
    setInputType(input, formEl, opts = {}) {
      const type = this.inferInputType(input, formEl, opts);
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
      for (let strategyName of __privateGet(this, _defaultStrategyOrder)) {
        let result;
        for (let matcher of matchers) {
          const lookup = matcher.strategies[strategyName];
          if (!lookup)
            continue;
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
      let matchRexExp = this.getDDGMatcherRegex(lookup);
      if (!matchRexExp) {
        return defaultResult;
      }
      let requiredScore = ["match", "forceUnknown", "maxDigits"].filter((ddgMatcherProp) => ddgMatcherProp in ddgMatcher).length;
      const matchableStrings = ddgMatcher.matchableStrings || ["labelText", "placeholderAttr", "relatedText"];
      for (let stringName of matchableStrings) {
        let elementString = this.activeElementStrings[stringName];
        if (!elementString)
          continue;
        let score = 0;
        const result = {
          ...defaultResult,
          matchedString: elementString,
          matchedFrom: stringName
        };
        if (ddgMatcher.forceUnknown) {
          let notRegex = ddgMatcher.forceUnknown;
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
          let skipRegex = ddgMatcher.skip;
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
      for (let stringName of stringsToMatch) {
        let elementString = this.activeElementStrings[stringName];
        if (!elementString)
          continue;
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
      "vendorRegex": {
        rules: {},
        ruleSets: []
      },
      "ddgMatcher": {
        matchers: {}
      },
      "cssSelector": {
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
    [
      "password",
      "password.new",
      "password.current",
      "username"
    ]
  );
  var supportedVariants = (
    /** @type {const} */
    [
      "new",
      "current"
    ]
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
  var removeExcessWhitespace = (string = "") => {
    string = string?.trim() || "";
    if (!string || string.length > TEXT_LENGTH_CUTOFF + 50)
      return "";
    return string.replace(/\n/g, " ").replace(/\s{2,}/g, " ");
  };
  var getExplicitLabelsText = (el) => {
    const labelTextCandidates = [];
    for (let label of el.labels || []) {
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
    if (!previousEl)
      return null;
    if (EXCLUDED_TAGS.includes(previousEl.tagName)) {
      return recursiveGetPreviousElSibling(previousEl);
    }
    return previousEl;
  };
  var getRelatedText = (el, form, cssSelector) => {
    let scope = getLargestMeaningfulContainer(el, form, cssSelector);
    if (scope === el) {
      let previousEl = recursiveGetPreviousElSibling(el);
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
      trimmedText = getTextShallow(label);
    } else {
      trimmedText = extractElementStrings(scope).join(" ");
    }
    if (trimmedText.length < TEXT_LENGTH_CUTOFF)
      return trimmedText;
    return "";
  };
  var getLargestMeaningfulContainer = (el, form, cssSelector) => {
    const parentElement = el.parentElement;
    if (!parentElement || el === form || !cssSelector)
      return el;
    const inputsInParentsScope = parentElement.querySelectorAll(cssSelector);
    if (inputsInParentsScope.length === 1) {
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

  // node_modules/@duckduckgo/content-scope-scripts/src/apple-utils.js
  function getTopLevelURL() {
    try {
      if (window.location !== window.parent.location) {
        return new URL(window.location.href !== "about:blank" ? document.referrer : window.parent.location.href);
      } else {
        return new URL(window.location.href);
      }
    } catch (error) {
      return new URL(location.href);
    }
  }
  function isUnprotectedDomain(topLevelUrl, featureList) {
    let unprotectedDomain = false;
    const domainParts = topLevelUrl && topLevelUrl.host ? topLevelUrl.host.split(".") : [];
    while (domainParts.length > 1 && !unprotectedDomain) {
      const partialDomain = domainParts.join(".");
      unprotectedDomain = featureList.filter((domain) => domain.domain === partialDomain).length > 0;
      domainParts.shift();
    }
    return unprotectedDomain;
  }
  function processConfig(data, userList, preferences) {
    const topLevelUrl = getTopLevelURL();
    const allowlisted = userList.filter((domain) => domain === topLevelUrl.host).length > 0;
    const enabledFeatures = Object.keys(data.features).filter((featureName) => {
      const feature = data.features[featureName];
      return feature.state === "enabled" && !isUnprotectedDomain(topLevelUrl, feature.exceptions);
    });
    const isBroken = isUnprotectedDomain(topLevelUrl, data.unprotectedTemporary);
    preferences.site = {
      domain: topLevelUrl.hostname,
      isBroken,
      allowlisted,
      enabledFeatures
    };
    preferences.cookie = {};
    return preferences;
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
        if (e.origin !== window.origin)
          return;
        if (!e.data || e.data && !(e.data[expectedResponse] || e.data.type === expectedResponse))
          return;
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
    if (!config?.isAndroid) {
      el.focus();
    }
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
        if (option.selected)
          return false;
        option.selected = true;
        fireEventsOnSelect(el);
        return true;
      }
    }
    for (const option of el.options) {
      if (option.innerText === stringVal || Number(option.innerText) === numberVal) {
        if (option.selected)
          return false;
        option.selected = true;
        fireEventsOnSelect(el);
        return true;
      }
    }
    return false;
  };
  var setValue = (el, val, config) => {
    if (el instanceof HTMLInputElement)
      return setValueForInput(el, val, config);
    if (el instanceof HTMLSelectElement)
      return setValueForSelect(el, val);
    return false;
  };
  var safeExecute = (el, fn, _opts = {}) => {
    const intObs = new IntersectionObserver((changes) => {
      for (const change of changes) {
        if (typeof change.isVisible === "undefined") {
          change.isVisible = true;
        }
        if (change.isIntersecting) {
          fn();
        }
      }
      intObs.disconnect();
    }, { trackVisibility: true, delay: 100 });
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
    el.offsetHeight * el.offsetWidth >= 1e4 && !safeRegexTest(/secondary/i, el.className)) && el.offsetHeight * el.offsetWidth >= 2e3 && // it's not a very small button like inline links and such
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
    if (el instanceof HTMLButtonElement)
      return removeExcessWhitespace(el.textContent);
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
    if (string.length <= totalLength)
      return string;
    const truncated = string.slice(0, totalLength / 2).concat("\u2026", string.slice(totalLength / -2));
    return truncated;
  }
  function isFormLikelyToBeUsedAsPageWrapper(form) {
    if (form.parentElement !== document.body)
      return false;
    const formChildren = form.querySelectorAll("*").length;
    if (formChildren < 100)
      return false;
    const bodyChildren = document.body.querySelectorAll("*").length;
    const formChildrenPercentage = formChildren * 100 / bodyChildren;
    return formChildrenPercentage > 50;
  }
  function safeRegexTest(regex, string) {
    if (!string || !regex || string.length > constants.TEXT_LENGTH_CUTOFF)
      return false;
    return regex.test(string);
  }
  function pierceShadowTree(event, wantedTargetType) {
    const { target } = event;
    if (!(target instanceof Element) || !target?.shadowRoot || !event.composedPath)
      return target;
    const clickStack = event.composedPath();
    if (!wantedTargetType) {
      return clickStack[0];
    }
    return clickStack.find((el) => el instanceof wantedTargetType) || target;
  }
  function getActiveElement(root = document) {
    const activeElement = root.activeElement;
    if (!(activeElement instanceof Element) || !activeElement.shadowRoot)
      return activeElement;
    const innerActiveElement = activeElement.shadowRoot.activeElement;
    if (innerActiveElement?.shadowRoot) {
      return getActiveElement(innerActiveElement.shadowRoot);
    }
    return innerActiveElement;
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
    "Cura\xE7ao": "CW",
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
    "R\xE9union": "RE",
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
    if (input.maxLength === 4 || checkPlaceholderAndLabels(input, FOUR_DIGIT_YEAR_REGEX, form.form, selector))
      return year;
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
    if (!addressCountryCode)
      return "";
    const elLocale = inferElementLocale(el);
    const localisedCountryName = getCountryDisplayName(elLocale, addressCountryCode);
    if (el.nodeName === "SELECT") {
      const englishCountryName = getCountryDisplayName("en", addressCountryCode);
      const countryNameRegex = new RegExp(String.raw`${localisedCountryName.replace(/ /g, ".?")}|${englishCountryName.replace(/ /g, ".?")}`, "i");
      const countryCodeRegex = new RegExp(String.raw`\b${addressCountryCode}\b`, "i");
      if (el instanceof HTMLSelectElement) {
        for (const option of el.options) {
          if (countryCodeRegex.test(option.value)) {
            return option.value;
          }
        }
        for (const option of el.options) {
          if (countryNameRegex.test(option.value) || countryNameRegex.test(option.innerText))
            return option.value;
        }
      }
    }
    return localisedCountryName;
  };
  var getLocalisedCountryNamesToCodes = (el) => {
    if (typeof Intl.DisplayNames !== "function")
      return COUNTRY_NAMES_TO_CODES;
    const elLocale = inferElementLocale(el);
    return Object.fromEntries(
      Object.entries(COUNTRY_CODES_TO_NAMES).map(([code]) => [getCountryDisplayName(elLocale, code), code])
    );
  };
  var inferCountryCodeFromElement = (el) => {
    if (COUNTRY_CODES_TO_NAMES[el.value])
      return el.value;
    if (COUNTRY_NAMES_TO_CODES[el.value])
      return COUNTRY_NAMES_TO_CODES[el.value];
    const localisedCountryNamesToCodes = getLocalisedCountryNamesToCodes(el);
    if (localisedCountryNamesToCodes[el.value])
      return localisedCountryNamesToCodes[el.value];
    if (el instanceof HTMLSelectElement) {
      const selectedText = el.selectedOptions[0]?.text;
      if (COUNTRY_CODES_TO_NAMES[selectedText])
        return selectedText;
      if (COUNTRY_NAMES_TO_CODES[selectedText])
        return localisedCountryNamesToCodes[selectedText];
      if (localisedCountryNamesToCodes[selectedText])
        return localisedCountryNamesToCodes[selectedText];
    }
    return "";
  };
  var getMMAndYYYYFromString = (expiration) => {
    const values = expiration.match(/(\d+)/g) || [];
    return values?.reduce((output, current) => {
      if (Number(current) > 12) {
        output.expirationYear = current.padStart(4, "20");
      } else {
        output.expirationMonth = current.padStart(2, "0");
      }
      return output;
    }, { expirationYear: "", expirationMonth: "" });
  };
  var shouldStoreCredentials = ({ credentials }) => Boolean(credentials.password);
  var shouldStoreIdentities = ({ identities }) => Boolean(
    (identities.firstName || identities.fullName) && identities.addressStreet && identities.addressCity
  );
  var shouldStoreCreditCards = ({ creditCards }) => {
    if (!creditCards.cardNumber)
      return false;
    if (creditCards.cardSecurityCode)
      return true;
    if (creditCards.expiration)
      return true;
    return Boolean(creditCards.expirationYear && creditCards.expirationMonth);
  };
  var formatPhoneNumber = (phone) => phone.replaceAll(/[^0-9|+]/g, "");
  var prepareFormValuesForStorage = (formValues) => {
    let { credentials, identities, creditCards } = formValues;
    if (!creditCards.cardName && (identities?.fullName || identities?.firstName)) {
      creditCards.cardName = identities?.fullName || formatFullName(identities);
    }
    if (shouldStoreCredentials(formValues)) {
      if (credentials.password && !credentials.username && identities.emailAddress) {
        credentials.username = identities.emailAddress;
      }
    } else {
      credentials = void 0;
    }
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
      __privateAdd(this, _data, void 0);
      __publicField(this, "id", () => String(__privateGet(this, _data).id));
      __publicField(this, "labelMedium", (_subtype) => {
        if (__privateGet(this, _data).username) {
          return __privateGet(this, _data).username;
        }
        if (__privateGet(this, _data).origin?.url) {
          return `Password for ${truncateFromMiddle(__privateGet(this, _data).origin.url)}`;
        }
        return "";
      });
      __publicField(this, "labelSmall", (_subtype) => {
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
      __privateAdd(this, _data2, void 0);
      __publicField(this, "id", () => String(__privateGet(this, _data2).id));
      __publicField(this, "label", (_subtype) => __privateGet(this, _data2).password);
      __publicField(this, "labelMedium", (_subtype) => "Generated password");
      __publicField(this, "labelSmall", (_subtype) => "Password will be saved for this website");
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
      __privateAdd(this, _data3, void 0);
      __publicField(this, "id", () => String(__privateGet(this, _data3).id));
      __publicField(this, "labelMedium", (_subtype) => "Bitwarden is locked");
      __publicField(this, "labelSmall", (_subtype) => "Unlock your vault to access credentials or generate passwords");
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
    if (!autogenerated)
      return data;
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
    for (let character of customCharacterClass.characters) {
      bitSet[_bitSetIndexForCharacter(character)] = true;
    }
  }
  function _canonicalizedPropertyValues(propertyValues, keepCustomCharacterClassFormatCompliant) {
    let asciiPrintableBitSet = new Array("~".codePointAt(0) - " ".codePointAt(0) + 1);
    for (let propertyValue of propertyValues) {
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
      let temp2 = [];
      for (let i = _bitSetIndexForCharacter(start); i <= _bitSetIndexForCharacter(end); ++i) {
        if (asciiPrintableBitSet[i]) {
          temp2.push(_characterAtBitSetIndex(i));
        }
      }
      let result2 = temp2.length === _bitSetIndexForCharacter(end) - _bitSetIndexForCharacter(start) + 1;
      if (!result2) {
        charactersSeen = charactersSeen.concat(temp2);
      }
      return result2;
    }
    let hasAllUpper = checkRange("A", "Z");
    let hasAllLower = checkRange("a", "z");
    let hasAllDigits = checkRange("0", "9");
    let hasAllSpecial = false;
    let hasDash = false;
    let hasRightSquareBracket = false;
    let temp = [];
    for (let i = _bitSetIndexForCharacter(" "); i <= _bitSetIndexForCharacter("/"); ++i) {
      if (!asciiPrintableBitSet[i]) {
        continue;
      }
      let character = _characterAtBitSetIndex(i);
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
      let character = _characterAtBitSetIndex(i);
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
    let numberOfSpecialCharacters = _bitSetIndexForCharacter("/") - _bitSetIndexForCharacter(" ") + 1 + (_bitSetIndexForCharacter("@") - _bitSetIndexForCharacter(":") + 1) + (_bitSetIndexForCharacter("`") - _bitSetIndexForCharacter("[") + 1) + (_bitSetIndexForCharacter("~") - _bitSetIndexForCharacter("{") + 1);
    hasAllSpecial = temp.length === numberOfSpecialCharacters;
    if (!hasAllSpecial) {
      charactersSeen = charactersSeen.concat(temp);
    }
    let result = [];
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
    let length = input.length;
    while (position < length && _isASCIIWhitespace(input[position])) {
      ++position;
    }
    return position;
  }
  function _parseIdentifier(input, position) {
    console.assert(position >= 0);
    console.assert(position < input.length);
    console.assert(_isIdentifierCharacter(input[position]));
    let length = input.length;
    let seenIdentifiers = [];
    do {
      let c = input[position];
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
    let length = input.length;
    ++position;
    if (position >= length) {
      return [null, position];
    }
    let initialPosition = position;
    let result = [];
    do {
      let c = input[position];
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
    let length = input.length;
    let propertyValues = [];
    while (true) {
      if (_isIdentifierCharacter(input[position])) {
        let identifierStartPosition = position;
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
    let length = input.length;
    var mayBeIdentifierStartPosition = position;
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
    let property = { name: identifier, value: null };
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
    let length = input.length;
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
    let parsedProperties = [];
    let length = input.length;
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
    let [passwordRules, maybeMessage] = _parsePasswordRulesInternal(input);
    if (!passwordRules) {
      throw new ParserError(maybeMessage);
    }
    if (passwordRules.length === 0) {
      throw new ParserError("No valid rules were provided");
    }
    let suppressCopyingRequiredToAllowed = formatRulesForMinifiedVersion;
    let requiredRules = [];
    let newAllowedValues = [];
    let minimumMaximumConsecutiveCharacters = null;
    let maximumMinLength = 0;
    let minimumMaxLength = null;
    for (let rule of passwordRules) {
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
    let sortedRequiredRules = requiredRules.sort(function(a, b) {
      const namedCharacterClassOrder = [Identifier.LOWER, Identifier.UPPER, Identifier.DIGIT, Identifier.SPECIAL, Identifier.ASCII_PRINTABLE, Identifier.UNICODE];
      let aIsJustOneNamedCharacterClass = a.value.length === 1 && a.value[0] instanceof NamedCharacterClass;
      let bIsJustOneNamedCharacterClass = b.value.length === 1 && b.value[0] instanceof NamedCharacterClass;
      if (aIsJustOneNamedCharacterClass && !bIsJustOneNamedCharacterClass) {
        return -1;
      }
      if (!aIsJustOneNamedCharacterClass && bIsJustOneNamedCharacterClass) {
        return 1;
      }
      if (aIsJustOneNamedCharacterClass && bIsJustOneNamedCharacterClass) {
        let aIndex = namedCharacterClassOrder.indexOf(a.value[0].name);
        let bIndex = namedCharacterClassOrder.indexOf(b.value[0].name);
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
  var Password = class {
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
      return new Password(options).parse(inputString).generate();
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
      return new Password(options).parse(Password.defaults.defaultPasswordRules).generate();
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
      if (!requirements)
        throw new Error("could not generate requirements for " + JSON.stringify(inputString));
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
          if (password === "")
            throw new Error("unreachable");
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
      for (let rule of passwordRules) {
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
          return this.options.SCAN_SET_ORDER.substring(this.options.SCAN_SET_ORDER.indexOf("0"), this.options.SCAN_SET_ORDER.indexOf("9") + 1).split("");
        case Identifier.LOWER:
          return this.options.SCAN_SET_ORDER.substring(this.options.SCAN_SET_ORDER.indexOf("a"), this.options.SCAN_SET_ORDER.indexOf("z") + 1).split("");
        case Identifier.SPECIAL:
          return this.options.SCAN_SET_ORDER.substring(this.options.SCAN_SET_ORDER.indexOf("-"), this.options.SCAN_SET_ORDER.indexOf("]") + 1).split("");
        case Identifier.UPPER:
          return this.options.SCAN_SET_ORDER.substring(this.options.SCAN_SET_ORDER.indexOf("A"), this.options.SCAN_SET_ORDER.indexOf("Z") + 1).split("");
      }
      console.assert(false, SHOULD_NOT_BE_REACHED);
      return [];
    }
    /**
     * @param {(parser.CustomCharacterClass | parser.NamedCharacterClass)[]} characterClasses
     */
    _charactersFromCharactersClasses(characterClasses) {
      const output = [];
      for (let characterClass of characterClasses) {
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
      let shadowCharacters = Array.prototype.slice.call(characters);
      shadowCharacters.sort((a, b) => this.options.SCAN_SET_ORDER.indexOf(a) - this.options.SCAN_SET_ORDER.indexOf(b));
      let uniqueCharacters = [shadowCharacters[0]];
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
    "admiral.com": {
      "password-rules": "minlength: 8; required: digit; required: [- !\"#$&'()*+,.:;<=>?@[^_`{|}~]]; allowed: lower, upper;"
    },
    "ae.com": {
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
    "anatel.gov.br": {
      "password-rules": "minlength: 6; maxlength: 15; allowed: lower, upper, digit;"
    },
    "ancestry.com": {
      "password-rules": "minlength: 8; required: lower, upper; required: digit;"
    },
    "angieslist.com": {
      "password-rules": "minlength: 6; maxlength: 15;"
    },
    "anthem.com": {
      "password-rules": "minlength: 8; maxlength: 20; max-consecutive: 3; required: lower, upper; required: digit; allowed: [!$*?@|];"
    },
    "app.digio.in": {
      "password-rules": "minlength: 8; maxlength: 15;"
    },
    "app.parkmobile.io": {
      "password-rules": "minlength: 8; maxlength: 25; required: lower; required: upper; required: digit; required: [!@#$%^&];"
    },
    "apple.com": {
      "password-rules": "minlength: 8; maxlength: 63; required: lower; required: upper; required: digit; allowed: ascii-printable;"
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
    "brighthorizons.com": {
      "password-rules": "minlength: 8; maxlength: 16;"
    },
    "callofduty.com": {
      "password-rules": "minlength: 8; maxlength: 20; max-consecutive: 2; required: lower, upper; required: digit;"
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
    "cb2.com": {
      "password-rules": "minlength: 7; maxlength: 18; required: lower, upper; required: digit;"
    },
    "ccs-grp.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: digit; required: upper,lower; allowed: [-!#$%&'+./=?\\^_`{|}~];"
    },
    "cecredentialtrust.com": {
      "password-rules": "minlength: 12; required: lower; required: upper; required: digit; required: [!#$%&*@^];"
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
      "password-rules": "minlength: 8; maxlength: 14; required: upper; required: digit, allowed: lower;"
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
      "password-rules": "minlength: 8; maxlength: 20; required: lower, upper; allowed: digit, [-!#$%&'()*+/:;=?@[^_`{|}~]];"
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
    "cvs.com": {
      "password-rules": "minlength: 8; maxlength: 25; required: lower, upper; required: digit; allowed: [!@#$%^&*()];"
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
    "dowjones.com": {
      "password-rules": "maxlength: 15;"
    },
    "ea.com": {
      "password-rules": "minlength: 8; maxlength: 16; required: lower; required: upper; required: digit; allowed: special;"
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
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit, special;"
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
    "jordancu-onlinebanking.org": {
      "password-rules": "minlength: 6; maxlength: 32; allowed: upper, lower, digit,[-!\"#$%&'()*+,.:;<=>?@[^_`{|}~]];"
    },
    "keldoc.com": {
      "password-rules": "minlength: 12; required: lower; required: upper; required: digit; required: [!@#$%^&*];"
    },
    "key.harvard.edu": {
      "password-rules": "minlength: 10; maxlength: 100; required: lower; required: upper; required: digit; allowed: [-@_#!&$`%*+()./,;~:{}|?>=<^[']];"
    },
    "kfc.ca": {
      "password-rules": "minlength: 6; maxlength: 15; required: lower; required: upper; required: digit; required: [!@#$%&?*];"
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
    "propelfuels.com": {
      "password-rules": "minlength: 6; maxlength: 16;"
    },
    "qdosstatusreview.com": {
      "password-rules": "minlength: 8; required: lower; required: upper; required: digit; required: [!#$%&@^];"
    },
    "questdiagnostics.com": {
      "password-rules": "minlength: 8; maxlength: 30; required: upper, lower; required: digit, [!#$%&()*+<>?@^_~];"
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
    "salslimo.com": {
      "password-rules": "minlength: 8; maxlength: 50; required: upper; required: lower; required: digit; required: [!@#$&*];"
    },
    "santahelenasaude.com.br": {
      "password-rules": "minlength: 8; maxlength: 15; required: lower; required: upper; required: digit; required: [-!@#$%&*_+=<>];"
    },
    "santander.de": {
      "password-rules": "minlength: 8; maxlength: 12; required: lower, upper; required: digit; allowed: [-!#$%&'()*,.:;=?^{}];"
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
    "store.nintendo.co.uk": {
      "password-rules": "minlength: 8; maxlength: 20;"
    },
    "store.nvidia.com": {
      "password-rules": "minlength: 8; maxlength: 32; required: lower; required: upper; required: digit; required: [-!@#$%^*~:;&><[{}|_+=?]];"
    },
    "store.steampowered.com": {
      "password-rules": "minlength: 6; required: lower; required: upper; required: digit; allowed: [~!@#$%^&*];"
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
    "tix.soundrink.com": {
      "password-rules": "minlength: 6; maxlength: 16;"
    },
    "training.confluent.io": {
      "password-rules": "minlength: 6; maxlength: 16; required: lower; required: upper; required: digit; allowed: [!#$%*@^_~];"
    },
    "treasurer.mo.gov": {
      "password-rules": "minlength: 8; maxlength: 26; required: lower; required: upper; required: digit; required: [!#$&];"
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
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {Matching} [matching]
     */
    constructor(form, input, matching) {
      /** @type HTMLElement */
      __publicField(this, "form");
      /** @type Matching */
      __publicField(this, "matching");
      /** @type {undefined|boolean} */
      __publicField(this, "_isCCForm");
      this.form = form;
      this.matching = matching || new Matching(matchingConfiguration);
      this.autofillSignal = 0;
      this.hybridSignal = 0;
      this.signals = [];
      this.evaluateElAttributes(input, 1, true);
      form ? this.evaluateForm() : this.evaluatePage();
      return this;
    }
    /**
     * Hybrid forms can be used for both login and signup
     * @returns {boolean}
     */
    get isHybrid() {
      const areOtherSignalsWeak = Math.abs(this.autofillSignal) < 10;
      return this.hybridSignal > 0 && areOtherSignalsWeak;
    }
    get isLogin() {
      if (this.isHybrid)
        return false;
      return this.autofillSignal < 0;
    }
    get isSignup() {
      if (this.isHybrid)
        return false;
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
      if (!string || string.length > constants.TEXT_LENGTH_CUTOFF)
        return this;
      const matchesLogin = safeRegexTest(/current.?password/i, string) || safeRegexTest(this.matching.getDDGMatcherRegex("loginRegex"), string) || safeRegexTest(this.matching.getDDGMatcherRegex("resetPasswordLink"), string);
      if (shouldCheckUnifiedForm && matchesLogin && safeRegexTest(this.matching.getDDGMatcherRegex("conservativeSignupRegex"), string)) {
        this.increaseHybridSignal(strength, signalType);
        return this;
      }
      const signupRegexToUse = this.matching.getDDGMatcherRegex(shouldBeConservative ? "conservativeSignupRegex" : "signupRegex");
      const matchesSignup = safeRegexTest(/new.?password/i, string) || safeRegexTest(signupRegexToUse, string);
      if (shouldFlip) {
        if (matchesLogin)
          this.increaseSignalBy(strength, signalType);
        if (matchesSignup)
          this.decreaseSignalBy(strength, signalType);
      } else {
        if (matchesLogin)
          this.decreaseSignalBy(strength, signalType);
        if (matchesSignup)
          this.increaseSignalBy(strength, signalType);
      }
      return this;
    }
    evaluateElAttributes(el, signalStrength = 3, isInput = false) {
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name === "style")
          return;
        const attributeString = `${attr.name}=${attr.value}`;
        this.updateSignal({
          string: attributeString,
          strength: signalStrength,
          signalType: `${el.name} attr: ${attributeString}`,
          shouldCheckUnifiedForm: isInput
        });
      });
    }
    evaluateUrl() {
      const path = window.location.pathname;
      const matchesLogin = safeRegexTest(this.matching.getDDGMatcherRegex("loginRegex"), path);
      const matchesSignup = safeRegexTest(this.matching.getDDGMatcherRegex("conservativeSignupRegex"), path);
      if (matchesLogin && matchesSignup)
        return;
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
          this.form.querySelectorAll("input[type=submit], button[type=submit]").forEach(
            (submit) => {
              if (el.type !== "submit" && el !== submit) {
                likelyASubmit = false;
              }
            }
          );
        } else {
          const thereIsASubmitButton = Boolean(this.form.querySelector("input[type=submit], button[type=submit]"));
          const isSocialButton = /facebook|twitter|google|apple/i.test(string);
          shouldFlip = thereIsASubmitButton && !isSocialButton;
        }
        const strength = likelyASubmit ? 20 : 4;
        this.updateSignal({ string, strength, signalType: `button: ${string}`, shouldFlip });
        return;
      }
      if (el instanceof HTMLAnchorElement && el.href && el.getAttribute("href") !== "#" || (el.getAttribute("role") || "").toUpperCase() === "LINK" || el.matches("button[class*=secondary]")) {
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
        this.updateSignal({ string, strength: 1, signalType: `generic: ${string}`, shouldCheckUnifiedForm: true });
      }
    }
    evaluateForm() {
      this.evaluateUrl();
      this.evaluatePageTitle();
      this.evaluateElAttributes(this.form);
      this.form.querySelectorAll(this.matching.cssSelector("safeUniversalSelector")).forEach((el) => {
        const displayValue = window.getComputedStyle(el, null).getPropertyValue("display");
        if (displayValue !== "none")
          this.evaluateElement(el);
      });
      const relevantFields = this.form.querySelectorAll(this.matching.cssSelector("genericTextField"));
      if (relevantFields.length >= 4) {
        this.increaseSignalBy(relevantFields.length * 1.5, "many fields: it is probably not a login");
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
      if (this._isCCForm !== void 0)
        return this._isCCForm;
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
      const textMatches = formEl.textContent?.match(/(credit|payment).?card(.?number)?|ccv|security.?code|cvv|cvc|csc/ig);
      const deDupedMatches = new Set(textMatches?.map((match) => match.toLowerCase()));
      this._isCCForm = Boolean(textMatches && deDupedMatches.size > 1);
      return this._isCCForm;
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
  var ddgPasswordIconBase = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS4zMzQgNi42NjdhMiAyIDAgMSAwIDAgNCAyIDIgMCAwIDAgMC00Wm0tLjY2NyAyYS42NjcuNjY3IDAgMSAxIDEuMzMzIDAgLjY2Ny42NjcgMCAwIDEtMS4zMzMgMFoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQuNjY3IDRhNS4zMzMgNS4zMzMgMCAwIDAtNS4xODggNi41NzhsLTUuMjg0IDUuMjg0YS42NjcuNjY3IDAgMCAwLS4xOTUuNDcxdjNjMCAuMzY5LjI5OC42NjcuNjY3LjY2N2gyLjY2NmMuNzM3IDAgMS4zMzQtLjU5NyAxLjMzNC0xLjMzM1YxOGguNjY2Yy43MzcgMCAxLjMzNC0uNTk3IDEuMzM0LTEuMzMzdi0xLjMzNEgxMmMuMTc3IDAgLjM0Ni0uMDcuNDcxLS4xOTVsLjY4OC0uNjg4QTUuMzMzIDUuMzMzIDAgMSAwIDE0LjY2NyA0Wm0tNCA1LjMzM2E0IDQgMCAxIDEgMi41NTUgMy43MzIuNjY3LjY2NyAwIDAgMC0uNzEzLjE1bC0uNzg1Ljc4NUgxMGEuNjY3LjY2NyAwIDAgMC0uNjY3LjY2N3YySDhhLjY2Ny42NjcgMCAwIDAtLjY2Ny42NjZ2MS4zMzRoLTJ2LTIuMDU4bDUuMzY1LTUuMzY0YS42NjcuNjY3IDAgMCAwIC4xNjMtLjY3NyAzLjk5NiAzLjk5NiAwIDAgMS0uMTk0LTEuMjM1WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPgo=";
  var ddgPasswordIconFilled = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBmaWxsPSIjNzY0MzEwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS4yNSA2Ljc1YTIgMiAwIDEgMCAwIDQgMiAyIDAgMCAwIDAtNFptLS41IDJhLjUuNSAwIDEgMSAxIDAgLjUuNSAwIDAgMS0xIDBaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICAgIDxwYXRoIGZpbGw9IiM3NjQzMTAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE0LjYyNSA0YTUuMzc1IDUuMzc1IDAgMCAwLTUuMjQ0IDYuNTU5bC01LjE2MSA1LjE2YS43NS43NSAwIDAgMC0uMjIuNTMxdjNjMCAuNDE0LjMzNi43NS43NS43NWgyLjk5N2MuNTU0IDAgMS4wMDMtLjQ1IDEuMDAzLTEuMDAzVjE4aC45OTdjLjU1NCAwIDEuMDAzLS40NSAxLjAwMy0xLjAwM1YxNS41SDEyYS43NS43NSAwIDAgMCAuNTMtLjIybC43MS0uNzFBNS4zOCA1LjM4IDAgMCAwIDIwIDkuMzc1IDUuMzc1IDUuMzc1IDAgMCAwIDE0LjYyNSA0Wk0xMC43NSA5LjM3NWEzLjg3NSAzLjg3NSAwIDEgMSAyLjU0IDMuNjQuNzUuNzUgMCAwIDAtLjc4OS4xNzNMMTEuNjkgMTRIMTBhLjc1Ljc1IDAgMCAwLS43NS43NXYxLjc1SDhhLjc1Ljc1IDAgMCAwLS43NS43NXYxLjI1SDUuNXYtMS45NGw1LjI0OC01LjI0OGEuNzUuNzUgMCAwIDAgLjE4NC0uNzU4IDMuODcyIDMuODcyIDAgMCAxLS4xODItMS4xNzlaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg==";
  var ddgPasswordGenIconBase = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBmaWxsPSIjMDAwIiBkPSJNOC4wNDcgNC42MjVDNy45MzcgNC4xMjUgNy44NjIgNCA3LjUgNGMtLjM2MiAwLS40MzguMTI1LS41NDcuNjI1LS4wNjguMzEtLjE3NyAxLjMzOC0uMjUxIDIuMDc3LS43MzguMDc0LTEuNzY3LjE4My0yLjA3Ny4yNTEtLjUuMTEtLjYyNS4xODQtLjYyNS41NDcgMCAuMzYyLjEyNS40MzcuNjI1LjU0Ny4zMS4wNjcgMS4zMzYuMTc3IDIuMDc0LjI1LjA3My43NjcuMTg1IDEuODQyLjI1NCAyLjA3OC4xMS4zNzUuMTg1LjYyNS41NDcuNjI1LjM2MiAwIC40MzgtLjEyNS41NDctLjYyNS4wNjgtLjMxLjE3Ny0xLjMzNi4yNS0yLjA3NC43NjctLjA3MyAxLjg0Mi0uMTg1IDIuMDc4LS4yNTQuMzc1LS4xMS42MjUtLjE4NS42MjUtLjU0NyAwLS4zNjMtLjEyNS0uNDM4LS42MjUtLjU0Ny0uMzEtLjA2OC0xLjMzOS0uMTc3LTIuMDc3LS4yNTEtLjA3NC0uNzM5LS4xODMtMS43NjctLjI1MS0yLjA3N1oiLz4KICAgIDxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0xNC42ODEgNS4xOTljLS43NjYgMC0xLjQ4Mi4yMS0yLjA5My41NzhhLjYzNi42MzYgMCAwIDEtLjY1NS0xLjA5IDUuMzQgNS4zNCAwIDEgMSAxLjMwMiA5LjcyMmwtLjc3NS43NzZhLjYzNi42MzYgMCAwIDEtLjQ1LjE4NmgtMS4zOTh2MS42NWMwIC40OTMtLjQuODkzLS44OTMuODkzSDguNTc4djEuMTQxYzAgLjQ5NC0uNC44OTMtLjg5NC44OTNINC42MzZBLjYzNi42MzYgMCAwIDEgNCAxOS4zMTNWMTYuMjZjMC0uMTY5LjA2Ny0uMzMuMTg2LS40NWw1LjU2Mi01LjU2MmEuNjM2LjYzNiAwIDEgMSAuOS45bC01LjM3NiA1LjM3NXYyLjE1M2gyLjAzNHYtMS4zOTljMC0uMzUuMjg1LS42MzYuNjM2LS42MzZIOS4zNHYtMS45MDdjMC0uMzUxLjI4NC0uNjM2LjYzNS0uNjM2aDEuNzcxbC44NjQtLjg2M2EuNjM2LjYzNiAwIDAgMSAuNjY4LS4xNDcgNC4wNjkgNC4wNjkgMCAxIDAgMS40MDItNy44OVoiLz4KICAgIDxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjYyNSA4LjQ5OWExLjg3NSAxLjg3NSAwIDEgMSAzLjc1IDAgMS44NzUgMS44NzUgMCAwIDEtMy43NSAwWm0xLjg3NS0uNjI1YS42MjUuNjI1IDAgMSAwIDAgMS4yNS42MjUuNjI1IDAgMCAwIDAtMS4yNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTQuNjI1IDEyLjEyNWEuNjI1LjYyNSAwIDEgMCAwLTEuMjUuNjI1LjYyNSAwIDAgMCAwIDEuMjVaIi8+Cjwvc3ZnPgo=";
  var ddgPasswordGenIconFilled = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBmaWxsPSIjNzY0MzEwIiBkPSJNOC4wNDcgNC42MjVDNy45MzcgNC4xMjUgNy44NjIgNCA3LjUgNGMtLjM2MiAwLS40MzguMTI1LS41NDcuNjI1LS4wNjguMzEtLjE3NyAxLjMzOS0uMjUxIDIuMDc3LS43MzguMDc0LTEuNzY3LjE4My0yLjA3Ny4yNTEtLjUuMTEtLjYyNS4xODUtLjYyNS41NDcgMCAuMzYyLjEyNS40MzcuNjI1LjU0Ny4zMS4wNjcgMS4zMzYuMTc3IDIuMDc0LjI1LjA3My43NjcuMTg1IDEuODQyLjI1NCAyLjA3OC4xMS4zNzUuMTg1LjYyNS41NDcuNjI1LjM2MiAwIC40MzgtLjEyNS41NDctLjYyNS4wNjgtLjMxLjE3Ny0xLjMzNi4yNS0yLjA3NC43NjctLjA3MyAxLjg0Mi0uMTg1IDIuMDc4LS4yNTQuMzc1LS4xMS42MjUtLjE4NS42MjUtLjU0NyAwLS4zNjItLjEyNS0uNDM4LS42MjUtLjU0Ny0uMzEtLjA2OC0xLjMzOS0uMTc3LTIuMDc3LS4yNTEtLjA3NC0uNzM4LS4xODMtMS43NjctLjI1MS0yLjA3N1oiLz4KICAgIDxwYXRoIGZpbGw9IiM3NjQzMTAiIGQ9Ik0xNC42ODEgNS4xOTljLS43NjYgMC0xLjQ4Mi4yMTEtMi4wOTMuNTc4YS42MzYuNjM2IDAgMCAxLS42NTUtMS4wOSA1LjM0IDUuMzQgMCAxIDEgMS4zMDIgOS43MjNsLS43NzUuNzc1YS42MzYuNjM2IDAgMCAxLS40NS4xODZoLTEuMzk4djEuNjVjMCAuNDkzLS40Ljg5My0uODkzLjg5M0g4LjU3OHYxLjE0MWMwIC40OTQtLjQuODk0LS44OTQuODk0SDQuNjM2QS42MzYuNjM2IDAgMCAxIDQgMTkuMzEzVjE2LjI2YS42NC42NCAwIDAgMSAuMTg2LS40NWw1LjU2Mi01LjU2MmEuNjM2LjYzNiAwIDEgMSAuOS45bC01LjM3NiA1LjM3NXYyLjE1M2gyLjAzNHYtMS4zOTljMC0uMzUuMjg1LS42MzYuNjM2LS42MzZIOS4zNHYtMS45MDdjMC0uMzUuMjg0LS42MzYuNjM1LS42MzZoMS43NzFsLjg2NC0uODYzYS42MzYuNjM2IDAgMCAxIC42NjgtLjE0NyA0LjA2OSA0LjA2OSAwIDEgMCAxLjQwMi03Ljg5WiIvPgogICAgPHBhdGggZmlsbD0iIzc2NDMxMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTMuNjI1IDguNWExLjg3NSAxLjg3NSAwIDEgMSAzLjc1IDAgMS44NzUgMS44NzUgMCAwIDEtMy43NSAwWm0xLjg3NS0uNjI2YS42MjUuNjI1IDAgMSAwIDAgMS4yNS42MjUuNjI1IDAgMCAwIDAtMS4yNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggZmlsbD0iIzc2NDMxMCIgZD0iTTQuNjI1IDEyLjEyNWEuNjI1LjYyNSAwIDEgMCAwLTEuMjUuNjI1LjYyNSAwIDAgMCAwIDEuMjVaIi8+Cjwvc3ZnPgo=";

  // src/InputTypes/CreditCard.js
  var _data4;
  var CreditCardTooltipItem = class {
    /** @param {CreditCardObject} data */
    constructor(data) {
      /** @type {CreditCardObject} */
      __privateAdd(this, _data4, void 0);
      __publicField(this, "id", () => String(__privateGet(this, _data4).id));
      __publicField(this, "labelMedium", (_) => __privateGet(this, _data4).title);
      __publicField(this, "labelSmall", (_) => __privateGet(this, _data4).displayNumber);
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
      __privateAdd(this, _data5, void 0);
      __publicField(this, "id", () => String(__privateGet(this, _data5).id));
      __publicField(this, "labelMedium", (subtype) => {
        if (subtype === "addressCountryCode") {
          return getCountryDisplayName("en", __privateGet(this, _data5).addressCountryCode || "");
        }
        if (__privateGet(this, _data5).id === "privateAddress") {
          return "Generate Private Duck Address";
        }
        return __privateGet(this, _data5)[subtype];
      });
      __publicField(this, "labelSmall", (_) => {
        return __privateGet(this, _data5).title;
      });
      __privateSet(this, _data5, data);
    }
    label(subtype) {
      if (__privateGet(this, _data5).id === "privateAddress") {
        return __privateGet(this, _data5)[subtype];
      }
      return null;
    }
  };
  _data5 = new WeakMap();

  // src/Form/inputTypeConfig.js
  var getIdentitiesIcon = (input, { device }) => {
    if (!canBeInteractedWith(input))
      return "";
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
    if (!canBeInteractedWith(input))
      return "";
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
    if (!canBeInteractedWith(input))
      return false;
    const mainType = getInputMainType(input);
    const subtype = getInputSubtype(input);
    await device.settings.populateDataIfNeeded({ mainType, subtype });
    const canAutofill = device.settings.canAutofillType({ mainType, subtype }, device.inContextSignup);
    return Boolean(canAutofill);
  };
  var inputTypeConfig = {
    /** @type {CredentialsInputTypeConfig} */
    credentials: {
      type: "credentials",
      displayName: "passwords",
      getIconBase: (input, { device }) => {
        if (!canBeInteractedWith(input))
          return "";
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
      shouldDecorate: async (input, { isLogin, isHybrid, device }) => {
        const subtype = getInputSubtype(input);
        const variant = getInputVariant(input);
        if (device.settings.featureToggles.password_generation) {
          if (subtype === "password" && variant === "new") {
            return canBeInteractedWith(input);
          }
        }
        if (isLogin || isHybrid || variant === "current") {
          return canBeAutofilled(input, device);
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
    "background-size": `auto ${input.offsetHeight <= 30 && input.offsetHeight > 0 ? "100%" : "24px"}`,
    "background-position": "center right",
    "background-repeat": "no-repeat",
    "background-origin": "content-box",
    "background-image": `url(${icon})`,
    "transition": "background 0s"
  });
  var getIconStylesBase = (input, form) => {
    const icon = getIcon(input, form);
    if (!icon)
      return {};
    return getBasicStyles(input, icon);
  };
  var getIconStylesAlternate = (input, form) => {
    const icon = getIcon(input, form, "alternate");
    if (!icon)
      return {};
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
      "color": "#333333"
    };
  };

  // src/Form/Form.js
  var {
    ATTR_AUTOFILL,
    ATTR_INPUT_TYPE: ATTR_INPUT_TYPE2,
    MAX_INPUTS_PER_FORM,
    MAX_FORM_RESCANS
  } = constants;
  var Form = class {
    /**
     * @param {HTMLElement} form
     * @param {HTMLInputElement|HTMLSelectElement} input
     * @param {import("../DeviceInterface/InterfacePrototype").default} deviceInterface
     * @param {import("../Form/matching").Matching} [matching]
     * @param {Boolean} [shouldAutoprompt]
     */
    constructor(form, input, deviceInterface, matching, shouldAutoprompt = false) {
      /** @type {import("../Form/matching").Matching} */
      __publicField(this, "matching");
      /** @type {HTMLElement} */
      __publicField(this, "form");
      /** @type {HTMLInputElement | null} */
      __publicField(this, "activeInput");
      this.form = form;
      this.matching = matching || createMatching();
      this.formAnalyzer = new FormAnalyzer_default(form, input, matching);
      this.device = deviceInterface;
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
          if (!entry.isIntersecting)
            this.removeTooltip();
        }
      });
      this.rescanCount = 0;
      this.mutObsConfig = { childList: true, subtree: true };
      this.mutObs = new MutationObserver(
        (records) => {
          const anythingRemoved = records.some((record) => record.removedNodes.length > 0);
          if (anythingRemoved) {
            if (!this.form.isConnected) {
              this.destroy();
              return;
            }
            if ([...this.inputs.all].some((input2) => !input2.isConnected)) {
              this.mutObs.disconnect();
              window.requestIdleCallback(() => {
                this.formAnalyzer = new FormAnalyzer_default(this.form, input, this.matching);
                this.recategorizeAllInputs();
              });
            }
          }
        }
      );
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
      if (!shouldLog())
        return;
      console.log(`Form type: %c${this.getFormType()}`, "font-weight: bold");
      console.log("Signals: ", this.formAnalyzer.signals);
      console.log("Wrapping element: ", this.form);
      console.log("Inputs: ", this.inputs);
      console.log("Submit Buttons: ", this.submitButtons);
    }
    getFormType() {
      if (this.isHybrid)
        return `hybrid (hybrid score: ${this.formAnalyzer.hybridSignal}, score: ${this.formAnalyzer.autofillSignal})`;
      if (this.isLogin)
        return `login (score: ${this.formAnalyzer.autofillSignal}, hybrid score: ${this.formAnalyzer.hybridSignal})`;
      if (this.isSignup)
        return `signup (score: ${this.formAnalyzer.autofillSignal}, hybrid score: ${this.formAnalyzer.hybridSignal})`;
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
      if (this.submitHandlerExecuted)
        return;
      const values = this.getValuesReadyForStorage();
      this.device.postSubmit?.(values, this);
      this.submitHandlerExecuted = true;
    }
    /**
     * Reads the values from the form without preparing to store them
     * @return {InternalDataStorageObject}
     */
    getRawValues() {
      const formValues = [...this.inputs.credentials, ...this.inputs.identities, ...this.inputs.creditCards].reduce((output, inputEl) => {
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
      }, { credentials: {}, creditCards: {}, identities: {} });
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
            if (elText.length > 70)
              return;
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
      return prepareFormValuesForStorage(formValues);
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
      if (!input.classList.contains("ddg-autofilled"))
        return;
      removeInlineStyles(input, getIconStylesAutofilled(input, this));
      removeInlineStyles(input, { "cursor": "pointer" });
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
      if (e && !e.isTrusted)
        return;
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
      this.removeAllDecorations();
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
      if (this.activeInput)
        this.activeInput.focus();
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
      this.addListener(this.form, "input", () => {
        if (!this.isAutofilling) {
          this.submitHandlerExecuted = false;
          this.resetShouldPromptToStoreData();
        }
      });
      if (this.form instanceof HTMLFormElement && this.form.getRootNode()) {
        this.addListener(this.form, "submit", () => {
          this.submitHandler("in-form submit handler");
        }, { capture: true });
      }
    }
    categorizeInputs() {
      const selector = this.matching.cssSelector("formInputsSelector");
      if (this.form.matches(selector)) {
        this.addInput(this.form);
      } else {
        let foundInputs = [];
        if (this.form instanceof HTMLFormElement) {
          foundInputs = [...this.form.elements].filter((el) => el.matches(selector));
        } else {
          foundInputs = this.form.querySelectorAll(selector);
        }
        if (foundInputs.length < MAX_INPUTS_PER_FORM) {
          foundInputs.forEach((input) => this.addInput(input));
        } else {
          this.device.scanner.stopScanner(`The form has too many inputs (${foundInputs.length}), bailing.`);
          return;
        }
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
        [...this.form.querySelectorAll(selector)]
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
      this.execOnInputs((input) => {
        if (input.value === "" && isPotentiallyViewable(input))
          isThereAnEmptyVisibleField = true;
      }, "all", false);
      if (isThereAnEmptyVisibleField)
        return;
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
        if (canExecute)
          fn(input);
      }
    }
    addInput(input) {
      if (this.inputs.all.has(input))
        return this;
      if (this.inputs.all.size > MAX_INPUTS_PER_FORM) {
        this.device.scanner.stopScanner("The form has too many inputs, bailing.");
        return this;
      }
      if (this.initialScanComplete && this.rescanCount < MAX_FORM_RESCANS) {
        this.formAnalyzer = new FormAnalyzer_default(this.form, input, this.matching);
        this.recategorizeAllInputs();
        return this;
      }
      if (input.maxLength === 1)
        return this;
      this.inputs.all.add(input);
      const opts = {
        isLogin: this.isLogin,
        isHybrid: this.isHybrid,
        isCCForm: this.isCCForm,
        hasCredentials: Boolean(this.device.settings.availableInputTypes.credentials?.username),
        supportsIdentitiesAutofill: this.device.settings.featureToggles.inputType_identities
      };
      this.matching.setInputType(input, this.form, opts);
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
      if (!shouldDecorate)
        return this;
      input.setAttribute(ATTR_AUTOFILL, "true");
      const hasIcon = !!config.getIconBase(input, this);
      if (hasIcon) {
        const { onMouseMove, onMouseLeave } = this.addAutofillStyles(input);
        this.addListener(input, "mousemove", (e) => {
          if (wasAutofilledByChrome(input))
            return;
          if (isEventWithinDax(e, e.target)) {
            addInlineStyles(e.target, {
              "cursor": "pointer",
              ...onMouseMove
            });
          } else {
            removeInlineStyles(e.target, { "cursor": "pointer" });
            if (!this.device.isTooltipActive()) {
              addInlineStyles(e.target, { ...onMouseLeave });
            }
          }
        });
        this.addListener(input, "mouseleave", (e) => {
          removeInlineStyles(e.target, { "cursor": "pointer" });
          if (!this.device.isTooltipActive()) {
            addInlineStyles(e.target, { ...onMouseLeave });
          }
        });
      }
      function getMainClickCoords(e) {
        if (!e.isTrusted)
          return;
        const isMainMouseButton = e.button === 0;
        if (!isMainMouseButton)
          return;
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
        if (!control)
          return;
        if (e.isTrusted) {
          storedClickCoords.set(control, getMainClickCoords(e));
        }
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          storedClickCoords = /* @__PURE__ */ new WeakMap();
        }, 1e3);
      };
      const handler = (e) => {
        if (this.isAutofilling || this.device.isTooltipActive()) {
          return;
        }
        const isLabel = e.target instanceof HTMLLabelElement;
        const input2 = isLabel ? e.target.control : e.target;
        if (!input2 || !this.inputs.all.has(input2))
          return;
        if (wasAutofilledByChrome(input2))
          return;
        if (!canBeInteractedWith(input2))
          return;
        const clickCoords = getClickCoords(e, storedClickCoords);
        if (e.type === "pointerdown") {
          if (!e.isTrusted || !clickCoords)
            return;
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
      if (!(input instanceof HTMLSelectElement)) {
        const events = ["pointerdown"];
        if (!this.device.globalConfig.isMobileApp)
          events.push("focus");
        input.labels?.forEach((label) => {
          if (this.device.globalConfig.isMobileApp) {
            this.addListener(label, "pointerdown", handler);
          } else {
            this.addListener(label, "pointerdown", handlerLabel);
          }
        });
        events.forEach((ev) => this.addListener(input, ev, handler));
      }
      return this;
    }
    shouldOpenTooltip(e, input) {
      if (!isPotentiallyViewable(input))
        return false;
      if (isEventWithinDax(e, input))
        return true;
      if (this.device.globalConfig.isWindows)
        return true;
      const subtype = getInputSubtype(input);
      const isIncontextSignupAvailable = this.device.inContextSignup?.isAvailable(subtype);
      if (this.device.globalConfig.isApp) {
        const mainType = getInputMainType(input);
        const hasSavedDetails = this.device.settings.canAutofillType({ mainType, subtype }, null);
        if (!hasSavedDetails && isIncontextSignupAvailable)
          return false;
        return true;
      }
      if (this.device.globalConfig.isExtension || this.device.globalConfig.isMobileApp) {
        if (isIncontextSignupAvailable)
          return false;
      }
      return !this.touched.has(input) && !input.classList.contains("ddg-autofilled");
    }
    autofillInput(input, string, dataType) {
      if (input instanceof HTMLInputElement && !isPotentiallyViewable(input))
        return;
      if (!canBeInteractedWith(input))
        return;
      if (dataType !== "creditCards" && // creditCards always override, the others only when we're focusing the input
      input.nodeName !== "SELECT" && input.value !== "" && // if the input is not empty
      this.activeInput !== input)
        return;
      if (input.value === string)
        return;
      const successful = setValue(input, string, this.device.globalConfig);
      if (!successful)
        return;
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
      this.execOnInputs(
        (input) => {
          const inputSubtype = getInputSubtype(input);
          if (inputSubtype === "emailAddress") {
            this.autofillInput(input, alias, dataType);
          }
        },
        dataType
      );
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
      const areAllFormValuesKnown = Object.keys(formValues[dataType] || {}).every((subtype) => formValues[dataType][subtype] === data[subtype]);
      if (areAllFormValuesKnown) {
        this.shouldPromptToStoreData = false;
        this.shouldAutoSubmit = this.device.globalConfig.isMobileApp;
      } else {
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
      this.execOnInputs(
        (input) => this.touched.add(input),
        dataType
      );
    }
    getFirstViableCredentialsInput() {
      return [...this.inputs.credentials].find((input) => canBeInteractedWith(input) && isPotentiallyViewable(input));
    }
    async promptLoginIfNeeded() {
      if (document.visibilityState !== "visible" || !this.isLogin)
        return;
      const firstCredentialInput = this.getFirstViableCredentialsInput();
      const input = this.activeInput || firstCredentialInput;
      if (!input)
        return;
      const mainType = getInputMainType(input);
      const subtype = getInputSubtype(input);
      await this.device.settings.populateDataIfNeeded({ mainType, subtype });
      if (this.device.settings.canAutofillType({ mainType, subtype }, this.device.inContextSignup)) {
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

  // zod-replacers:./validators.zod.js
  var sendJSPixelParamsSchema = null;
  var addDebugFlagParamsSchema = null;
  var getAutofillCredentialsParamsSchema = null;
  var setSizeParamsSchema = null;
  var selectedDetailParamsSchema = null;
  var setIncontextSignupPermanentlyDismissedAtSchema = null;
  var getIncontextSignupDismissedAtSchema = null;
  var emailProtectionStoreUserDataParamsSchema = null;
  var showInContextEmailProtectionSignupPromptSchema = null;
  var getAutofillDataRequestSchema = null;
  var getAutofillDataResponseSchema = null;
  var storeFormDataSchema = null;
  var getAvailableInputTypesResultSchema = null;
  var getAutofillInitDataResponseSchema = null;
  var getAutofillCredentialsResultSchema = null;
  var emailProtectionGetIsLoggedInResultSchema = null;
  var emailProtectionGetUserDataResultSchema = null;
  var emailProtectionGetCapabilitiesResultSchema = null;
  var emailProtectionGetAddressesResultSchema = null;
  var emailProtectionRefreshPrivateAddressResultSchema = null;
  var getRuntimeConfigurationResponseSchema = null;
  var askToUnlockProviderResultSchema = null;
  var checkCredentialsProviderStatusResultSchema = null;

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
      if (!validator)
        return data;
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
  var SchemaValidationError = class extends Error {
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
            for (let unionError of issue.unionErrors) {
              for (let issue1 of unionError.issues) {
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
      for (let error2 of errors) {
        log(error2);
      }
      const message = [heading, "please see the details above"].join("\n    ");
      const error = new SchemaValidationError(message);
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
      let result = await this.transport.send(deviceApiCall, options);
      let processed = deviceApiCall.preResultValidation(result);
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

  // src/Scanner.js
  var {
    MAX_INPUTS_PER_PAGE,
    MAX_FORMS_PER_PAGE,
    MAX_INPUTS_PER_FORM: MAX_INPUTS_PER_FORM2,
    ATTR_INPUT_TYPE: ATTR_INPUT_TYPE3
  } = constants;
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
      /** @type {boolean} Indicates whether we called stopScanning */
      __publicField(this, "stopped", false);
      /** @type {import("./Form/matching").Matching} matching */
      __publicField(this, "matching");
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
            for (let addedNode of mutationRecord.addedNodes) {
              if (!(addedNode instanceof HTMLElement))
                continue;
              if (addedNode.nodeName === "DDG-AUTOFILL")
                continue;
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
      return Date.now() - this.initTimeStamp <= 1500;
    }
    /**
     * Call this to scan once and then watch for changes.
     *
     * Call the returned function to remove listeners.
     * @returns {(reason: string, ...rest) => void}
     */
    init() {
      if (this.device.globalConfig.isExtension) {
        this.device.deviceApi.notify(new AddDebugFlagCall({ flag: "autofill" }));
      }
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
        this.stopScanner(reason, ...rest);
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
     * @param context
     */
    findEligibleInputs(context) {
      if (this.device.globalConfig.isDDGDomain) {
        return this;
      }
      if ("matches" in context && context.matches?.(this.matching.cssSelector("formInputsSelector"))) {
        this.addInput(context);
      } else {
        const inputs = context.querySelectorAll(this.matching.cssSelector("formInputsSelector"));
        if (inputs.length > this.options.maxInputsPerPage) {
          this.stopScanner(`Too many input fields in the given context (${inputs.length}), stop scanning`, context);
          return this;
        }
        inputs.forEach((input) => this.addInput(input));
      }
      return this;
    }
    /**
     * Stops scanning, switches off the mutation observer and clears all forms
     * @param {string} reason
     * @param {any} rest
     */
    stopScanner(reason, ...rest) {
      this.stopped = true;
      if (shouldLog()) {
        console.log(reason, ...rest);
      }
      const activeInput = this.device.activeForm?.activeInput;
      clearTimeout(this.debounceTimer);
      this.changedElements.clear();
      this.mutObs.disconnect();
      window.removeEventListener("pointerdown", this, true);
      window.removeEventListener("focus", this, true);
      this.forms.forEach((form) => {
        form.destroy();
      });
      this.forms.clear();
      activeInput?.focus();
    }
    /**
     * @param {HTMLElement|HTMLInputElement|HTMLSelectElement} input
     * @returns {HTMLFormElement|HTMLElement}
     */
    getParentForm(input) {
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
      while (traversalLayerCount <= 5 && element.parentElement && element.parentElement !== document.documentElement) {
        const siblingForm = element.parentElement?.querySelector("form");
        if (siblingForm && siblingForm !== element) {
          return element;
        }
        element = element.parentElement;
        const inputs = element.querySelectorAll(this.matching.cssSelector("formInputsSelector"));
        const buttons = element.querySelectorAll(this.matching.cssSelector("submitButtonSelector"));
        if (inputs.length > 1 || buttons.length) {
          return element;
        }
        traversalLayerCount++;
      }
      return input;
    }
    /**
     * @param {HTMLInputElement|HTMLSelectElement} input
     */
    addInput(input) {
      if (this.stopped)
        return;
      const parentForm = this.getParentForm(input);
      if (parentForm instanceof HTMLFormElement && this.forms.has(parentForm)) {
        const foundForm = this.forms.get(parentForm);
        if (foundForm && foundForm.inputs.all.size < MAX_INPUTS_PER_FORM2) {
          foundForm.addInput(input);
        } else {
          this.stopScanner("The form has too many inputs, destroying.");
        }
        return;
      }
      if (parentForm.role === "search")
        return;
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
        if (childForm) {
          this.forms.get(childForm)?.destroy();
          this.forms.delete(childForm);
        }
        if (this.forms.size < this.options.maxFormsPerPage) {
          this.forms.set(parentForm, new Form(parentForm, input, this.device, this.matching, this.shouldAutoprompt));
        } else {
          this.stopScanner("The page has too many forms, stop adding them.");
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
        for (let element of htmlElements) {
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
      for (let element of this.changedElements) {
        if (element.isConnected) {
          this.findEligibleInputs(element);
        }
      }
    }
    handleEvent(event) {
      switch (event.type) {
        case "pointerdown":
        case "focus":
          this.scanShadow(event);
          break;
      }
    }
    /**
     * Scan clicked input fields, even if they're within a shadow tree
     * @param {FocusEvent | PointerEvent} event
     */
    scanShadow(event) {
      if (this.stopped || !(event.target instanceof Element) || !event.target?.shadowRoot)
        return;
      window.performance?.mark?.("scan_shadow:init:start");
      const realTarget = pierceShadowTree(event, HTMLInputElement);
      if (realTarget instanceof HTMLInputElement && !realTarget.hasAttribute(ATTR_INPUT_TYPE3)) {
        this.findEligibleInputs(realTarget.getRootNode());
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
     * @param {AttachArgs} _args
     * @returns {void}
     */
    attach(_args) {
      throw new Error("must implement attach");
    }
    /**
     * Implement this if your tooltip can be created from positioning
     * + topContextData.
     *
     * For example, in an 'overlay' on macOS/Windows this is needed since
     * there's no page information to call 'attach' above.
     *
     * @param {PosFn} _pos
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
     * @param {import('./UIController').AttachArgs} args
     */
    attach(args) {
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
          case "acceptGeneratedPassword": {
            form.autofillData({
              password: topContextData.credentials?.[0].password,
              [AUTOGENERATED_KEY]: true
            }, mainType);
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
     * If a password exists in `topContextData`, we can append it to the outgoing data
     * in a way that native platforms can easily understand.
     *
     * @param {TopContextData} topContextData
     * @param {import('../../deviceApiCalls/__generated__/validators-ts.js').GetAutofillDataRequest} outgoingData
     * @param {import('../../UI/controllers/UIController.js').AttachArgs['triggerMetaData']} triggerMetaData
     * @return {import('../../deviceApiCalls/__generated__/validators-ts.js').GetAutofillDataRequest}
     */
    appendGeneratedPassword(topContextData, outgoingData, triggerMetaData) {
      const autoGeneratedCredential = topContextData.credentials?.find((credential) => credential.autogenerated);
      if (!autoGeneratedCredential?.password) {
        return outgoingData;
      }
      function suggestPassword() {
        if (!autoGeneratedCredential?.password)
          throw new Error("unreachable");
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
        const key = await this.createRandKey();
        const iv = this.createRandIv();
        const { ciphertext, tag } = await new this.globals.Promise((resolve) => {
          this.generateRandomMethod(randMethodName, resolve);
          data.messageHandling = new SecureMessagingParams({
            methodName: randMethodName,
            secret: this.config.secret,
            key: this.globals.Arrayfrom(key),
            iv: this.globals.Arrayfrom(iv)
          });
          this.wkSend(handler, data);
        });
        const cipher = new this.globals.Uint8Array([...ciphertext, ...tag]);
        const decrypted = await this.decrypt(cipher, key, iv);
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
      const key = await this.globals.generateKey(this.algoObj, true, ["encrypt", "decrypt"]);
      const exportedKey = await this.globals.exportKey("raw", key);
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
    async decrypt(ciphertext, key, iv) {
      const cryptoKey = await this.globals.importKey("raw", key, "AES-GCM", false, ["decrypt"]);
      const algo = { name: "AES-GCM", iv };
      let decrypted = await this.globals.decrypt(algo, cryptoKey, ciphertext);
      let dec = new this.globals.TextDecoder();
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
      if (!handlers)
        throw new MissingHandler("window.webkit.messageHandlers was absent", "all");
      for (let webkitMessageHandlerName of handlerNames) {
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
          let data = JSON.parse(e.data);
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
  var autofillSettingsSchema = null;
  var providerStatusUpdatedSchema = null;

  // src/Settings.js
  var _Settings = class {
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
     * If the platform in question is happy to derive it's 'enabled' state from the RuntimeConfiguration,
     * then they should use this. Currently only Windows supports this, but we aim to move all platforms to
     * support this going forward.
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
      if (this._runtimeConfiguration)
        return this._runtimeConfiguration;
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
     * To 'refresh' settings means to re-call APIs to determine new state. This may
     * only occur once per page, but it must be done before any page scanning/decorating can happen
     *
     * @returns {Promise<{
     *      availableInputTypes: AvailableInputTypes,
     *      featureToggles: AutofillFeatureToggles,
     *      enabled: boolean | null
     * }>}
     */
    async refresh() {
      this.setEnabled(await this.getEnabled());
      this.setFeatureToggles(await this.getFeatureToggles());
      this.setAvailableInputTypes(await this.getAvailableInputTypes());
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
     * }} types
     * @returns {boolean}
     */
    isTypeUnavailable({ mainType, subtype }) {
      if (mainType === "unknown")
        return true;
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
     * }} types
     * @returns {Promise<boolean>}
     */
    async populateDataIfNeeded({ mainType, subtype }) {
      if (this.isTypeUnavailable({ mainType, subtype }))
        return false;
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
     * }} types
     * @param {import("./InContextSignup.js").InContextSignup?} inContextSignup
     * @returns {boolean}
     */
    canAutofillType({ mainType, subtype }, inContextSignup) {
      if (this.isTypeUnavailable({ mainType, subtype }))
        return false;
      const isEmailProtectionEnabled = this.featureToggles.emailProtection && this.availableInputTypes.email;
      if (subtype === "emailAddress" && isEmailProtectionEnabled) {
        return true;
      }
      if (inContextSignup?.isAvailable(subtype)) {
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
      if (this._featureToggles === null)
        throw new Error("feature toggles accessed before being set");
      return this._featureToggles;
    }
    /** @param {AutofillFeatureToggles} input */
    setFeatureToggles(input) {
      this._featureToggles = input;
    }
    /** @returns {AvailableInputTypes} */
    get availableInputTypes() {
      if (this._availableInputTypes === null)
        throw new Error("available input types accessed before being set");
      return this._availableInputTypes;
    }
    /** @param {AvailableInputTypes} value */
    setAvailableInputTypes(value) {
      this._availableInputTypes = { ...this._availableInputTypes, ...value };
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
  var Settings = _Settings;
  __publicField(Settings, "defaults", {
    /** @type {AutofillFeatureToggles} */
    featureToggles: {
      credentials_saving: false,
      password_generation: false,
      emailProtection: false,
      emailProtection_incontext_signup: false,
      inputType_identities: false,
      inputType_credentials: false,
      inputType_creditCards: false,
      inlineIcon_credentials: false
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
    window.addEventListener("submit", (e) => {
      return forms.get(e.target)?.submitHandler("global submit event");
    }, true);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const focusedForm = [...forms.values()].find((form) => form.hasFocus(e));
        focusedForm?.submitHandler("global keydown + Enter");
      }
    }, true);
    window.addEventListener("pointerdown", (event) => {
      const realTarget = pierceShadowTree(event);
      const formsArray = [...forms.values()];
      const matchingForm = formsArray.find(
        (form) => {
          const btns = [...form.submitButtons];
          if (btns.includes(realTarget))
            return true;
          if (btns.find((btn) => btn.contains(realTarget)))
            return true;
        }
      );
      matchingForm?.submitHandler("global pointerdown event + matching form");
      if (!matchingForm) {
        const selector = matching.cssSelector("submitButtonSelector") + ', a[href="#"], a[href^=javascript], *[onclick], [class*=button i]';
        const button = (
          /** @type HTMLElement */
          realTarget?.closest(selector)
        );
        if (!button)
          return;
        const buttonIsAFalsePositive = formsArray.some((form) => button?.contains(form.form));
        if (buttonIsAFalsePositive)
          return;
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
    }, true);
    const observer = new PerformanceObserver((list) => {
      const formsArray = [...forms.values()];
      const entries = list.getEntries().filter(
        (entry) => (
          // @ts-ignore why does TS not know about `entry.initiatorType`?
          ["fetch", "xmlhttprequest"].includes(entry.initiatorType) && safeRegexTest(/login|sign-in|signin/, entry.name)
        )
      );
      if (!entries.length)
        return;
      const filledForm = formsArray.find((form) => form.hasValues());
      const focusedForm = formsArray.find((form) => form.hasFocus());
      if (focusedForm)
        return;
      filledForm?.submitHandler("performance observer");
    });
    observer.observe({ entryTypes: ["resource"] });
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

  // src/DeviceInterface/InterfacePrototype.js
  var _addresses, _data6;
  var _InterfacePrototype = class {
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
      if (!this.hasLocalAddresses)
        return identities;
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
          title: "Block email trackers"
        });
      }
      newIdentities.push({
        id: "privateAddress",
        emailAddress: privateAddress,
        title: "Block email trackers & hide address"
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
    async startInit() {
      if (this.isInitializationStarted)
        return;
      this.alreadyInitialized = true;
      await this.settings.refresh();
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
    }
    async init() {
      const isEnabledInitiallyViaConfig = autofillEnabled(this.globalConfig);
      if (!isEnabledInitiallyViaConfig) {
        return;
      }
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
            return this.getLocalCredentials().filter((cred) => !!cred[subtype] || subtype === "password" || cred.id === PROVIDER_LOCKED);
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
     * @param {import('../UI/controllers/UIController.js').AttachArgs["triggerMetaData"]} params.triggerMetaData
     */
    attachTooltip(params) {
      const {
        form,
        input,
        click,
        trigger
      } = params;
      if (document.visibilityState !== "visible" && trigger !== "postSignup")
        return;
      if (trigger === "autoprompt" && !this.globalConfig.isMobileApp)
        return;
      if (trigger === "autoprompt" && this.autopromptFired)
        return;
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
        inputType
      };
      const processedTopContext = this.preAttachTooltip(topContextData, input, form);
      this.uiController?.attach({
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
      if (!matchingData)
        throw new Error("unreachable (fatal)");
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
              default:
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
    /** @returns {APIResponse<CreditCardObject>} */
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
      const checks = [
        topContextData.inputType === "credentials.password.new",
        this.settings.featureToggles.password_generation
      ];
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
      if (!form.form)
        return;
      if (!form.hasValues(values))
        return;
      const checks = [
        form.shouldPromptToStoreData && !form.submitHandlerExecuted,
        this.passwordGenerator.generated
      ];
      if (checks.some(Boolean)) {
        const formData = appendGeneratedKey(values, {
          password: this.passwordGenerator.password,
          username: this.emailProtection.lastGenerated
        });
        this.storeFormData(formData, "formSubmission");
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
  var InterfacePrototype = _InterfacePrototype;
  _addresses = new WeakMap();
  _data6 = new WeakMap();
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
      if (!this.device.globalConfig.hasModernWebkitAPI)
        return;
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
        document.addEventListener("visibilitychange", () => {
          selectActiveInput();
        }, { once: true });
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
      if (!this.globalConfig.isDDGDomain)
        return;
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
  var autofill_tooltip_styles_default = ":root {\n    color-scheme: light dark;\n}\n\n.wrapper *, .wrapper *::before, .wrapper *::after {\n    box-sizing: border-box;\n}\n.wrapper {\n    position: fixed;\n    top: 0;\n    left: 0;\n    padding: 0;\n    font-family: 'DDG_ProximaNova', 'Proxima Nova', system-ui, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',\n    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n    -webkit-font-smoothing: antialiased;\n    z-index: 2147483647;\n}\n.wrapper--data {\n    font-family: 'SF Pro Text', system-ui, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',\n    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n}\n:not(.top-autofill) .tooltip {\n    position: absolute;\n    width: 300px;\n    max-width: calc(100vw - 25px);\n    transform: translate(-1000px, -1000px);\n    z-index: 2147483647;\n}\n.tooltip--data, #topAutofill {\n    background-color: rgba(242, 240, 240, 1);\n    -webkit-backdrop-filter: blur(40px);\n    backdrop-filter: blur(40px);\n}\n@media (prefers-color-scheme: dark) {\n    .tooltip--data, #topAutofill {\n        background: rgb(100, 98, 102, .9);\n    }\n}\n.tooltip--data {\n    padding: 6px;\n    font-size: 13px;\n    line-height: 14px;\n    width: 315px;\n    max-height: 290px;\n    overflow-y: auto;\n}\n.top-autofill .tooltip--data {\n    min-height: 100vh;\n}\n.tooltip--data.tooltip--incontext-signup {\n    width: 360px;\n}\n:not(.top-autofill) .tooltip--data {\n    top: 100%;\n    left: 100%;\n    border: 0.5px solid rgba(255, 255, 255, 0.2);\n    border-radius: 6px;\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.32);\n}\n@media (prefers-color-scheme: dark) {\n    :not(.top-autofill) .tooltip--data {\n        border: 1px solid rgba(255, 255, 255, 0.2);\n    }\n}\n:not(.top-autofill) .tooltip--email {\n    top: calc(100% + 6px);\n    right: calc(100% - 48px);\n    padding: 8px;\n    border: 1px solid #D0D0D0;\n    border-radius: 10px;\n    background-color: #FFFFFF;\n    font-size: 14px;\n    line-height: 1.3;\n    color: #333333;\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);\n}\n.tooltip--email__caret {\n    position: absolute;\n    transform: translate(-1000px, -1000px);\n    z-index: 2147483647;\n}\n.tooltip--email__caret::before,\n.tooltip--email__caret::after {\n    content: \"\";\n    width: 0;\n    height: 0;\n    border-left: 10px solid transparent;\n    border-right: 10px solid transparent;\n    display: block;\n    border-bottom: 8px solid #D0D0D0;\n    position: absolute;\n    right: -28px;\n}\n.tooltip--email__caret::before {\n    border-bottom-color: #D0D0D0;\n    top: -1px;\n}\n.tooltip--email__caret::after {\n    border-bottom-color: #FFFFFF;\n    top: 0px;\n}\n\n/* Buttons */\n.tooltip__button {\n    display: flex;\n    width: 100%;\n    padding: 8px 8px 8px 0px;\n    font-family: inherit;\n    color: inherit;\n    background: transparent;\n    border: none;\n    border-radius: 6px;\n}\n.tooltip__button.currentFocus,\n.wrapper:not(.top-autofill) .tooltip__button:hover {\n    background-color: #3969EF;\n    color: #FFFFFF;\n}\n\n/* Data autofill tooltip specific */\n.tooltip__button--data {\n    position: relative;\n    min-height: 48px;\n    flex-direction: row;\n    justify-content: flex-start;\n    font-size: inherit;\n    font-weight: 500;\n    line-height: 16px;\n    text-align: left;\n    border-radius: 3px;\n}\n.tooltip--data__item-container {\n    max-height: 220px;\n    overflow: auto;\n}\n.tooltip__button--data:first-child {\n    margin-top: 0;\n}\n.tooltip__button--data:last-child {\n    margin-bottom: 0;\n}\n.tooltip__button--data::before {\n    content: '';\n    flex-shrink: 0;\n    display: block;\n    width: 32px;\n    height: 32px;\n    margin: 0 8px;\n    background-size: 20px 20px;\n    background-repeat: no-repeat;\n    background-position: center center;\n}\n#provider_locked::after {\n    position: absolute;\n    content: '';\n    flex-shrink: 0;\n    display: block;\n    width: 32px;\n    height: 32px;\n    margin: 0 8px;\n    background-size: 11px 13px;\n    background-repeat: no-repeat;\n    background-position: right bottom;\n}\n.tooltip__button--data.currentFocus:not(.tooltip__button--data--bitwarden)::before,\n.wrapper:not(.top-autofill) .tooltip__button--data:not(.tooltip__button--data--bitwarden):hover::before {\n    filter: invert(100%);\n}\n@media (prefers-color-scheme: dark) {\n    .tooltip__button--data:not(.tooltip__button--data--bitwarden)::before,\n    .tooltip__button--data:not(.tooltip__button--data--bitwarden)::before {\n        filter: invert(100%);\n        opacity: .9;\n    }\n}\n.tooltip__button__text-container {\n    margin: auto 0;\n}\n.label {\n    display: block;\n    font-weight: 400;\n    letter-spacing: -0.25px;\n    color: rgba(0,0,0,.8);\n    font-size: 13px;\n    line-height: 1;\n}\n.label + .label {\n    margin-top: 2px;\n}\n.label.label--medium {\n    font-weight: 500;\n    letter-spacing: -0.25px;\n    color: rgba(0,0,0,.9);\n}\n.label.label--small {\n    font-size: 11px;\n    font-weight: 400;\n    letter-spacing: 0.06px;\n    color: rgba(0,0,0,0.6);\n}\n@media (prefers-color-scheme: dark) {\n    .tooltip--data .label {\n        color: #ffffff;\n    }\n    .tooltip--data .label--medium {\n        color: #ffffff;\n    }\n    .tooltip--data .label--small {\n        color: #cdcdcd;\n    }\n}\n.tooltip__button.currentFocus .label,\n.wrapper:not(.top-autofill) .tooltip__button:hover .label {\n    color: #FFFFFF;\n}\n\n.tooltip__button--manage {\n    font-size: 13px;\n    padding: 5px 9px;\n    border-radius: 3px;\n    margin: 0;\n}\n\n/* Icons */\n.tooltip__button--data--credentials::before,\n.tooltip__button--data--credentials__current::before {\n    background-size: 28px 28px;\n    background-image: url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS4zMzQgNi42NjdhMiAyIDAgMSAwIDAgNCAyIDIgMCAwIDAgMC00Wm0tLjY2NyAyYS42NjcuNjY3IDAgMSAxIDEuMzMzIDAgLjY2Ny42NjcgMCAwIDEtMS4zMzMgMFoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQuNjY3IDRhNS4zMzMgNS4zMzMgMCAwIDAtNS4xODggNi41NzhsLTUuMjg0IDUuMjg0YS42NjcuNjY3IDAgMCAwLS4xOTUuNDcxdjNjMCAuMzY5LjI5OC42NjcuNjY3LjY2N2gyLjY2NmMuNzM3IDAgMS4zMzQtLjU5NyAxLjMzNC0xLjMzM1YxOGguNjY2Yy43MzcgMCAxLjMzNC0uNTk3IDEuMzM0LTEuMzMzdi0xLjMzNEgxMmMuMTc3IDAgLjM0Ni0uMDcuNDcxLS4xOTVsLjY4OC0uNjg4QTUuMzMzIDUuMzMzIDAgMSAwIDE0LjY2NyA0Wm0tNCA1LjMzM2E0IDQgMCAxIDEgMi41NTUgMy43MzIuNjY3LjY2NyAwIDAgMC0uNzEzLjE1bC0uNzg1Ljc4NUgxMGEuNjY3LjY2NyAwIDAgMC0uNjY3LjY2N3YySDhhLjY2Ny42NjcgMCAwIDAtLjY2Ny42NjZ2MS4zMzRoLTJ2LTIuMDU4bDUuMzY1LTUuMzY0YS42NjcuNjY3IDAgMCAwIC4xNjMtLjY3NyAzLjk5NiAzLjk5NiAwIDAgMS0uMTk0LTEuMjM1WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPgo=');\n}\n.tooltip__button--data--credentials__new::before {\n    background-size: 28px 28px;\n    background-image: url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBmaWxsPSIjMDAwIiBkPSJNOC4wNDcgNC42MjVDNy45MzcgNC4xMjUgNy44NjIgNCA3LjUgNGMtLjM2MiAwLS40MzguMTI1LS41NDcuNjI1LS4wNjguMzEtLjE3NyAxLjMzOC0uMjUxIDIuMDc3LS43MzguMDc0LTEuNzY3LjE4My0yLjA3Ny4yNTEtLjUuMTEtLjYyNS4xODQtLjYyNS41NDcgMCAuMzYyLjEyNS40MzcuNjI1LjU0Ny4zMS4wNjcgMS4zMzYuMTc3IDIuMDc0LjI1LjA3My43NjcuMTg1IDEuODQyLjI1NCAyLjA3OC4xMS4zNzUuMTg1LjYyNS41NDcuNjI1LjM2MiAwIC40MzgtLjEyNS41NDctLjYyNS4wNjgtLjMxLjE3Ny0xLjMzNi4yNS0yLjA3NC43NjctLjA3MyAxLjg0Mi0uMTg1IDIuMDc4LS4yNTQuMzc1LS4xMS42MjUtLjE4NS42MjUtLjU0NyAwLS4zNjMtLjEyNS0uNDM4LS42MjUtLjU0Ny0uMzEtLjA2OC0xLjMzOS0uMTc3LTIuMDc3LS4yNTEtLjA3NC0uNzM5LS4xODMtMS43NjctLjI1MS0yLjA3N1oiLz4KICAgIDxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0xNC42ODEgNS4xOTljLS43NjYgMC0xLjQ4Mi4yMS0yLjA5My41NzhhLjYzNi42MzYgMCAwIDEtLjY1NS0xLjA5IDUuMzQgNS4zNCAwIDEgMSAxLjMwMiA5LjcyMmwtLjc3NS43NzZhLjYzNi42MzYgMCAwIDEtLjQ1LjE4NmgtMS4zOTh2MS42NWMwIC40OTMtLjQuODkzLS44OTMuODkzSDguNTc4djEuMTQxYzAgLjQ5NC0uNC44OTMtLjg5NC44OTNINC42MzZBLjYzNi42MzYgMCAwIDEgNCAxOS4zMTNWMTYuMjZjMC0uMTY5LjA2Ny0uMzMuMTg2LS40NWw1LjU2Mi01LjU2MmEuNjM2LjYzNiAwIDEgMSAuOS45bC01LjM3NiA1LjM3NXYyLjE1M2gyLjAzNHYtMS4zOTljMC0uMzUuMjg1LS42MzYuNjM2LS42MzZIOS4zNHYtMS45MDdjMC0uMzUxLjI4NC0uNjM2LjYzNS0uNjM2aDEuNzcxbC44NjQtLjg2M2EuNjM2LjYzNiAwIDAgMSAuNjY4LS4xNDcgNC4wNjkgNC4wNjkgMCAxIDAgMS40MDItNy44OVoiLz4KICAgIDxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjYyNSA4LjQ5OWExLjg3NSAxLjg3NSAwIDEgMSAzLjc1IDAgMS44NzUgMS44NzUgMCAwIDEtMy43NSAwWm0xLjg3NS0uNjI1YS42MjUuNjI1IDAgMSAwIDAgMS4yNS42MjUuNjI1IDAgMCAwIDAtMS4yNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTQuNjI1IDEyLjEyNWEuNjI1LjYyNSAwIDEgMCAwLTEuMjUuNjI1LjYyNSAwIDAgMCAwIDEuMjVaIi8+Cjwvc3ZnPgo=');\n}\n.tooltip__button--data--creditCards::before {\n    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBkPSJNNSA5Yy0uNTUyIDAtMSAuNDQ4LTEgMXYyYzAgLjU1Mi40NDggMSAxIDFoM2MuNTUyIDAgMS0uNDQ4IDEtMXYtMmMwLS41NTItLjQ0OC0xLTEtMUg1eiIgZmlsbD0iIzAwMCIvPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDZjMC0yLjIxIDEuNzktNCA0LTRoMTRjMi4yMSAwIDQgMS43OSA0IDR2MTJjMCAyLjIxLTEuNzkgNC00IDRINWMtMi4yMSAwLTQtMS43OS00LTRWNnptNC0yYy0xLjEwNSAwLTIgLjg5NS0yIDJ2OWgxOFY2YzAtMS4xMDUtLjg5NS0yLTItMkg1em0wIDE2Yy0xLjEwNSAwLTItLjg5NS0yLTJoMThjMCAxLjEwNS0uODk1IDItMiAySDV6IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPgo=');\n}\n.tooltip__button--data--identities::before {\n    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDIxYzIuMTQzIDAgNC4xMTEtLjc1IDUuNjU3LTItLjYyNi0uNTA2LTEuMzE4LS45MjctMi4wNi0xLjI1LTEuMS0uNDgtMi4yODUtLjczNS0zLjQ4Ni0uNzUtMS4yLS4wMTQtMi4zOTIuMjExLTMuNTA0LjY2NC0uODE3LjMzMy0xLjU4Ljc4My0yLjI2NCAxLjMzNiAxLjU0NiAxLjI1IDMuNTE0IDIgNS42NTcgMnptNC4zOTctNS4wODNjLjk2Ny40MjIgMS44NjYuOTggMi42NzIgMS42NTVDMjAuMjc5IDE2LjAzOSAyMSAxNC4xMDQgMjEgMTJjMC00Ljk3LTQuMDMtOS05LTlzLTkgNC4wMy05IDljMCAyLjEwNC43MjIgNC4wNCAxLjkzMiA1LjU3Mi44NzQtLjczNCAxLjg2LTEuMzI4IDIuOTIxLTEuNzYgMS4zNi0uNTU0IDIuODE2LS44MyA0LjI4My0uODExIDEuNDY3LjAxOCAyLjkxNi4zMyA0LjI2LjkxNnpNMTIgMjNjNi4wNzUgMCAxMS00LjkyNSAxMS0xMVMxOC4wNzUgMSAxMiAxIDEgNS45MjUgMSAxMnM0LjkyNSAxMSAxMSAxMXptMy0xM2MwIDEuNjU3LTEuMzQzIDMtMyAzcy0zLTEuMzQzLTMtMyAxLjM0My0zIDMtMyAzIDEuMzQzIDMgM3ptMiAwYzAgMi43NjEtMi4yMzkgNS01IDVzLTUtMi4yMzktNS01IDIuMjM5LTUgNS01IDUgMi4yMzkgNSA1eiIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4=');\n}\n.tooltip__button--data--credentials.tooltip__button--data--bitwarden::before,\n.tooltip__button--data--credentials__current.tooltip__button--data--bitwarden::before {\n    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iOCIgZmlsbD0iIzE3NUREQyIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE4LjU2OTYgNS40MzM1NUMxOC41MDg0IDUuMzc0NDIgMTguNDM0NyA1LjMyNzYzIDE4LjM1MzEgNS4yOTYxMUMxOC4yNzE1IDUuMjY0NiAxOC4xODM3IDUuMjQ5MDQgMTguMDk1MyA1LjI1MDQxSDUuOTIxOTFDNS44MzMyNiA1LjI0NzI5IDUuNzQ0OTMgNS4yNjIwNSA1LjY2MzA0IDUuMjkzNjdDNS41ODExNSA1LjMyNTI5IDUuNTA3NjUgNS4zNzMwMiA1LjQ0NzYyIDUuNDMzNTVDNS4zMjE3IDUuNTUwMTMgNS4yNTA2NSA1LjcwODE1IDUuMjUgNS44NzMxVjEzLjM4MjFDNS4yNTMzNiAxMy45NTM1IDUuMzc0MDggMTQuNTE5MSA1LjYwNTcyIDE1LjA0ODdDNS44MTkzMSAxNS41NzI4IDYuMTEyMDcgMTYuMDY2MSA2LjQ3NTI0IDE2LjUxMzlDNi44NDIgMTYuOTY4MyA3LjI1OTI5IDE3LjM4NTcgNy43MjAyNSAxNy43NTkzQzguMTQwNTMgMTguMTI1NiA4LjU4OTcxIDE4LjQ2MjMgOS4wNjQwNyAxOC43NjY2QzkuNDU5MzEgMTkuMDIzIDkuOTEzODMgMTkuMjc5NCAxMC4zNDg2IDE5LjUxNzVDMTAuNzgzNCAxOS43NTU2IDExLjA5OTYgMTkuOTIwNCAxMS4yNzc0IDE5Ljk5MzdDMTEuNDU1MyAyMC4wNjY5IDExLjYxMzQgMjAuMTQwMiAxMS43MTIyIDIwLjE5NTFDMTEuNzk5MiAyMC4yMzEzIDExLjg5MzUgMjAuMjUgMTEuOTg4OCAyMC4yNUMxMi4wODQyIDIwLjI1IDEyLjE3ODUgMjAuMjMxMyAxMi4yNjU1IDIwLjE5NTFDMTIuNDIxMiAyMC4xMzYzIDEyLjU3MjkgMjAuMDY5IDEyLjcyIDE5Ljk5MzdDMTIuNzcxMSAxOS45Njc0IDEyLjgzMzUgMTkuOTM2NiAxMi45MDY5IDE5LjkwMDRDMTMuMDg5MSAxOS44MTA1IDEzLjMzODggMTkuNjg3MiAxMy42NDg5IDE5LjUxNzVDMTQuMDgzNiAxOS4yNzk0IDE0LjUxODQgMTkuMDIzIDE0LjkzMzQgMTguNzY2NkMxNS40MDQgMTguNDU3NyAxNS44NTI4IDE4LjEyMTIgMTYuMjc3MiAxNy43NTkzQzE2LjczMzEgMTcuMzgwOSAxNy4xNDk5IDE2Ljk2NCAxNy41MjIyIDE2LjUxMzlDMTcuODc4IDE2LjA2MTcgMTguMTcwMiAxNS41NjkzIDE4LjM5MTcgMTUuMDQ4N0MxOC42MjM0IDE0LjUxOTEgMTguNzQ0MSAxMy45NTM1IDE4Ljc0NzQgMTMuMzgyMVY1Ljg3MzFDMTguNzU1NyA1Ljc5MjE0IDE4Ljc0MzkgNS43MTA1IDE4LjcxMzEgNS42MzQzNUMxOC42ODIzIDUuNTU4MiAxOC42MzMyIDUuNDg5NTQgMTguNTY5NiA1LjQzMzU1Wk0xNy4wMDg0IDEzLjQ1NTNDMTcuMDA4NCAxNi4xODQyIDEyLjAwODYgMTguNTI4NSAxMi4wMDg2IDE4LjUyODVWNi44NjIwOUgxNy4wMDg0VjEzLjQ1NTNaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K');\n}\n#provider_locked:after {\n    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMSAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgNy42MDA1N1Y3LjYwMjVWOS41MjI1QzEgMTAuMDgwMSAxLjIyMTUxIDEwLjYxNDkgMS42MTU4MSAxMS4wMDkyQzIuMDEwMSAxMS40MDM1IDIuNTQ0ODggMTEuNjI1IDMuMTAyNSAxMS42MjVINy4yNzI1QzcuNTQ4NjEgMTEuNjI1IDcuODIyMDEgMTEuNTcwNiA4LjA3NzA5IDExLjQ2NUM4LjMzMjE4IDExLjM1OTMgOC41NjM5NiAxMS4yMDQ0IDguNzU5MTkgMTEuMDA5MkM4Ljk1NDQzIDEwLjgxNCA5LjEwOTMgMTAuNTgyMiA5LjIxNDk2IDEwLjMyNzFDOS4zMjA2MiAxMC4wNzIgOS4zNzUgOS43OTg2MSA5LjM3NSA5LjUyMjVMOS4zNzUgNy42MDI1TDkuMzc1IDcuNjAwNTdDOS4zNzQxNSA3LjE2MTMxIDkuMjM1NzQgNi43MzMzNSA4Ljk3OTIyIDYuMzc2NzhDOC44NzY4MyA2LjIzNDQ2IDguNzU3NjggNi4xMDYzNyA4LjYyNSA1Ljk5NDg5VjUuMTg3NUM4LjYyNSA0LjI3NTgyIDguMjYyODQgMy40MDE0OCA3LjYxODE4IDIuNzU2ODJDNi45NzM1MiAyLjExMjE2IDYuMDk5MTggMS43NSA1LjE4NzUgMS43NUM0LjI3NTgyIDEuNzUgMy40MDE0OCAyLjExMjE2IDIuNzU2ODIgMi43NTY4MkMyLjExMjE2IDMuNDAxNDggMS43NSA0LjI3NTgyIDEuNzUgNS4xODc1VjUuOTk0ODlDMS42MTczMiA2LjEwNjM3IDEuNDk4MTcgNi4yMzQ0NiAxLjM5NTc4IDYuMzc2NzhDMS4xMzkyNiA2LjczMzM1IDEuMDAwODUgNy4xNjEzMSAxIDcuNjAwNTdaTTQuOTY4NyA0Ljk2ODdDNS4wMjY5NCA0LjkxMDQ3IDUuMTA1MzIgNC44NzY5OSA1LjE4NzUgNC44NzUwN0M1LjI2OTY4IDQuODc2OTkgNS4zNDgwNiA0LjkxMDQ3IDUuNDA2MyA0Ljk2ODdDNS40NjU0MiA1LjAyNzgzIDUuNDk5MDQgNS4xMDc3NCA1LjUgNS4xOTEzVjUuNUg0Ljg3NVY1LjE5MTNDNC44NzU5NiA1LjEwNzc0IDQuOTA5NTggNS4wMjc4MyA0Ljk2ODcgNC45Njg3WiIgZmlsbD0iIzIyMjIyMiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=');\n}\n\nhr {\n    display: block;\n    margin: 5px 9px;\n    border: none; /* reset the border */\n    border-top: 1px solid rgba(0,0,0,.1);\n}\n\nhr:first-child {\n    display: none;\n}\n\n@media (prefers-color-scheme: dark) {\n    hr {\n        border-top: 1px solid rgba(255,255,255,.2);\n    }\n}\n\n#privateAddress {\n    align-items: flex-start;\n}\n#personalAddress::before,\n#privateAddress::before,\n#incontextSignup::before,\n#personalAddress.currentFocus::before,\n#personalAddress:hover::before,\n#privateAddress.currentFocus::before,\n#privateAddress:hover::before {\n    filter: none;\n    /* This is the same icon as `daxBase64` in `src/Form/logo-svg.js` */\n    background-image: url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTY0IDEyOGMzNS4zNDYgMCA2NC0yOC42NTQgNjQtNjRzLTI4LjY1NC02NC02NC02NC02NCAyOC42NTQtNjQgNjQgMjguNjU0IDY0IDY0IDY0eiIgZmlsbD0iI2RlNTgzMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+CiAgICA8cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im03MyAxMTEuNzVjMC0uNS4xMjMtLjYxNC0xLjQ2Ni0zLjc4Mi00LjIyNC04LjQ1OS04LjQ3LTIwLjM4NC02LjU0LTI4LjA3NS4zNTMtMS4zOTctMy45NzgtNTEuNzQ0LTcuMDQtNTMuMzY1LTMuNDAyLTEuODEzLTcuNTg4LTQuNjktMTEuNDE4LTUuMzMtMS45NDMtLjMxLTQuNDktLjE2NC02LjQ4Mi4xMDUtLjM1My4wNDctLjM2OC42ODMtLjAzLjc5OCAxLjMwOC40NDMgMi44OTUgMS4yMTIgMy44MyAyLjM3NS4xNzguMjItLjA2LjU2Ni0uMzQyLjU3Ny0uODgyLjAzMi0yLjQ4Mi40MDItNC41OTMgMi4xOTUtLjI0NC4yMDctLjA0MS41OTIuMjczLjUzIDQuNTM2LS44OTcgOS4xNy0uNDU1IDExLjkgMi4wMjcuMTc3LjE2LjA4NC40NS0uMTQ3LjUxMi0yMy42OTQgNi40NC0xOS4wMDMgMjcuMDUtMTIuNjk2IDUyLjM0NCA1LjYxOSAyMi41MyA3LjczMyAyOS43OTIgOC40IDMyLjAwNGEuNzE4LjcxOCAwIDAgMCAuNDIzLjQ2N2M4LjE1NiAzLjI0OCAyNS45MjggMy4zOTIgMjUuOTI4LTIuMTMyeiIgZmlsbD0iI2RkZCIgZmlsbC1ydWxlPSJldmVub2RkIi8+CiAgICA8cGF0aCBkPSJtNzYuMjUgMTE2LjVjLTIuODc1IDEuMTI1LTguNSAxLjYyNS0xMS43NSAxLjYyNS00Ljc2NCAwLTExLjYyNS0uNzUtMTQuMTI1LTEuODc1LTEuNTQ0LTQuNzUxLTYuMTY0LTE5LjQ4LTEwLjcyNy0zOC4xODVsLS40NDctMS44MjctLjAwNC0uMDE1Yy01LjQyNC0yMi4xNTctOS44NTUtNDAuMjUzIDE0LjQyNy00NS45MzguMjIyLS4wNTIuMzMtLjMxNy4xODQtLjQ5Mi0yLjc4Ni0zLjMwNS04LjAwNS00LjM4OC0xNC42MDUtMi4xMTEtLjI3LjA5My0uNTA2LS4xOC0uMzM3LS40MTIgMS4yOTQtMS43ODMgMy44MjMtMy4xNTUgNS4wNzEtMy43NTYuMjU4LS4xMjQuMjQyLS41MDItLjAzLS41ODhhMjcuODc3IDI3Ljg3NyAwIDAgMCAtMy43NzItLjljLS4zNy0uMDU5LS40MDMtLjY5My0uMDMyLS43NDMgOS4zNTYtMS4yNTkgMTkuMTI1IDEuNTUgMjQuMDI4IDcuNzI2YS4zMjYuMzI2IDAgMCAwIC4xODYuMTE0YzE3Ljk1MiAzLjg1NiAxOS4yMzggMzIuMjM1IDE3LjE3IDMzLjUyOC0uNDA4LjI1NS0xLjcxNS4xMDgtMy40MzgtLjA4NS02Ljk4Ni0uNzgxLTIwLjgxOC0yLjMyOS05LjQwMiAxOC45NDguMTEzLjIxLS4wMzYuNDg4LS4yNzIuNTI1LTYuNDM4IDEgMS44MTIgMjEuMTczIDcuODc1IDM0LjQ2MXoiIGZpbGw9IiNmZmYiLz4KICAgIDxwYXRoIGQ9Im04NC4yOCA5MC42OThjLTEuMzY3LS42MzMtNi42MjEgMy4xMzUtMTAuMTEgNi4wMjgtLjcyOC0xLjAzMS0yLjEwMy0xLjc4LTUuMjAzLTEuMjQyLTIuNzEzLjQ3Mi00LjIxMSAxLjEyNi00Ljg4IDIuMjU0LTQuMjgzLTEuNjIzLTExLjQ4OC00LjEzLTEzLjIyOS0xLjcxLTEuOTAyIDIuNjQ2LjQ3NiAxNS4xNjEgMy4wMDMgMTYuNzg2IDEuMzIuODQ5IDcuNjMtMy4yMDggMTAuOTI2LTYuMDA1LjUzMi43NDkgMS4zODggMS4xNzggMy4xNDggMS4xMzcgMi42NjItLjA2MiA2Ljk3OS0uNjgxIDcuNjQ5LTEuOTIxLjA0LS4wNzUuMDc1LS4xNjQuMTA1LS4yNjYgMy4zODggMS4yNjYgOS4zNSAyLjYwNiAxMC42ODIgMi40MDYgMy40Ny0uNTIxLS40ODQtMTYuNzIzLTIuMDktMTcuNDY3eiIgZmlsbD0iIzNjYTgyYiIvPgogICAgPHBhdGggZD0ibTc0LjQ5IDk3LjA5N2MuMTQ0LjI1Ni4yNi41MjYuMzU4LjguNDgzIDEuMzUyIDEuMjcgNS42NDguNjc0IDYuNzA5LS41OTUgMS4wNjItNC40NTkgMS41NzQtNi44NDMgMS42MTVzLTIuOTItLjgzMS0zLjQwMy0yLjE4MWMtLjM4Ny0xLjA4MS0uNTc3LTMuNjIxLS41NzItNS4wNzUtLjA5OC0yLjE1OC42OS0yLjkxNiA0LjMzNC0zLjUwNiAyLjY5Ni0uNDM2IDQuMTIxLjA3MSA0Ljk0NC45NCAzLjgyOC0yLjg1NyAxMC4yMTUtNi44ODkgMTAuODM4LTYuMTUyIDMuMTA2IDMuNjc0IDMuNDk5IDEyLjQyIDIuODI2IDE1LjkzOS0uMjIgMS4xNTEtMTAuNTA1LTEuMTM5LTEwLjUwNS0yLjM4IDAtNS4xNTItMS4zMzctNi41NjUtMi42NS02Ljcxem0tMjIuNTMtMS42MDljLjg0My0xLjMzMyA3LjY3NC4zMjUgMTEuNDI0IDEuOTkzIDAgMC0uNzcgMy40OTEuNDU2IDcuNjA0LjM1OSAxLjIwMy04LjYyNyA2LjU1OC05LjggNS42MzctMS4zNTUtMS4wNjUtMy44NS0xMi40MzItMi4wOC0xNS4yMzR6IiBmaWxsPSIjNGNiYTNjIi8+CiAgICA8cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im01NS4yNjkgNjguNDA2Yy41NTMtMi40MDMgMy4xMjctNi45MzIgMTIuMzIxLTYuODIyIDQuNjQ4LS4wMTkgMTAuNDIyLS4wMDIgMTQuMjUtLjQzNmE1MS4zMTIgNTEuMzEyIDAgMCAwIDEyLjcyNi0zLjA5NWMzLjk4LTEuNTE5IDUuMzkyLTEuMTggNS44ODctLjI3Mi41NDQuOTk5LS4wOTcgMi43MjItMS40ODggNC4zMDktMi42NTYgMy4wMy03LjQzMSA1LjM4LTE1Ljg2NSA2LjA3Ni04LjQzMy42OTgtMTQuMDItMS41NjUtMTYuNDI1IDIuMTE4LTEuMDM4IDEuNTg5LS4yMzYgNS4zMzMgNy45MiA2LjUxMiAxMS4wMiAxLjU5IDIwLjA3Mi0xLjkxNyAyMS4xOS4yMDEgMS4xMTkgMi4xMTgtNS4zMjMgNi40MjgtMTYuMzYyIDYuNTE4cy0xNy45MzQtMy44NjUtMjAuMzc5LTUuODNjLTMuMTAyLTIuNDk1LTQuNDktNi4xMzMtMy43NzUtOS4yNzl6IiBmaWxsPSIjZmMzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KICAgIDxnIGZpbGw9IiMxNDMwN2UiIG9wYWNpdHk9Ii44Ij4KICAgICAgPHBhdGggZD0ibTY5LjMyNyA0Mi4xMjdjLjYxNi0xLjAwOCAxLjk4MS0xLjc4NiA0LjIxNi0xLjc4NiAyLjIzNCAwIDMuMjg1Ljg4OSA0LjAxMyAxLjg4LjE0OC4yMDItLjA3Ni40NC0uMzA2LjM0YTU5Ljg2OSA1OS44NjkgMCAwIDEgLS4xNjgtLjA3M2MtLjgxNy0uMzU3LTEuODItLjc5NS0zLjU0LS44Mi0xLjgzOC0uMDI2LTIuOTk3LjQzNS0zLjcyNy44MzEtLjI0Ni4xMzQtLjYzNC0uMTMzLS40ODgtLjM3MnptLTI1LjE1NyAxLjI5YzIuMTctLjkwNyAzLjg3Ni0uNzkgNS4wODEtLjUwNC4yNTQuMDYuNDMtLjIxMy4yMjctLjM3Ny0uOTM1LS43NTUtMy4wMy0xLjY5Mi01Ljc2LS42NzQtMi40MzcuOTA5LTMuNTg1IDIuNzk2LTMuNTkyIDQuMDM4LS4wMDIuMjkyLjYuMzE3Ljc1Ni4wNy40Mi0uNjcgMS4xMi0xLjY0NiAzLjI4OS0yLjU1M3oiLz4KICAgICAgPHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNzUuNDQgNTUuOTJhMy40NyAzLjQ3IDAgMCAxIC0zLjQ3NC0zLjQ2MiAzLjQ3IDMuNDcgMCAwIDEgMy40NzUtMy40NiAzLjQ3IDMuNDcgMCAwIDEgMy40NzQgMy40NiAzLjQ3IDMuNDcgMCAwIDEgLTMuNDc1IDMuNDYyem0yLjQ0Ny00LjYwOGEuODk5Ljg5OSAwIDAgMCAtMS43OTkgMGMwIC40OTQuNDA1Ljg5NS45Ljg5NS40OTkgMCAuOS0uNC45LS44OTV6bS0yNS40NjQgMy41NDJhNC4wNDIgNC4wNDIgMCAwIDEgLTQuMDQ5IDQuMDM3IDQuMDQ1IDQuMDQ1IDAgMCAxIC00LjA1LTQuMDM3IDQuMDQ1IDQuMDQ1IDAgMCAxIDQuMDUtNC4wMzcgNC4wNDUgNC4wNDUgMCAwIDEgNC4wNSA0LjAzN3ptLTEuMTkzLTEuMzM4YTEuMDUgMS4wNSAwIDAgMCAtMi4wOTcgMCAxLjA0OCAxLjA0OCAwIDAgMCAyLjA5NyAweiIgZmlsbC1ydWxlPSJldmVub2RkIi8+CiAgICA8L2c+CiAgICA8cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im02NCAxMTcuNzVjMjkuNjg1IDAgNTMuNzUtMjQuMDY1IDUzLjc1LTUzLjc1cy0yNC4wNjUtNTMuNzUtNTMuNzUtNTMuNzUtNTMuNzUgMjQuMDY1LTUzLjc1IDUzLjc1IDI0LjA2NSA1My43NSA1My43NSA1My43NXptMCA1YzMyLjQ0NyAwIDU4Ljc1LTI2LjMwMyA1OC43NS01OC43NXMtMjYuMzAzLTU4Ljc1LTU4Ljc1LTU4Ljc1LTU4Ljc1IDI2LjMwMy01OC43NSA1OC43NSAyNi4zMDMgNTguNzUgNTguNzUgNTguNzV6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+');\n}\n\n/* Email tooltip specific */\n.tooltip__button--email {\n    flex-direction: column;\n    justify-content: center;\n    align-items: flex-start;\n    font-size: 14px;\n    padding: 4px 8px;\n}\n.tooltip__button--email__primary-text {\n    font-weight: bold;\n}\n.tooltip__button--email__secondary-text {\n    font-size: 12px;\n}\n\n/* Email Protection signup notice */\n:not(.top-autofill) .tooltip--email-signup {\n    text-align: left;\n    color: #222222;\n    padding: 16px 20px;\n    width: 380px;\n}\n\n.tooltip--email-signup h1 {\n    font-weight: 700;\n    font-size: 16px;\n    line-height: 1.5;\n    margin: 0;\n}\n\n.tooltip--email-signup p {\n    font-weight: 400;\n    font-size: 14px;\n    line-height: 1.4;\n}\n\n.notice-controls {\n    display: flex;\n}\n\n.tooltip--email-signup .notice-controls > * {\n    border-radius: 8px;\n    border: 0;\n    cursor: pointer;\n    display: inline-block;\n    font-family: inherit;\n    font-style: normal;\n    font-weight: bold;\n    padding: 8px 12px;\n    text-decoration: none;\n}\n\n.notice-controls .ghost {\n    margin-left: 1rem;\n}\n\n.tooltip--email-signup a.primary {\n    background: #3969EF;\n    color: #fff;\n}\n\n.tooltip--email-signup a.primary:hover,\n.tooltip--email-signup a.primary:focus {\n    background: #2b55ca;\n}\n\n.tooltip--email-signup a.primary:active {\n    background: #1e42a4;\n}\n\n.tooltip--email-signup button.ghost {\n    background: transparent;\n    color: #3969EF;\n}\n\n.tooltip--email-signup button.ghost:hover,\n.tooltip--email-signup button.ghost:focus {\n    background-color: rgba(0, 0, 0, 0.06);\n    color: #2b55ca;\n}\n\n.tooltip--email-signup button.ghost:active {\n    background-color: rgba(0, 0, 0, 0.12);\n    color: #1e42a4;\n}\n\n.tooltip--email-signup button.close-tooltip {\n    background-color: transparent;\n    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMiAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wLjI5Mjg5NCAwLjY1NjkwN0MwLjY4MzQxOCAwLjI2NjM4MyAxLjMxNjU4IDAuMjY2MzgzIDEuNzA3MTEgMC42NTY5MDdMNiA0Ljk0OThMMTAuMjkyOSAwLjY1NjkwN0MxMC42ODM0IDAuMjY2MzgzIDExLjMxNjYgMC4yNjYzODMgMTEuNzA3MSAwLjY1NjkwN0MxMi4wOTc2IDEuMDQ3NDMgMTIuMDk3NiAxLjY4MDYgMTEuNzA3MSAyLjA3MTEyTDcuNDE0MjEgNi4zNjQwMUwxMS43MDcxIDEwLjY1NjlDMTIuMDk3NiAxMS4wNDc0IDEyLjA5NzYgMTEuNjgwNiAxMS43MDcxIDEyLjA3MTFDMTEuMzE2NiAxMi40NjE2IDEwLjY4MzQgMTIuNDYxNiAxMC4yOTI5IDEyLjA3MTFMNiA3Ljc3ODIzTDEuNzA3MTEgMTIuMDcxMUMxLjMxNjU4IDEyLjQ2MTYgMC42ODM0MTcgMTIuNDYxNiAwLjI5Mjg5MyAxMi4wNzExQy0wLjA5NzYzMTEgMTEuNjgwNiAtMC4wOTc2MzExIDExLjA0NzQgMC4yOTI4OTMgMTAuNjU2OUw0LjU4NTc5IDYuMzY0MDFMMC4yOTI4OTQgMi4wNzExMkMtMC4wOTc2MzA2IDEuNjgwNiAtMC4wOTc2MzA2IDEuMDQ3NDMgMC4yOTI4OTQgMC42NTY5MDdaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjg0Ii8+Cjwvc3ZnPgo=);\n    background-position: center center;\n    background-repeat: no-repeat;\n    border: 0;\n    cursor: pointer;\n    padding: 16px;\n    position: absolute;\n    right: 12px;\n    top: 12px;\n}\n";

  // src/UI/HTMLTooltip.js
  var defaultOptions = {
    wrapperClass: "",
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
    isIncontextSignupAvailable: () => false
  };
  var HTMLTooltip = class {
    /**
     * @param config
     * @param inputType
     * @param getPosition
     * @param {HTMLTooltipOptions} options
     */
    constructor(config, inputType, getPosition, options) {
      __publicField(this, "isAboveInput", false);
      /** @type {HTMLTooltipOptions} */
      __publicField(this, "options");
      __publicField(this, "resObs", new ResizeObserver((entries) => entries.forEach(() => this.checkPosition())));
      __publicField(this, "mutObsCheckPositionWhenIdle", whenIdle.call(this, this.checkPosition));
      __publicField(this, "mutObs", new MutationObserver((mutationList) => {
        for (const mutationRecord of mutationList) {
          if (mutationRecord.type === "childList") {
            mutationRecord.addedNodes.forEach((el) => {
              if (el.nodeName === "DDG-AUTOFILL")
                return;
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
      this.config = config;
      this.subtype = getSubtypeFromType(inputType);
      this.variant = getVariantFromType(inputType);
      this.tooltip = null;
      this.getPosition = getPosition;
      const forcedVisibilityStyles = {
        "display": "block",
        "visibility": "visible",
        "opacity": "1"
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
        if (this.isHidden)
          return;
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
        if (overriddenTopPosition >= 0)
          return { left, top: overriddenTopPosition };
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
        if (overridePosition)
          this.updatePosition(element, overridePosition);
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
      if (!innerNode)
        return;
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
  var DataHTMLTooltip = class extends HTMLTooltip_default {
    renderEmailProtectionIncontextSignup(isOtherItems) {
      const dataTypeClass = `tooltip__button--data--identities`;
      const providerIconClass = "tooltip__button--data--duckduckgo";
      return `
            ${isOtherItems ? "<hr />" : ""}
            <button id="incontextSignup" class="tooltip__button tooltip__button--data ${dataTypeClass} ${providerIconClass} js-get-email-signup">
                <span class="tooltip__button__text-container">
                    <span class="label label--medium">
                        Hide your email and block trackers
                    </span>
                    <span class="label label--small">
                        Create a unique, random address that also removes hidden trackers and forwards email to your inbox.
                    </span>
                </span>
            </button>
        `;
    }
    /**
     * @param {InputTypeConfigs} config
     * @param {TooltipItemRenderer[]} items
     * @param {{
     *   onSelect(id:string): void
     *   onManage(type:InputTypeConfigs['type']): void
     *   onIncontextSignupDismissed?(data: {
     *      hasOtherOptions: Boolean
     *   }): void
     *   onIncontextSignup?(): void
     * }} callbacks
     */
    render(config, items, callbacks) {
      const { wrapperClass, css } = this.options;
      const isTopAutofill = wrapperClass?.includes("top-autofill");
      let hasAddedSeparator = false;
      const shouldShowSeparator = (dataId, index) => {
        const shouldShow = ["personalAddress", "privateAddress"].includes(dataId) && !hasAddedSeparator;
        if (shouldShow)
          hasAddedSeparator = true;
        const isFirst = index === 0;
        return shouldShow && !isFirst;
      };
      const shouldShowManageButton = isTopAutofill && items.some((item) => !["personalAddress", "privateAddress", PROVIDER_LOCKED].includes(item.id()));
      const topClass = wrapperClass || "";
      const dataTypeClass = `tooltip__button--data--${config.type}${this.variant ? "__" + this.variant : ""}`;
      this.shadow.innerHTML = `
${css}
<div class="wrapper wrapper--data ${topClass}" hidden>
    <div class="tooltip tooltip--data${this.options.isIncontextSignupAvailable() ? " tooltip--incontext-signup" : ""}">
        ${items.map((item, index) => {
        const credentialsProvider = item.credentialsProvider?.();
        const providerIconClass = credentialsProvider ? `tooltip__button--data--${credentialsProvider}` : "";
        const labelSmall = item.labelSmall?.(this.subtype);
        const label = item.label?.(this.subtype);
        return `
            ${shouldShowSeparator(item.id(), index) ? "<hr />" : ""}
            <button id="${item.id()}" class="tooltip__button tooltip__button--data ${dataTypeClass} ${providerIconClass} js-autofill-button">
                <span class="tooltip__button__text-container">
                    <span class="label label--medium">${escapeXML(item.labelMedium(this.subtype))}</span>
                    ${label ? `<span class="label">${escapeXML(label)}</span>` : ""}
                    ${labelSmall ? `<span class="label label--small">${escapeXML(labelSmall)}</span>` : ""}
                </span>
            </button>
        `;
      }).join("")}
        ${this.options.isIncontextSignupAvailable() ? this.renderEmailProtectionIncontextSignup(items.length > 0) : ""}
        ${shouldShowManageButton ? `
            <hr />
            <button id="manage-button" class="tooltip__button tooltip__button--manage" type="button">
                <span class="tooltip__button__text-container">
                    <span class="label label--medium">Manage ${config.displayName}\u2026</span>
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
  var DataHTMLTooltip_default = DataHTMLTooltip;

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
<div class="wrapper wrapper--email" hidden>
    <div class="tooltip tooltip--email">
        <button class="tooltip__button tooltip__button--email js-use-personal">
            <span class="tooltip__button--email__primary-text">
                Use <span class="js-address">${formatDuckAddress(escapeXML(this.addresses.personalAddress))}</span>
            </span>
            <span class="tooltip__button--email__secondary-text">Block email trackers</span>
        </button>
        <button class="tooltip__button tooltip__button--email js-use-private">
            <span class="tooltip__button--email__primary-text">Generate a Private Duck Address</span>
            <span class="tooltip__button--email__secondary-text">Block email trackers & hide address</span>
        </button>
    </div>
    <div class="tooltip--email__caret"></div>
</div>`;
      this.wrapper = this.shadow.querySelector(".wrapper");
      this.tooltip = this.shadow.querySelector(".tooltip");
      this.usePersonalButton = this.shadow.querySelector(".js-use-personal");
      this.usePrivateButton = this.shadow.querySelector(".js-use-private");
      this.addressEl = this.shadow.querySelector(".js-address");
      this.updateAddresses = (addresses) => {
        if (addresses && this.addressEl) {
          this.addresses = addresses;
          this.addressEl.textContent = formatDuckAddress(addresses.personalAddress);
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
  var EmailHTMLTooltip_default = EmailHTMLTooltip;

  // src/UI/EmailSignupHTMLTooltip.js
  var EmailSignupHTMLTooltip = class extends HTMLTooltip_default {
    /**
     * @param {import("../DeviceInterface/InterfacePrototype").default} device
     */
    render(device) {
      this.device = device;
      this.shadow.innerHTML = `
${this.options.css}
<div class="wrapper wrapper--email" hidden>
    <div class="tooltip tooltip--email tooltip--email-signup">
        <button class="close-tooltip js-close-email-signup" aria-label="Close"></button>
        <h1>
            Hide your email and block trackers
        </h1>
        <p>
            Create a unique, random address that also removes hidden trackers and forwards email to your inbox.
        </p>
        <div class="notice-controls">
            <a href="https://duckduckgo.com/email/start-incontext" target="_blank" class="primary js-get-email-signup">
                Protect My Email
            </a>
            <button class="ghost js-dismiss-email-signup">
                Don't Show Again
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
  var EmailSignupHTMLTooltip_default = EmailSignupHTMLTooltip;

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
     * @param {import('./UIController').AttachArgs} args
     */
    attach(args) {
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
     * @param {PosFn} getPosition
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
      if (this._options.tooltipKind === "legacy") {
        this._options.device.firePixel({ pixelName: "autofill_show" });
        return new EmailHTMLTooltip_default(config, topContextData.inputType, getPosition, tooltipOptions).render(this._options.device);
      }
      if (this._options.tooltipKind === "emailsignup") {
        this._options.device.firePixel({ pixelName: "incontext_show" });
        return new EmailSignupHTMLTooltip_default(config, topContextData.inputType, getPosition, tooltipOptions).render(this._options.device);
      }
      const data = this._dataForAutofill(config, topContextData.inputType, topContextData);
      const asRenderers = data.map((d) => config.tooltipItem(d));
      return new DataHTMLTooltip_default(config, topContextData.inputType, getPosition, tooltipOptions).render(config, asRenderers, {
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
      });
    }
    updateItems(data) {
      if (this._activeInputType === "unknown")
        return;
      const config = getInputConfigFromType(this._activeInputType);
      const asRenderers = data.map((d) => config.tooltipItem(d));
      const activeTooltip = this.getActiveTooltip();
      if (activeTooltip instanceof DataHTMLTooltip_default) {
        activeTooltip?.render(config, asRenderers, {
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
      if (!e.isTrusted)
        return;
      if (isEventWithinDax(e, e.target))
        return;
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
      if (!e.isTrusted)
        return;
      if (isEventWithinDax(e, e.target))
        return;
      if (e.target.nodeName === "DDG-AUTOFILL") {
        this._handleClickInTooltip(e);
      }
    }
    _handleClickInTooltip(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const isMainMouseButton = e.button === 0;
      if (!isMainMouseButton)
        return;
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
     *
     * @param {SupportedMainTypes} type
     * @returns {*}
     * @private
     */
    _onManage(type) {
      this.removeTooltip();
      switch (type) {
        case "credentials":
          return this._options.device.openManagePasswords();
        case "creditCards":
          return this._options.device.openManageCreditCards();
        case "identities":
          return this._options.device.openManageIdentities();
        default:
      }
    }
    _onIncontextSignupDismissed({ hasOtherOptions }) {
      this._options.device.inContextSignup?.onIncontextSignupDismissed({ shouldHideTooltip: !hasOtherOptions });
      if (hasOtherOptions) {
        const topContextData = this._options.device.getTopContextData();
        if (!topContextData)
          return;
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
      if (callback)
        await callback();
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
      return new Promise((resolve) => chrome.runtime.sendMessage(
        { getAddresses: true },
        (data) => {
          this.storeLocalAddresses(data);
          return resolve(data);
        }
      ));
    }
    /**
     * Used by the email web app
     * Settings page displays data of the logged in user data
     */
    getUserData() {
      return new Promise((resolve) => chrome.runtime.sendMessage(
        { getUserData: true },
        (data) => resolve(data)
      ));
    }
    /**
     * Used by the email web app
     * Device capabilities determine which functionality is available to the user
     */
    getEmailProtectionCapabilities() {
      return new Promise((resolve) => chrome.runtime.sendMessage(
        { getEmailProtectionCapabilities: true },
        (data) => resolve(data)
      ));
    }
    refreshAlias() {
      return chrome.runtime.sendMessage(
        { refreshAlias: true },
        (addresses) => this.storeLocalAddresses(addresses)
      );
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
        if (sender.id !== chrome.runtime.id)
          return;
        switch (message.type) {
          case "ddgUserReady":
            this.resetAutofillUI(() => this.setupSettingsPage({ shouldLog: true }));
            break;
          case "contextualAutofill":
            setValue(activeEl, formatDuckAddress(message.alias), this.globalConfig);
            activeEl.classList.add("ddg-autofilled");
            this.refreshAlias();
            activeEl.addEventListener(
              "input",
              (e) => e.target.classList.remove("ddg-autofilled"),
              { once: true }
            );
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
     * @param {import('./UIController').AttachArgs} args
     */
    attach(args) {
      const { getPosition, topContextData, click, input } = args;
      if (!input.parentNode)
        return;
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
          this.attach(args);
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
          testMode: this.isTestMode()
        };
        return new HTMLTooltipUIController({
          device: this,
          tooltipKind: "modern"
        }, options);
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
        if (!response)
          return;
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
      if (!this.globalConfig.isApp)
        return this.getAlias();
      const { addresses } = await this.deviceApi.request(createRequest("emailHandlerGetAddresses"));
      this.storeLocalAddresses(addresses);
      return addresses;
    }
    async refreshAlias() {
      await this.deviceApi.notify(createNotification("emailHandlerRefreshAlias"));
      if (this.globalConfig.isApp)
        this.getAddresses();
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
     * @returns {APIResponse<CreditCardObject>}
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
      const { alias } = await this.deviceApi.request(new GetAlias({
        requiresUserPermission: !this.globalConfig.isApp,
        shouldConsumeAliasIfProvided: !this.globalConfig.isApp,
        isIncontextSignupAvailable: this.inContextSignup.isAvailable()
      }));
      return alias ? formatDuckAddress(alias) : alias;
    }
    addLogoutListener(handler) {
      if (!this.globalConfig.isDDGDomain)
        return;
      window.addEventListener("message", (e) => {
        if (this.globalConfig.isDDGDomain && e.data.emailProtectionSignedOut) {
          handler();
        }
      });
    }
    async addDeviceListeners() {
      this.thirdPartyProvider.init();
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
        if (!topContextData)
          throw new Error("unreachable, topContextData should be available");
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
        let detailsEntries = Object.entries(data).map(([key, value]) => {
          return [key, String(value)];
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
      return new HTMLTooltipUIController({
        tooltipKind: (
          /** @type {const} */
          "modern"
        ),
        device: this
      }, {
        wrapperClass: "top-autofill",
        tooltipPositionClass: () => ".wrapper { transform: none; }",
        setSize: (details) => this.deviceApi.notify(createNotification("setSize", details)),
        remove: async () => this._closeAutofillParent(),
        testMode: this.isTestMode()
      });
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
      this.deviceApi.request(new GetAutofillDataCall(details), { signal: this._abortController.signal }).then((resp) => {
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
          default: {
            if (this.globalConfig.isDDGTestMode) {
              console.warn("unhandled response", resp);
            }
          }
        }
        return this._closeAutofillParent();
      }).catch((e) => {
        if (this.globalConfig.isDDGTestMode) {
          if (e.name === "AbortError") {
            console.log("Promise Aborted");
          } else {
            console.error("Promise Rejected", e);
          }
        }
      });
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
      if (!this.globalConfig.isDDGDomain)
        return;
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
      return new HTMLTooltipUIController({
        tooltipKind: (
          /** @type {const} */
          "modern"
        ),
        device: this
      }, {
        wrapperClass: "top-autofill",
        tooltipPositionClass: () => ".wrapper { transform: none; }",
        setSize: (details) => this.deviceApi.notify(new SetSizeCall(details)),
        remove: async () => this._closeAutofillParent(),
        testMode: this.isTestMode(),
        /**
         * Note: This is needed because Mutation observer didn't support visibility checks on Windows
         */
        checkVisibility: false
      });
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
     * @param {Number} id
     * @returns {Promise<{success: IdentityObject|undefined}>}
     */
    getAutofillIdentity(id) {
      const identity = this.getLocalIdentities().find(({ id: identityId }) => `${identityId}` === `${id}`);
      return Promise.resolve({ success: identity });
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
    let deviceApi = new DeviceApi(globalConfig.isDDGTestMode ? loggingTransport : transport);
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
    if (!window.isSecureContext)
      return false;
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
