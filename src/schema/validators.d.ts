// Do not edit, this was created by `scripts/schema.js`
namespace Schema {
  /** @link {import("./data.credentials.schema.json")} */
  interface Credentials {
    username: string
    password?: string
  }
  /** @link {import("./data.creditCard.schema.json")} */
  interface CreditCard {
    id?: string
    title?: string
    displayNumber?: string
    cardName?: string
    cardSecurityCode?: string
    expirationMonth?: string
    expirationYear?: string
    cardNumber?: string
  }
  /** @link {import("./data.identity.schema.json")} */
  interface Identity {
    id?: string
    title: string
    firstName?: string
    middleName?: string
    lastName?: string
    birthdayDay?: string
    birthdayMonth?: string
    birthdayYear?: string
    addressStreet?: string
    addressStreet2?: string
    addressCity?: string
    addressProvince?: string
    addressPostalCode?: string
    addressCountryCode?: string
    phone?: string
    emailAddress?: string
  }
  /** @link {import("./error.schema.json")} */
  interface GenericError {
    error: string
  }
  /** @link {import("./request.getAutofillData.schema.json")} */
  interface GetAutofillDataRequest {
    inputType: string
    mainType: string
    subType: string
  }
  /** @link {import("./request.showAutofillParent.schema.json")} */
  interface ShowAutofillParentRequest {
    wasFromClick: boolean
    inputTop: number
    inputLeft: number
    inputHeight: number
    inputWidth: number
    serializedInputContext: string
  }
  /** @link {import("./response.getAutofillData.schema.json")} */
  interface GetAutofillDataResponse {
    type?: string
  }
  /** @link {import("./response.getAvailableInputTypes.schema.json")} */
  interface GetAvailableInputTypesResponse {
  }
  /** @link {import("./response.getRuntimeConfiguration.schema.json")} */
  interface GetRuntimeConfigurationResponse {
  }
  /** @link {import("./runtime-configuration.schema.json")} */
  interface RuntimeConfiguration {
  }
  /** @link {import("./settings.schema.json")} */
  interface AutofillSettings {
  }
}