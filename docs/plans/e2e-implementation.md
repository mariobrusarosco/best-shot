# E2E Implementation Plan

This plan outlines the detailed restoration and implementation of the End-to-End testing infrastructure using Playwright, focusing initially on the **Demo Environment** (`https://best-shot.demo.mario.productions/login`).

The implementation strictly follows the architecture defined in `docs/e2e-walkthrough.md`.

## Phase 1: Infrastructure & Configuration (Demo Focus)

**Goal:** Restore the missing `e2e/` directory structure, establish the configuration hierarchy, and set up the shared utility layer.

### Tasks

#### Task 1.1 - Scaffold E2E Directory Structure [x]

- [x] Create root `e2e/` directory.
- [x] Create configuration directory: `e2e/config/`.
- [x] Create fixtures directory: `e2e/fixtures/`.
- [x] Create utilities directory: `e2e/utils/`.
- [x] Create tests root directory: `e2e/tests/`.
- [x] Create domain-specific test folders: `e2e/tests/auth/`, `e2e/tests/dashboard/`, `e2e/tests/navigation/`, `e2e/tests/smoke/`.

#### Task 1.2 - Implement Configuration Layer [x]

- [x] Create `e2e/config/base.config.ts`.
  - [x] Define shared `testDir`, `retries`, `workers`, and `reporter` settings.
  - [x] Define common `use` options (trace, screenshot, video).
- [x] Create `e2e/config/demo.config.ts`.
  - [x] Import and extend `baseConfig`.
  - [x] Set default `baseURL` to `https://best-shot.demo.mario.productions`.
  - [x] Configure it to run independent of the local dev server (for this specific phase).
- [x] Create `playwright.config.ts` (Root Config).
  - [x] Set up as the default entry point.
  - [x] Configure to default to the demo environment if no specific config is passed (or simple export).

#### Task 1.3 - Implement Shared Utilities [x]

- [x] Create `e2e/utils/selectors.ts`.
  - [x] Define `dashboard` selectors (Screen heading, title, subtitle).
  - [x] Define `navigation` selectors (Menu, links).
  - [x] Define `auth` selectors (Login button, Sign up button).
- [x] Create `e2e/utils/test-data.ts`.
  - [x] Define `urls` constant (Routes for dashboard, login, etc.).
  - [x] Define `timeouts` constant.
- [x] Create `e2e/fixtures/auth.fixture.ts`.
  - [x] Implement `authenticatedPage` fixture to handle auto-login (initially via UI interaction for Demo mode).
  - [x] Implement `authUser` fixture stub.

## Phase 2: Smoke & Critical Path Tests (Demo Environment)

**Goal:** Implement the initial suite of tests to validate the "Demo" environment, ensuring the application loads and the primary user flow (Demo Login) functions correctly.

### Tasks

#### Task 2.1 - Implement Smoke Test Suite [x]

- [x] Create `e2e/tests/smoke/smoke.spec.ts`.
- [x] Implement `test('should load application')`:
  - [x] Navigate to base URL.
  - [x] Verify page title contains "Best Shot".
  - [x] Tag test with `@smoke`.

#### Task 2.2 - Implement Authentication (Demo Mode) Suite [x]

- [x] Create `e2e/tests/auth/login.spec.ts`.
- [x] Implement `test('should login via demo mode')`:
  - [x] Navigate to `/login`.
  - [x] Click the "Demo" or "Login" button (depending on UI state).
  - [x] Assert redirection to `/dashboard`.
  - [x] Tag test with `@critical`.

#### Task 2.3 - Implement Dashboard Verification Suite [x]

- [x] Create `e2e/tests/dashboard/dashboard.spec.ts`.
- [x] Implement `test('should display core dashboard elements')`:
  - [x] Use `authenticatedPage` fixture (skipping manual login steps in the test).
  - [x] Use `dashboard` selectors from utils.
  - [x] Verify visibility of "Hello" greeting.
  - [x] Verify visibility of main navigation menu.

## Phase 3: Validation & CI Preparation

**Goal:** Ensure the tests run reliably via the CLI and are ready for CI integration.

### Tasks

#### Task 3.1 - Local Execution Verification [x]

- [x] Run `yarn test:e2e:demo` locally.
- [x] Verify console output format.
- [x] Verify HTML report generation (`playwright-report/`).
- [x] Verify screenshots/traces on failure (simulate a failure if needed).

#### Task 3.2 - CI Configuration Review [x]

- [x] Review `.github/workflows/playwright.yml`.
- [x] Confirm the workflow accepts the `demo` environment or can be triggered to run against the live URL.

## Dependencies

- Existing `docs/e2e-walkthrough.md` for architectural reference.
- `package.json` scripts (specifically `test:e2e:demo`).

## Expected Result

- A fully populated `e2e/` directory matching the documentation.
- A passing test suite against `https://best-shot.demo.mario.productions`.
- Reusable selectors and configuration for future expansion.

## Next Steps

- Wait for user approval of this detailed plan.
- Begin execution of Phase 1, starting with Task 1.1.
