# PlatformConfiguration Schema

```txt
#/definitions/RuntimeConfiguration
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                            |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------ |
| Can be instantiated | Yes        | Unknown status | No           | Forbidden         | Forbidden             | none                | [contentScope.schema.json](../../out/contentScope.schema.json "open original schema") |

## PlatformConfiguration Type

`object` ([PlatformConfiguration](contentscope.md))

# PlatformConfiguration Properties

| Property                                          | Type     | Required | Nullable       | Defined by                                                                                                                                         |
| :------------------------------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| [contentScope](#contentscope)                     | `object` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscope.md "#/definitions/RuntimeConfiguration#/properties/contentScope")                    |
| [userUnprotectedDomains](#userunprotecteddomains) | `array`  | Required | cannot be null | [PlatformConfiguration](contentscope-properties-userunprotecteddomains.md "#/definitions/RuntimeConfiguration#/properties/userUnprotectedDomains") |
| [userPreferences](#userpreferences)               | `object` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-userpreferences.md "#/definitions/RuntimeConfiguration#/properties/userPreferences")              |

## contentScope



`contentScope`

*   is required

*   Type: `object` ([ContentScope](contentscope-definitions-contentscope.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscope.md "#/definitions/RuntimeConfiguration#/properties/contentScope")

### contentScope Type

`object` ([ContentScope](contentscope-definitions-contentscope.md))

## userUnprotectedDomains



`userUnprotectedDomains`

*   is required

*   Type: unknown\[]

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-properties-userunprotecteddomains.md "#/definitions/RuntimeConfiguration#/properties/userUnprotectedDomains")

### userUnprotectedDomains Type

unknown\[]

## userPreferences



`userPreferences`

*   is required

*   Type: `object` ([UserPreferences](contentscope-definitions-userpreferences.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-userpreferences.md "#/definitions/RuntimeConfiguration#/properties/userPreferences")

### userPreferences Type

`object` ([UserPreferences](contentscope-definitions-userpreferences.md))

# PlatformConfiguration Definitions

## Definitions group ContentScope

Reference this group by using

```json
{"$ref":"#/definitions/RuntimeConfiguration#/definitions/ContentScope"}
```

| Property                                      | Type     | Required | Nullable       | Defined by                                                                                                                                                                                       |
| :-------------------------------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [features](#features)                         | `object` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscopefeatures.md "#/definitions/RuntimeConfiguration#/definitions/ContentScope/properties/features")                                     |
| [unprotectedTemporary](#unprotectedtemporary) | `array`  | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscope-properties-unprotectedtemporary.md "#/definitions/RuntimeConfiguration#/definitions/ContentScope/properties/unprotectedTemporary") |
| Additional Properties                         | Any      | Optional | can be null    |                                                                                                                                                                                                  |

### features



`features`

*   is required

*   Type: `object` ([ContentScopeFeatures](contentscope-definitions-contentscopefeatures.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscopefeatures.md "#/definitions/RuntimeConfiguration#/definitions/ContentScope/properties/features")

#### features Type

`object` ([ContentScopeFeatures](contentscope-definitions-contentscopefeatures.md))

### unprotectedTemporary



`unprotectedTemporary`

*   is required

*   Type: unknown\[]

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscope-properties-unprotectedtemporary.md "#/definitions/RuntimeConfiguration#/definitions/ContentScope/properties/unprotectedTemporary")

#### unprotectedTemporary Type

unknown\[]

### Additional Properties

Additional properties are allowed and do not have to follow a specific schema

## Definitions group ContentScopeFeatures

Reference this group by using

```json
{"$ref":"#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatures"}
```

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                               |
| :-------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Additional Properties | `object` | Optional | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatures/additionalProperties") |

### Additional Properties

Additional properties are allowed, as long as they follow this schema:



*   is optional

*   Type: `object` ([ContentScopeFeatureItem](contentscope-definitions-contentscopefeatureitem.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatures/additionalProperties")

#### additionalProperties Type

`object` ([ContentScopeFeatureItem](contentscope-definitions-contentscopefeatureitem.md))

## Definitions group ContentScopeFeatureItem

Reference this group by using

```json
{"$ref":"#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem"}
```

| Property                  | Type     | Required | Nullable       | Defined by                                                                                                                                                                                         |
| :------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [exceptions](#exceptions) | `array`  | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-exceptions.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/exceptions") |
| [state](#state)           | `string` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-state.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/state")           |
| [settings](#settings)     | `object` | Optional | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-settings.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/settings")     |

### exceptions



`exceptions`

*   is required

*   Type: unknown\[]

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-exceptions.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/exceptions")

#### exceptions Type

unknown\[]

### state



`state`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-state.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/state")

#### state Type

`string`

### settings



`settings`

*   is optional

*   Type: `object` ([Details](contentscope-definitions-contentscopefeatureitem-properties-settings.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-settings.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/settings")

#### settings Type

`object` ([Details](contentscope-definitions-contentscopefeatureitem-properties-settings.md))

## Definitions group UserPreferences

Reference this group by using

```json
{"$ref":"#/definitions/RuntimeConfiguration#/definitions/UserPreferences"}
```

| Property                | Type      | Required | Nullable       | Defined by                                                                                                                                                               |
| :---------------------- | :-------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [debug](#debug)         | `boolean` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-userpreferences-properties-debug.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/debug") |
| [platform](#platform)   | `object`  | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-platform.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/platform")                      |
| [features](#features-1) | `object`  | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-userpreferencesfeatures.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/features")       |

### debug



`debug`

*   is required

*   Type: `boolean`

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-userpreferences-properties-debug.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/debug")

#### debug Type

`boolean`

### platform



`platform`

*   is required

*   Type: `object` ([Platform](contentscope-definitions-platform.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-platform.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/platform")

#### platform Type

`object` ([Platform](contentscope-definitions-platform.md))

### features



`features`

*   is required

*   Type: `object` ([UserPreferencesFeatures](contentscope-definitions-userpreferencesfeatures.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-userpreferencesfeatures.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/features")

#### features Type

`object` ([UserPreferencesFeatures](contentscope-definitions-userpreferencesfeatures.md))

## Definitions group UserPreferencesFeatures

Reference this group by using

```json
{"$ref":"#/definitions/RuntimeConfiguration#/definitions/UserPreferencesFeatures"}
```

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                                     |
| :-------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Additional Properties | `object` | Optional | cannot be null | [PlatformConfiguration](contentscope-definitions-userpreferencesfeatureitem.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferencesFeatures/additionalProperties") |

### Additional Properties

Additional properties are allowed, as long as they follow this schema:



*   is optional

*   Type: `object` ([UserPreferencesFeatureItem](contentscope-definitions-userpreferencesfeatureitem.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-userpreferencesfeatureitem.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferencesFeatures/additionalProperties")

#### additionalProperties Type

`object` ([UserPreferencesFeatureItem](contentscope-definitions-userpreferencesfeatureitem.md))

## Definitions group UserPreferencesFeatureItem

Reference this group by using

```json
{"$ref":"#/definitions/RuntimeConfiguration#/definitions/UserPreferencesFeatureItem"}
```

| Property                | Type     | Required | Nullable       | Defined by                                                                                                                                                     |
| :---------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [settings](#settings-1) | `object` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-settings.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferencesFeatureItem/properties/settings") |

### settings



`settings`

*   is required

*   Type: `object` ([Settings](contentscope-definitions-settings.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-settings.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferencesFeatureItem/properties/settings")

#### settings Type

`object` ([Settings](contentscope-definitions-settings.md))

## Definitions group Settings

Reference this group by using

```json
{"$ref":"#/definitions/RuntimeConfiguration#/definitions/Settings"}
```

| Property              | Type | Required | Nullable    | Defined by |
| :-------------------- | :--- | :------- | :---------- | :--------- |
| Additional Properties | Any  | Optional | can be null |            |

### Additional Properties

Additional properties are allowed and do not have to follow a specific schema

## Definitions group Platform

Reference this group by using

```json
{"$ref":"#/definitions/RuntimeConfiguration#/definitions/Platform"}
```

| Property      | Type     | Required | Nullable       | Defined by                                                                                                                                               |
| :------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [name](#name) | `string` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-platform-properties-name.md "#/definitions/RuntimeConfiguration#/definitions/Platform/properties/name") |

### name



`name`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-platform-properties-name.md "#/definitions/RuntimeConfiguration#/definitions/Platform/properties/name")

#### name Type

`string`

#### name Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `"ios"`       |             |
| `"macos"`     |             |
| `"windows"`   |             |
| `"extension"` |             |
| `"android"`   |             |
| `"unknown"`   |             |
