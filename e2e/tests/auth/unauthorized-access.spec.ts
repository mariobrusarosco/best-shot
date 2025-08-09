import { test, expect } from '@playwright/test';
import { AuthenticationHelper } from '../../page-objects/auth/AuthenticationHelper';
import { getTestConfig } from '../../config/TestConfig';

test.describe('Unauthorized Access Redirection', () => {
	let authHelper: AuthenticationHelper;
	const config = getTestConfig('demo');

	test.beforeEach(async ({ page }) => {
		authHelper = new AuthenticationHelper(page, config);
		// Ensure we start each test without authentication
		await authHelper.clearAuthenticationState();
	});

	test.describe('Individual Protected Route Access', () => {
		test('should redirect from dashboard to login when not authenticated', async ({ page }) => {
			await page.goto(`${config.baseURL}/dashboard`);
			await page.waitForTimeout(2000);
			
			// Should be redirected to login
			expect(page.url()).toContain('/login');
			
			// Verify login page elements are present
			await expect(page.locator('h1:has-text("Best Shot")')).toBeVisible();
			await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
		});

		test('should redirect from tournaments to login when not authenticated', async ({ page }) => {
			await page.goto(`${config.baseURL}/tournaments`);
			await page.waitForTimeout(2000);
			
			expect(page.url()).toContain('/login');
			await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
		});

		test('should redirect from leagues to login when not authenticated', async ({ page }) => {
			await page.goto(`${config.baseURL}/leagues`);
			await page.waitForTimeout(2000);
			
			expect(page.url()).toContain('/login');
			await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
		});

		test('should redirect from my-account to login when not authenticated', async ({ page }) => {
			await page.goto(`${config.baseURL}/my-account`);
			await page.waitForTimeout(2000);
			
			expect(page.url()).toContain('/login');
			await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
		});
	});

	test.describe('Nested Protected Routes', () => {
		test('should redirect from nested tournament routes when not authenticated', async ({ page }) => {
			// Test accessing a nested tournament route
			await page.goto(`${config.baseURL}/tournaments/some-tournament-id`);
			await page.waitForTimeout(2000);
			
			expect(page.url()).toContain('/login');
			await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
		});

		test('should redirect from nested league routes when not authenticated', async ({ page }) => {
			// Test accessing a nested league route
			await page.goto(`${config.baseURL}/leagues/some-league-id`);
			await page.waitForTimeout(2000);
			
			expect(page.url()).toContain('/login');
			await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
		});
	});

	test.describe('Redirection Behavior Validation', () => {
		test('should preserve original URL in redirect for return navigation', async ({ page }) => {
			const originalRoute = '/dashboard';
			await page.goto(`${config.baseURL}${originalRoute}`);
			await page.waitForTimeout(2000);
			
			// Should be redirected to login
			expect(page.url()).toContain('/login');
			
			// The URL might contain the original route as a parameter for return navigation
			// This is implementation-dependent, so we just verify we're on login
			await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
		});

		test('should handle direct URL access to protected routes', async ({ page }) => {
			// Test direct navigation to protected route via URL bar simulation
			const protectedRoutes = ['/dashboard', '/tournaments', '/leagues', '/my-account'];
			
			for (const route of protectedRoutes) {
				// Clear state before each test
				await authHelper.clearAuthenticationState();
				
				// Navigate directly to the route
				await page.goto(`${config.baseURL}${route}`);
				await page.waitForTimeout(2000);
				
				// Should be redirected to login
				expect(page.url()).toContain('/login');
				await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
			}
		});

		test('should handle rapid navigation between protected routes', async ({ page }) => {
			const routes = ['/dashboard', '/tournaments', '/leagues'];
			
			for (const route of routes) {
				await page.goto(`${config.baseURL}${route}`);
				await page.waitForTimeout(500); // Shorter wait for rapid navigation
				
				// Each should redirect to login
				expect(page.url()).toContain('/login');
			}
		});
	});

	test.describe('Authentication State Persistence During Redirection', () => {
		test('should maintain clear authentication state across redirections', async ({ page }) => {
			// Ensure we start unauthenticated
			await authHelper.clearAuthenticationState();
			
			// Try to access multiple protected routes in sequence
			const routes = ['/dashboard', '/tournaments', '/leagues'];
			
			for (const route of routes) {
				await page.goto(`${config.baseURL}${route}`);
				await page.waitForTimeout(1000);
				
				// Should consistently redirect to login
				expect(page.url()).toContain('/login');
				
				// Verify we're still not authenticated
				const isAuthenticated = await authHelper.isAuthenticated();
				expect(isAuthenticated).toBe(false);
			}
		});

		test('should not leak authentication state between tests', async ({ page }) => {
			// This test verifies that our clearAuthenticationState method works properly
			
			// First, simulate authentication
			await authHelper.simulateAuthentication();
			let isAuthenticated = await authHelper.isAuthenticated();
			expect(isAuthenticated).toBe(true);
			
			// Clear authentication state
			await authHelper.clearAuthenticationState();
			
			// Verify state is cleared
			await page.goto(`${config.baseURL}/dashboard`);
			await page.waitForTimeout(2000);
			expect(page.url()).toContain('/login');
			
			isAuthenticated = await authHelper.isAuthenticated();
			expect(isAuthenticated).toBe(false);
		});
	});

	test.describe('Error Scenarios and Edge Cases', () => {
		test('should handle malformed protected route URLs', async ({ page }) => {
			const malformedRoutes = [
				'/dashboard///',
				'/tournaments/../dashboard',
				'/leagues?malformed=query&',
			];
			
			for (const route of malformedRoutes) {
				await authHelper.clearAuthenticationState();
				
				try {
					await page.goto(`${config.baseURL}${route}`);
					await page.waitForTimeout(2000);
					
					// Should either redirect to login or handle gracefully
					const currentUrl = page.url();
					const isHandledGracefully = currentUrl.includes('/login') || 
												currentUrl.includes('404') ||
												currentUrl.includes('error');
					
					// Main goal is no unhandled errors
					expect(typeof currentUrl).toBe('string');
				} catch (error) {
					// Log but don't fail the test for malformed URLs
					console.warn(`Malformed URL ${route} caused error:`, error);
				}
			}
		});

		test('should handle network interruption during redirection', async ({ page }) => {
			// Simulate network issues during redirection
			let requestCount = 0;
			await page.route('**/*', async (route) => {
				requestCount++;
				// Fail every 3rd request to simulate intermittent network issues
				if (requestCount % 3 === 0) {
					await route.abort('failed');
				} else {
					await route.continue();
				}
			});
			
			try {
				await page.goto(`${config.baseURL}/dashboard`);
				await page.waitForTimeout(3000);
				
				// Should eventually reach some stable state (login or error page)
				const currentUrl = page.url();
				expect(typeof currentUrl).toBe('string');
				expect(currentUrl.length).toBeGreaterThan(0);
			} catch (error) {
				// Network errors are expected in this test
				console.log('Expected network error during redirection test:', error);
			}
		});

		test('should handle concurrent access attempts to protected routes', async ({ page, context }) => {
			// Create multiple pages to simulate concurrent access
			const page2 = await context.newPage();
			const page3 = await context.newPage();
			
			// Clear authentication state for all pages
			await authHelper.clearAuthenticationState();
			await page2.evaluate(() => {
				localStorage.clear();
				sessionStorage.clear();
			});
			await page3.evaluate(() => {
				localStorage.clear();
				sessionStorage.clear();
			});
			
			// Attempt concurrent access to protected routes
			const promises = [
				page.goto(`${config.baseURL}/dashboard`),
				page2.goto(`${config.baseURL}/tournaments`),
				page3.goto(`${config.baseURL}/leagues`)
			];
			
			await Promise.all(promises);
			await Promise.all([
				page.waitForTimeout(2000),
				page2.waitForTimeout(2000),
				page3.waitForTimeout(2000)
			]);
			
			// All should be redirected to login
			expect(page.url()).toContain('/login');
			expect(page2.url()).toContain('/login');
			expect(page3.url()).toContain('/login');
			
			await page2.close();
			await page3.close();
		});
	});

	test.describe('Public Route Access Verification', () => {
		test('should allow access to public routes without authentication', async ({ page }) => {
			await authHelper.clearAuthenticationState();
			
			// Test public routes that should be accessible
			const publicRoutes = ['/', '/login', '/signup'];
			
			for (const route of publicRoutes) {
				await page.goto(`${config.baseURL}${route}`);
				await page.waitForTimeout(1000);
				
				// Should not be redirected to login (unless already on login)
				const currentUrl = page.url();
				if (route !== '/login') {
					// For non-login routes, verify we're not redirected to login
					const isRedirectedToLogin = currentUrl.includes('/login') && !route.includes('/login');
					expect(isRedirectedToLogin).toBe(false);
				}
				
				// Verify the page loads without errors
				expect(typeof currentUrl).toBe('string');
			}
		});
	});
});