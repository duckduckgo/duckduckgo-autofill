/* DO NOT EDIT, this file was generated by scripts/api-call-generator.js */
import {
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
    sendJSPixelParamsSchema
} from "./validators.zod.js"
import { DeviceApiCall } from "../../../packages/device-api";

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
 * @extends {DeviceApiCall<sendJSPixelParamsSchema, any>} 
 */
export class SendJSPixelCall extends DeviceApiCall {
  method = "sendJSPixel"
  paramsValidator = sendJSPixelParamsSchema
}