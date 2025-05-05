import { PasswordGenerator } from './PasswordGenerator.js';

describe('PasswordGenerator', () => {
    it('generates a password once', () => {
        const pwg = new PasswordGenerator();
        expect(pwg.generated).toBe(false);
        const pws = [pwg.generate(), pwg.generate(), pwg.generate(), pwg.generate(), pwg.generate()];
        expect(new Set(pws).size).toBe(1);
        expect(pwg.generated).toBe(true);
    });

    // Generate 10000 passwords and ensure they all include a number.
    it('always includes a number', () => {
        const digitRE = /[0-9]/;
        for (let i = 0; i < 10_000; i++) {
            expect(new PasswordGenerator().generate()).toMatch(digitRE);
        }
    });
});
