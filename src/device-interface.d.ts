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

interface CreditCardObject {
     id: string,
     title: string,
     displaystring: string,
     cardName?: string,
     cardstring?: string,
     cardSecurityCode?: string,
     expirationMonth?: string,
     expirationYear?: string,
     cardNumber?: number
}

interface PMData {
     credentials: CredentialsObject[],
     creditCards: CreditCardObject[],
     identities: IdentityObject[],
}

type APIResponse<Type> = Promise<{ success: [Type], error?: string }>

interface EmailAddresses {
     privateAddress?: string,
     personalAddress?: string
}

interface InterfacePrototypeBase {
     storeLocalAddresses(emailAddresses: EmailAddresses): void;
}
