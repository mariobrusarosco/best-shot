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

*Tutorial continues in next session...*
