import {ZodRPC} from '../../packages/zod-rpc'
import {emailHandlerGetAliasParamsSchema, emailHandlerGetAliasResultSchema} from './validators.zod'

/**
 * @extends {ZodRPC<emailHandlerGetAliasParamsSchema, emailHandlerGetAliasResultSchema>}
 */
export class GetAlias extends ZodRPC {
    method = 'emailHandlerGetAlias'
    paramsValidator = emailHandlerGetAliasParamsSchema
    resultValidator = emailHandlerGetAliasResultSchema
    preResultValidation (response) {
        return { success: response }
    }
}
