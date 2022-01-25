interface CredentialsObject {
     id: Number,
     username: String,
     password?: String,
     lastUpdated: String,
}

interface IdentityObject {
     id: Number,
     title: String,
     firstName?: String,
     middleName?: String,
     lastName?: String,
     birthdayDay?: Number,
     birthdayMonth?: Number,
     birthdayYear?: Number,
     addressStreet?: String,
     addressStreet2?: String,
     addressCity?: String,
     addressProvince?: String,
     addressPostalCode?: String,
     addressCountryCode?: String,
     phone?: String,
     emailAddress?: String,
}

interface CreditCardObject {
     id: Number,
     title: String,
     displayNumber: String,
     cardName?: String,
     cardNumber?: String,
     cardSecurityCode?: String,
     expirationMonth?: Number,
     expirationYear?: Number,
}

interface PMData {
     credentials: [ CredentialsObject ],
     creditCards: [ CreditCardObject ],
     identities: [ IdentityObject ],
}

type APIResponse<Type> = Promise<{ success: [Type], error?: String }>


