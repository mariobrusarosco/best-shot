import { Page, Locator, expect, TestInfo } from '@playwright/test';
import { TestConfig } from '../../config/TestConfig';
import { ErrorHandler } from '../../utils/ErrorHandler';
import { RetryHandler } from '../../utils/RetryHandler';

/**
 * Base page object class providing common utilities and error handling
 * for all page objects in the E2E test suite
 */
export abstract class BasePage {
	protected page: Page;
	protected config: TestConfig;
	protected baseURL: string;
	protected errorHandler: ErrorHandler;
	protected retryHandler: RetryHandler;

	constructor(page: Page, config: TestConfig, testInfo?: TestInfo) {
		this.page = page;
		this.config = config;
		this.baseURL = config.baseURL;
		this.errorHandler = new ErrorHandler(page, config, testInfo);
		this.retryHandler = new RetryHandler(page, config, testInfo);
	}

	/**
	 * Navigate to the specific page - must be implemented by subclasses
	 */
	abstract navigate(): Promise<void>;

	/**
	 * Wait for the page to fully load - must be implemented by subclasses
	 */
	abstract waitForLoad(): Promise<void>;

	/**
	 * Smart waiting strategies for elements with multiple fallback options
	 */
	protected async waitForElement(selector: string, options?: {
		timeout?: number;
		state?: 'visible' | 'attached' | 'detached' | 'hidden';
		strict?: boolean;
	}): Promise<Locator> {
		const timeout = options?.timeout || this.config.timeout;
		const state = options?.state || 'visible';
		
		try {
			const element = this.page.locator(selector);
			await element.waitFor({ state, timeout });
			return element;
		} catch (error) {
			await this.handleError(error as Error, `waiting-for-element-${selector}`);
			throw error;
		}
	}

	/**
	 * Wait for multiple elements with fallback strategy
	 */
	protected async waitForAnyElement(selectors: string[], timeout?: number): Promise<Locator> {
		const actualTimeout = timeout || this.config.timeout;
		const promises = selectors.map(selector => 
			this.page.locator(selector).waitFor({ state: 'visible', timeout: actualTimeout })
		);
		
		try {
			await Promise.race(promises);
			// Return the first visible element
			for (const selector of selectors) {
				const element = this.page.locator(selector);
				if (await element.isVisible()) {
					return element;
				}
			}
			throw new Error(`None of the elements were found: ${selectors.join(', ')}`);
		} catch (error) {
			await this.handleError(error as Error, `waiting-for-any-element`);
			throw error;
		}
	}

	/**
	 * Enhanced element interaction with retry logic
	 */
	protected async clickElement(selector: string, options?: {
		timeout?: number;
		retries?: number;
		force?: boolean;
	}): Promise<void> {
		const timeout = options?.timeout || 10000;
		const retries = options?.retries || 3;
		const force = options?.force || false;
		
		const result = await this.retryHandler.retryElementInteraction(
			selector,
			'click',
			undefined,
			{ timeout, maxRetries: retries, force }
		);
		
		if (!result.success) {
			await this.handleError(result.error!, `clicking-element-${selector}-after-${result.attempts}-attempts`);
			throw result.error;
		}
	}

	/**
	 * Enhanced text input with validation
	 */
	protected async fillElement(selector: string, text: string, options?: {
		timeout?: number;
		clear?: boolean;
		validate?: boolean;
	}): Promise<void> {
		const timeout = options?.timeout || 10000;
		const clear = options?.clear !== false; // Default to true
		const validate = options?.validate !== false; // Default to true
		
		const result = await this.retryHandler.retryElementInteraction(
			selector,
			'fill',
			text,
			{ timeout }
		);
		
		if (!result.success) {
			await this.handleError(result.error!, `filling-element-${selector}`);
			throw result.error;
		}
		
		// Validate input if requested
		if (validate) {
			try {
				const element = this.page.locator(selector);
				const actualValue = await element.inputValue();
				if (actualValue !== text) {
					throw new Error(`Text input validation failed. Expected: "${text}", Actual: "${actualValue}"`);
				}
			} catch (error) {
				await this.handleError(error as Error, `validating-element-${selector}`);
				throw error;
			}
		}
	}

	/**
	 * Enhanced screenshot capture with context and error handling
	 */
	protected async takeScreenshot(name: string, options?: {
		fullPage?: boolean;
		clip?: { x: number; y: number; width: number; height: number };
	}): Promise<string> {
		try {
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const filename = `${name}-${timestamp}.png`;
			const path = `${this.config.screenshots.directory}/${filename}`;
			
			await this.page.screenshot({
				path,
				fullPage: options?.fullPage !== false, // Default to true
				clip: options?.clip
			});
			
			return path;
		} catch (error) {
			console.error(`Failed to take screenshot: ${error}`);
			return '';
		}
	}

	/**
	 * Enhanced error handling with comprehensive logging and screenshot capture
	 */
	protected async handleError(error: Error, context?: string): Promise<void> {
		const errorContext = context || 'unknown-error';
		
		// Use the enhanced error handler for comprehensive error capture
		await this.errorHandler.handleTestFailure(error, `${this.constructor.name}-${errorContext}`);
		
		// Re-throw with enhanced context
		const enhancedError = new Error(`${error.message} (Context: ${this.constructor.name}-${errorContext})`);
		enhancedError.stack = error.stack;
		throw enhancedError;
	}

	/**
	 * Enhanced network waiting with multiple strategies
	 */
	protected async waitForNetworkIdle(options?: {
		timeout?: number;
		idleTime?: number;
	}): Promise<void> {
		const timeout = options?.timeout || this.config.timeout;
		const idleTime = options?.idleTime || 500;
		
		try {
			await this.page.waitForLoadState('networkidle', { timeout });
		} catch (error) {
			// Fallback: wait for domcontentloaded if networkidle fails
			await this.page.waitForLoadState('domcontentloaded', { timeout });
			await this.page.waitForTimeout(idleTime);
		}
	}

	/**
	 * Wait for specific network response with pattern matching
	 */
	protected async waitForResponse(urlPattern: string | RegExp, options?: {
		timeout?: number;
		status?: number;
	}): Promise<void> {
		const timeout = options?.timeout || this.config.timeout;
		const expectedStatus = options?.status || 200;
		
		const result = await this.retryHandler.retryWaitForResponse(
			urlPattern,
			{ timeout, expectedStatus }
		);
		
		if (!result.success) {
			await this.handleError(result.error!, `waiting-for-response-${urlPattern}`);
			throw result.error;
		}
	}

	/**
	 * Enhanced element visibility checking with retry
	 */
	protected async isElementVisible(selector: string, timeout = 5000): Promise<boolean> {
		try {
			const element = this.page.locator(selector);
			await element.waitFor({ state: 'visible', timeout });
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Enhanced element text retrieval with fallback
	 */
	protected async getElementText(selector: string, options?: {
		timeout?: number;
		trim?: boolean;
	}): Promise<string> {
		const timeout = options?.timeout || 10000;
		const trim = options?.trim !== false; // Default to true
		
		try {
			const element = await this.waitForElement(selector, { timeout });
			const text = await element.textContent() || '';
			return trim ? text.trim() : text;
		} catch (error) {
			await this.handleError(error as Error, `getting-text-from-${selector}`);
			return '';
		}
	}

	/**
	 * Enhanced URL verification with retry logic
	 */
	protected async verifyUrl(expectedPattern: string | RegExp, options?: {
		timeout?: number;
		retries?: number;
	}): Promise<void> {
		const timeout = options?.timeout || 10000;
		const retries = options?.retries || 3;
		
		let lastError: Error | null = null;
		
		for (let i = 0; i < retries; i++) {
			try {
				await expect(this.page).toHaveURL(expectedPattern, { timeout });
				return;
			} catch (error) {
				lastError = error as Error;
				if (i < retries - 1) {
					await this.page.waitForTimeout(1000);
				}
			}
		}
		
		await this.handleError(lastError!, `verifying-url-${expectedPattern}`);
	}

	/**
	 * Get current page URL
	 */
	protected getCurrentUrl(): string {
		return this.page.url();
	}

	/**
	 * Get page title with error handling
	 */
	protected async getPageTitle(): Promise<string> {
		try {
			return await this.page.title();
		} catch (error) {
			await this.handleError(error as Error, 'getting-page-title');
			return '';
		}
	}

	/**
	 * Scroll element into view with enhanced options
	 */
	protected async scrollIntoView(selector: string, options?: {
		behavior?: 'auto' | 'smooth';
		block?: 'start' | 'center' | 'end' | 'nearest';
	}): Promise<void> {
		try {
			const element = this.page.locator(selector);
			await element.scrollIntoViewIfNeeded();
			
			// Additional scroll options if needed
			if (options) {
				await element.evaluate((el, scrollOptions) => {
					el.scrollIntoView(scrollOptions);
				}, options);
			}
		} catch (error) {
			await this.handleError(error as Error, `scrolling-to-${selector}`);
		}
	}

	/**
	 * Wait for page to be ready (combines multiple waiting strategies)
	 */
	protected async waitForPageReady(options?: {
		networkIdle?: boolean;
		domContentLoaded?: boolean;
		timeout?: number;
	}): Promise<void> {
		const timeout = options?.timeout || this.config.timeout;
		const waitForNetwork = options?.networkIdle !== false; // Default to true
		const waitForDOM = options?.domContentLoaded !== false; // Default to true
		
		try {
			if (waitForDOM) {
				await this.page.waitForLoadState('domcontentloaded', { timeout });
			}
			
			if (waitForNetwork) {
				await this.waitForNetworkIdle({ timeout });
			}
		} catch (error) {
			await this.handleError(error as Error, 'waiting-for-page-ready');
		}
	}

	/**
	 * Clean up resources and event listeners
	 */
	cleanup(): void {
		this.errorHandler.cleanup();
		this.retryHandler.cleanup();
	}
}