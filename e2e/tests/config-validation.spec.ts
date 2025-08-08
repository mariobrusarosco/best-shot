import { test, expect } from '@playwright/test';
import { getTestConfig, demoConfig } from '../config/TestConfig';
import { TestHelpers } from '../utils/TestHelpers';

test.describe('Configuration Validation', () => {
	test('should load demo configuration correctly', async () => {
		const config = getTestConfig('demo');
		
		expect(config.baseURL).toBe('https://best-shot-demo.mariobrusarosco.com');
		expect(config.timeout).toBe(30000);
		expect(config.retries).toBe(2);
		expect(config.browsers).toContain('chromium');
		expect(config.auth.protectedRoutes).toContain('/dashboard');
		expect(config.screenshots.enabled).toBe(true);
		expect(config.reporting.htmlReport).toBe(true);
	});

	test('should validate demo environment accessibility', async ({ page }) => {
		const config = getTestConfig('demo');
		const helpers = new TestHelpers(page, config);
		
		// Navigate to the demo environment
		await helpers.navigateToUrl('/');
		
		// Verify the page loads correctly
		await helpers.verifyPageTitle(/Best Shot/);
		
		// Verify we're redirected to dashboard (protected route behavior)
		await helpers.verifyCurrentUrl(/.*dashboard/);
		
		// Verify basic page elements are present
		const menuExists = await helpers.elementExists('menu');
		expect(menuExists).toBe(true);
	});

	test('should validate protected routes configuration', async () => {
		const config = getTestConfig('demo');
		const expectedRoutes = ['/dashboard', '/tournaments', '/leagues', '/my-account'];
		
		expect(config.auth.protectedRoutes).toEqual(expectedRoutes);
	});
});