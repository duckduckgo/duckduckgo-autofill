## `src/Settings.js`

Autofill needs access to certain pieces of state before it can perform any page scanning, 
therefor a 'Settings' object has been introduced to allow this state to be queried and updated before
any page scanning occurs.

## Properties

`settings.featureToggles` 
 
The platform in question will deliver feature toggles (boolean flags) based on device support, user preferences, or a combination of both. Inside Autofill we don't make any distinction about 'how' the toggles are set, we just ask the platform for them and then use them verbatim. This prevents additional logic from bleeding into the Autofill codebase.

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
