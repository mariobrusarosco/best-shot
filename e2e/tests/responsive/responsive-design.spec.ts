/**
 * Comprehensive Responsive Design Tests
 * Tests application behavior across different viewport sizes and browsers
 */

import { test, expect } from '@playwright/test';
import { ResponsiveTestHelper, RESPONSIVE_VIEWPORTS } from '../../utils/ResponsiveTestHelper';
import { DashboardPage } from '../../page-objects/screens/DashboardPage';
import { NavigationHelper } from '../../page-objects/screens/NavigationHelper';
import { dashboardTestData, navigationTestData } from '../../fixtures/TestData';

test.describe('Responsive Design Testing', () => {
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

	test.describe('Viewport Size Testing', () => {
		test('should display correctly across all standard viewport sizes', async () => {
			const criticalElements = [
				dashboardTestData.selectors.screenHeading,
				dashboardTestData.selectors.matchdaySection,
				dashboardTestData.selectors.tournamentsPerformanceSection
			];

			await responsiveHelper.verifyLayoutConsistency(criticalElements, RESPONSIVE_VIEWPORTS);
		});

		test('should maintain element visibility on mobile devices', async () => {
			const mobileViewports = responsiveHelper.getViewportsByType('mobile');
			
			await responsiveHelper.verifyElementVisibility(
				dashboardTestData.selectors.screenHeading,
				mobileViewports
			);

			await responsiveHelper.verifyElementVisibility(
				dashboardTestData.selectors.matchdaySection,
				mobileViewports
			);
		});

		test('should maintain element accessibility on tablet devices', async () => {
			const tabletViewports = responsiveHelper.getViewportsByType('tablet');
			
			await responsiveHelper.verifyElementAccessibility(
				dashboardTestData.selectors.screenHeading,
				tabletViewports
			);

			await responsiveHelper.verifyElementAccessibility(
				dashboardTestData.selectors.matchdaySection,
				tabletViewports
			);
		});

		test('should handle extreme viewport sizes gracefully', async () => {
			const extremeViewports = [
				{
					name: 'ultra-wide',
					width: 2560,
					height: 1440,
					deviceType: 'desktop' as const,
					description: 'Ultra-wide desktop monitor'
				},
				{
					name: 'very-small',
					width: 280,
					height: 480,
					deviceType: 'mobile' as const,
					description: 'Very small mobile device'
				}
			];

			const criticalElements = [
				dashboardTestData.selectors.screenHeading,
				dashboardTestData.selectors.matchdaySection
			];

			await responsiveHelper.verifyLayoutConsistency(criticalElements, extremeViewports);
		});
	});

	test.describe('Navigation Responsiveness', () => {
		test('should maintain navigation functionality across all viewport sizes', async () => {
			const navigationItems = navigationTestData.menuLinks.map(link => ({
				selector: `a[href="${link.href}"]`,
				expectedUrl: link.expectedUrl,
				label: link.label
			}));

			// Test on key viewport sizes
			const keyViewports = [
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-standard')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'tablet-portrait')!,
				RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!
			];

			await responsiveHelper.testResponsiveNavigation(navigationItems, keyViewports);
		});

		test('should handle mobile navigation menu correctly', async () => {
			const mobileViewports = responsiveHelper.getViewportsByType('mobile');

			for (const viewport of mobileViewports) {
				await responsiveHelper.setViewport(viewport);
				
				// Verify navigation is accessible (may be in hamburger menu on mobile)
				const navigationExists = await dashboardPage.page.locator('nav').isVisible() ||
					await dashboardPage.page.locator('[data-testid="mobile-menu"]').isVisible() ||
					await dashboardPage.page.locator('.menu-toggle').isVisible();
				
				expect(navigationExists).toBeTruthy();
			}
		});
	});

	test.describe('Content Adaptation', () => {
		test('should adapt content layout for different screen sizes', async () => {
			await responsiveHelper.testResponsiveBehavior(RESPONSIVE_VIEWPORTS, async (viewport) => {
				// Verify main content areas are visible
				await expect(dashboardPage.getScreenHeading()).toBeVisible();
				await expect(dashboardPage.getMatchdaySection()).toBeVisible();
				await expect(dashboardPage.getTournamentsPerformanceSection()).toBeVisible();

				// Check that content doesn't overflow horizontally
				const bodyScrollWidth = await dashboardPage.page.evaluate(() => document.body.scrollWidth);
				expect(bodyScrollWidth).toBeLessThanOrEqual(viewport.width + 20); // Allow small tolerance
			});
		});

		test('should maintain readable text sizes across viewports', async () => {
			await responsiveHelper.testResponsiveBehavior(RESPONSIVE_VIEWPORTS, async (viewport) => {
				// Check heading text size
				const headingElement = dashboardPage.getScreenHeading();
				await expect(headingElement).toBeVisible();

				const fontSize = await headingElement.evaluate((el) => {
					return window.getComputedStyle(el).fontSize;
				});

				// Ensure minimum readable font size (at least 14px)
				const fontSizeValue = parseInt(fontSize.replace('px', ''));
				expect(fontSizeValue).toBeGreaterThanOrEqual(14);
			});
		});

		test('should handle content overflow appropriately', async () => {
			await responsiveHelper.testResponsiveBehavior(RESPONSIVE_VIEWPORTS, async (viewport) => {
				// Check for horizontal scrollbars (usually indicates responsive issues)
				const hasHorizontalScroll = await dashboardPage.page.evaluate(() => {
					return document.documentElement.scrollWidth > document.documentElement.clientWidth;
				});

				// Horizontal scroll should be minimal or non-existent
				expect(hasHorizontalScroll).toBeFalsy();
			});
		});
	});

	test.describe('Window Resize Behavior', () => {
		test('should handle dynamic window resizing gracefully', async () => {
			const desktopViewport = RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-large')!;
			const mobileViewport = RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!;

			await responsiveHelper.testWindowResize(
				desktopViewport,
				mobileViewport,
				async () => {
					await dashboardPage.verifyDashboardElements();
				}
			);
		});

		test('should maintain functionality during orientation changes', async () => {
			const tabletLandscape = RESPONSIVE_VIEWPORTS.find(v => v.name === 'tablet-landscape')!;
			const tabletPortrait = RESPONSIVE_VIEWPORTS.find(v => v.name === 'tablet-portrait')!;

			await responsiveHelper.testWindowResize(
				tabletLandscape,
				tabletPortrait,
				async () => {
					// Verify key elements remain functional
					await expect(dashboardPage.getScreenHeading()).toBeVisible();
					await expect(dashboardPage.getMatchdaySection()).toBeVisible();
					
					// Test navigation still works
					await navigationHelper.verifyMenuLinksExist();
				}
			);
		});
	});

	test.describe('Performance on Different Viewports', () => {
		test('should load efficiently across different viewport sizes', async () => {
			const performanceResults: Array<{ viewport: string; loadTime: number }> = [];

			for (const viewport of RESPONSIVE_VIEWPORTS) {
				await responsiveHelper.setViewport(viewport);
				
				const startTime = Date.now();
				await dashboardPage.page.reload();
				await dashboardPage.waitForLoad();
				const loadTime = Date.now() - startTime;

				performanceResults.push({
					viewport: viewport.name,
					loadTime
				});

				// Ensure reasonable load times (under 10 seconds)
				expect(loadTime).toBeLessThan(10000);
			}

			// Log performance results for analysis
			console.log('Viewport Load Performance:', performanceResults);
		});

		test('should handle resource loading efficiently on mobile', async () => {
			const mobileViewports = responsiveHelper.getViewportsByType('mobile');

			for (const viewport of mobileViewports) {
				await responsiveHelper.setViewport(viewport);
				
				// Monitor network requests
				const responses: string[] = [];
				dashboardPage.page.on('response', (response) => {
					responses.push(`${response.status()} - ${response.url()}`);
				});

				await dashboardPage.page.reload();
				await dashboardPage.waitForLoad();

				// Verify no excessive failed requests
				const failedRequests = responses.filter(r => r.startsWith('4') || r.startsWith('5'));
				expect(failedRequests.length).toBeLessThan(3); // Allow some tolerance
			}
		});
	});

	test.describe('Cross-Viewport Consistency', () => {
		test('should maintain consistent functionality across all viewports', async () => {
			const functionalityTests = [
				{
					name: 'Screen heading visibility',
					test: async () => await expect(dashboardPage.getScreenHeading()).toBeVisible()
				},
				{
					name: 'Matchday section visibility',
					test: async () => await expect(dashboardPage.getMatchdaySection()).toBeVisible()
				},
				{
					name: 'Navigation menu existence',
					test: async () => await navigationHelper.verifyMenuLinksExist()
				}
			];

			for (const viewport of RESPONSIVE_VIEWPORTS) {
				await responsiveHelper.setViewport(viewport);
				
				for (const functionalityTest of functionalityTests) {
					try {
						await functionalityTest.test();
					} catch (error) {
						throw new Error(`${functionalityTest.name} failed on ${viewport.name}: ${error}`);
					}
				}
			}
		});

		test('should provide consistent user experience across device types', async () => {
			const deviceTypes = ['desktop', 'tablet', 'mobile'] as const;

			for (const deviceType of deviceTypes) {
				const viewports = responsiveHelper.getViewportsByType(deviceType);
				
				for (const viewport of viewports) {
					await responsiveHelper.setViewport(viewport);
					
					// Verify core user experience elements
					await expect(dashboardPage.getScreenHeading()).toBeVisible();
					
					// Verify content is accessible and readable
					const headingText = await dashboardPage.getScreenHeading().textContent();
					expect(headingText).toBeTruthy();
					expect(headingText?.length).toBeGreaterThan(0);
				}
			}
		});
	});
});