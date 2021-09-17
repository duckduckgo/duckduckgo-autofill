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

const FIELD_SELECTOR = [PASSWORD_SELECTOR, GENERIC_TEXT_FIELD, EMAIL_SELECTOR].join(', ')

const SUBMIT_BUTTON_SELECTOR = 'input[type=submit], input[type=button], button, [role=button]'

module.exports = {EMAIL_SELECTOR, GENERIC_TEXT_FIELD, PASSWORD_SELECTOR, FIELD_SELECTOR, USERNAME_SELECTOR, SUBMIT_BUTTON_SELECTOR}
