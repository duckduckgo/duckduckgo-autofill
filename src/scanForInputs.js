const Form = require('./Form/Form')
const {notifyWebApp} = require('./autofill-utils')
const {FIELD_SELECTOR, SUBMIT_BUTTON_SELECTOR} = require('./Form/selectors')

const forms = new Map()

// Accepts the DeviceInterface as an explicit dependency
const scanForInputs = (DeviceInterface) => {
    const getParentForm = (input) => {
        if (input.form) return input.form

        let element = input
        // traverse the DOM to search for related inputs
        while (element.parentNode && element !== document.body) {
            element = element.parentElement
            const inputs = element.querySelectorAll(FIELD_SELECTOR)
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
            forms.get(previouslyFoundParent).addInput(input)
        } else {
            // if this form is an ancestor of an existing form, remove that before adding this
            const childForm = [...forms.keys()].find((form) => parentForm.contains(form))
            forms.delete(childForm)

            forms.set(parentForm, new Form(parentForm, input, DeviceInterface))
        }
    }

    const findEligibleInput = (context) => {
        if (context.nodeName === 'INPUT' && context.matches(FIELD_SELECTOR)) {
            addInput(context)
        } else {
            context.querySelectorAll(FIELD_SELECTOR).forEach(addInput)
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
                            findEligibleInput(el)
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

    DeviceInterface.addLogoutListener(logoutHandler)

    window.requestIdleCallback(() => {
        findEligibleInput(document)
        mutObs.observe(document.body, {childList: true, subtree: true})
    })
}

module.exports = {scanForInputs, forms}
