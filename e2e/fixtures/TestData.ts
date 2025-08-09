/**
 * Test data models and fixtures for E2E tests
 * 
 * @deprecated Use TestDataManager and EnvironmentFixtures for centralized test data management
 * This file is maintained for backward compatibility with existing tests
 */

import { TestDataManager, TestUserData, TestScenarioData } from './TestDataManager';
import { getEnvironmentFixtures } from './EnvironmentFixtures';
import { getTestConfig } from '../config/TestConfig';

/**
 * Legacy test user model for backward compatibility
 * @deprecated Use TestUserData from TestDataManager instead
 */
export interface TestUser {
	email: string;
	password: string;
	role: 'standard' | 'admin';
	expectedDashboardData: {
		username: string;
		tournaments: string[];
	};
}

/**
 * Legacy test scenario model for backward compatibility
 * @deprecated Use TestScenarioData from TestDataManager instead
 */
export interface TestScenario {
	name: string;
	description: string;
	preconditions: string[];
	steps: TestStep[];
	expectedResults: string[];
	tags: string[];
}

/**
 * Individual test step model
 */
export interface TestStep {
	action: string;
	target: string;
	data?: any;
	expectedResult?: string;
}

/**
 * Get centralized test data manager instance
 */
export function getTestDataManager(environment: string = 'demo'): TestDataManager {
	const config = getTestConfig(environment);
	return TestDataManager.getInstance(config);
}

/**
 * Get environment-specific test fixtures
 */
export function getTestFixtures(environment: string = 'demo') {
	const config = getTestConfig(environment);
	return getEnvironmentFixtures(environment, config);
}

/**
 * Legacy test data - maintained for backward compatibility
 * @deprecated Use centralized test data management system instead
 */

/**
 * Navigation test data
 * @deprecated Use getTestFixtures().getDemoNavigationData() instead
 */
export const navigationTestData = {
	menuLinks: [
		{ href: '/', expectedUrl: '/dashboard', label: 'Home' },
		{ href: '/dashboard', expectedUrl: '/dashboard', label: 'Dashboard' },
		{ href: '/tournaments', expectedUrl: '/tournaments', label: 'Tournaments' },
		{ href: '/leagues', expectedUrl: '/leagues', label: 'Leagues' },
		{ href: '/my-account', expectedUrl: '/my-account', label: 'My Account' }
	],
	expectedMenuCount: 5
};

/**
 * Dashboard test data
 * @deprecated Use getTestFixtures().getDemoDashboardData() instead
 */
export const dashboardTestData = {
	selectors: {
		screenHeading: '[data-ui="screen-heading"]',
		title: '[data-ui="title"]',
		subtitle: '[data-ui="subtitle"]',
		matchdaySection: '[data-ui="matchday"]',
		tournamentsPerformanceSection: '[data-ui="tournaments-perf"]'
	},
	expectedContent: {
		titlePrefix: 'Hello,',
		subtitle: 'mariobrusarosco',
		matchdayText: /matchday/i,
		tournamentsText: /tournaments/i
	}
};

/**
 * Protected routes test data
 * @deprecated Use centralized test data management system instead
 */
export const protectedRoutesTestData = {
	routes: [
		'/dashboard',
		'/tournaments',
		'/leagues',
		'/my-account'
	],
	// Future implementation when authentication is established
	// redirectUrl: '/login',
	// unauthorizedMessage: 'Please log in to access this page'
};

/**
 * Browser and viewport test data
 * @deprecated Use centralized test data management system instead
 */
export const browserTestData = {
	viewports: [
		{ name: 'desktop', width: 1280, height: 720 },
		{ name: 'tablet', width: 768, height: 1024 },
		{ name: 'mobile', width: 375, height: 667 }
	],
	browsers: ['chromium', 'firefox', 'webkit']
};

/**
 * Test scenarios for smoke testing
 * @deprecated Use getTestFixtures().getDemoTestScenarios() instead
 */
export const smokeTestScenarios: TestScenario[] = [
	{
		name: 'Basic Application Loading',
		description: 'Verify the application loads correctly and displays main elements',
		preconditions: ['Application is deployed and accessible'],
		steps: [
			{ action: 'navigate', target: '/', expectedResult: 'Page loads successfully' },
			{ action: 'verify', target: 'page title', expectedResult: 'Title contains "Best Shot"' },
			{ action: 'verify', target: 'menu', expectedResult: 'Menu is visible with correct links' }
		],
		expectedResults: [
			'Application loads without errors',
			'Main navigation is functional',
			'Page redirects to dashboard'
		],
		tags: ['smoke', 'critical']
	},
	{
		name: 'Critical Path Navigation',
		description: 'Verify navigation between main application screens',
		preconditions: ['Application is loaded'],
		steps: [
			{ action: 'click', target: 'dashboard link', expectedResult: 'Navigate to dashboard' },
			{ action: 'click', target: 'tournaments link', expectedResult: 'Navigate to tournaments' },
			{ action: 'click', target: 'leagues link', expectedResult: 'Navigate to leagues' }
		],
		expectedResults: [
			'All main screens are accessible',
			'Navigation works correctly',
			'URLs update appropriately'
		],
		tags: ['smoke', 'navigation']
	}
];

/**
 * Error scenarios for testing error handling
 * @deprecated Use centralized test data management system instead
 */
export const errorTestScenarios = {
	networkErrors: [
		{ type: 'timeout', description: 'Network request timeout' },
		{ type: 'offline', description: 'Offline network condition' }
	],
	pageErrors: [
		{ type: '404', description: 'Page not found error' },
		{ type: '500', description: 'Server error response' }
	]
};