import { test as base, Page, TestInfo } from '@playwright/test';
import { TestConfig, getTestConfig } from '../config/TestConfig';
import { ErrorHandler } from '../utils/ErrorHandler';
import { RetryHandler } from '../utils/RetryHandler';
import { TestHelpers } from '../utils/TestHelpers';

/**
 * Enhanced test fixture interface
 */
export interface EnhancedTestFixture {
	page: Page;
	testConfig: TestConfig;
	errorHandler: ErrorHandler;
	retryHandler: RetryHandler;
	testHelpers: TestHelpers;
	testInfo: TestInfo;
}

/**
 * Enhanced test fixture with comprehensive error handling and retry logic
 */
export const test = base.extend<EnhancedTestFixture>({
	testConfig: async ({}, use) => {
		const environment = process.env.TEST_ENV || 'demo';
		const config = getTestConfig(environment);
		await use(config);
	},

	errorHandler: async ({ page, testConfig }, use, testInfo) => {
		const errorHandler = new ErrorHandler(page, testConfig, testInfo);
		
		// Set up global error handling
		const originalConsoleError = console.error;
		console.error = (...args) => {
			// Log to original console
			originalConsoleError(...args);
			
			// If this is a test error, capture context
			if (args[0] && typeof args[0] === 'string' && args[0].includes('Test timeout')) {
				errorHandler.handleTestFailure(new Error(args[0]), 'test-timeout');
			}
		};

		try {
			await use(errorHandler);
		} finally {
			// Restore original console.error
			console.error = originalConsoleError;
			
			// Clean up error handler
			errorHandler.cleanup();
		}
	},

	retryHandler: async ({ page, testConfig, errorHandler }, use, testInfo) => {
		const retryHandler = new RetryHandler(page, testConfig, testInfo);
		
		try {
			await use(retryHandler);
		} finally {
			retryHandler.cleanup();
		}
	},

	testHelpers: async ({ page, testConfig }, use) => {
		const testHelpers = new TestHelpers(page, testConfig);
		await use(testHelpers);
	},

	testInfo: async ({}, use, testInfo) => {
		await use(testInfo);
	}
});

/**
 * Enhanced test with automatic error handling
 */
export const enhancedTest = test.extend<EnhancedTestFixture>({
	page: async ({ page, errorHandler, testInfo }, use) => {
		// Set up automatic screenshot on failure
		page.on('pageerror', async (error) => {
			await errorHandler.handleTestFailure(error, 'page-error');
		});

		// Set up automatic error capture on uncaught exceptions
		page.on('crash', async () => {
			await errorHandler.handleTestFailure(new Error('Page crashed'), 'page-crash');
		});

		try {
			await use(page);
		} catch (error) {
			// Capture error context on test failure
			await errorHandler.handleTestFailure(error as Error, 'test-failure');
			throw error;
		}
	}
});

/**
 * Test with enhanced retry capabilities
 */
export const retryTest = enhancedTest.extend<EnhancedTestFixture>({
	page: async ({ page, retryHandler, errorHandler }, use, testInfo) => {
		// Override page methods with retry logic
		const originalGoto = page.goto.bind(page);
		page.goto = async (url: string, options?: any) => {
			const result = await retryHandler.retryNavigation(url, {
				timeout: options?.timeout,
				waitUntil: options?.waitUntil
			});
			
			if (!result.success) {
				throw result.error || new Error(`Navigation to ${url} failed after ${result.attempts} attempts`);
			}
			
			return {} as any; // Playwright Response object
		};

		// Override locator click with retry logic
		const originalLocator = page.locator.bind(page);
		page.locator = (selector: string, options?: any) => {
			const locator = originalLocator(selector, options);
			const originalClick = locator.click.bind(locator);
			
			locator.click = async (clickOptions?: any) => {
				const result = await retryHandler.retryElementInteraction(
					selector,
					'click',
					undefined,
					{
						timeout: clickOptions?.timeout,
						force: clickOptions?.force
					}
				);
				
				if (!result.success) {
					throw result.error || new Error(`Click on ${selector} failed after ${result.attempts} attempts`);
				}
			};
			
			return locator;
		};

		await use(page);
	}
});

/**
 * Export expect for consistency
 */
export { expect } from '@playwright/test';