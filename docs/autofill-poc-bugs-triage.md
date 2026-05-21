# Autofill POC Bugs Triage (from `poc-bugs.md`)

This document records the triage outcome for the 10 POC bugs and the implementation decisions taken in this repository.

## Scope

- Source bug set: `.cursor/skills/autofill-triage/poc-bugs.md`
- This repo can add classifier tests and algorithm fixes.
- Remote site-specific rules live in `duckduckgo/privacy-configuration`.

## Outcome Matrix

| # | URL | Initial report | Repro status in this repo | Diagnosis | Action taken |
|---|-----|----------------|----------------------------|-----------|--------------|
| 1 | `aestheticcity.academy/order?...` | email autofill not showing | Partial repro (checkout DOM visible, no `<form>`, no password flow) | Looks like checkout/non-credentials flow in captured session | **Manual review** (needs deterministic capture in app session) |
| 2 | `visa.vfsglobal.com/.../login` | login form not detected | Not reproducible (session/page-not-found flows) | Already fixed upstream | **No local code change**; covered by privacy-config PR #4694 |
| 3 | `vanguard.com` | autofill not triggering on login | Not reproducible (landing/corporate DOM, no login form) | Missing deterministic login form capture | **Manual review** |
| 4 | `nutracheck.co.uk` | not prompted for credentials | Reproducible | Login form classification works in local test | Added `test-forms/nutracheck_login.html` (regression coverage) |
| 5 | `bet365.bet.br` | login interpreted as signup | Not reproducible (Cloudflare) | Already fixed upstream | **No local code change**; covered by privacy-config PR #4779 |
| 6 | `kathykuohome.com/Account/Login...` | fills login + create password fields | Reproducible | Mixed login/signup form caused registration password variant to be inferred as current | Added regression test form + algorithm fix in `src/Form/matching.js` |
| 7 | `login.app.carta.com/registration/` | sign in treated as sign up | Reproducible as login page | Captured page classifies correctly in local test | Added `test-forms/carta_login.html` (coverage), no algorithm change needed |
| 8 | `fedex.com/secure-login/#/credentials` | username fills, password not | Not reproducible (system-down/permission page in automation) | Existing local `fedex_login.html` already passes | **Manual review** for current production DOM |
| 9 | `myrecipes.com` | no email autofill on signup | Partial repro (auth page reachable; only email step exposed) | Signup step not deterministically reachable in automation | **Manual review** (needs signup-step capture) |
| 10 | `payments.municipay.com/.../checkout/account` | generate password when should be fill | Reproducible | Captured login modal classifies correctly as login in local test | Added `test-forms/municipay_login.html` (coverage), no algorithm change needed |

## Implemented Changes

### 1) New triage regression forms

- `test-forms/nutracheck_login.html`
- `test-forms/municipay_login.html`
- `test-forms/kathykuohome_login.html`
- `test-forms/carta_login.html`
- `test-forms/index.json` updated to include all new forms.

### 2) Algorithm fix

File: `src/Form/matching.js` (`inferPasswordVariant`)

- Added attribute-level new-password hints for registration/create/confirm patterns:
  - `reg(istration)?[_-]?password`
  - `confirm.?password`
  - `password.?confirm`
  - `signup.?password`
  - `create.?password`
- This fixes the reproduced mixed-form variant bug on Kathy Kuo where `Reg_Password` was inferred as `credentials.password.current` instead of `credentials.password.new`.

## Validation Evidence

Targeted classifier tests:

- `npx jest --verbose=false -t "kathykuohome_login.html"`  
  - failed before fix (`password.new` mismatch), passes after fix
- `npx jest --verbose=false -t "nutracheck_login.html"` pass
- `npx jest --verbose=false -t "municipay_login.html"` pass
- `npx jest --verbose=false -t "carta_login.html"` pass
- `npx jest --verbose=false -t "nutracheck_login.html|municipay_login.html|kathykuohome_login.html|carta_login.html"` pass

Regression suites around changed logic:

- `npx jest --verbose=false src/Form/matching.test.js src/Form/Form.test.js` pass

## Upstream Rule Notes

Already fixed in `privacy-configuration`:

- #2 visa.vfsglobal — PR #4694 (merged)
- #5 bet365 — PR #4779 (merged)

No additional upstream rule patch is proposed from this run because unresolved items were not deterministically reproducible in this environment.
