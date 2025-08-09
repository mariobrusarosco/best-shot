import { test, expect } from '@playwright/test';
import { BasePage } from '../../page-objects/base/BasePage';
import { getTestConfig } from '../../config/TestConfig';

/**
 * Simple test page to validate BasePage functionality
 */
class ValidationPage extends BasePage {
	async navigate(): Promise<void> {
		await this.page.goto('/');
	}

	async waitForLoad(): Promise<void> {
		await this.waitForElement('body');
		await this.waitForNetworkIdle();
	}

	// Expose some protected methods for testing
	async testElementInteraction(): Promise<boolean> {
		try {
			// Test basic element waiting
			await this.waitForElement('body', { timeout: 5000 });
			
			// Test element visibility check
			const isVisible = await this.isElementVisible('body');
			
			// Test URL verification
			await this.verifyUrl(/.*dashboard/);
			
			// Test screenshot capture
			await this.takeScreenshot('validation-test');
			
			return isVisible;
		} catch (error) {
			console.error('BasePage validation failed:', error);
			return false;
		}
	}

	async testErrorHandling(): Promise<boolean> {
		try {
			// This should trigger error handling
			await this.waitForElement('[data-test="non-existent"]', { timeout: 1000 });
			return false; // Should not reach here
		} catch (error) {
			// Error handling should have been triggered
			return error.toString().includes('Context:');
		}
	}
}

test.describe('BasePage Validation', () => {
	let validationPage: ValidationPage;
	const config = getTestConfig('demo');

	test.beforeEach(async ({ page }) => {
		validationPage = new ValidationPage(page, config);
	});

	test('should create BasePage instance with correct configuration', async () => {
		expect(validationPage).toBeDefined();
		expect(validationPage['config']).toBeDefined();
		expect(validationPage['config'].baseURL).toBe(config.baseURL);
		expect(validationPage['baseURL']).toBe(config.baseURL);
	});

	test('should implement abstract methods correctly', async () => {
		// Test navigation
		await expect(async () => {
			await validationPage.navigate();
		}).not.toThrow();

		// Test wait for load
		await expect(async () => {
			await validationPage.waitForLoad();
		}).not.toThrow();
	});

	test('should handle basic element interactions', async () => {
		await validationPage.navigate();
		await validationPage.waitForLoad();

		const interactionResult = await validationPage.testElementInteraction();
		expect(interactionResult).toBe(true);
	});

	test('should handle errors with proper context', async () => {
		await validationPage.navigate();
		await validationPage.waitForLoad();

		const errorHandlingResult = await validationPage.testErrorHandling();
		expect(errorHandlingResult).toBe(true);
	});

	test('should provide utility methods', async () => {
		await validationPage.navigate();
		await validationPage.waitForLoad();

		// Test URL retrieval
		const currentUrl = validationPage.getCurrentUrl();
		expect(currentUrl).toContain(config.baseURL);

		// Test page title retrieval
		const title = await validationPage.getPageTitle();
		expect(typeof title).toBe('string');
		expect(title.length).toBeGreaterThan(0);
	});
});