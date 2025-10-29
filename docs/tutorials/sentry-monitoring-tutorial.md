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

*Tutorial continues in next session...*
