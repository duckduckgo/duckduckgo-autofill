# POC Bug Set (10 Bugs)

These bugs are from Asana project `1200930669568058` (Autofill Bugs). All are login/signup classification issues with URLs.

## Freeform Input Format

```
1. https://www.aestheticcity.academy/order?ct=6f063eb4-ffcf-404d-b5af-c8dc0e125b1f - email autofill not showing (macOS)
2. https://visa.vfsglobal.com/tur/tr/bgr/login - login form not detected (macOS)
3. https://www.vanguard.com/ - autofill not triggering on login (Windows)
4. https://www.nutracheck.co.uk/ - not prompted for username/password (macOS)
5. https://bet365.bet.br/ - login interpreted as signup (all platforms)
6. https://www.kathykuohome.com/Account/Login?returnURL=/MyAccount/Index - fills both login and create password fields (macOS)
7. https://login.app.carta.com/registration/ - sign in treated as sign up, offers password generation (macOS)
8. https://www.fedex.com/secure-login/#/credentials - autofills username but not password (macOS)
9. https://www.myrecipes.com/ - no autofill email on signup form (macOS)
10. https://payments.municipay.com/3d6e6e293862bf598b01018650cff198/checkout/account - generate password when should be fill (macOS)
```

## Asana Task IDs

| # | Asana GID | URL | Issue |
|---|-----------|-----|-------|
| 1 | 1214079535948031 | aestheticcity.academy | Email field not detected |
| 2 | 1211438426139074 | visa.vfsglobal.com | Login form not detected (has existing remote rule PR #4694) |
| 3 | 1213480774989095 | vanguard.com | Autofill not triggering |
| 4 | 1212683281389044 | nutracheck.co.uk | Not prompted for credentials |
| 5 | 1211716411030109 | bet365.bet.br | Login scored as signup (has remote rule PR #4779) |
| 6 | 1213756042691338 | kathykuohome.com | Login + signup on same page, wrong fill |
| 7 | 1211065562517472 | login.app.carta.com | Login treated as signup |
| 8 | 1212323467801651 | fedex.com | Username fills, password does not |
| 9 | 1211918467048620 | myrecipes.com | Email field not detected on signup |
| 10 | 1213076151927184 | municipay.com | Password confirm treated as generate |

## Expected Issue Categories

- **Wrong form type (login vs signup):** #5, #6, #7, #10
- **Field not detected / not triggered:** #1, #2, #3, #4, #8
- **Field not offered on signup:** #9

## Bugs With Existing Fixes (for validation)

- **#2 (visa.vfsglobal.com):** Has merged remote rule PR #4694 in privacy-configuration -- `formTypeSettings` fix with `urlPattern` condition
- **#5 (bet365.bet.br):** Has open remote rule PR #4779 in privacy-configuration -- `formBoundarySelector` fix with `domain` condition
