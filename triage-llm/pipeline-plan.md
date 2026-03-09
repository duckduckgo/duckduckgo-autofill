# Plan: Automated Autofill Bug Triage Pipeline

## Context

Autofill bugs are reported to an Asana project ("Autofill Bugs") and currently triaged manually: an engineer reads the task, renders the page, visually labels form fields, saves the HTML as a test form, runs the classifier, and compares results to propose a fix. This is time-consuming and doesn't scale. The goal is to fully automate this pipeline so it can run from a CI workflow (manual trigger or nightly cron), taking an Asana task ID or URL as input and producing a test form, test results, and a fix proposal without human intervention.

---

## Architecture Overview

All new code lives under `triage-llm/`. Pipeline phases flow through a shared `context` object.

```
triage-llm/
  pipeline.js          ← CLI entry point + orchestrator
  asana-client.js      ← Read tasks from Asana API
  page-capture.js      ← Playwright: render page, screenshot, extract DOM
  url-resolver.js      ← Claude API: extract/infer the broken URL from task description
  visual-labeler.js    ← Claude API (vision): label form fields
  form-injector.js     ← Inject data-manual-scoring attrs + call save-form-to-test-suite.js
  test-runner.js       ← Spawn Jest, parse results
  fix-proposer.js      ← Claude API: propose algorithm patch or remote rule
  reporter.js          ← Write markdown triage report
  reports/             ← Generated reports (gitignored)
```

---

## Phase 0: New Dependencies

Add to `package.json` devDependencies:
- `@anthropic-ai/sdk` — Claude API for vision labeling and fix proposals

Already available (no additions needed):
- `asana` v1.0.2 — already installed, used in `scripts/release/asana-create-tasks.js`
- `playwright` — already in devDependencies
- `gh` CLI — available in GitHub Actions runners

---

## Phase 1: CLI Entry Point — `triage-llm/pipeline.js`

**Invocation:**
```
node triage-llm/pipeline.js --url <url>
node triage-llm/pipeline.js --asana-task-id <gid>
node triage-llm/pipeline.js   # batch mode: reads all open Asana tasks
```

**Responsibilities:**
- Parse CLI args (no external library needed)
- If `--asana-task-id`: call `fetchTaskContext(gid)` → resolve URL + notes
- If neither arg: batch mode — call `fetchOpenBugTasks(AUTOFILL_BUGS_PROJECT_GID)` and loop
- **Always run Phase 2b (URL resolution)** before page capture — even when `--url` is provided, run a lightweight probe to confirm the URL contains a form
- If `urlResolution.needsMoreInfo === true`: post clarifying question, write partial report, skip to next task
- Derive filename from resolved URL hostname+path (`logon_vanguard_com_login`)
- Orchestrate all phases sequentially, passing a shared `ctx` object
- Print final report path

**Shared `ctx` shape:**
```js
{
  url, asanaTaskId, asanaTaskNotes, filename,
  urlResolution: { url, confidence, reasoning, needsMoreInfo, clarifyingQuestion },
  screenshotPath, screenshotBase64, rawDOM, pageTitle,
  labelingResult: { fields: LabeledField[], submitButtonSelector, formNotes },
  savedFormPath,
  testResult: { passed, failures, submitFalsePositives, submitFalseNegatives, rawOutput },
  fixProposal: { fixType, remoteRule?, algorithmPatch?, summary },
  reportPath,
}
```

---

## Phase 2: Asana Integration — `triage-llm/asana-client.js`

**Reference pattern:** `scripts/release/asana-create-tasks.js` — reuse the exact same SDK setup.

**Key functions:**
- `fetchTaskContext(taskGid)` → `{ name, notes, url }`
  - API call: `client.tasks.findById(gid, { opt_fields: 'name,notes,html_notes' })`
  - URL extraction: first `https?://...` match in `task.notes`
- `fetchOpenBugTasks(projectGid)` → `[{ gid, name }]`
  - API call: `client.tasks.findByProject(projectGid, { opt_fields: 'gid,name,completed' })`
  - Filter: `!t.completed`
- `postTriageComment(taskGid, markdownText)` → posts result back to task
  - API call: `client.tasks.addComment(gid, { text: ... })`

**Env var:** `ASANA_ACCESS_TOKEN` — already used by `asana-release.yml`.
**Missing:** `AUTOFILL_BUGS_PROJECT_GID` must be added as a known constant or env var.

---

## Phase 2b: URL Resolution — `triage-llm/url-resolver.js`

**Runs after:** `fetchTaskContext` in Phase 2, **before** page capture.

**Problem:** Asana tasks often describe a bug without a direct URL — they may say "login page on Vanguard doesn't autofill" or include a domain with no path, or a URL that redirects to an intermediate page that isn't the actual broken form.

**Function:** `resolveUrl(taskName, taskNotes, rawUrl)` → `UrlResolution`

```js
{
  url: string,           // best candidate URL to capture
  confidence: number,    // 0.0–1.0
  reasoning: string,     // explanation
  needsMoreInfo: boolean,
  clarifyingQuestion: string | null,
}
```

**Resolution strategy (in order):**

1. **Explicit URL in notes** — if `rawUrl` is already a full `https://` URL pointing to a specific path (not just a homepage), use it directly with `confidence: 1.0`.

2. **Claude inference** — if no URL or only a bare domain is found, call Claude with the task name + notes to infer the most likely login/form URL:
   - Known patterns: `/login`, `/signin`, `/logon`, `/account/login`, `/auth`, etc.
   - Claude returns a ranked list of candidate URLs with confidence scores
   - Model: `claude-opus-4-6`, structured JSON output

3. **Playwright probe** — for each candidate URL (highest confidence first), attempt a `page.goto()` and check whether the resulting page contains at least one `<input>` element. The first URL that yields a page with inputs is used.

4. **Needs more info** — if no candidate yields a page with inputs, set `needsMoreInfo: true` and generate a `clarifyingQuestion`.

**Clarifying question generation:**
- Claude drafts a concise question to post as an Asana comment, asking the reporter for the exact URL or reproduction steps
- Example: _"Could you share the exact URL where autofill isn't working? A direct link to the login page would help us reproduce and fix this faster."_

**Awaiting reply flow:**
- Post the clarifying question as an Asana comment via `postTriageComment`
- Tag the task with a custom label or add a note in the report: "Waiting for reporter clarification"
- **Do not proceed** with page capture — exit the pipeline early for this task
- On the next pipeline run (nightly cron or manual trigger), call `fetchTaskStories(taskGid)` to check whether new comments have been added since the clarifying question was posted
  - API call: `client.stories.getStoriesForTask(gid, { opt_fields: 'created_at,type,text' })`
  - If a new human comment exists after the bot's clarifying comment → re-run `resolveUrl` with the updated notes + new comment text, then continue the pipeline
  - If no new reply yet → skip the task silently (don't re-post the question)

**New function in `asana-client.js`:**
- `fetchTaskStories(taskGid)` → `[{ created_at, type, text }]`
  - Filters to `type === 'comment'`
  - Used to detect reporter replies

**`ctx` additions:**
- `ctx.urlResolution` — always set after this phase
- If `needsMoreInfo === true`: pipeline exits early, report records the clarifying question and "awaiting reply" status

---

## Phase 3: Page Capture — `triage-llm/page-capture.js`

**Uses:** `playwright` (chromium, already installed)

**Function:** `capturePage(url)` → `{ screenshotPath, screenshotBase64, rawDOM, pageTitle }`

**Key details:**
- `waitUntil: 'load'` + 2s wait for SPA-rendered forms (mirrors what we did for Vanguard)
- Full-page screenshot as base64 PNG for Claude vision input
- DOM extraction: prefer `<form>` elements; if none, find smallest ancestor containing ≥2 inputs
- **Strip `data-ddg-inputtype` attrs** from extracted HTML (required per `docs/real-world-html-tests.md`)
- Fallback: if `waitUntil: 'networkidle'` times out (as it did on Vanguard), retry with `'load'`

---

## Phase 4: Visual Labeling — `triage-llm/visual-labeler.js`

**Uses:** `@anthropic-ai/sdk`, model `claude-opus-4-6`

**Function:** `labelFields(screenshotBase64, rawDOM, asanaTaskNotes)` → `LabelingResult`

**Prompt strategy:**
- System prompt: analyst role, visual+structural inspection only, no autofill algorithm knowledge
- User message includes:
  1. Screenshot (base64 image block via vision API)
  2. Trimmed raw DOM (≤50KB)
  3. Full list of valid subtypes (hardcoded)
  4. Asana task notes for context (if available)
  5. Output format: JSON with `fields[].selector`, `fields[].subtype`, `fields[].confidence`, `submitButtonSelector`
- Enforce `type: 'json_object'` in Claude response (structured output)
- Retry once if JSON parsing fails

**Valid subtypes to include in prompt:**
`username`, `password`, `password.current`, `password.new`, `emailAddress`, `firstName`, `lastName`, `middleName`, `fullName`, `phone`, `addressStreet`, `addressStreet2`, `addressCity`, `addressProvince`, `addressPostalCode`, `addressCountryCode`, `birthdayDay`, `birthdayMonth`, `birthdayYear`, `cardNumber`, `cardName`, `cardSecurityCode`, `expirationMonth`, `expirationYear`, `expiration`, `totp`, `unknown`

**Env var:** `ANTHROPIC_API_KEY`

---

## Phase 5: Form Injection + Save — `triage-llm/form-injector.js`

**Reuses:** `scripts/save-form-to-test-suite.js` (call via `execSync`)

**Function:** `injectAndSave(rawDOM, fields, submitButtonSelector, filename, url)` → `savedPath`

**Injection approach** (regex-based, no jsdom):
- For each `LabeledField`: extract distinguishing attr from selector (`id`, `name`, `aria-label`)
- Regex-replace the matching `<input ...>` opening tag to append `data-manual-scoring="<subtype>"`
- For `submitButtonSelector`: inject `data-manual-submit` onto the matching button
- Add `data-mock-offsetHeight="40" data-mock-offsetWidth="120"` to submit button (required for `isPotentiallyViewable` check — per `docs/real-world-html-tests.md` § "Set element dimensions")
- Prepend `<!-- <url> -->` comment
- Call `node scripts/save-form-to-test-suite.js <filename> <htmlContent> <url>`

---

## Phase 6: Test Execution — `triage-llm/test-runner.js`

**Reuses:** Jest via `spawnSync('./node_modules/.bin/jest', ['--verbose=false', '-t', filename])`

**Function:** `runTestForForm(filename)` → `TestResult`

**Output parsing (`parseJestOutput`):**
- Look for `PASS` / `FAIL` in Jest stdout
- Parse the console.log blocks from `src/Form/input-classifiers.test.js:291-302` for per-field mismatches
- Extract `failures[]`, `submitFalsePositives`, `submitFalseNegatives` counts

**Critical file to understand:** `src/Form/input-classifiers.test.js` lines 168-311

---

## Phase 7: Fix Proposal — `triage-llm/fix-proposer.js`

**Only called when `testResult.passed === false`**

**Uses:** `@anthropic-ai/sdk`, model `claude-opus-4-6`

**Function:** `proposeFixAsync(testResult, labelingResult, rawDOM, url)` → `FixProposal`

**Prompt context provided to Claude:**
1. Mismatched fields (manual vs. inferred types)
2. Relevant DOM fragments for those inputs
3. Current CSS selectors for the mismatched type from `src/Form/matching-config/selectors-css.js` (read from disk)
4. Current DDG matcher regex from `src/Form/matching-config/matching-config-source.js` (read from disk)
5. Decision rule: prefer `remote-rule` if the fix is site-specific; prefer `algorithm` only if the pattern is broadly generalizable and won't regress other tests

**Output format:**
```json
{
  "fixType": "remote-rule | algorithm | cant-reproduce",
  "remoteRule": {
    "domain": "logon.vanguard.com",
    "inputTypeSettings": [{ "selector": "input[name='USER']", "type": "credentials.username" }],
    "reasoning": "..."
  },
  "summary": "..."
}
```

**For `remote-rule` fixes:** additionally emit the `gh pr create` command to open a draft PR against `duckduckgo/privacy-configuration` (requires a PAT with write access as a new GitHub secret).

---

## Phase 8: Report — `triage-llm/reporter.js`

**Function:** `generateReport(ctx)` → writes `triage-llm/reports/<filename>-<timestamp>.md`, returns path

**Report sections:**
1. Summary (URL, date, Asana link, test form path)
2. Visual labeling table (selector | subtype | confidence | reasoning)
3. Test results table (field | manual type | inferred type | mismatch)
4. Fix proposal (type + rule/patch + reasoning)
5. Next steps checklist

---

## CI Workflow — `.github/workflows/autofill-triage.yml` (new file)

```yaml
on:
  workflow_dispatch:
    inputs:
      url: { required: false }
      asana_task_id: { required: false }
  schedule:
    - cron: '0 2 * * *'   # nightly batch

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - checkout, setup-node (from .nvmrc), npm ci
      - npx playwright install chromium --with-deps
      - node triage-llm/pipeline.js [--url / --asana-task-id]
      - upload-artifact: triage-llm/reports/
```

**Required secrets:**
- `ANTHROPIC_API_KEY` — new, must be added to repo secrets
- `NATIVE_APPS_WORKFLOW` — already exists (Asana token, used by `asana-release.yml`)
- `AUTOFILL_BUGS_PROJECT_GID` — new, the GID of the "Autofill Bugs" Asana project
- `PRIVACY_CONFIG_PAT` — new, PAT with write access to `duckduckgo/privacy-configuration`

---

## Missing Tools / Gaps

| Gap | What's needed | Where it plugs in |
|---|---|---|
| Asana project GID | Constant or env var `AUTOFILL_BUGS_PROJECT_GID` | `asana-client.js` batch mode |
| Claude vision API | `ANTHROPIC_API_KEY` secret + `@anthropic-ai/sdk` dep | `visual-labeler.js`, `fix-proposer.js`, `url-resolver.js` |
| Privacy-config write access | `PRIVACY_CONFIG_PAT` GitHub secret | `fix-proposer.js` gh CLI call |
| Asana write-back | Already possible via existing `asana` SDK | `asana-client.js#postTriageComment` |
| Asana story/comment read | `fetchTaskStories` via existing SDK | `url-resolver.js` awaiting-reply detection |
| `waitUntil: networkidle` timeouts | Fallback to `load` + configurable timeout | `page-capture.js` |
| Ambiguous/missing URLs in tasks | Claude inference + Playwright probe + Asana comment loop | `url-resolver.js` |

---

## Verification

```bash
# 1. Install new dependency
npm install --save-dev @anthropic-ai/sdk

# 2. Run pipeline against a known URL (no Asana needed)
ANTHROPIC_API_KEY=sk-... node triage-llm/pipeline.js --url https://logon.vanguard.com/logon?site=pi

# 3. Run pipeline against an Asana task with a vague description (tests URL resolution)
ANTHROPIC_API_KEY=sk-... ASANA_ACCESS_TOKEN=... node triage-llm/pipeline.js --asana-task-id <gid>
# → If URL is ambiguous: should post a clarifying comment on the task and exit early
# → On re-run after reporter replies: should pick up the new comment and proceed

# 4. Check the saved test form
cat test-forms/logon_vanguard_com_login.html | grep data-manual-scoring

# 5. Check the test result
./node_modules/.bin/jest -t 'logon_vanguard_com_login.html'

# 6. Check the generated report
cat triage-llm/reports/logon_vanguard_com_login-*.md
```

## Critical Files to Read Before Implementing

- `src/Form/input-classifiers.test.js` — test harness, stdout format, scoring semantics
- `scripts/save-form-to-test-suite.js` — form saving contract
- `scripts/release/asana-create-tasks.js` — Asana SDK pattern to replicate
- `src/Form/matching-config/selectors-css.js` — read at fix-proposal time
- `src/Form/matching-config/matching-config-source.js` — read at fix-proposal time
- `.github/workflows/asana-release.yml` — reference for secret wiring in CI

### New file to implement

- `triage-llm/url-resolver.js` — implement `resolveUrl(taskName, taskNotes, rawUrl)` and the Playwright probe loop; the awaiting-reply detection logic lives in `pipeline.js` (check stories before calling `resolveUrl` again)
