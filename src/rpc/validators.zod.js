import z from 'zod'

/**
 * Note: This file is here as an example of how you can export `Zod` definitions
 * and how they will be excluded from the production bundle.
 */

export const emailHandlerGetAliasParamsSchema = z.object({
    requiresUserPermission: z.boolean(),
    shouldConsumeAliasIfProvided: z.boolean()
})

export const emailHandlerGetAliasResultSchema = z.object({
    alias: z.string()
})
