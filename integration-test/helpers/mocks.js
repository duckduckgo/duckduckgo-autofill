/**
 * Try to use this a place to store re-used values across the integration tests.
 */
export const constants = {
    pages: {
        'overlay': 'overlay.html',
        'email-autofill': 'email-autofill.html',
        'iframeContainer': 'iframe-container.html',
        'signup': 'signup.html',
        'login': 'login.html',
        'loginWithPoorForm': 'login-poor-form.html',
        'loginWithText': 'login-with-text.html',
        'loginWithFormInModal': 'login-in-modal.html',
        'loginCovered': 'login-covered.html',
        'loginMultistep': 'login-multistep.html'
    },
    fields: {
        email: {
            personalAddress: `shane-123@duck.com`,
            privateAddress0: '0@duck.com',
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
        identities: {
            id: '01',
            title: 'Main identity',
            emailAddress: 'user@gmail.com',
            firstName: 'First',
            lastName: 'Last',
            phone: '+1234567890'
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
        dax: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBo'
    }
}
