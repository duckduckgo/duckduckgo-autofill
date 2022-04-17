# Platform Schema

```txt
#/definitions/RuntimeConfiguration#/definitions/Platform
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                              |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [contentScope.schema.json\*](../../out/contentScope.schema.json "open original schema") |

## Platform Type

`object` ([Platform](contentscope-definitions-platform.md))

# Platform Properties

| Property      | Type     | Required | Nullable       | Defined by                                                                                                                                               |
| :------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [name](#name) | `string` | Required | cannot be null | [PlatformConfiguration](contentscope-definitions-platform-properties-name.md "#/definitions/RuntimeConfiguration#/definitions/Platform/properties/name") |

## name



`name`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [PlatformConfiguration](contentscope-definitions-platform-properties-name.md "#/definitions/RuntimeConfiguration#/definitions/Platform/properties/name")

### name Type

`string`

### name Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation |
| :------------ | :---------- |
| `"ios"`       |             |
| `"macos"`     |             |
| `"windows"`   |             |
| `"extension"` |             |
| `"android"`   |             |
| `"unknown"`   |             |
