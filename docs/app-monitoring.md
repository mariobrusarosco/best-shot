# App Monitoring with Sentry

Complete guide to our Sentry setup for error tracking and performance monitoring.

---

## Understanding Sentry: Key Concepts

Before diving into implementation, let's understand the key concepts you'll see in the Sentry dashboard.

### Events vs Issues

**Event** = A single error occurrence

**Issue** = Multiple similar events grouped together

```
Example:

Event 1: TypeError at TournamentCard.tsx:42 (user: john@example.com, 2:30 PM)
Event 2: TypeError at TournamentCard.tsx:42 (user: jane@example.com, 2:35 PM)
Event 3: TypeError at TournamentCard.tsx:42 (user: bob@example.com, 2:40 PM)

↓ Sentry groups them into:

Issue: TypeError - Cannot read property 'name' of undefined
  ├─ 3 events
  ├─ 3 users affected
  └─ First seen: 2:30 PM, Last seen: 2:40 PM
```

**Why it matters:**
- Issues help you see patterns (same error affecting multiple users)
- You fix the Issue, not individual Events
- Dashboard shows Issue count, not Event count

### Breadcrumbs

**Breadcrumbs** = A trail of user actions leading up to the error

Think of it like a DVR recording the last 100 user actions before a crash.

```
Example breadcrumb trail:

1. [navigation] User visited /tournaments
2. [http] GET /api/tournaments → 200 OK
3. [click] Clicked "View Tournament" button
4. [navigation] User visited /tournament/123
5. [http] GET /api/tournament/123 → 200 OK
6. [click] Clicked "Submit Score" button
7. [http] POST /api/scores → 500 ERROR
8. [error] Error: Failed to submit score
```

**What Sentry captures automatically:**
- ✅ Navigation (page changes)
- ✅ HTTP requests (API calls)
- ✅ User clicks
- ✅ Console logs (console.log, console.error)
- ✅ UI events (input changes, form submits)

**Where to find it:**
Sentry → Issue → "Breadcrumbs" section

**Why it matters:**
- Shows you EXACTLY what the user did before the error
- Helps reproduce the bug ("Oh, they clicked Submit twice!")
- Essential for debugging user-reported issues

### Stack Traces

**Stack Trace** = The path the code took to reach the error

```
Example WITHOUT source maps (unreadable):

Error: Cannot read property 'name' of undefined
  at t.render (main.abc123.js:1:45234)
  at e.update (main.abc123.js:1:23456)
  at r.call (main.abc123.js:1:12345)
```

```
Example WITH source maps (readable):

Error: Cannot read property 'name' of undefined
  at TournamentCard.render (TournamentCard.tsx:42:15)
     40 |   return (
     41 |     <Card>
  >  42 |       <Title>{tournament.name}</Title>
        |                          ^
     43 |     </Card>
     44 |   );
  at Dashboard.renderCards (Dashboard.tsx:120:8)
  at App.render (App.tsx:50:12)
```

**Why it matters:**
- Shows the exact line of code that crashed
- With source maps, you can click to see the original code
- Helps you fix the bug quickly

### Spans and Traces

**Span** = A single operation being tracked (API call, database query, function execution)

**Trace** = A collection of related spans showing the full request flow

```
Example trace:

Trace: User loads Tournament Detail page (total: 850ms)
  │
  ├─ Span: pageload (200ms)
  │
  ├─ Span: GET /api/tournament/123 (300ms)
  │   ├─ Span: Database query - fetch tournament (150ms)
  │   └─ Span: Database query - fetch participants (100ms)
  │
  └─ Span: React render (350ms)
      ├─ Span: TournamentHeader render (50ms)
      ├─ Span: MatchList render (200ms)
      └─ Span: Standings render (100ms)
```

**Where to find it:**
Sentry → Performance → Traces

**Why it matters:**
- Identifies slow operations (database, API calls, rendering)
- Shows WHERE the time is being spent
- Helps optimize performance bottlenecks

**Note:** We haven't implemented custom spans yet, but Sentry automatically tracks page loads and HTTP requests.

### Tags

**Tags** = Indexed key-value pairs for filtering and searching

```
Example tags on an error:

feature: "match-scoring"
user.role: "player"
environment: "production"
browser: "Chrome"
os: "Windows"
```

**How to filter in Sentry:**
```
Search: feature:"match-scoring"
→ Shows only errors from match scoring feature

Search: feature:"match-scoring" AND user.role:"admin"
→ Shows only errors from admins using match scoring
```

**Why it matters:**
- Quickly find errors from specific features
- Identify patterns (e.g., "only happens to admins")
- Prioritize fixes (e.g., "production errors first")

### Contexts

**Contexts** = Rich objects with detailed information

```
Example contexts:

tournament:
  id: "123"
  name: "Summer Championship"
  status: "in-progress"
  participantCount: 24

user:
  id: "456"
  email: "john@example.com"
  username: "john_doe"

device:
  name: "iPhone 14"
  model: "iPhone14,5"
  orientation: "portrait"
```

**Where to find it:**
Sentry → Issue → "Additional Data" → "Contexts"

**Why it matters:**
- Provides full context about what the user was doing
- Helps reproduce the bug with specific data
- Shows device/browser info automatically

### Releases

**Release** = A specific version of your code (linked to git commit)

```
Example release:

Release: abc1234567890 (git commit hash)
  ├─ Deployed: 2 hours ago
  ├─ Author: mario
  ├─ 15 files changed
  └─ 234 errors
```

**How Sentry uses releases:**
- Links errors to the exact code version
- Shows "New in release" vs "Regression" (reappeared)
- Tracks error trends per release

**Where to find it:**
Sentry → Releases → [Your Release]

**Why it matters:**
- Know which deployment introduced the bug
- Track if a release has more/fewer errors than previous
- Quickly rollback if a release is problematic

### Session Replays

**Session Replay** = A video-like recording of the user's session

Shows:
- ✅ Mouse movements
- ✅ Clicks
- ✅ Scrolling
- ✅ Page navigation
- ✅ Network requests
- ✅ Console logs

**Privacy:**
- ❌ Does NOT record passwords (masked automatically)
- ❌ Does NOT record credit cards (masked)
- ❌ Does NOT record actual video (just DOM changes)

**Where to find it:**
Sentry → Issue → "Replays" tab

**Why it matters:**
- Watch EXACTLY what the user did before the error
- Better than breadcrumbs (you can SEE it)
- Essential for hard-to-reproduce bugs

**Our configuration:**
- Production: 5% of normal sessions, 100% of error sessions
- Staging: 20% of normal sessions, 100% of error sessions
- Demo: 10% of normal sessions, 100% of error sessions

### Environments

**Environment** = Where the code is running

Our environments:
- `local-dev` - Your computer (Sentry disabled)
- `demo` - Demo environment (Sentry enabled)
- `staging` - Pre-production testing (Sentry enabled)
- `production` - Live users (Sentry enabled)

**How to filter in Sentry:**
```
Search: environment:"production"
→ Shows only production errors (ignore staging/demo)
```

**Why it matters:**
- Don't waste time on staging bugs if production is fine
- Different sample rates per environment (lower cost in prod)
- Separate error tracking for each environment

### User Feedback

**User Feedback** = Let users report what went wrong

When an error occurs, Sentry can show a dialog:

```
┌─────────────────────────────────────────┐
│  It looks like we're having issues.     │
│                                         │
│  Our team has been notified.            │
│                                         │
│  If you'd like to help, tell us what   │
│  happened below:                        │
│                                         │
│  ┌────────────────────────────────────┐│
│  │ I clicked Submit and it crashed... ││
│  │                                    ││
│  └────────────────────────────────────┘│
│                                         │
│  [Close]  [Submit Feedback]            │
└─────────────────────────────────────────┘
```

**Where to find it:**
Sentry → Issue → "User Feedback" tab

**Why it matters:**
- Users can explain what they were trying to do
- Provides context breadcrumbs can't capture ("I was testing the delete button")
- Helps prioritize (users reporting = important issue)

**Our configuration:**
We have `showDialog` enabled in our ErrorBoundary.

---

## Common Sentry Workflows

### Workflow 1: Investigate a new error

```
1. Go to Sentry → Issues
2. Click on the issue
3. Check:
   ✅ How many users affected?
   ✅ Which environment? (production = urgent!)
   ✅ Which release introduced it?
4. Look at Stack Trace
   → Click to see the exact line of code
5. Check Breadcrumbs
   → What did the user do before the error?
6. Check Session Replay (if available)
   → Watch what happened
7. Check Tags/Contexts
   → Any patterns? (only admins? specific tournament?)
8. Fix the bug
9. Mark as "Resolved in next release"
```

### Workflow 2: Find errors from a specific feature

```
1. Go to Sentry → Issues
2. Search: feature:"match-scoring"
3. Sort by "Events" (most common errors first)
4. Investigate top errors
```

### Workflow 3: Check if a release is healthy

```
1. Go to Sentry → Releases
2. Click on your release (e.g., "abc1234")
3. Check:
   ✅ New issues introduced?
   ✅ Error count vs previous release?
   ✅ Any crashes?
4. If problematic → Rollback
5. If healthy → Deploy to next environment
```

### Workflow 4: Track down a user-reported bug

```
1. User reports: "I can't submit scores!"
2. Go to Sentry → Issues
3. Search: user.email:"john@example.com"
4. Find the error that matches their report
5. Check Session Replay → Watch exactly what they did
6. Check Breadcrumbs → See their action trail
7. Check Contexts → See tournament/match data
8. Reproduce locally with same data
9. Fix and deploy
```

---

## Quick Reference: Where to Find Things

| What you want to see | Where to find it |
|---------------------|------------------|
| All errors | Sentry → Issues |
| Specific error details | Sentry → Issues → [Click Issue] |
| What user did before error | Issue → Breadcrumbs |
| Exact line of code | Issue → Stack Trace |
| User's screen recording | Issue → Replays |
| Error patterns by feature | Issues → Search: `feature:"name"` |
| Errors by user | Issues → Search: `user.email:"email"` |
| Production errors only | Issues → Search: `environment:"production"` |
| Release health | Sentry → Releases → [Click Release] |
| Performance issues | Sentry → Performance |
| What data was sent | Issue → Additional Data → Contexts |

---

## Error Boundaries

### What is it?

A **safety net** that catches React errors before they crash the entire app.

**Without Error Boundary:**

```
User clicks button � Error occurs � WHITE SCREEN OF DEATH =�
```

**With Error Boundary:**

```
User clicks button � Error occurs � Nice error page + Error sent to Sentry 
```

### What we implemented

**File: `src/App.tsx`**

```tsx
import * as Sentry from "@sentry/react";
import { AppError } from "@/domains/global/components/error";

function App() {
  return (
    <Sentry.ErrorBoundary fallback={AppError} showDialog>
      {/* Your entire app */}
    </Sentry.ErrorBoundary>
  );
}
```

**What it does:**

-  Catches all React errors in the app
-  Shows our branded error page (`AppError` component)
-  Sends error to Sentry automatically
-  Shows Sentry feedback dialog to user

### The Error Page

**File: `src/domains/global/components/error.tsx`**

We updated our existing `AppError` component to work with **both**:

1. TanStack Router errors (we already had this)
2. Sentry ErrorBoundary errors (new)

```tsx
interface AppErrorProps {
  error: unknown; // Both use this
  info?: { componentStack: string }; // TanStack Router
  reset?: () => void; // TanStack Router
  componentStack?: string; // Sentry
  eventId?: string; // Sentry
  resetError?: () => void; // Sentry
}
```

### How to test

**1. Trigger an error in development:**

```tsx
// Add this to any component
<button
  onClick={() => {
    throw new Error("Test error!");
  }}
>
  Break the app
</button>
```

**2. You should see:**

- Branded error page (not white screen)
- Sentry dialog asking for feedback
- Error logged in Sentry dashboard

**3. Error appears in Sentry:**

```
Error: Test error!
  User: john@example.com
  Environment: demo
  Breadcrumbs: [Click] "Break the app" button
  Stack trace: Component.tsx:42
```

### Visual Flow

```
                                                     
                    Your App                          
                                                  
       <Sentry.ErrorBoundary>                     
                                               
                                                
       <AppQueryProvider>                       
         <AuthProvider>                         
           <AppRouter />                        
             �                                  
           =� ERROR OCCURS                      
                                                
                                               
                �                                  
        Error caught!                              
                �                                  
    1. Show <AppError /> page                      
    2. Send error to Sentry                        
    3. Show feedback dialog                        
                                                  
                                                     
```

### Key Files

| File                                      | Purpose                                |
| ----------------------------------------- | -------------------------------------- |
| `src/App.tsx`                             | Wraps app with `Sentry.ErrorBoundary`  |
| `src/domains/global/components/error.tsx` | Error page component (dual-compatible) |

### Common Issues

**Q: Error boundary not catching errors?**

- Only catches errors in **React components**
- Won't catch errors in event handlers, async code, or setTimeout
- Use `try/catch` + `Monitoring.captureException()` for those

**Q: See white screen instead of error page?**

- Check that `AppError` is imported correctly
- Check browser console for syntax errors in `AppError` component

---

## Environment Configuration

### What is it?

Different Sentry settings for different environments so you don't:

- 💸 **Waste money** sending 100% of production traffic to Sentry
- 🐛 **Miss bugs** in staging because monitoring is off
- 🔊 **Get noise** from local development errors

**The Rule:**

```
Local Dev    → Sentry OFF (no noise)
Demo         → Sentry ON  (30% sampling)
Staging      → Sentry ON  (50% sampling)
Production   → Sentry ON  (10% sampling - save money!)
```

### What we implemented

**1. Centralized environment list**

**File: `src/configuration/monitoring/constants.ts`**

```ts
export const SENTRY_ENABLED_ENVIRONMENTS = [
  "demo",
  "staging",
  "production",
] as const;
export type SentryEnvironment = (typeof SENTRY_ENABLED_ENVIRONMENTS)[number];
```

☝️ **Single source of truth** - used by both runtime code AND build config!

**2. Environment-specific settings**

**File: `src/configuration/monitoring/index.tsx`**

```ts
const getEnvironmentConfig = (environment: string) => {
  switch (environment) {
    case "production":
      return {
        tracesSampleRate: 0.1, // 10% of API calls
        replaysSessionSampleRate: 0.05, // 5% of sessions
        replaysOnErrorSampleRate: 1.0, // 100% when error occurs
      };

    case "staging":
      return {
        tracesSampleRate: 0.5, // 50% of API calls
        replaysSessionSampleRate: 0.2, // 20% of sessions
        replaysOnErrorSampleRate: 1.0,
      };

    case "demo":
      return {
        tracesSampleRate: 0.3, // 30% of API calls
        replaysSessionSampleRate: 0.1, // 10% of sessions
        replaysOnErrorSampleRate: 1.0,
      };
  }
};
```

### Understanding Sample Rates

**Traces (Performance):**

```
tracesSampleRate: 0.1 = Track 10% of page loads and API calls

Why not 100%?
├─ Too expensive in production (Sentry charges per event)
├─ Too much data to analyze
└─ 10% is enough to spot trends
```

**Session Replays (DVR-like recordings):**

```
replaysSessionSampleRate: 0.05 = Record 5% of normal sessions
replaysOnErrorSampleRate: 1.0   = Record 100% of error sessions

Why different rates?
├─ Normal sessions: expensive storage, low value
└─ Error sessions: critical for debugging!
```

### Visual Flow

```
┌─────────────────────────────────────────────────────────┐
│                 yarn dev (local-dev)                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Sentry.init() → Check MODE                        │ │
│  │  MODE = "local-dev"                                │ │
│  │  ❌ NOT in SENTRY_ENABLED_ENVIRONMENTS             │ │
│  │  → Skip Sentry.init()                              │ │
│  │  → Errors NOT sent to Sentry                       │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 yarn dev-demo (demo)                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Sentry.init() → Check MODE                        │ │
│  │  MODE = "demo"                                     │ │
│  │  ✅ IN SENTRY_ENABLED_ENVIRONMENTS                 │ │
│  │  → Initialize Sentry (30% sampling)                │ │
│  │  → Errors sent to Sentry                           │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              yarn build --mode production                │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Vite plugin → Check MODE                          │ │
│  │  MODE = "production"                               │ │
│  │  ✅ IN SENTRY_ENABLED_ENVIRONMENTS                 │ │
│  │  → Upload source maps to Sentry                    │ │
│  │  → Minify code (readable stack traces!)            │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### How to test

**1. Test local-dev (Sentry OFF):**

```bash
yarn dev
```

Console should show:

```
[Sentry] Disabled in local-dev mode
```

**2. Test demo mode (Sentry ON):**

```bash
yarn dev-demo
```

Console should show:

```
[Sentry] Initialized for demo environment
  - Release: abc123
  - Traces: 30%
  - Replays: 10%
  - Error Replays: 100%
```

**3. Verify in Sentry dashboard:**

- Go to https://sentry.io/your-project
- Filter by environment: "demo"
- You should see events coming in

### Environment Variables

**File: `.env.demo` (or `.env.staging`, `.env.production`)**

```bash
# Sentry Monitoring
VITE_SENTRY_DSN="https://your-key@sentry.io/project-id"
SENTRY_AUTH_TOKEN="your-auth-token"
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="best-shot-demo"
```

**How to get these:**

1. Go to https://sentry.io → Create account
2. Create new project (React)
3. Copy DSN from setup page
4. Create auth token: Settings → Auth Tokens → New Token
   - Scopes: `project:releases`, `org:read`

### Key Files

| File                                             | Purpose                      |
| ------------------------------------------------ | ---------------------------- |
| `src/configuration/monitoring/constants.ts`      | Centralized environment list |
| `src/configuration/monitoring/index.tsx`         | Runtime Sentry config        |
| `.env.demo` / `.env.staging` / `.env.production` | Sentry credentials           |

### Common Issues

**Q: Sentry not initializing in demo mode?**

- Check `.env.demo` has `VITE_SENTRY_DSN` set
- Restart dev server after changing `.env` files
- Check browser console for Sentry errors

**Q: Too many events in Sentry (quota exceeded)?**

- Lower sample rates in `getEnvironmentConfig()`
- Production should stay at 10% or lower

---

## User Identification

### What is it?

Link every error and session to the **specific user** who experienced it.

**Without User Identification:**

```
Error: Failed to submit score
├─ Environment: production
├─ Browser: Chrome
└─ No idea WHO had this problem 🤷
```

**With User Identification:**

```
Error: Failed to submit score
├─ User: john@example.com
├─ Username: john_doe
├─ Role: player
└─ Now you can contact them! 📧
```

### What we implemented

**1. User identification method**

**File: `src/configuration/monitoring/index.tsx`**

```ts
export const Monitoring = {
  setUser: (user: UserIdentity | null) => {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.username,
      });
    } else {
      Sentry.setUser(null); // Clear on logout
    }
  },
};
```

**2. Automatic user identification component**

**File: `src/configuration/monitoring/components/SentryUserIdentifier.tsx`**

```tsx
export function SentryUserIdentifier() {
  const { isAuthenticated } = useAppAuth();
  const member = useMember({ fetchOnMount: isAuthenticated });

  useEffect(() => {
    if (isAuthenticated && member.isSuccess && member.data) {
      // User logged in - identify them
      Monitoring.setUser({
        id: member.data.id,
        email: member.data.email,
        username: member.data.nickName,
        role: member.data.role,
      });
    } else if (!isAuthenticated) {
      // User logged out - clear data
      Monitoring.setUser(null);
    }
  }, [isAuthenticated, member.isSuccess, member.data]);

  return null; // No UI, just background work
}
```

**3. Add to app**

**File: `src/App.tsx`**

```tsx
import { SentryUserIdentifier } from "@/configuration/monitoring/components/SentryUserIdentifier";

function App() {
  return (
    <Sentry.ErrorBoundary fallback={AppError} showDialog>
      <AppQueryProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <AppRouter />
            <SentryUserIdentifier /> {/* Add this */}
          </ThemeProvider>
        </AuthProvider>
      </AppQueryProvider>
    </Sentry.ErrorBoundary>
  );
}
```

### How it works

**Login flow:**

```
1. User logs in
   ↓
2. useAppAuth() returns isAuthenticated: true
   ↓
3. useMember() fetches user data
   ↓
4. SentryUserIdentifier calls Monitoring.setUser()
   ↓
5. All future errors include user info! ✅
```

**Logout flow:**

```
1. User logs out
   ↓
2. useAppAuth() returns isAuthenticated: false
   ↓
3. SentryUserIdentifier calls Monitoring.setUser(null)
   ↓
4. User data cleared from Sentry ✅
```

### Visual Flow

```
┌─────────────────────────────────────────────────────┐
│                  User Login                          │
│  ┌────────────────────────────────────────────────┐ │
│  │  Auth0 / Bypass Auth                           │ │
│  │    ↓                                           │ │
│  │  isAuthenticated: true                         │ │
│  │    ↓                                           │ │
│  │  useMember() fetches:                          │ │
│  │    {                                           │ │
│  │      id: "123",                                │ │
│  │      email: "john@example.com",                │ │
│  │      nickName: "john_doe",                     │ │
│  │      role: "player"                            │ │
│  │    }                                           │ │
│  │    ↓                                           │ │
│  │  Monitoring.setUser({...})                     │ │
│  │    ↓                                           │ │
│  │  Sentry.setUser({...})                         │ │
│  │  Sentry.setTag("user.role", "player")         │ │
│  │    ↓                                           │ │
│  │  ✅ All errors now tagged with user info      │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               Error with User Info                   │
│  ┌────────────────────────────────────────────────┐ │
│  │  Error: Failed to submit score                 │ │
│  │                                                │ │
│  │  User:                                         │ │
│  │    id: "123"                                   │ │
│  │    email: "john@example.com"                   │ │
│  │    username: "john_doe"                        │ │
│  │                                                │ │
│  │  Tags:                                         │ │
│  │    user.role: "player"                         │ │
│  │    environment: "production"                   │ │
│  │                                                │ │
│  │  → Contact john@example.com about this! 📧    │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Filtering by user

**In Sentry dashboard:**

```
Filter by specific user:
  user.email:john@example.com

Find all errors from a specific user:
  user.id:123
```

### Key Files

| File                                                               | Purpose                             |
| ------------------------------------------------------------------ | ----------------------------------- |
| `src/configuration/monitoring/index.tsx`                           | `Monitoring.setUser()` method       |
| `src/configuration/monitoring/components/SentryUserIdentifier.tsx` | Auto-identify users on login/logout |
| `src/App.tsx`                                                      | Adds `<SentryUserIdentifier />`     |

### Common Issues

**Q: User not showing up in Sentry?**

- Check `SentryUserIdentifier` is added to `App.tsx`
- Check user is logged in (`isAuthenticated: true`)
- Check `useMember()` returned user data successfully
- Check browser console for `[Sentry] User identified:` message

**Q: User data cleared too early?**

- `SentryUserIdentifier` clears user on `isAuthenticated: false`
- This is intentional - we don't want to track logged-out users

---

## Release Tracking

### What is it?

Link errors to the **exact git commit** that caused them, with **readable stack traces** instead of minified gibberish.

**Without Release Tracking:**

```
Error in production:
  at t.render (main.abc123.js:1:45234)  ❌ Minified - unreadable!

Which commit caused this? 🤷 No idea!
```

**With Release Tracking:**

```
Error in production:
  at TournamentCard.render (TournamentCard.tsx:42)  ✅ Readable!

Release: abc1234 (git commit)
  → View commit on GitHub
  → See what changed
  → Know who deployed it
```

### What we implemented

**1. Sentry Vite plugin for source maps**

**File: `vite.config.ts`**

```ts
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { SENTRY_ENABLED_ENVIRONMENTS } from "./src/configuration/monitoring/constants";

export default defineConfig(({ mode }) => ({
  plugins: [
    // Other plugins...

    // Upload source maps only for monitored environments
    SENTRY_ENABLED_ENVIRONMENTS.includes(mode as SentryEnvironment) &&
      sentryVitePlugin({
        org: process.env.SENTRY_ORG || "your-org",
        project: process.env.SENTRY_PROJECT || "best-shot-demo",
        authToken: process.env.SENTRY_AUTH_TOKEN,
        telemetry: false,
        sourcemaps: {
          assets: "./dist/**",
          // CRITICAL: Delete source maps after upload
          filesToDeleteAfterUpload: ["./dist/**/*.map"],
        },
      }),
  ].filter(Boolean),

  build: {
    sourcemap: true, // Generate source maps
    minify: SENTRY_ENABLED_ENVIRONMENTS.includes(mode as SentryEnvironment)
      ? "esbuild"
      : false,
  },
}));
```

**2. Release info in Sentry init**

**File: `src/configuration/monitoring/index.tsx`**

```ts
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: config.environment,
  release:
    import.meta.env.VITE_SENTRY_RELEASE || import.meta.env.SENTRY_RELEASE,
  // ... other config
});
```

**3. Environment variables**

**File: `.env.demo` (or `.env.staging`, `.env.production`)**

```bash
# Sentry credentials (already in Phase 2)
VITE_SENTRY_DSN="https://your-key@sentry.io/project-id"

# For source map upload during build
SENTRY_AUTH_TOKEN="your-auth-token"
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="best-shot-demo"
```

### How it works

**Build process:**

```
1. You run: yarn build --mode production
   ↓
2. Vite compiles & minifies your code
   ↓
3. Generates source maps (main.js.map)
   ↓
4. Sentry Vite plugin uploads:
   - Minified files (main.abc123.js)
   - Source maps (main.abc123.js.map)
   - Git commit hash (release ID)
   ↓
5. Sentry stores everything ✅
```

**Error handling:**

```
1. Error occurs in production
   ↓
2. Sentry receives minified stack trace:
   at t.render (main.abc123.js:1:45234)
   ↓
3. Sentry uses source map to decode:
   at TournamentCard.render (TournamentCard.tsx:42)
   ↓
4. Shows readable code + git commit link! ✅
```

### Visual Flow

```
┌──────────────────────────────────────────────────────┐
│              Build Process (Production)               │
│  ┌─────────────────────────────────────────────────┐ │
│  │  $ yarn build --mode production                 │ │
│  │                                                 │ │
│  │  Vite:                                          │ │
│  │    ├─ Compile TypeScript → JavaScript          │ │
│  │    ├─ Minify code (t.render instead of         │ │
│  │    │   TournamentCard.render)                   │ │
│  │    └─ Generate source maps (.map files)        │ │
│  │                                                 │ │
│  │  Sentry Vite Plugin:                            │ │
│  │    ├─ Read git commit hash                     │ │
│  │    ├─ Upload minified files                    │ │
│  │    ├─ Upload source maps                       │ │
│  │    └─ Create release: "abc1234"                │ │
│  │                                                 │ │
│  │  ✅ Build complete!                             │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│            Error in Production (Readable!)            │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Error: Cannot read property 'name'             │ │
│  │                                                 │ │
│  │  Stack trace:                                   │ │
│  │    at TournamentCard.render                    │ │
│  │       (TournamentCard.tsx:42:15)   ✅ Readable │ │
│  │                                                 │ │
│  │    at Dashboard.renderCards                    │ │
│  │       (Dashboard.tsx:120:8)        ✅ Readable │ │
│  │                                                 │ │
│  │  Release: abc1234                              │ │
│  │    → [View commit on GitHub]                   │ │
│  │    → Author: mario                             │ │
│  │    → Deployed: 2 hours ago                     │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Understanding Source Maps

**What are source maps?**

A **translation file** that maps minified code back to original code.

**Minified code (production):**

```js
function t(e) {
  return e.name;
}
```

**Original code (your TypeScript):**

```ts
function getTournamentName(tournament: Tournament) {
  return tournament.name;
}
```

**Source map (.map file):**

```json
{
  "mappings": "AAAA,SAASA,EAAE,CAACC...",
  "sources": ["TournamentCard.tsx"],
  "names": ["getTournamentName", "tournament"]
}
```

**Why upload to Sentry?**

- Source maps contain your original code (sensitive!)
- Never send .map files to users
- Only upload to Sentry for error debugging

### ⚠️ Security Warning: Source Maps

**CRITICAL: Never serve source maps to users!**

**Real-world incident (November 2025):**

Apple accidentally left source maps enabled on their new App Store website. Within hours, developers downloaded Apple's **entire frontend source code** using browser plugins. Apple had to issue DMCA takedowns for 8,270+ GitHub repositories.

**What was exposed:**

- Complete TypeScript/Svelte source code
- API endpoint patterns
- Business logic
- Architecture details

**What we do (safe ✅):**

```
Source maps → Uploaded to Sentry ONLY (private, authenticated)
              ↓
              Never served to users
              ↓
              Users only get minified code
```

**What NOT to do (dangerous ❌):**

```
❌ Serve .map files publicly
❌ Deploy dist/ folder with .map files included
❌ Make source maps accessible via URLs
❌ Forget to disable sourcemaps in production
```

**Verify your setup:**

```bash
# 1. Build for production
yarn build --mode production

# 2. Check dist/ folder
ls dist/*.map
# Should show: "No such file" ✅

# 3. Open deployed site
# - DevTools → Sources
# - Should see: main.abc123.js (minified) ✅
# - Should NOT see: TournamentCard.tsx (original) ❌
```

**Our protection:**

| What              | Safe? | Why                                       |
| ----------------- | ----- | ----------------------------------------- |
| Vite build        | ✅    | Generates .map files in `dist/`           |
| Sentry plugin     | ✅    | Uploads .map to Sentry, then deletes them |
| Production deploy | ✅    | No .map files in final bundle             |
| Users             | ✅    | Only receive minified .js files           |

**Critical Configuration:**

The `filesToDeleteAfterUpload` option is **essential**:

```ts
sourcemaps: {
  assets: "./dist/**",
  // Deletes .map files after uploading to Sentry
  filesToDeleteAfterUpload: ["./dist/**/*.map"],
}
```

**Without this option:**
1. Vite generates `.map` files in `dist/`
2. Sentry plugin uploads them
3. ❌ `.map` files remain in `dist/`
4. ❌ You deploy `dist/` to S3/CDN
5. ❌ Source maps are publicly accessible!

**With this option:**
1. Vite generates `.map` files in `dist/`
2. Sentry plugin uploads them
3. ✅ Sentry plugin **deletes** `.map` files
4. ✅ You deploy `dist/` (no .map files)
5. ✅ Source maps only in Sentry (private)

**If you see .map files in production = SECURITY LEAK!**

### Git commit linking

**How does Sentry know the git commit?**

The Sentry Vite plugin automatically:

1. Runs `git rev-parse HEAD` to get current commit hash
2. Uses that as the release ID
3. Uploads it with source maps

**In Sentry, you'll see:**

```
Release: abc1234567890abcdef
├─ Git commit: abc1234567890abcdef
├─ Repository: github.com/your-org/best-shot
├─ Author: mario
├─ Deployed: 2 hours ago
└─ [View on GitHub] button
```

### Key Files

| File                                     | Purpose                          |
| ---------------------------------------- | -------------------------------- |
| `vite.config.ts`                         | Sentry plugin config for uploads |
| `.env.production`                        | Sentry auth token for uploads    |
| `src/configuration/monitoring/index.tsx` | Release tracking in runtime      |

### Common Issues

**Q: Source maps not uploaded?**

- Check `SENTRY_AUTH_TOKEN` is set in environment
- Check auth token has `project:releases` scope
- Run build and look for `[sentry-vite-plugin]` output
- Check Sentry project settings → Releases

**Q: Stack traces still minified?**

- Source maps uploaded but not linked correctly
- Check `release` in `Sentry.init()` matches uploaded release
- Check that `sourcemap: true` in vite.config.ts
- Verify source maps uploaded: Sentry → Releases → [your-release] → Artifacts

**Q: Build failing with Sentry plugin error?**

- Plugin only runs for demo/staging/production (not local-dev)
- Check `SENTRY_ENABLED_ENVIRONMENTS` includes current mode
- Temporarily disable plugin for testing: comment out `sentryVitePlugin()`

**Q: Which git commit is used?**

- Plugin uses `git rev-parse HEAD` (current commit)
- Make sure you commit changes before building
- Or manually set: `VITE_SENTRY_RELEASE="v1.2.3"`

---

## Data Sanitization

### What is it?

Strip **sensitive data** (passwords, tokens, credit cards) from error reports before sending to Sentry.

**Without Data Sanitization:**

```
Error: Login failed

Request data:
  email: "john@example.com"
  password: "MySecretPassword123!"  ❌ LEAKED!
  creditCard: "4532-1234-5678-9010"  ❌ LEAKED!

→ Visible to anyone with Sentry access
→ GDPR violation
→ Security nightmare
```

**With Data Sanitization:**

```
Error: Login failed

Request data:
  email: "john@example.com"
  password: "[Filtered]"  ✅ Protected!
  creditCard: "[Filtered]"  ✅ Protected!

→ Safe to view
→ GDPR compliant
→ No sensitive data exposed
```

### What we implemented

**1. Sensitive field patterns**

**File: `src/configuration/monitoring/index.tsx`**

```ts
const SENSITIVE_FIELD_PATTERNS = [
  /password/i,
  /passwd/i,
  /pwd/i,
  /secret/i,
  /token/i,
  /api[-_]?key/i,
  /auth/i,
  /credit[-_]?card/i,
  /card[-_]?number/i,
  /cvv/i,
  /ssn/i,
  /social[-_]?security/i,
  /private[-_]?key/i,
  /access[-_]?token/i,
  /refresh[-_]?token/i,
  /bearer/i,
];
```

**2. Recursive sanitization function**

```ts
function sanitizeObject(obj: any, depth = 0): any {
  // Prevent infinite recursion
  if (depth > 10) return "[Max Depth Reached]";
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, depth + 1));
  }

  // Handle objects
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Check if key matches sensitive pattern
    const isSensitive = SENSITIVE_FIELD_PATTERNS.some((pattern) =>
      pattern.test(key)
    );

    if (isSensitive) {
      sanitized[key] = "[Filtered]"; // Replace sensitive value
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value, depth + 1); // Recurse
    } else {
      sanitized[key] = value; // Keep safe value
    }
  }

  return sanitized;
}
```

**3. beforeSend hook**

```ts
function beforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
  // Sanitize request data (URL params, POST body, headers, cookies)
  if (event.request) {
    if (event.request.query_string) {
      event.request.query_string = sanitizeObject(event.request.query_string);
    }
    if (event.request.data) {
      event.request.data = sanitizeObject(event.request.data);
    }
    if (event.request.cookies) {
      event.request.cookies = sanitizeObject(event.request.cookies);
    }
    if (event.request.headers) {
      event.request.headers = sanitizeObject(event.request.headers);
    }
  }

  // Sanitize breadcrumbs (user actions, console logs)
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => ({
      ...breadcrumb,
      data: breadcrumb.data ? sanitizeObject(breadcrumb.data) : breadcrumb.data,
    }));
  }

  // Sanitize extra context
  if (event.extra) {
    event.extra = sanitizeObject(event.extra);
  }

  // Sanitize contexts
  if (event.contexts) {
    event.contexts = sanitizeObject(event.contexts);
  }

  return event;
}
```

**4. Add to Sentry init**

```ts
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: config.environment,
  release,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // ... other config
  beforeSend, // Add sanitization hook
});
```

### How it works

**Request sanitization:**

```
User submits login form:
  { email: "john@example.com", password: "secret123" }
  ↓
Error occurs
  ↓
beforeSend() runs BEFORE sending to Sentry
  ↓
Checks each field against SENSITIVE_FIELD_PATTERNS
  ↓
"password" matches /password/i pattern
  ↓
Replace value with "[Filtered]"
  ↓
Sentry receives:
  { email: "john@example.com", password: "[Filtered]" }
```

**Nested object sanitization:**

```
{
  user: {
    email: "john@example.com",
    auth: {
      password: "secret123",      ← Filtered!
      apiKey: "sk_live_abc123"    ← Filtered!
    }
  }
}

After sanitization:
{
  user: {
    email: "john@example.com",
    auth: {
      password: "[Filtered]",
      apiKey: "[Filtered]"
    }
  }
}
```

### Visual Flow

```
┌─────────────────────────────────────────────────────┐
│              Error with Sensitive Data               │
│  ┌────────────────────────────────────────────────┐ │
│  │  POST /api/auth/login                          │ │
│  │                                                │ │
│  │  Body: {                                       │ │
│  │    email: "john@example.com",                  │ │
│  │    password: "MySecret123!",   ← Sensitive!   │ │
│  │    rememberMe: true                            │ │
│  │  }                                             │ │
│  │                                                │ │
│  │  Headers: {                                    │ │
│  │    Authorization: "Bearer xyz"  ← Sensitive!  │ │
│  │  }                                             │ │
│  │                                                │ │
│  │  ❌ Error: Invalid credentials                │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                        ↓
         beforeSend() hook intercepts
                        ↓
┌─────────────────────────────────────────────────────┐
│              Sanitization Process                    │
│  ┌────────────────────────────────────────────────┐ │
│  │  1. Check "password" against patterns          │ │
│  │     /password/i matches → "[Filtered]"         │ │
│  │                                                │ │
│  │  2. Check "Authorization" against patterns     │ │
│  │     /auth/i matches → "[Filtered]"             │ │
│  │                                                │ │
│  │  3. Keep safe fields (email, rememberMe)       │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                        ↓
              Sent to Sentry ✅
                        ↓
┌─────────────────────────────────────────────────────┐
│           Safe Error Report in Sentry                │
│  ┌────────────────────────────────────────────────┐ │
│  │  POST /api/auth/login                          │ │
│  │                                                │ │
│  │  Body: {                                       │ │
│  │    email: "john@example.com",                  │ │
│  │    password: "[Filtered]",     ✅ Protected!  │ │
│  │    rememberMe: true                            │ │
│  │  }                                             │ │
│  │                                                │ │
│  │  Headers: {                                    │ │
│  │    Authorization: "[Filtered]"  ✅ Protected! │ │
│  │  }                                             │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### What gets sanitized

**Request data:**

- ✅ URL query parameters (`?token=abc123`)
- ✅ POST request body (form data, JSON)
- ✅ Request headers (Authorization, cookies)
- ✅ Cookies (session tokens)

**Breadcrumbs:**

- ✅ Form input events (password fields)
- ✅ Console logs (if they contain sensitive data)
- ✅ User actions (button clicks with sensitive context)

**Extra context:**

- ✅ Any custom data you add with `Sentry.setContext()`

**What doesn't get sanitized:**

- ❌ Error messages (be careful what you put in error messages!)
- ❌ Stack traces (function names only)

### How to test

**1. Trigger an error with sensitive data:**

```tsx
<button
  onClick={async () => {
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "TestPassword123!",
          apiKey: "sk_test_abc123",
        }),
      });
    } catch (error) {
      throw new Error("Login test failed");
    }
  }}
>
  Test sanitization
</button>
```

**2. Check Sentry dashboard:**

Go to the error → Request → Body

**Should see:**

```json
{
  "email": "test@example.com",
  "password": "[Filtered]",  ✅
  "apiKey": "[Filtered]"      ✅
}
```

**Should NOT see:**

```json
{
  "email": "test@example.com",
  "password": "TestPassword123!",  ❌ LEAKED!
  "apiKey": "sk_test_abc123"        ❌ LEAKED!
}
```

### Compliance

**GDPR (EU):**

- ✅ Don't send PII (personally identifiable information) unnecessarily
- ✅ Sanitize sensitive user data
- ✅ Our patterns cover: passwords, tokens, credit cards

**CCPA (California):**

- ✅ Same requirements as GDPR

**PCI DSS (Payment Card Industry):**

- ✅ **NEVER** send credit card numbers, CVV, or full PAN
- ✅ Our patterns filter: `/credit[-_]?card/i`, `/cvv/i`, `/card[-_]?number/i`

**HIPAA (Healthcare):**

- ✅ Our patterns filter: `/ssn/i`, `/social[-_]?security/i`
- ⚠️ If you handle health data, add more patterns

### Adding custom patterns

**For your app specifically:**

```ts
const SENSITIVE_FIELD_PATTERNS = [
  // ... existing patterns ...

  // Add app-specific patterns
  /otp/i, // One-time passwords
  /verification[-_]?code/i, // Email verification codes
  /reset[-_]?token/i, // Password reset tokens
  /phone/i, // Phone numbers (if sensitive in your app)
  /address/i, // Addresses (if sensitive in your app)
];
```

### Key Files

| File                                     | Purpose                         |
| ---------------------------------------- | ------------------------------- |
| `src/configuration/monitoring/index.tsx` | Sanitization patterns and logic |

### Common Issues

**Q: Still seeing passwords in Sentry?**

- Check field name matches a pattern (case-insensitive)
- Add custom pattern if needed: `/your[-_]?field/i`
- Check `beforeSend` is added to `Sentry.init()`
- Verify Sentry is enabled (`yarn dev-demo`, not `yarn dev`)

**Q: Too much data being filtered?**

- Review `SENSITIVE_FIELD_PATTERNS` - remove overly broad patterns
- Be specific: `/api[-_]?key/i` instead of `/key/i`

**Q: Error messages contain sensitive data?**

- Error messages are **NOT sanitized**
- Don't put passwords in error messages:

  ```ts
  // BAD ❌
  throw new Error(`Login failed for password: ${password}`);

  // GOOD ✅
  throw new Error("Login failed: Invalid credentials");
  ```

---

## Custom Tags and Contexts

### What is it?

Add **custom metadata** to errors so you can filter, search, and understand them better.

**Without Custom Tags:**

```
Error: Failed to submit score

100 users had this error... but:
- Which feature were they using?
- What was their tournament context?
- Were they admins or players?

🤷 No way to know!
```

**With Custom Tags:**

```
Error: Failed to submit score

Filter by:
  feature: "match-scoring"     → 80 errors
  user.role: "player"          → 75 errors
  tournament.id: "123"         → 12 errors  ← Found it!

→ Bug is specific to tournament 123! 🎯
```

### Understanding Sentry Events

Before we dive into custom tags, let's understand the **anatomy of a Sentry event**.

Every error sent to Sentry has multiple "buckets" where you can attach data:

```
┌─────────────────────────────────────────────────────┐
│                  Sentry Event                        │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Error: Failed to submit score                 │ │
│  │  Stack trace: MatchCard.tsx:42                 │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌─ Tags ──────────────────────────────────────────┐ │
│  │  Indexed strings for filtering/searching        │ │
│  │  • feature: "match-scoring"                     │ │
│  │  • user.role: "player"                          │ │
│  │  • environment: "production"                    │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌─ Contexts ──────────────────────────────────────┐ │
│  │  Rich objects with detailed information         │ │
│  │  • tournament: {                                │ │
│  │      id: "123",                                 │ │
│  │      name: "Summer Championship",               │ │
│  │      status: "in-progress"                      │ │
│  │    }                                            │ │
│  │  • match: {                                     │ │
│  │      id: "456",                                 │ │
│  │      round: 2                                   │ │
│  │    }                                            │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌─ Breadcrumbs ───────────────────────────────────┐ │
│  │  User action trail (last 100 actions)           │ │
│  │  1. [navigation] /tournaments                   │ │
│  │  2. [click] "View Tournament" button            │ │
│  │  3. [navigation] /tournament/123                │ │
│  │  4. [click] "Submit Score" button               │ │
│  │  5. [http] POST /api/scores → 500 error         │ │
│  │  6. [error] Failed to submit score              │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌─ Extra ────────────────────────────────────────┐ │
│  │  Additional unstructured data                   │ │
│  │  • Any extra info that doesn't fit elsewhere   │ │
│  │  • Less structured than contexts                │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**When to use each:**

| Bucket          | Use for                         | Example                            | Searchable? |
| --------------- | ------------------------------- | ---------------------------------- | ----------- |
| **Tags**        | Simple filters (strings only)   | `feature: "match-scoring"`         | ✅ Yes      |
| **Contexts**    | Rich objects with details       | `tournament: { id, name, status }` | ⚠️ Partial  |
| **Breadcrumbs** | User action history (automatic) | `[click] "Submit Score" button`    | ❌ No       |
| **Extra**       | Miscellaneous data              | Debug info, temporary data         | ❌ No       |

**Key differences:**

**Tags vs Contexts:**

```
Tags:
  ✅ Indexed and searchable
  ✅ Great for filtering in Sentry UI
  ⚠️ Strings only (no objects)
  ⚠️ Limited to ~200 unique values per tag

Contexts:
  ✅ Can store complex objects
  ✅ Better for detailed information
  ⚠️ Not fully indexed
  ⚠️ Harder to search/filter
```

**Rule of thumb:**

- Use **Tags** for things you want to **filter by** (feature names, user roles, flags)
- Use **Contexts** for things you want to **see details of** (tournament objects, match data)

### What we implemented

**1. Single tag**

**File: `src/configuration/monitoring/index.tsx`**

```ts
Monitoring.setTag("feature", "tournament-creation");
```

**2. Multiple tags at once**

```ts
Monitoring.setTags({
  feature: "match-scoring",
  "user.role": "player",
  "tournament.id": "123",
});
```

**3. Custom context (rich objects)**

```ts
Monitoring.setContext("tournament", {
  id: tournament.id,
  name: tournament.name,
  status: tournament.status,
  participantCount: tournament.participants.length,
});
```

**4. Convenience method (tag + context together)**

```ts
// Sets both:
// - Tag: feature = "tournament-detail"
// - Context: tournament-detail = { tournamentId, status, ... }
Monitoring.setSentryContext("tournament-detail", {
  tournamentId: "123",
  tournamentName: "Summer Championship",
  status: "in-progress",
});
```

**5. Clear context when done**

```ts
// When user leaves the page
Monitoring.clearSentryContext("tournament-detail");
```

### How to use in your code

**Pattern 1: Set context on page load**

**File: `src/routes/_auth/tournament/$tournamentId.tsx`**

```tsx
import { Monitoring } from "@/configuration/monitoring";

function TournamentDetailPage() {
  const { tournamentId } = useParams();
  const tournament = useTournament({ id: tournamentId });

  useEffect(() => {
    if (tournament.isSuccess && tournament.data) {
      // Set context when tournament loads
      Monitoring.setSentryContext("tournament-detail", {
        tournamentId: tournament.data.id,
        tournamentName: tournament.data.name,
        status: tournament.data.status,
        participantCount: tournament.data.participants.length,
      });
    }

    // Clear context when leaving page
    return () => {
      Monitoring.clearSentryContext("tournament-detail");
    };
  }, [tournament.isSuccess, tournament.data]);

  return <div>...</div>;
}
```

**Pattern 2: Tag specific operations**

**File: `src/domains/match/components/ScoreSubmitButton.tsx`**

```tsx
import { Monitoring } from "@/configuration/monitoring";

function ScoreSubmitButton() {
  const handleSubmit = async () => {
    // Tag this operation
    Monitoring.setTag("feature", "match-scoring");

    try {
      await submitScore(matchId, score);
    } catch (error) {
      // Error will include "feature: match-scoring" tag!
      Monitoring.captureException(error, {
        tags: { "operation.critical": "true" },
        extra: { matchId, score },
      });
    }
  };

  return <button onClick={handleSubmit}>Submit Score</button>;
}
```

**Pattern 3: Tag user actions**

**File: `src/domains/tournament/components/CreateTournamentButton.tsx`**

```tsx
import { Monitoring } from "@/configuration/monitoring";

function CreateTournamentButton() {
  const handleClick = () => {
    // Tag this feature
    Monitoring.setTags({
      feature: "tournament-creation",
      "user.action": "create-tournament",
    });

    // Set context with details
    Monitoring.setContext("tournament-creation", {
      timestamp: new Date().toISOString(),
      userRole: currentUser.role,
    });

    navigateToCreatePage();
  };

  return <button onClick={handleClick}>Create Tournament</button>;
}
```

### Visual Flow

```
┌──────────────────────────────────────────────────────┐
│         User Opens Tournament Detail Page            │
│  ┌─────────────────────────────────────────────────┐ │
│  │  useEffect(() => {                              │ │
│  │    Monitoring.setSentryContext(                 │ │
│  │      "tournament-detail",                       │ │
│  │      {                                          │ │
│  │        tournamentId: "123",                     │ │
│  │        tournamentName: "Summer Championship",   │ │
│  │        status: "in-progress"                    │ │
│  │      }                                          │ │
│  │    );                                           │ │
│  │  }, [tournament]);                              │ │
│  │                                                 │ │
│  │  Sentry now knows:                              │ │
│  │    ✅ Tag: feature = "tournament-detail"       │ │
│  │    ✅ Context: tournament-detail = {...}       │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
                        ↓
           User clicks "Submit Score"
                        ↓
┌──────────────────────────────────────────────────────┐
│              Error Occurs During Submit               │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Error: Failed to submit score                  │ │
│  │                                                 │ │
│  │  Tags (searchable):                             │ │
│  │    feature: "tournament-detail"                 │ │
│  │    environment: "production"                    │ │
│  │    user.role: "player"                          │ │
│  │                                                 │ │
│  │  Contexts (detailed info):                      │ │
│  │    tournament-detail: {                         │ │
│  │      tournamentId: "123",                       │ │
│  │      tournamentName: "Summer Championship",     │ │
│  │      status: "in-progress"                      │ │
│  │    }                                            │ │
│  │                                                 │ │
│  │  → You know exactly what the user was doing! 🎯│ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Filtering errors in Sentry

**By feature tag:**

```
Search: feature:"match-scoring"

Results: All errors from match scoring feature
```

**By multiple tags:**

```
Search: feature:"tournament-detail" AND user.role:"player"

Results: All errors from players viewing tournament details
```

**By context (partial search):**

```
Search: tournament-detail.tournamentId:"123"

Results: All errors related to tournament 123
```

### Best practices

**1. Use consistent tag names:**

```ts
// GOOD ✅
Monitoring.setTag("feature", "tournament-creation");
Monitoring.setTag("feature", "match-scoring");

// BAD ❌ (inconsistent naming)
Monitoring.setTag("feature", "tournament-creation");
Monitoring.setTag("screen", "match-scoring"); // Should be "feature"!
```

**2. Clear context when done:**

```ts
useEffect(() => {
  // Set context on mount
  Monitoring.setSentryContext("tournament-detail", { ... });

  // Clear context on unmount
  return () => {
    Monitoring.clearSentryContext("tournament-detail");
  };
}, []);
```

**3. Don't overuse tags (Sentry has limits):**

```ts
// BAD ❌ (too many unique values)
Monitoring.setTag("tournamentId", tournament.id); // 1000s of unique values!

// GOOD ✅ (use context for IDs)
Monitoring.setTag("feature", "tournament-detail");
Monitoring.setContext("tournament", { id: tournament.id });
```

**4. Use tags for filtering, contexts for details:**

```ts
// Tags: things you want to FILTER by
Monitoring.setTags({
  feature: "match-scoring",
  "user.role": "player",
  "tournament.type": "single-elimination",
});

// Contexts: things you want to SEE DETAILS of
Monitoring.setContext("tournament", {
  id: "123",
  name: "Summer Championship",
  participantCount: 24,
  rounds: 5,
});
```

### Common tag names

Here are suggested tag names for consistency:

| Tag Name             | Values                                 | Use Case                    |
| -------------------- | -------------------------------------- | --------------------------- |
| `feature`            | "match-scoring", "tournament-creation" | Filter by feature           |
| `user.action`        | "create", "update", "delete", "submit" | Filter by action            |
| `tournament.type`    | "single-elimination", "round-robin"    | Filter by tournament format |
| `operation.critical` | "true", "false"                        | Filter critical operations  |
| `performance.slow`   | "true", "false"                        | Filter slow operations      |

### Key Files

| File                                     | Purpose                 |
| ---------------------------------------- | ----------------------- |
| `src/configuration/monitoring/index.tsx` | Tag and context methods |

### Common Issues

**Q: Tags not showing up in Sentry?**

- Check Sentry is enabled (`yarn dev-demo`, not `yarn dev`)
- Check tag was set BEFORE error occurred
- Check tag value is a string (not object)
- Verify in browser console: `Sentry.setTag()` should not throw errors

**Q: Too many unique tag values warning?**

- Sentry limits tags to ~200 unique values
- Don't use tags for IDs (use contexts instead)
- Use broader categories: "admin"/"player" instead of specific user IDs

**Q: Context data not showing up?**

- Check context was set before error
- Check context value is an object (not string)
- Look under "Additional Data" → "Contexts" in Sentry UI (not Tags)

**Q: When should I clear context?**

- Clear when user leaves the page/feature
- Use `return () => Monitoring.clearSentryContext(...)` in useEffect
- Prevents stale context from appearing in unrelated errors

---

That's it! You now have a complete Sentry monitoring setup with:

✅ Error Boundaries - Catch React errors gracefully
✅ Environment Configuration - Different settings per environment
✅ User Identification - Link errors to specific users
✅ Release Tracking - Git commit linking with source maps
✅ Data Sanitization - Strip sensitive data automatically
✅ Custom Tags & Contexts - Filter and organize errors

For questions or issues, check the troubleshooting sections in each phase above.
