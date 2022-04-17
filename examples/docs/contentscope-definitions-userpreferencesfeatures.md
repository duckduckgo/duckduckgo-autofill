# UserPreferencesFeatures Schema

```txt
#/definitions/RuntimeConfiguration#/definitions/UserPreferencesFeatures
```



| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                              |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [contentScope.schema.json\*](../../out/contentScope.schema.json "open original schema") |

## UserPreferencesFeatures Type

`object` ([UserPreferencesFeatures](contentscope-definitions-userpreferencesfeatures.md))

# UserPreferencesFeatures Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                                     |
| :-------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Additional Properties | `object` | Optional | cannot be null | [PlatformConfiguration](contentscope-definitions-userpreferencesfeatureitem.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferencesFeatures/additionalProperties") |

## Additional Properties

Additional properties are allowed, as long as they follow this schema:



*   is optional

*   Type: `object` ([UserPreferencesFeatureItem](contentscope-definitions-userpreferencesfeatureitem.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-userpreferencesfeatureitem.md "#/definitions/RuntimeConfiguration#/definitions/UserPreferencesFeatures/additionalProperties")

### additionalProperties Type

`object` ([UserPreferencesFeatureItem](contentscope-definitions-userpreferencesfeatureitem.md))
