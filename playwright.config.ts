import { defineConfig, devices } from '@playwright/test';
import { getTestConfig } from './e2e/config/TestConfig';

// Get environment from environment variable or default to demo
const environment = process.env.TEST_ENV || 'demo';
const testConfig = getTestConfig(environment);

/**
 * Enhanced Playwright configuration for Best Shot E2E tests
 * Supports multiple environments and enhanced reporting
 * 
 * Usage:
 * - Default (demo): npx playwright test
 * - Staging: TEST_ENV=staging npx playwright test
 * - Production: TEST_ENV=production npx playwright test
 */
export default defineConfig({
	testDir: './e2e',
	
	/* Run tests in files in parallel */
	fullyParallel: true,
	
	/* Fail the build on CI if you accidentally left test.only in the source code */
	forbidOnly: !!process.env.CI,
	
	/* Retry configuration based on environment */
	retries: process.env.CI ? testConfig.retries : 0,
	
	/* Optimize worker configuration for parallel execution */
	workers: process.env.CI ? 2 : Math.max(1, Math.floor(require('os').cpus().length / 2)),
	
	/* Enhanced reporter configuration */
	reporter: [
		['html', { 
			outputFolder: 'playwright-report',
			open: process.env.CI ? 'never' : 'on-failure',
			attachments: ['screenshot', 'video', 'trace']
		}],
		['junit', { 
			outputFile: 'test-results/junit-results.xml',
			includeProjectInTestName: true
		}],
		['list', { printSteps: true }],
		// Add JSON reporter for programmatic analysis
		['json', { outputFile: 'test-results/test-results.json' }]
	],
	
	/* Global test timeout */
	timeout: testConfig.timeout,
	
	/* Expect timeout for assertions */
	expect: {
		timeout: 10000
	},
	
	/* Shared settings for all projects */
	use: {
		/* Base URL from configuration */
		baseURL: testConfig.baseURL,
		
		/* Enhanced trace collection for debugging */
		trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
		
		/* Screenshot configuration - always capture on failure */
		screenshot: 'only-on-failure',
		
		/* Video recording configuration - enhanced for debugging */
		video: testConfig.reporting.videoOnFailure ? 'retain-on-failure' : 'off',
		
		/* Default viewport */
		viewport: testConfig.viewport,
		
		/* Ignore HTTPS errors for demo environment */
		ignoreHTTPSErrors: true,
		
		/* Enhanced timeout configuration */
		actionTimeout: 15000,
		navigationTimeout: 30000,
		
		/* Enhanced context options for error handling */
		contextOptions: {
			// Record video for all tests in CI
			recordVideo: process.env.CI ? {
				dir: 'test-results/videos/',
				size: testConfig.viewport
			} : undefined,
			
			// Capture console logs
			recordHar: process.env.DEBUG ? {
				path: 'test-results/network.har'
			} : undefined
		}
	},
	
	/* Configure projects for different browsers */
	projects: testConfig.browsers.map(browserName => ({
		name: browserName,
		use: { 
			...devices[browserName === 'chromium' ? 'Desktop Chrome' : 
					browserName === 'firefox' ? 'Desktop Firefox' : 
					browserName === 'webkit' ? 'Desktop Safari' :
					'Desktop Chrome'] 
		},
	})),
	
	/* Output directories */
	outputDir: 'test-results/',
	
	/* Global setup and teardown */
	globalSetup: require.resolve('./e2e/config/GlobalSetup.ts'),
	globalTeardown: require.resolve('./e2e/config/GlobalTeardown.ts'),
	
	/* Optimize for parallel execution */
	maxFailures: process.env.CI ? 5 : undefined, // Stop after 5 failures in CI
	
	/* Test match patterns */
	testMatch: [
		'**/tests/**/*.spec.ts',
		'**/tests/**/*.test.ts'
	],
	
	/* Ignore patterns */
	testIgnore: [
		'**/node_modules/**',
		'**/dist/**',
		'**/coverage/**'
	]
});
