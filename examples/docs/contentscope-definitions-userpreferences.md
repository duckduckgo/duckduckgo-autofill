# UserPreferences Schema

```txt
#/definitions/RuntimeConfiguration#/definitions/UserPreferences
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                              |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [contentScope.schema.json\*](../../out/contentScope.schema.json "open original schema") |

## UserPreferences Type

`object` ([UserPreferences](contentscope-definitions-userpreferences.md))

# UserPreferences Properties

| Property              | Type      | Required | Nullable       | Defined by                                                                                                                                                               |
| :-------------------- | :-------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [debug](#debug)       | `boolean` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-userpreferences-properties-debug.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/debug") |
| [platform](#platform) | `object`  | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-platform.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/platform")                      |
| [features](#features) | `object`  | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-userpreferencesfeatures.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/features")       |

## debug



`debug`

*   is required

*   Type: `boolean`

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-userpreferences-properties-debug.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/debug")

### debug Type

`boolean`

## platform



`platform`

*   is required

*   Type: `object` ([Platform](contentscope-definitions-platform.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-platform.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/platform")

### platform Type

`object` ([Platform](contentscope-definitions-platform.md))

## features



`features`

*   is required

*   Type: `object` ([UserPreferencesFeatures](contentscope-definitions-userpreferencesfeatures.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-userpreferencesfeatures.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferences/properties/features")

### features Type

`object` ([UserPreferencesFeatures](contentscope-definitions-userpreferencesfeatures.md))
