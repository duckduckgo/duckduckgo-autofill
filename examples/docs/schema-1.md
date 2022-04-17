# AvailableInputTypes Schema

```txt
#/definitions/AvailableInputTypes
```

These indicate which types of data are available for the current user

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                                        |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :---------------------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [schema.availableInputTypes.schema.json](../../out/schema.availableInputTypes.schema.json "open original schema") |

## AvailableInputTypes Type

`object` ([AvailableInputTypes](schema-1.md))

# AvailableInputTypes Properties

| Property                    | Type      | Required | Nullable       | Defined by                                                                                                            |
| :-------------------------- | :-------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------- |
| [credentials](#credentials) | `boolean` | Optional | cannot be null | [AvailableInputTypes](schema-1-properties-credentials.md "#/definitions/AvailableInputTypes#/properties/credentials") |
| [identities](#identities)   | `boolean` | Optional | cannot be null | [AvailableInputTypes](schema-1-properties-identities.md "#/definitions/AvailableInputTypes#/properties/identities")   |
| [creditCards](#creditcards) | `boolean` | Optional | cannot be null | [AvailableInputTypes](schema-1-properties-creditcards.md "#/definitions/AvailableInputTypes#/properties/creditCards") |
| [email](#email)             | `boolean` | Optional | cannot be null | [AvailableInputTypes](schema-1-properties-email.md "#/definitions/AvailableInputTypes#/properties/email")             |

## credentials



`credentials`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [AvailableInputTypes](schema-1-properties-credentials.md "#/definitions/AvailableInputTypes#/properties/credentials")

### credentials Type

`boolean`

## identities



`identities`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [AvailableInputTypes](schema-1-properties-identities.md "#/definitions/AvailableInputTypes#/properties/identities")

### identities Type

`boolean`

## creditCards



`creditCards`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [AvailableInputTypes](schema-1-properties-creditcards.md "#/definitions/AvailableInputTypes#/properties/creditCards")

### creditCards Type

`boolean`

## email



`email`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [AvailableInputTypes](schema-1-properties-email.md "#/definitions/AvailableInputTypes#/properties/email")

### email Type

`boolean`
