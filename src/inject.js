// Polyfills/shims
require('./requestIdleCallback')

const {forms} = require('./scanForInputs')
const {isApp} = require('./autofill-utils')
const DeviceInterface = require('./DeviceInterface')

const inject = () => {
    // Global listener for event delegation
    window.addEventListener('pointerdown', (e) => {
        if (!e.isTrusted) return

        if (e.target.nodeName === 'DDG-AUTOFILL') {
            e.preventDefault()
            e.stopImmediatePropagation()

            const activeForm = DeviceInterface.getActiveForm()
            if (activeForm) {
                activeForm.tooltip.dispatchClick()
            }
        }

        if (!isApp) return

        // Check for clicks on submit buttons
        const matchingForm = [...forms.values()].find(
            (form) => {
                const btns = [...form.submitButtons]
                if (btns.includes(e.target)) return true

                if (btns.find((btn) => btn.contains(e.target))) return true
            }
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

module.exports = inject
