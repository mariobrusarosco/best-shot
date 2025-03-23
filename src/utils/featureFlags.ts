import {
  LDProvider,
  useLDClient,
  useFlags,
  withLDProvider,
  LDFlagSet
} from 'launchdarkly-react-client-sdk';
import { useCallback } from 'react';

export {
  // Re-export the LaunchDarkly React components and hooks
  LDProvider,
  useLDClient,
  useFlags,
  withLDProvider
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
    ...attributes
  };
};

/**
 * Hook to check if a specific feature flag is enabled
 * @param flagKey - The key of the feature flag
 * @param defaultValue - Default value if flag is not found
 * @returns boolean indicating if the feature is enabled
 */
export const useFeatureFlag = (flagKey: string, defaultValue = false): boolean => {
  const flags = useFlags();
  return typeof flags[flagKey] === 'boolean' ? flags[flagKey] as boolean : defaultValue;
};

/**
 * Hook to get the value of a feature flag of any type
 * @param flagKey - The key of the feature flag
 * @param defaultValue - Default value if flag is not found
 * @returns The value of the feature flag
 */
export const useFeatureFlagValue = <T>(flagKey: string, defaultValue: T): T => {
  const flags = useFlags();
  return (flags[flagKey] as T) ?? defaultValue;
};

/**
 * Hook to identify a user to LaunchDarkly
 * @returns A function to identify the user
 */
export const useIdentifyUser = () => {
  const client = useLDClient();
  
  return useCallback((userId?: string, attributes?: Record<string, any>) => {
    if (!client) return;
    
    const user = createLDUser(userId, attributes);
    client.identify(user);
  }, [client]);
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