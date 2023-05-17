const FORM_INPUTS_SELECTOR = `
input:not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=hidden]):not([type=file]):not([type=search]):not([type=reset]):not([name^=fake i]):not([data-description^=dummy i]):not([name*=otp]),
[autocomplete=username],
select`

const SUBMIT_BUTTON_SELECTOR = `
input[type=submit],
input[type=button],
button:not([role=switch]):not([role=link]),
[role=button],
a[href="#"][id*=button i],
a[href="#"][id*=btn i]`

const email = `
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
input[autocomplete=email]`

// We've seen non-standard types like 'user'. This selector should get them, too
const GENERIC_TEXT_FIELD = `
input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=file]):not([type=hidden]):not([type=month]):not([type=number]):not([type=radio]):not([type=range]):not([type=reset]):not([type=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week])`

const password = `input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code]):not([name*=answer i]):not([name*=mfa i]):not([name*=tin i])`

const cardName = `
input[autocomplete="cc-name" i],
input[autocomplete="ccname" i],
input[name="ccname" i],
input[name="cc-name" i],
input[name="ppw-accountHolderName" i],
input[id*=cardname i],
input[id*=card-name i],
input[id*=card_name i]`

const cardNumber = `
input[autocomplete="cc-number" i],
input[autocomplete="ccnumber" i],
input[autocomplete="cardnumber" i],
input[autocomplete="card-number" i],
input[name="ccnumber" i],
input[name="cc-number" i],
input[name*=card i][name*=number i],
input[name*=cardnumber i],
input[id*=cardnumber i],
input[id*=card-number i],
input[id*=card_number i]`

const cardSecurityCode = `
input[autocomplete="cc-csc" i],
input[autocomplete="csc" i],
input[autocomplete="cc-cvc" i],
input[autocomplete="cvc" i],
input[name="cvc" i],
input[name="cc-cvc" i],
input[name="cc-csc" i],
input[name="csc" i],
input[name*=security i][name*=code i]`

const expirationMonth = `
[autocomplete="cc-exp-month" i],
[autocomplete="cc_exp_month" i],
[name="ccmonth" i],
[name="ppw-expirationDate_month" i],
[name=cardExpiryMonth i],
[name*=ExpDate_Month i],
[name*=expiration i][name*=month i],
[id*=expiration i][id*=month i],
[name*=cc-exp-month i],
[name*=cc_exp_month i]`

const expirationYear = `
[autocomplete="cc-exp-year" i],
[autocomplete="cc_exp_year" i],
[name="ccyear" i],
[name="ppw-expirationDate_year" i],
[name=cardExpiryYear i],
[name*=ExpDate_Year i],
[name*=expiration i][name*=year i],
[id*=expiration i][id*=year i],
[name*=cc-exp-year i],
[name*=cc_exp_year i]`

const expiration = `
[autocomplete="cc-exp" i],
[name="cc-exp" i],
[name="exp-date" i],
[name="expirationDate" i],
input[id*=expiration i]`

const firstName = `
[name*=fname i], [autocomplete*=given-name i],
[name*=firstname i], [autocomplete*=firstname i],
[name*=first-name i], [autocomplete*=first-name i],
[name*=first_name i], [autocomplete*=first_name i],
[name*=givenname i], [autocomplete*=givenname i],
[name*=given-name i],
[name*=given_name i], [autocomplete*=given_name i],
[name*=forename i], [autocomplete*=forename i]`

const middleName = `
[name*=mname i], [autocomplete*=additional-name i],
[name*=middlename i], [autocomplete*=middlename i],
[name*=middle-name i], [autocomplete*=middle-name i],
[name*=middle_name i], [autocomplete*=middle_name i],
[name*=additionalname i], [autocomplete*=additionalname i],
[name*=additional-name i],
[name*=additional_name i], [autocomplete*=additional_name i]`

const lastName = `
[name=lname], [autocomplete*=family-name i],
[name*=lastname i], [autocomplete*=lastname i],
[name*=last-name i], [autocomplete*=last-name i],
[name*=last_name i], [autocomplete*=last_name i],
[name*=familyname i], [autocomplete*=familyname i],
[name*=family-name i],
[name*=family_name i], [autocomplete*=family_name i],
[name*=surname i], [autocomplete*=surname i]`

const fullName = `
[name=name], [autocomplete=name],
[name*=fullname i], [autocomplete*=fullname i],
[name*=full-name i], [autocomplete*=full-name i],
[name*=full_name i], [autocomplete*=full_name i],
[name*=your-name i], [autocomplete*=your-name i]`

const phone = `
[name*=phone i]:not([name*=extension i]):not([name*=type i]):not([name*=country i]),
[name*=mobile i]:not([name*=type i]),
[autocomplete=tel],
[autocomplete="tel-national"],
[placeholder*="phone number" i]`

const addressStreet1 = `
[name=address i], [autocomplete=street-address i], [autocomplete=address-line1 i],
[name=street i],
[name=ppw-line1 i], [name*=addressLine1 i]`

const addressStreet2 = `
[name=address2 i], [autocomplete=address-line2 i],
[name=ppw-line2 i], [name*=addressLine2 i]`

const addressCity = `
[name=city i], [autocomplete=address-level2 i],
[name=ppw-city i], [name*=addressCity i]`

const addressProvince = `
[name=province i], [name=state i], [autocomplete=address-level1 i]`

const addressPostalCode = `
[name=zip i], [name=zip2 i], [name=postal i], [autocomplete=postal-code i], [autocomplete=zip-code i],
[name*=postalCode i], [name*=zipcode i]`

const addressCountryCode = [
    `[name=country i], [autocomplete=country i],
     [name*=countryCode i], [name*=country-code i],
     [name*=countryName i], [name*=country-name i]`,
    `select.idms-address-country` // Fix for Apple signup
]

const birthdayDay = `
[name=bday-day i],
[name*=birthday_day i], [name*=birthday-day i],
[name=date_of_birth_day i], [name=date-of-birth-day i],
[name^=birthdate_d i], [name^=birthdate-d i],
[aria-label="birthday" i][placeholder="day" i]`

const birthdayMonth = `
[name=bday-month i],
[name*=birthday_month i], [name*=birthday-month i],
[name=date_of_birth_month i], [name=date-of-birth-month i],
[name^=birthdate_m i], [name^=birthdate-m i],
select[name="mm" i]`

const birthdayYear = `
[name=bday-year i],
[name*=birthday_year i], [name*=birthday-year i],
[name=date_of_birth_year i], [name=date-of-birth-year i],
[name^=birthdate_y i], [name^=birthdate-y i],
[aria-label="birthday" i][placeholder="year" i]`

const username = [
    `${GENERIC_TEXT_FIELD}[autocomplete^=user i]`,
    `input[name=username i]`,
    // fix for `aa.com`
    `input[name="loginId" i]`,
    // fix for https://online.mbank.pl/pl/Login
    `input[name="userid" i]`,
    `input[name="user_id" i]`,
    `input[name="user-id" i]`,
    `input[id="login-id" i]`,
    `input[name="login" i]`,
    `input[name=accountname i]`,
    `input[autocomplete=username i]`,
    `input[name*=accountid i]`,
    `input[name="j_username" i]`,
    // https://account.uwindsor.ca/login
    `input[name="uwinid" i]`,
    `input[id="username" i]`,
    `input[name="_user" i]`,
    `input[name="login_username" i]`,
    `input[placeholder^="username" i]`
]

// todo: these are still used directly right now, mostly in scanForInputs
// todo: ensure these can be set via configuration
export { FORM_INPUTS_SELECTOR, SUBMIT_BUTTON_SELECTOR }

// Exported here for now, to be moved to configuration later
// eslint-disable-next-line camelcase
export const __secret_do_not_use = {
    GENERIC_TEXT_FIELD,
    SUBMIT_BUTTON_SELECTOR,
    FORM_INPUTS_SELECTOR,
    email: email,
    password,
    username,
    cardName,
    cardNumber,
    cardSecurityCode,
    expirationMonth,
    expirationYear,
    expiration,

    firstName,
    middleName,
    lastName,
    fullName,
    phone,
    addressStreet1,
    addressStreet2,
    addressCity,
    addressProvince,
    addressPostalCode,
    addressCountryCode,
    birthdayDay,
    birthdayMonth,
    birthdayYear
}
