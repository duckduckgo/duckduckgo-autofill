/**
 * The base transport, you can constrain the use of certain messages by
 * passing a mapping of event names -> request/response
 */
interface BaseTransport<Msgs extends Record<string, any> = Record<string, any>> {
    send<MsgName extends keyof Msgs>(name: MsgName, data?: Msgs[MsgName]['request']): Promise<Msgs[MsgName]['response']>
}

type RuntimeTransport = BaseTransport<RuntimeMessages>;

interface GenericRuntime<T> {
    send(evt: T, data?: any): Promise<any>
}

type Names = keyof RuntimeMessages;

type GenericRuntimeResponse<Type> =
    | { success: Type, error?: Schema.GenericError }
    | { data: Type, error?: Schema.GenericError }

type RuntimeMessages = {
    getAvailableInputTypes: {
        response: Schema.GetAvailableInputTypesResponse,
        request: null
    },
    getRuntimeConfiguration: {
        response: { success: Record<string, any> }
        request: null
    },
    getAutofillData: {
        response: { success: CredentialsObject | CreditCardObject | IdentityObject },
        request: Schema.GetAutofillDataRequest
    },
    storeFormData: {
        request: DataStorageObject
        response: { success: {} },
    },
    showAutofillParent: {
        request: Schema.ShowAutofillParentRequest,
        response: { success: {} },
    },
    getSelectedCredentials: {
        request: null,
        response: { success: {} },
    },
    closeAutofillParent: {
        request: null,
        response: { success: {} },
    },
    getAutofillInitData: {
        request: null,
        response: { success: PMData },
    },
    getAutofillCredentials: {
        request: { id: string },
        response: { success: CredentialsObject },
    }
}

type Interceptions = {
    [N in Names]?: (config: GlobalConfig) => Promise<RuntimeMessages[N]['response']>
}

type Middlewares = {
    [N in Names]?: (response: RuntimeMessages[N]['response']) => Promise<RuntimeMessages[N]['response']>
}

type MocksObjectAndroid = {
    [N in Names]?: () => void
}

type MocksObjectWebkit = {
    [N in Names]?: RuntimeMessages[N]['response'] | null
}

interface GetAutofillDataArgs {
    inputType: import("../Form/matching").SupportedTypes
}

type LegacyMessages = {
    emailHandlerGetAlias: {
        request: {
            requiresUserPermission: boolean,
            shouldConsumeAliasIfProvided: boolean
        },
        response: {alias: string}
    },
    selectedDetail: {
        request: any,
        response: any,
    },
    pmHandlerGetCreditCard: {
        request: any,
        response: any,
    },
    pmHandlerOpenManagePasswords: {
        request: any,
        response: any,
    },
    pmHandlerGetAutofillCredentials: {
        request: any,
        response: any,
    },
    pmHandlerGetAutofillInitData: {
        request: any,
        response: any,
    },
    pmHandlerStoreCredentials: {
        request: any,
        response: any,
    },
    emailHandlerStoreToken: {
        request: any,
        response: any,
    },
    setSize: {
        request: any,
        response: any,
    },
    emailHandlerCheckAppSignedInStatus: {
        request: any,
        response: any,
    },
    emailHandlerRefreshAlias: {
        request: any,
        response: any,
    },
    emailHandlerGetAddresses: {
        request: any,
        response: any,
    },
    emailHandlerGetUserData: {
        request: any,
        response: any,
    },
    pmHandlerOpenManageCreditCards: {
        request: any,
        response: any,
    },
    pmHandlerOpenManageIdentities: {
        request: any,
        response: any,
    },
    testMock: {
        request: any,
        response: any,
    }
}

/**
 * This is the legacy transport used for old apple devices.
 */
type LegacyTransport = BaseTransport<LegacyMessages>;
