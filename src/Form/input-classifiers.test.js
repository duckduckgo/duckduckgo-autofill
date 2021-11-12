const {getCCFieldSubtype, getUnifiedExpiryDate} = require('./input-classifiers')

const renderInputWithLabel = () => {
    const input = document.createElement('input')
    input.id = 'inputId'
    const label = document.createElement('label')
    label.setAttribute('for', 'inputId')
    const form = document.createElement('form')
    form.append(input, label)
    document.body.append(form)
    return {input, label, form}
}

const testRegexForCCLabels = (cases) => {
    Object.entries(cases).forEach(([expectedType, arr]) => {
        arr.forEach(({text, shouldMatch = true}) => {
            it(`"${text}" should ${shouldMatch ? '' : 'not '}match regex for ${expectedType}`, () => {
                const {input, label, form} = renderInputWithLabel()
                label.textContent = text

                const subtype = getCCFieldSubtype(input, form)
                if (shouldMatch) {
                    expect(subtype).toBe(expectedType)
                } else {
                    expect(subtype).not.toBe(expectedType)
                }
            })
        })
    })
}

afterEach(() => {
    document.body.innerHTML = null
})

describe('Input Classifiers', () => {
    it('should match the selector for cardNumber', () => {
        const {input, form} = renderInputWithLabel()
        input.autocomplete = 'cc-number'
        expect(getCCFieldSubtype(input, form)).toBe('cardNumber')
    })

    it('should match text in a nearby span', () => {
        const markup = `
<form>
    <div>
        <span>Card Number</span>
        <input />
    </div>
    <div>
        <span>MM-YYYY</span>
        <input />
    </div>
    <div>
        <span>Security code</span>
        <input />
    </div>
    <button>Buy now</button>
</form>`
        document.body.innerHTML = markup
        const form = document.querySelector('form')
        const inputs = document.querySelectorAll('input')

        expect(getCCFieldSubtype(inputs[0], form)).toBe('cardNumber')
        expect(getCCFieldSubtype(inputs[1], form)).toBe('expiration')
        expect(getUnifiedExpiryDate(inputs[1], 8, 2025, form)).toBe('08-2025')
        expect(getCCFieldSubtype(inputs[2], form)).toBe('cardSecurityCode')
    })

    const ccLabeltestCases = {
        cardName: [
            {text: 'credit card name'},
            {text: 'name on card'},
            {text: 'card holder'},
            {text: 'card owner'},
            {text: 'card number', shouldMatch: false}
        ],
        cardNumber: [
            {text: 'Credit Card Number'},
            {text: 'number on card'},
            {text: 'card owner', shouldMatch: false}

        ],
        expirationMonth: [
            {text: 'expiry month'},
            {text: 'expiration month'},
            {text: 'exp month'},
            {text: 'Credit Card Number', shouldMatch: false},
            {text: 'expiry year', shouldMatch: false},
            {text: 'expiration year', shouldMatch: false},
            {text: 'exp year', shouldMatch: false},
            {text: 'card expiry yy', shouldMatch: false}
        ],
        expirationYear: [
            {text: 'expiry year'},
            {text: 'expiration year'},
            {text: 'exp year'},
            {text: 'card expiry yy'},
            {text: 'Credit Card Number', shouldMatch: false},
            {text: 'expiry month', shouldMatch: false},
            {text: 'expiration month', shouldMatch: false},
            {text: 'exp month', shouldMatch: false},
            {text: 'card expiry mo', shouldMatch: false}
        ]
    }
    testRegexForCCLabels(ccLabeltestCases)

    describe('Unified Expiration Date', () => {
        describe.each([
            { text: 'mm-yyyy', expectedResult: '08-2025' },
            { text: 'mm/yyyy', expectedResult: '08/2025' },
            { text: '__-____', expectedResult: '08-2025' },
            { text: 'mm-yy', expectedResult: '08-25' },
            { text: 'i.e. 10-2022', expectedResult: '08-2025' },
            { text: 'MM-AAAA', expectedResult: '08-2025' },
            { text: 'mm_jj', expectedResult: '08_25' },
            { text: 'mm.yy', expectedResult: '08.25' },
            { text: 'mm - yy', expectedResult: '08-25' },
            { text: 'mm yy', expectedResult: '08 25' },
            { text: 'ie: 08.22', expectedResult: '08.25' }
        ])('when checking for $text', ({ text, expectedResult }) => {
            let elements

            beforeEach(() => {
                elements = renderInputWithLabel()
                elements.input.autocomplete = 'cc-exp'
            })

            it('matches for placeholder text', () => {
                elements.input.placeholder = text

                expect(getCCFieldSubtype(elements.input, elements.form)).toBe('expiration')
                expect(getUnifiedExpiryDate(elements.input, 8, 2025, elements.form)).toBe(expectedResult)
            })

            it('matches for label text', () => {
                elements.label.textContent = text

                expect(getCCFieldSubtype(elements.input, elements.form)).toBe('expiration')
                expect(getUnifiedExpiryDate(elements.input, 8, 2025, elements.form)).toBe(expectedResult)
            })
        })
    })
})
