const { internal } = require('../lib/apple.password')
const fc = require('fast-check')

describe('Apple password implementations', () => {
    let n = []
    beforeAll(() => {
        n = []
    })
    afterAll(() => {
        console.log(n)
    })
    it('should produce positive integers from ranges _randomNumberWithUniformDistribution', () => {
        fc.assert(
            fc.property(fc.integer({min: 1}), data => {
                const result = internal._randomNumberWithUniformDistribution(data)
                return result >= 0
            }),
            { seed: 1691610651, path: '0', endOnFailure: true }
        )
    })
    it('should produce boolean _passwordHasNotExceededConsecutiveCharLimit', () => {
        fc.assert(
            fc.property(fc.string(), fc.integer(), (str, int) => {
                const result = internal._passwordHasNotExceededConsecutiveCharLimit(str, int)
                return typeof result === 'boolean'
            })
        )
    })
    it('should produce string from _canonicalizedScanSetFromCharacters', () => {
        fc.assert(
            fc.property(fc.array(fc.string()), (strArray) => {
                const result = internal._canonicalizedScanSetFromCharacters(strArray)
                return typeof result === 'string'
            })
        )
    })
    it('should produce string from _classicPassword', () => {
        fc.assert(
            fc.property(fc.integer({min: 1, max: 60}), fc.string(), (int, str) => {
                const result = internal._classicPassword(int, str)
                return typeof result === 'string'
            })
        )
    })
    it('should produce boolean from _passwordHasNotExceededRepeatedCharLimit', () => {
        fc.assert(
            fc.property(fc.integer({min: 1, max: 60}), fc.string(), (limit, str) => {
                const result = internal._passwordHasNotExceededRepeatedCharLimit(str, limit)
                return typeof result === 'boolean'
            })
        )
    })
    it('should produce boolean from _passwordContainsRequiredCharacters', () => {
        fc.assert(
            fc.property(fc.string(), fc.array(fc.string()), (pw, strArray) => {
                const result = internal._passwordContainsRequiredCharacters(pw, strArray)
                return typeof result === 'boolean'
            })
        )
    })
})
