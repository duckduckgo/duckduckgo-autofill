const Form = require('./Form/Form')
const {notifyWebApp} = require('./autofill-utils')
const {SUBMIT_BUTTON_SELECTOR, FORM_ELS_SELECTOR} = require('./Form/selectors')

/** @type Map<HTMLFormElement, Form> */
const forms = new Map()

/* TODO check if we need this / should combine with getParentFormElement for a faster lookup
const getParentFormInstance = (input, parentFormElement) => {
    // Note that el.contains returns true for el itself
    return [...forms.keys()].find((form) => form.contains(parentFormElement))
}
*/

const getParentFormInstance = (parentFormElement) => {
    return forms.get(parentFormElement)
}

const getOrCreateParentFormInstance = (input, parentFormElement, DeviceInterface) => {
    let parentFormInstance = getParentFormInstance(input, parentFormElement)
    if (!parentFormInstance) {
        parentFormInstance = new Form(parentFormElement, input, DeviceInterface)
        forms.set(parentFormElement, parentFormInstance)
    }
    return parentFormInstance
}

// Accepts the DeviceInterface as an explicit dependency
const scanForInputs = (DeviceInterface) => {
    const getParentFormElement = (input) => {
        if (input.form) return input.form

        let element = input
        // traverse the DOM to search for related inputs
        while (element.parentElement && element.parentElement !== document.body) {
            element = element.parentElement
            const inputs = element.querySelectorAll(FORM_ELS_SELECTOR)
            const buttons = element.querySelectorAll(SUBMIT_BUTTON_SELECTOR)
            // If we find a button or another input, we assume that's our form
            if (inputs.length > 1 || buttons.length) {
                // found related input, return common ancestor
                return element
            }
        }
    }

    const addInput = (input) => {
        const parentFormElement = getParentFormElement(input)

        // if this form is an ancestor of an existing form, remove that before adding this
        const childForm = [...forms.keys()].find((form) => parentFormElement.contains(form))
        forms.delete(childForm)

        getOrCreateParentFormInstance(input, parentFormElement, DeviceInterface)
    }

    const findEligibleInput = (context) => {
        if (context.matches?.(FORM_ELS_SELECTOR)) {
            addInput(context)
        } else {
            context.querySelectorAll(FORM_ELS_SELECTOR).forEach(addInput)
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

module.exports = {scanForInputs, forms, getOrCreateParentFormInstance}
