import {UIController} from './UIController'
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
     * @param {import('./UIController').AttachArgs} _args
     */
    attach (_args) {
        throw new Error('unreachable, native tooltip handler not supported yet')
    }
}
