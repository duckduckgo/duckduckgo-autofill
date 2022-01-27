// Polyfills/shims
require('./requestIdleCallback')

const {forms} = require('./scanForInputs')
const {isApp} = require('./autofill-utils')
const deviceInterface = require('./DeviceInterface')

const inject = () => {
    // Global listener for event delegation
    window.addEventListener('pointerdown', (e) => {
        if (!e.isTrusted) return

        // @ts-ignore
        if (e.target.nodeName === 'DDG-AUTOFILL') {
            e.preventDefault()
            e.stopImmediatePropagation()

            // @ts-ignore
            const activeForm = deviceInterface.getActiveForm()
            if (activeForm) {
                activeForm.tooltip.dispatchClick()
            }
        }

        if (!isApp) return

        // Check for clicks on submit buttons
        const matchingForm = [...forms.values()].find(
            (form) => {
                const btns = [...form.submitButtons]
                // @ts-ignore
                if (btns.includes(e.target)) return true

                // @ts-ignore
                if (btns.find((btn) => btn.contains(e.target))) return true
            }
        )
        matchingForm?.submitHandler()
    }, true)

    if (isApp) {
        window.addEventListener('submit', (e) =>
            // @ts-ignore
            forms.get(e.target)?.submitHandler(),
        true)
    }

    deviceInterface.init()
}

module.exports = inject
