import { Page, TestInfo } from '@playwright/test';
import { TestConfig } from '../config/TestConfig';
import { ErrorHandler } from './ErrorHandler';

/**
 * Retry configuration interface
 */
export interface RetryConfig {
	maxRetries: number;
	retryDelay: number;
	exponentialBackoff: boolean;
	retryCondition?: (error: Error) => boolean;
	beforeRetry?: (attempt: number, error: Error) => Promise<void>;
	afterRetry?: (attempt: number, success: boolean, error?: Error) => Promise<void>;
}

/**
 * Retry result interface
 */
export interface RetryResult<T> {
	success: boolean;
	result?: T;
	error?: Error;
	attempts: number;
	totalDuration: number;
	attemptDetails: AttemptDetail[];
}

/**
 * Individual attempt detail
 */
export interface AttemptDetail {
	attempt: number;
	success: boolean;
	duration: number;
	error?: Error;
	timestamp: string;
}

/**
 * Enhanced retry handler for flaky test management
 */
export class RetryHandler {
	private page: Page;
	private config: TestConfig;
	private testInfo?: TestInfo;
	private errorHandler: ErrorHandler;

	constructor(page: Page, config: TestConfig, testInfo?: TestInfo) {
		this.page = page;
		this.config = config;
		this.testInfo = testInfo;
		this.errorHandler = new ErrorHandler(page, config, testInfo);
	}

	/**
	 * Execute a function with retry logic
	 */
	async executeWithRetry<T>(
		operation: () => Promise<T>,
		retryConfig: Partial<RetryConfig> = {},
		context?: string
	): Promise<RetryResult<T>> {
		const config: RetryConfig = {
			maxRetries: retryConfig.maxRetries || this.config.retries,
			retryDelay: retryConfig.retryDelay || 1000,
			exponentialBackoff: retryConfig.exponentialBackoff || true,
			retryCondition: retryConfig.retryCondition || this.defaultRetryCondition,
			beforeRetry: retryConfig.beforeRetry,
			afterRetry: retryConfig.afterRetry
		};

		const startTime = Date.now();
		const attemptDetails: AttemptDetail[] = [];
		let lastError: Error | undefined;

		for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
			const attemptStartTime = Date.now();
			
			try {
				// Execute before retry callback
				if (attempt > 1 && config.beforeRetry) {
					await config.beforeRetry(attempt, lastError!);
				}

				// Execute the operation
				const result = await operation();
				const duration = Date.now() - attemptStartTime;

				// Record successful attempt
				attemptDetails.push({
					attempt,
					success: true,
					duration,
					timestamp: new Date().toISOString()
				});

				// Execute after retry callback
				if (config.afterRetry) {
					await config.afterRetry(attempt, true);
				}

				return {
					success: true,
					result,
					attempts: attempt,
					totalDuration: Date.now() - startTime,
					attemptDetails
				};

			} catch (error) {
				const duration = Date.now() - attemptStartTime;
				lastError = error as Error;

				// Record failed attempt
				attemptDetails.push({
					attempt,
					success: false,
					duration,
					error: lastError,
					timestamp: new Date().toISOString()
				});

				// Check if we should retry
				const shouldRetry = attempt <= config.maxRetries && 
					config.retryCondition!(lastError);

				if (!shouldRetry) {
					// Final failure - capture comprehensive error context
					await this.errorHandler.handleTestFailure(lastError, context);
					
					// Execute after retry callback
					if (config.afterRetry) {
						await config.afterRetry(attempt, false, lastError);
					}

					return {
						success: false,
						error: lastError,
						attempts: attempt,
						totalDuration: Date.now() - startTime,
						attemptDetails
					};
				}

				// Log retry attempt
				console.warn(`🔄 Retry attempt ${attempt}/${config.maxRetries} for ${context || 'operation'}: ${lastError.message}`);

				// Wait before retry with exponential backoff
				const delay = config.exponentialBackoff 
					? config.retryDelay * Math.pow(2, attempt - 1)
					: config.retryDelay;
				
				await this.page.waitForTimeout(delay);

				// Execute after retry callback
				if (config.afterRetry) {
					await config.afterRetry(attempt, false, lastError);
				}
			}
		}

		// This should never be reached, but included for completeness
		return {
			success: false,
			error: lastError,
			attempts: config.maxRetries + 1,
			totalDuration: Date.now() - startTime,
			attemptDetails
		};
	}

	/**
	 * Default retry condition - determines if an error should trigger a retry
	 */
	private defaultRetryCondition(error: Error): boolean {
		const retryableErrors = [
			'TimeoutError',
			'NetworkError',
			'Target closed',
			'Navigation timeout',
			'waiting for selector',
			'Element is not attached',
			'Element is not visible',
			'Connection closed',
			'Protocol error'
		];

		const errorMessage = error.message.toLowerCase();
		return retryableErrors.some(retryableError => 
			errorMessage.includes(retryableError.toLowerCase())
		);
	}

	/**
	 * Retry element interaction with enhanced error handling
	 */
	async retryElementInteraction(
		selector: string,
		action: 'click' | 'fill' | 'hover' | 'focus',
		value?: string,
		options: {
			timeout?: number;
			maxRetries?: number;
			force?: boolean;
		} = {}
	): Promise<RetryResult<void>> {
		const timeout = options.timeout || 10000;
		const maxRetries = options.maxRetries || 3;
		const force = options.force || false;

		return this.executeWithRetry(
			async () => {
				const element = this.page.locator(selector);
				
				// Wait for element to be available
				await element.waitFor({ state: 'visible', timeout });
				
				// Scroll into view if needed
				await element.scrollIntoViewIfNeeded();
				
				// Perform the action
				switch (action) {
					case 'click':
						await element.click({ force, timeout });
						break;
					case 'fill':
						if (value !== undefined) {
							await element.clear();
							await element.fill(value);
						}
						break;
					case 'hover':
						await element.hover({ timeout });
						break;
					case 'focus':
						await element.focus({ timeout });
						break;
				}
			},
			{
				maxRetries,
				retryDelay: 1000,
				exponentialBackoff: true,
				beforeRetry: async (attempt, error) => {
					console.warn(`🔄 Retrying ${action} on ${selector} (attempt ${attempt}): ${error.message}`);
					
					// Wait for page to stabilize
					await this.page.waitForTimeout(500);
					
					// Check if page is still responsive
					try {
						await this.page.evaluate(() => document.readyState);
					} catch {
						// Page might be navigating, wait a bit more
						await this.page.waitForTimeout(1000);
					}
				}
			},
			`${action}-${selector}`
		);
	}

	/**
	 * Retry navigation with enhanced error handling
	 */
	async retryNavigation(
		url: string,
		options: {
			timeout?: number;
			maxRetries?: number;
			waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
		} = {}
	): Promise<RetryResult<void>> {
		const timeout = options.timeout || 30000;
		const maxRetries = options.maxRetries || 3;
		const waitUntil = options.waitUntil || 'networkidle';

		return this.executeWithRetry(
			async () => {
				await this.page.goto(url, { timeout, waitUntil });
				
				// Additional verification that navigation succeeded
				const currentUrl = this.page.url();
				if (!currentUrl.includes(url.replace(/^https?:\/\/[^\/]+/, ''))) {
					throw new Error(`Navigation verification failed. Expected URL to contain "${url}", got "${currentUrl}"`);
				}
			},
			{
				maxRetries,
				retryDelay: 2000,
				exponentialBackoff: true,
				beforeRetry: async (attempt, error) => {
					console.warn(`🔄 Retrying navigation to ${url} (attempt ${attempt}): ${error.message}`);
					
					// Clear any existing navigation state
					try {
						await this.page.evaluate(() => window.stop());
					} catch {
						// Ignore errors from stopping navigation
					}
					
					// Wait before retry
					await this.page.waitForTimeout(1000);
				}
			},
			`navigation-${url}`
		);
	}

	/**
	 * Retry assertion with enhanced error handling
	 */
	async retryAssertion<T>(
		assertion: () => Promise<T>,
		options: {
			maxRetries?: number;
			retryDelay?: number;
			description?: string;
		} = {}
	): Promise<RetryResult<T>> {
		const maxRetries = options.maxRetries || 3;
		const retryDelay = options.retryDelay || 1000;
		const description = options.description || 'assertion';

		return this.executeWithRetry(
			assertion,
			{
				maxRetries,
				retryDelay,
				exponentialBackoff: false,
				retryCondition: (error) => {
					// Retry on assertion errors and timeout errors
					return error.message.includes('expect') || 
						   error.message.includes('timeout') ||
						   error.message.includes('not found');
				},
				beforeRetry: async (attempt, error) => {
					console.warn(`🔄 Retrying ${description} (attempt ${attempt}): ${error.message}`);
					
					// Wait for page to stabilize
					await this.page.waitForTimeout(500);
				}
			},
			description
		);
	}

	/**
	 * Retry network request waiting
	 */
	async retryWaitForResponse(
		urlPattern: string | RegExp,
		options: {
			timeout?: number;
			maxRetries?: number;
			expectedStatus?: number;
		} = {}
	): Promise<RetryResult<void>> {
		const timeout = options.timeout || 30000;
		const maxRetries = options.maxRetries || 3;
		const expectedStatus = options.expectedStatus || 200;

		return this.executeWithRetry(
			async () => {
				const response = await this.page.waitForResponse(
					response => {
						const url = response.url();
						const matchesPattern = typeof urlPattern === 'string' 
							? url.includes(urlPattern)
							: urlPattern.test(url);
						return matchesPattern && response.status() === expectedStatus;
					},
					{ timeout }
				);

				if (!response.ok() && expectedStatus === 200) {
					throw new Error(`Response failed with status ${response.status()}: ${response.statusText()}`);
				}
			},
			{
				maxRetries,
				retryDelay: 2000,
				exponentialBackoff: true,
				beforeRetry: async (attempt, error) => {
					console.warn(`🔄 Retrying wait for response ${urlPattern} (attempt ${attempt}): ${error.message}`);
				}
			},
			`wait-for-response-${urlPattern}`
		);
	}

	/**
	 * Clean up resources
	 */
	cleanup(): void {
		this.errorHandler.cleanup();
	}
}