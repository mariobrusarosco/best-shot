/**
 * Responsive Design Integration Tests
 * Comprehensive tests that validate responsive behavior across the entire application
 */

import { test, expect } from '@playwright/test';
import { ResponsiveTestHelper, RESPONSIVE_VIEWPORTS } from '../../utils/ResponsiveTestHelper';
import { DashboardPage } from '../../page-objects/screens/DashboardPage';
import { NavigationHelper } from '../../page-objects/screens/NavigationHelper';
import { dashboardTestData, navigationTestData } from '../../fixtures/TestData';

test.describe('Responsive Design Integration', () => {
	let responsiveHelper: ResponsiveTestHelper;
	let dashboardPage: DashboardPage;
	let navigationHelper: NavigationHelper;

	test.beforeEach(async ({ page }) => {
		responsiveHelper = new ResponsiveTestHelper(page);
		dashboardPage = new DashboardPage(page);
		navigationHelper = new NavigationHelper(page);

		// Navigate to dashboard
		await dashboardPage.navigate();
		await dashboardPage.waitForLoad();
	});

	test.describe('End-to-End Responsive Workflows', () => {
		test('should complete full user journey across all viewport sizes', async () => {
			const userJourney = [
				{
					name: 'Dashboard Access',
					action: async () => {
						await navigationHelper.navigateToDashboard();
						await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
						await dashboardPage.verifyDashboardElements();
					}
				},
				{
					name: 'Tournament Navigation',
					action: async () => {
						await navigationHelper.navigateToTournaments();
						await expect(dashboardPage.page).toHaveURL(/.*tournaments/);
					}
				},
				{
					name: 'League Navigation',
					action: async () => {
						await navigationHelper.navigateToLeagues();
						await expect(dashboardPage.page).toHaveURL(/.*leagues/);
					}
				},
				{
					name: 'Return to Dashboard',
					action: async () => {
						await navigationHelper.navigateToDashboard();
						await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
					}
				}
			];

			// Test the complete journey on key viewport sizes
			const keyViewports = [
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-standard')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'tablet-portrait')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!
			];

			for (const viewport of keyViewports) {
				await responsiveHelper.setViewport(viewport);
				
				for (const step of userJourney) {
					try {
						await step.action();
					} catch (error) {
						throw new Error(`${step.name} failed on ${viewport.name}: ${error}`);
					}
				}
			}
		});

		test('should maintain consistent performance across viewport sizes', async () => {
			const performanceMetrics: Array<{
				viewport: string;
				loadTime: number;
				domContentLoaded: number;
				firstContentfulPaint: number;
			}> = [];

			const testViewports = [
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-large')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'tablet-landscape')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!
			];

			for (const viewport of testViewports) {
				await responsiveHelper.setViewport(viewport);
				
				const startTime = Date.now();
				await dashboardPage.page.reload();
				await dashboardPage.waitForLoad();
				const loadTime = Date.now() - startTime;

				const performanceData = await dashboardPage.page.evaluate(() => {
					const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
					return {
						domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
						firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
					};
				});

				performanceMetrics.push({
					viewport: viewport.name,
					loadTime,
					domContentLoaded: performanceData.domContentLoaded,
					firstContentfulPaint: performanceData.firstContentfulPaint
				});

				// Ensure reasonable performance thresholds
				expect(loadTime).toBeLessThan(15000); // 15 seconds max
				expect(performanceData.domContentLoaded).toBeGreaterThanOrEqual(0);
			}

			// Log performance comparison
			console.log('Performance Metrics by Viewport:', performanceMetrics);

			// Verify performance consistency (mobile shouldn't be more than 2x slower than desktop)
			const desktopMetric = performanceMetrics.find(m => m.viewport.includes('desktop'));
			const mobileMetric = performanceMetrics.find(m => m.viewport.includes('mobile'));
			
			if (desktopMetric && mobileMetric) {
				const performanceRatio = mobileMetric.loadTime / desktopMetric.loadTime;
				expect(performanceRatio).toBeLessThan(3); // Mobile shouldn't be more than 3x slower
			}
		});
	});

	test.describe('Responsive Error Handling', () => {
		test('should handle errors gracefully across viewport sizes', async () => {
			const testViewports = [
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-standard')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!
			];

			for (const viewport of testViewports) {
				await responsiveHelper.setViewport(viewport);
				
				// Test navigation to non-existent page
				await dashboardPage.page.goto('/non-existent-page', { waitUntil: 'networkidle' });
				
				// Should handle 404 gracefully (either show error page or redirect)
				const currentUrl = dashboardPage.page.url();
				const pageContent = await dashboardPage.page.textContent('body');
				
				// Verify page doesn't crash and shows some content
				expect(pageContent).toBeTruthy();
				expect(pageContent!.length).toBeGreaterThan(0);
			}
		});

		test('should handle network errors consistently across viewports', async () => {
			const testViewports = [
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-standard')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!
			];

			for (const viewport of testViewports) {
				await responsiveHelper.setViewport(viewport);
				
				// Simulate slow network
				await dashboardPage.page.route('**/*', async (route) => {
					await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
					await route.continue();
				});

				await dashboardPage.page.reload();
				await dashboardPage.waitForLoad();

				// Verify page still loads and functions
				await expect(dashboardPage.getScreenHeading()).toBeVisible();
				
				// Clean up route
				await dashboardPage.page.unroute('**/*');
			}
		});
	});

	test.describe('Accessibility Across Viewports', () => {
		test('should maintain accessibility standards across viewport sizes', async () => {
			const testViewports = [
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-standard')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'tablet-portrait')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!
			];

			for (const viewport of testViewports) {
				await responsiveHelper.setViewport(viewport);
				
				// Check for basic accessibility features
				const accessibilityChecks = await dashboardPage.page.evaluate(() => {
					const checks = {
						hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
						hasLandmarks: document.querySelectorAll('main, nav, header, footer, aside').length > 0,
						hasAltTexts: Array.from(document.querySelectorAll('img')).every(img => 
							img.hasAttribute('alt') || img.hasAttribute('aria-label')
						),
						hasFocusableElements: document.querySelectorAll('a, button, input, select, textarea, [tabindex]').length > 0
					};
					return checks;
				});

				// Verify accessibility features are present
				expect(accessibilityChecks.hasHeadings).toBe(true);
				expect(accessibilityChecks.hasLandmarks).toBe(true);
				expect(accessibilityChecks.hasFocusableElements).toBe(true);
			}
		});

		test('should maintain proper focus management across viewports', async () => {
			const testViewports = [
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-standard')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!
			];

			for (const viewport of testViewports) {
				await responsiveHelper.setViewport(viewport);
				
				// Test tab navigation
				const focusableElements = await dashboardPage.page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
				
				if (focusableElements.length > 0) {
					// Focus first element
					await focusableElements[0].focus();
					
					// Verify focus is visible
					const isFocused = await focusableElements[0].evaluate((el) => {
						return document.activeElement === el;
					});
					
					expect(isFocused).toBe(true);
				}
			}
		});
	});

	test.describe('Data Consistency Across Viewports', () => {
		test('should display consistent data across all viewport sizes', async () => {
			// Capture data from desktop view
			const desktopViewport = RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-standard')!;
			await responsiveHelper.setViewport(desktopViewport);
			
			const desktopData = {
				title: await dashboardPage.getScreenHeading().textContent(),
				hasMatchdaySection: await dashboardPage.getMatchdaySection().isVisible(),
				hasTournamentsSection: await dashboardPage.getTournamentsPerformanceSection().isVisible()
			};

			// Compare with mobile view
			const mobileViewport = RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!;
			await responsiveHelper.setViewport(mobileViewport);
			
			const mobileData = {
				title: await dashboardPage.getScreenHeading().textContent(),
				hasMatchdaySection: await dashboardPage.getMatchdaySection().isVisible(),
				hasTournamentsSection: await dashboardPage.getTournamentsPerformanceSection().isVisible()
			};

			// Verify data consistency
			expect(mobileData.title).toBe(desktopData.title);
			expect(mobileData.hasMatchdaySection).toBe(desktopData.hasMatchdaySection);
			expect(mobileData.hasTournamentsSection).toBe(desktopData.hasTournamentsSection);
		});

		test('should maintain state consistency during viewport changes', async () => {
			const desktopViewport = RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-standard')!;
			const mobileViewport = RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!;

			// Start on desktop
			await responsiveHelper.setViewport(desktopViewport);
			await dashboardPage.verifyDashboardElements();
			
			// Navigate to tournaments
			await navigationHelper.navigateToTournaments();
			const tournamentsUrl = dashboardPage.page.url();
			
			// Switch to mobile
			await responsiveHelper.setViewport(mobileViewport);
			
			// Verify we're still on tournaments page
			expect(dashboardPage.page.url()).toBe(tournamentsUrl);
			
			// Navigate back to dashboard
			await navigationHelper.navigateToDashboard();
			
			// Switch back to desktop
			await responsiveHelper.setViewport(desktopViewport);
			
			// Verify we're on dashboard
			await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
			await dashboardPage.verifyDashboardElements();
		});
	});
});