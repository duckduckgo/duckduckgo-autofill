const localPagesPrefix = 'integration-test/pages'
const privacyTestPagesPrefix = 'node_modules/@duckduckgo/privacy-test-pages/autofill'
/**
 * Try to use this a place to store re-used values across the integration tests.
 */
export const constants = {
    pages: {
        'overlay': `${localPagesPrefix}/overlay.html`,
        'email-autofill': `${localPagesPrefix}/email-autofill.html`,
        'emailAtBottom': `${localPagesPrefix}/email-at-bottom.html`,
        'emailAtTopLeft': `${localPagesPrefix}/email-at-top-left.html`,
        'scanner-perf': `${localPagesPrefix}/scanner-perf.html`,
        'perf-huge-regex': `${localPagesPrefix}/perf-huge-regex.html`,
        'iframeContainer': `${localPagesPrefix}/iframe-container.html`,
        'signup': `${localPagesPrefix}/signup.html`,
        'mutatingForm': `${localPagesPrefix}/mutating-form.html`,
        'passwordUpdate': `${privacyTestPagesPrefix}/password-update.html`,
        'login': `${localPagesPrefix}/login.html`,
        'loginWithPoorForm': `${localPagesPrefix}/login-poor-form.html`,
        'loginWithText': `${localPagesPrefix}/login-with-text.html`,
        'loginWithFormInModal': `${privacyTestPagesPrefix}/autoprompt/2-form-in-modal.html`,
        'signupWithFormInModal': `${localPagesPrefix}/signup-in-modal.html`,
        'loginCovered': `${localPagesPrefix}/login-covered.html`,
        'loginMultistep': `${privacyTestPagesPrefix}/autoprompt/3-multistep-form.html`,
        'shadowDom': `${privacyTestPagesPrefix}/shadow-dom.html`,
        'selectInput': `${localPagesPrefix}/select-input.html`,
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
            phone: '+1234567890',
            addressCity: 'option1',
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
        dax: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTY0IDEyOGMzNS4zNDYgMCA2NC0yOC42NTQgNjQtNjRzLTI4LjY1NC02NC02NC02NC02NCAyOC42NTQtNjQgNjQgMjguNjU0IDY0IDY0IDY0eiIgZmlsbD0iI2RlNTgzMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+CiAgICA8cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im03MyAxMTEuNzVjMC0uNS4xMjMtLjYxNC0xLjQ2Ni0zLjc4Mi00LjIyNC04LjQ1OS04LjQ3LTIwLjM4NC02LjU0LTI4LjA3NS4zNTMtMS4zOTctMy45NzgtNTEuNzQ0LTcuMDQtNTMuMzY1LTMuNDAyLTEuODEzLTcuNTg4LTQuNjktMTEuNDE4LTUuMzMtMS45NDMtLjMxLTQuNDktLjE2NC02LjQ4Mi4xMDUtLjM1My4wNDctLjM2OC42ODMtLjAzLjc5OCAxLjMwOC40NDMgMi44OTUgMS4yMTIgMy44MyAyLjM3NS4xNzguMjItLjA2LjU2Ni0uMzQyLjU3Ny0uODgyLjAzMi0yLjQ4Mi40MDItNC41OTMgMi4xOTUtLjI0NC4yMDctLjA0MS41OTIuMjczLjUzIDQuNTM2LS44OTcgOS4xNy0uNDU1IDExLjkgMi4wMjcuMTc3LjE2LjA4NC40NS0uMTQ3LjUxMi0yMy42OTQgNi40NC0xOS4wMDMgMjcuMDUtMTIuNjk2IDUyLjM0NCA1LjYxOSAyMi41MyA3LjczMyAyOS43OTIgOC40IDMyLjAwNGEuNzE4LjcxOCAwIDAgMCAuNDIzLjQ2N2M4LjE1NiAzLjI0OCAyNS45MjggMy4zOTIgMjUuOTI4LTIuMTMyeiIgZmlsbD0iI2RkZCIgZmlsbC1ydWxlPSJldmVub2RkIi8+CiAgICA8cGF0aCBkPSJtNzYuMjUgMTE2LjVjLTIuODc1IDEuMTI1LTguNSAxLjYyNS0xMS43NSAxLjYyNS00Ljc2NCAwLTExLjYyNS0uNzUtMTQuMTI1LTEuODc1LTEuNTQ0LTQuNzUxLTYuMTY0LTE5LjQ4LTEwLjcyNy0zOC4xODVsLS40NDctMS44MjctLjAwNC0uMDE1Yy01LjQyNC0yMi4xNTctOS44NTUtNDAuMjUzIDE0LjQyNy00NS45MzguMjIyLS4wNTIuMzMtLjMxNy4xODQtLjQ5Mi0yLjc4Ni0zLjMwNS04LjAwNS00LjM4OC0xNC42MDUtMi4xMTEtLjI3LjA5My0uNTA2LS4xOC0uMzM3LS40MTIgMS4yOTQtMS43ODMgMy44MjMtMy4xNTUgNS4wNzEtMy43NTYuMjU4LS4xMjQuMjQyLS41MDItLjAzLS41ODhhMjcuODc3IDI3Ljg3NyAwIDAgMCAtMy43NzItLjljLS4zNy0uMDU5LS40MDMtLjY5My0uMDMyLS43NDMgOS4zNTYtMS4yNTkgMTkuMTI1IDEuNTUgMjQuMDI4IDcuNzI2YS4zMjYuMzI2IDAgMCAwIC4xODYuMTE0YzE3Ljk1MiAzLjg1NiAxOS4yMzggMzIuMjM1IDE3LjE3IDMzLjUyOC0uNDA4LjI1NS0xLjcxNS4xMDgtMy40MzgtLjA4NS02Ljk4Ni0uNzgxLTIwLjgxOC0yLjMyOS05LjQwMiAxOC45NDguMTEzLjIxLS4wMzYuNDg4LS4yNzIuNTI1LTYuNDM4IDEgMS44MTIgMjEuMTczIDcuODc1IDM0LjQ2MXoiIGZpbGw9IiNmZmYiLz4KICAgIDxwYXRoIGQ9Im04NC4yOCA5MC42OThjLTEuMzY3LS42MzMtNi42MjEgMy4xMzUtMTAuMTEgNi4wMjgtLjcyOC0xLjAzMS0yLjEwMy0xLjc4LTUuMjAzLTEuMjQyLTIuNzEzLjQ3Mi00LjIxMSAxLjEyNi00Ljg4IDIuMjU0LTQuMjgzLTEuNjIzLTExLjQ4OC00LjEzLTEzLjIyOS0xLjcxLTEuOTAyIDIuNjQ2LjQ3NiAxNS4xNjEgMy4wMDMgMTYuNzg2IDEuMzIuODQ5IDcuNjMtMy4yMDggMTAuOTI2LTYuMDA1LjUzMi43NDkgMS4zODggMS4xNzggMy4xNDggMS4xMzcgMi42NjItLjA2MiA2Ljk3OS0uNjgxIDcuNjQ5LTEuOTIxLjA0LS4wNzUuMDc1LS4xNjQuMTA1LS4yNjYgMy4zODggMS4yNjYgOS4zNSAyLjYwNiAxMC42ODIgMi40MDYgMy40Ny0uNTIxLS40ODQtMTYuNzIzLTIuMDktMTcuNDY3eiIgZmlsbD0iIzNjYTgyYiIvPgogICAgPHBhdGggZD0ibTc0LjQ5IDk3LjA5N2MuMTQ0LjI1Ni4yNi41MjYuMzU4LjguNDgzIDEuMzUyIDEuMjcgNS42NDguNjc0IDYuNzA5LS41OTUgMS4wNjItNC40NTkgMS41NzQtNi44NDMgMS42MTVzLTIuOTItLjgzMS0zLjQwMy0yLjE4MWMtLjM4Ny0xLjA4MS0uNTc3LTMuNjIxLS41NzItNS4wNzUtLjA5OC0yLjE1OC42OS0yLjkxNiA0LjMzNC0zLjUwNiAyLjY5Ni0uNDM2IDQuMTIxLjA3MSA0Ljk0NC45NCAzLjgyOC0yLjg1NyAxMC4yMTUtNi44ODkgMTAuODM4LTYuMTUyIDMuMTA2IDMuNjc0IDMuNDk5IDEyLjQyIDIuODI2IDE1LjkzOS0uMjIgMS4xNTEtMTAuNTA1LTEuMTM5LTEwLjUwNS0yLjM4IDAtNS4xNTItMS4zMzctNi41NjUtMi42NS02Ljcxem0tMjIuNTMtMS42MDljLjg0My0xLjMzMyA3LjY3NC4zMjUgMTEuNDI0IDEuOTkzIDAgMC0uNzcgMy40OTEuNDU2IDcuNjA0LjM1OSAxLjIwMy04LjYyNyA2LjU1OC05LjggNS42MzctMS4zNTUtMS4wNjUtMy44NS0xMi40MzItMi4wOC0xNS4yMzR6IiBmaWxsPSIjNGNiYTNjIi8+CiAgICA8cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im01NS4yNjkgNjguNDA2Yy41NTMtMi40MDMgMy4xMjctNi45MzIgMTIuMzIxLTYuODIyIDQuNjQ4LS4wMTkgMTAuNDIyLS4wMDIgMTQuMjUtLjQzNmE1MS4zMTIgNTEuMzEyIDAgMCAwIDEyLjcyNi0zLjA5NWMzLjk4LTEuNTE5IDUuMzkyLTEuMTggNS44ODctLjI3Mi41NDQuOTk5LS4wOTcgMi43MjItMS40ODggNC4zMDktMi42NTYgMy4wMy03LjQzMSA1LjM4LTE1Ljg2NSA2LjA3Ni04LjQzMy42OTgtMTQuMDItMS41NjUtMTYuNDI1IDIuMTE4LTEuMDM4IDEuNTg5LS4yMzYgNS4zMzMgNy45MiA2LjUxMiAxMS4wMiAxLjU5IDIwLjA3Mi0xLjkxNyAyMS4xOS4yMDEgMS4xMTkgMi4xMTgtNS4zMjMgNi40MjgtMTYuMzYyIDYuNTE4cy0xNy45MzQtMy44NjUtMjAuMzc5LTUuODNjLTMuMTAyLTIuNDk1LTQuNDktNi4xMzMtMy43NzUtOS4yNzl6IiBmaWxsPSIjZmMzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KICAgIDxnIGZpbGw9IiMxNDMwN2UiIG9wYWNpdHk9Ii44Ij4KICAgICAgPHBhdGggZD0ibTY5LjMyNyA0Mi4xMjdjLjYxNi0xLjAwOCAxLjk4MS0xLjc4NiA0LjIxNi0xLjc4NiAyLjIzNCAwIDMuMjg1Ljg4OSA0LjAxMyAxLjg4LjE0OC4yMDItLjA3Ni40NC0uMzA2LjM0YTU5Ljg2OSA1OS44NjkgMCAwIDEgLS4xNjgtLjA3M2MtLjgxNy0uMzU3LTEuODItLjc5NS0zLjU0LS44Mi0xLjgzOC0uMDI2LTIuOTk3LjQzNS0zLjcyNy44MzEtLjI0Ni4xMzQtLjYzNC0uMTMzLS40ODgtLjM3MnptLTI1LjE1NyAxLjI5YzIuMTctLjkwNyAzLjg3Ni0uNzkgNS4wODEtLjUwNC4yNTQuMDYuNDMtLjIxMy4yMjctLjM3Ny0uOTM1LS43NTUtMy4wMy0xLjY5Mi01Ljc2LS42NzQtMi40MzcuOTA5LTMuNTg1IDIuNzk2LTMuNTkyIDQuMDM4LS4wMDIuMjkyLjYuMzE3Ljc1Ni4wNy40Mi0uNjcgMS4xMi0xLjY0NiAzLjI4OS0yLjU1M3oiLz4KICAgICAgPHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNzUuNDQgNTUuOTJhMy40NyAzLjQ3IDAgMCAxIC0zLjQ3NC0zLjQ2MiAzLjQ3IDMuNDcgMCAwIDEgMy40NzUtMy40NiAzLjQ3IDMuNDcgMCAwIDEgMy40NzQgMy40NiAzLjQ3IDMuNDcgMCAwIDEgLTMuNDc1IDMuNDYyem0yLjQ0Ny00LjYwOGEuODk5Ljg5OSAwIDAgMCAtMS43OTkgMGMwIC40OTQuNDA1Ljg5NS45Ljg5NS40OTkgMCAuOS0uNC45LS44OTV6bS0yNS40NjQgMy41NDJhNC4wNDIgNC4wNDIgMCAwIDEgLTQuMDQ5IDQuMDM3IDQuMDQ1IDQuMDQ1IDAgMCAxIC00LjA1LTQuMDM3IDQuMDQ1IDQuMDQ1IDAgMCAxIDQuMDUtNC4wMzcgNC4wNDUgNC4wNDUgMCAwIDEgNC4wNSA0LjAzN3ptLTEuMTkzLTEuMzM4YTEuMDUgMS4wNSAwIDAgMCAtMi4wOTcgMCAxLjA0OCAxLjA0OCAwIDAgMCAyLjA5NyAweiIgZmlsbC1ydWxlPSJldmVub2RkIi8+CiAgICA8L2c+CiAgICA8cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im02NCAxMTcuNzVjMjkuNjg1IDAgNTMuNzUtMjQuMDY1IDUzLjc1LTUzLjc1cy0yNC4wNjUtNTMuNzUtNTMuNzUtNTMuNzUtNTMuNzUgMjQuMDY1LTUzLjc1IDUzLjc1IDI0LjA2NSA1My43NSA1My43NSA1My43NXptMCA1YzMyLjQ0NyAwIDU4Ljc1LTI2LjMwMyA1OC43NS01OC43NXMtMjYuMzAzLTU4Ljc1LTU4Ljc1LTU4Ljc1LTU4Ljc1IDI2LjMwMy01OC43NSA1OC43NSAyNi4zMDMgNTguNzUgNTguNzUgNTguNzV6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+'
    }
}
