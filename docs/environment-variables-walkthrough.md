# Environment Variables System - Deep Dive Walkthrough

**Last Updated**: 2026-01-16
**Author**: Claude
**Purpose**: Comprehensive explanation of the environment variable architecture, configuration modes, and usage patterns in Best Shot Frontend

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Deep Dive](#architecture-deep-dive)
3. [Environment Modes Explained](#environment-modes-explained)
4. [Variable Categories](#variable-categories)
5. [Configuration Files](#configuration-files)
6. [The Mode Adapter Pattern](#the-mode-adapter-pattern)
7. [TypeScript Integration](#typescript-integration)
8. [Build-time vs Runtime Variables](#build-time-vs-runtime-variables)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [FAQ](#faq-frequently-asked-questions)
11. [Quick Reference](#quick-reference)

---

## System Overview

### What Are Environment Variables?

Environment variables are configuration values that change based on where your application runs. They keep sensitive data (API keys, credentials) out of source code and allow the same codebase to behave differently in different environments.

```
┌─────────────────────────────────────────────────────────────┐
│                Environment Variable Flow                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  .env file  ──────▶  Vite  ──────▶  import.meta.env       │
│  (on disk)         (build)         (in code)                │
│                                                             │
│  ✓ Secret keys                    ✓ Type-safe              │
│  ✓ API URLs                       ✓ Autocomplete           │
│  ✓ Feature flags                  ✓ Validated              │
│  ✓ Not committed                  ✓ Available at runtime   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Core Principle

**Environment variables answer: "How does the app behave in THIS environment?"**

The same codebase can:
- ✅ Use real Auth0 in production
- ✅ Bypass auth in demo mode
- ✅ Connect to staging API for testing
- ✅ Mock user IDs for local development

### Complete Workflow: From Local to Production

```
┌─────────────────────────────────────────────────────────────┐
│            Full Development & Deployment Flow               │
└─────────────────────────────────────────────────────────────┘

PHASE 1: Local Development
───────────────────────────
Developer's Machine
    │
    ├─ Create .env file (from .env.example)
    ├─ Add credentials (Auth0, API keys, etc.)
    ├─ Run: yarn dev
    │
    └─ Vite reads .env → Builds app → http://localhost:5173
                          │
                          ▼
                   Test features locally

PHASE 2: Commit Code (Not Secrets!)
────────────────────────────────────
    │
    ├─ git add src/  ← Code changes only
    ├─ .env files are gitignored ← Secrets stay local
    ├─ git commit -m "feat: add new feature"
    └─ git push origin main
           │
           ▼

PHASE 3: CI/CD Deployment (GitHub Actions)
───────────────────────────────────────────
GitHub Detects Push → Triggers Workflow (.github/workflows/main.yaml)
    │
    ├─ Step 1: Checkout code
    ├─ Step 2: Install dependencies
    ├─ Step 3: Inject secrets from GitHub Environment
    │          │
    │          ├─ VITE_AUTH_DOMAIN: ${{ secrets.VITE_AUTH_DOMAIN }}
    │          ├─ VITE_AUTH_CLIENT_ID: ${{ secrets.VITE_AUTH_CLIENT_ID }}
    │          └─ ... (all other secrets)
    │
    ├─ Step 4: Build (yarn build --mode demo/staging/production)
    │          │
    │          └─ Secrets compiled into JS bundles
    │
    ├─ Step 5: Deploy to AWS S3
    └─ Step 6: Invalidate CloudFront cache
           │
           ▼
    Live Application (demo/staging/production)

    Users access: https://best-shot-demo.mariobrusarosco.com
                  https://best-shot-staging.mariobrusarosco.com
                  https://bestshot.app

KEY POINTS:
───────────
✅ Local: Secrets in .env files (gitignored)
✅ CI/CD: Secrets from GitHub Environments (not in Git)
✅ Build-time: Variables compiled into JavaScript
✅ Runtime: Users get pre-built bundles with secrets baked in
```

---

## Architecture Deep Dive

### Key Files

**Environment Files** (all gitignored):
- `.env`, `.env.demo`, `.env.staging`, `.env.production`, `.env.e2e` - Actual secrets
- `.env.*.example` - Templates (committed to git)

**Configuration**:
- `vite.config.ts` - Reads .env files and compiles variables
- `src/vite-env.d.ts` - TypeScript types for `import.meta.env`
- `global.d.ts` - TypeScript types for `process.env`

**Mode Detection**:
- `src/domains/global/typing.ts` - `APP_MODES` type definition
- `src/domains/global/utils.ts` - `APP_MODE` constant from `import.meta.env.MODE`
- `src/domains/authentication/index.ts` - Mode adapter pattern implementation

### Loading Strategy

**Local**: `yarn dev` → loads `.env` | `yarn dev-demo` → loads `.env` + `.env.demo`

**CI/CD**: GitHub Actions → GitHub Secrets → `env:` in workflow → Vite build

**Priority**: `.env.[mode].local` > `.env.[mode]` > `.env.local` > `.env`

**Key Rule**: Variables with `VITE_` prefix are exposed to client code via `import.meta.env`

---

## Environment Modes Explained

### The Four Modes

```
┌─────────────────────────────────────────────────────────────┐
│                      Mode Matrix                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────┐    ┌───────────────────────┐    │
│  │     LOCAL-DEV         │    │       DEMO            │    │
│  │   (Development)       │    │   (Demo/Testing)      │    │
│  ├───────────────────────┤    ├───────────────────────┤    │
│  │                       │    │                       │    │
│  │  Auth: Auth0          │    │  Auth: Bypass         │    │
│  │  API: localhost:9090  │    │  API: demo server     │    │
│  │  Sentry: Disabled     │    │  Sentry: Enabled      │    │
│  │  User: Mock ID        │    │  User: Mock ID        │    │
│  │                       │    │  Flag: DEMO_VERSION   │    │
│  │  Use for:             │    │  Use for:             │    │
│  │  - Local development  │    │  - Quick demos        │    │
│  │  - Running backend    │    │  - No auth needed     │    │
│  │  - Full features      │    │  - Stakeholder shows  │    │
│  │                       │    │                       │    │
│  │  yarn dev             │    │  yarn dev-demo        │    │
│  └───────────────────────┘    └───────────────────────┘    │
│                                                             │
│  ┌───────────────────────┐    ┌───────────────────────┐    │
│  │      STAGING          │    │     PRODUCTION        │    │
│  │   (Pre-Production)    │    │      (Live App)       │    │
│  ├───────────────────────┤    ├───────────────────────┤    │
│  │                       │    │                       │    │
│  │  Auth: Auth0          │    │  Auth: Auth0          │    │
│  │  API: staging server  │    │  API: prod server     │    │
│  │  Sentry: Enabled      │    │  Sentry: Enabled      │    │
│  │  User: Real users     │    │  User: Real users     │    │
│  │                       │    │  Mock ID: NEVER       │    │
│  │  Use for:             │    │  Use for:             │    │
│  │  - QA testing         │    │  - End users          │    │
│  │  - Integration tests  │    │  - Production data    │    │
│  │  - Pre-release        │    │  - Real money         │    │
│  │                       │    │                       │    │
│  │  yarn dev-staging     │    │  yarn dev-prod        │    │
│  └───────────────────────┘    └───────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mode Selection Logic

```typescript
// src/domains/global/utils.ts
import type { APP_MODES } from "@/domains/global/typing";

// import.meta.env.MODE comes from Vite's --mode flag
export const APP_MODE = import.meta.env.MODE as APP_MODES;
```

### Decision Tree: Which Mode Should I Use?

```
┌─────────────────────────────────────────────────────────────┐
│              Mode Selection Decision Tree                   │
└─────────────────────────────────────────────────────────────┘

START: What are you trying to do?
    │
    ├─ Developing features locally with backend running?
    │  └─► Use: yarn dev (local-dev mode)
    │      ✅ Real Auth0
    │      ✅ Local API (localhost:9090)
    │      ✅ Full feature access
    │
    ├─ Quick demo for stakeholders (no backend needed)?
    │  └─► Use: yarn dev-demo (demo mode)
    │      ✅ Bypass Auth0 (instant login)
    │      ✅ Demo API server
    │      ✅ Mocked data
    │
    ├─ Testing integration before release?
    │  └─► Use: yarn dev-staging (staging mode)
    │      ✅ Real Auth0
    │      ✅ Staging API
    │      ✅ Pre-production data
    │
    ├─ Testing prod configuration locally?
    │  └─► Use: yarn dev-prod (production mode)
    │      ✅ Real Auth0
    │      ✅ Production API (⚠️  be careful!)
    │      ⚠️  Only for debugging production issues
    │
    └─ Deploying to live users?
       └─► Push to:
           • main branch → demo + production deploy
           • staging branch → staging deploy
           (GitHub Actions handles the build)

QUICK RULES:
────────────
• Daily dev work? → yarn dev
• Show stakeholders? → yarn dev-demo
• Pre-release testing? → yarn dev-staging
• Production debugging? → yarn dev-prod (caution!)
• Deploying? → git push (CI/CD handles it)
```

---

## Variable Categories

| Category | Variables | Used By | Notes |
|----------|-----------|---------|-------|
| **Authentication** | `VITE_AUTH_DOMAIN`<br>`VITE_AUTH_CLIENT_ID` | Auth0 adapter<br>`src/domains/authentication/adapters/auth-0/` | Required for Auth0 modes |
| **API Endpoints** | `VITE_BEST_SHOT_API`<br>`VITE_BEST_SHOT_API_V2` | All API calls<br>`@/api` | Changes per environment |
| **Testing/Dev** | `VITE_MOCKED_MEMBER_PUBLIC_ID`<br>`VITE_DEMO_VERSION` | Bypass adapter<br>`src/domains/authentication/adapters/bypass/` | Demo/staging only<br>**Never in production** |
| **Feature Flags** | `VITE_LAUNCHDARKLY_CLIENT_KEY` | Feature flag system<br>`src/configuration/feature-flag/` | Per-environment keys |
| **Monitoring** | `VITE_SENTRY_DSN` (runtime)<br>`SENTRY_AUTH_TOKEN` (build-time) | Sentry integration<br>`src/configuration/monitoring/`<br>`vite.config.ts` | Note: Different prefixes! |
| **E2E Testing** | `E2E_TEST_EMAIL`<br>`E2E_TEST_PASSWORD` | Playwright tests<br>`e2e/fixtures/auth0.setup.ts` | No `VITE_` prefix |

**Key Examples**:

```typescript
// Authentication
<Auth0Provider domain={import.meta.env.VITE_AUTH_DOMAIN} />

// API calls (changes per environment automatically)
const api = axios.create({ baseURL: import.meta.env.VITE_BEST_SHOT_API });

// Demo mode detection
const isDemoMode = import.meta.env.VITE_DEMO_VERSION === 'true';

// Monitoring (two contexts!)
Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN }); // Runtime
sentryVitePlugin({ authToken: process.env.SENTRY_AUTH_TOKEN }); // Build-time
```

---

## Configuration Files

### Local Development: .env Files

For **local testing** of different modes, you need `.env` files (gitignored):

```
┌─────────────────────────────────────────────────────────────┐
│           Local Testing vs CI/CD Deployment                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LOCAL TESTING (on your machine)                            │
│  ──────────────────────────────────                         │
│  $ yarn dev          → needs .env file                      │
│  $ yarn dev-demo     → needs .env.demo file                 │
│  $ yarn dev-staging  → needs .env.staging file              │
│  $ yarn dev-prod     → needs .env.production file           │
│                                                             │
│  All files are gitignored - never committed                 │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  CI/CD DEPLOYMENT (GitHub Actions)                          │
│  ───────────────────────────────────                        │
│  Push to main/staging → GitHub Secrets used                 │
│  No .env files needed in CI                                 │
│  Secrets managed in GitHub UI                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Setup for Local Testing:**

```bash
# Minimal setup (most common - for daily development)
cp .env.example .env
vim .env  # Add your local credentials

# Optional: If you want to test other modes locally
cp .env.demo.example .env.demo          # For yarn dev-demo
cp .env.staging.example .env.staging    # For yarn dev-staging
cp .env.production.example .env.production  # For yarn dev-prod
```

**Most developers only need `.env`** for daily work (`yarn dev`). The other files are optional for local testing of demo/staging/production modes.

**.env.example (Local Development Template)**
```bash
# Auth0 Configuration
VITE_AUTH_DOMAIN="<your-auth0-domain>"
VITE_AUTH_CLIENT_ID="<your-auth0-client-id>"

# API Endpoints (Local Backend)
VITE_BEST_SHOT_API="http://localhost:9090/api/v1"
VITE_BEST_SHOT_API_V2="http://localhost:9090/api/v2"

# Test User ID
VITE_MOCKED_MEMBER_PUBLIC_ID="<local-test-user-id>"

# Feature Flags
VITE_LAUNCHDARKLY_CLIENT_KEY="<your-launchdarkly-client-key>"

# Monitoring
VITE_SENTRY_DSN="<your-sentry-dsn>"
SENTRY_AUTH_TOKEN="<your-sentry-auth-token>"
```

**Important:**
- ✅ `.env` files are for LOCAL testing only
- ✅ Never commit `.env` files (they're gitignored)
- ✅ Deployed environments use GitHub Secrets (not .env files)

### CI/CD: GitHub Environment Secrets

For deployed environments (demo/staging/production), secrets are stored in **GitHub Environment Secrets**, not in `.env` files.

**Setup GitHub Secrets:**

1. Go to GitHub repository → **Settings** → **Environments**
2. Select environment: `demo`, `staging`, or `production`
3. Click **Add secret** and configure each variable:

```
VITE_AUTH_DOMAIN               = "your-auth0-domain"
VITE_AUTH_CLIENT_ID            = "your-auth0-client-id"
VITE_BEST_SHOT_API             = ""
VITE_BEST_SHOT_API_V2          = ""
VITE_MOCKED_MEMBER_PUBLIC_ID   = "demo-test-user-id"
VITE_DEMO_VERSION              = "true"
VITE_LAUNCHDARKLY_CLIENT_KEY   = "your-launchdarkly-key"
VITE_SENTRY_DSN                = "your-sentry-dsn"
SENTRY_AUTH_TOKEN              = "your-sentry-auth-token"
```
# NOTE: Do NOT set VITE_MOCKED_MEMBER_PUBLIC_ID in production
```

**Benefits of GitHub Secrets:**
- ✅ **No secrets in Git history** (more secure)
- ✅ **Centralized secret management** (GitHub UI)
- ✅ **Different secrets per environment** (demo/staging/production)
- ✅ **Audit trail** (who changed what, when)
- ✅ **Team access control** (role-based permissions)

### E2E Testing: .env.e2e

```bash
# E2E Test Credentials (gitignored)
# Copy from .env.e2e.example

E2E_TEST_EMAIL=testuser123@example.com
E2E_TEST_PASSWORD=TestPassword123!
```

---

## TypeScript Integration

Environment variables are fully typed for safety:

```typescript
// src/vite-env.d.ts - Defines all available variables
interface ImportMetaEnv {
  readonly VITE_AUTH_DOMAIN: string;
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly VITE_BEST_SHOT_API: string;
  readonly MODE: "local-dev" | "demo" | "staging" | "production";
  // ... more variables
}

// src/domains/global/typing.ts - Valid modes
export type APP_MODES = "local-dev" | "demo" | "staging" | "production";
```

**Benefits**: ✅ Autocomplete | ✅ Type checking | ✅ Prevents typos | ✅ IDE suggestions

---

## Build-time vs Runtime Variables

### The Key Difference

```
┌─────────────────────────────────────────────────────────────┐
│              Build-time vs Runtime Variables                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BUILD-TIME (Vite Config)                                   │
│  ──────────────────────────                                 │
│  Access: process.env.VARIABLE_NAME                          │
│  Prefix: Any (no VITE_ required)                            │
│  Scope: vite.config.ts only                                 │
│  Timing: During build/dev server startup                    │
│                                                             │
│  Example:                                                   │
│  sentryVitePlugin({                                         │
│    authToken: process.env.SENTRY_AUTH_TOKEN,  ← No VITE_   │
│  })                                                         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  RUNTIME (Application Code)                                 │
│  ───────────────────────────                                │
│  Access: import.meta.env.VITE_VARIABLE_NAME                 │
│  Prefix: VITE_ (required!)                                  │
│  Scope: All src/ files                                      │
│  Timing: When app runs in browser                           │
│                                                             │
│  Example:                                                   │
│  Sentry.init({                                              │
│    dsn: import.meta.env.VITE_SENTRY_DSN,  ← Needs VITE_    │
│  })                                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Why Two Different Systems?

```typescript
// ❌ WRONG: Using process.env in app code
function MyComponent() {
  const apiUrl = process.env.VITE_BEST_SHOT_API; // undefined!
  return <div>{apiUrl}</div>;
}

// ✅ CORRECT: Using import.meta.env in app code
function MyComponent() {
  const apiUrl = import.meta.env.VITE_BEST_SHOT_API; // Works!
  return <div>{apiUrl}</div>;
}

// ❌ WRONG: Using import.meta.env in vite.config.ts
export default defineConfig(({ mode }) => ({
  plugins: [
    sentryVitePlugin({
      authToken: import.meta.env.SENTRY_AUTH_TOKEN, // undefined!
    }),
  ],
}));

// ✅ CORRECT: Using process.env in vite.config.ts
export default defineConfig(({ mode }) => ({
  plugins: [
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN, // Works!
    }),
  ],
}));
```

### Sentry: Both Contexts

```typescript
// vite.config.ts (Build-time)
export default defineConfig(({ mode }) => ({
  plugins: [
    SENTRY_ENABLED_ENVIRONMENTS.includes(mode as SentryEnvironment) &&
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,  // ← Build-time
        sourcemaps: {
          assets: "./dist/**",
          filesToDeleteAfterUpload: ["./dist/**/*.map"],
        },
      }),
  ].filter(Boolean),
}));

// src/configuration/monitoring/index.tsx (Runtime)
export const Monitoring = {
  init: () => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,  // ← Runtime
      environment: config.environment,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration()
      ],
    });
  },
};
```

---

## Troubleshooting Guide

### Variable is undefined

**Check**: `console.log(import.meta.env)` to see all variables

**Common fixes**:
1. Missing `VITE_` prefix → Add it to variable name
2. Not in .env file → Add variable to appropriate .env file
3. Dev server not restarted → `Ctrl+C` then `yarn dev`
4. Wrong .env file → `yarn dev-demo` needs `.env.demo`, not `.env`

### Wrong mode active

**Check**: `console.log(import.meta.env.MODE)`

**Fix**: Verify package.json script has `--mode` flag: `"dev-demo": "vite --mode demo"`

### Auth0 credentials failing

**Check**: `console.log(import.meta.env.VITE_AUTH_DOMAIN, import.meta.env.VITE_AUTH_CLIENT_ID)`

**Fixes**:
1. Copy correct values from Auth0 Dashboard → Applications → Your App
2. Update Auth0 callback URLs to include `http://localhost:5173`

### Sentry not uploading source maps

**Check**: `echo $SENTRY_AUTH_TOKEN`

**Fix**: Use `SENTRY_AUTH_TOKEN` (no `VITE_` prefix) - it's build-time only. Get token from Sentry.io → Settings → Auth Tokens

### E2E tests missing credentials

**Fix**: Create `.env.e2e` from `.env.e2e.example` with test credentials. See `e2e/fixtures/auth0.setup.ts`

### Variable works locally but not in CI

**Fixes**:
1. Add secret to GitHub → Settings → Environments → [env] → Secrets
2. Add to workflow's `env:` section in `.github/workflows/main.yaml`
3. Redeploy: `git commit --allow-empty -m "chore: redeploy" && git push`

### Updated GitHub Secret but app shows old value

**Fix**: Secrets are compiled at build-time. Trigger redeploy: `git commit --allow-empty -m "chore: redeploy" && git push`

### Debug Commands

```bash
yarn dev | grep VITE_           # Print all VITE_ variables
echo $VITE_AUTH_DOMAIN          # Check specific variable
cat .env                        # View .env file
console.log(import.meta.env)    # View all variables in browser
```

---

## FAQ (Frequently Asked Questions)

### Q1: Do I need to create all `.env.*` files locally?

**A**: No! Most developers only need `.env` for daily work (`yarn dev`). Only create `.env.demo`, `.env.staging`, or `.env.production` if you want to test those modes locally.

```bash
# Typical setup (most common):
cp .env.example .env
# That's it! You're ready to work

# Advanced setup (optional):
cp .env.demo.example .env.demo  # Only if testing demo mode locally
```

### Q2: If I update a GitHub Secret, will it automatically update the deployed app?

**A**: No, you need to trigger a redeploy. GitHub Secrets are read during the build process, so you need to rebuild to pick up new values.

```bash
# After updating GitHub Secret:
git commit --allow-empty -m "chore: redeploy with updated secrets"
git push
```

### Q3: Can I use environment variables in CSS or HTML?

**A**: No, environment variables only work in JavaScript/TypeScript files. They're not available in CSS, HTML, or static files.

```typescript
// ✅ Works: JavaScript/TypeScript
const apiUrl = import.meta.env.VITE_BEST_SHOT_API;

// ❌ Doesn't work: CSS
.button {
  background: import.meta.env.VITE_PRIMARY_COLOR; /* Won't work */
}

// ❌ Doesn't work: HTML
<div data-api="${import.meta.env.VITE_API}"></div> <!-- Won't work -->
```

### Q4: Why do some variables have `VITE_` prefix and others don't?

**A**: `VITE_` prefix exposes variables to the browser (runtime). Variables without it are only available during build (build-time).

```bash
VITE_AUTH_DOMAIN="..."      # ← Available in browser (runtime)
SENTRY_AUTH_TOKEN="..."     # ← Only during build (build-time)
```

**Rule**: If your app code needs it → use `VITE_` prefix. If only Vite config needs it → no prefix.

### Q5: How do I know which mode is currently active?

**A**: Check `import.meta.env.MODE` in your code:

```typescript
console.log('Current mode:', import.meta.env.MODE);
// Outputs: "local-dev", "demo", "staging", or "production"
```

### Q6: Can I have different `.env` files for different team members?

**A**: Yes! `.env` files are gitignored, so each developer can have their own local values. Use `.env.example` to document what variables are needed.

### Q7: What happens if I forget to set a required environment variable?

**A**: Vite will replace it with `undefined`, which will likely cause runtime errors. Use the validation pattern (see "Pattern 6" in Common Patterns) to catch this early:

```typescript
// Validates at startup - fails fast with helpful error
if (!import.meta.env.VITE_AUTH_DOMAIN) {
  throw new Error('VITE_AUTH_DOMAIN is required');
}
```

### Q8: Can I change environment variables without restarting the dev server?

**A**: No, you must restart the dev server. Vite reads `.env` files only at startup.

```bash
# After editing .env:
Ctrl+C          # Stop server
yarn dev        # Start again with new values
```

### Q9: How do I test my app with production configuration locally?

**A**: Use `yarn dev-prod` (carefully!):

```bash
# 1. Create .env.production file
cp .env.production.example .env.production

# 2. Add production values (or copy from GitHub Secrets)
vim .env.production

# 3. Run in production mode
yarn dev-prod

# ⚠️  WARNING: This connects to real production API!
# Only use for debugging production issues
```

### Q10: Why can't I see my environment variables in GitHub Actions logs?

**A**: GitHub automatically masks secrets in logs for security. You'll see `***` instead of actual values. This is intentional to prevent leaking credentials.

### Q11: Do environment variables work in tests?

**A**: Yes, but you need to configure your test environment:

```typescript
// vitest.config.ts or similar
export default defineConfig({
  test: {
    env: {
      VITE_AUTH_DOMAIN: 'test.auth0.com',
      VITE_BEST_SHOT_API: 'http://localhost:9090/api/v1',
    },
  },
});
```

### Q12: What's the difference between `.env` and `.env.local`?

**A**: `.env.local` has higher priority and overrides `.env`. Both are gitignored.

```bash
# Priority (highest to lowest):
1. .env.[mode].local    # ← Highest (mode-specific + local)
2. .env.[mode]          # ← Mode-specific
3. .env.local           # ← Local overrides
4. .env                 # ← Base config
```

**Use case**: `.env.local` for personal overrides that shouldn't be in any example file.

---

## Quick Reference

### Commands Cheat Sheet

| Command | Mode | .env File(s) Loaded | Purpose |
|---------|------|---------------------|---------|
| `yarn dev` | local-dev | `.env` | Daily development with local backend |
| `yarn dev-demo` | demo | `.env` + `.env.demo` | Quick demos without backend |
| `yarn dev-staging` | staging | `.env` + `.env.staging` | Pre-production testing |
| `yarn dev-prod` | production | `.env` + `.env.production` | Production debugging (use carefully!) |

### Variable Prefixes

| Prefix | Context | Access Method | Example |
|--------|---------|---------------|---------|
| `VITE_` | Runtime (Client) | `import.meta.env.VITE_*` | `VITE_AUTH_DOMAIN` |
| None | Build-time | `process.env.*` | `SENTRY_AUTH_TOKEN` |
| `E2E_` | Playwright Tests | `process.env.E2E_*` | `E2E_TEST_EMAIL` |

### File Priority (Highest to Lowest)

1. `.env.[mode].local` (gitignored)
2. `.env.[mode]` (gitignored)
3. `.env.local` (gitignored)
4. `.env` (gitignored)

### Required Variables by Mode

| Variable | local-dev | demo | staging | production |
|----------|-----------|------|---------|------------|
| `VITE_AUTH_DOMAIN` | ✅ | ✅ | ✅ | ✅ |
| `VITE_AUTH_CLIENT_ID` | ✅ | ✅ | ✅ | ✅ |
| `VITE_BEST_SHOT_API` | ✅ | ✅ | ✅ | ✅ |
| `VITE_BEST_SHOT_API_V2` | ✅ | ✅ | ✅ | ✅ |
| `VITE_MOCKED_MEMBER_PUBLIC_ID` | ✅ | ✅ | ⚠️ | ❌ |
| `VITE_DEMO_VERSION` | ❌ | ✅ | ❌ | ❌ |
| `VITE_LAUNCHDARKLY_CLIENT_KEY` | ✅ | ✅ | ✅ | ✅ |
| `VITE_SENTRY_DSN` | ⚠️ | ✅ | ✅ | ✅ |
| `SENTRY_AUTH_TOKEN` | ⚠️ | ✅ | ✅ | ✅ |

Legend: ✅ Required | ⚠️ Optional | ❌ Should not use

---

*Last updated: 2026-01-16*
