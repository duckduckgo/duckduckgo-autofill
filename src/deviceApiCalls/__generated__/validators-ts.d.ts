/* DO NOT EDIT, this file was generated by scripts/api-call-generator.js */
// autofill-settings.json

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
  password_generation?: boolean;
  credentials_saving?: boolean;
  inlineIcon_credentials?: boolean;
  credentials_provider?: "duckduckgo" | "bitwarden";
}

// credentials.json

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
  provider?: "duckduckgo" | "bitwarden";
}

// error.json

export interface GenericError {
  message: string;
}

// getAlias.params.json

export interface GetAliasParams {
  requiresUserPermission: boolean;
  shouldConsumeAliasIfProvided: boolean;
}

// getAlias.result.json

export interface GetAliasResult {
  success: {
    alias: string;
  };
}

// getAutofillCredentials.params.json

/**
 * This describes the argument given to `getAutofillCredentials`
 */
export interface GetAutofillCredentialsParams {
  id: string;
}

// getAutofillCredentials.result.json

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
export interface GenericError {
  message: string;
}

// getAutofillData.params.json

/**
 * This describes the argument given to `getAutofillData(data)`
 */
export interface GetAutofillDataRequest {
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
  trigger?: "userInitiated" | "autoprompt";
  /**
   * Serialized JSON that will be picked up once the 'parent' requests its initial data
   */
  serializedInputContext?: string;
  triggerContext?: TriggerContext;
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

// getAutofillData.result.json

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
    action: "fill" | "focus" | "none";
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
  provider?: "duckduckgo" | "bitwarden";
}
export interface GenericError {
  message: string;
}

// getAutofillInitData.result.json

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
  provider?: "duckduckgo" | "bitwarden";
}
export interface GenericError {
  message: string;
}

// getAvailableInputTypes.result.json

export interface GetAvailableInputTypesResult {
  /**
   * A string used to identify this result. It's optional
   */
  type?: "getAvailableInputTypesResponse";
  success: AvailableInputTypes;
  error?: GenericError;
}
export interface AvailableInputTypes {
  /**
   * true if *any* credentials are available
   */
  credentials?: boolean;
  /**
   * true if *any* identities are available
   */
  identities?: boolean;
  /**
   * true if *any* credit cards are available
   */
  creditCards?: boolean;
  /**
   * true if signed in for Email Protection
   */
  email?: boolean;
}
export interface GenericError {
  message: string;
}

// getRuntimeConfiguration.result.json

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
  features: ContentScopeFeatures;
  unprotectedTemporary: unknown[];
}
export interface ContentScopeFeatures {
  [k: string]: {
    exceptions: unknown[];
    state: "enabled" | "disabled";
    settings?: ContentScopeFeaturesItem_Settings;
  };
}
export interface ContentScopeFeaturesItem_Settings {
  [k: string]: unknown;
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
export interface GenericError {
  message: string;
}

// runtime-configuration.json

/**
 * Required Properties to enable an instance of RuntimeConfiguration
 */
export interface RuntimeConfiguration {
  contentScope: ContentScope;
  userUnprotectedDomains: string[];
  userPreferences: UserPreferences;
}
export interface ContentScope {
  features: ContentScopeFeatures;
  unprotectedTemporary: unknown[];
}
export interface ContentScopeFeatures {
  [k: string]: {
    exceptions: unknown[];
    state: "enabled" | "disabled";
    settings?: ContentScopeFeaturesItem_Settings;
  };
}
export interface ContentScopeFeaturesItem_Settings {
  [k: string]: unknown;
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

// selectedDetail.params.json

/**
 * The data sent when an item is selected
 */
export interface SelectedDetailParams {
  data: {
    [k: string]: unknown;
  };
  configType: string;
}

// setSize.params.json

/**
 * Tooltips in overlays can instruct native-sides about their size
 */
export interface SetSizeParams {
  height: number;
  width: number;
}

// storeFormData.params.json

/**
 * Autofill could send this data at any point.
 *
 * It will **not** listen for a response, it's expected that the native side will handle
 */
export interface StoreFormData {
  credentials?: OutgoingCredentials;
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
