const Form = require('./Form/Form')
const {notifyWebApp} = require('./autofill-utils')
const {EMAIL_SELECTOR, PASSWORD_SELECTOR} = require('./Form/selectors')

// Accepts the DeviceInterface as an explicit dependency
const scanForInputs = (DeviceInterface) => {
    const forms = new Map()

    const addInput = input => {
        const parentForm = input.form

        if (forms.has(parentForm)) {
            // If we've already met the form, add the input
            forms.get(parentForm).addInput(input)
        } else {
            forms.set(parentForm || input, new Form(parentForm, input, DeviceInterface.attachTooltip))
        }
    }

    const findEligibleInput = context => {
        if (context.nodeName === 'INPUT' && context.matches(EMAIL_SELECTOR)) {
            addInput(context)
        } else {
            context.querySelectorAll(EMAIL_SELECTOR).forEach(addInput)
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

module.exports = scanForInputs
