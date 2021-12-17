const FORM_ELS_SELECTOR = `
input:not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=hidden]),
select`

const EMAIL_SELECTOR = `
input:not([type])[name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=""][name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=text][name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input:not([type])[id*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=""][id*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input:not([type])[placeholder*=mail i]:not([placeholder*=search i]):not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=text][placeholder*=mail i]:not([placeholder*=search i]):not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=""][placeholder*=mail i]:not([placeholder*=search i]):not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input:not([type])[placeholder*=mail i]:not([placeholder*=search i]):not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=email]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=text][aria-label*=mail i]:not([aria-label*=search i]),
input:not([type])[aria-label*=mail i]:not([aria-label*=search i]),
input[type=text][placeholder*=mail i]:not([placeholder*=search i]):not([readonly]),
input[autocomplete=email]:not([readonly]):not([hidden]):not([disabled])`

/** @type Matcher */
const EMAIL_MATCHER = {
    type: 'email',
    selector: EMAIL_SELECTOR,
    matcherFn: (string) =>
        /.mail/i.test(string) && !/search/i.test(string)
}

// We've seen non-standard types like 'user'. This selector should get them, too
const GENERIC_TEXT_FIELD = `
input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=file]):not([type=hidden]):not([type=month]):not([type=number]):not([type=radio]):not([type=range]):not([type=reset]):not([type=search]):not([type=submit]):not([type=time]):not([type=url]):not([type=week]):not([readonly]):not([disabled])`

const PASSWORD_SELECTOR = `input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code])`

/** @type Matcher */
const PASSWORD_MATCHER = {
    type: 'password',
    selector: PASSWORD_SELECTOR,
    matcherFn: (string) =>
        /password/i.test(string) && !/captcha/i.test(string)
}

// This is more generic, used only when we have identified a form
const USERNAME_SELECTOR = `${GENERIC_TEXT_FIELD}[autocomplete^=user]`

/** @type Matcher */
const USERNAME_MATCHER = {
    type: 'username',
    selector: USERNAME_SELECTOR,
    matcherFn: (string) =>
        /user((.)?(name|id))?$/i.test(string) && !/search/i.test(string)
}

const CC_NAME_SELECTOR = `
input[autocomplete="cc-name"],
input[autocomplete="ccname"],
input[name="ccname"],
input[name="cc-name"],
input[name="ppw-accountHolderName"],
input[id*=cardname i],
input[id*=card-name i],
input[id*=card_name i]`

const CC_NUMBER_SELECTOR = `
input[autocomplete="cc-number"],
input[autocomplete="ccnumber"],
input[autocomplete="cardnumber"],
input[autocomplete="card-number"],
input[name="ccnumber"],
input[name="cc-number"],
input[name="cardnumber"],
input[name="card-number"],
input[name*=creditCardNumber i],
input[id*=cardnumber i],
input[id*=card-number i],
input[id*=card_number i]`

const CC_CVC_SELECTOR = `
input[autocomplete="cc-csc"],
input[autocomplete="csc"],
input[autocomplete="cc-cvc"],
input[autocomplete="cvc"],
input[name="cvc"],
input[name="cc-cvc"],
input[name="cc-csc"],
input[name="csc"],
input[name="securityCode"]`

const CC_MONTH_SELECTOR = `
[autocomplete="cc-exp-month"],
[name="ccmonth"],
[name="ppw-expirationDate_month"],
[name=cardExpiryMonth],
[name="expiration-month"]`

const CC_YEAR_SELECTOR = `
[autocomplete="cc-exp-year"],
[name="ccyear"],
[name="ppw-expirationDate_year"],
[name=cardExpiryYear],
[name="expiration-year"]`

const CC_EXP_SELECTOR = `
[autocomplete="cc-exp"],
[name="cc-exp"],
[name="exp-date"],
[name="expirationDate"],
input[id*=expiration i],
select[id*=expiration i]`

// Matches strings like mm/yy, mm-yyyy, mm-aa
const DATE_SEPARATOR_REGEX = /\w\w\s?(?<separator>[/\s.\-_—–])\s?\w\w/i
// Matches 4 non-digit repeated characters (YYYY or AAAA) or 4 digits (2022)
const FOUR_DIGIT_YEAR_REGEX = /(\D)\1{3}|\d{4}/i

/**
 * This is used to map a selector with the data type we store for credit cards
 * @type Matcher[]
 */
const CC_MATCHERS_LIST = [
    {
        type: 'cardName',
        selector: CC_NAME_SELECTOR,
        matcherFn: (string) =>
            /(card.*name|name.*card)|(card.*holder|holder.*card)|(card.*owner|owner.*card)/i.test(string)
    },
    {
        type: 'cardNumber',
        selector: CC_NUMBER_SELECTOR,
        matcherFn: (string) =>
            /card.*number|number.*card/i.test(string)
    },
    {
        type: 'cardSecurityCode',
        selector: CC_CVC_SELECTOR,
        matcherFn: (string) =>
            /security.?code|card.?verif|cvv|csc|cvc/i.test(string)
    },
    {
        type: 'expirationMonth',
        selector: CC_MONTH_SELECTOR,
        matcherFn: (string) =>
            /(card|\bcc\b)?.?(exp(iry|iration)?)?.?(month|\bmm\b(?![.\s/-]yy))/i.test(string) &&
            !/mm[/\s.\-_—–]/i.test(string)
    },
    {
        type: 'expirationYear',
        selector: CC_YEAR_SELECTOR,
        matcherFn: (string) =>
            /(card|\bcc\b)?.?(exp(iry|iration)?)?.?(year|yy)/i.test(string) &&
            !/mm[/\s.\-_—–]/i.test(string)
    },
    {
        type: 'expiration',
        selector: CC_EXP_SELECTOR,
        matcherFn: (string) =>
            /(\bmm\b|\b\d\d\b)[/\s.\-_—–](\byy|\bjj|\baa|\b\d\d)|\bexp|\bvalid(idity| through| until)/i.test(string) &&
            !/invalid/i.test(string) &&
            // if there are more than six digits it could be a phone number
            string.replace(/\D+/g, '').length <= 6
    }
]

const CC_FIELD_SELECTOR = CC_MATCHERS_LIST.map(({selector}) => selector).join(', ')

const ID_FIRST_NAME_SELECTOR = `
[name*=fname i], [autocomplete*=given-name i],
[name*=firstname i], [autocomplete*=firstname i],
[name*=first-name i], [autocomplete*=first-name i],
[name*=first_name i], [autocomplete*=first_name i],
[name*=givenname i], [autocomplete*=givenname i],
[name*=given-name i],
[name*=given_name i], [autocomplete*=given_name i],
[name*=forename i], [autocomplete*=forename i]`

const ID_MIDDLE_NAME_SELECTOR = `
[name*=mname i], [autocomplete*=additional-name i],
[name*=middlename i], [autocomplete*=middlename i],
[name*=middle-name i], [autocomplete*=middle-name i],
[name*=middle_name i], [autocomplete*=middle_name i],
[name*=additionalname i], [autocomplete*=additionalname i],
[name*=additional-name i],
[name*=additional_name i], [autocomplete*=additional_name i]`

const ID_LAST_NAME_SELECTOR = `
[name=lname], [autocomplete*=family-name i],
[name*=lastname i], [autocomplete*=lastname i],
[name*=last-name i], [autocomplete*=last-name i],
[name*=last_name i], [autocomplete*=last_name i],
[name*=familyname i], [autocomplete*=familyname i],
[name*=family-name i],
[name*=family_name i], [autocomplete*=family_name i],
[name*=surname i], [autocomplete*=surname i]`

const ID_NAME_SELECTOR = `
[name=name], [autocomplete=name],
[name*=fullname i], [autocomplete*=fullname i],
[name*=full-name i], [autocomplete*=full-name i],
[name*=full_name i], [autocomplete*=full_name i],
[name*=your-name i], [autocomplete*=your-name i]`

const ID_PHONE_SELECTOR = `
[name*=phone i], [name*=mobile i], [autocomplete=tel]`

const ID_ADDRESS_STREET = `
[name=address], [autocomplete=street-address], [autocomplete=address-line1],
[name=ppw-line1]`

const ID_CITY_STREET = `
[name=city], [autocomplete=address-level2],
[name=ppw-city]`

const ID_PROVINCE_STREET = `
[name=province], [name=state], [autocomplete=address-level1]`

const ID_POSTAL_CODE = `
[name=zip], [name=zip2], [name=postal], [autocomplete=postal-code], [autocomplete=zip-code],
[name*=postalCode i], [name*=zipcode i]`

const ID_COUNTRY = `
[name=country] [autocomplete=country],
[name*=countryCode i], [name*=country-code i],
[name*=countryName i], [name*=country-name i]`

/** @type Matcher[] */
const ID_MATCHERS_LIST = [
    {
        type: 'firstName',
        selector: ID_FIRST_NAME_SELECTOR,
        matcherFn: (string) =>
            /(first|given|fore).?name/i.test(string)
    },
    {
        type: 'middleName',
        selector: ID_MIDDLE_NAME_SELECTOR,
        matcherFn: (string) =>
            /(middle|additional).?name/i.test(string)
    },
    {
        type: 'lastName',
        selector: ID_LAST_NAME_SELECTOR,
        matcherFn: (string) =>
            // matches surname, but not Suriname, the country
            /(last|family|sur)[^i]?name/i.test(string)
    },
    {
        type: 'fullName',
        selector: ID_NAME_SELECTOR,
        matcherFn: (string) =>
            /\bname\b/i.test(string) && !/company|org/i.test(string)
    },
    {
        type: 'phone',
        selector: ID_PHONE_SELECTOR,
        matcherFn: (string) =>
            /phone/i.test(string) &&
            !/code|pass/i.test(string)
    },
    {
        type: 'addressStreet',
        selector: ID_ADDRESS_STREET,
        matcherFn: (string) =>
            /address/i.test(string) &&
            !/email|\bip\b|address(.?line)?.?2|duck|log.?in|sign.?in/i.test(string)
    },
    {
        type: 'addressCity',
        selector: ID_CITY_STREET,
        matcherFn: (string) =>
            /city|town/i.test(string) && !/vatican/i.test(string)
    },
    {
        type: 'addressProvince',
        selector: ID_PROVINCE_STREET,
        matcherFn: (string) =>
            /state|province|region|county/i.test(string) && !/country|united/i.test(string)
    },
    {
        type: 'addressPostalCode',
        selector: ID_POSTAL_CODE,
        matcherFn: (string) =>
            /\bzip\b|postal|post.?code/i.test(string)
    },
    {
        type: 'addressCountryCode',
        selector: ID_COUNTRY,
        matcherFn: (string) =>
            /country/i.test(string)
    }
]

const ID_FIELD_SELECTOR = ID_MATCHERS_LIST.map(({selector}) => selector).join(', ')

const FIELD_SELECTOR =
    [PASSWORD_SELECTOR, GENERIC_TEXT_FIELD, EMAIL_SELECTOR,
        CC_FIELD_SELECTOR, ID_FIELD_SELECTOR].join(', ')

const SUBMIT_BUTTON_SELECTOR = `
input[type=submit],
input[type=button],
button:not([role=switch]):not([role=link]),
[role=button]`

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
}
