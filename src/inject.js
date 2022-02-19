// Polyfills/shims
require('./requestIdleCallback')

const {forms} = require('./scanForInputs')
const {isApp, isTopFrame} = require('./autofill-utils')
const deviceInterface = require('./DeviceInterface')

const inject = () => {
    // Global listener for event delegation
    window.addEventListener('pointerdown', (e) => {
        if (!e.isTrusted) return

        // @ts-ignore
        if (e.target.nodeName === 'DDG-AUTOFILL') {
            e.preventDefault()
            e.stopImmediatePropagation()

            const activeTooltip = deviceInterface.getActiveTooltip()
            activeTooltip?.dispatchClick()
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
        if (isTopFrame) {
            setupTopFrame()
        }
    }

    deviceInterface.init()
}

async function setupTopFrame () {
    const inputType = await deviceInterface.getCurrentInputType()
    function triggerFormSetup () {
        // Provide dummy values, they're not used
        const getPosition = () => {
            return {
                x: 0,
                y: 0,
                height: 50,
                width: 50
            }
        }
        const tooltip = deviceInterface.createTooltip(inputType, getPosition)
        deviceInterface.setActiveTooltip(tooltip)
    }
    window.addEventListener('InitComplete', () => {
        triggerFormSetup()
    })
}

module.exports = inject
