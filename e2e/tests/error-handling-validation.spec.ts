import { test, expect } from '@playwright/test';
import { getTestConfig } from '../config/TestConfig';
import { ErrorHandler } from '../utils/ErrorHandler';
import { RetryHandler } from '../utils/RetryHandler';

test.describe('Error Handling Validation', () => {
	let testConfig: ReturnType<typeof getTestConfig>;

	test.beforeAll(async () => {
		testConfig = getTestConfig('demo');
	});

	test('should create ErrorHandler instance successfully', async ({ page }) => {
		const errorHandler = new ErrorHandler(page, testConfig);
		expect(errorHandler).toBeDefined();
		
		// Test error context capture
		const errorContext = await errorHandler.captureErrorContext(
			new Error('Test error'),
			'validation-test'
		);
		
		expect(errorContext.timestamp).toBeTruthy();
		expect(errorContext.testName).toBeTruthy();
		expect(errorContext.url).toBeTruthy();
		expect(errorContext.browserInfo).toBeDefined();
		expect(errorContext.performanceMetrics).toBeDefined();
		
		// Cleanup
		errorHandler.cleanup();
	});

	test('should create RetryHandler instance successfully', async ({ page }) => {
		const retryHandler = new RetryHandler(page, testConfig);
		expect(retryHandler).toBeDefined();
		
		// Test simple retry operation
		const result = await retryHandler.executeWithRetry(
			async () => {
				return 'success';
			},
			{ maxRetries: 1 },
			'validation-test'
		);
		
		expect(result.success).toBe(true);
		expect(result.result).toBe('success');
		expect(result.attempts).toBe(1);
		
		// Cleanup
		retryHandler.cleanup();
	});

	test('should handle navigation with retry', async ({ page }) => {
		const retryHandler = new RetryHandler(page, testConfig);
		
		const result = await retryHandler.retryNavigation('/', {
			timeout: 30000,
			maxRetries: 2
		});
		
		expect(result.success).toBe(true);
		expect(result.attempts).toBeGreaterThanOrEqual(1);
		
		// Verify page loaded
		await expect(page.locator('menu')).toBeVisible();
		
		retryHandler.cleanup();
	});

	test('should capture screenshots on error', async ({ page }) => {
		const errorHandler = new ErrorHandler(page, testConfig);
		
		// Navigate to a page first
		await page.goto('/');
		
		// Capture error context which should include screenshot
		const errorContext = await errorHandler.captureErrorContext(
			new Error('Screenshot test'),
			'screenshot-validation'
		);
		
		expect(errorContext.screenshotPath).toBeTruthy();
		
		// Check if screenshot file exists (basic validation)
		const fs = require('fs');
		if (errorContext.screenshotPath) {
			expect(fs.existsSync(errorContext.screenshotPath)).toBe(true);
		}
		
		errorHandler.cleanup();
	});

	test('should track console logs', async ({ page }) => {
		const errorHandler = new ErrorHandler(page, testConfig);
		
		// Navigate to a page
		await page.goto('/');
		
		// Generate some console logs
		await page.evaluate(() => {
			console.log('Test log message');
			console.warn('Test warning');
			console.error('Test error');
		});
		
		// Wait for logs to be captured
		await page.waitForTimeout(1000);
		
		// Capture error context
		const errorContext = await errorHandler.captureErrorContext(
			new Error('Console log test'),
			'console-validation'
		);
		
		expect(errorContext.consoleLogs).toBeDefined();
		expect(errorContext.consoleLogs.length).toBeGreaterThan(0);
		
		// Check if our test logs are captured
		const logTexts = errorContext.consoleLogs.map(log => log.text);
		const hasTestLog = logTexts.some(text => text.includes('Test log message'));
		const hasTestWarning = logTexts.some(text => text.includes('Test warning'));
		const hasTestError = logTexts.some(text => text.includes('Test error'));
		
		expect(hasTestLog || hasTestWarning || hasTestError).toBe(true);
		
		errorHandler.cleanup();
	});

	test('should track network requests', async ({ page }) => {
		const errorHandler = new ErrorHandler(page, testConfig);
		
		// Navigate to trigger network requests
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		// Capture error context
		const errorContext = await errorHandler.captureErrorContext(
			new Error('Network tracking test'),
			'network-validation'
		);
		
		expect(errorContext.networkRequests).toBeDefined();
		expect(errorContext.networkRequests.length).toBeGreaterThan(0);
		
		// Verify network request structure
		const firstRequest = errorContext.networkRequests[0];
		expect(firstRequest.url).toBeTruthy();
		expect(firstRequest.method).toBeTruthy();
		expect(typeof firstRequest.status).toBe('number');
		expect(firstRequest.timestamp).toBeTruthy();
		
		errorHandler.cleanup();
	});
});