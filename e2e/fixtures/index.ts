/**
 * Centralized exports for test data management and fixtures
 */

// Core test data management
export { TestDataManager } from './TestDataManager';
export type {
	TestDataCategories,
	TestUserData,
	NavigationTestData,
	DashboardTestData,
	TournamentTestData,
	LeagueTestData,
	TestScenarioData,
	ErrorTestData
} from './TestDataManager';

// Environment-specific fixtures
export {
	DemoEnvironmentFixtures,
	StagingEnvironmentFixtures,
	ProductionEnvironmentFixtures,
	getEnvironmentFixtures
} from './EnvironmentFixtures';

// Test data cleanup utilities
export { TestDataCleanup, CleanupUtils } from './TestDataCleanup';
export type { CleanupOperation, CleanupResult } from './TestDataCleanup';

// Test data factory for dynamic generation
export { TestDataFactory, TestDataFactoryUtils } from './TestDataFactory';

// Enhanced test fixtures
export { test, enhancedTest, retryTest, expect } from './EnhancedTestFixture';
export type { EnhancedTestFixture } from './EnhancedTestFixture';

// Legacy test data (backward compatibility)
export {
	getTestDataManager,
	getTestFixtures,
	navigationTestData,
	dashboardTestData,
	protectedRoutesTestData,
	browserTestData,
	smokeTestScenarios,
	errorTestScenarios
} from './TestData';
export type { TestUser, TestScenario, TestStep } from './TestData';

/**
 * Convenience function to initialize test data management for an environment
 */
export async function initializeTestData(environment: string = 'demo') {
	const dataManager = getTestDataManager(environment);
	const fixtures = getTestFixtures(environment);
	
	// Load test data for the environment
	await dataManager.loadTestData(environment);
	
	return {
		dataManager,
		fixtures,
		environment
	};
}

/**
 * Convenience function to get all test data for an environment
 */
export async function getAllTestData(environment: string = 'demo') {
	const { dataManager, fixtures } = await initializeTestData(environment);
	
	return {
		users: dataManager.getTestData(environment, 'users'),
		navigation: dataManager.getTestData(environment, 'navigation'),
		dashboard: dataManager.getTestData(environment, 'dashboard'),
		tournaments: dataManager.getTestData(environment, 'tournaments'),
		leagues: dataManager.getTestData(environment, 'leagues'),
		scenarios: dataManager.getTestData(environment, 'scenarios'),
		errors: dataManager.getTestData(environment, 'errors'),
		fixtures
	};
}

/**
 * Convenience function to cleanup test data after test execution
 */
export async function cleanupAfterTests(environment: string = 'demo') {
	const { dataManager } = await initializeTestData(environment);
	await dataManager.cleanupTestData(environment);
}