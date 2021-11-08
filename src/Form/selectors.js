const EMAIL_SELECTOR = `
input:not([type])[name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=""][name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=text][name*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input:not([type])[id*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input:not([type])[placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=""][id*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=text][placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=""][placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input:not([type])[placeholder*=mail i]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=email]:not([readonly]):not([disabled]):not([hidden]):not([aria-hidden=true]),
input[type=text][aria-label*=mail i],
input:not([type])[aria-label*=mail i],
input[type=text][placeholder*=mail i]:not([readonly]),
input[autocomplete=email]:not([readonly]):not([hidden]):not([disabled])`

// We've seen non-standard types like 'user'. This selector should get them, too
const GENERIC_TEXT_FIELD = `
input:not([type=button]),
input:not([type=checkbox]),
input:not([type=color]),
input:not([type=date]),
input:not([type=datetime-local]),
input:not([type=datetime]),
input:not([type=file]),
input:not([type=hidden]),
input:not([type=month]),
input:not([type=number]),
input:not([type=radio]),
input:not([type=range]),
input:not([type=reset]),
input:not([type=search]),
input:not([type=submit]),
input:not([type=tel]),
input:not([type=time]),
input:not([type=url]),
input:not([type=week])`

const PASSWORD_SELECTOR = `input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code])`

// This is more generic, used only when we have identified a form
const USERNAME_SELECTOR = `${GENERIC_TEXT_FIELD}[autocomplete^=user]`

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
}

const CC_FIELD_SELECTOR = Object.keys(CC_SELECTORS_MAP).join(', ')

const FIELD_SELECTOR = [PASSWORD_SELECTOR, GENERIC_TEXT_FIELD, EMAIL_SELECTOR, CC_FIELD_SELECTOR].join(', ')

const SUBMIT_BUTTON_SELECTOR = `
input[type=submit],
input[type=button],
button:not([role=switch]):not([role=link]),
[role=button]`

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
}
