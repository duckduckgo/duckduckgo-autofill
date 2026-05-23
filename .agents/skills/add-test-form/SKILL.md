---
name: add-test-form
description: Use when adding a test form for the input classifier test suite (input-classifiers.test.js). These HTML fixtures live in test-forms/ and are used to validate that the matching algorithm classifies inputs correctly.
---

# Adding a Test Form

Test forms are HTML fixtures used by `src/Form/input-classifiers.test.js` to validate input classification.

## Instructions

1. **Get the HTML.** If the HTML is not provided, ask the user to provide it.

2. **Clean the HTML.**
   - Do not add any standard HTML5 structure (`DOCTYPE`, `html`, `head`, `body` tags) — just keep the form element.
   - Remove the `data-ddg-autofilled` attribute from all elements.
   - Remove all `img` tags and all `svg` elements.
   - Remove all inline `style` attributes.
   - Remove all `script` tags and their content.
   - Reference `prettifyAndCleanHTML` for the full cleaning logic.

3. **Create the file** in the `test-forms/` directory with the naming convention:
   ```
   <sitename>_<formtype>.html
   ```
   Examples: `instagram_login.html`, `chase_checkout.html`

4. **Annotate inputs and buttons** with `data-manual-scoring` and `data-manual-submit` attributes.
   - Use only the **subtype**, not the fully qualified type.
     - Correct: `data-manual-scoring="password.current"`
     - Wrong: `data-manual-scoring="credentials.password.current"`
   - For submit buttons, add `data-manual-submit` (the value doesn't matter, just the attribute presence).
   - Look at existing HTML files in `test-forms/` for examples.

5. **Register the form** in `test-forms/index.json` using:
   ```sh
   node scripts/save-form-to-test-suite.js
   ```

6. **Run the tests** to verify:
   ```sh
   npm test
   ```
