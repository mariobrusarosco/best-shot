import {
	type LDFlagSet,
	LDProvider,
	useFlags,
	useLDClient,
	withLDProvider,
} from "launchdarkly-react-client-sdk";
import { useCallback } from "react";
import { APP_MODE } from "@/domains/global/utils";

export {
	// Re-export the LaunchDarkly React components and hooks
	LDProvider,
	useLDClient,
	useFlags,
	withLDProvider,
};

/**
 * Creates a LaunchDarkly user object
 * @param userId - The user's ID (or anonymous ID)
 * @param attributes - Additional user attributes for targeting
 * @returns A user object for LaunchDarkly
 */
export const createLDUser = (userId?: string, attributes?: Record<string, any>) => {
	const isAnonymous = !userId;

	// Create a random anonymous ID if no user ID is provided
	const key = userId || `anonymous-${Math.random().toString(36).substring(2, 15)}`;

	return {
		key,
		anonymous: isAnonymous,
		...attributes,
	};
};

/**
 * Hook to identify a user to LaunchDarkly
 * @returns A function to identify the user
 */
export const useIdentifyUser = () => {
	const client = useLDClient();

	return useCallback(
		(userId?: string, attributes?: Record<string, any>) => {
			if (!client) return;

			const user = createLDUser(userId, attributes);
			client.identify(user);
		},
		[client]
	);
};

/**
 * Helper function to check if a feature flag is enabled
 * @param flags - The flags object from useFlags()
 * @param flagKey - The key of the feature flag
 * @param defaultValue - Default value if flag is not found
 * @returns boolean indicating if the feature is enabled
 */
export const isFeatureEnabled = (
	flags: LDFlagSet,
	flagKey: string,
	defaultValue = false
): boolean => {
	if (flags === undefined || flags[flagKey] === undefined) {
		return defaultValue;
	}
	return Boolean(flags[flagKey]);
};

/**
 * Utility function to convert camelCase to snake_case
 */
export const camelToSnake = (str: string) => {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Utility function to convert snake_case to camelCase
 */
export const snakeToCamel = (str: string) => {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Debug utility to print all available feature flags with both
 * their camelCase and snake_case versions
 * @param flags - The flags object from useFlags()
 */
export const debugFeatureFlags = (flags: LDFlagSet) => {
	console.group("LaunchDarkly Feature Flags");
	console.log("Environment:", APP_MODE);
	console.log("Available flags:");

	Object.keys(flags).forEach((key) => {
		const value = flags[key];
		const snakeVersion = camelToSnake(key);
		console.log(`• ${key}${key !== snakeVersion ? ` (snake_case: ${snakeVersion})` : ""}:`, value);
	});

	console.groupEnd();
};
