/**
 * Responsive Testing Configuration
 * Defines viewport configurations and browser settings for responsive testing
 */

import { devices, PlaywrightTestConfig } from '@playwright/test';
import { getTestConfig } from './TestConfig';

/**
 * Responsive viewport configurations for comprehensive testing
 */
export const RESPONSIVE_PROJECTS = [
	// Desktop Chrome - Multiple viewports
	{
		name: 'desktop-chrome-large',
		use: {
			...devices['Desktop Chrome'],
			viewport: { width: 1920, height: 1080 }
		}
	},
	{
		name: 'desktop-chrome-standard',
		use: {
			...devices['Desktop Chrome'],
			viewport: { width: 1280, height: 720 }
		}
	},
	
	// Desktop Firefox - Multiple viewports
	{
		name: 'desktop-firefox-large',
		use: {
			...devices['Desktop Firefox'],
			viewport: { width: 1920, height: 1080 }
		}
	},
	{
		name: 'desktop-firefox-standard',
		use: {
			...devices['Desktop Firefox'],
			viewport: { width: 1280, height: 720 }
		}
	},
	
	// Desktop Safari - Multiple viewports
	{
		name: 'desktop-safari-large',
		use: {
			...devices['Desktop Safari'],
			viewport: { width: 1920, height: 1080 }
		}
	},
	{
		name: 'desktop-safari-standard',
		use: {
			...devices['Desktop Safari'],
			viewport: { width: 1280, height: 720 }
		}
	},
	
	// Tablet viewports - All browsers
	{
		name: 'tablet-chrome-landscape',
		use: {
			...devices['Desktop Chrome'],
			viewport: { width: 1024, height: 768 },
			isMobile: false,
			hasTouch: true
		}
	},
	{
		name: 'tablet-chrome-portrait',
		use: {
			...devices['Desktop Chrome'],
			viewport: { width: 768, height: 1024 },
			isMobile: false,
			hasTouch: true
		}
	},
	
	// Mobile viewports - Chrome
	{
		name: 'mobile-chrome-large',
		use: {
			...devices['Pixel 5'],
			viewport: { width: 414, height: 896 }
		}
	},
	{
		name: 'mobile-chrome-standard',
		use: {
			...devices['iPhone 12'],
			viewport: { width: 375, height: 667 }
		}
	},
	{
		name: 'mobile-chrome-small',
		use: {
			...devices['iPhone SE'],
			viewport: { width: 320, height: 568 }
		}
	},
	
	// Mobile Safari
	{
		name: 'mobile-safari-standard',
		use: {
			...devices['iPhone 12'],
			viewport: { width: 375, height: 667 }
		}
	}
];

/**
 * Get responsive test configuration
 */
export function getResponsiveConfig(environment: string = 'demo'): Partial<PlaywrightTestConfig> {
	const testConfig = getTestConfig(environment);
	
	return {
		projects: RESPONSIVE_PROJECTS,
		use: {
			baseURL: testConfig.baseURL,
			trace: 'on-first-retry',
			screenshot: 'only-on-failure',
			video: 'retain-on-failure',
			ignoreHTTPSErrors: true,
			actionTimeout: 15000,
			navigationTimeout: 30000
		},
		timeout: testConfig.timeout,
		retries: testConfig.retries,
		reporter: [
			['html', { 
				outputFolder: 'playwright-report-responsive',
				open: process.env.CI ? 'never' : 'on-failure'
			}],
			['junit', { outputFile: 'test-results/responsive-junit-results.xml' }],
			['list']
		]
	};
}

/**
 * Browser-specific configurations for cross-browser testing
 */
export const CROSS_BROWSER_PROJECTS = [
	{
		name: 'chromium',
		use: { ...devices['Desktop Chrome'] }
	},
	{
		name: 'firefox',
		use: { ...devices['Desktop Firefox'] }
	},
	{
		name: 'webkit',
		use: { ...devices['Desktop Safari'] }
	}
];

/**
 * Mobile-specific browser configurations
 */
export const MOBILE_BROWSER_PROJECTS = [
	{
		name: 'mobile-chrome',
		use: { ...devices['Pixel 5'] }
	},
	{
		name: 'mobile-safari',
		use: { ...devices['iPhone 12'] }
	}
];

/**
 * Performance testing configurations with different viewport sizes
 */
export const PERFORMANCE_PROJECTS = [
	{
		name: 'performance-desktop',
		use: {
			...devices['Desktop Chrome'],
			viewport: { width: 1920, height: 1080 }
		}
	},
	{
		name: 'performance-tablet',
		use: {
			...devices['Desktop Chrome'],
			viewport: { width: 768, height: 1024 },
			isMobile: false,
			hasTouch: true
		}
	},
	{
		name: 'performance-mobile',
		use: {
			...devices['Pixel 5'],
			viewport: { width: 375, height: 667 }
		}
	}
];

/**
 * Get configuration for specific test types
 */
export function getConfigByType(type: 'responsive' | 'cross-browser' | 'mobile' | 'performance', environment: string = 'demo') {
	const baseConfig = getTestConfig(environment);
	
	const projectMap = {
		responsive: RESPONSIVE_PROJECTS,
		'cross-browser': CROSS_BROWSER_PROJECTS,
		mobile: MOBILE_BROWSER_PROJECTS,
		performance: PERFORMANCE_PROJECTS
	};
	
	return {
		projects: projectMap[type],
		use: {
			baseURL: baseConfig.baseURL,
			trace: 'on-first-retry',
			screenshot: 'only-on-failure',
			video: 'retain-on-failure',
			ignoreHTTPSErrors: true
		},
		timeout: baseConfig.timeout,
		retries: baseConfig.retries
	};
}