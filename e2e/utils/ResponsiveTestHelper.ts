/**
 * Responsive Design Testing Helper
 * Provides utilities for testing responsive behavior across different viewport sizes
 */

import { Page, expect } from '@playwright/test';

/**
 * Viewport configuration for responsive testing
 */
export interface ViewportConfig {
	name: string;
	width: number;
	height: number;
	deviceType: 'desktop' | 'tablet' | 'mobile';
	description: string;
}

/**
 * Responsive test result interface
 */
export interface ResponsiveTestResult {
	viewport: ViewportConfig;
	passed: boolean;
	errors: string[];
	screenshots: string[];
}

/**
 * Standard viewport configurations for responsive testing
 */
export const RESPONSIVE_VIEWPORTS: ViewportConfig[] = [
	{
		name: 'desktop-large',
		width: 1920,
		height: 1080,
		deviceType: 'desktop',
		description: 'Large desktop screen'
	},
	{
		name: 'desktop-standard',
		width: 1280,
		height: 720,
		deviceType: 'desktop',
		description: 'Standard desktop screen'
	},
	{
		name: 'tablet-landscape',
		width: 1024,
		height: 768,
		deviceType: 'tablet',
		description: 'Tablet in landscape mode'
	},
	{
		name: 'tablet-portrait',
		width: 768,
		height: 1024,
		deviceType: 'tablet',
		description: 'Tablet in portrait mode'
	},
	{
		name: 'mobile-large',
		width: 414,
		height: 896,
		deviceType: 'mobile',
		description: 'Large mobile device (iPhone 11 Pro Max)'
	},
	{
		name: 'mobile-standard',
		width: 375,
		height: 667,
		deviceType: 'mobile',
		description: 'Standard mobile device (iPhone SE)'
	},
	{
		name: 'mobile-small',
		width: 320,
		height: 568,
		deviceType: 'mobile',
		description: 'Small mobile device (iPhone 5/SE)'
	}
];

/**
 * ResponsiveTestHelper class for comprehensive responsive testing
 */
export class ResponsiveTestHelper {
	private page: Page;
	private originalViewport: { width: number; height: number } | null = null;

	constructor(page: Page) {
		this.page = page;
	}

	/**
	 * Store the original viewport size for restoration
	 */
	async storeOriginalViewport(): Promise<void> {
		this.originalViewport = this.page.viewportSize();
	}

	/**
	 * Restore the original viewport size
	 */
	async restoreOriginalViewport(): Promise<void> {
		if (this.originalViewport) {
			await this.page.setViewportSize(this.originalViewport);
		}
	}

	/**
	 * Set viewport size and wait for responsive changes
	 */
	async setViewport(viewport: ViewportConfig): Promise<void> {
		await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
		// Wait for responsive changes to take effect
		await this.page.waitForTimeout(500);
		// Wait for any potential layout shifts
		await this.page.waitForLoadState('networkidle');
	}

	/**
	 * Test responsive behavior across multiple viewports
	 */
	async testResponsiveBehavior(
		viewports: ViewportConfig[],
		testCallback: (viewport: ViewportConfig) => Promise<void>
	): Promise<ResponsiveTestResult[]> {
		const results: ResponsiveTestResult[] = [];
		
		await this.storeOriginalViewport();

		for (const viewport of viewports) {
			const result: ResponsiveTestResult = {
				viewport,
				passed: false,
				errors: [],
				screenshots: []
			};

			try {
				await this.setViewport(viewport);
				await testCallback(viewport);
				result.passed = true;
			} catch (error) {
				result.passed = false;
				result.errors.push(error instanceof Error ? error.message : String(error));
				
				// Take screenshot on failure
				const screenshotPath = `e2e/screenshots/responsive-failure-${viewport.name}-${Date.now()}.png`;
				await this.page.screenshot({ path: screenshotPath, fullPage: true });
				result.screenshots.push(screenshotPath);
			}

			results.push(result);
		}

		await this.restoreOriginalViewport();
		return results;
	}

	/**
	 * Verify element visibility across viewports
	 */
	async verifyElementVisibility(
		selector: string,
		viewports: ViewportConfig[] = RESPONSIVE_VIEWPORTS
	): Promise<void> {
		await this.testResponsiveBehavior(viewports, async (viewport) => {
			const element = this.page.locator(selector);
			await expect(element).toBeVisible({
				timeout: 10000
			});
		});
	}

	/**
	 * Verify element accessibility (clickable/interactable) across viewports
	 */
	async verifyElementAccessibility(
		selector: string,
		viewports: ViewportConfig[] = RESPONSIVE_VIEWPORTS
	): Promise<void> {
		await this.testResponsiveBehavior(viewports, async (viewport) => {
			const element = this.page.locator(selector);
			await expect(element).toBeVisible();
			
			// Check if element is in viewport and clickable
			const boundingBox = await element.boundingBox();
			if (boundingBox) {
				expect(boundingBox.width).toBeGreaterThan(0);
				expect(boundingBox.height).toBeGreaterThan(0);
				expect(boundingBox.x).toBeGreaterThanOrEqual(0);
				expect(boundingBox.y).toBeGreaterThanOrEqual(0);
			}
		});
	}

	/**
	 * Test navigation functionality across different viewport sizes
	 */
	async testResponsiveNavigation(
		navigationItems: Array<{ selector: string; expectedUrl: string; label: string }>,
		viewports: ViewportConfig[] = RESPONSIVE_VIEWPORTS
	): Promise<void> {
		await this.testResponsiveBehavior(viewports, async (viewport) => {
			for (const item of navigationItems) {
				// Click navigation item
				await this.page.click(item.selector);
				
				// Verify navigation worked
				await expect(this.page).toHaveURL(new RegExp(item.expectedUrl));
				
				// Wait for page to load
				await this.page.waitForLoadState('networkidle');
			}
		});
	}

	/**
	 * Test form interactions across different viewport sizes
	 */
	async testResponsiveFormInteraction(
		formSelector: string,
		interactions: Array<{ selector: string; action: 'click' | 'fill' | 'select'; value?: string }>,
		viewports: ViewportConfig[] = RESPONSIVE_VIEWPORTS
	): Promise<void> {
		await this.testResponsiveBehavior(viewports, async (viewport) => {
			const form = this.page.locator(formSelector);
			await expect(form).toBeVisible();

			for (const interaction of interactions) {
				const element = this.page.locator(interaction.selector);
				await expect(element).toBeVisible();

				switch (interaction.action) {
					case 'click':
						await element.click();
						break;
					case 'fill':
						if (interaction.value) {
							await element.fill(interaction.value);
						}
						break;
					case 'select':
						if (interaction.value) {
							await element.selectOption(interaction.value);
						}
						break;
				}
			}
		});
	}

	/**
	 * Verify responsive layout consistency
	 */
	async verifyLayoutConsistency(
		criticalElements: string[],
		viewports: ViewportConfig[] = RESPONSIVE_VIEWPORTS
	): Promise<void> {
		await this.testResponsiveBehavior(viewports, async (viewport) => {
			// Verify all critical elements are present and visible
			for (const selector of criticalElements) {
				const element = this.page.locator(selector);
				await expect(element).toBeVisible();
			}

			// Check for horizontal scrollbars (usually indicates responsive issues)
			const bodyScrollWidth = await this.page.evaluate(() => document.body.scrollWidth);
			const viewportWidth = viewport.width;
			
			// Allow small tolerance for scrollbars
			expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 20);
		});
	}

	/**
	 * Test responsive behavior with window resize simulation
	 */
	async testWindowResize(
		fromViewport: ViewportConfig,
		toViewport: ViewportConfig,
		testCallback: () => Promise<void>
	): Promise<void> {
		await this.storeOriginalViewport();

		// Start with initial viewport
		await this.setViewport(fromViewport);
		await testCallback();

		// Resize to target viewport
		await this.setViewport(toViewport);
		await testCallback();

		await this.restoreOriginalViewport();
	}

	/**
	 * Get viewport-specific test data
	 */
	getViewportsByType(deviceType: 'desktop' | 'tablet' | 'mobile'): ViewportConfig[] {
		return RESPONSIVE_VIEWPORTS.filter(viewport => viewport.deviceType === deviceType);
	}

	/**
	 * Get current viewport information
	 */
	async getCurrentViewportInfo(): Promise<{
		size: { width: number; height: number } | null;
		deviceType: string;
		userAgent: string;
	}> {
		const size = this.page.viewportSize();
		const userAgent = await this.page.evaluate(() => navigator.userAgent);
		
		let deviceType = 'unknown';
		if (size) {
			if (size.width >= 1024) deviceType = 'desktop';
			else if (size.width >= 768) deviceType = 'tablet';
			else deviceType = 'mobile';
		}

		return { size, deviceType, userAgent };
	}
}