import {UIController} from './UIController'
/**
 * `NativeController` should be used in situations where you DO NOT
 * want any Autofill-controlled user interface.
 *
 * Examples are with iOS/Android, where 'attaching' only means
 * messing a native layer to show a native tooltip.
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
     * @param {import('./UIController').AttachArgs} _args
     */
    attach (_args) {
        // const {form, input, device} = args
        // const inputType = getInputType(input)
        // const mainType = getMainTypeFromType(inputType)
        throw new Error('unreachable, native tooltip handler not supported yet')
    }
}
