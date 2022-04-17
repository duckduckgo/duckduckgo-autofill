# ContentScope Schema

```txt
#/definitions/RuntimeConfiguration#/definitions/ContentScope
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                              |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [contentScope.schema.json\*](../../out/contentScope.schema.json "open original schema") |

## ContentScope Type

`object` ([ContentScope](contentscope-definitions-contentscope.md))

# ContentScope Properties

| Property                                      | Type     | Required | Nullable       | Defined by                                                                                                                                                                                       |
| :-------------------------------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [features](#features)                         | `object` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscopefeatures.md "#/definitions/RuntimeConfiguration#/definitions/ContentScope/properties/features")                                     |
| [unprotectedTemporary](#unprotectedtemporary) | `array`  | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-contentscope-properties-unprotectedtemporary.md "#/definitions/RuntimeConfiguration#/definitions/ContentScope/properties/unprotectedTemporary") |
| Additional Properties                         | Any      | Optional | can be null    |                                                                                                                                                                                                  |

## features



`features`

*   is required

*   Type: `object` ([ContentScopeFeatures](contentscope-definitions-contentscopefeatures.md))

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscopefeatures.md "#/definitions/RuntimeConfiguration#/definitions/ContentScope/properties/features")

### features Type

`object` ([ContentScopeFeatures](contentscope-definitions-contentscopefeatures.md))

## unprotectedTemporary



`unprotectedTemporary`

*   is required

*   Type: unknown\[]

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-contentscope-properties-unprotectedtemporary.md "#/definitions/RuntimeConfiguration#/definitions/ContentScope/properties/unprotectedTemporary")

### unprotectedTemporary Type

unknown\[]

## Additional Properties

Additional properties are allowed and do not have to follow a specific schema
