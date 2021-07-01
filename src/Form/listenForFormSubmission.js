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
    if (listening) return

    window.addEventListener('submit', submitHandler)

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
