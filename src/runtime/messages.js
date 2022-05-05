import {Message} from './testing'
import validators from '../schema/validators.cjs'

/**
 * @extends {Message<null, AvailableInputTypes>}
 */
export class GetAvailableInputTypes extends Message {
    name = 'getAvailableInputTypes'
    // @ts-ignore
    resValidator = validators['#/definitions/GetAvailableInputTypesResponse']
}

/**
 * @extends {Message}
 */
export class CloseAutofillParent extends Message {
    name = 'closeAutofillParent'
}

/**
 * @extends {Message<string|number, CredentialsObject>}
 */
export class GetAutofillCredentials extends Message {
    name = 'getAutofillCredentials'
}

/**
 * @extends {Message<Schema.ShowAutofillParentRequest, void>}
 */
export class ShowAutofillParent extends Message {
    // @ts-ignore
    reqValidator = validators['#/definitions/ShowAutofillParentRequest']
    name = 'showAutofillParent'
}

/**
 * @extends {Message<null, any>}
 */
export class GetSelectedCredentials extends Message {
    name = 'getSelectedCredentials'
}

/**
 * @extends {Message<DataStorageObject, void>}
 */
export class StoreFormData extends Message {
    name = 'storeFormData'
    alias = 'storeFormData'
    // @ts-ignore
    reqValidator = validators['#/definitions/StoreFormDataRequest']
}

/**
 * @typedef {StoreFormData} Names2
 */


/**
 * @extends {Message<null, InboundPMData>}
 */
export class GetAutofillInitData extends Message {
    name = 'getAutofillInitData'
    // @ts-ignore
    resValidator = validators['#/definitions/GetAutofillInitDataResponse']
}

/**
 * @extends {Message<Schema.GetAutofillDataRequest, IdentityObject|CredentialsObject|CreditCardObject>}
 */
export class GetAutofillData extends Message {
    name = 'getAutofillData'
    // @ts-ignore
    reqValidator = validators['#/definitions/GetAutofillDataRequest']
    // @ts-ignore
    resValidator = validators['#/definitions/GetAutofillDataResponse']
}

/**
 * @extends {Message<null, import("@duckduckgo/content-scope-scripts").RuntimeConfiguration>}
 */
export class GetRuntimeConfiguration extends Message {
    name = 'getRuntimeConfiguration'
    // @ts-ignore
    resValidator = validators['#/definitions/GetRuntimeConfigurationResponse']
}
