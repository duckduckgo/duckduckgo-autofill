(() => {
    try {
        const listenForGlobalFormSubmission = require('./Form/listenForFormSubmission')
        const {forms} = require('./scanForInputs')
        const {isApp} = require('./autofill-utils')

        const inject = () => {
            // Polyfills/shims
            require('./requestIdleCallback')
            const DeviceInterface = require('./DeviceInterface')

            // Global listener for event delegation
            window.addEventListener('click', (e) => {
                if (!e.isTrusted) return

                if (e.target.nodeName === 'DDG-AUTOFILL') {
                    e.preventDefault()
                    e.stopImmediatePropagation()

                    const activeForm = [...forms.values()].find((form) => form.tooltip)
                    if (activeForm) {
                        activeForm.tooltip.dispatchClick()
                    }
                }

                if (!isApp) return

                // Check for clicks on submit buttons
                const matchingForm = [...forms.values()].find(
                    (form) => [...form.submitButtons].includes(e.target)
                )
                matchingForm?.submitHandler()
            }, true)

            if (isApp) {
                window.addEventListener('submit', (e) =>
                    forms.get(e.target)?.submitHandler(),
                true)
            }

            DeviceInterface.init()
        }

        // chrome is only present in desktop browsers
        if (typeof chrome === 'undefined') {
            listenForGlobalFormSubmission()
            inject()
        } else {
            // Check if the site is marked to skip autofill
            chrome.runtime.sendMessage({registeredTempAutofillContentScript: true}, (response) => {
                if (response?.site?.brokenFeatures?.includes('autofill')) return

                inject()
            })
        }
    } catch (e) {
        // Noop, we errored
    }
})()
