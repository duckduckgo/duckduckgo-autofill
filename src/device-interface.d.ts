interface CredentialsObject {
     id: string,
     username: string,
     password?: string,
     lastUpdated: string,
}

interface IdentityObject {
     id: string,
     title: string,
     firstName?: string,
     middleName?: string,
     lastName?: string,
     birthdayDay?: string,
     birthdayMonth?: string,
     birthdayYear?: string,
     addressStreet?: string,
     addressStreet2?: string,
     addressCity?: string,
     addressProvince?: string,
     addressPostalCode?: string,
     addressCountryCode?: string,
     phone?: string,
     emailAddress?: string,
}

interface InternalIdentityObject extends IdentityObject {
     fullName?: string
}

interface CreditCardObject {
     id: string,
     title: string,
     displayNumber: string,
     cardName?: string,
     cardSecurityCode?: string,
     expirationMonth?: string,
     expirationYear?: string,
     cardNumber?: string
}

interface InternalCreditCardObject extends CreditCardObject {
     expiration?: string
}

interface PMData {
     credentials: CredentialsObject[],
     creditCards: CreditCardObject[],
     identities: IdentityObject[],
}

interface DataStorageObject {
     credentials: CredentialsObject,
     creditCards: CreditCardObject,
     identities: IdentityObject,
}

interface InternalDataStorageObject {
     credentials: CredentialsObject,
     creditCards: InternalCreditCardObject,
     identities: InternalIdentityObject,
}

type APIResponse<Type> = Promise<{ success: [Type], error?: string }>

interface EmailAddresses {
     privateAddress?: string,
     personalAddress?: string
}

interface InterfacePrototypeBase {
     storeLocalAddresses(emailAddresses: EmailAddresses): void;
     getActiveTooltip(): Tooltip;
     removeTooltip(): void;
     storeFormData(DataStorageObject): void;
}
