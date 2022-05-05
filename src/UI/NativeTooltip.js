import {getInputType, getMainTypeFromType} from '../Form/matching'

/**
 * A 'Native' tooltip means that that autofill is not responsible
 * for rendering **any** UI relating to the selecting of items
 *
 * @implements {TooltipInterface}
 */
export class NativeTooltip {
    /** @type {import('../runtime/runtime').Runtime} */
    runtime

    /**
     * @param {import('../runtime/runtime').Runtime} runtime
     */
    constructor (runtime) {
        this.runtime = runtime
    }

    /**
     * To 'attach' on iOS/Android is to ask the runtime for autofill data - this
     * will eventually cause the native overlays to show
     * @param args
     */
    attach (args) {
        const {form, input} = args
        const inputType = getInputType(input)
        const mainType = getMainTypeFromType(inputType)

        this.runtime.getAutofillData({inputType})
            .then(resp => {
                console.log('Autofilling...', resp, mainType)
                form.autofillData(resp, mainType)
            })
            .catch(e => {
                console.error('this.runtime.getAutofillData')
                console.error(e)
            })
    }
}
