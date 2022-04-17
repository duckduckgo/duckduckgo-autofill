# GetAutofillDataResponse Schema

```txt
#/definitions/GetAutofillDataResponse
```



| Abstract               | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                    |
| :--------------------- | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Cannot be instantiated | Yes        | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [response.getAutofillData.schema.json](../../out/response.getAutofillData.schema.json "open original schema") |

## GetAutofillDataResponse Type

`object` ([GetAutofillDataResponse](response.md))

one (and only one) of

*   [GetAutofillDataResponse Success Response](response-oneof-getautofilldataresponse-success-response.md "check type definition")

*   [Untitled undefined type in GetAutofillDataResponse](response-oneof-1.md "check type definition")

# GetAutofillDataResponse Definitions

## Definitions group AutofillDataResponseTypes

Reference this group by using

```json
{"$ref":"#/definitions/GetAutofillDataResponse#/definitions/AutofillDataResponseTypes"}
```

| Property | Type | Required | Nullable | Defined by |
| :------- | :--- | :------- | :------- | :--------- |

## Definitions group Credentials

Reference this group by using

```json
{"$ref":"#/definitions/GetAutofillDataResponse#/definitions/Credentials"}
```

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                              |
| :-------------------- | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [username](#username) | `string` | Required | cannot be null | [GetAutofillDataResponse](response-definitions-credentials-properties-username.md "#/definitions/GetAutofillDataResponse#/definitions/Credentials/properties/username") |
| [password](#password) | `string` | Required | cannot be null | [GetAutofillDataResponse](response-definitions-credentials-properties-password.md "#/definitions/GetAutofillDataResponse#/definitions/Credentials/properties/password") |

### username



`username`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [GetAutofillDataResponse](response-definitions-credentials-properties-username.md "#/definitions/GetAutofillDataResponse#/definitions/Credentials/properties/username")

#### username Type

`string`

### password



`password`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [GetAutofillDataResponse](response-definitions-credentials-properties-password.md "#/definitions/GetAutofillDataResponse#/definitions/Credentials/properties/password")

#### password Type

`string`
