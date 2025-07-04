import { Password } from '../lib/apple.password.js';
import { assert, property, integer, string, array } from 'fast-check';
import { ParserError } from '../lib/rules-parser.js';

describe('password implementation, internal API', () => {
    it('should expose generateOrThrow', () => {
        const pw = Password.generateOrThrow('maxlength: 10');
        expect(pw.length).toBe(10);
    });
    it('should expose generateOrThrow & throw', () => {
        expect.assertions(1);
        try {
            Password.generateOrThrow('anything incorrect');
        } catch (e) {
            expect(e).toBeInstanceOf(ParserError);
        }
    });
    it('should expose generateDefault', () => {
        const defaultPw = Password.generateDefault();
        expect(defaultPw.length).toBe(Password.defaults.defaultPasswordLength);
    });
    it('should produce passwords with an entropy score of over 80', () => {
        const password = new Password();
        const { entropy } = password.parse(Password.defaults.defaultPasswordRules);
        expect(entropy).toBeGreaterThanOrEqual(80);
    });
    it('should produce positive integers from ranges _randomNumberWithUniformDistribution', () => {
        assert(
            property(
                integer({ min: 1 }),
                /** @param {number} data */ (data) => {
                    const password = new Password();
                    const result = password._randomNumberWithUniformDistribution(data);
                    return result >= 0;
                },
            ),
        );
    });
    it('should produce boolean _passwordHasNotExceededConsecutiveCharLimit', () => {
        assert(
            property(
                string(),
                integer(),
                /** @param {string} str @param {number} int */ (str, int) => {
                    const password = new Password();
                    const result = password._passwordHasNotExceededConsecutiveCharLimit(str, int);
                    return typeof result === 'boolean';
                },
            ),
        );
    });
    it('should produce string from _canonicalizedScanSetFromCharacters', () => {
        assert(
            property(
                array(string()),
                /** @param {string[]} strArray */ (strArray) => {
                    const password = new Password();
                    const result = password._canonicalizedScanSetFromCharacters(strArray);
                    return typeof result === 'string';
                },
            ),
        );
    });
    it('should produce string from _classicPassword', () => {
        assert(
            property(
                integer({ min: 1, max: 60 }),
                string(),
                /** @param {number} int @param {string} str */ (int, str) => {
                    const password = new Password();
                    const result = password._classicPassword(int, str);
                    return typeof result === 'string';
                },
            ),
        );
    });
    it('should produce boolean from _passwordHasNotExceededRepeatedCharLimit', () => {
        assert(
            property(
                integer({ min: 1, max: 60 }),
                string(),
                /** @param {number} limit @param {string} str */ (limit, str) => {
                    const password = new Password();
                    const result = password._passwordHasNotExceededRepeatedCharLimit(str, limit);
                    return typeof result === 'boolean';
                },
            ),
        );
    });
    it('should produce boolean from _passwordContainsRequiredCharacters', () => {
        assert(
            property(
                string(),
                array(string()),
                /** @param {string} pw @param {string[]} strArray */ (pw, strArray) => {
                    const password = new Password();
                    const result = password._passwordContainsRequiredCharacters(pw, strArray);
                    return typeof result === 'boolean';
                },
            ),
        );
    });
});
