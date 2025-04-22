## `src/site-specific-feature.js`

The [site-specific-feature.js](https://github.com/duckduckgo/duckduckgo-autofill/blob/main/src/site-specific-feature.js) module provides APIs to find elements on a document, based on settings specified in the `siteSpecificFixes` feature in [privacy-configuration](https://github.com/duckduckgo/privacy-configuration). These are used during scanning, input matching or form creation to apply site specific fixes, which is useful when the default algorithm fails to identify elements algorithmically. It extends the [ConfigFeature](https://github.com/duckduckgo/content-scope-scripts/blob/main/injected/src/config-feature.js) class from content-scope-scripts, which provides APIs to read remote config settings.

Currently, it supports following type of fixes:

### Input type
Force an input element on the page to be a specific type.

- `inputTypeSettings`: This is an array of objects that contain the following properties:
- `selector`: A string that matches the input type.
- `type`: The type of input to apply - `login`, `signup`, or `hybrid`.

Example setting in remote config:
```json
{
  "inputTypeSettings": [
    {
      "selector": "input[type='email']",
      "type": "identities.emailAddress"
    }
  ]
}
```


### Form boundary
Force the form boundary to be a specific element on the page.
- `formBoundarySelector`: A string that matches the form on the page.

Example setting in remote config:
```json
{
  "formBoundarySelector": "form[name='login']"
}
```

### Form type
Force a form on a page to be a specific type.
- `selector`: A string that matches the form we want to fix.
- `type`: The type of form to apply, this matches the [SupportedTypes](https://github.com/duckduckgo/duckduckgo-autofill/blob/main/src/Form/matching.js#L755) we have in the code.

Example setting in remote config:
```json
{
  "formTypeSettings": [
    {
      "selector": "form[name='login']",
      "type": "identities.emailAddress"
    }
  ]
}
```
