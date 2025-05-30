# Real-world forms testing

We have collected hundreds of different forms from popular sites and incoming bugs. They live under _test-forms_. These run in CI at each push and ensure we're not introducing regressions and our changes yield a net positive improvement.

To add a form, follow these steps:

1. create an empty file under *test-forms*, with the naming convention `<sitename>_<formtype>.html`, e.g. `instagram_login.html`
2. add the filename to the index list in *test-forms* following other examples, optionally with a `title` attribute to reflect the page `<title>` tag
2. open the devtools in your browser, identify a meaningful container (i.e. the `form` element or whatever makes sense in your case), and copy the HTML contents
3. paste the copied HTML into your file and add a comment block with the url of your page
   3. ⚠️ Remember to remove existing autofill attributes like `data-ddg-inputtype` from the HTML because they would influence the script execution and render the test moot
3. manually score all relevant fields with the `data-manual-scoring` attribute, using only the `subtype`s as defined in the [`availableInputType` schema](https://github.com/duckduckgo/duckduckgo-autofill/blob/main/src/deviceApiCalls/schemas/availableInputTypes.json)
   4. 🧑‍💻 you can ignore fields that should be `unknown` or that shouldn't be scored anyway (like `type=hidden`) 
4. manually score the submit button using the `data-manual-submit` attribute
5. run the test case and if there are expected failures, add them to the index file following other examples

Ultimately the test result should be green acknowledging expected failures. See below for more info.

## Tracking improvements and regressions of Real-world Tests

Since we cannot offer a 100% perfect solution in terms of input classification, we should instead
aim to create a system that allows us to accurately measure improvement and regressions over time.

For example, we can configure our test of Twitter's login & signup forms with the following configuration.

```javascript
// test-forms/index.js
module.exports = [
    // snip
    { html: 'twitter_login.html' },
    { html: 'twitter_signup.html', expectedFailures: ['birthdayMonth', 'birthdayDay', 'birthdayYear'] },
    // snip
]
```

Notice how we are being explicit about `3` known failures in the sign-up forms' html with `expectedFailures`.
This is in contrast to the login form, in which we expect `0` failures. (the absence of the `expectedFailures` has the same meaning as it being empty)

This gives a clear indication of what is known to be broken, and what is working as expected. 

Then, as we work on individual features, it will be become very clear if we've improved the matching, or if we've made it worse. Either way, this testing setup forces you to either address the regressions, add new exceptions, or remove old ones that are no longer valid. 

### Improvements

This is the test output you'd see if you've **improved** the matching on `twitter_signup.html`

    Test twitter_signup.html should contain 3 known failures: ['birthdayMonth', 'birthdayDay', 'birthdayYear'], found 0

This means you can remove the `expectedFailures` from the test configuration, and it's clear in the git log that an improvement was made

### Regressions

If a change has reduced the accuracy of matching, for example on `twitter_login` from above, where no failures where expected, you'll get this output instead

    Test twitter_signup.html should NOT contain failures, found 1 ["email"]

At that point it's very clear what has broken, and you can work to resolve the issue before filing a PR.


## Testing Tips

### Set element dimensions in tests
In jsdom all elements have 0 `clientHeight` and `clientWidth` and dimensions in general. Since our logic checks 
dimensions of elements, in particular buttons, to determine if they are likely to be submit buttons, you can set
those values in the test suite as js properties or by using `data-` attributes. For example, in input-classifier.test.js
we set all button values to default size

```js
buttons.forEach((button) => {
    // We're doing this so that isPotentiallyViewable(button) === true. See jest.setup.js for more info
    // @ts-ignore
    button._jsdomMockClientWidth = 150
    // @ts-ignore
    button._jsdomMockClientHeight = 50
    // @ts-ignore
    button._jsdomMockOffsetWidth = 150
    // @ts-ignore
    button._jsdomMockOffsetHeight = 50
})
```

You can override those values directly in the markup of the test, by doing:

```html
<button data-mock-offsetHeight="36" data-mock-offsetWidth="22">
    Log in
</button>
```

### Run a single test case

To run a single real-world test case, you can do the following

```shell
# Run costco_checkout.html real-world test only
./node_modules/.bin/jest --verbose=false -t 'costco_checkout.html'
```

To produce test results as an HTML file, run the following. This is particularly useful
when multiple tests have changed status, and you want an overview.

```shell
# This will create `test-report.html` in the root of the project which can be opened in a browser 
npm run test:report
```
