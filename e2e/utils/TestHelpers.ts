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
	 * Click element with retry logic
	 */
	async clickElementWithRetry(selector: string, maxRetries = 3): Promise<void> {
		let lastError: Error | null = null;
		
		for (let i = 0; i < maxRetries; i++) {
			try {
				const element = this.page.locator(selector);
				await expect(element).toBeVisible();
				await element.click();
				return;
			} catch (error) {
				lastError = error as Error;
				await this.page.waitForTimeout(1000); // Wait 1 second before retry
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
}