// Do not edit, this was created by `scripts/schema.js`
namespace Schema {
    
    /**
     * @link {import("./credentials.schema.json")}
     */
    interface Credentials {
        
        /**
         * Credentials.id
         * If present, must be a string
         */
        id?: string
        
        /**
         * Credentials.username
         * This field is always present, but sometimes it could be an empty string
         */
        username: string
        
        /**
         * Credentials.password
         * This field may be empty or absent altogether, which is why it's not marked as 'required'
         */
        password?: string
    }
        
    /**
     * @link {import("./creditCard.schema.json")}
     */
    interface CreditCard {
        id?: string
        title?: string
        displayNumber?: string
        cardName?: string
        cardSecurityCode?: string
        expirationMonth?: string
        expirationYear?: string
        cardNumber?: string
    }
        
    /**
     * @link {import("./error.schema.json")}
     */
    interface GenericError {
        message: string
    }
        
    /**
     * A user's Identity
     * 
     * @link {import("./identity.schema.json")}
     */
    interface Identity {
        id?: string
        title: string
        firstName?: string
        middleName?: string
        lastName?: string
        birthdayDay?: string
        birthdayMonth?: string
        birthdayYear?: string
        addressStreet?: string
        addressStreet2?: string
        addressCity?: string
        addressProvince?: string
        addressPostalCode?: string
        addressCountryCode?: string
        phone?: string
        emailAddress?: string
    }
        
    /**
     * GetAutofillDataRequest Request Object
     * 
     * This describes the argument given to `getAutofillData(data)`
     * 
     * @link {import("./request.getAutofillData.schema.json")}
     */
    interface GetAutofillDataRequest {
        
        /**
         * The input type that triggered the call
         * This is the combined input type, such as `credentials.username`
         */
        inputType: string
        
        /**
         * The main input type
         */
        mainType: "credentials" | "identities" | "creditCards"
        
        /**
         * Just the subtype, such as `password` or `username`
         */
        subType: string
    }
        
    /**
     * ShowAutofillParentRequest Request Object
     * 
     * This describes the argument given to showAutofillParent(data)
     * 
     * @link {import("./request.showAutofillParent.schema.json")}
     */
    interface ShowAutofillParentRequest {
        wasFromClick: boolean
        inputTop: number
        inputLeft: number
        inputHeight: number
        inputWidth: number
        
        /**
         * JSON string that will be available from `getAutofillInitData()`
         */
        serializedInputContext: string
    }
        
    /**
     * StoreFormData Request
     * 
     * Autofill could send this data at any point. 
     * 
     * It will **not** listen for a response, it's expected that the native side will handle
     * 
     * @link {import("./request.storeFormData.schema.json")}
     */
    interface StoreFormDataRequest {
        credentials?: CredentialsOutgoing
        identities?: Identity
        creditCards?: CreditCard
    }
    
    /**
     * @link {import("./request.storeFormData.schema.json")}
     */
    interface CredentialsOutgoing {
        
        /**
         * Optional username
         */
        username?: string
        
        /**
         * Optional password
         */
        password?: string
    }
        
    /**
     * @link {import("./response.getAutofillData.schema.json")}
     */
    interface GetAutofillDataResponse {
        
        /**
         * This is the 'type' field on message that may be sent back to the window
         * Required on Android + Windows devices, optional on iOS
         */
        type?: "getAutofillDataResponse"
        
        /**
         * The data returned, containing only fields that will be auto-filled
         */
        success: Credentials
        error?: GenericError
    }
        
    /**
     * @link {import("./response.getAutofillInitData.schema.json")}
     */
    interface GetAutofillInitDataResponse {
        
        /**
         * This is the 'type' field on message that may be sent back to the window
         * Required on Android + Windows devices, optional on iOS
         */
        type?: "getAutofillInitDataResponse"
        success: AutofillInitData
        error?: GenericError
    }
    
    /**
     * GetAutofillInitDataResponse Success Response
     * 
     * @link {import("./response.getAutofillInitData.schema.json")}
     */
    interface AutofillInitData {
        credentials: Credentials[]
        identities: any[]
        creditCards: any[]
        
        /**
         * A clone of the `serializedInputContext` that was sent in the request
         */
        serializedInputContext: string
    }
        
    /**
     * GetAvailableInputTypesResponse Success Response
     * 
     * @link {import("./response.getAvailableInputTypes.schema.json")}
     */
    interface GetAvailableInputTypesResponse {
        
        /**
         * This is the 'type' field on message that may be sent back to the window
         * Required on Android + Windows devices, optional on iOS
         */
        type?: "getAvailableInputTypesResponse"
        success: AvailableInputTypes
        error?: GenericError
    }
    
    /**
     * @link {import("./response.getAvailableInputTypes.schema.json")}
     */
    interface AvailableInputTypes {
        credentials?: boolean
        identities?: boolean
        creditCards?: boolean
        email?: boolean
    }
        
    /**
     * GetRuntimeConfigurationResponse Success Response
     * 
     * Data that can be understood by @duckduckgo/content-scope-scripts
     * 
     * @link {import("./response.getRuntimeConfiguration.schema.json")}
     */
    interface GetRuntimeConfigurationResponse {
        
        /**
         * This is the 'type' field on message that may be sent back to the window
         * Required on Android + Windows devices, optional on iOS
         */
        type?: "getRuntimeConfigurationResponse"
        success: RuntimeConfiguration
        error?: GenericError
    }
        
    /**
     * Runtime Configuration Schema
     * 
     * Required Properties to enable an instance of RuntimeConfiguration
     * 
     * @link {import("./runtime-configuration.schema.json")}
     */
    interface RuntimeConfiguration {
        contentScope: RuntimeConfigurationContentScope
        userUnprotectedDomains: any[]
        userPreferences: RuntimeConfigurationUserPreferences
    }
    
    /**
     * Platform
     * 
     * @link {import("./runtime-configuration.schema.json")}
     */
    interface RuntimeConfigurationPlatform {
        name: "ios" | "macos" | "windows" | "extension" | "android" | "unknown"
    }
    
    /**
     * Settings
     * 
     * @link {import("./runtime-configuration.schema.json")}
     */
    interface RuntimeConfigurationSettings {
        [index: string]: unknown
    }
    
    /**
     * UserPreferencesFeatureItem
     * 
     * @link {import("./runtime-configuration.schema.json")}
     */
    interface RuntimeConfigurationUserPreferencesFeatureItem {
        settings: RuntimeConfigurationSettings
    }
    
    /**
     * UserPreferencesFeatures
     * 
     * @link {import("./runtime-configuration.schema.json")}
     */
    interface RuntimeConfigurationUserPreferencesFeatures {
        [index: string]: RuntimeConfigurationUserPreferencesFeatureItem
    }
    
    /**
     * UserPreferences
     * 
     * @link {import("./runtime-configuration.schema.json")}
     */
    interface RuntimeConfigurationUserPreferences {
        debug: boolean
        platform: RuntimeConfigurationPlatform
        features: RuntimeConfigurationUserPreferencesFeatures
    }
    
    /**
     * ContentScopeFeatureItem
     * 
     * @link {import("./runtime-configuration.schema.json")}
     */
    interface RuntimeConfigurationContentScopeFeatureItem {
        exceptions: any[]
        state: string
    }
    
    /**
     * ContentScopeFeatures
     * 
     * @link {import("./runtime-configuration.schema.json")}
     */
    interface RuntimeConfigurationContentScopeFeatures {
        [index: string]: RuntimeConfigurationContentScopeFeatureItem
    }
    
    /**
     * ContentScope
     * 
     * @link {import("./runtime-configuration.schema.json")}
     */
    interface RuntimeConfigurationContentScope {
        features: RuntimeConfigurationContentScopeFeatures
        unprotectedTemporary: any[]
    }
        
    /**
     * @link {import("./settings.schema.json")}
     */
    interface AutofillSettings {
        featureToggles: FeatureToggles
    }
    
    /**
     * These are toggles used throughout the application to enable/disable features fully
     * 
     * @link {import("./settings.schema.json")}
     */
    interface FeatureToggles {
        inputType_credentials: boolean
        inputType_identities: boolean
        inputType_creditCards: boolean
        emailProtection: boolean
        password_generation: boolean
        credentials_saving: boolean
    }
    
}