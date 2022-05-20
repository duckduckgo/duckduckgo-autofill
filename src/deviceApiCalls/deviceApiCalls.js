import {DeviceApiCall} from '../../packages/device-api'
import {emailHandlerGetAliasParamsSchema, emailHandlerGetAliasResultSchema} from './validators.zod'

/**
 * @extends {DeviceApiCall<emailHandlerGetAliasParamsSchema, emailHandlerGetAliasResultSchema>}
 */
export class GetAlias extends DeviceApiCall {
    method = 'emailHandlerGetAlias'
    paramsValidator = emailHandlerGetAliasParamsSchema
    resultValidator = emailHandlerGetAliasResultSchema
    preResultValidation (response) {
        return { success: response }
    }
}
