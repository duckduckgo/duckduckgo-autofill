# siteSpecificFixes Remote Rules Reference

Remote rules live in `privacy-configuration` override files under `features.autofill.features.siteSpecificFixes.settings.conditionalChanges`.

Each override file must be updated: `ios-override.json`, `android-override.json`, `macos-override.json`, `windows-override.json`.

## Structure

```json
{
    "conditionalChanges": [
        {
            "condition": [{ "domain": "example.com" }],
            "patchSettings": [
                {
                    "path": "/inputTypeSettings/-",
                    "op": "add",
                    "value": { "selector": "...", "type": "..." }
                }
            ]
        }
    ]
}
```

## Condition Types

**Domain match** (matches all pages on a domain):
```json
"condition": [{ "domain": "example.com" }]
```

**URL pattern match** (matches specific paths -- preferred when fix is page-specific):
```json
"condition": { "urlPattern": "https://example.com/login*" }
```

**Multiple domains** (array = OR):
```json
"condition": [{ "domain": "example.com" }, { "domain": "localhost" }]
```

## Fix Types

### 1. inputTypeSettings -- Force input type by CSS selector

Path: `/inputTypeSettings/-` (append) | Op: `add`

```json
{
    "condition": [{ "domain": "cvs.com" }],
    "patchSettings": [{
        "path": "/inputTypeSettings/-",
        "op": "add",
        "value": {
            "selector": "profile-lookup[app-name='account-login'] input[type='text']",
            "type": "credentials.username"
        }
    }]
}
```

Type values use the fully qualified form: `credentials.username`, `credentials.password.new`, `identities.emailAddress`, `creditCards.cardNumber`, `unknown`, etc.

Setting type to `unknown` forces autofill to ignore the field:

```json
{
    "condition": [{ "domain": "asana.com" }],
    "patchSettings": [{
        "path": "/inputTypeSettings/-",
        "op": "add",
        "value": {
            "selector": "input.TextInputBase.TokenizerInput-input[data-testid='tokenizer-input']",
            "type": "unknown"
        }
    }]
}
```

Multiple inputs can be fixed in one entry:

```json
{
    "condition": [{ "domain": "gamestop.com" }],
    "patchSettings": [
        {
            "path": "/inputTypeSettings/-",
            "op": "add",
            "value": {
                "selector": "input[name='dwfrm_profile_customer_email']",
                "type": "identities.emailAddress"
            }
        },
        {
            "path": "/inputTypeSettings/-",
            "op": "add",
            "value": {
                "selector": "input[name='dwfrm_profile_login_password']",
                "type": "credentials.password.new"
            }
        }
    ]
}
```

### 2. formTypeSettings -- Force form type by CSS selector

Path: `/formTypeSettings/-` (append) | Op: `add`

Type is `login` or `signup`.

```json
{
    "condition": [{ "domain": "ring.com" }],
    "patchSettings": [{
        "path": "/formTypeSettings/-",
        "op": "add",
        "value": {
            "selector": "body > main > section > form:nth-child(2)",
            "type": "signup"
        }
    }]
}
```

Page-specific example using `urlPattern`:

```json
{
    "condition": {
        "urlPattern": "https://visa.vfsglobal.com/tur/tr/bgr/login*"
    },
    "patchSettings": [{
        "path": "/formTypeSettings/-",
        "op": "add",
        "value": {
            "selector": "form",
            "type": "login"
        }
    }]
}
```

### 3. formBoundarySelector -- Override form container

Path: `/formBoundarySelector` | Op: `replace`

Use when the classifier picks the wrong element as the form container.

```json
{
    "condition": {
        "urlPattern": "https://identity.gamestop.com/interaction/:uid"
    },
    "patchSettings": [{
        "path": "/formBoundarySelector",
        "op": "replace",
        "value": ".gamestop-card__root"
    }]
}
```

### 4. failsafeSettings -- Adjust page limits

Path: `/failsafeSettings/maxInputsPerPage` (or `maxFormsPerPage`, `maxInputsPerForm`) | Op: `add`

Use when a page has many inputs and hits the default limit.

```json
{
    "condition": [{ "domain": "coolors.co" }],
    "patchSettings": [{
        "path": "/failsafeSettings/maxInputsPerPage",
        "op": "add",
        "value": 110
    }]
}
```

## JSON Patch Operations

| Op | Path | Effect |
|----|------|--------|
| `add` | `/inputTypeSettings/-` | Append to array |
| `add` | `/failsafeSettings/maxInputsPerPage` | Set value |
| `replace` | `/formBoundarySelector` | Replace existing value |

The `/-` suffix means "append to the end of the array."

## Testing Remote Rules Locally

Local test configs live in `src/testConfig/siteSpecificFixes/`. See existing examples:
- `input-type.json` -- inputTypeSettings
- `login-to-signup.json` -- formTypeSettings
- `form-boundary.json` -- formBoundarySelector
- `signup-to-login.json` -- formTypeSettings (reverse)
