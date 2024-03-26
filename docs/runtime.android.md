## String replacement
On Android, the only string replacement needed is the platform name. We substitute this:

```js
// INJECT userPreferences HERE
```

with this

```js
userPreferences = {
    "debug": false,
    "platform": {
        "name": "android"
    }
}
```

## `getRuntimeConfiguration()`

See: [../src/schema/runtimeConfiguration.json](../src/deviceApiCalls/schemas/runtimeConfiguration.json).

This includes the configurations needed for autofill to know what options are available on the specific page we're on, for example whether the domain is blocklisted by remote config, or whether a specific feature is turned on/off either remotely or by the user.

Compared to other platforms, on Android we include `availableInputTypes` in the initial runtime configuration. We plan to adopt this to all platforms to reduce message passing.

**Example:**

```json
{
  "success": {
    "availableInputTypes": {
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
    },
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

See: [../src/schema/availableInputTypes.json](../src/deviceApiCalls/schemas/availableInputTypes.json).

This represents which input types we can autofill for the current user. Values are `true` if we can autofill the
field type with at least one item. For example, if we have two credential items and the first only has a username
and the second only has a password, both fields will be `true`. The email value is the same as returned by the
`isSignedIn()` method. At this time `identities` and `creditCards` are optional as they are not supported on Android.

On Android, this data is passed with the initial runtime configurations, so the call just returns the data we already received.

---

## `window.BrowserAutofill.storeFormData(data)`

**data** type: `string`

Autofill will send a *string* of JSON data, conforming to the following schema:

- See: [../src/deviceApiCalls/schemas/storeFormData.params.json](../src/deviceApiCalls/schemas/storeFormData.params.json)
- Note: Currently, autofill doesn't care/listen for any response.

**request example 1**

```js
const data = {
  "credentials": {
    "username": "dax@duck.com",
    "password": "123456"
  },
  "trigger": "passwordGeneration"
}
window.BrowserAutofill.storeFormData(JSON.stringify(data))

```
**request example 2**

```js
const data = {
  "credentials": {
    "password": "123456"
  },
  "trigger": "formSubmission"
}
window.BrowserAutofill.storeFormData(JSON.stringify(data))
```


```json
{
  "credentials": {
    "username": "dax@duck.com",
    "password": "123456"
  }
}
```

---

## `window.ddgGetAutofillData(request)`

- Autofill will send `request` as a string of JSON 
- See: [../src/schema/request.getAutofillData.schema.json](../src/deviceApiCalls/schemas/getAutofillData.params.json)
- Response Message via the listener to: `window.ddgGetAutofillData`
  - See: [../src/schema/response.getAutofillData.schema.json](../src/deviceApiCalls/schemas/getAutofillData.result.json)

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

2) re-focus a field (to present the keyboard where possible)

```json
{
  "success": {
    "action": "focus"
  }
}
```

3) do nothing

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
