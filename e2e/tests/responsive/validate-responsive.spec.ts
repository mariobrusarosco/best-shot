/**
 * Simple Responsive Validation Test
 * Basic test to validate responsive functionality is working
 */

import { test, expect } from '@playwright/test';

test.describe('Responsive Validation', () => {
	test('should validate responsive helper functionality', async ({ page }) => {
		// Import the ResponsiveTestHelper
		const { ResponsiveTestHelper, RESPONSIVE_VIEWPORTS } = await import('../../utils/ResponsiveTestHelper');
		
		const responsiveHelper = new ResponsiveTestHelper(page);
		
		// Navigate to the demo site
		await page.goto('https://best-shot-demo.mariobrusarosco.com');
		await page.waitForLoadState('networkidle');
		
		// Test basic viewport switching
		const testViewports = [
			{ name: 'desktop', width: 1280, height: 720, deviceType: 'desktop' as const, description: 'Desktop test' },
			{ name: 'mobile', width: 375, height: 667, deviceType: 'mobile' as const, description: 'Mobile test' }
		];
		
		for (const viewport of testViewports) {
			await responsiveHelper.setViewport(viewport);
			
			// Verify viewport was set
			const currentViewport = page.viewportSize();
			expect(currentViewport?.width).toBe(viewport.width);
			expect(currentViewport?.height).toBe(viewport.height);
			
			// Verify page is still accessible
			const body = page.locator('body');
			await expect(body).toBeVisible();
		}
	});

	test('should validate cross-browser configuration', async ({ browserName }) => {
		// Just verify the test runs in different browsers
		console.log(`Running in browser: ${browserName}`);
		expect(['chromium', 'firefox', 'webkit']).toContain(browserName);
	});

	test('should validate viewport configurations are available', async () => {
		const { RESPONSIVE_VIEWPORTS } = await import('../../utils/ResponsiveTestHelper');
		
		// Verify we have the expected viewport configurations
		expect(RESPONSIVE_VIEWPORTS).toBeDefined();
		expect(RESPONSIVE_VIEWPORTS.length).toBeGreaterThan(0);
		
		// Verify viewport structure
		const firstViewport = RESPONSIVE_VIEWPORTS[0];
		expect(firstViewport).toHaveProperty('name');
		expect(firstViewport).toHaveProperty('width');
		expect(firstViewport).toHaveProperty('height');
		expect(firstViewport).toHaveProperty('deviceType');
		expect(firstViewport).toHaveProperty('description');
	});
});