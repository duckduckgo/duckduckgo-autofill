const { constants, _selectPasswordRules, HostnameInputError, generate } = require('../')
const vendorRules = require('../rules.json')
const fc = require('fast-check')

function testUniqueTimes (domain, passwordRules, num = 10) {
    const pws = []
    for (let i = 0; i < num; i++) {
        // these 3 domains have rulesets so weak that collisions are likely
        if (domain === 'vivo.com.br') continue
        if (domain === 'allianz.com.br') continue
        if (domain === 'packageconciergeadmin.com') continue
        const pw = generate({input: passwordRules})
        pws.push(pw)
    }
    const asSet = new Set(pws)
    expect(asSet.size).toBe(pws.length)
    return pws
}

describe('password generation', () => {
    describe('public api', () => {
        it('creates from default rules', () => {
            const defaultPw = generate({input: 'allowed: lower, upper, digit, [-(~!@#$%^&*_+=`|(){}[:;\"\'<>,.?]];'})
            console.log(defaultPw)
            expect(defaultPw.length).toBeGreaterThanOrEqual(constants.MIN_LENGTH)
            expect(defaultPw.length).toBeLessThanOrEqual(constants.MAX_LENGTH)
        })
        it.each([
            { input: 'minlength: 30; maxlength: 40; required: upper; required: lower; required: [$]', test: (pws) => pws.every(pw => pw.includes('$')) },
            { input: 'minlength: 20; maxlength: 30; required: upper; required: lower;' },
            { input: 'required: upper;' }
        ])('generates from known inputs', ({input, test}) => {
            const pws = testUniqueTimes('none', input)
            if (test) {
                expect(test(pws)).toBeTruthy()
            }
        })
        it('uses DDG default password rules when inputs are not in the required format', () => {
            fc.assert(
                fc.property(fc.string(), data => {
                    const pw = generate({input: data})
                    return typeof pw === 'string' &&
                        pw.length >= constants.MIN_LENGTH &&
                        pw.length <= constants.MAX_LENGTH
                })
            )
        })
    })
    describe('using vendor list', () => {
        it('_selectPasswordRules throws when a full URL is given', () => {
            expect.assertions(1)
            try {
                _selectPasswordRules('http://example.com')
            } catch (e) {
                expect(e).toBeInstanceOf(HostnameInputError)
            }
        })
        it('_selectPasswordRules throws when a host is given (with port)', () => {
            expect.assertions(1)
            try {
                _selectPasswordRules('localhost:8080')
            } catch (e) {
                expect(e).toBeInstanceOf(HostnameInputError)
            }
        })
        it('_selectPasswordRules throws when a URL cannot be constructed from input', () => {
            expect.assertions(1)
            try {
                _selectPasswordRules('')
            } catch (e) {
                expect(e).toBeInstanceOf(HostnameInputError)
            }
        })
        it('_selectPasswordRules returns undefined for a valid host with no match', () => {
            expect(_selectPasswordRules('example.com')).toBeUndefined()
        })
        it('_selectPasswordRules returns rules when its a direct match', () => {
            const actual = _selectPasswordRules('example.com', {
                'example.com': {
                    'password-rules': 'minlength: 20'
                }
            })

            expect(actual).toBe('minlength: 20')
        })
        it.each([
            'app.example.com',
            'app.app.app.app.example.com',
            'www.example.com'
        ])('_selectPasswordRules returns rules when its a subdomain match', (input) => {
            const actual = _selectPasswordRules(input, {
                'example.com': {
                    'password-rules': 'minlength: 20'
                }
            })
            expect(actual).toBe('minlength: 20')
        })
    })
    if (process.env.PASSWORD_STRESS_TEST) {
        describe('with valid inputs...', () => {
            let testCases = Object
                .entries(vendorRules)
                .map(([domain, value]) => ({domain, value}))

            it.each(testCases)('100 unique passwords for `$domain` ..', ({domain, value}) => {
                testUniqueTimes(domain, value['password-rules'], 100)
            })
            it.each(testCases.slice(0, 5))('10_000 unique passwords for `$domain` ..', ({domain, value}) => {
                testUniqueTimes(domain, value['password-rules'], 10_000)
            })
        })
    }
})
