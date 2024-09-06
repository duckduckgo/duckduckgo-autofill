/* DO NOT EDIT, this file was generated by scripts/api-call-generator.js */
import {
    addDebugFlagParamsSchema,
    getAutofillDataRequestSchema,
    getAutofillDataResponseSchema,
    getRuntimeConfigurationResponseSchema,
    storeFormDataSchema,
    getAvailableInputTypesResultSchema,
    getAutofillInitDataResponseSchema,
    getAutofillCredentialsParamsSchema,
    getAutofillCredentialsResultSchema,
    setSizeParamsSchema,
    selectedDetailParamsSchema,
    askToUnlockProviderResultSchema,
    checkCredentialsProviderStatusResultSchema,
    sendJSPixelParamsSchema,
    setIncontextSignupPermanentlyDismissedAtSchema,
    getIncontextSignupDismissedAtSchema,
    emailProtectionStoreUserDataParamsSchema,
    emailProtectionGetIsLoggedInResultSchema,
    emailProtectionGetUserDataResultSchema,
    emailProtectionGetCapabilitiesResultSchema,
    emailProtectionGetAddressesResultSchema,
    emailProtectionRefreshPrivateAddressResultSchema,
    showInContextEmailProtectionSignupPromptSchema
} from "./validators.zod.js"
import { DeviceApiCall } from "../../../packages/device-api";

/**
 * @extends {DeviceApiCall<addDebugFlagParamsSchema, any>} 
 */
export class AddDebugFlagCall extends DeviceApiCall {
  method = "addDebugFlag"
  paramsValidator = addDebugFlagParamsSchema
}
/**
 * @extends {DeviceApiCall<getAutofillDataRequestSchema, getAutofillDataResponseSchema>} 
 */
export class GetAutofillDataCall extends DeviceApiCall {
  method = "getAutofillData"
  id = "getAutofillDataResponse"
  paramsValidator = getAutofillDataRequestSchema
  resultValidator = getAutofillDataResponseSchema
}
/**
 * @extends {DeviceApiCall<any, getRuntimeConfigurationResponseSchema>} 
 */
export class GetRuntimeConfigurationCall extends DeviceApiCall {
  method = "getRuntimeConfiguration"
  id = "getRuntimeConfigurationResponse"
  resultValidator = getRuntimeConfigurationResponseSchema
}
/**
 * @extends {DeviceApiCall<storeFormDataSchema, any>} 
 */
export class StoreFormDataCall extends DeviceApiCall {
  method = "storeFormData"
  paramsValidator = storeFormDataSchema
}
/**
 * @extends {DeviceApiCall<any, getAvailableInputTypesResultSchema>} 
 */
export class GetAvailableInputTypesCall extends DeviceApiCall {
  method = "getAvailableInputTypes"
  id = "getAvailableInputTypesResponse"
  resultValidator = getAvailableInputTypesResultSchema
}
/**
 * @extends {DeviceApiCall<any, getAutofillInitDataResponseSchema>} 
 */
export class GetAutofillInitDataCall extends DeviceApiCall {
  method = "getAutofillInitData"
  id = "getAutofillInitDataResponse"
  resultValidator = getAutofillInitDataResponseSchema
}
/**
 * @extends {DeviceApiCall<getAutofillCredentialsParamsSchema, getAutofillCredentialsResultSchema>} 
 */
export class GetAutofillCredentialsCall extends DeviceApiCall {
  method = "getAutofillCredentials"
  id = "getAutofillCredentialsResponse"
  paramsValidator = getAutofillCredentialsParamsSchema
  resultValidator = getAutofillCredentialsResultSchema
}
/**
 * @extends {DeviceApiCall<setSizeParamsSchema, any>} 
 */
export class SetSizeCall extends DeviceApiCall {
  method = "setSize"
  paramsValidator = setSizeParamsSchema
}
/**
 * @extends {DeviceApiCall<selectedDetailParamsSchema, any>} 
 */
export class SelectedDetailCall extends DeviceApiCall {
  method = "selectedDetail"
  paramsValidator = selectedDetailParamsSchema
}
/**
 * @extends {DeviceApiCall<any, any>} 
 */
export class CloseAutofillParentCall extends DeviceApiCall {
  method = "closeAutofillParent"
}
/**
 * @extends {DeviceApiCall<any, askToUnlockProviderResultSchema>} 
 */
export class AskToUnlockProviderCall extends DeviceApiCall {
  method = "askToUnlockProvider"
  id = "askToUnlockProviderResponse"
  resultValidator = askToUnlockProviderResultSchema
}
/**
 * @extends {DeviceApiCall<any, checkCredentialsProviderStatusResultSchema>} 
 */
export class CheckCredentialsProviderStatusCall extends DeviceApiCall {
  method = "checkCredentialsProviderStatus"
  id = "checkCredentialsProviderStatusResponse"
  resultValidator = checkCredentialsProviderStatusResultSchema
}
/**
 * @extends {DeviceApiCall<sendJSPixelParamsSchema, any>} 
 */
export class SendJSPixelCall extends DeviceApiCall {
  method = "sendJSPixel"
  paramsValidator = sendJSPixelParamsSchema
}
/**
 * @extends {DeviceApiCall<setIncontextSignupPermanentlyDismissedAtSchema, any>} 
 */
export class SetIncontextSignupPermanentlyDismissedAtCall extends DeviceApiCall {
  method = "setIncontextSignupPermanentlyDismissedAt"
  paramsValidator = setIncontextSignupPermanentlyDismissedAtSchema
}
/**
 * @extends {DeviceApiCall<any, getIncontextSignupDismissedAtSchema>} 
 */
export class GetIncontextSignupDismissedAtCall extends DeviceApiCall {
  method = "getIncontextSignupDismissedAt"
  id = "getIncontextSignupDismissedAt"
  resultValidator = getIncontextSignupDismissedAtSchema
}
/**
 * @extends {DeviceApiCall<any, any>} 
 */
export class OpenManagePasswordsCall extends DeviceApiCall {
  method = "openManagePasswords"
}
/**
 * @extends {DeviceApiCall<any, any>} 
 */
export class OpenManageCreditCardsCall extends DeviceApiCall {
  method = "openManageCreditCards"
}
/**
 * @extends {DeviceApiCall<any, any>} 
 */
export class OpenManageIdentitiesCall extends DeviceApiCall {
  method = "openManageIdentities"
}
/**
 * @extends {DeviceApiCall<any, any>} 
 */
export class StartCredentialsImportFlowCall extends DeviceApiCall {
  method = "startCredentialsImportFlow"
}
/**
 * @extends {DeviceApiCall<emailProtectionStoreUserDataParamsSchema, any>} 
 */
export class EmailProtectionStoreUserDataCall extends DeviceApiCall {
  method = "emailProtectionStoreUserData"
  id = "emailProtectionStoreUserDataResponse"
  paramsValidator = emailProtectionStoreUserDataParamsSchema
}
/**
 * @extends {DeviceApiCall<any, any>} 
 */
export class EmailProtectionRemoveUserDataCall extends DeviceApiCall {
  method = "emailProtectionRemoveUserData"
}
/**
 * @extends {DeviceApiCall<any, emailProtectionGetIsLoggedInResultSchema>} 
 */
export class EmailProtectionGetIsLoggedInCall extends DeviceApiCall {
  method = "emailProtectionGetIsLoggedIn"
  id = "emailProtectionGetIsLoggedInResponse"
  resultValidator = emailProtectionGetIsLoggedInResultSchema
}
/**
 * @extends {DeviceApiCall<any, emailProtectionGetUserDataResultSchema>} 
 */
export class EmailProtectionGetUserDataCall extends DeviceApiCall {
  method = "emailProtectionGetUserData"
  id = "emailProtectionGetUserDataResponse"
  resultValidator = emailProtectionGetUserDataResultSchema
}
/**
 * @extends {DeviceApiCall<any, emailProtectionGetCapabilitiesResultSchema>} 
 */
export class EmailProtectionGetCapabilitiesCall extends DeviceApiCall {
  method = "emailProtectionGetCapabilities"
  id = "emailProtectionGetCapabilitiesResponse"
  resultValidator = emailProtectionGetCapabilitiesResultSchema
}
/**
 * @extends {DeviceApiCall<any, emailProtectionGetAddressesResultSchema>} 
 */
export class EmailProtectionGetAddressesCall extends DeviceApiCall {
  method = "emailProtectionGetAddresses"
  id = "emailProtectionGetAddressesResponse"
  resultValidator = emailProtectionGetAddressesResultSchema
}
/**
 * @extends {DeviceApiCall<any, emailProtectionRefreshPrivateAddressResultSchema>} 
 */
export class EmailProtectionRefreshPrivateAddressCall extends DeviceApiCall {
  method = "emailProtectionRefreshPrivateAddress"
  id = "emailProtectionRefreshPrivateAddressResponse"
  resultValidator = emailProtectionRefreshPrivateAddressResultSchema
}
/**
 * @extends {DeviceApiCall<any, any>} 
 */
export class StartEmailProtectionSignupCall extends DeviceApiCall {
  method = "startEmailProtectionSignup"
}
/**
 * @extends {DeviceApiCall<any, any>} 
 */
export class CloseEmailProtectionTabCall extends DeviceApiCall {
  method = "closeEmailProtectionTab"
}
/**
 * @extends {DeviceApiCall<any, showInContextEmailProtectionSignupPromptSchema>} 
 */
export class ShowInContextEmailProtectionSignupPromptCall extends DeviceApiCall {
  method = "ShowInContextEmailProtectionSignupPrompt"
  id = "ShowInContextEmailProtectionSignupPromptResponse"
  resultValidator = showInContextEmailProtectionSignupPromptSchema
}