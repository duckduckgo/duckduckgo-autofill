const {getCCFieldSubtype, getUnifiedExpiryDate} = require('./input-classifiers')

const createElements = () => {
    const input = document.createElement('input')
    input.id = 'inputId'
    const label = document.createElement('label')
    label.setAttribute('for', 'inputId')
    document.body.append(input, label)
    return {input, label}
}

const testRegexForCCLabels = (cases) => {
    Object.entries(cases).forEach(([expectedType, arr]) => {
        arr.forEach(({text, shouldMatch = true}) => {
            it(`"${text}" should ${shouldMatch ? '' : 'not '}match regex for ${expectedType}`, () => {
                const {input, label} = createElements()
                label.textContent = text

                const subtype = getCCFieldSubtype(input)
                if (shouldMatch) {
                    expect(subtype).toBe(expectedType)
                } else {
                    expect(subtype).not.toBe(expectedType)
                }
            })
        })
    })
}

const testUnifiedExpirationDate = (cases) => {
    cases.forEach(({text = '', expectedResult}) => {
        it(`test date format for ${text}`, () => {
            const {label, input} = createElements()
            input.autocomplete = 'cc-exp'
            if (Math.random() < 0.5) {
                input.placeholder = text
            } else {
                label.textContent = text
            }

            expect(getCCFieldSubtype(input)).toBe('expiration')

            expect(getUnifiedExpiryDate(input, 12, 2025)).toBe(expectedResult)
        })
    })
}

afterEach(() => {
    document.body.innerHTML = null
})

describe('test', () => {
    it('should match the selector for cardNumber', () => {
        const {input} = createElements()
        input.autocomplete = 'cc-number'
        expect(getCCFieldSubtype(input)).toBe('cardNumber')
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
            {text: 'card expiry mo'},
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

    const unifiedExpirationDateCases = [
        {text: 'mm-yyyy', expectedResult: '12-2025'},
        {text: 'mm/yyyy', expectedResult: '12/2025'},
        {text: '__-____', expectedResult: '12-2025'},
        {text: 'mm-yy', expectedResult: '12-25'},
        {text: 'i.e. 10-2022', expectedResult: '12-2025'},
        {text: 'MM-AAAA', expectedResult: '12-2025'},
        {text: 'mm_jj', expectedResult: '12_25'},
        {text: 'mm.yy', expectedResult: '12.25'},
        {text: 'mm - yy', expectedResult: '12-25'},
        {text: 'mm yy', expectedResult: '12 25'},
        {text: 'ie: 08.22', expectedResult: '12.25'}
    ]
    testUnifiedExpirationDate(unifiedExpirationDateCases)
})
