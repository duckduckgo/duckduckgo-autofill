interface RuntimeMessage<Req = any, Res = any> {
    request?: Req;
    response: Res;
}

type RuntimeMessages = {
    getAvailableInputTypes: {
        response: { success: AvailableInputTypes },
        request: null
    },
    getRuntimeConfiguration: {
        response: { success: Record<string, any> }
        request: null
    },
    getAutofillData: {
        response: { success: CredentialsObject | CreditCardObject | IdentityObject },
        request: {
            inputType: string,
            mainType: string,
            subType: string,
        }
    },
    storeFormData: {
        request: DataStorageObject
        response: { success: {} },
    }
}

type Names = keyof RuntimeMessages;
type Interceptions = {
    [N in Names]?: (config: GlobalConfig) => RuntimeMessages[N]['response']
}
type MocksObjectAndroid = {
    [N in Names]?: () => void
}
type MocksObjectWebkit = {
    [N in Names]?: RuntimeMessages[N]['response'] | null
}

// interface GetAvailableInputTypesMessage extends RuntimeMessage {
//     type: "getAvailableInputTypes"
// }
//
// interface GetRuntimeConfigurationMessage extends RuntimeMessage {
//     type: "getRuntimeConfiguration"
//     response: Record<string, any>
// }
//
// type RuntimeMessages =
//     | GetAvailableInputTypesMessage
//     | GetRuntimeConfigurationMessage
//
// type Mapping = {
//     [K in RuntimeMessages['type']]: boolean
// }
//
// type FN = <N extends RuntimeMessages['type']>(name: N, data: Mapping[N])

interface GetAutofillDataArgs {
    inputType: import("../Form/matching").SupportedTypes
}

interface AvailableInputTypes {
    credentials?: boolean;
    identities?: boolean;
    creditCards?: boolean;
    email?: boolean;
}

