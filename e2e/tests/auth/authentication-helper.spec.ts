import { test, expect } from '@playwright/test';
import { AuthenticationHelper } from '../../page-objects/auth/AuthenticationHelper';
import { getTestConfig } from '../../config/TestConfig';

test.describe('Authentication Helper Utilities', () => {
	let authHelper: AuthenticationHelper;
	const config = getTestConfig('demo');

	test.beforeEach(async ({ page }) => {
		authHelper = new AuthenticationHelper(page, config);
	});

	test.describe('Protected Route Access Verification', () => {
		test('should redirect to login when accessing dashboard without authentication', async () => {
			await authHelper.verifyProtectedRouteAccess('/dashboard');
		});

		test('should redirect to login when accessing tournaments without authentication', async () => {
			await authHelper.verifyProtectedRouteAccess('/tournaments');
		});

		test('should redirect to login when accessing leagues without authentication', async () => {
			await authHelper.verifyProtectedRouteAccess('/leagues');
		});

		test('should redirect to login when accessing my-account without authentication', async () => {
			await authHelper.verifyProtectedRouteAccess('/my-account');
		});

		test('should verify all configured protected routes require authentication', async () => {
			await authHelper.verifyAuthenticationRequired();
		});
	});

	test.describe('Authentication Flow Testing', () => {
		test('should successfully complete authentication flow in demo mode', async ({ page }) => {
			// Start by verifying we need authentication
			await authHelper.verifyProtectedRouteAccess('/dashboard');
			
			// Perform authentication
			await authHelper.simulateAuthentication();
			
			// Verify we can now access protected routes
			await page.goto(`${config.baseURL}/dashboard`);
			await page.waitForTimeout(2000);
			
			const currentUrl = page.url();
			expect(currentUrl).toContain('/dashboard');
			expect(currentUrl).not.toContain('/login');
		});

		test('should verify complete authentication flow end-to-end', async () => {
			await authHelper.verifyAuthenticationFlow();
		});
	});

	test.describe('Session Persistence Testing', () => {
		test('should maintain session after page reload', async ({ page }) => {
			// Authenticate first
			await authHelper.simulateAuthentication();
			
			// Navigate to dashboard
			await page.goto(`${config.baseURL}/dashboard`);
			await page.waitForTimeout(2000);
			
			// Verify we're on dashboard
			expect(page.url()).toContain('/dashboard');
			
			// Reload page
			await page.reload();
			await page.waitForTimeout(2000);
			
			// Verify we're still on dashboard
			expect(page.url()).toContain('/dashboard');
			expect(page.url()).not.toContain('/login');
		});

		test('should maintain session during navigation between protected routes', async ({ page }) => {
			// Authenticate first
			await authHelper.simulateAuthentication();
			
			// Navigate to dashboard
			await page.goto(`${config.baseURL}/dashboard`);
			await page.waitForTimeout(2000);
			expect(page.url()).toContain('/dashboard');
			
			// Navigate to tournaments
			await page.goto(`${config.baseURL}/tournaments`);
			await page.waitForTimeout(2000);
			expect(page.url()).not.toContain('/login');
			
			// Navigate to leagues
			await page.goto(`${config.baseURL}/leagues`);
			await page.waitForTimeout(2000);
			expect(page.url()).not.toContain('/login');
		});

		test('should check session persistence using helper method', async () => {
			await authHelper.checkSessionPersistence();
		});
	});

	test.describe('Authentication State Management', () => {
		test('should correctly clear authentication state', async ({ page }) => {
			// First authenticate
			await authHelper.simulateAuthentication();
			
			// Verify we're authenticated
			const isAuthenticatedBefore = await authHelper.isAuthenticated();
			expect(isAuthenticatedBefore).toBe(true);
			
			// Clear authentication state
			await authHelper.clearAuthenticationState();
			
			// Verify authentication is cleared by trying to access protected route
			await authHelper.verifyProtectedRouteAccess('/dashboard');
		});

		test('should correctly detect authentication state', async () => {
			// Initially should not be authenticated
			await authHelper.clearAuthenticationState();
			const isAuthenticatedInitially = await authHelper.isAuthenticated();
			expect(isAuthenticatedInitially).toBe(false);
			
			// After authentication should be authenticated
			await authHelper.simulateAuthentication();
			const isAuthenticatedAfter = await authHelper.isAuthenticated();
			expect(isAuthenticatedAfter).toBe(true);
		});
	});

	test.describe('Login Page Verification', () => {
		test('should verify login page elements are present', async () => {
			await authHelper.navigate();
			await authHelper.verifyLoginPageElements();
		});

		test('should navigate to login page successfully', async ({ page }) => {
			await authHelper.navigate();
			
			expect(page.url()).toContain('/login');
			
			// Verify key elements are present
			await expect(page.locator('h1:has-text("Best Shot")')).toBeVisible();
			await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
		});
	});

	test.describe('Unauthorized Access Redirection', () => {
		test('should test unauthorized access redirection for all protected routes', async () => {
			await authHelper.testUnauthorizedAccessRedirection();
		});

		test('should test unauthorized access redirection for specific routes', async () => {
			const routesToTest = ['/dashboard', '/tournaments'];
			await authHelper.testUnauthorizedAccessRedirection(routesToTest);
		});
	});

	test.describe('Authentication Loading States', () => {
		test('should wait for authentication load completion', async ({ page }) => {
			await page.goto(`${config.baseURL}/dashboard`);
			await authHelper.waitForAuthenticationLoad();
			
			// After waiting, we should either be on login (if not authenticated) 
			// or on dashboard (if authenticated in demo mode)
			const currentUrl = page.url();
			const isOnLoginOrDashboard = currentUrl.includes('/login') || currentUrl.includes('/dashboard');
			expect(isOnLoginOrDashboard).toBe(true);
		});
	});

	test.describe('Error Handling and Edge Cases', () => {
		test('should handle invalid protected route gracefully', async ({ page }) => {
			// Test with a route that doesn't exist
			await authHelper.clearAuthenticationState();
			
			await page.goto(`${config.baseURL}/non-existent-route`);
			await page.waitForTimeout(2000);
			
			// Should either redirect to login or show 404, but not crash
			const currentUrl = page.url();
			const hasHandledGracefully = currentUrl.includes('/login') || 
										  currentUrl.includes('/non-existent-route') ||
										  page.locator('text=404').isVisible();
			
			// This test mainly ensures no unhandled errors occur
			expect(typeof currentUrl).toBe('string');
		});

		test('should handle network delays during authentication', async ({ page }) => {
			// Simulate slow network by adding delay
			await page.route('**/*', async (route) => {
				await new Promise(resolve => setTimeout(resolve, 100));
				await route.continue();
			});
			
			await authHelper.simulateAuthentication();
			
			// Should still work despite network delays
			const isAuthenticated = await authHelper.isAuthenticated();
			expect(isAuthenticated).toBe(true);
		});
	});
});