## Links 

- [Privacy Test Pages, Form Submissions](https://privacy-test-pages.glitch.me/autofill/form-submission.html)

## `getRuntimeConfiguration()`

- `windowsInteropPostMessage({ Feature: 'Autofill', Name: 'getRuntimeConfiguration' })`
- Response Message via: `windowsInteropAddEventListener({type: "getRuntimeConfigurationResponse", success: {...} }')`
  - See [Response Schema](../src/schemas/response.getRuntimeConfiguration.schema.json)

**request example**

```js
windowsInteropPostMessage({ Feature: 'Autofill', Name: 'getRuntimeConfiguration' })
```

**`response`** example, via:

```js
windowsInteropAddEventListener('message', (event) => {...})
```

Where `event.data` is:

```json
{
  "type": "getRuntimeConfigurationResponse",
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
        "name": "windows"
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
    }
  }
}
```

--- 

## `getAvailableInputTypes()`

This represents which input types we can autofill for the current user.

- `windowsInteropPostMessage({ Feature: 'Autofill', Name: 'getAvailableInputTypes' })`
- Response Message via: `windowsInteropAddEventListener({type: "getAvailableInputTypesResponse", success: {...} }')`
  - See [Response Schema](../src/schemas/getAvailableInputTypes.result.json)

**request example**

```js
windowsInteropPostMessage({ Feature: 'Autofill', Name: 'getAvailableInputTypes' })
```

**`response`** example, via: 

```js
windowsInteropAddEventListener('message', (event) => {...})
```

where `event.data` is:

```json
{
  "type": "getAvailableInputTypesResponse",
  "success": {
    "email": false,
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

This represents which input types we can autofill for the current user. Values are `true` if we can autofill the
field type with at least one item. For example, if we have two credential items and the first only has a username
and the second only has a password, both fields will be `true`. At this time `identities` and `creditCards` are
optional as they are not supported on Windows.

---

## `getAutofillData(request)`

see:

- [../src/schemas/getAutofillData.params.json](../src/schemas/getAutofillData.params.json)
- [../src/schemas/getAutofillData.result.json](../src/schemas/getAutofillData.result.json)

**request example**

```json
{
  "inputType": "credentials.username",
  "mainType": "credentials",
  "subType": "username",
  "serializedInputContext": "{\"inputType\":\"credentials.username\"}",
  "triggerContext": {
    "wasFromClick": true,
    "inputTop": -15,
    "inputLeft": -161,
    "inputHeight": 30,
    "inputWidth": 321
  }
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

## `overlay -> setSize()`

**request example**

```json
{
    "height": 50,
    "width": 320
}
```

---

## `overlay -> getAutofillInitData()`

- `windowsInteropPostMessage({ Feature: 'Autofill', Name: 'getAutofillInitData' })`
- Response Message via: `windowsInteropAddEventListener({type: "getAutofillInitDataResponse", success: {...} }')`
  - See [Response Schema](../src/schemas/getAutofillData.result.json)

**response example**

```json
{
  "type": "getAutofillInitDataResponse",
  "success": {
    "credentials": [
      {
        "id": "01",
        "username": "shane-123@duck.com",
        "password": "123456"
      }
    ],
    "creditCards": [],
    "identities": [],
    "serializedInputContext": "{}"
  }
}
```

--- 

## `overlay -> selectedDetail({ id: 01 })`

--- 

## `overlay -> closeAutofillParent()`
## `webpage -> closeAutofillParent()`

---

## `getAutofillCredentials({id: 01})`

- `windowsInteropPostMessage({ Feature: 'Autofill', Name: 'getAutofillCredentials', Data: { id: "01" } })`
- Response Message via: `windowsInteropAddEventListener({type: "getAutofillCredentialsResponse", success: {...} }')`
  - See [Request Schema](../src/schemas/getAutofillCredentials.params.json)
  - See [Response Schema](../src/schemas/getAutofillCredentials.result.json)

**request example**

```json
{
  "Feature": "Autofill",
  "Name": "getAutofillCredentials",
  "Data": {
    "id": "01"
  }
}
```

**response example**

```json
{
  "type": "getAutofillCredentialsResponse",
  "success": {
    "id": "01",
    "username": "shane-123@duck.com",
    "password": "123456"
  }
}
```

---

## `storeFormData(data)`

- `windowsInteropPostMessage({ Feature: 'Autofill', Name: 'storeFormData', Data: {...} })` 
- Currently, autofill doesn't care/listen for any response to this, but may do later.
- TODO: Schema for the 'data' argument above

**request example**

```js
const data = {
  "credentials": {
    "username": "dax@duck.com",
    "password": "123456"
  }
}
windowsInteropPostMessage({ Feature: 'Autofill', Name: 'storeFormData', Data: data })
```

---

String replacements

```
isTopFrame = true
// INJECT isTopFrame HERE

supportsTopFrame = true
// INJECT supportsTopFrame HERE

let isWindows = false
// INJECT isWindows HERE
```
