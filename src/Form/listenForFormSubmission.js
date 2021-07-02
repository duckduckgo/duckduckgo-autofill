const {forms} = require('../scanForInputs')
const isApp = require('../autofill-utils')

const submitHandler = () => {
    if (!forms.size) return

    const filledForm = [...forms.values()].find(form => form.hasValues())
    filledForm?.submitHandler()
}

let listening = false

const listenForGlobalFormSubmission = () => {
    if (listening || !isApp) return

    window.addEventListener('submit', submitHandler, true)

    // This is rather heavy-handed and likely to capture false-positives
    // TODO: use a better solution for capturing events rather than this unload event
    window.addEventListener('unload', submitHandler)

    try {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries().filter((entry) =>
                entry.initiatorType === 'xmlhttprequest' &&
                entry.name.split('?')[0].match(/login|sign-in|signin|session/)
            )

            if (!entries.length) return

            submitHandler()
        })
        observer.observe({entryTypes: ['resource']})
    } catch (error) {
        // Unable to detect form submissions using AJAX calls
    }
    listening = true
}

module.exports = listenForGlobalFormSubmission
