const fs = require('fs')
const path = require('path')

const {getSubtypeFromMatchers, getInputSubtype} = require('./input-classifiers')
const {getUnifiedExpiryDate} = require('./formatters')
const {CC_MATCHERS_LIST} = require('./selectors')

const getCCFieldSubtype = (el, form) => getSubtypeFromMatchers(el, form, CC_MATCHERS_LIST)

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
    document.body.innerHTML = ''
})

describe('Input Classifiers', () => {
    const ccLabelTestCases = {
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
    testRegexForCCLabels(ccLabelTestCases)

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
        ])('when checking for "$text"', ({ text, expectedResult }) => {
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

describe('Real-world form tests', () => {
    const testCases = require('./test-cases/index')

    test.each(testCases)('Test %s fields', (caseName, done) => {
        const testContent = fs.readFileSync(path.resolve(__dirname, './test-cases', caseName), 'utf-8')

        document.body.innerHTML = testContent
        // When we require autofill, the script scores the fields in the DOM
        require('../autofill.js')

        // A human classified these fields, so we want to make sure the script matches them
        const manuallyScoredFields = document.querySelectorAll('[data-manual-scoring]')

        // Autofill uses requestIdleCallback to debounce DOM checks, we call it twice here to run tests after it
        requestIdleCallback(() => {
            requestIdleCallback(() => {
                try {
                    manuallyScoredFields.forEach((field) => {
                        const inferredType = getInputSubtype(field)
                        const manualScore = field.getAttribute('data-manual-scoring')
                        // @ts-ignore
                        expect(inferredType).toMatch(manualScore)
                    })

                    // Check that the script didn't identify fields that shouldn't have by matching the count for unknown
                    const identifiedFields = document.querySelectorAll('[data-ddg-inputtype]:not([data-ddg-inputtype=unknown])')
                    const manuallyIdentifiedFields = document.querySelectorAll('[data-manual-scoring]:not([data-manual-scoring=unknown])')
                    expect(identifiedFields.length).toEqual(manuallyIdentifiedFields.length)

                    // @ts-ignore
                    done()
                } catch (e) {
                    // @ts-ignore
                    done(e)
                }
            })
        })
    })
})
