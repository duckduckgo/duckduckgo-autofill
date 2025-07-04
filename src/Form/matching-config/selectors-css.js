// We've seen non-standard types like 'user'. This selector should get them, too
const genericTextInputField = `
input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=radio]):not([type=range]):not([type=reset]):not([type=image]):not([type=search]):not([role=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week]):not([name^=fake i]):not([data-description^=dummy i]):not([name*=otp]):not([autocomplete="fake"]):not([placeholder^=search i]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=month])`;

const formInputsSelectorWithoutSelect = [genericTextInputField, '[autocomplete=username]'];

const formInputsSelector = [...formInputsSelectorWithoutSelect, 'select'];

const submitButtonSelector = `
input[type=submit],
input[type=button],
input[type=image],
button:not([role=switch]):not([role=link]):not([aria-label="clear" i]),
[role=button]:not([aria-label="clear" i]),
a[href="#"][id*=button i],
a[href="#"][id*=btn i]`;

const safeUniversalSelector = '*:not(select):not(option):not(script):not(noscript):not(style):not(br)';

const emailAddress = [
    `
input:not([type])[name*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([name*=code i]),
input[type=""][name*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([type=tel]),
input[type=text][name*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([name*=title i]):not([name*=tab i]):not([name*=code i]),
input:not([type])[placeholder*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]):not([name*=code i]),
input[type=text][placeholder*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]),
input[type=""][placeholder*=email i]:not([placeholder*=search i]):not([placeholder*=filter i]):not([placeholder*=subject i]),
input[type=email],
input[type=text][aria-label*=email i]:not([aria-label*=search i]),
input:not([type])[aria-label*=email i]:not([aria-label*=search i]),
input[name=username][type=email],
input[autocomplete=username][type=email],
input[autocomplete=username][placeholder*=email i],
input[autocomplete=email]`,
    // https://account.nicovideo.jp/login
    `input[name="mail_tel" i]`,
    // https://www.morningstar.it/it/membership/LoginPopup.aspx
    `input[value=email i]`,
];

const username = [
    `${genericTextInputField}[autocomplete^=user i]`,
    `input[name=username i]`,
    // fix for `aa.com`
    `input[name="loginId" i]`,
    // fix for https://online.mbank.pl/pl/Login
    `input[name="userid" i]`,
    `input[id="userid" i]`,
    `input[name="user_id" i]`,
    `input[name="user-id" i]`,
    `input[id="login-id" i]`,
    `input[id="login_id" i]`,
    `input[id="loginid" i]`,
    `input[name="login" i]`,
    `input[name=accountname i]`,
    `input[autocomplete=username i]`,
    `input[name*=accountid i]`,
    `input[name="j_username" i]`,
    `input[id="j_username" i]`,
    // https://account.uwindsor.ca/login
    `input[name="uwinid" i]`,
    // livedoor.com
    `input[name="livedoor_id" i]`,
    // https://login.oracle.com/mysso/signon.jsp?request_id=
    `input[name="ssousername" i]`,
    // https://secure.nsandi.com/
    `input[name="j_userlogin_pwd" i]`,
    // https://freelance.habr.com/users/sign_up
    `input[name="user[login]" i]`,
    // https://weblogin.utoronto.ca
    `input[name="user" i]`,
    // https://customerportal.mastercard.com/login
    `input[name$="_username" i]`,
    // https://accounts.hindustantimes.com/?type=plain&ref=lm
    `input[id="lmSsoinput" i]`,
    // bigcartel.com/login
    `input[name="account_subdomain" i]`,
    // https://www.mydns.jp/members/
    `input[name="masterid" i]`,
    // https://giris.turkiye.gov.tr
    `input[name="tridField" i]`,
    // https://membernetprb2c.b2clogin.com
    `input[id="signInName" i]`,
    // https://www.w3.org/accounts/request
    `input[id="w3c_accountsbundle_accountrequeststep1_login" i]`,
    `input[id="username" i]`,
    `input[name="_user" i]`,
    `input[name="login_username" i]`,
    // https://www.flytap.com/
    `input[name^="login-user-account" i]`,
    // https://www.sanitas.es
    `input[id="loginusuario" i]`,
    // https://www.guardiacivil.es/administracion/login.html
    `input[name="usuario" i]`,
    // https://m.bintercanarias.com/
    `input[id="UserLoginFormUsername" i]`,
    // https://id.docker.com/login
    `input[id="nw_username" i]`,
    // https://appleid.apple.com/es/sign-in (needed for all languages)
    `input[can-field="accountName"]`,
    // https://www.fullcolor.com/customer/account/login/
    `input[name="login[username]"]`,
    `input[placeholder^="username" i]`,
];

const password = [
    `input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code]):not([name*=answer i]):not([name*=mfa i]):not([name*=tin i]):not([name*=card i]):not([name*=cvv i])`,
    // DDG's CloudSave feature https://duckduckgo.com/settings
    'input.js-cloudsave-phrase',
];

const cardName = `
input[autocomplete="cc-name" i],
input[autocomplete="ccname" i],
input[name="ccname" i],
input[name="cc-name" i],
input[name="ppw-accountHolderName" i],
input[name="payment[name]"],
input[id="cc-name" i],
input[id="ccname" i],
input[id*=cardname i],
input[id*=card-name i],
input[id*=card_name i]`;

const cardNumber = `
input[autocomplete="cc-number" i],
input[autocomplete="ccnumber" i],
input[autocomplete="cardnumber" i],
input[autocomplete="card-number" i],
input[name="ccnumber" i],
input[name="cc-number" i],
input[name*=card i][name*=number i]:not([name*=verif i]):not([name*=phone i]):not([name*=secur i]),
input[name*=cardnumber i],
input[name="payment[card_no]"],
input[id="cc-number" i],
input[id="ccnumber" i],
input[id*=cardnumber i],
input[id*=card-number i],
input[id*=card_number i]`;

const cardSecurityCode = `
input[autocomplete="cc-csc" i],
input[autocomplete="csc" i],
input[autocomplete="cc-cvc" i],
input[autocomplete="cvc" i],
input[name*="cvc" i],
input[name*="cvv" i],
input[name="cc-cvc" i],
input[name="cc-csc" i],
input[name="csc" i],
input[name*=security i][name*=code i],
input[id="cc-csc" i],
input[id="csc" i],
input[id="cc-cvc" i],
input[id="cvc" i]`;

const expirationMonth = `
[autocomplete="cc-exp-month" i],
[autocomplete="cc_exp_month" i],
[name="ccmonth" i],
[name="ppw-expirationDate_month" i],
[name=cardExpiryMonth i],
[name*=ExpDate_Month i],
[name*=exp i][name*=month i]:not([name*=year i]),
[id*=exp i][id*=month i]:not([id*=year i]),
[name*=cc-exp-month i],
[name*="card_exp-month" i],
[name*=cc_exp_month i],
[id="cc-exp-month" i],
[id="cc_exp_month" i],
[id*=cc-month i]`;

const expirationYear = `
[autocomplete="cc-exp-year" i],
[autocomplete="cc_exp_year" i],
[name="ccyear" i],
[name="ppw-expirationDate_year" i],
[name=cardExpiryYear i],
[name*=ExpDate_Year i],
[name*=exp i][name*=year i]:not([name*=month i]),
[id*=exp i][id*=year i]:not([id*=month i]),
[name*="cc-exp-year" i],
[name*="card_exp-year" i],
[name*=cc_exp_year i],
[id="cc-exp-year" i],
[id="cc_exp_year" i],
[id*=cc-year i]`;

const expiration = `
[autocomplete="cc-exp" i],
[name="cc-exp" i],
[name="exp-date" i],
input[name="expiry" i],
[name="expirationDate" i],
input[name*=ex][placeholder="mm/yy" i],
[id="cc-exp" i],
input[id*=expiration i]`;

const firstName = `
[name*=fname i], [autocomplete*=given-name i],
[name*=firstname i], [autocomplete*=firstname i],
[name*=first-name i], [autocomplete*=first-name i],
[name*=first_name i], [autocomplete*=first_name i],
[name*=givenname i], [autocomplete*=givenname i],
[name*=given-name i],
[name*=given_name i], [autocomplete*=given_name i],
[name*=forename i], [autocomplete*=forename i]`;

const middleName = `
[name*=mname i], [autocomplete*=additional-name i],
[name*=middlename i], [autocomplete*=middlename i],
[name*=middle-name i], [autocomplete*=middle-name i],
[name*=middle_name i], [autocomplete*=middle_name i],
[name*=additionalname i], [autocomplete*=additionalname i],
[name*=additional-name i],
[name*=additional_name i], [autocomplete*=additional_name i]`;

const lastName = `
[name=lname], [autocomplete*=family-name i],
[name*=lastname i], [autocomplete*=lastname i],
[name*=last-name i], [autocomplete*=last-name i],
[name*=last_name i], [autocomplete*=last_name i],
[name*=familyname i], [autocomplete*=familyname i],
[name*=family-name i],
[name*=family_name i], [autocomplete*=family_name i],
[name*=surname i], [autocomplete*=surname i]`;

const fullName = `
[autocomplete=name],
[name*=fullname i], [autocomplete*=fullname i],
[name*=full-name i], [autocomplete*=full-name i],
[name*=full_name i], [autocomplete*=full_name i],
[name*=your-name i], [autocomplete*=your-name i]`;

const phone = `
[name*=phone i]:not([name*=extension i]):not([name*=type i]):not([name*=country i]),
[name*=mobile i]:not([name*=type i]),
[autocomplete=tel],
[autocomplete="tel-national"],
[placeholder*="phone number" i]`;

const addressStreet = `
[name=address i], [autocomplete=street-address i], [autocomplete=address-line1 i],
[name=street i],
[name=ppw-line1 i], [name*=addressLine1 i]`;

const addressStreet2 = `
[name=address2 i], [autocomplete=address-line2 i],
[name=ppw-line2 i], [name*=addressLine2 i]`;

const addressCity = `
[name=city i], [autocomplete=address-level2 i],
[name=ppw-city i], [name*=addressCity i]`;

const addressProvince = `
[name=province i], [name=state i], [autocomplete=address-level1 i]`;

const addressPostalCode = `
[name=zip i], [name=zip2 i], [name=postal i], [autocomplete=postal-code i], [autocomplete=zip-code i],
[name*=postalCode i], [name*=zipcode i]`;

const addressCountryCode = [
    `[name=country i], [autocomplete=country i],
     [name*=countryCode i], [name*=country-code i],
     [name*=countryName i], [name*=country-name i]`,
    `select.idms-address-country`, // Fix for Apple signup
];

const birthdayDay = `
[autocomplete=bday-day i],
[name=bday-day i],
[name*=birthday_day i], [name*=birthday-day i],
[name=date_of_birth_day i], [name=date-of-birth-day i],
[name^=birthdate_d i], [name^=birthdate-d i],
[aria-label="birthday" i][placeholder="day" i]`;

const birthdayMonth = `
[autocomplete=bday-month i],
[name=bday-month i],
[name*=birthday_month i], [name*=birthday-month i],
[name=date_of_birth_month i], [name=date-of-birth-month i],
[name^=birthdate_m i], [name^=birthdate-m i],
select[name="mm" i]`;

const birthdayYear = `
[autocomplete=bday-year i],
[name=bday-year i],
[name*=birthday_year i], [name*=birthday-year i],
[name=date_of_birth_year i], [name=date-of-birth-year i],
[name^=birthdate_y i], [name^=birthdate-y i],
[aria-label="birthday" i][placeholder="year" i]`;

const selectors = {
    // Generic
    genericTextInputField,
    submitButtonSelector,
    formInputsSelectorWithoutSelect,
    formInputsSelector,
    safeUniversalSelector,

    // Credentials
    emailAddress,
    username,
    password,

    // Credit Card
    cardName,
    cardNumber,
    cardSecurityCode,
    expirationMonth,
    expirationYear,
    expiration,

    // Identities
    firstName,
    middleName,
    lastName,
    fullName,
    phone,
    addressStreet,
    addressStreet2,
    addressCity,
    addressProvince,
    addressPostalCode,
    addressCountryCode,
    birthdayDay,
    birthdayMonth,
    birthdayYear,
};

module.exports = { selectors };
