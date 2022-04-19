interface RuntimeTransport {
    send<N extends Names>(name: N, data?: RuntimeMessages[N]['request']): Promise<any>
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

interface GetAutofillDataArgs {
    inputType: import("../Form/matching").SupportedTypes
}

interface AvailableInputTypes {
    credentials?: boolean;
    identities?: boolean;
    creditCards?: boolean;
    email?: boolean;
}
