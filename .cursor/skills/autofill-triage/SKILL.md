---
name: autofill-triage
description: Fix autofill classification bugs from a list of URLs and descriptions. Decides between algorithm fixes in duckduckgo-autofill and remote rules in privacy-configuration. Use when triaging autofill bugs, fixing form detection issues, or working with siteSpecificFixes.
---

# Autofill Bug Triage

## Input

A list of `(URL, description)` pairs. All need fixing. Example:

```
1. https://example.com/login - email field not detected (macOS)
2. https://example.com/signup - form treated as login (iOS)
```

## Fix Path Decision Tree

After fetching the page HTML, adding a test form, and running the classifier:

| Diagnosis | Fix | Where |
|-----------|-----|-------|
| Form scored as wrong type (login vs signup) | `formTypeSettings` | Remote rule in privacy-configuration |
| Individual field misclassified | `inputTypeSettings` | Remote rule in privacy-configuration |
| Fields outside detected form boundary | `formBoundarySelector` | Remote rule in privacy-configuration |
| Too many inputs, page hits failsafe | `failsafeSettings` | Remote rule in privacy-configuration |
| Common pattern across many unrelated sites | Matcher regex/selector update | `src/Form/matching-config/matching-config-source.js` |
| Not an autofill classification issue | Flag for manual review | N/A |

**Default to remote rule.** It is self-contained, zero regression risk, and deploys without a release. Choose algorithm fix only when the same pattern appears on multiple unrelated sites and a regex/selector change would be a net positive across the existing test suite.

See [remote-rules-guide.md](remote-rules-guide.md) for the JSON schema and real examples.

## Test Form Conventions

Follow the existing [add-test-form rule](../../.cursor/rules/add-test-form.mdc) and these conventions:

- File: `test-forms/<sitename>_<formtype>.html` (e.g. `instagram_login.html`)
- Content: just the `<form>` element -- no DOCTYPE, html, head, or body wrappers
- Strip: `data-ddg-autofilled`, `data-ddg-inputType`, all `img`, `svg`, inline `style` attrs, `script` tags and their content
- Annotate inputs with `data-manual-scoring` using **subtype only**:
  - `password.current`, `password.new` (not `credentials.password.current`)
  - `emailAddress` (not `identities.emailAddress`)
  - `username`, `firstName`, `cardNumber`, etc.
- Annotate submit buttons with `data-manual-submit`
- Reference `prettifyAndCleanHTML` in `debug/scanner-debug.js` for cleanup logic
- Register via `node scripts/save-form-to-test-suite.js <filename>`
- Use `expectedFailures` in `test-forms/index.json` for known-broken fields

### Running Tests

```bash
# Single test form
npx jest --verbose=false -t '<filename>.html'

# Full classifier suite
npm run test:unit

# After matcher config changes, rebuild first
npm run build && npm run test:unit
```

## PR Review Patterns

Distilled from PRs #883, #901, #903, #924, #4694, #4779:

- **Regex simplicity**: non-capturing groups add no benefit with `RegExp.test`. Prefer `access.+?settings` over `(?:access)(?:\\s)(?:settings)`.
- **Narrow scope**: prefer `urlPattern` over `domain` in remote rule conditions when the fix is page-specific. Broad domain conditions can break non-target forms (e.g. forcing all forms on a domain to "login").
- **Prefer remote config**: use `conditionalChanges` in privacy-configuration rather than hardcoding domain checks in autofill code. Gets remote disabling, path matching, and experiment support for free.
- **Every fix needs a test form**: reviewers will ask "how do we test this?"
- **Reuse existing scripts**: `save-form-to-test-suite.js` for registration, `prettifyAndCleanHTML` for cleanup reference.
- **All platforms**: remote rule changes must go in ALL platform override files (`ios-override.json`, `android-override.json`, `macos-override.json`, `windows-override.json`) unless platform-specific.

## Key Codebase Paths

| File | Role |
|------|------|
| `src/Form/matching.js` | Classifier: `Matching` class, `inferInputType`, `setInputType` |
| `src/Form/matching-config/matching-config-source.js` | Matcher definitions: field types, strategies, regexes |
| `src/Form/matching-config/selectors-css.js` | CSS selector pieces merged into config |
| `src/Form/FormAnalyzer.js` | Form type scoring: login vs signup signals |
| `src/site-specific-feature.js` | `SiteSpecificFeature`: reads `siteSpecificFixes` from remote config |
| `src/Form/input-classifiers.test.js` | Test runner for `test-forms/` corpus |
| `test-forms/index.json` | Registry of test forms with expected results |
| `src/testConfig/siteSpecificFixes/` | Local test JSON for remote rule integration tests |
| `scripts/save-form-to-test-suite.js` | CLI to register a new test form |
| `debug/scanner-debug.js` | Contains `prettifyAndCleanHTML` |

## Valid Input Subtypes

For `data-manual-scoring` annotations and `inputTypeSettings` type values:

**Credentials:** `username`, `password.current`, `password.new`, `totp`
**Identities:** `emailAddress`, `firstName`, `middleName`, `lastName`, `phone`, `addressStreet`, `addressStreet2`, `addressCity`, `addressProvince`, `addressPostalCode`, `addressCountryCode`, `birthdayDay`, `birthdayMonth`, `birthdayYear`
**Credit Cards:** `cardName`, `cardNumber`, `cardSecurityCode`, `expirationMonth`, `expirationYear`, `expiration`

For `inputTypeSettings` in remote rules, use the fully qualified type: `credentials.username`, `identities.emailAddress`, `creditCards.cardNumber`, etc. Use `unknown` to force a field to be ignored.

## Limitations

- **SPA pages**: HTML fetch may miss client-rendered forms. Check for empty `<form>` or framework root elements.
- **Auth-gated pages**: login forms behind redirects cannot be fetched. Flag for manual review.
- **Algorithm changes**: always run the full test suite and account for any new `expectedFailures`.
