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
    regex: /.mail/i,
    negativeRegex: /search/i
}

// We've seen non-standard types like 'user'. This selector should get them, too
const GENERIC_TEXT_FIELD = `
input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=date]):not([type=datetime-local]):not([type=datetime]):not([type=file]):not([type=hidden]):not([type=month]):not([type=number]):not([type=radio]):not([type=range]):not([type=reset]):not([type=search]):not([type=submit]):not([type=tel]):not([type=time]):not([type=url]):not([type=week]):not([readonly]):not([disabled])`

const PASSWORD_SELECTOR = `input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code])`

/** @type Matcher */
const PASSWORD_MATCHER = {
    type: 'password',
    selector: PASSWORD_SELECTOR,
    regex: /password/i,
    negativeRegex: /captcha/i
}

// This is more generic, used only when we have identified a form
const USERNAME_SELECTOR = `${GENERIC_TEXT_FIELD}[autocomplete^=user]`

/** @type Matcher */
const USERNAME_MATCHER = {
    type: 'username',
    selector: USERNAME_SELECTOR,
    regex: /user((.)?name)?$/i,
    negativeRegex: /search/i
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
input[name="creditCardNumber"],
input[name="addCreditCardNumber"],
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
[name="ppw-expirationDate_month"]`

const CC_YEAR_SELECTOR = `
[autocomplete="cc-exp-year"],
[name="ccyear"],
[name="ppw-expirationDate_year"]`

const CC_EXP_SELECTOR = `
[autocomplete="cc-exp"],
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
 * @type {[Matcher]}
 */
const CC_MATCHERS_LIST = [
    {
        type: 'cardName',
        selector: CC_NAME_SELECTOR,
        regex: /(card.*name|name.*card)|(card.*holder|holder.*card)|(card.*owner|owner.*card)/i
    },
    {
        type: 'cardNumber',
        selector: CC_NUMBER_SELECTOR,
        regex: /card.*number|number.*card/i
    },
    {
        type: 'cardSecurityCode',
        selector: CC_CVC_SELECTOR,
        regex: /security.?code|cvv|csc|cvc/i
    },
    {
        type: 'expirationMonth',
        selector: CC_MONTH_SELECTOR,
        regex: /(card|cc)?.?(exp(iry|iration)?)?.?(month|mm(?![.\s/-]yy))/i,
        negativeRegex: /mm[/\s.\-_—–]/i
    },
    {
        type: 'expirationYear',
        selector: CC_YEAR_SELECTOR,
        regex: /(card|cc)?.?(exp(iry|iration)?)?.?(ye(ar)?|yy)/i,
        negativeRegex: /mm[/\s.\-_—–]/i
    },
    {
        type: 'expiration',
        selector: CC_EXP_SELECTOR,
        regex: /(mm|\d\d)[/\s.\-_—–](yy|jj|aa|\d\d)|exp|valid/i,
        negativeRegex: /invalid/i
    }
]

const CC_FIELD_SELECTOR = CC_MATCHERS_LIST.map(({selector}) => selector).join(', ')

const FIELD_SELECTOR = [PASSWORD_SELECTOR, GENERIC_TEXT_FIELD, EMAIL_SELECTOR, CC_FIELD_SELECTOR].join(', ')

const SUBMIT_BUTTON_SELECTOR = `
input[type=submit],
input[type=button],
button:not([role=switch]):not([role=link]),
[role=button]`

module.exports = {
    PASSWORD_SELECTOR,
    EMAIL_MATCHER,
    PASSWORD_MATCHER,
    USERNAME_MATCHER,
    FOUR_DIGIT_YEAR_REGEX,
    CC_MATCHERS_LIST,
    DATE_SEPARATOR_REGEX,
    CC_FIELD_SELECTOR,
    FIELD_SELECTOR,
    SUBMIT_BUTTON_SELECTOR
}
