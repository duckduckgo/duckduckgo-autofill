import {Message} from './message'
import validators from '../schema/validators.cjs'

/**
 * This file contains every message this application can 'send' to
 * a native side.
 */

/**
 * @extends {Message<null, AvailableInputTypes>}
 */
export class GetAvailableInputTypes extends Message {
    name = 'getAvailableInputTypes'
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
 * @extends {Message<ShowAutofillParentRequest, void>}
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
 * @extends {Message<null, {name: string}>}
 */
export class Shane extends Message {

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
 * @extends {Message<GetAutofillDataRequest, IdentityObject|CredentialsObject|CreditCardObject>}
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

/**
 * Use this to wrap legacy messages where schema validation is not available.
 */
export class LegacyMessage extends Message {}

/**
 * @template [Req=any]
 * @param {string} name
 * @param {Req} [data]
 * @returns {Message<Req, any>}
 */
export function createLegacyMessage(name, data) {
    const message = new LegacyMessage(data);
    message.name = name;
    return message;
}
