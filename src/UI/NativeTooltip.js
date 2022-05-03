import {getInputType, getMainTypeFromType} from '../Form/matching'

/**
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

    getActiveTooltip () {
        return null
    }

    removeTooltip () {
    }

    setActiveTooltip (_tooltip) {
    }

    addListener (_cb) {
    }

    setDevice (_device) {
    }
}
