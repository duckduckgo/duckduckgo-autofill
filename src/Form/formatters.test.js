import { formatPhoneNumber, getMMAndYYYYFromString, prepareFormValuesForStorage } from './formatters.js';

describe('Format year and month from single string', () => {
    const testCases = [
        '05-2028',
        '05/2028',
        '05/28',
        '05 28',

        '5-2028',
        '5/2028',
        '5/28',
        '5 28',

        '05 - 2028',
        '05 / 2028',
        '05 / 28',
        '05  28',

        '5 - 2028',
        '5 / 2028',
        '5 / 28',
        '5  28',

        '2028-05',
        '2028/05',
        '28/05',
        '28 05',

        '2028-5',
        '2028/5',
        '28/5',
        '28 5',

        '2028 - 05',
        '2028 / 05',
        '28 / 05',
        '28  05',

        '2028 - 5',
        '2028 / 5',
        '28 / 5',
        '28  5',
    ];

    test.each(testCases)('Test for "%s"', (expiry) => {
        const result = getMMAndYYYYFromString(expiry);
        expect(result).toMatchObject({
            expirationMonth: '05',
            expirationYear: '2028',
        });
    });
});

describe('Can strip phone formatting characters', () => {
    it('should strip all unexpected characters from phone', () => {
        const complexPhoneNumber = '+1 (3) 345-123456.3';
        expect(formatPhoneNumber(complexPhoneNumber)).toEqual('+133451234563');
    });
});

describe('prepareFormValuesForStorage()', () => {
    describe('handling credentials', () => {
        it('rejects for username only', () => {
            const values = prepareFormValuesForStorage({
                credentials: { username: 'dax@example.com' },
                // @ts-ignore
                creditCards: {},
                // @ts-ignore
                identities: {},
            });
            expect(values.credentials).toBeUndefined();
        });
        it('accepts password only', () => {
            const values = prepareFormValuesForStorage({
                // @ts-ignore
                credentials: { password: '123456' },
                // @ts-ignore
                creditCards: {},
                // @ts-ignore
                identities: {},
            });
            expect(values.credentials?.password).toBe('123456');
        });
        it('accepts username+password', () => {
            const inputCredentials = { username: 'dax@example.com', password: '123456' };
            const values = prepareFormValuesForStorage({
                credentials: inputCredentials,
                // @ts-ignore
                creditCards: {},
                // @ts-ignore
                identities: {},
            });
            expect(values.credentials).toEqual(inputCredentials);
        });
        it('accepts username only with partial_form_saves feature', () => {
            const inputCredentials = { username: 'dax@example.com' };
            const values = prepareFormValuesForStorage(
                {
                    credentials: inputCredentials,
                    // @ts-ignore
                    creditCards: {},
                    // @ts-ignore
                    identities: {},
                },
                true,
            );
            expect(values.credentials).toEqual(inputCredentials);
        });

        it('accepts email address as username when other identity data is present', () => {
            const inputCredentials = { username: 'dax@example.com', password: '123456' };
            const values = prepareFormValuesForStorage({
                // @ts-ignore
                credentials: { password: inputCredentials.password },
                // @ts-ignore
                creditCards: {},
                // @ts-ignore
                identities: { emailAddress: 'dax@example.com', firstName: 'Dax', lastName: 'McDax' },
            });
            expect(values.credentials).toEqual(inputCredentials);
        });

        it('accepts email address as username with identity and card data is present', () => {
            const inputCredentials = { username: 'dax@example.com', password: '123456' };
            const values = prepareFormValuesForStorage({
                // @ts-ignore
                credentials: { password: inputCredentials.password },
                // @ts-ignore
                creditCards: { cardNumber: '1234567890123456', cardName: 'Dax McDax' },
                // @ts-ignore
                identities: { emailAddress: 'dax@example.com', firstName: 'Dax', lastName: 'McDax', phone: '+133451234563' },
            });
            expect(values.credentials).toEqual(inputCredentials);
        });

        it('accepts phone as username', () => {
            const inputCredentials = { username: '+133451234563', password: '123456' };
            const values = prepareFormValuesForStorage({
                // @ts-ignore
                credentials: {
                    password: inputCredentials.password,
                },
                // @ts-ignore
                creditCards: {},
                // @ts-ignore
                identities: {
                    phone: inputCredentials.username,
                },
            });
            expect(values.credentials).toEqual(inputCredentials);
        });

        it("doesn't accept phone as username if other identity data is present", () => {
            const inputCredentials = { username: '+133451234563', password: '123456' };
            const values = prepareFormValuesForStorage({
                // @ts-ignore
                credentials: {
                    password: inputCredentials.password,
                },
                // @ts-ignore
                creditCards: {},
                // @ts-ignore
                identities: {
                    phone: inputCredentials.username,
                    firstName: 'Dax',
                    lastName: 'McDax',
                },
            });
            expect(values.credentials).toEqual({ password: inputCredentials.password });
        });

        it('accepts credit card number as username', () => {
            const inputCredentials = { username: '1234567890123456', password: '123456' };
            const values = prepareFormValuesForStorage({
                // @ts-ignore
                credentials: { password: inputCredentials.password },
                // @ts-ignore
                creditCards: {
                    cardNumber: inputCredentials.username,
                },
                // @ts-ignore
                identities: {},
            });
            expect(values.credentials).toEqual(inputCredentials);
        });

        it("doesn't accept credit card number as username if other card data is present", () => {
            const inputCredentials = { username: '1234567890123456', password: '123456' };
            const values = prepareFormValuesForStorage({
                // @ts-ignore
                credentials: { password: inputCredentials.password },
                // @ts-ignore
                creditCards: {
                    cardNumber: inputCredentials.username,
                    cardName: 'Dax McDax',
                },
                // @ts-ignore
                identities: {},
            });
            expect(values.credentials).toEqual({ password: inputCredentials.password });
        });

        it('rejects credentials, if there is no credentials data and credit cards is available, and partial_form_saves is disabled', () => {
            const values = prepareFormValuesForStorage(
                {
                    // @ts-ignore
                    credentials: {},
                    // @ts-ignore
                    identities: {},
                    // @ts-ignore
                    creditCards: { cardNumber: '1234567890123456', cardName: 'Dax McDax' },
                },
                false,
            ); // partial_form_saves is disabled
            expect(values.credentials).toBeUndefined();
        });

        it('rejects credentials, if there is no credentials data and credit cards is available, and partial_form_saves is enabled', () => {
            const values = prepareFormValuesForStorage(
                {
                    // @ts-ignore
                    credentials: {},
                    // @ts-ignore
                    identities: {},
                    // @ts-ignore
                    creditCards: { cardNumber: '1234567890123456', cardName: 'Dax McDax' },
                },
                true,
            ); // partial_form_saves is enabled
            expect(values.credentials).toBeUndefined();
        });
    });
});
