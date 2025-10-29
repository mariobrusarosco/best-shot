import * as Sentry from "@sentry/react";
import type { ErrorEvent, EventHint } from "@sentry/react";
import { SENTRY_ENABLED_ENVIRONMENTS } from "./constants";

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

interface UserIdentity {
	id: string;
	email?: string;
	username?: string;
	role?: string;
}

export const Monitoring = {
	init: () => {
		const currentEnv = import.meta.env.MODE;

		// Only enable Sentry in non-local environments
		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
			console.log(`[Sentry] Disabled in ${currentEnv} mode`);
			return;
		}

		const config = getEnvironmentConfig(currentEnv);

		// Get release information from environment variables or build process
		// The Sentry Vite plugin automatically injects SENTRY_RELEASE during build
		const release = import.meta.env.VITE_SENTRY_RELEASE || import.meta.env.SENTRY_RELEASE;

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
			release, // Links errors to specific deployments/commits

			// Core integrations
			integrations: [
				Sentry.browserTracingIntegration(),
				Sentry.replayIntegration(),
			],

			// Performance Monitoring (environment-specific)
			tracesSampleRate: config.tracesSampleRate,

			// Distributed Tracing - connects frontend and backend traces
			tracePropagationTargets,

			// Session Replay (environment-specific)
			replaysSessionSampleRate: config.replaysSessionSampleRate,
			replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,

			// Data Sanitization - strip sensitive data before sending to Sentry
			beforeSend,
		});

		console.log(
			`[Sentry] Initialized for ${config.environment} environment`,
			`\n  - Release: ${release || "not set"}`,
			`\n  - Traces: ${config.tracesSampleRate * 100}%`,
			`\n  - Replays: ${config.replaysSessionSampleRate * 100}%`,
			`\n  - Error Replays: ${config.replaysOnErrorSampleRate * 100}%`,
			`\n  - API Tracing: ${tracePropagationTargets.map(t => t.toString()).join(", ")}`,
		);
	},

	/**
	 * Identify the current user in Sentry
	 * This links all errors and sessions to the specific user
	 */
	setUser: (user: UserIdentity | null) => {
		const currentEnv = import.meta.env.MODE;

		// Only set user in enabled environments
		if (!SENTRY_ENABLED_ENVIRONMENTS.includes(currentEnv as any)) {
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
