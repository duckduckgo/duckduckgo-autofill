/* DO NOT EDIT, this file was generated by scripts/api-call-generator.js */
/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Send pixels data to be fired from the native layer
 */
export type SendJSPixelParams =
  | {
      pixelName: "autofill_identity";
      params?: {
        fieldType?: string;
      };
    }
  | {
      pixelName: "autofill_show";
    }
  | {
      pixelName: "autofill_personal_address";
    }
  | {
      pixelName: "autofill_private_address";
    }
  | {
      pixelName: "incontext_show";
    }
  | {
      pixelName: "incontext_primary_cta";
    }
  | {
      pixelName: "incontext_dismiss_persisted";
    }
  | {
      pixelName: "incontext_close_x";
    };

/**
 * This describes all of the top-level generated types
 * @internal
 */
export interface API {
  /**
   * Register a new debug flag that will be included in breakage reports
   */
  addDebugFlag?: {
    paramsValidator?: AddDebugFlagParams;
    [k: string]: unknown;
  };
  getAutofillData?: {
    id?: "getAutofillDataResponse";
    paramsValidator?: GetAutofillDataRequest;
    resultValidator?: GetAutofillDataResponse;
    [k: string]: unknown;
  };
  getRuntimeConfiguration?: {
    id?: "getRuntimeConfigurationResponse";
    resultValidator?: GetRuntimeConfigurationResponse;
    [k: string]: unknown;
  };
  storeFormData?: {
    paramsValidator?: StoreFormData;
    [k: string]: unknown;
  };
  getAvailableInputTypes?: {
    id?: "getAvailableInputTypesResponse";
    resultValidator?: GetAvailableInputTypesResult;
    [k: string]: unknown;
  };
  /**
   * This is called inside an overlay (eg: on Windows or soon also on macOS) to retrieve available data
   */
  getAutofillInitData?: {
    id?: "getAutofillInitDataResponse";
    resultValidator?: GetAutofillInitDataResponse;
    [k: string]: unknown;
  };
  /**
   * Used to retrieve a specific set of credentials
   */
  getAutofillCredentials?: {
    id?: "getAutofillCredentialsResponse";
    paramsValidator?: GetAutofillCredentialsParams;
    resultValidator?: GetAutofillCredentialsResult;
    [k: string]: unknown;
  };
  /**
   * Used by Windows to communicate the desired size of the overlay to the native side
   */
  setSize?: {
    paramsValidator?: SetSizeParams;
    [k: string]: unknown;
  };
  /**
   * Used by Windows to communicate a selected autofill item to the native side
   */
  selectedDetail?: {
    paramsValidator?: SelectedDetailParams;
    [k: string]: unknown;
  };
  /**
   * Used by Windows to instruct native sides to close any autofill overlays
   */
  closeAutofillParent?: {
    [k: string]: unknown;
  };
  askToUnlockProvider?: {
    id?: "askToUnlockProviderResponse";
    resultValidator?: AskToUnlockProviderResult;
    [k: string]: unknown;
  };
  checkCredentialsProviderStatus?: {
    id?: "checkCredentialsProviderStatusResponse";
    resultValidator?: CheckCredentialsProviderStatusResult;
    [k: string]: unknown;
  };
  sendJSPixel?: {
    paramsValidator?: SendJSPixelParams;
    [k: string]: unknown;
  };
  setIncontextSignupPermanentlyDismissedAt?: {
    paramsValidator?: SetIncontextSignupPermanentlyDismissedAt;
    [k: string]: unknown;
  };
  getIncontextSignupDismissedAt?: {
    id?: "getIncontextSignupDismissedAt";
    resultValidator?: GetIncontextSignupDismissedAt;
    [k: string]: unknown;
  };
  autofillSettings?: {
    validatorsOnly?: true;
    resultValidator?: AutofillSettings;
    [k: string]: unknown;
  };
  getAlias?: {
    validatorsOnly?: true;
    paramValidator?: GetAliasParams;
    resultValidator?: GetAliasResult;
    [k: string]: unknown;
  };
  /**
   * Opens the native password management UI from the autofill popup
   */
  openManagePasswords?: {
    [k: string]: unknown;
  };
  /**
   * Opens the native credit card management UI from the autofill popup
   */
  openManageCreditCards?: {
    [k: string]: unknown;
  };
  /**
   * Opens the native identities management UI from the autofill popup
   */
  openManageIdentities?: {
    [k: string]: unknown;
  };
  /**
   * Used to store Email Protection auth credentials (logging in)
   */
  emailProtectionStoreUserData?: {
    id?: "emailProtectionStoreUserDataResponse";
    paramsValidator?: EmailProtectionStoreUserDataParams;
    [k: string]: unknown;
  };
  /**
   * Used to remove Email Protection auth credentials (logging out)
   */
  emailProtectionRemoveUserData?: {
    [k: string]: unknown;
  };
  /**
   * Used to get check if a user is logged in to Email Protection
   */
  emailProtectionGetIsLoggedIn?: {
    id?: "emailProtectionGetIsLoggedInResponse";
    resultValidator?: EmailProtectionGetIsLoggedInResult;
    [k: string]: unknown;
  };
  /**
   * Used to get Email Protection auth credentials
   */
  emailProtectionGetUserData?: {
    id?: "emailProtectionGetUserDataResponse";
    resultValidator?: EmailProtectionGetUserDataResult;
    [k: string]: unknown;
  };
  /**
   * Used by the Email Protection web app to determine which API functionality is available
   */
  emailProtectionGetCapabilities?: {
    id?: "emailProtectionGetCapabilitiesResponse";
    resultValidator?: EmailProtectionGetCapabilitiesResult;
    [k: string]: unknown;
  };
  /**
   * Used to get both Email Protection addresses (personal and private)
   */
  emailProtectionGetAddresses?: {
    id?: "emailProtectionGetAddressesResponse";
    resultValidator?: EmailProtectionGetAddressesResult;
    [k: string]: unknown;
  };
  /**
   * Used to refresh Email Protection private address and get both Email Protection addresses (personal and private)
   */
  emailProtectionRefreshPrivateAddress?: {
    id?: "emailProtectionRefreshPrivateAddressResponse";
    resultValidator?: EmailProtectionRefreshPrivateAddressResult;
    [k: string]: unknown;
  };
  /**
   * Used by macOS to open a new tab to sign up for Email Protection
   */
  startEmailProtectionSignup?: {
    [k: string]: unknown;
  };
  /**
   * Used by macOS to close the Email Protection tab after successful in-context sign-up or login
   */
  closeEmailProtectionTab?: {
    [k: string]: unknown;
  };
  /**
   * Used by Android to open the in-context signup prompt and report back when completed
   */
  ShowInContextEmailProtectionSignupPrompt?: {
    id?: "ShowInContextEmailProtectionSignupPromptResponse";
    resultValidator?: ShowInContextEmailProtectionSignupPrompt;
    [k: string]: unknown;
  };
}
/**
 * Parameters for the addDebugFlag method
 */
export interface AddDebugFlagParams {
  flag: string;
}
/**
 * This describes the argument given to `getAutofillData(data)`
 */
export interface GetAutofillDataRequest {
  generatedPassword?: GeneratedPassword;
  /**
   * This is the combined input type, such as `credentials.username`
   */
  inputType: string;
  /**
   * The main input type
   */
  mainType: "credentials" | "identities" | "creditCards";
  /**
   * Just the subtype, such as `password` or `username`
   */
  subType: string;
  /**
   * Signals that the prompt was triggered automatically rather than by user action
   */
  trigger?: "userInitiated" | "autoprompt" | "postSignup";
  /**
   * Serialized JSON that will be picked up once the 'parent' requests its initial data
   */
  serializedInputContext?: string;
  triggerContext?: TriggerContext;
}
export interface GeneratedPassword {
  value: string;
  username: string;
}
/**
 * This is the top-level context data, such as the current URL
 */
export interface TriggerContext {
  inputTop: number;
  inputLeft: number;
  inputHeight: number;
  inputWidth: number;
  wasFromClick: boolean;
}
export interface GetAutofillDataResponse {
  /**
   * Required on Android + Windows devices, optional on iOS
   */
  type?: "getAutofillDataResponse";
  /**
   * The data returned, containing only fields that will be auto-filled
   */
  success?: {
    credentials?: Credentials;
    action: "fill" | "focus" | "none" | "acceptGeneratedPassword" | "rejectGeneratedPassword";
  };
  error?: GenericError;
}
export interface Credentials {
  /**
   * If present, must be a string
   */
  id?: string;
  /**
   * This field is always present, but sometimes it could be an empty string
   */
  username: string;
  password: string;
  origin?: {
    url: string;
  };
  credentialsProvider?: "duckduckgo" | "bitwarden";
  providerStatus?: "locked" | "unlocked";
}
export interface GenericError {
  message: string;
}
/**
 * Data that can be understood by @duckduckgo/content-scope-scripts
 */
export interface GetRuntimeConfigurationResponse {
  /**
   * Required on Android + Windows devices, optional on iOS
   */
  type?: "getRuntimeConfigurationResponse";
  success?: RuntimeConfiguration;
  error?: GenericError;
}
/**
 * This is loaded dynamically from @duckduckgo/content-scope-scripts/src/schema/runtime-configuration.schema.json
 */
export interface RuntimeConfiguration {
  contentScope: ContentScope;
  userUnprotectedDomains: string[];
  userPreferences: UserPreferences;
}
export interface ContentScope {
  features: {
    [k: string]: {
      exceptions: unknown[];
      state: "enabled" | "disabled";
      settings?: {
        [k: string]: unknown;
      };
    };
  };
  unprotectedTemporary: unknown[];
}
export interface UserPreferences {
  globalPrivacyControlValue?: boolean;
  sessionKey?: string;
  debug: boolean;
  platform: {
    name: "ios" | "macos" | "windows" | "extension" | "android" | "unknown";
  };
  features: {
    [k: string]: {
      settings: {
        [k: string]: unknown;
      };
    };
  };
}
/**
 * Autofill could send this data at any point.
 *
 * It will **not** listen for a response, it's expected that the native side will handle
 */
export interface StoreFormData {
  credentials?: OutgoingCredentials;
  trigger?: "formSubmission" | "passwordGeneration" | "emailProtection";
}
export interface OutgoingCredentials {
  /**
   * Optional username
   */
  username?: string;
  /**
   * Optional password
   */
  password?: string;
}
export interface GetAvailableInputTypesResult {
  /**
   * A string used to identify this result. It's optional
   */
  type?: "getAvailableInputTypesResponse";
  success: AvailableInputTypes;
  error?: GenericError;
}
/**
 * For each main autofill types, it maps specific fields to their availability
 */
export interface AvailableInputTypes {
  /**
   * maps field types and the availability of data for the current site
   */
  credentials?: {
    username?: boolean;
    password?: boolean;
  };
  /**
   * maps field types and the availability of data saved by the user
   */
  identities?: {
    firstName?: boolean;
    middleName?: boolean;
    lastName?: boolean;
    birthdayDay?: boolean;
    birthdayMonth?: boolean;
    birthdayYear?: boolean;
    addressStreet?: boolean;
    addressStreet2?: boolean;
    addressCity?: boolean;
    addressProvince?: boolean;
    addressPostalCode?: boolean;
    addressCountryCode?: boolean;
    phone?: boolean;
    emailAddress?: boolean;
  };
  /**
   * maps field types and the availability of data saved by the user
   */
  creditCards?: {
    cardName?: boolean;
    cardSecurityCode?: boolean;
    expirationMonth?: boolean;
    expirationYear?: boolean;
    cardNumber?: boolean;
  };
  /**
   * true if signed in for Email Protection
   */
  email?: boolean;
  credentialsProviderStatus?: "locked" | "unlocked";
}
export interface GetAutofillInitDataResponse {
  /**
   * Required on Android + Windows devices, optional on iOS
   */
  type?: "getAutofillInitDataResponse";
  success?: {
    credentials: Credentials[];
    identities: {
      [k: string]: unknown;
    }[];
    creditCards: {
      [k: string]: unknown;
    }[];
    /**
     * A clone of the `serializedInputContext` that was sent in the request
     */
    serializedInputContext: string;
  };
  error?: GenericError;
}
/**
 * This describes the argument given to `getAutofillCredentials`
 */
export interface GetAutofillCredentialsParams {
  id: string;
}
/**
 * This describes return values for `getAutofillCredentials`
 */
export interface GetAutofillCredentialsResult {
  /**
   * Required on Android + Windows devices, optional on iOS/macos
   */
  type?: "getAutofillCredentialsResponse";
  success?: {
    id?: string;
    /**
     * Whether or not this credential was autogenerated or not
     */
    autogenerated?: boolean;
    /**
     * A username if one is available. Note: this field can be an empty string
     */
    username: string;
    password?: string;
  };
  error?: GenericError;
}
/**
 * Tooltips in overlays can instruct native-sides about their size
 */
export interface SetSizeParams {
  height: number;
  width: number;
}
/**
 * The data sent when an item is selected
 */
export interface SelectedDetailParams {
  data: {
    [k: string]: unknown;
  };
  configType: string;
}
export interface AskToUnlockProviderResult {
  /**
   * A string used to identify this result. It's optional
   */
  type?: "askToUnlockProviderResponse";
  success: ProviderStatusUpdated;
  error?: GenericError;
}
export interface ProviderStatusUpdated {
  status: "locked" | "unlocked";
  credentials: Credentials[];
  availableInputTypes: AvailableInputTypes1;
}
/**
 * For each main autofill types, it maps specific fields to their availability
 */
export interface AvailableInputTypes1 {
  /**
   * maps field types and the availability of data for the current site
   */
  credentials?: {
    username?: boolean;
    password?: boolean;
  };
  /**
   * maps field types and the availability of data saved by the user
   */
  identities?: {
    firstName?: boolean;
    middleName?: boolean;
    lastName?: boolean;
    birthdayDay?: boolean;
    birthdayMonth?: boolean;
    birthdayYear?: boolean;
    addressStreet?: boolean;
    addressStreet2?: boolean;
    addressCity?: boolean;
    addressProvince?: boolean;
    addressPostalCode?: boolean;
    addressCountryCode?: boolean;
    phone?: boolean;
    emailAddress?: boolean;
  };
  /**
   * maps field types and the availability of data saved by the user
   */
  creditCards?: {
    cardName?: boolean;
    cardSecurityCode?: boolean;
    expirationMonth?: boolean;
    expirationYear?: boolean;
    cardNumber?: boolean;
  };
  /**
   * true if signed in for Email Protection
   */
  email?: boolean;
  credentialsProviderStatus?: "locked" | "unlocked";
}
/**
 * This is only used in macOS 10.15 Catalina
 */
export interface CheckCredentialsProviderStatusResult {
  /**
   * A string used to identify this result. It's optional
   */
  type?: "checkCredentialsProviderStatusResponse";
  success: ProviderStatusUpdated;
  error?: GenericError;
}
/**
 * Sets the time that the in-context Email Protection sign-up message was permanently dismissed
 */
export interface SetIncontextSignupPermanentlyDismissedAt {
  value?: number;
}
/**
 * Gets the time that the in-context Email Protection sign-up message was dismissed, if set
 */
export interface GetIncontextSignupDismissedAt {
  success: {
    permanentlyDismissedAt?: number;
    isInstalledRecently?: boolean;
  };
}
/**
 * Delivered as part of Runtime Configuration, but needs to live here since Runtime Configuration can contain settings for many features
 */
export interface AutofillSettings {
  featureToggles: AutofillFeatureToggles;
}
/**
 * These are toggles used throughout the application to enable/disable features fully
 */
export interface AutofillFeatureToggles {
  inputType_credentials?: boolean;
  inputType_identities?: boolean;
  inputType_creditCards?: boolean;
  emailProtection?: boolean;
  emailProtection_incontext_signup?: boolean;
  password_generation?: boolean;
  credentials_saving?: boolean;
  inlineIcon_credentials?: boolean;
  third_party_credentials_provider?: boolean;
}
export interface GetAliasParams {
  requiresUserPermission: boolean;
  shouldConsumeAliasIfProvided: boolean;
  isIncontextSignupAvailable?: boolean;
}
export interface GetAliasResult {
  success: {
    alias?: string;
  };
}
/**
 * Used to store Email Protection auth credentials.
 */
export interface EmailProtectionStoreUserDataParams {
  token: string;
  userName: string;
  cohort: string;
}
/**
 * Used to get check if a user is logged in to Email Protection
 */
export interface EmailProtectionGetIsLoggedInResult {
  success?: boolean;
  error?: GenericError;
}
/**
 * Used to get Email Protection auth credentials
 */
export interface EmailProtectionGetUserDataResult {
  success?: {
    userName: string;
    nextAlias: string;
    token: string;
  };
  error?: GenericError;
}
/**
 * Used by the Email Protection web app to determine which API functionality is available
 */
export interface EmailProtectionGetCapabilitiesResult {
  success?: {
    addUserData?: boolean;
    getUserData?: boolean;
    removeUserData?: boolean;
  };
  error?: GenericError;
}
/**
 * Used to get both Email Protection addresses (personal and private)
 */
export interface EmailProtectionGetAddressesResult {
  success?: {
    personalAddress: string;
    privateAddress: string;
  };
  error?: GenericError;
}
/**
 * Used to refresh Email Protection private address and get both Email Protection addresses (personal and private)
 */
export interface EmailProtectionRefreshPrivateAddressResult {
  success?: {
    personalAddress: string;
    privateAddress: string;
  };
  error?: GenericError;
}
/**
 * Gets the result of the in-context signup flow
 */
export interface ShowInContextEmailProtectionSignupPrompt {
  success: {
    isSignedIn: boolean;
  };
}
