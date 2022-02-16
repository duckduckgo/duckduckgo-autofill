const {forms} = require('../scanForInputs')
const isApp = require('../autofill-utils')

const listenForGlobalFormSubmission = () => {
    if (!isApp) return

    try {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries().filter((entry) =>
                // @ts-ignore why does TS not know about `entry.initiatorType`?
                ['fetch', 'xmlhttprequest'].includes(entry.initiatorType) &&
                entry.name.match(/login|sign-in|signin|session/)
            )

            if (!entries.length) return

            const filledForm = [...forms.values()].find(form => form.hasValues())
            filledForm?.submitHandler()
        })
        observer.observe({entryTypes: ['resource']})
    } catch (error) {
        // Unable to detect form submissions using AJAX calls
    }
}

module.exports = listenForGlobalFormSubmission
