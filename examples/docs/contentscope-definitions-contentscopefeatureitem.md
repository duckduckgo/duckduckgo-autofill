# ContentScopeFeatureItem Schema

```txt
#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                              |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [contentScope.schema.json\*](../../out/contentScope.schema.json "open original schema") |

## ContentScopeFeatureItem Type

`object` ([ContentScopeFeatureItem](contentscope-definitions-contentscopefeatureitem.md))

# ContentScopeFeatureItem Properties

| Property                  | Type     | Required | Nullable       | Defined by                                                                                                                                                                                         |
| :------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [exceptions](#exceptions) | `array`  | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-exceptions.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/exceptions") |
| [state](#state)           | `string` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-state.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/state")           |
| [settings](#settings)     | `object` | Optional | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-settings.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/settings")     |

## exceptions



`exceptions`

*   is required

*   Type: unknown\[]

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-exceptions.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/exceptions")

### exceptions Type

unknown\[]

## state



`state`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-state.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/state")

### state Type

`string`

## settings



`settings`

*   is optional

*   Type: `object` ([Details](contentscope-definitions-contentscopefeatureitem-properties-settings.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem-properties-settings.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatureItem/properties/settings")

### settings Type

`object` ([Details](contentscope-definitions-contentscopefeatureitem-properties-settings.md))
