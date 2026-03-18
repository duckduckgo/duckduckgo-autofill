---
name: debug
description: Guide for debugging and fixing autofill issues. Use when investigating why autofill doesn't work correctly on a site, deciding whether to create a site-specific remote config rule or an autofill code change, and when implementing autofill PRs.
---

# Debugging Autofill Issues

## Step 1: Diagnose the problem

Before writing any fix, understand what is going wrong. Gather these facts:

1. **Which platform?** macOS, iOS, Windows, Android, or Extension — this determines the override file and integration test project.
2. **What is the symptom?** Wrong input type, wrong form type (login vs signup), no tooltip, wrong form boundary, autofill doesn't trigger, performance freeze, etc.
3. **Inspect the DOM.** Look at `data-ddg-inputtype` attributes on inputs. These show what the scanner classified each field as. Compare against what the field actually is.
4. **Check form boundaries.** The scanner wraps inputs in a `Form` instance. The form element (or synthetic wrapper) determines which inputs are grouped together. Inspect which `<form>` or container the scanner chose.
5. **Shadow DOM?** If the site uses web components / shadow DOM, inputs inside shadow roots require special handling. Check if the relevant elements are inside a `shadowRoot`.
6. **Reproduce with debug UI.** Run `npm run debug` to launch the debug UI, which shows scanner output, classified fields, and form analysis signals.

## Step 2: Decide — site-specific rule or code change?

This is the most important decision. Use this tree:

```
Is the issue specific to one domain (or a small set of domains)?
│
├─ YES → Can it be fixed with a CSS selector + config value?
│   │
│   ├─ Input classified as wrong type
│   │   → inputTypeSettings (site-specific rule)
│   │   Example: force a text input to be "credentials.username"
│   │
│   ├─ Form scored as wrong type (login vs signup vs hybrid)
│   │   → formTypeSettings (site-specific rule)
│   │   Example: force a specific <form> to be "login"
│   │
│   ├─ Scanner can't find the right form boundary
│   │   → formBoundarySelector (site-specific rule)
│   │   Example: tell scanner to use a specific container as the form
│   │
│   ├─ Page has too many inputs, scanner bails out
│   │   → failsafeSettings (site-specific rule)
│   │   Example: bump maxInputsPerPage for a heavy page
│   │
│   └─ None of the above fit
│       → Code change needed (see Step 3)
│
├─ NO → Issue affects many sites or is a general algorithm problem
│   → Code change (see Step 3)
│
└─ UNSURE → Start with a site-specific rule for the immediate fix,
            then follow up with a code change if the pattern generalises
```

### Creating a site-specific rule

Site-specific rules live in the `remote-config` repo (privacy-configuration). Follow the
`remote-config/.cursor/rules/autofill-add-site-specific-settings.mdc` rule for detailed instructions.

Quick reference:

| Fix type | Config key | What it does |
|----------|-----------|--------------|
| Force input type | `inputTypeSettings` | Override what type a matched input is classified as |
| Force form type | `formTypeSettings` | Override login/signup/hybrid scoring for a matched form |
| Force form boundary | `formBoundarySelector` | Tell scanner which element to treat as the form |
| Adjust failsafes | `failsafeSettings` | Bump `maxInputsPerPage`, `maxFormsPerPage`, `maxInputsPerForm` |

- Schema definition: `remote-config/schema/features/autofill.ts`
- Override files: `remote-config/overrides/{macos,ios,windows,android}-override.json`
- Uses JSON Patch syntax (`op: "add"`, `path: "/inputTypeSettings/-"`)
- Always clarify which platform(s) need the fix
- Run `npm test` in remote-config after making changes

## Step 3: Implementing a code change

When the fix requires changing autofill code, follow these guidelines. They are distilled from
recurring PR review feedback and represent the team's expectations.

### Architecture: put logic in the right module

Every piece of logic has a module that owns it. Before adding code to a file, ask: does this file
own this concern?

| Module | Owns |
|--------|------|
| `src/Scanner.js` | Finding inputs on the page, creating Form instances, mutation observation, scan modes |
| `src/Form/Form.js` | Form lifecycle: decoration, autofill, value extraction, submit handling |
| `src/Form/FormAnalyzer.js` | Login vs signup scoring (signal-based) |
| `src/Form/matching.js` | Input type classification — inferring what type each field is |
| `src/Form/matching-config/matching-config-source.js` | Regex patterns, DDG matchers, vendor regexes, CSS selectors |
| `src/Form/inputTypeConfig.js` | Per-type config: which icon to show, whether to decorate, tooltip items |
| `src/site-specific-feature.js` | Reading site-specific remote config settings |
| `src/DeviceInterface/InterfacePrototype.js` | Device abstraction, messaging, high-level orchestration |

**Do not scatter feature logic across files.** If you are adding a new capability, consider whether
it deserves its own module/class rather than being inlined into InterfacePrototype.js or Form.js.

Use explicit state enums (e.g., scanner `mode`: `'scanning' | 'on-click' | 'stopped'`) rather than
boolean flags when tracking state with more than two possible values.

### Prefer remote config over hardcoded domain checks

If you find yourself writing `if (hostname === 'example.com')`, stop. This almost certainly belongs
in `siteSpecificFixes` via remote config instead. Remote config gives you:

- Remote disabling without a code release
- Domain and path matching
- Experiment support (rollout percentages)
- Per-platform configuration
- iframe support

Only hardcode domain logic when there is a strong justification (e.g., bootstrapping glue that
cannot be expressed as config). Document why.

### Testing: use the right layer

| What changed | Test with | File |
|-------------|-----------|------|
| Input classification (matchers, regex, scoring) | Unit tests (test-forms) | `src/Form/input-classifiers.test.js` |
| Form behavior (recategorization, autofill flow, submit) | Unit tests | `src/Form/Form.test.js` |
| Formatters, value transformation | Unit tests | `src/Form/formatters.test.js` |
| End-to-end user interaction, UI, platform integration | Playwright | `integration-test/tests/*.spec.js` |

**Critical rules:**

- **Never use Playwright for testing scoring/matching changes.** Playwright tests are slow and are
  not run during algorithm iteration. Use the unit test suite with test-forms instead.
- **Always verify your tests can fail.** If a select element defaults to the value you are asserting,
  your test passes trivially. Change the default or assert on a non-default value.
- **Test both positive and negative cases.** When adding a new matcher or regex, add test cases for
  what SHOULD match AND what should NOT match.
- **Strip browser-injected attributes from test form HTML.** Remove: `data-ddg-inputtype`,
  `data-ddg-autofilled`, `img` tags, `svg` elements, inline `style` attributes, `script` tags.
  Use `data-manual-scoring` for annotations (subtype only, e.g., `password.current` not
  `credentials.password.current`). Use `data-manual-submit` for submit buttons. See the
  `add-test-form.mdc` rule for details.

### Types: be precise

- Use `HTMLInputElement`, not `Element` or `any`. Gate with `instanceof` checks.
- Use `NonNullable<>` to remove optionality when you've already defaulted (e.g., `|| []`).
- Import types from schema: `@import { SiteSpecificFixes } from '@duckduckgo/privacy-configuration/schema/features/autofill.js'`
- Use existing type guards (e.g., `isValidSupportedType` from `matching.js`).
- Add JSDoc `@param` and `@returns` to all new methods.
- Never use `@ts-ignore` — cast on a separate line above if you must force a type.

### Performance: the DOM is expensive

- **Never scan the DOM twice** for the same data. If you've already run `querySelectorAll`, don't
  also run a `TreeWalker` over the same elements.
- **Set hard caps on iterations.** When looping through DOM elements, add a cutoff
  (e.g., `if (i >= 200) break`) to prevent freezing on large pages.
- **Check `.length` before converting** NodeLists to arrays — avoid creating empty arrays.
- **Use `push(...elements)` instead of building intermediate arrays** and concatenating.
- If adding shadow DOM traversal, make it conditional — only traverse when there is actually a
  `shadowRoot` present.

### Regex: start narrow, verify edge cases

- **Always test your regex with unexpected inputs.** Reviewers will run strings like "phone number"
  against your password-hint regex. If it matches, you have a bug.
- **Prefer simpler patterns.** Non-capturing groups (`(?:...)`) add no benefit when using
  `.test()` — just use alternation directly. Use `.?` rather than complex groups for optional
  single characters.
- **No lookbehinds.** Negative/positive lookbehinds are not supported in all Safari/WebKit versions.
  Use lookaheads or restructure the regex instead.
- **Start narrow, expand later.** Ship a regex that matches known cases. It is fine if reviewers
  note it will need localized versions later — as long as you don't introduce false positives now.
- **Document what the regex matches** in a comment above or beside it.

### DOM defensiveness

The web is hostile territory. Do not assume:

- `form.elements` is iterable — sites override it. Fall back to `querySelectorAll`.
- `activeElement` pierces shadow DOM — it does not. Recurse through `shadowRoot.activeElement`.
- `submit` events bubble out of shadow DOM — they do not. Attach listeners to the form inside
  the shadow root.
- Elements exist or have expected types — always null-check before accessing properties.

### Cleanup

- **Remove dead code** when you delete its only call site. Unused methods, constants, and imports
  should not survive the PR.
- **Revert debug/test-only code** before committing (hardcoded config overrides, console.logs,
  forced feature flags).

### Build and verify

Before committing, always run:

```sh
npm ci
npm run build    # Updates dist/autofill.js and dist/autofill-debug.js
npm test         # Unit tests must pass
npm run lint     # Lint must pass
```

The `dist/` files are checked into the repo. If you change source code and forget to rebuild,
CI will fail with "dist/autofill.js: needs update".

### Comments

- Explain **why**, not what. "Autoprompt on both inputs to facilitate export/import automated flows"
  is useful. "Call autoprompt" is not.
- For translatable strings, add translator context: "Button label for saving credentials.
  'Save' is a verb in imperative form."

## Key files reference

| File | Purpose |
|------|---------|
| `src/Scanner.js` | Entry point — finds inputs, creates Forms |
| `src/Form/Form.js` | Form lifecycle, decoration, autofill |
| `src/Form/FormAnalyzer.js` | Login vs signup scoring |
| `src/Form/matching.js` | Input type classification |
| `src/Form/matching-config/matching-config-source.js` | Regex patterns, matchers, selectors |
| `src/Form/matching-config/selectors-css.js` | CSS selectors for field matching |
| `src/Form/inputTypeConfig.js` | Per-type decoration/icon/tooltip config |
| `src/site-specific-feature.js` | Remote config reader for site-specific fixes |
| `src/Form/input-classifiers.test.js` | Unit tests for input classification |
| `src/Form/Form.test.js` | Unit tests for form behavior |
| `test-forms/` | HTML fixtures for classifier tests |
| `test-forms/index.json` | Registry of test form fixtures |
| `integration-test/tests/` | Playwright integration tests |
| `docs/site-specific-feature.md` | Docs for site-specific fixes system |
| `remote-config/schema/features/autofill.ts` | Schema for site-specific fix types |
