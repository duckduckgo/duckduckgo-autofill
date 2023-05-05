import {UIController} from './UIController.js'
import {getInputType, getMainTypeFromType, getSubtypeFromType} from '../../Form/matching.js'
import {GetAutofillDataCall} from '../../deviceApiCalls/__generated__/deviceApiCalls.js'
import {AUTOGENERATED_KEY} from '../../InputTypes/Credentials.js'

/**
 * `NativeController` should be used in situations where you DO NOT
 * want any Autofill-controlled user interface.
 *
 * Examples are with iOS/Android, where 'attaching' only means
 * messaging a native layer to show a native tooltip.
 *
 * @example
 *
 * ```javascript
 * const controller = new NativeController();
 * controller.attach(...);
 * ```
 */
export class NativeUIController extends UIController {
    /**
     * Keep track of when passwords were suggested/rejected/accepted etc
     * State is kept here because it's specific to the interactions on mobile (eg: NativeUIController)
     *
     * @type {"default" | "rejected"}
     */
    #passwordStatus = 'default'

    /**
     * @param {import('./UIController').AttachArgs} args
     */
    attach (args) {
        const {form, input, device, trigger, triggerMetaData, topContextData} = args
        const inputType = getInputType(input)
        const mainType = getMainTypeFromType(inputType)
        const subType = getSubtypeFromType(inputType)

        if (mainType === 'unknown') {
            throw new Error('unreachable, should not be here if (mainType === "unknown")')
        }

        if (trigger === 'autoprompt') {
            window.scrollTo({
                behavior: 'smooth',
                top: form.form.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 50
            })
        }

        /** @type {import('../../deviceApiCalls/__generated__/validators-ts').GetAutofillDataRequest} */
        let payload = {
            inputType,
            mainType,
            subType,
            trigger
        }

        // append generated password if enabled
        if (device.settings.featureToggles.password_generation) {
            payload = this.appendGeneratedPassword(topContextData, payload, triggerMetaData)
        }

        device.deviceApi.request(new GetAutofillDataCall(payload))
            .then(resp => {
                switch (resp.action) {
                case 'fill': {
                    if (mainType in resp) {
                        form.autofillData(resp[mainType], mainType)
                    } else {
                        throw new Error(`action: "fill" cannot occur because "${mainType}" was missing`)
                    }
                    break
                }
                case 'focus': {
                    form.activeInput?.focus()
                    break
                }
                case 'acceptGeneratedPassword': {
                    form.autofillData({
                        password: topContextData.credentials?.[0].password,
                        [AUTOGENERATED_KEY]: true
                    }, mainType)
                    break
                }
                case 'rejectGeneratedPassword': {
                    this.#passwordStatus = 'rejected'
                    break
                }
                default: {
                    if (args.device.isTestMode()) {
                        console.warn('response not handled', resp)
                    }
                }
                }
            })
            .catch(e => {
                console.error('NativeTooltip::device.getAutofillData(payload)')
                console.error(e)
            })
    }

    /**
     * If a password exists in `topContextData`, we can append it to the outgoing data
     * in a way that native platforms can easily understand.
     *
     * @param {TopContextData} topContextData
     * @param {import('../../deviceApiCalls/__generated__/validators-ts.js').GetAutofillDataRequest} outgoingData
     * @param {import('../../UI/controllers/UIController.js').AttachArgs['triggerMetaData']} triggerMetaData
     * @return {import('../../deviceApiCalls/__generated__/validators-ts.js').GetAutofillDataRequest}
     */
    appendGeneratedPassword (topContextData, outgoingData, triggerMetaData) {
        const autoGeneratedCredential = topContextData.credentials?.find(credential => credential.autogenerated)

        // if there's no generated password, we don't need to do anything
        if (!autoGeneratedCredential?.password) {
            return outgoingData
        }

        function suggestPassword () {
            if (!autoGeneratedCredential?.password) throw new Error('unreachable')
            return {
                ...outgoingData,
                generatedPassword: {
                    value: autoGeneratedCredential.password
                }
            }
        }

        // for explicit opt-in, we should *always* append the password
        // this can occur when the user clicks icon directly - in that instance we ignore
        // any internal state and just append the password to the outgoing data
        if (triggerMetaData.type === 'explicit-opt-in') {
            return suggestPassword()
        }

        // When the opt-in is 'implicit' though we only append the password if the user has not previously rejected it.
        // This helps the situation where the user has rejected a password for the username field, but then
        // taps into the confirm password field
        if (triggerMetaData.type === 'implicit-opt-in' && this.#passwordStatus !== 'rejected') {
            return suggestPassword()
        }

        // if we get here there's nothing to do
        return outgoingData
    }
}
