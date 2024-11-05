import { getTranslator } from './strings.js';

describe('TranslateFn', () => {
    it('uses the provided language', () => {
        const en = getTranslator({ language: 'en' });
        expect(en('autofill:hello')).toBe('Hello world');

        const xa = getTranslator({ language: 'xa' });
        expect(xa('autofill:hello')).toBe('H33ll00 wºrrld');
    });

    it('defaults to en for unsupported languages', () => {
        // Silence warnings, since we expect one here.
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        const t = getTranslator({ language: 'does-not-exist' });
        expect(t('autofill:hello')).toBe('Hello world');
    });

    it('reads language just in time', () => {
        const settings = { language: 'does-not-exist' };
        // Get a translator, but don't call it until after setting a valid language.
        const t = getTranslator(settings);
        settings.language = 'xa';
        expect(t('autofill:hello')).toBe('H33ll00 wºrrld');
    });

    it('only reads language once', () => {
        const settings = { language: 'en' };
        // Get a translator and use it.
        const t = getTranslator(settings);
        expect(t('autofill:hello')).toBe('Hello world');

        // Change the language in settings and ensure the translator *doesn't*
        // change.
        settings.language = 'xa';
        expect(t('autofill:hello')).toBe('Hello world');

        // Change to an invalid language as well, just to be sure.
        settings.language = 'does-not-exist';
        expect(t('autofill:hello')).toBe('Hello world');
    });

    it('performs simple replacements', () => {
        const t = getTranslator({ language: 'xa' });
        const s = t('autofill:lipsum', { foo: 'one', bar: 'two' });
        expect(s).toBe('Lºrr3e3m 1p$$$um d00l1loor s!t @@mett, one two');
    });
});
