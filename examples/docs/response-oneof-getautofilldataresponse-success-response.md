# GetAutofillDataResponse Success Response Schema

```txt
#/definitions/GetAutofillDataResponse#/oneOf/0
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                      |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [response.getAutofillData.schema.json\*](../../out/response.getAutofillData.schema.json "open original schema") |

## 0 Type

`object` ([GetAutofillDataResponse Success Response](response-oneof-getautofilldataresponse-success-response.md))

# 0 Properties

| Property            | Type          | Required | Nullable       | Defined by                                                                                                                                                             |
| :------------------ | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)       | Not specified | Optional | cannot be null | [GetAutofillDataResponse](response-oneof-getautofilldataresponse-success-response-properties-type.md "#/definitions/GetAutofillDataResponse#/oneOf/0/properties/type") |
| [success](#success) | Merged        | Required | cannot be null | [GetAutofillDataResponse](response-definitions-autofilldataresponsetypes.md "#/definitions/GetAutofillDataResponse#/oneOf/0/properties/success")                       |

## type

Required on Android + Windows devices

`type`

*   is optional

*   Type: unknown

*   cannot be null

*   defined in: [GetAutofillDataResponse](response-oneof-getautofilldataresponse-success-response-properties-type.md "#/definitions/GetAutofillDataResponse#/oneOf/0/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"GetAutofillDataResponse"
```

## success



`success`

*   is required

*   Type: `object` ([Details](response-definitions-autofilldataresponsetypes.md))

*   cannot be null

*   defined in: [GetAutofillDataResponse](response-definitions-autofilldataresponsetypes.md "#/definitions/GetAutofillDataResponse#/oneOf/0/properties/success")

### success Type

`object` ([Details](response-definitions-autofilldataresponsetypes.md))

one (and only one) of

*   [Untitled object in GetAutofillDataResponse](response-definitions-credentials.md "check type definition")
