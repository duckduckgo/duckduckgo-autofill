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
        // This is the same icon as `daxBase64` in `src/Form/logo-svg.js`
        dax: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im02NCAxMjhjMzUuMzQ2IDAgNjQtMjguNjU0IDY0LTY0cy0yOC42NTQtNjQtNjQtNjQtNjQgMjguNjU0LTY0IDY0IDI4LjY1NCA2NCA2NCA2NHoiIGZpbGw9IiNkZTU4MzMiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNzMgMTExLjc1YzAtLjUuMTIzLS42MTQtMS40NjYtMy43ODItNC4yMjQtOC40NTktOC40Ny0yMC4zODQtNi41NC0yOC4wNzUuMzUzLTEuMzk3LTMuOTc4LTUxLjc0NC03LjA0LTUzLjM2NS0zLjQwMi0xLjgxMy03LjU4OC00LjY5LTExLjQxOC01LjMzLTEuOTQzLS4zMS00LjQ5LS4xNjQtNi40ODIuMTA1LS4zNTMuMDQ3LS4zNjguNjgzLS4wMy43OTggMS4zMDguNDQzIDIuODk1IDEuMjEyIDMuODMgMi4zNzUuMTc4LjIyLS4wNi41NjYtLjM0Mi41NzctLjg4Mi4wMzItMi40ODIuNDAyLTQuNTkzIDIuMTk1LS4yNDQuMjA3LS4wNDEuNTkyLjI3My41MyA0LjUzNi0uODk3IDkuMTctLjQ1NSAxMS45IDIuMDI3LjE3Ny4xNi4wODQuNDUtLjE0Ny41MTItMjMuNjk0IDYuNDQtMTkuMDAzIDI3LjA1LTEyLjY5NiA1Mi4zNDQgNS42MTkgMjIuNTMgNy43MzMgMjkuNzkyIDguNCAzMi4wMDRhLjcxOC43MTggMCAwIDAgLjQyMy40NjdjOC4xNTYgMy4yNDggMjUuOTI4IDMuMzkyIDI1LjkyOC0yLjEzMnoiIGZpbGw9IiNkZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgogICAgPHBhdGggZD0ibTc2LjI1IDExNi41Yy0yLjg3NSAxLjEyNS04LjUgMS42MjUtMTEuNzUgMS42MjUtNC43NjQgMC0xMS42MjUtLjc1LTE0LjEyNS0xLjg3NS0xLjU0NC00Ljc1MS02LjE2NC0xOS40OC0xMC43MjctMzguMTg1bC0uNDQ3LTEuODI3LS4wMDQtLjAxNWMtNS40MjQtMjIuMTU3LTkuODU1LTQwLjI1MyAxNC40MjctNDUuOTM4LjIyMi0uMDUyLjMzLS4zMTcuMTg0LS40OTItMi43ODYtMy4zMDUtOC4wMDUtNC4zODgtMTQuNjA1LTIuMTExLS4yNy4wOTMtLjUwNi0uMTgtLjMzNy0uNDEyIDEuMjk0LTEuNzgzIDMuODIzLTMuMTU1IDUuMDcxLTMuNzU2LjI1OC0uMTI0LjI0Mi0uNTAyLS4wMy0uNTg4YTI3Ljg3NyAyNy44NzcgMCAwIDAgLTMuNzcyLS45Yy0uMzctLjA1OS0uNDAzLS42OTMtLjAzMi0uNzQzIDkuMzU2LTEuMjU5IDE5LjEyNSAxLjU1IDI0LjAyOCA3LjcyNmEuMzI2LjMyNiAwIDAgMCAuMTg2LjExNGMxNy45NTIgMy44NTYgMTkuMjM4IDMyLjIzNSAxNy4xNyAzMy41MjgtLjQwOC4yNTUtMS43MTUuMTA4LTMuNDM4LS4wODUtNi45ODYtLjc4MS0yMC44MTgtMi4zMjktOS40MDIgMTguOTQ4LjExMy4yMS0uMDM2LjQ4OC0uMjcyLjUyNS02LjQzOCAxIDEuODEyIDIxLjE3MyA3Ljg3NSAzNC40NjF6IiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBkPSJtODQuMjggOTAuNjk4Yy0xLjM2Ny0uNjMzLTYuNjIxIDMuMTM1LTEwLjExIDYuMDI4LS43MjgtMS4wMzEtMi4xMDMtMS43OC01LjIwMy0xLjI0Mi0yLjcxMy40NzItNC4yMTEgMS4xMjYtNC44OCAyLjI1NC00LjI4My0xLjYyMy0xMS40ODgtNC4xMy0xMy4yMjktMS43MS0xLjkwMiAyLjY0Ni40NzYgMTUuMTYxIDMuMDAzIDE2Ljc4NiAxLjMyLjg0OSA3LjYzLTMuMjA4IDEwLjkyNi02LjAwNS41MzIuNzQ5IDEuMzg4IDEuMTc4IDMuMTQ4IDEuMTM3IDIuNjYyLS4wNjIgNi45NzktLjY4MSA3LjY0OS0xLjkyMS4wNC0uMDc1LjA3NS0uMTY0LjEwNS0uMjY2IDMuMzg4IDEuMjY2IDkuMzUgMi42MDYgMTAuNjgyIDIuNDA2IDMuNDctLjUyMS0uNDg0LTE2LjcyMy0yLjA5LTE3LjQ2N3oiIGZpbGw9IiMzY2E4MmIiLz4KICAgIDxwYXRoIGQ9Im03NC40OSA5Ny4wOTdjLjE0NC4yNTYuMjYuNTI2LjM1OC44LjQ4MyAxLjM1MiAxLjI3IDUuNjQ4LjY3NCA2LjcwOS0uNTk1IDEuMDYyLTQuNDU5IDEuNTc0LTYuODQzIDEuNjE1cy0yLjkyLS44MzEtMy40MDMtMi4xODFjLS4zODctMS4wODEtLjU3Ny0zLjYyMS0uNTcyLTUuMDc1LS4wOTgtMi4xNTguNjktMi45MTYgNC4zMzQtMy41MDYgMi42OTYtLjQzNiA0LjEyMS4wNzEgNC45NDQuOTQgMy44MjgtMi44NTcgMTAuMjE1LTYuODg5IDEwLjgzOC02LjE1MiAzLjEwNiAzLjY3NCAzLjQ5OSAxMi40MiAyLjgyNiAxNS45MzktLjIyIDEuMTUxLTEwLjUwNS0xLjEzOS0xMC41MDUtMi4zOCAwLTUuMTUyLTEuMzM3LTYuNTY1LTIuNjUtNi43MXptLTIyLjUzLTEuNjA5Yy44NDMtMS4zMzMgNy42NzQuMzI1IDExLjQyNCAxLjk5MyAwIDAtLjc3IDMuNDkxLjQ1NiA3LjYwNC4zNTkgMS4yMDMtOC42MjcgNi41NTgtOS44IDUuNjM3LTEuMzU1LTEuMDY1LTMuODUtMTIuNDMyLTIuMDgtMTUuMjM0eiIgZmlsbD0iIzRjYmEzYyIvPgogICAgPHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNTUuMjY5IDY4LjQwNmMuNTUzLTIuNDAzIDMuMTI3LTYuOTMyIDEyLjMyMS02LjgyMiA0LjY0OC0uMDE5IDEwLjQyMi0uMDAyIDE0LjI1LS40MzZhNTEuMzEyIDUxLjMxMiAwIDAgMCAxMi43MjYtMy4wOTVjMy45OC0xLjUxOSA1LjM5Mi0xLjE4IDUuODg3LS4yNzIuNTQ0Ljk5OS0uMDk3IDIuNzIyLTEuNDg4IDQuMzA5LTIuNjU2IDMuMDMtNy40MzEgNS4zOC0xNS44NjUgNi4wNzYtOC40MzMuNjk4LTE0LjAyLTEuNTY1LTE2LjQyNSAyLjExOC0xLjAzOCAxLjU4OS0uMjM2IDUuMzMzIDcuOTIgNi41MTIgMTEuMDIgMS41OSAyMC4wNzItMS45MTcgMjEuMTkuMjAxIDEuMTE5IDIuMTE4LTUuMzIzIDYuNDI4LTE2LjM2MiA2LjUxOHMtMTcuOTM0LTMuODY1LTIwLjM3OS01LjgzYy0zLjEwMi0yLjQ5NS00LjQ5LTYuMTMzLTMuNzc1LTkuMjc5eiIgZmlsbD0iI2ZjMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+CiAgICA8ZyBmaWxsPSIjMTQzMDdlIiBvcGFjaXR5PSIuOCI+CiAgICAgIDxwYXRoIGQ9Im02OS4zMjcgNDIuMTI3Yy42MTYtMS4wMDggMS45ODEtMS43ODYgNC4yMTYtMS43ODYgMi4yMzQgMCAzLjI4NS44ODkgNC4wMTMgMS44OC4xNDguMjAyLS4wNzYuNDQtLjMwNi4zNGE1OS44NjkgNTkuODY5IDAgMCAxIC0uMTY4LS4wNzNjLS44MTctLjM1Ny0xLjgyLS43OTUtMy41NC0uODItMS44MzgtLjAyNi0yLjk5Ny40MzUtMy43MjcuODMxLS4yNDYuMTM0LS42MzQtLjEzMy0uNDg4LS4zNzJ6bS0yNS4xNTcgMS4yOWMyLjE3LS45MDcgMy44NzYtLjc5IDUuMDgxLS41MDQuMjU0LjA2LjQzLS4yMTMuMjI3LS4zNzctLjkzNS0uNzU1LTMuMDMtMS42OTItNS43Ni0uNjc0LTIuNDM3LjkwOS0zLjU4NSAyLjc5Ni0zLjU5MiA0LjAzOC0uMDAyLjI5Mi42LjMxNy43NTYuMDcuNDItLjY3IDEuMTItMS42NDYgMy4yODktMi41NTN6Ii8+CiAgICAgIDxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTc1LjQ0IDU1LjkyYTMuNDcgMy40NyAwIDAgMSAtMy40NzQtMy40NjIgMy40NyAzLjQ3IDAgMCAxIDMuNDc1LTMuNDYgMy40NyAzLjQ3IDAgMCAxIDMuNDc0IDMuNDYgMy40NyAzLjQ3IDAgMCAxIC0zLjQ3NSAzLjQ2MnptMi40NDctNC42MDhhLjg5OS44OTkgMCAwIDAgLTEuNzk5IDBjMCAuNDk0LjQwNS44OTUuOS44OTUuNDk5IDAgLjktLjQuOS0uODk1em0tMjUuNDY0IDMuNTQyYTQuMDQyIDQuMDQyIDAgMCAxIC00LjA0OSA0LjAzNyA0LjA0NSA0LjA0NSAwIDAgMSAtNC4wNS00LjAzNyA0LjA0NSA0LjA0NSAwIDAgMSA0LjA1LTQuMDM3IDQuMDQ1IDQuMDQ1IDAgMCAxIDQuMDUgNC4wMzd6bS0xLjE5My0xLjMzOGExLjA1IDEuMDUgMCAwIDAgLTIuMDk3IDAgMS4wNDggMS4wNDggMCAwIDAgMi4wOTcgMHoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgogICAgPC9nPgogICAgPHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNjQgMTE3Ljc1YzI5LjY4NSAwIDUzLjc1LTI0LjA2NSA1My43NS01My43NXMtMjQuMDY1LTUzLjc1LTUzLjc1LTUzLjc1LTUzLjc1IDI0LjA2NS01My43NSA1My43NSAyNC4wNjUgNTMuNzUgNTMuNzUgNTMuNzV6bTAgNWMzMi40NDcgMCA1OC43NS0yNi4zMDMgNTguNzUtNTguNzVzLTI2LjMwMy01OC43NS01OC43NS01OC43NS01OC43NSAyNi4zMDMtNTguNzUgNTguNzUgMjYuMzAzIDU4Ljc1IDU4Ljc1IDU4Ljc1eiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==',
    },
};
