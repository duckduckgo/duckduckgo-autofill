## ~`getRuntimeConfiguration()`~

on Apple devices, this data is retrieved from the following string-replacements

- [BrowserServices Kit String replacements](https://github.com/duckduckgo/BrowserServicesKit/blob/main/Sources/BrowserServicesKit/Autofill/AutofillUserScript+SourceProvider.swift#L54-L56)

Internally, we force it into the following shape in order to conform to the following schema definition:
- [Runtime Configuration Schema](https://github.com/duckduckgo/content-scope-scripts/blob/shane/unify-config/src/schema/runtime-configuration.schema.json)

**strings to replace**
```
// INJECT contentScope HERE
// INJECT userUnprotectedDomains HERE
// INJECT userPreferences HERE
```

Directly replace the lines above in the following way:

`str.replace('// INJECT contentScope HERE', 'contentScope = {JSON_HERE}') + ';'`

For example, the 3 variables should look like this (don't forget the semicolon at the end of each!)

```javascript
// INJECT contentScope HERE
contentScope = {
  "features": {
    "autofill": {
      "state": "enabled",
      "exceptions": []
    }
  },
  "unprotectedTemporary": []
};
```

```javascript
// INJECT userUnprotectedDomains HERE
userUnprotectedDomains = [];
```

```javascript
// INJECT userPreferences HERE
userPreferences = {
  "debug": false,
  "platform": {
    "name": "android"
  },
  "features": {
    "autofill": {
      "settings": {
        "featureToggles": {
          "inputType_credentials": true,
          "inputType_identities": false,
          "inputType_creditCards": false,
          "emailProtection": true,
          "password_generation": false,
          "credentials_saving": true
        }
      }
    }
  }
};
```

---

## `getAvailableInputTypes()`

see:

- [../src/deviceApiCalls/schemas/getAvailableInputTypes.result.json](../src/deviceApiCalls/schemas/getAvailableInputTypes.result.json)

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


