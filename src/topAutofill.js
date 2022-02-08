async function init () {
    const DeviceInterface = require('./DeviceInterface')
    const {inputType, inputSubtype} = await DeviceInterface.getInputTypes()
    function triggerFormSetup () {
        // TODO pass this
        const getPosition = () => {
            return {
                x: 0,
                y: 0,
                height: 50,
                width: 50
            }
        }
        const tooltip = DeviceInterface.createTooltip(inputType, inputSubtype, getPosition)
        DeviceInterface.setActiveTooltip(tooltip)
    }
    window.addEventListener('InitComplete', () => {
        triggerFormSetup()
    })
    const inject = require('./inject')
    inject()
}
window.addEventListener('load', init)
