# Agents

## Cursor Cloud specific instructions

This is a JavaScript (JSDoc-typed) form autofill library for DuckDuckGo. No external services (databases, Docker, etc.) are required.

### Quick reference

- **Node version**: 22 (see `.nvmrc`)
- **Package manager**: npm with `legacy-peer-deps=true` (see `.npmrc`)
- **Build**: `npm run build` (esbuild bundler, outputs to `dist/`)
- **Lint**: `npm run lint` (ESLint 9 + Prettier)
- **Type check**: `npx tsc` (checkJs mode over .js files, no .ts sources)
- **Unit tests**: `npm run test:unit` (Jest 30 with jsdom)
- **Integration tests**: `npm run test:integration` (Playwright; auto-starts http-server on port 3210)
- **Dev watch mode**: `npm start` (chokidar watches `src/` and `debug/`, rebuilds on change)
- **Static server**: `npm run serve` (http-server on port 3210, serves repo root)
- **All checks**: `npm test` runs unit tests + lint + tsc

### Caveats

- The `postinstall` script runs `cd packages/password && npm install` automatically during `npm install`.
- Integration tests using the `[macos]` project (WebKit) may have flaky failures on Linux due to WebKit element visibility/timing issues. The `[extension]`, `[windows]`, `[android]`, and `[ios]` projects are reliable on Linux.
- Playwright browsers must be installed via `npx playwright install --with-deps` before running integration tests.
- The debug UI is at `http://localhost:3210/debug/` (requires `npm run serve` or `npm start` + server).
- Test form pages are at `http://localhost:3210/integration-test/pages/` — these are bare HTML used by Playwright with the autofill script injected at test time.
