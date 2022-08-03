import { getMMAndYYYYFromString, prepareFormValuesForStorage } from './formatters.js'

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
        '28  5'
    ]

    test.each(testCases)('Test for "%s"', (expiry) => {
        const result = getMMAndYYYYFromString(expiry)
        expect(result).toMatchObject({
            expirationMonth: '05',
            expirationYear: '2028'
        })
    })
})

describe('prepareFormValuesForStorage()', () => {
    describe('handling credentials', () => {
        it('rejects for username only', () => {
            const values = prepareFormValuesForStorage({
                credentials: { username: 'dax@example.com' },
                // @ts-ignore
                creditCards: {},
                // @ts-ignore
                identities: {}
            })
            expect(values.credentials).toBeUndefined()
        })
        it('accepts password only', () => {
            const values = prepareFormValuesForStorage({
                // @ts-ignore
                credentials: { password: '123456' },
                // @ts-ignore
                creditCards: {},
                // @ts-ignore
                identities: {}
            })
            expect(values.credentials?.password).toBe('123456')
        })
        it('accepts username+password', () => {
            const inputCredentials = { username: 'dax@example.com', password: '123456' }
            const values = prepareFormValuesForStorage({
                credentials: inputCredentials,
                // @ts-ignore
                creditCards: {},
                // @ts-ignore
                identities: {}
            })
            expect(values.credentials).toEqual(inputCredentials)
        })
    })
})
