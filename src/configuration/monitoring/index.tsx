import * as Sentry from "@sentry/react";

export const Monitoring = {
	init: () => {
		if (import.meta.env.MODE !== "demo") return;

		Sentry.init({
			dsn: "https://b56572183c3d505201d237f3e06d598d@o4506356341276672.ingest.us.sentry.io/4508489696673792",
			integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
			// Tracing
			tracesSampleRate: 1.0, //  Capture 100% of the transactions
			// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
			tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
			// Session Replay
			replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
			replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
		});
	},
};
