import { useEffect } from "react";
import { Authentication } from "@/domains/authentication";
import { APP_MODE } from "@/domains/global/utils";
import { useIdentifyUser } from "../configuration/feature-flag/featureFlags";

const { useAppAuth } = Authentication;

/**
 * LaunchDarklyUserIdentifier
 *
 * This component observes authentication state changes and updates
 * the LaunchDarkly user identification accordingly.
 *
 * It should be included once in your application, typically near
 * the authentication provider.
 */
export const LaunchDarklyUserIdentifier = () => {
	const auth = useAppAuth();
	const { isAuthenticated, isLoadingAuth, authId } = auth;
	const identifyUser = useIdentifyUser();

	useEffect(() => {
		// Skip if auth is still loading
		if (isLoadingAuth) return;

		// Create user attributes with environment
		const userAttributes = {
			environment: APP_MODE,
		};

		if (isAuthenticated && authId) {
			// User is authenticated - identify with user ID and environment
			identifyUser(authId, userAttributes);

			console.log(
				"Identified authenticated user to LaunchDarkly:",
				authId,
				"Environment:",
				APP_MODE
			);
		} else {
			// User is not authenticated - use anonymous identification but still include environment
			identifyUser(undefined, userAttributes);

			console.log("Identified anonymous user to LaunchDarkly", "Environment:", APP_MODE);
		}
	}, [isAuthenticated, isLoadingAuth, authId, identifyUser]);

	// This is a utility component that doesn't render anything
	return null;
};

export default LaunchDarklyUserIdentifier;
