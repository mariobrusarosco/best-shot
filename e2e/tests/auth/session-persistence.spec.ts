import { test, expect } from '@playwright/test';
import { AuthenticationHelper } from '../../page-objects/auth/AuthenticationHelper';
import { getTestConfig } from '../../config/TestConfig';

test.describe('Session Persistence Testing', () => {
	let authHelper: AuthenticationHelper;
	const config = getTestConfig('demo');

	test.beforeEach(async ({ page }) => {
		authHelper = new AuthenticationHelper(page, config);
	});

	test.describe('Page Reload Persistence', () => {
		test('should maintain authentication after page reload on dashboard', async ({ page }) => {
			// Authenticate and navigate to dashboard
			await authHelper.simulateAuthentication();
			await page.goto(`${config.baseURL}/dashboard`);
			await page.waitForTimeout(2000);
			
			// Verify we're on dashboard
			expect(page.url()).toContain('/dashboard');
			expect(page.url()).not.toContain('/login');
			
			// Reload the page
			await page.reload();
			await page.waitForTimeout(3000); // Allow time for auth to reinitialize
			
			// Verify we'r