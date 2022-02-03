function makeField (outputType) {
    let field = document.createElement('input')
    field.type = outputType
    field.name = outputType
    field.autocomplete = outputType
    return field
}

function setupFakeForm (inputType) {
    let main = document.querySelector('main')
    // TODO hey we're a PoC let's just fake the code to get it working
    let fakeForm = document.createElement('form')
    let fakeInput = makeField('email')
    // TODO add support for identities
    if (inputType === 'identities') {
        inputType = 'emailNew'
    }
    if (inputType !== 'emailNew') {
        fakeInput = makeField('username')
        fakeForm.appendChild(fakeInput)

        const fakePassword = makeField('password')
        fakePassword.autocomplete = 'current-password'
        fakeForm.appendChild(fakePassword)

        let fakeButton = document.createElement('button')
        fakeButton.textContent = 'Log in'
        fakeForm.appendChild(fakeButton)
    } else {
        fakeForm.appendChild(fakeInput)
    }

    fakeForm.style.visibility = 'collapse'
    main.appendChild(fakeForm)
    return {fakeInput, fakeForm}
}

async function init () {
    const DeviceInterface = require('./DeviceInterface')
    const {inputType, inputSubtype} = await DeviceInterface.getInputTypes()
    const {fakeInput, fakeForm} = setupFakeForm(inputType)
    function triggerFormSetup () {
        const {getOrCreateParentFormInstance} = require('./scanForInputs')
        const parentFormInstance = getOrCreateParentFormInstance(fakeInput, fakeForm, DeviceInterface)
        DeviceInterface.attachTooltip(parentFormInstance, fakeInput)
    }
    window.addEventListener('InitComplete', () => {
        triggerFormSetup()
    })
    const inject = require('./inject')
    inject()
}
window.addEventListener('load', init)
