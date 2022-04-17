# ContentScopeFeatures Schema

```txt
#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatures
```



| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                              |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [contentScope.schema.json\*](../../out/contentScope.schema.json "open original schema") |

## ContentScopeFeatures Type

`object` ([ContentScopeFeatures](contentscope-definitions-contentscopefeatures.md))

# ContentScopeFeatures Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                               |
| :-------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Additional Properties | `object` | Optional | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatures/additionalProperties") |

## Additional Properties

Additional properties are allowed, as long as they follow this schema:



*   is optional

*   Type: `object` ([ContentScopeFeatureItem](contentscope-definitions-contentscopefeatureitem.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscopefeatureitem.md "#/definitions/RuntimeConfiguration#/definitions/ContentScopeFeatures/additionalProperties")

### additionalProperties Type

`object` ([ContentScopeFeatureItem](contentscope-definitions-contentscopefeatureitem.md))
