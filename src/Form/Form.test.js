afterEach(() => {
    document.body.innerHTML = null
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
            testCase,
            form,
            expHasValues = true,
            expValues = {
                username: 'testUsername',
                password: 'testPassword'
            }
        }, done) => {
        document.body.innerHTML = form
        // When we require autofill, the script scores the fields in the DOM
        require('../autofill.js')
        const {forms} = require('../scanForInputs')

        // Autofill uses requestIdleCallback to debounce DOM checks, the timeout gives it time to run
        requestIdleCallback(() => {
            requestIdleCallback(() => {
                try {
                    const formEl = document.querySelector('form')
                    const formClass = forms.get(formEl)
                    const hasValues = formClass.hasValues()
                    const formValues = formClass.getValues()

                    expect(hasValues).toBe(expHasValues)
                    expect(formValues).toMatchObject(expValues)
                    done()
                } catch (e) {
                    done(e)
                }
            })
        })
    })
})
