/**
 * Example test demonstrating the usage of centralized test data management
 * This file serves as documentation and reference for other tests
 */

import { test, expect } from '@playwright/test';
import { getTestConfig } from '../config/TestConfig';
import { TestDataHelpers } from '../utils/TestDataIntegration';
import { initializeTestData, getAllTestData, cleanupAfterTests } from '../fixtures';

// Example 1: Basic test data usage
test.describe('Test Data Management Examples', () => {
	let testDataSummary: any;

	test.beforeAll(async () => {
		// Initialize test data for the demo environment
		const { dataManager, fixtures } = await initializeTestData('demo');
		
		// Get summary for reporting
		const integration = TestDataHelpers.createIntegration(getTestConfig('demo'), 'demo');
		testDataSummary = integration.getTestDataSummary();
		
		console.log('Test Data Initialized:', testDataSummary);
	});

	test.afterAll(async () => {
		// Cleanup after all tests
		await cleanupAfterTests('demo');
		console.log('Test Data Cleanup Completed');
	});

	test('should load and use demo environment test data', async ({ page }) => {
		// Get all test data for demo environment
		const testData = await getAllTestData('demo');
		
		// Verify test data is loaded
		expect(testData.users).toBeDefined();
		expect(testData.navigation).toBeDefined();
		expect(testData.dashboard).toBeDefined();
		
		// Use navigation data for testing
		const navigationData = testData.navigation;
		if (navigationData) {
			expect(navigationData.menuLinks).toHaveLength(5);
			expect(navigationData.menuLinks[0].href).toBe('/');
		}
		
		// Use user data for testing
		const users = testData.users;
		if (users && users.length > 0) {
			const standardUser = users.find(user => user.role === 'standard');
			expect(standardUser).toBeDefined();
			expect(standardUser?.email).toContain('@');
		}
	});

	test('should use environment fixtures for demo data', async ({ page }) => {
		// Setup test data using helpers
		const config = getTestConfig('demo');
		const { integration, user, fixtures } = await TestDataHelpers.setupForPageObject(page, config, 'demo');
		
		// Verify user data
		expect(user).toBeDefined();
		expect(user?.role).toBe('standard');
		expect(user?.environment).toBe('demo');
		
		// Use fixtures for demo-specific data
		const demoNavigation = fixtures.getDemoNavigationData();
		expect(demoNavigation.menuLinks).toBeDefined();
		expect(demoNavigation.menuLinks.length).toBeGreaterThan(0);
		
		const demoDashboard = fixtures.getDemoDashboardData();
		expect(demoDashboard.selectors.screenHeading).toBe('[data-ui="screen-heading"]');
		expect(demoDashboard.expectedContent.titlePrefix).toBe('Hello,');
	});

	test('should use test scenarios for structured testing', async ({ page }) => {
		// Setup for smoke tests
		const config = getTestConfig('demo');
		const { scenarios, user, fixtures } = await TestDataHelpers.setupForSmokeTests(config, 'demo');
		
		// Verify scenarios are loaded
		expect(scenarios).toBeDefined();
		expect(scenarios.length).toBeGreaterThan(0);
		
		// Use first smoke test scenario
		const smokeTest = scenarios[0];
		expect(smokeTest.category).toBe('smoke');
		expect(smokeTest.priority).toBe('critical');
		expect(smokeTest.environment).toContain('demo');
		
		// Verify scenario structure
		expect(smokeTest.steps).toBeDefined();
		expect(smokeTest.steps.length).toBeGreaterThan(0);
		expect(smokeTest.expectedResults).toBeDefined();
		
		console.log(`Executing scenario: ${smokeTest.name}`);
		console.log(`Steps: ${smokeTest.steps.length}`);
		console.log(`Expected duration: ${smokeTest.metadata.estimatedDuration} seconds`);
	});
});

// Example 2: Authentication test data usage
test.describe('Authentication Test Data Examples', () => {
	test('should provide different user roles for auth testing', async ({ page }) => {
		// Setup authentication test data
		const config = getTestConfig('demo');
		const { standardUser, adminUser, guestUser, fixtures } = await TestDataHelpers.setupForAuthTests(config, 'demo');
		
		// Verify different user roles are available
		expect(standardUser?.role).toBe('standard');
		expect(adminUser?.role).toBe('admin');
		expect(guestUser?.role).toBe('guest');
		
		// Verify users have different permissions
		expect(standardUser?.expectedData.permissions).toContain('view_dashboard');
		expect(adminUser?.expectedData.permissions).toContain('admin_panel');
		expect(guestUser?.expectedData.permissions).not.toContain('admin_panel');
		
		// Use navigation data to test protected routes
		const navigationData = fixtures.getDemoNavigationData();
		const protectedRoutes = navigationData.menuLinks.filter(link => link.requiresAuth);
		expect(protectedRoutes.length).toBeGreaterThan(0);
		
		console.log('Protected routes:', protectedRoutes.map(route => route.href));
	});
});

// Example 3: Dynamic test data generation
test.describe('Dynamic Test Data Examples', () => {
	test('should generate test data dynamically', async ({ page }) => {
		const config = getTestConfig('demo');
		const integration = TestDataHelpers.createIntegration(config, 'demo');
		
		// Generate dynamic users
		const dynamicUsers = integration.generateTestData('users', 3);
		expect(dynamicUsers).toHaveLength(3);
		expect(dynamicUsers[0].email).toContain('@example.com');
		
		// Generate dynamic scenarios
		const dynamicScenarios = integration.generateTestData('scenarios', 2);
		expect(dynamicScenarios).toHaveLength(2);
		expect(dynamicScenarios[0].name).toBeDefined();
		
		// Generate dashboard data
		const dashboardData = integration.generateTestData('dashboard');
		expect(dashboardData.selectors).toBeDefined();
		expect(dashboardData.expectedContent).toBeDefined();
		
		console.log('Generated dynamic test data successfully');
	});
});

// Example 4: Test data validation
test.describe('Test Data Validation Examples', () => {
	test('should validate test data before use', async ({ page }) => {
		const config = getTestConfig('demo');
		const integration = TestDataHelpers.createIntegration(config, 'demo');
		
		// Valid test data
		const validUser = {
			email: 'valid@example.com',
			role: 'standard',
			environment: 'demo'
		};
		
		const validationResult = integration.validateTestData(validUser);
		expect(validationResult.valid).toBe(true);
		expect(validationResult.errors).toHaveLength(0);
		
		// Invalid test data
		const invalidUser = {
			email: 'invalid-email',
			role: 'invalid-role',
			environment: 'invalid-env'
		};
		
		const invalidValidationResult = integration.validateTestData(invalidUser);
		expect(invalidValidationResult.valid).toBe(false);
		expect(invalidValidationResult.errors.length).toBeGreaterThan(0);
		
		console.log('Validation errors:', invalidValidationResult.errors);
	});
});

// Example 5: Test data cleanup
test.describe('Test Data Cleanup Examples', () => {
	test('should demonstrate cleanup operations', async ({ page }, testInfo) => {
		const config = getTestConfig('demo');
		const integration = TestDataHelpers.createIntegration(config, 'demo');
		
		// Get initial summary
		const initialSummary = integration.getTestDataSummary();
		console.log('Initial test data summary:', initialSummary);
		
		// Perform test operations (simulated)
		await page.goto('https://best-shot-demo.mariobrusarosco.com');
		
		// Cleanup after test
		await TestDataHelpers.performTestCleanup(config, 'demo', testInfo);
		
		// Generate test report
		const report = TestDataHelpers.generateTestDataReport(config, 'demo');
		console.log('Test Data Report:', report);
	});
});