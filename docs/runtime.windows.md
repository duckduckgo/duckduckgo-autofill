## `getRuntimeConfiguration()`

- `window.chrome.webview.postMessage({ type: 'getRuntimeConfiguration' })`
- Response Message via: `window.chrome.webview.addEventListener({type: "getRuntimeConfigurationResponse", success: {...} }')`
  - See [Response Schema](../src/schema/response.getRuntimeConfiguration.schema.json)
- [Runtime Configuration Schema (linked from above, but in a separate repo)](https://github.com/duckduckgo/content-scope-scripts/blob/shane/unify-config/src/schema/runtime-configuration.schema.json)

**request example**

```js
window.chrome.webview.postMessage({ type: 'getRuntimeConfiguration' })
```

**`response`** example, via:

```js
window.chrome.webview.addEventListener('message', (event) => {...})
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

- `window.chrome.webview.postMessage({ type: 'getAvailableInputTypes' })`
- Response Message via: `window.chrome.webview.addEventListener({type: "getAvailableInputTypesResponse", success: {...} }')`
  - See [Response Schema](../src/schema/response.getAvailableInputTypes.schema.json)

**request example**

```js
window.chrome.webview.postMessage({ type: 'getAvailableInputTypes' })
```

**`response`** example, via: 

```js
window.chrome.webview.addEventListener('message', (event) => {...})
```

where `event.data` is:

```json
{
  "type": "getAvailableInputTypesResponse",
  "success": {
    "email": true,
    "credentials": true
  }
}
```

---

## `storeFormData(data)`

- `window.chrome.webview.postMessage({ type: 'storeFormData', data: {...} })` 
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
window.chrome.webview.postMessage({ type: 'storeFormData', data: data })
```
