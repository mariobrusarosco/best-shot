import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { TestConfig } from '../../config/TestConfig';

/**
 * Authentication helper class for testing demo authentication flows and protected route functionality
 * Focuses on verifying that the bypass authentication system works correctly and protected routes load properly
 */
export class AuthenticationHelper extends BasePage {
	private readonly loginUrl: string;
	private readonly dashboardUrl: string;

	constructor(page: Page, config: TestConfig) {
		super(page, config);
		this.loginUrl = `${this.baseURL}/login`;
		this.dashboardUrl = `${this.baseURL}/dashboard`;
	}

	/**
	 * Navigate to the login page
	 */
	async navigate(): Promise<void> {
		try {
			await this.page.goto(this.loginUrl);
			await this.waitForLoad();
		} catch (error) {
			await this.handleError(error as Error, 'navigating-to-login');
		}
	}

	/**
	 * Wait for the login page to fully load
	 */
	async waitForLoad(): Promise<void> {
		try {
			await this.waitForPageReady();
			// Wait for the login button to be visible as an indicator the page is ready
			await this.waitForElement('button:has-text("LOGIN")', { timeout: 15000 });
		} catch (error) {
			await this.handleError(error as Error, 'waiting-for-login-page-load');
		}
	}

	/**
	 * Verify that a protected route loads correctly with bypass authentication
	 * In demo mode, this tests that protected routes are accessible and load properly
	 * 
	 * @param protectedRoute - The protected route to test (e.g., '/dashboard', '/tournaments')
	 */
	async verifyProtectedRouteAccess(protectedRoute: string): Promise<void> {
		try {
			const fullUrl = `${this.baseURL}${protectedRoute}`;
			
			// Navigate to the protected route
			await this.page.goto(fullUrl);
			
			// Wait for the page to load and authentication to initialize
			await this.waitForAuthenticationLoad();
			
			// In demo mode, we should be able to access protected routes
			// Verify we're not stuck on a loading screen or error page
			const currentUrl = this.getCurrentUrl();
			
			// Check that we successfully loaded the route (not redirected to login or error)
			if (currentUrl.includes('/login')) {
				throw new Error(
					`Protected route ${protectedRoute} redirected to login unexpectedly in demo mode. ` +
					`Current URL: ${currentUrl}`
				);
			}
			
			// Verify the page loaded successfully by checking for common layout elements
			await this.verifyProtectedPageLayout();
			
		} catch (error) {
			await this.handleError(error as Error, `verifying-protected-route-${protectedRoute}`);
		}
	}

	/**
	 * Verify that all protected routes are accessible in demo mode
	 */
	async verifyProtectedRoutesAccessible(): Promise<void> {
		try {
			// Test each protected route defined in the configuration
			for (const route of this.config.auth.protectedRoutes) {
				await this.verifyProtectedRouteAccess(route);
				
				// Small delay between tests to avoid overwhelming the server
				await this.page.waitForTimeout(500);
			}
		} catch (error) {
			await this.handleError(error as Error, 'verifying-protected-routes-accessible');
		}
	}

	/**
	 * Check that bypass authentication persists across page reloads and navigation
	 * In demo mode, this verifies the bypass auth system maintains state correctly
	 */
	async checkSessionPersistence(): Promise<void> {
		try {
			// Navigate to dashboard to establish session
			await this.page.goto(this.dashboardUrl);
			await this.waitForAuthenticationLoad();
			
			// Verify we can access the dashboard
			const currentUrl = this.getCurrentUrl();
			if (currentUrl.includes('/login')) {
				throw new Error(`Could not access dashboard in demo mode. Current URL: ${currentUrl}`);
			}
			
			// Test persistence by reloading the page
			await this.page.reload();
			await this.waitForAuthenticationLoad();
			
			// Verify we're still on the dashboard after reload
			const urlAfterReload = this.getCurrentUrl();
			if (urlAfterReload.includes('/login')) {
				throw new Error(`Bypass authentication not persisted after page reload. Current URL: ${urlAfterReload}`);
			}
			
			// Test persistence by navigating to another protected route
			const tournamentUrl = `${this.baseURL}/tournaments`;
			await this.page.goto(tournamentUrl);
			await this.waitForAuthenticationLoad();
			
			// Verify we can access the tournaments page
			const urlAfterNavigation = this.getCurrentUrl();
			if (urlAfterNavigation.includes('/login')) {
				throw new Error(`Bypass authentication not persisted during navigation. Current URL: ${urlAfterNavigation}`);
			}
			
		} catch (error) {
			await this.handleError(error as Error, 'checking-session-persistence');
		}
	}

	/**
	 * Test the demo login flow
	 * In demo mode, this tests the login button functionality and demo message
	 */
	async testDemoLoginFlow(): Promise<void> {
		try {
			// Navigate to login page
			await this.navigate();
			
			// Set up dialog handler for demo message
			this.page.on('dialog', async dialog => {
				if (dialog.message().includes('[DEMO MESSAGE]')) {
					await dialog.accept();
				}
			});
			
			// Click the login button (in demo mode, this shows demo message and navigates)
			await this.clickElement('button:has-text("LOGIN")');
			
			// Wait for potential navigation to dashboard
			await this.page.waitForTimeout(3000);
			
			// Verify we were navigated to dashboard
			const currentUrl = this.getCurrentUrl();
			if (!currentUrl.includes('/dashboard')) {
				throw new Error(`Demo login flow did not navigate to dashboard. Current URL: ${currentUrl}`);
			}
			
		} catch (error) {
			await this.handleError(error as Error, 'testing-demo-login-flow');
		}
	}

	/**
	 * Reset demo authentication state by clearing storage
	 * Useful for testing the initial state of the bypass authentication
	 */
	async resetDemoAuthState(): Promise<void> {
		try {
			// Clear local storage (where demo auth state is stored)
			await this.page.evaluate(() => {
				localStorage.clear();
				sessionStorage.clear();
			});
			
			// Clear cookies
			await this.page.context().clearCookies();
			
			// Small delay to ensure state is cleared
			await this.page.waitForTimeout(500);
			
		} catch (error) {
			await this.handleError(error as Error, 'resetting-demo-auth-state');
		}
	}

	/**
	 * Verify that the login page elements are present and functional
	 */
	async verifyLoginPageElements(): Promise<void> {
		try {
			// Verify page title/heading
			await this.waitForElement('h1:has-text("Best Shot")', { timeout: 10000 });
			
			// Verify login button is present
			const loginButton = await this.waitForElement('button:has-text("LOGIN")', { timeout: 10000 });
			expect(await loginButton.isVisible()).toBe(true);
			
			// Verify register link is present
			const registerLink = await this.waitForElement('a[href="/signup"]', { timeout: 10000 });
			expect(await registerLink.isVisible()).toBe(true);
			
			// Verify "New to Best Shot?" text is present
			await this.waitForElement('text=New to Best Shot?', { timeout: 10000 });
			
		} catch (error) {
			await this.handleError(error as Error, 'verifying-login-page-elements');
		}
	}

	/**
	 * Test that all protected routes load correctly in demo mode
	 * Verifies that the bypass authentication allows access to all protected routes
	 * 
	 * @param routes - Array of protected routes to test (optional, defaults to config routes)
	 */
	async testProtectedRoutesLoad(routes?: string[]): Promise<void> {
		try {
			const routesToTest = routes || this.config.auth.protectedRoutes;
			
			for (const route of routesToTest) {
				// Test the route loads correctly
				await this.verifyProtectedRouteAccess(route);
				
				console.log(`✓ Protected route ${route} loads correctly in demo mode`);
				
				// Small delay between tests
				await this.page.waitForTimeout(500);
			}
			
		} catch (error) {
			await this.handleError(error as Error, 'testing-protected-routes-load');
		}
	}

	/**
	 * Verify that the demo authentication flow works end-to-end
	 * Tests the complete flow from login page to accessing protected routes
	 */
	async verifyDemoAuthFlow(): Promise<void> {
		try {
			// Step 1: Test the demo login flow
			await this.testDemoLoginFlow();
			
			// Step 2: Verify we can access other protected routes
			const otherRoutes = ['/tournaments', '/leagues'];
			for (const route of otherRoutes) {
				await this.page.goto(`${this.baseURL}${route}`);
				await this.waitForAuthenticationLoad();
				
				const currentUrl = this.getCurrentUrl();
				if (currentUrl.includes('/login')) {
					throw new Error(`Could not access ${route} after demo login. Current URL: ${currentUrl}`);
				}
			}
			
			// Step 3: Verify session persistence
			await this.checkSessionPersistence();
			
			console.log('✓ Complete demo authentication flow verified successfully');
			
		} catch (error) {
			await this.handleError(error as Error, 'verifying-demo-auth-flow');
		}
	}

	/**
	 * Check if bypass authentication is working by testing dashboard access
	 * @returns Promise<boolean> - true if can access protected routes, false otherwise
	 */
	async isDemoAuthWorking(): Promise<boolean> {
		try {
			// Try to access the dashboard
			await this.page.goto(this.dashboardUrl);
			await this.waitForAuthenticationLoad();
			
			const currentUrl = this.getCurrentUrl();
			return currentUrl.includes('/dashboard') && !currentUrl.includes('/login');
			
		} catch (error) {
			await this.handleError(error as Error, 'checking-demo-auth-state');
			return false;
		}
	}

	/**
	 * Verify that a protected page has loaded correctly by checking for common layout elements
	 */
	private async verifyProtectedPageLayout(): Promise<void> {
		try {
			// Wait for the main navigation menu to be present (common across all protected pages)
			await this.waitForElement('menu', { timeout: 10000 });
			
			// Verify the page has a screen heading (common pattern in the app)
			const hasScreenHeading = await this.isElementVisible('[data-ui="screen-heading"]', 5000);
			if (!hasScreenHeading) {
				// Some pages might not have screen-heading, so check for other common elements
				const hasMainContent = await this.isElementVisible('main', 5000);
				if (!hasMainContent) {
					throw new Error('Protected page does not have expected layout elements');
				}
			}
		} catch (error) {
			await this.handleError(error as Error, 'verifying-protected-page-layout');
		}
	}

	/**
	 * Wait for authentication state to be loaded
	 * Useful for waiting for the auth provider to initialize
	 */
	async waitForAuthenticationLoad(): Promise<void> {
		try {
			// In demo mode, wait for the bypass auth to initialize
			// This is indicated by either being redirected to login or staying on a protected route
			await this.page.waitForTimeout(3000);
			
			// Check if we're in a loading state by looking for common loading indicators
			const hasLoader = await this.isElementVisible('[data-testid="app-loader"]', 1000);
			if (hasLoader) {
				// Wait for loader to disappear
				await this.page.waitForSelector('[data-testid="app-loader"]', { state: 'detached', timeout: 10000 });
			}
			
		} catch (error) {
			// Don't throw error here as this is a helper method
			console.warn('Warning: Could not detect authentication load completion:', error);
		}
	}
}