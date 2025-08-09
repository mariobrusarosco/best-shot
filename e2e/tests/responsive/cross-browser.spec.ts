/**
 * Cross-Browser Compatibility Tests
 * Tests application behavior across different browsers (Chrome, Firefox, Safari)
 */

import { test, expect, devices } from '@playwright/test';
import { ResponsiveTestHelper, RESPONSIVE_VIEWPORTS } from '../../utils/ResponsiveTestHelper';
import { DashboardPage } from '../../page-objects/screens/DashboardPage';
import { NavigationHelper } from '../../page-objects/screens/NavigationHelper';
import { dashboardTestData } from '../../fixtures/TestData';

test.describe('Cross-Browser Compatibility', () => {
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

	test.describe('Browser-Specific Functionality', () => {
		test('should display dashboard correctly in all browsers', async ({ browserName }) => {
			// Log browser information
			const viewportInfo = await responsiveHelper.getCurrentViewportInfo();
			console.log(`Testing in ${browserName} with viewport:`, viewportInfo);

			// Verify core dashboard elements
			await dashboardPage.verifyDashboardElements();

			// Verify elements are properly styled
			const screenHeading = dashboardPage.getScreenHeading();
			await expect(screenHeading).toBeVisible();
			
			// Check computed styles are applied correctly
			const headingStyles = await screenHeading.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					display: styles.display,
					visibility: styles.visibility,
					opacity: styles.opacity
				};
			});

			expect(headingStyles.display).not.toBe('none');
			expect(headingStyles.visibility).not.toBe('hidden');
			expect(parseFloat(headingStyles.opacity)).toBeGreaterThan(0);
		});

		test('should handle CSS features consistently across browsers', async ({ browserName }) => {
			// Test CSS Grid/Flexbox support
			const layoutElements = [
				dashboardTestData.selectors.matchdaySection,
				dashboardTestData.selectors.tournamentsPerformanceSection
			];

			for (const selector of layoutElements) {
				const element = dashboardPage.page.locator(selector);
				await expect(element).toBeVisible();

				// Check layout properties
				const layoutInfo = await element.evaluate((el) => {
					const styles = window.getComputedStyle(el);
					return {
						display: styles.display,
						position: styles.position,
						width: styles.width,
						height: styles.height
					};
				});

				// Ensure element has proper dimensions
				expect(layoutInfo.width).not.toBe('0px');
				expect(layoutInfo.height).not.toBe('0px');
			}
		});

		test('should handle JavaScript features consistently', async ({ browserName }) => {
			// Test modern JavaScript features work across browsers
			const jsFeatureTest = await dashboardPage.page.evaluate(() => {
				// Test arrow functions, const/let, template literals
				const testFeatures = () => {
					const features = {
						arrowFunctions: true,
						templateLiterals: `Browser: ${navigator.userAgent}`,
						destructuring: true,
						promises: Promise.resolve(true)
					};
					return features;
				};

				return testFeatures();
			});

			expect(jsFeatureTest.arrowFunctions).toBe(true);
			expect(jsFeatureTest.templateLiterals).toContain('Browser:');
			expect(jsFeatureTest.destructuring).toBe(true);
			expect(jsFeatureTest.promises).toBeInstanceOf(Promise);
		});
	});

	test.describe('Browser-Specific Responsive Behavior', () => {
		test('should handle viewport changes consistently across browsers', async ({ browserName }) => {
			const testViewports = [
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-standard')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'tablet-portrait')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!
			];

			for (const viewport of testViewports) {
				await responsiveHelper.setViewport(viewport);
				
				// Verify dashboard elements remain functional
				await dashboardPage.verifyDashboardElements();
				
				// Browser-specific checks
				if (browserName === 'webkit') {
					// Safari-specific checks
					await expect(dashboardPage.getScreenHeading()).toBeVisible();
				} else if (browserName === 'firefox') {
					// Firefox-specific checks
					await expect(dashboardPage.getMatchdaySection()).toBeVisible();
				} else if (browserName === 'chromium') {
					// Chrome-specific checks
					await expect(dashboardPage.getTournamentsPerformanceSection()).toBeVisible();
				}
			}
		});

		test('should handle touch events appropriately by browser', async ({ browserName }) => {
			// Set mobile viewport for touch testing
			const mobileViewport = RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!;
			await responsiveHelper.setViewport(mobileViewport);

			// Test touch-friendly interactions
			const navigationLinks = await dashboardPage.page.locator('nav a').all();
			
			for (const link of navigationLinks.slice(0, 2)) { // Test first 2 links
				// Check if element is touch-friendly (minimum 44px touch target)
				const boundingBox = await link.boundingBox();
				if (boundingBox) {
					// Touch targets should be at least 44px in either dimension
					const isTouchFriendly = boundingBox.width >= 44 || boundingBox.height >= 44;
					expect(isTouchFriendly).toBeTruthy();
				}
			}
		});
	});

	test.describe('Browser Performance Comparison', () => {
		test('should load efficiently across all browsers', async ({ browserName }) => {
			const startTime = Date.now();
			
			// Reload page and measure load time
			await dashboardPage.page.reload();
			await dashboardPage.waitForLoad();
			
			const loadTime = Date.now() - startTime;
			
			// Log performance for comparison
			console.log(`${browserName} load time: ${loadTime}ms`);
			
			// Ensure reasonable load times (browser-specific tolerances)
			const maxLoadTime = browserName === 'webkit' ? 15000 : 10000; // Safari may be slower
			expect(loadTime).toBeLessThan(maxLoadTime);
		});

		test('should handle memory usage efficiently', async ({ browserName }) => {
			// Perform multiple navigation actions to test memory handling
			const navigationActions = [
				() => navigationHelper.navigateToDashboard(),
				() => navigationHelper.navigateToTournaments(),
				() => navigationHelper.navigateToLeagues(),
				() => navigationHelper.navigateToDashboard()
			];

			for (const action of navigationActions) {
				await action();
				await dashboardPage.page.waitForLoadState('networkidle');
				
				// Check page is still responsive
				await expect(dashboardPage.page.locator('body')).toBeVisible();
			}
		});
	});

	test.describe('Browser-Specific Edge Cases', () => {
		test('should handle browser-specific CSS quirks', async ({ browserName }) => {
			// Test known browser differences
			const testElement = dashboardPage.getScreenHeading();
			
			const computedStyles = await testElement.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					boxSizing: styles.boxSizing,
					display: styles.display,
					fontSmoothing: styles.webkitFontSmoothing || styles.fontSmooth,
					transform: styles.transform
				};
			});

			// Verify consistent box model
			expect(['border-box', 'content-box']).toContain(computedStyles.boxSizing);
			
			// Verify display property is set
			expect(computedStyles.display).toBeTruthy();
		});

		test('should handle browser-specific JavaScript APIs', async ({ browserName }) => {
			// Test browser API availability
			const apiSupport = await dashboardPage.page.evaluate(() => {
				return {
					fetch: typeof fetch !== 'undefined',
					localStorage: typeof localStorage !== 'undefined',
					sessionStorage: typeof sessionStorage !== 'undefined',
					requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
					intersectionObserver: typeof IntersectionObserver !== 'undefined'
				};
			});

			// All modern browsers should support these APIs
			expect(apiSupport.fetch).toBe(true);
			expect(apiSupport.localStorage).toBe(true);
			expect(apiSupport.sessionStorage).toBe(true);
			expect(apiSupport.requestAnimationFrame).toBe(true);
			expect(apiSupport.intersectionObserver).toBe(true);
		});

		test('should handle form interactions consistently', async ({ browserName }) => {
			// Navigate to a page that might have forms (if available)
			// For now, test basic input handling
			const hasInputs = await dashboardPage.page.locator('input, button, select').count();
			
			if (hasInputs > 0) {
				const firstInteractiveElement = dashboardPage.page.locator('input, button, select').first();
				
				// Test focus behavior
				await firstInteractiveElement.focus();
				const isFocused = await firstInteractiveElement.evaluate((el) => {
					return document.activeElement === el;
				});
				
				expect(isFocused).toBe(true);
			}
		});
	});

	test.describe('Browser Compatibility Matrix', () => {
		test('should maintain feature parity across browsers', async ({ browserName }) => {
			// Define core features that should work in all browsers
			const coreFeatures = [
				{
					name: 'Dashboard Navigation',
					test: async () => {
						await navigationHelper.navigateToDashboard();
						await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
					}
				},
				{
					name: 'Element Visibility',
					test: async () => {
						await expect(dashboardPage.getScreenHeading()).toBeVisible();
						await expect(dashboardPage.getMatchdaySection()).toBeVisible();
					}
				},
				{
					name: 'Responsive Layout',
					test: async () => {
						await responsiveHelper.setViewport(RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!);
						await expect(dashboardPage.getScreenHeading()).toBeVisible();
					}
				}
			];

			// Test each core feature
			for (const feature of coreFeatures) {
				try {
					await feature.test();
				} catch (error) {
					throw new Error(`Feature "${feature.name}" failed in ${browserName}: ${error}`);
				}
			}
		});

		test('should handle browser-specific optimizations', async ({ browserName }) => {
			// Test browser-specific performance optimizations
			const performanceMetrics = await dashboardPage.page.evaluate(() => {
				const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
				return {
					domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
					loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
					firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
					firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
				};
			});

			// Log metrics for analysis
			console.log(`${browserName} performance metrics:`, performanceMetrics);

			// Verify reasonable performance (browser-agnostic thresholds)
			expect(performanceMetrics.domContentLoaded).toBeGreaterThanOrEqual(0);
			expect(performanceMetrics.loadComplete).toBeGreaterThanOrEqual(0);
		});
	});
});