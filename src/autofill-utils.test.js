const {setValue} = require('./autofill-utils')

const renderInputWithEvents = () => {
    const input = document.createElement('input')
    input.id = 'inputId'

    const form = document.createElement('form')
    form.append(input)
    document.body.append(form)

    const events = []
    input.addEventListener('keyup', () => events.push('keyup'))
    input.addEventListener('keydown', () => events.push('keydown'))
    input.addEventListener('input', () => events.push('input'))
    input.addEventListener('change', () => events.push('change'))

    return {input, events}
}

afterEach(() => {
    document.body.innerHTML = null
})

describe('value setting', function () {
    it('should set value & dispatch events in the correct order', () => {
        const {input, events} = renderInputWithEvents()
        setValue(input, '123456')
        expect(input.value).toBe('123456')

        // the order of events here is *extremely* important to ensure interoperability with
        // page scripts that register their own keyup/keydown event listeners.
        expect(events).toStrictEqual([
            'keydown',
            'input',
            'keyup',
            'change',
            'keydown',
            'input',
            'keyup',
            'change'
        ])
    })
})
