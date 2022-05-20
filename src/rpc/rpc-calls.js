import {ZodRPC} from '../../packages/zod-rpc'
import {emailHandlerGetAliasParamsSchema, emailHandlerGetAliasResultSchema} from './validators.zod'

/**
 * @extends {ZodRPC<emailHandlerGetAliasParamsSchema, emailHandlerGetAliasResultSchema>}
 */
export class GetAlias extends ZodRPC {
    method = 'emailHandlerGetAlias'
    paramsValidator = emailHandlerGetAliasParamsSchema
    resultValidator = emailHandlerGetAliasResultSchema

    // This won't be needed on new messages, it's here to prevent any changes to existing messages
    // and this `GetAlias` message is an example
    unwrapResult = false
}
