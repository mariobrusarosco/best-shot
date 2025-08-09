import { enhancedTest as test, expect } from '../fixtures/EnhancedTestFixture';
import { DashboardPage } from '../page-objects/screens/DashboardPage';

test.describe('Enhanced Error Handling - Demonstration Tests', () => {
	let dashboardPage: DashboardPage;

	test.beforeEach(async ({ page, testConfig, testInfo }) => {
		dashboardPage = new DashboardPage(page, testConfig);
		await dashboardPage.navigate();
	});

	test.afterEach(async () => {
		// Clean up page object resources
		dashboardPage.cleanup();
	});

	test('should demonstrate automatic screenshot capture on failure', async ({ page, errorHandler }) => {
		// This test intentionally fails to demonstrate error handling
		try {
			// Navigate to dashboard
			await dashboardPage.navigate();
			
			// Attempt to click a non-existent element (this will fail)
			await expect(page.locator('[data-testid="non-existent-element"]')).toBeVisible({ timeout: 5000 });
		} catch (error) {
			// The error handler will automatically capture screenshots and context
			console.log('Expected failure occurred - error handling demonstrated');
			
			// Re-throw to show the test failed (for demonstration)
			// In real tests, you wouldn't catch and re-throw like this
			throw error;
		}
	});

	test('should demonstrate retry logic for flaky operations', async ({ page, retryHandler }) => {
		// Navigate to dashboard
		await dashboardPage.navigate();
		
		// Demonstrate retry logic with a potentially flaky operation
		const result = await retryHandler.executeWithRetry(
			async () => {
				// Simulate a flaky operation that might fail occasionally
				const randomFailure = Math.random() < 0.3; // 30% chance of failure
				if (randomFailure) {
					throw new Error('Simulated flaky operation failure');
				}
				
				// Verify dashboard elements are visible
				await expect(page.locator('[data-ui="screen-heading"]')).toBeVisible();
				return 'success';
			},
			{
				maxRetries: 3,
				retryDelay: 1000,
				exponentialBackoff: true
			},
			'flaky-dashboard-verification'
		);
		
		expect(result.success).toBe(true);
		expect(result.result).toBe('success');
		console.log(`Operation succeeded after ${result.attempts} attempts`);
	});

	test('should demonstrate enhanced element interaction with retry', async ({ page }) => {
		// Navigate to dashboard
		await dashboardPage.navigate();
		
		// Use enhanced click with automatic retry
		await dashboardPage.clickElement('[data-ui="screen-heading"]', {
			timeout: 10000,
			retries: 3,
			force: false
		});
		
		// Verify the click worked (element should still be visible)
		await expect(page.locator('[data-ui="screen-heading"]')).toBeVisible();
	});

	test('should demonstrate network request retry handling', async ({ page }) => {
		// Navigate to dashboard
		await dashboardPage.navigate();
		
		// Wait for a network response with retry logic
		await dashboardPage.waitForResponse(/api|graphql/, {
			timeout: 15000,
			status: 200
		});
		
		// Verify page loaded successfully
		await expect(page.locator('[data-ui="matchday"]')).toBeVisible();
	});

	test('should demonstrate comprehensive error context capture', async ({ page, errorHandler, testInfo }) => {
		// Navigate to dashboard
		await dashboardPage.navigate();
		
		// Simulate an error to capture context
		try {
			// Attempt an operation that will fail
			await page.locator('[data-testid="definitely-not-there"]').click({ timeout: 2000 });
		} catch (error) {
			// Capture comprehensive error context
			const errorContext = await errorHandler.captureErrorContext(error as Error, 'demonstration-error');
			
			// Verify error context contains expected information
			expect(errorContext.testName).toBe(testInfo.title);
			expect(errorContext.url).toContain('dashboard');
			expect(errorContext.screenshotPath).toBeTruthy();
			expect(errorContext.consoleLogs).toBeDefined();
			expect(errorContext.networkRequests).toBeDefined();
			expect(errorContext.performanceMetrics).toBeDefined();
			expect(errorContext.browserInfo).toBeDefined();
			
			console.log('Error context captured successfully:', {
				screenshot: errorContext.screenshotPath,
				consoleLogs: errorContext.consoleLogs.length,
				networkRequests: errorContext.networkRequests.length,
				retryAttempt: errorContext.retryAttempt
			});
			
			// Don't re-throw - this is just a demonstration
		}
	});

	test('should demonstrate performance metrics capture', async ({ page, errorHandler }) => {
		// Navigate to dashboard and capture performance
		const startTime = Date.now();
		await dashboardPage.navigate();
		const loadTime = Date.now() - startTime;
		
		// Capture error context to get performance metrics
		try {
			throw new Error('Demonstration error for performance capture');
		} catch (error) {
			const errorContext = await errorHandler.captureErrorContext(error as Error, 'performance-demo');
			
			// Verify performance metrics are captured
			expect(errorContext.performanceMetrics.loadTime).toBeGreaterThan(0);
			expect(errorContext.performanceMetrics.domContentLoaded).toBeGreaterThan(0);
			
			console.log('Performance metrics captured:', {
				loadTime: errorContext.performanceMetrics.loadTime,
				domContentLoaded: errorContext.performanceMetrics.domContentLoaded,
				measuredLoadTime: loadTime
			});
		}
	});

	test('should demonstrate browser information capture', async ({ page, errorHandler }) => {
		// Navigate to dashboard
		await dashboardPage.navigate();
		
		// Capture browser information through error context
		try {
			throw new Error('Demonstration error for browser info capture');
		} catch (error) {
			const errorContext = await errorHandler.captureErrorContext(error as Error, 'browser-info-demo');
			
			// Verify browser information is captured
			expect(errorContext.browserInfo.name).toBeTruthy();
			expect(errorContext.browserInfo.platform).toBeTruthy();
			expect(typeof errorContext.browserInfo.mobile).toBe('boolean');
			
			console.log('Browser information captured:', errorContext.browserInfo);
		}
	});

	test('should demonstrate console log capture', async ({ page, errorHandler }) => {
		// Navigate to dashboard
		await dashboardPage.navigate();
		
		// Generate some console logs
		await page.evaluate(() => {
			console.log('Test log message');
			console.warn('Test warning message');
			console.error('Test error message');
		});
		
		// Wait a bit for logs to be captured
		await page.waitForTimeout(1000);
		
		// Capture error context to get console logs
		try {
			throw new Error('Demonstration error for console log capture');
		} catch (error) {
			const errorContext = await errorHandler.captureErrorContext(error as Error, 'console-logs-demo');
			
			// Verify console logs are captured
			expect(errorContext.consoleLogs.length).toBeGreaterThan(0);
			
			const logMessages = errorContext.consoleLogs.map(log => log.text);
			const hasTestLog = logMessages.some(msg => msg.includes('Test log message'));
			const hasTestWarning = logMessages.some(msg => msg.includes('Test warning message'));
			const hasTestError = logMessages.some(msg => msg.includes('Test error message'));
			
			console.log('Console logs captured:', {
				totalLogs: errorContext.consoleLogs.length,
				hasTestLog,
				hasTestWarning,
				hasTestError,
				recentLogs: errorContext.consoleLogs.slice(-5).map(log => `${log.type}: ${log.text}`)
			});
		}
	});
});

test.describe('Error Handling Integration Tests', () => {
	test('should handle page crashes gracefully', async ({ page, errorHandler }) => {
		// Navigate to dashboard
		await page.goto('/');
		
		// This test would simulate a page crash scenario
		// In a real scenario, you might test how the application handles:
		// - Network failures
		// - JavaScript errors
		// - Memory issues
		// - Browser crashes
		
		// For now, just verify the error handling system is working
		const errorContext = await errorHandler.captureErrorContext(
			new Error('Simulated page crash'),
			'page-crash-simulation'
		);
		
		expect(errorContext).toBeDefined();
		expect(errorContext.timestamp).toBeTruthy();
		expect(errorContext.url).toBeTruthy();
	});

	test('should handle network timeouts with retry', async ({ page, retryHandler }) => {
		// Test network timeout handling
		const result = await retryHandler.retryNavigation('/', {
			timeout: 30000,
			maxRetries: 2
		});
		
		expect(result.success).toBe(true);
		expect(result.attempts).toBeGreaterThanOrEqual(1);
		
		// Verify page loaded successfully
		await expect(page.locator('menu')).toBeVisible();
	});

	test('should maintain error context across test retries', async ({ testInfo, errorHandler }) => {
		// This test demonstrates how error context is maintained across retries
		const retryAttempt = testInfo.retry;
		
		console.log(`Test retry attempt: ${retryAttempt}`);
		
		// Capture error context
		const errorContext = await errorHandler.captureErrorContext(
			new Error('Test retry demonstration'),
			'retry-context-test'
		);
		
		expect(errorContext.retryAttempt).toBe(retryAttempt);
		expect(errorContext.testName).toBe(testInfo.title);
		expect(errorContext.testFile).toBeTruthy();
	});
});