/* DO NOT EDIT, this file was generated by scripts/api-call-generator.js */
// Generated by ts-to-zod
import { z } from "zod";

export const credentialsSchema = z.object({
    id: z.string().optional(),
    username: z.string(),
    password: z.string(),
    credentialsProvider: z.union([z.literal("duckduckgo"), z.literal("bitwarden")]).optional(),
    providerStatus: z.union([z.literal("locked"), z.literal("unlocked")]).optional()
});

export const availableInputTypesSchema = z.object({
    credentials: z.record(z.unknown()).and(z.object({
        username: z.boolean().optional(),
        password: z.boolean().optional()
    })).optional(),
    identities: z.record(z.unknown()).and(z.object({
        firstName: z.boolean().optional(),
        middleName: z.boolean().optional(),
        lastName: z.boolean().optional(),
        birthdayDay: z.boolean().optional(),
        birthdayMonth: z.boolean().optional(),
        birthdayYear: z.boolean().optional(),
        addressStreet: z.boolean().optional(),
        addressStreet2: z.boolean().optional(),
        addressCity: z.boolean().optional(),
        addressProvince: z.boolean().optional(),
        addressPostalCode: z.boolean().optional(),
        addressCountryCode: z.boolean().optional(),
        phone: z.boolean().optional(),
        emailAddress: z.boolean().optional()
    })).optional(),
    creditCards: z.record(z.unknown()).and(z.object({
        cardName: z.boolean().optional(),
        cardSecurityCode: z.boolean().optional(),
        expirationMonth: z.boolean().optional(),
        expirationYear: z.boolean().optional(),
        cardNumber: z.boolean().optional()
    })).optional(),
    email: z.boolean().optional(),
    credentialsProviderStatus: z.union([z.literal("locked"), z.literal("unlocked")]).optional()
});

export const genericErrorSchema = z.object({
    message: z.string()
});

export const autofillFeatureTogglesSchema = z.object({
    inputType_credentials: z.boolean().optional(),
    inputType_identities: z.boolean().optional(),
    inputType_creditCards: z.boolean().optional(),
    emailProtection: z.boolean().optional(),
    password_generation: z.boolean().optional(),
    credentials_saving: z.boolean().optional(),
    inlineIcon_credentials: z.boolean().optional(),
    credentials_provider: z.union([z.literal("duckduckgo"), z.literal("bitwarden")]).optional()
});

export const providerStatusUpdatedSchema = z.object({
    status: z.union([z.literal("locked"), z.literal("unlocked")]),
    credentials: z.array(credentialsSchema),
    availableInputTypes: availableInputTypesSchema
});

export const getAliasParamsSchema = z.object({
    requiresUserPermission: z.boolean(),
    shouldConsumeAliasIfProvided: z.boolean()
});

export const getAliasResultSchema = z.object({
    success: z.object({
        alias: z.string()
    })
});

export const getAutofillDataRequestSchema = z.object({
    inputType: z.string(),
    mainType: z.union([z.literal("credentials"), z.literal("identities"), z.literal("creditCards")]),
    subType: z.string(),
    trigger: z.union([z.literal("userInitiated"), z.literal("autoprompt")]).optional()
});

export const getAutofillDataResponseSchema = z.object({
    type: z.literal("getAutofillDataResponse").optional(),
    success: z.object({
        credentials: credentialsSchema.optional(),
        action: z.union([z.literal("fill"), z.literal("focus"), z.literal("none")])
    }).optional(),
    error: genericErrorSchema.optional()
});

export const getAvailableInputTypesRequestSchema = z.object({
    mainType: z.union([z.literal("credentials"), z.literal("identities"), z.literal("creditCards")])
});

export const getAvailableInputTypesResultSchema = z.object({
    type: z.literal("getAvailableInputTypesResponse").optional(),
    success: availableInputTypesSchema,
    error: genericErrorSchema.optional()
});

export const contentScopeFeaturesItemSettingsSchema = z.record(z.unknown());

export const userPreferencesSchema = z.object({
    globalPrivacyControlValue: z.boolean().optional(),
    sessionKey: z.string().optional(),
    debug: z.boolean(),
    platform: z.object({
        name: z.union([z.literal("ios"), z.literal("macos"), z.literal("windows"), z.literal("extension"), z.literal("android"), z.literal("unknown")])
    }),
    features: z.record(z.object({
        settings: z.record(z.unknown())
    }))
});

export const contentScopeFeaturesSchema = z.record(z.object({
    exceptions: z.array(z.unknown()),
    state: z.union([z.literal("enabled"), z.literal("disabled")]),
    settings: contentScopeFeaturesItemSettingsSchema.optional()
}));

export const outgoingCredentialsSchema = z.object({
    username: z.string().optional(),
    password: z.string().optional()
});

export const askToUnlockProviderResultSchema = z.object({
    type: z.literal("askToUnlockProviderResponse").optional(),
    success: providerStatusUpdatedSchema,
    error: genericErrorSchema.optional()
});

export const autofillSettingsSchema = z.object({
    featureToggles: autofillFeatureTogglesSchema
});

export const checkCredentialsProviderStatusResultSchema = z.object({
    type: z.literal("checkCredentialsProviderStatusResponse").optional(),
    success: providerStatusUpdatedSchema,
    error: genericErrorSchema.optional()
});

export const contentScopeSchema = z.object({
    features: contentScopeFeaturesSchema,
    unprotectedTemporary: z.array(z.unknown())
});

export const runtimeConfigurationSchema = z.object({
    contentScope: contentScopeSchema,
    userUnprotectedDomains: z.array(z.string()),
    userPreferences: userPreferencesSchema,
    availableInputTypes: availableInputTypesSchema
});

export const storeFormDataSchema = z.object({
    credentials: outgoingCredentialsSchema.optional()
});

export const getRuntimeConfigurationResponseSchema = z.object({
    type: z.literal("getRuntimeConfigurationResponse").optional(),
    success: runtimeConfigurationSchema.optional(),
    error: genericErrorSchema.optional()
});
