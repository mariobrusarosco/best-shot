/**
 * Centralized Sentry monitoring constants
 * Used by both runtime monitoring code and build-time Vite plugin
 */

/**
 * Environments where Sentry monitoring is enabled
 * - local-dev: Disabled (too noisy, no real errors)
 * - demo: Enabled (test with real-ish data)
 * - staging: Enabled (pre-production testing)
 * - production: Enabled (live monitoring)
 */
export const SENTRY_ENABLED_ENVIRONMENTS = ["demo", "staging", "production"] as const;

export type SentryEnvironment = (typeof SENTRY_ENABLED_ENVIRONMENTS)[number];
