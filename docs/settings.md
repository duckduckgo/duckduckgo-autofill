## `src/Settings.js`

Autofill requires access to specific state information before performing any page scanning. To facilitate this, a 'Settings' object has been introduced, enabling the state to be queried and updated prior to any page scanning

## Properties

`settings.featureToggles`

The platform will provide feature toggles (boolean flags) based on device support, user preferences, or a combination of both. Within Autofill, we do not differentiate *how* these toggles are set. We simply request them from the platform and use them as they are. This approach prevents additional logic from infiltrating the Autofill codebase.

- `inputType_credentials` - whether the device can autofill credentials
- `inputType_identities` - whether the device can autofill identities
- `inputType_creditCards` - whether the device can autofill creditCards
- `emailProtection` - whether the device supports email protection
- `password_generation` - if the device can offer generated passwords
- `credentials_saving` - if the device should offer to capture submitted form data to save

---

`settings.availableInputTypes`

Another set of boolean flags, this time indicating which data types the current user can autofill.
Credentials are domain-specific. These represent which input types we can autofill for the current user.
Values are `true` if we can autofill the field type with at least one item. For example, if we have two
credential items and the first only has a username and the second only has a password, both fields will be `true`.

Note: `availableInputTypes.email` is only currently used on android. In the future all platforms will migrate to this.

```json
{
  "email": Boolean,
  "credentials": {
    "username": Boolean,
    "password": Boolean
  },
  "identities": {
    "firstName": Boolean,
    "middleName": Boolean,
    "lastName": Boolean,
    "birthdayDay": Boolean,
    "birthdayMonth": Boolean,
    "birthdayYear": Boolean,
    "addressStreet": Boolean,
    "addressStreet2": Boolean,
    "addressCity": Boolean,
    "addressProvince": Boolean,
    "addressPostalCode": Boolean,
    "addressCountryCode": Boolean,
    "phone": Boolean,
    "emailAddress": Boolean
  },
  "creditCards": {
    "cardName": Boolean,
    "cardSecurityCode": Boolean,
    "expirationMonth": Boolean,
    "expirationYear": Boolean,
    "cardNumber": Boolean
  }
}
```

## Methods

`settings.refresh()`

Initially, this is called as an additional step that follows data access when the page loads.
