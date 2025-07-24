import { useFlags } from "launchdarkly-react-client-sdk";

/**
 * Converts snake_case to camelCase
 * @example snakeToCamel("my_flag_name") // returns "myFlagName"
 */
const snakeToCamel = (str: string) => {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Hook to check if a specific feature flag is enabled
 * @param flagKey - The key of the feature flag (in snake_case as defined in LaunchDarkly)
 * @param defaultValue - Default value if flag is not found
 * @returns boolean indicating if the feature is enabled
 */
export const useFeatureFlag = (flagKey: string, defaultValue = false): boolean => {
	const flags = useFlags();

	// Try the original key first (for flags that might actually be defined as camelCase)
	if (typeof flags[flagKey] === "boolean") {
		return flags[flagKey] as boolean;
	}

	// Convert to camelCase and try that (for snake_case flags that LD converted)
	const camelCaseKey = snakeToCamel(flagKey);
	if (typeof flags[camelCaseKey] === "boolean") {
		return flags[camelCaseKey] as boolean;
	}

	// Final fallback
	return defaultValue;
};

/**
 * Hook to get the value of a feature flag of any type
 * Handles both snake_case and camelCase flag keys
 * @param flagKey - The key of the feature flag (in snake_case as defined in LaunchDarkly)
 * @param defaultValue - Default value if flag is not found
 * @returns The value of the feature flag
 */
export const useFeatureFlagValue = <T>(flagKey: string, defaultValue: T): T => {
	const flags = useFlags();

	// Try the original key first
	if (flags[flagKey] !== undefined) {
		return flags[flagKey] as T;
	}

	// Convert to camelCase and try that
	const camelCaseKey = snakeToCamel(flagKey);
	if (flags[camelCaseKey] !== undefined) {
		return flags[camelCaseKey] as T;
	}

	// Final fallback
	return defaultValue;
};
