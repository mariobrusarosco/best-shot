# Tutorial: Monitor Your Frontend Web App with Sentry

A comprehensive guide to implementing production-grade error monitoring and performance tracking in a React TypeScript application.

## What You'll Build

By the end of this tutorial, you'll have:
- ✅ Real-time error tracking in production
- ✅ Performance monitoring for slow operations
- ✅ Session replay to debug user issues
- ✅ User identification for better support
- ✅ Release tracking for deployment correlation
- ✅ Environment-specific configurations
- ✅ Data sanitization for security
- ✅ Custom performance metrics

## Prerequisites

- React 18+ application with TypeScript
- Vite build tool
- A Sentry account (free tier works great)

## Tutorial Outline

### Session 1: Add Error Boundary with Fallback UI
### Session 2: Environment-Specific Configuration
### Session 3: User Identification Integration
### Session 4: Release Tracking Setup
### Session 5: Configure API Tracing
### Session 6: Data Sanitization & Security
### Session 7: Custom Tags & Context
### Session 8: Custom Performance Monitoring

---

## Session 1: Add Error Boundary with Fallback UI

> **Goal**: Set up Sentry from scratch and implement an error boundary to catch React errors gracefully.

### Step 1.1: Install Sentry Dependencies

First, install the required Sentry packages:

```bash
yarn add @sentry/react
yarn add -D @sentry/vite-plugin
```

**What these packages do:**
- `@sentry/react`: Core Sentry SDK for React with error boundaries and integrations
- `@sentry/vite-plugin`: Uploads source maps to Sentry for better error debugging

### Step 1.2: Get Your Sentry DSN

1. Sign up at [sentry.io](https://sentry.io) (free tier available)
2. Create a new project and select "React"
3. Copy your DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)
4. Add it to your `.env` files:

```bash
# .env.example
VITE_SENTRY_DSN=your-dsn-here

# .env (for local development - optional)
VITE_SENTRY_DSN=

# .env.staging
VITE_SENTRY_DSN=your-staging-dsn

# .env.production
VITE_SENTRY_DSN=your-production-dsn
```

### Step 1.3: Create Monitoring Configuration

Create a new monitoring module with basic Sentry initialization:

**File**: `src/configuration/monitoring/index.tsx`

```typescript
import * as Sentry from "@sentry/react";

const ENVS_TO_ENABLE = ["demo", "staging", "production"];

export const Monitoring = {
	init: () => {
		// Only enable Sentry in non-local environments
		if (!ENVS_TO_ENABLE.includes(import.meta.env.MODE)) {
			console.log("Sentry disabled in local-dev mode");
			return;
		}

		Sentry.init({
			dsn: import.meta.env.VITE_SENTRY_DSN,

			// Core integrations
			integrations: [
				Sentry.browserTracingIntegration(),
				Sentry.replayIntegration(),
			],

			// Performance Monitoring
			tracesSampleRate: 1.0, // 100% - we'll optimize this later

			// Session Replay
			replaysSessionSampleRate: 0.1, // 10% of sessions
			replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
		});

		console.log("Sentry initialized successfully");
	},
};
```

**Key Concepts:**

- **Environment filtering**: Only run Sentry in demo/staging/production to avoid noise from local development
- **browserTracingIntegration()**: Tracks page loads, navigation, and API calls automatically
- **replayIntegration()**: Records user sessions (like a DVR) to replay exactly what happened before an error
- **tracesSampleRate**: Controls what % of performance traces to capture (we start at 100% for testing)
- **replaysSessionSampleRate**: Records 10% of all sessions (even without errors) for general insights
- **replaysOnErrorSampleRate**: Records 100% of sessions where errors occur for debugging

### Step 1.4: Initialize Monitoring in Your App

Update your configuration to initialize monitoring on app startup:

**File**: `src/configuration/index.ts`

```typescript
import { Monitoring } from "@/configuration/monitoring";

export const AppConfiguration = {
	init: () => {
		Monitoring.init();
	},
};
```

Then call it in your main App component:

**File**: `src/App.tsx`

```typescript
import { AppConfiguration } from "./configuration";

// Initialize before rendering
AppConfiguration.init();

function App() {
	// Your app code...
}
```

### Step 1.5: Update Your Existing Error Component for Dual Usage

**Important Discovery**: If you're using TanStack Router, you likely already have an error component configured as the `defaultErrorComponent` in your router setup. This component handles **routing errors**.

Now we want to use the **same component** for Sentry's ErrorBoundary to handle **React render errors**. But there's a catch: the two systems pass different props!

**TanStack Router passes:**
```typescript
{
  error: Error,
  info?: { componentStack: string },
  reset: () => void
}
```

**Sentry ErrorBoundary passes:**
```typescript
{
  error: unknown,
  componentStack: string,
  eventId: string,
  resetError: () => void
}
```

**Solution**: Create a unified interface that supports both!

**File**: `src/domains/global/components/error.tsx`

Update your existing `AppError` component to work with both systems:

```typescript
import { styled, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { BestShotIcon } from "@/assets/best-shot-icon";
import { theme, UIHelper } from "@/theming/theme";

const DEFAULT_ERROR_MESSAGE = "Something unexpected has happened.";

/**
 * AppError component that works with both TanStack Router and Sentry ErrorBoundary
 *
 * TanStack Router passes: { error: Error, info?: { componentStack }, reset: () => void }
 * Sentry ErrorBoundary passes: { error: unknown, componentStack: string, eventId: string, resetError: () => void }
 */
interface AppErrorProps {
	// Common props
	error: unknown;

	// TanStack Router props
	info?: { componentStack: string };
	reset?: () => void;

	// Sentry ErrorBoundary props
	componentStack?: string;
	eventId?: string;
	resetError?: () => void;
}

const AppError = ({ error }: AppErrorProps) => {
	const errorMessage = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;

	console.error("[BEST SHOT] - App General Error", error);

	return (
		<Wrapper data-iu="general-error-page">
			<BestShotIcon fill={theme.palette.neutral[100]} />

			<Stack textAlign="center" gap={2}>
				<Typography variant="h1" color={theme.palette.neutral[100]}>
					Ops!
				</Typography>
				<Typography variant="paragraph" color={theme.palette.teal[500]}>
					{errorMessage || DEFAULT_ERROR_MESSAGE}
				</Typography>
			</Stack>
		</Wrapper>
	);
};

const Wrapper = styled(Stack)(({ theme }) => ({
	height: "100dvh",
	width: "100%",
	backgroundColor: theme.palette.black[800],
	display: "grid",
	placeContent: "center",
	borderTopLeftRadius: theme.spacing(4),
	borderTopRightRadius: theme.spacing(4),
	gap: theme.spacing(3),
	padding: theme.spacing(0, 2),

	[UIHelper.whileIs("mobile")]: {
		placeItems: "center",
		margin: "20px auto 0",
		maxWidth: "350px",
		svg: {
			width: "150px",
		},
	},
}));

export { AppError };
```

**Key Changes:**

- Created **unified interface** that supports both TanStack Router AND Sentry ErrorBoundary
- Added JSDoc comment explaining the dual usage
- Separated props by source system for clarity:
  - Common: `error`
  - TanStack Router: `info`, `reset`
  - Sentry: `componentStack`, `eventId`, `resetError`
- Changed `error` type to `unknown` (most permissive, works with both)
- Added type guard: `error instanceof Error` to safely extract message

**Why This Matters:**

Now the same `AppError` component works seamlessly with:
1. **TanStack Router** (`defaultErrorComponent`) - catches routing errors
2. **Sentry ErrorBoundary** (`fallback`) - catches React render errors
3. Both systems will report errors to Sentry automatically!

### Step 1.6: Verify Your TanStack Router Configuration

If you're using TanStack Router, you should already have `AppError` configured as the router's error component:

**File**: `src/app-router.tsx`

```typescript
const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: { isAuthenticated: false, isLoadingAuth: false },
	} as RouterContext,
	defaultErrorComponent: AppError, // ✅ Already handles routing errors
	defaultNotFoundComponent: AppNotFound,
});
```

This means `AppError` is **already catching routing errors** (like failed data loads, invalid routes, etc.) and reporting them to Sentry thanks to our integration!

### Step 1.7: Wrap Your App with Sentry's ErrorBoundary

Now let's add Sentry's ErrorBoundary to catch React render errors (the ones TanStack Router doesn't catch):

**File**: `src/App.tsx`

```typescript
import * as Sentry from "@sentry/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppQueryProvider } from "@/configuration/app-query";
import { AppError } from "@/domains/global/components/error";
import { theme } from "@/domains/ui-system/theme";
import LaunchDarklyUserIdentifier from "@/utils/LaunchDarklyUserIdentifier";
import { AppRouter } from "./app-router";
import { AppConfiguration } from "./configuration";
import { Authentication } from "./domains/authentication";
import { GlobalCSS } from "./theming/global-styles";
import "./theming/load-configuration";

const { AuthProvider } = Authentication;

AppConfiguration.init();

function App() {
	return (
		<Sentry.ErrorBoundary fallback={AppError} showDialog>
			<AppQueryProvider>
				<AuthProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<GlobalCSS />
						<AppRouter />
						<LaunchDarklyUserIdentifier />
					</ThemeProvider>
				</AuthProvider>
			</AppQueryProvider>
		</Sentry.ErrorBoundary>
	);
}

export default App;
```

**What Changed:**

- Imported existing `AppError` component from `@/domains/global/components/error`
- Wrapped entire app with `<Sentry.ErrorBoundary>`
- `fallback={AppError}`: Shows your branded error UI when errors occur
- `showDialog`: Optionally shows Sentry's user feedback dialog (user can report what they were doing)

### Understanding What ErrorBoundary Catches (And Doesn't)

**ErrorBoundary is your global safety net** - it wraps your entire React app and catches errors that would otherwise crash your app and show a blank screen.

#### ✅ What ErrorBoundary WILL Catch:

- **Component render errors**: Errors thrown during the render phase of any component
- **Lifecycle method errors**: Errors in `componentDidMount`, `componentDidUpdate`, etc. (class components)
- **Constructor errors**: Errors in class component constructors
- **Hook errors**: Errors thrown inside `useState`, `useEffect`, `useMemo`, etc.
- **Child component errors**: Any error from any component in your component tree

**Example:**
```typescript
function BrokenComponent() {
  const data = null;
  // This will be caught by ErrorBoundary!
  return <div>{data.name}</div>; // TypeError: Cannot read property 'name' of null
}
```

#### ❌ What ErrorBoundary WILL NOT Catch:

- **Event handler errors**: Errors inside `onClick`, `onChange`, `onSubmit`, etc.
- **Async code**: Errors in `setTimeout`, `setInterval`, Promises, `async/await`
- **Server-side rendering errors**: Errors during SSR
- **Errors in the ErrorBoundary itself**: If your fallback component throws
- **Errors outside React**: Non-React code errors

**Examples that require manual handling:**

```typescript
function ComponentWithEventHandler() {
  const handleClick = () => {
    // ErrorBoundary will NOT catch this!
    throw new Error("Button click error");

    // Solution: Use try/catch + Sentry.captureException()
    try {
      // risky operation
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return <button onClick={handleClick}>Click Me</button>;
}

function ComponentWithAsync() {
  useEffect(() => {
    // ErrorBoundary will NOT catch this!
    fetchData().catch((error) => {
      // Solution: Manually report to Sentry
      Sentry.captureException(error);
    });
  }, []);
}
```

**Key Takeaway:** ErrorBoundary is your **last line of defense for rendering errors**. For event handlers and async code, you'll need to manually wrap in `try/catch` and call `Sentry.captureException()`. We'll cover manual error capturing in later sessions.

### Step 1.8: Test Your Error Boundary

Add a test button to trigger an error (remove after testing):

```typescript
// Temporary test component
function ErrorTest() {
	const [shouldError, setShouldError] = useState(false);

	if (shouldError) {
		throw new Error("Test error for Sentry!");
	}

	return (
		<Button onClick={() => setShouldError(true)}>
			Trigger Test Error
		</Button>
	);
}
```

**What to verify:**

1. Click the test button
2. See your ErrorFallback component appear
3. Check Sentry dashboard - you should see the error with full stack trace
4. Click "Try Again" to reset the error boundary

### Step 1.9: Verify Session Replay

After triggering an error:

1. Go to your Sentry project dashboard
2. Click on the error event
3. Look for the "Replay" tab
4. Watch a video replay of exactly what the user did before the error occurred

**Why This Matters:**

Session replay is like having a DVR for your app. You can see:
- What buttons the user clicked
- What they typed (with sensitive data masked)
- Their mouse movements
- Network requests
- Console logs

This is invaluable for debugging issues you can't reproduce locally.

---

## What You've Accomplished

✅ Installed and configured Sentry from scratch
✅ Created environment-aware initialization
✅ Built a user-friendly error fallback UI
✅ Wrapped your app with error boundary protection
✅ Enabled session replay for debugging
✅ Tested error reporting end-to-end

**Next Steps**: In Session 2, we'll optimize Sentry for different environments (local-dev vs staging vs production) with smart sampling rates to reduce costs.

---

## Session 2: Environment-Specific Configuration

> **Goal**: Optimize Sentry costs and performance by configuring different sample rates for each environment.

### Why Environment-Specific Configuration Matters

In Session 1, we set `tracesSampleRate: 1.0` (100%), which means Sentry captures **every single transaction** in your app. This is great for testing, but in production with thousands of users, this will:

- 💸 **Cost you a lot of money** - Sentry charges based on events and transactions
- 📊 **Waste quota on redundant data** - You don't need 100% of routine operations
- 🐌 **Add unnecessary overhead** - Processing every transaction adds latency

**The Solution**: Use different sample rates for each environment based on your needs.

### Understanding Sample Rates

**`tracesSampleRate`**: What % of performance transactions to capture
- `1.0` = 100% of all page loads, API calls, route changes
- `0.1` = 10% (randomly sampled)
- Production apps typically use **10-20%**

**`replaysSessionSampleRate`**: What % of normal sessions to record
- `1.0` = 100% of all user sessions (expensive!)
- `0.05` = 5% (good for production)
- Used to understand general user behavior

**`replaysOnErrorSampleRate`**: What % of error sessions to record
- `1.0` = 100% (always record when errors happen - highly recommended!)
- This is your debugging superpower

### Step 2.1: Create Environment-Specific Configuration

Update your monitoring module to return different configs based on environment:

**File**: `src/configuration/monitoring/index.tsx`

```typescript
import * as Sentry from "@sentry/react";

const ENVS_TO_ENABLE = ["demo", "staging", "production"];

/**
 * Environment-specific Sentry configuration
 * Optimizes sample rates and features based on environment
 */
const getEnvironmentConfig = (environment: string) => {
	switch (environment) {
		case "production":
			return {
				// Production: Lower sample rates to reduce costs
				tracesSampleRate: 0.1, // 10% of transactions
				replaysSessionSampleRate: 0.05, // 5% of sessions
				replaysOnErrorSampleRate: 1.0, // 100% of error sessions
				environment: "production",
			};

		case "staging":
			return {
				// Staging: Higher sample rates for thorough testing
				tracesSampleRate: 0.5, // 50% of transactions
				replaysSessionSampleRate: 0.2, // 20% of sessions
				replaysOnErrorSampleRate: 1.0, // 100% of error sessions
				environment: "staging",
			};

		case "demo":
			return {
				// Demo: Moderate sample rates
				tracesSampleRate: 0.3, // 30% of transactions
				replaysSessionSampleRate: 0.1, // 10% of sessions
				replaysOnErrorSampleRate: 1.0, // 100% of error sessions
				environment: "demo",
			};

		default:
			return {
				// Default fallback
				tracesSampleRate: 0.1,
				replaysSessionSampleRate: 0.05,
				replaysOnErrorSampleRate: 1.0,
				environment: "unknown",
			};
	}
};

export const Monitoring = {
	init: () => {
		const currentEnv = import.meta.env.MODE;

		// Only enable Sentry in non-local environments
		if (!ENVS_TO_ENABLE.includes(currentEnv)) {
			console.log(`[Sentry] Disabled in ${currentEnv} mode`);
			return;
		}

		const config = getEnvironmentConfig(currentEnv);

		Sentry.init({
			dsn: import.meta.env.VITE_SENTRY_DSN,
			environment: config.environment,

			// Core integrations
			integrations: [
				Sentry.browserTracingIntegration(),
				Sentry.replayIntegration(),
			],

			// Performance Monitoring (environment-specific)
			tracesSampleRate: config.tracesSampleRate,

			// Session Replay (environment-specific)
			replaysSessionSampleRate: config.replaysSessionSampleRate,
			replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,
		});

		console.log(
			`[Sentry] Initialized for ${config.environment} environment`,
			`\n  - Traces: ${config.tracesSampleRate * 100}%`,
			`\n  - Replays: ${config.replaysSessionSampleRate * 100}%`,
			`\n  - Error Replays: ${config.replaysOnErrorSampleRate * 100}%`,
		);
	},
};
```

### What Changed:

1. **`getEnvironmentConfig()` function**: Returns different config objects based on environment
2. **Production config**: Conservative sample rates (10% traces, 5% replays) to minimize costs
3. **Staging config**: Generous sample rates (50% traces, 20% replays) for thorough testing
4. **Demo config**: Moderate sample rates (30% traces, 10% replays) for demos
5. **Environment tagging**: Sets `environment` field so you can filter issues in Sentry dashboard
6. **Enhanced logging**: Console shows exact sample rates for debugging

### Step 2.2: Understanding the Cost Impact

Let's do some math to understand the savings:

**Scenario**: Production app with 100,000 page views per day

#### Before (100% sampling):
- **Traces**: 100,000 transactions/day
- **Replays**: 10,000 session replays/day (at 10% sampling)
- **Monthly cost**: ~$300-500 (depending on Sentry plan)

#### After (10% sampling):
- **Traces**: 10,000 transactions/day (90% reduction!)
- **Replays**: 5,000 session replays/day (50% reduction)
- **Monthly cost**: ~$50-100 (5-10x cheaper!)

**Error sessions are always 100% recorded**, so you don't lose any debugging power when things go wrong.

### Step 2.3: Verify Environment Detection

Check your browser console when the app loads. You should see:

**In staging:**
```
[Sentry] Initialized for staging environment
  - Traces: 50%
  - Replays: 20%
  - Error Replays: 100%
```

**In production:**
```
[Sentry] Initialized for production environment
  - Traces: 10%
  - Replays: 5%
  - Error Replays: 100%
```

**In local-dev:**
```
[Sentry] Disabled in local-dev mode
```

### Step 2.4: Filter by Environment in Sentry Dashboard

Now that we're tagging events with `environment`, you can filter issues in Sentry:

1. Go to your Sentry dashboard
2. Click on the environment dropdown (top of page)
3. Select "production", "staging", or "demo"
4. See only issues from that environment

This is invaluable when you want to see production-only bugs without staging noise.

### Customizing Sample Rates for Your Needs

**High-traffic apps** (1M+ users):
- Production traces: `0.01` (1%) or even `0.001` (0.1%)
- Production replays: `0.01` (1%)

**Low-traffic apps** (< 10K users):
- Production traces: `0.5` (50%) - you can afford it!
- Production replays: `0.2` (20%)

**Rule of thumb**: Start conservative (10%), then adjust based on:
- Your Sentry quota limits
- How much debugging data you actually need
- Your budget

### When to Increase Sample Rates Temporarily

Sometimes you want to temporarily boost sampling for debugging:

```typescript
// In getEnvironmentConfig()
case "production":
	return {
		// Temporarily boost to 100% to debug a specific issue
		tracesSampleRate: import.meta.env.VITE_DEBUG_MODE ? 1.0 : 0.1,
		// ... rest of config
	};
```

Then set `VITE_DEBUG_MODE=true` in your `.env.production` file when needed.

---

## What You've Accomplished

✅ Created environment-specific configurations for demo/staging/production
✅ Optimized sample rates to reduce Sentry costs by 5-10x
✅ Added environment tagging for filtering issues in dashboard
✅ Maintained 100% error session recording for debugging
✅ Added helpful logging to verify configuration

**Next Steps**: In Session 3, we'll add user identification so you can see which users are experiencing errors and reach out to them proactively.

---

## Session 3: User Identification

> **Goal**: Link all errors and sessions to specific users so you can see who's experiencing problems and reach out proactively.

### Why User Identification Matters

Without user identification, Sentry shows you errors but you don't know **who** is affected. With user identification, you get superpowers:

🎯 **See which users are experiencing errors**
- "User sarah@example.com got 3 errors in the last hour"
- Filter errors by specific users
- Track error patterns per user

📧 **Proactive support**
- Reach out to affected users before they complain
- "Hey Sarah, we noticed you had issues with checkout - we just fixed it!"

🔍 **Better debugging**
- Reproduce issues with specific user accounts
- Understand user-specific conditions (permissions, data, etc.)

📊 **Track user impact**
- "This bug affected 150 users" vs "This bug only affected 2 admins"
- Prioritize fixes based on user impact

### How User Identification Works

When a user logs in, we call `Sentry.setUser()` with their info:

```typescript
Sentry.setUser({
  id: "user-123",
  email: "sarah@example.com",
  username: "sarah_dev",
  role: "admin"
});
```

From that point forward, **all errors and sessions** from that browser are tagged with this user info. You can add custom fields beyond the defaults (id, email, username).

### Step 3.1: Add setUser Method to Monitoring Module

Update your monitoring module to support user identification:

**File**: `src/configuration/monitoring/index.tsx`

```typescript
interface UserIdentity {
	id: string;
	email?: string;
	username?: string;
	role?: string;
}

export const Monitoring = {
	init: () => {
		// ... existing init code ...
	},

	/**
	 * Identify the current user in Sentry
	 * This links all errors and sessions to the specific user
	 */
	setUser: (user: UserIdentity | null) => {
		const currentEnv = import.meta.env.MODE;

		// Only set user in enabled environments
		if (!ENVS_TO_ENABLE.includes(currentEnv)) {
			return;
		}

		if (user) {
			Sentry.setUser({
				id: user.id,
				email: user.email,
				username: user.username,
				role: user.role,
			});
			console.log(`[Sentry] User identified: ${user.username || user.email || user.id}`);
		} else {
			Sentry.setUser(null);
			console.log("[Sentry] User cleared (logged out)");
		}
	},
};
```

**What This Does:**

- **`setUser(user)`**: Identifies a logged-in user to Sentry
- **`setUser(null)`**: Clears user data (call on logout)
- **Environment check**: Only works in enabled environments (not local-dev)
- **Logging**: Shows when users are identified for debugging

### Step 3.2: Create SentryUserIdentifier Component

This component automatically watches for auth changes and identifies users:

**File**: `src/configuration/monitoring/components/SentryUserIdentifier.tsx`

```typescript
import { useEffect } from "react";
import { useMember } from "@/domains/member/hooks/use-member";
import { Authentication } from "@/domains/authentication";
import { Monitoring } from "../index";

const { useAppAuth } = Authentication;

/**
 * SentryUserIdentifier Component
 *
 * Automatically identifies users to Sentry when they log in
 * and clears user data when they log out.
 *
 * This links all errors and sessions to specific users, enabling:
 * - See which users are experiencing errors
 * - Contact affected users proactively
 * - Filter errors by user
 * - Track user-specific error patterns
 */
export function SentryUserIdentifier() {
	const { isAuthenticated } = useAppAuth();
	const member = useMember({ fetchOnMount: isAuthenticated });

	useEffect(() => {
		if (isAuthenticated && member.isSuccess && member.data) {
			// User is logged in and member data is loaded
			Monitoring.setUser({
				id: member.data.id,
				email: member.data.email,
				username: member.data.nickName,
				role: member.data.role,
			});
		} else if (!isAuthenticated) {
			// User logged out - clear Sentry user data
			Monitoring.setUser(null);
		}
	}, [isAuthenticated, member.isSuccess, member.data]);

	// This component doesn't render anything
	return null;
}
```

**How It Works:**

1. **Watches authentication state**: Uses your existing `useAppAuth()` hook
2. **Fetches member data**: Uses your existing `useMember()` hook
3. **Identifies user on login**: When authenticated AND member data loads, calls `Monitoring.setUser()`
4. **Clears user on logout**: When `isAuthenticated` becomes false, clears Sentry user
5. **Zero UI**: Returns `null` - it's a background process

### Step 3.3: Add Component to Your App

Add the `SentryUserIdentifier` component to your app tree:

**File**: `src/App.tsx`

```typescript
import * as Sentry from "@sentry/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppQueryProvider } from "@/configuration/app-query";
import { SentryUserIdentifier } from "@/configuration/monitoring/components/SentryUserIdentifier";
import { AppError } from "@/domains/global/components/error";
import { theme } from "@/domains/ui-system/theme";
import LaunchDarklyUserIdentifier from "@/utils/LaunchDarklyUserIdentifier";
import { AppRouter } from "./app-router";
import { AppConfiguration } from "./configuration";
import { Authentication } from "./domains/authentication";
import { GlobalCSS } from "./theming/global-styles";
import "./theming/load-configuration";

const { AuthProvider } = Authentication;

AppConfiguration.init();

function App() {
	return (
		<Sentry.ErrorBoundary fallback={AppError} showDialog>
			<AppQueryProvider>
				<AuthProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<GlobalCSS />
						<AppRouter />
						<LaunchDarklyUserIdentifier />
						<SentryUserIdentifier />
					</ThemeProvider>
				</AuthProvider>
			</AppQueryProvider>
		</Sentry.ErrorBoundary>
	);
}

export default App;
```

**Placement Matters:**

- Must be **inside `<AuthProvider>`** to access auth state
- Must be **inside `<AppQueryProvider>`** to use TanStack Query hooks
- Placed alongside `LaunchDarklyUserIdentifier` for consistency

### Step 3.4: Test User Identification

1. **Log in to your app** (staging or demo environment)
2. **Check the browser console**, you should see:
   ```
   [Sentry] User identified: sarah_dev
   ```

3. **Trigger a test error** (use the test button from Session 1)
4. **Go to Sentry dashboard** → Click on the error
5. **Look for the "User" section** - you should see:
   ```
   ID: user-123
   Email: sarah@example.com
   Username: sarah_dev
   Role: admin
   ```

6. **Log out of your app**
7. **Check console again**, you should see:
   ```
   [Sentry] User cleared (logged out)
   ```

### Step 3.5: Filter Errors by User in Sentry

Now you can filter errors by specific users in the Sentry dashboard:

1. Go to Issues page
2. Click "Search" or "Add a search term"
3. Type: `user.email:sarah@example.com`
4. See only errors from that specific user

**Useful search queries:**
- `user.role:admin` - Errors from admins only
- `user.id:user-123` - Errors from specific user ID
- `user.username:*` - Any error from logged-in users
- `!has:user.id` - Errors from anonymous (not logged in) users

### Privacy Considerations

**⚠️ Important**: Be careful what user data you send to Sentry!

**Safe to send:**
- User ID (anonymized if needed: hash the ID)
- Username
- Role/permissions
- Account tier (free/pro/enterprise)

**DO NOT send:**
- Passwords (obviously!)
- Credit card numbers
- Social security numbers
- Private messages
- Health information

**PII (Personally Identifiable Information):**
- Email addresses are usually OK (Sentry is SOC 2 compliant)
- Full names are usually OK
- If you're in EU/GDPR zones, check your data processing agreement

We'll cover data sanitization in Session 6 to automatically strip sensitive data.

### Adding Custom User Fields

You can add custom fields beyond id/email/username:

```typescript
Monitoring.setUser({
	id: member.data.id,
	email: member.data.email,
	username: member.data.nickName,
	role: member.data.role,
	// Custom fields:
	accountTier: "pro", // Free vs Pro vs Enterprise
	signupDate: member.data.createdAt,
	totalLogins: member.data.loginCount,
});
```

Then search by custom fields:
- `user.accountTier:pro`
- `user.signupDate:<2024-01-01`

### When to Clear User Data

Always clear user data on logout to prevent misattribution:

```typescript
// In your logout handler
const handleLogout = async () => {
	await logout();
	Monitoring.setUser(null); // Clear Sentry user
};
```

Our `SentryUserIdentifier` component handles this automatically.

---

## What You've Accomplished

✅ Added user identification to your monitoring setup
✅ Created automatic user tracking that syncs with auth state
✅ Linked all errors and sessions to specific users
✅ Enabled filtering and searching by user in Sentry dashboard
✅ Added privacy-conscious user data collection
✅ Automatic cleanup on logout

**Next Steps**: In Session 4, we'll add release tracking to link errors to specific deployments and git commits.

---

## Session 4: Release Tracking

> **Goal**: Link errors to specific deployments and git commits so you can track which release introduced a bug.

### Why Release Tracking Matters

Without release tracking, you see errors but don't know **when** they were introduced. With releases, you get:

📅 **Track when bugs appear**
- "This error started appearing after release v2.3.1"
- See error trends by release
- Identify problematic deployments immediately

🔗 **Link to git commits**
- Click error → See exact code changes that caused it
- Jump directly to GitHub/GitLab commit
- View diff to understand what changed

📊 **Measure release health**
- "Release v2.3.0 has 50% more errors than v2.2.9"
- Set up alerts: "More than 100 errors in first hour of release"
- Decide whether to rollback

🎯 **Faster debugging**
- "Bug appeared in commit abc123"
- Narrow down to specific PR/feature
- Contact the developer who made the change

### How Release Tracking Works

When you build your app for production, the Sentry Vite plugin:

1. **Generates a unique release ID** (usually from git commit hash)
2. **Uploads source maps** to Sentry (for readable stack traces)
3. **Associates git commits** with the release
4. **Injects release ID** into your bundle

Then, when errors occur, they're tagged with: `release: "best-shot@341ce12"`

### Step 4.1: Get Your Sentry Auth Token

To upload source maps, you need a Sentry auth token:

1. Go to Sentry → **Settings** → **Auth Tokens**
2. Click **"Create New Token"**
3. Name: `CI/CD Build Token`
4. Scopes: Select **"project:releases"** and **"org:read"**
5. Copy the token (you'll only see it once!)
6. Add to your `.env` files:

```bash
# .env.production
SENTRY_AUTH_TOKEN="sntrys_abc123def456..."
```

**⚠️ Security Note**: Never commit this token to git! Add `.env.production` to `.gitignore`.

### Step 4.2: Update Environment Variables

Add Sentry config to your `.env.example`:

**File**: `.env.example`

```bash
# Sentry Monitoring
VITE_SENTRY_DSN="<your-sentry-dsn>"
SENTRY_AUTH_TOKEN="<your-sentry-auth-token>"

# Optional: Override default org/project
SENTRY_ORG="mario-79"
SENTRY_PROJECT="best-shot-demo"
```

Then create corresponding `.env.production` with real values.

### Step 4.3: Centralize Sentry Environment Configuration

**Important Architecture Decision**: Before we configure the Vite plugin, let's centralize the list of environments where Sentry is enabled. This prevents bugs from having duplicate constants that get out of sync.

**File**: `src/configuration/monitoring/constants.ts` (NEW FILE)

```typescript
/**
 * Centralized Sentry monitoring constants
 * Used by both runtime monitoring code and build-time Vite plugin
 */

/**
 * Environments where Sentry monitoring is enabled
 * - local-dev: Disabled (too noisy, no real errors)
 * - demo: Enabled (test with real-ish data)
 * - staging: Enabled (pre-production testing)
 * - production: Enabled (live monitoring)
 */
export const SENTRY_ENABLED_ENVIRONMENTS = ["demo", "staging", "production"] as const;

export type SentryEnvironment = (typeof SENTRY_ENABLED_ENVIRONMENTS)[number];
```

**Why Centralize?**
- ✅ **Single source of truth** - Change in one place, applies everywhere
- ✅ **Type safety** - TypeScript ensures consistency
- ✅ **No duplicate constants** - Avoids bugs from configs getting out of sync
- ✅ **Easy to maintain** - Want to remove staging? Change it once!

### Step 4.4: Update Monitoring Config to Import Constants

**File**: `src/configuration/monitoring/index.tsx`

```typescript
import * as Sentry from "@sentry/react";
import { SENTRY_ENABLED_ENVIRONMENTS } from "./constants";

// Remove: const ENVS_TO_ENABLE = ["demo", "staging", "production"];

export const Monitoring = {
	init: () => {
		const currentEnv = import.meta.env.MODE;

		// Only enable Sentry in non-local environments
		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			console.log(`[Sentry] Disabled in ${currentEnv} mode`);
			return;
		}

		// ... rest of init code
	},

	setUser: (user: UserIdentity | null) => {
		const currentEnv = import.meta.env.MODE;

		// Only set user in enabled environments
		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			return;
		}

		// ... rest of setUser code
	},
};
```

### Step 4.5: Enable Sentry Vite Plugin for All Environments

**Important**: If you enable Sentry in multiple environments (demo, staging, production), you should upload source maps for ALL of them. Otherwise, stack traces will be minified and hard to debug.

Update your Vite config to import and use the centralized constant:

**File**: `vite.config.ts`

```typescript
import path from "node:path";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { SENTRY_ENABLED_ENVIRONMENTS } from "./src/configuration/monitoring/constants";

export default defineConfig(({ mode }) => ({
	server: {
		host: true,
		cors: {
			origin: "*",
		},
	},

	plugins: [
		TanStackRouterVite(),
		react(),
		checker({
			typescript: true,
		}),
		// Enable Sentry for demo, staging, and production builds
		SENTRY_ENABLED_ENVIRONMENTS.includes(mode as any) &&
			sentryVitePlugin({
				org: process.env.SENTRY_ORG || "mario-79",
				project: process.env.SENTRY_PROJECT || "best-shot-demo",
				authToken: process.env.SENTRY_AUTH_TOKEN,
				telemetry: false,
				sourcemaps: {
					assets: "./dist/**",
				},
			}),
	].filter(Boolean), // Remove falsy values (when mode not in SENTRY_ENABLED_ENVIRONMENTS)

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			settings: path.resolve(__dirname, "./settings"),
		},
	},

	build: {
		sourcemap: true, // Required for Sentry source maps
		minify: SENTRY_ENABLED_ENVIRONMENTS.includes(mode as any) ? "esbuild" : false,
	},

	// ... rest of config
}));
```

**What This Does:**

- **Imports centralized constant**: Same list used in runtime monitoring and build config
- **Runs for demo, staging, AND production**: `SENTRY_ENABLED_ENVIRONMENTS.includes(mode as any)`
- **Uploads source maps**: For all enabled environments
- **Creates releases**: Separate releases for demo/staging/production
- **Associates commits**: Links releases to git repository
- **Readable stack traces**: In all environments, not just production

**Why Upload for All Environments?**

If you only upload source maps for production:
- ❌ Staging errors show **minified stack traces** (hard to debug)
- ❌ Can't filter by `release:` in demo/staging
- ❌ Can't test release tracking before production

With source maps for all environments:
- ✅ **Readable stack traces everywhere**
- ✅ Test release tracking in staging first
- ✅ Debug staging errors easily
- ✅ Minimal cost (source map uploads are free)

**The Centralization Pattern**

Notice we import the same constant in both places:

```typescript
// Runtime monitoring
import { SENTRY_ENABLED_ENVIRONMENTS } from "./constants";

// Build-time Vite plugin
import { SENTRY_ENABLED_ENVIRONMENTS } from "./src/configuration/monitoring/constants";
```

This ensures they **never get out of sync**. Want to add/remove an environment? Change it once in `constants.ts` and it applies everywhere!

**Alternative: Production Only**

If you only want monitoring in production, update **one file**:

```typescript
// src/configuration/monitoring/constants.ts
export const SENTRY_ENABLED_ENVIRONMENTS = ["production"] as const;
```

Both runtime monitoring and Vite plugin will automatically update!

### Step 4.6: Add Release to Sentry Init

Update your monitoring module to use release information:

**File**: `src/configuration/monitoring/index.tsx`

```typescript
export const Monitoring = {
	init: () => {
		const currentEnv = import.meta.env.MODE;

		if (!ENVS_TO_ENABLE.includes(currentEnv)) {
			console.log(`[Sentry] Disabled in ${currentEnv} mode`);
			return;
		}

		const config = getEnvironmentConfig(currentEnv);

		// Get release information from environment variables or build process
		// The Sentry Vite plugin automatically injects SENTRY_RELEASE during build
		const release = import.meta.env.VITE_SENTRY_RELEASE || import.meta.env.SENTRY_RELEASE;

		Sentry.init({
			dsn: import.meta.env.VITE_SENTRY_DSN,
			environment: config.environment,
			release, // Links errors to specific deployments/commits

			// Core integrations
			integrations: [
				Sentry.browserTracingIntegration(),
				Sentry.replayIntegration(),
			],

			// Performance Monitoring (environment-specific)
			tracesSampleRate: config.tracesSampleRate,

			// Session Replay (environment-specific)
			replaysSessionSampleRate: config.replaysSessionSampleRate,
			replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,
		});

		console.log(
			`[Sentry] Initialized for ${config.environment} environment`,
			`\n  - Release: ${release || "not set"}`,
			`\n  - Traces: ${config.tracesSampleRate * 100}%`,
			`\n  - Replays: ${config.replaysSessionSampleRate * 100}%`,
			`\n  - Error Replays: ${config.replaysOnErrorSampleRate * 100}%`,
		);
	},

	// ... setUser method ...
};
```

**Key Changes:**

- Added `release` field to `Sentry.init()`
- Release ID comes from Vite plugin injection
- Added release to console log output

### Step 4.7: Build and Test

1. **Build for production**:
   ```bash
   yarn build
   ```

2. **Watch the build output**, you should see:
   ```
   ✓ Sentry Vite Plugin
   ✓ Generated release: best-shot@341ce12
   ✓ Uploaded 15 source maps
   ✓ Associated 3 commits with release
   ```

3. **Check console** after deploying:
   ```
   [Sentry] Initialized for production environment
     - Release: best-shot@341ce12
     - Traces: 10%
     - Replays: 5%
     - Error Replays: 100%
   ```

### Step 4.8: View Releases in Sentry Dashboard

1. Go to Sentry → **Releases**
2. You should see your new release: `best-shot@341ce12`
3. Click on it to see:
   - **Commits**: All git commits in this release
   - **New Issues**: Errors that first appeared in this release
   - **Regressions**: Errors that were fixed but came back
   - **Health**: Error rate, session crashes, etc.

### Step 4.9: Link to Git Repository

To enable "Open in GitHub" links from Sentry:

1. Go to Sentry → **Settings** → **Integrations**
2. Find **GitHub** (or GitLab/Bitbucket)
3. Click **Install** and authorize
4. Select your repository: `mario/best-shot`
5. Now when you click commits in releases, they open in GitHub!

### Step 4.10: Search by Release

You can now filter errors by release in Sentry:

**Useful search queries:**
- `release:best-shot@341ce12` - Errors from specific release
- `release:best-shot@*` - All releases for this app
- `first_release:best-shot@341ce12` - Errors that **first appeared** in this release
- `last_seen:+7d release:best-shot@341ce12` - Recent errors in this release

### Custom Release Names

By default, releases are named: `<package-name>@<git-commit-hash>`

You can customize this in `vite.config.ts`:

```typescript
sentryVitePlugin({
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	authToken: process.env.SENTRY_AUTH_TOKEN,
	telemetry: false,
	release: {
		name: `best-shot@${process.env.npm_package_version}`, // Use package.json version
		// Or use semantic versioning:
		// name: "v2.3.1"
	},
	sourcemaps: {
		assets: "./dist/**",
	},
}),
```

**Common naming patterns:**
- `app@commit-hash` - Default, good for frequent deploys
- `app@v2.3.1` - Semantic versioning, good for scheduled releases
- `app@2024-01-15-prod` - Date-based, good for daily deploys

### CI/CD Integration

In your deployment pipeline (GitHub Actions, GitLab CI, etc.), make sure to:

1. **Set environment variable**:
   ```yaml
   env:
     SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
   ```

2. **Build command stays the same**:
   ```bash
   yarn build
   ```

3. **Sentry plugin automatically**:
   - Detects git commit from CI environment
   - Uploads source maps
   - Creates release
   - No extra commands needed!

### Troubleshooting

**"Source maps not uploaded"**
- Check `SENTRY_AUTH_TOKEN` is set
- Verify `build.sourcemap: true` in vite.config.ts
- Check Sentry token has `project:releases` scope

**"Release not showing in dashboard"**
- Make sure you're building with `mode === "production"`
- Check console for Sentry plugin output
- Verify DSN is correct

**"Commits not associated with release"**
- Make sure `.git` folder exists in build environment
- CI/CD must have git history (use `fetch-depth: 0` in GitHub Actions)
- Check GitHub integration is installed

---

## What You've Accomplished

✅ Configured Sentry Vite plugin for source map uploads
✅ Added release tracking to link errors to deployments
✅ Enabled git commit association with releases
✅ Set up release filtering in Sentry dashboard
✅ Integrated with git repository for "Open in GitHub" links
✅ Prepared for CI/CD deployment tracking

**Next Steps**: In Session 5, we'll configure API tracing to monitor the performance of your backend API calls.

---

## Session 5: Configure API Tracing

> **Goal**: Monitor backend API performance and connect frontend errors to backend traces with distributed tracing.

### Why API Tracing Matters

Without API tracing, you see errors but don't know **which API calls** caused them. With API tracing, you get:

⚡ **Track slow API calls**
- "The `/tournaments` endpoint takes 3.2 seconds on average"
- Identify bottlenecks in your backend
- See which endpoints are slowing down your app

🔗 **Distributed tracing**
- Frontend error → See the exact backend trace that caused it
- Click on API call → See backend logs, database queries, errors
- Full request journey from browser to server and back

📊 **API performance metrics**
- Response times by endpoint
- Success/failure rates
- Geographic performance differences

🐛 **Better debugging**
- "Error happened during `POST /matches` which called `/teams` which timed out"
- See full request/response headers and body (sanitized)
- Correlate frontend and backend errors

### How API Tracing Works

Sentry's `browserTracingIntegration()` automatically instruments:

- ✅ **Axios** requests (what you're using!)
- ✅ **fetch()** API calls
- ✅ **XMLHttpRequest** (XHR)

For each request, Sentry tracks:
- URL, method, status code
- Duration (time to complete)
- Request/response headers
- Success or failure

**Distributed Tracing**: When configured, Sentry adds a `sentry-trace` header to outgoing requests. If your backend also has Sentry, it reads this header and connects the frontend trace to the backend trace!

### Step 5.1: Configure Trace Propagation Targets

By default, Sentry adds tracing headers to **all** requests, which can cause issues with third-party APIs that reject unknown headers. We need to tell Sentry which domains to trace.

**File**: `src/configuration/monitoring/index.tsx`

```typescript
// Configure which URLs should have distributed tracing enabled
// This connects frontend errors to backend traces in Sentry
const apiBaseUrl = import.meta.env.VITE_BEST_SHOT_API || "";
const apiV2BaseUrl = import.meta.env.VITE_BEST_SHOT_API_V2 || "";

// Extract hostnames for trace propagation
const tracePropagationTargets = [
	"localhost", // Local development
	/^\//,      // Same-origin requests (relative URLs)
];

// Add production API domains if configured
if (apiBaseUrl) {
	try {
		const url = new URL(apiBaseUrl);
		if (!url.hostname.includes("localhost")) {
			tracePropagationTargets.push(url.hostname);
		}
	} catch {
		// Invalid URL, skip
	}
}

if (apiV2BaseUrl && apiV2BaseUrl !== apiBaseUrl) {
	try {
		const url = new URL(apiV2BaseUrl);
		if (!url.hostname.includes("localhost")) {
			tracePropagationTargets.push(url.hostname);
		}
	} catch {
		// Invalid URL, skip
	}
}

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	environment: config.environment,
	release,

	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],

	tracesSampleRate: config.tracesSampleRate,

	// Distributed Tracing - connects frontend and backend traces
	tracePropagationTargets,

	replaysSessionSampleRate: config.replaysSessionSampleRate,
	replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,
});
```

**What This Does:**

- **Automatically extracts domains** from your API environment variables
- **Adds localhost** for local development
- **Adds relative URL pattern** (`/^\//`) for same-origin requests
- **Adds production domains** dynamically (e.g., `api.bestshot.com`)
- **Skips invalid URLs** gracefully with try/catch

**Why This Matters:**

Without `tracePropagationTargets`, Sentry adds headers to **all** requests, including:
- ❌ Third-party APIs (Auth0, Stripe, etc.) that might reject unknown headers
- ❌ CDNs and analytics scripts
- ❌ External resources

With `tracePropagationTargets`, Sentry only traces:
- ✅ Your backend API calls
- ✅ Same-origin requests
- ✅ Specified domains you control

### Step 5.2: Update Console Logging

Add API tracing info to initialization log:

```typescript
console.log(
	`[Sentry] Initialized for ${config.environment} environment`,
	`\n  - Release: ${release || "not set"}`,
	`\n  - Traces: ${config.tracesSampleRate * 100}%`,
	`\n  - Replays: ${config.replaysSessionSampleRate * 100}%`,
	`\n  - Error Replays: ${config.replaysOnErrorSampleRate * 100}%`,
	`\n  - API Tracing: ${tracePropagationTargets.map(t => t.toString()).join(", ")}`,
);
```

**Example output:**
```
[Sentry] Initialized for production environment
  - Release: best-shot@341ce12
  - Traces: 10%
  - Replays: 5%
  - Error Replays: 100%
  - API Tracing: localhost, /^\//, api.bestshot.com
```

### Step 5.3: Verify Automatic Tracing

Sentry automatically traces all Axios requests made through your `api` instance:

**File**: `src/api/index.ts` (No changes needed!)

```typescript
import axios from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_BEST_SHOT_API,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// ✅ All requests through this instance are automatically traced!
// api.get("/tournaments") → Sentry tracks duration, status, etc.
```

**How It Works:**

1. You make a request: `api.get("/tournaments")`
2. Sentry intercepts it (via `browserTracingIntegration()`)
3. Sentry adds `sentry-trace` header to request
4. Sentry starts a performance span
5. Request completes
6. Sentry records duration, status, URL
7. Data sent to Sentry dashboard

**No code changes needed** - it just works!

### Step 5.4: View API Performance in Sentry

1. **Go to Sentry → Performance**
2. You'll see a list of transactions (page loads, route changes)
3. **Click on any transaction**
4. Scroll to **"Spans"** section
5. You'll see API calls listed:
   ```
   GET /api/v2/tournaments   245ms
   GET /api/v2/member        123ms
   POST /api/v1/guesses      89ms
   ```

6. **Click on an API span** to see:
   - Full URL and method
   - Request/response headers
   - Duration breakdown
   - Status code
   - Link to backend trace (if backend has Sentry)

### Step 5.5: Filter Slow API Calls

**In Sentry Performance dashboard:**

1. Click **"View All"** on transactions
2. Use filters:
   - `http.method:GET` - Only GET requests
   - `transaction:/api/v2/tournaments` - Specific endpoint
   - `transaction.duration:>1000` - Slower than 1 second

3. Sort by **"P95 Duration"** to find consistently slow endpoints

**Common queries:**
- Slow API calls: `transaction.duration:>2000`
- Failed requests: `http.status_code:5xx`
- Specific endpoint: `transaction:/api/v2/tournaments`

### Step 5.6: Backend Integration (Optional)

If your backend also uses Sentry (Node.js, Python, etc.), distributed tracing connects frontend and backend:

**Frontend** makes request:
```typescript
api.get("/tournaments")
// Adds header: sentry-trace: 1234-5678-abcd
```

**Backend** receives request (with Sentry SDK installed):
```javascript
// Backend automatically reads sentry-trace header
// Creates child span linked to frontend span
app.get("/tournaments", async (req, res) => {
	// Sentry traces this handler
	const tournaments = await db.query(...);
	res.json(tournaments);
});
```

**In Sentry dashboard:**
- Click on frontend API span
- See **"Backend Trace"** link
- Click it → Jump to backend logs, database queries, errors
- Full request journey from browser → server → database → back!

**Setting this up:**
1. Install Sentry in your backend (Node.js, Python, Go, etc.)
2. Initialize with same `dsn`
3. That's it! Sentry automatically connects traces via `sentry-trace` header

### Step 5.7: Manual Instrumentation (Advanced)

For operations that aren't HTTP requests, you can manually create spans:

```typescript
import * as Sentry from "@sentry/react";

// Trace a slow operation
function processLargeDataset(data: Tournament[]) {
	return Sentry.startSpan(
		{
			name: "Process Tournament Data",
			op: "function",
		},
		() => {
			// Your slow operation here
			const processed = data.map(tournament => {
				// Complex processing...
				return transform(tournament);
			});

			return processed;
		}
	);
}
```

**When to use manual spans:**
- Complex calculations
- Large data transformations
- Heavy rendering operations
- WebSocket message processing

**In Sentry:**
- You'll see "Process Tournament Data" as a span
- Can see how long it took
- Can identify performance bottlenecks in your code

### Understanding the Performance Data

**P50 (Median)**: 50% of requests faster than this
- Good for understanding typical performance
- Example: P50 = 200ms means half of requests finish in under 200ms

**P95**: 95% of requests faster than this
- Good for understanding worst-case performance
- Example: P95 = 1000ms means 95% finish in under 1s, but 5% take longer

**P99**: 99% of requests faster than this
- Extreme outliers
- Important for user experience (nobody likes the occasional 10s load)

**Throughput**: Requests per minute
- How many times this endpoint is called
- High throughput + slow duration = major bottleneck!

### Troubleshooting

**"I don't see any API calls in Sentry"**
- Check `tracesSampleRate` isn't 0
- Verify requests match `tracePropagationTargets`
- Check console for Sentry initialization errors
- Make sure you're making requests through Axios/fetch

**"Third-party API rejecting my requests"**
- This means `tracePropagationTargets` is too broad
- Don't use `["*"]` - it adds headers to ALL requests
- Only include your own API domains

**"Can't connect frontend to backend traces"**
- Make sure backend has Sentry SDK installed
- Both frontend and backend must use same Sentry organization
- Check backend is reading `sentry-trace` header

---

## What You've Accomplished

✅ Configured distributed tracing for your API calls
✅ Set up `tracePropagationTargets` dynamically from env vars
✅ Enabled automatic Axios request monitoring
✅ Learned how to view API performance in Sentry
✅ Understand how to connect frontend and backend traces
✅ Know how to create manual spans for custom operations

**Next Steps**: In Session 6, we'll add data sanitization to automatically strip sensitive information from error reports.

---

## Session 6: Data Sanitization

> **Goal**: Automatically strip sensitive data (passwords, tokens, credit cards) from error reports to protect user privacy and comply with security policies.

### Why Data Sanitization Matters

Without sanitization, Sentry might accidentally capture:

🔐 **Security risks**
- Passwords sent in POST requests
- API keys and auth tokens
- Session cookies
- Credit card numbers

⚖️ **Compliance issues**
- GDPR violations (EU)
- CCPA violations (California)
- PCI DSS violations (credit cards)
- HIPAA violations (healthcare data)

😱 **Real-world nightmare scenarios**
- User passwords visible in error logs
- Auth tokens leaked to support team
- Credit card data captured in form submissions
- Social security numbers in breadcrumbs

**The Solution**: Use Sentry's `beforeSend` hook to sanitize data before it leaves your app.

### How Data Sanitization Works

Sentry's `beforeSend` hook runs **before** sending each error event:

```typescript
beforeSend: (event) => {
  // Inspect and modify event here
  // Return null to drop the event entirely
  // Return modified event to send it
  return event;
}
```

For each error, you can:
- ✅ **Strip sensitive fields** (password, token, etc.)
- ✅ **Modify request/response data**
- ✅ **Filter breadcrumbs** (user actions)
- ✅ **Drop entire events** (return null)
- ✅ **Add custom logic** (environment-specific filtering)

### Step 6.1: Define Sensitive Field Patterns

Create patterns to identify sensitive fields by name:

**File**: `src/configuration/monitoring/index.tsx`

```typescript
/**
 * Sensitive field patterns to scrub from error reports
 * Prevents accidentally sending passwords, tokens, credit cards, etc. to Sentry
 */
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

**How It Works:**

- Uses regex patterns (case-insensitive with `/i` flag)
- Matches field names like `password`, `apiKey`, `access_token`, etc.
- Covers common naming conventions (`api-key`, `api_key`, `apiKey`)

**Common patterns to add:**

For your app specifically, add:
- Field names from your forms (e.g., `/otp/i` for one-time passwords)
- Custom auth fields (e.g., `/jwt/i`)
- Sensitive user data (e.g., `/phone/i`, `/email/i` if needed)

### Step 6.2: Create Sanitization Function

Recursively sanitize objects by replacing sensitive values:

```typescript
/**
 * Recursively sanitize an object by removing sensitive fields
 */
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
		const isSensitive = SENSITIVE_FIELD_PATTERNS.some((pattern) => pattern.test(key));

		if (isSensitive) {
			sanitized[key] = "[Filtered]";
		} else if (typeof value === "object" && value !== null) {
			sanitized[key] = sanitizeObject(value, depth + 1);
		} else {
			sanitized[key] = value;
		}
	}

	return sanitized;
}
```

**What This Does:**

- **Recursive**: Handles nested objects and arrays
- **Depth limit**: Prevents infinite loops (max depth = 10)
- **Pattern matching**: Checks each key against sensitive patterns
- **Preserves structure**: Keeps non-sensitive data intact
- **Safe replacement**: Replaces sensitive values with `"[Filtered]"`

### Step 6.3: Implement beforeSend Hook

Sanitize all parts of the error event:

```typescript
import type { ErrorEvent, EventHint } from "@sentry/react";

/**
 * beforeSend hook to sanitize sensitive data before sending to Sentry
 */
function beforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
	// Sanitize request data
	if (event.request) {
		// Sanitize query parameters
		if (event.request.query_string) {
			event.request.query_string = sanitizeObject(event.request.query_string);
		}

		// Sanitize POST data
		if (event.request.data) {
			event.request.data = sanitizeObject(event.request.data);
		}

		// Sanitize cookies
		if (event.request.cookies) {
			event.request.cookies = sanitizeObject(event.request.cookies);
		}

		// Sanitize headers
		if (event.request.headers) {
			event.request.headers = sanitizeObject(event.request.headers);
		}
	}

	// Sanitize breadcrumbs (user actions, console logs, etc.)
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

**What Gets Sanitized:**

1. **Request data**: URL params, POST body, headers, cookies
2. **Breadcrumbs**: User actions (clicks, form inputs, navigations)
3. **Extra context**: Custom data you add with `Sentry.setContext()`
4. **Contexts**: Device info, OS, browser

### Step 6.4: Add beforeSend to Sentry Init

```typescript
Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	environment: config.environment,
	release,

	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],

	tracesSampleRate: config.tracesSampleRate,
	tracePropagationTargets,
	replaysSessionSampleRate: config.replaysSessionSampleRate,
	replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,

	// Data Sanitization - strip sensitive data before sending to Sentry
	beforeSend,
});
```

### Step 6.5: Test Sanitization

Create a test to verify sensitive data is filtered:

```typescript
// Temporary test - remove after verifying
function testSanitization() {
	try {
		// Throw error with sensitive data
		const sensitiveData = {
			username: "john@example.com",
			password: "super-secret-123", // Should be filtered
			apiKey: "sk_live_abc123",     // Should be filtered
			publicData: "This is fine",    // Should NOT be filtered
		};

		Sentry.captureException(new Error("Test sanitization"), {
			extra: sensitiveData,
		});

		console.log("Sanitization test triggered - check Sentry dashboard");
	} catch (e) {
		console.error("Sanitization test failed", e);
	}
}

// Call once to test
testSanitization();
```

**In Sentry dashboard:**

You should see:
```json
{
  "username": "john@example.com",
  "password": "[Filtered]",
  "apiKey": "[Filtered]",
  "publicData": "This is fine"
}
```

✅ **Success!** - Sensitive fields are replaced with `[Filtered]`

### Step 6.6: Advanced Filtering

**Drop events entirely:**

```typescript
function beforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
	// Don't send errors from browser extensions
	if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
		frame => frame.filename?.includes('chrome-extension://')
	)) {
		return null; // Drop event
	}

	// Sanitize and send
	// ... sanitization code ...

	return event;
}
```

**Environment-specific filtering:**

```typescript
function beforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
	// In staging, send everything (no filtering)
	if (import.meta.env.MODE === "staging") {
		return event;
	}

	// In production, strict sanitization
	// ... sanitization code ...

	return event;
}
```

**Custom sanitization rules:**

```typescript
// Add to SENSITIVE_FIELD_PATTERNS
const SENSITIVE_FIELD_PATTERNS = [
	// ... existing patterns ...

	// App-specific patterns
	/otp/i,              // One-time passwords
	/verification[-_]?code/i,
	/reset[-_]?token/i,
	/phone/i,            // If phone numbers are sensitive in your app
	/address/i,          // If addresses are sensitive
];
```

### Understanding What's Captured

**Breadcrumbs** = User activity trail:
- Button clicks: `{category: "ui.click", message: "Submit button"}`
- Form inputs: `{category: "ui.input", message: "Email field"}`
- Navigation: `{category: "navigation", message: "/tournaments"}`
- Console logs: `{category: "console", message: "User logged in"}`
- API calls: `{category: "fetch", message: "GET /api/tournaments"}`

**Request data** = HTTP request details:
- URL: `https://app.bestshot.com/tournaments`
- Query params: `?filter=active&sort=date`
- Headers: `Authorization: Bearer xxx, Content-Type: application/json`
- Cookies: `session_id=abc123, auth_token=xyz789`
- Body: `{email: "user@example.com", password: "secret"}`

All of these are sanitized automatically with our `beforeSend` hook!

### Best Practices

**✅ DO:**
- Sanitize aggressively - it's better to filter too much than too little
- Add app-specific patterns to `SENSITIVE_FIELD_PATTERNS`
- Test sanitization in staging before deploying
- Review Sentry events periodically for leaked data

**❌ DON'T:**
- Send passwords, tokens, or credit cards (even if "encrypted")
- Assume Sentry's default scrubbing is enough
- Log sensitive data in console.log() (breadcrumbs capture this!)
- Use sensitive data in error messages

**Warning Signs:**

If you see these in Sentry, you have a leak:
- `password: "actual-password"` instead of `password: "[Filtered]"`
- Auth tokens in request headers
- Credit card numbers in POST data
- SSN in form fields

### Compliance Checklist

**GDPR (EU)**
- ✅ Sanitize PII (personally identifiable information)
- ✅ Add data processing agreement with Sentry
- ✅ Enable IP address anonymization in Sentry settings

**CCPA (California)**
- ✅ Same as GDPR requirements
- ✅ Provide opt-out mechanism if needed

**PCI DSS (Credit Cards)**
- ✅ Never send credit card numbers, CVV, or full PAN
- ✅ Filter payment-related fields
- ✅ Use tokenization for payment data

**HIPAA (Healthcare)**
- ✅ Don't use Sentry for HIPAA-covered data
- ✅ Use Business Associate Agreement (BAA) if available

---

## What You've Accomplished

✅ Created comprehensive sensitive field patterns
✅ Implemented recursive sanitization for nested objects
✅ Added beforeSend hook to filter data before sending
✅ Sanitized requests, breadcrumbs, and extra context
✅ Learned how to test and verify sanitization
✅ Understand compliance requirements (GDPR, CCPA, PCI, HIPAA)
✅ Know how to customize filtering for your app

**Next Steps**: In Session 7, we'll add custom tags to enrich error context and improve filtering capabilities.

---

## Session 7: Custom Tags and Context

> **Goal**: Add custom tags and context to error reports for better filtering, grouping, and debugging. Tags help you answer questions like "Show me all errors from admins in the tournament feature."

### Why Custom Tags Matter

Without tags, all your errors look the same in Sentry. With tags, you can:

🔍 **Filter errors intelligently**
- "Show me all errors from `user.role:admin`"
- "Show me all errors in `feature:tournament-creation`"
- "Show me all errors in `tournament.status:in-progress`"

📊 **Group and analyze**
- Which features have the most errors?
- Which user roles experience the most bugs?
- Which tournaments are causing problems?

🎯 **Debug faster**
- See exactly what the user was doing
- Know which feature they were using
- Understand the context immediately

**Tags vs Context:**
- **Tags**: Indexed strings for filtering (e.g., `feature: "tournament"`)
- **Context**: Rich objects for detailed info (e.g., `tournament: { id, name, status }`)

### Step 7.1: Add Tag Methods to Monitoring

We'll add three methods to our `Monitoring` object:

**File**: `src/configuration/monitoring/index.tsx`

```typescript
export const Monitoring = {
	init: () => { /* ... existing code ... */ },
	setUser: (user: UserIdentity | null) => { /* ... existing code ... */ },

	/**
	 * Set a custom tag for filtering and grouping errors
	 * Tags are key-value pairs that help you organize and search errors in Sentry
	 *
	 * @param key - Tag name (e.g., "feature", "user.role")
	 * @param value - Tag value (e.g., "tournament", "admin")
	 *
	 * @example
	 * Monitoring.setTag("feature", "tournament-creation");
	 * Monitoring.setTag("user.role", "admin");
	 */
	setTag: (key: string, value: string) => {
		const currentEnv = import.meta.env.MODE;

		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			return;
		}

		Sentry.setTag(key, value);
	},

	/**
	 * Set multiple custom tags at once
	 *
	 * @param tags - Object with key-value pairs for tags
	 *
	 * @example
	 * Monitoring.setTags({
	 *   feature: "match-scoring",
	 *   "user.role": "player",
	 *   "tournament.id": "123"
	 * });
	 */
	setTags: (tags: Record<string, string>) => {
		const currentEnv = import.meta.env.MODE;

		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			return;
		}

		Sentry.setTags(tags);
	},

	/**
	 * Set additional context for errors
	 * Unlike tags (which are indexed strings), contexts can contain complex objects
	 *
	 * @param name - Context name (e.g., "tournament", "match")
	 * @param context - Object with relevant data
	 *
	 * @example
	 * Monitoring.setContext("tournament", {
	 *   id: "123",
	 *   name: "Summer Championship",
	 *   status: "in-progress"
	 * });
	 */
	setContext: (name: string, context: Record<string, unknown> | null) => {
		const currentEnv = import.meta.env.MODE;

		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			return;
		}

		Sentry.setContext(name, context);
	},
};
```

**What This Adds:**

1. **`setTag(key, value)`**: Set a single tag
2. **`setTags(object)`**: Set multiple tags at once
3. **`setContext(name, object)`**: Set rich context data

All three methods:
- Check if Sentry is enabled in the current environment
- Only call Sentry if monitoring is active
- Follow the same pattern as `setUser()`

### Step 7.2: Add User Role Tag to User Identifier

Update the user identifier to automatically tag user role:

**File**: `src/configuration/monitoring/components/SentryUserIdentifier.tsx`

```typescript
useEffect(() => {
	if (isAuthenticated && member.isSuccess && member.data) {
		// User is logged in and member data is loaded
		Monitoring.setUser({
			id: member.data.id,
			email: member.data.email,
			username: member.data.nickName,
			role: member.data.role,
		});

		// Set user role as a custom tag for filtering in Sentry dashboard
		// This allows you to query: "Show me all errors from admin users"
		Monitoring.setTag("user.role", member.data.role);
	} else if (!isAuthenticated) {
		// User logged out - clear Sentry user data
		Monitoring.setUser(null);
	}
}, [isAuthenticated, member.isSuccess, member.data]);
```

**What This Does:**
- Automatically tags every error with the user's role
- Enables filtering: "Show me all errors from admin users"
- No manual tagging needed - it's automatic!

### Step 7.3: Add Convenience Methods to Monitoring

Add helper methods directly to the `Monitoring` object for easier feature tagging:

**File**: `src/configuration/monitoring/index.tsx`

```typescript
export const Monitoring = {
	init: () => { /* ... */ },
	setUser: (user: UserIdentity | null) => { /* ... */ },
	setTag: (key: string, value: string) => { /* ... */ },
	setTags: (tags: Record<string, string>) => { /* ... */ },
	setContext: (name: string, context: Record<string, unknown> | null) => { /* ... */ },

	/**
	 * Set Sentry feature tag and optional context
	 * Convenience method for setting feature context
	 *
	 * @param featureName - Name of the feature (e.g., "tournament-creation", "match-scoring")
	 * @param context - Optional additional context data
	 *
	 * @example
	 * Monitoring.setSentryContext("tournament-detail", {
	 *   tournamentId: tournament.id,
	 *   tournamentName: tournament.name,
	 *   status: tournament.status
	 * });
	 */
	setSentryContext: (
		featureName: string,
		context?: Record<string, string | number | boolean>,
	) => {
		const currentEnv = import.meta.env.MODE;

		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			return;
		}

		// Set feature tag for filtering errors by feature
		Sentry.setTag("feature", featureName);

		// Set detailed context if provided
		if (context) {
			Sentry.setContext(featureName, context);
		}
	},

	/**
	 * Clear feature-specific context
	 *
	 * @param featureName - Name of the feature context to clear
	 *
	 * @example
	 * Monitoring.clearSentryContext("tournament-detail");
	 */
	clearSentryContext: (featureName: string) => {
		const currentEnv = import.meta.env.MODE;

		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			return;
		}

		Sentry.setContext(featureName, null);
	},
};
```

**What These Methods Do:**

1. **`Monitoring.setSentryContext()`**: Sets feature tag and optional context
2. **`Monitoring.clearSentryContext()`**: Clears feature-specific context
3. **Single import**: Everything in one place - `import { Monitoring } from "@/configuration/monitoring"`

### Step 7.4: Use Custom Tags in Your App

Here are practical examples for your Best Shot app:

**Example 1: Tournament Detail Page**

```typescript
import { Monitoring } from "@/configuration/monitoring";

function TournamentDetailPage() {
	const { tournamentId } = useParams();
	const tournament = useTournament(tournamentId);

	// Set context when tournament data loads
	useEffect(() => {
		if (tournament.data) {
			Monitoring.setSentryContext("tournament-detail", {
				tournamentId: tournament.data.id,
				tournamentName: tournament.data.name,
				status: tournament.data.status,
				participantCount: tournament.data.participants?.length,
			});
		}
	}, [tournament.data]);

	return <div>{/* ... */}</div>;
}
```

**In Sentry, you'll see:**
- Tag: `feature: "tournament-detail"`
- Context:
  ```json
  {
    "tournament-detail": {
      "tournamentId": "123",
      "tournamentName": "Summer Championship",
      "status": "in-progress",
      "participantCount": 24
    }
  }
  ```

**Example 2: Match Scoring**

```typescript
import { Monitoring } from "@/configuration/monitoring";

function MatchScoringCard({ match }) {
	const handleSubmitScore = async (score) => {
		// Set context right before the operation
		Monitoring.setSentryContext("match-scoring", {
			matchId: match.id,
			roundNumber: match.round,
			team1: match.team1.name,
			team2: match.team2.name,
		});

		try {
			// Any error here will be tagged with match context
			await submitMatchScore(match.id, score);
		} catch (error) {
			// Sentry already has all the context!
			throw error;
		}
	};

	return <div>{/* ... */}</div>;
}
```

**Example 3: League Creation**

```typescript
import { Monitoring } from "@/configuration/monitoring";

function CreateLeagueForm() {
	const handleSubmit = async (data) => {
		// Set feature context
		Monitoring.setSentryContext("league-creation");

		// Add additional tags for this specific operation
		Monitoring.setTags({
			"form.step": "submission",
			"league.type": data.type,
		});

		try {
			await createLeague(data);
		} catch (error) {
			// Error will have all tags + context
			throw error;
		}
	};

	return <form>{/* ... */}</form>;
}
```

**Example 4: Manual Tagging for Critical Operations**

```typescript
import { Monitoring } from "@/configuration/monitoring";

async function deleteAllMatches(tournamentId: string) {
	// Tag critical operations
	Monitoring.setTags({
		operation: "bulk-delete",
		"operation.critical": "true",
		"tournament.id": tournamentId,
	});

	try {
		await api.deleteMatches(tournamentId);
	} catch (error) {
		// Sentry will show this is a critical operation that failed
		throw error;
	}
}
```

### Step 7.5: Useful Tag Conventions

Here are recommended tags for your Best Shot app:

**User Tags (automatic)**
```typescript
"user.role": "admin" | "player" | "organizer"
```

**Feature Tags**
```typescript
"feature":
  | "tournament-creation"
  | "tournament-detail"
  | "tournament-edit"
  | "match-scoring"
  | "match-detail"
  | "league-creation"
  | "league-management"
  | "dashboard"
  | "member-profile"
  | "guess-submission"
```

**Operation Tags**
```typescript
"operation": "create" | "read" | "update" | "delete"
"operation.critical": "true" | "false"
```

**State Tags**
```typescript
"tournament.status": "draft" | "in-progress" | "completed"
"match.status": "pending" | "in-progress" | "completed"
```

**Performance Tags**
```typescript
"performance.slow": "true"  // For operations > 2 seconds
"cache.hit": "true" | "false"
```

### Step 7.6: Query Errors in Sentry Dashboard

Once you have tags, you can filter errors in Sentry:

**Filter by user role:**
```
user.role:admin
```

**Filter by feature:**
```
feature:tournament-creation
```

**Combine filters:**
```
feature:match-scoring AND user.role:player
```

**Find critical operations:**
```
operation.critical:true
```

**Tournament-specific errors:**
```
tournament.status:in-progress AND feature:tournament-detail
```

**Performance issues:**
```
performance.slow:true
```

### Step 7.7: Best Practices

**✅ DO:**
- Use consistent tag naming (e.g., `feature`, `user.role`, `tournament.status`)
- Tag critical operations (`operation.critical: "true"`)
- Use `Monitoring.setSentryContext()` for feature tagging
- Keep tag values simple strings (avoid objects)
- Add context for complex data (use `Monitoring.setContext()` for objects)

**❌ DON'T:**
- Over-tag (too many tags = too much noise)
- Use tags for unique values (user IDs, timestamps)
- Put sensitive data in tags (they're indexed and searchable)
- Create tags dynamically with random names

**Tag Limits:**
- Sentry indexes the first **200 unique tag values**
- After 200, additional values aren't indexed
- Use context for high-cardinality data (user IDs, etc.)

### Understanding Tags vs Context

**Tags** (indexed, filterable):
```typescript
Monitoring.setTag("feature", "tournament-detail");
Monitoring.setTag("user.role", "admin");
// Can filter: feature:tournament-detail
```

**Context** (rich data, not filterable):
```typescript
Monitoring.setContext("tournament", {
	id: "123",
	name: "Summer Championship",
	participants: 24,
	startDate: "2025-01-15",
	settings: { /* complex object */ }
});
// Shows in error details, but can't filter by it
```

**Rule of thumb:**
- **Tags**: For filtering and grouping (feature, role, status)
- **Context**: For debugging details (IDs, names, complex objects)

### Step 7.8: Example Error Report

With tags and context, your Sentry error reports look like:

```
Error: Failed to submit match score

Tags:
  feature: match-scoring
  user.role: player
  match.status: in-progress
  operation: update

Context:
  match-scoring: {
    matchId: "456",
    roundNumber: 2,
    team1: "Red Dragons",
    team2: "Blue Sharks"
  }

User:
  id: 789
  email: player@example.com
  username: john_doe
  role: player

Breadcrumbs:
  [Navigation] /tournaments/123/matches/456
  [UI Click] "Submit Score" button
  [Fetch] POST /api/matches/456/score
  [Error] Network request failed
```

**Now you can answer:**
- Who: player@example.com (role: player)
- What: Failed to submit match score
- Where: match-scoring feature
- When: Round 2, in-progress match
- Context: Red Dragons vs Blue Sharks

### Troubleshooting

**Tags not showing in Sentry?**
- Check `SENTRY_ENABLED_ENVIRONMENTS` includes your current mode
- Verify `Monitoring.init()` is called before setting tags
- Check browser console for Sentry errors

**Too many tag values?**
- Sentry indexes first 200 unique values per tag
- Use context for high-cardinality data (user IDs, etc.)
- Review tag usage: `yarn grep -r "setTag" src/`

**Context not appearing?**
- Context shows in error details, not in filters
- Verify you're calling `setContext` before the error
- Check context isn't being cleared too early

---

## What You've Accomplished

✅ Added `setTag`, `setTags`, and `setContext` methods to Monitoring
✅ Automatically tag user roles in SentryUserIdentifier
✅ Added `Monitoring.setSentryContext()` and `Monitoring.clearSentryContext()` convenience methods
✅ Learned when to use tags vs context
✅ Established tag conventions for your app
✅ Understand how to filter errors in Sentry dashboard

**Next Steps**: In Session 8, we'll add custom performance monitoring to track slow operations and optimize your app.

---

## Session 8: Custom Performance Monitoring

> **Goal**: Add custom performance tracking to measure slow operations, identify bottlenecks, and optimize your app. Track API calls, complex calculations, and critical operations.

### Why Performance Monitoring Matters

Sentry automatically tracks page loads and navigation, but **custom operations** need manual tracking:

⏱️ **Performance problems you can catch:**
- Slow API calls (> 2 seconds)
- Complex calculations (standings, scores)
- Bulk operations (deleting all matches)
- Database queries
- File uploads

📊 **What you get:**
- Precise timing for each operation
- Identify bottlenecks in your code
- Compare performance across environments
- Track improvements over time
- Alert on performance regressions

🎯 **Business impact:**
- Faster tournament loading = happier users
- Identify slow operations before users complain
- Optimize the right things (data-driven)

### Step 8.1: Add Performance Methods to Monitoring

We'll add three methods to track performance:

**File**: `src/configuration/monitoring/index.tsx`

```typescript
export const Monitoring = {
	init: () => { /* ... */ },
	setUser: (user: UserIdentity | null) => { /* ... */ },
	setTag: (key: string, value: string) => { /* ... */ },
	setTags: (tags: Record<string, string>) => { /* ... */ },
	setContext: (name: string, context: Record<string, unknown> | null) => { /* ... */ },
	setSentryContext: (featureName: string, context?: Record<string, string | number | boolean>) => { /* ... */ },
	clearSentryContext: (featureName: string) => { /* ... */ },

	/**
	 * Start a custom performance span
	 * Use this to measure specific operations or code blocks
	 *
	 * @param name - Name of the operation (e.g., "calculate-standings", "load-tournament")
	 * @param attributes - Optional attributes to add to the span
	 * @returns Span object with finish() method, or null if Sentry is disabled
	 *
	 * @example
	 * const span = Monitoring.startSpan("calculate-standings", {
	 *   tournamentId: "123",
	 *   participantCount: 24
	 * });
	 * // ... perform operation ...
	 * span?.finish();
	 */
	startSpan: (name: string, attributes?: Record<string, string | number | boolean>) => {
		const currentEnv = import.meta.env.MODE;

		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			return null;
		}

		const span = Sentry.startInactiveSpan({
			name,
			op: "custom",
			attributes,
		});

		return span;
	},

	/**
	 * Track an async operation with automatic performance measurement
	 * Automatically creates a span, executes the operation, and finishes the span
	 * Tags slow operations (> 2 seconds) automatically
	 *
	 * @param name - Name of the operation
	 * @param operation - Async function to execute and measure
	 * @param options - Optional configuration
	 * @returns Result of the operation
	 *
	 * @example
	 * const tournament = await Monitoring.trackOperation(
	 *   "load-tournament",
	 *   async () => await fetchTournament(id),
	 *   { slowThreshold: 2000 }
	 * );
	 */
	trackOperation: async <T>(
		name: string,
		operation: () => Promise<T>,
		options?: {
			slowThreshold?: number;
			attributes?: Record<string, string | number | boolean>;
		},
	): Promise<T> => {
		const currentEnv = import.meta.env.MODE;

		// If Sentry is disabled, just execute the operation
		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			return await operation();
		}

		const slowThreshold = options?.slowThreshold ?? 2000; // Default: 2 seconds
		const startTime = performance.now();

		return await Sentry.startSpan(
			{
				name,
				op: "custom",
				attributes: options?.attributes,
			},
			async () => {
				try {
					const result = await operation();
					const duration = performance.now() - startTime;

					// Tag slow operations
					if (duration > slowThreshold) {
						Sentry.setTag("performance.slow", "true");
						console.warn(
							`[Sentry] Slow operation detected: ${name} took ${Math.round(duration)}ms`,
						);
					}

					return result;
				} catch (error) {
					// Error will be captured by Sentry automatically
					throw error;
				}
			},
		);
	},

	/**
	 * Manually capture an exception with optional context
	 * Use this when you want to report an error without throwing it
	 *
	 * @param error - Error to capture
	 * @param context - Optional additional context
	 *
	 * @example
	 * try {
	 *   await riskyOperation();
	 * } catch (error) {
	 *   Monitoring.captureException(error, {
	 *     extra: { tournamentId: "123", operation: "delete" },
	 *     tags: { "operation.critical": "true" }
	 *   });
	 *   // Handle error gracefully without crashing
	 * }
	 */
	captureException: (
		error: Error,
		context?: {
			tags?: Record<string, string>;
			extra?: Record<string, unknown>;
			level?: "fatal" | "error" | "warning" | "log" | "info" | "debug";
		},
	) => {
		const currentEnv = import.meta.env.MODE;

		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			return;
		}

		Sentry.captureException(error, {
			tags: context?.tags,
			extra: context?.extra,
			level: context?.level || "error",
		});
	},
};
```

**What These Methods Do:**

1. **`Monitoring.startSpan()`**: Start/stop manual performance tracking
2. **`Monitoring.trackOperation()`**: Auto-track async operations (easiest!)
3. **`Monitoring.captureException()`**: Report errors without throwing

### Step 8.2: Track API Calls

Wrap slow API calls with `trackOperation()`:

**Example 1: Load Tournament**

```typescript
import { Monitoring } from "@/configuration/monitoring";

export async function useTournament(tournamentId: string) {
	const { data, isLoading } = useQuery({
		queryKey: ["tournament", tournamentId],
		queryFn: async () => {
			// Track this API call
			return await Monitoring.trackOperation(
				"api.load-tournament",
				async () => {
					const response = await fetch(`/api/tournaments/${tournamentId}`);
					return response.json();
				},
				{
					slowThreshold: 2000, // Warn if > 2 seconds
					attributes: { tournamentId },
				},
			);
		},
	});

	return { data, isLoading };
}
```

**What This Does:**
- Measures API call duration
- Tags slow operations (> 2 seconds) with `performance.slow: true`
- Logs warning in console for slow calls
- Shows in Sentry Performance dashboard

**Example 2: Bulk Delete Matches**

```typescript
import { Monitoring } from "@/configuration/monitoring";

async function deleteAllMatches(tournamentId: string) {
	return await Monitoring.trackOperation(
		"bulk.delete-matches",
		async () => {
			const response = await fetch(`/api/tournaments/${tournamentId}/matches`, {
				method: "DELETE",
			});
			return response.json();
		},
		{
			slowThreshold: 5000, // Bulk operations can take longer
			attributes: {
				tournamentId,
				operation: "bulk-delete",
			},
		},
	);
}
```

### Step 8.3: Track Complex Calculations

Use `startSpan()` for synchronous operations:

**Example: Calculate Tournament Standings**

```typescript
import { Monitoring } from "@/configuration/monitoring";

function calculateStandings(tournament: Tournament) {
	const span = Monitoring.startSpan("calculate-standings", {
		tournamentId: tournament.id,
		participantCount: tournament.participants.length,
		matchCount: tournament.matches.length,
	});

	try {
		// Complex calculation
		const standings = tournament.matches.reduce((acc, match) => {
			// ... complex logic ...
			return acc;
		}, []);

		// Sort by score
		standings.sort((a, b) => b.score - a.score);

		return standings;
	} finally {
		// Always finish the span
		span?.finish();
	}
}
```

**Best Practice: Always use try/finally**
- Ensures span is finished even if error occurs
- Without `finish()`, span stays open forever

### Step 8.4: Track Critical Operations

Add extra context for critical operations:

**Example: Submit Match Score**

```typescript
import { Monitoring } from "@/configuration/monitoring";

async function submitMatchScore(matchId: string, score: Score) {
	// Set context before operation
	Monitoring.setSentryContext("match-scoring", {
		matchId,
		team1Score: score.team1,
		team2Score: score.team2,
	});

	try {
		return await Monitoring.trackOperation(
			"api.submit-match-score",
			async () => {
				const response = await fetch(`/api/matches/${matchId}/score`, {
					method: "POST",
					body: JSON.stringify(score),
				});
				return response.json();
			},
			{
				slowThreshold: 3000,
				attributes: { matchId },
			},
		);
	} catch (error) {
		// Capture error with critical tag
		Monitoring.captureException(error as Error, {
			tags: {
				"operation.critical": "true",
				feature: "match-scoring",
			},
			extra: {
				matchId,
				score,
			},
			level: "error",
		});
		throw error;
	}
}
```

**What This Does:**
- Tracks performance of score submission
- Tags critical operations
- Captures errors with full context
- Still throws error for normal error handling

### Step 8.5: Performance Budgets

Define thresholds for different operations:

```typescript
// Performance budgets (in milliseconds)
const PERFORMANCE_BUDGETS = {
	"api.load-tournament": 2000,      // 2 seconds
	"api.load-matches": 1500,         // 1.5 seconds
	"api.submit-score": 3000,         // 3 seconds
	"calculate-standings": 1000,      // 1 second
	"bulk.delete-matches": 5000,      // 5 seconds
	"file.upload": 10000,             // 10 seconds
} as const;

// Use in trackOperation
await Monitoring.trackOperation(
	"api.load-tournament",
	fetchTournament,
	{ slowThreshold: PERFORMANCE_BUDGETS["api.load-tournament"] }
);
```

**Benefits:**
- Consistent thresholds across app
- Easy to adjust per operation type
- Documents expected performance

### Step 8.6: View Performance in Sentry

Once you have performance tracking:

**Sentry Performance Dashboard:**
1. Go to **Performance** tab
2. See list of all tracked operations
3. Sort by **p95** (95th percentile) to find slowest operations
4. Click operation to see detailed breakdown

**Filter slow operations:**
```
performance.slow:true
```

**Example Performance View:**
```
Operation                    p50    p95    Max     Count
---------------------------------------------------------
api.load-tournament         450ms  1.2s   3.5s    1,234
api.submit-match-score      280ms  800ms  2.1s    5,678
calculate-standings         120ms  450ms  1.8s    892
bulk.delete-matches         2.1s   4.5s   8.2s    45
```

**Insights:**
- `api.load-tournament`: p95 = 1.2s (good!)
- `bulk.delete-matches`: Max = 8.2s (needs optimization!)

### Step 8.7: Real-World Examples

**Example 1: Optimize Tournament Loading**

```typescript
// BEFORE: No tracking
async function loadTournamentData(id: string) {
	const tournament = await fetchTournament(id);
	const matches = await fetchMatches(id);
	const participants = await fetchParticipants(id);
	return { tournament, matches, participants };
}

// AFTER: With tracking
async function loadTournamentData(id: string) {
	return await Monitoring.trackOperation(
		"page.load-tournament-data",
		async () => {
			// Track each API call separately
			const [tournament, matches, participants] = await Promise.all([
				Monitoring.trackOperation("api.fetch-tournament", () => fetchTournament(id)),
				Monitoring.trackOperation("api.fetch-matches", () => fetchMatches(id)),
				Monitoring.trackOperation("api.fetch-participants", () => fetchParticipants(id)),
			]);
			return { tournament, matches, participants };
		},
		{ slowThreshold: 3000 },
	);
}

// Result in Sentry:
// ├─ page.load-tournament-data (2.8s)
// │  ├─ api.fetch-tournament (450ms)
// │  ├─ api.fetch-matches (2.1s) ← BOTTLENECK!
// │  └─ api.fetch-participants (320ms)
```

**Insight:** Fetching matches is the bottleneck (2.1s). Optimize this API endpoint!

**Example 2: Track Form Submission Steps**

```typescript
async function createTournament(data: TournamentData) {
	const mainSpan = Monitoring.startSpan("form.create-tournament", {
		participantCount: data.participants.length,
	});

	try {
		// Step 1: Validate
		const validateSpan = Monitoring.startSpan("form.validate-data");
		const validated = validateTournamentData(data);
		validateSpan?.finish();

		// Step 2: Create tournament
		const tournament = await Monitoring.trackOperation(
			"api.create-tournament",
			() => api.createTournament(validated),
		);

		// Step 3: Create matches
		const matches = await Monitoring.trackOperation(
			"api.create-matches",
			() => api.createMatches(tournament.id, data.participants),
			{ slowThreshold: 5000 },
		);

		return { tournament, matches };
	} finally {
		mainSpan?.finish();
	}
}

// Result in Sentry:
// ├─ form.create-tournament (6.2s)
// │  ├─ form.validate-data (45ms)
// │  ├─ api.create-tournament (890ms)
// │  └─ api.create-matches (5.1s) ← SLOW!
```

### Step 8.8: Best Practices

**✅ DO:**
- Track operations > 500ms
- Use descriptive names: `api.load-tournament` not `loadData`
- Set appropriate slow thresholds per operation type
- Track critical user-facing operations
- Use `try/finally` with `startSpan()`
- Add attributes for context (IDs, counts, etc.)

**❌ DON'T:**
- Track every function (too much noise)
- Track operations < 100ms (not meaningful)
- Forget to call `span.finish()`
- Set same threshold for all operations
- Track in tight loops (performance overhead)

**Performance Overhead:**
- Sentry sampling: 10% in production (from Session 2)
- Each tracked operation: ~1-2ms overhead
- Negligible for operations > 500ms

### Step 8.9: Troubleshooting

**Spans not appearing in Sentry?**
- Check `tracesSampleRate` in config (Session 2)
- Verify Sentry is enabled in current environment
- Check browser console for Sentry errors
- Ensure you're calling `span.finish()`

**Performance.slow tag not set?**
- Check operation duration in console
- Verify slowThreshold is set correctly
- Remember: Tag is set AFTER operation completes

**Too many performance events?**
- Reduce `tracesSampleRate` in production
- Only track operations > 500ms
- Use specific operation names (not generic)

---

## What You've Accomplished

✅ Added `Monitoring.startSpan()` for manual performance tracking
✅ Added `Monitoring.trackOperation()` for automatic async tracking
✅ Added `Monitoring.captureException()` for manual error reporting
✅ Learned how to track API calls and complex calculations
✅ Set up performance budgets for different operations
✅ Understand how to view performance data in Sentry dashboard
✅ Know best practices for performance monitoring

---

## Tutorial Complete! 🎉

**You've successfully implemented a complete Sentry monitoring setup:**

### Sessions Completed:
1. ✅ **Error Boundaries** - Catch and display errors gracefully
2. ✅ **Environment Configuration** - Different settings per environment
3. ✅ **User Identification** - Link errors to specific users
4. ✅ **Release Tracking** - Connect errors to git commits
5. ✅ **API Tracing** - Distributed tracing for frontend/backend
6. ✅ **Data Sanitization** - Protect sensitive user data
7. ✅ **Custom Tags** - Filter and organize errors
8. ✅ **Performance Monitoring** - Track slow operations

### Your Monitoring Stack:
```typescript
import { Monitoring } from "@/configuration/monitoring";

// Initialization (App.tsx)
<Sentry.ErrorBoundary fallback={AppError} showDialog>
	<SentryUserIdentifier />
	{/* ... your app ... */}
</Sentry.ErrorBoundary>

// User identification (automatic)
Monitoring.setUser({ id, email, username, role });

// Tags and context
Monitoring.setTag("feature", "tournament-detail");
Monitoring.setSentryContext("tournament", { id, name, status });

// Performance tracking
await Monitoring.trackOperation("api.load-tournament", fetchTournament);

// Error handling
Monitoring.captureException(error, {
	tags: { "operation.critical": "true" },
	extra: { tournamentId }
});
```

### Next Steps:
1. **Deploy to staging** - Test Sentry with real data
2. **Review Sentry dashboard** - Check for errors and performance issues
3. **Set up alerts** - Get notified of critical errors
4. **Optimize slow operations** - Use performance data to improve
5. **Share with team** - Train others on using Sentry

### Resources:
- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Performance Docs](https://docs.sentry.io/product/performance/)
- [Best Shot Monitoring Code](src/configuration/monitoring/)

**Happy Monitoring! 🚀**

---

*End of tutorial*
