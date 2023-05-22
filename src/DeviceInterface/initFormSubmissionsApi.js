import {SUBMIT_BUTTON_SELECTOR} from '../Form/selectors-css.js'
import {buttonMatchesFormType, getText} from '../autofill-utils.js'

/**
 * This is a single place to contain all functionality relating to form submission detection
 *
 * @param {Map<HTMLElement, import("../Form/Form").Form>} forms
 */
export function initFormSubmissionsApi (forms) {
    /**
     * Global submit events
     */
    window.addEventListener('submit', (e) => {
        // @ts-ignore
        return forms.get(e.target)?.submitHandler('global submit event')
    }, true)

    /**
     * Global keydown events
     */
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const focusedForm = [...forms.values()].find((form) => form.hasFocus(e))
            focusedForm?.submitHandler('global keydown + Enter')
        }
    })

    /**
     * Global pointer down events
     * @param {PointerEvent} event
     */
    window.addEventListener('pointerdown', (event) => {
        const matchingForm = [...forms.values()].find(
            (form) => {
                const btns = [...form.submitButtons]
                // @ts-ignore
                if (btns.includes(event.target)) return true

                // @ts-ignore
                if (btns.find((btn) => btn.contains(event.target))) return true
            }
        )

        matchingForm?.submitHandler('global pointerdown event + matching form')

        if (!matchingForm) {
            const selector = SUBMIT_BUTTON_SELECTOR + ', a[href="#"], a[href^=javascript], *[onclick]'
            // check if the click happened on a button
            const button = /** @type HTMLElement */(event.target)?.closest(selector)
            if (!button) return

            const text = getText(button)
            const hasRelevantText = /(log|sign).?(in|up)|continue|next|submit/i.test(text)
            if (hasRelevantText && text.length < 25) {
                // check if there's a form with values
                const filledForm = [...forms.values()].find(form => form.hasValues())
                if (filledForm && buttonMatchesFormType(/** @type HTMLElement */(button), filledForm)) {
                    filledForm?.submitHandler('global pointerdown event + filled form')
                }
            }

            // TODO: Temporary hack to support Google signin in different languages
            if (/** @type HTMLElement */(event.target)?.closest('#passwordNext button, #identifierNext button')) {
                // check if there's a form with values
                const filledForm = [...forms.values()].find(form => form.hasValues())
                filledForm?.submitHandler('global pointerdown event + google escape hatch')
            }
        }
    }, true)

    /**
     * @type {PerformanceObserver}
     */
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries().filter((entry) =>
            // @ts-ignore why does TS not know about `entry.initiatorType`?
            ['fetch', 'xmlhttprequest'].includes(entry.initiatorType) &&
            /login|sign-in|signin/.test(entry.name)
        )

        if (!entries.length) return

        const filledForm = [...forms.values()].find(form => form.hasValues())
        filledForm?.submitHandler('performance observer')
    })
    observer.observe({entryTypes: ['resource']})
}
