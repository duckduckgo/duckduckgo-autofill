/**
 * Try to use this a place to store re-used values across the integration tests.
 */
export const constants = {
    pages: {
        'overlay': 'pages/overlay.html',
        'email-autofill': 'pages/email-autofill.html',
        'emailAtBottom': 'pages/email-at-bottom.html',
        'emailAtTopLeft': 'pages/email-at-top-left.html',
        'scanner-perf': 'pages/scanner-perf.html',
        'perf-huge-regex': 'pages/perf-huge-regex.html',
        'iframeContainer': 'pages/iframe-container.html',
        'signup': 'pages/signup.html',
        'mutatingForm': 'pages/mutating-form.html',
        'login': 'pages/login.html',
        'loginWithPoorForm': 'pages/login-poor-form.html',
        'loginWithText': 'pages/login-with-text.html',
        'loginWithFormInModal': 'pages/login-in-modal.html',
        'signupWithFormInModal': 'pages/signup-in-modal.html',
        'loginCovered': 'pages/login-covered.html',
        'loginMultistep': 'pages/login-multistep.html'
    },
    fields: {
        email: {
            personalAddress: `shane-123@duck.com`,
            privateAddress0: '0@duck.com',
            privateAddress1: '1@duck.com',
            selectors: {
                identity: '[data-ddg-inputtype="identities.emailAddress"]'
            }
        },
        username: {
            selectors: {
                credential: '[data-ddg-inputtype="credentials.username"]'
            }
        },
        password: {
            selectors: {
                credential: '[data-ddg-inputtype^="credentials.password"]'
            }
        },
        identity: {
            id: '01',
            title: 'Main identity',
            emailAddress: 'user@gmail.com',
            firstName: 'First',
            lastName: 'Last',
            phone: '+1234567890'
        },
        creditCard: {
            id: '01',
            title: 'Main card',
            cardName: 'First Last',
            cardNumber: '4242424242424242',
            cardSecurityCode: '123',
            expirationMonth: '12',
            expirationYear: '2030'
        }
    },
    /** @type {import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles} */
    featureToggles: {
        credentials_saving: false,
        password_generation: false,
        emailProtection: false,
        inputType_identities: false,
        inputType_credentials: false,
        inputType_creditCards: false,
        inlineIcon_credentials: false
    },
    /** @type {import('../../src/deviceApiCalls/__generated__/validators-ts').AvailableInputTypes} */
    availableInputTypes: {
        credentials: {
            username: true,
            password: true
        },
        identities: {
            firstName: true,
            middleName: true,
            lastName: true,
            birthdayDay: true,
            birthdayMonth: true,
            birthdayYear: true,
            addressStreet: true,
            addressStreet2: true,
            addressCity: true,
            addressProvince: true,
            addressPostalCode: true,
            addressCountryCode: true,
            phone: true,
            emailAddress: true
        },
        creditCards: {
            cardName: true,
            cardSecurityCode: true,
            expirationMonth: true,
            expirationYear: true,
            cardNumber: true
        },
        email: true
    },
    iconMatchers: {
        keyFill: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS4zMzQgNi42NjdhMiAyIDAgMSAwIDAgNCAyIDIgMCAwIDAgMC00Wm0tLjY2NyAyYS42NjcuNjY3IDAgMSAxIDEuMzMzIDAgLjY2Ny42NjcgMCAwIDEtMS4zMzMgMFoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQuNjY3IDRhNS4zMzMgNS4zMzMgMCAwIDAtNS4xODggNi41NzhsLTUuMjg0IDUuMjg0YS42NjcuNjY3IDAgMCAwLS4xOTUuNDcxdjNjMCAuMzY5LjI5OC42NjcuNjY3LjY2N2gyLjY2NmMuNzM3IDAgMS4zMzQtLjU5NyAxLjMzNC0xLjMzM1YxOGguNjY2Yy43MzcgMCAxLjMzNC0uNTk3IDEuMzM0LTEuMzMzdi0xLjMzNEgxMmMuMTc3IDAgLjM0Ni0uMDcuNDcxLS4xOTVsLjY4OC0uNjg4QTUuMzMzIDUuMzMzIDAgMSAwIDE0LjY2NyA0Wm0tNCA1LjMzM2E0IDQgMCAxIDEgMi41NTUgMy43MzIuNjY3LjY2NyAwIDAgMC0uNzEzLjE1bC0uNzg1Ljc4NUgxMGEuNjY3LjY2NyAwIDAgMC0uNjY3LjY2N3YySDhhLjY2Ny42NjcgMCAwIDAtLjY2Ny42NjZ2MS4zMzRoLTJ2LTIuMDU4bDUuMzY1LTUuMzY0YS42NjcuNjY3IDAgMCAwIC4xNjMtLjY3NyAzLjk5NiAzLjk5NiAwIDAgMS0uMTk0LTEuMjM1WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPgo=',
        keyGen: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBmaWxsPSIjMDAwIiBkPSJNOC4wNDcgNC42MjVDNy45MzcgNC4xMjUgNy44NjIgNCA3LjUgNGMtLjM2MiAwLS40MzguMTI1LS41NDcuNjI1LS4wNjguMzEtLjE3NyAxLjMzOC0uMjUxIDIuMDc3LS43MzguMDc0LTEuNzY3LjE4My0yLjA3Ny4yNTEtLjUuMTEtLjYyNS4xODQtLjYyNS41NDcgMCAuMzYyLjEyNS40MzcuNjI1LjU0Ny4zMS4wNjcgMS4zMzYuMTc3IDIuMDc0LjI1LjA3My43NjcuMTg1IDEuODQyLjI1NCAyLjA3OC4xMS4zNzUuMTg1LjYyNS41NDcuNjI1LjM2MiAwIC40MzgtLjEyNS41NDctLjYyNS4wNjgtLjMxLjE3Ny0xLjMzNi4yNS0yLjA3NC43NjctLjA3MyAxLjg0Mi0uMTg1IDIuMDc4LS4yNTQuMzc1LS4xMS42MjUtLjE4NS42MjUtLjU0NyAwLS4zNjMtLjEyNS0uNDM4LS42MjUtLjU0Ny0uMzEtLjA2OC0xLjMzOS0uMTc3LTIuMDc3LS4yNTEtLjA3NC0uNzM5LS4xODMtMS43NjctLjI1MS0yLjA3N1oiLz4KICAgIDxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0xNC42ODEgNS4xOTljLS43NjYgMC0xLjQ4Mi4yMS0yLjA5My41NzhhLjYzNi42MzYgMCAwIDEtLjY1NS0xLjA5IDUuMzQgNS4zNCAwIDEgMSAxLjMwMiA5LjcyMmwtLjc3NS43NzZhLjYzNi42MzYgMCAwIDEtLjQ1LjE4NmgtMS4zOTh2MS42NWMwIC40OTMtLjQuODkzLS44OTMuODkzSDguNTc4djEuMTQxYzAgLjQ5NC0uNC44OTMtLjg5NC44OTNINC42MzZBLjYzNi42MzYgMCAwIDEgNCAxOS4zMTNWMTYuMjZjMC0uMTY5LjA2Ny0uMzMuMTg2LS40NWw1LjU2Mi01LjU2MmEuNjM2LjYzNiAwIDEgMSAuOS45bC01LjM3NiA1LjM3NXYyLjE1M2gyLjAzNHYtMS4zOTljMC0uMzUuMjg1LS42MzYuNjM2LS42MzZIOS4zNHYtMS45MDdjMC0uMzUxLjI4NC0uNjM2LjYzNS0uNjM2aDEuNzcxbC44NjQtLjg2M2EuNjM2LjYzNiAwIDAgMSAuNjY4LS4xNDcgNC4wNjkgNC4wNjkgMCAxIDAgMS40MDItNy44OVoiLz4KICAgIDxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjYyNSA4LjQ5OWExLjg3NSAxLjg3NSAwIDEgMSAzLjc1IDAgMS44NzUgMS44NzUgMCAwIDEtMy43NSAwWm0xLjg3NS0uNjI1YS42MjUuNjI1IDAgMSAwIDAgMS4yNS42MjUuNjI1IDAgMCAwIDAtMS4yNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTQuNjI1IDEyLjEyNWEuNjI1LjYyNSAwIDEgMCAwLTEuMjUuNjI1LjYyNSAwIDAgMCAwIDEuMjVaIi8+Cjwvc3ZnPgo=',
        // This is the same icon as `daxBase64` in `src/Form/logo-svg.js`
        dax: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2a'
    }
}
