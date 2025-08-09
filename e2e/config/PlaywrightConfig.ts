import { defineConfig, devices } from '@playwright/test';
import { getTestConfig } from './TestConfig';

// Get environment from environment variable or default to demo
const environment = process.env.TEST_ENV || 'demo';
const testConfig = getTestConfig(environment);

/**
 * Enhanced Playwright configuration for Best Shot E2E tests
 * Supports multiple environments and enhanced reporting
 */
export default defineConfig({
	testDir: './e2e',
	
	/* Run tests in files in parallel */
	fullyParallel: true,
	
	/* Fail the build on CI if you accidentally left test.only in the source code */
	forbidOnly: !!process.env.CI,
	
	/* Retry configuration based on environment */
	retries: process.env.CI ? testConfig.retries : 0,
	
	/* Opt out of parallel tests on CI for stability */
	workers: process.env.CI ? 1 : undefined,
	
	/* Enhanced reporter configuration */
	reporter: [
		['html', { 
			outputFolder: 'playwright-report',
			open: process.env.CI ? 'never' : 'on-failure'
		}],
		['junit', { outputFile: 'test-results/junit-results.xml' }],
		['list']
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
		
		/* Collect trace when retrying failed tests */
		trace: 'on-first-retry',
		
		/* Screenshot configuration */
		screenshot: testConfig.screenshots.onFailure ? 'only-on-failure' : 'off',
		
		/* Video recording on failure */
		video: testConfig.reporting.videoOnFailure ? 'retain-on-failure' : 'off',
		
		/* Default viewport */
		viewport: testConfig.viewport,
		
		/* Ignore HTTPS errors for demo environment */
		ignoreHTTPSErrors: true,
		
		/* Action timeout */
		actionTimeout: 15000,
		
		/* Navigation timeout */
		navigationTimeout: 30000
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
	globalSetup: require.resolve('./GlobalSetup.ts'),
	globalTeardown: require.resolve('./GlobalTeardown.ts'),
	
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