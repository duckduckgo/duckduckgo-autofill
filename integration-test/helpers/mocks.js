const localPagesPrefix = 'integration-test/pages';
const testFormsPrefix = 'test-forms';
const privacyTestPagesPrefix = 'node_modules/@duckduckgo/privacy-test-pages/autofill';
/**
 * Try to use this a place to store re-used values across the integration tests.
 */
export const constants = {
    pages: {
        overlay: `${localPagesPrefix}/overlay.html`,
        'email-autofill': `${localPagesPrefix}/email-autofill.html`,
        emailAtBottom: `${localPagesPrefix}/email-at-bottom.html`,
        emailAtTopLeft: `${localPagesPrefix}/email-at-top-left.html`,
        'scanner-perf': `${localPagesPrefix}/scanner-perf.html`,
        'perf-huge-regex': `${localPagesPrefix}/perf-huge-regex.html`,
        iframeContainer: `${localPagesPrefix}/iframe-container.html`,
        signup: `${localPagesPrefix}/signup.html`,
        mutatingForm: `${localPagesPrefix}/mutating-form.html`,
        passwordUpdate: `${privacyTestPagesPrefix}/password-update.html`,
        login: `${localPagesPrefix}/login.html`,
        loginWithPoorForm: `${localPagesPrefix}/login-poor-form.html`,
        loginWithText: `${localPagesPrefix}/login-with-text.html`,
        loginWithFormInModal: `${privacyTestPagesPrefix}/autoprompt/2-form-in-modal.html`,
        signupWithFormInModal: `${localPagesPrefix}/signup-in-modal.html`,
        loginCovered: `${localPagesPrefix}/login-covered.html`,
        loginMultistep: `${privacyTestPagesPrefix}/autoprompt/3-multistep-form.html`,
        shadowDom: `${privacyTestPagesPrefix}/shadow-dom.html`,
        selectInput: `${localPagesPrefix}/select-input.html`,
        shadowInputsLogin: `${localPagesPrefix}/shadow-inputs-login.html`,
        unknownUsernameLogin: `${localPagesPrefix}/unknown-username-login.html`,
        creditCardVariousInputs: `${privacyTestPagesPrefix}/credit-card-various-inputs.html`,
    },
    forms: {
        'www_ulisboa_pt_login.html': `${testFormsPrefix}/www_ulisboa_pt_login.html`,
    },
    fields: {
        email: {
            personalAddress: `shane-123@duck.com`,
            privateAddress0: '0@duck.com',
            privateAddress1: '1@duck.com',
            selectors: {
                identity: '[data-ddg-inputtype="identities.emailAddress"]',
            },
        },
        username: {
            selectors: {
                credential: '[data-ddg-inputtype="credentials.username"]',
            },
        },
        password: {
            selectors: {
                credential: '[data-ddg-inputtype^="credentials.password"]',
            },
        },
        identity: {
            id: '01',
            title: 'Main identity',
            emailAddress: 'user@gmail.com',
            firstName: 'First',
            lastName: 'Last',
            phone: '+1234567890',
            addressCity: 'city1',
        },
        creditCard: {
            id: '01',
            title: 'Main card',
            cardName: 'First Last',
            cardNumber: '4242424242424242',
            cardSecurityCode: '123',
            expirationMonth: '12',
            expirationYear: '2030',
        },
    },
    /** @type {import('../../src/deviceApiCalls/__generated__/validators-ts').AutofillFeatureToggles} */
    featureToggles: {
        credentials_saving: false,
        password_generation: false,
        emailProtection: false,
        inputType_identities: false,
        inputType_credentials: false,
        inputType_creditCards: false,
        inlineIcon_credentials: false,
    },
    /** @type {import('../../src/deviceApiCalls/__generated__/validators-ts').AvailableInputTypes} */
    availableInputTypes: {
        credentials: {
            username: true,
            password: true,
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
            emailAddress: true,
        },
        creditCards: {
            cardName: true,
            cardSecurityCode: true,
            expirationMonth: true,
            expirationYear: true,
            cardNumber: true,
        },
        email: true,
        credentialsImport: false,
    },
    iconMatchers: {
        // src/UI/img/key.svg
        keyFill:
            'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuOSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTUuNSA2YTIuNSAyLjUgMCAxIDEgMCA1IDIuNSAyLjUgMCAwIDEgMC01bTAgMS41YTEgMSAwIDEgMCAwIDIgMSAxIDAgMCAwIDAtMiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuOSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQuOTk4IDJBNy4wMDUgNy4wMDUgMCAwIDEgMjIgOS4wMDdhNy4wMDQgNy4wMDQgMCAwIDEtOC43MDUgNi43OTdjLS4xNjMtLjA0MS0uMjg2LjAwOC0uMzQ1LjA2N2wtMi41NTcgMi41NTlhMiAyIDAgMCAxLTEuNDE1LjU4NmgtLjk4MnYuNzM0QTIuMjUgMi4yNSAwIDAgMSA1Ljc0NSAyMmgtLjk5M2EyLjc1IDIuNzUgMCAwIDEtMi43NS0yLjczNUwyIDE4Ljc3YTMuNzUgMy43NSAwIDAgMSAxLjA5OC0yLjY3bDUuMDQtNS4wNDNjLjA2LS4wNi4xMDctLjE4My4wNjYtLjM0NmE3IDcgMCAwIDEtLjIwOC0xLjcwNEE3LjAwNCA3LjAwNCAwIDAgMSAxNC45OTggMm0wIDEuNWE1LjUwNCA1LjUwNCAwIDAgMC01LjMzNyA2Ljg0OGMuMTQ3LjU4OS4wMjcgMS4yNzktLjQ2MiAxLjc2OGwtNS4wNCA1LjA0NGEyLjI1IDIuMjUgMCAwIDAtLjY1OSAxLjYwM2wuMDAzLjQ5NGExLjI1IDEuMjUgMCAwIDAgMS4yNSAxLjI0M2guOTkyYS43NS43NSAwIDAgMCAuNzUtLjc1di0uNzM0YTEuNSAxLjUgMCAwIDEgMS41LTEuNWguOTgzYS41LjUgMCAwIDAgLjM1My0uMTQ3bDIuNTU4LTIuNTU5Yy40OS0uNDkgMS4xOC0uNjA5IDEuNzctLjQ2MWE1LjUwNCA1LjUwNCAwIDAgMCA2Ljg0LTUuMzQyQTUuNTA1IDUuNTA1IDAgMCAwIDE1IDMuNVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=',
        // src/UI/img/key-login.svg
        keyGen: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTExLjIyNCA0LjY0YS45LjkgMCAwIDAgLjY0Ny0uMTY1IDUuNDcgNS40NyAwIDAgMSAzLjEyNy0uOTc1QTUuNTA0IDUuNTA0IDAgMCAxIDIwLjUgOS4wMDZhNS41MDQgNS41MDQgMCAwIDEtNi44NCA1LjM0M2MtLjU5LS4xNDgtMS4yODEtLjAyOC0xLjc3MS40NjJsLTIuNTU3IDIuNTU4YS41LjUgMCAwIDEtLjM1NC4xNDdoLS45ODJhMS41IDEuNSAwIDAgMC0xLjUgMS41di43MzRhLjc1Ljc1IDAgMCAxLS43NS43NWgtLjk5M2ExLjI1IDEuMjUgMCAwIDEtMS4yNS0xLjI0NGwtLjAwMy0uNDk0YTIuMjUgMi4yNSAwIDAgMSAuNjU5LTEuNjAybDUuMDQtNS4wNDNjLjM0My0uMzQ0LjQ2MS0uNzExLjQ3OS0xLjA5NS4wMjctLjU4Mi0uNzM3LS44NDctMS4xNzktLjQ2N2wtLjA2Ni4wNTZhLjcuNyAwIDAgMC0uMTU4LjIzMi44LjggMCAwIDEtLjEzNy4yMTNMMy4wOTggMTYuMUEzLjc1IDMuNzUgMCAwIDAgMiAxOC43N2wuMDAzLjQ5NEEyLjc1IDIuNzUgMCAwIDAgNC43NTMgMjJoLjk5MmEyLjI1IDIuMjUgMCAwIDAgMi4yNS0yLjI1di0uNzM0aC45ODNhMiAyIDAgMCAwIDEuNDE1LS41ODZsMi41NTctMi41NTljLjA1OS0uMDU5LjE4Mi0uMTA4LjM0Ni0uMDY3QTcuMDA0IDcuMDA0IDAgMCAwIDIyIDkuMDA2IDcuMDA0IDcuMDA0IDAgMCAwIDEwLjgyNiAzLjM4Yy0uNTMzLjM5NS0uMjYgMS4xNjYuMzk3IDEuMjZaIi8+CiAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTUuNSA2YTIuNSAyLjUgMCAxIDEgMCA1IDIuNSAyLjUgMCAwIDEgMC01bTAgMS41YTEgMSAwIDEgMCAwIDIgMSAxIDAgMCAwIDAtMiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iIzAwMCIgZD0iTTcuMTI1IDIuODA0QzcgMi4xNiA2LjkxNSAyIDYuNSAyYy0uNDE0IDAtLjUuMTYtLjYyNS44MDQtLjA4LjQxMy0uMjEyIDEuODItLjI5NiAyLjc3NS0uOTU0LjA4NC0yLjM2Mi4yMTYtMi43NzUuMjk2QzIuMTYgNiAyIDYuMDg1IDIgNi41YzAgLjQxNC4xNjEuNS44MDQuNjI1LjQxMi4wOCAxLjgxOC4yMTIgMi43NzIuMjk2LjA4My45ODkuMjE4IDIuNDYxLjMgMi43NzUuMTI0LjQ4My4yMS44MDQuNjI0LjgwNHMuNS0uMTYuNjI1LS44MDRjLjA4LS40MTIuMjEyLTEuODE3LjI5Ni0yLjc3MS45OS0uMDg0IDIuNDYyLS4yMTkgMi43NzYtLjNDMTAuNjc5IDcgMTEgNi45MTUgMTEgNi41YzAtLjQxNC0uMTYtLjUtLjgwMy0uNjI1LS40MTMtLjA4LTEuODIxLS4yMTItMi43NzUtLjI5Ni0uMDg1LS45NTQtLjIxNi0yLjM2Mi0uMjk3LTIuNzc1bS00LjM0MiA4Ljc2MWEuNzgzLjc4MyAwIDEgMCAwLTEuNTY1Ljc4My43ODMgMCAwIDAgMCAxLjU2NSIvPgo8L3N2Zz4K',
    },
};
