# DemoBlaze QA Automation Challenge

Playwright + TypeScript E2E framework for **https://www.demoblaze.com**. Includes test case documentation, browser UI tests, API example, lightweight performance smoke check, and GitHub Actions CI.

## Setup

Requirements: Node.js **22+**, npm. From repository root:

```bash
npm install
npx playwright install --with-deps
cp .env.example .env             # optional (Windows: copy .env.example .env)
npm run typecheck
npm run test:smoke -- --project=chromium
```

Without `DEMOBLAZE_USERNAME` / `DEMOBLAZE_PASSWORD`, the valid-login test **creates a unique test user** via the site's Sign up UI; this writes test data to the public demo site. To use an existing *test* account, configure those variables in `.env` locally or GitHub Actions secrets. Never commit real credentials. The cart flow doesn't require login; it is intentionally kept independent.

## Test commands

| Command | Purpose |
|---|---|
| `npm test` | Full UI/API/performance suite on Chromium, Firefox, WebKit, mobile Chrome |
| `npm run test:smoke -- --project=chromium` | Key successful login and purchase flows |
| `npm run test:regression -- --project=chromium` | Tagged regression tests |
| `npm run test:api -- --project=chromium` | Catalog API example |
| `npm run test:performance -- --project=chromium` | Navigation duration smoke check |
| `npm run test:headed` | Watch UI actions |
| `npm run report` | Open HTML report |
| `npm run typecheck` | Validate TypeScript |

Examples: `npx playwright test tests/ui/cart.spec.ts --project=firefox`; `npx playwright test --grep LOGIN-001 --headed --project=chromium`.

## Framework structure

```
playwright.config.ts           # timeouts, project/browser matrix, reports, CI retries
src/pages/HomePage.ts          # login, signup, product selection, add to cart
src/pages/CartPage.ts          # cart assertions, deletion, checkout
src/fixtures/data.ts           # isolated test fixtures and user factory
src/utils/alerts.ts            # reliable native JS alert capture and assertions
tests/ui/                     # auth/cart E2E coverage (smoke/regression)
tests/api/                    # HTTP API check (independent test type)
tests/performance/            # basic threshold check (not load testing)
.github/workflows/            # GitHub Actions multi-browser CI
Test_Cases_DemoBlaze.xlsx     # manual suite and execution status
```

**Architecture:** Page Object Model encapsulates locators; test data separated from logic; explicit UI / dialog expectations instead of fixed sleeps. Test projects supply cross-browser and mobile viewport/emulation coverage (mobile emulation isn't a real Android device). Headless by default. Test execution keeps workers at 1 locally to reduce shared public-site interference; CI uses 2 and retries failures, recording diagnostics. No retries hide a consistent failure.

## Reporting and CI

Built-in HTML, JUnit XML, list output; traces/screenshots/videos retained on failed runs. HTML: `playwright-report/index.html`; JUnit: `test-results/junit.xml`. GitHub Actions installs browsers/dependencies, typechecks, runs tests, uploads reports after failures. For GitLab/Jenkins use `npm install && npx playwright install --with-deps && npm test`; ingest the JUnit path.

## CI Execution Evidence

The Playwright automation framework was successfully executed through GitHub Actions.
Workflow: Playwright E2E
Result: Success
Duration: 2 minutes 1 second
Workflow run: https://github.com/qapham0512/demoblaze-qa-automation/actions/runs/39022697097
The workflow installs project dependencies and Playwright browsers, performs TypeScript type checking, executes the automated tests, and uploads the Playwright report as an artifact.
Note: This result applies to the specific commit associated with the linked workflow run. Subsequent changes require a new CI execution to verify their status.

## Manual test suite

Workbook includes Login and Cart/Checkout test cases (positive, negative, boundary/edge), priority, preconditions, steps, expected behavior, automation candidates, and `Not Run` default status. **Expected behavior is an intended quality requirement, not evidence that DemoBlaze currently implements it** (notably validation of card formats, empty-cart checkout, and duplicate items). Verify the application's actual behavior and report defects as appropriate; do not mark such cases Pass without execution.

## Scope, constraints, and test isolation

- Website is a public third-party demo; test results can be affected by network latency, uptime, backend state, site changes, and shared accounts.
- Cart tests start in fresh isolated browser contexts with an empty local cart and use the known `Samsung galaxy s6` fixture (listed as `$360` at authoring). Price changes require fixture update; robust production tests could fetch product price dynamically instead.
- An order creates demo-site data. Do not use real payment card or personal details (customer data is fictitious).
- Purchase-success assertions verify confirmation text, order id, name, card and total; no actual payment is processed. Site-side persistence and order history are out of scope.
- API test uses publicly exposed `https://api.demoblaze.com/entries` endpoint; endpoints may change. Performance example is a single run duration assertion, **not** true performance/load testing. For production-grade performance use k6/Artillery plus defined p95/p99 and error-rate thresholds.
- Login failure tests assert observed demo-site alert wording; behavior/wording changes must be reviewed rather than silently ignored.


## Submission and execution notes

The repository does **not** include `node_modules`, generated Playwright reports, or local secrets. Before claiming a successful CI run, check the GitHub Actions run for the latest commit. The test suite uses a public third-party service; occasional failures must be investigated from traces rather than suppressed.

**Execution evidence:** Local execution results belong to the author’s machine. This source package does not assert that all browsers pass in CI. Re-run `npm test` after checkout and attach the resulting GitHub Actions run when available.
