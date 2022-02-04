const {Form} = require('./Form/Form')
const {notifyWebApp} = require('./autofill-utils')
const {SUBMIT_BUTTON_SELECTOR, FORM_INPUTS_SELECTOR} = require('./Form/selectors-css')

/** @type Map<HTMLFormElement, Form> */
const _forms = new Map()

/**
 * This will return `init` and `findEligibleInputs` which allows consumers
 * to either `init` if in the context of a webpage, or alternatively just perform
 * the synchronous mutations via findEligibleInputs
 *
 * @param DeviceInterface
 * @param {Map<HTMLFormElement, Form>} [forms]
 * @returns {{
 *   init: () => () => void,
 *   findEligibleInputs: (element: Element|Document) => void
 * }}
 */
const scanForInputs = (DeviceInterface, forms = _forms) => {
    const getParentForm = (input) => {
        if (input.form) return input.form

        let element = input
        // traverse the DOM to search for related inputs
        while (element.parentElement && element.parentElement !== document.body) {
            element = element.parentElement
            // todo: These selectors should be configurable
            const inputs = element.querySelectorAll(FORM_INPUTS_SELECTOR)
            const buttons = element.querySelectorAll(SUBMIT_BUTTON_SELECTOR)
            // If we find a button or another input, we assume that's our form
            if (inputs.length > 1 || buttons.length) {
                // found related input, return common ancestor
                return element
            }
        }

        return input
    }

    const addInput = (input) => {
        const parentForm = getParentForm(input)

        // Note that el.contains returns true for el itself
        const previouslyFoundParent = [...forms.keys()].find((form) => form.contains(parentForm))

        if (previouslyFoundParent) {
            // If we've already met the form or a descendant, add the input
            forms.get(previouslyFoundParent)?.addInput(input)
        } else {
            // if this form is an ancestor of an existing form, remove that before adding this
            const childForm = [...forms.keys()].find((form) => parentForm.contains(form))
            if (childForm) {
                forms.get(childForm)?.destroy()
                forms.delete(childForm)
            }

            forms.set(parentForm, new Form(parentForm, input, DeviceInterface))
        }
    }

    const findEligibleInputs = (context) => {
        if (context.matches?.(FORM_INPUTS_SELECTOR)) {
            addInput(context)
        } else {
            context.querySelectorAll(FORM_INPUTS_SELECTOR).forEach(addInput)
        }
    }

    // For all DOM mutations, search for new eligible inputs and update existing inputs positions
    const mutObs = new MutationObserver((mutationList) => {
        for (const mutationRecord of mutationList) {
            if (mutationRecord.type === 'childList') {
                // We query only within the context of added/removed nodes
                mutationRecord.addedNodes.forEach(el => {
                    if (el.nodeName === 'DDG-AUTOFILL') return

                    if (el instanceof HTMLElement) {
                        window.requestIdleCallback(() => {
                            findEligibleInputs(el)
                        })
                    }
                })
            }
        }
    })

    const logoutHandler = () => {
        // remove Dax, listeners, and observers
        mutObs.disconnect()
        forms.forEach(form => {
            form.resetAllInputs()
            form.removeAllDecorations()
        })
        forms.clear()
        notifyWebApp({ deviceSignedIn: {value: false} })
    }

    /**
     * Requiring consumers to explicitly call this `init` method allows
     * us to view this as stateless, which helps with tests and general hygiene
     *
     * We return the logoutHandler to allow consumers to do with it as they please,
     * rather than this module needing to know to register it.
     *
     * @returns {logoutHandler}
     */
    const init = () => {
        window.requestIdleCallback(() => {
            findEligibleInputs(document)
            mutObs.observe(document.body, {childList: true, subtree: true})
        })
        return logoutHandler
    }

    return {
        init,
        findEligibleInputs
    }
}

module.exports = {scanForInputs, forms: _forms}
