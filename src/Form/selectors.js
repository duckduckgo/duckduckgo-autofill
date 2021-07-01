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
    input[autocomplete=email]:not([readonly]):not([hidden]):not([disabled]),
    input[autocomplete=username]:not([readonly]):not([hidden]):not([disabled])
`

const PASSWORD_SELECTOR = `input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code])`

// This is more generic, used only when we have identified a form
const USERNAME_SELECTOR = `input:not([type]), input[type=""], input[type=text], input[type=email]`

const FIELD_SELECTOR = [PASSWORD_SELECTOR, USERNAME_SELECTOR].join(', ')

const SUBMIT_BUTTON_SELECTOR = 'input[type=submit], input[type=button], button, [role=button]'

module.exports = {EMAIL_SELECTOR, PASSWORD_SELECTOR, FIELD_SELECTOR, USERNAME_SELECTOR, SUBMIT_BUTTON_SELECTOR}
