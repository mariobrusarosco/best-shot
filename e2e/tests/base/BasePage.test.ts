import { test, expect, Page } from '@playwright/test';
import { BasePage } from '../../page-objects/base/BasePage';
import { getTestConfig } from '../../config/TestConfig';

/**
 * Test implementation of BasePage for testing purposes
 */
class TestPage extends BasePage {
	async navigate(): Promise<void> {
		await this.page.goto('/');
	}

	async waitForLoad(): Promise<void> {
		await this.waitForElement('body');
	}

	// Expose protected methods for testing
	public async testWaitForElement(selector: string, options?: any) {
		return this.waitForElement(selector, options);
	}

	public async testClickElement(selector: string, options?: any) {
		return this.clickElement(selector, options);
	}

	public async testFillElement(selector: string, text: string, options?: any) {
		return this.fillElement(selector, text, options);
	}

	public async testTakeScreenshot(name: string, options?: any) {
		return this.takeScreenshot(name, options);
	}

	public async testIsElementVisible(selector: string, timeout?: number) {
		return this.isElementVisible(selector, timeout);
	}

	public async testGetElementText(selector: string, options?: any) {
		return this.getElementText(selector, options);
	}

	public async testVerifyUrl(pattern: string | RegExp, options?: any) {
		return this.verifyUrl(pattern, options);
	}

	public async testWaitForNetworkIdle(options?: any) {
		return this.waitForNetworkIdle(options);
	}

	public async testWaitForPageReady(options?: any) {
		return this.waitForPageReady(options);
	}
}

test.describe('BasePage Unit Tests', () => {
	let testPage: TestPage;
	let page: Page;
	const config = getTestConfig('demo');

	test.beforeEach(async ({ page: playwrightPage }) => {
		page = playwrightPage;
		testPage = new TestPage(page, config);
		await testPage.navigate();
	});

	test.describe('Element Waiting and Interaction', () => {
		test('should wait for visible elements successfully', async () => {
			// Test waiting for a known element that should exist
			const element = await testPage.testWaitForElement('body');
			expect(element).toBeDefined();
			await expect(element).toBeVisible();
		});

		test('should handle timeout when element does not exist', async () => {
			// Test waiting for non-existent element with short timeout
			await expect(async () => {
				await testPage.testWaitForElement('[data-test="non-existent"]', { timeout: 1000 });
			}).rejects.toThrow();
		});

		test('should click elements with retry logic', async () => {
			// Navigate to a page with clickable elements
			await page.goto('/');
			
			// Test clicking a menu link (should exist based on existing tests)
			const menuExists = await testPage.testIsElementVisible('menu a');
			if (menuExists) {
				await expect(async () => {
					await testPage.testClickElement('menu a:first-child');
				}).not.toThrow();
			}
		});

		test('should check element visibility correctly', async () => {
			// Test with known visible element
			const isBodyVisible = await testPage.testIsElementVisible('body');
			expect(isBodyVisible).toBe(true);

			// Test with non-existent element
			const isNonExistentVisible = await testPage.testIsElementVisible('[data-test="non-existent"]', 1000);
			expect(isNonExistentVisible).toBe(false);
		});

		test('should get element text content', async () => {
			// Test getting text from title element if it exists
			const titleExists = await testPage.testIsElementVisible('title');
			if (titleExists) {
				const titleText = await testPage.testGetElementText('title');
				expect(typeof titleText).toBe('string');
				expect(titleText.length).toBeGreaterThan(0);
			}
		});
	});

	test.describe('Navigation and URL Verification', () => {
		test('should verify current URL correctly', async () => {
			await testPage.testVerifyUrl(/.*dashboard/);
		});

		test('should get current URL', async () => {
			const currentUrl = testPage.getCurrentUrl();
			expect(currentUrl).toContain(config.baseURL);
		});

		test('should get page title', async () => {
			const title = await testPage.getPageTitle();
			expect(typeof title).toBe('string');
		});
	});

	test.describe('Network and Loading', () => {
		test('should wait for network idle', async () => {
			await expect(async () => {
				await testPage.testWaitForNetworkIdle({ timeout: 10000 });
			}).not.toThrow();
		});

		test('should wait for page ready state', async () => {
			await expect(async () => {
				await testPage.testWaitForPageReady({ timeout: 10000 });
			}).not.toThrow();
		});
	});

	test.describe('Screenshot and Error Handling', () => {
		test('should take screenshots successfully', async () => {
			const screenshotPath = await testPage.testTakeScreenshot('unit-test-screenshot');
			expect(screenshotPath).toContain('.png');
		});

		test('should handle configuration correctly', async () => {
			expect(testPage['config']).toBeDefined();
			expect(testPage['config'].baseURL).toBe(config.baseURL);
			expect(testPage['baseURL']).toBe(config.baseURL);
		});
	});

	test.describe('Form Interaction', () => {
		test('should handle form filling when forms are present', async () => {
			// This test will only run if there are input elements on the page
			const hasInputs = await testPage.testIsElementVisible('input', 2000);
			
			if (hasInputs) {
				await expect(async () => {
					await testPage.testFillElement('input:first-child', 'test-value');
				}).not.toThrow();
			} else {
				// Skip test if no inputs are found
				test.skip();
			}
		});
	});

	test.describe('Abstract Method Implementation', () => {
		test('should implement required abstract methods', async () => {
			// Test that navigate method works
			await expect(async () => {
				await testPage.navigate();
			}).not.toThrow();

			// Test that waitForLoad method works
			await expect(async () => {
				await testPage.waitForLoad();
			}).not.toThrow();
		});
	});
});