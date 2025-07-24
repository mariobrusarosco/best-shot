import { type ReactNode, useEffect, useState } from "react";
import { createLDUser, LDProvider } from "@/configuration/feature-flag/featureFlags";
import { APP_MODE } from "@/domains/global/utils";

interface LaunchDarklyProviderProps {
	children: ReactNode;
}

/**
 * LaunchDarkly Provider Component
 *
 * This component wraps your application and initializes the LaunchDarkly client.
 * It sets up an anonymous user initially - the actual user identification
 * is handled by the LaunchDarklyUserIdentifier component.
 */
export const LaunchDarklyProvider = ({ children }: LaunchDarklyProviderProps) => {
	const [ldClientId, setLdClientId] = useState<string>("");

	useEffect(() => {
		// Get the client-side SDK key from environment variables
		const clientKey = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_KEY;
		setLdClientId(clientKey || "");

		if (!clientKey) {
			console.warn("LaunchDarkly client key not found in environment variables");
		}
	}, []);

	// Create an initial anonymous user context
	// The real user identity will be set by LaunchDarklyUserIdentifier
	// Add environment context to the user object
	const initialUser = createLDUser(undefined, {
		environment: APP_MODE, // Include current environment
	});

	console.log(`LaunchDarkly initialized with environment: ${APP_MODE}`);

	// Don't render anything if the client ID isn't available yet
	if (!ldClientId) {
		return <>{children}</>;
	}

	// Configure LaunchDarkly
	const ldConfig = {
		clientSideID: ldClientId,
		user: initialUser,
		options: {
			bootstrap: "localStorage" as const,
			streaming: true,
		},
	};

	return <LDProvider {...ldConfig}>{children}</LDProvider>;
};
