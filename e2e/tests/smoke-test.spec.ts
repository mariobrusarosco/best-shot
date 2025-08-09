import { test, expect } from '@playwright/test';
import { getTestConfig, demoConfig } from '../config/TestConfig';
import { TestHelpers } from '../utils/TestHelpers';
import { NavigationHelper } from '../page-objects/screens/NavigationHelper';
import { DashboardPage } from '../page-objects/screens/DashboardPage';
import { navigationTestData, smokeTestScenarios } from '../fixtures/TestData';

test.describe('Smoke Tests - Basic Functionality', () => {
	let config: ReturnType<typeof getTestConfig>;
	let helpers: TestHelpers;
	let navigationHelper: NavigationHelper;
	let dashboardPage: DashboardPage;

	test.beforeEach(async ({ page }) => {
		config = getTestConfig('demo');
		helpers = new TestHelpers(page, config);
		navigationHelper = new NavigationHelper(page, config);
		dashboardPage = new DashboardPage(page, config);
	});

	test.describe('Environment Configuration Verification', () => {
		test('should verify demo environment is accessible and configured correctly', async () => {
			// Verify we're targeting the right environment
			expect(config.baseURL).toBe('https://best-shot-demo.mariobrusarosco.com');
			expect(config.timeout).toBe(30000);
			expect(config.retries).toBe(2);
			expect(config.browsers).toContain('chromium');
			expect(config.auth.protectedRoutes).toContain('/dashboard');
			expect(config.screenshots.enabled).toBe(true);
			expect(config.reporting.htmlReport).toBe(true);
		});

		test('should verify protected routes are properly configured', async () => {
			const expectedRoutes = ['/dashboard', '/tournaments', '/leagues', '/my-account'];
			expect(config.auth.protectedRoutes).toEqual(expectedRoutes);
		});
	});

	test.describe('Application Loading Tests', () => {
		test('should load application successfully and redirect to dashboard', async ({ page }) => {
			// Navigate to the demo environment root
			await helpers.navigateToUrl('/');
			
			// Verify the page loads correctly with proper title
			await helpers.verifyPageTitle(/Best Shot/);
			
			// Verify we're redirected to dashboard (protected route behavior)
			await helpers.verifyCurrentUrl(/.*dashboard/);
			
			// Verify page is fully loaded and ready
			await helpers.verifyPageReady({
				checkTitle: true,
				checkUrl: /.*dashboard/,
				checkElement: 'menu'
			});
		});

		test('should load application within acceptable time limits', async ({ page }) => {
			const startTime = Date.now();
			
			// Navigate to application
			await helpers.navigateToUrl('/');
			await helpers.verifyCurrentUrl(/.*dashboard/);
			await navigationHelper.waitForLoad();
			
			const loadTime = Date.now() - startTime;
			
			// Verify load time is reasonable (less than 10 seconds)
			expect(loadTime).toBeLessThan(10000);
			console.log(`Application loaded in ${loadTime}ms`);
		});

		test('should display core application elements after loading', async ({ page }) => {
			await helpers.navigateToUrl('/');
			
			// Verify essential UI elements are present
			const menuExists = await helpers.elementExists('menu');
			expect(menuExists).toBe(true);
			
			// Verify dashboard-specific elements are loaded
			const screenHeadingExists = await helpers.elementExists('[data-ui="screen-heading"]');
			expect(screenHeadingExists).toBe(true);
			
			// Verify main content areas are present
			const matchdayExists = await helpers.elementExists('[data-ui="matchday"]');
			const tournamentsExists = await helpers.elementExists('[data-ui="tournaments-perf"]');
			expect(matchdayExists).toBe(true);
			expect(tournamentsExists).toBe(true);
		});
	});

	test.describe('Basic Navigation Tests', () => {
		test('should have functional menu with all expected links', async ({ page }) => {
			await helpers.navigateToUrl('/');
			
			// Verify menu is present and functional
			await navigationHelper.verifyMenuLinksPresent();
			
			// Verify menu contains expected number of links
			await helpers.verifyElementCount('menu a', navigationTestData.expectedMenuCount);
			
			// Verify menu branding is present
			await navigationHelper.verifyMenuBranding();
		});

		test('should navigate successfully between main application screens', async ({ page }) => {
			await helpers.navigateToUrl('/');
			
			// Test navigation to each main screen
			const navigationTests = [
				{ name: 'Dashboard', method: () => navigationHelper.navigateToDashboard(), expectedUrl: /.*dashboard/ },
				{ name: 'Tournaments', method: () => navigationHelper.navigateToTournaments(), expectedUrl: /.*tournaments/ },
				{ name: 'Leagues', method: () => navigationHelper.navigateToLeagues(), expectedUrl: /.*leagues/ },
				{ name: 'My Account', method: () => navigationHelper.navigateToMyAccount(), expectedUrl: /.*my-account/ }
			];

			for (const navTest of navigationTests) {
				await navTest.method();
				await helpers.verifyCurrentUrl(navTest.expectedUrl);
				console.log(`✓ Successfully navigated to ${navTest.name}`);
			}
		});

		test('should maintain navigation state and return to dashboard', async ({ page }) => {
			await helpers.navigateToUrl('/');
			
			// Navigate through all pages and return to dashboard
			await navigationHelper.navigateAllPages();
			
			// Verify we end up back on dashboard
			await helpers.verifyCurrentUrl(/.*dashboard/);
			
			// Verify dashboard elements are still functional
			await dashboardPage.verifyDashboardElements();
		});
	});

	test.describe('Critical Path Validation', () => {
		test('should validate dashboard screen critical functionality', async ({ page }) => {
			await helpers.navigateToUrl('/');
			
			// Verify dashboard loads and displays user information
			await helpers.verifyElementContainsText('[data-ui="title"]', 'Hello,');
			await helpers.verifyElementContainsText('[data-ui="subtitle"]', 'mariobrusarosco');
			
			// Verify main dashboard sections are present and functional
			const matchdaySection = await helpers.elementExists('[data-ui="matchday"]');
			const tournamentsSection = await helpers.elementExists('[data-ui="tournaments-perf"]');
			
			expect(matchdaySection).toBe(true);
			expect(tournamentsSection).toBe(true);
			
			// Verify interactive elements are present
			const bestMatchesButton = await helpers.elementExists('a[href*="/tournaments/"][href*="/matches"]:has-text("best")');
			const worstMatchesButton = await helpers.elementExists('a[href*="/tournaments/"][href*="/matches"]:has-text("worst")');
			
			expect(bestMatchesButton || worstMatchesButton).toBe(true); // At least one should exist
		});

		test('should validate tournaments screen accessibility', async ({ page }) => {
			await helpers.navigateToUrl('/');
			await navigationHelper.navigateToTournaments();
			
			// Verify tournaments page loads successfully
			await helpers.verifyCurrentUrl(/.*tournaments/);
			
			// Verify page has loaded content (basic smoke test)
			await helpers.verifyPageReady({
				checkUrl: /.*tournaments/,
				timeout: 15000
			});
		});

		test('should validate leagues screen accessibility', async ({ page }) => {
			await helpers.navigateToUrl('/');
			await navigationHelper.navigateToLeagues();
			
			// Verify leagues page loads successfully
			await helpers.verifyCurrentUrl(/.*leagues/);
			
			// Verify page has loaded content (basic smoke test)
			await helpers.verifyPageReady({
				checkUrl: /.*leagues/,
				timeout: 15000
			});
		});

		test('should validate my account screen accessibility', async ({ page }) => {
			await helpers.navigateToUrl('/');
			await navigationHelper.navigateToMyAccount();
			
			// Verify my account page loads successfully
			await helpers.verifyCurrentUrl(/.*my-account/);
			
			// Verify page has loaded content (basic smoke test)
			await helpers.verifyPageReady({
				checkUrl: /.*my-account/,
				timeout: 15000
			});
		});
	});

	test.describe('Core Feature Availability', () => {
		test('should verify authentication system is active (protected routes)', async ({ page }) => {
			// Verify that accessing root redirects to dashboard (indicating auth system is working)
			await helpers.navigateToUrl('/');
			await helpers.verifyCurrentUrl(/.*dashboard/);
			
			// Verify all protected routes are accessible (user is authenticated)
			for (const route of config.auth.protectedRoutes) {
				await helpers.navigateToUrl(route);
				await helpers.verifyCurrentUrl(new RegExp(`.*${route.replace('/', '')}`));
				console.log(`✓ Protected route ${route} is accessible`);
			}
		});

		test('should verify dashboard core features are available', async ({ page }) => {
			await helpers.navigateToUrl('/');
			
			// Verify user dashboard displays personal information
			const titleText = await helpers.getElementText('[data-ui="title"]');
			const subtitleText = await helpers.getElementText('[data-ui="subtitle"]');
			
			expect(titleText).toContain('Hello,');
			expect(subtitleText).toBeTruthy();
			
			// Verify matchday section has content
			const matchdayText = await helpers.getElementText('[data-ui="matchday"]');
			expect(matchdayText.toLowerCase()).toContain('matchday');
			
			// Verify tournaments performance section has content
			const tournamentsText = await helpers.getElementText('[data-ui="tournaments-perf"]');
			expect(tournamentsText.toLowerCase()).toContain('tournaments');
		});

		test('should verify navigation system is fully functional', async ({ page }) => {
			await helpers.navigateToUrl('/');
			
			// Perform comprehensive navigation verification
			await navigationHelper.performCompleteNavigationVerification();
		});

		test('should verify application handles page refresh correctly', async ({ page }) => {
			await helpers.navigateToUrl('/');
			
			// Navigate to a specific page
			await navigationHelper.navigateToTournaments();
			await helpers.verifyCurrentUrl(/.*tournaments/);
			
			// Refresh the page
			await page.reload();
			
			// Verify page still loads correctly after refresh
			await helpers.verifyPageReady({
				checkUrl: /.*tournaments/,
				timeout: 15000
			});
			
			// Verify navigation still works after refresh
			await navigationHelper.navigateToDashboard();
			await helpers.verifyCurrentUrl(/.*dashboard/);
		});
	});

	test.describe('Demo Environment Specific Tests', () => {
		test('should verify demo environment URL is correctly configured', async ({ page }) => {
			// Verify we're testing against the correct demo environment
			await helpers.navigateToUrl('/');
			
			const currentUrl = page.url();
			expect(currentUrl).toContain('best-shot-demo.mariobrusarosco.com');
			
			console.log(`✓ Testing against demo environment: ${currentUrl}`);
		});

		test('should verify demo environment performance characteristics', async ({ page }) => {
			// Test basic navigation performance
			const startTime = Date.now();
			await navigationHelper.navigateToDashboard();
			const dashboardTime = Date.now() - startTime;
			
			// Verify navigation performance is acceptable for demo environment
			expect(dashboardTime).toBeLessThan(10000); // 10 seconds max for demo environment
			console.log(`Navigation to dashboard: ${dashboardTime}ms`);
		});

		test('should verify demo environment error handling', async ({ page }) => {
			await helpers.navigateToUrl('/');
			
			// Test that the application handles network delays gracefully
			await page.route('**/*', route => {
				setTimeout(() => route.continue(), 100);
			});
			
			// Navigate and verify it still works with simulated delay
			await navigationHelper.navigateToDashboard();
			await helpers.verifyCurrentUrl(/.*dashboard/);
			
			// Remove route handler
			await page.unroute('**/*');
		});
	});

	test.describe('Smoke Test Scenarios', () => {
		test('should execute basic application loading scenario', async ({ page }) => {
			const scenario = smokeTestScenarios.find(s => s.name === 'Basic Application Loading');
			expect(scenario).toBeDefined();
			
			// Execute the scenario steps
			await helpers.navigateToUrl('/');
			await helpers.verifyPageTitle(/Best Shot/);
			await helpers.verifyCurrentUrl(/.*dashboard/);
			
			const menuExists = await helpers.elementExists('menu');
			expect(menuExists).toBe(true);
			
			console.log(`✓ Completed scenario: ${scenario!.name}`);
		});

		test('should execute critical path navigation scenario', async ({ page }) => {
			const scenario = smokeTestScenarios.find(s => s.name === 'Critical Path Navigation');
			expect(scenario).toBeDefined();
			
			// Execute the scenario steps
			await helpers.navigateToUrl('/');
			await navigationHelper.navigateToDashboard();
			await helpers.verifyCurrentUrl(/.*dashboard/);
			
			await navigationHelper.navigateToTournaments();
			await helpers.verifyCurrentUrl(/.*tournaments/);
			
			await navigationHelper.navigateToLeagues();
			await helpers.verifyCurrentUrl(/.*leagues/);
			
			console.log(`✓ Completed scenario: ${scenario!.name}`);
		});
	});
});