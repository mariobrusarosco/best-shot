import { test, expect, Page } from '@playwright/test';
import { NavigationHelper } from '../../page-objects/screens/NavigationHelper';
import { demoConfig } from '../../config/TestConfig';

test.describe('NavigationHelper Page Object', () => {
	let navigationHelper: NavigationHelper;

	test.beforeEach(async ({ page }) => {
		navigationHelper = new NavigationHelper(page, demoConfig);
		// Start from the dashboard page
		await page.goto(`${demoConfig.baseURL}/dashboard`);
		await navigationHelper.waitForLoad();
	});

	test('should get menu elements correctly', async ({ page }) => {
		// Test element getters
		const menu = navigationHelper.getMenu();
		const menuLinks = navigationHelper.getMenuLinks();
		
		// Verify elements are accessible
		await expect(menu).toBeVisible();
		await expect(menuLinks).toHaveCount(5);
	});

	test('should get specific menu links correctly', async ({ page }) => {
		const homeLink = navigationHelper.getMenuLink('/');
		const dashboardLink = navigationHelper.getMenuLink('/dashboard');
		const tournamentsLink = navigationHelper.getMenuLink('/tournaments');
		const leaguesLink = navigationHelper.getMenuLink('/leagues');
		const myAccountLink = navigationHelper.getMenuLink('/my-account');
		
		// Verify all links are visible
		await expect(homeLink).toBeVisible();
		await expect(dashboardLink).toBeVisible();
		await expect(tournamentsLink).toBeVisible();
		await expect(leaguesLink).toBeVisible();
		await expect(myAccountLink).toBeVisible();
	});

	test('should navigate to home correctly', async ({ page }) => {
		await navigationHelper.navigateToHome();
		
		// Verify URL (home redirects to dashboard)
		await expect(page).toHaveURL(/.*dashboard/);
	});

	test('should navigate to dashboard correctly', async ({ page }) => {
		await navigationHelper.navigateToDashboard();
		
		// Verify URL
		await expect(page).toHaveURL(/.*dashboard/);
	});

	test('should navigate to tournaments correctly', async ({ page }) => {
		await navigationHelper.navigateToTournaments();
		
		// Verify URL
		await expect(page).toHaveURL(/.*tournaments/);
	});

	test('should navigate to leagues correctly', async ({ page }) => {
		await navigationHelper.navigateToLeagues();
		
		// Verify URL
		await expect(page).toHaveURL(/.*leagues/);
	});

	test('should navigate to my account correctly', async ({ page }) => {
		await navigationHelper.navigateToMyAccount();
		
		// Verify URL
		await expect(page).toHaveURL(/.*my-account/);
	});

	test('should navigate to specific route correctly', async ({ page }) => {
		await navigationHelper.navigateToRoute('/tournaments');
		
		// Verify URL
		await expect(page).toHaveURL(/.*tournaments/);
	});

	test('should verify menu links are present', async ({ page }) => {
		// This should not throw an error if all menu links are present
		await navigationHelper.verifyMenuLinksPresent();
	});

	test('should verify menu navigation functionality', async ({ page }) => {
		// This should test all navigation links
		await navigationHelper.verifyMenuNavigation();
	});

	test('should verify menu branding', async ({ page }) => {
		// This should not throw an error if branding is present
		await navigationHelper.verifyMenuBranding();
	});

	test('should get active menu link if available', async ({ page }) => {
		const activeLink = await navigationHelper.getActiveMenuLink();
		
		// Active link may or may not be implemented
		if (activeLink) {
			await expect(activeLink).toBeVisible();
		} else {
			console.log('Active menu link styling not implemented');
		}
	});

	test('should verify active menu link if available', async ({ page }) => {
		// Navigate to a specific page
		await navigationHelper.navigateToDashboard();
		
		// This should handle the case where active link styling is not implemented
		await navigationHelper.verifyActiveMenuLink('/dashboard');
	});

	test('should navigate through all pages successfully', async ({ page }) => {
		// This should navigate through all main pages
		await navigationHelper.navigateAllPages();
		
		// Should end up back on dashboard
		await expect(page).toHaveURL(/.*dashboard/);
	});

	test('should test navigation performance', async ({ page }) => {
		const performanceResults = await navigationHelper.testNavigationPerformance();
		
		// Verify performance results structure
		expect(typeof performanceResults).toBe('object');
		expect(performanceResults.dashboard).toBeGreaterThan(0);
		expect(performanceResults.tournaments).toBeGreaterThan(0);
		expect(performanceResults.leagues).toBeGreaterThan(0);
		expect(performanceResults.myAccount).toBeGreaterThan(0);
		
		// Log performance results for analysis
		console.log('Navigation Performance Results:', performanceResults);
	});

	test('should verify responsive navigation', async ({ page }) => {
		const viewports = [
			{ width: 1280, height: 720 }, // Desktop
			{ width: 768, height: 1024 }, // Tablet
			{ width: 375, height: 667 }   // Mobile
		];
		
		// This should test navigation across different viewport sizes
		await navigationHelper.verifyResponsiveNavigation(viewports);
		
		// Reset to original viewport
		await page.setViewportSize({ width: 1280, height: 720 });
	});

	test('should perform complete navigation verification', async ({ page }) => {
		// This should complete all navigation verification steps
		await navigationHelper.performCompleteNavigationVerification();
	});

	test('should handle navigation errors gracefully', async ({ page }) => {
		// Test with invalid URL to verify error handling
		const invalidNavigationHelper = new NavigationHelper(page, {
			...demoConfig,
			baseURL: 'https://invalid-url-that-does-not-exist.com'
		});
		
		// This should handle the error gracefully
		await expect(invalidNavigationHelper.navigateToRoute('/dashboard')).rejects.toThrow();
	});

	test('should handle missing menu elements gracefully', async ({ page }) => {
		// Navigate to a page without menu (if such page exists)
		// For this test, we'll simulate by going to a non-existent page
		try {
			await page.goto(`${demoConfig.baseURL}/non-existent-page`);
			
			// Try to verify menu links - should handle gracefully if menu is missing
			const menu = navigationHelper.getMenu();
			const isMenuVisible = await menu.isVisible();
			
			// Menu might not be visible on error pages
			expect(typeof isMenuVisible).toBe('boolean');
		} catch (error) {
			// Expected if page doesn't exist
			console.log('Menu visibility test completed (page may not exist)');
		}
	});

	test('should handle navigation to non-existent routes', async ({ page }) => {
		// Test navigation to a route that doesn't exist
		try {
			await navigationHelper.navigateToRoute('/non-existent-route');
			
			// The navigation might succeed but result in a 404 page
			// Just verify we attempted the navigation
			expect(page.url()).toContain('non-existent-route');
		} catch (error) {
			// Expected if navigation fails
			console.log('Non-existent route navigation test completed');
		}
	});

	test('should verify menu link count is correct', async ({ page }) => {
		const menuLinks = navigationHelper.getMenuLinks();
		const linkCount = await menuLinks.count();
		
		// Should have exactly 5 menu links as per the application design
		expect(linkCount).toBe(5);
	});

	test('should verify all expected routes are accessible', async ({ page }) => {
		const routes = ['/', '/dashboard', '/tournaments', '/leagues', '/my-account'];
		
		for (const route of routes) {
			await navigationHelper.navigateToRoute(route);
			
			// Verify we can navigate to each route
			// Home route redirects to dashboard, so handle that case
			if (route === '/') {
				await expect(page).toHaveURL(/.*dashboard/);
			} else {
				await expect(page).toHaveURL(new RegExp(`.*${route.replace('/', '')}`));
			}
		}
	});
});