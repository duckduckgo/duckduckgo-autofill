# DuckDuckGo Autofill

Cross-platform autofill and credential management for DuckDuckGo browsers.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Build autofill bundles |
| `npm run test` | Unit tests + lint + TypeScript check |
| `npm run test:unit` | Jest unit tests only |
| `npm run test:integration` | Playwright integration tests |
| `npm run lint` | ESLint + Prettier check |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run schema:generate` | Generate API call types from schemas |

## Adding test forms

Used by `input-classifiers.test.js`:

1. Get the form HTML from the user (if not provided, ask)
2. Strip standard HTML5 structure (DOCTYPE, html, head, body tags) — keep only the form element
3. Create a file in `test-forms/` named `<sitename>_<formtype>.html` (e.g., `instagram_login.html`)
4. Add the new form to `index.json` using `scripts/save-form-to-test-suite.js`
5. Clean the HTML:
   - Remove `data-ddg-autofilled` attribute
   - Remove all `img` tags, `svg` elements, inline `style` attributes
   - Remove all `script` tags and their content
   - Reference `prettifyAndCleanHTML` for the cleaning logic
6. Annotate the form's inputs and buttons using examples from `test-forms/` HTML files
   - Use only the `subtype` (e.g., `password.current` not `credentials.password.current`)

## Reference documentation

| Topic | File |
|-------|------|
| Device API calls | [docs/device-api-calls.md](docs/device-api-calls.md) |
| Email protection | [docs/email-protection.md](docs/email-protection.md) |
| Matcher configuration | [docs/matcher-configuration.md](docs/matcher-configuration.md) |
| Playwright tests | [docs/playwright-tests.md](docs/playwright-tests.md) |
| Real-world HTML tests | [docs/real-world-html-tests.md](docs/real-world-html-tests.md) |
| Scanner debugging | [docs/scanner-debugging.md](docs/scanner-debugging.md) |
| Settings | [docs/settings.md](docs/settings.md) |
| Site-specific features | [docs/site-specific-feature.md](docs/site-specific-feature.md) |
| UI debugging | [docs/ui-debug.md](docs/ui-debug.md) |
| Runtime: Android | [docs/runtime.android.md](docs/runtime.android.md) |
| Runtime: iOS | [docs/runtime.ios.md](docs/runtime.ios.md) |
| Runtime: macOS | [docs/runtime.macos.md](docs/runtime.macos.md) |
| Runtime: Windows | [docs/runtime.windows.md](docs/runtime.windows.md) |
