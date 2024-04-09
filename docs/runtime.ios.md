## String replacement
On iOS and macOS, we string-replace these variables:

```js
// INJECT userPreferences HERE
// INJECT isApp HERE
// INJECT isTopFrame HERE
// INJECT supportsTopFrame HERE
// INJECT hasModernWebkitAPI HERE
// INJECT webkitMessageHandlerNames HERE
```

- `userPreferences`: sets the platform name
- `isApp`: true when is macOS
- `isTopFrame`: true when the script is being rendered in the overlay webview
- `supportsTopFrame`: true on macOS when the overlay webview is supported (now on all versions)
- `hasModernWebkitAPI`: now true on all versions, since we've dropped macOS Catalina
- `webkitMessageHandlerNames`: an array of all the expected call names, if we attempt a call that's not in the list, the script will error

## ~`getRuntimeConfiguration()`~

See: [../src/schema/runtimeConfiguration.json](../src/deviceApiCalls/schemas/runtimeConfiguration.json).

This includes the configurations needed for autofill to know what options are available on the specific page we're on, for example whether the domain is blocklisted by remote config, or whether a specific feature is turned on/off either remotely or by the user.

**Example:**

```json
{
  "success": {
    "contentScope": {
      "features": {
        "autofill": {
          "state": "enabled",
          "exceptions": []
        }
      },
      "unprotectedTemporary": []
    },
    "userUnprotectedDomains": [],
    "userPreferences": {
      "debug": false,
      "platform": {
        "name": "ios"
      },
      "features": {
        "autofill": {
          "settings": {
            "featureToggles": {
              "inputType_credentials": true,
              "inputType_identities": false,
              "inputType_creditCards": false,
              "emailProtection": true,
              "password_generation": true,
              "credentials_saving": true
            }
          }
        }
      }
    }
  }
}
```

---

## `getAvailableInputTypes()`

see: [../src/deviceApiCalls/schemas/getAvailableInputTypes.result.json](../src/deviceApiCalls/schemas/getAvailableInputTypes.result.json)

This represents which input types we can autofill for the current user. Values are `true` if we can autofill the
field type with at least one item. For example, if we have two credential items and the first only has a username
and the second only has a password, both fields will be `true`.

```json
{
  "success": {
    "email": true,
    "credentials": {
      "username": true,
      "password": true
    },
    "identities": {
      "firstName": false,
      "middleName": false,
      "lastName": false,
      "birthdayDay": false,
      "birthdayMonth": false,
      "birthdayYear": false,
      "addressStreet": false,
      "addressStreet2": false,
      "addressCity": false,
      "addressProvince": false,
      "addressPostalCode": false,
      "addressCountryCode": false,
      "phone": false,
      "emailAddress": false
    },
    "creditCards": {
      "cardName": false,
      "cardSecurityCode": false,
      "expirationMonth": false,
      "expirationYear": false,
      "cardNumber": false
    }
  }
}
```

---

## `storeFormData(data)`

- See: [../src/deviceApiCalls/schemas/storeFormData.params.json](../src/deviceApiCalls/schemas/storeFormData.params.json)
- Note: Currently, autofill doesn't care/listen for any response.

**request example 1**

```json
{
  "credentials": {
    "username": "dax@duck.com",
    "password": "123456"
  },
  "trigger": "passwordGeneration"
}
```

**request example 2**

```json
{
  "credentials": {
    "password": "123456"
  },
  "trigger": "formSubmission"
}
```

---

## `getAutofillData(request)`

see: 
 
- [../src/deviceApiCalls/schemas/getAutofillData.params.json](../src/deviceApiCalls/schemas/getAutofillData.params.json)
- [src/deviceApiCalls/schemas/getAutofillData.result.json](src/deviceApiCalls/schemas/getAutofillData.result.json)

**`request`** example

```json
{
  "type": "credentials.username",
  "mainType": "credentials",
  "subType": "username"
}
```

**`response`** examples

1) autofill a field:

```json
{
  "success": {
    "action": "fill",
    "credentials": {
      "username": "dax@example.com",
      "password": "123456"
    }
  }
}
```

2) re-focus a field (to present the keyboard)

```json
{
  "success": {
    "action": "focus"
  }
}
```

3) Do nothing:

```json
{
  "success": {
    "action": "none"
  }
}
```
---

## Password generation

**`request`** example when a password can be generated

```json
{
  "inputType": "credentials.password",
  "mainType": "credentials",
  "subType": "password",
  "trigger": "userInitiated",
  "generatedPassword": {
    "username": "user@name.com",
    "value": "r3nd0mP@ssword"
  }
}
```

**`response`** examples

```json
{
  "success": {
    "action": "acceptGeneratedPassword"
  },
  "type": "getAutofillDataResponse"
}
```

```json
{
  "success": {
    "action": "rejectGeneratedPassword"
  },
  "type": "getAutofillDataResponse"
}
```


