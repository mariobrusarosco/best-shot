import { Page, expect } from '@playwright/test';
import { TestConfig } from '../config/TestConfig';

/**
 * Common test utilities and helper functions
 */
export class TestHelpers {
	private page: Page;
	private config: TestConfig;

	constructor(page: Page, config: TestConfig) {
		this.page = page;
		this.config = config;
	}

	/**
	 * Navigate to a URL with error handling
	 */
	async navigateToUrl(url: string, waitForLoad = true): Promise<void> {
		try {
			await this.page.goto(url);
			if (waitForLoad) {
				await this.page.waitForLoadState('networkidle');
			}
		} catch (error) {
			console.error(`Failed to navigate to ${url}:`, error);
			throw error;
		}
	}

	/**
	 * Wait for element with custom timeout
	 */
	async waitForElementWithTimeout(selector: string, timeout?: number): Promise<void> {
		const actualTimeout = timeout || this.config.timeout;
		await expect(this.page.locator(selector)).toBeVisible({ timeout: actualTimeout });
	}

	/**
	 * Check if element exists without throwing
	 */
	async elementExists(selector: string): Promise<boolean> {
		try {
			await this.page.locator(selector).waitFor({ state: 'attached', timeout: 5000 });
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Get element text content safely
	 */
	async getElementText(selector: string): Promise<string> {
		const element = this.page.locator(selector);
		await expect(element).toBeVisible();
		return await element.textContent() || '';
	}

	/**
	 * Click element with retry logic (enhanced to work with BasePage)
	 */
	async clickElementWithRetry(selector: string, options?: {
		maxRetries?: number;
		timeout?: number;
		force?: boolean;
	}): Promise<void> {
		const maxRetries = options?.maxRetries || 3;
		const timeout = options?.timeout || 10000;
		const force = options?.force || false;
		
		let lastError: Error | null = null;
		
		for (let i = 0; i < maxRetries; i++) {
			try {
				const element = this.page.locator(selector);
				await expect(element).toBeVisible({ timeout });
				await element.scrollIntoViewIfNeeded();
				await element.click({ force, timeout });
				return;
			} catch (error) {
				lastError = error as Error;
				if (i < maxRetries - 1) {
					await this.page.waitForTimeout(1000); // Wait 1 second before retry
				}
			}
		}
		
		throw lastError || new Error(`Failed to click element ${selector} after ${maxRetries} retries`);
	}

	/**
	 * Verify page title contains expected text
	 */
	async verifyPageTitle(expectedTitle: string | RegExp): Promise<void> {
		await expect(this.page).toHaveTitle(expectedTitle);
	}

	/**
	 * Verify URL matches expected pattern
	 */
	async verifyCurrentUrl(expectedUrl: string | RegExp): Promise<void> {
		await expect(this.page).toHaveURL(expectedUrl);
	}

	/**
	 * Take screenshot with timestamp
	 */
	async takeTimestampedScreenshot(name: string): Promise<void> {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		await this.page.screenshot({
			path: `${this.config.screenshots.directory}/${name}-${timestamp}.png`,
			fullPage: true
		});
	}

	/**
	 * Wait for specific network response
	 */
	async waitForNetworkResponse(urlPattern: string | RegExp, timeout?: number): Promise<void> {
		const actualTimeout = timeout || this.config.timeout;
		await this.page.waitForResponse(urlPattern, { timeout: actualTimeout });
	}

	/**
	 * Verify element count
	 */
	async verifyElementCount(selector: string, expectedCount: number): Promise<void> {
		await expect(this.page.locator(selector)).toHaveCount(expectedCount);
	}

	/**
	 * Verify element contains text
	 */
	async verifyElementContainsText(selector: string, expectedText: string | RegExp): Promise<void> {
		await expect(this.page.locator(selector)).toContainText(expectedText);
	}

	/**
	 * Verify element has attribute with value
	 */
	async verifyElementAttribute(selector: string, attribute: string, expectedValue: string | RegExp): Promise<void> {
		await expect(this.page.locator(selector)).toHaveAttribute(attribute, expectedValue);
	}

	/**
	 * Fill form field with validation
	 */
	async fillFormField(selector: string, value: string, options?: {
		clear?: boolean;
		validate?: boolean;
		timeout?: number;
	}): Promise<void> {
		const timeout = options?.timeout || this.config.timeout;
		const clear = options?.clear !== false;
		const validate = options?.validate !== false;
		
		const element = this.page.locator(selector);
		await expect(element).toBeVisible({ timeout });
		
		if (clear) {
			await element.clear();
		}
		
		await element.fill(value);
		
		if (validate) {
			const actualValue = await element.inputValue();
			if (actualValue !== value) {
				throw new Error(`Form field validation failed. Expected: "${value}", Actual: "${actualValue}"`);
			}
		}
	}

	/**
	 * Wait for multiple elements and return the first visible one
	 */
	async waitForAnyElement(selectors: string[], timeout?: number): Promise<string> {
		const actualTimeout = timeout || this.config.timeout;
		
		for (const selector of selectors) {
			try {
				await expect(this.page.locator(selector)).toBeVisible({ timeout: actualTimeout / selectors.length });
				return selector;
			} catch {
				// Continue to next selector
			}
		}
		
		throw new Error(`None of the elements were found: ${selectors.join(', ')}`);
	}

	/**
	 * Verify page is ready (combines multiple checks)
	 */
	async verifyPageReady(options?: {
		checkTitle?: boolean;
		checkUrl?: RegExp;
		checkElement?: string;
		timeout?: number;
	}): Promise<void> {
		const timeout = options?.timeout || this.config.timeout;
		
		// Wait for basic page load
		await this.page.waitForLoadState('domcontentloaded', { timeout });
		
		// Check title if specified
		if (options?.checkTitle) {
			const title = await this.page.title();
			if (!title || title.length === 0) {
				throw new Error('Page title is empty or missing');
			}
		}
		
		// Check URL if specified
		if (options?.checkUrl) {
			await expect(this.page).toHaveURL(options.checkUrl, { timeout });
		}
		
		// Check for specific element if specified
		if (options?.checkElement) {
			await expect(this.page.locator(options.checkElement)).toBeVisible({ timeout });
		}
	}

	/**
	 * Enhanced error context capture
	 */
	async captureErrorContext(errorName: string): Promise<ErrorContext> {
		const timestamp = new Date().toISOString();
		
		try {
			const context: ErrorContext = {
				timestamp,
				url: this.page.url(),
				title: await this.page.title().catch(() => 'Unable to get title'),
				viewport: this.page.viewportSize(),
				userAgent: await this.page.evaluate(() => navigator.userAgent).catch(() => 'Unknown'),
				screenshotPath: '',
				consoleLogs: [], // Could be enhanced to capture console logs
				networkRequests: [] // Could be enhanced to capture network activity
			};
			
			// Take screenshot if enabled
			if (this.config.screenshots.enabled) {
				const screenshotPath = `${this.config.screenshots.directory}/${errorName}-${timestamp.replace(/[:.]/g, '-')}.png`;
				await this.page.screenshot({ path: screenshotPath, fullPage: true });
				context.screenshotPath = screenshotPath;
			}
			
			return context;
		} catch (error) {
			console.error('Failed to capture error context:', error);
			return {
				timestamp,
				url: 'unknown',
				title: 'unknown',
				viewport: null,
				userAgent: 'unknown',
				screenshotPath: '',
				consoleLogs: [],
				networkRequests: []
			};
		}
	}
}

/**
 * Error context interface for enhanced debugging
 */
export interface ErrorContext {
	timestamp: string;
	url: string;
	title: string;
	viewport: { width: number; height: number } | null;
	userAgent: string;
	screenshotPath: string;
	consoleLogs: string[];
	networkRequests: string[];
}