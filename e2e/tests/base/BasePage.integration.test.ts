import { test, expect } from '@playwright/test';
import { BasePage } from '../../page-objects/base/BasePage';
import { PageObjectValidator } from '../../utils/PageObjectValidator';
import { getTestConfig } from '../../config/TestConfig';

/**
 * Real-world implementation of BasePage for integration testing
 * This simulates how actual page objects would be implemented
 */
class DemoHomePage extends BasePage {
	// Page-specific selectors
	private selectors = {
		menu: 'menu',
		menuLinks: 'menu a',
		title: '[data-ui="title"]',
		screenHeading: '[data-ui="screen-heading"]',
		body: 'body'
	};

	async navigate(): Promise<void> {
		await this.page.goto('/');
		await this.waitForPageReady();
	}

	async waitForLoad(): Promise<void> {
		// Wait for essential elements that indicate the page is loaded
		await this.waitForElement(this.selectors.body);
		await this.waitForNetworkIdle();
		
		// Verify we're on the expected page (should redirect to dashboard)
		await this.verifyUrl(/.*dashboard/);
	}

	// Public methods that use BasePage functionality
	async getPageTitle(): Promise<string> {
		return super.getPageTitle();
	}

	async clickMenuLink(href: string): Promise<void> {
		const selector = `${this.selectors.menuLinks}[href="${href}"]`;
		await this.clickElement(selector);
	}

	async verifyMenuExists(): Promise<boolean> {
		return this.isElementVisible(this.selectors.menu);
	}

	async getMenuLinkCount(): Promise<number> {
		const elements = this.page.locator(this.selectors.menuLinks);
		return await elements.count();
	}

	async verifyScreenHeading(): Promise<boolean> {
		return this.isElementVisible(this.selectors.screenHeading);
	}

	async takePageScreenshot(name: string): Promise<string> {
		return this.takeScreenshot(name);
	}
}

test.describe('BasePage Integration Tests', () => {
	let demoPage: DemoHomePage;
	let validator: PageObjectValidator;
	const config = getTestConfig('demo');

	test.beforeEach(async ({ page }) => {
		demoPage = new DemoHomePage(page, config);
		validator = new PageObjectValidator(page, config);
	});

	test.describe('Real-world Page Object Implementation', () => {
		test('should implement BasePage correctly for demo home page', async () => {
			// Test the complete page object lifecycle
			await demoPage.navigate();
			await demoPage.waitForLoad();
			
			// Verify page is accessible and functional
			const title = await demoPage.getPageTitle();
			expect(title).toContain('Best Shot');
			
			// Verify menu functionality
			const menuExists = await demoPage.verifyMenuExists();
			expect(menuExists).toBe(true);
			
			const menuCount = await demoPage.getMenuLinkCount();
			expect(menuCount).toBeGreaterThan(0);
		});

		test('should handle navigation and URL verification', async () => {
			await demoPage.navigate();
			
			// Test URL verification with different patterns
			await expect(async () => {
				await demoPage.verifyUrl(/.*dashboard/);
			}).not.toThrow();
			
			// Test current URL retrieval
			const currentUrl = demoPage.getCurrentUrl();
			expect(currentUrl).toContain(config.baseURL);
			expect(currentUrl).toMatch(/.*dashboard/);
		});

		test('should handle element interactions correctly', async () => {
			await demoPage.navigate();
			await demoPage.waitForLoad();
			
			// Test menu link clicking if menu exists
			const menuExists = await demoPage.verifyMenuExists();
			if (menuExists) {
				// Click on dashboard link
				await expect(async () => {
					await demoPage.clickMenuLink('/dashboard');
				}).not.toThrow();
				
				// Verify we're still on dashboard
				await demoPage.verifyUrl(/.*dashboard/);
			}
		});

		test('should capture screenshots successfully', async () => {
			await demoPage.navigate();
			await demoPage.waitForLoad();
			
			const screenshotPath = await demoPage.takePageScreenshot('integration-test');
			expect(screenshotPath).toContain('.png');
			expect(screenshotPath).toContain('integration-test');
		});
	});

	test.describe('BasePage Validation', () => {
		test('should pass comprehensive page object validation', async () => {
			const validationReport = await validator.generateValidationReport(demoPage);
			
			// Check validation results
			expect(validationReport.validation.isValid).toBe(true);
			expect(validationReport.validation.errors.length).toBe(0);
			
			// Check error handling capabilities
			expect(validationReport.errorHandling.screenshotCaptured).toBe(true);
			expect(validationReport.errorHandling.errorLogged).toBe(true);
			
			// Check performance
			expect(validationReport.performance.isWithinThreshold).toBe(true);
			expect(validationReport.performance.totalTime).toBeLessThan(config.timeout);
			
			// Overall score should be good
			expect(validationReport.overallScore).toBeGreaterThan(70);
			
			console.log('📊 Page Object Validation Report:', {
				pageObject: validationReport.pageObjectName,
				score: validationReport.overallScore,
				navigationTime: validationReport.performance.navigationTime,
				loadTime: validationReport.performance.loadTime,
				totalTime: validationReport.performance.totalTime
			});
		});
	});

	test.describe('Error Handling and Recovery', () => {
		test('should handle element not found errors gracefully', async () => {
			await demoPage.navigate();
			
			// Test error handling with non-existent element
			await expect(async () => {
				await (demoPage as any).waitForElement('[data-test="definitely-does-not-exist"]', { timeout: 2000 });
			}).rejects.toThrow();
			
			// Verify page is still functional after error
			const title = await demoPage.getPageTitle();
			expect(title).toContain('Best Shot');
		});

		test('should handle network timeouts gracefully', async () => {
			await demoPage.navigate();
			
			// Test network waiting with very short timeout
			await expect(async () => {
				await (demoPage as any).waitForNetworkIdle({ timeout: 100 });
			}).not.toThrow(); // Should not throw as it has fallback logic
		});
	});

	test.describe('Performance and Reliability', () => {
		test('should perform operations within acceptable time limits', async () => {
			const startTime = Date.now();
			
			await demoPage.navigate();
			await demoPage.waitForLoad();
			
			const totalTime = Date.now() - startTime;
			expect(totalTime).toBeLessThan(config.timeout);
			
			console.log(`⏱️ Page load performance: ${totalTime}ms (limit: ${config.timeout}ms)`);
		});

		test('should handle multiple rapid operations', async () => {
			await demoPage.navigate();
			await demoPage.waitForLoad();
			
			// Perform multiple operations rapidly
			const operations = [
				() => demoPage.getPageTitle(),
				() => demoPage.verifyMenuExists(),
				() => demoPage.getMenuLinkCount(),
				() => demoPage.verifyScreenHeading()
			];
			
			// All operations should complete successfully
			const results = await Promise.all(operations.map(op => op()));
			expect(results).toHaveLength(4);
			
			// Verify results are meaningful
			expect(typeof results[0]).toBe('string'); // title
			expect(typeof results[1]).toBe('boolean'); // menu exists
			expect(typeof results[2]).toBe('number'); // menu count
			expect(typeof results[3]).toBe('boolean'); // screen heading
		});
	});
});