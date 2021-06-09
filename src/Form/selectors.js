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
    input[type=text][placeholder*=mail i]:not([readonly])
`

const PASSWORD_SELECTOR = `input[type=password]:not([autocomplete*=cc]):not([autocomplete=one-time-code])`

module.exports = {EMAIL_SELECTOR, PASSWORD_SELECTOR}
