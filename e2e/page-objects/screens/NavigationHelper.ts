import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { TestConfig } from '../../config/TestConfig';

/**
 * Navigation helper providing utilities for navigating between different application screens
 * and verifying navigation functionality
 */
export class NavigationHelper extends BasePage {
	// Menu selectors
	private readonly menu: string = 'menu';
	private readonly menuLinks: string = 'menu a';

	// Navigation routes
	private readonly routes = {
		home: '/',
		dashboard: '/dashboard',
		tournaments: '/tournaments',
		leagues: '/leagues',
		myAccount: '/my-account'
	};

	constructor(page: Page, config: TestConfig) {
		super(page, config);
	}

	/**
	 * Navigate method - not applicable for navigation helper
	 */
	async navigate(): Promise<void> {
		// Navigation helper doesn't have a specific page to navigate to
		console.warn('NavigationHelper.navigate() called - use specific navigation methods instead');
	}

	/**
	 * Wait for load method - not applicable for navigation helper
	 */
	async waitForLoad(): Promise<void> {
		// Wait for menu to be visible as indicator of page load
		await this.waitForElement(this.menu, { timeout: 15000 });
	}

	/**
	 * Get the main menu element
	 */
	getMenu(): Locator {
		return this.page.locator(this.menu);
	}

	/**
	 * Get all menu links
	 */
	getMenuLinks(): Locator {
		return this.page.locator(this.menuLinks);
	}

	/**
	 * Get a specific menu link by href
	 * @param href - The href attribute of the link
	 */
	getMenuLink(href: string): Locator {
		return this.page.locator(`menu a[href="${href}"]`);
	}

	/**
	 * Navigate to the home/dashboard page
	 */
	async navigateToHome(): Promise<void> {
		try {
			const homeLink = this.getMenuLink(this.routes.home);
			await homeLink.click();
			await this.page.waitForURL(/.*dashboard/);
			await this.waitForPageReady();
		} catch (error) {
			await this.handleError(error as Error, 'navigating-to-home');
		}
	}

	/**
	 * Navigate to the dashboard page
	 */
	async navigateToDashboard(): Promise<void> {
		try {
			const dashboardLink = this.getMenuLink(this.routes.dashboard);
			await dashboardLink.click();
			await this.page.waitForURL(/.*dashboard/);
			await this.waitForPageReady();
		} catch (error) {
			await this.handleError(error as Error, 'navigating-to-dashboard');
		}
	}

	/**
	 * Navigate to the tournaments page
	 */
	async navigateToTournaments(): Promise<void> {
		try {
			const tournamentsLink = this.getMenuLink(this.routes.tournaments);
			await tournamentsLink.click();
			await this.page.waitForURL(/.*tournaments/);
			await this.waitForPageReady();
		} catch (error) {
			await this.handleError(error as Error, 'navigating-to-tournaments');
		}
	}

	/**
	 * Navigate to the leagues page
	 */
	async navigateToLeagues(): Promise<void> {
		try {
			const leaguesLink = this.getMenuLink(this.routes.leagues);
			await leaguesLink.click();
			await this.page.waitForURL(/.*leagues/);
			await this.waitForPageReady();
		} catch (error) {
			await this.handleError(error as Error, 'navigating-to-leagues');
		}
	}

	/**
	 * Navigate to the my account page
	 */
	async navigateToMyAccount(): Promise<void> {
		try {
			const myAccountLink = this.getMenuLink(this.routes.myAccount);
			await myAccountLink.click();
			await this.page.waitForURL(/.*my-account/);
			await this.waitForPageReady();
		} catch (error) {
			await this.handleError(error as Error, 'navigating-to-my-account');
		}
	}

	/**
	 * Navigate to a specific route by URL
	 * @param route - The route to navigate to
	 */
	async navigateToRoute(route: string): Promise<void> {
		try {
			const fullUrl = `${this.baseURL}${route}`;
			await this.page.goto(fullUrl);
			await this.waitForPageReady();
		} catch (error) {
			await this.handleError(error as Error, `navigating-to-route-${route}`);
		}
	}

	/**
	 * Verify that all menu links are present and visible
	 */
	async verifyMenuLinksPresent(): Promise<void> {
		try {
			// Verify menu is visible
			await expect(this.getMenu()).toBeVisible();
			
			// Verify all expected menu links are present
			const expectedLinks = Object.values(this.routes);
			
			for (const href of expectedLinks) {
				const link = this.getMenuLink(href);
				await expect(link).toBeVisible();
			}
			
			// Verify total count of menu links
			await expect(this.getMenuLinks()).toHaveCount(5);
			
		} catch (error) {
			await this.handleError(error as Error, 'verifying-menu-links-present');
		}
	}

	/**
	 * Verify that menu links navigate to correct pages
	 */
	async verifyMenuNavigation(): Promise<void> {
		try {
			const navigationTests = [
				{ href: this.routes.home, expectedUrl: '/dashboard' },
				{ href: this.routes.dashboard, expectedUrl: '/dashboard' },
				{ href: this.routes.tournaments, expectedUrl: '/tournaments' },
				{ href: this.routes.leagues, expectedUrl: '/leagues' },
				{ href: this.routes.myAccount, expectedUrl: '/my-account' }
			];

			for (const test of navigationTests) {
				const menuLink = this.getMenuLink(test.href);
				await expect(menuLink).toBeVisible();
				
				await menuLink.click();
				await expect(this.page).toHaveURL(test.expectedUrl);
				
				// Small delay between navigation tests
				await this.page.waitForTimeout(500);
			}
		} catch (error) {
			await this.handleError(error as Error, 'verifying-menu-navigation');
		}
	}

	/**
	 * Verify that the menu contains the "Best Shot" branding
	 */
	async verifyMenuBranding(): Promise<void> {
		try {
			const menu = this.getMenu();
			await expect(menu).toContainText(/best shot/i);
		} catch (error) {
			await this.handleError(error as Error, 'verifying-menu-branding');
		}
	}

	/**
	 * Get the current active menu link (if styling indicates active state)
	 */
	async getActiveMenuLink(): Promise<Locator | null> {
		try {
			// Look for active class or aria-current attribute
			const activeLink = this.page.locator('menu a[aria-current="page"], menu a.active');
			const isVisible = await this.isElementVisible(activeLink.toString());
			
			return isVisible ? activeLink : null;
		} catch (error) {
			await this.handleError(error as Error, 'getting-active-menu-link');
			return null;
		}
	}

	/**
	 * Verify that the correct menu link is active for the current page
	 * @param expectedRoute - The route that should be active
	 */
	async verifyActiveMenuLink(expectedRoute: string): Promise<void> {
		try {
			const activeLink = await this.getActiveMenuLink();
			
			if (activeLink) {
				const href = await activeLink.getAttribute('href');
				expect(href).toBe(expectedRoute);
			} else {
				console.warn('No active menu link found - active state styling may not be implemented');
			}
		} catch (error) {
			await this.handleError(error as Error, `verifying-active-menu-link-${expectedRoute}`);
		}
	}

	/**
	 * Navigate through all main pages in sequence
	 */
	async navigateAllPages(): Promise<void> {
		try {
			// Navigate to each page and verify URL
			await this.navigateToDashboard();
			await expect(this.page).toHaveURL(/.*dashboard/);
			
			await this.navigateToTournaments();
			await expect(this.page).toHaveURL(/.*tournaments/);
			
			await this.navigateToLeagues();
			await expect(this.page).toHaveURL(/.*leagues/);
			
			await this.navigateToMyAccount();
			await expect(this.page).toHaveURL(/.*my-account/);
			
			// Return to dashboard
			await this.navigateToDashboard();
			await expect(this.page).toHaveURL(/.*dashboard/);
			
		} catch (error) {
			await this.handleError(error as Error, 'navigating-all-pages');
		}
	}

	/**
	 * Test navigation performance by measuring navigation times
	 */
	async testNavigationPerformance(): Promise<{ [key: string]: number }> {
		const performanceResults: { [key: string]: number } = {};
		
		try {
			const routes = [
				{ name: 'dashboard', method: () => this.navigateToDashboard() },
				{ name: 'tournaments', method: () => this.navigateToTournaments() },
				{ name: 'leagues', method: () => this.navigateToLeagues() },
				{ name: 'myAccount', method: () => this.navigateToMyAccount() }
			];

			for (const route of routes) {
				const startTime = Date.now();
				await route.method();
				const endTime = Date.now();
				
				performanceResults[route.name] = endTime - startTime;
			}
			
			return performanceResults;
		} catch (error) {
			await this.handleError(error as Error, 'testing-navigation-performance');
			return performanceResults;
		}
	}

	/**
	 * Verify that navigation works correctly across different viewport sizes
	 * @param viewports - Array of viewport sizes to test
	 */
	async verifyResponsiveNavigation(viewports: Array<{ width: number; height: number }>): Promise<void> {
		try {
			for (const viewport of viewports) {
				await this.page.setViewportSize(viewport);
				await this.page.waitForTimeout(500); // Allow time for responsive changes
				
				// Verify menu is still accessible
				await this.verifyMenuLinksPresent();
				
				// Test navigation still works
				await this.navigateToDashboard();
				await expect(this.page).toHaveURL(/.*dashboard/);
			}
		} catch (error) {
			await this.handleError(error as Error, 'verifying-responsive-navigation');
		}
	}

	/**
	 * Perform complete navigation verification
	 */
	async performCompleteNavigationVerification(): Promise<void> {
		try {
			// Verify menu links are present
			await this.verifyMenuLinksPresent();
			
			// Verify menu branding
			await this.verifyMenuBranding();
			
			// Verify navigation functionality
			await this.verifyMenuNavigation();
			
			// Test navigation through all pages
			await this.navigateAllPages();
			
		} catch (error) {
			await this.handleError(error as Error, 'performing-complete-navigation-verification');
		}
	}
}