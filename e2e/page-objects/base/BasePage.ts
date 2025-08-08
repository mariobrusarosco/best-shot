import { Page, Locator, expect } from '@playwright/test';

/**
 * Base page object class providing common utilities and error handling
 * for all page objects in the E2E test suite
 */
export abstract class BasePage {
	protected page: Page;
	protected baseURL: string;

	constructor(page: Page, baseURL?: string) {
		this.page = page;
		this.baseURL = baseURL || 'https://best-shot-demo.mariobrusarosco.com';
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
	 * Wait for an element to be visible and return its locator
	 */
	protected async waitForElement(selector: string, timeout = 10000): Promise<Locator> {
		const element = this.page.locator(selector);
		await expect(element).toBeVisible({ timeout });
		return element;
	}

	/**
	 * Take a screenshot with a descriptive name
	 */
	protected async takeScreenshot(name: string): Promise<void> {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		await this.page.screenshot({
			path: `e2e/screenshots/${name}-${timestamp}.png`,
			fullPage: true
		});
	}

	/**
	 * Handle errors with context information and screenshot capture
	 */
	protected async handleError(error: Error, context?: string): Promise<void> {
		const errorContext = context || 'unknown-error';
		await this.takeScreenshot(`error-${errorContext}`);
		
		console.error(`Error in ${this.constructor.name}:`, {
			message: error.message,
			context: errorContext,
			url: this.page.url(),
			timestamp: new Date().toISOString()
		});
		
		throw error;
	}

	/**
	 * Wait for network requests to complete
	 */
	protected async waitForNetworkIdle(timeout = 5000): Promise<void> {
		await this.page.waitForLoadState('networkidle', { timeout });
	}

	/**
	 * Scroll element into view if needed
	 */
	protected async scrollIntoView(selector: string): Promise<void> {
		await this.page.locator(selector).scrollIntoViewIfNeeded();
	}

	/**
	 * Get current page URL
	 */
	protected getCurrentUrl(): string {
		return this.page.url();
	}

	/**
	 * Check if current URL matches expected pattern
	 */
	protected async verifyUrl(expectedPattern: string | RegExp): Promise<void> {
		await expect(this.page).toHaveURL(expectedPattern);
	}
}