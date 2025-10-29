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
