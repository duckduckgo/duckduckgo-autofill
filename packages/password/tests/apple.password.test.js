const { Password } = require('../lib/apple.password')
const fc = require('fast-check')
const {ParserError} = require('../lib/rules-parser')

describe('password implementation, internal API', () => {
    it('should expose generateOrThrow', () => {
        const pw = Password.generateOrThrow('maxlength: 10')
        expect(pw.length).toBe(10)
    })
    it('should expose generateOrThrow & throw', () => {
        expect.assertions(1)
        try {
            Password.generateOrThrow('anything incorrect')
        } catch (e) {
            expect(e).toBeInstanceOf(ParserError)
        }
    })
    it('should expose generateDefault', () => {
        const defaultPw = Password.generateDefault()
        expect(defaultPw.length).toBe(Password.defaults.defaultPasswordLength)
    })
    it('should produce passwords with an entropy score of over 80', () => {
        const password = new Password()
        const {entropy} = password.parse(Password.defaults.defaultPasswordRules)
        expect(entropy).toBeGreaterThanOrEqual(80)
    })
    it('should produce positive integers from ranges _randomNumberWithUniformDistribution', () => {
        fc.assert(
            fc.property(fc.integer({min: 1}), data => {
                const password = new Password()
                const result = password._randomNumberWithUniformDistribution(data)
                return result >= 0
            })
        )
    })
    it('should produce boolean _passwordHasNotExceededConsecutiveCharLimit', () => {
        fc.assert(
            fc.property(fc.string(), fc.integer(), (str, int) => {
                const password = new Password()
                const result = password._passwordHasNotExceededConsecutiveCharLimit(str, int)
                return typeof result === 'boolean'
            })
        )
    })
    it('should produce string from _canonicalizedScanSetFromCharacters', () => {
        fc.assert(
            fc.property(fc.array(fc.string()), (strArray) => {
                const password = new Password()
                const result = password._canonicalizedScanSetFromCharacters(strArray)
                return typeof result === 'string'
            })
        )
    })
    it('should produce string from _classicPassword', () => {
        fc.assert(
            fc.property(fc.integer({min: 1, max: 60}), fc.string(), (int, str) => {
                const password = new Password()
                const result = password._classicPassword(int, str)
                return typeof result === 'string'
            })
        )
    })
    it('should produce boolean from _passwordHasNotExceededRepeatedCharLimit', () => {
        fc.assert(
            fc.property(fc.integer({min: 1, max: 60}), fc.string(), (limit, str) => {
                const password = new Password()
                const result = password._passwordHasNotExceededRepeatedCharLimit(str, limit)
                return typeof result === 'boolean'
            })
        )
    })
    it('should produce boolean from _passwordContainsRequiredCharacters', () => {
        fc.assert(
            fc.property(fc.string(), fc.array(fc.string()), (pw, strArray) => {
                const password = new Password()
                const result = password._passwordContainsRequiredCharacters(pw, strArray)
                return typeof result === 'boolean'
            })
        )
    })
})
