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
