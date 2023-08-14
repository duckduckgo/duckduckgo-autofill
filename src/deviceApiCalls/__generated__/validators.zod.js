/* DO NOT EDIT, this file was generated by scripts/api-call-generator.js */
// Generated by ts-to-zod
import { z } from "zod";

export const sendJSPixelParamsSchema = z.union([z.object({
        pixelName: z.literal("autofill_identity"),
        params: z.object({
            fieldType: z.string().optional()
        }).optional()
    }), z.object({
        pixelName: z.literal("autofill_show")
    }), z.object({
        pixelName: z.literal("autofill_personal_address")
    }), z.object({
        pixelName: z.literal("autofill_private_address")
    }), z.object({
        pixelName: z.literal("incontext_show")
    }), z.object({
        pixelName: z.literal("incontext_primary_cta")
    }), z.object({
        pixelName: z.literal("incontext_dismiss_persisted")
    }), z.object({
        pixelName: z.literal("incontext_close_x")
    })]);

export const addDebugFlagParamsSchema = z.object({
    flag: z.string()
});

export const getAutofillCredentialsParamsSchema = z.object({
    id: z.string()
});

export const setSizeParamsSchema = z.object({
    height: z.number(),
    width: z.number()
});

export const selectedDetailParamsSchema = z.object({
    data: z.record(z.unknown()),
    configType: z.string()
});

export const setIncontextSignupPermanentlyDismissedAtSchema = z.object({
    value: z.number().optional()
});

export const getIncontextSignupDismissedAtSchema = z.object({
    success: z.object({
        permanentlyDismissedAt: z.number().optional(),
        isInstalledRecently: z.boolean().optional()
    })
});

export const getAliasParamsSchema = z.object({
    requiresUserPermission: z.boolean(),
    shouldConsumeAliasIfProvided: z.boolean(),
    isIncontextSignupAvailable: z.boolean().optional()
});

export const getAliasResultSchema = z.object({
    success: z.object({
        alias: z.string().optional()
    })
});

export const emailProtectionStoreUserDataParamsSchema = z.object({
    token: z.string(),
    userName: z.string(),
    cohort: z.string()
});

export const generatedPasswordSchema = z.object({
    value: z.string(),
    username: z.string()
});

export const triggerContextSchema = z.object({
    inputTop: z.number(),
    inputLeft: z.number(),
    inputHeight: z.number(),
    inputWidth: z.number(),
    wasFromClick: z.boolean()
});

export const credentialsSchema = z.object({
    id: z.string().optional(),
    username: z.string(),
    password: z.string(),
    origin: z.object({
        url: z.string()
    }).optional(),
    credentialsProvider: z.union([z.literal("duckduckgo"), z.literal("bitwarden")]).optional(),
    providerStatus: z.union([z.literal("locked"), z.literal("unlocked")]).optional()
});

export const genericErrorSchema = z.object({
    message: z.string()
});

export const contentScopeSchema = z.object({
    features: z.record(z.object({
        exceptions: z.array(z.unknown()),
        state: z.union([z.literal("enabled"), z.literal("disabled")]),
        settings: z.record(z.unknown()).optional()
    })),
    unprotectedTemporary: z.array(z.unknown())
});

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

export const outgoingCredentialsSchema = z.object({
    username: z.string().optional(),
    password: z.string().optional()
});

export const availableInputTypesSchema = z.object({
    credentials: z.object({
        username: z.boolean().optional(),
        password: z.boolean().optional()
    }).optional(),
    identities: z.object({
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
    }).optional(),
    creditCards: z.object({
        cardName: z.boolean().optional(),
        cardSecurityCode: z.boolean().optional(),
        expirationMonth: z.boolean().optional(),
        expirationYear: z.boolean().optional(),
        cardNumber: z.boolean().optional()
    }).optional(),
    email: z.boolean().optional(),
    credentialsProviderStatus: z.union([z.literal("locked"), z.literal("unlocked")]).optional()
});

export const availableInputTypes1Schema = z.object({
    credentials: z.object({
        username: z.boolean().optional(),
        password: z.boolean().optional()
    }).optional(),
    identities: z.object({
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
    }).optional(),
    creditCards: z.object({
        cardName: z.boolean().optional(),
        cardSecurityCode: z.boolean().optional(),
        expirationMonth: z.boolean().optional(),
        expirationYear: z.boolean().optional(),
        cardNumber: z.boolean().optional()
    }).optional(),
    email: z.boolean().optional(),
    credentialsProviderStatus: z.union([z.literal("locked"), z.literal("unlocked")]).optional()
});

export const autofillFeatureTogglesSchema = z.object({
    inputType_credentials: z.boolean().optional(),
    inputType_identities: z.boolean().optional(),
    inputType_creditCards: z.boolean().optional(),
    emailProtection: z.boolean().optional(),
    emailProtection_incontext_signup: z.boolean().optional(),
    password_generation: z.boolean().optional(),
    credentials_saving: z.boolean().optional(),
    inlineIcon_credentials: z.boolean().optional(),
    third_party_credentials_provider: z.boolean().optional()
});

export const getAutofillDataRequestSchema = z.object({
    generatedPassword: generatedPasswordSchema.optional(),
    inputType: z.string(),
    mainType: z.union([z.literal("credentials"), z.literal("identities"), z.literal("creditCards")]),
    subType: z.string(),
    trigger: z.union([z.literal("userInitiated"), z.literal("autoprompt"), z.literal("postSignup")]).optional(),
    serializedInputContext: z.string().optional(),
    triggerContext: triggerContextSchema.optional()
});

export const getAutofillDataResponseSchema = z.object({
    type: z.literal("getAutofillDataResponse").optional(),
    success: z.object({
        credentials: credentialsSchema.optional(),
        action: z.union([z.literal("fill"), z.literal("focus"), z.literal("none"), z.literal("acceptGeneratedPassword"), z.literal("rejectGeneratedPassword")])
    }).optional(),
    error: genericErrorSchema.optional()
});

export const storeFormDataSchema = z.object({
    credentials: outgoingCredentialsSchema.optional(),
    trigger: z.union([z.literal("formSubmission"), z.literal("passwordGeneration"), z.literal("emailProtection")]).optional()
});

export const getAvailableInputTypesResultSchema = z.object({
    type: z.literal("getAvailableInputTypesResponse").optional(),
    success: availableInputTypesSchema,
    error: genericErrorSchema.optional()
});

export const getAutofillInitDataResponseSchema = z.object({
    type: z.literal("getAutofillInitDataResponse").optional(),
    success: z.object({
        credentials: z.array(credentialsSchema),
        identities: z.array(z.record(z.unknown())),
        creditCards: z.array(z.record(z.unknown())),
        serializedInputContext: z.string()
    }).optional(),
    error: genericErrorSchema.optional()
});

export const getAutofillCredentialsResultSchema = z.object({
    type: z.literal("getAutofillCredentialsResponse").optional(),
    success: z.object({
        id: z.string().optional(),
        autogenerated: z.boolean().optional(),
        username: z.string(),
        password: z.string().optional()
    }).optional(),
    error: genericErrorSchema.optional()
});

export const autofillSettingsSchema = z.object({
    featureToggles: autofillFeatureTogglesSchema
});

export const emailProtectionGetIsLoggedInResultSchema = z.object({
    success: z.boolean().optional(),
    error: genericErrorSchema.optional()
});

export const emailProtectionGetUserDataResultSchema = z.object({
    success: z.object({
        userName: z.string(),
        nextAlias: z.string(),
        token: z.string()
    }).optional(),
    error: genericErrorSchema.optional()
});

export const emailProtectionGetCapabilitiesResultSchema = z.object({
    success: z.object({
        addUserData: z.boolean().optional(),
        getUserData: z.boolean().optional(),
        removeUserData: z.boolean().optional()
    }).optional(),
    error: genericErrorSchema.optional()
});

export const emailProtectionGetAddressesResultSchema = z.object({
    success: z.object({
        personalAddress: z.string(),
        privateAddress: z.string()
    }).optional(),
    error: genericErrorSchema.optional()
});

export const emailProtectionRefreshPrivateAddressResultSchema = z.object({
    success: z.object({
        personalAddress: z.string(),
        privateAddress: z.string()
    }).optional(),
    error: genericErrorSchema.optional()
});

export const runtimeConfigurationSchema = z.object({
    contentScope: contentScopeSchema,
    userUnprotectedDomains: z.array(z.string()),
    userPreferences: userPreferencesSchema
});

export const providerStatusUpdatedSchema = z.object({
    status: z.union([z.literal("locked"), z.literal("unlocked")]),
    credentials: z.array(credentialsSchema),
    availableInputTypes: availableInputTypes1Schema
});

export const getRuntimeConfigurationResponseSchema = z.object({
    type: z.literal("getRuntimeConfigurationResponse").optional(),
    success: runtimeConfigurationSchema.optional(),
    error: genericErrorSchema.optional()
});

export const askToUnlockProviderResultSchema = z.object({
    type: z.literal("askToUnlockProviderResponse").optional(),
    success: providerStatusUpdatedSchema,
    error: genericErrorSchema.optional()
});

export const checkCredentialsProviderStatusResultSchema = z.object({
    type: z.literal("checkCredentialsProviderStatusResponse").optional(),
    success: providerStatusUpdatedSchema,
    error: genericErrorSchema.optional()
});

export const apiSchema = z.object({
    addDebugFlag: z.record(z.unknown()).and(z.object({
        paramsValidator: addDebugFlagParamsSchema.optional()
    })).optional(),
    getAutofillData: z.record(z.unknown()).and(z.object({
        id: z.literal("getAutofillDataResponse").optional(),
        paramsValidator: getAutofillDataRequestSchema.optional(),
        resultValidator: getAutofillDataResponseSchema.optional()
    })).optional(),
    getRuntimeConfiguration: z.record(z.unknown()).and(z.object({
        id: z.literal("getRuntimeConfigurationResponse").optional(),
        resultValidator: getRuntimeConfigurationResponseSchema.optional()
    })).optional(),
    storeFormData: z.record(z.unknown()).and(z.object({
        paramsValidator: storeFormDataSchema.optional()
    })).optional(),
    getAvailableInputTypes: z.record(z.unknown()).and(z.object({
        id: z.literal("getAvailableInputTypesResponse").optional(),
        resultValidator: getAvailableInputTypesResultSchema.optional()
    })).optional(),
    getAutofillInitData: z.record(z.unknown()).and(z.object({
        id: z.literal("getAutofillInitDataResponse").optional(),
        resultValidator: getAutofillInitDataResponseSchema.optional()
    })).optional(),
    getAutofillCredentials: z.record(z.unknown()).and(z.object({
        id: z.literal("getAutofillCredentialsResponse").optional(),
        paramsValidator: getAutofillCredentialsParamsSchema.optional(),
        resultValidator: getAutofillCredentialsResultSchema.optional()
    })).optional(),
    setSize: z.record(z.unknown()).and(z.object({
        paramsValidator: setSizeParamsSchema.optional()
    })).optional(),
    selectedDetail: z.record(z.unknown()).and(z.object({
        paramsValidator: selectedDetailParamsSchema.optional()
    })).optional(),
    closeAutofillParent: z.record(z.unknown()).optional(),
    askToUnlockProvider: z.record(z.unknown()).and(z.object({
        id: z.literal("askToUnlockProviderResponse").optional(),
        resultValidator: askToUnlockProviderResultSchema.optional()
    })).optional(),
    checkCredentialsProviderStatus: z.record(z.unknown()).and(z.object({
        id: z.literal("checkCredentialsProviderStatusResponse").optional(),
        resultValidator: checkCredentialsProviderStatusResultSchema.optional()
    })).optional(),
    sendJSPixel: z.record(z.unknown()).and(z.object({
        paramsValidator: sendJSPixelParamsSchema.optional()
    })).optional(),
    setIncontextSignupPermanentlyDismissedAt: z.record(z.unknown()).and(z.object({
        paramsValidator: setIncontextSignupPermanentlyDismissedAtSchema.optional()
    })).optional(),
    getIncontextSignupDismissedAt: z.record(z.unknown()).and(z.object({
        id: z.literal("getIncontextSignupDismissedAt").optional(),
        resultValidator: getIncontextSignupDismissedAtSchema.optional()
    })).optional(),
    autofillSettings: z.record(z.unknown()).and(z.object({
        validatorsOnly: z.literal(true).optional(),
        resultValidator: autofillSettingsSchema.optional()
    })).optional(),
    getAlias: z.record(z.unknown()).and(z.object({
        validatorsOnly: z.literal(true).optional(),
        paramValidator: getAliasParamsSchema.optional(),
        resultValidator: getAliasResultSchema.optional()
    })).optional(),
    openManagePasswords: z.record(z.unknown()).optional(),
    openManageCreditCards: z.record(z.unknown()).optional(),
    openManageIdentities: z.record(z.unknown()).optional(),
    emailProtectionStoreUserData: z.record(z.unknown()).and(z.object({
        id: z.literal("emailProtectionStoreUserDataResponse").optional(),
        paramsValidator: emailProtectionStoreUserDataParamsSchema.optional()
    })).optional(),
    emailProtectionRemoveUserData: z.record(z.unknown()).optional(),
    emailProtectionGetIsLoggedIn: z.record(z.unknown()).and(z.object({
        id: z.literal("emailProtectionGetIsLoggedInResponse").optional(),
        resultValidator: emailProtectionGetIsLoggedInResultSchema.optional()
    })).optional(),
    emailProtectionGetUserData: z.record(z.unknown()).and(z.object({
        id: z.literal("emailProtectionGetUserDataResponse").optional(),
        resultValidator: emailProtectionGetUserDataResultSchema.optional()
    })).optional(),
    emailProtectionGetCapabilities: z.record(z.unknown()).and(z.object({
        id: z.literal("emailProtectionGetCapabilitiesResponse").optional(),
        resultValidator: emailProtectionGetCapabilitiesResultSchema.optional()
    })).optional(),
    emailProtectionGetAddresses: z.record(z.unknown()).and(z.object({
        id: z.literal("emailProtectionGetAddressesResponse").optional(),
        resultValidator: emailProtectionGetAddressesResultSchema.optional()
    })).optional(),
    emailProtectionRefreshPrivateAddress: z.record(z.unknown()).and(z.object({
        id: z.literal("emailProtectionRefreshPrivateAddressResponse").optional(),
        resultValidator: emailProtectionRefreshPrivateAddressResultSchema.optional()
    })).optional(),
    startEmailProtectionSignup: z.record(z.unknown()).optional(),
    closeEmailProtectionTab: z.record(z.unknown()).optional()
});
