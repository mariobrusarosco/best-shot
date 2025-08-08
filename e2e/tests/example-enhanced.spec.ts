import { test, expect } from '@playwright/test';
import { getTestConfig, navigationTestData } from '../config';
import { TestHelpers } from '../utils/TestHelpers';

test.describe('Enhanced E2E Structure Example', () => {
	let testHelpers: TestHelpers;
	
	test.beforeEach(async ({ page }) => {
		const config = getTestConfig('demo');
		testHelpers = new TestHelpers(page, config);
		await testHelpers.navigateToUrl('/');
	});

	test('should demonstrate enhanced configuration usage', async ({ page }) => {
		// Using centralized test data
		const { menuLinks, expectedMenuCount } = navigationTestData;
		
		// Using test helpers for common operations
		await testHelpers.verifyPageTitle(/Best Shot/);
		await testHelpers.verifyCurrentUrl(/.*dashboard/);
		
		// Verify menu structure using test data
		await testHelpers.verifyElementCount('menu a', expectedMenuCount);
		
		// Test navigation using structured data
		for (const link of menuLinks) {
			const menuLink = page.locator(`menu a[href="${link.href}"]`);
			await expect(menuLink).toBeVisible();
			
			await testHelpers.clickElementWithRetry(`menu a[href="${link.href}"]`);
			await testHelpers.verifyCurrentUrl(link.expectedUrl);
		}
	});

	test('should demonstrate error handling and screenshots', async ({ page }) => {
		// This test demonstrates the enhanced error handling
		try {
			// Attempt to find a non-existent element (will fail)
			await testHelpers.waitForElementWithTimeout('[data-test="non-existent"]', 2000);
		} catch (error) {
			// Error handling and screenshot capture is automatic via BasePage
			expect(error).toBeDefined();
		}
		
		// Take a manual screenshot for demonstration
		await testHelpers.takeTimestampedScreenshot('example-test-screenshot');
	});
});