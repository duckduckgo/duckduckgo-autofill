// temporary to avoid errors when the swift layer tries to call this
const isApp = require('../autofill-utils')
if (isApp) {
    window.__ddg__ = {scanForPasswordField: () => {}}
}

const submitHandler = () => {
    const {forms} = require('../scanForInputs')
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
        // no-op
    }
    listening = true
}

module.exports = listenForGlobalFormSubmission
