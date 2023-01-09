import { setValue, isAutofillEnabledFromProcessedConfig } from './autofill-utils.js'

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
    document.body.innerHTML = ''
})

describe('value setting on inputs', function () {
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
            'input',
            'keyup',
            'change'
        ])
    })
})

const renderInputWithSelect = () => {
    document.body.innerHTML = `
    <select name="country">
        <option value="GB">Great Britain</option>
        <option value="US">USA</option>
        <option value="02">February</option>
        <option value="march">03</option>
    </select>
    `

    const events = []
    const select = document.querySelector('select')
    if (!select) throw new Error('unreachable')

    select.addEventListener('mousedown', () => events.push('mousedown'))
    select.addEventListener('mouseup', () => events.push('mouseup'))
    select.addEventListener('click', () => events.push('click'))
    select.addEventListener('change', () => events.push('change'))

    // Needed to bypass the fact that jsdom has innerText = undefined
    for (const option of select.options) {
        option.innerText = option.textContent || ''
    }

    return {select, events}
}

describe('value setting on selects', function () {
    const eventsToFireOnSelect = [
        'mousedown',
        'mouseup',
        'click',
        'change',
        'mousedown',
        'mouseup',
        'click',
        'change'
    ]

    it('should set value & dispatch events when value has changed', () => {
        const {select, events} = renderInputWithSelect()
        setValue(select, 'US')
        expect(events).toStrictEqual(eventsToFireOnSelect)
    })
    it('should set value when the value is expressed with a leading 0 like 02 for February', () => {
        const {select, events} = renderInputWithSelect()
        setValue(select, '2')
        expect(select.value).toBe('02')
        expect(events).toStrictEqual(eventsToFireOnSelect)

        setValue(select, '3')
        expect(select.value).toBe('march')
        expect(events).toStrictEqual([...eventsToFireOnSelect, ...eventsToFireOnSelect])
    })
    it('should not fire any events when the value has not changed', () => {
        const {select, events} = renderInputWithSelect()
        setValue(select, 'GB')
        expect(events).toStrictEqual([])
    })
})

describe('config checking', () => {
    it('autofill in enabledFeatures should enable', () => {
        expect(isAutofillEnabledFromProcessedConfig({
            site: {
                isBroken: false,
                enabledFeatures: ['autofill']
            }
        })).toBe(true)

        expect(isAutofillEnabledFromProcessedConfig({
            site: {
                isBroken: false,
                enabledFeatures: []
            }
        })).toBe(false)
    })

    it('autofill in isBroken should disable', () => {
        expect(isAutofillEnabledFromProcessedConfig({
            site: {
                isBroken: false,
                enabledFeatures: ['autofill']
            }
        })).toBe(true)

        expect(isAutofillEnabledFromProcessedConfig({
            site: {
                isBroken: true,
                enabledFeatures: ['autofill']
            }
        })).toBe(false)
    })
})
