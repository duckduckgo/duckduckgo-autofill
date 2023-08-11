/**
 * Try to use this a place to store re-used values across the integration tests.
 */
export const constants = {
    pages: {
        'overlay': 'pages/overlay.html',
        'email-autofill': 'pages/email-autofill.html',
        'emailAtBottom': 'pages/email-at-bottom.html',
        'emailAtTopLeft': 'pages/email-at-top-left.html',
        'iframeContainer': 'pages/iframe-container.html',
        'signup': 'pages/signup.html',
        'mutatingForm': 'pages/mutating-form.html',
        'login': 'pages/login.html',
        'loginWithPoorForm': 'pages/login-poor-form.html',
        'loginWithText': 'pages/login-with-text.html',
        'loginWithFormInModal': 'pages/login-in-modal.html',
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
                credential: '[data-ddg-inputtype="credentials.password"]'
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
        key: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4w',
        // This is the same icon as `daxBase64` in `src/Form/logo-svg.js`
        dax: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2a'
    }
}
