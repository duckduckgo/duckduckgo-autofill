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
</form>`,
            expHasValues: true,
            expValues: {credentials: {username: 'testUsername', password: 'testPassword'}}
        },
        {
            testCase: 'form with email',
            form: `
<form>
    <input type="email" value="name@email.com" autocomplete="email" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: {credentials: {username: 'name@email.com', password: 'testPassword'}}
        },
        {
            testCase: 'form with both email and username fields',
            form: `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="email" value="name@email.com" autocomplete="email" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: {credentials: {username: 'testUsername', password: 'testPassword'}}
        },
        /*
        TODO: uncomment when Shane's branch is merged
        {
            testCase: 'form with readonly email fields and password',
            form: `
<form>
    <input type="email" value="name@email.com" autocomplete="email" readonly />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: true,
            expValues: {credentials: {username: 'name@email.com', password: 'testPassword'}}
        },
        */
        {
            testCase: 'form with empty fields',
            form: `
<form>
    <input type="text" value="" autocomplete="username" />
    <input type="password" value="" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`,
            expHasValues: false,
            expValues: {credentials: null}
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
            expValues: {credentials: {password: 'testPassword'}}
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
            expValues: {credentials: null}
        },
        {
            testCase: 'complete checkout form',
            form: `
<form method="post" id="usrForm">
    <fieldset>
        <legend>Contact Info</legend>
        <label for="frmNameA">Name</label>
        <input name="name" id="frmNameA" placeholder="Full name" autocomplete="name" value="Peppa Pig">
        <label for="frmEmailA">Email</label>
        <input type="email" name="email" id="frmEmailA" placeholder="name@example.com" autocomplete="email" value="peppapig@email.com">
        <label for="frmEmailC">Confirm Email</label>
        <input type="email" name="emailC" id="frmEmailC" placeholder="name@example.com" autocomplete="email" value="peppapig@email.com">
        <label for="frmPhoneNumA">Phone</label>
        <input type="tel" name="phone" id="frmPhoneNumA" placeholder="+1-650-450-1212" autocomplete="tel" value="6100000000">
    </fieldset>
    
    <fieldset>
        <legend>Billing</legend>
        <label for="frmAddressB">Address</label>
        <input name="bill-address" id="frmAddressB" placeholder="123 Any Street" autocomplete="billing street-address" value="604 Redford St">
        <label for="frmCityB">City</label>
        <input name="bill-city" id="frmCityB" placeholder="New York" autocomplete="billing address-level2" value="Farmville">
        <label for="frmStateB">State</label>
        <input name="bill-state" id="frmStateB" placeholder="NY" autocomplete="billing address-level1" value="Virginia">
        <label for="frmZipB">Zip</label>
        <input name="bill-zip" id="frmZipB" placeholder="10011" autocomplete="billing postal-code" value="23901">
        <label for="frmCountryB">Country</label>
        <input name="bill-country" id="frmCountryB" placeholder="USA" autocomplete="billing country" value="United States">
    </fieldset>

    <div id="paymentSec">
        <fieldset>
            <legend>Payment</legend>
            <label for="frmNameCC">Name on card</label>
            <input name="ccname" id="frmNameCC" placeholder="Full Name" autocomplete="cc-name" value="Peppa Pig">
            <label for="frmCCNum">Card Number</label>
            <input name="cardnumber" id="frmCCNum" autocomplete="cc-number" value="4111111111111111">
            <label for="frmCCCVC">CVC</label>
            <input name="cvc" id="frmCCCVC" autocomplete="cc-csc" value="123">
            <label for="frmCCExp">Expiry</label>
            <input name="cc-exp" id="frmCCExp" placeholder="MM-YYYY" autocomplete="cc-exp" value="12-2028">
            <div>
                <button class="btn" id="butCheckout">Check Out</button>
            </div>
        </fieldset>
</div>
    </form>`,
            expHasValues: true,
            expValues: {
                identities: {
                    firstName: 'Peppa',
                    lastName: 'Pig',
                    addressStreet: '604 Redford St',
                    addressCity: 'Farmville',
                    addressProvince: 'Virginia',
                    addressPostalCode: '23901',
                    addressCountryCode: 'US',
                    phone: '6100000000',
                    emailAddress: 'peppapig@email.com'
                },
                creditCards: {
                    cardName: 'Peppa Pig',
                    cardSecurityCode: '123',
                    expirationMonth: '12',
                    expirationYear: '2028',
                    cardNumber: '4111111111111111'
                }
            }
        },
        /*
        TODO: uncomment when Shane's branch is merged
        {
            testCase: 'test localised country code with text input',
            form: `
<form lang="it">
    <input value="Peppa Pig" autocomplete="name" />
    <input value="via Gioberti 41" autocomplete="street-address" />
    <input value="Macerata" autocomplete="address-level2" />
    <input value="Italia" autocomplete="country" />
</form>`,
            expHasValues: true,
            expValues: {identities: {addressCountryCode: 'IT'}}
        },
        */
        {
            testCase: 'incomplete identities form',
            form: `
<form>
    <input value="Macerata" autocomplete="address-level2" />
    <input value="Italia" autocomplete="country" />
</form>`,
            expHasValues: false,
            expValues: {identities: null}
        },
        {
            testCase: 'incomplete creditCard form',
            form: `
<form>
    <input autocomplete="cc-name" value="Peppa Pig">
    <input autocomplete="cc-number" value="4111111111111111">
</form>`,
            expHasValues: false,
            expValues: {username: 'testUsername', password: ''}
        }
    ]

    test.each(testCases)('Test $testCase', (
        {
            form,
            expHasValues,
            expValues
        }) => {
        document.body.innerHTML = form
        // When we require autofill, the script scores the fields in the DOM
        const {forms, scanForInputs} = require('../scanForInputs')

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
