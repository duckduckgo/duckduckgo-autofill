import fs from 'fs'
import path from 'path'
import { getUnifiedExpiryDate } from './formatters.js'
import { createScanner } from '../Scanner.js'
import {getInputSubtype, createMatching, getInputVariant} from './matching.js'
import { Form } from './Form.js'
import InterfacePrototype from '../DeviceInterface/InterfacePrototype.js'

import {createAvailableInputTypes} from '../../integration-test/helpers/utils.js'

/**
 * @type {object[]}
 */
const testCases = JSON.parse(fs.readFileSync(path.join(__dirname, 'test-cases/index.json')).toString('utf-8'))
testCases.forEach(testCase => {
    testCase.testContent = fs.readFileSync(path.resolve(__dirname, './test-cases', testCase.html), 'utf-8')
})

/**
 * @param {HTMLInputElement} el
 * @param {HTMLFormElement} form
 * @returns {string|undefined}
 */
const getCCFieldSubtype = (el, form) => {
    const matching = createMatching()

    return matching
        .forInput(el, form)
        .subtypeFromMatchers('cc', el)
}

const renderInputWithLabel = () => {
    const input = document.createElement('input')
    input.id = 'inputId'
    const label = document.createElement('label')
    label.setAttribute('for', 'inputId')
    const formElement = document.createElement('form')
    formElement.append(input, label)
    document.body.append(formElement)
    const form = new Form(formElement, input, InterfacePrototype.default())
    return { input, label, formElement: formElement, form }
}

const testRegexForCCLabels = (cases) => {
    Object.entries(cases).forEach(([expectedType, arr]) => {
        arr.forEach(({text, shouldMatch = true}) => {
            it(`"${text}" should ${shouldMatch ? '' : 'not '}match regex for ${expectedType}`, () => {
                const {input, label, formElement} = renderInputWithLabel()
                label.textContent = text

                const subtype = getCCFieldSubtype(input, formElement)
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
            { text: 'mm - yy', expectedResult: '08 - 25' },
            { text: 'mm yy', expectedResult: '08 25' },
            { text: 'ie: 08.22', expectedResult: '08.25' },
            { text: 'Expiry date: MM / YY', expectedResult: '08 / 25' }
        ])('when checking for "$text"', ({ text, expectedResult }) => {
            let elements

            beforeEach(() => {
                elements = renderInputWithLabel()
                elements.input.autocomplete = 'cc-exp'
            })

            it('matches for placeholder text', () => {
                elements.input.placeholder = text

                expect(getCCFieldSubtype(elements.input, elements.form)).toBe('expiration')
                expect(getUnifiedExpiryDate(elements.input, '8', '2025', elements.form)).toBe(expectedResult)
            })

            it('matches for label text', () => {
                elements.label.textContent = text

                expect(getCCFieldSubtype(elements.input, elements.form)).toBe('expiration')
                expect(getUnifiedExpiryDate(elements.input, '8', '2025', elements.form)).toBe(expectedResult)
            })
        })
    })
})

const getMismatchedValue = (score) => {
    if (score.inferredType !== score.manualType) {
        return score.manualType
    }

    if (score.manualVariant && score.manualVariant !== score.inferredVariant) {
        return `${score.manualType}.${score.manualVariant}`
    }

    return ''
}

const isThereAMismatch = (score) => {
    return Boolean(getMismatchedValue(score))
}

let testResults = []
describe.each(testCases)('Test $html fields', (testCase) => {
    const {
        html,
        generated,
        expectedFailures = [],
        expectedSubmitFalsePositives = 0,
        expectedSubmitFalseNegatives = 0,
        title = '__test__',
        hasExtraWrappers = true,
        testContent
    } = testCase

    const testTextString = expectedFailures.length > 0
        ? `should contain ${expectedFailures.length} known failure(s): ${JSON.stringify(expectedFailures)}`
        : `should NOT contain failures`

    it.concurrent(testTextString, async () => {
        document.body.innerHTML = ''

        let baseWrapper = document.body

        if (hasExtraWrappers) {
            baseWrapper = document.createElement('div')
            document.body.appendChild(baseWrapper)
        }

        baseWrapper.innerHTML = testContent
        document.title = title

        const matching = createMatching()
        const buttons = document.querySelectorAll(matching.cssSelector('submitButtonSelector'))
        buttons.forEach((button) => {
            // We're doing this so that isPotentiallyViewable(button) === true. See jest.setup.js for more info
            // @ts-ignore
            button._jsdomMockClientWidth = 150
            // @ts-ignore
            button._jsdomMockClientHeight = 50
            // @ts-ignore
            button._jsdomMockOffsetWidth = 150
            // @ts-ignore
            button._jsdomMockOffsetHeight = 50
        })

        const deviceInterface = InterfacePrototype.default()
        const availableInputTypes = createAvailableInputTypes({credentials: {username: true, password: true}})
        deviceInterface.settings.setAvailableInputTypes(availableInputTypes)
        const scanner = createScanner(deviceInterface)
        scanner.findEligibleInputs(document)

        const detectedSubmitButtons = Array.from(scanner.forms.values()).map(form => form.submitButtons).flat()
        /**
         * @type {HTMLElement[]}
         */
        const identifiedSubmitButtons = Array.from(document.querySelectorAll('[data-manual-submit]'))

        let submitFalsePositives = detectedSubmitButtons.filter(button => !identifiedSubmitButtons.includes(button)).length
        let submitFalseNegatives = identifiedSubmitButtons.filter(button => !detectedSubmitButtons.includes(button)).length

        if (!generated) {
            expect(submitFalsePositives).toEqual(expectedSubmitFalsePositives)
            expect(submitFalseNegatives).toEqual(expectedSubmitFalseNegatives)
        }

        /** @type {Array<HTMLInputElement>} */
        const manuallyScoredFields = Array.from(document.querySelectorAll('[data-manual-scoring]'))
        /** @type {Array<HTMLInputElement>} */
        const automaticallyScoredFields = Array.from(document.querySelectorAll('[data-ddg-inputtype]'))

        const getDetailsFromFailure = (field) => {
            const {manualScoring, ddgInputtype, ...rest} = field.dataset
            // @ts-ignore
            field.style = ''
            const [manualType, manualVariant] = field.getAttribute('data-manual-scoring')?.split('.') || []

            return {
                attrs: {
                    name: field.name,
                    id: field.id,
                    dataset: rest
                },
                html: field.outerHTML,
                inferredType: getInputSubtype(field),
                inferredVariant: getInputVariant(field),
                manualType,
                manualVariant
            }
        }

        const scores = manuallyScoredFields.map(getDetailsFromFailure)

        const falseScores = automaticallyScoredFields
            .filter(field =>
                !manuallyScoredFields.includes(field) &&
                    field.getAttribute('data-ddg-inputtype') !== 'unknown' &&
                    field.tabIndex !== -1
            )
            .map(getDetailsFromFailure)

        scores.concat(falseScores)

        const submitButtonScores = {
            detected: detectedSubmitButtons.length,
            identified: identifiedSubmitButtons.length,
            falsePositives: submitFalsePositives,
            falseNegatives: submitFalseNegatives
        }

        testResults.push({testCase, scores, submitButtonScores})

        let bad = scores.filter(score => isThereAMismatch(score))
        let failed = bad.map(score => getMismatchedValue(score))

        if (bad.length !== expectedFailures.length) {
            for (let score of bad) {
                console.log(
                    'file:         ' + html,
                    '\nmanualType:   ' + JSON.stringify(score.manualType),
                    '\ninferredType: ' + JSON.stringify(score.inferredType),
                    '\nmanualVariant:   ' + JSON.stringify(score.manualVariant),
                    '\ninferredVariant: ' + JSON.stringify(score.inferredVariant),
                    '\nid:           ' + JSON.stringify(score.attrs.id),
                    '\nname:         ' + JSON.stringify(score.attrs.name),
                    '\nHTML:         ' + score.html
                )
            }
        }

        if (generated) {
            // Ignore order
            expect(failed.sort()).toStrictEqual(expectedFailures.sort())
        } else {
            expect(failed).toStrictEqual(expectedFailures)
        }
    })
})

afterAll(() => {
    /* site statistics
    a site is considered "failing" if there is at least one failing field in at least one of its tests
    (including expected failures)
     */

    let siteHasFailures = {}

    testResults.forEach((result) => {
        const siteName = result.testCase.html.split('_')[0]
        const testHasFailures = result.scores.some(score => isThereAMismatch(score))
        if (siteHasFailures[siteName] !== true) {
            siteHasFailures[siteName] = testHasFailures
        }
    })

    const allSites = Object.values(siteHasFailures).length
    const failingSites = Object.values(siteHasFailures).filter(t => t === true).length
    const proportionFailingSites = failingSites / allSites

    /* field statistics */

    let totalFields = 0
    let totalFailedFields = 0
    let totalFalsePositives = 0

    let totalFieldsByType = {}
    let totalFailuresByFieldType = {}

    testResults.forEach((result) => {
        result.scores.forEach((field) => {
            const {manualType, inferredType} = field
            if (!totalFieldsByType[manualType]) {
                totalFieldsByType[manualType] = 0
                totalFailuresByFieldType[manualType] = 0
            }

            if (manualType !== inferredType) {
                totalFailedFields++
                totalFailuresByFieldType[manualType]++
            }
            if ((!manualType || manualType === 'unknown') && inferredType !== manualType) {
                totalFalsePositives++
            }
            totalFields++
            totalFieldsByType[manualType]++
        })
    })

    console.log(
        'Input classification statistics:',
        '\n% of failing sites:\t\t' + (proportionFailingSites * 100).toFixed(1) + '%',
        '\n\t\t (' + failingSites + ' of ' + allSites + ', for a total of ' + testCases.length + ' forms)',
        '\n% of failing fields:\t' + ((totalFailedFields / totalFields) * 100).toFixed(1) + '%',
        '\n\t\t (' + totalFailedFields + ' of ' + totalFields + ')',
        '\n% of false positive fields:\t' + ((totalFalsePositives / totalFields) * 100).toFixed(1) + '%',
        '\n\t\t (' + totalFalsePositives + ' of ' + totalFields + ')',
        '\n% fields failing by type:',
        '\n' + Object.keys(totalFieldsByType).sort().map((type) => {
            return '\n' + (type + ':').padEnd(24) +
                    (Math.round((totalFailuresByFieldType[type] / totalFieldsByType[type]) * 100) + '%').padEnd(4) +
                    ' | ' + String(totalFailuresByFieldType[type]).padStart(4) +
                    ' out of ' + String(totalFieldsByType[type]).padStart(4) + ' fields | ' +
                    ' (' + Math.round((totalFailuresByFieldType[type] / totalFailedFields) * 100) + '% of all failures)'
        }).join('') + '\n'
    )

    let totalDetectedButtons = testResults.map(test => test.submitButtonScores.detected).reduce((a, b) => a + b, 0)
    let totalIdentifiedButtons = testResults.map(test => test.submitButtonScores.identified).reduce((a, b) => a + b, 0)
    let totalFalsePositiveButtons = testResults.map(test => test.submitButtonScores.falsePositives).reduce((a, b) => a + b, 0)
    let totalFalseNegativeButtons = testResults.map(test => test.submitButtonScores.falseNegatives).reduce((a, b) => a + b, 0)

    console.log(
        'Submit button statistics:\n',
        totalDetectedButtons + ' detected (' + Math.round((totalFalsePositiveButtons / totalDetectedButtons) * 100) + '% false positive)\n',
        totalIdentifiedButtons + ' manually identified (' + Math.round((totalFalseNegativeButtons / totalIdentifiedButtons) * 100) + '% false negative)\n'
    )
})
