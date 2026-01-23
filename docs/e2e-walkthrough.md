# E2E Testing System - Deep Dive Walkthrough

**Last Updated**: 2026-01-10
**Author**: Claude
**Purpose**: Comprehensive explanation of the E2E testing architecture, configuration, and patterns in Best Shot Frontend

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Deep Dive](#architecture-deep-dive)
3. [Authentication Modes Explained](#authentication-modes-explained)
4. [Configuration Layer](#configuration-layer)
5. [Test Writing Patterns](#test-writing-patterns)
6. [Step-by-Step Examples](#step-by-step-examples)
7. [Tag System & Filtering](#tag-system--filtering)
8. [Fixtures & Utilities](#fixtures--utilities)
9. [CI/CD Integration](#cicd-integration)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## System Overview

### What is E2E Testing?

End-to-End (E2E) testing validates the application from a user's perspective by simulating real browser interactions. Unlike unit tests that test isolated functions, E2E tests verify complete user flows.

```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                        ╱╲                                   │
│                       ╱  ╲     E2E Tests                   │
│                      ╱ 🔝 ╲    (Few, Slow, High Confidence) │
│                     ╱──────╲                                │
│                    ╱        ╲                               │
│                   ╱ 🔷🔷🔷🔷 ╲  Integration Tests           │
│                  ╱────────────╲  (More, Medium Speed)       │
│                 ╱              ╲                            │
│                ╱ 🔹🔹🔹🔹🔹🔹🔹🔹 ╲ Unit Tests               │
│               ╱────────────────────╲ (Many, Fast)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Testing Trophy Approach

Best Shot follows the **Testing Trophy** philosophy (popularized by Kent C. Dodds), which emphasizes **integration tests** over unit tests while using E2E tests for critical user flows.

```
Our Testing Strategy:
─────────────────────
┌─────────────────────────────────────────────────────────────┐
│  E2E Tests (Playwright)                                     │
│  └─ Critical paths: Login, Dashboard, Key User Journeys     │
├─────────────────────────────────────────────────────────────┤
│  Integration Tests (Vitest + RTL)  ← FOCUS HERE             │
│  └─ Component interactions, API mocking, State management   │
├─────────────────────────────────────────────────────────────┤
│  Unit Tests (Vitest)                                        │
│  └─ Pure functions, utilities, calculations                 │
└─────────────────────────────────────────────────────────────┘
```

### Core Principle

**E2E tests answer one question: "Does the app work for real users?"**

We test:
- ✅ Can users log in?
- ✅ Does the dashboard display correctly?
- ✅ Can users navigate between pages?
- ✅ Do critical features function end-to-end?

---

## Architecture Deep Dive

### Directory Structure Explained

```
e2e/
├── config/                    # Configuration Layer
│   ├── base.config.ts         # ← Shared settings (browsers, timeouts)
│   ├── demo.config.ts         # ← Demo mode: bypass authentication
│   └── auth0.config.ts        # ← Auth0 mode: real authentication
│
├── fixtures/                  # Reusable Test Fixtures
│   ├── auth.fixture.ts        # ← Extended test with auth helpers
│   └── auth0.setup.ts         # ← One-time Auth0 login setup
│
├── utils/                     # Shared Utilities
│   ├── selectors.ts           # ← Centralized element selectors
│   └── test-data.ts           # ← Test data generators
│
├── tests/                     # Test Files (Domain-Based)
│   ├── auth/                  # Authentication domain
│   │   ├── login-flow.spec.ts
│   │   └── signup-flow.spec.ts
│   │
│   ├── dashboard/             # Dashboard domain
│   │   ├── dashboard.spec.ts
│   │   └── dashboard-loading.spec.ts
│   │
│   ├── navigation/            # Navigation domain
│   │   ├── menu.spec.ts
│   │   └── home-page.spec.ts
│   │
│   └── smoke/                 # Cross-domain smoke tests
│       └── smoke.spec.ts
│
└── playwright.config.ts       # Root config (at project root)
```

### Why Domain-Based Organization?

Tests mirror the application's domain structure, making it easy to:

```
Application Structure          Test Structure
──────────────────────         ─────────────────
src/domains/                   e2e/tests/
├── authentication/       →    ├── auth/
├── dashboard/            →    ├── dashboard/
├── tournament/           →    ├── tournament/ (future)
├── league/               →    ├── leagues/ (future)
└── ui-system/            →    └── navigation/
```

**Benefits:**
1. **Discoverability**: Find tests where you expect them
2. **Ownership**: Domain teams own their tests
3. **Scalability**: Add new domains independently
4. **Parallel Development**: Teams don't conflict

---

## Authentication Modes Explained

### The Challenge

Best Shot uses Auth0 for authentication, which presents E2E testing challenges:

```
┌─────────────────────────────────────────────────────────────┐
│                    The Auth0 Problem                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  App (localhost:5173)  ──────→  Auth0 (external service)    │
│         │                              │                    │
│         │ 1. Click Login               │                    │
│         ▼                              │                    │
│  ┌─────────────────┐                   │                    │
│  │ Auth0 Popup     │ ◀─────────────────┘                    │
│  │ (Different      │   2. Enter credentials                 │
│  │  domain!)       │   3. Consent screen                    │
│  └────────┬────────┘   4. Rate limiting                     │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │ E2E Test Issues │                                        │
│  │ - Cross-domain  │                                        │
│  │ - Slow          │                                        │
│  │ - Rate limits   │                                        │
│  │ - Credentials   │                                        │
│  └─────────────────┘                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### The Solution: Dual Auth Modes

```
┌─────────────────────────────────────────────────────────────┐
│                    Auth Mode Solution                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────┐    ┌───────────────────────┐    │
│  │     DEMO MODE         │    │     AUTH0 MODE        │    │
│  │    (Default)          │    │    (Integration)      │    │
│  ├───────────────────────┤    ├───────────────────────┤    │
│  │                       │    │                       │    │
│  │  App runs in "demo"   │    │  Real Auth0 login     │    │
│  │  mode which bypasses  │    │  is performed once,   │    │
│  │  Auth0 entirely       │    │  state is saved and   │    │
│  │                       │    │  reused across tests  │    │
│  │  ✓ Fast               │    │  ✓ Realistic          │    │
│  │  ✓ No credentials     │    │  ✓ Tests auth flow    │    │
│  │  ✓ Works offline      │    │  ✓ Catches auth bugs  │    │
│  │                       │    │                       │    │
│  │  Use for:             │    │  Use for:             │    │
│  │  - Local dev          │    │  - Pre-production     │    │
│  │  - CI smoke tests     │    │  - Auth flow tests    │    │
│  │  - Quick feedback     │    │  - Full integration   │    │
│  │                       │    │                       │    │
│  └───────────────────────┘    └───────────────────────┘    │
│                                                             │
│  yarn test:e2e:demo           yarn test:e2e:auth0          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### How Auth0 Mode Works

```
┌─────────────────────────────────────────────────────────────┐
│                Auth0 Mode Flow                              │
└─────────────────────────────────────────────────────────────┘

Step 1: Setup Project Runs First
────────────────────────────────
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ auth0-setup │────▶│ Login via   │────▶│ Save state  │
│ project     │     │ Auth0       │     │ to disk     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                    .auth/auth0-state.json
                                    ┌─────────────────────┐
                                    │ {                   │
                                    │   cookies: [...],   │
                                    │   localStorage: {}  │
                                    │ }                   │
                                    └──────────┬──────────┘
                                               │
Step 2: Test Projects Load State               │
────────────────────────────────               ▼
┌─────────────────┐              ┌─────────────────────────┐
│ chromium-auth0  │◀─────────────│ storageState loaded     │
│ project         │              │ (already authenticated) │
└────────┬────────┘              └─────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  Tests run as authenticated user - no login needed!         │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration Layer

### Configuration Inheritance

```typescript
// The configuration flows from base → specific mode

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   base.config.ts (shared settings)                          │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  - testDir: '../tests'                              │   │
│   │  - fullyParallel: true                              │   │
│   │  - retries: CI ? 2 : 0                              │   │
│   │  - reporter: ['html', 'list']                       │   │
│   │  - trace: 'on-first-retry'                          │   │
│   │  - screenshot: 'only-on-failure'                    │   │
│   └────────────────────────┬────────────────────────────┘   │
│                            │                                │
│              ┌─────────────┴─────────────┐                  │
│              ▼                           ▼                  │
│   ┌─────────────────────┐     ┌─────────────────────┐      │
│   │   demo.config.ts    │     │   auth0.config.ts   │      │
│   │   ───────────────   │     │   ────────────────  │      │
│   │   + authMode: demo  │     │   + auth0-setup     │      │
│   │   + no auth state   │     │   + storageState    │      │
│   └─────────────────────┘     └─────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Configuration Options

```typescript
// e2e/config/base.config.ts

export const baseConfig: PlaywrightTestConfig = {
  // WHERE to find tests
  testDir: '../tests',
  
  // PARALLELISM - run tests concurrently
  fullyParallel: true,
  
  // CI BEHAVIOR
  forbidOnly: !!process.env.CI,  // Fail if test.only in CI
  retries: process.env.CI ? 2 : 0,  // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined,  // Sequential in CI
  
  // REPORTERS - how to output results
  reporter: [
    ['html', { outputFolder: '../../playwright-report' }],
    ['list'],  // Console output
  ],
  
  // DEFAULT SETTINGS for all tests
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',  // Capture trace on retry
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  // BROWSER PROJECTS
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
};
```

---

## Test Writing Patterns

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { dashboard } from '../../utils/selectors';

// Describe block with tag
test.describe('Feature Name @critical', () => {
  
  // Setup before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  // Individual test with additional tag
  test('should display greeting @smoke', async ({ page }) => {
    // Arrange - already done in beforeEach
    
    // Act & Assert
    await expect(dashboard.title(page)).toContainText('Hello,');
    await expect(dashboard.subtitle(page)).toBeVisible();
  });
});
```

### Selector Patterns

```typescript
// ❌ BAD: Fragile selectors
await page.click('.btn-primary');  // Class might change
await page.click('button:nth-child(2)');  // Position might change
await page.click('#submit');  // ID might be removed

// ✅ GOOD: Stable selectors
// 1. Test ID (explicit testing hooks)
await page.getByTestId('login-button').click();
// 2. Data attributes (our convention)
await page.locator('[data-ui="screen-heading"]').click();
// 3. Role-based (accessibility)
await page.getByRole('button', { name: 'Login' }).click();
```

### Wait Patterns

```typescript
// ❌ BAD: Arbitrary waits
await page.waitForTimeout(3000);  // Slow and flaky

// ✅ GOOD: Explicit waits
await page.waitForLoadState('networkidle');  // Wait for network
await page.waitForURL(/.*dashboard/);  // Wait for navigation
await expect(element).toBeVisible();  // Wait for element
await page.waitForSelector('[data-loaded="true"]');  // Wait for state
```

### Assertion Patterns

```typescript
// ❌ BAD: Weak assertions
expect(await page.textContent('body')).toBeTruthy();

// ✅ GOOD: Specific assertions
await expect(page).toHaveURL(/.*dashboard/);
await expect(page).toHaveTitle(/Best Shot/);
await expect(element).toBeVisible();
await expect(element).toContainText('Hello,');
await expect(element).toHaveAttribute('href', /\/tournaments/);
```

---

## Tag System & Filtering

### Available Tags

```
┌──────────────────────────────────────────────────────────────┐
│                        Tag Hierarchy                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  @smoke ──────── Quick validation (< 2 min total)            │
│     │            Run on every change                          │
│     │                                                         │
│  @critical ──── Must-pass for release                        │
│     │           Business-critical features                    │
│     │                                                         │
│  @slow ──────── Long-running tests (> 30 sec each)           │
│                 Complex flows, performance tests              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Tag Inheritance

```typescript
// Tags on describe blocks are inherited by all tests inside

test.describe('Dashboard @critical', () => {
  // This test has: @critical
  test('loads correctly', async ({ page }) => {});
  
  // This test has: @critical AND @smoke
  test('shows greeting @smoke', async ({ page }) => {});
});
```

### Filtering Commands

```bash
# Run all smoke tests
yarn test:e2e --grep @smoke

# Run critical tests only
yarn test:e2e --grep @critical

# Run tests that are BOTH smoke AND critical
yarn test:e2e --grep "@smoke.*@critical"

# EXCLUDE slow tests
yarn test:e2e --grep-invert @slow

# Run specific file
yarn test:e2e e2e/tests/dashboard/dashboard.spec.ts
```

---

## Fixtures & Utilities

### Selectors Utility

```typescript
// e2e/utils/selectors.ts

// Why centralize selectors?
// 1. Single source of truth
// 2. Easy to update when UI changes
// 3. Consistent across all tests
// 4. Self-documenting

export const dashboard = {
  screenHeading: (page: Page) => page.locator('[data-ui="screen-heading"]'),
  title: (page: Page) => page.locator('[data-ui="title"]'),
  subtitle: (page: Page) => page.locator('[data-ui="subtitle"]'),
  matchdaySection: (page: Page) => page.locator('[data-ui="matchday"]'),
  tournamentsPerformance: (page: Page) => page.locator('[data-ui="tournaments-perf"]'),
};

export const navigation = {
  menu: (page: Page) => page.locator('menu'),
  menuLinks: (page: Page) => page.locator('menu a'),
  menuLink: (page: Page, href: string) => page.locator(`menu a[href="${href}"]`),
};

export const auth = {
  loginButton: (page: Page) => page.getByRole('button', { name: 'LOGIN' }),
  signupButton: (page: Page) => page.getByRole('button', { name: 'SIGN UP' }),
};
```

### Test Data Utility

```typescript
// e2e/utils/test-data.ts

// Generate unique test data
export const generateTestEmail = (prefix = 'test') => {
  const timestamp = Date.now().toString().slice(-8);
  return `${prefix}${timestamp}@example.com`;
};

// Centralized URLs
export const testData = {
  urls: {
    dashboard: '/dashboard',
    login: '/login',
    signup: '/signup',
    tournaments: '/tournaments',
    leagues: '/leagues',
    myAccount: '/my-account',
  },
  
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    auth: 15000,
  },
};
```

### Auth Fixture

```typescript
// e2e/fixtures/auth.fixture.ts

// Extend the base test with authentication
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to dashboard (auth is handled by config)
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await use(page);
  },
  
  authUser: async ({}, use) => {
    const user = getTestUser();
    await use(user);
  },
});

// Usage in tests:
import { test, expect } from '../../fixtures/auth.fixture';

test('authenticated test', async ({ authenticatedPage, authUser }) => {
  // authenticatedPage is already logged in
  // authUser contains user info
});
```

---

## CI/CD Integration

### GitHub Workflow

```yaml
# .github/workflows/playwright.yml

name: E2E Tests (Scheduled)

# Run daily + manual trigger
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          
      - name: Install dependencies
        run: yarn install
        
      - name: Install Playwright browsers
        run: yarn playwright install --with-deps
        
      - name: Run tests
        run: yarn playwright test
        env:
          PLAYWRIGHT_BASE_URL: ${{ env.TARGET_URL }}
          
      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Why Scheduled (Not on PR)?

```
┌─────────────────────────────────────────────────────────────┐
│                  E2E Test Strategy                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PR Workflow (Fast Feedback):                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Lint   │─▶│  Type   │─▶│  Unit   │─▶│  Build  │        │
│  │ Check   │  │ Check   │  │ Tests   │  │         │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│       ▲                                                     │
│       └── Fast! (~2-5 min total)                           │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Scheduled E2E (Thorough):                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Full E2E Suite Against Live Environment            │   │
│  │  - Tests real auth                                   │   │
│  │  - Tests real APIs                                   │   │
│  │  - Tests real data                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│       ▲                                                     │
│       └── Slower (~15-30 min) but catches integration bugs │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting Guide

### Common Issues

#### 1. Element Not Found

```
Error: locator.click: Timeout 30000ms exceeded
```

**Diagnosis:**
```typescript
// Debug: Check if element exists
await page.pause();  // Opens Playwright Inspector

// Or add explicit wait
await expect(element).toBeVisible({ timeout: 10000 });
```

**Solutions:**
- Element might not be rendered yet → Add explicit wait
- Selector is wrong → Use Playwright Inspector to verify
- Element is in shadow DOM → Use `page.locator()` with proper selector

#### 2. Auth0 Tests Fail

```
Error: E2E_TEST_EMAIL and E2E_TEST_PASSWORD required
```

**Solutions:**
```bash
# Set environment variables
export E2E_TEST_EMAIL="test@example.com"
export E2E_TEST_PASSWORD="password123"

# Or use .env.e2e file (gitignored)
echo "E2E_TEST_EMAIL=test@example.com" >> .env.e2e
echo "E2E_TEST_PASSWORD=password123" >> .env.e2e
```

#### 3. Flaky Tests

**Symptoms:** Test passes sometimes, fails other times

**Common Causes & Solutions:**

```typescript
// ❌ Race condition: Clicking before element is ready
await page.click('button');

// ✅ Wait for visibility first
await expect(page.getByRole('button')).toBeVisible();
await page.getByRole('button').click();

// ❌ Network timing: Data not loaded
await page.goto('/dashboard');
await expect(page.locator('.data')).toHaveText('loaded');

// ✅ Wait for network idle
await page.goto('/dashboard');
await page.waitForLoadState('networkidle');
await expect(page.locator('.data')).toHaveText('loaded');
```

#### 4. CI Failures (Works Locally)

**Common Causes:**
- Different viewport size
- Different timezone
- Missing dependencies
- Network differences

**Solutions:**
```typescript
// Force viewport
test.use({ viewport: { width: 1280, height: 720 } });

// Handle timezone
test.use({ timezoneId: 'UTC' });

// Increase timeout for CI
test.setTimeout(60000);
```

### Debug Commands

```bash
# Run with headed browser (see what's happening)
yarn test:e2e --headed

# Run with Playwright Inspector
PWDEBUG=1 yarn test:e2e

# Run with trace recording
yarn test:e2e --trace on

# Generate report after failure
yarn playwright show-report
```

---

## Quick Reference

### Commands Cheat Sheet

| Command | Description |
|---------|-------------|
| `yarn test:e2e` | Run all tests |
| `yarn test:e2e:demo` | Run with demo auth |
| `yarn test:e2e:auth0` | Run with Auth0 |
| `yarn test:e2e:ui` | Open Playwright UI |
| `yarn test:smoke` | Run smoke tests only |
| `yarn test:e2e --headed` | Show browser |
| `yarn test:e2e --debug` | Debug mode |

### Files Cheat Sheet

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Main config |
| `e2e/config/base.config.ts` | Shared settings |
| `e2e/config/demo.config.ts` | Demo mode |
| `e2e/config/auth0.config.ts` | Auth0 mode |
| `e2e/fixtures/auth.fixture.ts` | Auth helpers |
| `e2e/utils/selectors.ts` | Element selectors |
| `e2e/utils/test-data.ts` | Test data |

---

*Last updated: 2026-01-10*










