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
    input[autocomplete=email]:not([readonly]):not([hidden]):not([disabled])
`

// We've seen non-standard types like 'user'. This selector should get them, too
const GENERIC_TEXT_FIELD = `
input:not([type=button],
[type=checkbox],
[type=color],
[type=date],
[type=datetime-local],
[type=datetime],
[type=file],
[type=hidden],
[type=month],
[type=number],
[type=radio],
[type=range],
[type=reset],
[type=search],
[type=submit],
[type=tel],
[type=time],
[type=url],
[type=week])`

const PASSWORD_SELECTOR = `input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code])`

// This is more generic, used only when we have identified a form
const USERNAME_SELECTOR = `${GENERIC_TEXT_FIELD}[autocomplete^=user]`

const CC_NAME_SELECTOR = `
[autocomplete="cc-name"],
[autocomplete="ccname"],
[name="ccname"],
[name="cc-name"],
[name="ppw-accountHolderName"]`

const CC_NUMBER_SELECTOR = `
[autocomplete="cc-number"],
[autocomplete="ccnumber"],
[autocomplete="cardnumber"],
[autocomplete="card-number"],
[name="ccnumber"],
[name="cc-number"],
[name="cardnumber"],
[name="card-number"],
[name="creditCardNumber"],
[name="addCreditCardNumber"]`

const CC_CVC_SELECTOR = `
[autocomplete="cc-csc"],
[autocomplete="csc"],
[autocomplete="cc-cvc"],
[autocomplete="cvc"],
[name="cvc"],
[name="cc-cvc"],
[name="cc-csc"],
[name="csc"],
[name="securityCode"]`

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
[name="expirationDate"]`

/* This is used to map a selector with the data type we store for credit cards */
const CC_SELECTORS_MAP = {
    [CC_NAME_SELECTOR]: 'cardName',
    [CC_NUMBER_SELECTOR]: 'cardNumber',
    [CC_CVC_SELECTOR]: 'cardSecurityCode',
    [CC_MONTH_SELECTOR]: 'expirationMonth',
    [CC_YEAR_SELECTOR]: 'expirationYear',
    [CC_EXP_SELECTOR]: 'expiration'
}

const CC_FIELD_SELECTOR = Object.keys(CC_SELECTORS_MAP).join(', ')

const FIELD_SELECTOR = [PASSWORD_SELECTOR, GENERIC_TEXT_FIELD, EMAIL_SELECTOR, CC_FIELD_SELECTOR].join(', ')

const SUBMIT_BUTTON_SELECTOR = 'input[type=submit], input[type=button], button, [role=button]'

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
