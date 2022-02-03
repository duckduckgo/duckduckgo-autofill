const InterfacePrototype = require('../DeviceInterface/InterfacePrototype')

afterEach(() => {
    document.body.innerHTML = ''
})

describe('Test the form class reading values correctly', () => {
    const testCases = [
        {
            testCase: 'form with username',
            form: `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`
        },
        {
            testCase: 'form with email',
            form: `
<form>
    <input type="email" value="testUsername" autocomplete="email" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`
        },
        {
            testCase: 'form with both email and username fields',
            form: `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="email" value="something@else.com" autocomplete="email" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`
        },
        {
            testCase: 'form with empty fields',
            form: `
<form>
    <input type="text" value="" autocomplete="username" />
    <input type="password" value="" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: false,
            expValues: {username: '', password: ''}
        },
        {
            testCase: 'form with only the password filled',
            form: `
<form>
    <input type="text" value="" autocomplete="username" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: {username: '', password: 'testPassword'}
        },
        {
            testCase: 'form with only the username filled',
            form: `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="password" value="" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: false,
            expValues: {username: 'testUsername', password: ''}
        }
    ]

    test.each(testCases)('Test $testCase', (
        {
            form,
            expHasValues = true,
            expValues = {
                username: 'testUsername',
                password: 'testPassword'
            }
        }) => {
        document.body.innerHTML = form
        // When we require autofill, the script scores the fields in the DOM
        const {forms, scanForInputs} = require('../scanForInputs')

        // Autofill uses requestIdleCallback to debounce DOM checks, we call it twice here to run tests after it
        scanForInputs(new InterfacePrototype()).findEligibleInputs(document)

        const formEl = document.querySelector('form')
        if (!formEl) throw new Error('unreachable')
        const formClass = forms.get(formEl)
        const hasValues = formClass?.hasValues()
        const formValues = formClass?.getValues()

        expect(hasValues).toBe(expHasValues)
        expect(formValues).toMatchObject(expValues)
    })
})
