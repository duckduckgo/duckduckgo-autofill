/**
 * A 'Native' tooltip means that that autofill is not responsible
 * for rendering **any** UI relating to the selecting of items
 *
 * @implements {TooltipInterface}
 */
export class NativeTooltip {
    /**
     * To 'attach' on iOS/Android is to ask the runtime for autofill data - this
     * will eventually cause the native overlays to show
     * @param {AttachArgs} _args
     */
    attach (_args) {
        // const {form, input, device} = args
        // const inputType = getInputType(input)
        // const mainType = getMainTypeFromType(inputType)
        throw new Error('unreachable, native tooltip handler not supported yet')
    }
}
