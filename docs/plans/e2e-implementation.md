# E2E Implementation Plan

This plan outlines the detailed restoration and implementation of the End-to-End testing infrastructure using Playwright, focusing initially on the **Demo Environment** (`https://best-shot.demo.mario.productions/login`).

The implementation strictly follows the architecture defined in `docs/e2e-walkthrough.md`.

## Phase 1: Infrastructure & Configuration (Demo Focus)

**Goal:** Restore the missing `e2e/` directory structure, establish the configuration hierarchy, and set up the shared utility layer.

### Tasks

#### Task 1.1 - Scaffold E2E Directory Structure []
- [ ] Create root `e2e/` directory.
- [ ] Create configuration directory: `e2e/config/`.
- [ ] Create fixtures directory: `e2e/fixtures/`.
- [ ] Create utilities directory: `e2e/utils/`.
- [ ] Create tests root directory: `e2e/tests/`.
- [ ] Create domain-specific test folders: `e2e/tests/auth/`, `e2e/tests/dashboard/`, `e2e/tests/navigation/`, `e2e/tests/smoke/`.

#### Task 1.2 - Implement Configuration Layer []
- [ ] Create `e2e/config/base.config.ts`.
    - [ ] Define shared `testDir`, `retries`, `workers`, and `reporter` settings.
    - [ ] Define common `use` options (trace, screenshot, video).
- [ ] Create `e2e/config/demo.config.ts`.
    - [ ] Import and extend `baseConfig`.
    - [ ] Set default `baseURL` to `https://best-shot.demo.mario.productions`.
    - [ ] Configure it to run independent of the local dev server (for this specific phase).

#### Task 1.3 - Implement Shared Utilities []
- [ ] Create `e2e/utils/selectors.ts`.
    - [ ] Define `dashboard` selectors (Screen heading, title, subtitle).
    - [ ] Define `navigation` selectors (Menu, links).
    - [ ] Define `auth` selectors (Login button, Sign up button).
- [ ] Create `e2e/utils/test-data.ts`.
    - [ ] Define `urls` constant (Routes for dashboard, login, etc.).
    - [ ] Define `timeouts` constant.

## Phase 2: Smoke & Critical Path Tests (Demo Environment)

**Goal:** Implement the initial suite of tests to validate the "Demo" environment, ensuring the application loads and the primary user flow (Demo Login) functions correctly.

### Tasks

#### Task 2.1 - Implement Smoke Test Suite []
- [ ] Create `e2e/tests/smoke/smoke.spec.ts`.
- [ ] Implement `test('should load application')`:
    - [ ] Navigate to base URL.
    - [ ] Verify page title contains "Best Shot".
    - [ ] Tag test with `@smoke`.

#### Task 2.2 - Implement Authentication (Demo Mode) Suite []
- [ ] Create `e2e/tests/auth/login.spec.ts`.
- [ ] Implement `test('should login via demo mode')`:
    - [ ] Navigate to `/login`.
    - [ ] Click the "Demo" or "Login" button (depending on UI state).
    - [ ] Assert redirection to `/dashboard`.
    - [ ] Tag test with `@critical`.

#### Task 2.3 - Implement Dashboard Verification Suite []
- [ ] Create `e2e/tests/dashboard/dashboard.spec.ts`.
- [ ] Implement `test('should display core dashboard elements')`:
    - [ ] Use `dashboard` selectors from utils.
    - [ ] Verify visibility of "Hello" greeting.
    - [ ] Verify visibility of main navigation menu.

## Phase 3: Validation & CI Preparation

**Goal:** Ensure the tests run reliably via the CLI and are ready for CI integration.

### Tasks

#### Task 3.1 - Local Execution Verification []
- [ ] Run `yarn test:e2e:demo` locally.
- [ ] Verify console output format.
- [ ] Verify HTML report generation (`playwright-report/`).
- [ ] Verify screenshots/traces on failure (simulate a failure if needed).

#### Task 3.2 - CI Configuration Review []
- [ ] Review `.github/workflows/playwright.yml`.
- [ ] Confirm the workflow accepts the `demo` environment or can be triggered to run against the live URL.

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
