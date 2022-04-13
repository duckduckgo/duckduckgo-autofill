interface CredentialsObject {
     id: string,
     username: string,
     password?: string,
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

interface InboundPMData {
     credentials: CredentialsObject[],
     creditCards: CreditCardObject[],
     identities: IdentityObject[],
     serializedInputContext: string,
}

interface TopContextData {
     inputType: SupportedType,
     credentials?: CredentialsObject[]
}

interface PMData {
     credentials: CredentialsObject[],
     creditCards: CreditCardObject[],
     identities: IdentityObject[],
     topContextData?: TopContextData,
}

interface DataStorageObject {
     credentials?: CredentialsObject,
     creditCards?: CreditCardObject,
     identities?: IdentityObject,
}

interface InternalDataStorageObject {
     credentials: CredentialsObject,
     creditCards: InternalCreditCardObject,
     identities: InternalIdentityObject,
}

type APIResponse<Type> = Promise<{ success: Type[], error?: string }>

interface EmailAddresses {
     privateAddress?: string,
     personalAddress?: string
}

type FeatureToggleNames =
  | "password.generation"

interface FeatureToggles {
     supportsFeature(name: FeatureToggleNames): boolean;
}

interface Transport {
     send(name: string, data?: any): Promise<any>
}

interface GlobalConfig {
     isApp: boolean;
     isDDGApp: boolean;
     isAndroid: boolean;
     isFirefox: boolean;
     isMobileApp: boolean;
     isWindows: boolean;
     isTopFrame: boolean;
     secret: string;
     supportsTopFrame: boolean;
     hasModernWebkitAPI: boolean;
     contentScope: Record<string, any> | null;
     userUnprotectedDomains: string[] | null;
     userPreferences: Record<string, any> | null;
     isDDGTestMode: boolean;
     isDDGDomain: boolean;
}

type PlatformConfig = import("@duckduckgo/content-scope-scripts").RuntimeConfiguration;

interface GlobalConfigImpl {
     globalConfig: GlobalConfig
}
