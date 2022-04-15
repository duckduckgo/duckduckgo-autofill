interface GetAutofillDataArgs {
    inputType: import("../Form/matching").SupportedTypes
}

interface AvailableInputTypes {
    credentials?: boolean;
    identities?: boolean;
    creditCards?: boolean;
    email?: boolean;
}

